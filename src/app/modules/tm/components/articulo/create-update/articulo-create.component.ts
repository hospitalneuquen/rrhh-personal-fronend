import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { CRUDCreateUpdateComponent } from 'src/app/modules/tm/components/crud/create-update/crud-create-update.component';
import { ArticuloCreateFormComponent } from './form/articulo-create-form.component';


@Component({
    selector: 'app-articulo-create',
    templateUrl: '../../crud/create-update/crud-create-update.html'
  })

export class ArticuloCreateComponent extends CRUDCreateUpdateComponent implements OnInit {
    
    public formComponent = ArticuloCreateFormComponent;
    
    constructor(
        public router: Router,
        public resolver: ComponentFactoryResolver,
        public location: Location
    ){
        super(router, resolver, location);
    }

    public ngOnInit() {
        super.ngOnInit()
    }

}