import {
  Type as ToxicType,
  Direction as ToxicDirection
} from "./Toxic";

// misc
export interface IProxyBody {
  name: string;
  listen: string;
  upstream: string;
  enabled?: boolean;
}

export interface IProxyResponse {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: IToxicResponse<any>[];
}

export interface IToxicBody<T> {
  name: string;
  stream: ToxicDirection;
  type: ToxicType;
  toxicity: number;
  attributes: T;
}

export interface IToxicResponse<T> extends IToxicBody<T> { }

// request & responses for GET /proxies
export interface IGetProxiesResponse {
  [name: string]: IGetProxyResponse;
}

// request & responses for POST /proxies
export interface ICreateProxyBody extends IProxyBody { }
export interface ICreateProxyResponse extends IProxyResponse { }

// request & responses for POST /populate
export interface IPopulateProxiesBody extends Array<IProxyBody> { }

export interface IPopulateProxiesResponse {
  proxies: IProxyResponse[];
}

// request & responses for GET /proxies/{proxy}
export interface IGetProxyResponse extends IProxyResponse { }

// request & responses for POST /proxies/{proxy}
export interface IUpdateProxyBody {
  enabled: boolean;
  listen: string;
  upstream: string;
}

export interface IUpdateProxyResponse extends IProxyResponse { }

// request & responses for DELETE /proxies/{proxy}
// intentionally left blank

// request & responses for GET /proxies/{proxy}/toxics
export interface IGetToxicsResponse<T> extends Array<IToxicResponse<T>> { }

// request & responses for POST /proxies/{proxy}/toxics
export interface ICreateToxicBody<T> extends IToxicBody<T> { }
export interface ICreateToxicResponse<T> extends IToxicResponse<T> { }

// request & responses for GET /proxies/{proxy}/toxics/{toxic}
export interface IGetToxicResponse<T> extends IToxicResponse<T> { }

// request & responses for POST /proxies/{proxy}/toxics/{toxic}
export interface IUpdateToxicBody<T> extends IToxicBody<T> { }
export interface IUpdateToxicResponse<T> extends IToxicResponse<T> { }

// request & responses for DELETE /proxies/{proxy}/toxics/{toxic}
// intentionally left blank

// request & responses for POST /reset
// intentionally left blank

// request & responses for GET /version
// intentionally left blank