import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { forOwn } from 'lodash';

export const syntheticEvents = {
  watchlistUpdate: 'watchlistUpdate',
  watchlistStockInsert: 'watchlistStockInsert',
  watchlistStockDelete: 'watchlistStockDelete',
  portfolioUpdate: 'portfolioUpdate',
  portfolioTransactionInsert: 'portfolioTransactionInsert',
  portfolioTransactionDelete: 'portfolioTransactionDelete',
  stockSnapshotInsert: 'stockSnapshotInsert',
  stockSnapshotUpdate: 'stockSnapshotUpdate',
  stockSnapshotDelete: 'stockSnapshotDelete',
  stockSnapshotCommentUpdate: 'stockSnapshotCommentUpdate',
  stockSnapshotCommentDelete: 'stockSnapshotCommentDelete',
  hideNewSnapshotComment: 'hideNewSnapshotComment',
  showWatchlistDeleteModal: 'showWatchlistDeleteModal',
  showWatchlistCreateModal: 'showWatchlistCreateModal',
  showPortfolioDeleteModal: 'showPortfolioDeleteModal',
  showPortfolioCreateModal: 'showPortfolioCreateModal',
  showStockDetailsModal: 'showStockDetailsModal',
  showStockSnapshotDetailsModal: 'showStockSnapshotDetailsModal'
};

export const dispatchEvent = (eventName, paramObj) => {
  forOwn(eventListenerItemConfig, (configItemVal, configItemKey) => {
    forOwn(configItemVal, (eventItemVal, eventItemKey) => {
      if (eventItemVal.eventName === eventName) {
        eventItemVal.element
          .pipe(take(1))
          .subscribe((element) => {
            if (element && element.current) {
              element.current.dispatchEvent(
                new CustomEvent(
                  eventName,
                  { bubbles: false,
                    detail: { text: () => { return { ...paramObj }; } }
                  }
                )
              )
            }
          });
      }
    });
  });
};

export const pages = {
  DASHBOARD_PORTFOLIO: 'DASHBOARD_PORTFOLIO',
  DASHBOARD_WATCHLIST: 'DASHBOARD_WATCHLIST',
  WATCHLIST_DETAILS: 'WATCHLIST_DETAILS',
  STOCK_DETAILS: 'STOCK_DETAILS',
  STOCK_SNAPSHOT_DETAILS: 'STOCK_SNAPSHOT_DETAILS',
  STOCK_SNAPSHOT_COMMENT_DETAILS: 'STOCK_SNAPSHOT_DETAILS',
  NEW_STOCK_SNAPSHOT_COMMENT: 'NEW_STOCK_SNAPSHOT_COMMENT',
  DELETE_PORTFOLIO: 'DELETE_PORTFOLIO',
  DELETE_WATCHLIST: 'DELETE_WATCHLIST',
  CREATE_WATCHLIST: 'CREATE_WATCHLIST',
  CREATE_PORTFOLIO: 'CREATE_PORTFOLIO'
};

export const eventHandlers = {
  // eventParams: { id }
  // paramObj: { idStateSetter, displayStateSetter }
  displayModalDetails: (eventParams, paramObj) => {
    console.log(eventParams);
    paramObj.idStateSetter(eventParams.id);
    paramObj.displayStateSetter(true);
  },
  // eventParams: null
  // paramObj: { displayStateSetter }
  hideNewSnapshotComment: (eventParams, paramObj) => {
    paramObj.displayStateSetter(false);
  },
  // eventParams: null
  // paramObj: { displayStateSetter }
  displayModalCreate: (eventParams, paramObj) => {
    paramObj.displayStateSetter(true);
  },
  // eventParams: null
  // paramObj: { refreshState, refreshStateSetter }
  refreshData: (eventParams, paramObj) => {
    console.log(paramObj);
    paramObj.refreshStateSetter(paramObj.refreshState + 1);
  },
};

export class EventItem {
  constructor(eventName, handlerFunc) {
    this.eventName = eventName;
    this.handlerFunc = handlerFunc;
    this.element = new BehaviorSubject(null);
  }

  setElement(element) {
    this.element.next(element);
  }
}

