import { pdf } from '@react-pdf/renderer';

import BenefitConfirmationPdfDocument from '../components/benefits/BenefitConfirmationPdfDocument';
import { triggerDownload } from './profile';

const createBlobURL = (blob: Blob): string => {
  return window.URL.createObjectURL(blob);
};

export const exportBenefitsConfirmationPdf = async (
  data: EnrollmentConfirmation
): Promise<void> => {
  try {
    const blob = await pdf(
      <BenefitConfirmationPdfDocument data={data} />
    ).toBlob();
    const fileURL = createBlobURL(blob);
    triggerDownload(
      fileURL,
      `armhr-2024-benefits-confirmation-${data.employeeInfo.confirmCode}.pdf`
    );
  } catch (err) {
    console.error('Error generating PDF:', err);
    throw err;
  }
};
