let session = null;

// elementos login
const loginForm = document.getElementById('loginForm');
const loginResultado = document.getElementById('loginResultado');
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const usuarioInfo = document.getElementById('usuarioInfo');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');

// elementos vistas
const menuPrincipal = document.getElementById('menuPrincipal');
const seccionConsulta = document.getElementById('seccionConsulta');
const seccionCreacion = document.getElementById('seccionCreacion');
const seccionAdmin = document.getElementById('seccionAdmin');

// info cliente
const clienteNombre = document.getElementById('clienteNombre');
const clienteRut = document.getElementById('clienteRut');
const clienteRol = document.getElementById('clienteRol');

const clienteNombreConsulta = document.getElementById('clienteNombreConsulta');
const clienteRutConsulta = document.getElementById('clienteRutConsulta');

const clienteNombreCreacion = document.getElementById('clienteNombreCreacion');
const clienteRutCreacion = document.getElementById('clienteRutCreacion');

// admin
const btnMostrarAdmin = document.getElementById('btnMostrarAdmin');
const adminNombre = document.getElementById('adminNombre');
const adminEmail = document.getElementById('adminEmail');
const adminRol = document.getElementById('adminRol');

// tabs admin
const tabMensajes = document.getElementById('tabMensajes');
const tabClientes = document.getElementById('tabClientes');
const tabUsuarios = document.getElementById('tabUsuarios');

const adminMensajesPanel = document.getElementById('adminMensajesPanel');
const adminClientesPanel = document.getElementById('adminClientesPanel');
const adminUsuariosPanel = document.getElementById('adminUsuariosPanel');

// reglas
const listaReglas = document.getElementById('listaReglas');
const formEditarRegla = document.getElementById('formEditarRegla');
const adminResultado = document.getElementById('adminResultado');
const textoSinSeleccion = document.getElementById('textoSinSeleccion');

const reglaId = document.getElementById('regla_id');
const reglaEstado = document.getElementById('regla_estado');
const reglaArea = document.getElementById('regla_area');
const reglaTipologia = document.getElementById('regla_tipologia');
const reglaHoras = document.getElementById('regla_horas');
const reglaMensaje = document.getElementById('regla_mensaje');
const reglaActivo = document.getElementById('regla_activo');

// clientes
const listaClientes = document.getElementById('listaClientes');
const formEditarCliente = document.getElementById('formEditarCliente');
const adminClienteResultado = document.getElementById('adminClienteResultado');
const textoSinClienteSeleccionado = document.getElementById('textoSinClienteSeleccionado');

const clienteIdAdmin = document.getElementById('cliente_id_admin');
const clienteNombreAdmin = document.getElementById('cliente_nombre_admin');
const clienteRutAdmin = document.getElementById('cliente_rut_admin');
const clienteActivoAdmin = document.getElementById('cliente_activo_admin');
const clienteEnlistadoAdmin = document.getElementById('cliente_enlistado_admin');

// usuarios
const listaUsuarios = document.getElementById('listaUsuarios');
const formEditarUsuario = document.getElementById('formEditarUsuario');
const adminUsuarioResultado = document.getElementById('adminUsuarioResultado');
const textoSinUsuarioSeleccionado = document.getElementById('textoSinUsuarioSeleccionado');

const usuarioIdAdmin = document.getElementById('usuario_id_admin');
const usuarioNombreAdmin = document.getElementById('usuario_nombre_admin');
const usuarioEmailAdmin = document.getElementById('usuario_email_admin');
const usuarioRolAdmin = document.getElementById('usuario_rol_admin');
const usuarioPasswordAdmin = document.getElementById('usuario_password_admin');
const usuarioActivoAdmin = document.getElementById('usuario_activo_admin');

// botones navegación
document.getElementById('btnMostrarConsulta').onclick = () => {
  ocultarTodasLasSecciones();
  seccionConsulta.classList.remove('oculto');
};

document.getElementById('btnMostrarCreacion').onclick = () => {
  ocultarTodasLasSecciones();
  seccionCreacion.classList.remove('oculto');
};

btnMostrarAdmin.onclick = async () => {
  ocultarTodasLasSecciones();
  seccionAdmin.classList.remove('oculto');
  mostrarTabMensajes();
  await cargarReglasAdmin();
};

