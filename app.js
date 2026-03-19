const APP_VERSION = '0.4.0';

let session = null;
let chartEstados = null;
let chartTipologias = null;
let ultimoDetalleReportes = [];

// Login / layout
const loginForm = document.getElementById('loginForm');
const loginResultado = document.getElementById('loginResultado');
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const usuarioInfo = document.getElementById('usuarioInfo');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const loginVersion = document.getElementById('loginVersion');

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
const modoConsulta = document.getElementById('modo_consulta');
const campoConsultaBpi = document.getElementById('campoConsultaBpi');
const campoConsultaTicket = document.getElementById('campoConsultaTicket');
const bpiConsulta = document.getElementById('bpi_consulta');
const ticketConsulta = document.getElementById('ticket_consulta');

// Admin base
const btnMostrarAdmin = document.getElementById('btnMostrarAdmin');
const adminNombre = document.getElementById('adminNombre');
const adminEmail = document.getElementById('adminEmail');
const adminRol = document.getElementById('adminRol');

// Tabs
const tabMensajes = document.getElementById('tabMensajes');
const tabClientes = document.getElementById('tabClientes');
const tabUsuarios = document.getElementById('tabUsuarios');
const tabReportes = document.getElementById('tabReportes');

const adminMensajesPanel = document.getElementById('adminMensajesPanel');
const adminClientesPanel = document.getElementById('adminClientesPanel');
const adminUsuariosPanel = document.getElementById('adminUsuariosPanel');
const adminReportesPanel = document.getElementById('adminReportesPanel');

// Buscadores admin
const buscarReglas = document.getElementById('buscarReglas');
const buscarClientes = document.getElementById('buscarClientes');
const buscarServicios = document.getElementById('buscarServicios');
const buscarUsuarios = document.getElementById('buscarUsuarios');

// Paginación clientes
const btnClientesPrev = document.getElementById('btnClientesPrev');
const btnClientesNext = document.getElementById('btnClientesNext');
const clientesPaginaInfo = document.getElementById('clientesPaginaInfo');

// Paginación usuarios
const btnUsuariosPrev = document.getElementById('btnUsuariosPrev');
const btnUsuariosNext = document.getElementById('btnUsuariosNext');
const usuariosPaginaInfo = document.getElementById('usuariosPaginaInfo');

// Paginación servicios
const btnServiciosPrev = document.getElementById('btnServiciosPrev');
const btnServiciosNext = document.getElementById('btnServiciosNext');
const serviciosPaginaInfo = document.getElementById('serviciosPaginaInfo');

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

// Reportes
const kpiTotalTickets = document.getElementById('kpiTotalTickets');
const kpiAbiertos = document.getElementById('kpiAbiertos');
const kpiCerrados = document.getElementById('kpiCerrados');
const kpiClientesConTickets = document.getElementById('kpiClientesConTickets');
const reportePorEstado = document.getElementById('reportePorEstado');
const reportePorTipologia = document.getElementById('reportePorTipologia');
const reportePorCliente = document.getElementById('reportePorCliente');
const reporteRecientes = document.getElementById('reporteRecientes');
const adminReporteResultado = document.getElementById('adminReporteResultado');
const detalleReportesVacio = document.getElementById('detalleReportesVacio');
const detalleReportesLista = document.getElementById('detalleReportesLista');
const btnCerrarDetalleReportes = document.getElementById('btnCerrarDetalleReportes');
const btnExportarCsv = document.getElementById('btnExportarCsv');

const kpiCardTotal = document.getElementById('kpiCardTotal');
const kpiCardAbiertos = document.getElementById('kpiCardAbiertos');
const kpiCardCerrados = document.getElementById('kpiCardCerrados');

const filtroFechaDesde = document.getElementById('filtroFechaDesde');
const filtroFechaHasta = document.getElementById('filtroFechaHasta');
const filtroCliente = document.getElementById('filtroCliente');
const filtroEstado = document.getElementById('filtroEstado');
const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');

const chartEstadosCanvas = document.getElementById('chartEstados');
const chartTipologiasCanvas = document.getElementById('chartTipologias');

let clienteSeleccionadoId = null;

// cachés
let reglasCache = [];
let clientesCache = [];
let serviciosCache = [];
let usuariosCache = [];

let clientesPagination = {
  page: 1,
  limit: 20,
  total: 0,
  total_pages: 1,
  has_prev: false,
  has_next: false
};

let usuariosPagination = {
  page: 1,
  limit: 20,
  total: 0,
  total_pages: 1,
  has_prev: false,
  has_next: false
};

let serviciosPagination = {
  page: 1,
  limit: 20,
  total: 0,
  total_pages: 1,
  has_prev: false,
  has_next: false
};

