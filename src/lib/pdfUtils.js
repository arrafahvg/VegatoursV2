import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const COMPANY = 'VEGATOURS';
const TAGLINE = 'Your Trusted Travel Partner';
const ADDRESS = 'Bali, Indonesia';
const WHATSAPP = '+62 896 461 000';
const EMAIL = 'vegabalitours@gmail.com';
const GOLD = [197, 160, 80];
const DARK = [30, 50, 40];
const LIGHT_GRAY = [248, 247, 244];
const MID_GRAY = [120, 120, 120];

function drawHeader(doc) {
  doc.setFillColor(...GOLD);
  doc.rect(0, 0, 210, 18, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY, 14, 11);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(TAGLINE, 14, 16);
  doc.setFontSize(7);
  doc.text(`${WHATSAPP}  |  ${EMAIL}  |  ${ADDRESS}`, 196, 13, { align: 'right' });
}

function drawFooter(doc, pageNum, totalPages) {
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(0, 280, 210, 17, 'F');
  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`${COMPANY}  –  ${ADDRESS}  –  ${WHATSAPP}`, 14, 285);
  doc.text(`Page ${pageNum} of ${totalPages}`, 196, 285, { align: 'right' });
  doc.text('Thank you for choosing Vegatours!', 105, 290, { align: 'center' });
}

