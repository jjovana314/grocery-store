export class SearchQuery {
    public page?: number;
    public limit?: number;
    public sort?: string;
    public sortDir?: 'asc' | 'desc';
    public type?: string;
}