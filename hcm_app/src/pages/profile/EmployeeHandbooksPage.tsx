import { FullPageSpinner, PageSpinner } from '@armhr/ui';
import {
  Alert,
  Badge,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { Suspense, useState } from 'react';
import { Helmet } from 'react-helmet';

import PdfPreviewCard from '../../components/common/PdfPreviewCard';
import PdfReader from '../../components/common/PdfReader';
import HandbookSignModal from '../../components/dashboard/HandbookSignModal';
import { useApiData } from '../../hooks/useApiData';
import { formatDate } from '../../utils/date';
import { extractFilename } from '../../utils/files';

const EmployeeHandbooksPage: React.FC = () => {
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isSignOpen, setIsSignOpen] = useState<boolean>(false);
  const [selectedHandbook, setSelectedHandbook] =
    useState<EmployeeHandbookAssignment | null>();

  const {
    data: handbooks,
    error: handbooksError,
    loading: handbooksLoading,
    refresh,
  } = useApiData((api) => api.profiles.getMyHandbooks());

  if (handbooksLoading) return <FullPageSpinner open={handbooksLoading} />;
  return (
    <Box>
      <Helmet>
        <title>My Handbooks | Armhr</title>
        <meta name="description" content="View and sign company handbooks." />
      </Helmet>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2">My Handbooks</Typography>
      </Box>
      <Box sx={{ mb: 8 }}>
        <Box>
          {!!handbooksError ? (
            <Box>
              <Alert severity="error">
                Unable to load handbooks. Please try back again later.
              </Alert>
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" sx={{ mb: 3 }}>
                Current handbooks
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {handbooks?.map((book, idx) => (
                  <Badge
                    key={`${book.id}-${book.employee_id}`}
                    badgeContent=" "
                    color="error"
                    invisible={['signed', 'read_only'].includes(book.status)}
                  >
                    <Box key={idx}>
                      <PdfPreviewCard
                        pdfUrl={book.presigned_url || ''}
                        handleActionAreaClick={() => {
                          setSelectedHandbook(book);
                          setIsReaderOpen(true);
                        }}
                        cardProps={{
                          sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            width: 300,
                            height: '100%',
                          },
                        }}
                        contentChildren={
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 2,
                              justifyContent: 'space-around',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="h5" align="center">
                              {extractFilename(book.presigned_url ?? '')}
                            </Typography>
                            {!['signed', 'read_only'].includes(book.status) && (
                              <Typography
                                align="center"
                                color={
                                  book.status === 'overdue' ? 'red' : 'black'
                                }
                              >
                                {`Due by: ${formatDate(book.due_date)}`}
                              </Typography>
                            )}
                          </Box>
                        }
                        actionChildren={
                          <Stack
                            direction={'row'}
                            spacing={1}
                            justifyContent={'center'}
                            sx={{ width: '100%' }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedHandbook(book);
                                setIsReaderOpen(true);
                              }}
                            >
                              View
                            </Button>
                            {!['signed', 'read_only'].includes(book.status) && (
                              <Button
                                disabled={book.status === 'signed'}
                                size="small"
                                variant="contained"
                                onClick={() => {
                                  setSelectedHandbook(book);
                                  setIsSignOpen(true);
                                }}
                              >
                                {book.status === 'signed'
                                  ? 'Completed'
                                  : 'Review and Sign'}
                              </Button>
                            )}
                          </Stack>
                        }
                      />
                    </Box>
                  </Badge>
                ))}
                {!!selectedHandbook && (
                  <>
                    {isReaderOpen && (
                      <Dialog open={isReaderOpen} maxWidth="lg">
                        <DialogContent>
                          <Suspense fallback={<PageSpinner />}>
                            <PdfReader
                              pdfUrl={selectedHandbook.presigned_url!}
                            />
                          </Suspense>
                        </DialogContent>
                        <DialogActions>
                          <Box
                            display="flex"
                            sx={{ width: '100%', justifyContent: 'right' }}
                          >
                            <Button
                              variant="contained"
                              onClick={() => {
                                setIsReaderOpen(false);
                                setSelectedHandbook(null);
                              }}
                            >
                              Close
                            </Button>
                          </Box>
                        </DialogActions>
                      </Dialog>
                    )}
                    {isSignOpen && (
                      <HandbookSignModal
                        refresh={refresh}
                        onClose={() => setIsSignOpen(false)}
                        handbook={selectedHandbook}
                      />
                    )}
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeHandbooksPage;
