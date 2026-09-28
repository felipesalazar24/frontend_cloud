"use client"

import { useState } from "react"
import { PetReport, PetType, ReportType } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface FiltersProps {
  reports: PetReport[]
  onFilter: (filtered: PetReport[]) => void
}

export function ReportFilters({ reports, onFilter }: FiltersProps) {
  const [search, setSearch] = useState("")
  const [reportType, setReportType] = useState<ReportType | "todos">("todos")
  const [petType, setPetType] = useState<PetType | "todos">("todos")
  const [city, setCity] = useState<string>("todos")
  const [isOpen, setIsOpen] = useState(false)

  const cities = [...new Set(reports.map(r => r.location.city))].sort()

  const applyFilters = () => {
    let filtered = [...reports]

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        r =>
          r.petName?.toLowerCase().includes(searchLower) ||
          r.breed?.toLowerCase().includes(searchLower) ||
          r.color.toLowerCase().includes(searchLower) ||
          r.description.toLowerCase().includes(searchLower) ||
          r.location.address.toLowerCase().includes(searchLower)
      )
    }

    if (reportType !== "todos") {
      filtered = filtered.filter(r => r.type === reportType)
    }

    if (petType !== "todos") {
      filtered = filtered.filter(r => r.petType === petType)
    }

    if (city !== "todos") {
      filtered = filtered.filter(r => r.location.city === city)
    }

    onFilter(filtered)
  }

  const clearFilters = () => {
    setSearch("")
    setReportType("todos")
    setPetType("todos")
    setCity("todos")
    onFilter(reports)
  }

  const hasActiveFilters = search || reportType !== "todos" || petType !== "todos" || city !== "todos"
  const activeFilterCount = [search, reportType !== "todos", petType !== "todos", city !== "todos"].filter(Boolean).length

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, raza, color..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setTimeout(applyFilters, 0)
          }}
          className="pl-9"
        />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex gap-2">
        <Select
          value={reportType}
          onValueChange={(v) => {
            setReportType(v as ReportType | "todos")
            setTimeout(applyFilters, 0)
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo de reporte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="perdido">Perdidos</SelectItem>
            <SelectItem value="encontrado">Encontrados</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={petType}
          onValueChange={(v) => {
            setPetType(v as PetType | "todos")
            setTimeout(applyFilters, 0)
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Tipo de mascota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="perro">Perros</SelectItem>
            <SelectItem value="gato">Gatos</SelectItem>
            <SelectItem value="ave">Aves</SelectItem>
            <SelectItem value="otro">Otros</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={city}
          onValueChange={(v) => {
            setCity(v)
            setTimeout(applyFilters, 0)
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Comuna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las comunas</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Mobile Filters */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-auto max-h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filtros de Búsqueda</SheetTitle>
            <SheetDescription>
              Filtra los reportes por tipo, mascota o ubicación.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType | "todos")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="perdido">Perdidos</SelectItem>
                  <SelectItem value="encontrado">Encontrados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Mascota</Label>
              <Select value={petType} onValueChange={(v) => setPetType(v as PetType | "todos")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas</SelectItem>
                  <SelectItem value="perro">Perros</SelectItem>
                  <SelectItem value="gato">Gatos</SelectItem>
                  <SelectItem value="ave">Aves</SelectItem>
                  <SelectItem value="otro">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Comuna</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas las comunas</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  clearFilters()
                  setIsOpen(false)
                }}
              >
                Limpiar
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  applyFilters()
                  setIsOpen(false)
                }}
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
