import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Plex } from '@andes/plex';

import { ABMCreateUpdateComponent } from '../../crud/abm-create-update.component';
import { ObjectService } from 'src/app/services/tm/object.service';
import { RegimenHorarioService } from 'src/app/services/regimen-horario.service';
import { FormBuilder } from '@angular/forms';


@Component({
    selector: 'app-regimen-horario-create-update',
    templateUrl: 'regimen-horario-create-update.html'
  })

export class RegimenHorarioCreateUpdateComponent extends ABMCreateUpdateComponent {

    titulo = 'Regimen Horario';
    
    constructor(
        protected route: ActivatedRoute,
        protected location: Location,
        protected plex: Plex,
        protected formBuilder: FormBuilder,
        protected objectService: ObjectService,
        private regimenHorarioService: RegimenHorarioService)
    {
        super(route, location, plex, formBuilder, objectService)
    }

    protected get dataService(){
        return this.regimenHorarioService;
    }

    protected initForm(){
        return this.formBuilder.group({
            _id        : [ this.object._id ],
            nombre     : [ this.object.nombre ],
            activo     : [ this.object.activo ]
        });
    }
}