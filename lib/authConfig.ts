import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "TU_CLIENT_ID_DE_AZURE", // Reemplazar con el Client ID de tu App Registration en Azure
    authority: "https://login.microsoftonline.com/TU_TENANT_ID", // Reemplazar con tu Tenant ID
    redirectUri: "http://localhost:3000", 
  },
  cache: {
    cacheLocation: "sessionStorage",
  }
};

export const loginRequest = {
  scopes: ["api://TU_CLIENT_ID_DEL_API/access_as_user"] // Reemplazar con el scope que configuraste en tu backend
};

export const msalInstance = new PublicClientApplication(msalConfig);