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
    toxics: IToxicResponse<any>[];
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