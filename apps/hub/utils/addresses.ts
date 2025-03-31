export function getShortEvmAddress(address: `0x${string}`): `0x${string}` {
  return `${address.slice(0, 6)}...${address.slice(-4)}` as `0x${string}`
}

export function getShortSolAddress(address: string): string {
  return `${address.slice(0, 5)}...${address.slice(-5)}`
}
