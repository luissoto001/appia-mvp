let session = null;

// elementos
const loginForm = document.getElementById('loginForm');
const loginResultado = document.getElementById('loginResultado');

const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const usuarioInfo = document.getElementById('usuarioInfo');

const menuPrincipal = document.getElementById('menuPrincipal');
const seccionConsulta = document.getElementById('seccionConsulta');
const seccionCreacion = document.getElementById('seccionCreacion');

// botones
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

function volverMenu() {
  seccionConsulta.classList.add('oculto');
  seccionCreacion.classList.add('oculto');
  menuPrincipal.classList.remove('oculto');
}

// LOGIN
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login_email').value;
  const password = document.getElementById('login_password').value;

  loginResultado.innerHTML = 'Validando...';
  loginResultado.classList.remove('oculto');

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    loginResultado.innerHTML = data.error;
    return;
  }

  session = data;

  loginContainer.classList.add('oculto');
  appContainer.classList.remove('oculto');

  usuarioInfo.innerText = `${data.usuario.nombre_usuario} - ${data.cliente.nombre_empresa}`;
});

// CONSULTA
document.getElementById('consultaForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rut_empresa = document.getElementById('rut_empresa_consulta').value;
  const bpi = document.getElementById('bpi_consulta').value;

  const res = await fetch('/api/consultar-ticket', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ rut_empresa, bpi })
  });

  const data = await res.json();

  document.getElementById('resultadoConsulta').innerHTML =
    JSON.stringify(data, null, 2);
  document.getElementById('resultadoConsulta').classList.remove('oculto');
});

// CREAR
document.getElementById('crearForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const body = {
    rut_empresa: document.getElementById('rut_empresa_creacion').value,
    bpi: document.getElementById('bpi_creacion').value,
    tipo_solicitud: document.getElementById('tipo_solicitud').value,
    descripcion: document.getElementById('descripcion_creacion').value
  };

  const res = await fetch('/api/crear-ticket', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(body)
  });

  const data = await res.json();

  document.getElementById('resultadoCreacion').innerHTML =
    JSON.stringify(data, null, 2);
  document.getElementById('resultadoCreacion').classList.remove('oculto');
});