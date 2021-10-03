import { ID } from './type';

export namespace Data {
  export interface Watchlist {
    id: ID;
    name: string;
    stocks: Array<Stock>;
  }

  export interface Portfolio {
    id: ID;
    name: string;
  }

  export interface Stock {
    id: ID;
    ticker: string;
    name: string;
    description: string;
    date_added: Date;
    industry: string;
    sector: string;
    snapshots: Array<Snapshot>;
  }

  export interface StockSearch {
    ticker: string;
    stock_name: string;
  }

  export interface Snapshot {
    id: ID;
    stock_id: ID;
    snapshot_date: Date;
    comments: Array<Comment>;
  }

  export interface SnapshotDisplay extends Snapshot {
    stock: Stock;
    financial_statements: Array<FinancialStatement>;
  }

  export interface Comment {
    id: ID;
    stock_snapshot_id: ID;
    commentor: string;
    comment_text: string;
    comment_date: Date;
    rating: number;
  }

  export interface LookupType {
    id: ID;
    lookup_type: string;
    lookup_type_display: string;
  }

  export interface LookupValueType {
    id: ID;
    lookup_type_id: ID;
    lookup_type_value: string;
    lookup_type_value_display: string;
    lookup_type_value_sort: number;
  }

  export interface FinancialStatement {
    id: ID;
    stock_id: ID;
    financial_statement_type: LookupValueType;
    date_ending: Date;
    line_items: Array<LineItem>;
  }

  export interface LineItem {
    id: ID;
    stock_financial_statement_id: ID;
    line_item_type: LookupValueType;
    amount: number;
  }
}
