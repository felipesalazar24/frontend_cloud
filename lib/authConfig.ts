import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "a4d3e345-3a3d-45e3-a248-a07a76da5e1b",
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || "7022b65e-3fa4-4c19-b7ca-db8663f34a71"}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || "http://localhost:3000/api/auth/callback/azure-ad",
  },
  cache: {
    cacheLocation: "sessionStorage",
  }
};

export const loginRequest = {
  scopes: [`${process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "a4d3e345-3a3d-45e3-a248-a07a76da5e1b"}/.default`],
};

export const msalInstance = new PublicClientApplication(msalConfig);