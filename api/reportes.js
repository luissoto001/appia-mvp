import { supabase } from '../config/supabase.js';

function agruparPor(items, key) {
  const mapa = {};

  for (const item of items) {
    const valor = item[key] || 'Sin dato';
    mapa[valor] = (mapa[valor] || 0) + 1;
  }

  return Object.entries(mapa)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total);
}

function enriquecerTickets(tickets, clientesPorId) {
  return (tickets || []).map((ticket) => ({
    ...ticket,
    cliente_nombre: clientesPorId[ticket.cliente_id] || 'Cliente no identificado'
  }));
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { modo, filtro, valor } = req.query || {};

    const { data: tickets, error: ticketsError } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (ticketsError) {
      return res.status(500).json({
        error: 'Error obteniendo tickets',
        detalle: ticketsError.message
      });
    }

    const { data: clientes, error: clientesError } = await supabase
      .from('clientes_demo')
      .select('id, nombre_empresa');

    if (clientesError) {
      return res.status(500).json({
        error: 'Error obteniendo clientes',
        detalle: clientesError.message
      });
    }

    const clientesPorId = {};
    (clientes || []).forEach((cliente) => {
      clientesPorId[cliente.id] = cliente.nombre_empresa;
    });

    const ticketsConCliente = enriquecerTickets(tickets, clientesPorId);
    const abiertosEstados = ['Ingresado', 'En proceso', 'Derivado'];

    if (modo === 'detalle') {
      let filtrados = [...ticketsConCliente];

      if (filtro === 'abiertos') {
        filtrados = filtrados.filter((t) => abiertosEstados.includes(t.estado));
      } else if (filtro === 'cerrados') {
        filtrados = filtrados.filter((t) => !abiertosEstados.includes(t.estado));
      } else if (filtro === 'estado' && valor) {
        filtrados = filtrados.filter((t) => t.estado === valor);
      } else if (filtro === 'tipologia' && valor) {
        filtrados = filtrados.filter((t) => t.tipologia === valor);
      } else if (filtro === 'cliente' && valor) {
        filtrados = filtrados.filter((t) => t.cliente_nombre === valor);
      } else if (filtro === 'todos') {
        filtrados = [...ticketsConCliente];
      }

      return res.status(200).json({
        ok: true,
        tickets: filtrados
      });
    }

    const totalTickets = ticketsConCliente.length;
    const abiertos = ticketsConCliente.filter((t) => abiertosEstados.includes(t.estado)).length;
    const cerrados = totalTickets - abiertos;

    const porEstado = agruparPor(ticketsConCliente, 'estado');
    const porTipologia = agruparPor(ticketsConCliente, 'tipologia');
    const porCliente = agruparPor(ticketsConCliente, 'cliente_nombre');

    const recientes = ticketsConCliente.slice(0, 5).map((ticket) => ({
      ticket_numero: ticket.ticket_numero,
      estado: ticket.estado,
      tipologia: ticket.tipologia,
      bpi: ticket.bpi,
      cliente_nombre: ticket.cliente_nombre,
      created_at: ticket.created_at
    }));

    const clientesConTickets = new Set(ticketsConCliente.map((t) => t.cliente_id)).size;

    return res.status(200).json({
      ok: true,
      resumen: {
        total_tickets: totalTickets,
        abiertos,
        cerrados,
        clientes_con_tickets: clientesConTickets
      },
      por_estado: porEstado,
      por_tipologia: porTipologia,
      por_cliente: porCliente,
      recientes
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}