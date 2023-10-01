/**
 * Add current origin to URL if doesn't have any protocol or origin.
 */
export function addOrigin(url: string) {
  return url.match(/^(https?:)?\/\//)
    ? url
    : url.startsWith('/')
    ? `${location.origin}${url}`
    : `${location.origin}/${url}`;
}
