const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf8");
    content.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

loadEnv();

const dummyGuest = {
  id: "MC-VIP-9999",
  firstName: "Jane",
  lastName: "Smith",
  email: "jane.smith@example.com",
  company: "Mastercard Partner",
  position: "Director",
  status: "CONFIRMED",
};

const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID || "3388000000023175673";
const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL || "";
let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY || "";

if (privateKey) {
  privateKey = privateKey.replace(/\\n/g, "\n");
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }
}

const classId = `${issuerId}.mastercard_event_ticket_class`;
const objectId = `${issuerId}.${dummyGuest.id}`;

const claims = {
  iss: clientEmail,
  aud: "google",
  origins: ["http://localhost:3000"],
  typ: "savetowallet",
  payload: {
    eventTicketObjects: [
      {
        id: objectId,
        classId: classId,
        state: "ACTIVE",
        ticketHolderName: `${dummyGuest.firstName} ${dummyGuest.lastName}`,
        eventName: {
          defaultValue: {
            language: "en-US",
            value: "Mastercard Exclusive Event",
          },
        },
        barcode: {
          type: "QR_CODE",
          value: dummyGuest.id,
        },
        hexBackgroundColor: "#0A0A0A",
      },
    ],
  },
};

console.log("Signing claims with RS256 private key...");
const signedJwt = jwt.sign(claims, privateKey, { algorithm: "RS256" });
console.log("Signed JWT length:", signedJwt.length);

const decoded = jwt.decode(signedJwt, { complete: true });
console.log("JWT Header:", decoded.header);
console.log("JWT Payload:", JSON.stringify(decoded.payload, null, 2));

if (
  decoded.payload.iss === clientEmail &&
  decoded.payload.aud === "google" &&
  decoded.payload.typ === "savetowallet" &&
  decoded.payload.payload.eventTicketObjects[0].id === objectId
) {
  console.log("JWT verification passed successfully!");
} else {
  console.error("JWT verification failed!");
  process.exit(1);
}
