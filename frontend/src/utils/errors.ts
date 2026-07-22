import { isAxiosError } from 'axios';

interface ApiErrorBody {
  error?: { message?: string };
}

/**
 * Extrai a mensagem amigável que o backend formata em `error.message` -
 * mas só para respostas < 500. Erros 5xx nunca são craftados pra exibição
 * (em dev o backend manda até o texto bruto do Prisma/stack pra facilitar
 * debug via curl - ver errorHandler.ts) - mostrar isso direto num toast
 * pro usuário seria um vazamento de detalhe interno, então sempre cai no
 * fallback genérico nesse caso, independente do que o servidor mandou.
 */
export function getErrorMessage(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): string {
  if (isAxiosError<ApiErrorBody>(error)) {
    const status = error.response?.status;
    if (status !== undefined && status < 500) {
      return error.response?.data.error?.message ?? fallback;
    }
    return fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
