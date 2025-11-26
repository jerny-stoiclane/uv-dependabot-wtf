import { PageSpinner } from '@armhr/ui';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

const LoginPage: React.FC = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    const getAuth = async () => {
      try {
        if (isLoading) {
          return;
        } else if (!isLoading && isAuthenticated) {
          logout();
          return;
        }

        await loginWithRedirect();
      } catch (err) {
        console.error(err);
      }
    };

    getAuth();
  }, [isAuthenticated, isLoading]);

  return (
    <>
      <Helmet>
        <title>Login | Armhr</title>
        <meta
          name="description"
          content="Login to your Armhr account to access payroll, benefits, time off, and employee management tools."
        />
      </Helmet>
      <PageSpinner />
    </>
  );
};

export default LoginPage;
