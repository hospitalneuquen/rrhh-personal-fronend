import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPage } from "./pages/login/login.page";
import { LogoutComponent } from "src/app/pages/logout/logout.component";
import { RoutingGuard, RoutingNavBar } from "./app-guard";

// Components
import { AgenteRegistroComponent } from "../app/modules/agente/pages/registro/agente-registro.component";
import { AgenteSearchComponent } from "./modules/agente/pages/search/agente-search.component";
import { AgenteMultipleSelectionListComponent } from './modules/agente/pages/credencial/list/agente-multiple-selection-list.component';

import { AusentismoSearchComponent } from "./pages/ausentismo/search/ausentismo-search.component";
import { AusentismoCargaComponent } from "./pages/ausentismo/create-update/ausentismo-carga.component";
import { AusentismoIndicadoresComponent } from "./pages/ausentismo/indicadores/ausentismo-indicadores.component";

import { ReporteSearchComponent } from "./pages/reportes/reporte-search.component";

import { ParteListComponent } from "./pages/partes/parte/list/parte-list.component";
import { ParteAgenteListComponent } from "src/app/pages/partes/parte-agente/list/parte-agente-list.component";
import { ParteAgenteListViewComponent } from "src/app/pages/partes/parte-agente/list-view/parte-agente-list-view.component";
import { ParteReporteListComponent } from "./pages/partes/reportes/partes/reporte-parte-list.component";
import { FichadaReporteListComponent } from "src/app/pages/partes/reportes/fichadas/reporte-fichada-list.component";

import { GuardiaCreateUpdateComponent } from "./pages/guardias/guardia-servicio/create-update/guardia-create-update.component";
import { GuardiaListComponent } from "src/app/pages/guardias/guardia-servicio/list/guardia-list.component";

import { RecargoListComponent } from './pages/recargos/list/recargo-list.component';
import { RecargoCreateUpdateComponent } from './pages/recargos/create-update/recargo-create-update.component';

import { HoraExtraListComponent } from './pages/horas-extras/list/hora-extra-list.component';
import { HoraExtraCreateUpdateComponent } from './pages/horas-extras/create-update/hora-extra-create-update.component';

// Menus pages
import { AgenteAusentismoComponent } from "./pages/ausentismo/agente-ausentismo.component";
import { HomeMenuPageComponent } from "src/app/pages/home/home-menu.page";
import { ConfiguracionMenuPageComponent } from "src/app/pages/home/configuracion-menu.page";
import { PartesMenuPageComponent } from "src/app/pages/home/partes-menu.page";
import { SeguridadMenuPageComponent } from 'src/app/pages/home/seguridad-menu.page';

// TM
import { FeriadoListComponent } from "./modules/tm/components/feriados/list/feriado-list.component";
import { FeriadoCreateUpdateComponent } from "./modules/tm/components/feriados/create-update/feriado-create-update.component";

import { SituacionListComponent } from "./modules/tm/components/situacion/list/situacion-list.component";
import { SituacionCreateUpdateComponent } from "src/app/modules/tm/components/situacion/create-update/situacion-create-update.component";

import { ArticuloListComponent } from "./modules/tm/components/articulo/list/articulo-list.component";
import { ArticuloCreateUpdateComponent } from "src/app/modules/tm/components/articulo/create-update/articulo-create-update.component";

import { GuardiaPeriodoListComponent } from "src/app/modules/tm/components/guardia-periodos/list/guardia-periodo-list.component";
import { GuardiaPeriodoCreateUpdateComponent } from "src/app/modules/tm/components/guardia-periodos/create-update/guardia-periodo-create-update.component";
import { GuardiaLotesListComponent } from "src/app/modules/tm/components/guardia-lotes/list/guardia-lotes-list.component";
import { GuardiaLotesCreateUpdateComponent } from "src/app/modules/tm/components/guardia-lotes/create-update/guardia-lotes-create-update.component";

import { RecargoTurnoListComponent } from './modules/tm/components/recargo-turnos/list/recargo-turno-list.component';
import { RecargoTurnoCreateUpdateComponent } from './modules/tm/components/recargo-turnos/create-update/recargo-turno-create-update.component';
import { RecargoJustificacionListComponent } from './modules/tm/components/recargo-justificacion/list/recargo-justificacion-list.component';
import { RecargoJustificacionCreateUpdateComponent } from './modules/tm/components/recargo-justificacion/create-update/recargo-justificacion-create-update.component';

import { RegimenHorarioListComponent } from "src/app/modules/tm/components/regimen-horario/list/regimen-horario-list.component";
import { RegimenHorarioCreateUpdateComponent } from "src/app/modules/tm/components/regimen-horario/create-update/regimen-horario-create-update.component";

import { LicenciaPeriodoListComponent } from "src/app/modules/tm/components/licencia-periodo/list/licencia-periodo-list.component";
import { LicenciaPeriodoCreateUpdateComponent } from "src/app/modules/tm/components/licencia-periodo/create-update/licencia-periodo-create-update.component";

