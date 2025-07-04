import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { environment } from "@envs/environment";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "./mapper/gif.mapper";

@Injectable({
    providedIn: "root",
})



export class GifService {

    private http = inject(HttpClient);
    trendingGifs = signal<Gif[]>([]); 



    constructor() {
        this.loadTrendingGifs();
    }

    loadTrendingGifs() {

        this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/trending`,
            {
                params: {
                    api_key: environment.giphyApiKey,
                    limit: "20",
                },
            }).subscribe((response) => {
const gifs = GifMapper.mapGiphyResponseToGifArray(response.data);
this.trendingGifs.set(gifs);
console.log('gifs', gifs);

            });
    }
}
