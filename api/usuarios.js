import { supabase } from '../config/supabase.js';

async function obtenerUsuarios(req, res) {
  const q = (req.query?.q || '').trim();
  const page = Math.max(parseInt(req.query?.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query?.limit || '20', 10), 1), 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('usuarios_demo')
    .select('*', { count: 'exact' })
    .order('id', { ascending: true });

  if (q) {
    query = query.or(`nombre_usuario.ilike.%${q}%,email.ilike.%${q}%,rol.ilike.%${q}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return res.status(500).json({
      error: 'Error obteniendo usuarios',
      detalle: error.message
    });
  }

  const usuariosSanitizados = (data || []).map((usuario) => ({
    ...usuario,
    password: ''
  }));

  const total = count || 0;
  const total_pages = Math.max(Math.ceil(total / limit), 1);

  return res.status(200).json({
    ok: true,
    usuarios: usuariosSanitizados,
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
    usuario: {
      ...data,
      password: ''
    },
    mensaje: 'Usuario creado correctamente'
  });
}

async function actualizarUsuario(body, res) {
  const { id, password, activo } = body || {};

  if (!id || typeof activo !== 'boolean') {
    return res.status(400).json({
      error: 'Datos inválidos para actualizar el usuario'
    });
  }

  const payload = {
    activo
  };

  if (typeof password === 'string' && password.trim() !== '') {
    payload.password = password.trim();
  }

  const { data, error } = await supabase
    .from('usuarios_demo')
    .update(payload)
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
    usuario: {
      ...data,
      password: ''
    },
    mensaje: 'Usuario actualizado correctamente'
  });
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await obtenerUsuarios(req, res);
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