export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (envUrl) return envUrl.replace(/\/$/, "");

  if (typeof window !== "undefined") return "/api";
  return "/api";
}
