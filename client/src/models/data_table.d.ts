import { Enums } from './enum.d';
import { SingleAxis, DataTableEnums } from 'react-data-tables';
import { Events } from './events.d';
import { Data } from './data.d';
import { ID } from './type';

export namespace DashboardConfig {
  export const PortfolioList: (history: any) => SingleAxis.Config = (history) => {
    return {
      parentClass: 'dashboard-portfolio-list',
      fields: [
        {
          type: Enums.DATA_TABLE_FIELD_TYPE.BUTTON,
          label: '',
          columnName: 'view-portfolio',
          buttonData: {
            parentClass: 'dashboard-portfolio-list-item-buttons',
            buttons: [{
              id: 1, displayText: 'View Portfolio',
              paramDeriver: (data: any): Array<any> => {
                const url: string = `/portfolio/${data.id}`;
                const detailNavigation = (): void => history.push(url);

                return [detailNavigation];
              },
              clickCallback: (
                navigationCallback: () => void
              ): void => navigationCallback()
            }]
          }
        } as SingleAxis.Field,
        {
          type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
          label: 'Portfolio Name',
          columnName: 'name',
          dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
        } as SingleAxis.Field
      ]
    } as SingleAxis.Config;
  };
  export const WatchlistList: (history: any) => SingleAxis.Config = (history) => {
    return {
      parentClass: 'dashboard-watchlist-list',
      fields: [
        {
          type: Enums.DATA_TABLE_FIELD_TYPE.BUTTON,
          label: '',
          columnName: 'view-watchlist',
          buttonData: {
            parentClass: 'dashboard-watchlist-list-item-buttons',
            buttons: [{
              id: 1, displayText: 'View Watchlist',
              paramDeriver: (data: any): Array<any> => {
                console.log(data);
                const url: string = `/watchlist/${data.id}`;
                const detailNavigation = (): void => history.push(url);

                return [detailNavigation];
              },
              clickCallback: (navigationCallback: () => void): void => navigationCallback()
            }]
          }
        } as SingleAxis.Field,
        {
          type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
          label: 'Watchlist Name',
          columnName: 'name',
          dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
        } as SingleAxis.Field
      ]
    } as SingleAxis.Config;
  };
};

export namespace WatchlistDetailsConfig {
  export const StockList: SingleAxis.Config = {
    parentClass: 'stock-list-data-table',
    fields: [
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Ticker',
        columnName: 'ticker',
        dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.BUTTON,
        label: '',
        columnName: 'view-stock',
        buttonData: {
          parentClass: 'watchlist-details-stock-list-item-buttons',
          buttons: [{
            id: 2, displayText: 'View',
            paramDeriver: (data: any): Array<any> => {
              const stockViewer = (id: ID) => {
                Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.SHOW_STOCK_DETAILS_MODAL, { id: id });
              };
              // return [stockViewer, data.stock_id];
              return [stockViewer, data.id];
            },
            clickCallback: (viewStockCallback: (id: ID) => void, id: ID): void => viewStockCallback(id)
          }]
        }
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Stock Name',
        columnName: 'name',
        dataFormat: Enums.DATA_TABLE_FIELD_TYPE.TEXT
      } as SingleAxis.Field
    ]
  } as SingleAxis.Config;
  export const StockSnapshotList: SingleAxis.Config = {
    parentClass: 'stock-snapshot-list-data-table',
    fields: [
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Snapshot Date',
        columnName: 'snapshot_date',
        dataFormat: Enums.DATA_FORMAT_TYPE.DATE
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.BUTTON,
        label: '',
        columnName: 'view-snapshot',
        buttonData: {
          parentClass: 'watchlist-details-stock-snapshot-list-item-buttons',
          buttons: [{
            id: 2, displayText: 'View',
            paramDeriver: (data: any): Array<any> => {
              console.log(data);
              const snapshotViewer = (id: ID) => {
                Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.SHOW_STOCK_SNAPSHOT_DETAILS_MODAL, { id: id });
              };
              // return [snapshotViewer, data.stock_snapshot_id];
              return [snapshotViewer, data.id];
            },
            clickCallback: (viewSnapshotCallback: (id: ID) => void, id: ID): void => viewSnapshotCallback(id)
          }]
        }
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Avg. Rating',
        columnName: 'stats.average_rating',
        dataFormat: Enums.DATA_FORMAT_TYPE.NUMBER
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Most Recent Comment',
        columnName: 'stats.most_recent_comment_date',
        dataFormat: Enums.DATA_FORMAT_TYPE.DATE
      } as SingleAxis.Field
    ]
  } as SingleAxis.Config;
  export const StockSnapshotCommentList: SingleAxis.Config = {
    parentClass: 'stock-snapshot-comment-list-data-table',
    fields: [
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Comment Date',
        columnName: 'comment_date',
        dataFormat: Enums.DATA_FORMAT_TYPE.DATE
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Commentor',
        columnName: 'commentor',
        dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Rating',
        columnName: 'rating',
        dataFormat: Enums.DATA_FORMAT_TYPE.NUMBER
      } as SingleAxis.Field,
      {
        type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
        label: 'Comment',
        columnName: 'comment_text',
        dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
      } as SingleAxis.Field
    ]
  } as SingleAxis.Config;
}

export const InternalStockSearchConfig: SingleAxis.Config = {
  parentClass: 'internal-stock-search-data-table',
  fields: [
    {
      type: Enums.DATA_TABLE_FIELD_TYPE.BUTTON,
      label: '',
      columnName: 'add-stock',
      buttonData: {
        parentClass: 'internal-stock-search-data-table-add-stock',
        buttons: [{
          id: 1, displayText: 'Add',
          paramDeriver: (data: any): Array<any> => {
            // console.log(data);
            return [data.stockSelector, data.id];
          },
          clickCallback: (
            stockAdder: (id: ID) => void,
            id: ID
          ): void => {
            stockAdder(id);
          }
        }]
      }
    } as SingleAxis.Field,
    {
      type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
      label: 'Ticker',
      columnName: 'ticker',
      dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
    } as SingleAxis.Field,
    {
      type: Enums.DATA_TABLE_FIELD_TYPE.TEXT,
      label: 'Stock Name',
      columnName: 'stock_name',
      dataFormat: Enums.DATA_FORMAT_TYPE.TEXT
    } as SingleAxis.Field
  ]
} as SingleAxis.Config

// export namespace DataTable {
//   // # DataTable
//   // export interface Params {
//   //   // type: DATA_TABLE_FIELD_TYPE;
//   //   // type: Enums.DATA_TABLE_FIELD_TYPE;
//   //   data: Array<any>;
//   //   config: Config.Params;
//   //   expanderBody?: (params: any) => JSX.Element;
//   // }

//   // export namespace Config {
//   //   export interface Params {
//   //     parentClass: string;
//   //     fields: Array<Field.Text | Field.Button>;
//   //   }

//   //   export namespace Field {
//   //     export interface Text {
//   //       type: Enums.DATA_TABLE_FIELD_TYPE,
//   //       // cellType: DATA_TABLE_CELL_TYPE;
//   //       label: string;
//   //       columnName: string;
//   //       dataFormat: Enums.DATA_FORMAT_TYPE;
//   //       // data: any;az
//   //     }

//   //     export interface Button {
//   //       type: Enums.DATA_TABLE_FIELD_TYPE,
//   //       label: string;
//   //       columnName: string;
//   //       buttonData: Input.Common.ButtonsData
//   //     }
//   //   }
//   // }

//   export namespace Configurations {


//   }
// }
