import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { id, password, activo } = req.body || {};

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
      .eq('id', id)
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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
