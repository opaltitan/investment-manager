import { useState, useRef } from 'react';
import { take } from 'rxjs/operators';
import { Input } from '../models/component';
import { Buttons } from 'simple-react-buttons';
import { Modal } from 'simple-react-modal';
import { Http } from '../models/http.d';
import { Events } from '../models/events.d';
import { Enums } from '../models/enum.d';
import { ID } from '../models/type';

interface PageMeta {
  name: string;
  label: string;
  // buttonDisplayText: string;
  httpItem: Http.HttpCallMapItem;
  // eventType: Enums.SYNTHETIC_EVENTS;
  eventType: string;
};

const pages: { [x: string]: PageMeta } = {
  [Enums.PAGE_TYPE.DELETE_PORTFOLIO]: {
    name: 'portfolio',
    label: 'Portfolio',
    // buttonDisplayText: 'Portfolio',
    httpItem: Http.httpCallMap.portfolio.delete,
    eventType: Enums.SYNTHETIC_EVENTS.PORTFOLIO_UPDATE
  },
  [Enums.PAGE_TYPE.DELETE_WATCHLIST]: {
    name: 'watchlist',
    label: 'Watchlist',
    // buttonDisplayText: 'Watchlist',
    httpItem: Http.httpCallMap.watchlist.delete,
    eventType: Enums.SYNTHETIC_EVENTS.WATCHLIST_UPDATE
  },
};

export const DeleteGroupModal = (
  params: Input.DeleteGroupModal.Params
): JSX.Element => {
  const [idState, setIdState] = useState<ID | null>(null);
  const [displayState, setDisplayState] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  Events.CreateEventListeners(params.pageType, modalRef, { idStateSetter: setIdState, displayStateSetter: setDisplayState });
  console.log(params.pageType);
  console.log(pages[params.pageType]);
  const pageMeta: PageMeta = pages[params.pageType];
  let httpParams = new Http.HttpParams({ item: pageMeta.httpItem, additionalParams: { id: idState } });

  const deleteClick = (params: Http.HttpParams) => {
    Http.execute(params.type, params.url)
      .pipe(take(1))
      .subscribe(() => {
        Events.dispatchEvent(pageMeta.eventType, null);
        setDisplayState(false);
      });
  };

  const buttons: Buttons.Params = {
    parentClass: 'horizontal-group-button',
    buttons: [
      { id: 1, displayText: 'Delete', params: [deleteClick, httpParams], clickCallback: (deleteClick: (params: Http.HttpParams) => void, params: Http.HttpParams) => deleteClick(params) },
      { id: 2, displayText: 'Cancel', params: [setDisplayState], clickCallback: (setVisibilityState: (val: boolean) => void) => setVisibilityState(false) }
    ]
  };

  return (
    <div ref={modalRef} className={`delete-${pageMeta.name}-modal`}>
      <Modal.Component display={displayState} changeDisplay={setDisplayState} title={pageMeta.label}>
        <Buttons.Component params={buttons} />
      </Modal.Component>
    </div>
  );

};