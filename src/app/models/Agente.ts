import { Direccion } from "./Direccion";
import { Contacto } from "./Contacto";
import { Educacion } from "./Educacion";
import { IPais } from "./IPais";
import { EstadoCivil, Sexo, Genero } from "./enumerados";
import { SituacionLaboral } from "./SituacionLaboral";
import { localDate } from "src/app/utils/dates";

export class Agente {
    _id: String;
    numero: String; // En el alta aun no esta disponible este dato
    tipoDocumento: String; // No deberia utilizarse mas. Solo DU
    documento: String;
    cuil: String;
    nombre: String;
    apellido: String;
    estadoCivil: EstadoCivil;
    nacionalidad: IPais;
    sexo: Sexo;
    genero: Genero;
    fechaNacimiento: Date;
    direccion: Direccion;
    contactos: Contacto[];
    educacion: Educacion[];
    // especialidad: EspecialidadSchema; // TODO Ver especialidadSchema
    situacionLaboral: SituacionLaboral;
    historiaLaboral: any[];
    foto: String;
    codigoFichado: String;
    activo: Boolean;

    get nombreCompleto() {
        return `${this.apellido}, ${this.nombre}`;
    }

    constructor(agente?) {
        agente = agente || {};
        this.activo = agente.activo;
        this._id = agente._id || null;
        this.numero = agente.numero || "";
        this.documento = agente.documento || "";
        this.cuil = agente.cuil || "";
        this.nombre = agente.nombre || "";
        this.apellido = agente.apellido || "";
        this.estadoCivil = agente.estadoCivil
            ? typeof agente.estadoCivil === "string"
                ? agente.estadoCivil
                : agente.estadoCivil.id
            : null;
        this.sexo = agente.sexo
            ? typeof agente.sexo === "string"
                ? agente.sexo
                : agente.sexo.id
            : null;
        this.genero = agente.genero
            ? typeof agente.genero === "string"
                ? agente.genero
                : agente.genero.id
            : null;
        this.fechaNacimiento = localDate(agente.fechaNacimiento);
        // this.foto = agente.foto || null;
        this.nacionalidad = agente.nacionalidad || null;
        this.direccion = new Direccion(agente.direccion);
        this.contactos = [];
        if (agente.contactos) {
            agente.contactos.forEach((e) => {
                this.contactos.push(new Contacto(e));
            });
        }
        this.educacion = [];
        if (agente.educacion) {
            agente.educacion.forEach((e) => {
                this.educacion.push(new Educacion(e));
            });
        }
        this.situacionLaboral = new SituacionLaboral(agente.situacionLaboral);
        this.historiaLaboral = [];

        if (agente.historiaLaboral) {
            agente.historiaLaboral.forEach((e) => {
                this.historiaLaboral.push(e);
            });
        }
    }

    get situacionLaboralActiva(): SituacionLaboral {
        if (this.historiaLaboral.length) {
            return this.historiaLaboral.filter((x) => !x.inactivo)[0];
        } else {
            return new SituacionLaboral();
        }
    }
}
