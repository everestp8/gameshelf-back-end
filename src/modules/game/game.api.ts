import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom } from "rxjs";
import { SearchGameDTO } from "./game.dtos";

@Injectable()
export class GameApi {
    private readonly baseUrl: string = 'https://api.rawg.io/api';
    private readonly apiKey: string = process.env.RAWG_API_KEY || '';
    private readonly getUrl = (endpoint: string) => {
        const paramChar = endpoint.includes('?') ? '&' : '?';
        return `${this.baseUrl}/${endpoint}${paramChar}key=${this.apiKey}`;
    }

    constructor(
        private readonly httpService: HttpService
    ) { }

    async fetchById(gameId: string): Promise<AxiosResponse<any>> {
        return await firstValueFrom(
            this.httpService.get(this.getUrl(`games/${gameId}`))
        );
    }

    async fetchSearch(query: SearchGameDTO): Promise<AxiosResponse<any>> {
        let endpoint = `games?search=${encodeURIComponent(query.query)}`;
        endpoint += `&page=${query.page}`;
        endpoint += `&page_size=${query.pageSize}`;

        return await firstValueFrom(
            this.httpService.get(this.getUrl(endpoint))
        );
    }

    async fetchGameList(query: SearchGameDTO): Promise<AxiosResponse<any>> {
        let endpoint = `games?ordering=${encodeURIComponent(query.query)}`;
        endpoint += `&page=${query.page}`;
        endpoint += `&page_size=${query.pageSize}`;

        return await firstValueFrom(
            this.httpService.get(this.getUrl(endpoint))
        );
    }
}
