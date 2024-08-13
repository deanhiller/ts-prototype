import {ErrorHandler, inject, Injectable, NgZone} from "@angular/core";
import {HttpError, UnauthorizedError} from "../../apis/util/apiUtils";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {DialogData, ErrorComponent} from "../errors/error.component";

@Injectable({
    providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {
    readonly dialog = inject(MatDialog);
    readonly ngZone = inject(NgZone);

    handleError(e: any): void {
        if(e instanceof Error) {
            console.error("Error.  Stacktrace="+e.stack);
        } else {
            console.error("Someone throwing a bad error type="+e);
        }

        let title;
        let message;

        //TODO: need to really differentiate between errors here
        if(e instanceof HttpError) {
            title = 'Server bug';
            message = 'You encountered a server bug.'
        } else if(e instanceof TypeError && e.message === "Failed to fetch") {
            title = 'Network Issues';
            message = 'Please check your network connection';
        } else if(e instanceof Error) {
            title = 'Client Bug';
            message = 'You encountered a client bug';
        } else {
            //this is very very bad. not stack trace
            title = 'Client Bug';
            message = 'You encountered a client bug(code: 4560)';
        }

        this.ngZone.run(() => {
            console.log("ng zone running");
            this.dialog.open(ErrorComponent, {
                data: { title: title, message: message }
            });
        });
    }

}
