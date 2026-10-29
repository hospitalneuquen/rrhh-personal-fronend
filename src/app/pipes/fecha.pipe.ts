import { Pipe, PipeTransform } from '@angular/core';

/**
 * Implementa un pipe de fecha u hora utilizando moment.js
 *
 * @export
 * @class FechaPipe
 * @implements {PipeTransform}
 */
@Pipe({ name: 'fecha' })
export class FechaPipe implements PipeTransform {
    transform(value: any, arg1: string): any {
        if ( value ){
            if (arg1) {
                
                if (arg1 === 'diahora') return moment(value).utc().format('ddd DD/MM/YYYY HH:mm');
                if (arg1 === 'utc') return moment(value).utc().format('DD/MM/YYYY');
                if (arg1 === 'dia') return moment(value).utc().format('dddd');
                if (arg1 === 'diasmall') return moment(value).utc().format('dd');
                if (arg1 === 'diames') return moment(value).utc().format('DD/MM');
                if (arg1 === 'duracion') return this.duracion(value);
            } else {
                return moment(value).format('DD/MM/YYYY');
            }
        }
        else {
            return "---";
        }
        
    }

    duracion(milisegundos){
        const tempTime = moment.duration(milisegundos);
        return tempTime.hours() + "hs. " + tempTime.minutes() + "min. ";
    }
}
