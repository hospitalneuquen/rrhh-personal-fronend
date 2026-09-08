import { Component, Output, EventEmitter, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Articulo } from 'src/app/models/Articulo';
import { Ausentismo } from 'src/app/models/Ausentismo';
import { Agente } from 'src/app/models/Agente';

import { ArticuloService } from 'src/app/services/articulo.service';
import { AusentismoService } from 'src/app/services/ausentismo.service';


@Component({
    selector: 'app-ausentismo-search-form',
    templateUrl: 'ausentismo-search-form.html'
})
export class AusentismoSearchFormComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() agente: Agente;
    
    private timeoutHandle: number;
    public searchForm: FormGroup;
    public searching = true;
    
    public articulos: Articulo[] = [];

    // Eventos de salida
    @Output() searchStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() searchEnd: EventEmitter<Ausentismo[]> = new EventEmitter<Ausentismo[]>();
    @Output() searchClear: EventEmitter<any> = new EventEmitter<any>();


    constructor(
        private formBuilder: FormBuilder,
        private searchService: AusentismoService,
        private articuloService: ArticuloService) {
    }

    ngOnInit() {
        this.initFormSelectOptions();
        this.searchForm = this.createSearchForm();
        this.searchForm.valueChanges.subscribe(() => {
            this.buscar();
        });
        this.buscar();
    }

    ngAfterViewInit() {
    setTimeout(() => {
        this.searchForm.patchValue({
            fechaDesde: moment().subtract(3, 'months').year(2023).toDate(),
            fechaHasta: moment().year(2023).toDate()
        });
    }, {emitEvent: false });
    }

    ngOnDestroy(): void {
        clearInterval(this.timeoutHandle);
    }

    /**
     * Inicializa las opciones de los diferentes elementos
     * select disponible en el componente
     */
    initFormSelectOptions(){
        this.articuloService.get({})
            .subscribe(data => {
                this.articulos = data;
        });
    }

    createSearchForm()
    {
        return this.formBuilder.group({
            agente          : [this.agente],
            fechaDesde      : [],
            fechaHasta      : [],
            articulo        : []
        });
    }


    /**
     * Busca ausentismos cada vez que algun input del formulario de busqueda
     * cambia de valor.
     */
    public buscar() {
        if (!this.searchForm || !this.searchForm.valid) return;
        // Cancela la búsqueda anterior
        if (this.timeoutHandle) {
            window.clearTimeout(this.timeoutHandle);
        }
        const searchValues = this.prepareSearchParams(this.searchForm.value);
        this.searchStart.emit();
        this.timeoutHandle = window.setTimeout(() => {
            this.timeoutHandle = null;
            this.searchService.searchAusentismo(searchValues)
                .subscribe(resultado => {
                    this.searchEnd.emit(resultado);
                },
                (err) => {
                    this.searchEnd.emit([])
                }
            );
        }, 500);
    }

    prepareSearchParams(searchValues){
        let _sv = {};
        if (searchValues.agente) _sv = {..._sv, agenteId: searchValues.agente._id}
        if (searchValues.articulo) _sv = {..._sv, articuloId: searchValues.articulo._id}
        if (searchValues.fechaDesde) _sv = {..._sv, fechaDesde: searchValues.fechaDesde}
        if (searchValues.fechaHasta) _sv = {..._sv, fechaHasta: searchValues.fechaHasta}
        return _sv;
    }
}