import { Component, OnInit } from '@angular/core';
import { LopService } from '../../providers/lop.service';
import { ActivatedRoute, UrlHandlingStrategy } from '@angular/router';
import { ListLop } from '../../interfaces/listLop';
import { SelectionLop } from '../../interfaces/selectionLop';
import { UserLop } from '../../interfaces/userLop';
import { timestamp } from 'rxjs/operators';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  list: ListLop;
  selectionOpen: boolean = true;
  selection: SelectionLop;

  constructor( private lop: LopService,
               private activatedRoute: ActivatedRoute
    ) {
    
    this.activatedRoute.params.subscribe( params => {
      
      this.lop.getList( params['uid'] ).subscribe( resp => {
        let today0 = this.day0hr (new Date());
        this.list = resp;

        this.selection = { 
          selectionDay: today0,
          uidUserSelected: ''
        }

        this.list.members.forEach( member => {
          
          if (member.lastDateSelected === this.selection.selectionDay) {
            this.selectionOpen = false;
            return;
          }

          if (this.lop.user.uid === member.uid) {

            let dateTmp = this.day0hr(new Date(member.selection.selectionDay));

            if ( dateTmp === this.selection.selectionDay ) {
              this.selection = member.selection;
            }
            else {
              this.selection = {
                selectionDay: this.selection.selectionDay,
                uidUserSelected: ''
              }
            }
          }

        });

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
}
