import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DropdownItem, Plex } from '@andes/plex';
import { CRUDItemListComponent } from 'src/app/modules/tm/components/crud/list/item/crud-item-list.component';
import { ModalService } from 'src/app/services/modal.service';
import { ParteJustificacionService } from 'src/app/services/parte-justificacion.service';
import { ParteAgente } from 'src/app/models/ParteAgente';



@Component({
    selector: 'app-parte-agente-item-list',
    templateUrl: './parte-agente-item-list.html',
})
export class ParteAgenteItemListComponent extends CRUDItemListComponent implements OnInit{

    @Input() readonly = false;
    @Input() editionEnabled = false;

    @Output() changed: EventEmitter<any> = new EventEmitter<any>();

    public justificaciones = []; // Opciones para el select de cada parte
    
    constructor(public router: Router,
            public plex: Plex,
            private modalService: ModalService,
            private parteJustificacionService: ParteJustificacionService) {
        super(router, plex);
    }

    ngOnInit(){
        this.parteJustificacionService.get({})
            .subscribe(data => {
                this.justificaciones = data
            })
    }

    public onChangeParteAgente(obj:ParteAgente){
        this.accion.emit({ accion:'edit', objeto:obj})
    }

    public accionToDo(obj, index){
        this.seleccionarObjeto(obj, index);
        this.modalService.open('modal-carga-articulo');
    }

    public canAddAusentismo(obj){
        // Fix this. Revisar validez de las condiciones
        return (this.readonly && !obj.ausencia
            && obj.justificacion && obj.justificacion.nombre == "Ausente con aviso")
    }

    public onCloseModal(){
        this.modalService.close('modal-carga-articulo');
    }

    public onSuccessCargaAusencia(data){
        this.plex.info('info', 'Ausentismo ingresado correctamente')
            .then( e => {
                this.onCloseModal();
                this.changed.emit();
        });
    }

    public onErrorsCargaAusencia(error){
        if(error){
            this.plex.info('info', error);
        }
        else{
            this.plex.info('info', 'Debe completar todos los datos obligatorios');
        }
    }

    public onWarningsCargaAusencia(warnings){
        if (warnings && warnings.length){
            let textWarning = ``;
            for (const warn of warnings){
                textWarning = `${textWarning}<p> ${warn} </p>`
            }
            this.plex.info('info', `<p>El articulo seleccionado presenta los
                                    siguientes problemas: ${textWarning} </p>`) ;
        }
    }

    public hasInconsistencias(obj){
        // Fix this. Revisar validez de las condiciones
        if (!obj.fichadas && !obj.ausencia && obj.justificacion && obj.justificacion.nombre != "Sin novedad") return true;
        if (!obj.fichadas && obj.ausencia && obj.justificacion && obj.justificacion.nombre == "Inasistencia justificada") return true;
        if (obj.fichadas && (!obj.fichadas.entrada || !obj.fichadas.salida) &&
            obj.justificacion && (obj.justificacion.nombre == "Presente" || obj.justificacion.nombre == "Cumplió jornada laboral")
            ) return true
        return false;
    }
} 