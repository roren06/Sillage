export function scentPath(id: string) {
  return `/scent/${id}`;
}

export function scentUrl(id: string) {
  if (typeof window === "undefined") return scentPath(id);
  return `${window.location.origin}${scentPath(id)}`;
}
