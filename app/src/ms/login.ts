// src/app/ms/login.ts

const LOGIN_URL = "http://localhost:8084/api/v1/bff/web/login";

export async function loginUser({
  email,
  password,
}: { email: string; password: string }) {
  const response = await fetch(LOGIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let message = "Usuario o contraseña incorrectos";
    try {
      const err = await response.json();
      message = err.message || message;
    } catch {}
    throw new Error(message);
  }

  return response.json();
}