import { useState, useRef } from 'react';
import { take } from 'rxjs/operators';
import { Enums } from '../models/enum.d';
import { Effects } from '../models/effects.d';
import { Http } from '../models/http.d';
import { Buttons } from 'simple-react-buttons';
import { Modal } from 'simple-react-modal';
import { Expander } from 'simple-react-expander';
import { Title } from './Common';
import { Events } from '../models/events.d';
import { ID } from '../models/type';
import { Data } from '../models/data';

export const StockDetails = (): JSX.Element => {
  const [idState, setIdState] = useState<ID | null>(null);
  const [displayState, setDisplayState] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  Events.CreateEventListeners(Enums.PAGE_TYPE.STOCK_DETAILS, modalRef, { idStateSetter: setIdState, displayStateSetter: setDisplayState });
  const stockData: Data.Stock = Effects.SingleStock(idState);

  const createSnapshot = () => {
    const httpParams = new Http.HttpParams({ item: Http.httpCallMap.stock.createSnapshot, additionalParams: { id: idState }})
    Http.execute(httpParams.type, httpParams.url)
      .pipe(take(1))
      .subscribe(() => {
        Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_INSERT, null);
      });
  };

  const overviewHeader: JSX.Element =
    <div className="stock-details-overview-expander-header">
      <Title size={Enums.TEXT_SIZE.MEDIUM} text="Overview" />
    </div>;

  const stockDetails: JSX.Element | null = stockData
    ? <Expander.Component header={overviewHeader} initialState={true}>
        <div className="stock-details-body">
          <div className="stock-name">
            <span className="label">Stock Name</span>
            <span>{stockData.name}</span>
          </div>
          <div className="industry">
            <span className="label">Industry</span>
            <span>{stockData.industry}</span>
          </div>
          <div className="sector">
            <span className="label">Sector</span>
            <span>{stockData.sector}</span>
          </div>
          <div className="description">
            <span className="label">Description</span>
            <span>{stockData.description}</span>
          </div>
        </div>
      </Expander.Component>
    : null;

  const buttonData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [{
      id: 1, displayText: 'Make Snapshot', params: [idState, createSnapshot],
      clickCallback: (id: ID, createSnapshot: (id: ID) => void) => createSnapshot(id)
    }, {
      id: 2, displayText: 'Close', params: [setDisplayState],
      clickCallback: (setState: (val: boolean) => void) => setState(false)
    }]
  };

  return (
    <div ref={modalRef} className="stock-details-modal">
      <Modal.Component title="Stock Details"
             display={displayState}
             changeDisplay={setDisplayState}>
        <>
          <Buttons.Component params={buttonData} />
          <div className="stock-details">
            {stockDetails}
          </div>
        </>
      </Modal.Component>
    </div>
  );
};
