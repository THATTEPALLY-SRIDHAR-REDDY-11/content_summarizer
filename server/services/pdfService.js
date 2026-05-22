import { PDFParse } from 'pdf-parse';

export const extractPdfText = async (buffer) => {
  const parser = new PDFParse({});
  const data = await parser.getText({
    data: buffer
  });
  return data.text.replace(/\s+/g, ' ').trim();
};