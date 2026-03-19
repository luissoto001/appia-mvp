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

async function enriquecerTickets(tickets) {
  if (!tickets || tickets.length === 0) {
    return [];
  }

  const clienteIds = [...new Set(tickets.map((t) => t.cliente_id).filter(Boolean))];

  let clientesMap = {};
  if (clienteIds.length > 0) {
    const { data: clientesData } = await supabase
      .from('clientes_demo')
      .select('id, nombre_empresa')
      .in('id', clienteIds);

    clientesMap = Object.fromEntries((clientesData || []).map((c) => [c.id, c.nombre_empresa]));
  }

  return tickets.map((ticket) => ({
    ...ticket,
    cliente_nombre: clientesMap[ticket.cliente_id] || `Cliente ${ticket.cliente_id || ''}`
  }));
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
      let query = supabase
        .from('tickets_demo')
        .select('*')
        .order('created_at', { ascending: false });

      query = aplicarFiltros(query, filtros);

      if (filtro === 'estado' && valor) {
        query = query.eq('estado', valor);
      }

      if (filtro === 'tipologia' && valor) {
        query = query.eq('tipologia', valor);
      }

      if (filtro === 'cliente' && valor) {
        query = query.eq('cliente_id', Number(valor));
      }

      if (filtro === 'abiertos') {
        query = query.neq('estado', 'Cerrado');
      }

      if (filtro === 'cerrados') {
        query = query.eq('estado', 'Cerrado');
      }

      const { data, error } = await query.limit(200);

      if (error) {
        return res.status(500).json({
          error: 'Error obteniendo detalle de tickets',
          detalle: error.message
        });
      }

      const ticketsEnriquecidos = await enriquecerTickets(data || []);

      return res.status(200).json({
        ok: true,
        tickets: ticketsEnriquecidos
      });
    }

    let query = supabase
      .from('tickets_demo')
      .select('*')
      .order('created_at', { ascending: false });

    query = aplicarFiltros(query, filtros);

    const { data: tickets, error } = await query;

    if (error) {
      return res.status(500).json({
        error: 'Error obteniendo reportes',
        detalle: error.message
      });
    }

    const ticketsEnriquecidos = await enriquecerTickets(tickets || []);
    const total = ticketsEnriquecidos.length;
    const abiertos = ticketsEnriquecidos.filter((t) => t.estado !== 'Cerrado').length;
    const cerrados = ticketsEnriquecidos.filter((t) => t.estado === 'Cerrado').length;
    const clientesConTickets = new Set(
      ticketsEnriquecidos.map((t) => t.cliente_id).filter(Boolean)
    ).size;

    const agrupar = (items, campo, etiquetaFn = null) => {
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
        .map(([nombre, totalGrupo]) => ({
          nombre,
          total: totalGrupo
        }))
        .sort((a, b) => b.total - a.total);
    };

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