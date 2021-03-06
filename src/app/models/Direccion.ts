import { Localidad } from "./Localidad";

export class Direccion {
    _id: String;
    valor: String;
    codigoPostal: String;
    barrio: String;
    localidad: Localidad;
    ranking: Number;
    geoReferencia: [Number];
    ultimaActualizacion: Date;
    // Info extra complementaria
    calleIzquierda: String;
    calleDerecha: String;
    calleParalela: String;
    complementarios: String;

    constructor(direccion?) {
        direccion = direccion || {};
        this._id = direccion._id || null;
        this.valor = direccion.valor || "";
        this.codigoPostal = direccion.codigoPostal || "";
        this.barrio = direccion.barrio || "";
        this.localidad = direccion.localidad;
        this.calleIzquierda = direccion.calleIzquierda || "";
        this.calleDerecha = direccion.calleDerecha || "";
        this.calleParalela = direccion.calleParalela || "";
        this.complementarios = direccion.complementarios || "";
    }
}
