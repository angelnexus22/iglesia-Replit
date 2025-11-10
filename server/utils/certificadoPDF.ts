import PDFDocument from "pdfkit";
import type { Sacramento } from "@shared/schema";

export function generarCertificadoPDF(sacramento: Sacramento): PDFKit.PDFDocument {
  const doc = new PDFDocument({
    size: "A4",
    layout: "portrait",
    margins: { top: 50, bottom: 50, left: 50, right: 50 }
  });

  const tipoSacramento = sacramento.tipo.toUpperCase();
  
  // Borde decorativo
  doc.rect(30, 30, doc.page.width - 60, doc.page.height - 60)
    .lineWidth(3)
    .stroke("#8B4513");

  doc.rect(40, 40, doc.page.width - 80, doc.page.height - 80)
    .lineWidth(1)
    .stroke("#8B4513");

  // Título principal
  doc.fontSize(32)
    .font("Helvetica-Bold")
    .fillColor("#2C1810")
    .text("CERTIFICADO DE", 0, 100, { align: "center" });

  doc.fontSize(36)
    .fillColor("#8B4513")
    .text(tipoSacramento, 0, 145, { align: "center" });

  // Cruz decorativa
  const centerX = doc.page.width / 2;
  doc.fontSize(48)
    .fillColor("#8B4513")
    .text("✝", centerX - 20, 200);

  // Texto descriptivo
  doc.fontSize(14)
    .font("Helvetica")
    .fillColor("#333333")
    .text("La Parroquia certifica que:", 0, 270, { align: "center" });

  // Nombre del feligrés
  doc.fontSize(28)
    .font("Helvetica-Bold")
    .fillColor("#2C1810")
    .text(sacramento.nombreFeligres, 0, 310, { align: "center" });

  // Detalles del sacramento
  const detalles = [
    `Recibió el Sacramento de ${tipoSacramento}`,
    `el día ${sacramento.fecha}`,
    `en ${sacramento.lugarCelebracion}`,
    `siendo Ministro: ${sacramento.ministro}`
  ];

  let yPosition = 370;
  detalles.forEach(detalle => {
    doc.fontSize(14)
      .font("Helvetica")
      .fillColor("#333333")
      .text(detalle, 0, yPosition, { align: "center" });
    yPosition += 25;
  });

  // Padrinos (si aplica)
  if (sacramento.nombrePadrino || sacramento.nombreMadrina) {
    yPosition += 15;
    doc.fontSize(12)
      .fillColor("#555555")
      .text("Padrinos:", 0, yPosition, { align: "center" });
    yPosition += 20;
    
    if (sacramento.nombrePadrino) {
      doc.text(`Padrino: ${sacramento.nombrePadrino}`, 0, yPosition, { align: "center" });
      yPosition += 18;
    }
    
    if (sacramento.nombreMadrina) {
      doc.text(`Madrina: ${sacramento.nombreMadrina}`, 0, yPosition, { align: "center" });
      yPosition += 18;
    }
  }

  // Partida
  if (sacramento.partida) {
    yPosition += 10;
    doc.fontSize(11)
      .fillColor("#777777")
      .text(`Partida No. ${sacramento.partida}`, 0, yPosition, { align: "center" });
  }

  // Firma y sello
  const firmaY = doc.page.height - 150;
  
  doc.fontSize(12)
    .fillColor("#333333")
    .text("_________________________", 0, firmaY, { align: "center" });

  doc.fontSize(11)
    .fillColor("#555555")
    .text("Párroco", 0, firmaY + 20, { align: "center" });

  // Pie de página con fecha de emisión
  doc.fontSize(9)
    .fillColor("#999999")
    .text(
      `Certificado emitido el ${new Date().toLocaleDateString("es-MX", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      })}`,
      0,
      doc.page.height - 60,
      { align: "center" }
    );

  return doc;
}
