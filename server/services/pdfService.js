import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

const getPdfWorkerUrl = () => {
  const workerPath = require.resolve('pdfjs-dist/legacy/build/pdf.worker.min.mjs');
  return pathToFileURL(workerPath).href;
};

export const extractPdfText = async (buffer) => {
  let canvasModule;

  try {
    canvasModule = await import('@napi-rs/canvas');
  } catch {
    canvasModule = null;
  }

  if (canvasModule && typeof globalThis.DOMMatrix === 'undefined') {
    globalThis.DOMMatrix = canvasModule.DOMMatrix;
  }

  if (canvasModule && typeof globalThis.ImageData === 'undefined') {
    globalThis.ImageData = canvasModule.ImageData;
  }

  if (canvasModule && typeof globalThis.Path2D === 'undefined' && canvasModule.Path2D) {
    globalThis.Path2D = canvasModule.Path2D;
  }

  const { PDFParse } = await import('pdf-parse');
  PDFParse.setWorker(getPdfWorkerUrl());
  const parser = new PDFParse({});
  const data = await parser.getText({ data: buffer });

  return data.text.replace(/\s+/g, ' ').trim();
};