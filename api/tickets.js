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

async function obtenerClientePorRut(rutEmpresa) {
  const { data, error } = await supabase
    .from('clientes_demo')
    .select('id, nombre_empresa, rut_empresa, activo, enlistado')
    .eq('rut_empresa', rutEmpresa)
    .single();

  return { data, error };
}

async function obtenerServicioPorBpi(clienteId, bpi) {
  const { data, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('cliente_id', clienteId)
    .eq('bpi', bpi)
    .eq('activo', true)
    .single();

  return { data, error };
}

async function obtenerMensajeAutomatico(ticket) {
  const horasTranscurridas = calcularHorasTranscurridas(ticket.created_at);

  const { data: reglas, error } = await supabase
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

  if (error) {
    return {
      ok: false,
      error
    };
  }

  let mensajeFinal = 'Su ticket fue encontrado correctamente.';

  if (reglas && reglas.length > 0) {
    mensajeFinal = aplicarPlantilla(reglas[0].mensaje, ticket, horasTranscurridas);
  }

  return {
    ok: true,
    horas_transcurridas: horasTranscurridas,
    mensaje: mensajeFinal
  };
}

async function consultarPorBpi(req, res) {
  const { rut_empresa, bpi } = req.body || {};

  if (!rut_empresa || !bpi) {
    return res.status(400).json({
      error: 'Faltan datos obligatorios para consultar por BPI'
    });
  }

  const { data: cliente, error: clienteError } = await obtenerClientePorRut(rut_empresa);

  if (clienteError || !cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  if (!cliente.activo || !cliente.enlistado) {
    return res.status(403).json({
      error: 'Cliente no habilitado'
    });
  }

  const { data: servicio, error: servicioError } = await obtenerServicioPorBpi(cliente.id, bpi);

  if (servicioError || !servicio) {
    return res.status(404).json({
      error: 'Servicio no encontrado para este cliente'
    });
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
      error: 'Error consultando ticket',
      detalle: ticketError.message
    });
  }

  if (!ticket) {
    return res.status(200).json({
      ok: true,
      modo: 'bpi',
      cliente,
      servicio,
      ticket: null,
      mensaje: 'No existe ticket registrado para este servicio.'
    });
  }

  const mensajeInfo = await obtenerMensajeAutomatico(ticket);

  if (!mensajeInfo.ok) {
    return res.status(500).json({
      error: 'Error consultando reglas de respuesta',
      detalle: mensajeInfo.error.message
    });
  }

  return res.status(200).json({
    ok: true,
    modo: 'bpi',
    cliente,
    servicio,
    ticket,
    horas_transcurridas: mensajeInfo.horas_transcurridas,
    mensaje: mensajeInfo.mensaje
  });
}

async function consultarPorTicket(req, res) {
  const { rut_empresa, ticket_numero } = req.body || {};

  if (!rut_empresa || !ticket_numero) {
    return res.status(400).json({
      error: 'Faltan datos obligatorios para consultar por ticket'
    });
  }

  const { data: cliente, error: clienteError } = await obtenerClientePorRut(rut_empresa);

  if (clienteError || !cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  const { data: ticket, error: ticketError } = await supabase
    .from('tickets')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('ticket_numero', ticket_numero)
    .maybeSingle();

  if (ticketError) {
    return res.status(500).json({
      error: 'Error consultando ticket por número',
      detalle: ticketError.message
    });
  }

  if (!ticket) {
    return res.status(404).json({
      error: 'No se encontró un ticket con ese número para este cliente'
    });
  }

  const { data: servicio, error: servicioError } = await supabase
    .from('servicios')
    .select('*')
    .eq('cliente_id', cliente.id)
    .eq('bpi', ticket.bpi)
    .maybeSingle();

  if (servicioError) {
    return res.status(500).json({
      error: 'Error consultando servicio asociado al ticket',
      detalle: servicioError.message
    });
  }

  const mensajeInfo = await obtenerMensajeAutomatico(ticket);

  if (!mensajeInfo.ok) {
    return res.status(500).json({
      error: 'Error consultando reglas de respuesta',
      detalle: mensajeInfo.error.message
    });
  }

  return res.status(200).json({
    ok: true,
    modo: 'ticket',
    cliente,
    servicio,
    ticket,
    horas_transcurridas: mensajeInfo.horas_transcurridas,
    mensaje: mensajeInfo.mensaje
  });
}

async function consultarAbiertosCliente(req, res) {
  const { rut_empresa } = req.body || {};

  if (!rut_empresa) {
    return res.status(400).json({
      error: 'Falta rut_empresa para consultar tickets abiertos'
    });
  }

  const { data: cliente, error: clienteError } = await obtenerClientePorRut(rut_empresa);

  if (clienteError || !cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  const estadosAbiertos = ['Ingresado', 'En proceso', 'Derivado'];

  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .eq('cliente_id', cliente.id)
    .in('estado', estadosAbiertos)
    .order('created_at', { ascending: false });

  if (ticketsError) {
    return res.status(500).json({
      error: 'Error consultando tickets abiertos',
      detalle: ticketsError.message
    });
  }

  if (!tickets || tickets.length === 0) {
    return res.status(200).json({
      ok: true,
      modo: 'abiertos',
      cliente,
      tickets: [],
      mensaje: 'No hay tickets abiertos para este cliente.'
    });
  }

  const { data: servicios, error: serviciosError } = await supabase
    .from('servicios')
    .select('*')
    .eq('cliente_id', cliente.id);

  if (serviciosError) {
    return res.status(500).json({
      error: 'Error consultando servicios del cliente',
      detalle: serviciosError.message
    });
  }

  const serviciosPorBpi = {};
  (servicios || []).forEach((servicio) => {
    serviciosPorBpi[servicio.bpi] = servicio;
  });

  const ticketsEnriquecidos = tickets.map((ticket) => {
    const servicio = serviciosPorBpi[ticket.bpi] || null;
    return {
      ...ticket,
      servicio_nombre: servicio?.nombre_servicio || '',
      servicio_direccion: servicio?.direccion || ''
    };
  });

  return res.status(200).json({
    ok: true,
    modo: 'abiertos',
    cliente,
    tickets: ticketsEnriquecidos,
    mensaje: 'Tickets abiertos encontrados correctamente'
  });
}

async function crearTicket(req, res) {
  const { rut_empresa, bpi, tipo_solicitud, descripcion } = req.body || {};

  if (!rut_empresa || !bpi || !tipo_solicitud) {
    return res.status(400).json({
      error: 'Faltan datos obligatorios'
    });
  }

  const { data: cliente, error: clienteError } = await obtenerClientePorRut(rut_empresa);

  if (clienteError || !cliente) {
    return res.status(404).json({
      error: 'Cliente no encontrado'
    });
  }

  if (!cliente.activo || !cliente.enlistado) {
    return res.status(403).json({
      error: 'Cliente no habilitado'
    });
  }

  const { data: servicio, error: servicioError } = await obtenerServicioPorBpi(cliente.id, bpi);

  if (servicioError || !servicio) {
    return res.status(404).json({
      error: 'Servicio no encontrado para este cliente'
    });
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
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { action } = req.body || {};

    if (action === 'consultar' || action === 'consultar_por_bpi') {
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
      error: 'Error interno',
      detalle: error.message
    });
  }
}