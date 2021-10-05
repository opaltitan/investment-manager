import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { forOwn } from 'lodash';
import { Enums } from '../models/enum.d';
import { ID } from '../models/type';

const eventHandlers: {
  [x: string]: (
    incomingParams: Events.IncomingParams | null,
    actionParams: Events.ActionParams
  ) => any
} = {
  // incomingParams: { id }
  // actionParams: { idStateSetter, displayStateSetter }
  displayModalDetails: (
    incomingParams: Events.IncomingParams,
    actionParams: {
      idStateSetter: Events.ActionParams.idStateSetter,
      displayStateSetter: Events.ActionParams.displayStateSetter
    }
  ): void => {
      actionParams.idStateSetter(incomingParams.id);
      actionParams.displayStateSetter(true);
  },
  // incomingParams: null
  // actionParams: { displayStateSetter }
  hideNewSnapshotComment: (
    incomingParams: null,
    actionParams: {
      displayStateSetter: Events.ActionParams.displayStateSetter
    }
  ): void => {
    actionParams.displayStateSetter(false);
  },
  displayModalCreate: (
    incomingParams: null,
    actionParams: {
      displayStateSetter: Events.ActionParams.displayStateSetter
    }
  ): void => {
    actionParams.displayStateSetter(true);
  },
  refreshData: (
    incomingParams: null,
    actionParams: {
      refreshState: Events.ActionParams.refreshState,
      refreshStateSetter: Events.ActionParams.refreshStateSetter
    }
  ): void => {
    console.log(actionParams);
    actionParams.refreshStateSetter(actionParams.refreshState + 1);
  },
  showInternalSearchModal: (
    incomingParams: Events.IncomingParams,
    actionParams: {
      displayStateSetter: Events.ActionParams.displayStateSetter,
      selectorCallbackSetter: Events.ActionParams.selectorCallbackSetter
    }
  ): void => {
    console.log('eventHandlers.showInternalSearchModal called');
    console.log(incomingParams);
    console.log(actionParams);
    actionParams.displayStateSetter(true);
    actionParams.selectorCallbackSetter({ selectorCallback: incomingParams.stockSelectorCallback });
  },
  clearSearchTerm: (
    incomingParams: Events.IncomingParams,
    actionParams: {
      searchInputSetter: Events.ActionParams.searchInputSetter
    }
  ): void => {
    actionParams.searchInputSetter('');
  }
};

interface EventItemParams {
  eventType: string;
  handlerFunc: (incomingParams: Events.IncomingParams | null, actionParams: Events.ActionParams) => void;
}

class EventItem {
  // public eventType: Enums.SYNTHETIC_EVENTS;
  public eventType: string;
  public handlerFunc: () => any;
  public element: BehaviorSubject<RefObject<HTMLDivElement> | null>;

  constructor(eventType: EventItemParams.eventType, handlerFunc: EventItemParams.handlerFunc ) {
    this.eventType = eventType;
    this.handlerFunc = handlerFunc;
    this.element = new BehaviorSubject(null);
  }

  public setElement(el: RefObject<HTMLDivElement>): void {
    this.element.next(el);
  }
}

export namespace Events {
  export interface IncomingParams {
    id?: ID;
    stockSelectorCallback?: (stockId: ID) => void;
  }
  
