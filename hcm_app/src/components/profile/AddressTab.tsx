import { Section } from '@armhr/ui';
import { Grid, Paper } from '@mui/material';
import { useFormikContext } from 'formik';

import { PlacesAddressComponent } from './PlacesAddressComponent';

export const AddressTab = ({
  refreshProfile,
}: {
  refreshProfile: () => void;
}) => {
  const { values } = useFormikContext<ProfileFormValues>();

  return (
    <Section title="Address" vertical={true}>
      <Grid container columnSpacing={2} rowSpacing={2}>
        <Grid item xs={12} md={4} position="relative" zIndex={2}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              },
            }}
          >
            <PlacesAddressComponent
              title="Resident address"
              name="home_address"
              address={values.address_info?.home_address}
              refreshProfile={refreshProfile}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} position="relative" zIndex={2}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              },
            }}
          >
            <PlacesAddressComponent
              title="Mailing address"
              name="alt_address"
              address={values.address_info?.alt_address}
              residentAddress={values.address_info?.home_address}
              refreshProfile={refreshProfile}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} position="relative" zIndex={2}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              height: '100%',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              },
            }}
          >
            <PlacesAddressComponent
              title="W-2 address"
              name="w2_address"
              address={values.address_info?.w2_address}
              residentAddress={values.address_info?.home_address}
              refreshProfile={refreshProfile}
            />
          </Paper>
        </Grid>
      </Grid>
    </Section>
  );
};
