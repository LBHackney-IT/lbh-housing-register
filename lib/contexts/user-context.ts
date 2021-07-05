import { createContext, useContext } from 'react';
import { User } from '../../domain/user';

type UserContext = { user?: User };

export const UserContext = createContext<UserContext>({} as UserContext);

export const useUser = () => useContext(UserContext);
