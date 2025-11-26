import { NotificationProvider } from '@armhr/ui';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import ErrorBoundary from './components/common/ErrorBoundary';
import { MainLayout } from './components/common/MainLayout';
import OnboardingLayout from './components/onboarding/OnboardingLayout';
import { ApiProvider } from './contexts/api.context';
import ProxyBlockProvider from './contexts/proxy.context';
import { UserProvider } from './contexts/user.context';
import PrismLogoutPage from './pages/PrismLogoutPage';
import AdminCompanyConfigPage from './pages/admin/AdminCompanyConfigPage';
import AdminCustomFieldsPage from './pages/admin/AdminCustomFieldsPage';
import AdminDirectoryPage from './pages/admin/AdminDirectoryPage';
import AdminHandbooksPage from './pages/admin/AdminHandbooksPage';
import AdminHiringPage from './pages/admin/AdminHiringPage';
import AdminPayrollApprovalPage from './pages/admin/AdminPayrollApprovalPage';
import AdminTimeOffRequestsPage from './pages/admin/AdminTimeOffRequestsPage';
import AdminUserAccessRequestFormPage from './pages/admin/AdminUserAccessRequestFormPage';
import AdminUserAccessRequestsPage from './pages/admin/AdminUserAccessRequestsPage';
import AdminUserPermissionsPage from './pages/admin/AdminUserPermissionsPage';
import BenefitsEnrollmentPage from './pages/benefits/BenefitsEnrollmentPage';
import BenefitsPage from './pages/benefits/BenefitsPage';
import DirectBenefitsEnrollmentPage from './pages/benefits/DirectBenefitsEnrollmentPage';
import EnrollmentDashboardPage from './pages/benefits/EnrollmentDashboardPage';
import OpenEnrollmentPage from './pages/benefits/OpenEnrollmentPage';
import ThrivePassCommuterFormPage from './pages/benefits/ThrivePassCommuterFormPage';
import CalendarPage from './pages/company/CalendarPage';
import DirectoryPage from './pages/company/DirectoryPage';
import OrgChartPage from './pages/company/OrgChartPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EditNewHireRequestPage from './pages/new-hires/EditNewHireRequestPage';
import NewHireDashboardPage from './pages/new-hires/NewHireDashboardPage';
import NewHireRequestFullPage from './pages/new-hires/NewHireRequestFullPage';
import NewHireRequestQuickHirePage from './pages/new-hires/NewHireRequestQuickHirePage';
import PrehireBulkImportWizardPage from './pages/new-hires/PrehireBulkImportWizardPage';
import QuickHireBulkImportWizardPage from './pages/new-hires/QuickHireBulkImportWizardPage';
import OnboardingRedirectPage from './pages/onboarding/OnboardingRedirectPage';
import OnboardingStartPage from './pages/onboarding/OnboardingStartPage';
import OnboardingWrapperPage from './pages/onboarding/OnboardingWrapperPage';
import BeneficiariesPage from './pages/payroll/BeneficiariesPage';
import BonusTaxWithholdingAdminPage from './pages/payroll/BonusTaxWithholdingAdminPage';
import BonusTaxWithholdingAssignPage from './pages/payroll/BonusTaxWithholdingAssignPage';
import BonusTaxWithholdingEmployeePage from './pages/payroll/BonusTaxWithholdingEmployeePage';
import BonusTaxWithholdingSignPage from './pages/payroll/BonusTaxWithholdingSignPage';
import DirectDepositPage from './pages/payroll/DirectDepositPage';
import PayHistoryPage from './pages/payroll/PayHistoryPage';
import PayVoucherPage from './pages/payroll/PayVoucherPage';
import TaxWithholdingFormPage from './pages/payroll/TaxWithholdingFormPage';
import TaxWithholdingPage from './pages/payroll/TaxWithholdingPage';
import W2Page from './pages/payroll/W2Page';
import EmployeeHandbooksPage from './pages/profile/EmployeeHandbooksPage';
import ProfilePage from './pages/profile/ProfilePage';
import UpdatePasswordPage from './pages/profile/UpdatePasswordPage';
import UpdateProfilePage from './pages/profile/UpdateProfilePage';
import ForgotEmailPage from './pages/public/ForgotEmailPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import LoginPage from './pages/public/LoginPage';
import LogoutPage from './pages/public/LogoutPage';
import PrismNewTabPage from './pages/public/PrismNewTabPage';
import PrismRedirectPage from './pages/public/PrismRedirectPage';
import RegisterPage from './pages/public/RegisterPage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import StartPage from './pages/public/StartPage';
import ApprovalsPage from './pages/time-off/ApprovalsPage';
import RequestTimeOffPage from './pages/time-off/RequestTimeOffPage';
import SwipeclockSchedulePtoPage from './pages/time-off/SwipeclockSchedulePtoPage';
import SwipeclockTimecardPage from './pages/time-off/SwipeclockTimecardPage';
import TimeOffListPage from './pages/time-off/TimeOffListPage';
import TimeOffPage from './pages/time-off/TimeOffPage';
import { paths } from './utils/paths';

