"use client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/authConfig";
import { ReactNode, useEffect, useState } from "react";

export default function MsalProviderWrapper({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();
        await msalInstance.handleRedirectPromise(); 
        setIsInitialized(true);
      } catch (error) {
        console.error("Error inicializando MSAL:", error);
      }
    };

    initializeMsal();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Configurando seguridad de Microsoft...</p>
      </div>
    );
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}