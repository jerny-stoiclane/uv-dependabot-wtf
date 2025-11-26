import FullHireIcon from '@mui/icons-material/PersonAdd';
import QuickHireIcon from '@mui/icons-material/Speed';
import {
  Alert,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { paths } from '../../utils/paths';

const NewHireModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleFullHire = () => {
    navigate(paths.newHire);
    onClose();
  };

  const handleQuickHire = () => {
    navigate(paths.newHireQuick);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>Add new hire</DialogTitle>
      <DialogContent>
        <Alert sx={{ background: 'rgb(229, 246, 253)', mb: 2 }} severity="info">
          <Typography variant="body1">
            To get started with adding a new employee, select one of the options
            below.
          </Typography>
        </Alert>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} display="flex">
            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
              <CardActionArea sx={{ height: '100%' }} onClick={handleQuickHire}>
                <CardContent>
                  <QuickHireIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  <Typography variant="h5" gutterBottom>
                    Quick hire
                  </Typography>
                  <Typography variant="body1">
                    Begin the New Hire process with minimal information: First
                    name, Last name and Email.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={6} display="flex">
            <Card variant="outlined" sx={{ borderRadius: 2, height: '100%' }}>
              <CardActionArea sx={{ height: '100%' }} onClick={handleFullHire}>
                <CardContent>
                  <FullHireIcon
                    sx={{ fontSize: 40, color: 'secondary.main' }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Full hire
                  </Typography>
                  <Typography variant="body1">
                    Begin the New Hire process for employees who have a complete
                    profile setup including SSN, pay information, and more.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NewHireModal;
