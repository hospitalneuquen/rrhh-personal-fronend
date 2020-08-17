import { Injectable } from '@angular/core';

@Injectable()
export class MenuService {

    getMenuItems(menuKey:string){
        return this.menuItems[menuKey];
    }


    private menuConfiguracion = [
        {
            titulo:'Feriados',
            subtitulo:'Configuración',
            url:'/configuracion/feriados',
            icono:'mdi-account-multiple-outline',
        }, 
        {
            titulo: 'Artículos',
            subtitulo:'Configuración',
            url:'/configuracion/articulos',
            icono:'mdi-account-multiple-outline'
        }, 
        { 
            titulo: 'Situación Laboral',
            subtitulo:'Configuracion',
            url:'/configuracion/situaciones',
            icono:'mdi-account-multiple-outline'
        },
        { 
            titulo: 'Periodos Guardia',
            subtitulo:'Configuracion',
            url:'/configuracion/guardia-periodos',
            icono:'mdi-account-multiple-outline'
        },
        { 
            titulo: 'Lotes Guardias',
            subtitulo:'Configuracion',
            url:'/configuracion/guardia-lotes',
            icono:'mdi-account-multiple-outline'
        },
        { 
            titulo: 'Regimen Horarios',
            subtitulo:'Configuracion',
            url:'/configuracion/regimen-horarios',
            icono:'mdi-account-multiple-outline'
        },
        { 
            titulo: 'Licencias Periodos',
            subtitulo:'Configuracion',
            url:'/configuracion/licencia-periodos',
            icono:'mdi-account-multiple-outline'
        }
    ]


    private menuPartes = [
        {
            titulo: 'Partes Recibidos',
            subtitulo: 'Partes',
            url: '/partes/recibidos',
            icono: 'mdi-account-multiple-outline',
            color: 'color-violeta'
        }, 
        {
            titulo: 'Partes Diarios',
            subtitulo: 'Partes',
            url: '/partes/agentes',
            icono: 'mdi-account-multiple-outline',
            color: 'color-violeta'
        }, 
        { 
            titulo: 'Ingresos y Egresos',
            subtitulo: 'Partes',
            url: '/partes/reportes/fichadas',
            icono: 'mdi-account-multiple-outline',
            color: 'color-violeta'
        },
        { 
            titulo: 'Partes Diarios por Agente',
            subtitulo: 'Partes',
            url: '/partes/reportes/partes',
            icono: 'mdi-account-multiple-outline',
            color: 'color-violeta'
        }
    ]

    private menuPrincipal = [
        {
            titulo:'Agentes',
            subtitulo:'',
            detalle:'',
            url:'/agentes',
            icono:'mdi-account-multiple-outline',
            color:'color-celeste',
            style:'solid',
            permiso: 'agentes:view_agente'
        }, 
        {
            titulo: 'Partes',
            subtitulo:'',
            detalle:'',
            url:'/partes',
            icono:'mdi-clock',
            color:'color-violeta',
            style:'solid',
            permiso: 'partes:view_parte'
        }, 
        { 
            titulo: 'Guardias',
            subtitulo:'',
            detalle:'',
            url:'/guardias',
            icono:'mdi-calendar',
            color:'color-rosa',
            style:'solid',
            permiso: 'guardias:view_guardia'
        },
        { 
            titulo: 'Reportes',
            subtitulo:'',
            detalle:'',
            url:'/reportes',
            icono:'mdi-file-pdf',
            color:'color-amarillo',
            style:'solid',
            permiso: 'reportes:view_reporte'
        },
        { 
            titulo: 'Configuración',
            subtitulo:'',
            detalle:'',
            url:'/configuracion',
            icono:'mdi-settings',
            color:'color-verde',
            style:'solid',
            permiso: 'config:view_config'
        }
    ]

    private menuItems = {
        configuracion : this.menuConfiguracion,
        partes: this.menuPartes,
        principal: this.menuPrincipal

    }
}