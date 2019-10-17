import { Component, OnInit } from '@angular/core';
import { LopService } from '../../providers/lop.service';
import Swal from 'sweetalert2';
import { ListLop } from '../../interfaces/listLop';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  misListas: ListLop[] = [];
  otrasListas: ListLop[] = [];
  loading: boolean = true; 

  constructor( public lop: LopService,
               private router: Router
    ) { 
 
    this.loading = true;
    lop.getLists().subscribe( lists => {
      this.misListas = [];
      this.otrasListas = [];

      lists.forEach ( list => {
        let milista = false;
        list.members.forEach ( member => {
          if ( member.uid === this.lop.user.uid ) {
            this.misListas.push( list );
            milista = true;
            return;
          }
        })

        if (!milista) this.otrasListas.push ( list );

      })

      this.loading = false;
    });    
 
  }

  ngOnInit() {
  }

  async newList () {

    const { value: name } = await Swal.fire({
      title: 'Ingrese el Nombre de la Lista',
      input: 'text',
      inputValue: '',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#dc3545',
      inputValidator: (value) => {
        if (!value) {
          return 'Necesitas escribir algo!'
        }
      }
    });

    if ( name ) {

      Swal.fire({
        title: 'Espere',
        text: 'Guardando Información',
        type: 'info',
        allowOutsideClick: false
      });
      Swal.showLoading();
  
      this.lop.newList ( name )
        .then ( resp => {
          Swal.fire({
            title: name,
            text: 'Se creó correctamente',
            type: 'success',
            confirmButtonColor: '#007bff',
            cancelButtonColor: '#dc3545',      
          }).then( resp => {
            this.lop.getLists();
          })
        });

    }
    else {
      return;
    }

  }

  subscribir ( list: ListLop ) {
    this.lop.addMember ( list );
  }

  entrar ( list: ListLop ) {
    this.router.navigate(['list', list.uid]);
  }
}
