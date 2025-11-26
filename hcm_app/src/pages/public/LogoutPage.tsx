import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet';

export const LogoutPage = () => {
  const { logout } = useAuth0();

  useEffect(() => {
    logout();
  }, []);

  return (
    <Helmet>
      <title>Logout | Armhr</title>
    </Helmet>
  );
};

export default LogoutPage;
