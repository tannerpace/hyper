import { Request } from "node-fetch";
import { ListOptions, QueryOptions } from "./services/data";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum Action {
  QUERY = "_query",
  BULK = "_bulk",
  INDEX = "_index",
}

export interface Result {
  ok: boolean;
  id?: string;
  msg?: string;
}

export interface Results<Type> {
  ok: boolean;
  docs: Type[];
}

export interface SearchQueryOptions {
  fields: string[];
  filter: Record<string, string>;
}

export interface HyperData {
  add: <Type>(body: Type) => Promise<Result>;
  get: <Type>(id: string) => Promise<Type | Result>;
  list: <Type>(options?: ListOptions) => Promise<Results<Type>>;
  update: <Type>(id: string, doc: Type) => Promise<Result>;
  remove: (id: string) => Promise<Result>;
  query: <Type>(
    selector: unknown,
    options?: QueryOptions,
  ) => Promise<Results<Type>>;
  index: (name: string, fields: string[]) => Promise<Result>;
  bulk: <Type>(docs: Array<Type>) => Promise<Result>;
}

export interface HyperCache {
  add: <Type>(key: string, value: Type, ttl?: string) => Promise<Result>;
  get: <Type>(key: string) => Promise<Type>;
  remove: (key: string) => Promise<Result>;
  set: <Type>(key: string, value: Type, ttl?: string) => Promise<Result>;
  query: <Type>(pattern: string) => Promise<Results<Type>>;
}

export interface HyperSearch {
  add: <Type>(key: string, doc: Type) => Promise<Result>;
  remove: (key: string) => Promise<Result>;
  get: <Type>(key: string) => Promise<Type>;
  update: <Type>(key: string, doc: Type) => Promise<Result>;
  query: <Type>(
    query: string,
    options: SearchQueryOptions,
  ) => Promise<Results<Type>>;
  load: <Type>(docs: Type[]) => Promise<Result>;
}

export interface Hyper {
  data: HyperData;
  cache: HyperCache;
  search: HyperSearch;
}

export interface HyperRequest {
  service: "data" | "cache" | "storage" | "search" | "queue";
  method: Method;
  resource?: string;
  body?: unknown;
  // deno-lint-ignore no-explicit-any
  params?: undefined | Record<string, any>;
  action?: Action;
}

export type HyperRequestFunction = (request: HyperRequest) => Promise<Request>;
