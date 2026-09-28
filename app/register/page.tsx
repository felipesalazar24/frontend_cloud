'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const COUNTRY_CITY = {
  Argentina: [
    'Bahía Blanca',
    'Buenos Aires',
    'Catamarca',
    'Comodoro Rivadavia',
    'Concordia',
    'Córdoba',
    'Corrientes',
    'Formosa',
    'La Plata',
    'La Rioja',
    'Mar del Plata',
    'Mendoza',
    'Neuquén',
    'Paraná',
    'Posadas',
    'Resistencia',
    'Río Cuarto',
    'Rosario',
    'Salta',
    'San Juan',
    'San Luis',
    'San Miguel de Tucumán',
    'Santa Fe',
    'Santiago del Estero',
    'Trelew',
    'Ushuaia',
    'Viedma'
  ],

  Chile: [
    'Antofagasta',
    'Arica',
    'Calama',
    'Chillán',
    'Concepción',
    'Copiapó',
    'Coquimbo',
    'Curicó',
    'Iquique',
    'La Serena',
    'Los Ángeles',
    'Osorno',
    'Puerto Montt',
    'Punta Arenas',
    'Quillota',
    'Rancagua',
    'San Antonio',
    'Santiago',
    'Talca',
    'Temuco',
    'Valdivia',
    'Valparaíso',
    'Viña del Mar'
  ],

  México: [
    'Acapulco',
    'Aguascalientes',
    'Cancún',
    'Celaya',
    'Chihuahua',
    'Ciudad Juárez',
    'Ciudad Obregón',
    'Ciudad de México',
    'Culiacán',
    'Durango',
    'Guadalajara',
    'Hermosillo',
    'León',
    'Mazatlán',
    'Mérida',
    'Mexicali',
    'Monterrey',
    'Morelia',
    'Oaxaca',
    'Pachuca',
    'Puebla',
    'Querétaro',
    'Saltillo',
    'San Luis Potosí',
    'Tijuana',
    'Toluca',
    'Tuxtla Gutiérrez',
    'Veracruz',
    'Villahermosa'
  ],

  Perú: [
    'Arequipa',
    'Ayacucho',
    'Cajamarca',
    'Callao',
    'Chiclayo',
    'Chimbote',
    'Cusco',
    'Huancayo',
    'Huánuco',
    'Huaraz',
    'Ica',
    'Juliaca',
    'Lima',
    'Piura',
    'Pucallpa',
    'Puno',
    'Sullana',
    'Tacna',
    'Tarapoto',
    'Trujillo'
  ]
};

const REGISTER_URL = "/api-bff/auth/register";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    addressNumber: '',
    country: '',
    city: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const MIN_PHONE_LENGTH = 8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    if (name === 'country') {
      setForm({
        ...form,
        country: value,
        city: ''
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (
      Object.values(form).some(f => f === '') ||
      form.country === '' ||
      form.city === ''
    ) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    if (!/^\d+$/.test(form.phoneNumber)) {
      setError('El teléfono solo debe contener números');
      return;
    }
    
    if (form.phoneNumber.length < MIN_PHONE_LENGTH) {
      setError(`El teléfono debe tener al menos ${MIN_PHONE_LENGTH} dígitos`);
      return;
    }

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          role: 'user',
          phoneNumber: Number(form.phoneNumber),
          addressNumber: Number(form.addressNumber),
        }),
      });

      if (!response.ok) {
        let message = 'Error en la creación de cuenta';
        try {
          const err = await response.json();
          message = err.message || message;
        } catch {}
        throw new Error(message);
      }

      setSuccess('¡Usuario creado exitosamente!');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Error en la creación');
    }
  };

  const noSpinner = {
    MozAppearance: 'textfield' as const,
    WebkitAppearance: 'none' as const,
    appearance: 'none' as const,
  };

  const availableCities = form.country ? COUNTRY_CITY[form.country as keyof typeof COUNTRY_CITY] || [] : [];

  return (
    <div style={{
      maxWidth: 400, margin: '60px auto', padding: 32,
      border: '1.5px solid #bc8a5f', borderRadius: 10, background: '#fff', boxShadow: '0 2px 16px rgba(188,138,95,0.1)'
    }}>
      <h2 style={{ textAlign: 'center', color: '#bc8a5f', marginBottom: 24 }}>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ border: '2px solid #bc8a5f', borderRadius: 4, padding: 8, background: '#faf6f1', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Apellido:</label>
          <input
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
            style={{ border: '2px solid #bc8a5f', borderRadius: 4, padding: 8, background: '#faf6f1', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ border: '2px solid #bc8a5f', borderRadius: 4, padding: 8, background: '#faf6f1', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ border: '2px solid #bc8a5f', borderRadius: 4, padding: 8, background: '#faf6f1', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Teléfono:</label>
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern={`\\d{${MIN_PHONE_LENGTH},}`}
            minLength={MIN_PHONE_LENGTH}
            placeholder={`Ej: 956123456 (${MIN_PHONE_LENGTH} dígitos mínimo)`}
            style={{
              border: '2px solid #bc8a5f',
              borderRadius: 4,
              padding: 8,
              background: '#faf6f1',
              width: '100%',
              ...noSpinner
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Calle/Dirección:</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            style={{ border: '2px solid #bc8a5f', borderRadius: 4, padding: 8, background: '#faf6f1', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Número de dirección:</label>
          <input
            type="text"
            name="addressNumber"
            value={form.addressNumber}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="[0-9]+"
            style={{
              border: '2px solid #bc8a5f',
              borderRadius: 4,
              padding: 8,
              background: '#faf6f1',
              width: '100%',
              ...noSpinner
            }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>País:</label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            required
            style={{ border: '2px solid #bc8a5f', borderRadius: 4, padding: 8, background: '#faf6f1', width: '100%' }}
          >
            <option value="">Ninguno</option>
            {Object.keys(COUNTRY_CITY).map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Ciudad:</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            disabled={!form.country || availableCities.length === 0}
            style={{
              border: '2px solid #bc8a5f',
              borderRadius: 4,
              padding: 8,
              background: '#faf6f1',
              width: '100%',
              color: !form.country ? '#999' : undefined,
            }}
          >
            <option value="">{!form.country ? 'Selecciona un país primero' : 'Ninguno'}</option>
            {availableCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
        {error && (
          <div style={{ color: '#c1440e', marginBottom: 14, textAlign: 'center' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ color: '#379634', marginBottom: 14, textAlign: 'center' }}>
            {success}
          </div>
        )}
        <button type="submit" style={{
          width: '100%',
          padding: 10,
          background: '#bc8a5f',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          fontWeight: 600,
        }}>
          Crear cuenta
        </button>
      </form>
      <p style={{ marginTop: 20, textAlign: 'center' }}>
        ¿Ya tienes cuenta?{' '}
        <a href="/login" style={{ color: '#bc8a5f', textDecoration: 'underline' }}>Inicia sesión</a>
      </p>
    </div>
  );
}