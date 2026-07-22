import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** clsx resolve classes condicionais; tailwind-merge desempata classes
 * conflitantes (ex: "px-2 px-4" -> "px-4") em vez de deixar as duas no DOM. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
