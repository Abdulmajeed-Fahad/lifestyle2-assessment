export function compressData(data: any): string {
  const jsonString = JSON.stringify(data)
  // Simple compression using base64 and removing whitespace
  const compressed = btoa(
    encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode(Number.parseInt(p1, 16)),
    ),
  )
  return compressed
}

export function decompressData(compressed: string): any {
  try {
    const decompressed = decodeURIComponent(
      atob(compressed)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(decompressed)
  } catch (error) {
    console.error("[v0] Error decompressing data:", error)
    return null
  }
}
