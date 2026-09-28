"use client";
import { useMsal } from "@azure/msal-react";
import {loginRequest} from "@/lib/authConfig";

export function useApi() {
    const { instance, accounts } = useMsal();

    const fetchWithToken = async (url: string, options: RequestInit = {}) => {

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

        return fetch(url, { ...options, headers });
    };

    return { fetchWithToken };
}