import Cookie from 'js-cookie';
import { useEffect } from 'react';

// This hook sets a cookie to a boolean value to be used as a feature flag
// esp on public routes where we don't have a session and can't use Auth0 feature flags.
// Devs can change the cookie value in the browser to test locally or in staging/prod
const useCookieFlag = (cookie_name: string, flagValue: boolean = false) => {
  useEffect(() => {
    if (!Cookie.get(cookie_name)) {
      Cookie.set(cookie_name, flagValue.toString(), {
        sameSite: 'strict',
        secure: !import.meta.env.DEV,
        path: '/',
        domain: import.meta.env.DEV ? 'localhost' : '.armhr.com',
      });
    }
  }, [Cookie]);
};

export default useCookieFlag;
