import { SolutionOutlined } from '@ant-design/icons';
import { AccessTime, AutoStoriesOutlined } from '@mui/icons-material';
import { useEffect, useState } from 'react';

import { useApi } from '../../../../hooks/useApi';
import { useUser } from '../../../../hooks/useUser';
import { PRODUCT_UPDATES_READ_KEY } from '../../../../utils/constants';
import { paths } from '../../../../utils/paths';

const useAppNotifications = () => {
  const api = useApi();
  const { user } = useUser();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      let ptoNotificationSummary: AppNotification[] = [];
      let ptoRequestCount = 0;

      try {
        if (user?.is_manager) {
          const { results } = await api.benefits.getPtoApprovalCount();
          ptoRequestCount = results.count;

          ptoNotificationSummary =
            ptoRequestCount > 0
              ? [
                  {
                    type: 'ptoRequestSummary',
                    primaryText: `You have ${ptoRequestCount} pending time off requests.`,
                    secondaryText: 'Click here to review',
                    icon: <AccessTime />,
                    onClickPath: paths.approvals,
                  },
                ]
              : [];
        }
      } catch (error) {
        console.error('Failed to fetch PTO requests', error);
      }

      const oeNotification: AppNotification[] = user?.enrollment_status
        ?.is_active
        ? [
            {
              type: 'openEnrollment',
              primaryText: 'Open Enrollment is now available!',
              secondaryText: 'Click here to begin',
              icon: <SolutionOutlined />,
              onClickPath: paths.openEnrollment,
            },
          ]
        : [];

      let handbookNotifications: AppNotification[] = [];
      try {
        const { results } = await api.profiles.getMyHandbooks();
        const signingCount = results.filter((book) =>
          ['pending', 'overdue'].includes(book.status)
        ).length;
        handbookNotifications =
          signingCount > 0
            ? [
                {
                  type: 'signHandbook',
                  primaryText: `You have ${signingCount} handbook(s) to sign.`,
                  secondaryText: 'Click here to complete',
                  icon: <AutoStoriesOutlined />,
                  onClickPath: paths.employeeHandbooks,
                },
              ]
            : [];
      } catch (e) {
        console.error('Unable to fetch user handbooks');
      }

      // Always include product updates but mark them as excluded from count
      const productUpdatesNotification: AppNotification[] = [
        {
          type: 'productUpdates',
          primaryText: 'Product updates!',
          secondaryText: 'Click here to read our latest updates',
          icon: <SolutionOutlined />,
          iconBgColor: 'primary.main',
          iconColor: 'primary.contrastText',
          excludeFromCount: !!localStorage.getItem(PRODUCT_UPDATES_READ_KEY),
        },
      ];

      const validNotifications = [
        ...productUpdatesNotification,
        ...oeNotification,
        ...ptoNotificationSummary,
        ...handbookNotifications,
      ] as AppNotification[];

      setNotifications(validNotifications);
      setLoading(false);

      // Count for the badge (excluding those with excludeFromCount flag)
      setNotificationCount(
        validNotifications.filter((notif) => !notif.excludeFromCount).length
      );
    }
    fetchNotifications();
  }, []);

  const handleSetNotifications = (newNotifications: AppNotification[]) => {
    setNotifications(newNotifications);
    // Only count notifications that don't have the excludeFromCount flag
    setNotificationCount(
      newNotifications.filter((notif) => !notif.excludeFromCount).length
    );
  };

  return {
    notifications,
    loading,
    notificationCount,
    setNotifications: handleSetNotifications,
  };
};

export default useAppNotifications;
