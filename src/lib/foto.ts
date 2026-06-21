// src/lib/foto.ts
//
// Helper puro (seguro para client e server) que resolve a `src` de uma foto.
// Trata a transição base64 -> MinIO:
//  - KEY do MinIO ("fotos/...")     -> proxy autenticado (recebido em proxyUrl)
//  - data URL legado ("data:...")   -> usa direto
//  - URL externa ("http...")        -> usa direto (campo legado "Foto (URL)")
//  - base64 cru legado (fotourl)    -> embute como data URL
// Retorna null quando não há foto (o componente decide o placeholder).

export function resolveFotoSrc(
  val: string | null | undefined,
  proxyUrl: string,
): string | null {
  if (!val) return null;
  const s = String(val).trim();
  if (!s) return null;
  if (s.startsWith('fotos/')) return proxyUrl;            // KEY no MinIO -> proxy
  if (s.startsWith('data:')) return s;                    // data URL legado
  if (/^https?:\/\//i.test(s)) return s;                  // URL externa legada
  return `data:image/jpeg;base64,${s}`;                   // base64 cru legado
}
