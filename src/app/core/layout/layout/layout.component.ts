import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  modules = [
    "scheduler", "appointments",
    // "staff",
    "clients", "treatments",
    // "products",
    "vouchers",
    "checkout",
    "invoices"

  ];

  public sbtoggle: boolean;
  constructor() { }

  ngOnInit() {

  }

}
