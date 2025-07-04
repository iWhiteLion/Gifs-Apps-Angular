import { Component, computed, inject, signal } from '@angular/core';
import { GifListComponent } from '../../components/gif-list/gif-list.component';
import { GifService } from '../../services/gifs.service';


@Component({
  selector: 'app-trending-page',
  imports: [GifListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {
  // gifs = computed(() => this.gifService.trendingGifs());

  gifService = inject(GifService); //Inyeccion de dependencias del servicio GifService


}