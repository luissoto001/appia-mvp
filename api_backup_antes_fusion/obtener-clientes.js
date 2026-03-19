import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}