document.getElementById('btnVolverConsulta').onclick = volverMenu;
document.getElementById('btnVolverCreacion').onclick = volverMenu;
document.getElementById('btnVolverAdmin').onclick = volverMenu;
btnCerrarSesion.onclick = cerrarSesion;

// tabs admin
tabMensajes.onclick = async () => {
  mostrarTabMensajes();
  await cargarReglasAdmin();
};

tabClientes.onclick = async () => {
  mostrarTabClientes();
  await cargarClientesAdmin();
};

tabUsuarios.onclick = async () => {
  mostrarTabUsuarios();
  await cargarUsuariosAdmin();
};

// formularios
const consultaForm = document.getElementById('consultaForm');
const crearForm = document.getElementById('crearForm');

const resultadoConsulta = document.getElementById('resultadoConsulta');
const resultadoCreacion = document.getElementById('resultadoCreacion');

function ocultarTodasLasSecciones() {
  menuPrincipal.classList.add('oculto');
  seccionConsulta.classList.add('oculto');
  seccionCreacion.classList.add('oculto');
  seccionAdmin.classList.add('oculto');
}

function volverMenu() {
  ocultarTodasLasSecciones();
  menuPrincipal.classList.remove('oculto');
}

function guardarSesion(data) {
  localStorage.setItem('appia_session', JSON.stringify(data));
}

function leerSesion() {
  const raw = localStorage.getItem('appia_session');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('appia_session');
    return null;
  }
}

function limpiarSesion() {
  localStorage.removeItem('appia_session');
}

function cargarDatosClienteEnPantalla() {
  if (!session?.cliente || !session?.usuario) return;

  const nombre = session.cliente.nombre_empresa;
  const rut = session.cliente.rut_empresa;
  const rol = session.usuario.rol;

  clienteNombre.innerText = nombre;
  clienteRut.innerText = rut;
  clienteRol.innerText = rol;

  clienteNombreConsulta.innerText = nombre;
  clienteRutConsulta.innerText = rut;

  clienteNombreCreacion.innerText = nombre;
  clienteRutCreacion.innerText = rut;

  adminNombre.innerText = session.usuario.nombre_usuario;
  adminEmail.innerText = session.usuario.email;
  adminRol.innerText = session.usuario.rol;
}

function configurarVisibilidadAdmin() {
  const esAdmin = session?.usuario?.rol === 'admin';

  if (esAdmin) {
    btnMostrarAdmin.classList.remove('oculto');
  } else {
    btnMostrarAdmin.classList.add('oculto');
  }
}

function mostrarAplicacion() {
  loginContainer.classList.add('oculto');
  appContainer.classList.remove('oculto');
  volverMenu();

  usuarioInfo.innerText =
    `${session.usuario.nombre_usuario} - ${session.cliente.nombre_empresa} - ${session.cliente.rut_empresa}`;

  cargarDatosClienteEnPantalla();
  configurarVisibilidadAdmin();
}

function mostrarLogin() {
  appContainer.classList.add('oculto');
  loginContainer.classList.remove('oculto');

  loginForm.reset();
  loginResultado.classList.add('oculto');
  loginResultado.innerHTML = '';

  resultadoConsulta.classList.add('oculto');
  resultadoConsulta.innerHTML = '';

  resultadoCreacion.classList.add('oculto');
  resultadoCreacion.innerHTML = '';

  adminResultado.classList.add('oculto');
  adminResultado.innerHTML = '';

  adminClienteResultado.classList.add('oculto');
  adminClienteResultado.innerHTML = '';

  adminUsuarioResultado.classList.add('oculto');
  adminUsuarioResultado.innerHTML = '';

  volverMenu();
}

function cerrarSesion() {
  session = null;
  limpiarSesion();
  mostrarLogin();
}

function mostrarTabMensajes() {
  adminMensajesPanel.classList.remove('oculto');
  adminClientesPanel.classList.add('oculto');
  adminUsuariosPanel.classList.add('oculto');
}

function mostrarTabClientes() {
  adminMensajesPanel.classList.add('oculto');
  adminClientesPanel.classList.remove('oculto');
  adminUsuariosPanel.classList.add('oculto');
}

