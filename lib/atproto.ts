const BASE32_SORT = "234567abcdefghijklmnopqrstuvwxyz";

function encodeBase32Sort(value: bigint, length: number): string {
  const chars: string[] = [];
  let v = value;
  for (let i = 0; i < length; i++) {
    chars.unshift(BASE32_SORT[Number(v & 31n)]);
    v >>= 5n;
  }
  return chars.join("");
}

export async function tidFromDateAndPath(
  date: Date,
  path: string,
): Promise<string> {
  const dateMs = Math.floor(date.getTime() / 1000) * 1000;
  const microseconds = BigInt(dateMs) * 1000n;
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(path),
  );
  const clockId = BigInt(new DataView(hashBuffer).getUint16(0)) & 0x3ffn;
  return encodeBase32Sort((microseconds << 10n) | clockId, 13);
}

export function didFromAtUri(uri: string): string {
  return uri.split("/")[2] ?? "";
}
