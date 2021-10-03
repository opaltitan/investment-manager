import { Observable } from 'rxjs';

const headerObj = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};
const baseUrl = 'http://localhost:3800';

const methodTypes = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

export const httpCallMap = {
  watchlist: {
    readAllMeta: { method: methodTypes.GET, url: '/watchlists' },
    readOne: { method: methodTypes.GET, url: '/watchlist/{id}' },
    addStock: { method: methodTypes.POST, url: '/watchlist/{id}/stock'},
    deleteStock: { method: methodTypes.DELETE, url: '/watchlist/{id}/stock/{stockId}' },
    create: { method: methodTypes.POST, url: '/watchlist' },
    delete: { method: methodTypes.DELETE, url: '/watchlist/{id}' }
  },
  portfolio: {
    readAllMeta: { method: methodTypes.GET, url: '/portfolios'},
    readOne: { method: methodTypes.GET, url: '/portfolio/{id}' },
    addStock: { method: methodTypes.POST, url: '/portfolio/{id}/stock'},
    create: { method: methodTypes.POST, url: '/portfolio' },
    delete: { method: methodTypes.DELETE, url: '/portfolio/{id}' }
  },
  stock: {
    readOne: { method: methodTypes.GET, url: '/stock/{id}' },
    search: { method: methodTypes.GET, url: '/search/{ticker}' },
    internalSearch: { method: methodTypes.POST, url: '/internal_search' },
    create: { method: methodTypes.POST, url: '/stock/{ticker}' },
    createSnapshot: { method: methodTypes.POST, url: '/stock/{id}/snapshot'}
  },
  stockSnapshot: {
    create: { method: methodTypes.POST, url: '/stock/{id}/snapshot' },
    readOne: { method: methodTypes.GET, url: '/snapshot/{id}' },
    delete: { method: methodTypes.DELETE, url: '/snapshot/{id}' }
  },
  stockSnapshotComment: {
    create: { method: methodTypes.POST, url: '/snapshot/{id}/comment' },
    update: { method: methodTypes.PUT, url: '/comment/{id}'},
    delete: { method: methodTypes.DELETE, url: '/comment/{id}'}
  },
  contribution: { }
};

export class HttpParams {
  constructor(httpCallMapItem, additionalParams = null) {
    this.method = httpCallMapItem.method;
    this.validUrl = true;
    this.url = additionalParams
      ? this.buildUrl(httpCallMapItem.url, additionalParams)
      : httpCallMapItem.url;
  }

  buildUrl(initialUrl, paramKeyValues) {
    let modifiedUrl = initialUrl;
    for (const key in paramKeyValues) {
      if (!paramKeyValues[key]) {
        this.validUrl = false;
      }
      modifiedUrl = modifiedUrl.replace(`{${key}}`, paramKeyValues[key]);
    }

    return modifiedUrl;
  }
}

const headerBuilder = (method, body) => {
  let builtHeader = {
    ...headerObj,
    method: method
  };
  if (body) {
    Object.assign(
      builtHeader,
      { body: JSON.stringify(body) }
    );
  }

  return builtHeader;
}

export const http = (method, url, body = null) => {
  return Observable.create(observer => 
    fetch(
      `${baseUrl}${url}`,
      headerBuilder(method, body)
    ).then(res => res.json())
    .then(data => {
      console.log(data);
      observer.next(data);
      observer.complete();
    })
  );
};


// export const watchlist = {
  // GET
  // readAllMeta: () => http(methodTypes.GET, '/watchlists'),
  // readById: (watchlistId) => http(methodTypes.GET, `/watchlist/${watchlistId}`),
  // // POST
  // create: (body) => http(methodTypes.POST, `/watchlist`, body),
  // // PUT
  // update: (watchlistId, body) => http(methodTypes.PUT, `/watchlist/${watchlistId}`, body),
  // // DELETE
  // delete: (watchlistId) => http(methodTypes.DELETE, `/watchlist/${watchlistId}`)
// };

// export const portfolio = {
//   // GET
//   readAllMeta: () => {
//     console.log('portfolio readAllMeta called');
//     return http(methodTypes.GET, '/portfolios')
//   },
//   // readById: (portfolioId) => http(methodTypes.GET, `/portfolio/${portfolioId}`),
//   // readStockFromPortfolio: (portfolioId, stockId) => http(methodTypes.GET, `/portfolio/${portfolioId}/stocks/${stockId}`),
//   // // POST
//   // create: (body) => http(methodTypes.POST, `/portfolio`, body),
//   // // PUT
//   // update: (portfolioId, body) => http(methodTypes.PUT, `/portfolio/${portfolioId}`, body),
//   // // DELETE
//   // delete: (portfolioId) => http(methodTypes.DELETE, `/portfolio/${portfolioId}`)
// };

// export const contribution = {
//   // GET
//   readAllContributionsInPortfolio: (portfolioId) => http(methodTypes.GET, `/portfolio/${portfolioId}/contributions`)
// };

// export const stock = {
//   // GET
//   search: (body) => http(methodTypes.GET, `/stock/search`, body),
//   readCurrent: (stockId) => http(methodTypes.GET, `/stock/${stockId}/current`),
//   readMostRecentCached: (stockId) => http(methodTypes.GET, `/stock/${stockId}/cache`),
//   readStockCache: (cacheId) => http(methodTypes.GET, `/stock_cache/${cacheId}`),
//   // POST
//   cacheStockData: (stockId, body) => http(methodTypes.POST, `/stock/${stockId}/cache`, body)
// };


// Dashboard
//  - Display all Watchlists (collapsed), and all Portfolios (including performance summary)
// Stock Search
//  - Textbox displays. Every keydown stroke (with a debounce) loads a list of stocks whose Tickers or Names match the search term
// Watchlist Details page
//  - Display list of stocks within watchlist. Allow for navigation to Stock Details page
// Portfolio Details page
//  - Display list of stocks within portfolio, with performance of each. Allow for navigation to Stock Details page
// Stock Details page
//  - Displays current data for the stock, and the Portfolios it's in with Contributions
