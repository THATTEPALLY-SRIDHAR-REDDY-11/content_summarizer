export const extractPdfText = async (buffer) => {
  const canvasModule = await import('@napi-rs/canvas');

  if (typeof globalThis.DOMMatrix === 'undefined') {
    globalThis.DOMMatrix = canvasModule.DOMMatrix;
  }

  if (typeof globalThis.ImageData === 'undefined') {
    globalThis.ImageData = canvasModule.ImageData;
  }

  if (typeof globalThis.Path2D === 'undefined' && canvasModule.Path2D) {
    globalThis.Path2D = canvasModule.Path2D;
  }

  const { PDFParse } = await import('pdf-parse');
  PDFParse.setWorker(new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).href);
  const parser = new PDFParse({});
  const data = await parser.getText({ data: buffer });

  return data.text.replace(/\s+/g, ' ').trim();
};