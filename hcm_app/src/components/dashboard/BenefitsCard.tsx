import { PictureAsPdf } from '@mui/icons-material';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  Box,
  Card,
  Chip,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import {
  getBenefitsProviderLogo,
  getCurrentBenefits,
  getTypeInfo,
  humanize,
  sortBenefits,
} from '../../utils/benefits';
import { paths } from '../../utils/paths';

type BenefitsCardProps = {
  benefits: InsurancePlan[];
};

const BenefitsCard: React.FC<BenefitsCardProps> = ({ benefits }) => {
  const currentBenefits = getCurrentBenefits(benefits || []);

  if (!currentBenefits.length) return null;

  const sortedBenefits = sortBenefits(currentBenefits);

  return (
    <Card
      sx={{
        borderRadius: 3,
        p: 3,
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Benefits</Typography>
        <Box sx={{ ml: 'auto' }}>
          <Link
            component={RouterLink}
            to={paths.benefits}
            sx={{ fontSize: 14 }}
          >
            View all benefits
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowY: 'auto',
          flex: 1,
        }}
      >
        {sortedBenefits.map((benefit) => {
          const typeInfo = getTypeInfo(benefit.type, benefit.offer_type_code);
          const providerLogo = getBenefitsProviderLogo(benefit.name);
          const detail =
            benefit.details && benefit.details.length > 0
              ? benefit.details[0]
              : undefined;
          const hasDependents =
            detail && detail.dependent && detail.dependent.length > 0;
          const hasBeneficiaries =
            detail && detail.beneficiary && detail.beneficiary.length > 0;
          return (
            <Box
              key={benefit.id}
              sx={{
                width: '100%',
                background: '#fafbfc',
                border: '1px solid #f3f4f6',
                borderRadius: 1,
                p: 1.5,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                minHeight: 32,
                gap: 0.5,
              }}
            >
              {/* Row 1: Logo, Name, Type Chip, Status Chip */}
              <Box display="flex" alignItems="center" width="100%" gap={1}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  {providerLogo && (
                    <img
                      src={providerLogo}
                      alt="Provider logo"
                      width={80}
                      height={20}
                      style={{
                        objectFit: 'contain',
                        objectPosition: 'center',
                        background: 'transparent',
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontSize: 13,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      flex: 1,
                      fontWeight: 500,
                    }}
                  >
                    {humanize(benefit.name)}
                  </Typography>
                  {benefit.plan_desc_url && (
                    <Tooltip title="Download Plan PDF">
                      <IconButton
                        size="small"
                        component="a"
                        color="primary"
                        href={decodeURIComponent(benefit.plan_desc_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <PictureAsPdf fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                  {(hasDependents || hasBeneficiaries) && (
                    <Box display="flex" alignItems="center" gap={1}>
                      {hasDependents && (
                        <Tooltip title="Dependents" arrow>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            sx={{
                              color: '#2563EB',
                              borderRadius: 1,
                              px: 0.75,
                              py: 0.25,
                              fontSize: 11,
                            }}
                          >
                            <GroupOutlinedIcon
                              sx={{ fontSize: 12, color: '#2563EB' }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: '#2563EB',
                              }}
                            >
                              {detail.dependent.length}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                      {hasBeneficiaries && (
                        <Tooltip title="Beneficiaries" arrow>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={0.5}
                            sx={{
                              color: '#8B5CF6',
                              borderRadius: 1,
                              px: 0.75,
                              py: 0.25,
                              fontSize: 11,
                            }}
                          >
                            <InfoOutlinedIcon
                              sx={{ fontSize: 12, color: '#8B5CF6' }}
                            />
                            <Typography
                              sx={{
                                fontSize: 11,
                                color: '#8B5CF6',
                              }}
                            >
                              {detail.beneficiary.length}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                  {typeInfo && (
                    <Chip
                      label={typeInfo.label}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: typeInfo.color,
                        color: typeInfo.color,
                        backgroundColor: 'transparent',
                        height: 20,
                        fontSize: 11,
                        ml: 0.5,
                        borderRadius: 1.5,
                        borderWidth: 1,
                        '& .MuiChip-label': {
                          px: 1,
                          py: 0.25,
                        },
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box display="flex" alignItems="center" width="100%" gap={1}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    flex: 1,
                  }}
                >
                  {benefit.plan_desc_url && (
                    <Tooltip title="Download Plan PDF">
                      <IconButton
                        size="small"
                        component="a"
                        color="primary"
                        href={decodeURIComponent(benefit.plan_desc_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ p: 0.5 }}
                      >
                        <PictureAsPdf fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {benefit.carrier_url && (
                    <Link
                      href={benefit.carrier_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        color: 'primary.main',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Login to {benefit.name.split(' ')[0]}
                    </Link>
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default BenefitsCard;
