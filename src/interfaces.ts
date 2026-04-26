import {
    Type as ToxicType,
    Direction as ToxicDirection
} from "./Toxic";

// misc
export interface IProxyBody {
    /**
     * proxy name
     */
    name: string;
    /**
     * listen address (localhost or IP address:port)
     *
     * Example: "localhost:12345" will open a proxy on localhost, port 12345
     */
    listen: string;
    /**
     * proxy upstream address (dns name or IP:port)
     *
     * Example: "mongodb:27017" will proxy to a mongodb instance running on mongodb host at port 27017
     */
    upstream: string;
    /**
     * true/false (defaults to true on creation)
     */
    enabled?: boolean;
}

export interface IProxyResponse {
    /**
     * proxy name
     */
    name: string;
    /**
     * listen address (localhost or IP address:port)
     *
     * Example: "localhost:12345" will open a proxy on localhost, port 12345
     */
    listen: string;
    /**
     * proxy upstream address (dns name or IP:port)
     *
     * Example: "mongodb:27017" will proxy to a mongodb instance running on mongodb host at port 27017
     */
    upstream: string;
    /**
     * true/false (defaults to true on creation)
     */
    enabled: boolean;
    /**
     * list of toxics
     */
    toxics: IToxicResponse<unknown>[];
}

export interface IToxicBody<T> {
    /**
     * Toxic name
     */
    name: string;
    /**
     * The stream direction must be either upstream or downstream.
     * upstream applies the toxic on the client -> server connection,
     * while downstream applies the toxic on the server -> client connection.
     * This can be used to modify requests and responses separately.
     *
     * defaults to downstream
     */
    stream: ToxicDirection;
    /**
      * Toxic type
      */
    type: ToxicType;
    /**
      * Percentage of connections the toxic will affect.
      *
      * defaults to 1.0 (100%)
      */
    toxicity: number;
    /**
    * Toxic attributes
    */
    attributes: T;
}

export type IToxicResponse<T> = IToxicBody<T>;

// request & responses for GET /proxies
export interface IGetProxiesResponse {
    [name: string]: IGetProxyResponse;
}

// request & responses for POST /proxies
export type ICreateProxyBody = IProxyBody;
export type ICreateProxyResponse = IProxyResponse;

// request & responses for POST /populate
export type IPopulateProxiesBody = IProxyBody[];

export interface IPopulateProxiesResponse {
    proxies: IProxyResponse[];
}

// request & responses for GET /proxies/{proxy}
export type IGetProxyResponse = IProxyResponse;

// request & responses for POST /proxies/{proxy}
export interface IUpdateProxyBody {
    /**
     * true/false
     */
    enabled: boolean;
    /**
     * listen address (localhost or IP address:port)
     *
     * Example: "localhost:12345" will open a proxy on localhost, port 12345
     */
    listen: string;
    /**
     * proxy upstream address (dns name or IP:port)
     *
     * Example: "mongodb:27017" will proxy to a mongodb instance running on mongodb host at port 27017
     */
    upstream: string;
}

export type IUpdateProxyResponse = IProxyResponse;

// request & responses for DELETE /proxies/{proxy}
// intentionally left blank

// request & responses for GET /proxies/{proxy}/toxics
export type IGetToxicsResponse<T> = IToxicResponse<T>[];

// request & responses for POST /proxies/{proxy}/toxics
export type ICreateToxicBody<T> = IToxicBody<T>;
export type ICreateToxicResponse<T> = IToxicResponse<T>;

// request & responses for GET /proxies/{proxy}/toxics/{toxic}
export type IGetToxicResponse<T> = IToxicResponse<T>;

// request & responses for POST /proxies/{proxy}/toxics/{toxic}
export type IUpdateToxicBody<T> = IToxicBody<T>;
export type IUpdateToxicResponse<T> = IToxicResponse<T>;
