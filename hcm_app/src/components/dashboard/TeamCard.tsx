import { Avatar } from '@armhr/ui';
import { Box, Card, Link, Typography } from '@mui/material';
import React from 'react';

const TeamCard: React.FC<{ teamContacts: PrismTeamContact[] }> = ({
  teamContacts,
}) => {
  if (!teamContacts.length) return null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Your Armhr team</Typography>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 1.2,
        }}
      >
        {teamContacts.map((contact) => (
          <Box
            key={contact.email}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              background: '#fafbfc',
              border: '1px solid #f3f4f6',
              borderRadius: 1,
              p: 1.5,
              gap: 2,
              minWidth: 0,
            }}
          >
            <Avatar
              sx={{ width: 28, height: 28, mr: 1, mt: 0.2 }}
              name={contact.name}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{ mt: 0.2 }}
                fontWeight={500}
                fontSize={13.5}
                noWrap
              >
                {contact.name}
              </Typography>
              <Typography color="text.primary" fontSize={12.5} noWrap>
                <Link
                  href={`mailto:${contact.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontSize: 12.5 }}
                >
                  {contact.email}
                </Link>
              </Typography>
              <Typography color="text.primary" fontSize={11.5} noWrap>
                {contact.title}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
};

export default TeamCard;
