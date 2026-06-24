import { OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Plex } from '@andes/plex';
import { BehaviorSubject } from 'rxjs'

import  *  as formUtils from 'src/app/utils/formUtils';

import { ObjectService } from 'src/app/services/tm/object.service';
import { FormGroupDirective, FormGroup, FormBuilder } from '@angular/forms';


export abstract class ABMCreateUpdateComponent implements OnInit {

    titulo;
    get subtitulo(){
        let value = ""
        if(this.object){
            value = (this.object._id)? 'Editar':'Alta';
        }
        return value;
    }
    protected modelName:String = "";
    protected _objectID:any;
    protected _object = new BehaviorSubject(null);
    readonly object$ = this._object.asObservable();

    public get object(){
        return this._object.getValue();
    }
    
    public set object(val){
        this._object.next(val);
    }

    public form: FormGroup;

    @ViewChild(FormGroupDirective) _form;
    
    
    constructor
    (
        protected router: Router,
        protected route: ActivatedRoute,
        protected location: Location,
        protected plex: Plex,
        protected formBuilder: FormBuilder,
        protected objectService: ObjectService

    ){}

    public ngOnInit() {
        // Cuando este disponible el objeto inicializamos el form
        this.object$.subscribe(data => { 
            if (data) {
                this.form = this.initForm();
                this.patchDateFormFields();
            }
        } );
       
        // Preparacion del objeto para editar o crear
        this.route.paramMap.subscribe((params: ParamMap) => {
            this._objectID = params.get(this.paramIdName);
            if (this._objectID){
                this.prepareDataForUpdate();
            }
            else{
                this.prepareDataForCreate();
            }
        });
    }

    /**
     * Override this method if required
     */
    protected patchDateFormFields(){
        formUtils.patchFormDates(this.form);
    }

    protected get paramIdName(){
        return 'id';
    }

    protected prepareDataForUpdate(){
        this.objectService.getByID(this.dataService, this._objectID).subscribe((data) => {
            if (data){
                this.object = data;
            } else {
                this.plex.info('info', 'El objeto que desea editar no existe!')
                    .then( e => {
                        this.location.back();
                });
            }
        });
    }

    protected prepareDataForCreate(){
        this.object = {};
    }

    protected abstract initForm():FormGroup;

    protected abstract get dataService();

    protected additionalFormInitialize() {}
    
    public invalid(){
        formUtils.markFormAsInvalid(this.form);
        return this.form.invalid 
    }

    public onSave(){
        if (this.invalid()) return;
        const object = this.form.value;
        if (this.object._id){
            this.update(object);
        }
        else{
            this.add(object);
        }
    }
    
    protected update(object){
        let objToUpdate = this.preUpdate(object);
        this.objectService.put(this.dataService, objToUpdate)
            .subscribe(
                data => {
                    formUtils.resetForm(this.form, this._form);
                    this.onSuccess(data);
                },
                error => this.onError(error)
            );
    }

    protected add(object){
        let objToAdd = this.preAdd(object);
        this.objectService.post(this.dataService, objToAdd)
            .subscribe(
                data=> {
                    formUtils.resetForm(this.form, this._form);
                    this.onSuccess(data);
                },
                error => this.onError(error)
            );
    }

    /**
     * Hook para realizar tareas extras sobre el objeto a 
     * actualizar
     */
    protected preUpdate(object){
        return object;
    }

    /**
     * Hook para realizar tareas extras sobre el objeto a 
     * crear
     */
    protected preAdd(object){
        return object;

    }

    public onCancel(){
        this.location.back();
    }

    public onSuccess(obj:any){
        this.location.back();
    }

    public onError(obj:any){
    }
//para ver 
    public onHistoria(){
        if (!this.modelName) return; // Alertar mal configurado
        this.router.navigate(['/historia', this.modelName, this._objectID]);
        
    }

}