export class Nota {
    _id: String;
    agente: { 
        _id: String,
        nombre: String,
        apellido: String
    };
    updatedAt: Date;
    usuario: any;
    titulo: String;
    detalle: String;

    constructor(nota?){
        nota = nota || {};
        this._id = nota._id || null;
        this.agente = nota.agente || null;
        this.updatedAt = nota.updatedAt;
        this.usuario = nota.usuario || null;
        this.titulo = nota.titulo || '';
        this.detalle = nota.detalle || '';
    }
}

