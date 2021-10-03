import { useState, useRef } from 'react';
import { take } from 'rxjs/operators';
import { Data } from '../models/data';
import { Input } from '../models/component';
import { Buttons } from 'simple-react-buttons';
import { WatchlistDetailsConfig } from '../models/data_table.d';
import { Events } from '../models/events.d';
import { Effects } from '../models/effects.d';
import { Enums } from '../models/enum.d';
import { Http } from '../models/http.d';
import { ID } from '../models/type';
import { SingleAxis } from 'react-data-tables';

const WatchlistStockSnapshotCommentListItem = (params: Data.Snapshot): JSX.Element => {
  return (
    <div className="watchlist-stock-snapshot-comment-list">
      <SingleAxis.Component data={params.comments}
                            config={WatchlistDetailsConfig.StockSnapshotCommentList} />
    </div>
  );
};

const WatchlistStockListItem = (params: Data.Stock): JSX.Element => {
  return (
    <div className="watchlist-stock-snapshot-list">
      <SingleAxis.Component data={params.snapshots}
                            expanderBody={WatchlistStockSnapshotCommentListItem}
                            config={WatchlistDetailsConfig.StockSnapshotList} />
    </div>
  );
};

const WatchlistStockList = (params: Input.WatchlistDetails.StockList.Params): JSX.Element => {
  return (
    <div className="watchlist-stock-list">
      <SingleAxis.Component data={params.stocks}
                            expanderBody={WatchlistStockListItem}
                            config={WatchlistDetailsConfig.StockList} />
    </div>
  );
};

export const WatchlistDetails = (params: Input.WatchlistDetails.Params): JSX.Element => {
  const [refreshTriggerState, setRefreshTriggerState] = useState(1);

  const addStock = (stockId: ID): void => {
    const httpParams: Http.HttpParams = new Http.HttpParams({
      item: Http.httpCallMap.watchlist.addStock,
      additionalParams: { id: params.watchlistId }
    });
    Http.execute(httpParams.type, httpParams.url, { stockId: stockId })
      .pipe(take(1))
      .subscribe(() => {
        Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.WATCHLIST_STOCK_INSERT, null);
      });
  };

  const watchlistDetailsRef = useRef<HTMLDivElement>(null);
  const eventListenerParamObj: Events.ActionParams = {
    refreshState: refreshTriggerState,
    refreshStateSetter: setRefreshTriggerState
  };

  Events.CreateEventListeners(Enums.PAGE_TYPE.WATCHLIST_DETAILS, watchlistDetailsRef, eventListenerParamObj);

  const watchlistData: Data.Watchlist = Effects.SingleWatchlist(params.watchlistId, refreshTriggerState);

  console.log(watchlistData);
  let stockList: JSX.Element | null = watchlistData && watchlistData.stocks && watchlistData.stocks.length
    ? <WatchlistStockList watchlistId={params.watchlistId}
                          stocks={watchlistData.stocks} />
    : null;

  const addStockButtonData: Buttons.Params = {
    parentClass: 'watchlist-details-add-stock',
    buttons: [{
      id: 1, displayText: 'Add Stock', params: [],
      clickCallback: () => Events.dispatchEvent(
        Enums.SYNTHETIC_EVENTS.SHOW_INTERNAL_STOCK_SEARCH_MODAL,
        { stockSelectorCallback: addStock }
      )
    }]
  }

  return (
    <div ref={watchlistDetailsRef}
         className="watchlist-details">
      <Buttons.Component params={addStockButtonData} />
      {/* <InternalStockSearch  buttonDisplayText="Add Stock"
                            selectionCallback={addStock} />*/}
     {stockList}
    </div>
  );
};
