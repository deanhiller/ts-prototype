import { useContext } from 'react';
import useJwtAuth from './services/jwt/useJwtAuth';
import { AuthContext, AuthContextType } from './AuthenticationProvider';
import { User } from './user';

interface AuthProvider {
	signOut: () => void;
	updateUser: (user: User) => void;
}

type AuthProviders = {
	[key: string]: AuthProvider;
};

function useAuth(): AuthContextType & { signOut: () => void } {
	const context = useContext(AuthContext);
	const { signOut: jwtSignOut, updateUser: jwtUpdateUser } = useJwtAuth();

	if (!context) {
		throw new Error('useAuth must be used within a AuthRouteProvider');
	}

	const authProviders: AuthProviders = {
		jwt: { signOut: jwtSignOut, updateUser: jwtUpdateUser }
	};

	const signOut = () => {
		const authProvider = context.getAuthProvider();
		authProviders[authProvider]?.signOut();
	};

	const updateUser = (user: User) => {
		const authProvider = context.getAuthProvider();
		authProviders[authProvider]?.updateUser(user);
	};

	return { ...context, signOut, updateUser };
}

export default useAuth;
