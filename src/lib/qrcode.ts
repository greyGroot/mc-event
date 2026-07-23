import QRCode from "qrcode";

/**
 * Generates a QR Code Data URL string (Base64 PNG image format).
 * @param text The string content to encode into the QR code (e.g. guest ID).
 */
export async function generateQRCodeDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 300,
      margin: 1,
      color: {
        dark: "#0a0a0a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
    return dataUrl;
  } catch (error) {
    console.error("Failed to generate QR Code Data URL:", error);
    throw new Error(`QR Code Data URL generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates a QR Code PNG Buffer suitable for PDF attachments or file streams.
 * @param text The string content to encode into the QR code (e.g. guest ID).
 */
export async function generateQRCodeBuffer(text: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(text, {
      width: 300,
      margin: 1,
      color: {
        dark: "#0a0a0a",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
    return buffer;
  } catch (error) {
    console.error("Failed to generate QR Code Buffer:", error);
    throw new Error(`QR Code Buffer generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
