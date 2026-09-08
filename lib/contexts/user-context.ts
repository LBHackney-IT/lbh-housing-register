import { createContext, useContext } from 'react';
import { StaffUser } from '../../domain/StaffUser';

type UserContext = { user?: StaffUser };

export const UserContext = createContext<UserContext>({} as UserContext);

export const useUser = () => useContext(UserContext);
