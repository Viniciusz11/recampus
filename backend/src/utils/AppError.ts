/**
 * Erro de negócio previsível (ex: 404, 401, 400 de validação).
 * O errorHandler central sabe diferenciar isto de um erro inesperado
 * (bug) e responder com o status/mensagem corretos em vez de um 500 genérico.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(message: string, statusCode = 400, code = 'BAD_REQUEST') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }

  static notFound(message = 'Recurso não encontrado'): AppError {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static unauthorized(message = 'Não autenticado'): AppError {
    return new AppError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Acesso negado'): AppError {
    return new AppError(message, 403, 'FORBIDDEN');
  }

  static conflict(message = 'Recurso em conflito'): AppError {
    return new AppError(message, 409, 'CONFLICT');
  }
}
