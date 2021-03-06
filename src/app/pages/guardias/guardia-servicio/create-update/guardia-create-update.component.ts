import 'rxjs/add/operator/toPromise';

import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Plex } from '@andes/plex';

import  *  as formUtils from 'src/app/utils/formUtils';
import { GuardiaFormComponent } from './form/guardia-form.component';

import { ModalService } from 'src/app/services/modal.service';
import { GuardiaService } from 'src/app/services/guardia.service';
import { GuardiaLoteService } from 'src/app/services/guardia-lote.service';

import { Agente } from 'src/app/models/Agente';
import { Guardia, ItemGuardiaPlanilla } from 'src/app/models/Guardia';
import { GuardiaPeriodo } from 'src/app/models/GuardiaPeriodos';


@Component({
    selector: 'app-guardia-create-update',
    templateUrl: './guardia-create-update.html'
  })
export class GuardiaCreateUpdateComponent implements OnInit {
    @ViewChild("guardiaForm") guardiaForm: GuardiaFormComponent;

    public isEditable = true;
    public guardia: Guardia;
    public generandoPlanilla: Boolean; // Bandera

    public get agenteSearchParams() {
        return this._extraSearchParams;
    }

    // Permisos
    public get puedeProcesar():Boolean{
        return (this.guardia && this.guardia.estado == '1');
    } 
    public get puedeGuardar():Boolean{
        return (this.guardia && !this.guardia.estado || this.guardia.estado == '0');
    }

    public get puedeConfirmar():Boolean{
        return this.puedeGuardar;
    }

    public get puedeAgregarAgente():Boolean{
        return (this.guardia && !this.guardia.estado || this.guardia.estado == '0' || this.guardia.estado == '1');
    }

    public get puedeEditarPlanilla():Boolean{
        return this.puedeAgregarAgente;
    }


    /**
     * Contiene los valores reales de los parametros extras a utilizar
     * en el componente de busqueda de agentes. Se completa al momento
     * de tener disponibles los datos del formulario del encabezado.
     */
    private _extraSearchParams:any; 
    
    private _objectID:any; // To keep track of object on update

    private agentesSeleccionados = []; // 

    constructor(
        private route: ActivatedRoute,
        protected location: Location,
        private plex: Plex,
        private guardiaService: GuardiaService,
        private guardiaLoteService: GuardiaLoteService,
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
        this.guardia = new Guardia();
    }

    private prepareDataForUpdate(){
        this.isEditable = false;
        this.guardiaService.getByID(this._objectID)
            .subscribe(data => {
                this.guardia = new Guardia(data);
                // Actualizamos los agentes seleccionados. Este paso solo
                // es para evitar cargar agentes previamente cargados
                for (const item of this.guardia.planilla) {
                    this.agentesSeleccionados.push(item.agente);   
                }
                // Verificamos si la guardia es editable
                if (this.guardia.estado == '0') this.isEditable = true;
            })
    }
    
    private remoteItemFromList(list, item){
        return list.filter(elem => elem._id != item._id);
    }

    public onRemoveItemPlanilla(item){
        this.agentesSeleccionados = this.remoteItemFromList(this.agentesSeleccionados, item.agente);
    }

    /**
     * Metodo que se ejecuta ante los cambios realizados en el formulario del
     * encabezado. Todos los cambios impactan sobre el modelo guardia (this.guardia)
     * Si la planilla ya tenia informacion cargada sobre algun agente entonces
     * la misma se pierde ya que hay que regenerar la planilla si el usuario 
     * confirma los cambios.
     *  
     * @param newValue unicamente tiene informacion del ultimo campo modificado
     */
    public async onChangedGuardiaForm(newValue:any){
        if (this.guardia.planilla.length > 0 ){
            this.plex.confirm(
                `Se van perder los datos ingresados en la planilla.
                ¿Desea Continuar?`)
                .then( confirm => {
                    if (confirm){
                        this.actualizarGuardia(newValue);
                    }
                    else{
                        // El usuario canceló el cambio
                        // Hacemos un rollback de los cambios realizados al form
                        this.guardiaForm.form.patchValue(
                            {
                                periodo : this.guardia.periodo,
                                lote: this.guardia.lote,
                            },
                            { emitEvent: false }); // Prevent infinite loop
                    }
            });
        }
        else{
            this.actualizarGuardia(newValue);
            await this.isGuardiaUnique();
        }
    }

    
    private actualizarGuardia(changedValue:any){
        this.guardia.planilla = [];
        if ('periodo' in changedValue) {
            this.generandoPlanilla = true;
            // Creamos una nueva instancia del periodo para regenerar el 
            // rango de fechas nuevamente.
            this.guardia.periodo = new GuardiaPeriodo(changedValue.periodo); 
        }
        else{
            // Actualizamos los datos del lote de la guardia con el valor ingresado
            this.guardia.lote = changedValue['lote'];
        }
        window.setTimeout(() => {
            this.generandoPlanilla = false;
       }, 500);
    }

    private async isGuardiaUnique(){
        if (this.guardia.lote && this.guardia.lote._id){
            const guardiaExistente = await this.findGuardia();
            if (guardiaExistente && !this._objectID ){
                this.infoGuardiaDuplicada();
                return false;
            }

            if (guardiaExistente && this._objectID && guardiaExistente._id != this._objectID){
                this.infoGuardiaDuplicada();
                return false;
            }
            return true;
        }

    }

    /**
     * Valida que esten presentes todos los datos del formulario.
     */
    private async isGuardiaFormValid(){
        const form = this.guardiaForm.form;
        if (form.invalid){
            formUtils.markFormAsInvalid(form);
            this.plex.info('danger', 'Debe completar todos los datos obligatorios del encabezado');
            return false;
        }
        return true;
    }

