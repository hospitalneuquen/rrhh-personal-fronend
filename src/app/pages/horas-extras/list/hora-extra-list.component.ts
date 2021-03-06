import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Plex } from '@andes/plex';

import { ABMListComponent } from 'src/app/modules/tm/components/crud/abm-list.component';
import { ObjectService } from 'src/app/services/tm/object.service';
import { Auth } from 'src/app/services/auth.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { HoraExtraService } from 'src/app/services/horas-extras.service';


@Component({
    selector: 'app-hora-extra-list',
    templateUrl: 'hora-extra-list.html',
})
export class HoraExtraListComponent extends ABMListComponent {

    HORA_EXTRA_SIN_CONFIRMAR = 0;
    HORA_EXTRA_CONFIRMADA = 1;
    HORA_EXTRA_PROCESADA = 2;

    public modelName = 'horaextra';
    public reportName = 'horas_extras';
    public printing = false;

    public columnDef =
    [
        {
            id: 'mes',
            title: 'Mes',
            size: '20',
            sort: 'desc'
        },
        {
            id: 'anio',
            title: 'Año',
            size: '20'
        },
        {
            id: 'servicio',
            title: 'Servicio',
            size: '40'
        },
        {
            id: 'estado',
            title: 'Estado',
            size: '20'
        }
    ] 

    constructor(
        protected router: Router,
        protected objectService: ObjectService,
        private horaExtraService: HoraExtraService,
        private authService: Auth,
        private reportesService: ReportesService,
        public plex: Plex) {
            super(router, objectService);
         }

    public async ngOnInit() {
        this.canCreateObject = await this.authService.check('horas_extras:hora_extra:add_hora_extra');
    }

    protected get dataService(){
        return this.horaExtraService;
    }

    public cancel(){
        this.router.navigate(['/inicio']);
    }

    public createItem(){
        this.router.navigate(['horasextras/crear']);
    }

    public onItemEdit(item){
        this.router.navigate(['horasextras/editar', item._id]);
    }

    public onItemView(item){
        this.router.navigate(['horasextras/editar', item._id]);
    }

    public onItemProcesar(item){
        this.router.navigate(['horasextras/editar', item._id]);
    }

    public onItemImprimir(item){
        this.printing = true;
        this.reportesService.print({ tipoReporte:this.reportName, _id:item._id })
            .subscribe(data => {           
                this.reportesService.descargarArchivo(data);     
                this.printing = false;
            }, error => {
                this.printing = false;
                console.log('download error:', JSON.stringify(error));
            }); 
    }

    public onHabilitarEdicion(object){
        this.plex.confirm(`Al confirmar se habilita al Jefe de Servicio
            a realizar modificaciones nuevamente sobre la planilla de Hs. Extras seleccionada.`)
        .then( confirm => {
            if (confirm) return this.updateHoraExtra(object);
        });
    }

    private updateHoraExtra(horaExtra){
        this.horaExtraService.putAndHabilitarEdicion(horaExtra)
            .subscribe( horaExtraActualizada => {
                this.plex.info('success', `Planilla de Horas Extras modificada correctamente.`);
                this.removeItemFromList(horaExtra)
                },
                error => this.plex
                            .info('danger', 'No se pudo actualizar correctamente la planilla de Horas Extras')
                );
    }

}