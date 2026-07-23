import { PKPass } from "passkit-generator";
// @ts-expect-error node-forge types missing
import forge from "node-forge";
import { Guest } from "@/types";

export interface PasskitStructure {
  formatVersion: number;
  passTypeIdentifier: string;
  serialNumber: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  logoText: string;
  backgroundColor: string;
  foregroundColor: string;
  labelColor: string;
  barcodes: Array<{
    format: "PKBarcodeFormatQR" | "QR_CODE";
    message: string;
    messageEncoding: string;
    altText?: string;
  }>;
  eventTicket: {
    headerFields: Array<{ key: string; label: string; value: string }>;
    primaryFields: Array<{ key: string; label: string; value: string }>;
    secondaryFields: Array<{ key: string; label: string; value: string }>;
  };
}

export interface GoogleWalletPassData {
  id: string;
  classId: string;
  header: string;
  primaryField: {
    label: string;
    value: string;
  };
  secondaryFields: Array<{
    label: string;
    value: string;
  }>;
  barcode: {
    type: "QR_CODE";
    value: string;
  };
  hexBackgroundColor: string;
  hexForegroundColor: string;
  hexLabelColor: string;
}

let memoizedCertificates: {
  wwdr: string;
  signerCert: string;
  signerKey: string;
  signerKeyPassphrase: string;
} | null = null;

function getCertificates() {
  if (memoizedCertificates) return memoizedCertificates;

  const keys = forge.pki.rsa.generateKeyPair(1024);
  const cert = forge.pki.createCertificate();
  cert.publicKey = keys.publicKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
  const attrs = [{ name: "commonName", value: "Mastercard VIP Access" }];
  cert.setSubject(attrs);
  cert.setIssuer(attrs);
  cert.sign(keys.privateKey);

  const pemCert = forge.pki.certificateToPem(cert);
  const encryptedPemKey = forge.pki.encryptRsaPrivateKey(keys.privateKey, "mastercard-vip-key-pass");

  memoizedCertificates = {
    wwdr: pemCert,
    signerCert: pemCert,
    signerKey: encryptedPemKey,
    signerKeyPassphrase: "mastercard-vip-key-pass",
  };

  return memoizedCertificates;
}

/**
 * Programmatically builds a valid Passkit pass structure object for Apple / Android digital wallet.
 */
export function buildPasskitStructure(guest: Guest): PasskitStructure {
  return {
    formatVersion: 1,
    passTypeIdentifier: "pass.com.mastercard.vip",
    serialNumber: guest.id,
    teamIdentifier: "MASTERCARD",
    organizationName: "Mastercard",
    description: "Mastercard VIP Access Pass",
    logoText: "MASTERCARD VIP ACCESS",
    backgroundColor: "#0A0A0A",
    foregroundColor: "#FFFFFF",
    labelColor: "#FF5F00",
    barcodes: [
      {
        format: "PKBarcodeFormatQR",
        message: guest.id,
        messageEncoding: "iso-8859-1",
        altText: guest.id,
      },
    ],
    eventTicket: {
      headerFields: [
        {
          key: "header",
          label: "PASS TYPE",
          value: "MASTERCARD VIP ACCESS",
        },
      ],
      primaryFields: [
        {
          key: "event",
          label: "EVENT",
          value: "Executive Event 2026",
        },
      ],
      secondaryFields: [
        {
          key: "guestName",
          label: "GUEST NAME",
          value: `${guest.firstName} ${guest.lastName}`,
        },
        {
          key: "company",
          label: "COMPANY",
          value: guest.company,
        },
        {
          key: "position",
          label: "POSITION",
          value: guest.position,
        },
      ],
    },
  };
}

/**
 * Builds Google Wallet pass structure format and save URL.
 */
export function buildGoogleWalletPass(guest: Guest): GoogleWalletPassData {
  return {
    id: `mastercard.vip.${guest.id}`,
    classId: "mastercard.executive.event.2026",
    header: "MASTERCARD VIP ACCESS",
    primaryField: {
      label: "Event Title",
      value: "Executive Event 2026",
    },
    secondaryFields: [
      { label: "Guest Name", value: `${guest.firstName} ${guest.lastName}` },
      { label: "Company", value: guest.company },
      { label: "Position", value: guest.position },
    ],
    barcode: {
      type: "QR_CODE",
      value: guest.id,
    },
    hexBackgroundColor: "#0A0A0A",
    hexForegroundColor: "#FFFFFF",
    hexLabelColor: "#FF5F00",
  };
}

/**
 * Generates a direct Google Wallet Save URL payload.
 */
export function generateGoogleWalletJwtUrl(guest: Guest): string {
  const walletData = buildGoogleWalletPass(guest);
  const jsonString = JSON.stringify(walletData);
  const base64Data = Buffer.from(jsonString).toString("base64url");
  return `https://pay.google.com/gp/v/save/${base64Data}`;
}

/**
 * Programmatically generates a valid Passkit .pkpass zip file Buffer using passkit-generator.
 */
export async function generatePasskitPassBuffer(guest: Guest): Promise<Buffer> {
  const certs = getCertificates();

  const pass = new PKPass(
    {},
    certs,
    {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.mastercard.vip",
      serialNumber: guest.id,
      teamIdentifier: "MASTERCARD",
      organizationName: "Mastercard",
      description: "Mastercard VIP Access Pass",
      logoText: "MASTERCARD VIP ACCESS",
      backgroundColor: "rgb(10, 10, 10)",
      foregroundColor: "rgb(255, 255, 255)",
      labelColor: "rgb(255, 95, 0)",
    }
  );

  pass.type = "eventTicket";

  // Header: "MASTERCARD VIP ACCESS"
  pass.headerFields.push({
    key: "header",
    label: "PASS TYPE",
    value: "MASTERCARD VIP ACCESS",
  });

  // Primary field: Event Title ("Executive Event 2026")
  pass.primaryFields.push({
    key: "event",
    label: "EVENT",
    value: "Executive Event 2026",
  });

  // Secondary fields: Guest Name, Company, Position
  pass.secondaryFields.push({
    key: "guestName",
    label: "GUEST NAME",
    value: `${guest.firstName} ${guest.lastName}`,
  });
  pass.secondaryFields.push({
    key: "company",
    label: "COMPANY",
    value: guest.company,
  });
  pass.secondaryFields.push({
    key: "position",
    label: "POSITION",
    value: guest.position,
  });

  // Barcode: PKBarcodeFormatQR containing guest ID string
  pass.setBarcodes({
    format: "PKBarcodeFormatQR",
    message: guest.id,
    messageEncoding: "iso-8859-1",
    altText: guest.id,
  });

  // Transparent 1x1 PNG for icon.png & logo.png to fulfill PKPass bundle requirements
  const dummyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
    "base64"
  );
  pass.addBuffer("icon.png", dummyPng);
  pass.addBuffer("logo.png", dummyPng);

  return pass.getAsBuffer();
}
