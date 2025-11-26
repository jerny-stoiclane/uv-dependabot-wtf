import { FormikDatePicker, useNotifications } from '@armhr/ui';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Field, Formik } from 'formik';
import { useRef, useState } from 'react';
import { Form } from 'react-router-dom';
import * as Yup from 'yup';

import { useApi } from '../../hooks/useApi';
import { extractFilename } from '../../utils/files';
import PdfReader from '../common/PdfReader';

const HandbookSignModal: React.FC<{
  refresh: () => void;
  onClose?: () => void;
  handbook: EmployeeHandbookAssignment;
}> = ({ refresh, onClose, handbook }) => {
  const api = useApi();
  const { showNotification } = useNotifications();
  const contentRef = useRef(null);
  const [open, setOpen] = useState<boolean>(true);
  const [step, setStep] = useState<number>(1);
  const [reachedBottom, setReachedBottom] = useState<boolean>(false);

  const handleHandbookSigned = async (values: {
    signature: string;
    signed_at: string;
  }) => {
    try {
      const { results } = await api.profiles.updateHandbookStatus({
        ...handbook,
        signed_at: values.signed_at,
        signature: values.signature,
        status: 'signed',
      });
      if (results.status === 'signed') {
        showNotification({
          message: `All done! Your acknowledgement and signature have been successfully recorded.`,
          severity: 'success',
        });
        refresh();
        window.scrollTo(0, 0);
      } else
        showNotification({
          message:
            'Sorry, your signature did not save. Please try again later.',
          severity: 'error',
        });
    } catch (e) {
      console.error(e);
      showNotification({
        message: 'Sorry, your signature did not save. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleScroll = () => {
    if (handbook.status !== 'signed' && contentRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = contentRef.current;
      if (Math.abs(scrollHeight - scrollTop) - clientHeight < 1) {
        setReachedBottom(true);
      }
    }
  };

  return (
    <Dialog open={open} maxWidth="lg">
      <DialogTitle
        sx={{
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
        }}
      >
        Handbook Acknowledgement for{' '}
        {extractFilename(handbook.presigned_url ?? '')}
      </DialogTitle>
      <Formik
        initialValues={{ signed_at: '', signature: '' }}
        validationSchema={Yup.object().shape({
          signature: Yup.string().required('Required'),
          signed_at: Yup.string().required('Required'),
        })}
        validateOnBlur
        onSubmit={(values) => {
          handleHandbookSigned(values);
          setOpen(false);
          onClose && onClose();
        }}
      >
        {({ errors, touched, submitForm }) => {
          return (
            <>
              <DialogContent ref={contentRef} onScroll={handleScroll}>
                <Form>
                  {step === 1 && (
                    <Slide
                      direction="left"
                      in={step === 1}
                      mountOnEnter
                      unmountOnExit
                      timeout={{
                        enter: 400,
                        exit: 400,
                      }}
                      container={contentRef.current}
                    >
                      <Box sx={{ width: '100%' }}>
                        <Alert
                          severity="info"
                          sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            '& .MuiAlert-icon': {
                              fontSize: 22,
                            },
                            '& .MuiAlert-message': {
                              mt: 0,
                            },
                          }}
                        >
                          Please review the entire document in order to proceed
                          to the next page.
                        </Alert>
                        <PdfReader
                          pdfUrl={handbook.presigned_url!}
                          pageWidth={500}
                        />
                      </Box>
                    </Slide>
                  )}
                  {step === 2 && (
                    <Slide
                      direction="left"
                      in={step === 2}
                      mountOnEnter
                      unmountOnExit
                      timeout={{
                        enter: 400,
                        exit: 400,
                      }}
                      container={contentRef.current}
                    >
                      <Box
                        display="flex"
                        flexDirection="column"
                        gap={5}
                        sx={{ mt: 3 }}
                      >
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Typography variant="h5">
                            I acknowledge that I have received and reviewed this
                            handbook.
                          </Typography>
                          <Typography variant="h5">
                            I understand that my electronic acknowledgment is
                            the legal equivalent of my signature.
                          </Typography>
                        </Box>
                        <Box
                          display="flex"
                          maxWidth="100%"
                          justifyContent="space-between"
                          gap={2}
                        >
                          <Field
                            variant="standard"
                            fullWidth
                            name="signature"
                            as={TextField}
                            label="Signature"
                            error={touched.signature && !!errors.signature}
                          />
                          <FormikDatePicker
                            slotProps={{ textField: { variant: 'standard' } }}
                            name="signed_at"
                            label="Date signed"
                            error={!!errors.signed_at}
                          />
                        </Box>
                      </Box>
                    </Slide>
                  )}
                </Form>
              </DialogContent>
              <DialogActions>
                <Stack direction="row" gap={1} sx={{ mr: 1, mt: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOpen(false);
                      onClose && onClose();
                    }}
                  >
                    Close
                  </Button>

                  {step === 1 && (
                    <Tooltip
                      placement="top"
                      title={
                        !reachedBottom
                          ? 'Must view entire document to proceed'
                          : null
                      }
                    >
                      <div>
                        <Button
                          variant="contained"
                          disabled={!reachedBottom}
                          onClick={() => setStep(2)}
                        >
                          Next
                        </Button>
                      </div>
                    </Tooltip>
                  )}
                  {step === 2 && (
                    <>
                      <Button variant="outlined" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button variant="contained" onClick={submitForm}>
                        Sign and submit
                      </Button>
                    </>
                  )}
                </Stack>
              </DialogActions>
              ;
            </>
          );
        }}
      </Formik>
    </Dialog>
  );
};

export default HandbookSignModal;
