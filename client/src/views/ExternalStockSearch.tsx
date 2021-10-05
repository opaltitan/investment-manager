import { useRef, useState } from 'react';
import { useDebounce } from '../extensions/effects';
import { Enums } from '../models/enum.d';
import { Title } from './Common';
import { Http } from '../http.d';
import { Events } from '../config/events.d';
import { DataLoad } from '../config/data-load.d';
import { take } from 'rxjs/operators';
import { Buttons } from 'simple-react-buttons';
import { ID } from '../models/type';
import { Data } from '../models/data';
import { Modal } from 'simple-react-modal';

const stockAdder = (ticker: string): void => {
  const httpParams: Http.HttpParams = new Http.HttpParams({
    item: Http.httpCallMap.stock.create,
    additionalParams: { ticker: ticker }
  });
  console.log(ticker);
  Http.execute(httpParams.type, httpParams.url)
    .pipe(take(1))
    .subscribe((results: { id?: string | number, alreadyExists?: boolean }) => {
      console.log(results);
      if (results.alreadyExists) {
        Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.SHOW_EXTERNAL_STOCK_SEARCH_ALREADY_EXISTS_MODAL, null);
      } else {
        Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.SHOW_EXTERNAL_STOCK_SEARCH_ADD_MODAL, { id: results.id });
      }
      Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.CLEAR_EXTERNAL_STOCK_SEARCH_RESULTS, null);
    });
};

const SearchResultItem = ({ data }: { data : Data.StockSearch }): JSX.Element => {
  const addStockButton: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [
      { id: 1,
        displayText: 'Add Stock',
        params: [stockAdder, data.ticker],
        clickCallback: (addStock: (ticker: string) => void, ticker: string) => addStock(ticker) }
    ]
  };

  return (
    <div className="search-result-item">
      <Buttons.Component params={addStockButton} />
      <span className="ticker">{data.ticker}</span>
      <span className="stockName">{data.stock_name}</span>
    </div>
  );
};

const StockAddSuccess = (): JSX.Element => {
  const [displayState, setDisplayState] = useState<boolean>(false);
  const [idState, setIdState] = useState<ID | null>(null);
  const [refreshTriggerState, setRefreshTriggerState] = useState<number>(1);
  const modalRef = useRef<HTMLDivElement>(null);

  const eventListenerParamObj: Events.ActionParams = {
    idStateSetter: setIdState,
    displayStateSetter: setDisplayState,
    refreshState: refreshTriggerState,
    refreshStateSetter: setRefreshTriggerState
  };

  Events.CreateEventListeners(Enums.PAGE_TYPE.EXTERNAL_STOCK_SEARCH_SUCCESS_MODAL, modalRef, eventListenerParamObj);
  const stockData: Data.Stock = DataLoad.SingleStock(idState);

  const buttonData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [{
      id: 1, displayText: 'Close', params: [setDisplayState],
      clickCallback: (setState: (val: boolean) => void) => setState(false)
    }]
  };

  const stockDisplay: JSX.Element | null = stockData ?
    <div className="external-stock-search-success-body">
      <div className="stock-data">
        <span className="ticker">{stockData.ticker}</span>
        <span className="stockName">{stockData.name}</span>
      </div>
      <Buttons.Component params={buttonData} />
    </div>
    : null;

  return (
    <div ref={modalRef} className="external-stock-search-success">
      <Modal.Component display={displayState}
                       changeDisplay={setDisplayState}
                       title="External Stock Pull Success">
        <>
          {stockDisplay}
        </>
      </Modal.Component>
    </div>
  );
};

const StockAlreadyImported = (): JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [displayState, setDisplayState] = useState<boolean>(false);
  const eventListenerParamObj: Events.ActionParams = {
    displayStateSetter: setDisplayState
  };

  Events.CreateEventListeners(Enums.PAGE_TYPE.EXTERNAL_STOCK_SEARCH_ALREADY_EXISTS, modalRef, eventListenerParamObj);

  const buttonData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [{
      id: 1, displayText: 'Close', params: [setDisplayState],
      clickCallback: (setState: (val: boolean) => void) => setState(false)
    }]
  };

  return (
    <div ref={modalRef} className="stock-already-imported">
      <Modal.Component display={displayState}
                       changeDisplay={setDisplayState}
                       title="Stock Already Imported">
        <div className="stock-already-imported-body">
          <span>The stock you've chosen already exists within the system. Please select another</span>
          <Buttons.Component params={buttonData} />
        </div>
      </Modal.Component>
    </div>
  )
};

export const ExternalStockSearch = (): JSX.Element => {
  const [tickerState, setTickerState] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  const eventListenerParamObj: Events.ActionParams = {
    searchInputSetter: setTickerState
  };
  Events.CreateEventListeners(Enums.PAGE_TYPE.EXTERNAL_STOCK_SEARCH, modalRef, eventListenerParamObj);

  const updateTicker = (e: React.ChangeEvent<HTMLInputElement>) => setTickerState(e.target.value);
  const debouncedTicker: string = useDebounce(tickerState, 3000);
  const searchListData: Array<Data.StockSearch> = DataLoad.ExternalStockSearch(debouncedTicker);

  const searchListItems: Array<JSX.Element> | null = searchListData
    ? searchListData.map((item) =>
        <SearchResultItem key={item.ticker} data={item} />
      )
    : null;

  return (
    <div ref={modalRef} className="search-page">
      <StockAddSuccess />
      <StockAlreadyImported />
      <Title size={Enums.TEXT_SIZE.MEDIUM} text="Stock Search" />
      <div className="search-box">
        <input type="text" value={tickerState} onChange={(e) => updateTicker(e)} />
      </div>
      <div className="search-results">
        {searchListItems}
      </div>
    </div>
  )
};