function sectionTitle(doc, text, y) {
  doc.setFillColor(...GOLD);
  doc.rect(14, y - 5, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(text.toUpperCase(), 17, y);
  return y + 8;
}

// Single-column label+value row
function infoRow(doc, label, value, x, y) {
  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(label, x, y);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.text(String(value || '—'), x + 38, y);
}

// Two-column info row (left col and right col, each independent)
function dualRow(doc, labelL, valueL, labelR, valueR, y) {
  // Left column: label at 14, value at 58
  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(labelL, 14, y);
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  const leftVal = doc.splitTextToSize(String(valueL || '—'), 45);
  doc.text(leftVal[0], 58, y);

  // Right column: label at 115, value at 158
  if (labelR) {
    doc.setTextColor(...MID_GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text(labelR, 115, y);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    const rightVal = doc.splitTextToSize(String(valueR || '—'), 38);
    doc.text(rightVal[0], 158, y);
  }
}

export function generateItineraryPDF(b) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  drawHeader(doc);
  let y = 26;

  // Title block
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(14, y, 182, 22, 'F');
  doc.setTextColor(...DARK);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('TRAVEL ITINERARY', 105, y + 9, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID_GRAY);
  doc.text(`Reference: ${b.booking_code || '—'}  |  Prepared: ${format(new Date(), 'dd MMMM yyyy')}`, 105, y + 17, { align: 'center' });
  y += 28;

  // Client info — two column layout with fixed positions
  y = sectionTitle(doc, 'Client & Trip Information', y);
  y += 6;

  dualRow(doc, 'Client Name', b.customer_name, 'Package', b.package_name, y); y += 7;
  dualRow(doc, 'WhatsApp', b.customer_phone, 'Country', b.customer_country, y); y += 7;
  dualRow(doc,
    'Tour Date', b.tour_date ? format(new Date(b.tour_date), 'dd MMMM yyyy') : '—',
    'End Date', b.end_date ? format(new Date(b.end_date), 'dd MMMM yyyy') : '—',
    y
  ); y += 7;
  dualRow(doc, 'Pax', b.pax, '', '', y); y += 12;

  // Itinerary
  y = sectionTitle(doc, 'Itinerary Details', y);
  y += 6;
  doc.setFontSize(9);
  const itinLines = doc.splitTextToSize(b.itinerary || 'Itinerary to be confirmed.', 178);
  for (const line of itinLines) {
    if (y > 272) {
      drawFooter(doc, doc.internal.getNumberOfPages(), '?');
      doc.addPage();
      drawHeader(doc);
      y = 26;
    }
    const isBold = /^Day\s+\d+/i.test(line.trim());
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(...(isBold ? DARK : MID_GRAY));
    doc.text(line, 14, y);
    y += isBold ? 6.5 : 5.5;
  }

  if (b.service_notes) {
    y += 4;
    y = sectionTitle(doc, 'Special Requests', y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MID_GRAY);
    doc.setFontSize(9);
    doc.splitTextToSize(b.service_notes, 178).forEach(line => { doc.text(line, 14, y); y += 5.5; });
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`Itinerary_${b.booking_code || b.customer_name}.pdf`);
}

export function generateInvoicePDF(b, invoice, paymentSettings = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  drawHeader(doc);
  let y = 26;

  const invNum = invoice.invoice_number || `INV-${b.booking_code || Date.now()}`;
  const label = invoice.label || 'Invoice';
  const isPaid = invoice.status === 'paid';
  const currency = invoice.currency || 'IDR';
  const fmt = (n) => `${currency} ${Number(n || 0).toLocaleString('id-ID')}`;

  // Compute totals
  const lineItems = invoice.line_items?.length ? invoice.line_items : [{ description: label, amount: invoice.amount }];
  const subtotal = lineItems.reduce((s, it) => s + (parseFloat(it.amount) || 0), 0);
  const taxPct = parseFloat(invoice.tax_percentage) || 0;
  const taxAmount = subtotal * (taxPct / 100);
  const grandTotal = subtotal + taxAmount;

  // Title block
  doc.setFillColor(...LIGHT_GRAY);
  doc.rect(14, y, 182, 22, 'F');
  doc.setTextColor(...DARK);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 105, y + 9, { align: 'center' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MID_GRAY);
  doc.text(`${label}  |  ${invNum}`, 105, y + 17, { align: 'center' });
  y += 28;

  // PAID watermark
  if (isPaid) {
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.08 }));
    doc.setTextColor(34, 197, 94);
    doc.setFontSize(72);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID', 105, 165, { align: 'center', angle: 30 });
    doc.restoreGraphicsState();
  }

  // Bill To (left) | Invoice Details (right)
  y = sectionTitle(doc, 'Bill To', y);
  y += 5;
  const billToStartY = y;
  doc.setTextColor(...DARK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(b.customer_name || '—', 14, y); y += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MID_GRAY);
  if (b.customer_email) { doc.text(b.customer_email, 14, y); y += 5; }
  if (b.customer_phone) { doc.text(`WhatsApp: ${b.customer_phone}`, 14, y); y += 5; }
  if (b.customer_country) { doc.text(b.customer_country, 14, y); y += 5; }

  // Right-side meta box
  const metaX = 120;
  const metaBoxY = billToStartY - 3;
  doc.setFillColor(248, 247, 244);
  doc.rect(metaX, metaBoxY, 76, 32, 'F');
  doc.setTextColor(...MID_GRAY);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const metaRows = [
    ['Invoice No.', invNum],
    ['Date', format(new Date(), 'dd MMM yyyy')],
    ...(invoice.due_date ? [['Due Date', format(new Date(invoice.due_date), 'dd MMM yyyy')]] : []),
    ['Status', isPaid ? 'PAID' : 'UNPAID'],
  ];
  let mY = metaBoxY + 6;
  metaRows.forEach(([lbl, val]) => {
    doc.setTextColor(...MID_GRAY);
    doc.setFont('helvetica', 'normal');
    doc.text(lbl, metaX + 3, mY);
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.text(String(val), metaX + 76 - 3, mY, { align: 'right' });
    mY += 6.5;
  });

  y = Math.max(y, metaBoxY + 36) + 6;

  // Booking Details
  y = sectionTitle(doc, 'Booking Details', y);
  y += 6;
  dualRow(doc, 'Booking Code', b.booking_code, 'Package', b.package_name, y); y += 7;
  dualRow(doc,
    'Tour Date', b.tour_date ? format(new Date(b.tour_date), 'dd MMM yyyy') : '—',
    'Pax', b.pax || '—',
    y
  ); y += 10;

  // Line items table
  y = sectionTitle(doc, 'Payment Details', y);
  y += 3;

  // Table header
  doc.setFillColor(...DARK);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Description', 18, y + 5.5);
  doc.text('Amount', 192, y + 5.5, { align: 'right' });
  y += 8;

  // Table rows
  lineItems.forEach((item, idx) => {
    const bg = idx % 2 === 0 ? [255, 255, 255] : [250, 249, 246];
    doc.setFillColor(...bg);
    doc.rect(14, y, 182, 8, 'F');
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const descLines = doc.splitTextToSize(item.description || '—', 130);
    doc.text(descLines[0], 18, y + 5.5);
    doc.setFont('helvetica', 'bold');
    doc.text(fmt(item.amount), 192, y + 5.5, { align: 'right' });
    y += 8;
  });

  // Subtotal row (only if there are multiple items or tax)
  if (lineItems.length > 1 || taxPct > 0) {
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(...MID_GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Subtotal', 18, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(fmt(subtotal), 192, y + 4.5, { align: 'right' });
    y += 7;
  }

  // Tax row
  if (taxPct > 0) {
    doc.setFillColor(...LIGHT_GRAY);
    doc.rect(14, y, 182, 7, 'F');
    doc.setTextColor(...MID_GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(`Tax (${taxPct}%)`, 18, y + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DARK);
    doc.text(fmt(taxAmount), 192, y + 4.5, { align: 'right' });
    y += 7;
  }

  // Grand total row
  doc.setFillColor(...GOLD);
  doc.rect(14, y, 182, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL', 18, y + 6.5);
  doc.text(fmt(grandTotal), 192, y + 6.5, { align: 'right' });
  y += 16;

  // Payment instructions
  const method = invoice.payment_method || 'bank_transfer';
  if (method === 'bank_transfer') {
    y = sectionTitle(doc, 'Payment Instructions – Bank Transfer', y);
    y += 6;
    infoRow(doc, 'Bank', paymentSettings.bank_name || 'BCA', 14, y); y += 7;
    infoRow(doc, 'Account Name', paymentSettings.bank_account_name || 'Mochamad Vega Arrafah Setiawan', 14, y); y += 7;
    infoRow(doc, 'Account No.', paymentSettings.bank_account_number || '2310872558', 14, y); y += 12;
  } else if (method === 'qris') {
    y = sectionTitle(doc, 'Payment Instructions – QRIS', y);
    y += 4;
    if (paymentSettings.qris_image_url) {
      doc.addImage(paymentSettings.qris_image_url, 'PNG', 14, y, 50, 50);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MID_GRAY);
      doc.setFontSize(8);
      doc.text('Scan the QRIS code to complete payment.', 70, y + 10);
      y += 56;
    }
  }

  if (invoice.notes) {
    y = sectionTitle(doc, 'Notes', y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MID_GRAY);
    doc.setFontSize(8);
    doc.splitTextToSize(invoice.notes, 178).forEach(line => { doc.text(line, 14, y); y += 5; });
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawFooter(doc, i, totalPages);
  }

  doc.save(`Invoice_${invNum}_${b.customer_name}.pdf`);
}