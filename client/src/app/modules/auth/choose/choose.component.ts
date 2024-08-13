import {Component, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterOutlet} from "@angular/router";
import {fuseAnimations} from "../../../../@fuse/animations";
import {FuseAlertComponent, FuseAlertType} from "../../../../@fuse/components/alert";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";


@Component({
    selector: 'choose-teacher-customer',
    templateUrl: './choose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    animations: fuseAnimations,
    imports: [
        FuseAlertComponent,
        RouterLink,
        MatIcon,
        MatIconButton
    ],
})
export class ChooseTeacherOrCustomerComponent implements OnInit {
    private _activatedRoute = inject(ActivatedRoute);
    private _router = inject(Router);

    ngOnInit(): void {
    }

    signup(role: string) {
        console.log("clicked="+role);

        // Navigate to the redirect url
        this._router.navigateByUrl("/sign-up/"+role);
    }
}
