export function svgLogo(opts: { text: string; bg: string; fg: string; sub?: string }): string {
  const sub = opts.sub
    ? `<text x="200" y="128" text-anchor="middle" font-family="Inter,Arial" font-size="14" fill="${opts.fg}" opacity="0.7">${opts.sub}</text>`
    : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="180" viewBox="0 0 400 180"><rect width="400" height="180" rx="12" fill="${opts.bg}"/><text x="200" y="${opts.sub ? 96 : 104}" text-anchor="middle" font-family="Oswald,Arial Black,sans-serif" font-size="42" font-weight="700" fill="${opts.fg}">${opts.text}</text>${sub}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
