import { PetReport } from './types'

export const mockReports: PetReport[] = [
  {
    id: '1',
    type: 'perdido',
    status: 'activo',
    petName: 'Max',
    petType: 'perro',
    breed: 'Golden Retriever',
    color: 'Dorado',
    size: 'grande',
    description: 'Muy amigable, tiene un collar azul con su nombre. Se perdió cerca del parque.',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop',
    location: {
      lat: -33.4489,
      lng: -70.6693,
      address: 'Parque O\'Higgins',
      city: 'Santiago'
    },
    contactName: 'María González',
    contactPhone: '+56 9 1234 5678',
    contactEmail: 'maria@email.com',
    date: '2026-05-10',
    lastSeenDate: '2026-05-10',
    createdAt: '2026-05-10T14:30:00Z'
  },
  {
    id: '2',
    type: 'encontrado',
    status: 'activo',
    petType: 'gato',
    breed: 'Siamés',
    color: 'Crema con puntas oscuras',
    size: 'pequeño',
    description: 'Gato siamés encontrado en buen estado. Muy cariñoso, parece estar acostumbrado a vivir en casa.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop',
    location: {
      lat: -33.4372,
      lng: -70.6506,
      address: 'Av. Providencia 1234',
      city: 'Providencia'
    },
    contactName: 'Clínica Veterinaria Sur',
    contactPhone: '+56 2 2345 6789',
    date: '2026-05-11',
    lastSeenDate: '2026-05-11',
    createdAt: '2026-05-11T09:15:00Z'
  },
  {
    id: '3',
    type: 'perdido',
    status: 'activo',
    petName: 'Luna',
    petType: 'perro',
    breed: 'Beagle',
    color: 'Tricolor (blanco, marrón y negro)',
    size: 'mediano',
    description: 'Luna es muy juguetona. Tiene chip pero sin collar. Se asustó con fuegos artificiales.',
    imageUrl: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=400&h=400&fit=crop',
    location: {
      lat: -33.4569,
      lng: -70.6483,
      address: 'Ñuñoa, cerca del Estadio Nacional',
      city: 'Ñuñoa'
    },
    contactName: 'Carlos Ramírez',
    contactPhone: '+56 9 8765 4321',
    contactEmail: 'carlos.r@email.com',
    date: '2026-05-08',
    lastSeenDate: '2026-05-08',
    createdAt: '2026-05-08T22:00:00Z'
  },
  {
    id: '4',
    type: 'encontrado',
    status: 'activo',
    petType: 'perro',
    breed: 'Mestizo',
    color: 'Negro con pecho blanco',
    size: 'mediano',
    description: 'Perro mestizo muy dócil encontrado vagando. Tiene una cicatriz en la oreja izquierda.',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
    location: {
      lat: -33.4255,
      lng: -70.6142,
      address: 'Las Condes, sector Apoquindo',
      city: 'Las Condes'
    },
    contactName: 'Refugio Patitas Felices',
    contactPhone: '+56 2 3456 7890',
    date: '2026-05-12',
    lastSeenDate: '2026-05-12',
    createdAt: '2026-05-12T11:30:00Z'
  },
  {
    id: '5',
    type: 'perdido',
    status: 'activo',
    petName: 'Michi',
    petType: 'gato',
    breed: 'Común europeo',
    color: 'Atigrado gris',
    size: 'pequeño',
    description: 'Gato castrado, muy tímido. Escapó por una ventana abierta. Responde a su nombre.',
    imageUrl: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=400&h=400&fit=crop',
    location: {
      lat: -33.4691,
      lng: -70.6420,
      address: 'San Miguel, Villa Olímpica',
      city: 'San Miguel'
    },
    contactName: 'Ana Torres',
    contactPhone: '+56 9 5555 1234',
    date: '2026-05-09',
    lastSeenDate: '2026-05-09',
    createdAt: '2026-05-09T16:45:00Z'
  },
  {
    id: '6',
    type: 'encontrado',
    status: 'activo',
    petType: 'ave',
    breed: 'Cacatúa',
    color: 'Blanco con cresta amarilla',
    size: 'pequeño',
    description: 'Cacatúa muy mansa, apareció en mi balcón. Dice algunas palabras.',
    imageUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop',
    location: {
      lat: -33.4103,
      lng: -70.5669,
      address: 'Vitacura, sector El Golf',
      city: 'Vitacura'
    },
    contactName: 'Pedro Soto',
    contactPhone: '+56 9 4444 5678',
    date: '2026-05-11',
    lastSeenDate: '2026-05-11',
    createdAt: '2026-05-11T08:00:00Z'
  }
]

export const mockMatches = [
  {
    id: 'm1',
    lostReportId: '3',
    foundReportId: '4',
    similarity: 72,
    status: 'pendiente' as const,
    createdAt: '2026-05-12T12:00:00Z'
  }
]
