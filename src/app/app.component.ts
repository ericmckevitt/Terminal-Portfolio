import { Component, OnInit } from '@angular/core';

declare var $: any;  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'portfolio';
  isJqueryWorking: any = "JQuery is not working :(";

  ngOnInit()  
  {  
    $(document).ready(() => {  
      this.isJqueryWorking = '✅ JQuery is working!';  
    });  
  }
}
