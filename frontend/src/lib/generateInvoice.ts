import jsPDF from 'jspdf'

interface InvoiceData {
  bookingNumber: string
  guestName: string
  guestEmail: string
  guestPhone?: string
  roomName: string
  checkIn: string
  checkOut: string
  nights: number
  pricePerNight: number
  totalAmount: number
  status: string
  createdAt: string
}

export function generateInvoice(data: InvoiceData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const W = 210
  const NAVY:  [number,number,number] = [27,  43,  107]
  const GOLD:  [number,number,number] = [201, 168, 76]
  const GRAY:  [number,number,number] = [110, 110, 110]
  const LIGHT: [number,number,number] = [246, 243, 236]
  const DARK:  [number,number,number] = [40,  40,  40]
  const WHITE: [number,number,number] = [255, 255, 255]

  // ── HEADER BAND ──────────────────────────────────────────
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, W, 42, 'F')

  // Triangle logo
  doc.setFillColor(...GOLD)
  doc.lines([[0, -12], [10, 0], [-10, 0]], 15, 34, [1, 1], 'F')

  // Brand name
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.text('SKY STAY RESORTS', 30, 20)

  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.text('MEMORIES RECREATED', 30, 27)

  doc.setTextColor(190, 190, 200)
  doc.setFontSize(6.5)
  doc.text('Manjakuttai Road, Yercaud, Tamil Nadu 636602  |  +91 90030 10567  |  info@skystayresorts.com', 30, 35)

  // INVOICE label (right side)
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('INVOICE', W - 14, 20, { align: 'right' })

  doc.setTextColor(...GOLD)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text(`# ${data.bookingNumber}`, W - 14, 29, { align: 'right' })

  const invoiceDate = new Date(data.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  doc.setTextColor(190, 190, 200)
  doc.setFontSize(7)
  doc.text(`Date: ${invoiceDate}`, W - 14, 36, { align: 'right' })

  // ── BILLED TO + STAY DETAILS (two columns) ───────────────
  const boxY = 50, boxH = 44

  // Left box – BILLED TO
  doc.setFillColor(...LIGHT)
  doc.rect(14, boxY, 86, boxH, 'F')
  doc.setFillColor(...NAVY)
  doc.rect(14, boxY, 86, 9, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('BILLED TO', 19, boxY + 6.2)

  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text(data.guestName, 19, boxY + 19)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...GRAY)
  doc.text(data.guestEmail, 19, boxY + 27)
  if (data.guestPhone) doc.text(data.guestPhone, 19, boxY + 34)

  // Right box – STAY DETAILS
  const rxL = 110
  doc.setFillColor(...LIGHT)
  doc.rect(rxL, boxY, 86, boxH, 'F')
  doc.setFillColor(...NAVY)
  doc.rect(rxL, boxY, 86, 9, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('STAY DETAILS', rxL + 5, boxY + 6.2)

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  const details = [
    ['Room',      data.roomName],
    ['Check-in',  fmt(data.checkIn)],
    ['Check-out', fmt(data.checkOut)],
    ['Nights',    String(data.nights)],
  ]
  details.forEach(([label, value], i) => {
    const ry = boxY + 18 + i * 8
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...GRAY)
    doc.text(label + ':', rxL + 5, ry)
    doc.setTextColor(...DARK)
    doc.text(value, rxL + 30, ry)
  })

  // ── ITEMS TABLE ───────────────────────────────────────────
  const tY = boxY + boxH + 10

  // Table header
  doc.setFillColor(...NAVY)
  doc.rect(14, tY, W - 28, 8, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  doc.text('DESCRIPTION',  19,       tY + 5.5)
  doc.text('NIGHTS',       120,      tY + 5.5, { align: 'right' })
  doc.text('RATE / NIGHT', 155,      tY + 5.5, { align: 'right' })
  doc.text('AMOUNT',       W - 15,   tY + 5.5, { align: 'right' })

  // Table row
  const rY = tY + 8
  doc.setFillColor(250, 249, 245)
  doc.rect(14, rY, W - 28, 10, 'F')
  doc.setTextColor(...DARK)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  const base = Math.round(data.pricePerNight * data.nights)
  doc.text(data.roomName,                              19,      rY + 7)
  doc.text(String(data.nights),                        120,     rY + 7, { align: 'right' })
  doc.text(`Rs. ${data.pricePerNight.toLocaleString('en-IN')}`, 155, rY + 7, { align: 'right' })
  doc.text(`Rs. ${base.toLocaleString('en-IN')}`,      W - 15,  rY + 7, { align: 'right' })

  // Thin separator
  doc.setDrawColor(220, 220, 220)
  doc.setLineWidth(0.3)
  doc.line(14, rY + 10, W - 14, rY + 10)

  // ── TOTALS ────────────────────────────────────────────────
  const tax   = Math.round(base * 0.12)
  const total = base + tax

  let ty = rY + 22
  const col1 = 145, col2 = W - 15

  const drawRow = (label: string, value: string, bold = false) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(bold ? 10 : 8.5)
    doc.setTextColor(bold ? NAVY[0] : GRAY[0], bold ? NAVY[1] : GRAY[1], bold ? NAVY[2] : GRAY[2])
    doc.text(label, col1, ty, { align: 'right' })
    doc.setTextColor(...DARK)
    doc.text(value, col2, ty, { align: 'right' })
    ty += bold ? 0 : 8
  }

  drawRow('Subtotal',  `Rs. ${base.toLocaleString('en-IN')}`)
  drawRow('GST (12%)', `Rs. ${tax.toLocaleString('en-IN')}`)

  // Gold divider ABOVE total
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.6)
  doc.line(col1 - 35, ty - 2, col2, ty - 2)
  ty += 5

  drawRow('TOTAL AMOUNT', `Rs. ${total.toLocaleString('en-IN')}`, true)

  // ── STATUS BADGE ──────────────────────────────────────────
  ty += 10
  const badgeColor: [number,number,number] =
    data.status === 'confirmed'   ? [34, 139, 34]  :
    data.status === 'checked_out' ? [59, 130, 246]  :
    data.status === 'pending'     ? [217, 150, 0]  :
                                    [156, 163, 175]
  doc.setFillColor(...badgeColor)
  doc.roundedRect(14, ty, 36, 8, 2, 2, 'F')
  doc.setTextColor(...WHITE)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.text(data.status.replace('_', ' ').toUpperCase(), 32, ty + 5.2, { align: 'center' })

  // ── FOOTER ────────────────────────────────────────────────
  doc.setFillColor(...NAVY)
  doc.rect(0, 272, W, 25, 'F')

  doc.setTextColor(...GOLD)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Thank you for choosing Sky Stay Resorts!', W / 2, 282, { align: 'center' })

  doc.setTextColor(180, 185, 200)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.text('info@skystayresorts.com  |  +91 90030 10567  |  skystayresorts.com', W / 2, 290, { align: 'center' })

  // ── SAVE ──────────────────────────────────────────────────
  const blob = doc.output('blob')
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `SkyStay-Invoice-${data.bookingNumber}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