export const eventListenerItemConfig = {
  [pages.DELETE_PORTFOLIO]: {
    [syntheticEvents.showPortfolioDeleteModal]: new EventItem(syntheticEvents.showPortfolioDeleteModal, eventHandlers.displayModalDetails),
  },
  [pages.CREATE_PORTFOLIO]: {
    [syntheticEvents.showPortfolioCreateModal]: new EventItem(syntheticEvents.showPortfolioCreateModal, eventHandlers.displayModalCreate),
  },
  [pages.DELETE_WATCHLIST]: {
    [syntheticEvents.showWatchlistDeleteModal]: new EventItem(syntheticEvents.showWatchlistDeleteModal, eventHandlers.displayModalDetails),
  },
  [pages.CREATE_WATCHLIST]: {
    [syntheticEvents.showWatchlistCreateModal]: new EventItem(syntheticEvents.showWatchlistCreateModal, eventHandlers.displayModalCreate),
  },
  [pages.DASHBOARD_PORTFOLIO]: {
    [syntheticEvents.portfolioUpdate]: new EventItem(syntheticEvents.portfolioUpdate, eventHandlers.refreshData),
  },
  [pages.DASHBOARD_WATCHLIST]: {
    [syntheticEvents.watchlistUpdate]: new EventItem(syntheticEvents.watchlistUpdate, eventHandlers.refreshData),
  },
  [pages.WATCHLIST_DETAILS]: {
    [syntheticEvents.watchlistUpdate]: new EventItem(syntheticEvents.watchlistUpdate, eventHandlers.refreshData),
    [syntheticEvents.watchlistStockInsert]: new EventItem(syntheticEvents.watchlistStockInsert, eventHandlers.refreshData),
    [syntheticEvents.watchlistStockDelete]: new EventItem(syntheticEvents.watchlistStockDelete, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotInsert]: new EventItem(syntheticEvents.stockSnapshotInsert, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotUpdate]: new EventItem(syntheticEvents.stockSnapshotUpdate, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotDelete]: new EventItem(syntheticEvents.stockSnapshotDelete, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotCommentUpdate]: new EventItem(syntheticEvents.stockSnapshotCommentUpdate, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotCommentDelete]: new EventItem(syntheticEvents.stockSnapshotCommentDelete, eventHandlers.refreshData)
  },
  [pages.STOCK_DETAILS]: {
    [syntheticEvents.showStockDetailsModal]: new EventItem(syntheticEvents.showStockDetailsModal, eventHandlers.displayModalDetails),
    // [syntheticEvents.stockSnapshotInsert]: new EventItem(syntheticEvents.stockSnapshotInsert, eventHandlers.refreshData),
    // [syntheticEvents.stockSnapshotUpdate]: new EventItem(syntheticEvents.stockSnapshotUpdate, eventHandlers.refreshData),
    // [syntheticEvents.stockSnapshotDelete]: new EventItem(syntheticEvents.stockSnapshotDelete, eventHandlers.refreshData),
    // [syntheticEvents.stockSnapshotCommentUpdate]: new EventItem(syntheticEvents.stockSnapshotCommentUpdate, eventHandlers.refreshData),
    // [syntheticEvents.stockSnapshotCommentDelete]: new EventItem(syntheticEvents.stockSnapshotCommentDelete, eventHandlers.refreshData)
  },
  [pages.STOCK_SNAPSHOT_DETAILS]: {
    [syntheticEvents.showStockSnapshotDetailsModal]: new EventItem(syntheticEvents.showStockSnapshotDetailsModal, eventHandlers.displayModalDetails),
    [syntheticEvents.stockSnapshotUpdate]: new EventItem(syntheticEvents.stockSnapshotUpdate, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotCommentUpdate]: new EventItem(syntheticEvents.stockSnapshotCommentUpdate, eventHandlers.refreshData),
    [syntheticEvents.stockSnapshotCommentDelete]: new EventItem(syntheticEvents.stockSnapshotCommentDelete, eventHandlers.refreshData)
  },
  [pages.NEW_STOCK_SNAPSHOT_COMMENT]: {
    [syntheticEvents.hideNewSnapshotComment]: new EventItem(syntheticEvents.hideNewSnapshotComment, eventHandlers.hideNewSnapshotComment)
  },
};

export function AddEventListener(eventItem, element, paramObj) {
  useEffect(() => {
    if (element && element.current) {
      const currentElement = element.current;
      const composedHandlerFunc = (e) => {
        eventItem.handlerFunc(e && e.detail && e.detail.text() ? e.detail.text() : null, paramObj)
      };
      console.log(`event handler ${eventItem.eventName} added`);
      currentElement.addEventListener(eventItem.eventName, composedHandlerFunc);

      return () => {
        console.log(`event handler ${eventItem.eventName} removed`);
        currentElement.removeEventListener(eventItem.eventName, composedHandlerFunc);
      };
    }
  }, [paramObj, eventItem, element]);
}

export function CreateEventListeners(page, element, paramObj) {
  const eventConfig = eventListenerItemConfig[page];
  forOwn(eventConfig, (item, _key) => {
    item.setElement(element);
    item.element
      .pipe(take(1))
      .subscribe((element) => {
        AddEventListener(item, element, paramObj)
    });
  });
};
