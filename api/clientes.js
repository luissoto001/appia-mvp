import { supabase } from '../config/supabase.js';

async function obtenerClientes(res) {
  const { data, error } = await supabase
    .from('clientes_demo')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: 'Error obteniendo clientes',
      detalle: error.message
    });
  }

  return res.status(200).json({
    ok: true,
    clientes: data
  });
}

async function crearCliente(body, res) {
  const { nombre_empresa, rut_empresa, activo, enlistado } = body || {};

  if (!nombre_empresa || !rut_empresa || typeof activo !== 'boolean' || typeof enlistado !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para crear cliente'
    });
  }

  const { data, error } = await supabase
    .from('clientes_demo')
    .insert([
      {
        nombre_empresa,
        rut_empresa,
        activo,
        enlistado
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: 'Error creando cliente',
      detalle: error.message
    });
  }

  return res.status(201).json({
    ok: true,
    cliente: data,
    mensaje: 'Cliente creado correctamente'
  });
}

async function actualizarCliente(body, res) {
  const { id, activo, enlistado } = body || {};

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
    .eq('id', Number(id))
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
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await obtenerClientes(res);
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'crear') {
        return await crearCliente(req.body, res);
      }

      if (action === 'actualizar') {
        return await actualizarCliente(req.body, res);
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
