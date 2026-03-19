import { supabase } from '../config/supabase.js';

async function obtenerServicios(req, res) {
  const { cliente_id } = req.query || {};

  if (!cliente_id) {
    return res.status(400).json({
      error: 'Debes indicar cliente_id'
    });
  }

  const { data, error } = await supabase
    .from('servicios')
    .select('*')
    .eq('cliente_id', Number(cliente_id))
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: 'Error obteniendo servicios',
      detalle: error.message
    });
  }

  return res.status(200).json({
    ok: true,
    servicios: data
  });
}

async function crearServicio(body, res) {
  const { cliente_id, bpi, direccion, nombre_servicio, activo } = body || {};

  if (!cliente_id || !bpi || !nombre_servicio || typeof activo !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para crear servicio'
    });
  }

  const { data, error } = await supabase
    .from('servicios')
    .insert([
      {
        cliente_id: Number(cliente_id),
        bpi,
        direccion: direccion || '',
        nombre_servicio,
        activo
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: 'Error creando servicio',
      detalle: error.message
    });
  }

  return res.status(201).json({
    ok: true,
    servicio: data,
    mensaje: 'Servicio/BPI creado correctamente'
  });
}

async function actualizarServicio(body, res) {
  const { id, nombre_servicio, direccion, activo } = body || {};

  if (!id || !nombre_servicio || typeof activo !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para actualizar servicio'
    });
  }

  const { data, error } = await supabase
    .from('servicios')
    .update({
      nombre_servicio,
      direccion: direccion || '',
      activo
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: 'Error actualizando servicio',
      detalle: error.message
    });
  }

  return res.status(200).json({
    ok: true,
    servicio: data,
    mensaje: 'Servicio actualizado correctamente'
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await obtenerServicios(req, res);
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'crear') {
        return await crearServicio(req.body, res);
      }

      if (action === 'actualizar') {
        return await actualizarServicio(req.body, res);
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
