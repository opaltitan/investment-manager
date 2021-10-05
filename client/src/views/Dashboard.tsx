import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Buttons } from 'simple-react-buttons';
import { Data } from '../models/data';
import { Input } from '../models/component-input';
import { SingleAxis } from 'react-data-tables';
import { DashboardConfig } from '../config/data_table.d';
import { Events } from '../config/events.d';
import { DataLoad } from '../config/data-load.d';
import { Enums } from '../models/enum.d';

interface PageMeta {
  name: string;
  className: string;
  buttonDisplayText: string;
  eventType: string;
  dataPullEffect: Function,
  configuration: (history: any) => SingleAxis.Config
};

const pages: { [x: string]: PageMeta } = {
  [Enums.PAGE_TYPE.PORTFOLIO_LIST]: {
    name: 'portfolio',
    className: 'portfolios',
    buttonDisplayText: 'Portfolio',
    eventType: Enums.SYNTHETIC_EVENTS.SHOW_PORTFOLIO_DELETE_MODAL,
    dataPullEffect: DataLoad.AllPortfolios,
    configuration: DashboardConfig.PortfolioList
  },
  [Enums.PAGE_TYPE.WATCHLIST_LIST]: {
    name: 'watchlist',
    className: 'portfolios',
    buttonDisplayText: 'Watchlist',
    eventType: Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_DELETE_MODAL,
    dataPullEffect: DataLoad.AllWatchlists,
    configuration: DashboardConfig.WatchlistList
  },
};

const GroupList = (params: Input.Dashboard.GroupList.Params): JSX.Element => {
  const [groupRefreshState, setGroupRefreshState] = useState<number>(0);
  const history = useHistory();

  const groupListEventRef = useRef<HTMLDivElement>(null);
  const eventListenerParamObj: Events.ActionParams = {
    refreshState: groupRefreshState,
    refreshStateSetter: setGroupRefreshState
  };
  Events.CreateEventListeners(params.type, groupListEventRef, eventListenerParamObj);

  const data: Array<Data.Portfolio> | Array<Data.Watchlist> | null = pages[params.type].dataPullEffect(groupRefreshState);

  const dataTable: JSX.Element | null = data && data.length
    ? <SingleAxis.Component data={data}
                            config={pages[params.type].configuration(history)} />
    : null;

  const className = pages[params.type].className;

  return (
    <div ref={groupListEventRef} className={className}>
      {dataTable}
    </div>
  );
};

export const Dashboard = (): JSX.Element => {
  const dashboardEventRef = useRef<HTMLDivElement>(null);
  const showNewGroup = (eventType: Enums.SYNTHETIC_EVENTS): void => Events.dispatchEvent(eventType, null);

  const buttonData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [
      { id: 1, displayText: `New ${pages[Enums.PAGE_TYPE.PORTFOLIO_LIST].buttonDisplayText}`,
               params: [Enums.SYNTHETIC_EVENTS.SHOW_PORTFOLIO_CREATE_MODAL], clickCallback: showNewGroup },
      { id: 2, displayText: `New ${pages[Enums.PAGE_TYPE.WATCHLIST_LIST].buttonDisplayText}`,
               params: [Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_CREATE_MODAL], clickCallback: showNewGroup }
    ]
  };

  return (
    <div ref={dashboardEventRef} className="dashboard">
      <div className="dashboard-buttons">
        <Buttons.Component params={buttonData} />
      </div>
      <GroupList type={Enums.PAGE_TYPE.PORTFOLIO_LIST} />
      <GroupList type={Enums.PAGE_TYPE.WATCHLIST_LIST} />
    </div>
  );
}
