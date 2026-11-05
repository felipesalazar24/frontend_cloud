"use client";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";

export function useApi() {
    const { instance, accounts } = useMsal();
    const baseUrl = "http://52.55.217.236:8084";

    const fetchWithToken = async (endpoint: string, options: RequestInit = {}) => {
        const request = {
            ...loginRequest,
            account: accounts[0],
        };

        const authResponse = await instance.acquireTokenSilent(request);

        const headers = {
            ...options.headers,
            Authorization: `Bearer ${authResponse.accessToken}`,
            'Content-Type': 'application/json'
        };

        const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const fullUrl = endpoint.startsWith('http') ? endpoint : `${cleanBaseUrl}${cleanEndpoint}`;

        return fetch(fullUrl, { ...options, headers });
    };

    return { fetchWithToken };
}