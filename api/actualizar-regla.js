import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { id, mensaje, activo } = req.body || {};

    if (!id || typeof mensaje !== 'string' || typeof activo !== 'boolean') {
      return res.status(400).json({
        error: 'Datos inválidos para actualizar la regla'
      });
    }

    const { data, error } = await supabase
      .from('reglas_respuesta')
      .update({
        mensaje,
        activo
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error actualizando regla',
        detalle: error.message
      });
    }

    return res.status(200).json({
      ok: true,
      regla: data,
      mensaje: 'Regla actualizada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
