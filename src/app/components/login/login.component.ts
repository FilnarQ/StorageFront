import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  q:string = ""
  dndLoad:boolean = false
  constructor(private route:ActivatedRoute, private router:Router){}
  open()
  {
    this.router.navigateByUrl(`cell?id=${this.q==''?'0':this.q}&load=${this.dndLoad}`)
  }
}
