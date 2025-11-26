import {
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BookOutlined,
  CalendarOutlined,
  CarOutlined,
  ClockCircleOutlined,
  ClusterOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  DollarOutlined,
  FieldTimeOutlined,
  FileSearchOutlined,
  HomeOutlined,
  IdcardOutlined,
  LoginOutlined,
  MoneyCollectOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { NotificationContextType } from '@armhr/ui';
import {
  AlarmOnOutlined,
  AutoStoriesOutlined,
  CheckCircleOutlined,
  GroupsOutlined,
  Link as LinkIcon,
  MenuBookOutlined,
  PunchClockRounded,
  SecurityOutlined,
} from '@mui/icons-material';

import { ApiClientType } from '../api';
import { getCompanyConfigValue } from './companyConfig';
import { paths } from './paths';
import { PrismUserRole, REPORT_CENTER_ROLES } from './roles';

export const generateNavItems = (
  user: User,
  company: Company,
  api: ApiClientType,
  notifications?: NotificationContextType,
  entity?: ClientEntity
): { items: NavItemType[] } => {
  // TODO: this should be on backend via multi entity middleware, so need to move endpoint out of profiles router
  const selectedCompanyId = entity?.client_id || company?.id;

  const getConfig = (flag: string): CompanyConfig | undefined =>
    company?.config?.find((config) => config.flag === flag);

  const customLinkConfig = getConfig('show_custom_link');

  if (!user) return { items: [] };

  const selfItems = {
    id: 'group-self',
    title: 'Employee portal',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Home',
        type: 'item',
        url: paths.dashboard,
        icon: HomeOutlined,
      },
      {
        id: 'profile',
        title: 'Profile',
        type: 'item',
        url: paths.profile,
        icon: UserOutlined,
      },
      {
        id: 'benefits',
        title: 'Benefits',
        icon: IdcardOutlined,
        type: 'collapse',
        children: [
          {
            id: 'open-enrollment',
            title: 'Benefits enrollment',
            type: 'item',
            url: paths.openEnrollment,
            state: { origin: 'navigation' },
            icon: SolutionOutlined,
            isVisible:
              user?.enrollment_status?.is_enrollment_in_progress
                ?.enrollmentInProgress || false,
          },
          {
            id: 'enrolled-benefits',
            title: 'Enrolled benefits',
            type: 'item',
            url: paths.benefits,
            icon: UserOutlined,
            isVisible:
              user?.active_benefits !== null &&
              user?.active_benefits?.insurance_plans === true,
          },
          {
            id: 'beneficiaries',
            title: 'Dependents/beneficiaries',
            type: 'item',
            url: paths.beneficiaries,
            icon: SolutionOutlined,
          },
          {
            id: 'thrivepass-form',
            title: 'Commuter benefits',
            type: 'item',
            url: paths.thrivepassEnrollment,
            icon: CarOutlined,
            isVisible: getCompanyConfigValue(
              company,
              'fsa_commuter_enrollment_enabled',
              true
            ),
          },
          {
            id: 'thrivepass',
            title: 'Thrivepass',
            type: 'item',
            icon: LoginOutlined,
            onClick: async () => {
              try {
                const resp = await api.profiles.getPrismRedirect(
                  'ThrivepassProd',
                  selectedCompanyId
                );
                if (resp.results) {
                  window.open(resp.results, '_blank');
                } else {
                  throw new Error('SSO failed');
                }
              } catch (err) {
                window.open('https://app.thrivepass.com', '_blank');
              }
            },
          },
          {
            id: 'vestwell',
            title: 'Vestwell',
            type: 'item',
            external: true,
            url: 'https://signin.vestwell.com',
            icon: LoginOutlined,
            target: true,
            isVisible:
              !['623131'].includes(company?.id) && company?.vw_enabled === true,
          },
        ],
      },
      {
        id: 'pay-history',
        title: 'Pay history',
        type: 'item',
        url: paths.payroll,
        icon: DollarOutlined,
      },
      {
        id: 'timeoff',
        title: 'Time off',
        type: 'item',
        url: paths.timeOff,
        icon: ClockCircleOutlined,
        isVisible:
          user?.is_armhr_pto_enabled &&
          !user?.is_swipeclock_enabled &&
          user?.active_benefits?.pto_plans === true,
      },
      {
        id: 'time-attendance',
        title: 'Time & attendance',
        type: 'collapse',
        icon: ClockCircleOutlined,
        isVisible: user?.is_swipeclock_enabled,
        children: [
          ...(user?.is_armhr_pto_enabled &&
          user?.active_benefits?.pto_plans === true
            ? [
                {
                  id: 'time-off',
                  title: 'Time off',
                  type: 'item',
                  url: paths.timeOff,
                  icon: FieldTimeOutlined,
                },
              ]
            : []),
          {
            id: 'time-attendance',
            title: 'Time card',
            type: 'item',
            url: paths.swipeclockTimeCard,
            icon: PunchClockRounded,
          },
          {
            id: 'schedule-pto',
            title: 'Schedule PTO',
            type: 'item',
            url: paths.swipeclockSchedulePto,
            icon: FieldTimeOutlined,
          },
        ],
      },
      {
        id: 'direct-deposit',
        title: 'Direct deposit',
        type: 'item',
        url: paths.directDeposit,
        icon: BankOutlined,
      },
      {
        id: 'employee-handbooks',
        title: 'My Handbooks',
        type: 'item',
        url: paths.employeeHandbooks,
        icon: AutoStoriesOutlined,
        isVisible: user.has_handbooks,
      },
      {
        id: 'tax-information',
        title: 'Tax information',
        type: 'collapse',
        icon: AuditOutlined,
        children: [
          {
            id: 'tax-witholding',
            title: 'Tax withholding',
            type: 'item',
            url: paths.taxWithholding,
            icon: SolutionOutlined,
          },
          {
            id: 'bonus-tax-withholding',
            title: 'Bonus tax withholding',
            type: 'item',
            isVisible:
              getCompanyConfigValue(
                company,
                'show_bonus_tax_withholding',
                false
              ) &&
              !!user?.tax_form_visibility?.bonus_tax_forms &&
              user.is_bonus_tax_withholding_enabled,
            url: paths.employeeBonusTaxWithholding,
            icon: SolutionOutlined,
          },
          {
            id: 'w2',
            title: 'W-2',
            type: 'item',
            url: paths.w2,
            icon: ContainerOutlined,
          },
        ],
      },
      {
        id: 'swipeclock',
        title: 'Swipeclock',
        type: 'item',
        icon: LoginOutlined,
        isVisible:
          user?.is_swipeclock_enabled || user?.is_swipeclock_enabled_no_clock,
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              'Swipeclock',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Opening Swipeclock failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
      },
      {
        id: 'back-office',
        title: 'Back office portal',
        type: 'item',
        isVisible:
          user?.is_admin ||
          user?.is_manager ||
          !getCompanyConfigValue(company, 'hide_backoffice', false),
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              '',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Opening the Back office portal failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
        icon: LoginOutlined,
      },
    ],
  };

  const companyItems = {
    id: 'company',
    title: 'Company',
    type: 'group',
    children: [
      {
        id: 'directory',
        title: 'Directory',
        type: 'item',
        url: paths.directory,
        icon: DatabaseOutlined,
        isVisible: !getCompanyConfigValue(
          company,
          'hide_company_directory',
          false
        ),
      },
      {
        id: 'orgchart',
        title: 'Org chart',
        type: 'item',
        url: paths.orgChart,
        icon: ClusterOutlined,
        isVisible: getCompanyConfigValue(company, 'show_org_chart', true),
      },
      {
        id: 'calendar',
        title: 'Calendar',
        type: 'item',
        url: paths.calendar,
        icon: CalendarOutlined,
      },
      {
        id: 'learning',
        title: 'Mineral Learning',
        type: 'item',
        icon: BookOutlined,
        onClick: async () => {
          try {
            const resp = await api.profiles.getLearningRedirect();
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            window.open('https://apps.trustmineral.com/auth/login', '_blank');
          }
        },
      },
      {
        id: 'talent_management',
        title: 'Talent Management',
        type: 'item',
        isVisible:
          user?.prism_roles?.user_role?.includes(
            PrismUserRole.PRISMTALENTMGT
          ) || company?.talent_mgt_enabled,
        icon: GroupsOutlined,
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              'TALENTMGT',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Talent Management: SSO was unsuccessful. Please refresh and try again',
              severity: 'error',
            });
          }
        },
      },

      {
        id: 'resources',
        title: 'Resources',
        type: 'collapse',
        icon: AppstoreOutlined,
        children: [
          {
            id: 'marketplace',
            title: 'Employee discounts',
            type: 'item',
            url: 'https://www.memberdeals.com/armhr/?login=1',
            target: true,
            external: true,
          },
          {
            id: 'eeoc',
            title: 'Labor law posters',
            type: 'item',
            url: 'https://armhr.myposterservice.com/view-posters?access=dk20lSD9b1Yk',
            target: true,
            external: true,
          },
        ],
      },
      {
        id: 'custom_link',
        title: customLinkConfig?.data?.name,
        type: 'item',
        icon: LinkIcon,
        target: true,
        external: true,
        url: customLinkConfig?.data?.url,
        isVisible: getCompanyConfigValue(company, 'show_custom_link', false),
      },
    ],
  };

  const managerItems = {
    id: 'manager',
    title: 'Manager tools',
    type: 'group',
    isVisible: !user?.is_admin && !!user?.is_manager,
    children: [
      {
        id: 'manager-my-employees',
        title: 'My employees',
        type: 'item',
        url: paths.managerEmployees,
        icon: DatabaseOutlined,
      },
      {
        id: 'manager-approvals',
        title: 'My approvals',
        type: 'item',
        url: paths.approvals,
        icon: AlarmOnOutlined,
      },
      {
        id: 'manager-newhire',
        title: 'New hire dashboard',
        type: 'item',
        url: paths.newHires,
        icon: UserAddOutlined,
        isVisible: !user?.prism_roles?.user_role?.some(
          (role) =>
            role === PrismUserRole.WSMPTORT || role === PrismUserRole.WSMPTO
        ),
      },
      {
        id: 'report-center',
        title: 'Report center',
        type: 'item',
        icon: BarChartOutlined,
        isVisible: user?.prism_roles?.user_role?.some((role) =>
          REPORT_CENTER_ROLES.has(role)
        ),
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              'SIGRC',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Opening the Report Center failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
      },
    ],
  };

  const adminItems = {
    id: 'admin',
    title: 'Admin tools',
    type: 'group',
    isVisible: user?.is_admin,
    children: [
      {
        id: 'admin-employees',
        title: 'My employees',
        type: 'item',
        url: paths.adminDirectory,
        icon: DatabaseOutlined,
      },
      {
        id: 'my-payroll',
        title: 'My approvals',
        type: 'item',
        url: paths.approvals,
        icon: CheckCircleOutlined,
      },
      {
        id: 'admin-handbooks',
        title: 'Handbooks',
        type: 'item',
        url: '/admin/handbooks',
        icon: MenuBookOutlined,
      },
      {
        id: 'admin-payroll',
        title: 'Payroll approvals',
        type: 'item',
        url: '/admin/payroll',
        isVisible:
          user?.prism_roles?.human_resource_role?.includes('PRA') || false,
        icon: MoneyCollectOutlined,
      },
      {
        id: 'hiring-ats',
        title: 'Applicant tracking',
        type: 'item',
        url: paths.adminHiring,
        isVisible: user?.is_hiring_enabled,
        icon: FileSearchOutlined,
      },
      {
        id: 'e-verify',
        title: 'E-Verify',
        type: 'item',
        icon: SecurityOutlined,
        isVisible: getCompanyConfigValue(company, 'everify_enabled', false),
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              'HRWC',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            notifications?.showNotification({
              message: 'Opening E-Verify failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
      },
      {
        id: 'admin-newhire',
        title: 'New hire dashboard',
        type: 'item',
        url: paths.newHires,
        icon: UserAddOutlined,
      },
      {
        id: 'admin-approvals',
        title: 'Time off requests',
        type: 'item',
        url: paths.adminApproveTimeOff,
        isVisible:
          user?.is_armhr_pto_enabled &&
          user?.active_benefits?.pto_plans === true,
        icon: AlarmOnOutlined,
      },
      {
        id: 'report-center',
        title: 'Report center',
        type: 'item',
        icon: BarChartOutlined,
        isVisible:
          user?.prism_roles?.user_role?.some((role) =>
            REPORT_CENTER_ROLES.has(role)
          ) || false,
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              'SIGRC',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Opening the Report Center failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
      },
      {
        id: 'admin-bonus-tax-withholding',
        title: 'Bonus tax withholding',
        type: 'item',
        url: paths.adminBonusTaxWithholding,
        icon: SolutionOutlined,
        isVisible:
          getCompanyConfigValue(company, 'show_bonus_tax_withholding', false) &&
          !!user?.tax_form_visibility?.bonus_tax_forms &&
          user?.is_bonus_tax_withholding_enabled,
      },
      {
        id: 'admin-user-access',
        title: 'Request user access',
        type: 'item',
        url: paths.adminRequestUserAccess,
        isVisible: user?.is_access_request_enabled,
        icon: SecurityOutlined,
      },
      {
        id: 'admin-user-permissions',
        title: 'User management',
        type: 'item',
        url: paths.adminUserPermissions,
        icon: SecurityOutlined,
      },
      {
        id: 'csettings',
        title: 'Company settings',
        type: 'item',
        url: paths.adminCompanyConfig,
        icon: SettingOutlined,
      },
      {
        id: 'admin-swipeclock',
        title: 'Swipeclock',
        type: 'item',
        icon: LoginOutlined,
        isVisible:
          user?.is_swipeclock_enabled || user?.is_swipeclock_enabled_no_clock,
        onClick: async () => {
          try {
            const resp = await api.profiles.getPrismRedirect(
              'Swipeclock',
              selectedCompanyId
            );
            if (resp.results) {
              window.open(resp.results, '_blank');
            } else {
              throw new Error('SSO failed');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Opening Swipeclock failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
      },
      {
        id: 'back-office-admin',
        title: 'Back office admin',
        type: 'item',
        isVisible: user?.is_admin,
        onClick: async () => {
          try {
            const mfaResp = await api.profiles.getMfaAuthenticators();
            if (mfaResp.results && mfaResp.results.length > 0) {
              const resp = await api.admin.getBackOfficeRedirect();
              if (resp.results) {
                window.open(resp.results, '_blank');
              }
            } else {
              window.open('https://admin.armhr.com', '_blank');
            }
          } catch (err) {
            notifications?.showNotification({
              message:
                'Opening the Back office portal failed. Please refresh and try again',
              severity: 'error',
            });
          }
        },
        icon: LoginOutlined,
      },
    ],
  };

  return { items: [selfItems, companyItems, managerItems, adminItems] };
};
