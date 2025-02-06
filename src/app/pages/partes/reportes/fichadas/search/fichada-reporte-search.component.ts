import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { CRUDSearchFormComponent } from 'src/app/modules/tm/components/crud/list/search/crud-search.component';

import { ParteService } from 'src/app/services/parte.service';
import { Auth } from 'src/app/services/auth.service';
import { UbicacionService } from 'src/app/services/ubicacion.service';

@Component({
    selector: 'app-fichada-reporte-search-form',
    templateUrl: 'fichada-reporte-search.html',
})
export class FichadaReporteSearchFormComponent extends CRUDSearchFormComponent implements OnInit, AfterViewInit, OnDestroy {

    // Permisos especiales. Si el usuario logueado dispone de este permiso podra
    // consultar libremente en el modulo. Caso contrario estará restringido a los 
    // servicios disponibles como jefe de servicio/dpto/etc.    
    public canProcesarParte:Boolean = false;
    
    // Id de los servicios del jefe de servicio / servicio alias ubicacion
    public serviciosAllowed;
    
    // Search form select options
    public servicioOpciones = []

    constructor(
            formBuilder: FormBuilder,
            private objectService: ParteService,
            private authService: Auth,
            private ubicacionService: UbicacionService) {
        super(formBuilder);
    }

    async ngOnInit() {
        this.autoFocus = this.autoFocus + 1;
        this.canProcesarParte = await this.authService.check('partes:parte:procesar_parte');
        this.serviciosAllowed = this.getServiciosAllowed();
        this.initFormSelectOptions();
        this.searchForm = this.initSearchForm();
        this.buscar();
    }

    ngAfterViewInit(){
        // Parche para visualizar correctamente la fecha en el reactive form
        window.setTimeout(() => {
            if (this.searchForm){
                this.searchForm.patchValue({ 
                    fechaDesde: this.searchForm.value.fechaDesde,
                    fechaHasta: this.searchForm.value.fechaHasta,
                 })
            }
        }, 1000);
    }

    ngOnDestroy(){
        super.ngOnDestroy();
    }

    initFormSelectOptions(){
        if (this.canProcesarParte){
            this.ubicacionService.get({}).subscribe(servicios =>
                this.servicioOpciones = servicios)
        }
        
        if (this.serviciosAllowed && this.serviciosAllowed.length){
            this.servicioOpciones = this.serviciosAllowed;
        }       
    }

    initSearchForm(){
        return this.formBuilder.group({
            fechaDesde  : [ moment().subtract(1, 'years').toDate()],
            fechaHasta  : [ moment().add(1, 'days').toDate()],
            ubicacion: [
                (this.serviciosAllowed.length && !this.canProcesarParte)
                ? this.serviciosAllowed[0]
                : null
            ],
            agente      : []
        });
    }


    prepareSearchParams(){
        let params:any = {};
        if (this.searchForm.valid){
            let form = this.searchForm.value;
            if (form.fechaDesde){
                params['fecha>'] = form.fechaDesde;
            }
            if (form.fechaHasta){
                params['fecha<'] = form.fechaHasta;
            }
            if (form.ubicacion){
                params['ubicacion'] = form.ubicacion.codigo;
            }
            if (form.agente){
                params['agente._id'] = form.agente._id;
            }
        }
        return params;
    }


    search(searchParams){
        if (this.searchForm.valid){
            this.objectService.getFichadasAgentesReporte(searchParams).subscribe(
                objects => {
                    this.searchEnd.emit(objects);
                },
                (err) => {
                    this.searchEnd.emit([])
                }
            );
        }
        else{
            this.searchEnd.emit([])
        }
    }

    /**
     * Si el usuario tiene otorgado el permiso para procesar partes, entonces
     * esta autorizado a visualizar todas los partes de todos los servicios.
     * Caso contrario solo puede visualizar los partes de su servicio/s. Este
     * metodo debe ser llamado luego de haber determinado si el usuario puede
     * procesar un parte.
     */
    getServiciosAllowed(){
        if (this.serviciosAllowed) return this.serviciosAllowed;
        
        return (!this.canProcesarParte)? this.authService.servicios: [];
    }
}
