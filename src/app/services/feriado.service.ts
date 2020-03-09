// import { Observable } from 'rxjs/Observable';
// import { Injectable } from '@angular/core';

// import { Server } from '@andes/shared';
// import { Feriado } from '../models/Feriado';

// @Injectable()
// export class FeriadoService {
//     private baseUrl = '/modules/ausentismo/feriados'; // URL to web api
    
//     constructor(private server: Server) { }

//     search(params?: any): Observable<Feriado[]> {
//         const url = `${this.baseUrl}/search`; 
//         return this.server.get(url, { params: params, showError: true });
//     }

//     get(params?: any): Observable<Feriado[]> {
//         return this.server.get(this.baseUrl, { params: params, showError: true });
//     }

//     getAsEventos(params?: any): Observable<any[]> {
//         const url = `${this.baseUrl}/eventos`; 
//         return this.server.get(url, { params: params, showError: true });
//     }

//     getByID(feriadoId?: any): Observable<Feriado> {
//         const url = `${this.baseUrl}/${feriadoId}`;
//         return this.server.get(url);
//     }

//     post(object: Feriado): Observable<Feriado> {
//         return this.server.post(this.baseUrl, object);
//     }

//     put(object: Feriado): Observable<Feriado> {
//         const url = `${this.baseUrl}/${object._id}`;
//         return this.server.put(url, object);
//     }

// }
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