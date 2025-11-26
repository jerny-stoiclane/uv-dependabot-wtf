import {
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardActionsProps,
  CardContent,
  CardContentProps,
  CardProps,
  CircularProgress,
  Typography,
} from '@mui/material';
import { ReactNode } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewCardProps {
  pdfUrl: string;
  handleActionAreaClick?: (...args: any[]) => void;
  previewHeight?: number;
  previewWidth?: number;
  cardProps?: Partial<CardProps>;
  contentChildren?: ReactNode;
  contentProps?: Partial<CardContentProps>;
  actionChildren?: ReactNode;
  actionProps?: Partial<CardActionsProps>;
}

const PdfPreviewCard: React.FC<PdfPreviewCardProps> = ({
  pdfUrl,
  handleActionAreaClick,
  previewHeight = 160,
  previewWidth = 220,
  cardProps,
  contentChildren,
  contentProps,
  actionChildren,
  actionProps,
}) => {
  return (
    <Card sx={{ display: 'flex', flexDirection: 'column' }} {...cardProps}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardActionArea onClick={handleActionAreaClick}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              overflow: 'hidden',
              height: previewHeight,
            }}
          >
            <Document
              file={pdfUrl}
              loading={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress />
                </Box>
              }
              onLoadError={(e) => console.error(e)}
              error={
                <Box sx={{ m: 2, textAlign: 'center' }}>
                  <Typography color="error">
                    Error loading PDF preview
                  </Typography>
                </Box>
              }
            >
              <Page
                width={previewWidth}
                pageNumber={1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>
          </Box>
        </CardActionArea>
        {contentChildren && (
          <CardContent {...contentProps}>{contentChildren}</CardContent>
        )}
      </Box>
      {actionChildren && (
        <CardActions sx={{ mt: 'auto', mb: 1 }} {...actionProps}>
          {actionChildren}
        </CardActions>
      )}
    </Card>
  );
};

export default PdfPreviewCard;
