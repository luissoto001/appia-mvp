import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { id, activo, enlistado } = req.body || {};

    if (!id || typeof activo !== 'boolean' || typeof enlistado !== 'boolean') {
      return res.status(400).json({
        error: 'Datos inválidos para actualizar el cliente'
      });
    }

    const { data, error } = await supabase
      .from('clientes_demo')
      .update({
        activo,
        enlistado
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error actualizando cliente',
        detalle: error.message
      });
    }

    return res.status(200).json({
      ok: true,
      cliente: data,
      mensaje: 'Cliente actualizado correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
