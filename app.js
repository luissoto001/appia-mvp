let session = null;

// Login / layout
const loginForm = document.getElementById('loginForm');
const loginResultado = document.getElementById('loginResultado');
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const usuarioInfo = document.getElementById('usuarioInfo');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');

// Secciones
const menuPrincipal = document.getElementById('menuPrincipal');
const seccionConsulta = document.getElementById('seccionConsulta');
const seccionCreacion = document.getElementById('seccionCreacion');
const seccionAdmin = document.getElementById('seccionAdmin');

// Info cliente
const clienteNombre = document.getElementById('clienteNombre');
const clienteRut = document.getElementById('clienteRut');
const clienteRol = document.getElementById('clienteRol');
const clienteNombreConsulta = document.getElementById('clienteNombreConsulta');
const clienteRutConsulta = document.getElementById('clienteRutConsulta');
const clienteNombreCreacion = document.getElementById('clienteNombreCreacion');
const clienteRutCreacion = document.getElementById('clienteRutCreacion');

// Portal
const consultaForm = document.getElementById('consultaForm');
const crearForm = document.getElementById('crearForm');
const resultadoConsulta = document.getElementById('resultadoConsulta');
const resultadoCreacion = document.getElementById('resultadoCreacion');

// Admin base
const btnMostrarAdmin = document.getElementById('btnMostrarAdmin');
const adminNombre = document.getElementById('adminNombre');
const adminEmail = document.getElementById('adminEmail');
const adminRol = document.getElementById('adminRol');

// Tabs
const tabMensajes = document.getElementById('tabMensajes');
const tabClientes = document.getElementById('tabClientes');
const tabUsuarios = document.getElementById('tabUsuarios');
const adminMensajesPanel = document.getElementById('adminMensajesPanel');
const adminClientesPanel = document.getElementById('adminClientesPanel');
const adminUsuariosPanel = document.getElementById('adminUsuariosPanel');

// Reglas
const listaReglas = document.getElementById('listaReglas');
const formNuevaRegla = document.getElementById('formNuevaRegla');
const formEditarRegla = document.getElementById('formEditarRegla');
const adminNuevaReglaResultado = document.getElementById('adminNuevaReglaResultado');
const adminResultado = document.getElementById('adminResultado');
const textoSinSeleccion = document.getElementById('textoSinSeleccion');

const nuevaReglaCanal = document.getElementById('nueva_regla_canal');
const nuevaReglaEstado = document.getElementById('nueva_regla_estado');
const nuevaReglaArea = document.getElementById('nueva_regla_area');
const nuevaReglaTipologia = document.getElementById('nueva_regla_tipologia');
const nuevaReglaHorasMin = document.getElementById('nueva_regla_horas_min');
const nuevaReglaHorasMax = document.getElementById('nueva_regla_horas_max');
const nuevaReglaPrioridad = document.getElementById('nueva_regla_prioridad');
const nuevaReglaMensaje = document.getElementById('nueva_regla_mensaje');
const nuevaReglaActivo = document.getElementById('nueva_regla_activo');

const reglaId = document.getElementById('regla_id');
const reglaCanal = document.getElementById('regla_canal');
const reglaEstado = document.getElementById('regla_estado');
const reglaArea = document.getElementById('regla_area');
const reglaTipologia = document.getElementById('regla_tipologia');
const reglaHorasMin = document.getElementById('regla_horas_min');
const reglaHorasMax = document.getElementById('regla_horas_max');
const reglaPrioridad = document.getElementById('regla_prioridad');
const reglaMensaje = document.getElementById('regla_mensaje');
const reglaActivo = document.getElementById('regla_activo');

// Clientes
const listaClientes = document.getElementById('listaClientes');
const formNuevoCliente = document.getElementById('formNuevoCliente');
const formEditarCliente = document.getElementById('formEditarCliente');
const adminNuevoClienteResultado = document.getElementById('adminNuevoClienteResultado');
const adminClienteResultado = document.getElementById('adminClienteResultado');
const textoSinClienteSeleccionado = document.getElementById('textoSinClienteSeleccionado');

