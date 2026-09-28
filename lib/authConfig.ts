import { Configuration, PublicClientApplication } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "c538c4d3-453d-4aec-bcaa-a917b8dd245e",
    authority: "https://login.microsoftonline.com/30702ecf-e2f2-4cb7-a22e-fa152f6ff961",
    redirectUri: "http://localhost:3000", 
  },
  cache: {
    cacheLocation: "sessionStorage",
  }
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);