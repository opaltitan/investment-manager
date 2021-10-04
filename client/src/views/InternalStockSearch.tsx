import { useState, useRef, useEffect } from 'react';
import { Data } from '../models/data';
import { Buttons } from 'simple-react-buttons';
import { Modal } from 'simple-react-modal';
import { SingleAxis } from 'react-data-tables';
import { InternalStockSearchConfig } from '../models/data_table.d';
import { Events } from '../models/events.d';
import { Effects } from '../models/effects.d';
import { Enums } from '../models/enum.d';
import { ID } from '../models/type';

interface SearchResultItem extends Data.Stock {
  stockSelector: (id: ID) => void;
  stockAdderCallback: { selectorCallback: (stockId: ID) => void };
}

export const InternalStockSearch = (): JSX.Element => {
  const [searchTermState, setSearchTermState] = useState('');
  const [displayState, setDisplayState] = useState(false);
  const internalStockSearchRef = useRef<HTMLDivElement>(null);
  const [stockAdderCallback, setStockAdderCallback] = useState<{ selectorCallback: (stockId: ID) => void }>({ selectorCallback: (stockId: ID) => { console.log(stockId); return; } });

  const eventListenerParamObj: Events.ActionParams = {
    displayStateSetter: setDisplayState,
    selectorCallbackSetter: setStockAdderCallback
  };
  Events.CreateEventListeners(Enums.PAGE_TYPE.INTERNAL_STOCK_SEARCH, internalStockSearchRef, eventListenerParamObj);

  const updateSearchTerm = (e: any): void => setSearchTermState(e.target.value);

  const searchResults: Array<Data.Stock> = Effects.InternalStockSearch(searchTermState);

  let selectStock = (id: ID): void => {
    stockAdderCallback.selectorCallback(id);
    setSearchTermState('');
    setDisplayState(false);
  };

  useEffect(
    () => {
      selectStock = (id: ID) => {
        stockAdderCallback.selectorCallback(id);
        setSearchTermState('');
        setDisplayState(false);
      };
    },
    [stockAdderCallback, setSearchTermState, setDisplayState]
  );

  const modifiedSearchResults: Array<SearchResultItem> = searchResults.map((result) => {
    return { ...result,
             stockSelector: selectStock,
             stockAdderCallback: stockAdderCallback }
  });

  const dataTable: JSX.Element | null = searchResults && searchResults.length
    ? <SingleAxis.Component data={modifiedSearchResults}
                            config={InternalStockSearchConfig} />
    : null;

  const closeButtonData: Buttons.Params = {
    parentClass: 'internal-stock-search-close-buttons',
    buttons: [{
      id: 1, displayText: 'Close', params: [],
      clickCallback: () => setDisplayState(false)
    }]
  };

  return (
    <div ref={internalStockSearchRef}
         className="internal-stock-search">
      <Modal.Component title="Internal Stock Search"
             display={displayState}
             changeDisplay={setDisplayState}>
        <div className="internal-stock-search-modal-body">
          <Buttons.Component params={closeButtonData} />
          <div className="searchTermInput">
            <input type="text"
                   value={searchTermState}
                   onChange={(e) => updateSearchTerm(e)} />
          </div>
          {dataTable}
        </div>
      </Modal.Component>
    </div>
  );
};
