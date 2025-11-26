import { Box, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfReader: React.FC<{
  pdfUrl: string;
  pageWidth?: number;
}> = ({ pdfUrl, pageWidth }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <Box>
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        }
      >
        {Array.from(new Array(numPages), (_, idx) => (
          <Page
            key={`page-${idx + 1}`}
            pageNumber={idx + 1}
            scale={2}
            width={pageWidth}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <CircularProgress />
              </Box>
            }
          />
        ))}
      </Document>
    </Box>
  );
};

export default PdfReader;
