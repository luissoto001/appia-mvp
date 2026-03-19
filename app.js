let session = null;

// elementos login
const loginForm = document.getElementById('loginForm');
const loginResultado = document.getElementById('loginResultado');
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const usuarioInfo = document.getElementById('usuarioInfo');

// elementos vistas
const menuPrincipal = document.getElementById('menuPrincipal');
const seccionConsulta = document.getElementById('seccionConsulta');
const seccionCreacion = document.getElementById('seccionCreacion');

// info cliente
const clienteNombre = document.getElementById('clienteNombre');
const clienteRut = document.getElementById('clienteRut');
const clienteNombreConsulta = document.getElementById('clienteNombreConsulta');
const clienteRutConsulta = document.getElementById('clienteRutConsulta');
const clienteNombreCreacion = document.getElementById('clienteNombreCreacion');
const clienteRutCreacion = document.getElementById('clienteRutCreacion');

// botones navegación
document.getElementById('btnMostrarConsulta').onclick = () => {
  menuPrincipal.classList.add('oculto');
  seccionConsulta.classList.remove('oculto');
};

document.getElementById('btnMostrarCreacion').onclick = () => {
  menuPrincipal.classList.add('oculto');
  seccionCreacion.classList.remove('oculto');
};

document.getElementById('btnVolverConsulta').onclick = volverMenu;
document.getElementById('btnVolverCreacion').onclick = volverMenu;

// formularios
const consultaForm = document.getElementById('consultaForm');
const crearForm = document.getElementById('crearForm');

const resultadoConsulta = document.getElementById('resultadoConsulta');
const resultadoCreacion = document.getElementById('resultadoCreacion');

function volverMenu() {
  seccionConsulta.classList.add('oculto');
  seccionCreacion.classList.add('oculto');
  menuPrincipal.classList.remove('oculto');
}

function cargarDatosClienteEnPantalla() {
  if (!session?.cliente) return;

  const nombre = session.cliente.nombre_empresa;
  const rut = session.cliente.rut_empresa;

  clienteNombre.innerText = nombre;
  clienteRut.innerText = rut;

  clienteNombreConsulta.innerText = nombre;
  clienteRutConsulta.innerText = rut;

  clienteNombreCreacion.innerText = nombre;
  clienteRutCreacion.innerText = rut;
}

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

    loginContainer.classList.add('oculto');
    appContainer.classList.remove('oculto');

    usuarioInfo.innerText = `${data.usuario.nombre_usuario} - ${data.cliente.nombre_empresa} - ${data.cliente.rut_empresa}`;
    cargarDatosClienteEnPantalla();
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