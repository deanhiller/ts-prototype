import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import {HttpError, UnauthorizedError} from "../../../../apis/util/apiUtils";

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email: [
                'dean@biltup.com',
                [Validators.required, Validators.email],
            ],
            password: ['admin', Validators.required],
            rememberMe: [''],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    async signIn(): Promise<void> {
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        try {
            await this._authService.signIn(this.signInForm.value);
            console.log("success resp");
            // Set the redirect url.
            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
            // to the correct page after a successful sign in. This way, that url can be set via
            // routing file and we don't have to touch here.
            const redirectURL =
                this._activatedRoute.snapshot.queryParamMap.get(
                    'redirectURL'
                ) || '/signed-in-redirect';

            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
        } catch (e) {
            console.log("we see error22");
            // Re-enable the form
            this.signInForm.enable();

            if(e instanceof Error) {
                console.error("Error type="+e);
                console.error("Stacktrace="+e.stack);
            } else {
                console.error("Someone throwing a bad error type="+e);
            }


            //TODO: need to really differentiate between errors here
            if(e instanceof UnauthorizedError) {
                // Reset the form
                this.signInNgForm.resetForm();
                // Set the alert
                this.alert = {
                    type: 'error',
                    message: 'Wrong email or password',
                };
            } else if(e instanceof HttpError) {
                this.alert = {
                    type: 'error',
                    message: 'You have encountered a server bug.',
                };
            } else if(e instanceof TypeError && e.message === "Failed to fetch") {

                this.alert = {
                    type: 'error',
                    message: 'Please check your network connection',
                };
            } else if(e instanceof Error) {
                this.alert = {
                    type: 'error',
                    message: 'You encountered a client bug',
                };
            } else {
                this.alert = {
                    type: 'error',
                    message: 'You encountered a bug(code: 4560)',
                };
            }

            // Show the alert
            this.showAlert = true;
        }
    }
}
