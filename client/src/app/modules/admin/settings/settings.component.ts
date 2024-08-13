import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'example',
    standalone   : true,
    templateUrl  : './settings.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class SettingsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
