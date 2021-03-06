import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import  *  as formUtils from 'src/app/utils/formUtils';

import { RegimenHorarioService } from 'src/app/services/regimen-horario.service';

import { Regimen } from 'src/app/models/Regimen';
import { RegimenHorario } from 'src/app/models/RegimenHorario';


@Component({
    selector: 'agente-datos-regimen',
    templateUrl: './agente-datos-regimen.html',

})
export class AgenteDatosRegimenComponent implements OnInit {
    @Input() regimen: Regimen;
    @Input() editable: boolean = false;
    @Output() outputRegimen: EventEmitter<Regimen> = new EventEmitter<Regimen>();

    @ViewChild(FormGroupDirective) _form;

    datosRegimenForm: FormGroup;
    regimenHorarios: RegimenHorario[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private regimenHorarioService: RegimenHorarioService
            ){}

    ngOnInit() {
        // Init Regimenes Horario
        this.regimenHorarioService.get({})
            .subscribe(data => {
                this.regimenHorarios = data;
        });

        this.datosRegimenForm = this.createDatosRegimenForm();
        this.datosRegimenForm.valueChanges.subscribe(() => {
            this.outputRegimen.emit(this.datosRegimenForm.value);
        });
    }

    createDatosRegimenForm(){
        return this.formBuilder.group({
            regimenHorario         : [this.regimen.regimenHorario],
            prolongacionJornada    : [this.regimen.prolongacionJornada],
            actividadCritica       : [this.regimen.actividadCritica],
            dedicacionExclusiva    : [this.regimen.dedicacionExclusiva],
            tiempoPleno            : [this.regimen.tiempoPleno],
            guardiasPasivas        : [this.regimen.guardiasPasivas],
            guardiasActivas        : [this.regimen.guardiasActivas]
            
        });
    }

    resetForm(){
        formUtils.resetForm(this.datosRegimenForm, this._form);
    }

}