let clientesSearchTimer = null;
let usuariosSearchTimer = null;
let serviciosSearchTimer = null;

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
  await cargarClientesAdmin(1);
  await cargarClientesParaSelectUsuario();
};

tabUsuarios.onclick = async () => {
  mostrarTabUsuarios();
  await cargarUsuariosAdmin(1);
  await cargarClientesParaSelectUsuario();
};

tabReportes.onclick = async () => {
  mostrarTabReportes();
  await cargarClientesFiltro();
  await cargarReportesAdmin();
};

modoConsulta.addEventListener('change', actualizarModoConsulta);
btnCerrarDetalleReportes.onclick = limpiarDetalleReportes;
btnAplicarFiltros.onclick = () => cargarReportesAdmin();
btnExportarCsv.onclick = () => exportarDetalleCsv();

kpiCardTotal.onclick = () => cargarDetalleReportes('todos');
kpiCardAbiertos.onclick = () => cargarDetalleReportes('abiertos');
kpiCardCerrados.onclick = () => cargarDetalleReportes('cerrados');

buscarReglas.addEventListener('input', () => renderReglas(reglasCache));

buscarClientes.addEventListener('input', () => {
  clearTimeout(clientesSearchTimer);
  clientesSearchTimer = setTimeout(() => {
    cargarClientesAdmin(1);
  }, 350);
});

buscarUsuarios.addEventListener('input', () => {
  clearTimeout(usuariosSearchTimer);
  usuariosSearchTimer = setTimeout(() => {
    cargarUsuariosAdmin(1);
  }, 350);
});

buscarServicios.addEventListener('input', () => {
  clearTimeout(serviciosSearchTimer);
  serviciosSearchTimer = setTimeout(() => {
    if (clienteSeleccionadoId) {
      cargarServiciosCliente(clienteSeleccionadoId, 1);
    }
  }, 350);
});

btnClientesPrev.addEventListener('click', async () => {
  if (clientesPagination.has_prev) {
    await cargarClientesAdmin(clientesPagination.page - 1);
  }
});

btnClientesNext.addEventListener('click', async () => {
  if (clientesPagination.has_next) {
    await cargarClientesAdmin(clientesPagination.page + 1);
  }
});

btnUsuariosPrev.addEventListener('click', async () => {
  if (usuariosPagination.has_prev) {
    await cargarUsuariosAdmin(usuariosPagination.page - 1);
  }
});

btnUsuariosNext.addEventListener('click', async () => {
  if (usuariosPagination.has_next) {
    await cargarUsuariosAdmin(usuariosPagination.page + 1);
  }
});

btnServiciosPrev.addEventListener('click', async () => {
  if (clienteSeleccionadoId && serviciosPagination.has_prev) {
    await cargarServiciosCliente(clienteSeleccionadoId, serviciosPagination.page - 1);
  }
});

btnServiciosNext.addEventListener('click', async () => {
  if (clienteSeleccionadoId && serviciosPagination.has_next) {
    await cargarServiciosCliente(clienteSeleccionadoId, serviciosPagination.page + 1);
  }
});

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
  adminReportesPanel.classList.add('oculto');
}

function mostrarTabClientes() {
  adminMensajesPanel.classList.add('oculto');
  adminClientesPanel.classList.remove('oculto');
  adminUsuariosPanel.classList.add('oculto');
  adminReportesPanel.classList.add('oculto');
}

function mostrarTabUsuarios() {
  adminMensajesPanel.classList.add('oculto');
  adminClientesPanel.classList.add('oculto');
  adminUsuariosPanel.classList.remove('oculto');
  adminReportesPanel.classList.add('oculto');
}

function mostrarTabReportes() {
  adminMensajesPanel.classList.add('oculto');
  adminClientesPanel.classList.add('oculto');
  adminUsuariosPanel.classList.add('oculto');
  adminReportesPanel.classList.remove('oculto');
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
  actualizarModoConsulta();

  if (loginVersion) {
    loginVersion.innerText = `Versión ${APP_VERSION}`;
  }
}

function mostrarLogin() {
  appContainer.classList.add('oculto');
  loginContainer.classList.remove('oculto');
  loginForm.reset();
  loginResultado.classList.add('oculto');
  loginResultado.innerHTML = '';
  volverMenu();

  if (loginVersion) {
    loginVersion.innerText = `Versión ${APP_VERSION}`;
  }
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

function normalizarTexto(valor) {
  return String(valor || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function coincideBusqueda(textoBase, textoBusqueda) {
  return normalizarTexto(textoBase).includes(normalizarTexto(textoBusqueda));
}

function obtenerFiltrosReportes() {
  return {
    fecha_desde: filtroFechaDesde.value || '',
    fecha_hasta: filtroFechaHasta.value || '',
    cliente_id: filtroCliente.value || '',
    estado: filtroEstado.value || ''
  };
}

function construirQueryParams(obj) {
  const params = new URLSearchParams();

  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') {
      params.set(key, value);
    }
  });

  return params.toString();
}

