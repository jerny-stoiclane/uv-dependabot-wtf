import { Info } from '@mui/icons-material';
import { Alert, AlertTitle, Button } from '@mui/material';
import React from 'react';

interface CignaComplianceBannerProps {
  pdfUrl?: string;
}

const CignaComplianceBanner: React.FC<CignaComplianceBannerProps> = () => {
  const pdfUrl =
    'https://assets.armhr.com/carrier-assets/cigna/2026+Medicare+Part+D+Notice.pdf';

  const handleViewPdf = () => {
    window.open(pdfUrl, '_blank', 'noopener noreferrer');
  };

  return (
    <Alert
      severity="info"
      icon={<Info />}
      sx={{ mb: 3 }}
      action={
        <Button
          color="inherit"
          size="small"
          variant="outlined"
          onClick={handleViewPdf}
        >
          View Cigna Medical Notice
        </Button>
      }
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        Important Information for Cigna Medical Members
      </AlertTitle>
      Compliance Notice Available
    </Alert>
  );
};

export default CignaComplianceBanner;
