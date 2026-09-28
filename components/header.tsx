"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { PawPrint, Menu, MapPin, Plus, User } from "lucide-react"

export function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const navigation = [
    { name: "Mascotas", href: "/pets", icon: MapPin },
    { name: "Reportar", href: "/create-report", icon: Plus },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <PawPrint className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Sanos y Salvos</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button variant="ghost" className="gap-2">
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Mi Cuenta
            </Button>
          </Link>
          <Link href="/create-report">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Reporte
            </Button>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 mt-8">
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <PawPrint className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">Sanos y Salvos</span>
              </Link>
              
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              <div className="border-t pt-4 mt-4 space-y-2">
                <Link href="/profile" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <User className="h-4 w-4" />
                    Mi Cuenta
                  </Button>
                </Link>
                <Link href="/create-report" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Reporte
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}