import { supabase } from '../config/supabase.js';

function validarRut(rut) {
  return /^\d{7,8}-[\dkK]$/i.test(String(rut || '').trim());
}

function validarBpi(bpi) {
  return /^BPI[0-9A-Za-z]+$/.test(String(bpi || '').trim());
}

function generarTicketNumero() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const aleatorio = Math.floor(Math.random() * 900 + 100);
  return `TK-${y}${m}${d}-${h}${min}${s}-${aleatorio}`;
}

async function obtenerTablaClientes() {
  const tablas = ['clientes_demo', 'clientes'];
  for (const tabla of tablas) {
    const { error } = await supabase.from(tabla).select('id').limit(1);
    if (!error) return tabla;
  }
  return 'clientes_demo';
}

async function obtenerTablaServicios() {
  const tablas = ['servicios', 'servicios_demo'];
  for (const tabla of tablas) {
    const { error } = await supabase.from(tabla).select('id').limit(1);
    if (!error) return tabla;
  }
  return 'servicios';
}

async function obtenerTablaTickets() {
  const tablas = ['tickets_demo', 'tickets'];
  for (const tabla of tablas) {
    const { error } = await supabase.from(tabla).select('id').limit(1);
    if (!error) return tabla;
  }
  return 'tickets_demo';
}

async function obtenerTablaHistorial() {
  const tablas = ['tickets_historial_demo', 'tickets_historial'];
  for (const tabla of tablas) {
    const { error } = await supabase.from(tabla).select('id').limit(1);
    if (!error) return tabla;
  }
  return null;
}

async function buscarClientePorRut(rutEmpresa) {
  const tablaClientes = await obtenerTablaClientes();

  const { data, error } = await supabase
    .from(tablaClientes)
    .select('*')
    .eq('rut_empresa', rutEmpresa)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Error buscando cliente: ${error.message}`);
  }

  return data;
}

async function buscarServicioPorBpiCliente(clienteId, bpi) {
  const tablaServicios = await obtenerTablaServicios();

  const { data, error } = await supabase
    .from(tablaServicios)
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('bpi', bpi)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Error buscando servicio: ${error.message}`);
  }

  return data;
}

async function obtenerHistorialReal(ticket) {
  const tablaHistorial = await obtenerTablaHistorial();
  if (!tablaHistorial || !ticket) return [];

  let query = supabase
    .from(tablaHistorial)
    .select('*')
    .order('created_at', { ascending: true });

  if (ticket.id) {
    query = query.eq('ticket_id', ticket.id);
  } else {
    query = query.eq('ticket_numero', ticket.ticket_numero);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error obteniendo historial real:', error.message);
    return [];
  }

  return data || [];
}

function construirHistorialFallback(ticket) {
  if (!ticket) return [];

  const inicio = new Date(ticket.created_at);
  const eventos = [
    {
      titulo_evento: 'Ticket creado',
      detalle_evento: `Ticket ${ticket.ticket_numero} ingresado`,
      estado: 'Ingresado',
      created_at: inicio.toISOString()
    }
  ];

  const asignado = new Date(inicio.getTime() + 20 * 60000);
  eventos.push({
    titulo_evento: 'Asignado a especialistas',
    detalle_evento: `Grupo resolutor: ${ticket.area_resolutora || 'No informado'}`,
    estado: ticket.estado === 'Ingresado' ? 'Ingresado' : 'En proceso',
    created_at: asignado.toISOString()
  });

  const analisis = new Date(inicio.getTime() + 90 * 60000);
  eventos.push({
    titulo_evento: 'En análisis',
    detalle_evento: `Tipología: ${ticket.tipologia || 'No informada'}`,
    estado: ticket.estado === 'Ingresado' ? 'Ingresado' : 'En proceso',
    created_at: analisis.toISOString()
  });

  if (ticket.estado === 'Derivado') {
    const derivado = new Date(inicio.getTime() + 150 * 60000);
    eventos.push({
      titulo_evento: 'Ticket derivado',
      detalle_evento: 'Escalado a nueva célula de atención',
      estado: 'Derivado',
      created_at: derivado.toISOString()
    });
  }

  if (ticket.estado === 'Resuelto' || ticket.estado === 'Cerrado') {
    const cierre = new Date(inicio.getTime() + 240 * 60000);
    eventos.push({
      titulo_evento: ticket.estado === 'Cerrado' ? 'Ticket cerrado' : 'Ticket resuelto',
      detalle_evento: `Estado final: ${ticket.estado}`,
      estado: ticket.estado,
      created_at: cierre.toISOString()
    });
  }

  return eventos;
}

