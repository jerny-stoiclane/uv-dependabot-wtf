import { createContext, useContext } from 'react';

export interface UserContextType {
  user: User | null;
  error: any;
  entity: ClientEntity | undefined;
  entities: ClientEntity[];
  company: Company | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refresh: (options?: RefreshOptions) => Promise<void>;
  refreshEntity: (entity: ClientEntity) => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  error: null,
  entity: undefined,
  entities: [],
  company: null,
  loading: true,
  setUser: () => {},
  refresh: async () => {},
  refreshEntity: async () => {},
});

export const useUser = () => useContext(UserContext);
