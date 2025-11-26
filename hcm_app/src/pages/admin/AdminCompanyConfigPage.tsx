import {
  CarOutlined,
  ClusterOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useNotifications } from '@armhr/ui';
import {
  AddPhotoAlternate,
  Cake,
  Description,
  Info,
  Link as LinkIcon,
} from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import RichEditor from '../../components/common/RichEditor';
import LogoUpload from '../../components/company/LogoUpload';
import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import { normalizeQuillHtml } from '../../utils/benefits';
import { paths } from '../../utils/paths';

type Config = {
  show_company_logo: boolean;
  show_calendar_birthdays: boolean;
  show_org_chart: boolean;
  show_custom_link: boolean;
  show_pto_descriptions: boolean;
  show_bonus_tax_withholding: boolean;
  armhr_pto_enabled: boolean;
  fsa_commuter_enrollment_enabled: boolean;
  hide_company_directory: boolean;
  user_defined_fields_enabled: boolean;
};

interface CompanyConfig {
  id?: number;
  client_id: string;
  flag: string;
  data: any;
  value: boolean;
}

const AdminCompanyConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { user, company, refresh } = useUser();
  const { showNotification } = useNotifications();

  const defaultConfigs: Config = {
    show_company_logo: false,
    show_calendar_birthdays: false,
    show_org_chart: false,
    show_custom_link: false,
    show_pto_descriptions: false,
    show_bonus_tax_withholding: false,
    armhr_pto_enabled: true,
    fsa_commuter_enrollment_enabled: true,
    hide_company_directory: false,
    user_defined_fields_enabled: false,
  };

  const [config, setConfig] = useState<Config>(defaultConfigs);
  const [customLinkData, setCustomLinkData] = useState<{
    name: string;
    url: string;
  }>({ name: '', url: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [ptoModalOpen, setPtoModalOpen] = useState(false);
  const [ptoDescription, setPtoDescription] = useState<string>('');
  const [ptoSaveError, setPtoSaveError] = useState<string | null>(null);
  const [ptoLastUpdatedBy, setPtoLastUpdatedBy] = useState<string | null>(null);
  const [ptoLastUpdatedAt, setPtoLastUpdatedAt] = useState<string | null>(null);

  const configSections = [
    {
      flag: 'show_company_logo',
      icon: <AddPhotoAlternate style={{ fontSize: '2rem' }} />,
      title: 'Company logo',
      description:
        'The logo will be displayed in the top left corner of the application and used any time your company is mentioned.',
    },
    {
      flag: 'show_calendar_birthdays',
      icon: <Cake style={{ fontSize: '2rem' }} />,
      title: 'Birthdays on company calendar',
      description:
        "Employees can choose to share their birthday on the company calendar on their profile page. Only the day and month will be shown. The first time that this feature is enabled, all employee birthdays will be toggled on automatically. Subsequent changes will respect the employee's last opt-in setting. On by default for new hires if this feature is enabled.",
    },
    {
      flag: 'show_org_chart',
      icon: <ClusterOutlined style={{ fontSize: '2rem' }} />,
      title: 'Company org chart',
      description:
        'Enable or disable the company org chart. When enabled, employees can view the company org chart from the navigation.',
    },
    {
      flag: 'hide_company_directory',
      icon: <DatabaseOutlined style={{ fontSize: '2rem' }} />,
      title: 'Hide company directory',
      description:
        'When enabled, all employees (including admins) cannot view the company directory from the navigation.',
    },
    {
      flag: 'show_custom_link',
      icon: <LinkIcon style={{ fontSize: '2rem' }} />,
      title: 'Custom link',
      description:
        'Add a custom link to the sidebar under the Company section, as well as the directory page. Useful for linking to your company handbook or other internal resources.',
    },
    {
      flag: 'armhr_pto_enabled',
      icon: <ScheduleIcon style={{ fontSize: '2rem' }} />,
      title: 'Armhr PTO',
      description: (
        <>
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Only disable Armhr PTO if your company is not using Armhr for PTO.
          </Typography>{' '}
          When disabled, the "Time off" sidebar item will be hidden in the
          employee portal for all employees and "Time off requests" will be
          hidden in the admin portal.
        </>
      ),
    },
    {
      flag: 'show_pto_descriptions',
      icon: <Description style={{ fontSize: '2rem' }} />,
      title: 'PTO Policy descriptions',
      description:
        'Add custom descriptions for PTO policies that will be shown to employees when they request time off.',
    },
    {
      flag: 'show_bonus_tax_withholding',
      icon: <Description style={{ fontSize: '2rem' }} />,
      title: 'Bonus Additional Tax Withholding Form',
      description:
        'Enable or disable the bonus additional tax withholding form. When enabled, employees can access the form in the employee portal under Tax information > Bonus tax withholding.',
    },
    {
      flag: 'fsa_commuter_enrollment_enabled',
      icon: <CarOutlined style={{ fontSize: '2rem' }} />,
      title: 'FSA Commuter Enrollment',
      description: (
        <>
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Only disable if your company is not offering FSA Commuter
            Enrollment.
          </Typography>{' '}
          When disabled, the "Benefits {'>'} Commuter enrollment" sidebar item
          will be hidden in the employee portal for all employees.
        </>
      ),
    },
    ...(company?.id && ['000001', '623217'].includes(company.id) // temp until full release, avoiding a second flag
      ? [
          {
            flag: 'user_defined_fields_enabled',
            icon: <SettingsIcon style={{ fontSize: '2rem' }} />,
            title: 'Custom Defined Fields',
            description:
              'Enable custom fields that employees will be asked to fill out on their profile. Admins can configure field types, requirements, and options.',
          },
        ]
      : []),
  ];

  const fetchConfig = async () => {
    try {
      const response = await api.company.getConfig();

      const configWithFetchedData = response.results.reduce(
        (acc: Config, conf: CompanyConfig) => {
          acc[conf.flag as keyof Config] = conf.value;
          if (conf.flag === 'show_custom_link') {
            setCustomLinkData(conf.data || { name: '', url: '' });
          }
          if (conf.flag === 'show_pto_descriptions') {
            if (conf.data?.content) {
              setPtoDescription(conf.data.content);

              // Store the last updater information if available
              if (conf.data.last_updated_by) {
                setPtoLastUpdatedBy(conf.data.last_updated_by);
              }
              if (conf.data.last_updated_at) {
                setPtoLastUpdatedAt(conf.data.last_updated_at);
              }
            } else {
              setPtoDescription('');
            }
          }
          return acc;
        },
        { ...defaultConfigs }
      );
      setConfig(configWithFetchedData);
    } catch (error) {
      console.error('Error fetching configuration:', error);
    }
  };

  useEffect(() => {
    if (!user?.is_admin) {
      navigate(-1);
      return;
    }

    fetchConfig();
  }, [api, user?.is_admin, navigate]);

  const handleToggle = async (flag: keyof Config) => {
    if (flag === 'show_custom_link' && !config.show_custom_link) {
      setModalOpen(true);
    } else if (
      flag === 'show_pto_descriptions' &&
      !config.show_pto_descriptions &&
      !config.armhr_pto_enabled // disable (grey out) pto description toggle if armhr pto is disabled
    ) {
      setPtoModalOpen(true);
    } else {
      const newConfig = {
        ...config,
        [flag]: !config[flag],
      };
      setConfig(newConfig);

      try {
        if (company?.id) {
          const dataToSend: CompanyConfig = {
            client_id: company.id,
            flag,
            value: newConfig[flag],
            data:
              flag === 'show_custom_link'
                ? customLinkData
                : flag === 'show_pto_descriptions'
                ? { content: ptoDescription }
                : undefined,
          };
          await api.company.updateConfig(dataToSend);
        }

        if (
          flag === 'show_company_logo' ||
          flag === 'show_org_chart' ||
          flag === 'show_custom_link' ||
          flag === 'show_pto_descriptions' ||
          flag === 'show_bonus_tax_withholding' ||
          flag === 'armhr_pto_enabled' ||
          flag === 'fsa_commuter_enrollment_enabled' ||
          flag === 'hide_company_directory'
        ) {
          refresh();
        }
      } catch (error) {
        showNotification({
          message:
            'Error saving settings, our team has been notified. Please refresh and try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleCustomLinkChange =
    (field: 'name' | 'url') => (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomLinkData((prevData) => ({
        ...prevData,
        [field]: event.target.value,
      }));
    };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenPtoModal = () => {
    setPtoSaveError(null);
    setPtoModalOpen(true);
  };

  const handleClosePtoModal = () => {
    setPtoSaveError(null);
    setPtoModalOpen(false);
  };

  const handleSaveCustomLink = async () => {
    try {
      if (company?.id) {
        const dataToSend: CompanyConfig = {
          client_id: company.id,
          flag: 'show_custom_link',
          value: true,
          data: customLinkData,
        };
        await api.company.updateConfig(dataToSend);
        setConfig((prevConfig) => ({
          ...prevConfig,
          show_custom_link: true,
        }));
        refresh();
        handleCloseModal();
        showNotification({
          message: 'Custom link updated successfully.',
          severity: 'success',
        });
      }
    } catch (error) {
      showNotification({
        message:
          'Error saving custom link, our team has been notified. Please refresh and try again.',
        severity: 'error',
      });
    }
  };

  const handleSavePtoDescription = async () => {
    setPtoSaveError(null);
    try {
      if (company?.id) {
        // Make sure we're sending valid HTML content
        const cleanedContent = ptoDescription.trim();

        // Get the current user's name for tracking who updated the description
        const updaterName = user
          ? `${user.first_name} ${user.last_name}`
          : 'Unknown user';
        const updateDate = new Date().toISOString();

        const dataToSend: CompanyConfig = {
          client_id: company.id,
          flag: 'show_pto_descriptions',
          value: true,
          data: {
            content: cleanedContent,
            last_updated_by: updaterName,
            last_updated_at: updateDate,
          },
        };

        await api.company.updateConfig(dataToSend);
        setConfig((prevConfig) => ({
          ...prevConfig,
          show_pto_descriptions: true,
        }));
        handleClosePtoModal();
        showNotification({
          message: 'PTO descriptions updated successfully.',
          severity: 'success',
        });

        // Call refresh() to update user and company data
        refresh();

        // Explicitly call fetchConfig to update the last_updated_by information
        await fetchConfig();
      }
    } catch (error) {
      console.error('Error saving PTO description:', error);
      setPtoSaveError(
        'Error saving PTO descriptions. Please try again or contact support if the issue persists.'
      );
    }
  };

  return (
    <Box>
      <Helmet>
        <title>Company Configuration | Armhr</title>
        <meta
          name="description"
          content="Configure company settings and preferences."
        />
      </Helmet>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h2">Company settings</Typography>
          <Typography variant="body1">
            These changes will affect everyone in your company.
          </Typography>
        </Box>
      </Box>

      <List sx={{ '& .MuiListItem-root': { p: 2 } }}>
        {configSections.map(({ flag, icon, title, description }) => {
          if (
            flag === 'show_bonus_tax_withholding' &&
            !user?.is_bonus_tax_withholding_enabled
          ) {
            return null;
          }
          return (
            <ListItem
              key={flag}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'white',
                mb: 2,
              }}
            >
              <ListItemIcon
                sx={{
                  color: 'primary.main',
                  ml: 1,
                  mr: 2,
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="h5">{title}</Typography>}
                secondary={
                  <Box
                    sx={{
                      fontSize: 13,
                      width: '90%',
                      color: 'grey.500',
                      pr: 6,
                    }}
                  >
                    {description}
                  </Box>
                }
              />
              {flag === 'show_company_logo' && (
                <Box sx={{ mr: 4 }}>
                  <LogoUpload />
                </Box>
              )}
              {flag === 'show_custom_link' && config.show_custom_link && (
                <Button
                  onClick={handleOpenModal}
                  variant="outlined"
                  sx={{ mr: 4, whiteSpace: 'nowrap' }}
                >
                  Configure Link
                </Button>
              )}
              {flag === 'show_pto_descriptions' &&
                config.show_pto_descriptions && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', mr: 4 }}>
                    <Button
                      onClick={handleOpenPtoModal}
                      variant="outlined"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Configure PTO Descriptions
                    </Button>
                    {ptoLastUpdatedBy && (
                      <Typography
                        variant="caption"
                        sx={{ mt: 0.5, textAlign: 'center' }}
                      >
                        Last updated by: {ptoLastUpdatedBy}
                        <span>
                          {ptoLastUpdatedAt &&
                            ` on ${new Date(
                              ptoLastUpdatedAt
                            ).toLocaleDateString()}`}
                        </span>
                      </Typography>
                    )}
                  </Box>
                )}
              {flag === 'user_defined_fields_enabled' && (
                <Box>
                  <Button
                    onClick={() => navigate(paths.adminCustomFields)}
                    variant="outlined"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Configure fields
                  </Button>
                </Box>
              )}
              {flag !== 'user_defined_fields_enabled' && (
                <Switch
                  edge="end"
                  onChange={() => handleToggle(flag as keyof Config)}
                  checked={Boolean(config[flag])}
                  disabled={
                    flag === 'show_pto_descriptions' &&
                    !config.armhr_pto_enabled // if armhr pto is disabled, pto descriptions should be too
                  }
                  inputProps={{
                    'aria-labelledby': `switch-list-label-${flag}`,
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Configure Custom link</DialogTitle>
        <DialogContent>
          <TextField
            label="Label"
            variant="outlined"
            fullWidth
            value={customLinkData.name}
            onChange={handleCustomLinkChange('name')}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label="URL"
            variant="outlined"
            fullWidth
            value={customLinkData.url}
            onChange={handleCustomLinkChange('url')}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={handleSaveCustomLink}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={ptoModalOpen}
        onClose={handleClosePtoModal}
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            minHeight: '500px',
            maxWidth: '800px',
            width: '100%',
          },
        }}
      >
        <DialogTitle>Configure PTO Descriptions</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Create rich text descriptions that will be shown to employees when
            they request time off. This information will appear in an info box
            at the top of the request form.
          </Typography>
          {ptoSaveError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setPtoSaveError(null)}
            >
              {ptoSaveError}
            </Alert>
          )}
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Edit PTO Description (Use the toolbar to format text, add links,
            images, or change colors)
          </Typography>
          <RichEditor
            value={ptoDescription}
            onChange={(content) => {
              setPtoDescription(content);
            }}
            height="300px"
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Preview:
            </Typography>
            <Alert
              severity="info"
              icon={<Info />}
              sx={{
                mb: 3,
                '& .MuiAlert-message': {
                  width: '100%',
                },
              }}
            >
              <AlertTitle>
                <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                  PTO Policy Information
                </Typography>
              </AlertTitle>
              <Box
                dangerouslySetInnerHTML={{
                  __html: normalizeQuillHtml(ptoDescription),
                }}
                sx={{
                  '& a': { color: 'primary.main' },
                  '& ul': {
                    paddingLeft: '40px',
                    listStyleType: 'disc',
                    margin: '8px 0',
                  },
                  '& ol': {
                    paddingLeft: '40px',
                    listStyleType: 'decimal',
                    margin: '8px 0',
                  },
                  '& li': {
                    display: 'list-item',
                    margin: '4px 0',
                  },
                  fontFamily:
                    "'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                  fontSize: '16px',
                  mt: 1,
                }}
              />
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePtoModal}>Cancel</Button>
          <Button
            onClick={handleSavePtoDescription}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminCompanyConfigPage;