// Wrapper components for different authentication/layout requirements
const AuthenticatedWrapper = withAuthenticationRequired(() => (
  <ErrorBoundary>
    <NotificationProvider>
      <UserProvider>
        <ApiProvider>
          <ProxyBlockProvider>
            <MainLayout />
          </ProxyBlockProvider>
        </ApiProvider>
      </UserProvider>
    </NotificationProvider>
  </ErrorBoundary>
));

const AuthWrapper = withAuthenticationRequired(() => (
  <ErrorBoundary>
    <NotificationProvider>
      <ApiProvider>
        <Outlet />
      </ApiProvider>
    </NotificationProvider>
  </ErrorBoundary>
));

const OnboardingWrapper = withAuthenticationRequired(() => (
  <ErrorBoundary>
    <NotificationProvider>
      <ApiProvider>
        <OnboardingLayout>
          <Outlet />
        </OnboardingLayout>
      </ApiProvider>
    </NotificationProvider>
  </ErrorBoundary>
));

// Define the router configuration
const router = createBrowserRouter([
  // Public routes (no auth required)
  { path: paths.login, element: <LoginPage /> },
  { path: paths.register, element: <RegisterPage /> },
  { path: paths.startNewHire, element: <StartPage /> },
  { path: paths.logout, element: <LogoutPage /> },
  { path: paths.forgotPassword, element: <ForgotPasswordPage /> },
  { path: paths.forgotEmail, element: <ForgotEmailPage /> },
  { path: paths.resetPassword, element: <ResetPasswordPage /> },

  // Routes that are protected and require a user to be logged in, but no layout
  {
    path: '/auth',
    element: <AuthWrapper />,
    children: [
      { path: paths.updatePassword, element: <UpdatePasswordPage /> },
      { path: paths.prismLogout, element: <PrismLogoutPage /> },
    ],
  },

  // Main authenticated routes, using the main layout
  {
    element: <AuthenticatedWrapper />,
    children: [
      // Root redirect
      { path: paths.root, element: <Navigate to={paths.dashboard} /> },

      // Dashboard
      { path: paths.dashboard, element: <DashboardPage /> },
      
      // Admin routes
      { path: paths.adminCompanyConfig, element: <AdminCompanyConfigPage /> },
      { path: paths.adminDirectory, element: <AdminDirectoryPage /> },
      {
        path: paths.adminUserPermissions,
        element: <AdminUserPermissionsPage />,
      },
      {
        path: paths.adminRequestUserAccess,
        element: <AdminUserAccessRequestsPage />,
      },
      {
        path: `${paths.adminRequestUserAccess}/new`,
        element: <AdminUserAccessRequestFormPage />,
      },
      {
        path: paths.adminApproveTimeOff,
        element: <AdminTimeOffRequestsPage />,
      },
      { path: paths.adminPayroll, element: <AdminPayrollApprovalPage /> },
      { path: paths.adminHiring, element: <AdminHiringPage /> },
      { path: paths.adminHandbooks, element: <AdminHandbooksPage /> },
      { path: paths.adminCustomFields, element: <AdminCustomFieldsPage /> },
      {
        path: paths.adminBonusTaxWithholding,
        element: <BonusTaxWithholdingAdminPage />,
      },
      {
        path: paths.adminBonusTaxWithholdingAssign,
        element: <BonusTaxWithholdingAssignPage />,
      },
      
      // New hire routes
      { path: paths.newHires, element: <NewHireDashboardPage /> },
      {
        path: paths.quickHireBulkImport,
        element: <QuickHireBulkImportWizardPage />,
      },
      {
        path: paths.prehireBulkImport,
        element: <PrehireBulkImportWizardPage />,
      },
      { path: paths.newHire, element: <NewHireRequestFullPage /> },
      { path: paths.newHireQuick, element: <NewHireRequestQuickHirePage /> },
      {
        path: `${paths.newHire}/:requestId`,
        element: <EditNewHireRequestPage />,
      },
      
      // Benefits routes
      { path: paths.benefits, element: <BenefitsPage /> },
      { path: paths.benefitsEnrollment, element: <BenefitsEnrollmentPage /> },
      { path: paths.enrollmentDashboard, element: <EnrollmentDashboardPage /> },
      { path: paths.openEnrollment, element: <OpenEnrollmentPage /> },
      {
        path: paths.directBenefitsEnrollment,
        element: <DirectBenefitsEnrollmentPage />,
      },
      {
        path: paths.thrivepassEnrollment,
        element: <ThrivePassCommuterFormPage />,
      },
      
      // Company routes
      { path: paths.calendar, element: <CalendarPage /> },
      { path: paths.directory, element: <DirectoryPage /> },
      { path: paths.orgChart, element: <OrgChartPage /> },
      
      // Payroll routes
      { path: paths.payroll, element: <PayHistoryPage /> },
      { path: `${paths.payroll}/:voucherId`, element: <PayVoucherPage /> },
      { path: paths.directDeposit, element: <DirectDepositPage /> },
      {
        path: `${paths.employeeBonusTaxWithholding}`,
        element: <BonusTaxWithholdingEmployeePage />,
      },
      {
        path: `${paths.employeeBonusTaxWithholdingSign}/:requestId`,
        element: <BonusTaxWithholdingSignPage />,
      },
      { path: paths.taxWithholding, element: <TaxWithholdingPage /> },
      { path: paths.taxWithholdingForm, element: <TaxWithholdingFormPage /> },
      { path: paths.beneficiaries, element: <BeneficiariesPage /> },
      { path: paths.w2, element: <W2Page /> },
      
      // Profile routes
      { path: paths.profile, element: <UpdateProfilePage /> },
      { path: `${paths.profile}/:userId`, element: <ProfilePage /> },
      
      // Handbook routes
      { path: paths.employeeHandbooks, element: <EmployeeHandbooksPage /> },
      
      // Time off routes
      { path: paths.approvals, element: <ApprovalsPage /> },
      { path: paths.timeOff, element: <TimeOffListPage /> },
      { path: `${paths.timeOff}/:requestId`, element: <TimeOffPage /> },
      { path: paths.requestTimeOff, element: <RequestTimeOffPage /> },
      { path: paths.swipeclockTimeCard, element: <SwipeclockTimecardPage /> },
      {
        path: paths.swipeclockSchedulePto,
        element: <SwipeclockSchedulePtoPage />,
      },
      
      // Other routes
      { path: paths.prismRedirect, element: <PrismRedirectPage /> },
      { path: paths.prismNewTab, element: <PrismNewTabPage /> },

      { path: '*', element: <Navigate to={paths.dashboard} /> },
    ],
  },

  // Onboarding routes, using the onboarding layout
  {
    element: <OnboardingWrapper />,
    children: [
      { path: paths.startOnboarding, element: <OnboardingStartPage /> },
      { path: paths.onboardingWrapper, element: <OnboardingWrapperPage /> },
      { path: paths.onboardingRedirect, element: <OnboardingRedirectPage /> },
      {
        path: paths.enrollmentWrapper,
        element: <OnboardingWrapperPage isEnrolling={true} />,
      },
      { path: '*', element: <Navigate to={paths.dashboard} /> },
    ],
  },
]);

const ReactRouter = () => <RouterProvider router={router} />;

export default ReactRouter;
