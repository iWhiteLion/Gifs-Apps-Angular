import {  Component } from '@angular/core';
import { environment } from '@envs/environment';


@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
})
export class GifsSideMenuHeaderComponent { 
  envs = environment;
}
