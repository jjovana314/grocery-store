import { SearchQuery } from "src/common/search-query";

export class SearchUsers extends SearchQuery {
    public email?: string;
    public firstName?: string;
    public lastName?: string;
}