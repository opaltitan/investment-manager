import { useState, useEffect } from 'react';
import { of } from 'rxjs';
import { Data } from './data.d';
import { Http } from './http.d';
import { ID } from './type';

const standardObsCallback = (data: any, setStateData: (data: any) => void) => {
  setStateData(data);
};

const dataPullEffectCallback = (
  httpType: string,
  httpUrl: string,
  httpBody: Object | null,
  validUrlCheck: boolean,
  setStateData: (newStateData: any) => void,
  obsCallback = standardObsCallback
) => {
  console.log(httpUrl);
  const obs: Observable<any> = validUrlCheck
    ? Http.execute(httpType, httpUrl, JSON.parse(httpBody))
    : of(null);
  obs.subscribe((data) => {
    obsCallback(data, setStateData);
  });

  return obs.unsubscribe;
};

const EffectFactory = (
  initialDataVal: any,
  httpCallMapItem: Http.HttpCallMapItem,
  additionalHttpParams: Http.HttpAdditionalParams,
  httpBody: Object | null,
  effectTrigger: number,
  effectCallback = dataPullEffectCallback,
  obsCallback = standardObsCallback
): any => {
  const [stateData, setStateData] = useState(initialDataVal);
  const httpParams: Http.HttpParams = new Http.HttpParams({ item: httpCallMapItem, additionalParams: additionalHttpParams ? additionalHttpParams : null });
  const stringifiedHttpBody: string = httpBody ? JSON.stringify(httpBody) : null;

  useEffect(
    () => {
      effectCallback(
        httpParams.type,
        httpParams.url,
        stringifiedHttpBody,
        httpParams.validUrl,
        setStateData,
        obsCallback
      );
    },
    [httpParams.type, httpParams.url, stringifiedHttpBody, httpParams.validUrl, setStateData, obsCallback, effectTrigger, effectCallback]
  );

  return stateData;
};

export namespace Effects {
  export const AllPortfolios = (effectTrigger: number): Array<Data.Portfolio> => EffectFactory(
    [], Http.httpCallMap.portfolio.readAllMeta, null, null, effectTrigger
  );
  export const AllWatchlists = (effectTrigger: number): Array<Data.Watchlist> => EffectFactory(
    [], Http.httpCallMap.watchlist.readAllMeta, null, null, effectTrigger
  );
  export const SinglePortfolio = (id: ID, effectTrigger: number): Data.Portfolio => {
    const additionalParams: Http.HttpAdditionalParams = { id: id };
    return EffectFactory(
      null, Http.httpCallMap.portfolio.readOne, additionalParams, null, effectTrigger
    );
  };
  export const SingleWatchlist = (id: ID, effectTrigger: number): Data.Watchlist => {
    const additionalParams: Http.HttpAdditionalParams = { id: id };
    return EffectFactory(
      null, Http.httpCallMap.watchlist.readOne, additionalParams, null, effectTrigger
    );
  };
  export const ExternalStockSearch = (ticker: string): Array<any> => {
    const additionalParams: Http.HttpAdditionalParams = { ticker: ticker };
    return EffectFactory(
      [], Http.httpCallMap.stock.search, additionalParams, null, null
    );
  };
  export const InternalStockSearch = (searchTerm: string): Array<Data.Stock> => EffectFactory(
    [], Http.httpCallMap.stock.internalSearch, null, { searchTerm: searchTerm }, null
  );
  export const SingleStock = (id: ID | null): Data.Stock => {
    const additionalParams: Http.HttpAdditionalParams = { id: id };
    return EffectFactory(
      null, Http.httpCallMap.stock.readOne, additionalParams, null, null
    );
  };
  export const SingleSnapshot = (snapshotId: ID | null, effectTrigger: number): Data.SnapshotDisplay => {
    const additionalParams: Http.HttpAdditionalParams = { id: snapshotId };
    return EffectFactory(
      null, Http.httpCallMap.snapshot.readOne, additionalParams, null, effectTrigger
    );
  };
  export const StockSearchState = (ticker: string): Array<Data.StockSearch> => {
    const additionalParams: Http.HttpAdditionalParams = { ticker: ticker };
    return EffectFactory(
      [], httpCallMap.stock.search, additionalParams, null, null
    );
  };
}
