import { MainCard } from '@armhr/ui';
import { Box, Button, Grid, Link, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import welcomeSvg from '../../assets/welcome.svg';
import { useCompany } from '../../contexts/company.context';

const WelcomeCard = () => {
  const { name } = useCompany();

  const storedDismissFlag = localStorage.getItem('welcome_dismissed');
  const parsedDismissFlag = storedDismissFlag === 'true';

  const [open, setOpen] = useState(!parsedDismissFlag);

  useEffect(() => {
    if (!open) {
      localStorage.setItem('welcome_dismissed', 'true');
    }
  }, [open]);

  if (!open) return null;

  return (
    <MainCard
      border={false}
      sx={{
        background: 'hsla(210, 100%, 96%, 0.5)',
        borderRadius: '12px',
        boxShadow:
          'hsla(210, 100%, 90%, 0.5) 0 -3px 1px inset, hsla(210, 100%, 90%, 0.3) 0 2px 4px 0',
      }}
    >
      <Grid container>
        <Grid item md={7} sm={7} xs={12}>
          <Stack spacing={2} sx={{ padding: 2 }}>
            <Typography variant="h2">Welcome to Armhr!</Typography>
            <Typography variant="h6">
              Here you'll find everything you need to know about your benefits,
              pay history, time off, and more while working at{' '}
              <strong>{name}</strong>.
            </Typography>
            <Box>
              <Button
                size="medium"
                variant="contained"
                component={Link}
                onClick={() => setOpen(false)}
              >
                Get started
              </Button>
            </Box>
          </Stack>
        </Grid>
        <Grid
          item
          sm={5}
          xs={12}
          sx={{ display: { xs: 'none', sm: 'initial' } }}
        >
          <Stack
            sx={{ position: 'relative' }}
            justifyContent="center"
            alignItems="flex-end"
          >
            <img width={250} src={welcomeSvg} alt="Welcome" />
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default WelcomeCard;
