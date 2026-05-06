/**
 * Normaliza una cadena para realizar comparaciones tolerantes a tildes y mayúsculas.
 * Útil al filtrar municipios escritos sin acentos (p. ej. "agost" vs "Agost").
 */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase();
}
