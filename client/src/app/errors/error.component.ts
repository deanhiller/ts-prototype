import {ChangeDetectionStrategy, Component, inject, ViewEncapsulation} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import {FuseAlertComponent} from "../../@fuse/components/alert";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle
} from "@angular/material/dialog";

export interface DialogData {
    title: string;
    message: string;
}

@Component({
    selector: 'error-component',
    templateUrl: './error.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FuseAlertComponent, MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
    readonly data = inject<DialogData>(MAT_DIALOG_DATA);

}
