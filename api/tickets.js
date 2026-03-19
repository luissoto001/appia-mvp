import { supabase } from '../config/supabase.js';

function calcularHorasTranscurridas(fechaCreacion) {
  const inicio = new Date(fechaCreacion).getTime();
  const ahora = new Date().getTime();
  const diferenciaMs = ahora - inicio;
  return Math.floor(diferenciaMs / (1000 * 60 * 60));
}

function aplicarPlantilla(mensaje, ticket, horasTranscurridas) {
  return mensaje
    .replaceAll('{{ticket_numero}}', ticket.ticket_numero || '')
    .replaceAll('{{area_resolutora}}', ticket.area_resolutora || '')
    .replaceAll('{{horas_transcurridas}}', String(horasTranscurridas));
}

function generarTicketNumero() {
  const numero = Math.floor(10000 + Math.random() * 90000);
  return `TK-${numero}`;
}

async function consultarTicket(req, res) {
  const { rut_empresa, bpi } = req.body || {};

  if (!rut_empresa || !bpi) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes_demo')
    .select('id, nombre_empresa, rut_empresa, activo, enlistado')
    .eq('rut_empresa', rut_empresa)
    .single();

  if (clienteError || !cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  if (!cliente.activo || !cliente.enlistado) {
    return res.status(403).json({ error: 'Cliente no habilitado' });
  }

  const { data: servicio, error: servicioError } = await supabase
    .from('servicios')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', bpi)
    .eq('activo', true)
    .single();

  if (servicioError || !servicio) {
    return res.status(404).json({ error: 'Servicio no encontrado para este cliente' });
  }

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', bpi)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ticketError) {
    return res.status(500).json({
      error: 'Error consultando ticket en Supabase',
      detalle: ticketError.message
    });
  }

  if (!ticket) {
    return res.status(200).json({
      ok: true,
      cliente,
      servicio,
      ticket: null,
      mensaje: 'No existe ticket registrado para este servicio.'
    });
  }

  const horasTranscurridas = calcularHorasTranscurridas(ticket.created_at);

  const { data: reglas, error: reglasError } = await supabase
    .from('reglas_respuesta')
    .select('*')
    .eq('activo', true)
    .eq('canal', 'web')
    .eq('estado_ticket', ticket.estado)
    .eq('area_resolutora', ticket.area_resolutora)
    .eq('tipologia', ticket.tipologia)
    .lte('horas_minimas', horasTranscurridas)
    .gte('horas_maximas', horasTranscurridas)
    .order('prioridad', { ascending: true });

  if (reglasError) {
    return res.status(500).json({
      error: 'Error consultando reglas de respuesta',
      detalle: reglasError.message
    });
  }

  let mensajeFinal = 'Su ticket fue encontrado correctamente.';

  if (reglas && reglas.length > 0) {
    mensajeFinal = aplicarPlantilla(reglas[0].mensaje, ticket, horasTranscurridas);
  }

  return res.status(200).json({
    ok: true,
    cliente,
    servicio,
    ticket,
    horas_transcurridas: horasTranscurridas,
    mensaje: mensajeFinal
  });
}

async function crearTicket(req, res) {
  const { rut_empresa, bpi, tipo_solicitud, descripcion } = req.body || {};

  if (!rut_empresa || !bpi || !tipo_solicitud) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const { data: cliente, error: clienteError } = await supabase
    .from('clientes_demo')
    .select('id, nombre_empresa, rut_empresa, activo, enlistado')
    .eq('rut_empresa', rut_empresa)
    .single();

  if (clienteError || !cliente) {
    return res.status(404).json({ error: 'Cliente no encontrado' });
  }

  if (!cliente.activo || !cliente.enlistado) {
    return res.status(403).json({ error: 'Cliente no habilitado' });
  }

  const { data: servicio, error: servicioError } = await supabase
    .from('servicios')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', bpi)
    .eq('activo', true)
    .single();

  if (servicioError || !servicio) {
    return res.status(404).json({ error: 'Servicio no encontrado para este cliente' });
  }

  const { data: ticketExistente, error: ticketExistenteError } = await supabase
    .from('tickets')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', bpi)
    .in('estado', ['Ingresado', 'En proceso', 'Derivado'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ticketExistenteError) {
    return res.status(500).json({
      error: 'Error validando ticket existente',
      detalle: ticketExistenteError.message
    });
  }

  if (ticketExistente) {
    return res.status(409).json({
      error: 'Ya existe un ticket abierto para este servicio',
      cliente,
      servicio,
      ticket_existente: ticketExistente,
      mensaje: `Ya existe un ticket abierto para este servicio: ${ticketExistente.ticket_numero}`
    });
  }

  let tipologia = 'General';
  let area_resolutora = 'Soporte Técnico';

  if (tipo_solicitud === 'Falla Técnica') {
    tipologia = 'Falla crítica';
    area_resolutora = 'Soporte Técnico';
  }

  if (tipo_solicitud === 'Requerimiento') {
    tipologia = 'Requerimiento';
    area_resolutora = 'Mesa de Servicio';
  }

  const ticket_numero = generarTicketNumero();

  const { data: nuevoTicket, error: crearTicketError } = await supabase
    .from('tickets')
    .insert([
      {
        ticket_numero,
        cliente_id: cliente.id,
        bpi,
        tipo_solicitud,
        descripcion: descripcion || '',
        estado: 'Ingresado',
        area_resolutora,
        tipologia,
        fecha_estimada: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
    ])
    .select()
    .single();

  if (crearTicketError) {
    return res.status(500).json({
      error: 'Error creando ticket en Supabase',
      detalle: crearTicketError.message
    });
  }

  return res.status(201).json({
    ok: true,
    cliente,
    servicio,
    ticket: nuevoTicket,
    mensaje: 'Ticket creado correctamente'
  });
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const { action } = req.body || {};

    if (action === 'consultar') {
      return await consultarTicket(req, res);
    }

    if (action === 'crear') {
      return await crearTicket(req, res);
    }

    return res.status(400).json({
      error: 'Acción no válida. Usa action="consultar" o action="crear"'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
