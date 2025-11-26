import { Avatar, MainCard } from '@armhr/ui';
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { differenceInMonths } from 'date-fns';
import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { preferredPronouns } from '../../utils/constants';
import { formatDate } from '../../utils/date';
import { paths } from '../../utils/paths';
import {
  getDisplayName,
  humanizeDepartment,
  humanizeTitle,
} from '../../utils/profile';

const Profile: React.FC<{ employee: PublicEmployeeProfile }> = ({
  employee,
}) => {
  const navigate = useNavigate();

  const showPronouns =
    employee.preferred_pronouns &&
    ['H', 'S', 'TH'].includes(employee.preferred_pronouns);

  const preferredPronoun = preferredPronouns.find(({ value }) => {
    return value === employee.preferred_pronouns;
  })?.label;

  const personalData = [
    {
      label: 'Email address',
      value: employee.work_email_address,
      link: `mailto:${employee.work_email_address}`,
    },
    {
      label: 'Office location',
      value: `${employee.office_location?.city}, ${employee.office_location?.state}`,
    },
    {
      label: 'Pronouns',
      value: showPronouns ? preferredPronoun : '',
    },
    {
      label: 'Title',
      value: humanizeTitle(employee.position?.employee_title),
    },
    {
      label: 'Department',
      value: humanizeDepartment(employee.position?.department),
    },
    {
      label: 'Start date',
      value: employee.first_hire_date && formatDate(employee.first_hire_date),
    },

    {
      label: 'Time with company',
      value: calculateTimeWithCompany(employee.first_hire_date),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'end', mb: 4 }} gap={2}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button variant="outlined" to={paths.directory} component={RouterLink}>
          View directory
        </Button>
      </Box>

      <Grid container>
        <Grid item xs={12} md={3}>
          <Box>
            <Avatar
              src={employee?.profile_picture}
              name={getDisplayName(employee)}
              sx={{ mb: 1, height: 80, width: 80, fontSize: 32 }}
            />
            <Typography variant="h3">
              {getDisplayName(employee)}
              {showPronouns && (
                <Typography ml={1} component="span">
                  ({preferredPronoun})
                </Typography>
              )}
            </Typography>
            {!!employee.position?.employee_title && (
              <Typography sx={{ color: 'grey.500' }} variant="subtitle1">
                {humanizeTitle(employee.position.employee_title)}
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={9} gap={2}>
          <MainCard>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="stretch"
              gap={3}
            >
              <Box mb={2} flex="1">
                <Grid container spacing={2}>
                  {personalData.map((item) => (
                    <Grid item xs={12} md={4} key={item.label}>
                      <Typography variant="caption">{item.label}</Typography>
                      {item.link ? (
                        <Typography>
                          <Link
                            to={item.link}
                            component={RouterLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.value}
                          </Link>
                        </Typography>
                      ) : (
                        <Typography>{item.value}</Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

const calculateTimeWithCompany = (startDate?: string) => {
  if (startDate === '' || startDate === null || startDate === undefined) {
    return '';
  }

  const now = new Date();
  const start = new Date(startDate);

  const totalMonths = differenceInMonths(now, start);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years} years ${months} months`;
};

export default Profile;
