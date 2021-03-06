import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ABMListComponent } from 'src/app/modules/tm/components/crud/abm-list.component';
import { ObjectService } from 'src/app/services/tm/object.service';
import { PaisService } from 'src/app/services/pais.service';


@Component({
    selector: 'app-pais-list',
    templateUrl: 'pais-list.html',
})
export class PaisListComponent extends ABMListComponent {

    public sortColumn = 'nombre';
    // list-head options
    public columnDef =
    [
        {
            id: 'nombre',
            title: 'Nombre',
            size: '50'
        },
        {
            id: 'gentiliio',
            title: 'Gentilicio',
            size: '50'
        },
    ]

    constructor(
        protected router: Router,
        protected objectService: ObjectService,
        private paisService: PaisService) {
            super(router, objectService);
         }

    protected get dataService(){
        return this.paisService;
    }

}