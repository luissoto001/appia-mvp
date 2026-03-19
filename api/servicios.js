import { supabase } from '../config/supabase.js';

async function obtenerServicios(req, res) {
  const clienteId = Number(req.query?.cliente_id || 0);
  const q = (req.query?.q || '').trim();
  const page = Math.max(parseInt(req.query?.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query?.limit || '20', 10), 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (!clienteId) {
    return res.status(400).json({
      error: 'cliente_id es obligatorio'
    });
  }

  let query = supabase
    .from('servicios')
    .select('*', { count: 'exact' })
    .eq('cliente_id', clienteId)
    .order('id', { ascending: true });

  if (q) {
    query = query.or(`bpi.ilike.%${q}%,nombre_servicio.ilike.%${q}%,direccion.ilike.%${q}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return res.status(500).json({
      error: 'Error obteniendo servicios',
      detalle: error.message
    });
  }

  const total = count || 0;
  const total_pages = Math.max(Math.ceil(total / limit), 1);

  return res.status(200).json({
    ok: true,
    servicios: data || [],
    pagination: {
      page,
      limit,
      total,
      total_pages,
      has_prev: page > 1,
      has_next: page < total_pages
    },
    busqueda: q
  });
}

async function crearServicio(body, res) {
  const { cliente_id, bpi, nombre_servicio, direccion, activo } = body || {};

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
        nombre_servicio,
        direccion: direccion || '',
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
    mensaje: 'Servicio creado correctamente'
  });
}

async function actualizarServicio(body, res) {
  const { id, nombre_servicio, direccion, activo } = body || {};

  if (!id || !nombre_servicio || typeof activo !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para actualizar el servicio'
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