const nuevoClienteNombre = document.getElementById('nuevo_cliente_nombre');
const nuevoClienteRut = document.getElementById('nuevo_cliente_rut');
const nuevoClienteActivo = document.getElementById('nuevo_cliente_activo');
const nuevoClienteEnlistado = document.getElementById('nuevo_cliente_enlistado');

const clienteIdAdmin = document.getElementById('cliente_id_admin');
const clienteNombreAdmin = document.getElementById('cliente_nombre_admin');
const clienteRutAdmin = document.getElementById('cliente_rut_admin');
const clienteActivoAdmin = document.getElementById('cliente_activo_admin');
const clienteEnlistadoAdmin = document.getElementById('cliente_enlistado_admin');

// Servicios
const listaServiciosCliente = document.getElementById('listaServiciosCliente');
const formNuevoServicio = document.getElementById('formNuevoServicio');
const formEditarServicio = document.getElementById('formEditarServicio');
const adminNuevoServicioResultado = document.getElementById('adminNuevoServicioResultado');
const adminServicioResultado = document.getElementById('adminServicioResultado');
const textoSinServicioSeleccionado = document.getElementById('textoSinServicioSeleccionado');

const nuevoServicioBpi = document.getElementById('nuevo_servicio_bpi');
const nuevoServicioNombre = document.getElementById('nuevo_servicio_nombre');
const nuevoServicioDireccion = document.getElementById('nuevo_servicio_direccion');
const nuevoServicioActivo = document.getElementById('nuevo_servicio_activo');

const servicioIdAdmin = document.getElementById('servicio_id_admin');
const servicioBpiAdmin = document.getElementById('servicio_bpi_admin');
const servicioNombreAdmin = document.getElementById('servicio_nombre_admin');
const servicioDireccionAdmin = document.getElementById('servicio_direccion_admin');
const servicioActivoAdmin = document.getElementById('servicio_activo_admin');

// Usuarios
const listaUsuarios = document.getElementById('listaUsuarios');
const formNuevoUsuario = document.getElementById('formNuevoUsuario');
const formEditarUsuario = document.getElementById('formEditarUsuario');
const adminNuevoUsuarioResultado = document.getElementById('adminNuevoUsuarioResultado');
const adminUsuarioResultado = document.getElementById('adminUsuarioResultado');
const textoSinUsuarioSeleccionado = document.getElementById('textoSinUsuarioSeleccionado');

const nuevoUsuarioCliente = document.getElementById('nuevo_usuario_cliente');
const nuevoUsuarioNombre = document.getElementById('nuevo_usuario_nombre');
const nuevoUsuarioEmail = document.getElementById('nuevo_usuario_email');
const nuevoUsuarioPassword = document.getElementById('nuevo_usuario_password');
const nuevoUsuarioRol = document.getElementById('nuevo_usuario_rol');
const nuevoUsuarioActivo = document.getElementById('nuevo_usuario_activo');

const usuarioIdAdmin = document.getElementById('usuario_id_admin');
const usuarioNombreAdmin = document.getElementById('usuario_nombre_admin');
const usuarioEmailAdmin = document.getElementById('usuario_email_admin');
const usuarioRolAdmin = document.getElementById('usuario_rol_admin');
const usuarioPasswordAdmin = document.getElementById('usuario_password_admin');
const usuarioActivoAdmin = document.getElementById('usuario_activo_admin');

let clienteSeleccionadoId = null;

// Navegación
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

tabMensajes.onclick = async () => {
  mostrarTabMensajes();
  await cargarReglasAdmin();
};

tabClientes.onclick = async () => {
  mostrarTabClientes();
  await cargarClientesAdmin();
  await cargarClientesParaSelectUsuario();
};

