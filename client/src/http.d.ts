import { Observable } from 'rxjs';
import { Enums } from './models/enum.d';

const headerObj: { [x: string]: JSON } = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};
const baseUrl: string = 'http://localhost:3800';

interface HttpCallMap {
  [x: string]: {
    [x: string]: HttpCallMapItem
  }
}

interface HttpParamsInput {
  item: HttpCallMapItem;
  additionalParams?: HttpAdditionalParams;
}

const headerBuilder = (type: string, body?: Object) => {
  let builtHeader = {
    ...headerObj,
    method: type
  };
  if (body) {
    Object.assign(
      builtHeader,
      { body: JSON.stringify(body) }
    );
  }

  return builtHeader;
};

export namespace Http {
  export interface HttpCallMapItem {
    type: string;
    url: string;
  }

  export interface HttpAdditionalParams {
    id?: ID;
    stockId?: ID;
    ticker?: string;
  }

  export const httpCallMap = {
    watchlist: {
      readAllMeta: { type: Enums.HTTP_CALL_TYPE.GET, url: '/watchlists' },
      readOne: { type: Enums.HTTP_CALL_TYPE.GET, url: '/watchlist/{id}' },
      addStock: { type: Enums.HTTP_CALL_TYPE.POST, url: '/watchlist/{id}/stock' },
      deleteStock: { type: Enums.HTTP_CALL_TYPE.DELETE, url: '/watchlist/{id}/stock/{stockId}' },
      create: { type: Enums.HTTP_CALL_TYPE.POST, url: '/watchlist' },
      delete: { type: Enums.HTTP_CALL_TYPE.DELETE, url: '/watchlist/{id}' },
    },
    portfolio: {
      readAllMeta: { type: Enums.HTTP_CALL_TYPE.GET, url: '/portfolios' },
      readOne: { type: Enums.HTTP_CALL_TYPE.GET, url: '/portfolio/{id}' },
      addStock: { type: Enums.HTTP_CALL_TYPE.POST, url: '/portfolio/{id}/stock' },
      create: { type: Enums.HTTP_CALL_TYPE.POST, url: '/portfolio' },
      delete: { type: Enums.HTTP_CALL_TYPE.DELETE, url: '/portfolio/{id}' },
    },
    stock: {
      readOne: { type: Enums.HTTP_CALL_TYPE.GET, url: '/stock/{id}' },
      search: { type: Enums.HTTP_CALL_TYPE.GET, url: '/search/{ticker}' },
      internalSearch: { type: Enums.HTTP_CALL_TYPE.POST, url: '/internal_search' },
      create: { type: Enums.HTTP_CALL_TYPE.POST, url: '/stock/{ticker}' },
      createSnapshot: { type: Enums.HTTP_CALL_TYPE.POST, url: '/stock/{id}/snapshot' },
    },
    snapshot: {
      create: { type: Enums.HTTP_CALL_TYPE.POST, url: '/stock/{id}/snapshot' },
      readOne: { type: Enums.HTTP_CALL_TYPE.GET, url: '/snapshot/{id}' },
      delete: { type: Enums.HTTP_CALL_TYPE.DELETE, url: '/snapshot/{id}' },
    },
    comment: {
      create: { type: Enums.HTTP_CALL_TYPE.POST, url: '/snapshot/{id}/comment' },
      update: { type: Enums.HTTP_CALL_TYPE.PUT, url: '/comment/{id}' },
      delete: { type: Enums.HTTP_CALL_TYPE.DELETE, url: '/comment/{id}' }
    },
    transaction: {}
  };

  export class HttpParams {
    public type: string;
    public url: string;
    public validUrl: boolean;
  
    constructor(params: HttpParamsInput) {
      this.type = params.item.type;
      this.validUrl = true;
      this.url = params.additionalParams
        ? this.buildUrl(params)
        : params.item.url;
    }
  
    private buildUrl(params: HttpParamsInput) {
      let modifiedUrl = params.item.url;
      for (const key in params.additionalParams) {
        if (!params.additionalParams[key]) {
          this.validUrl = false;
        }
        modifiedUrl = modifiedUrl.replace(`{${key}}`, params.additionalParams[key]);
      }
  
      return modifiedUrl;
    }
  };

  export const execute = (type: string, url: string, body?: Object | null): Observable<any> => {
    return Observable.create(observer =>
      fetch(
        `${baseUrl}${url}`,
        headerBuilder(type, body)
      ).then(res => res.json())
      .then(data => {
        observer.next(data);
        observer.complete();
      })
    );
  };
}