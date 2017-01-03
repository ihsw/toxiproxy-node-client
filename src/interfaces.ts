import { Type, Direction, IAttributes } from "./Toxic";

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

export interface IPopulateProxiesResponse {
  proxies: ICreateProxyResponse[];
}

export interface IGetProxyResponse extends ICreateProxyResponse { }

export interface IUpdateProxyBody {
  enabled: boolean;
  listen: string;
  upstream: string;
}

export interface IUpdateProxyResponse extends ICreateProxyResponse { }

export interface IGetProxiesResponse {
  [name: string]: IGetProxyResponse;
}

export interface ICreateToxicBody {
  name: string;
  type: Type;
  stream: Direction;
  toxicity: number;
  attributes: IAttributes;
}