function actualizarModoConsulta() {
  const modo = modoConsulta.value;

  if (modo === 'bpi') {
    campoConsultaBpi.classList.remove('oculto');
    campoConsultaTicket.classList.add('oculto');
    bpiConsulta.required = true;
    ticketConsulta.required = false;
  } else if (modo === 'ticket') {
    campoConsultaBpi.classList.add('oculto');
    campoConsultaTicket.classList.remove('oculto');
    bpiConsulta.required = false;
    ticketConsulta.required = true;
  } else {
    campoConsultaBpi.classList.add('oculto');
    campoConsultaTicket.classList.add('oculto');
    bpiConsulta.required = false;
    ticketConsulta.required = false;
  }
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarRut(rut) {
  return /^\d{7,8}-[\dkK]$/.test(rut);
}

function validarBpi(bpi) {
  return /^BPI[0-9A-Za-z]+$/.test(bpi);
}

function sumarMinutos(fechaBase, minutos) {
  return new Date(new Date(fechaBase).getTime() + minutos * 60000);
}

function formatearHora(fecha) {
  return fecha.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function construirTimelineDemo(ticket) {
  const inicio = new Date(ticket.created_at);
  const eventos = [
    {
      hora: formatearHora(inicio),
      titulo: 'Ticket creado',
      detalle: `Ticket ${ticket.ticket_numero} ingresado`
    }
  ];

  const asignado = sumarMinutos(inicio, 20);
  eventos.push({
    hora: formatearHora(asignado),
    titulo: 'Asignado a especialistas',
    detalle: `Grupo resolutor: ${ticket.area_resolutora}`
  });

  const analisis = sumarMinutos(inicio, 90);
  eventos.push({
    hora: formatearHora(analisis),
    titulo: 'En análisis',
    detalle: `Tipología: ${ticket.tipologia}`
  });

  if (ticket.estado === 'Ingresado') {
    return { actual: 'Ticket ingresado', eventos, actualIndex: 0 };
  }

  if (ticket.estado === 'En proceso') {
    return { actual: 'En proceso', eventos, actualIndex: 2 };
  }

  if (ticket.estado === 'Derivado') {
    const derivado = sumarMinutos(inicio, 150);
    eventos.push({
      hora: formatearHora(derivado),
      titulo: 'Ticket derivado',
      detalle: 'Escalado a nueva célula de atención'
    });
    return { actual: 'Derivado', eventos, actualIndex: 3 };
  }

  if (ticket.estado === 'Resuelto' || ticket.estado === 'Cerrado') {
    const cierre = sumarMinutos(inicio, 240);
    eventos.push({
      hora: formatearHora(cierre),
      titulo: ticket.estado === 'Cerrado' ? 'Ticket cerrado' : 'Ticket resuelto',
      detalle: `Estado final: ${ticket.estado}`
    });
    return { actual: ticket.estado, eventos, actualIndex: 3 };
  }

  return { actual: ticket.estado, eventos, actualIndex: eventos.length - 1 };
}

function renderTimelineHorizontal(ticket) {
  const timeline = construirTimelineDemo(ticket);

  const html = timeline.eventos.map((evento, index) => {
    const estadoClase = index <= timeline.actualIndex ? 'timeline-step activo' : 'timeline-step';
    return `
      <div class="${estadoClase}">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-hour">${evento.hora}</div>
          <div class="timeline-title">${evento.titulo}</div>
          <div class="timeline-detail">${evento.detalle}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="timeline-wrapper">
      <div class="timeline-status"><strong>Estado actual:</strong> ${timeline.actual}</div>
      <div class="timeline-horizontal">
        ${html}
      </div>
    </div>
  `;
}

function renderTicketIndividual(data) {
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
      ${data.ticket ? renderTimelineHorizontal(data.ticket) : ''}
    `
    : `<div class="resultado-item"><strong>Mensaje:</strong> ${data.mensaje}</div>`;

  return `
    <h3>Consulta exitosa</h3>
    <div class="resultado-item"><strong>Cliente:</strong> ${data.cliente.nombre_empresa}</div>
    ${data.servicio ? `<div class="resultado-item"><strong>Servicio:</strong> ${data.servicio.nombre_servicio}</div>` : ''}
    ${data.servicio ? `<div class="resultado-item"><strong>BPI:</strong> ${data.servicio.bpi}</div>` : ''}
    ${data.servicio ? `<div class="resultado-item"><strong>Dirección:</strong> ${data.servicio.direccion || ''}</div>` : ''}
    ${ticketHtml}
  `;
}

function renderTicketsAbiertos(data) {
  if (!data.tickets || data.tickets.length === 0) {
    return `
      <h3>Tickets abiertos</h3>
      <div class="resultado-item">${data.mensaje}</div>
    `;
  }

  const items = data.tickets.map((ticket) => `
    <div class="ticket-list-item">
      <div class="resultado-item"><strong>Ticket:</strong> ${ticket.ticket_numero}</div>
      <div class="resultado-item"><strong>Estado:</strong> ${ticket.estado}</div>
      <div class="resultado-item"><strong>Área resolutora:</strong> ${ticket.area_resolutora}</div>
      <div class="resultado-item"><strong>Tipología:</strong> ${ticket.tipologia}</div>
      <div class="resultado-item"><strong>BPI:</strong> ${ticket.bpi}</div>
      <div class="resultado-item"><strong>Servicio:</strong> ${ticket.servicio_nombre || 'No disponible'}</div>
      <div class="resultado-item"><strong>Dirección:</strong> ${ticket.servicio_direccion || 'No disponible'}</div>
      <div class="resultado-item"><strong>Descripción:</strong> ${ticket.descripcion || ''}</div>
      <hr>
    </div>
  `).join('');

  return `
    <h3>Tickets abiertos</h3>
    <div class="resultado-item"><strong>Cliente:</strong> ${data.cliente.nombre_empresa}</div>
    <div class="resultado-item"><strong>Total abiertos:</strong> ${data.tickets.length}</div>
    ${items}
  `;
}

function renderBarras(items, tipo) {
  if (!items || items.length === 0) {
    return '<p>Sin datos.</p>';
  }

  const maximo = Math.max(...items.map((i) => i.total), 1);

  return items.map((item) => {
    const porcentaje = Math.round((item.total / maximo) * 100);
    return `
      <button type="button" class="barra-item barra-click" data-tipo="${tipo}" data-valor="${item.nombre}">
        <div class="barra-label">
          <span>${item.nombre}</span>
          <strong>${item.total}</strong>
        </div>
        <div class="barra-track">
          <div class="barra-fill" style="width:${porcentaje}%"></div>
        </div>
      </button>
    `;
  }).join('');
}

function renderRecientes(items) {
  if (!items || items.length === 0) {
    return '<p>Sin tickets recientes.</p>';
  }

  return items.map((ticket) => `
    <div class="ticket-list-item">
      <div class="resultado-item"><strong>${ticket.ticket_numero}</strong> - ${ticket.cliente_nombre}</div>
      <div class="resultado-item">Estado: ${ticket.estado}</div>
      <div class="resultado-item">Tipología: ${ticket.tipologia}</div>
      <div class="resultado-item">BPI: ${ticket.bpi}</div>
      <div class="resultado-item">Fecha: ${new Date(ticket.created_at).toLocaleString()}</div>
      <hr>
    </div>
  `).join('');
}

function renderDetalleReportes(tickets) {
  if (!tickets || tickets.length === 0) {
    return '<p>No hay tickets para este filtro.</p>';
  }

  return tickets.map((ticket) => `
    <div class="detalle-ticket-card">
      <div class="resultado-item"><strong>Ticket:</strong> ${ticket.ticket_numero}</div>
      <div class="resultado-item"><strong>Cliente:</strong> ${ticket.cliente_nombre || 'No disponible'}</div>
      <div class="resultado-item"><strong>Estado:</strong> ${ticket.estado}</div>
      <div class="resultado-item"><strong>Área resolutora:</strong> ${ticket.area_resolutora}</div>
      <div class="resultado-item"><strong>Tipología:</strong> ${ticket.tipologia}</div>
      <div class="resultado-item"><strong>BPI:</strong> ${ticket.bpi}</div>
      <div class="resultado-item"><strong>Descripción:</strong> ${ticket.descripcion || ''}</div>
      ${renderTimelineHorizontal(ticket)}
    </div>
  `).join('');
}

function limpiarDetalleReportes() {
  ultimoDetalleReportes = [];
  detalleReportesLista.innerHTML = '';
  detalleReportesVacio.classList.remove('oculto');
  btnCerrarDetalleReportes.classList.add('oculto');
}

function destruirGraficos() {
  if (chartEstados) {
    chartEstados.destroy();
    chartEstados = null;
  }

  if (chartTipologias) {
    chartTipologias.destroy();
    chartTipologias = null;
  }
}

function renderGraficosReportes(data) {
  destruirGraficos();

  if (!window.Chart) {
    return;
  }

  const etiquetasEstados = (data.por_estado || []).map((i) => i.nombre);
  const valoresEstados = (data.por_estado || []).map((i) => i.total);

  const etiquetasTipologias = (data.por_tipologia || []).map((i) => i.nombre);
  const valoresTipologias = (data.por_tipologia || []).map((i) => i.total);

  chartEstados = new Chart(chartEstadosCanvas, {
    type: 'doughnut',
    data: {
      labels: etiquetasEstados,
      datasets: [
        {
          data: valoresEstados,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });

  chartTipologias = new Chart(chartTipologiasCanvas, {
    type: 'bar',
    data: {
      labels: etiquetasTipologias,
      datasets: [
        {
          data: valoresTipologias,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    }
  });
}

function exportarCsvDesdeTickets(tickets, nombreArchivo = 'appia-reportes.csv') {
  if (!tickets || tickets.length === 0) {
    alert('No hay datos para exportar.');
    return;
  }

  const headers = [
    'ticket_numero',
    'cliente_nombre',
    'cliente_id',
    'estado',
    'tipologia',
    'bpi',
    'area_resolutora',
    'descripcion',
    'created_at'
  ];

  const escapeCsv = (value) => {
    const text = String(value ?? '');
    return `"${text.replace(/"/g, '""')}"`;
  };

  const rows = tickets.map((ticket) =>
    headers.map((header) => escapeCsv(ticket[header])).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportarDetalleCsv() {
  if (ultimoDetalleReportes.length > 0) {
    exportarCsvDesdeTickets(ultimoDetalleReportes, 'appia-detalle-reportes.csv');
    return;
  }

  cargarDetalleReportes('todos', '', true);
}

async function cargarDetalleReportes(filtro, valor = '', exportarLuego = false) {
  detalleReportesVacio.classList.add('oculto');
  btnCerrarDetalleReportes.classList.remove('oculto');
  detalleReportesLista.innerHTML = 'Cargando detalle...';

  try {
    const filtros = obtenerFiltrosReportes();
    const queryString = construirQueryParams({
      modo: 'detalle',
      filtro,
      valor,
      ...filtros
    });

    const res = await fetch(`/api/reportes?${queryString}`);
    const data = await res.json();

    if (!res.ok) {
      detalleReportesLista.innerHTML = `<div class="resultado estado-error">${data.error || 'No fue posible cargar el detalle'}</div>`;
      return;
    }

    ultimoDetalleReportes = data.tickets || [];
    detalleReportesLista.innerHTML = renderDetalleReportes(ultimoDetalleReportes);

    if (exportarLuego) {
      exportarCsvDesdeTickets(ultimoDetalleReportes, 'appia-reportes-filtrados.csv');
    }
  } catch (error) {
    detalleReportesLista.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

// RENDER helpers admin
function renderReglas(reglas) {
  const filtro = buscarReglas.value.trim();

  const filtradas = !filtro
    ? reglas
    : reglas.filter((regla) =>
        coincideBusqueda(
          `${regla.estado_ticket} ${regla.area_resolutora} ${regla.tipologia} ${regla.canal} ${regla.mensaje}`,
          filtro
        )
      );

  if (!filtradas.length) {
    listaReglas.innerHTML = '<p>No hay reglas que coincidan con la búsqueda.</p>';
    return;
  }

  listaReglas.innerHTML = filtradas.map((regla) => `
    <button type="button" class="regla-item" data-id="${regla.id}">
      <strong>#${regla.id}</strong> - ${regla.estado_ticket}
      <small>${regla.area_resolutora} | ${regla.tipologia} | ${regla.horas_minimas}-${regla.horas_maximas} hrs | prioridad ${regla.prioridad} | ${regla.activo ? 'Activa' : 'Inactiva'}</small>
    </button>
  `).join('');

  document.querySelectorAll('.regla-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const regla = reglasCache.find((r) => r.id === Number(btn.dataset.id));
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
    });
  });
}

function renderClientes(clientes) {
  if (!clientes.length) {
    listaClientes.innerHTML = '<p>No hay clientes para esta búsqueda.</p>';
    return;
  }

  listaClientes.innerHTML = clientes.map((cliente) => `
    <button type="button" class="regla-item cliente-item" data-id="${cliente.id}">
      <strong>#${cliente.id}</strong> - ${cliente.nombre_empresa}
      <small>${cliente.rut_empresa} | ${cliente.activo ? 'Activo' : 'Inactivo'} | ${cliente.enlistado ? 'Enlistado' : 'No enlistado'}</small>
    </button>
  `).join('');

  document.querySelectorAll('.cliente-item').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const cliente = clientesCache.find((c) => c.id === Number(btn.dataset.id));
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

      buscarServicios.value = '';
      await cargarServiciosCliente(cliente.id, 1);
    });
  });
}

