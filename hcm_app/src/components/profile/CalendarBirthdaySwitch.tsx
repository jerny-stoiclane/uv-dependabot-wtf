import { FormControlLabel, Switch } from '@mui/material';
import { useEffect, useState } from 'react';

import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';
import { ConfigFlags } from '../../utils/constants';

export const CalendarBirthdaySwitch: React.FC = () => {
  const api = useApi();
  const { user } = useUser();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  const fetchFeatureConfig = async () => {
    try {
      const response = await api.company.getConfig();

      const featureEnabled = response.results?.some(
        (config) =>
          config.flag === ConfigFlags.SHOW_CALENDAR_BIRTHDAYS && config.value
      );

      setIsFeatureEnabled(featureEnabled);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserConfig = async () => {
    if (!isFeatureEnabled) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.profiles.getConfig();
      const config = response.results?.find(
        (config) => config.flag === ConfigFlags.SHOW_CALENDAR_BIRTHDAYS
      );
      // default the value to true if no setting
      const enabled = config?.value !== undefined ? config.value : true;
      setIsEnabled(enabled);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConfig = async () => {
    if (!user || !isFeatureEnabled) return;
    try {
      await api.profiles.updateConfig({
        employee_id: user.id,
        flag: ConfigFlags.SHOW_CALENDAR_BIRTHDAYS,
        value: !isEnabled,
      });
      setIsEnabled(!isEnabled);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFeatureConfig();
  }, []);

  useEffect(() => {
    fetchUserConfig();
  }, [isFeatureEnabled]);

  if (isLoading || !isFeatureEnabled) {
    return null;
  }

  return (
    <FormControlLabel
      sx={{
        flexDirection: 'row-reverse',
        ml: 0,
        '& .MuiFormControlLabel-label': {
          m: '0 !important',
        },
      }}
      control={<Switch checked={isEnabled} onChange={toggleConfig} />}
      label="Show birthday on company calendar"
    />
  );
};
