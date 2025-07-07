import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { environment } from "@envs/environment";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "./mapper/gif.mapper";
import { map, tap } from "rxjs";


const GIF_KEY = 'gifs';

const loadFromLocalStorge = () => {
    const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
    const gifs = JSON.parse(gifsFromLocalStorage);
    return gifs;
}


@Injectable({
    providedIn: "root",
})

export class GifService {

    private http = inject(HttpClient);
    trendingGifs = signal<Gif[]>([]);

    trendingLoading = signal<boolean>(true);
    searchingLoading = signal<boolean>(true);

    searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorge());
    searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

    constructor() {
        this.loadTrendingGifs();

    }

    saveGifsToLocalStorage = effect(() => {
        const historyString = JSON.stringify(this.searchHistory());
        localStorage.setItem(GIF_KEY, historyString);
    }
    )

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

            });
    }

    searchGifs(query: string) {
        return this.http.get<GiphyResponse>(`${environment.giphyApiUrl}/gifs/search`, {
            params: {
                api_key: environment.giphyApiKey,
                q: query,
                limit: "5",
            },
        })
            .pipe(
                map(({ data }) => data),
                map((items) => GifMapper.mapGiphyResponseToGifArray(items)),

                tap(gifs => {
                    this.searchHistory.update(history => ({
                        ...history,
                        [query.toLowerCase()]: gifs
                    }));
                })
            );
    }

    getHistoryGifs(query: string): Gif[] {
        return this.searchHistory()[query] ?? [];
    }

    // saveHistoryToLocalStorage() {
    //     localStorage.setItem('gifSearchHistory', JSON.stringify(this.searchHistory()));
    // }

    // loadHistoryFromLocalStorage() {
    //     const data = localStorage.getItem('gifSearchHistory');
    //     if (data) {
    //         this.searchHistory.set(JSON.parse(data));
    //     }
    // }

    // // Guarda el historial de búsquedas en localStorage cada vez que cambia
    // private setupLocalStorageSync() {
    //     effect(() => {
    //         this.saveHistoryToLocalStorage();
    //     });
    // }

    // // Llama a la carga del historial desde localStorage al iniciar el servicio
    // ngOnInit?(): void {
    //     this.loadHistoryFromLocalStorage();
    //     this.setupLocalStorageSync();
    // }
}

