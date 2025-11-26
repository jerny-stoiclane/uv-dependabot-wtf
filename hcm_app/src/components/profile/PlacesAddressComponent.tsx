import useGooglePlaces from '@armhr/ui/src/components/Input/googlePlaces/useGooglePlaces';
import { googleToInternalPlaceDetails } from '@armhr/ui/src/utils/googlePlaces';
import { Check, LocationOnOutlined } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Modal,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { Field, Formik, FormikProps, useFormikContext } from 'formik';
import { useEffect, useRef, useState } from 'react';

import { useApi } from '../../hooks/useApi';
import { useUser } from '../../hooks/useUser';

const isEmptyAddress = (address?: Address): boolean => {
  if (!address) return true;
  return !address.address_line_1 && !address.city && !address.state;
};

const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const AddressFields = ({ isLoadingDetails }: { isLoadingDetails: boolean }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mt: 2,
        bgcolor: 'grey.50',
        borderRadius: 1,
      }}
    >
      {isLoadingDetails && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            Loading address details...
          </Typography>
        </Box>
      )}

      <Field
        as={TextField}
        fullWidth
        size="medium"
        label="Address line 1"
        name="address_line_1"
        required
        autoComplete="off"
        sx={{ mb: 2.5 }}
      />

      <Field
        as={TextField}
        fullWidth
        size="medium"
        label="Address line 2"
        name="address_line_2"
        autoComplete="off"
        sx={{ mb: 2.5 }}
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
        <Field
          as={TextField}
          fullWidth
          size="medium"
          label="City"
          name="city"
          required
          autoComplete="off"
        />

        <Field
          as={TextField}
          fullWidth
          size="medium"
          label="State"
          name="state"
          required
          autoComplete="off"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Field
          as={TextField}
          fullWidth
          size="medium"
          label="Zip"
          name="zipcode"
          required
          autoComplete="off"
        />
      </Box>
    </Paper>
  );
};

