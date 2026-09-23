'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LOGIN_URL = "/api-bff/auth/login";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
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

      const data = await response.json();

      if (data && data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('email', data.email);
        router.push('/profile');
      } else {
        throw new Error('No se recibió un token válido del servidor');
      }
    } catch (err: any) {
      setError(err.message || 'Error en el login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded">
      <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            autoFocus
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded p-2"
            disabled={loading}
          />
        </div>
        <div className="mb-3">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded p-2"
            disabled={loading}
          />
        </div>
        {error && <div className="text-red-600 mb-3 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-[#bc8a5f] text-white font-semibold rounded mt-2"
          disabled={loading}
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>
      <p className="mt-6 text-center">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-[#bc8a5f] underline">
          Crear cuenta
        </a>
      </p>
    </div>
  );
}