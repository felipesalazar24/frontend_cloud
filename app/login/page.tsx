'use client';

import React, { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig"; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { instance, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile'); 
    }
  }, [isAuthenticated, router]);

  const handleLogin = () => {
    if (inProgress === "none") {
      instance.loginRedirect(loginRequest).catch(e => {
        console.error("Error en el login:", e);
      });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded text-center">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <p className="mb-6 text-gray-600">
        El acceso se realiza de forma segura a través de Microsoft Entra ID.
      </p>
      
      <button
        onClick={handleLogin}
        disabled={inProgress !== "none"} 
        className="w-full py-2 bg-[#bc8a5f] text-white font-semibold rounded mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {inProgress !== "none" ? "Conectando con Microsoft..." : "Ingresar con cuenta institucional"}
      </button>
    </div>
  );
}