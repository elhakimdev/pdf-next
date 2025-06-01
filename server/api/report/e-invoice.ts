// server/api/report/user.get.ts
import { PDFDocument } from 'pdf-lib';
import { UserReport } from '~/models/report/user.report';

export default defineEventHandler(async (event) => {
  const report = new UserReport({}, await PDFDocument.create());
  const pdfBytes = await report.getBytes(); // use PDFDocument internally

  return new Response(pdfBytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="report.pdf"',
    },
  });
});
