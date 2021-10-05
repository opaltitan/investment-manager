import { Enums } from './enum';
import { Data } from './data';
import { ID } from './type';

export namespace Input {
  // Dashboard
  export namespace Dashboard {
    export namespace GroupList {
      export interface Params {
        type: Enums.PAGE_TYPE;
      }

      export namespace Item {
        export interface Params {
          type: Enums.PAGE_TYPE;
          data: Data.Watchlist | Data.Portfolio
        }
      }
    }
  }

  // StockList Component
  export namespace StockList {
    export interface Params {
      stocks: Array<Data.Stock>;
    }

    export namespace Item {
      export interface Params extends Data.Stock {}
    }
  }

  // SnapshotList Component
  export namespace SnapshotList {
    export interface Params {
      snapshots: Array<Data.Snapshot>;
    }

    export namespace Item {
      export interface Params extends Data.Snapshot {}
    }
  }

  // CommentList Component
  export namespace CommentList {
    export interface Params {
      comments: Array<Data.Comment>;
    }

    export namespace Item {
      export interface Params extends Data.Comment {}
    }
  }

  // Watchlist Details Page
  export namespace WatchlistDetails {
    export interface Params {
      watchlistId: ID;
    }
    export namespace StockList {
      export interface Params extends Input.StockList.Params {
        watchlistId: ID;
      }

      export namespace Item {
        export interface Params extends Input.StockList.Item.Params {
          watchlistId: ID;
        }

        export namespace SnapshotList {
          export interface Params extends Input.SnapshotList.Params {
            stockId: ID;
          }

          export namespace Item {
            export interface Params extends Input.SnapshotList.Item.Params {}

            export namespace CommentList {
              export interface Params extends Input.CommentList.Params {
                stockSnapshotId: ID;
              }

              export namespace Item {
                export interface Params extends Input.CommentList.Item.Params {}
              }
            }
          }
        }
      }
    }
  }

  // Stock Details Page
  export namespace StockDetails {
    export interface Params {
      id: ID;
    }

    export namespace SnapshotList {
      export interface Params extends Input.SnapshotList.Params {
        stockId: ID;
      }

      export namespace Item {
        export interface Params extends Input.SnapshotList.Item.Params {}

        export namespace CommentList {
          export interface Params extends Input.CommentList.Params {
            stockSnapshotId: ID;
          }

          export namespace Item {
            export interface Params extends Input.CommentList.Item.Params {}
          }
        }
      }
    }
  }

  // Snapshot Details Page
  export namespace SnapshotDetails {
    export namespace FinancialStatementDetails {
      export interface Params {
        data: Array<FinancialStatement>;
      }
    }

    export namespace FinancialRatioDetails {
      export interface Params {
        data: Array<FinancialStatement>;
      }
    }

    export namespace CommentList {
      export interface Params extends InputCommentList.Params {}

      export namespace Item {
        export interface Params extends Input.CommentList.Item.Params {}
      }
    }
  }

  export namespace InternalStockSearch {
    export interface Params {
      buttonText: string;
      selectionCallback: (id: ID) => void
    }
  }

  export namespace PortfolioDetails {
    export interface Params {
      id: number | string;
    }
  }

  export namespace NewGroupModal {
    export interface Params {
      pageType: Enums.PAGE_TYPE;
    }
  }

  export namespace DeleteGroupModal {
    export interface Params {
      pageType: Enums.PAGE_TYPE;
    }
  }
}