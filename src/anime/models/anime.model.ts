// Modelo que implementa a estrutura de um anime ele é opcional (um modelo que implemente a interface)
import { Anime } from '../interfaces/anime.interface';

export class AnimeModel implements Anime {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public completed: boolean,
    public releaseDate: string,
    public type?: 'filme' | 'série', 
  ) {}
}
