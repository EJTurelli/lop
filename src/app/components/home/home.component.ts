import { Component, OnInit } from '@angular/core';
import { LopService } from '../../providers/lop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor( private lop: LopService ) { }

  ngOnInit() {
    this.lop.logout();
  }

}
