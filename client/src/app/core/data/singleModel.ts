
//The most scalable model (# of engineers scaling while keeping code simple) has been a pattern
//I call VCVC-M (ViewController pairs with single model that all can observe)
//Any updates to this model anyone in the GUI can subscript to.  All remote calls should
//update the single model.  All views should subscribe to data they want so they all rely on the same
//changing model.  MOST data is short lived and should go straight from server to page and die
//so that user needs to refresh server to page.  Some data like userProfile (logout erases it) and
//login brings it back

import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SingleModel {
    public _authenticated: boolean = false;

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }


}

