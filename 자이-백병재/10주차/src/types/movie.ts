type Language = "en-US" | "ko-KR";

export type movieGetParams = {
    query: string;
    include_adult: boolean;
    language: Language;
}

export type movieGetResponse = {
    page: number;
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export interface IMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    vote_count: number;
    video: boolean;
    adult: boolean;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    popularity: number;
  }