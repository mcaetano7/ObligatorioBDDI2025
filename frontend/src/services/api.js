const API_BASE = 'http://localhost:5000'; // Ajusta según tu backend

export async function getMaquinasDisponibles() {
  const res = await fetch('http://localhost:5000/cliente/maquinas/disponibles');
  return res.json();
}

export async function alquilarMaquina(data) {
  const res = await fetch('http://localhost:5000/cliente/alquileres', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getAlquileresByCliente(idCliente) {
  const res = await fetch(`http://localhost:5000/cliente/alquileres-cliente/${idCliente}`);
  return res.json();
}

export async function getIdClienteByUsuario(idUsuario) {
  const res = await fetch(`http://localhost:5000/cliente/id-cliente/${idUsuario}`);
  return res.json();
}