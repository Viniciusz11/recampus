/**
 * Telefone é guardado só com DDD + número (sem +55, ver backend/prisma/schema.prisma).
 * O wa.me exige o número completo em formato internacional, sem símbolos.
 */
export function buildWhatsAppLink(phone: string, message: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  const fullNumber = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(message)}`;
}
