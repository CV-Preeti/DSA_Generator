import PDFDocument from "pdfkit";
import { Question } from "@shared/schema";

export function generateQuestionsPDF(questions: Question[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on("data", (buffer) => buffers.push(buffer));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    doc.fontSize(20).text("DSA Questions Sheet", { align: "center" });
    doc.moveDown();

    questions.forEach((q, i) => {
      doc.fontSize(14).text(`${i + 1}. ${q.title}`, { continued: true });
      doc.fontSize(10).text(`  (${q.difficulty})`, { align: "right" });
      
      doc.fontSize(10).fillColor("gray").text(`Tags: ${q.companyTags.join(", ")}`);
      doc.fillColor("black");
      
      doc.moveDown(0.5);
      doc.fontSize(12).text(q.description);
      doc.moveDown(1.5);
    });

    doc.end();
  });
}
