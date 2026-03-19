import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const {
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
        error: 'Datos inválidos para crear la regla'
      });
    }

    const { data, error } = await supabase
      .from('reglas_respuesta')
      .insert([
        {
          activo,
          canal,
          estado_ticket,
          area_resolutora,
          horas_minimas: Number(horas_minimas),
          horas_maximas: Number(horas_maximas),
          tipologia,
          prioridad: Number(prioridad),
          mensaje
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Error creando regla',
        detalle: error.message
      });
    }

    return res.status(201).json({
      ok: true,
      regla: data,
      mensaje: 'Regla creada correctamente'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
