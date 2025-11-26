import { Info } from '@mui/icons-material';
import { Alert, AlertTitle, Button } from '@mui/material';
import React from 'react';

interface AnthemComplianceBannerProps {
  pdfUrl?: string;
}

const AnthemComplianceBanner: React.FC<AnthemComplianceBannerProps> = () => {
  const pdfUrl =
    'https://assets.armhr.com/carrier-assets/anthem/Medicare%20Part%20D%20Notice%202025.pdf';

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
          View Anthem Medical Notice
        </Button>
      }
    >
      <AlertTitle sx={{ fontWeight: 600 }}>
        Important Information for Anthem Medical Members
      </AlertTitle>
      Compliance Notice Available
    </Alert>
  );
};

export default AnthemComplianceBanner;
