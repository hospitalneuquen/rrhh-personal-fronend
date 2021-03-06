import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Server } from '@andes/shared';

import { Feriado } from '../models/Feriado';
import { GenericService } from './generic.service';


@Injectable()
export class FeriadoService extends GenericService<Feriado> {
    constructor(protected server: Server) { 
        super(server, '/modules/ausentismo/feriados')
    }

    getAsEventos(params?: any): Observable<any[]> {
        const url = `${this.url}/eventos`; 
        return this.server.get(url, { params: params, showError: true });
    }
}