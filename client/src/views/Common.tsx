// import { useState } from 'react';
import { Common } from '../models/common';

// const ExpanderHeader = (params: Input.Common.Expander.Header.Params): JSX.Element => {
//   return (
//     <div className="expander-header">
//       <div className="expander-header-icon-container"
//           onClick={() => params.expanderStateSetter(!params.expanderState)}>
//         <span className="expander-header-icon">{ params.expanderState ? '-' : '+' }</span>
//       </div>
//       {params.header}
//     </div>
//   );
// };

// export const Expander = (params: Input.Common.Expander.Params): JSX.Element => {
//   const [expanderState, setExpanderState] = useState<boolean>(!!params.initialState);
//   const expanderBody: JSX.Element | null = expanderState
//     ? <div className="expander-body">{params.children}</div>
//     : null;

//   return (
//     <div className="expander">
//       <ExpanderHeader header={params.header}
//                       expanderState={expanderState}
//                       expanderStateSetter={setExpanderState} />
//       {expanderBody}
//     </div>
//   );
// };

// export const Modal = (params: Input.Common.Modal): JSX.Element | null => {
//   if (!params.display) {
//     return null;
//   }

//   return (
//     <div
//       onClick={() => params.changeDisplay(false)}
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         bottom: 0,
//         right: 0,
//         background: "rgba(0, 0, 0, 0.15)"
//       }}
//     >
//       <div
//         className="modal"
//         onClick={(e) => e.stopPropagation()}
//         style={{
//           position: "absolute",
//           background: "#fff",
//           top: 25,
//           left: "10%",
//           right: "10%",
//           padding: 15,
//           border: "2px solid #444"
//         }}
//       >
//         <h1>{params.title}</h1>
//         {params.children}
//       </div>
//     </div>
//   );
// }

export const Title = (params: Common.Title): JSX.Element | null => {
  if (!params.size) {
    console.error('missing size param');
    return null;
  }

  let titleMarkup: Function = (size: string, text: string): JSX.Element => {
    const sizeMapping: { [x: string]: JSX.Element } = {
      'large': <h1>{text}</h1>,
      'medium': <h3>{text}</h3>,
      'small': <h4>{text}</h4>
    };

    return sizeMapping[size];
  };

  return (
    <div className="title">
      {titleMarkup(params.size, params.text)}
    </div>
  );
}
