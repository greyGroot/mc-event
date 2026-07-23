import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
  Svg,
  Circle,
} from "@react-pdf/renderer";
import { Guest } from "@/types";

// Create styles for luxury VIP Mastercard Ticket
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0D0D0D",
    color: "#FFFFFF",
    fontFamily: "Helvetica",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  ticketContainer: {
    borderWidth: 1,
    borderColor: "#262626",
    borderRadius: 12,
    backgroundColor: "#121212",
    padding: 20,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
    paddingBottom: 14,
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandTextContainer: {
    marginLeft: 10,
  },
  brandTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#FF5F00",
    letterSpacing: 1.2,
    marginTop: 2,
    textTransform: "uppercase",
  },
  vipBadge: {
    backgroundColor: "#1A100B",
    borderWidth: 1,
    borderColor: "#FF5F00",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  vipBadgeText: {
    color: "#FF5F00",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexGrow: 1,
    marginVertical: 10,
  },
  leftColumn: {
    flex: 1,
    paddingRight: 16,
  },
  rightColumn: {
    width: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 10,
    padding: 12,
  },
  guestLabel: {
    fontSize: 8,
    color: "#888888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 3,
  },
  guestName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  detailItem: {
    marginRight: 20,
  },
  detailVal: {
    fontSize: 11,
    color: "#E5E5E5",
    fontFamily: "Helvetica",
    marginTop: 1,
  },
  guestIdBox: {
    marginTop: 12,
    backgroundColor: "#1C1917",
    borderWidth: 1,
    borderColor: "#444444",
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
  },
  guestIdText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#F79E1B",
    letterSpacing: 1,
  },
  qrImage: {
    width: 105,
    height: 105,
    borderRadius: 6,
    backgroundColor: "#FFFFFF",
    padding: 4,
  },
  qrCaption: {
    fontSize: 7,
    color: "#AAAAAA",
    marginTop: 6,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#262626",
    paddingTop: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 7,
    color: "#666666",
  },
  eventInfo: {
    fontSize: 8,
    color: "#9CA3AF",
    fontFamily: "Helvetica",
  },
});

interface VIPDocumentProps {
  guest: Guest;
  qrDataUrl: string;
}

const VIPDocument: React.FC<VIPDocumentProps> = ({ guest, qrDataUrl }) => {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A5", orientation: "landscape", style: styles.page },
      React.createElement(
        View,
        { style: styles.ticketContainer },
        // Header
        React.createElement(
          View,
          { style: styles.header },
          React.createElement(
            View,
            { style: styles.brandContainer },
            React.createElement(
              Svg,
              { width: "40", height: "24", viewBox: "0 0 100 65" },
              React.createElement(Circle, { cx: "35", cy: "32.5", r: "30", fill: "#EB001B" }),
              React.createElement(Circle, { cx: "65", cy: "32.5", r: "30", fill: "#F79E1B", fillOpacity: "0.9" })
            ),
            React.createElement(
              View,
              { style: styles.brandTextContainer },
              React.createElement(Text, { style: styles.brandTitle }, "MASTERCARD"),
              React.createElement(Text, { style: styles.brandSubtitle }, "VIP Executive Terminal")
            )
          ),
          React.createElement(
            View,
            { style: styles.vipBadge },
            React.createElement(Text, { style: styles.vipBadgeText }, "OFFICIAL VIP ACCESS PASS")
          )
        ),
        // Body
        React.createElement(
          View,
          { style: styles.body },
          React.createElement(
            View,
            { style: styles.leftColumn },
            React.createElement(Text, { style: styles.guestLabel }, "Executive Guest"),
            React.createElement(Text, { style: styles.guestName }, `${guest.firstName} ${guest.lastName}`),
            React.createElement(
              View,
              { style: styles.detailRow },
              React.createElement(
                View,
                { style: styles.detailItem },
                React.createElement(Text, { style: styles.guestLabel }, "Title / Position"),
                React.createElement(Text, { style: styles.detailVal }, guest.position)
              ),
              React.createElement(
                View,
                { style: styles.detailItem },
                React.createElement(Text, { style: styles.guestLabel }, "Company"),
                React.createElement(Text, { style: styles.detailVal }, guest.company)
              )
            ),
            React.createElement(
              View,
              { style: styles.detailRow },
              React.createElement(
                View,
                { style: styles.detailItem },
                React.createElement(Text, { style: styles.guestLabel }, "Email Address"),
                React.createElement(Text, { style: styles.detailVal }, guest.email)
              )
            ),
            React.createElement(
              View,
              { style: styles.guestIdBox },
              React.createElement(Text, { style: styles.guestIdText }, `PASS ID: ${guest.id}`)
            )
          ),
          React.createElement(
            View,
            { style: styles.rightColumn },
            React.createElement(Image, { src: qrDataUrl, style: styles.qrImage }),
            React.createElement(Text, { style: styles.qrCaption }, "Terminal Entry QR Code")
          )
        ),
        // Footer
        React.createElement(
          View,
          { style: styles.footer },
          React.createElement(
            Text,
            { style: styles.eventInfo },
            "Event: Mastercard Innovation Gala | Location: Terminal Executive Lounge"
          ),
          React.createElement(
            Text,
            { style: styles.footerText },
            "Present this pass upon check-in. Non-transferable."
          )
        )
      )
    )
  );
};

/**
 * Generates a luxury VIP Ticket PDF buffer using @react-pdf/renderer.
 * @param guest The registered guest information.
 * @param qrDataUrl Base64 QR Code image data URL.
 */
export async function generatePDFTicketBuffer(
  guest: Guest,
  qrDataUrl: string
): Promise<Buffer> {
  try {
    const docElement = VIPDocument({ guest, qrDataUrl }) as unknown as Parameters<typeof renderToBuffer>[0];
    const buffer = await renderToBuffer(docElement);
    return buffer;
  } catch (error) {
    console.error("Failed to generate PDF ticket buffer:", error);
    throw new Error(`PDF Ticket generation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