  export interface ActionParams {
    selectorCallbackSetter?: (selectorCallback: { selectorCallback: (stockId: ID) => void }) => void;
    idStateSetter?: (id: ID) => any;
    displayStateSetter?: (display: boolean) => any;
    refreshState?: number;
    refreshStateSetter?: (refreshIteration: number) => any;
    searchInputSetter?: (inputVal: string) => void;
  }

  
  export const eventListenerItemConfig: { [x: string]: { [x: string]: EventItem } } = {
    [Enums.PAGE_TYPE.DELETE_PORTFOLIO]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_PORTFOLIO_DELETE_MODAL]: new EventItem(
        Enums.SYNTHETIC_EVENTS.SHOW_PORTFOLIO_DELETE_MODAL,
        eventHandlers.displayModalDetails
      )
    },
    [Enums.PAGE_TYPE.CREATE_PORTFOLIO]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_PORTFOLIO_CREATE_MODAL]: new EventItem(
        Enums.SYNTHETIC_EVENTS.SHOW_PORTFOLIO_CREATE_MODAL,
        eventHandlers.displayModalCreate
      )
    },
    [Enums.PAGE_TYPE.DELETE_WATCHLIST]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_DELETE_MODAL]: new EventItem(
        Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_DELETE_MODAL,
        eventHandlers.displayModalDetails
      )
    },
    [Enums.PAGE_TYPE.CREATE_WATCHLIST]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_CREATE_MODAL]: new EventItem(
        Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_CREATE_MODAL,
        eventHandlers.displayModalCreate
      )
    },
    [Enums.PAGE_TYPE.PORTFOLIO_LIST]: {
      [Enums.SYNTHETIC_EVENTS.PORTFOLIO_UPDATE]: new EventItem(
        Enums.SYNTHETIC_EVENTS.PORTFOLIO_UPDATE,
        eventHandlers.refreshData
      )
    },
    [Enums.PAGE_TYPE.WATCHLIST_LIST]: {
      [Enums.SYNTHETIC_EVENTS.WATCHLIST_UPDATE]: new EventItem(
        Enums.SYNTHETIC_EVENTS.WATCHLIST_UPDATE,
        eventHandlers.refreshData
      )
    },
    [Enums.PAGE_TYPE.WATCHLIST_DETAILS]: {
      [Enums.SYNTHETIC_EVENTS.WATCHLIST_UPDATE]: new EventItem(Enums.SYNTHETIC_EVENTS.WATCHLIST_UPDATE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.WATCHLIST_STOCK_INSERT]: new EventItem(Enums.SYNTHETIC_EVENTS.WATCHLIST_STOCK_INSERT, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.WATCHLIST_STOCK_DELETE]: new EventItem(Enums.SYNTHETIC_EVENTS.WATCHLIST_STOCK_DELETE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_INSERT]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_INSERT, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_UPDATE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_UPDATE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_DELETE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_DELETE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_UPDATE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_UPDATE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_DELETE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_DELETE, eventHandlers.refreshData)
    },
    [Enums.PAGE_TYPE.STOCK_DETAILS]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_STOCK_DETAILS_MODAL]: new EventItem(Enums.SYNTHETIC_EVENTS.SHOW_STOCK_DETAILS_MODAL, eventHandlers.displayModalDetails)
    },
    [Enums.PAGE_TYPE.STOCK_SNAPSHOT_DETAILS]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_STOCK_SNAPSHOT_DETAILS_MODAL]: new EventItem(Enums.SYNTHETIC_EVENTS.SHOW_STOCK_SNAPSHOT_DETAILS_MODAL, eventHandlers.displayModalDetails),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_UPDATE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_UPDATE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_UPDATE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_UPDATE, eventHandlers.refreshData),
      [Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_DELETE]: new EventItem(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_DELETE, eventHandlers.refreshData)
    },
    [Enums.PAGE_TYPE.NEW_STOCK_SNAPSHOT_COMMENT]: {
      [Enums.SYNTHETIC_EVENTS.HIDE_NEW_SNAPSHOT_COMMENT]: new EventItem(Enums.SYNTHETIC_EVENTS.HIDE_NEW_SNAPSHOT_COMMENT, eventHandlers.hideNewSnapshotComment)
    },
    [Enums.PAGE_TYPE.INTERNAL_STOCK_SEARCH]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_INTERNAL_STOCK_SEARCH_MODAL]: new EventItem(Enums.SYNTHETIC_EVENTS.SHOW_INTERNAL_STOCK_SEARCH_MODAL, eventHandlers.showInternalSearchModal)
    },
    [Enums.PAGE_TYPE.EXTERNAL_STOCK_SEARCH_SUCCESS_MODAL]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_EXTERNAL_STOCK_SEARCH_ADD_MODAL]: new EventItem(Enums.SYNTHETIC_EVENTS.SHOW_EXTERNAL_STOCK_SEARCH_ADD_MODAL, eventHandlers.displayModalDetails)
    },
    [Enums.PAGE_TYPE.EXTERNAL_STOCK_SEARCH]: {
      [Enums.SYNTHETIC_EVENTS.CLEAR_EXTERNAL_STOCK_SEARCH_RESULTS]: new EventItem(Enums.SYNTHETIC_EVENTS.CLEAR_EXTERNAL_STOCK_SEARCH_RESULTS, eventHandlers.clearSearchTerm)
    },
    [Enums.PAGE_TYPE.EXTERNAL_STOCK_SEARCH_ALREADY_EXISTS]: {
      [Enums.SYNTHETIC_EVENTS.SHOW_EXTERNAL_STOCK_SEARCH_ALREADY_EXISTS_MODAL]: new EventItem(Enums.SYNTHETIC_EVENTS.SHOW_EXTERNAL_STOCK_SEARCH_ALREADY_EXISTS_MODAL, eventHandlers.displayModalCreate)
    }
  };

  export const dispatchEvent = (event: string, incomingParams: IncomingParams | null) => {
    forOwn(eventListenerItemConfig, (configItemVal: { [x: string]: EventItem }, configItemKey) => {
      forOwn(configItemVal, (eventItemVal: EventItem, eventItemKey) => {
        if(eventItemVal.eventType === event) {
          eventItemVal.element
            .pipe(take(1))
            .subscribe((element) => {
              if (element && element.current) {
                element.current.dispatchEvent(
                  new CustomEvent(
                    event,
                    { bubbles: false,
                      detail: { text: () => { return { ...incomingParams }; } }
                    }
                  )
                );
              }
            });
        }
      });
    });
  };

  export const AddEventListener = (eventItem: EventItem, element: HTMLDivElement | null, actionParams: ActionParams) => {
    useEffect(() => {
      if (element && element.current) {
        const currentElement = element.current;
        const composedHandlerFunc = (e) => {
          eventItem.handlerFunc(e && e.detail && e.detail.text() ? e.detail.text() : null, actionParams)
        };
        currentElement.addEventListener(eventItem.eventType, composedHandlerFunc);

        return () => {
          currentElement.removeEventListener(eventItem.eventType, composedHandlerFunc);
        };
      }
    }, [actionParams, eventItem, element]);
  };

  export const CreateEventListeners = (page: Enums.PAGE_TYPE, element: RefObject<HTMLDivElement>, actionParams: ActionParams) => {
    const eventConfig: { [x: string]: EventItem } = eventListenerItemConfig[page];
    forOwn(eventConfig, (item, _key) => {
      item.setElement(element);
      item.element
        .pipe(take(1))
        .subscribe((el) => {
          AddEventListener(item, el, actionParams);
        });
    });
  };
}
