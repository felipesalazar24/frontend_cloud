import Link from "next/link"
import { PawPrint, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <PawPrint className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">Sanos y Salvos</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma centralizada para reportar y encontrar mascotas perdidas. 
              Conectamos a dueños con clínicas y refugios.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Plataforma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/mapa" className="hover:text-foreground transition-colors">Mapa de Reportes</Link></li>
              <li><Link href="/reportar" className="hover:text-foreground transition-colors">Reportar Mascota</Link></li>
              <li><Link href="/alertas" className="hover:text-foreground transition-colors">Alertas</Link></li>
              <li><Link href="/como-funciona" className="hover:text-foreground transition-colors">Cómo Funciona</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Recursos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/consejos" className="hover:text-foreground transition-colors">Consejos de Prevención</Link></li>
              <li><Link href="/veterinarias" className="hover:text-foreground transition-colors">Clínicas Asociadas</Link></li>
              <li><Link href="/refugios" className="hover:text-foreground transition-colors">Refugios</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">Preguntas Frecuentes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacidad" className="hover:text-foreground transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-foreground transition-colors">Términos de Uso</Link></li>
              <li><Link href="/contacto" className="hover:text-foreground transition-colors">Contacto</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Sanos y Salvos. Todos los derechos reservados.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Hecho con <Heart className="h-4 w-4 text-destructive fill-destructive" /> para las mascotas
          </p>
        </div>
      </div>
    </footer>
  )
}
