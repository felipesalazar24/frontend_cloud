"use client";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/authConfig";

export function useApi() {
    const { instance, accounts } = useMsal();
    const baseUrl = process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8084";

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

        const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

        return fetch(fullUrl, { ...options, headers });
    };

    return { fetchWithToken };
}