async function obtenerHistorialTicket(ticket) {
  const real = await obtenerHistorialReal(ticket);
  if (real.length > 0) return real;
  return construirHistorialFallback(ticket);
}

async function registrarEventoHistorial(ticket, payload = {}) {
  const tablaHistorial = await obtenerTablaHistorial();
  if (!tablaHistorial || !ticket) return;

  const body = {
    ticket_id: ticket.id || null,
    ticket_numero: ticket.ticket_numero,
    estado: payload.estado || ticket.estado || 'Ingresado',
    titulo_evento: payload.titulo_evento || 'Actualización',
    detalle_evento: payload.detalle_evento || '',
    usuario_email: payload.usuario_email || null
  };

  const { error } = await supabase.from(tablaHistorial).insert([body]);
  if (error) {
    console.error('No se pudo registrar historial:', error.message);
  }
}

async function consultarPorBpi(req, res) {
  const { rut_empresa, bpi } = req.body || {};

  if (!validarRut(rut_empresa)) {
    return res.status(400).json({
      error: 'RUT inválido'
    });
  }

  if (!validarBpi(bpi)) {
    return res.status(400).json({
      error: 'BPI inválido'
    });
  }

  const cliente = await buscarClientePorRut(rut_empresa);
  if (!cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  const servicio = await buscarServicioPorBpiCliente(cliente.id, bpi);
  if (!servicio) {
    return res.status(404).json({
      error: 'Servicio/BPI no encontrado para este cliente'
    });
  }

  const tablaTickets = await obtenerTablaTickets();
  const { data: ticket, error } = await supabase
    .from(tablaTickets)
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', bpi)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      error: 'Error consultando ticket',
      detalle: error.message
    });
  }

  if (!ticket) {
    return res.status(200).json({
      ok: true,
      cliente,
      servicio,
      mensaje: 'No existen tickets asociados a este BPI',
      ticket: null,
      historial: []
    });
  }

  const historial = await obtenerHistorialTicket(ticket);

  return res.status(200).json({
    ok: true,
    cliente,
    servicio,
    ticket,
    historial,
    horas_transcurridas: Math.max(
      0,
      Math.round((Date.now() - new Date(ticket.created_at).getTime()) / 3600000)
    ),
    mensaje: ticket.mensaje_automatico || 'Consulta realizada correctamente'
  });
}