function mostrarTabUsuarios() {
  adminMensajesPanel.classList.add('oculto');
  adminClientesPanel.classList.add('oculto');
  adminUsuariosPanel.classList.remove('oculto');
}

// REGLAS
async function cargarReglasAdmin() {
  if (session?.usuario?.rol !== 'admin') return;

  listaReglas.innerHTML = 'Cargando reglas...';

  try {
    const res = await fetch('/api/obtener-reglas');
    const data = await res.json();

    if (!res.ok) {
      listaReglas.innerHTML = `<div class="resultado estado-error">No fue posible cargar reglas: ${data.error || 'Error'}</div>`;
      return;
    }

    if (!data.reglas || data.reglas.length === 0) {
      listaReglas.innerHTML = '<p>No hay reglas registradas.</p>';
      return;
    }

    listaReglas.innerHTML = data.reglas.map((regla) => `
      <button type="button" class="regla-item" data-id="${regla.id}">
        <strong>#${regla.id}</strong> - ${regla.estado_ticket || 'Sin estado'} / ${regla.area_resolutora || 'Sin área'}
        <br>
        <small>${regla.tipologia || 'Sin tipología'} | ${regla.horas_minimas} - ${regla.horas_maximas} hrs | ${regla.activo ? 'Activa' : 'Inactiva'}</small>
      </button>
    `).join('');

    document.querySelectorAll('.regla-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const regla = data.reglas.find((r) => r.id === Number(btn.dataset.id));
        if (regla) cargarReglaEnFormulario(regla);
      });
    });
  } catch (error) {
    listaReglas.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

function cargarReglaEnFormulario(regla) {
  reglaId.value = regla.id;
  reglaEstado.value = regla.estado_ticket || '';
  reglaArea.value = regla.area_resolutora || '';
  reglaTipologia.value = regla.tipologia || '';
  reglaHoras.value = `${regla.horas_minimas} - ${regla.horas_maximas} horas`;
  reglaMensaje.value = regla.mensaje || '';
  reglaActivo.checked = !!regla.activo;

  textoSinSeleccion.classList.add('oculto');
  formEditarRegla.classList.remove('oculto');

  adminResultado.classList.add('oculto');
  adminResultado.innerHTML = '';
}

// CLIENTES
async function cargarClientesAdmin() {
  if (session?.usuario?.rol !== 'admin') return;

  listaClientes.innerHTML = 'Cargando clientes...';

  try {
    const res = await fetch('/api/obtener-clientes');
    const data = await res.json();

    if (!res.ok) {
      listaClientes.innerHTML = `<div class="resultado estado-error">No fue posible cargar clientes: ${data.error || 'Error'}</div>`;
      return;
    }

    if (!data.clientes || data.clientes.length === 0) {
      listaClientes.innerHTML = '<p>No hay clientes registrados.</p>';
      return;
    }

    listaClientes.innerHTML = data.clientes.map((cliente) => `
      <button type="button" class="regla-item cliente-item" data-id="${cliente.id}">
        <strong>#${cliente.id}</strong> - ${cliente.nombre_empresa}
        <br>
        <small>${cliente.rut_empresa} | ${cliente.activo ? 'Activo' : 'Inactivo'} | ${cliente.enlistado ? 'Enlistado' : 'No enlistado'}</small>
      </button>
    `).join('');

    document.querySelectorAll('.cliente-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cliente = data.clientes.find((c) => c.id === Number(btn.dataset.id));
        if (cliente) cargarClienteEnFormulario(cliente);
      });
    });
  } catch (error) {
    listaClientes.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

function cargarClienteEnFormulario(cliente) {
  clienteIdAdmin.value = cliente.id;
  clienteNombreAdmin.value = cliente.nombre_empresa || '';
  clienteRutAdmin.value = cliente.rut_empresa || '';
  clienteActivoAdmin.checked = !!cliente.activo;
  clienteEnlistadoAdmin.checked = !!cliente.enlistado;

  textoSinClienteSeleccionado.classList.add('oculto');
  formEditarCliente.classList.remove('oculto');

  adminClienteResultado.classList.add('oculto');
  adminClienteResultado.innerHTML = '';
}

// USUARIOS
async function cargarUsuariosAdmin() {
  if (session?.usuario?.rol !== 'admin') return;

  listaUsuarios.innerHTML = 'Cargando usuarios...';

  try {
    const res = await fetch('/api/obtener-usuarios');
    const data = await res.json();

    if (!res.ok) {
      listaUsuarios.innerHTML = `<div class="resultado estado-error">No fue posible cargar usuarios: ${data.error || 'Error'}</div>`;
      return;
    }

    if (!data.usuarios || data.usuarios.length === 0) {
      listaUsuarios.innerHTML = '<p>No hay usuarios registrados.</p>';
      return;
    }

    listaUsuarios.innerHTML = data.usuarios.map((usuario) => `
      <button type="button" class="regla-item usuario-item" data-id="${usuario.id}">
        <strong>#${usuario.id}</strong> - ${usuario.nombre_usuario}
        <br>
        <small>${usuario.email} | ${usuario.rol} | ${usuario.activo ? 'Activo' : 'Inactivo'}</small>
      </button>
    `).join('');

    document.querySelectorAll('.usuario-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const usuario = data.usuarios.find((u) => u.id === Number(btn.dataset.id));
        if (usuario) cargarUsuarioEnFormulario(usuario);
      });
    });
  } catch (error) {
    listaUsuarios.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

function cargarUsuarioEnFormulario(usuario) {
  usuarioIdAdmin.value = usuario.id;
  usuarioNombreAdmin.value = usuario.nombre_usuario || '';
  usuarioEmailAdmin.value = usuario.email || '';
  usuarioRolAdmin.value = usuario.rol || '';
  usuarioPasswordAdmin.value = usuario.password || '';
  usuarioActivoAdmin.checked = !!usuario.activo;

  textoSinUsuarioSeleccionado.classList.add('oculto');
  formEditarUsuario.classList.remove('oculto');

  adminUsuarioResultado.classList.add('oculto');
  adminUsuarioResultado.innerHTML = '';
}

// restaurar sesión al cargar
document.addEventListener('DOMContentLoaded', () => {
  const sesionGuardada = leerSesion();

  if (sesionGuardada?.usuario && sesionGuardada?.cliente) {
    session = sesionGuardada;
    mostrarAplicacion();
  } else {
    mostrarLogin();
  }
});

// LOGIN
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login_email').value.trim();
  const password = document.getElementById('login_password').value.trim();

  loginResultado.classList.remove('oculto', 'estado-ok', 'estado-error');
  loginResultado.className = 'resultado';
  loginResultado.innerHTML = 'Validando credenciales...';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      loginResultado.classList.add('estado-error');
      loginResultado.innerHTML = `<strong>Error:</strong> ${data.error || 'No fue posible iniciar sesión'}`;
      return;
    }

    session = data;
    guardarSesion(data);
    mostrarAplicacion();
  } catch (error) {
    loginResultado.classList.add('estado-error');
    loginResultado.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
});

