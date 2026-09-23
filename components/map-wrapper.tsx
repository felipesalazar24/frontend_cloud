"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { PetReport } from "@/lib/types"

// Dynamically import Map component with SSR disabled
const MapComponent = dynamic(() => import("./map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-lg bg-muted flex items-center justify-center">
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  ),
})

interface MapWrapperProps {
  reports: PetReport[]
  center?: [number, number]
  zoom?: number
  selectedReport?: string | null
  onMarkerClick?: (report: PetReport) => void
}

export function MapWrapper(props: MapWrapperProps) {
  return <MapComponent {...props} />
}
