import { Dropdown, Section } from '@armhr/ui';
import { ExpandLess, ExpandMore, Info } from '@mui/icons-material';
import { DateRange, LoadingButton } from '@mui/lab';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { eachDayOfInterval } from 'date-fns';
import { Form, useFormikContext } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCompany } from '../../contexts/company.context';
import { normalizeQuillHtml } from '../../utils/benefits';
import PtoBalanceAlert from './PtoBalanceAlert';
import RequestedDatesList from './RequestedDatesList';

type RequestTimeOffFormProps = {
  ptoPlans: PtoPlan[];
  ptoCalculations: Record<string, PtoHourInfo>;
};

const RequestTimeOffForm: React.FC<RequestTimeOffFormProps> = ({
  ptoPlans,
  ptoCalculations,
}) => {
  const navigate = useNavigate();
  const company = useCompany();
  const { setFieldValue, handleChange, handleReset, values, isSubmitting } =
    useFormikContext<RequestTimeOffFormValues>();
  const [dateRange, setDateRange] = useState<DateRange<any>>([null, null]);
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [initialRequests, setInitialRequests] = useState<any>([]);
  const [ptoDescriptionContent, setPtoDescriptionContent] =
    useState<string>('');
  const [showPtoDescriptions, setShowPtoDescriptions] =
    useState<boolean>(false);
  const [expandDescription, setExpandDescription] = useState<boolean>(true);

  // Get PTO descriptions from company config
  useEffect(() => {
    const ptoDescFlag = company.config?.find(
      (config) => config.flag === 'show_pto_descriptions'
    );

    if (ptoDescFlag?.value && ptoDescFlag?.data?.content) {
      setShowPtoDescriptions(true);
      setPtoDescriptionContent(ptoDescFlag.data.content);
    }
  }, [company.config]);

  const getFilteredDates = (startDate: Date, endDate: Date) => {
    let dates = eachDayOfInterval({ start: startDate, end: endDate });

    if (!includeWeekends) {
      dates = dates.filter(
        (date) => date.getDay() !== 0 && date.getDay() !== 6
      );
    }

    return dates.map((date) => ({ date, hours: 8 }));
  };

  // Show weekends for requested date range when the user toggles the checkbox
  useEffect(() => {
    const [startDate, endDate] = dateRange;

    if (!startDate || !endDate) return;

    const datesAsRequests = getFilteredDates(startDate, endDate);
    setFieldValue('requests', datesAsRequests);
  }, [includeWeekends, dateRange, setFieldValue]);

  useEffect(() => {
    if (!values.requests.length) {
      setDateRange([null, null]);
    }
  }, [values.requests]);

  const handleRangeChange = (range: DateRange<any>) => {
    const [startDate, endDate] = range;

    if (!startDate || !endDate) return;

    const datesAsRequests = getFilteredDates(startDate, endDate);

    setDateRange(range);
    setInitialRequests(datesAsRequests);
    setFieldValue('requests', datesAsRequests);
  };

  const handleResetRequested = () => {
    setFieldValue('requests', initialRequests);
  };

  const toggleDescriptionExpand = () => {
    setExpandDescription(!expandDescription);
  };

  return (
    <Form noValidate>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <Typography variant="h2">Request time off</Typography>
        <Box sx={{ ml: 'auto' }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => navigate('/time-off')}
          >
            Back to time off
          </Button>
        </Box>
      </Box>

      <Section
        title="Request details"
        description={
          <Box>
            <Box>
              <Typography variant="body1">
                Your supervisor will be notified when you submit your request.
                You will get an e-mail when they respond.
              </Typography>
            </Box>

            <PtoBalanceAlert
              ptoPlans={ptoPlans}
              ptoCalculations={ptoCalculations}
            />
          </Box>
        }
      >
        {showPtoDescriptions && ptoDescriptionContent && (
          <Alert
            severity="info"
            icon={<Info />}
            sx={{
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
            action={
              <IconButton
                aria-label="toggle description"
                color="inherit"
                size="small"
                onClick={toggleDescriptionExpand}
              >
                {expandDescription ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            }
          >
            <AlertTitle>
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                PTO Policy Information
              </Typography>
            </AlertTitle>
            <Collapse in={expandDescription}>
              <Box
                dangerouslySetInnerHTML={{
                  __html: normalizeQuillHtml(ptoDescriptionContent),
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
                  mt: 1,
                }}
              />
            </Collapse>
          </Alert>
        )}

        <Dropdown
          fullWidth
          name="reason"
          label="Policy"
          required
          options={ptoPlans.map((ptoPlan) => ({
            label: ptoPlan.description,
            value: ptoPlan.type,
          }))}
          value={values.reason}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <DateRangePicker value={dateRange} onChange={handleRangeChange} />

        <Box sx={{ my: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={includeWeekends}
                onChange={(e) => setIncludeWeekends(e.target.checked)}
              />
            }
            label="Include weekends"
          />
        </Box>

        <RequestedDatesList onReset={handleResetRequested} />

        <TextField
          fullWidth
          multiline
          name="message"
          label="Comment (optional)"
          value={values.message}
          rows={4}
          sx={{ mb: 4 }}
          onChange={handleChange}
        />

        <Box display="flex" gap={2} justifyContent="end">
          <Button color="secondary" variant="outlined" onClick={handleReset}>
            Clear
          </Button>
          <LoadingButton
            variant="contained"
            disabled={!values.requests.length}
            type="submit"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Box>
      </Section>
    </Form>
  );
};

export default RequestTimeOffForm;
