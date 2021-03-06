import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import { AgenteService } from 'src/app/services/agente.service';
import { TipoSituacionService } from 'src/app/services/tm/situacion.service';
import { Agente } from 'src/app/models/Agente';
import { TipoSituacion } from 'src/app/models/TipoSituacion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { isEmpty } from 'src/app/utils/formUtils';
import { getAgenteSearchParams } from 'src/app/utils/searchUtils';


@Component({
    selector: 'app-agente-search-form',
    templateUrl: 'agente-search-form.html',
    // styleUrls: ['agente-search-form.scss']
})
export class AgenteSearchFormComponent implements OnInit, OnDestroy {
    public searchForm: FormGroup;
    private timeoutHandle: number;
    public searchedText: string = null;
    public autoFocus = 0;
    public mostrarMasOpciones = false;

    // Advanced search form inputs
    public tiposSituacion: TipoSituacion[];
    public tiposEstados; 

    // Eventos
    @Output() searchStart: EventEmitter<any> = new EventEmitter<any>();
    @Output() searchEnd: EventEmitter<Agente[]> = new EventEmitter<Agente[]>();
    @Output() searchClear: EventEmitter<any> = new EventEmitter<any>();

    
    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private agenteService: AgenteService,
        private tipoSituacionService: TipoSituacionService
    ) {
        this.searchedText = this.activatedRoute.snapshot.queryParams.search || "";
    }

    public ngOnInit() {
        this.autoFocus = this.autoFocus + 1;
        this.initFormSelectOptions();
        this.searchForm = this.initSearchForm();
        this.buscar(null);
    }

    initFormSelectOptions(){
        // Init Tipos Situacion
        this.tipoSituacionService.get({})
        .subscribe(data => {
            this.tiposSituacion = data;
        });
        // Init Tipos de Estado
        this.tiposEstados =[{id:'activo', nombre:'Activo'}, {id:'baja', nombre:'Baja'}];
    }

    initSearchForm(){
        return this.formBuilder.group({
            textoLibre  : this.searchedText,
            situacion   : [],
            estado      : [],
        });
    }

    ngOnDestroy(): void {
        clearInterval(this.timeoutHandle);
    }

    private prepareSearchParams(){
        let params:any = {};
        let form = this.searchForm.value;
        let textoLibre = form.textoLibre? form.textoLibre.trim(): "";
        params = getAgenteSearchParams(params, textoLibre);
        if (form.estado){
            if (form.estado.id == 'activo'){
                params['activo'] = true;
            }
            else{
                params['activo!'] = true;
            }
        }
        if (form.situacion){
            params['situacionLaboral.situacion.tipoSituacion.nombre'] = form.situacion.nombre;
        }
        return params;
    }

    /**
     * Busca agentes cada vez que el campo de busqueda cambia su valor
     */
    public buscar($event) {
        // Error en Plex, ejecuta un change cuando el input pierde el
        // foco porque detecta que cambia el valor
        if ($event && $event.type) {
            return;
        }
        this.prepareSearchParams();
        // Cancela la búsqueda anterior
        if (this.timeoutHandle) {
            window.clearTimeout(this.timeoutHandle);
        }
        // Inicia búsqueda
        let searchParams = this.prepareSearchParams();
        if (!isEmpty(searchParams)) {
            this.timeoutHandle = window.setTimeout(() => {
                this.searchStart.emit();
                this.timeoutHandle = null;
                this.agenteService.search(searchParams).subscribe(
                    resultado => {
                        // Parse de cada elemento de la lista en un 
                        // objeto Agente completo. Deberia hacerse en el servicio?
                        let agentes = resultado.map(e => e = new Agente(e));
                        this.searchEnd.emit(agentes);
                    },
                    (err) => {
                        this.searchEnd.emit([])
                    }
                );
            }, 1000);
        } else {
            this.searchClear.emit();
        }
    }

    public applyFilter($event) {
 
		this.buscar($event);
		this.applyFilterToRoute();
 
    }
    
    private applyFilterToRoute() {
		this.router.navigate(
			['/agentes',],
			{
                queryParams: { search: this.searchForm.value.textoLibre },
				relativeTo: this.activatedRoute,
				// NOTE: By using the replaceUrl option, we don't increase the Browser's
				// history depth with every filtering keystroke. 
				replaceUrl: true
			}
		);
	}

    public altaAgente(){
        this.router.navigate(['/agentes/registro']);
    }
}