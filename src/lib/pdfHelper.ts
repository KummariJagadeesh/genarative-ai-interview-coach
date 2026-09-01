import * as pdfjsLib from 'pdfjs-dist';

// Configure pdf.js worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

/**
 * Reads a File object as base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Basic text extraction from plain text files or raw text reader
 */
export function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Extract full text stream from PDF pages with geometric line & column sorting
 */
export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      useSystemFonts: true
    });
    
    const pdf = await loadingTask.promise;
    let fullDocumentText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      if (!textContent || !textContent.items || textContent.items.length === 0) {
        continue;
      }

      // Filter and map items with their spatial coordinates
      interface TextItemCoord {
        str: string;
        x: number;
        y: number;
        width: number;
        height: number;
      }

      const items: TextItemCoord[] = [];
      for (const rawItem of textContent.items) {
        if ('str' in rawItem && rawItem.str) {
          const transform = rawItem.transform; // [scaleX, skewY, skewX, scaleY, transX, transY]
          items.push({
            str: rawItem.str,
            x: transform[4],
            y: transform[5],
            width: rawItem.width || 0,
            height: rawItem.height || 0,
          });
        }
      }

      // Group items by vertical Y line (within 5px tolerance) to preserve resume reading order
      // Higher Y values are near the top of the PDF page in PDF coordinate space
      items.sort((a, b) => {
        const yDiff = b.y - a.y;
        if (Math.abs(yDiff) > 5) {
          return yDiff; // Different lines
        }
        return a.x - b.x; // Same line: sort left-to-right
      });

      let pageText = '';
      let currentY: number | null = null;
      let currentLineWords: string[] = [];

      for (const item of items) {
        if (currentY === null) {
          currentY = item.y;
          currentLineWords.push(item.str);
        } else if (Math.abs(item.y - currentY) > 5) {
          // New line detected
          pageText += currentLineWords.join(' ') + '\n';
          currentY = item.y;
          currentLineWords = [item.str];
        } else {
          currentLineWords.push(item.str);
        }
      }

      if (currentLineWords.length > 0) {
        pageText += currentLineWords.join(' ') + '\n';
      }

      fullDocumentText += `\n--- Page ${pageNum} ---\n` + pageText.trim() + '\n';
    }

    if (fullDocumentText.trim().length > 20) {
      return fullDocumentText.trim();
    }

    // Fallback: raw stream string scanning if textContent yielded little text
    return fallbackRawPdfTextScan(await file.arrayBuffer());
  } catch (err) {
    console.warn("Client PDF.js text extraction notice (trying fallback scan):", err);
    try {
      return fallbackRawPdfTextScan(await file.arrayBuffer());
    } catch (_e) {
      return '';
    }
  }
}

/**
 * Fallback lightweight text extractor for uncompressed or raw streams in PDF
 */
function fallbackRawPdfTextScan(buffer: ArrayBuffer): string {
  try {
    const uint8 = new Uint8Array(buffer);
    let str = '';
    const len = Math.min(uint8.length, 500000);
    for (let i = 0; i < len; i++) {
      const code = uint8[i];
      // Printable ASCII or newline
      if ((code >= 32 && code <= 126) || code === 10 || code === 13) {
        str += String.fromCharCode(code);
      } else if (code === 0) {
        str += ' ';
      }
    }

    // Extract text inside parentheses (BT ... ET blocks in PDF)
    const matches = str.match(/\(([^()]{2,100})\)/g);
    if (matches && matches.length > 10) {
      return matches.map(m => m.slice(1, -1)).join(' ');
    }
    return '';
  } catch (_e) {
    return '';
  }
}