// CONSULTA
consultaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!session?.cliente?.rut_empresa) {
    resultadoConsulta.classList.remove('oculto');
    resultadoConsulta.classList.add('estado-error');
    resultadoConsulta.innerHTML = 'No existe sesión activa.';
    return;
  }

  const rut_empresa = session.cliente.rut_empresa;
  const bpi = document.getElementById('bpi_consulta').value.trim();

  resultadoConsulta.className = 'resultado';
  resultadoConsulta.innerHTML = 'Consultando ticket...';
  resultadoConsulta.classList.remove('oculto', 'estado-ok', 'estado-error');

  try {
    const response = await fetch('/api/consultar-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rut_empresa, bpi })
    });

    const rawText = await response.text();
    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`La API no devolvió JSON válido. Respuesta: ${rawText.substring(0, 200)}`);
    }

    resultadoConsulta.classList.remove('oculto');

    if (!response.ok) {
      resultadoConsulta.classList.add('estado-error');
      resultadoConsulta.innerHTML = `
        <h3>No fue posible consultar</h3>
        <div class="resultado-item"><strong>Detalle:</strong> ${data.error || 'Error desconocido'}</div>
      `;
      return;
    }

    const ticketHtml = data.ticket
      ? `
        <div class="resultado-item"><strong>Ticket:</strong> ${data.ticket.ticket_numero}</div>
        <div class="resultado-item"><strong>Estado:</strong> ${data.ticket.estado}</div>
        <div class="resultado-item"><strong>Área resolutora:</strong> ${data.ticket.area_resolutora}</div>
        <div class="resultado-item"><strong>Tipología:</strong> ${data.ticket.tipologia}</div>
        <div class="resultado-item"><strong>Descripción:</strong> ${data.ticket.descripcion}</div>
        <div class="resultado-item"><strong>Horas transcurridas:</strong> ${data.horas_transcurridas ?? 'No disponible'}</div>
        <div class="mensaje-automatico">
          <strong>Mensaje automático:</strong>
          <p>${data.mensaje || 'Sin mensaje disponible.'}</p>
        </div>
      `
      : `
        <div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje}</div>
      `;

    resultadoConsulta.classList.add('estado-ok');
    resultadoConsulta.innerHTML = `
      <h3>Consulta exitosa</h3>
      <div class="resultado-item"><strong>Cliente:</strong> ${data.cliente.nombre_empresa}</div>
      <div class="resultado-item"><strong>RUT:</strong> ${data.cliente.rut_empresa}</div>
      <div class="resultado-item"><strong>Servicio:</strong> ${data.servicio.nombre_servicio}</div>
      <div class="resultado-item"><strong>BPI:</strong> ${data.servicio.bpi}</div>
      <div class="resultado-item"><strong>Dirección:</strong> ${data.servicio.direccion}</div>
      ${ticketHtml}
    `;
  } catch (error) {
    resultadoConsulta.classList.remove('oculto');
    resultadoConsulta.classList.add('estado-error');
    resultadoConsulta.innerHTML = `
      <h3>Error de conexión</h3>
      <div class="resultado-item">${error.message}</div>
    `;
  }
});