import { PuestoListComponent } from './modules/tm/components/puesto/list/puesto-list.component';
import { PuestoCreateUpdateComponent } from './modules/tm/components/puesto/create-update/puesto-create-update.component';
import { SubPuestoListComponent } from './modules/tm/components/subpuesto/list/subpuesto-list.component';
import { SubPuestoCreateUpdateComponent } from './modules/tm/components/subpuesto/create-update/subpuesto-create-update.component';
import { PaisListComponent } from './modules/tm/components/pais/list/pais-list.component';
import { PaisCreateUpdateComponent } from './modules/tm/components/pais/create-update/pais-create-update.component';


// Seguridad
import { UsuarioListComponent } from "src/app/pages/seguridad/usuario/list/usuario-list.component";
import { UsuarioCreateUpdateComponent } from "src/app/pages/seguridad/usuario/create-update/usuario-create-update.component";

import { RolListComponent } from 'src/app/pages/seguridad/rol/list/rol-list.component';
import { RolCreateUpdateComponent } from 'src/app/pages/seguridad/rol/create-update/rol-create-update.component';

import { AuditListComponent } from "src/app/components/audit/list/audit-list.component";
import { NgxPermissionsGuard } from "ngx-permissions";


const routes: Routes = [
    // Inicio
    {
        path: "inicio",
        component: HomeMenuPageComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    // Audit/History
    {
        path: "historia/:model/:id",
        component: AuditListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "historia/:model",
        component: AuditListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    // Tablas maestras
    {
        path: "configuracion",
        component: ConfiguracionMenuPageComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/articulos",
        component: ArticuloListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/articulos/crear",
        component: ArticuloCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/articulos/editar/:id",
        component: ArticuloCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    {
        path: "configuracion/situaciones",
        component: SituacionListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/situaciones/crear",
        component: SituacionCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/situaciones/editar/:id",
        component: SituacionCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    {
        path: "configuracion/feriados",
        component: FeriadoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/feriados/crear",
        component: FeriadoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/feriados/editar/:id",
        component: FeriadoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    {
        path: "configuracion/guardia-periodos",
        component: GuardiaPeriodoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/guardia-periodos/crear",
        component: GuardiaPeriodoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/guardia-periodos/editar/:id",
        component: GuardiaPeriodoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    {
        path: "configuracion/regimen-horarios",
        component: RegimenHorarioListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/regimen-horarios/crear",
        component: RegimenHorarioCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/regimen-horarios/editar/:id",
        component: RegimenHorarioCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    {
        path: "configuracion/guardia-lotes",
        component: GuardiaLotesListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/guardia-lotes/crear",
        component: GuardiaLotesCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/guardia-lotes/editar/:id",
        component: GuardiaLotesCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    // Configuracion Recargos
    {
        path: "configuracion/recargo-turnos",
        component: RecargoTurnoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/recargo-turnos/crear",
        component: RecargoTurnoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/recargo-turnos/editar/:id",
        component: RecargoTurnoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/recargo-justificaciones",
        component: RecargoJustificacionListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/recargo-justificaciones/crear",
        component: RecargoJustificacionCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/recargo-justificaciones/editar/:id",
        component: RecargoJustificacionCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },


    {
        path: "configuracion/licencia-periodos",
        component: LicenciaPeriodoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/licencia-periodos/crear",
        component: LicenciaPeriodoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/licencia-periodos/editar/:id",
        component: LicenciaPeriodoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    // Configuracion Puestos
    {
        path: "configuracion/puestos",
        component: PuestoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/puestos/crear",
        component: PuestoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/puestos/editar/:id",
        component: PuestoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

     // Configuracion SubPuestos
    {
        path: "configuracion/subpuestos",
        component: SubPuestoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/subpuestos/crear",
        component: SubPuestoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/subpuestos/editar/:id",
        component: SubPuestoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

     // Configuracion Paises
     {
        path: "configuracion/paises",
        component: PaisListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/paises/crear",
        component: PaisCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "configuracion/paises/editar/:id",
        component: PaisCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    // Reportes
    {
        path: "reportes",
        component: ReporteSearchComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    // Usuarios
    {
        path: "seguridad",
        component: SeguridadMenuPageComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ["seguridad:usuario:view_usuario", "seguridad:rol:view_rol",],
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "seguridad/usuarios",
        component: UsuarioListComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: ["seguridad:usuario:view_usuario"],
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "seguridad/usuarios/crear",
        component: UsuarioCreateUpdateComponent,
        // canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        // data: {
        //     permissions: {
        //         only: ["seguridad:view_usuario"],
        //         redirectTo: "/inicio",
        //     },
        // },
    },
    {
        path: "seguridad/usuarios/editar/:id",
        component: UsuarioCreateUpdateComponent,
        // canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        // data: {
        //     permissions: {
        //         only: ["seguridad:view_usuario"],
        //         redirectTo: "/inicio",
        //     },
        // },
    },

    {
        path: "seguridad/roles",
        component: RolListComponent,
        // canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        // data: {
        //     permissions: {
        //         only: ["seguridad:usuario:view_usuario"],
        //         redirectTo: "/inicio",
        //     },
        // },
    },
    {
        path: "seguridad/roles/crear",
        component: RolCreateUpdateComponent,
        // canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        // data: {
        //     permissions: {
        //         only: ["seguridad:view_usuario"],
        //         redirectTo: "/inicio",
        //     },
        // },
    },
        {
        path: "seguridad/roles/editar/:id",
        component: RolCreateUpdateComponent,
        // canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        // data: {
        //     permissions: {
        //         only: ["seguridad:view_usuario"],
        //         redirectTo: "/inicio",
        //     },
        // },
    },

    // Partes
    {
        path: "partes",
        component: PartesMenuPageComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: [
                    "partes:parte:add_parte",
                    "partes:parte:procesar_parte",
                    "partes:reporte:fichadas",
                    "partes:reporte:partes",
                ],
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "partes/recibidos",
        component: ParteListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
        // canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        // data: {
        //     permissions: {
        //         only: "partes:parte:procesar_parte",
        //         redirectTo: "/inicio",
        //     },
        // },
    },
    {
        path: "partes/recibidos/:id/agentes",
        component: ParteAgenteListViewComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "partes:parte:procesar_parte",
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "partes/agentes",
        component: ParteAgenteListComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "partes:parte:add_parte",
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "partes/reportes/partes",
        component: ParteReporteListComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "partes:reporte:partes",
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "partes/reportes/fichadas",
        component: FichadaReporteListComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "partes:reporte:fichadas",
                redirectTo: "/inicio",
            },
        },
    },

    // Guardias
    {
        path: "guardias",
        component: GuardiaListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "guardias/crear",
        component: GuardiaCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "guardias/editar/:id",
        component: GuardiaCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "guardias/procesar/:id",
        component: GuardiaCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    // Recargos
    {
        path: "recargos",
        component: RecargoListComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: [
                    "recargos:recargo:view_recargo",
                    "recargos:recargo:add_recargo",
                    "recargos:recargo:procesar_recargo",
                ],
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "recargos/crear",
        component: RecargoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "recargos/editar/:id",
        component: RecargoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "recargos/procesar/:id",
        component: RecargoCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

     // Horas Extras
    {
        path: "horasextras",
        component: HoraExtraListComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: [
                    "horas_extras:hora_extra:view_hora_extra",
                    "horas_extras:hora_extra:add_hora_extra",
                    "horas_extras:hora_extra:procesar_hora_extra",
                ],
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "horasextras/crear",
        component: HoraExtraCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "horasextras/editar/:id",
        component: HoraExtraCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "horasextras/procesar/:id",
        component: HoraExtraCreateUpdateComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    // Agentes Busqueda y Registro
    {
        path: "agentes/credenciales",
        component: AgenteMultipleSelectionListComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },

    {
        path: "agentes",
        component: AgenteSearchComponent,
        canActivate: [RoutingNavBar, RoutingGuard],
    },
    {
        path: "agentes/registro",
        component: AgenteRegistroComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "agentes:agente:add_agente",
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "agentes/registro/:id",
        component: AgenteRegistroComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "agentes:agente:view_agente",
                redirectTo: "/inicio",
            },
        },
    },
    {
        path: "agentes/:agenteId/ausentismo",
        component: AgenteAusentismoComponent,
        canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
        data: {
            permissions: {
                only: "agentes:ausentismo:view_ausentismo",
                redirectTo: "/inicio",
            },
        },
        children: [
            {
                path: "",
                redirectTo: "listado",
                pathMatch: "full",
            },
            {
                path: "listado",
                component: AusentismoSearchComponent,
            },
            {
                path: "agregar",
                component: AusentismoCargaComponent,
                canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: "agentes:ausentismo:add_ausentismo",
                        redirectTo: "/inicio",
                    },
                },
            },
            {
                path: "indicadores",
                component: AusentismoIndicadoresComponent,
                canActivate: [RoutingNavBar, RoutingGuard],
            },
            {
                path: ":ausentismoId/editar",
                component: AusentismoCargaComponent,
                canActivate: [RoutingNavBar, RoutingGuard, NgxPermissionsGuard],
                data: {
                    permissions: {
                        only: "agentes:ausentismo:change_ausentismo",
                        redirectTo: "/inicio",
                    },
                },
            },
        ],
    },

    { path: "login", component: LoginPage, canActivate: [RoutingNavBar] },
    {
        path: "logout",
        component: LogoutComponent,
        canActivate: [RoutingNavBar],
    },

    // Ruteos hijos
    // { path: 'inicio', component: HomePage,
    //     canActivate: [RoutingNavBar , RoutingGuard],
    //     children: [
    //         { path: '', component: ListadoComponent },
    //         { path: 'detalle/:id', component: DetalleComponent },
    //     ]
    // },

    // dejar siempre al último porque no encuentra las url después de esta
    { path: "**", redirectTo: "inicio" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
