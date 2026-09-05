import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPrice } from "@/lib/utils";

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  paidAt: string;
  companyName: string;
  companyAddress: string;
  vatId: string;
  defaultVatRate: number;
  customerName: string;
  customerAddress: string;
  customerZip: string;
  customerCity: string;
  customerCountry: string;
  items: InvoiceItem[];
  subtotal: number;
  couponDiscount: number;
  shippingCost: number;
  total: number;
}

export function generateInvoicePdf(data: InvoiceData): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Colors
  const primary: [number, number, number] = [10, 37, 64]; // #0A2540
  const accent: [number, number, number] = [209, 74, 12]; // #D14A0C
  const gray: [number, number, number] = [107, 114, 128]; // #6B7280
  const lightGray: [number, number, number] = [243, 244, 246]; // #F3F4F6
  const white: [number, number, number] = [255, 255, 255];
  const black: [number, number, number] = [26, 26, 26];

  let y = margin;

  // Header: Company name + Invoice title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text(data.companyName, margin, y + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  doc.text(data.companyAddress, margin, y + 14);

  // Invoice title on the right
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("RECHNUNG", pageWidth - margin, y + 8, { align: "right" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  doc.text(`Nr. ${data.invoiceNumber}`, pageWidth - margin, y + 14, { align: "right" });

  y += 24;

  // Divider line
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // Invoice metadata (left) + Customer address (right)
  const metaX = margin;
  const addrX = pageWidth / 2 + 10;

  // Left: Invoice details
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...gray);
  doc.text("Rechnungsdatum:", metaX, y);
  doc.text("Bestellnummer:", metaX, y + 5);
  doc.text("Zahlungsart:", metaX, y + 10);
  if (data.vatId) {
    doc.text("USt-IdNr.:", metaX, y + 15);
  }

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  doc.text(new Date(data.paidAt).toLocaleDateString("de-DE"), metaX + 30, y);
  doc.text(data.orderNumber, metaX + 30, y + 5);
  doc.text("\u00dcberweisung (SEPA)", metaX + 30, y + 10);
  if (data.vatId) {
    doc.text(data.vatId, metaX + 30, y + 15);
  }

  // Right: Customer address
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...gray);
  doc.text("Rechnungsempf\u00e4nger:", addrX, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...black);
  doc.text(data.customerName, addrX, y + 7);
  doc.text(data.customerAddress, addrX, y + 12);
  doc.text(`${data.customerZip} ${data.customerCity}`, addrX, y + 17);
  doc.text(data.customerCountry, addrX, y + 22);

  y += 34;

  // Items table
  const vatRate = data.defaultVatRate;
  const netTotal = data.subtotal - data.couponDiscount + data.shippingCost;
  const vatAmount = netTotal * (vatRate / (100 + vatRate));
  const netBeforeVat = netTotal - vatAmount;

  const tableBody = data.items.map((item) => [
    item.name,
    String(item.quantity),
    formatPrice(item.price),
    formatPrice(item.price * item.quantity),
  ]);

  // Add discount row if applicable
  if (data.couponDiscount > 0) {
    tableBody.push(["Rabatt", "", "", `-${formatPrice(data.couponDiscount)}`]);
  }

  // Add shipping row
  if (data.shippingCost > 0) {
    tableBody.push(["Versand", "", "", formatPrice(data.shippingCost)]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Artikel", "Menge", "Einzelpreis", "Gesamt"]],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      textColor: black,
      lineColor: [228, 231, 235],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: primary,
      textColor: white,
      fontStyle: "bold",
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { halign: "center", cellWidth: 20 },
      2: { halign: "right", cellWidth: 30 },
      3: { halign: "right", cellWidth: 30 },
    },
  });

  // @ts-expect-error jspdf-autotable type issue
  y = doc.lastAutoTable.finalY + 10;

  // Totals section (right-aligned)
  const totalsX = pageWidth - margin - 70;
  const totalsValueX = pageWidth - margin;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);

  doc.text("Nettobetrag:", totalsX, y);
  doc.text(formatPrice(netBeforeVat), totalsValueX, y, { align: "right" });

  y += 6;
  doc.text(`MwSt. (${vatRate}%):`, totalsX, y);
  doc.text(formatPrice(vatAmount), totalsValueX, y, { align: "right" });

  y += 8;
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.line(totalsX, y - 4, totalsValueX, y - 4);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primary);
  doc.text("Gesamtbetrag:", totalsX, y);
  doc.text(formatPrice(data.total), totalsValueX, y, { align: "right" });

  y += 14;

  // Payment info box
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  doc.text(
    "Diese Rechnung wurde nach Zahlungseingang ausgestellt.",
    margin + 6,
    y + 7
  );
  doc.text(
    `Rechnungsnummer: ${data.invoiceNumber}`,
    margin + 6,
    y + 13
  );

  y += 30;

  // Footer
  doc.setDrawColor(...gray);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...gray);
  doc.text(
    `${data.companyName} \u2022 ${data.companyAddress} \u2022 USt-IdNr.: ${data.vatId || "n/a"}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 4;
  doc.text(
    "Diese Rechnung wurde automatisch erstellt und ist ohne Unterschrift g\u00fcltig.",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  const buffer = Buffer.from(doc.output("arraybuffer"));
  return buffer;
}
