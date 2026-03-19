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

// admin base
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

// mensajes
const listaReglas = document.getElementById('listaReglas');
const formEditarRegla = document.getElementById('formEditarRegla');
const formNuevaRegla = document.getElementById('formNuevaRegla');
const adminResultado = document.getElementById('adminResultado');
const adminNuevaReglaResultado = document.getElementById('adminNuevaReglaResultado');
const textoSinSeleccion = document.getElementById('textoSinSeleccion');

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

const nuevaReglaCanal = document.getElementById('nueva_regla_canal');
const nuevaReglaEstado = document.getElementById('nueva_regla_estado');
const nuevaReglaArea = document.getElementById('nueva_regla_area');
const nuevaReglaTipologia = document.getElementById('nueva_regla_tipologia');
const nuevaReglaHorasMin = document.getElementById('nueva_regla_horas_min');
const nuevaReglaHorasMax = document.getElementById('nueva_regla_horas_max');
const nuevaReglaPrioridad = document.getElementById('nueva_regla_prioridad');
const nuevaReglaMensaje = document.getElementById('nueva_regla_mensaje');
const nuevaReglaActivo = document.getElementById('nueva_regla_activo');

// formularios portal
const consultaForm = document.getElementById('consultaForm');
const crearForm = document.getElementById('crearForm');
const resultadoConsulta = document.getElementById('resultadoConsulta');
const resultadoCreacion = document.getElementById('resultadoCreacion');

// navegación principal
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

tabClientes.onclick = () => {
  mostrarTabClientes();
};

tabUsuarios.onclick = () => {
  mostrarTabUsuarios();
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

// reglas
async function cargarReglasAdmin() {
  listaReglas.innerHTML = 'Cargando reglas...';

  try {
    const res = await fetch('/api/obtener-reglas');
    const data = await res.json();

    if (!res.ok) {
      listaReglas.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando reglas'}</div>`;
      return;
    }

    if (!data.reglas || data.reglas.length === 0) {
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
        if (regla) cargarReglaEnFormulario(regla);
      });
    });
  } catch (error) {
    listaReglas.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

function cargarReglaEnFormulario(regla) {
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
  adminResultado.innerHTML = '';
}

// restaurar sesión
document.addEventListener('DOMContentLoaded', () => {
  const sesionGuardada = leerSesion();

  if (sesionGuardada?.usuario && sesionGuardada?.cliente) {
    session = sesionGuardada;
    mostrarAplicacion();
  } else {
    mostrarLogin();
  }
});

// login
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

// editar regla completa
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

// crear regla nueva
formNuevaRegla.addEventListener('submit', async (e) => {
  e.preventDefault();

  adminNuevaReglaResultado.className = 'resultado';
  adminNuevaReglaResultado.classList.remove('oculto', 'estado-ok', 'estado-error');
  adminNuevaReglaResultado.innerHTML = 'Creando regla...';

  try {
    const res = await fetch('/api/crear-regla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      adminNuevaReglaResultado.classList.add('estado-error');
      adminNuevaReglaResultado.innerHTML = `<strong>Error:</strong> ${data.error || 'No fue posible crear la regla'}`;
      return;
    }

    adminNuevaReglaResultado.classList.add('estado-ok');
    adminNuevaReglaResultado.innerHTML = `<strong>OK:</strong> ${data.mensaje}`;

    formNuevaRegla.reset();
    nuevaReglaCanal.value = 'web';
    nuevaReglaPrioridad.value = 1;
    nuevaReglaActivo.checked = true;

    await cargarReglasAdmin();
  } catch (error) {
    adminNuevaReglaResultado.classList.add('estado-error');
    adminNuevaReglaResultado.innerHTML = `<strong>Error:</strong> ${error.message}`;
  }
});