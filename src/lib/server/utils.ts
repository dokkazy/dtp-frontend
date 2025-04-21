
export function getExpirationDateFromToken(token: string): string | null {
  const decodedToken = decodeJwtToken(token);
  if (!decodedToken || !decodedToken.exp) return null;

  // JWT exp là timestamp tính bằng giây
  const expirationDate = new Date(decodedToken.exp * 1000);
  return expirationDate.toUTCString();
}

export function decodeJwtToken(token: string) {
  try {
    // JWT cấu trúc: header.payload.signature
    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    // Decode base64url
    const payloadBuffer = Buffer.from(base64Payload, "base64url");
    const decodedPayload = JSON.parse(payloadBuffer.toString("utf8"));
    return decodedPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function getMaxAgeFromToken(token: string): number {
  const decodedToken = decodeJwtToken(token);
  if (!decodedToken || !decodedToken.exp) return 7200; // Default fallback

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return Math.max(0, decodedToken.exp - nowInSeconds);
}

export function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }