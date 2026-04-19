import { jsPDF } from "jspdf"

interface InvoiceData {
  orderId: string
  customerName: string
  date: string
  items: { name: string; price: number; quantity: number }[]
  total: number
  platform: string
}

export async function generateInvoicePDF(data: InvoiceData) {
  const doc = new jsPDF()
  const gold = "#f27a1a" // Champagne Gold highlight

  // Header - Brand
  doc.setFont("helvetica", "bold")
  doc.setFontSize(28)
  doc.text("CANTA", 20, 30)
  doc.setTextColor(150, 150, 150)
  doc.text("PLUS", 60, 30)
  
  // Header - Info
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Corporate Trade Command Center", 20, 38)
  doc.text("Istanbul, TR | cantaplus.com", 20, 43)

  // Invoice Details
  doc.setFontSize(36)
  doc.setTextColor(240, 240, 240)
  doc.text("INVOICE", 140, 40)
  
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.setFont("helvetica", "bold")
  doc.text(`ID: ${data.orderId}`, 145, 50)
  doc.text(`DATE: ${data.date}`, 145, 55)
  doc.text(`PLATFORM: ${data.platform.toUpperCase()}`, 145, 60)

  // Horizontal Line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 70, 190, 70)

  // Customer Info
  doc.setFontSize(12)
  doc.text("CUSTOMER", 20, 85)
  doc.setFont("helvetica", "normal")
  doc.text(data.customerName, 20, 92)
  doc.setFontSize(9)
  doc.text("Verified Transaction", 20, 97)

  // Table Headers
  doc.setFillColor(250, 250, 250)
  doc.rect(20, 110, 170, 10, "F")
  doc.setFont("helvetica", "bold")
  doc.text("DESCRIPTION", 25, 116)
  doc.text("QTY", 120, 116)
  doc.text("UNIT PRICE", 140, 116)
  doc.text("TOTAL", 170, 116)

  // Items
  let y = 128
  data.items.forEach((item) => {
    doc.setFont("helvetica", "normal")
    doc.text(item.name, 25, y)
    doc.text(item.quantity.toString(), 122, y)
    doc.text(`TRY ${item.price.toLocaleString()}`, 140, y)
    doc.text(`TRY ${(item.price * item.quantity).toLocaleString()}`, 170, y)
    y += 10
  })

  // Footer - Totals
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.5)
  doc.line(140, y + 5, 190, y + 5)
  
  doc.setFontSize(14)
  doc.text("TOTAL DUE", 140, y + 15)
  doc.setFontSize(18)
  doc.setTextColor(242, 122, 26) // Gold
  doc.text(`TRY ${data.total.toLocaleString()}`, 140, y + 25)

  // Save the PDF
  doc.save(`Invoice_${data.orderId}.pdf`)
}
