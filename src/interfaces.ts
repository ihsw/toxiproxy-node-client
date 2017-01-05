import {
  Type as ToxicType,
  Direction as ToxicDirection
} from "./Toxic";

// request & responses for GET /proxies
export interface IGetProxiesResponse {
  [name: string]: IGetProxyResponse;
}

// request & responses for POST /proxies
export interface ICreateProxyBody {
  name: string;
  listen: string;
  upstream: string;
  enabled?: boolean;
}

export interface ICreateProxyResponse {
  name: string;
  listen: string;
  upstream: string;
  enabled: boolean;
  toxics: any[];
}

// request & responses for POST /populate
export interface IPopulateProxiesBody {
  [key: number]: ICreateProxyBody;
}

export interface IPopulateProxiesResponse {
  proxies: ICreateProxyResponse[];
}

// request & responses for GET /proxies/{proxy}
export interface IGetProxyResponse extends ICreateProxyResponse { }

// request & responses for POST /proxies/{proxy}
export interface IUpdateProxyBody {
  enabled: boolean;
  listen: string;
  upstream: string;
}

export interface IUpdateProxyResponse extends ICreateProxyResponse { }

// request & responses for DELETE /proxies/{proxy}
// intentionally left blank

// request & responses for GET /proxies/{proxy}/toxics
export interface IGetToxicsResponse { }

// request & responses for POST /proxies/{proxy}/toxics
export interface ICreateToxicBody<T> {
  name: string;
  stream: ToxicDirection;
  type: ToxicType;
  toxicity: number;
  attributes: T;
}

export interface ICreateToxicResponse<T> extends ICreateToxicBody<T> { }

// request & responses for GET /proxies/{proxy}/toxics/{toxic}
export interface IGetToxicResponse<T> extends ICreateToxicBody<T> { }

// request & responses for POST /proxies/{proxy}/toxics/{toxic}
export interface IUpdateToxicBody { }

// request & responses for DELETE /proxies/{proxy}/toxics/{toxic}
// intentionally left blank

// request & responses for POST /reset
// intentionally left blank

// request & responses for GET /version
// intentionally left blank