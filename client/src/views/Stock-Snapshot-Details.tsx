import { useState, useRef } from 'react';
import { Enums } from '../models/enum.d';
import { Effects } from '../models/effects.d';
import { Buttons } from 'simple-react-buttons';
import { Modal } from 'simple-react-modal';
import { Expander } from 'simple-react-expander';
import { Title } from './Common';
import { Events } from '../models/events.d';
import { ID } from '../models/type';
import { Data } from '../models/data';
import { StockFinancialRatioDetails } from './Stock-Financial-Ratio-Details';
import { StockFinancialStatementDetails } from './Stock-Financial-Statement-Details';
import { NewStockSnapshotComment, StockSnapshotCommentDetails } from './Stock-Snapshot-Comment-Details';

export const StockSnapshotDetails = (): JSX.Element => {
  const [idState, setIdState] = useState<ID | null>(null);
  const [displayState, setDisplayState] = useState<boolean>(false);
  const [refreshTriggerState, setRefreshTriggerState] = useState<number>(1);
  const modalRef = useRef<HTMLDivElement>(null);

  const eventListenerParamObj: Events.ActionParams = {
    idStateSetter: setIdState,
    displayStateSetter: setDisplayState,
    refreshState: refreshTriggerState,
    refreshStateSetter: setRefreshTriggerState
  };

  Events.CreateEventListeners(Enums.PAGE_TYPE.STOCK_SNAPSHOT_DETAILS, modalRef, eventListenerParamObj);
  const stockSnapshotData: Data.SnapshotDisplay = Effects.SingleSnapshot(idState, refreshTriggerState);

  const buttonData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [{
      id: 1, displayText: 'Close', params: [setDisplayState],
      clickCallback: (setState: (val: boolean) => void) => setState(false)
    }]
  };

  const financialRatios: JSX.Element | null = stockSnapshotData && stockSnapshotData.financial_statements
    ? <StockFinancialRatioDetails data={stockSnapshotData.financial_statements} />
    : null;

  const financialStatements: JSX.Element | null = stockSnapshotData && stockSnapshotData.financial_statements
    ? <StockFinancialStatementDetails data={stockSnapshotData.financial_statements} />
    : null;

  const commentsExpanderHeader: JSX.Element =
    <div className="comments-expander-header">
      <Title size={Enums.TEXT_SIZE.MEDIUM} text="Comments" />
    </div>;

  const commentsDetails: JSX.Element | null = stockSnapshotData
    ? <Expander.Component header={commentsExpanderHeader}
                initialState={true}>
        <div className="stock-snapshot-comments">
          <NewStockSnapshotComment snapshotId={idState} />
          {
            stockSnapshotData.comments.length
              ? stockSnapshotData.comments.map((comment) =>
                  <StockSnapshotCommentDetails key={comment.stock_snapshot_id}
                                               comment={comment} />
                )
              : null
          }
        </div>
      </Expander.Component>
    : null;

  return (
    <div onClick={(e) => console.log(e)} ref={modalRef} className="stock-snapshot-details-modal">
      <Modal.Component display={displayState}
                       changeDisplay={setDisplayState}
                       title="Snapshot Details">
        <>
          <Buttons.Component params={buttonData} />
          <div className="stock-snapshot-details">
            <div className="stock-snapshot-comments-information">
              {commentsDetails}
            </div>
          </div>
          <div className="stock-financial-statement-information">
            {financialRatios}
          </div>
          <div className="stock-financial-statement-information">
            {financialStatements}
          </div>
        </>
      </Modal.Component>
    </div>
  );
};
