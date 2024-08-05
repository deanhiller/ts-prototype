import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { PartialDeep } from 'type-fest';
import { UserData } from '../../user';
import config from './jwtAuthConfig';
import { baseClient } from 'src/clients/base/baseClient'
import { LoginRequest, User } from 'src/apis/base/base';

export type JwtAuthStatus = 'configuring' | 'authenticated' | 'unauthenticated';

export type JwtAuthConfig = {
	tokenStorageKey: string;
	signInUrl: string;
	signUpUrl: string;
	tokenRefreshUrl: string;
	getUserUrl: string;
	updateUserUrl: string;
	/**
	 * If the response auth header contains a new access token, update the token
	 * in the Authorization header of the successful responses
	 */
	updateTokenFromHeader: boolean;
};

export type SignInPayload = {
	email: string;
	password: string;
};

export type SignUpPayload = {
	displayName: string;
	password: string;
	email: string;
};

export type JwtAuthContextType = {
	user?: UserData;
	updateUser: (U: UserData) => void;
	signIn?: (credentials: SignInPayload) => Promise<UserData | AxiosError>;
	signUp?: (U: SignUpPayload) => Promise<UserData | AxiosError>;
	signOut?: () => void;
	refreshToken?: () => void;
	isAuthenticated: boolean;
	isLoading: boolean;
	setIsLoading?: (T: boolean) => void;
	authStatus: JwtAuthStatus;
};

const defaultAuthContext: JwtAuthContextType = {
	isAuthenticated: false,
	isLoading: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null,
	refreshToken: null,
	setIsLoading: () => {},
	authStatus: 'configuring'
};

export const JwtAuthContext = createContext<JwtAuthContextType>(defaultAuthContext);

export type JwtAuthProviderProps = {
	children: React.ReactNode;
};

