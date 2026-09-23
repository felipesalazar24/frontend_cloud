// app/src/ms/users.ts

const BASE_URL = 'http://localhost:8084/api/v1/bff/web/users';

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
  }
  return {};
}

export async function createUser(user: any) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(), 
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    let message = 'Error creando usuario';
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

export async function getUsers() {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    let message = 'Error obteniendo usuarios';
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

// Obtener un usuario por ID
export async function getUserById(id: number | string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    let message = 'Error obteniendo usuario';
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

// Actualizar usuario por ID
export async function updateUser(id: number | string, user: any) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    let message = 'Error actualizando usuario';
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}

// Eliminar usuario por ID
export async function deleteUser(id: number | string) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    let message = 'Error eliminando usuario';
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.status === 204 ? {} : response.json();
}

export async function getUserByEmail(email: string) {
  const response = await fetch(`${BASE_URL}/profile/auth-info?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    let message = 'Error obteniendo información de sesión';
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}