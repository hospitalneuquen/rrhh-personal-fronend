import 'rxjs/add/operator/toPromise';

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Plex } from '@andes/plex';

import  *  as formUtils from 'src/app/utils/formUtils';
import { RecargoFormComponent } from './form/recargo-form.component';

import { ModalService } from 'src/app/services/modal.service';
import { RecargoService } from 'src/app/services/recargo.service';

import { Agente } from 'src/app/models/Agente';
import { Recargo, RecargoItemPlanilla } from 'src/app/models/Recargo';

@Component({
    selector: 'app-recargo-create-update',
    templateUrl: './recargo-create-update.html'
  })
export class RecargoCreateUpdateComponent implements OnInit {
    @ViewChild("recargoForm") recargoForm: RecargoFormComponent;

    public isEditable = true;
    public recargo: Recargo;
    public generandoPlanilla: Boolean; // Bandera
    public planillaChanged: Boolean; // Bandera para indicar cuando se proceso un agente

    public get agenteSearchParams() {
        return this._extraSearchParams;
    }

    // Permisos
    
    /**
     * Si el recargo se encuentra en estado "confirmado" o "parcialmente procesado"
     * entonces se puede procesar.
     */
    public get puedeProcesar():Boolean {
        return (this.recargo && (this.recargo.estado == '1' || this.recargo.estado == '2'));
    } 

    
    public get puedeGuardar():Boolean{
        return (this.recargo && !this.recargo.estado || this.recargo.estado == '0');
    }

    public get puedeConfirmar():Boolean {
        return this.puedeGuardar;
    }

    public get puedeAgregarAgente():Boolean {
        return (this.recargo && !this.recargo.estado || this.recargo.estado != '3');
    }

    public get puedeEditarPlanilla():Boolean{
        return this.puedeAgregarAgente;
    }

    public get title():String {
        let titulo = 'Alta nueva planilla';
        if (this.recargo && this.recargo._id) {            
            titulo = (parseInt(this.recargo.estado) < 2)? 'Edición de planilla ': 'Detalle de Planilla';

            }
            return titulo;
    }

    /**
     * Contiene los valores reales de los parametros extras a utilizar
     * en el componente de busqueda de agentes. Se completa al momento
     * de tener disponibles los datos del formulario del encabezado.
     */
    private _extraSearchParams:any; 
    
    private _objectID:any; // To keep track of object on update

    public agentesSeleccionados = []; // 

    constructor(
        private route: ActivatedRoute,
        protected location: Location,
        private plex: Plex,
        private recargoService: RecargoService,
        private modalService: ModalService)
        {}

    ngOnInit(){
        this.route.paramMap.subscribe((params: ParamMap) => {
            this._objectID = params.get('id');
            if (this._objectID){
                this.prepareDataForUpdate();
            }
            else{
                this.prepareDataForCreate();
            }
        });

    }

    private prepareDataForCreate(){
        this.recargo = new Recargo();
    }

    private prepareDataForUpdate(){
        this.isEditable = false;
        this.recargoService.getByID(this._objectID)
            .subscribe(data => {
                this.recargo = new Recargo(data);
                // Actualizamos los agentes seleccionados. Este paso solo
                // es para evitar cargar agentes previamente cargados
                for (const item of this.recargo.planilla) {
                    this.agentesSeleccionados.push(item.agente);   
                }
                // Verificamos si la recargo es editable
                if (this.recargo.estado != '3') this.isEditable = true;
            })
    }
    
    private remoteItemFromList(list, item){
        return list.filter(elem => elem._id != item._id);
    }

    public onRemoveAgentePlanilla(agente){
        this.agentesSeleccionados = this.remoteItemFromList(this.agentesSeleccionados, agente);
    }

