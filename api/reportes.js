import { supabase } from '../config/supabase.js';

function aplicarFiltros(query, filtros) {
  if (filtros.fecha_desde) {
    query = query.gte('created_at', `${filtros.fecha_desde}T00:00:00`);
  }

  if (filtros.fecha_hasta) {
    query = query.lte('created_at', `${filtros.fecha_hasta}T23:59:59`);
  }

  if (filtros.cliente_id) {
    query = query.eq('cliente_id', Number(filtros.cliente_id));
  }

  if (filtros.estado) {
    query = query.eq('estado', filtros.estado);
  }

  return query;
}

async function obtenerTicketsConFallback(filtros = {}, opciones = {}) {
  const tablas = ['tickets_demo', 'tickets'];
  let ultimoError = null;

  for (const tabla of tablas) {
    let query = supabase
      .from(tabla)
      .select('*')
      .order('created_at', { ascending: false });

    query = aplicarFiltros(query, filtros);

    if (opciones.modo === 'detalle') {
      if (opciones.filtro === 'estado' && opciones.valor) {
        query = query.eq('estado', opciones.valor);
      }

      if (opciones.filtro === 'tipologia' && opciones.valor) {
        query = query.eq('tipologia', opciones.valor);
      }

      if (opciones.filtro === 'cliente' && opciones.valor) {
        const numeroCliente = Number(opciones.valor);
        if (!Number.isNaN(numeroCliente)) {
          query = query.eq('cliente_id', numeroCliente);
        }
      }

      if (opciones.filtro === 'abiertos') {
        query = query.neq('estado', 'Cerrado');
      }

      if (opciones.filtro === 'cerrados') {
        query = query.eq('estado', 'Cerrado');
      }

      query = query.limit(200);
    }

    const { data, error } = await query;

    if (!error) {
      return {
        ok: true,
        tabla,
        data: data || []
      };
    }

    ultimoError = error;
  }

  return {
    ok: false,
    error: ultimoError
  };
}

async function obtenerClientesMap(clienteIds) {
  if (!clienteIds || clienteIds.length === 0) {
    return {};
  }

  const tablas = ['clientes_demo', 'clientes'];
  let ultimoError = null;

  for (const tabla of tablas) {
    const { data, error } = await supabase
      .from(tabla)
      .select('id, nombre_empresa')
      .in('id', clienteIds);

    if (!error) {
      return Object.fromEntries((data || []).map((c) => [c.id, c.nombre_empresa]));
    }

    ultimoError = error;
  }

  console.error('No se pudieron obtener clientes para enriquecer reportería:', ultimoError?.message);
  return {};
}

async function enriquecerTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    return [];
  }

  const clienteIds = [...new Set(tickets.map((t) => t.cliente_id).filter(Boolean))];
  const clientesMap = await obtenerClientesMap(clienteIds);

  return tickets.map((ticket) => ({
    ...ticket,
    cliente_nombre: clientesMap[ticket.cliente_id] || `Cliente ${ticket.cliente_id || ''}`
  }));
}

function agrupar(items, campo, etiquetaFn = null) {
  const mapa = {};

  items.forEach((item) => {
    const clave = item[campo] ?? 'Sin dato';
    const nombre = etiquetaFn ? etiquetaFn(item, clave) : String(clave);

    if (!mapa[nombre]) {
      mapa[nombre] = 0;
    }

    mapa[nombre] += 1;
  });

  return Object.entries(mapa)
    .map(([nombre, total]) => ({
      nombre,
      total
    }))
    .sort((a, b) => b.total - a.total);
}

export default async function handler(req, res) {
  try {
    const {
      modo,
      filtro,
      valor,
      fecha_desde,
      fecha_hasta,
      cliente_id,
      estado
    } = req.query;

    const filtros = {
      fecha_desde: fecha_desde || '',
      fecha_hasta: fecha_hasta || '',
      cliente_id: cliente_id || '',
      estado: estado || ''
    };

    if (modo === 'detalle') {
      const resultado = await obtenerTicketsConFallback(filtros, {
        modo: 'detalle',
        filtro,
        valor
      });

      if (!resultado.ok) {
        return res.status(500).json({
          error: 'Error obteniendo detalle de reportes',
          detalle: resultado.error?.message || 'No fue posible consultar tickets'
        });
      }

      const ticketsEnriquecidos = await enriquecerTickets(resultado.data);

      return res.status(200).json({
        ok: true,
        tickets: ticketsEnriquecidos
      });
    }

    const resultado = await obtenerTicketsConFallback(filtros);

    if (!resultado.ok) {
      return res.status(500).json({
        error: 'Error obteniendo reportes',
        detalle: resultado.error?.message || 'No fue posible consultar tickets'
      });
    }

    const ticketsEnriquecidos = await enriquecerTickets(resultado.data);
    const total = ticketsEnriquecidos.length;
    const abiertos = ticketsEnriquecidos.filter((t) => t.estado !== 'Cerrado').length;
    const cerrados = ticketsEnriquecidos.filter((t) => t.estado === 'Cerrado').length;
    const clientesConTickets = new Set(
      ticketsEnriquecidos.map((t) => t.cliente_id).filter(Boolean)
    ).size;

    const por_estado = agrupar(ticketsEnriquecidos, 'estado');
    const por_tipologia = agrupar(ticketsEnriquecidos, 'tipologia');
    const por_cliente = agrupar(
      ticketsEnriquecidos,
      'cliente_id',
      (item) => item.cliente_nombre || `Cliente ${item.cliente_id || ''}`
    );

    const recientes = [...ticketsEnriquecidos]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    return res.status(200).json({
      ok: true,
      resumen: {
        total_tickets: total,
        abiertos,
        cerrados,
        clientes_con_tickets: clientesConTickets
      },
      por_estado,
      por_tipologia,
      por_cliente,
      recientes
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno en reportes',
      detalle: error.message
    });
  }
}