import { PageSpinner, useNotifications } from '@armhr/ui';
import {
  ExpandLess,
  ExpandMore,
  FileUploadOutlined,
  MoreVert,
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import AdminHandbookAssignModal from '../../components/admin/AdminHandbookAssignModal';
import AdminHandbookProgressBar from '../../components/admin/AdminHandbookProgressBar';
import PdfPreviewCard from '../../components/common/PdfPreviewCard';
import { useApi } from '../../hooks/useApi';
import { useApiData } from '../../hooks/useApiData';
import { formatKeyToHandbookTitle, isValidPDF } from '../../utils/handbooks';

const PdfReader = lazy(() => import('../../components/common/PdfReader'));

const AdminHandbooksPage: React.FC = () => {
  const api = useApi();
  const { showNotification } = useNotifications();

  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false);
  const [selectedAction, setSelectedAction] = useState<
    'archive' | 'delete' | 'unarchive' | null
  >(null);
  const [selectedHandbook, setSelectedHandbook] =
    useState<HandbookAsset | null>();
  const [menuAnchorEl, setMenuAnchorEl] = useState<{
    [key: number]: HTMLElement | null;
  }>({});

  const [assignments, setAssignments] = useState<{
    [handbook_id: number]: EmployeeHandbookAssignment[];
  }>({});

  const [fileUploading, setFileUploading] = useState<boolean>(false);
  const [isArchivedExpanded, setIsArchivedExpanded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: handbooks,
    loading: handbooksLoading,
    error: handbooksError,
    refresh,
  } = useApiData((api) => api.admin.getCompanyHandbooks());

  useEffect(() => {
    const fetchAndSetAssignments = async (id: number) => {
      try {
        const { results: assignments } = await api.admin.getEmployeeAssignments(
          id
        );
        setAssignments((current) => ({ ...current, [id]: assignments }));
      } catch (e) {
        console.log(e);
      }
    };
    handbooks?.map((book) => fetchAndSetAssignments(book.id));
  }, [handbooks]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleHandbookChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!isValidPDF(selectedFile.name)) {
        showNotification({
          message: 'Invalid file type. Handbook upload must be a PDF.',
          severity: 'error',
        });
        return;
      }

      const formData = new FormData();
      formData.append('handbook', selectedFile);

      try {
        setFileUploading(true);
        await api.admin.uploadHandbook(formData);
        showNotification({
          message: 'Successfully uploaded handbook',
          severity: 'success',
        });
        refresh();
      } catch (error) {
        showNotification({
          message: 'Unable to upload handbook. Please try again.',
          severity: 'error',
        });
      } finally {
        setFileUploading(false);
      }
    }
  };

  const handleDeleteHandbook = async (handbook_id: number) => {
    try {
      const response = await api.admin.deleteHandbook(handbook_id);
      response.success
        ? showNotification({
            message: 'Successfully deleted handbook',
            severity: 'success',
            autoHideDuration: 4000,
          })
        : showNotification({
            message: 'Unable to delete handbook. Please try again later.',
            severity: 'error',
          });
      refresh();
    } catch (e) {
      showNotification({
        message: 'Unable to delete handbook. Please try again later.',
        severity: 'error',
      });
    }
  };

  const handleArchiveHandbook = async (handbook: HandbookAsset) => {
    try {
      await api.admin.archiveEmployeeHandbook(handbook.id, handbook);
      showNotification({
        message: 'Successfully updated archive status of handbook',
        severity: 'success',
      });
      refresh();
    } catch (e) {
      showNotification({
        message:
          'Unable to update archive status of handbook. Please try again later.',
        severity: 'error',
      });
    }
  };

  if (handbooksLoading) return <PageSpinner />;
  return (
    <Box>
      <Helmet>
        <title>Company Handbooks | Armhr</title>
        <meta
          name="description"
          content="Manage and assign company handbooks to employees."
        />
      </Helmet>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h2">Company Handbooks</Typography>
      </Box>
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              Active handbooks
            </Typography>
            <Typography variant="caption">
              Please note: only PDFs are supported
            </Typography>
          </Box>
          <Box>
            <input
              type="file"
              accept=".pdf,application/pdf"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleHandbookChange}
            />
            <LoadingButton
              variant="contained"
              onClick={handleUploadClick}
              loading={fileUploading}
              startIcon={<FileUploadOutlined />}
            >
              Upload Handbook
            </LoadingButton>
          </Box>
        </Box>
        <Box>
          {!!handbooksError ? (
            <Box>
              <Alert severity="error">
                Unable to load handbooks. Please try back again later.
              </Alert>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Active */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {handbooks
                  ?.filter((book) => !book.archived)
                  .map((book, idx) => (
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
                            }}
                          >
                            <Typography variant="h5" align="center">
                              {formatKeyToHandbookTitle(book.key ?? '')}
                            </Typography>
                          </Box>
                        }
                        actionChildren={
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              px: 2,
                            }}
                          >
                            <Box sx={{ flex: 1 }} />
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => {
                                setIsAssignOpen(true);
                                setSelectedHandbook(book);
                              }}
                            >
                              Assign/unassign
                            </Button>
                            <Box
                              sx={{
                                flex: 1,
                                display: 'flex',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <IconButton
                                onClick={(e) =>
                                  setMenuAnchorEl({
                                    [book.id]: e.currentTarget,
                                  })
                                }
                              >
                                <MoreVert />
                              </IconButton>
                            </Box>
                            <Menu
                              anchorEl={menuAnchorEl[book.id] || null}
                              open={Boolean(menuAnchorEl[book.id])}
                              onClose={() =>
                                setMenuAnchorEl({
                                  [book.id]: null,
                                })
                              }
                            >
                              <MenuItem
                                onClick={() => {
                                  setMenuAnchorEl({
                                    [book.id]: null,
                                  });
                                  setSelectedHandbook({
                                    ...book,
                                    archived: true,
                                  });
                                  setSelectedAction('archive');
                                }}
                              >
                                Archive
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  setMenuAnchorEl({
                                    [book.id]: null,
                                  });
                                  setSelectedHandbook(book);
                                  setSelectedAction('delete');
                                }}
                              >
                                Delete
                              </MenuItem>
                            </Menu>
                          </Box>
                        }
                      />
                    </Box>
                  ))}
              </Box>

              {/* Archived */}
              {handbooks?.some((book) => book.archived) && (
                <Box sx={{ mt: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      mb: 2,
                      p: 2,
                      '&:hover': {
                        backgroundColor: '#fafafa',
                      },
                    }}
                    onClick={() => setIsArchivedExpanded(!isArchivedExpanded)}
                  >
                    <Typography variant="h4" sx={{ flexGrow: 1 }}>
                      Archived handbooks
                    </Typography>
                    {isArchivedExpanded ? <ExpandLess /> : <ExpandMore />}
                  </Box>

                  {isArchivedExpanded && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {handbooks
                        ?.filter((book) => book.archived)
                        .map((book, idx) => (
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
                                  }}
                                >
                                  <Typography
                                    textAlign="center"
                                    variant="h4"
                                    color="grey"
                                  >
                                    ARCHIVED
                                  </Typography>
                                  <Typography variant="h5" align="center">
                                    {formatKeyToHandbookTitle(book.key ?? '')}
                                  </Typography>
                                </Box>
                              }
                              actionChildren={
                                <Stack
                                  direction={'row'}
                                  sx={{
                                    width: '100%',
                                    justifyContent: 'center',
                                    gap: 2,
                                  }}
                                >
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => {
                                      setSelectedHandbook(book);
                                      setSelectedAction('delete');
                                    }}
                                  >
                                    Delete
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() => {
                                      setSelectedHandbook({
                                        ...book,
                                        archived: false,
                                      });
                                      setSelectedAction('unarchive');
                                    }}
                                  >
                                    Unarchive
                                  </Button>
                                </Stack>
                              }
                            />
                          </Box>
                        ))}
                    </Box>
                  )}
                </Box>
              )}
              {!!selectedHandbook && (
                <>
                  <AdminHandbookAssignModal
                    open={isAssignOpen}
                    handleClose={() => {
                      setIsAssignOpen(false);
                      setSelectedHandbook(null);
                    }}
                    handleUpdateAssign={setAssignments}
                    assignments={assignments}
                    handbookId={selectedHandbook?.id!}
                  />

                  {isReaderOpen && (
                    <Dialog open={isReaderOpen} maxWidth="lg">
                      <DialogContent>
                        <Suspense fallback={<PageSpinner />}>
                          <PdfReader pdfUrl={selectedHandbook.presigned_url!} />
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

                  <HandbookActionDialog
                    handbook={selectedHandbook}
                    action={selectedAction}
                    onClose={() => {
                      setSelectedHandbook(null);
                      setSelectedAction(null);
                    }}
                    onArchive={handleArchiveHandbook}
                    onDelete={handleDeleteHandbook}
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {handbooks &&
        handbooks.length > 0 &&
        handbooks.some(
          (book) => !book.archived && assignments[book.id]?.length > 0
        ) && (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', mb: 3 }}>
              <Typography variant="h4" sx={{ flexGrow: 1 }}>
                Handbook assignment progress
              </Typography>
            </Box>
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={2}
              justifyContent={'center'}
            >
              {handbooks
                .filter((handbook) => !handbook.archived)
                .map((handbook, idx) => (
                  <AdminHandbookProgressBar
                    key={`${handbook.id}-${idx}-progress`}
                    handbook={handbook}
                    assignments={assignments[handbook.id]}
                  />
                ))}
            </Box>
          </Box>
        )}
    </Box>
  );
};

interface HandbookActionDialogProps {
  handbook: HandbookAsset;
  action: 'archive' | 'delete' | 'unarchive' | null;
  onClose: () => void;
  onArchive: (handbook: HandbookAsset) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const HandbookActionDialog: React.FC<HandbookActionDialogProps> = ({
  handbook,
  action,
  onClose,
  onArchive,
  onDelete,
}) => {
  if (!action) return null;

  const content = {
    archive: {
      title: 'Archive confirmation',
      description:
        'This handbook will no longer be viewable by employees but all records of signed acknowledgements will be retained.',
    },
    delete: {
      title: 'Delete confirmation',
      description:
        'This action cannot be undone and will erase all progress for those assigned.',
    },
    unarchive: {
      title: 'Unarchive confirmation',
      description: 'This handbook will be viewable by employees again.',
    },
  };

  const isArchive = action === 'archive' || action === 'unarchive';

  const handleAction = () => {
    if (isArchive) {
      onArchive(handbook);
    } else {
      onDelete(handbook.id);
    }
    onClose();
  };

  return (
    <Dialog open={true} maxWidth="sm">
      <DialogTitle>{content[action].title}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body1">
            Are you sure you would like to {action}{' '}
            {formatKeyToHandbookTitle(handbook.key)}?
          </Typography>
          <Typography variant="body1">{content[action].description}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color={action === 'delete' ? 'error' : 'primary'}
          onClick={handleAction}
        >
          {action === 'delete'
            ? 'Delete'
            : action === 'archive'
            ? 'Archive'
            : 'Unarchive'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminHandbooksPage;
