type Language = "en-US" | "ko-KR";

export type movieGetParams = {
    query: string;
    include_adult: boolean;
    language: Language;
}

export type movieGetResponse = {
    page: number;
    results: movieData[];
    total_pages: number;
    total_results: number;
}

export type movieData = {
    adult: boolean;
    backdrop_path: string;
    overview: string;
    title: string;
    poster_path: string;
}