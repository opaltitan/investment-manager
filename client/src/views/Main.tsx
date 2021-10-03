import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Enums } from '../models/enum.d';
import { Dashboard } from './Dashboard';
import { WatchlistDetails } from './Watchlist-Details';
import { InternalStockSearch } from './InternalStockSearch';
import { DeleteGroupModal } from './DeleteGroup';
import { NewGroupModal } from './NewGroup';
import { StockDetails } from './Stock-Details';
import { StockSnapshotDetails } from './Stock-Snapshot-Details';
import { ExternalStockSearch } from './ExternalStockSearch';

export const Main = (): JSX.Element => {
  let { url } = useRouteMatch();

  return (
    <div className="main">
      <InternalStockSearch />
      <NewGroupModal pageType={Enums.PAGE_TYPE.CREATE_PORTFOLIO} />
      <NewGroupModal pageType={Enums.PAGE_TYPE.CREATE_WATCHLIST} />
      <DeleteGroupModal pageType={Enums.PAGE_TYPE.DELETE_PORTFOLIO} />
      <DeleteGroupModal pageType={Enums.PAGE_TYPE.DELETE_WATCHLIST} />
      <StockDetails />
      <StockSnapshotDetails />
      <Switch>
        <Route path={`${url}/`}>
          <Dashboard />
        </Route>
        <Route path="/search">
          <ExternalStockSearch />
        </Route>
        <Route path="/watchlist/:id"
               render={(renderProps) => (<WatchlistDetails watchlistId={renderProps.match.params.id} />)} />
      </Switch>
    </div>
  );
};
