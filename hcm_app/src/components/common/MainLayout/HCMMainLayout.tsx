import {
  GlobalNotification,
  Logo,
  MainLayout,
  NavItemType,
  useNotifications,
} from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

import { useApi } from '../../../hooks/useApi';
import { useUser } from '../../../hooks/useUser';
import OnboardingUnfinishedQuickhire from '../../../pages/onboarding/OnboardingUnfinishedQuickhire';
import { generateNavItems } from '../../../utils/navItems';
import { isUnfinishedQuickhire } from '../../../utils/user';
import Footer from './Footer';
import HeaderContent from './Header/HeaderContent';

const HCMMainLayoutWrapper: React.FC = () => {
  const { user } = useUser();
  if (isUnfinishedQuickhire(user)) {
    return <OnboardingUnfinishedQuickhire />;
  }
  return <HCMMainLayout />;
};

const HCMMainLayout: React.FC = () => {
  const api = useApi();
  const notifications = useNotifications();
  const { user, entity, company, loading } = useUser();
  const { logout } = useAuth0();

  // Only generate nav items when we have complete data
  const [navItems, setNavItems] = useState<{ items: NavItemType[] }>({
    items: generateNavItems(user!, company!, api, notifications, entity).items,
  });

  // Re-generate nav items when user or company changes, but only if we have complete data
  useEffect(() => {
    if (!loading && user && company) {
      setNavItems({
        items: generateNavItems(user, company, api, notifications, entity)
          .items as NavItemType[],
      });
    }
  }, [user, company, entity, api, notifications, loading]);

  const logoEnabled = company?.config?.find(
    (config) => config.flag === 'show_company_logo'
  )?.value;

  // Logo for the main layout
  const logo =
    logoEnabled && company?.logo_url ? (
      <img
        src={company?.logo_url}
        alt="Company Logo"
        style={{ height: '65px' }}
      />
    ) : (
      <Logo showText={true} />
    );

  // Logo for the closed drawer
  const logoClosed = <Logo showText={false} />;

  return (
    <MainLayout
      headerContent={<HeaderContent />}
      inactivityPromptBeforeIdle={60 * 1000} // 1 minute
      inactivityTimeout={120 * 60 * 1000} // 2 hours
      enableAdminProxyBanner={true}
      logo={logo}
      logoClosed={logoClosed}
      navItems={navItems}
      notification={<GlobalNotification />}
      footerContent={<Footer />}
      onLogout={logout}
    />
  );
};

export default HCMMainLayoutWrapper;
