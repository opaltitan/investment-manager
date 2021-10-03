import { Enums } from './enum';

export namespace Common {
      // # Common
      // ## Buttons
      // interface ButtonData {
      //   id: number;
      //   displayText: string;
      //   params: Array<any>;
      //   clickCallback: Function
      // }

      // interface ButtonData {
      //   id: number;
      //   displayText: string;
      //   params: Array<any>;
      //   paramDeriver?: (params: any) => Array<any>;
      //   clickCallback: Function;
      // }

      // // ## Expander
      // namespace Expander {
      //   interface Params {
      //     initialState?: boolean;
      //     header: JSX.Element;
      //     children: JSX.Element;
      //   }

      //   namespace Header {
      //     interface Params {
      //       expanderState: boolean;
      //       expanderStateSetter: Function;
      //       header: JSX.Element;
      //     }
      //   }
      // }

      // // ## Modal
      // interface Modal {
      //   display: boolean;
      //   changeDisplay: (val: boolean) => void;
      //   title: string;
      //   children: JSX.Element;
      // }

  // ## Title
  interface Title {
    size: Enums.TEXT_SIZE;
    text: string;
  }
}