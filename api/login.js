import { supabase } from '../config/supabase.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Método no permitido'
      });
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        error: 'Debes ingresar email y contraseña'
      });
    }

    const { data: usuario, error: usuarioError } = await supabase
      .from('usuarios_demo')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (usuarioError) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    if (!usuario.activo) {
      return res.status(403).json({
        error: 'Usuario deshabilitado'
      });
    }

    const { data: cliente, error: clienteError } = await supabase
      .from('clientes_demo')
      .select('id, nombre_empresa, rut_empresa, activo, enlistado')
      .eq('id', usuario.cliente_id)
      .single();

    if (clienteError) {
      return res.status(500).json({
        error: 'Error obteniendo datos del cliente',
        detalle: clienteError.message
      });
    }

    return res.status(200).json({
      ok: true,
      usuario: {
        id: usuario.id,
        nombre_usuario: usuario.nombre_usuario,
        email: usuario.email,
        rol: usuario.rol,
        cliente_id: usuario.cliente_id
      },
      cliente,
      mensaje: 'Login correcto'
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error interno',
      detalle: error.message
    });
  }
}