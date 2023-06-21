import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  classList: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    const list = this.elementRef.nativeElement.querySelectorAll('.list');

    const activeLink = (event: Event) => {
      const target = event.target as HTMLElement;
      list.forEach((item: Element) =>
        item.classList.remove('active'));
      target.classList.add('active');
    };

    list.forEach((item: Element) => item.addEventListener('click', activeLink));
  }
}
