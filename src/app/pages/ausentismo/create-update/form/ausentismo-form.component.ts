import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subscription, Subject } from 'rxjs/Rx';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AusentismoService } from 'src/app/services/ausentismo.service';
import { CalendarStoreService } from 'src/app/stores/calendar.store.service';

import { Ausentismo } from 'src/app/models/Ausentismo';
import { Articulo } from 'src/app/models/Articulo';


@Component({
    selector: 'app-ausentismo-form',
    templateUrl: 'ausentismo-form.html',
    styleUrls: ['ausentismo-form.scss']
})
export class AusentismoCargaFormComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() form: FormGroup;
    @Input() articulos: Articulo[];

    @Output() changedValue: EventEmitter<any> = new EventEmitter<any>();
    @Output() success: EventEmitter<any> = new EventEmitter<any>();
    @Output() errors: EventEmitter<any> = new EventEmitter<any>();    
    @Output() warnings: EventEmitter<any> = new EventEmitter<any>();

    
    
    public ausentismoFiles: any = [];

    public get articuloSeleccionado(){
        return this.form.get('articulo').value;
    }

    private storeSubscription: Subscription;
    private cantDiasSubject$ = new Subject(); // To keep track of changes in cantDias

    constructor(
        private ausentismoService: AusentismoService,
        private calendarStoreService: CalendarStoreService){

        }

    public ngOnInit() {
        // this.updateRangeSelection(); 
        this.form.valueChanges.subscribe(() => {
            this.changedValue.emit(this.form.value);
        });

        this.storeSubscription =  this.calendarStoreService.selectionRange$
            .subscribe(rangeSelection => {
                if (rangeSelection) {
                    // TODO Terminar interacciones con formulario
                }
            });

        // Cuando cantDias cambia actualizamos las fechas desde/hasta
        this.cantDiasSubject$.pipe(
            debounceTime(500), // Delay between keyup
            distinctUntilChanged()).subscribe((cantDias: string) => {
                if (cantDias){
                    this.form.patchValue({fechaHasta:null});
                    this.calcularDatosAusentismo();
                } 
            });
    }

    public ngAfterViewInit(){
        this.form.patchValue({ fechaDesde: this.form.value.fechaDesde });
        this.form.patchValue({ fechaHasta: this.form.value.fechaHasta });
        
        
    }

    ngOnDestroy() {
        this.storeSubscription.unsubscribe();
    }

    public onChangedArticulo(articulo){
        if (articulo) this.sugerirDatosAusentismo();
    }


    public onChangedFechaDesde(value){
        if (value) this.sugerirDatosAusentismo();
    }


    public onChangedCantidadDias(dias){
        this.cantDiasSubject$.next(dias)
    }
    
    public onChangedFechaHasta(value){
        if (value){
            this.form.patchValue({cantidadDias:null});
            this.calcularDatosAusentismo();
        } 
    }

    calcularDatosAusentismo(){
        let ausentismo = new Ausentismo(this.form.value)
        let form:any = this.form.value;
        if ( form.articulo && form.fechaDesde){
            this.ausentismoService.postCalcularAusentismo(ausentismo)
            .subscribe(data => {
                this.form.patchValue({cantidadDias:data.cantidadDias});
                this.form.patchValue({fechaHasta:data.fechaHasta})
                this.updateRangeSelection();
            },
            error=> this.errors.emit(error));            
        }
    }

    sugerirDatosAusentismo(){
        let ausentismo = new Ausentismo(this.form.value)
        let form:any = this.form.value;
        if (form.enableSugerencias){
            if ( form.articulo && form.fechaDesde){
                this.ausentismoService.postSugerirAusentismo(ausentismo)
                .subscribe(data => {
                    this.form.patchValue({cantidadDias:data.dias});
                    this.form.patchValue({fechaHasta:data.hasta})
                    this.updateRangeSelection();
                    if (data.warnings){
                        this.warnings.emit(data.warnings);            
                    }
                },
                error=> this.errors.emit(error));            
            }
        }
        else{
            this.calcularDatosAusentismo();
        }
    }


    private updateRangeSelection(){
        let fd:Date = this.form.value.fechaDesde;
        let fh:Date = this.form.value.fechaHasta;
        if ((fd && fh) && (fd>fh)) return; // Form validation
        if (!fd && !fh){
            this.calendarStoreService.selectionRange = null;
            return;
        }
        if (fd && fh) {
            this.calendarStoreService.selectionRange = { fechaDesde:fd, fechaHasta: fh };
            return;
        }
        if (fd && !fh) {
            this.calendarStoreService.selectionRange = { fechaDesde:fd, fechaHasta: fd };
            return;
        }
        if (!fd && fh) {
            this.calendarStoreService.selectionRange = { fechaDesde:fh, fechaHasta: fh };
            return;
        }
    }
}