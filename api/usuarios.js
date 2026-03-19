import { supabase } from '../config/supabase.js';

async function obtenerUsuarios(res) {
  const { data, error } = await supabase
    .from('usuarios_demo')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: 'Error obteniendo usuarios',
      detalle: error.message
    });
  }

  return res.status(200).json({
    ok: true,
    usuarios: data
  });
}

async function crearUsuario(body, res) {
  const { cliente_id, nombre_usuario, email, password, rol, activo } = body || {};

  if (!cliente_id || !nombre_usuario || !email || !password || !rol || typeof activo !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para crear usuario'
    });
  }

  const { data, error } = await supabase
    .from('usuarios_demo')
    .insert([
      {
        cliente_id: Number(cliente_id),
        nombre_usuario,
        email,
        password,
        rol,
        activo
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: 'Error creando usuario',
      detalle: error.message
    });
  }

  return res.status(201).json({
    ok: true,
    usuario: data,
    mensaje: 'Usuario creado correctamente'
  });
}

async function actualizarUsuario(body, res) {
  const { id, password, activo } = body || {};

  if (!id || typeof password !== 'string' || typeof activo !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para actualizar el usuario'
    });
  }

  const { data, error } = await supabase
    .from('usuarios_demo')
    .update({
      password,
      activo
    })
    .eq('id', Number(id))
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: 'Error actualizando usuario',
      detalle: error.message
    });
  }

  return res.status(200).json({
    ok: true,
    usuario: data,
    mensaje: 'Usuario actualizado correctamente'
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await obtenerUsuarios(res);
    }

    if (req.method === 'POST') {
      const { action } = req.body || {};

      if (action === 'crear') {
        return await crearUsuario(req.body, res);
      }

      if (action === 'actualizar') {
        return await actualizarUsuario(req.body, res);
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
