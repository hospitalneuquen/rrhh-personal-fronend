import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DropdownItem, Plex } from '@andes/plex';
import { CRUDItemListComponent } from 'src/app/modules/tm/components/crud/list/item/crud-item-list.component';


@Component({
    selector: 'app-fichada-reporte-item-list',
    templateUrl: './fichada-reporte-item-list.html',
})
export class FichadaReporteItemListComponent extends CRUDItemListComponent{
    
    constructor(
            public router: Router,
            public plex: Plex) {
        super(router, plex);
    }

} 