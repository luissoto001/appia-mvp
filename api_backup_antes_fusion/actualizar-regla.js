import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const {
      id,
      activo,
      canal,
      estado_ticket,
      area_resolutora,
      horas_minimas,
      horas_maximas,
      tipologia,
      prioridad,
      mensaje
    } = req.body || {};

    if (
      !id ||
      typeof activo !== 'boolean' ||
      !canal ||
      !estado_ticket ||
      !area_resolutora ||
      horas_minimas === undefined ||
      horas_maximas === undefined ||
      !tipologia ||
      prioridad === undefined ||
      !mensaje
    ) {
      return res.status(400).json({
        error: 'Datos inválidos para actualizar la regla'
      });
    }

    const { data, error } = await supabase
      .from('reglas_respuesta')
      .update({
        activo,
        canal,
        estado_ticket,
        area_resolutora,
        horas_minimas: Number(horas_minimas),
        horas_maximas: Number(horas_maximas),
        tipologia,
        prioridad: Number(prioridad),
        mensaje
      })
      .eq('id', Number(id))
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