async function consultarPorTicket(req, res) {
  const { rut_empresa, ticket_numero } = req.body || {};

  if (!validarRut(rut_empresa)) {
    return res.status(400).json({
      error: 'RUT inválido'
    });
  }

  if (!ticket_numero || String(ticket_numero).trim() === '') {
    return res.status(400).json({
      error: 'Debes indicar un número de ticket'
    });
  }

  const cliente = await buscarClientePorRut(rut_empresa);
  if (!cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  const tablaTickets = await obtenerTablaTickets();
  const { data: ticket, error } = await supabase
    .from(tablaTickets)
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('ticket_numero', ticket_numero.trim())
    .limit(1)
    .maybeSingle();

  if (error) {
    return res.status(500).json({
      error: 'Error consultando ticket por número',
      detalle: error.message
    });
  }

  if (!ticket) {
    return res.status(404).json({
      error: 'Ticket no encontrado para este cliente'
    });
  }

  let servicio = null;
  if (ticket.bpi) {
    servicio = await buscarServicioPorBpiCliente(cliente.id, ticket.bpi);
  }

  const historial = await obtenerHistorialTicket(ticket);

  return res.status(200).json({
    ok: true,
    cliente,
    servicio,
    ticket,
    historial,
    horas_transcurridas: Math.max(
      0,
      Math.round((Date.now() - new Date(ticket.created_at).getTime()) / 3600000)
    ),
    mensaje: ticket.mensaje_automatico || 'Consulta realizada correctamente'
  });
}

async function consultarAbiertosCliente(req, res) {
  const { rut_empresa } = req.body || {};

  if (!validarRut(rut_empresa)) {
    return res.status(400).json({
      error: 'RUT inválido'
    });
  }

  const cliente = await buscarClientePorRut(rut_empresa);
  if (!cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  const tablaTickets = await obtenerTablaTickets();
  const { data: tickets, error } = await supabase
    .from(tablaTickets)
    .select('*')
    .eq('cliente_id', cliente.id)
    .neq('estado', 'Cerrado')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({
      error: 'Error consultando tickets abiertos',
      detalle: error.message
    });
  }

  const tablaServicios = await obtenerTablaServicios();
  const bpis = [...new Set((tickets || []).map((t) => t.bpi).filter(Boolean))];

  let serviciosMap = {};
  if (bpis.length > 0) {
    const { data: serviciosData } = await supabase
      .from(tablaServicios)
      .select('*')
      .eq('cliente_id', cliente.id)
      .in('bpi', bpis);

    serviciosMap = Object.fromEntries((serviciosData || []).map((s) => [s.bpi, s]));
  }

  const ticketsEnriquecidos = (tickets || []).map((ticket) => {
    const servicio = serviciosMap[ticket.bpi] || null;
    return {
      ...ticket,
      servicio_nombre: servicio?.nombre_servicio || '',
      servicio_direccion: servicio?.direccion || ''
    };
  });

  return res.status(200).json({
    ok: true,
    cliente,
    tickets: ticketsEnriquecidos,
    mensaje: ticketsEnriquecidos.length > 0
      ? 'Tickets abiertos encontrados'
      : 'No existen tickets abiertos para este cliente'
  });
}

async function obtenerReglaParaTicket(tipoSolicitud, horas = 0) {
  const tablas = ['reglas_demo', 'reglas'];
  for (const tabla of tablas) {
    const { data, error } = await supabase
      .from(tabla)
      .select('*')
      .eq('activo', true)
      .eq('canal', 'web')
      .eq('tipologia', tipoSolicitud)
      .lte('horas_minimas', horas)
      .gte('horas_maximas', horas)
      .order('prioridad', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!error && data) return data;
  }
  return null;
}

async function crearTicket(req, res) {
  const {
    rut_empresa,
    bpi,
    tipo_solicitud,
    descripcion
  } = req.body || {};

  if (!validarRut(rut_empresa)) {
    return res.status(400).json({
      error: 'RUT inválido'
    });
  }

  if (!validarBpi(bpi)) {
    return res.status(400).json({
      error: 'BPI inválido'
    });
  }

  if (!tipo_solicitud) {
    return res.status(400).json({
      error: 'Debes indicar el tipo de solicitud'
    });
  }

  const cliente = await buscarClientePorRut(rut_empresa);
  if (!cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  const servicio = await buscarServicioPorBpiCliente(cliente.id, bpi);
  if (!servicio) {
    return res.status(404).json({
      error: 'Servicio/BPI no encontrado para este cliente'
    });
  }

  const tablaTickets = await obtenerTablaTickets();

  const { data: ticketExistente, error: errorExistente } = await supabase
    .from(tablaTickets)
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', bpi)
    .neq('estado', 'Cerrado')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (errorExistente) {
    return res.status(500).json({
      error: 'Error validando ticket existente',
      detalle: errorExistente.message
    });
  }

  if (ticketExistente) {
    return res.status(409).json({
      error: 'Ya existe un ticket abierto para este BPI',
      mensaje: 'No se puede crear un nuevo ticket mientras exista uno abierto',
      ticket_existente: ticketExistente
    });
  }

  const regla = await obtenerReglaParaTicket(tipo_solicitud, 0);

  const nuevoTicket = {
    ticket_numero: generarTicketNumero(),
    cliente_id: cliente.id,
    bpi,
    estado: 'Ingresado',
    tipologia: tipo_solicitud,
    descripcion: descripcion || '',
    area_resolutora: regla?.area_resolutora || 'Mesa de Ayuda',
    mensaje_automatico: regla?.mensaje || 'Ticket creado correctamente'
  };

  const { data: ticketCreado, error } = await supabase
    .from(tablaTickets)
    .insert([nuevoTicket])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: 'Error creando ticket',
      detalle: error.message
    });
  }

  await registrarEventoHistorial(ticketCreado, {
    estado: 'Ingresado',
    titulo_evento: 'Ticket creado',
    detalle_evento: `Ticket creado desde portal cliente para BPI ${bpi}`
  });

  const historial = await obtenerHistorialTicket(ticketCreado);

  return res.status(201).json({
    ok: true,
    cliente,
    servicio,
    ticket: ticketCreado,
    historial,
    mensaje: ticketCreado.mensaje_automatico || 'Ticket creado correctamente'
  });
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const action = req.body?.action;

    if (action === 'consultar_por_bpi') {
      return await consultarPorBpi(req, res);
    }

    if (action === 'consultar_por_ticket') {
      return await consultarPorTicket(req, res);
    }

    if (action === 'consultar_abiertos_cliente') {
      return await consultarAbiertosCliente(req, res);
    }

    if (action === 'crear') {
      return await crearTicket(req, res);
    }

    return res.status(400).json({
      error: 'Acción no válida'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno en tickets',
      detalle: error.message
    });
  }
}