function actualizarPaginacionClientes() {
  clientesPaginaInfo.innerText = `Página ${clientesPagination.page} de ${clientesPagination.total_pages} · ${clientesPagination.total} resultados`;
  btnClientesPrev.disabled = !clientesPagination.has_prev;
  btnClientesNext.disabled = !clientesPagination.has_next;
}

function renderServicios(servicios) {
  if (!servicios.length) {
    listaServiciosCliente.innerHTML = '<p>No hay servicios para esta búsqueda.</p>';
    return;
  }

  listaServiciosCliente.innerHTML = servicios.map((servicio) => `
    <button type="button" class="regla-item servicio-item" data-id="${servicio.id}">
      <strong>${servicio.bpi}</strong> - ${servicio.nombre_servicio}
      <small>${servicio.direccion || 'Sin dirección'} | ${servicio.activo ? 'Activo' : 'Inactivo'}</small>
    </button>
  `).join('');

  document.querySelectorAll('.servicio-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const servicio = serviciosCache.find((s) => s.id === Number(btn.dataset.id));
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
}

function actualizarPaginacionServicios() {
  serviciosPaginaInfo.innerText = `Página ${serviciosPagination.page} de ${serviciosPagination.total_pages} · ${serviciosPagination.total} resultados`;
  btnServiciosPrev.disabled = !serviciosPagination.has_prev;
  btnServiciosNext.disabled = !serviciosPagination.has_next;
}

function renderUsuarios(usuarios) {
  if (!usuarios.length) {
    listaUsuarios.innerHTML = '<p>No hay usuarios para esta búsqueda.</p>';
    return;
  }

  listaUsuarios.innerHTML = usuarios.map((usuario) => `
    <button type="button" class="regla-item usuario-item" data-id="${usuario.id}">
      <strong>#${usuario.id}</strong> - ${usuario.nombre_usuario}
      <small>${usuario.email} | ${usuario.rol} | ${usuario.activo ? 'Activo' : 'Inactivo'}</small>
    </button>
  `).join('');

  document.querySelectorAll('.usuario-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const usuario = usuariosCache.find((u) => u.id === Number(btn.dataset.id));
      if (!usuario) return;

      usuarioIdAdmin.value = usuario.id;
      usuarioNombreAdmin.value = usuario.nombre_usuario || '';
      usuarioEmailAdmin.value = usuario.email || '';
      usuarioRolAdmin.value = usuario.rol || '';
      usuarioPasswordAdmin.value = '';
      usuarioActivoAdmin.checked = !!usuario.activo;

      textoSinUsuarioSeleccionado.classList.add('oculto');
      formEditarUsuario.classList.remove('oculto');
    });
  });
}

