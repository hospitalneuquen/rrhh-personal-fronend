import { Location } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Plex } from '@andes/plex';

import { AgenteService } from 'src/app/services/agente.service';
import { CalendarStoreService } from 'src/app/stores/calendar.store.service';
import { ReportesService } from 'src/app/services/reportes.service';

import { AusentismoSearchFormComponent } from './search-form/ausentismo-search-form.component';
import { Ausentismo } from 'src/app/models/Ausentismo';
import { Agente } from 'src/app/models/Agente';


@Component({
    selector: 'app-ausentismo-search',
    templateUrl: 'ausentismo-search.html',
    styleUrls: ['./ausentismo-search.scss']
})

export class AusentismoSearchComponent implements OnInit {
    @Output() data: EventEmitter<Ausentismo[]> = new EventEmitter<Ausentismo[]>();
    @Output() ausentismoSelected: EventEmitter<Ausentismo> = new EventEmitter<Ausentismo>();

    @ViewChild(AusentismoSearchFormComponent) searchForm: AusentismoSearchFormComponent;

    agente:Agente;
    ausentismoSeleccionado: Ausentismo;
    ausentismos:Ausentismo[];
    searching = true;

    // Printing
    public printing:Boolean = false;
    public reportName:string = 'ausentismo_certificado';

    constructor(
        private agenteService:AgenteService,
        private calendarStoreService: CalendarStoreService,
        private reportesService: ReportesService,
        private router:Router,
        private route: ActivatedRoute,
        private location: Location,
        protected plex: Plex){}
    
    public ngOnInit() {
        this.route.parent.params.subscribe(
            params =>{
                const agenteID = params['agenteId'];
                if (agenteID){
                    this.agenteService.getByID(agenteID).subscribe(
                        (data) => {
                            if (data){
                                this.agente = new Agente(data);
                            }
                        });
                }
                else{
                    this.plex.info('danger', 'No se pudo recuperar información del agente. Verifique los datos ingresados')
                        .then(e=>this.router.navigateByUrl(`/agentes`));
                }
            }
        );
    }

    public hoverAusentismo(obj:any){
        console.log(obj);
    }

    public editarAusentismo(ausentismo){
        this.router.navigateByUrl(`/agentes/${this.agente._id}/ausentismo/${ausentismo._id}/editar`);
    }

    public eliminarAusentismo(ausentismo){
        this.plex.confirm('¿Esta seguro que desea eliminar este ausentismo?')
            .then( confirm => {
                if (confirm){
                    this.calendarStoreService.removeAusentismo(ausentismo)
                        .subscribe( data => {
                            // Refresh search (actualiza el listado)
                            this.searchForm.buscar();
                    })
                }
        });
        
    }

    public printAusentismo(ausentismo){
        this.reportesService.download(this.reportName, {_id:ausentismo._id})
            .subscribe(data => {           
                this.reportesService.descargarArchivo(data);     
                this.printing = false;
            }, error => {
                this.printing = false;
                console.log('download error:', JSON.stringify(error));
        }); 
    }

    public verIndicadores(){
        this.router.navigateByUrl(`/agentes/${this.agente._id}/ausentismo/indicadores`);
    }

    public showResultados(objs:any){
        this.searching = false;
        this.data.emit(objs);
        this.ausentismos = objs;
    }

    public clearResultados(event:any){
        this.searching = false;
        this.data.emit(null);
        this.ausentismos = null;
    }

    waitingResultados(event:any){
        this.searching = true;
    }

    public onClose(){
        this.location.back();
    }
}