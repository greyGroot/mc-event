const fs = require("fs");
const path = require("path");
const { JWT } = require("google-auth-library");

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

async function setupClass() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
  const clientEmail = process.env.GOOGLE_WALLET_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY || "";

  if (!issuerId || !clientEmail || !privateKey) {
    console.error("Missing required Google Wallet environment variables.");
    process.exit(1);
  }

  privateKey = privateKey.replace(/\\n/g, "\n");
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1);
  }

  const classId = `${issuerId}.mastercard_event_ticket_class`;

  const auth = new JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
  });

  const classPayload = {
    id: classId,
    issuerName: "Mastercard VIP Events",
    eventName: {
      defaultValue: {
        language: "en-US",
        value: "Mastercard Exclusive Event",
      },
    },
    reviewStatus: "UNDER_REVIEW",
    hexBackgroundColor: "#0A0A0A",
    logo: {
      sourceUri: {
        uri: "https://img.icons8.com/color/512/mastercard.png",
      },
      contentDescription: {
        defaultValue: {
          language: "en-US",
          value: "Mastercard Logo",
        },
      },
    },
  };

  console.log(`Creating Google Wallet class: ${classId}...`);

  try {
    const res = await auth.request({
      url: "https://walletobjects.googleapis.com/walletobjects/v1/eventTicketClass",
      method: "POST",
      data: classPayload,
    });
    console.log("Class created successfully:", res.data);
  } catch (error) {
    const status = error.status || (error.response && error.response.status);
    if (status === 409 || (error.message && error.message.includes("409"))) {
      console.log(`Class ${classId} already exists (409 Conflict). Skipping creation.`);
    } else {
      console.error("Failed to create class:", error.message || error);
      process.exit(1);
    }
  }
}

setupClass();