function actualizarPaginacionUsuarios() {
  usuariosPaginaInfo.innerText = `Página ${usuariosPagination.page} de ${usuariosPagination.total_pages} · ${usuariosPagination.total} resultados`;
  btnUsuariosPrev.disabled = !usuariosPagination.has_prev;
  btnUsuariosNext.disabled = !usuariosPagination.has_next;
}

// LOGIN
document.addEventListener('DOMContentLoaded', () => {
  if (loginVersion) {
    loginVersion.innerText = `Versión ${APP_VERSION}`;
  }

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

  const modo = modoConsulta.value;
  setResultado(resultadoConsulta, '', 'Consultando...');

  try {
    let body = {
      rut_empresa: session.cliente.rut_empresa
    };

    if (modo === 'bpi') {
      const bpi = bpiConsulta.value.trim();
      if (!validarBpi(bpi)) {
        setResultado(resultadoConsulta, 'estado-error', '<strong>Error:</strong> El BPI debe comenzar con "BPI".');
        return;
      }
      body.action = 'consultar_por_bpi';
      body.bpi = bpi;
    } else if (modo === 'ticket') {
      body.action = 'consultar_por_ticket';
      body.ticket_numero = ticketConsulta.value.trim();
    } else {
      body.action = 'consultar_abiertos_cliente';
    }

    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(resultadoConsulta, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible consultar'}`);
      return;
    }

    if (modo === 'abiertos') {
      setResultado(resultadoConsulta, 'estado-ok', renderTicketsAbiertos(data));
    } else {
      setResultado(resultadoConsulta, 'estado-ok', renderTicketIndividual(data));
    }
  } catch (error) {
    setResultado(resultadoConsulta, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

crearForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const bpi = document.getElementById('bpi_creacion').value.trim();
  if (!validarBpi(bpi)) {
    setResultado(resultadoCreacion, 'estado-error', '<strong>Error:</strong> El BPI debe comenzar con "BPI".');
    return;
  }

  setResultado(resultadoCreacion, '', 'Creando ticket...');

  try {
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        rut_empresa: session.cliente.rut_empresa,
        bpi,
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

    reglasCache = data.reglas || [];
    renderReglas(reglasCache);
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
async function cargarClientesAdmin(page = 1) {
  listaClientes.innerHTML = 'Cargando clientes...';

  try {
    const q = buscarClientes.value.trim();
    const res = await fetch(`/api/clientes?q=${encodeURIComponent(q)}&page=${page}&limit=20`);
    const data = await res.json();

    if (!res.ok) {
      listaClientes.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando clientes'}</div>`;
      return;
    }

    clientesCache = data.clientes || [];
    clientesPagination = data.pagination || clientesPagination;

    renderClientes(clientesCache);
    actualizarPaginacionClientes();
  } catch (error) {
    listaClientes.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevoCliente.addEventListener('submit', async (e) => {
  e.preventDefault();

  const rut = nuevoClienteRut.value.trim();
  if (!validarRut(rut)) {
    setResultado(adminNuevoClienteResultado, 'estado-error', '<strong>Error:</strong> El RUT debe venir con formato 12345678-9.');
    return;
  }

  setResultado(adminNuevoClienteResultado, '', 'Creando cliente...');

  try {
    const res = await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        nombre_empresa: nuevoClienteNombre.value.trim(),
        rut_empresa: rut,
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
    await cargarClientesAdmin(1);
    await cargarClientesParaSelectUsuario();
  } catch (error) {
    setResultado(adminNuevoClienteResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarCliente.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!clienteActivoAdmin.checked) {
    const confirmado = confirm('Vas a desactivar este cliente. ¿Deseas continuar?');
    if (!confirmado) return;
  }

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
    await cargarClientesAdmin(clientesPagination.page);
    await cargarClientesParaSelectUsuario();
  } catch (error) {
    setResultado(adminClienteResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// SERVICIOS
async function cargarServiciosCliente(clienteId, page = 1) {
  listaServiciosCliente.innerHTML = 'Cargando servicios...';
  formEditarServicio.classList.add('oculto');
  textoSinServicioSeleccionado.classList.remove('oculto');

  try {
    const q = buscarServicios.value.trim();
    const res = await fetch(`/api/servicios?cliente_id=${clienteId}&q=${encodeURIComponent(q)}&page=${page}&limit=20`);
    const data = await res.json();

    if (!res.ok) {
      listaServiciosCliente.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando servicios'}</div>`;
      return;
    }

    serviciosCache = data.servicios || [];
    serviciosPagination = data.pagination || serviciosPagination;

    renderServicios(serviciosCache);
    actualizarPaginacionServicios();
  } catch (error) {
    listaServiciosCliente.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevoServicio.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!clienteSeleccionadoId) return;

  const bpi = nuevoServicioBpi.value.trim();
  if (!validarBpi(bpi)) {
    setResultado(adminNuevoServicioResultado, 'estado-error', '<strong>Error:</strong> El BPI debe comenzar con "BPI".');
    return;
  }

  setResultado(adminNuevoServicioResultado, '', 'Creando servicio/BPI...');

  try {
    const res = await fetch('/api/servicios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        cliente_id: clienteSeleccionadoId,
        bpi,
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
    await cargarServiciosCliente(clienteSeleccionadoId, 1);
  } catch (error) {
    setResultado(adminNuevoServicioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarServicio.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!servicioActivoAdmin.checked) {
    const confirmado = confirm('Vas a desactivar este servicio/BPI. ¿Deseas continuar?');
    if (!confirmado) return;
  }

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
    await cargarServiciosCliente(clienteSeleccionadoId, serviciosPagination.page);
  } catch (error) {
    setResultado(adminServicioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// USUARIOS
async function cargarClientesParaSelectUsuario() {
  try {
    const res = await fetch('/api/clientes?mode=select');
    const data = await res.json();

    if (!res.ok || !data.clientes) return;

    nuevoUsuarioCliente.innerHTML = data.clientes
      .map((cliente) => `<option value="${cliente.id}">${cliente.nombre_empresa} (${cliente.rut_empresa})</option>`)
      .join('');
  } catch (error) {
    console.error(error);
  }
}

async function cargarClientesFiltro() {
  try {
    const res = await fetch('/api/clientes?mode=select');
    const data = await res.json();

    if (!res.ok || !data.clientes) {
      filtroCliente.innerHTML = '<option value="">Todos</option>';
      return;
    }

    filtroCliente.innerHTML =
      '<option value="">Todos</option>' +
      data.clientes
        .map((cliente) => `<option value="${cliente.id}">${cliente.nombre_empresa}</option>`)
        .join('');
  } catch (error) {
    console.error(error);
    filtroCliente.innerHTML = '<option value="">Todos</option>';
  }
}

async function cargarUsuariosAdmin(page = 1) {
  listaUsuarios.innerHTML = 'Cargando usuarios...';

  try {
    const q = buscarUsuarios.value.trim();
    const res = await fetch(`/api/usuarios?q=${encodeURIComponent(q)}&page=${page}&limit=20`);
    const data = await res.json();

    if (!res.ok) {
      listaUsuarios.innerHTML = `<div class="resultado estado-error">${data.error || 'Error cargando usuarios'}</div>`;
      return;
    }

    usuariosCache = data.usuarios || [];
    usuariosPagination = data.pagination || usuariosPagination;

    renderUsuarios(usuariosCache);
    actualizarPaginacionUsuarios();
  } catch (error) {
    listaUsuarios.innerHTML = `<div class="resultado estado-error">${error.message}</div>`;
  }
}

formNuevoUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = nuevoUsuarioEmail.value.trim();
  if (!validarEmail(email)) {
    setResultado(adminNuevoUsuarioResultado, 'estado-error', '<strong>Error:</strong> El email no tiene un formato válido.');
    return;
  }

  if (nuevoUsuarioPassword.value.trim().length < 4) {
    setResultado(adminNuevoUsuarioResultado, 'estado-error', '<strong>Error:</strong> La contraseña debe tener al menos 4 caracteres.');
    return;
  }

  setResultado(adminNuevoUsuarioResultado, '', 'Creando usuario...');

  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'crear',
        cliente_id: Number(nuevoUsuarioCliente.value),
        nombre_usuario: nuevoUsuarioNombre.value.trim(),
        email,
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
    await cargarUsuariosAdmin(1);
  } catch (error) {
    setResultado(adminNuevoUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

formEditarUsuario.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nuevaPassword = usuarioPasswordAdmin.value.trim();

  if (!usuarioActivoAdmin.checked) {
    const confirmado = confirm('Vas a desactivar este usuario. ¿Deseas continuar?');
    if (!confirmado) return;
  }

  if (nuevaPassword !== '' && nuevaPassword.length < 4) {
    setResultado(adminUsuarioResultado, 'estado-error', '<strong>Error:</strong> La nueva contraseña debe tener al menos 4 caracteres.');
    return;
  }

  setResultado(adminUsuarioResultado, '', 'Guardando usuario...');

  try {
    const res = await fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'actualizar',
        id: Number(usuarioIdAdmin.value),
        password: nuevaPassword,
        activo: usuarioActivoAdmin.checked
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setResultado(adminUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible guardar usuario'}`);
      return;
    }

    usuarioPasswordAdmin.value = '';
    setResultado(adminUsuarioResultado, 'estado-ok', `<strong>OK:</strong> ${data.mensaje}`);
    await cargarUsuariosAdmin(usuariosPagination.page);
  } catch (error) {
    setResultado(adminUsuarioResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
});

// REPORTES
async function cargarReportesAdmin() {
  setResultado(adminReporteResultado, '', 'Cargando reportería...');
  adminReporteResultado.classList.add('oculto');
  limpiarDetalleReportes();

  try {
    const filtros = obtenerFiltrosReportes();
    const queryString = construirQueryParams(filtros);
    const res = await fetch(`/api/reportes?${queryString}`);
    const data = await res.json();

    if (!res.ok) {
      setResultado(adminReporteResultado, 'estado-error', `<strong>Error:</strong> ${data.error || 'No fue posible cargar reportes'}`);
      return;
    }

    kpiTotalTickets.innerText = data.resumen.total_tickets;
    kpiAbiertos.innerText = data.resumen.abiertos;
    kpiCerrados.innerText = data.resumen.cerrados;
    kpiClientesConTickets.innerText = data.resumen.clientes_con_tickets;

    reportePorEstado.innerHTML = renderBarras(data.por_estado, 'estado');
    reportePorTipologia.innerHTML = renderBarras(data.por_tipologia, 'tipologia');
    reportePorCliente.innerHTML = renderBarras(data.por_cliente, 'cliente');
    reporteRecientes.innerHTML = renderRecientes(data.recientes);

    renderGraficosReportes(data);

    document.querySelectorAll('.barra-click').forEach((btn) => {
      btn.addEventListener('click', () => {
        cargarDetalleReportes(btn.dataset.tipo, btn.dataset.valor);
      });
    });

    adminReporteResultado.classList.add('oculto');
  } catch (error) {
    setResultado(adminReporteResultado, 'estado-error', `<strong>Error:</strong> ${error.message}`);
  }
}