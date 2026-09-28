'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ReportForm } from '@/components/report-form';
import { useMsal } from '@azure/msal-react';

export default function CreateReportPage() {
  const router = useRouter();
  
  // 1. Traemos la sesión de MSAL y el estado de carga
  const { accounts, inProgress } = useMsal();
  
  const [userCity, setUserCity] = useState<string>('');
  const [userCountry, setUserCountry] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // 2. Freno de mano: Esperamos a que MSAL termine de cargar la sesión oculta
    if (inProgress !== "none") {
      return;
    }

    // 3. Si terminó de cargar y no hay sesión activa, al login
    if (accounts.length === 0) {
      router.push('/login');
      return;
    }

    // 4. Si hay sesión, sacamos los datos directamente de la cuenta de Microsoft
    const activeAccount = accounts[0];
    const idTokenClaims = activeAccount?.idTokenClaims as any;
    
    setUserCity(idTokenClaims?.city || '');
    setUserCountry(idTokenClaims?.country || '');
    setUserId(activeAccount?.localAccountId || '');
    
    setLoading(false);
  }, [router, accounts, inProgress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">Cargando...</div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Crear Nuevo Reporte</h1>
            <p className="text-muted-foreground">
              Completa el formulario para reportar una mascota perdida o encontrada.
              Nuestro sistema de coincidencias comenzará a trabajar automáticamente.
            </p>
          </div>

          <ReportForm userCity={userCity} userCountry={userCountry} userId={userId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}