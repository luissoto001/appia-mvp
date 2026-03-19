import { supabase } from '../config/supabase.js';

async function obtenerReglas(res) {
  const { data, error } = await supabase
    .from('reglas_respuesta')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: 'Error obteniendo reglas',
      detalle: error.message
    });
  }

  return res.status(200).json({
    ok: true,
    reglas: data
  });
}

async function crearRegla(body, res) {
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
  } = body || {};

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
}

async function actualizarRegla(body, res) {
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
  } = body || {};

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
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await obtenerReglas(res);
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'crear') {
        return await crearRegla(req.body, res);
      }

      if (action === 'actualizar') {
        return await actualizarRegla(req.body, res);
      }

      return res.status(400).json({
        error: 'Acción no válida. Usa action="crear" o action="actualizar"'
      });
    }

    return res.status(405).json({
      error: 'Método no permitido'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
