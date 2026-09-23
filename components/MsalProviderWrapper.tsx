"use client";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "@/lib/authConfig";
import { ReactNode } from "react";

export default function MsalProviderWrapper({ children }: { children: ReactNode }) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}