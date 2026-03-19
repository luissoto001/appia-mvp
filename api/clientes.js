import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { search = '', page = 1, limit = 20 } = req.query;

      const from = (page - 1) * limit;
      const to = from + Number(limit) - 1;

      let query = supabase
        .from('clientes')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(
          `nombre_empresa.ilike.%${search}%,rut_empresa.ilike.%${search}%`
        );
      }

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return res.status(200).json({
        clientes: data,
        total: count,
        page: Number(page),
        total_pages: Math.ceil(count / limit)
      });
    }

    if (req.method === 'POST') {
      const body = req.body;

      if (body.action === 'crear') {
        const { data, error } = await supabase
          .from('clientes')
          .insert([body])
          .select();

        if (error) throw error;

        return res.status(200).json({ mensaje: 'Cliente creado', data });
      }

      if (body.action === 'actualizar') {
        const { id, ...update } = body;

        const { error } = await supabase
          .from('clientes')
          .update(update)
          .eq('id', id);

        if (error) throw error;

        return res.status(200).json({ mensaje: 'Cliente actualizado' });
      }
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}