# Sanos y Salvos - Frontend

Sanos y Salvos es una plataforma web centralizada diseñada para reportar, buscar y encontrar mascotas perdidas. Su objetivo es conectar dueños, clínicas veterinarias y refugios para facilitar la reunión de mascotas con sus familias.

## 🛠️ Stack Tecnológico

Este proyecto está construido con herramientas y librerías modernas del ecosistema React y Node.js:

- **Framework principal:** [Next.js 16+ (App Router)](https://nextjs.org/) con React 19.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) para tipado estático estricto.
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) nativo e integrado directamente.
- **Componentes de UI:** Basado en la arquitectura de [shadcn/ui](https://ui.shadcn.com/) utilizando primitivas accesibles de [Radix UI](https://www.radix-ui.com/).
- **Mapas Interactivos:** [Leaflet](https://leafletjs.com/) junto con `react-leaflet` para visualización geoespacial de reportes.
- **Manejo de Formularios:** [React Hook Form](https://react-hook-form.com/) en conjunto con [Zod](https://zod.dev/) para la validación exhaustiva de datos.
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Optimización visual y animaciones:** Framer Motion / Embla Carousel / tw-animate-css (según la interfaz en uso).

## 🧩 Arquitectura y Estructura del Proyecto

El sistema hace uso del directorio `app/` introducido en las últimas versiones de Next.js, favoreciendo los Server Components (SSR por defecto) combinados estratégicamente con Client Components (`"use client"`) en interfaces donde se requiere alta interactividad (mapas, formularios, tabs).

La estructura de carpetas está dividida de la siguiente manera:

- `app/`: Contiene las rutas principales de la aplicación (`page.tsx`, `layout.tsx`). Además de las vistas clave como el mapa (`/mapa`) y formularios de reporte.
- `components/ui/`: Todos los componentes base reutilizables de UI (Botones, Tabs, Cards, Badges, etc.) creados con Radix UI + Tailwind.
- `components/`: Componentes específicos de dominio (e.g., `ReportCard`, `ReportFilters`, `Header`, `MapWrapper`).
- `lib/`: Archivos de configuración, tipos TypeScript (`types.ts`) y utilidades comunes (`utils.ts`). Aquí también se aloja `mock-data.ts`, que actúa como base de datos en memoria para el prototipo.
- `hooks/`: Hooks personalizados de React.
- `public/`: Assets estáticos (íconos, imágenes, manifiestos).

## 📡 Modelo de Datos

El sistema modela la información principal usando las siguientes entidades (definidas en `lib/types.ts`):

1. **`PetReport`**: Representa un reporte de mascota. Incluye:
   - Tipología (`perdido` o `encontrado`).
   - Estado (`activo`, `resuelto`, `expirado`).
   - Características de la mascota (tipo, raza, tamaño, color, imagen).
   - Ubicación exacta (coordenadas `lat`/`lng` y dirección).
   - Fechas y detalles de contacto.
2. **`Match`**: Entidad diseñada para un motor de similitud (similarity engine) que enlaza lógicamente un reporte de mascota perdida (`lostReportId`) con uno de mascota encontrada (`foundReportId`) mediante un porcentaje de similitud.
3. **`User`**: Información de cuentas de usuario, sus contactos y el seguimiento de sus propios reportes.

## 🚀 Flujos Principales

### 1. Visualización y Mapas (`/mapa`)
Un mapa interactivo renderizado en el cliente mediante `react-leaflet`. Permite a los usuarios visualizar espacialmente todos los reportes. Incluye:
- Filtros dinámicos basados en especie y tipo de reporte.
- Una interfaz dividida o en pestañas (Tabs) para alternar entre "Vista de Mapa" y "Vista de Lista", asegurando completa responsividad en dispositivos móviles.

### 2. Creación de Reportes
Formularios controlados con `react-hook-form` que validan entradas complejas en el cliente a través de esquemas construidos con `zod`, antes de enviar el payload al backend o modificar el estado global.

### 3. Componentización Accesible
Todos los elementos interactivos complejos (Listas desplegables, Diálogos modales, Pestañas) aseguran cumplimiento ARIA mediante Radix UI Primitive, manteniendo una experiencia rica pero semánticamente correcta para lectores de pantalla.

## 🔧 Instalación y Desarrollo Local

Dado que el proyecto utiliza `pnpm` como gestor de dependencias:

```bash
# 1. Instalar las dependencias exactas del lockfile
npm install -g pnpm

npm install

# (Nota: En caso de errores con dependencias precompiladas como `sharp`, ejecuta `pnpm approve-builds` previamente).

# 2. Iniciar el servidor de desarrollo en modo local
npm run dev
```

La aplicación estará corriendo por defecto en `http://localhost:3000`.