// TODO: swap with @armhr/ui
const PlacesSearch = ({
  formik,
  setIsLoadingDetails,
  setErrorMessage,
}: {
  formik: FormikProps<any>;
  setIsLoadingDetails: (loading: boolean) => void;
  setErrorMessage: (message: string | null) => void;
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Google Places Hook
  const { placePredictions, getPlacePredictions } = useGooglePlaces({
    apiKey: 'AIzaSyAc1YTQ2fOO28hxTxwOHFkaYb5cByCmIbU',
  });

  // Click outside handler for search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePlaceSelect = (
    prediction: google.maps.places.PlacePrediction | null
  ) => {
    if (!prediction) return;
    setSearchInput(prediction.text.text);
    setShowResults(false);
    setIsLoadingDetails(true);
    setErrorMessage(null);

    // Immediately fetch and populate the form fields
    const place = prediction.toPlace();
    place
      .fetchFields({ fields: ['displayName', 'addressComponents'] })
      .then(() => {
        const placeDetails = googleToInternalPlaceDetails(place);
        formik.setFieldValue('address_line_1', placeDetails.address);
        formik.setFieldValue('city', placeDetails.city);
        formik.setFieldValue('state', placeDetails.state);
        formik.setFieldValue('zipcode', placeDetails.zip);
        formik.setFieldValue('county', placeDetails.county);
        setIsLoadingDetails(false);
      })
      .catch(() =>
        setErrorMessage('Failed to get address details. Please try again.')
      );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;
    setSearchInput(input);

    if (input.length > 2) {
      getPlacePredictions({ input });
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setShowResults(false);
  };

  return (
    <Box ref={searchRef} sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        required
        label="Search for an address"
        value={searchInput}
        onChange={handleSearchChange}
        onFocus={() => {
          if (searchInput.length > 2) {
            setShowResults(true);
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchInput && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={clearSearch}
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Search Results */}
      {showResults && (
        <Paper
          sx={{
            position: 'absolute',
            width: '100%',
            maxHeight: '300px',
            overflow: 'auto',
            zIndex: 10,
            mt: 0.5,
            boxShadow: 3,
          }}
        >
          <List dense>
            {placePredictions?.length ? (
              placePredictions.map((place) => (
                <ListItem key={place?.placeId} disablePadding>
                  <ListItemButton
                    onClick={() => handlePlaceSelect(place)}
                    dense
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <LocationOnIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={place?.text.text}
                      primaryTypographyProps={{
                        noWrap: true,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No results found" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export const PlacesAddressComponent: React.FC<{
  title: string;
  address?: Address;
  name: string;
  residentAddress?: Address;
  refreshProfile: () => void;
}> = ({ title, address, name, residentAddress, refreshProfile }) => {
  const api = useApi();
  const { refresh } = useUser();
  const { values: profile } = useFormikContext<ProfileFormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [useResidentAddress, setUseResidentAddress] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [geocodes, setGeocodes] = useState<GeocodeLocation[] | null>(null);
  const [geocodeOverride, setGeocodeOverride] = useState<string | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUseResidentAddress(false);
    setSuccessMessage(null);
    setErrorMessage(null);
    setIsLoadingDetails(false);
  };

  useEffect(() => {
    // Auto-hide success message after 5 seconds
    let timeoutId: NodeJS.Timeout;
    if (successMessage) {
      timeoutId = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [successMessage]);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isSameAsResident = event.target.value === 'same';
    setUseResidentAddress(isSameAsResident);
    setErrorMessage(null);
  };

  const handleAddressSubmit = async (values: any) => {
    // Clear error message when starting a new submission
    setErrorMessage(null);

    try {
      const emptyAddress: Address = {
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zipcode: '',
        county: '',
      };

      // If using resident address
      if (useResidentAddress && residentAddress) {
        const newAddresses = {
          ...profile.address_info,
          home_address: profile.address_info?.home_address || emptyAddress,
          alt_address: profile.address_info?.alt_address || emptyAddress,
          w2_address: profile.address_info?.w2_address || emptyAddress,
          checksum: profile.address_info?.checksum || '',
          [name]: residentAddress,
        };

        await api.profiles.updateAddresses(name, newAddresses);
        setSuccessMessage(`Your ${title} address has been updated.`);

        refresh();
        setTimeout(() => handleCloseModal(), 1500);
        return;
      }

      // For manual entry or place selection (already populated in the form)
      if (values.address_line_1 && values.city && values.state) {
        const newAddresses = {
          ...profile.address_info,
          home_address: profile.address_info?.home_address || emptyAddress,
          alt_address: profile.address_info?.alt_address || emptyAddress,
          w2_address: profile.address_info?.w2_address || emptyAddress,
          checksum: profile.address_info?.checksum || '',
          [name]: values,
        };

        await api.profiles.updateAddresses(name, newAddresses, geocodeOverride);
        setSuccessMessage(`Your ${title} address has been updated.`);
        setErrorMessage(null);
        refresh();
        refreshProfile();
        setTimeout(() => handleCloseModal(), 1500);
      } else {
        setErrorMessage(
          'Please enter a valid address or select one from the suggestions.'
        );
        setSuccessMessage(null);
      }
    } catch (err: any) {
      if (err.response?.status === 422) {
        setGeocodes(err.response?.data.detail.geo_locations);
      } else {
        console.error({ err });
        setErrorMessage(
          'There was an error updating your address. Please try again.'
        );
        setSuccessMessage(null);
      }
    } finally {
      setGeocodeOverride(null);
    }
  };

  if (!address) {
    return null;
  }

  return (
    <Box>
      <Box>
        <GeocodeResolutionModal
          open={!!geocodes}
          handleClose={() => {
            setGeocodes(null);
          }}
          handleSubmit={(geocode: string) => {
            setGeocodeOverride(geocode);
            setGeocodes(null);
          }}
          geocodes={geocodes}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography fontWeight="bold">{title}</Typography>
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={handleOpenModal}
          sx={{ minWidth: 48 }}
        >
          Edit
        </Button>
      </Box>

      {isEmptyAddress(address) ? (
        <Typography color="text.secondary" fontStyle="italic">
          No address provided
        </Typography>
      ) : (
        <>
          <Typography>{address.address_line_1}</Typography>
          {address.address_line_2 && (
            <Typography>{address.address_line_2}</Typography>
          )}
          <Typography>
            {address.city}, {address.state}
            {address.zipcode && <span> {address.zipcode}</span>}
          </Typography>
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby={`edit-${title}-modal`}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          sx={{
            backgroundColor: 'background.paper',
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
            width: '100%',
            maxWidth: 600,
            outline: 'none',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
        >
          <Typography variant="h5" id={`edit-${title}-modal`}>
            Edit {title}
          </Typography>

          <Collapse in={!!successMessage || !!errorMessage} sx={{ mt: 2 }}>
            {successMessage && (
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" onClose={() => setErrorMessage(null)}>
                {errorMessage}
              </Alert>
            )}
          </Collapse>

          <Formik
            initialValues={address}
            onSubmit={handleAddressSubmit}
            enableReinitialize
          >
            {(formikProps) => (
              <form autoComplete="new-password">
                {title !== 'Resident address' &&
                  residentAddress &&
                  !isEmptyAddress(residentAddress) && (
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                      <RadioGroup
                        value={useResidentAddress ? 'same' : 'different'}
                        onChange={handleRadioChange}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 4,
                        }}
                      >
                        <FormControlLabel
                          value="same"
                          control={<Radio />}
                          label="Same as Resident Address"
                        />
                        <FormControlLabel
                          value="different"
                          control={<Radio />}
                          label="Choose a different address"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}

                {useResidentAddress &&
                residentAddress &&
                !isEmptyAddress(residentAddress) ? (
                  <Card sx={{ mt: 2, p: 2 }}>
                    <Typography>{residentAddress.address_line_1}</Typography>
                    {residentAddress.address_line_2 && (
                      <Typography>{residentAddress.address_line_2}</Typography>
                    )}
                    <Typography>
                      {residentAddress.city}, {residentAddress.state}
                      {residentAddress.zipcode && (
                        <span> {residentAddress.zipcode}</span>
                      )}
                    </Typography>
                  </Card>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2.5,
                      flexDirection: 'column',
                      mt: 4,
                    }}
                  >
                    {/* Address Search */}
                    <PlacesSearch
                      formik={formikProps}
                      setIsLoadingDetails={setIsLoadingDetails}
                      setErrorMessage={setErrorMessage}
                    />

                    {/* Address Fields in a gray background */}
                    <AddressFields isLoadingDetails={isLoadingDetails} />
                  </Box>
                )}

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCloseModal}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    loading={formikProps.isSubmitting || isLoadingDetails}
                    onClick={() => formikProps.handleSubmit()}
                  >
                    Save
                  </LoadingButton>
                </Box>
              </form>
            )}
          </Formik>
        </Paper>
      </Modal>
    </Box>
  );
};

export const GeocodeResolutionModal: React.FC<{
  open: boolean;
  geocodes: GeocodeLocation[] | null;
  handleSubmit: (geocode: string) => void;
  handleClose: () => void;
}> = ({ open, handleClose, handleSubmit, geocodes }) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          padding: 3,
          boxShadow: 24,
          width: '100%',
          maxWidth: '30%',
          overflow: 'auto',
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Select your current location
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          We found multiple possible locations for your address. Please select
          the one that matches your actual location and try saving again:
        </Typography>

        <List sx={{ mb: 3 }}>
          {geocodes?.map((geocode) => (
            <ListItem key={geocode.geoCode}>
              <ListItemButton
                onClick={() => {
                  setSelected(geocode.geoCode);
                }}
                sx={{
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                }}
              >
                <ListItemIcon>
                  <Radio checked={geocode.geoCode === selected} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography>
                      {capitalizeWords(geocode.city || '')},{' '}
                      {capitalizeWords(geocode.county || '')} County,{' '}
                      {geocode.stateCode}
                    </Typography>
                  }
                  sx={{ ml: 1 }}
                />
                <LocationOnOutlined sx={{ ml: 5, color: 'text.secondary' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            startIcon={<Check />}
            variant="contained"
            onClick={() => {
              selected && handleSubmit(selected);
              setSelected(null);
            }}
            disabled={!selected}
          >
            Confirm selection
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};