tabUsuarios.onclick = async () => {
  mostrarTabUsuarios();
  await cargarUsuariosAdmin();
  await cargarClientesParaSelectUsuario();
};

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

  clienteNombre.innerText = session.cliente.nombre_empresa;
  clienteRut.innerText = session.cliente.rut_empresa;
  clienteRol.innerText = session.usuario.rol;

  clienteNombreConsulta.innerText = session.cliente.nombre_empresa;
  clienteRutConsulta.innerText = session.cliente.rut_empresa;

  clienteNombreCreacion.innerText = session.cliente.nombre_empresa;
  clienteRutCreacion.innerText = session.cliente.rut_empresa;

  adminNombre.innerText = session.usuario.nombre_usuario;
  adminEmail.innerText = session.usuario.email;
  adminRol.innerText = session.usuario.rol;
}

function configurarVisibilidadAdmin() {
  if (session?.usuario?.rol === 'admin') {
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
  volverMenu();
}

function cerrarSesion() {
  session = null;
  limpiarSesion();
  mostrarLogin();
}

function setResultado(elemento, tipo, html) {
  elemento.className = 'resultado';
  elemento.classList.remove('oculto', 'estado-ok', 'estado-error');
  if (tipo) elemento.classList.add(tipo);
  elemento.innerHTML = html;
}

// LOGIN
document.addEventListener('DOMContentLoaded', () => {
  const sesionGuardada = leerSesion();
  if (sesionGuardada?.usuario && sesionGuardada?.cliente) {
    session = sesionGuardada;
    mostrarAplicacion();
  } else {
    mostrarLogin();
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(loginResultado, '', 'Validando credenciales...');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: document.getElementById('login_email').value.trim(),
        password: document.getElementById('login_password').value.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(loginResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible iniciar sesión'}`);
      return;
    }

    session = data;
    guardarSesion(data);
    mostrarAplicacion();
  } catch (error) {
    setResultado(loginResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// TICKETS
consultaForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(resultadoConsulta, '', 'Consultando ticket...');

  try {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'consultar',
        rut_empresa: session.cliente.rut_empresa,
        bpi: document.getElementById('bpi_consulta').value.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(resultadoConsulta, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible consultar'}`);
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
      : `<div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje}</div>`;

    setResultado(resultadoConsulta, 'estado-ok', `
      <h3>Consulta exitosa</h3>
      <div class="resultado-item"><strong>Cliente:</strong> ${data.cliente.nombre_empresa}</div>
      <div class="resultado-item"><strong>Servicio:</strong> ${data.servicio.nombre_servicio}</div>
      <div class="resultado-item"><strong>BPI:</strong> ${data.servicio.bpi}</div>
      <div class="resultado-item"><strong>Dirección:</strong> ${data.servicio.direccion}</div>
      ${ticketHtml}
    `);
  } catch (error) {
    setResultado(resultadoConsulta, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

crearForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(resultadoCreacion, '', 'Creando ticket...');

  try {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        rut_empresa: session.cliente.rut_empresa,
        bpi: document.getElementById('bpi_creacion').value.trim(),
        tipo_solicitud: document.getElementById('tipo_solicitud').value,
        descripcion: document.getElementById('descripcion_creacion').value.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 409 && data.ticket_existente) {
        setResultado(resultadoCreacion, 'estado-error', `
          <h3>Ya existe un ticket abierto</h3>
          <div class="resultado-item"><strong>Ticket:</strong> ${data.ticket_existente.ticket_numero}</div>
          <div class="resultado-item"><strong>Estado:</strong> ${data.ticket_existente.estado}</div>
          <div class="resultado-item"><strong>Área resolutora:</strong> ${data.ticket_existente.area_resolutora}</div>
          <div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje}</div>
        `);
        return;
      }

      setResultado(resultadoCreacion, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible crear el ticket'}`);
      return;
    }

    setResultado(resultadoCreacion, 'estado-ok', `
      <h3>Ticket creado correctamente</h3>
      <div class="resultado-item"><strong>Ticket:</strong> ${data.ticket.ticket_numero}</div>
      <div class="resultado-item"><strong>Estado:</strong> ${data.ticket.estado}</div>
      <div class="resultado-item"><strong>Área resolutora:</strong> ${data.ticket.area_resolutora}</div>
      <div class="resultado-item"><strong>Tipología:</strong> ${data.ticket.tipologia}</div>
      <div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje}</div>
    `);
  } catch (error) {
    setResultado(resultadoCreacion, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// REGLAS
async function cargarReglasAdmin() {
  listaReglas.innerHTML = 'Cargando reglas...';

  try {
    const res = await fetch('/api/reglas');
    const data = await res.json();

    if (!res.ok) {
      listaReglas.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando reglas'}</div>`;
      return;
    }

    if (!data.reglas?.length) {
      listaReglas.innerHTML = '<p>No hay reglas registradas.</p>';
      return;
    }

    listaReglas.innerHTML = data.reglas.map((regla) => `
      <button type="button" class="regla-item" data-id="${regla.id}">
        <strong>#${regla.id}</strong> - ${regla.estado_ticket}
        <br>
        <small>${regla.area_resolutora} | ${regla.tipologia} | ${regla.horas_minimas}-${regla.horas_maximas} hrs | prioridad ${regla.prioridad} | ${regla.activo ? 'Activa' : 'Inactiva'}</small>
      </button>
    `).join('');

    document.querySelectorAll('.regla-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const regla = data.reglas.find((r) => r.id === Number(btn.dataset.id));
        if (!regla) return;

        reglaId.value = regla.id;
        reglaCanal.value = regla.canal || '';
        reglaEstado.value = regla.estado_ticket || '';
        reglaArea.value = regla.area_resolutora || '';
        reglaTipologia.value = regla.tipologia || '';
        reglaHorasMin.value = regla.horas_minimas ?? 0;
        reglaHorasMax.value = regla.horas_maximas ?? 0;
        reglaPrioridad.value = regla.prioridad ?? 1;
        reglaMensaje.value = regla.mensaje || '';
        reglaActivo.checked = !!regla.activo;

        textoSinSeleccion.classList.add('oculto');
        formEditarRegla.classList.remove('oculto');
        adminResultado.classList.add('oculto');
      });
    });
  } catch (error) {
    listaReglas.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevaRegla.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminNuevaReglaResultado, '', 'Creando regla...');

  try {
    const res = await fetch('/api/reglas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        activo: nuevaReglaActivo.checked,
        canal: nuevaReglaCanal.value.trim(),
        estado_ticket: nuevaReglaEstado.value.trim(),
        area_resolutora: nuevaReglaArea.value.trim(),
        horas_minimas: Number(nuevaReglaHorasMin.value),
        horas_maximas: Number(nuevaReglaHorasMax.value),
        tipologia: nuevaReglaTipologia.value.trim(),
        prioridad: Number(nuevaReglaPrioridad.value),
        mensaje: nuevaReglaMensaje.value.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminNuevaReglaResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible crear la regla'}`);
      return;
    }

    formNuevaRegla.reset();
    nuevaReglaCanal.value = 'web';
    nuevaReglaPrioridad.value = 1;
    nuevaReglaActivo.checked = true;

    setResultado(adminNuevaReglaResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarReglasAdmin();
  } catch (error) {
    setResultado(adminNuevaReglaResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarRegla.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminResultado, '', 'Guardando cambios...');

  try {
    const res = await fetch('/api/reglas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'actualizar',
        id: Number(reglaId.value),
        activo: reglaActivo.checked,
        canal: reglaCanal.value.trim(),
        estado_ticket: reglaEstado.value.trim(),
        area_resolutora: reglaArea.value.trim(),
        horas_minimas: Number(reglaHorasMin.value),
        horas_maximas: Number(reglaHorasMax.value),
        tipologia: reglaTipologia.value.trim(),
        prioridad: Number(reglaPrioridad.value),
        mensaje: reglaMensaje.value.trim()
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible guardar'}`);
      return;
    }

    setResultado(adminResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarReglasAdmin();
  } catch (error) {
    setResultado(adminResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// CLIENTES
async function cargarClientesAdmin() {
  listaClientes.innerHTML = 'Cargando clientes...';

  try {
    const res = await fetch('/api/clientes');
    const data = await res.json();

    if (!res.ok) {
      listaClientes.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando clientes'}</div>`;
      return;
    }

    if (!data.clientes?.length) {
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
      btn.addEventListener('click', async () => {
        const cliente = data.clientes.find((c) => c.id === Number(btn.dataset.id));
        if (!cliente) return;

        clienteSeleccionadoId = cliente.id;
        clienteIdAdmin.value = cliente.id;
        clienteNombreAdmin.value = cliente.nombre_empresa || '';
        clienteRutAdmin.value = cliente.rut_empresa || '';
        clienteActivoAdmin.checked = !!cliente.activo;
        clienteEnlistadoAdmin.checked = !!cliente.enlistado;

        textoSinClienteSeleccionado.classList.add('oculto');
        formEditarCliente.classList.remove('oculto');
        formNuevoServicio.classList.remove('oculto');

        await cargarServiciosCliente(cliente.id);
      });
    });
  } catch (error) {
    listaClientes.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevoCliente.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminNuevoClienteResultado, '', 'Creando cliente...');

  try {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        nombre_empresa: nuevoClienteNombre.value.trim(),
        rut_empresa: nuevoClienteRut.value.trim(),
        activo: nuevoClienteActivo.checked,
        enlistado: nuevoClienteEnlistado.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminNuevoClienteResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible crear cliente'}`);
      return;
    }

    formNuevoCliente.reset();
    nuevoClienteActivo.checked = true;
    nuevoClienteEnlistado.checked = true;

    setResultado(adminNuevoClienteResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarClientesAdmin();
    await cargarClientesParaSelectUsuario();
  } catch (error) {
    setResultado(adminNuevoClienteResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarCliente.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminClienteResultado, '', 'Guardando cambios...');

  try {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'actualizar',
        id: Number(clienteIdAdmin.value),
        activo: clienteActivoAdmin.checked,
        enlistado: clienteEnlistadoAdmin.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminClienteResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible guardar'}`);
      return;
    }

    setResultado(adminClienteResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarClientesAdmin();
    await cargarClientesParaSelectUsuario();
  } catch (error) {
    setResultado(adminClienteResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// SERVICIOS
async function cargarServiciosCliente(clienteId) {
  listaServiciosCliente.innerHTML = 'Cargando servicios...';
  formEditarServicio.classList.add('oculto');
  setResultado(adminServicioResultado, '', '');
  adminServicioResultado.classList.add('oculto');

  try {
    const res = await fetch(`/api/servicios?cliente_id=${clienteId}`);
    const data = await res.json();

    if (!res.ok) {
      listaServiciosCliente.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando servicios'}</div>`;
      return;
    }

    if (!data.servicios?.length) {
      listaServiciosCliente.innerHTML = '<p>Este cliente aún no tiene servicios/BPI.</p>';
      return;
    }

    listaServiciosCliente.innerHTML = data.servicios.map((servicio) => `
      <button type="button" class="regla-item servicio-item" data-id="${servicio.id}">
        <strong>${servicio.bpi}</strong> - ${servicio.nombre_servicio}
        <br>
        <small>${servicio.direccion || 'Sin dirección'} | ${servicio.activo ? 'Activo' : 'Inactivo'}</small>
      </button>
    `).join('');

    document.querySelectorAll('.servicio-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        const servicio = data.servicios.find((s) => s.id === Number(btn.dataset.id));
        if (!servicio) return;

        servicioIdAdmin.value = servicio.id;
        servicioBpiAdmin.value = servicio.bpi || '';
        servicioNombreAdmin.value = servicio.nombre_servicio || '';
        servicioDireccionAdmin.value = servicio.direccion || '';
        servicioActivoAdmin.checked = !!servicio.activo;

        textoSinServicioSeleccionado.classList.add('oculto');
        formEditarServicio.classList.remove('oculto');
      });
    });
  } catch (error) {
    listaServiciosCliente.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevoServicio.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!clienteSeleccionadoId) return;

  setResultado(adminNuevoServicioResultado, '', 'Creando servicio/BPI...');

  try {
    const res = await fetch('/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        cliente_id: clienteSeleccionadoId,
        bpi: nuevoServicioBpi.value.trim(),
        nombre_servicio: nuevoServicioNombre.value.trim(),
        direccion: nuevoServicioDireccion.value.trim(),
        activo: nuevoServicioActivo.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminNuevoServicioResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible crear servicio'}`);
      return;
    }

    formNuevoServicio.reset();
    nuevoServicioActivo.checked = true;

    setResultado(adminNuevoServicioResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarServiciosCliente(clienteSeleccionadoId);
  } catch (error) {
    setResultado(adminNuevoServicioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarServicio.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminServicioResultado, '', 'Guardando servicio...');

  try {
    const res = await fetch('/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'actualizar',
        id: Number(servicioIdAdmin.value),
        nombre_servicio: servicioNombreAdmin.value.trim(),
        direccion: servicioDireccionAdmin.value.trim(),
        activo: servicioActivoAdmin.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminServicioResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible guardar servicio'}`);
      return;
    }

    setResultado(adminServicioResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarServiciosCliente(clienteSeleccionadoId);
  } catch (error) {
    setResultado(adminServicioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// USUARIOS
async function cargarClientesParaSelectUsuario() {
  try {
    const res = await fetch('/api/clientes');
    const data = await res.json();

    if (!res.ok || !data.clientes) return;

    nuevoUsuarioCliente.innerHTML = data.clientes
      .map((cliente) => `<option value="${cliente.id}">${cliente.nombre_empresa} (${cliente.rut_empresa})</option>`)
      .join('');
  } catch (error) {
    console.error(error);
  }
}

async function cargarUsuariosAdmin() {
  listaUsuarios.innerHTML = 'Cargando usuarios...';

  try {
    const res = await fetch('/api/usuarios');
    const data = await res.json();

    if (!res.ok) {
      listaUsuarios.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando usuarios'}</div>`;
      return;
    }

    if (!data.usuarios?.length) {
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
        if (!usuario) return;

        usuarioIdAdmin.value = usuario.id;
        usuarioNombreAdmin.value = usuario.nombre_usuario || '';
        usuarioEmailAdmin.value = usuario.email || '';
        usuarioRolAdmin.value = usuario.rol || '';
        usuarioPasswordAdmin.value = usuario.password || '';
        usuarioActivoAdmin.checked = !!usuario.activo;

        textoSinUsuarioSeleccionado.classList.add('oculto');
        formEditarUsuario.classList.remove('oculto');
      });
    });
  } catch (error) {
    listaUsuarios.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevoUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminNuevoUsuarioResultado, '', 'Creando usuario...');

  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        cliente_id: Number(nuevoUsuarioCliente.value),
        nombre_usuario: nuevoUsuarioNombre.value.trim(),
        email: nuevoUsuarioEmail.value.trim(),
        password: nuevoUsuarioPassword.value.trim(),
        rol: nuevoUsuarioRol.value,
        activo: nuevoUsuarioActivo.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminNuevoUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible crear usuario'}`);
      return;
    }

    formNuevoUsuario.reset();
    nuevoUsuarioActivo.checked = true;

    setResultado(adminNuevoUsuarioResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarUsuariosAdmin();
  } catch (error) {
    setResultado(adminNuevoUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  setResultado(adminUsuarioResultado, '', 'Guardando usuario...');

  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'actualizar',
        id: Number(usuarioIdAdmin.value),
        password: usuarioPasswordAdmin.value.trim(),
        activo: usuarioActivoAdmin.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible guardar usuario'}`);
      return;
    }

    setResultado(adminUsuarioResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarUsuariosAdmin();
  } catch (error) {
    setResultado(adminUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});