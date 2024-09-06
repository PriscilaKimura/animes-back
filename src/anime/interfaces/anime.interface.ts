 // Este arquivo define a interface do modelo de anime
 export interface Anime {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    releaseDate: string;
    type?: 'filme' | 'série'; 
    imageUrl?: string;
  }
  