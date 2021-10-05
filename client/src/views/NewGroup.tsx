import { useState, useRef } from 'react';
import { take } from 'rxjs/operators';
import { Input } from '../models/component-input';
import { Buttons } from 'simple-react-buttons';
import { Modal } from 'simple-react-modal';
import { Http } from '../http.d';
import { Events } from '../config/events.d';
import { Enums } from '../models/enum.d';

interface PageMeta {
  name: string;
  label: string;
  httpItem: Http.HttpCallMapItem;
  eventType: string;
}

const pages: { [x: string]: PageMeta } = {
  [Enums.PAGE_TYPE.CREATE_PORTFOLIO]: {
    name: 'portfolio',
    label: 'Portfolio',
    httpItem: Http.httpCallMap.portfolio.create,
    eventType: Enums.SYNTHETIC_EVENTS.PORTFOLIO_UPDATE
  },
  [Enums.PAGE_TYPE.CREATE_WATCHLIST]: {
    name: 'watchlist',
    label: 'Watchlist',
    httpItem: Http.httpCallMap.watchlist.create,
    eventType: Enums.SYNTHETIC_EVENTS.WATCHLIST_UPDATE
  }
};

export const NewGroupModal = (
  params: Input.NewGroupModal.Params
): JSX.Element => {
  const [displayState, setDisplayState] = useState<boolean>(false);
  const [nameState, setNameState] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  Events.CreateEventListeners(params.pageType, modalRef, { displayStateSetter: setDisplayState });
  const pageMeta: PageMeta = pages[params.pageType];

  const newClick = (name: string): void => {
    const httpParams: Http.HttpParams = new Http.HttpParams({ item: pageMeta.httpItem });
    Http.execute(httpParams.type, httpParams.url, { name: name })
      .pipe(take(1))
      .subscribe(() => {
        Events.dispatchEvent(pageMeta.eventType, null);
        setDisplayState(false);
      });
  };

  const updateName = (e: any): void => setNameState(e.target.value);

  const buttonData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [
      { id: 1, displayText: 'New', params: [newClick, nameState], clickCallback: (newClick: (name: string) => void, name: string) => newClick(name) },
      { id: 2, displayText: 'Close', params: [setDisplayState], clickCallback: (setState: (val: boolean) => void) => setState(false) }
    ]
  };

  return (
    <div ref={modalRef} className={`new-${pageMeta.name}-modal`}>
      <Modal.Component display={displayState} changeDisplay={setDisplayState} title={`New ${pageMeta.label}`}>
        <div className="new-group-modal-interior">
          <input type="text" value={nameState} onChange={(e) => updateName(e)} />
          <Buttons.Component params={buttonData} />
        </div>
      </Modal.Component>
    </div>
  );
};
