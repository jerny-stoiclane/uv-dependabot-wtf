import { MainCard } from '@armhr/ui';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { Box, Grid, Stack, Typography } from '@mui/material';

import electionSvg from '../../assets/election.svg';
import { useCompany } from '../../contexts/company.context';

const ElectionCard = () => {
  const { id } = useCompany();

  const afterElection = new Date() > new Date('2024-11-06');

  if (id !== '623085' || afterElection) {
    return null;
  }

  return (
    <MainCard
      border={false}
      contentSX={{ p: 1 }}
      sx={{
        transition: 'all 0.3s ease-in-out',
        background: 'hsla(210, 100%, 96%, 0.5)',
        border: '1px solid hsl(210, 100%, 70%) !important',
        borderRadius: '12px',
        boxShadow:
          'hsla(210, 100%, 90%, 0.5) 0 -3px 1px inset, hsla(210, 100%, 90%, 0.3) 0 2px 4px 0',
      }}
    >
      <Grid container>
        <Grid item md={8.5} sm={8.5} xs={12}>
          <Stack spacing={2} sx={{ p: 2, pb: 0 }}>
            <Typography variant="h3">Election Day Announcement</Typography>
            <Typography variant="h6">
              On Tuesday Nov 5, Heintges will support the time you spend voting,
              working at a poll, plus organized get-out-the-vote efforts (phone
              banking, canvassing, etc.). Please log your time under 9005.00
              Authorized Absence, adding the specific activity you engage in
              under “notes”.
            </Typography>
            <Blockquote />
          </Stack>
        </Grid>
        <Grid
          item
          sm={3.5}
          xs={12}
          sx={{ display: { xs: 'none', sm: 'initial' } }}
        >
          <Stack
            sx={{ position: 'relative' }}
            justifyContent="center"
            alignItems="flex-start"
            alignContent={'center'}
          >
            <img
              width={230}
              src={electionSvg}
              alt="Election"
              style={{ marginTop: 16, marginLeft: 16 }}
            />
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

function Blockquote() {
  return (
    <Box
      sx={{
        position: 'relative',
        p: 3,
        pb: 0,

        borderRadius: '8px',
        maxWidth: '600px',
        margin: '0 auto',
        overflow: 'hidden',
      }}
    >
      <FormatQuoteIcon
        sx={{
          position: 'absolute',
          top: '-20px',
          left: '-20px',
          fontSize: '100px',
          color: 'rgba(33, 150, 243, 0.1)',
        }}
      />
      <Typography
        variant="h6"
        component="blockquote"
        sx={{
          fontStyle: 'italic',
          color: '#333',
          marginBottom: '8px',
        }}
      >
        “The vote is the most powerful nonviolent change agent you have in a
        democratic society. You must use it because it is not guaranteed. You
        can lose it.”
      </Typography>
      <Typography
        variant="subtitle1"
        component="figcaption"
        sx={{ textAlign: 'right', color: '#555' }}
      >
        — John Lewis, former US Congressman
      </Typography>
    </Box>
  );
}

export default ElectionCard;
