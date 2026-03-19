import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { rut_empresa, bpi } = req.body || {};

    if (!rut_empresa || !bpi) {
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

    return res.status(200).json({
      ok: true,
      cliente,
      servicio,
      ticket,
      mensaje: ticket
        ? 'Cliente, servicio y ticket encontrados correctamente'
        : 'Cliente y servicio encontrados, pero no existe ticket para este BPI'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}