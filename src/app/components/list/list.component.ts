import { Component, OnInit } from '@angular/core';
import { LopService } from '../../providers/lop.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListLop } from '../../interfaces/listLop';
import { SelectionLop } from '../../interfaces/selectionLop';
import { UserLop } from '../../interfaces/userLop';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list: ListLop;
  selectionOpen: boolean = true;
  selection: SelectionLop;
  loading: boolean = true;

  constructor( private lop: LopService,
               private activatedRoute: ActivatedRoute,
               private router: Router
    ) {
    this.loading = true;

    this.activatedRoute.params.subscribe( params => {
      
      this.lop.getList( params['uid'] ).subscribe( resp => {
        
        if (!resp) return; // Para evitar errores cuando se elimina la lista estando aún en list
        
        let today0 = this.day0hr (new Date());
        this.list = resp;

        this.selection = { 
          selectionDay: 0,
          uidUserSelected: ''
        }

        this.list.members.forEach( member => {
          
          if (member.lastDateSelected === today0) {
            this.selectionOpen = false;
          }

          if (this.lop.user.uid === member.uid) {

            if ( member.selection.selectionDay === today0 ) {
              this.selection = member.selection;
            }
            else {
              this.selection = {
                selectionDay: today0,
                uidUserSelected: ''
              }
            }
          }

        });

        if (this.selection.selectionDay<=0) {
          this.router.navigate(['lists']);
        }
        this.loading = false;
      });
    
    });

  }

  ngOnInit() {
  }

  day0hr ( date: Date ) {
    let dateResponse = new Date ( date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    return dateResponse.getTime();
  }

  seleccionar ( selected: UserLop) {
    let cuenta: number = 0;

    this.list.members.forEach ( member => {
      if ( member.uid === this.lop.user.uid ) {
        member.selection.selectionDay = this.selection.selectionDay;
        member.selection.uidUserSelected = selected.uid;
      }

      if ( member.selection.selectionDay === this.selection.selectionDay &&
           member.selection.uidUserSelected === selected.uid) {
        cuenta = cuenta + 1;
      }
    })

    this.selection.uidUserSelected = selected.uid;

    // Si más del 50% de los miembros seleccionan a un miembro, automaticamente queda definido como el seleccionado 
    if (cuenta>this.list.members.length/2) {
      this.list.members.forEach ( member => {
        if ( member.uid === selected.uid ) {
          member.lastDateSelected = this.selection.selectionDay;
        }
      })
    }
        
    this.lop.updateList ( this.list );    
  }

  deseleccionar () {

    this.list.members.forEach ( member => {
      if ( member.uid === this.lop.user.uid ) {
        member.selection.selectionDay = this.selection.selectionDay;
        member.selection.uidUserSelected = ''
      }
    })

    this.selection.uidUserSelected = '';
        
    this.lop.updateList ( this.list );    
  }

  async desuscribir () {

    Swal.fire({
      title: 'Está Seguro?',
      text: "Si se desuscribe perderá toda su historia en esta actividad",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Si, desuscribirme',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        this.lop.removeMember( this.list ).then (() => {
          Swal.fire({
            title: this.lop.user.name,
            text: 'Se desuscribió de ' + this.list.name,
            type: 'success',
            confirmButtonColor: '#007bff'  
          }).then ( () => {
            if ( this.list.members.length <= 0 ) {
              this.lop.removeList( this.list ).then( () => {
                this.router.navigate(['lists']);                
              })
            }
          })
        })
      }
    })

  }


}
