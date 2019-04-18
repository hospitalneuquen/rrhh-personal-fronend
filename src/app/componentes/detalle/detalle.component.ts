import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// Servicios y modelo
import { AgenteService } from '../../hardcodeo/agente.service';
import { Agente } from '../../hardcodeo/agente';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleComponent implements OnInit {


    acordions = [
      {
        'titulo':'datos basicos',
        'icon': 'history',
      },
      {
        'titulo':'datos de contacto',
        'icon': 'close',
      },
      {
        'titulo':'educacion',
        'icon': 'pencil',
      },
      {
        'titulo':'situacion',
        'icon': 'earth',
      },
    ]


  agentes$: Observable<Agente>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AgenteService,
  ) { }

  ngOnInit() {
    this.agentes$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.service.getAgente(params.get('id')))
    );
  }

  gotoAgentes(agente: Agente) {
    let agenteId = agente ? agente.nombre : null;
    this.router.navigate(['/agentes' ,  {id: agenteId}]);
  }

  volverInicio() {
    this.router.navigate(['/']);
  }

}
