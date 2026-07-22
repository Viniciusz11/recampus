/**
 * Guarda o access token só em memória (nunca em localStorage - um XSS que
 * rode JS na página poderia lê-lo de lá). O refresh token vive num cookie
 * httpOnly, invisível para esse mesmo JS.
 *
 * Módulo à parte (não dentro do AuthContext) porque o interceptor do axios
 * (services/api.ts) precisa ler/limpar o token fora de uma árvore React.
 */
let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

let onUnauthorized: (() => void) | null = null;

/** AuthContext registra aqui o que fazer quando o refresh silencioso falha. */
export function setOnUnauthorized(callback: (() => void) | null): void {
  onUnauthorized = callback;
}

export function notifyUnauthorized(): void {
  onUnauthorized?.();
}
