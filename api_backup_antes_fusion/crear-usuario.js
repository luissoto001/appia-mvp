import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const {
      cliente_id,
      nombre_usuario,
      email,
      password,
      rol,
      activo
    } = req.body || {};

    if (
      !cliente_id ||
      !nombre_usuario ||
      !email ||
      !password ||
      !rol ||
      typeof activo !== 'boolean'
    ) {
      return res.status(400).json({
        error: 'Datos inválidos para crear usuario'
      });
    }

    const { data, error } = await supabase
      .from('usuarios_demo')
      .insert([
        {
          cliente_id,
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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