// CREAR
crearForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!session?.cliente?.rut_empresa) {
    resultadoCreacion.classList.remove('oculto');
    resultadoCreacion.classList.add('estado-error');
    resultadoCreacion.innerHTML = 'No existe sesión activa.';
    return;
  }

  const body = {
    rut_empresa: session.cliente.rut_empresa,
    bpi: document.getElementById('bpi_creacion').value.trim(),
    tipo_solicitud: document.getElementById('tipo_solicitud').value,
    descripcion: document.getElementById('descripcion_creacion').value.trim()
  };

  resultadoCreacion.className = 'resultado';
  resultadoCreacion.innerHTML = 'Creando ticket...';
  resultadoCreacion.classList.remove('oculto', 'estado-ok', 'estado-error');

  try {
    const response = await fetch('/api/crear-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const rawText = await response.text();
    let data;

    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error(`La API no devolvió JSON válido. Respuesta: ${rawText.substring(0, 200)}`);
    }

    resultadoCreacion.classList.remove('oculto');

    if (!response.ok) {
      if (response.status === 409 && data.ticket_existente) {
        resultadoCreacion.classList.add('estado-error');
        resultadoCreacion.innerHTML = `
          <h3>Ya existe un ticket abierto</h3>
          <div class="resultado-item"><strong>Cliente:</strong> ${data.cliente?.nombre_empresa || 'No disponible'}</div>
          <div class="resultado-item"><strong>Servicio:</strong> ${data.servicio?.nombre_servicio || 'No disponible'}</div>
          <div class="resultado-item"><strong>BPI:</strong> ${data.servicio?.bpi || body.bpi}</div>
          <div class="resultado-item"><strong>Ticket existente:</strong> ${data.ticket_existente.ticket_numero}</div>
          <div class="resultado-item"><strong>Estado:</strong> ${data.ticket_existente.estado}</div>
          <div class="resultado-item"><strong>Área resolutora:</strong> ${data.ticket_existente.area_resolutora}</div>
          <div class="resultado-item"><strong>Tipología:</strong> ${data.ticket_existente.tipologia}</div>
          <div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje || data.error}</div>
        `;
        return;
      }

      resultadoCreacion.classList.add('estado-error');
      resultadoCreacion.innerHTML = `
        <h3>No fue posible crear el ticket</h3>
        <div class="resultado-item"><strong>Detalle:</strong> ${data.error || 'Error desconocido'}</div>
      `;
      return;
    }

    resultadoCreacion.classList.add('estado-ok');
    resultadoCreacion.innerHTML = `
      <h3>Ticket creado correctamente</h3>
      <div class="resultado-item"><strong>Cliente:</strong> ${data.cliente.nombre_empresa}</div>
      <div class="resultado-item"><strong>RUT:</strong> ${data.cliente.rut_empresa}</div>
      <div class="resultado-item"><strong>Servicio:</strong> ${data.servicio.nombre_servicio}</div>
      <div class="resultado-item"><strong>BPI:</strong> ${data.servicio.bpi}</div>
      <div class="resultado-item"><strong>Ticket:</strong> ${data.ticket.ticket_numero}</div>
      <div class="resultado-item"><strong>Estado:</strong> ${data.ticket.estado}</div>
      <div class="resultado-item"><strong>Área resolutora:</strong> ${data.ticket.area_resolutora}</div>
      <div class="resultado-item"><strong>Tipología:</strong> ${data.ticket.tipologia}</div>
      <div class="resultado-item"><strong>Descripción:</strong> ${data.ticket.descripcion}</div>
      <div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje}</div>
    `;
  } catch (error) {
    resultadoCreacion.classList.remove('oculto');
    resultadoCreacion.classList.add('estado-error');
    resultadoCreacion.innerHTML = `
      <h3>Error de conexión</h3>
      <div class="resultado-item">${error.message}</div>
    `;
  }
});

