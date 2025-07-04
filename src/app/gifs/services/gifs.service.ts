import { HttpClient } from "@angular/common/http";
import { inject, Injectable, Query, signal } from "@angular/core";
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
    searchingGifs = signal<Gif[]>([]);

    trendingLoading = signal<boolean>(true);
    searchingLoading = signal<boolean>(true);

    constructor() {
        this.loadTrendingGifs();
        this.searchGifs("");
    }

    loadTrendingGifs() {

        this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/trending`,
            {
                params: {
                    api_key: environment.giphyApiKey,
                    limit: "5",
                },
            }).subscribe((response) => {
                const gifs = GifMapper.mapGiphyResponseToGifArray(response.data);
                this.trendingGifs.set(gifs);
                this.trendingLoading.set(false);
                console.log('gifs', gifs);

            });
    }

    searchGifs(query: string) {
        return this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`, {
            params: {
                api_key: environment.giphyApiKey,
                q: query,
                limit: "5",
            },
        }).subscribe((response) => {
            const gifsSearch = GifMapper.mapGiphyResponseToGifArray(response.data);
            this.searchingGifs.set(gifsSearch);
            this.searchingLoading.set(false);
            console.log('gifs', gifsSearch);
        });
    }

}
