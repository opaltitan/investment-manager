import { useState, useRef } from 'react';
// import React from 'react';
// import { map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { Buttons } from 'simple-react-buttons';
import { Data } from '../models/data';
// import { DataTable } from '../models/inputs/data_table.d'
import { Input } from '../models/component';
import { SingleAxis } from 'react-data-tables';
import { DashboardConfig } from '../models/data_table.d';
import { Events } from '../models/events.d';
import { Effects } from '../models/effects.d';
import { Enums } from '../models/enum.d';
// import { ID } from '../models/type.js';

interface PageMeta {
  name: string;
  className: string;
  buttonDisplayText: string;
  // eventType: Enums.SYNTHETIC_EVENTS;
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
    dataPullEffect: Effects.AllPortfolios,
    configuration: DashboardConfig.PortfolioList
  },
  [Enums.PAGE_TYPE.WATCHLIST_LIST]: {
    name: 'watchlist',
    className: 'portfolios',
    buttonDisplayText: 'Watchlist',
    eventType: Enums.SYNTHETIC_EVENTS.SHOW_WATCHLIST_DELETE_MODAL,
    dataPullEffect: Effects.AllWatchlists,
    configuration: DashboardConfig.WatchlistList
  },
};

// const GroupListItem =
//   (params: Input.Component.Dashboard.GroupList.Item.Params): JSX.Element => {
//     let history = useHistory();
//     const url: string = `/${pages[params.type].name}/${params.data.id}`;
//     const detailNavigation = (url: string): void => history.push(url);
//     const listItemRef = useRef<HTMLDivElement>(null);
    
//     const showDeleteModal = (eventType: Enums.SYNTHETIC_EVENTS, id: ID): void => Events.dispatchEvent(eventType, { id: id });
//     const navigateToView = (navigationCallback: Function, url: string): void => navigationCallback(url);

//     const displayText: string = `${pages[params.type].buttonDisplayText}`;
//     const eventType: Enums.SYNTHETIC_EVENTS = pages[params.type].eventType;

//     const buttonData: Input.Common.ButtonsData = {
//       parentClass: 'horizontal-button-group dashboard-group-list-item-buttons',
//       buttons: [
//         { id: 1, displayText: `View ${displayText}`,
//           params: [detailNavigation, url],
//           clickCallback: navigateToView },
//         { id: 2, displayText: `Delete ${displayText}`,
//           params: [eventType, params.data.id],
//           clickCallback: showDeleteModal }
//       ]
//     };

//     return (
//       <div ref={listItemRef} className={`${displayText.toLowerCase()}ListItem`}>
//         <Buttons params={buttonData} />
//         <Title size={Enums.TEXT_SIZE.LARGE} text={params.data.name} />
//       </div>
//     );
// };

const GroupList = (params: Input.Dashboard.GroupList.Params): JSX.Element => {
  const [groupRefreshState, setGroupRefreshState] = useState<number>(0);
  const history = useHistory();

  const groupListEventRef = useRef<HTMLDivElement>(null);
  const eventListenerParamObj = {
    refreshState: groupRefreshState,
    refreshStateSetter: setGroupRefreshState
  };
  Events.CreateEventListeners(params.type, groupListEventRef, eventListenerParamObj);

  const data: Array<Data.Portfolio> | Array<Data.Watchlist> | null = pages[params.type].dataPullEffect(groupRefreshState);

  // const listItems: Array<JSX.Element> | null = data && data.length
  //   ? map(data, (item: Data.Portfolio | Data.Watchlist) =>
  //       <GroupListItem key={item.id} type={params.type} data={item} />
  //     )
  //   : null;

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
