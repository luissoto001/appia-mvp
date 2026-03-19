import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { nombre_empresa, rut_empresa, activo, enlistado } = req.body || {};

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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
