import React, { createContext } from 'react';

import { ApiClientType } from '../api';

export const initialContext: ApiClientType = new Proxy<ApiClientType>(
  {} as ApiClientType,
  {
    get: () => {},
  }
);

export const ApiContext = createContext<ApiClientType>(initialContext);

export const useApi = (): ApiClientType => React.useContext(ApiContext);
