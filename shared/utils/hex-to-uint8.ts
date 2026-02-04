export function hexToUint8Array(hex: string) {
  const bytes: number[] = []
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(Number.parseInt(hex.slice(c, c + 2), 16))
  }
  return new Uint8Array(bytes)
}
