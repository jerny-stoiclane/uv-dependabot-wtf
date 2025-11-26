import { PageSpinner, pluralize } from '@armhr/ui';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

import OrgChart from '../../components/company/OrgChart';
import { useCompany } from '../../contexts/company.context';
import { useApiData } from '../../hooks/useApiData';
import { useUser } from '../../hooks/useUser';
import { paths } from '../../utils/paths';

const OrgChartPage: React.FC = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { entity } = useUser();
  const company = useCompany();

  const { data: employees, loading } = useApiData((api) =>
    api.company.getEmployees()
  );

  const orgChartEnabled =
    company.config?.find((config) => config.flag === 'show_org_chart')?.value ??
    true;

  useEffect(() => {
    if (!orgChartEnabled) {
      navigate(paths.root);
    }
  }, [orgChartEnabled, navigate]);

  const departments = new Set(
    employees
      ?.map(
        (employee: PublicEmployeeProfile) => employee.position?.department || ''
      )
      .filter((department) => department !== '')
  );

  if (loading) {
    return <PageSpinner />;
  }

  if (fullscreen) {
    return (
      <Dialog fullScreen open={true}>
        <DialogContent
          sx={{
            p: 2,
            backgroundColor: '#b6e5ff',
            backgroundImage: `linear-gradient(transparent 2px, #fff 1px), linear-gradient(90deg, transparent 2px, #fff 1px)`,
            backgroundSize: '18px 18px, 18px 18px',
            backgroundPosition: '0 10px, 10px 0',
          }}
        >
          {/* <Typography variant="subtitle2">Company</Typography> */}
          <Typography variant="body2">
            {departments?.size} {pluralize('Department', departments?.size)},{' '}
            {employees?.length} {pluralize('Employee', employees?.length)}
          </Typography>
          <Box
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <OrgChart
              companyName={entity?.name || 'Company'}
              data={employees}
              fullscreen={true}
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => {
              setFullscreen(false);
            }}
            sx={{ position: 'absolute', top: 16, right: 16 }}
          >
            Exit Fullscreen
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Helmet>
        <title>Organization Chart | Armhr</title>
        <meta
          name="description"
          content="View the company organizational chart and reporting structure."
        />
      </Helmet>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="h2">{entity?.name || 'Company'}</Typography>
          <Typography variant="body1">
            {departments?.size} {pluralize('Department', departments?.size)},{' '}
            {employees?.length} {pluralize('Employee', employees?.length)}
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            onClick={() => {
              setFullscreen(true);
            }}
          >
            Fullscreen
          </Button>
        </Box>
      </Box>
      <Card>
        <Box
          sx={{
            backgroundColor: '#b6e5ff',
            backgroundImage: `linear-gradient(transparent 2px, #fff 1px), linear-gradient(90deg, transparent 2px, #fff 1px)`,
            backgroundSize: '18px 18px, 18px 18px',
            backgroundPosition: '0 10px, 10px 0',
          }}
        >
          <OrgChart companyName={entity?.name || 'Company'} data={employees} />
        </Box>
      </Card>
    </>
  );
};

export default OrgChartPage;
