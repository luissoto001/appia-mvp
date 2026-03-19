import { supabase } from '../config/supabase.js';

function generarTicketNumero() {
  const numero = Math.floor(10000 + Math.random() * 90000);
  return `TK-${numero}`;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const {
      rut_empresa,
      bpi,
      tipo_solicitud,
      descripcion
    } = req.body || {};

    if (!rut_empresa || !bpi || !tipo_solicitud) {
      return res.status(400).json({
        error: 'Faltan datos obligatorios'
      });
    }

    const { data: cliente, error: clienteError } = await supabase
      .from('clientes_demo')
      .select('id, nombre_empresa, rut_empresa, activo, enlistado')
      .eq('rut_empresa', rut_empresa)
      .single();

    if (clienteError) {
      return res.status(500).json({
        error: 'Error consultando cliente en Supabase',
        detalle: clienteError.message
      });
    }

    if (!cliente) {
      return res.status(404).json({
        error: 'Cliente no encontrado'
      });
    }

    if (!cliente.activo || !cliente.enlistado) {
      return res.status(403).json({
        error: 'Cliente no habilitado'
      });
    }

    const { data: servicio, error: servicioError } = await supabase
      .from('servicios')
      .select('*')
      .eq('cliente_id', cliente.id)
      .eq('bpi', bpi)
      .eq('activo', true)
      .single();

    if (servicioError) {
      return res.status(500).json({
        error: 'Error consultando servicio en Supabase',
        detalle: servicioError.message
      });
    }

    if (!servicio) {
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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}