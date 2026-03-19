import { supabase } from '../config/supabase.js';

async function obtenerClientes(req, res) {
  try {
    const mode = req.query?.mode || '';
    const q = (req.query?.q || '').trim();
    const page = Math.max(parseInt(req.query?.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query?.limit || '20', 10), 1), 100);
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    if (mode === 'select') {
      const { data, error } = await supabase
        .from('clientes_demo')
        .select('id, nombre_empresa, rut_empresa')
        .order('nombre_empresa', { ascending: true })
        .limit(500);

      if (error) {
        return res.status(500).json({
          error: 'Error obteniendo clientes para selector',
          detalle: error.message
        });
      }

      return res.status(200).json({
        ok: true,
        clientes: data || []
      });
    }

    let query = supabase
      .from('clientes_demo')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true });

    if (q) {
      query = query.or(`nombre_empresa.ilike.%${q}%,rut_empresa.ilike.%${q}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      return res.status(500).json({
        error: 'Error obteniendo clientes',
        detalle: error.message
      });
    }

    const total = count || 0;
    const total_pages = Math.max(Math.ceil(total / limit), 1);

    return res.status(200).json({
      ok: true,
      clientes: data || [],
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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno en obtenerClientes',
      detalle: error.message
    });
  }
}

async function crearCliente(body, res) {
  try {
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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno creando cliente',
      detalle: error.message
    });
  }
}

async function actualizarCliente(body, res) {
  try {
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
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno actualizando cliente',
      detalle: error.message
    });
  }
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      return await obtenerClientes(req, res);
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
      error: 'Error interno general',
      detalle: error.message
    });
  }
}