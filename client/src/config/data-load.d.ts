import { Data } from '../models/data.d';
import { Http } from '../http.d';
import { ID } from './models/type';
import { DataLoadEffectFactory } from '../extensions/effects';

export namespace DataLoad {
  export const AllPortfolios = (effectTrigger: number): Array<Data.Portfolio> => DataLoadEffectFactory(
    [], Http.httpCallMap.portfolio.readAllMeta, null, null, effectTrigger
  );
  export const AllWatchlists = (effectTrigger: number): Array<Data.Watchlist> => DataLoadEffectFactory(
    [], Http.httpCallMap.watchlist.readAllMeta, null, null, effectTrigger
  );
  export const SinglePortfolio = (id: ID, effectTrigger: number): Data.Portfolio => {
    const additionalParams: Http.HttpAdditionalParams = { id: id };
    return DataLoadEffectFactory(
      null, Http.httpCallMap.portfolio.readOne, additionalParams, null, effectTrigger
    );
  };
  export const SingleWatchlist = (id: ID, effectTrigger: number): Data.Watchlist => {
    const additionalParams: Http.HttpAdditionalParams = { id: id };
    return DataLoadEffectFactory(
      null, Http.httpCallMap.watchlist.readOne, additionalParams, null, effectTrigger
    );
  };
  export const ExternalStockSearch = (ticker: string): Array<Data.StockSearch> => {
    const additionalParams: Http.HttpAdditionalParams = { ticker: ticker };
    return DataLoadEffectFactory(
      [], Http.httpCallMap.stock.search, additionalParams, null, null
    );
  };
  export const InternalStockSearch = (searchTerm: string): Array<Data.Stock> => DataLoadEffectFactory(
    [], Http.httpCallMap.stock.internalSearch, null, { searchTerm: searchTerm }, null
  );
  export const SingleStock = (id: ID | null): Data.Stock => {
    const additionalParams: Http.HttpAdditionalParams = { id: id };
    return DataLoadEffectFactory(
      null, Http.httpCallMap.stock.readOne, additionalParams, null, null
    );
  };
  export const SingleSnapshot = (snapshotId: ID | null, effectTrigger: number): Data.SnapshotDisplay => {
    const additionalParams: Http.HttpAdditionalParams = { id: snapshotId };
    return DataLoadEffectFactory(
      null, Http.httpCallMap.snapshot.readOne, additionalParams, null, effectTrigger
    );
  };
}
