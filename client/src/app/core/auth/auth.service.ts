import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import {BaseClient} from "../../../clients/base/baseClient";
import {BaseApi, LoginRequest, LoginResponse} from "../../../apis/base/base";
import {SingleModel} from "../data/singleModel";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _baseClient: BaseApi = inject(BaseClient);
    private _singleModel = inject(SingleModel);

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    async signIn(credentials: { email: string; password: string }): Promise<LoginResponse> {
        // Throw error, if the user is already logged in
        if (this._singleModel._authenticated) {
            throw Error('User is already logged in');
        }

        const loginReq = new LoginRequest();
        loginReq.name = credentials.email;
        loginReq.password = credentials.password;

        const loginResponse = await this._baseClient.login(loginReq);
        // Store the access token in the local storage
        this._singleModel.accessToken = loginResponse.accessToken;

        // Set the authenticated flag to true
        this._singleModel._authenticated = true;

        // Store the user on the user service
        //this._userService.user = response.user;
        console.log("our loginResponse="+JSON.stringify(loginResponse));

        return loginResponse;
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this._singleModel.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this._singleModel.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._singleModel._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._singleModel._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._singleModel._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this._singleModel.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this._singleModel.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