    /**
     * Metodo que se ejecuta ante los cambios realizados en el formulario del
     * encabezado. Todos los cambios impactan sobre el modelo recargo (this.recargo)
     * Si la planilla ya tenia informacion cargada sobre algun agente entonces
     * la misma se pierde ya que hay que regenerar la planilla si el usuario 
     * confirma los cambios.
     *  
     * @param newValue unicamente tiene informacion del ultimo campo modificado
     */
    public async onChangedRecargoForm(newValue:any){
        if (this.recargo.planilla.length > 0 ){
            this.plex.confirm(
                `Se van perder los datos ingresados en la planilla.
                ¿Desea Continuar?`)
                .then( confirm => {
                    if (confirm){
                        this.actualizarRecargo(newValue);
                    }
                    else{
                        // Hacemos un rollback de los cambios realizados al form
                        this.recargoForm.form.patchValue(
                            {
                                mes       : this.recargo.mes,
                                anio      : this.recargo.anio,
                                servicio  : this.recargo.servicio,
                            },
                            { emitEvent: false }); // Prevent infinite loop
                    }
            });
        }
        else{
            this.actualizarRecargo(newValue);
            await this.isRecargoUnique();
        }
    }

    
    private actualizarRecargo(changedValue:any){
        this.recargo.planilla = [];
        if ('mes' in changedValue) this.recargo.mes = changedValue.mes; 
        if ('anio' in changedValue) this.recargo.anio = changedValue.anio.id;
        if ('servicio' in changedValue) this.recargo.servicio = changedValue.servicio;
    }

    private async isRecargoUnique(){
        if (this.recargo.servicio && this.recargo.mes && this.recargo.anio){
            const recargoExistente = await this.findRecargo();
            if (recargoExistente && !this._objectID ){
                this.infoRecargoDuplicado();
                return false;
            }

            if (recargoExistente && this._objectID && recargoExistente._id != this._objectID){
                this.infoRecargoDuplicado();
                return false;
            }
            return true;
        }
    }

    /**
     * Valida que esten presentes todos los datos del formulario.
     */
    private async isRecargoFormValid(){
        const form = this.recargoForm.form;
        if (form.invalid){
            formUtils.markFormAsInvalid(form);
            this.plex.info('danger', 'Debe completar todos los datos obligatorios del encabezado');
            return false;
        }
        return true;
    }


    private async findRecargo(){
        const searchParams = {
            'anio': this.recargo.anio,
            'mes.id': this.recargo.mes.id,
            'servicio._id': this.recargo.servicio._id,
        } 
        const response = await this.recargoService.get(searchParams).toPromise();
        return (response.length)? response[0]:null;        
    }

    /**
     * Abre un modal con el componente de seleccion de agentes.El agente
     * que se selecciona se incorporara luego a la planilla de recargos.
     */
    public async onAddAgente(){
        const form = this.recargoForm.form;
        if ( await this.isRecargoFormValid()) {
            // this._extraSearchParams = {
            //     'situacionLaboral.cargo.servicio.ubicacion': form.value.servicio.codigo,
            //     'situacionLaboral.cargo.agrupamiento._id': form.value.categoria._id,
            //     'activo': true
            // }
            this.modalService.open('modal-add-agente');
        }
    }

    /**
     * Una vez seleccionado el/los agentes se crea una/s instancia/s de
     * RecargoItemPlanilla para agregar al listado general de recargos.
     */
    public onAddAgenteSelected(agentes:Agente[]){
        this.agentesSeleccionados = this.agentesSeleccionados.concat(agentes);
        agentes.forEach(agente => {
            if (!this.recargo.planilla.some(e => e.agente._id === agente._id)){
                // Si el agente seleccionado aun no pertenece a la planilla
                // lo incorporamos
                this.recargo.planilla.push( new RecargoItemPlanilla({
                    agente: {
                        _id: agente._id,
                        nombre: agente.nombre,
                        apellido: agente.apellido,
                        numero: agente.numero
                    },
                    items:[{
                        fecha: new Date(),
                        turno: null,
                        justificacion: null,
                        observaciones: ""
                    }]
                }));
            }      
        });
    }

    /**
     * Si se cancela la busqueda de agentes, cerramos el modal.
     */
    public onAddAgenteCancel(){
        this.closeModal()
    }

    public closeModal(){
        this.modalService.close('modal-add-agente');
    }


    /**
     * Al momento de guardar verificamos si corresponde guardar un nuevo
     * recargo, o guardar un recargo existente que ha sido modificada.
     */
    public async onGuardar(){
        if (await this.isRecargoFormValid() && await this.isRecargoUnique()){
            return this._objectID? this.updateRecargo('guardar'): this.addRecargo('guardar');
        }
        
    }