function JwtAuthProvider(props: JwtAuthProviderProps) {
	const [user, setUser] = useState<UserData>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [authStatus, setAuthStatus] = useState('configuring');

	const { children } = props;

	/**
	 * Handle sign-in success
	 */
	const handleSignInSuccess = useCallback((userData: UserData, accessToken: string) => {
		setSession(accessToken);

		setIsAuthenticated(true);

		setUser(userData);
		console.log("here we are. yeah");
	}, []);

	/**
	 * Handle sign-up success
	 */
	const handleSignUpSuccess = useCallback((userData: UserData, accessToken: string) => {
		setSession(accessToken);

		setIsAuthenticated(true);

		setUser(userData);
	}, []);

	/**
	 * Handle sign-in failure
	 */
	const handleSignInFailure = useCallback((error: AxiosError) => {
		resetSession();

		setIsAuthenticated(false);
		setUser(null);

		handleError(error);
	}, []);

	/**
	 * Handle sign-up failure
	 */
	const handleSignUpFailure = useCallback((error: AxiosError) => {
		resetSession();

		setIsAuthenticated(false);
		setUser(null);

		handleError(error);
	}, []);

	/**
	 * Handle error
	 */
	const handleError = useCallback((error: AxiosError) => {
		resetSession();
		setIsAuthenticated(false);
		setUser(null);
	}, []);

	// Set session
	const setSession = useCallback((accessToken: string) => {
		if (accessToken) {
			localStorage.setItem(config.tokenStorageKey, accessToken);
			axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
		}
	}, []);

	// Reset session
	const resetSession = useCallback(() => {
		localStorage.removeItem(config.tokenStorageKey);
		delete axios.defaults.headers.common.Authorization;
	}, []);

	// Get access token from local storage
	const getAccessToken = useCallback(() => {
		return localStorage.getItem(config.tokenStorageKey);
	}, []);

	// Check if the access token is valid
	const isTokenValid = useCallback((accessToken: string) => {
		if (accessToken) {
			try {
				const decoded = jwtDecode<JwtPayload>(accessToken);
				const currentTime = Date.now() / 1000;
				return decoded.exp > currentTime;
			} catch (error) {
				return false;
			}
		}

		return false;
	}, []);

	// Check if the access token exist and is valid on mount
	useEffect(() => {
		const attemptAutoLogin = async () => {
			const accessToken = getAccessToken();

			if (isTokenValid(accessToken)) {
				try {
					setIsLoading(true);

					const response: AxiosResponse<UserData> = await axios.get(config.getUserUrl, {
						headers: { Authorization: `Bearer ${accessToken}` }
					});

					const userData = response?.data;

					handleSignInSuccess(userData, accessToken);

					return true;
				} catch (error) {
					const axiosError = error as AxiosError;

					handleSignInFailure(axiosError);
					return false;
				}
			} else {
				resetSession();
				return false;
			}
		};

		if (!isAuthenticated) {
			attemptAutoLogin().then((signedIn) => {
				setIsLoading(false);
				setAuthStatus(signedIn ? 'authenticated' : 'unauthenticated');
			});
		}
	}, [
		isTokenValid,
		setSession,
		handleSignInSuccess,
		handleSignInFailure,
		handleError,
		getAccessToken,
		isAuthenticated
	]);

	const handleRequest = async (
		url: string,
		data: SignInPayload | SignUpPayload,
		handleSuccess: (T: UserData, H: string) => void,
		handleFailure: (T: AxiosError) => void
	): Promise<UserData | AxiosError> => {
		try {

			const loginReq = new LoginRequest();
			loginReq.name = data.email;
			loginReq.password = data.password;
			const result = await baseClient.login(loginReq);

			const resultUserData: UserData = {
				uid: result.user?.email,
				role: result.user?.role,
				data: {
					displayName: result.user?.displayName,
					email: result.user?.email,
					photoURL: result.user?.photoUrl
				}
			}

			const response: AxiosResponse<{ user: UserData; access_token: string }> = await axios.post(url, data);
			const userData = response?.data?.user;
			const accessToken = response?.data?.access_token;

			console.log("their userData="+JSON.stringify(userData, null, 2));
			console.log("our userData="+JSON.stringify(resultUserData, null, 2));
			handleSuccess(resultUserData, accessToken);

			return resultUserData;
		} catch (error) {
			const axiosError = error as AxiosError;

			handleFailure(axiosError);

			return axiosError;
		}
	};

	// Refactor signIn function
	const signIn = (credentials: SignInPayload) => {
		return handleRequest(config.signInUrl, credentials, handleSignInSuccess, handleSignInFailure);
	};

	// Refactor signUp function
	const signUp = useCallback((data: SignUpPayload) => {
		return handleRequest(config.signUpUrl, data, handleSignUpSuccess, handleSignUpFailure);
	}, []);

	/**
	 * Sign out
	 */
	const signOut = useCallback(() => {
		resetSession();

		setIsAuthenticated(false);
		setUser(null);
	}, []);

	/**
	 * Update user
	 */
	const updateUser = useCallback(async (userData: PartialDeep<UserData>) => {
		try {
			const response: AxiosResponse<UserData, PartialDeep<UserData>> = await axios.put(config.updateUserUrl, userData);

			const updatedUserData = response?.data;

			setUser(updatedUserData);

			return null;
		} catch (error) {
			const axiosError = error as AxiosError;

			handleError(axiosError);
			return axiosError;
		}
	}, []);

	/**
	 * Refresh access token
	 */
	const refreshToken = async () => {
		setIsLoading(true);
		try {
			const response: AxiosResponse<string> = await axios.post(config.tokenRefreshUrl);

			const accessToken = response?.headers?.['New-Access-Token'] as string;

			if (accessToken) {
				setSession(accessToken);
				return accessToken;
			}

			return null;
		} catch (error) {
			const axiosError = error as AxiosError;

			handleError(axiosError);
			return axiosError;
		}
	};

	/**
	 * if a successful response contains a new Authorization header,
	 * updates the access token from it.
	 *
	 */
	useEffect(() => {
		if (config.updateTokenFromHeader && isAuthenticated) {
			axios.interceptors.response.use(
				(response) => {
					const newAccessToken = response?.headers?.['New-Access-Token'] as string;

					if (newAccessToken) {
						setSession(newAccessToken);
					}

					return response;
				},
				(error) => {
					const axiosError = error as AxiosError;

					if (axiosError?.response?.status === 401) {
						signOut();
						// eslint-disable-next-line no-console
						console.warn('Unauthorized request. User was signed out.');
					}

					return Promise.reject(axiosError);
				}
			);
		}
	}, [isAuthenticated]);

	useEffect(() => {
		if (user) {
			setAuthStatus('authenticated');
		} else {
			setAuthStatus('unauthenticated');
		}
	}, [user]);

	const authContextValue = useMemo(
		() =>
			({
				user,
				isAuthenticated,
				authStatus,
				isLoading,
				signIn,
				signUp,
				signOut,
				updateUser,
				refreshToken,
				setIsLoading
			}) as JwtAuthContextType,
		[user, isAuthenticated, isLoading, signIn, signUp, signOut, updateUser, refreshToken, setIsLoading]
	);

	return <JwtAuthContext.Provider value={authContextValue}>{children}</JwtAuthContext.Provider>;
}

export default JwtAuthProvider;
