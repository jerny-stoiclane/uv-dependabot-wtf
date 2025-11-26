import { AccessTime, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Paper,
  Typography,
} from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { useUser } from '../../../../hooks/useUser';
import { getCompanyConfigValue } from '../../../../utils/companyConfig';
import { paths } from '../../../../utils/paths';

interface ProductUpdatesModalProps {
  open: boolean;
  onClose: () => void;
}

const ProductUpdatesModal: React.FC<ProductUpdatesModalProps> = ({
  open,
  onClose,
}) => {
  const { user, company } = useUser();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'primary.main',
          borderRadius: '12px',
          width: '700px',
        },
      }}
    >
      <Box sx={{ color: 'white', position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
        >
          <Close />
        </IconButton>
        <DialogTitle>Product updates</DialogTitle>
      </Box>
      <Box sx={{ bgcolor: 'grey.100', color: 'grey.500', px: 3, py: 1 }}>
        What's new with <strong>Armhr</strong>
      </Box>
      <DialogContent
        sx={{
          bgcolor: 'white',
          maxHeight: '40vh',
          overflowY: 'auto',
          gap: 4,
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.05)',
          },
        }}
      >
        <ManageDependentsUpdate />
        {user?.is_admin && <CompanyDirectoryUpdate />}
        {user?.is_admin && <PasswordResetUpdate />}
        {user?.is_swipeclock_enabled && <SwipeClockUpdate />}
        {user?.is_admin &&
          company &&
          getCompanyConfigValue(company, 'everify_enabled') && (
            <EVerifyUpdate />
          )}
        <BenefitPlanPDFsUpdate />
        <DashboardUpdate />
        {user?.is_admin && <HandbooksUpdate />}
        {user?.is_admin && <SSOUpdate />}
        {(user?.is_admin || user?.is_manager) && <QuickHireUpdate />}
        <MFAUpdate />
        {user?.is_admin && <UserPermissionsUpdate />}
        {user?.is_admin && <ConfigOptionsUpdate />}
        {user?.is_admin && <PtoDescriptionsUpdate />}
        <ThirdUpdate />
        <SecondUpdate />
        <FirstUpdate user={user} />
      </DialogContent>
      <Divider sx={{ bgcolor: 'white', pt: 2 }} />
      <DialogActions sx={{ justifyContent: 'flex-end', bgcolor: 'white' }}>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          size="small"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FirstUpdate = ({ user }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Updates to the Armhr application
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-01-28').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}> 🚗</Box>
      Simplify Your Commute Benefits{' '}
    </Typography>
    <Typography gutterBottom>
      You can now manage your parking and transit FSA elections online! Head to
      the {''}
      <Link component={RouterLink} to={paths.thrivepassEnrollment}>
        Commuter enrollment
      </Link>{' '}
      page in Armhr to update your commuter enrollment with ease.
    </Typography>

    {(user?.is_admin || user?.is_manager) && (
      <>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            mt: 3,
            display: 'flex',
            alignItems: 'center',
            fontWeight: '500',
          }}
        >
          <Box sx={{ mt: -0.5, mr: 1 }}>🎉 </Box>
          New Onboarding Dashboard is Here
        </Typography>

        <Typography>
          We've revamped the{' '}
          <Link component={RouterLink} to={paths.newHires}>
            New Hire Dashboard
          </Link>{' '}
          experience! The new dashboard breaks down the new hires into clear
          sections with actionable items. This will help you track your new
          employees&apos; progress and understand what needs your attention.
        </Typography>
      </>
    )}

    <Typography
      variant="h6"
      gutterBottom
      sx={{
        mt: 3,
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
      }}
    >
      Stay in the loop with Armhr updates by opening this modal from <br /> the
      "Product updates" link in the user menu at the top right.
    </Typography>
  </Paper>
);

const SecondUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Commuter enrollment form updates
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-02-19').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}> ✨</Box>
      Form-Filling Improvements
    </Typography>
    <Typography gutterBottom>
      We've enhanced the{' '}
      <Link component={RouterLink} to={paths.thrivepassEnrollment}>
        ThrivePass Commuter Enrollment
      </Link>{' '}
      form to make it more intuitive and user-friendly. We've also added helpful
      context around effective dates and elections to ensure a clearer, smoother
      experience.
    </Typography>
  </Paper>
);

const ThirdUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New Features Now Live in Armhr!
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-03-03').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🚀</Box>
      New Features and Workflow Improvements
    </Typography>
    <Typography gutterBottom>
      We've made big improvements to streamline your workflows—no more switching
      between Armhr and the back office! You can now:
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>Update commuter elections, direct deposit, and tax withholding</Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>Download W-2s directly in the portal</Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>
        Managers can view employee details & switch between entities if
        applicable
      </Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>
        Admins now have expanded employee workflow permissions, including
        self-service payroll and enhanced approvals
      </Box>
    </Typography>
  </Paper>
);

const HandbooksUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New Feature: Assign, Track, and Manage Employee Handbooks
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-06-25').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography gutterBottom>
      We’re excited to introduce a new way to manage your company’s employee
      handbooks.
    </Typography>
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        mt: 3,
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
      }}
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>📝</Box>
      Upload & Assign Handbooks
    </Typography>
    <Typography gutterBottom>
      You can now upload your company’s employee handbook directly into the
      platform—whether it’s one document or multiple versions for different
      teams. Simply select the right handbook and assign it to the relevant
      employees.
    </Typography>
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        mt: 3,
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
      }}
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>📅</Box>
      Set Due Dates & Track Progress
    </Typography>
    <Typography gutterBottom>
      Easily set a due date for when the handbook should be read. As employees
      review the materials, you’ll be able to track their completion status in
      real-time, giving you full visibility into who’s on track and who might
      need a nudge.
    </Typography>
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        mt: 3,
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
      }}
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🔔</Box>
      Smart Notifications
    </Typography>
    <Typography gutterBottom>
      Employees automatically receive notifications when a handbook is assigned
      to them. And if someone misses the deadline, you’ll get an email reminder
      so you can follow up proactively.
    </Typography>
    <Typography gutterBottom sx={{ mt: 3 }}>
      Whether you’re onboarding new hires or rolling out updated policies, this
      feature gives you the control and insight you need to ensure everyone
      stays informed.
    </Typography>
  </Paper>
);

const PtoDescriptionsUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New Admin Feature: PTO Policy descriptions
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-03-05').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>✍️</Box>
      PTO Policy descriptions on PTO Request form
    </Typography>
    <Typography gutterBottom>
      You can now add PTO policy descriptions that employees will see when they
      request time off.
    </Typography>
    <Typography gutterBottom>
      These can be configured in the{' '}
      <Link component={RouterLink} to="/company/config">
        Company Settings
      </Link>{' '}
      under "PTO Policy descriptions" - just toggle the feature on and click the
      Configure button.
    </Typography>
  </Paper>
);

const ConfigOptionsUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New Configuration Options Now Available in Armhr
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date().toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: 0, mr: 1 }}>⚙️</Box>
      Greater Control Over Platform Features
    </Typography>
    <Typography gutterBottom>
      We've added new feature toggles under Admin Tools in Armhr, giving you
      more control over the platform experience based on your organization's
      needs. Admins can now enable or disable the following features:
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>
        <strong>Armhr PTO</strong> – for clients who don't use Armhr's PTO
        offering
      </Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>
        <strong>FSA Commuter Benefit Enrollment</strong>
      </Box>
    </Typography>
    <Typography gutterBottom mt={2}>
      By default, all features are turned on. These updates are designed to
      provide greater flexibility and ensure your team only sees what's relevant
      to your setup.
    </Typography>
    <Typography gutterBottom mt={2}>
      You can manage these settings in the{' '}
      <Link component={RouterLink} to={paths.adminCompanyConfig}>
        Company Settings
      </Link>{' '}
      page.
    </Typography>
  </Paper>
);

const UserPermissionsUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Introducing: The User Permissions Page!
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-05-12').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🚀</Box>
      New Command Center for Access Management
    </Typography>
    <Typography gutterBottom>
      We're excited to announce the launch of the User Permissions Page — your
      new command center for auditing access across your organization.
    </Typography>
    <Typography gutterBottom>With this powerful feature, you can:</Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>
        See exactly what permissions each manager has across your organization
      </Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>Understand who has access to what at a glance</Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>✅</Box>
      <Box>
        Quickly audit and verify permissions to ensure everyone has the right
        level of access
      </Box>
    </Typography>
    <Typography gutterBottom mt={2}>
      This new page brings transparency and control to your workforce
      management, empowering you to oversee permissions across your company with
      confidence.
    </Typography>
    <Typography gutterBottom>
      Head over to the User Permissions Page, under Admin tools to see and
      verify access!
    </Typography>
  </Paper>
);

const SSOUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New Feature Launch: Seamless SSO Access
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-06-03').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🚀</Box>
      Seamless SSO Access to Back Office Admin
    </Typography>
    <Typography gutterBottom>
      Now, you can Single Sign-On (SSO) directly into the Back Office Admin from
      within Armhr! If there's something you need to do — like processing
      payroll or accessing features not yet available in the Armhr front office
      — simply click the "Back Office Admin" link in the navigation.
    </Typography>
    <Typography>
      You'll be instantly and securely dropped into the back office portal, no
      extra logins or steps required.
    </Typography>
  </Paper>
);

const QuickHireUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Onboarding Just Got Easier
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-06-03').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🚀</Box>
      Streamlined Quick Hire Experience
    </Typography>
    <Typography gutterBottom>
      We're excited to introduce a powerful new update that transforms the Quick
      Hire experience, streamlining onboarding for you and your new hires.
    </Typography>
    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
      What's changed?
    </Typography>
    <Typography gutterBottom>
      Previously, Quick Hire required multiple back and forths between the
      manager and the new hire to finish onboarding, now it's a single step for
      each side.
    </Typography>
    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
      With our latest update:
    </Typography>
    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
      <Typography component="li" gutterBottom>
        Once a Quick Hire is submitted and the new hire enters their personal
        information, their Armhr account is now created up at the same time - no
        extra steps required
      </Typography>
      <Typography component="li" gutterBottom>
        No more circling back to finish registration after a manager's approval
        and submission
      </Typography>
      <Typography component="li" gutterBottom>
        No need for separate login instructions
      </Typography>
      <Typography component="li">
        A simpler, faster start for your new hires
      </Typography>
    </Box>
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
      <Box
        component="img"
        src="https://assets.armhr.com/quickhire2.png"
        alt="QuickHire User Interface"
        sx={{
          bgcolor: '#FAFAFA',
          width: '45%',
          height: '300px',
          objectFit: 'contain',
          borderRadius: 1,
          boxShadow: 1,
        }}
      />
      <Box
        component="img"
        src="https://assets.armhr.com/quickhire1.png"
        alt="QuickHire Process Overview"
        sx={{
          bgcolor: '#FAFAFA',
          width: '45%',
          height: '300px',
          objectFit: 'contain',
          borderRadius: 1,
          boxShadow: 1,
        }}
      />
    </Box>
  </Paper>
);

const DashboardUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Introducing the New Dashboard Experience!
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-06-03').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🚀</Box>
      Your All-in-One Hub for Everything You Need
    </Typography>
    <Typography gutterBottom>
      We're excited to launch the brand-new Dashboard - your all-in-one hub for
      everything you need in the app. Designed with simplicity and speed in
      mind, the dashboard brings together key tools and insights to help you
      stay on top of your work life.
    </Typography>
    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
      What's new?
    </Typography>
    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
      <Typography
        component="li"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={{ mr: 1 }}>✏️</Box>
        Edit your profile
      </Typography>
      <Typography
        component="li"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={{ mr: 1 }}>💰</Box>
        View your paychecks
      </Typography>
      <Typography
        component="li"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={{ mr: 1 }}>📅</Box>
        See upcoming PTO
      </Typography>
      <Typography
        component="li"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center' }}
      >
        <Box sx={{ mr: 1 }}>📧</Box>
        Request PTO easily
      </Typography>
      <Typography
        component="li"
        sx={{ display: 'flex', alignItems: 'center' }}
        gutterBottom
      >
        ...and more — all from one central place!
      </Typography>
    </Box>
  </Paper>
);

const MFAUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Enhanced Security: Multi-Factor Authentication Required
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-06-03').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🔒</Box>
      Mandatory MFA for All Users
    </Typography>
    <Typography gutterBottom>
      To enhance the security of your account and protect sensitive company
      information, Multi-Factor Authentication (MFA) is now required for all
      Armhr users.
    </Typography>
    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
      What this means for you:
    </Typography>
    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
      <Typography component="li" gutterBottom>
        You'll need to set up MFA if you haven't already - you'll be asked to
        set up MFA the next time you log in.
      </Typography>
      <Typography component="li" gutterBottom>
        Choose between authenticator app (recommended) or SMS verification
      </Typography>
      <Typography component="li" gutterBottom>
        You'll be prompted for MFA verification each time you log in
      </Typography>
      <Typography component="li">
        If you need help setting up MFA, contact your system administrator or
        email security@armhr.com
      </Typography>
    </Box>
  </Paper>
);

const EVerifyUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Direct E-Verify Access via Armhr SSO
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-07-28').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🔐</Box>
      New: Direct E-Verify Access via Armhr SSO
    </Typography>
    <Typography gutterBottom>
      You can now access E-Verify directly from Armhr through Single Sign-On
      (SSO)!
    </Typography>
    <Typography gutterBottom>
      You’ll see a new “E-Verify” option under your Admin Tools in Armhr.
      Clicking it takes you straight to the E-Verify portal, no separate login
      needed, and no need to navigate through the back office.
    </Typography>
    <Typography gutterBottom>
      This update is part of our continued effort to streamline your workflows
      and reduce administrative friction.
    </Typography>
  </Paper>
);

const BenefitPlanPDFsUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Benefit Plan PDFs Now Available in Enrolled Benefits
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-07-29').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>📢</Box>
      Benefit Plan PDFs Now Available in Enrolled Benefits
    </Typography>
    <Typography gutterBottom>
      We're excited to announce that your Benefit Plan Summary PDFs are now
      accessible directly within the Enrolled Benefits section of your benefits
      portal.
    </Typography>
    <Typography gutterBottom>
      You can now view and download PDF links to your specific benefit plan
      coverage—making it easier than ever to understand and manage your
      benefits.
    </Typography>
    <Typography gutterBottom>
      If you have any questions about your coverage or need further assistance,
      please don't hesitate to reach out to the Benefits Team at
      benefits@armhr.com.
    </Typography>
  </Paper>
);

const PasswordResetUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New! Admins Can Now Reset Passwords
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-08-06').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🔒</Box>
      New! Admins Can Now Reset Passwords
    </Typography>
    <Typography gutterBottom>
      Need to reset an employee's password? You can now do it directly in the
      app — no need to contact support.
    </Typography>
    <Typography gutterBottom>
      Head to Admin Tools → User Management → Password Reset to get started.
    </Typography>
    <Typography gutterBottom>
      We've also renamed User Permissions to User Management, where you'll now
      find:
    </Typography>
    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
      <Typography component="li" gutterBottom>
        A Permissions tab to view employee access
      </Typography>
      <Typography component="li" gutterBottom>
        A Password Reset tab to send reset links instantly
      </Typography>
    </Box>
  </Paper>
);

const SwipeClockUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New! One-Click Login to SwipeClock
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-08-06').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography
      variant="h6"
      sx={{ display: 'flex', alignItems: 'center', fontWeight: '500' }}
      gutterBottom
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🔗</Box>
      One-Click Login to SwipeClock
    </Typography>
    <Typography gutterBottom>
      You can now access SwipeClock directly from the Armhr app — no separate
      login needed.
    </Typography>
    <Typography gutterBottom>
      Just use the new SwipeClock link in the sidebar to launch it instantly via
      secure Single Sign-On (SSO).
    </Typography>
  </Paper>
);

const CompanyDirectoryUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        Company Directory Settings
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-08-21').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography gutterBottom>
      You as an admin now have the ability to turn off the Company Directory for
      your organization. When disabled, the directory will no longer be visible
      to any employees. This setting applies company-wide and is found in
      Company Settings.
    </Typography>
    <Typography
      variant="h6"
      gutterBottom
      sx={{
        mt: 3,
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
      }}
    >
      <Box sx={{ mt: -0.5, mr: 1 }}>🚀</Box>
      Getting Started
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>1.</Box>
      <Box>Navigate to your Admin Settings.</Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>2.</Box>
      <Box>Locate the Company Directory option.</Box>
    </Typography>
    <Typography
      gutterBottom
      sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}
    >
      <Box sx={{ mr: 1 }}>3.</Box>
      <Box>Toggle it On or Off depending on your organization's needs.</Box>
    </Typography>
  </Paper>
);

const ManageDependentsUpdate = () => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      bgcolor: 'white',
      borderRadius: 2,
      border: '1px solid',
      borderColor: 'grey.200',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
        New Feature: Manage Dependents
      </Typography>
      <Typography
        variant="caption"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AccessTime sx={{ fontSize: '0.8rem', mr: 0.5 }} />
        {new Date('2025-10-14').toLocaleDateString()}
      </Typography>
    </Box>
    <Divider sx={{ color: 'grey.500', mb: 2 }} />
    <Typography gutterBottom>
      You can now add, edit, and delete Dependents directly in Armhr!
    </Typography>
    <Typography gutterBottom>
      Go to Benefits → Dependents/Beneficiaries to manage your information
      easily.
    </Typography>
  </Paper>
);

export default ProductUpdatesModal;