// EDITAR REGLA
formEditarRegla.addEventListener('submit', async (e) => {
  e.preventDefault();

  adminResultado.className = 'resultado';
  adminResultado.classList.remove('oculto', 'estado-ok', 'estado-error');
  adminResultado.innerHTML = 'Guardando cambios...';

  try {
    const res = await fetch('/api/actualizar-regla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(reglaId.value),
        mensaje: reglaMensaje.value,
        activo: reglaActivo.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      adminResultado.classList.add('estado-error');
      adminResultado.innerHTML = `<strong>Error:</strong> ${data.error || 'No fue posible guardar'}`;
      return;
    }

    adminResultado.classList.add('estado-ok');
    adminResultado.innerHTML = `<strong>OK:</strong> ${data.mensaje}`;

    await cargarReglasAdmin();
  } catch (error) {
    adminResultado.classList.add('estado-error');
    adminResultado.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
});

// EDITAR CLIENTE
formEditarCliente.addEventListener('submit', async (e) => {
  e.preventDefault();

  adminClienteResultado.className = 'resultado';
  adminClienteResultado.classList.remove('oculto', 'estado-ok', 'estado-error');
  adminClienteResultado.innerHTML = 'Guardando cambios...';

  try {
    const res = await fetch('/api/actualizar-cliente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(clienteIdAdmin.value),
        activo: clienteActivoAdmin.checked,
        enlistado: clienteEnlistadoAdmin.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      adminClienteResultado.classList.add('estado-error');
      adminClienteResultado.innerHTML = `<strong>Error:</strong> ${data.error || 'No fue posible guardar'}`;
      return;
    }

    adminClienteResultado.classList.add('estado-ok');
    adminClienteResultado.innerHTML = `<strong>OK:</strong> ${data.mensaje}`;

    await cargarClientesAdmin();
  } catch (error) {
    adminClienteResultado.classList.add('estado-error');
    adminClienteResultado.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
});

// EDITAR USUARIO
formEditarUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  adminUsuarioResultado.className = 'resultado';
  adminUsuarioResultado.classList.remove('oculto', 'estado-ok', 'estado-error');
  adminUsuarioResultado.innerHTML = 'Guardando cambios...';

  try {
    const res = await fetch('/api/actualizar-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(usuarioIdAdmin.value),
        password: usuarioPasswordAdmin.value,
        activo: usuarioActivoAdmin.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      adminUsuarioResultado.classList.add('estado-error');
      adminUsuarioResultado.innerHTML = `<strong>Error:</strong> ${data.error || 'No fue posible guardar'}`;
      return;
    }

    adminUsuarioResultado.classList.add('estado-ok');
    adminUsuarioResultado.innerHTML = `<strong>OK:</strong> ${data.mensaje}`;

    await cargarUsuariosAdmin();
  } catch (error) {
    adminUsuarioResultado.classList.add('estado-error');
    adminUsuarioResultado.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
});