    /**
     * Idem que guardar pero con la accion 'Confirmar'
     */
    public async onConfirmar(){
        if (await this.isRecargoFormValid() && await this.isRecargoUnique()){
            this.plex.confirm(`Al confirmar se habilita al Dpto. de Gestión de Personal
                a realizar las validaciones correspondientes para su aprobación final.
                Durante esta etapa no podrá volver a editar la información ingresada.`)
            .then( confirm => {
                if (confirm) return this._objectID? this.updateRecargo('confirmar'): this.addRecargo('confirmar');
            });
        }
    }

    public async onProcesar(){
        if (await this.isRecargoFormValid()){
            return this.updateRecargo('procesar');
        }
    }

    public async onProcesarParcialmente(value){
        if (await this.isRecargoFormValid()){
            return this.updateRecargo('procesar_parcialmente');
        }
    }


    public onCerrar(){
        this.location.back();
    }

    /**
     * Al momento de crear un recargo se puede simplemente 'guardar' para
     * continuar posteriormente su edicion o se puede 'confirmar' para asi
     * dar un cierre a la misma y permitir los controles que deben realizar
     * otros sectores.
     * 
     * @param actionType  'guardar', 'confirmar'
     */
    private addRecargo(actionType:String){
        if (actionType == 'guardar'){
            this.recargoService.post(this.recargo)
                .subscribe( recargo => {
                    this.infoGuardarOk(recargo);
                })
        }
        else { // type == 'confirmar'
            this.recargoService.postAndConfirmar(this.recargo)
                .subscribe( recargo => {
                    this.infoConfirmarOk(recargo);
                })
        }
    }

    
     /**
     * Idem addRecargo
     * 
     * @param actionType  'guardar', 'confirmar', 'procesar_parcialmente', 'procesar'
     */
    private updateRecargo(actionType:String){
        switch (actionType){
            case 'guardar':
                this.recargoService.put(this.recargo)
                    .subscribe( recargo => {
                        this.infoGuardarOk(recargo);
                    });
                break;
            case 'confirmar':
                this.recargoService.putAndConfirmar(this.recargo)
                    .subscribe( recargo => {
                        this.infoConfirmarOk(recargo);
                    });
                break;
            case 'procesar_parcialmente':
                this.recargoService.putAndProcesarParcialmente(this.recargo)
                    .subscribe( recargo => {
                        this.infoProcesarParcialmenteOk(recargo);
                    },
                    error=>{ //TODO  
                    });
                break;
            case 'procesar':
                this.recargoService.putAndProcesar(this.recargo)
                    .subscribe( recargo => {
                        this.infoProcesarOk(recargo);
                    });
                break;
        }
    }

    private infoGuardarOk(recargo){
        this.plex
            .info('success', `Recargo Sin Confirmar guardado correctamente. 
                    Puede continuar editando la información ingresada hasta
                    confirmar definitivamente los datos para ser evaluados 
                    por el Dpto. de Gestión de Personal.`)
            .then( confirm => {
                this.location.back();
            });
    }

    private infoConfirmarOk(recargo){
        this.plex
            .info('success', `Recargo guardado y confirmado correctamente.`)
            .then( confirm => { 
                this.location.back();
            });
    }

    private infoProcesarOk(recargo){
        this.plex
            .info('success', `Recargo Procesado Totalmente.`)
            .then( confirm => {
                this.location.back();
            });
    }

    private infoProcesarParcialmenteOk(recargo){
        this.recargo = new Recargo(recargo);
        let totalmenteProcesado = true;
        for (const item of recargo.planilla) {
            if (!item.procesado){
                totalmenteProcesado = false;
                break;
            }
        }
        if (!totalmenteProcesado){
            this.plex.info('success', `Recargo procesado parcialmente correctamente.`)
        }
        else{
            this.infoProcesarOk(recargo);
        }
        
    }

    private infoRecargoDuplicado(){
        this.plex.info('danger', `Recargo Duplicado. Los datos ingresados no podran ser almacenados.`);
    }

}