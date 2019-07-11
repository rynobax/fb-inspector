import React, { createContext, useContext } from 'react';

import { useSettings } from './settings';

export interface GoogleUser {
  __id: string;
  email: string;
  access_token: string;
  expires_at: number;
}

interface ProjectContextType {
  users: GoogleUser[];
}

const OAuthContext = createContext<ProjectContextType>({
  users: [],
});

interface OAuthProviderProps {}

export const OAuthProvider: React.FC<OAuthProviderProps> = props => {
  const [settings, dispatch] = useSettings();

  return (
    <OAuthContext.Provider
      value={{
        users: settings.users,
      }}
    >
      {props.children}
    </OAuthContext.Provider>
  );
};

export const useProject = () => {
  return useContext(OAuthContext);
};