    /**
     * Helper method. Se uttiliza para buscar guardias duplicadas
     */
    private async findGuardia(){
        const searchParams = {
            'periodo._id': this.guardia.periodo._id,
            'lote._id': this.guardia.lote._id,
        } 
        const response = await this.guardiaService.get(searchParams).toPromise();
        return (response.length)? response[0]:null;        
    }

    /**
     * Abre un modal con el componente de seleccion de agentes.El agente
     * que se selecciona se incorporara luego a la planilla de guardias.
     * Los agentes a mostrar para seleccionar NO deben estar restringidos a 
     * los datos que se hayan ingresado en el encabezado 
     */
    public async onAddAgente(){
        const form = this.guardiaForm.form;
        if ( await this.isGuardiaFormValid()) {
            this._extraSearchParams = {
                'situacionLaboral.cargo.servicio.ubicacion': form.value.lote.servicio.codigo,
                'situacionLaboral.cargo.agrupamiento._id': form.value.lote.categoria._id,
                'activo': true
            }
            this.modalService.open('modal-add-agente');
        }
    }

    /**
     * Una vez seleccionado el/los agentes se crea una/s instancia/s de
     * ItemGuardiaPlanilla para agregar al listado general de guardias.
     * La instancia es importante porque contiene la logica necesaria que
     * contabiliza los dias de guardia del agente.
     */
    public onAddAgenteSelected(agentes:Agente[]){
        this.agentesSeleccionados = this.agentesSeleccionados.concat(agentes);
        agentes.forEach(agente => {
            if (!this.guardia.planilla.some(e => e.agente._id === agente._id)){
                // Si el agente seleccionado aun no pertenece a la planilla
                // lo incorporamos
                this.guardia.planilla.push( new ItemGuardiaPlanilla({
                    agente: 
                        {
                            _id: agente._id,
                            nombre: agente.nombre,
                            apellido: agente.apellido,
                            numero: agente.numero
                        },
                    diasGuardia: [],
                    totalDias: 0
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
     * Al momento de guardar verificamos si corresponde guardar una nueva 
     * guardia, o guardar una guardia existente que ha sido modificada.
     */
    public async onGuardar(){
        if (await this.isGuardiaFormValid() && await this.isGuardiaUnique()){
            return this._objectID? this.updateGuardia('guardar'): this.addGuardia('guardar');
        }
        
    }

    /**
     * Idem que guardar pero con la accion 'Confirmar'
     */
    public async onConfirmar(){
        if (await this.isGuardiaFormValid() && await this.isGuardiaUnique()){
            this.plex.confirm(`Al confirmar se habilita al Dpto. de Gestión de Personal
                a realizar las validaciones correspondientes para su aprobación final.
                Durante esta etapa no podrá volver a editar la información ingresada.`)
            .then( confirm => {
                if (confirm) return this._objectID? this.updateGuardia('confirmar'): this.addGuardia('confirmar');
            });
        }
    }

    public async onProcesar(){
        if (await this.isGuardiaFormValid()){
            return this.updateGuardia('validar');
        }
    }

    public onCerrar(){
        this.location.back();
    }

    /**
     * Al momento de crear una guardia se puede simplemente 'guardar' para
     * continuar posteriormente su edicion o se puede 'confirmar' para asi
     * dar un cierre a la misma y permitir los controles que deben realizar
     * otros sectores.
     * 
     * @param actionType  'guardar', 'confirmar'
     */
    private addGuardia(actionType:String){
        if (actionType == 'guardar'){
            this.guardiaService.post(this.guardia)
                .subscribe( guardia => {
                    this.infoGuardarOk(guardia);
                })
        }
        else { // type == 'confirmar'
            this.guardiaService.postAndConfirmar(this.guardia)
                .subscribe( guardia => {
                    this.infoConfirmarOk(guardia);
                })
        }
    }

    
     /**
     * Idem addGuardia
     * 
     * @param actionType  'guardar', 'confirmar', 'validar'
     */
    private updateGuardia(actionType:String){
        switch (actionType){
            case 'guardar':
                this.guardiaService.put(this.guardia)
                    .subscribe( guardia => {
                        this.infoGuardarOk(guardia);
                    });
                break;
            case 'confirmar':
                this.guardiaService.putAndConfirmar(this.guardia)
                    .subscribe( guardia => {
                        this.infoConfirmarOk(guardia);
                    });
                break;
            case 'validar':
                this.guardiaService.putAndProcesar(this.guardia)
                    .subscribe( guardia => {
                        this.infoProcesarOk(guardia);
                    });
                break;
        }
    }

    private infoGuardarOk(guardia){
        this.plex
            .info('success', `Guardia Sin Confirmar guardada correctamente. 
                    Puede continuar editando la información ingresada hasta
                    confirmar definitivamente los datos para ser evaluados 
                    por el Dpto. de Gestión de Personal.`)
            .then( confirm => {
                this.location.back();
            });
    }

    private infoConfirmarOk(guardia){
        this.plex
            .info('success', `Guardia guardada y confirmada correctamente.`)
            .then( confirm => { 
                this.location.back();
            });
    }

    private infoProcesarOk(guardia){
        this.plex
            .info('success', `Guardia procesada correctamente.`)
            .then( confirm => {
                this.location.back();
            });
    }

    private infoGuardiaDuplicada(){
        this.plex.info('danger', `Guardia Duplicada. Los datos ingresados no podran ser almacenados.`);
    }

}