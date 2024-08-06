import { createContext, useContext } from 'react';

import { HackneyGoogleUser } from '../../domain/HackneyGoogleUser';

type UserContext = { user?: HackneyGoogleUser };

export const UserContext = createContext<UserContext>({} as UserContext);

export const useUser = () => useContext(UserContext);
