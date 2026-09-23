export type PetType = 'perro' | 'gato' | 'ave' | 'otro'
export type PetSize = 'pequeño' | 'mediano' | 'grande'
export type ReportType = 'perdido' | 'encontrado'
export type ReportStatus = 'activo' | 'resuelto' | 'expirado'

export interface PetReport {
  id: string
  type: ReportType
  status: ReportStatus
  petName?: string
  petType: PetType
  breed?: string
  color: string
  size: PetSize
  description: string
  imageUrl?: string
  location: {
    lat: number
    lng: number
    address: string
    city: string
  }
  contactName: string
  contactPhone: string
  contactEmail?: string
  date: string
  lastSeenDate: string
  createdAt: string
  userId?: string
}

export interface Match {
  id: string
  lostReportId: string
  foundReportId: string
  similarity: number
  status: 'pendiente' | 'confirmado' | 'descartado'
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  reports: string[]
}
