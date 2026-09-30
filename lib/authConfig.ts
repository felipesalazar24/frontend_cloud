import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "a4d3e345-3a3d-45e3-a248-a07a76da5e1b",
    authority: "https://login.microsoftonline.com/7022b65e-3fa4-4c19-b7ca-db8663f34a71",
    redirectUri: "https://y29iesuumh.execute-api.us-east-1.amazonaws.com", 
  },
  cache: {
    cacheLocation: "sessionStorage",
  }
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);