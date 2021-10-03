import { get } from 'lodash';
import { useState, useRef } from 'react';
import { Buttons } from 'simple-react-buttons';
import { Http } from '../models/http.d';
import { Data } from '../models/data.d';
import { take } from 'rxjs/operators';
import { Enums } from '../models/enum.d';
import { Events } from '../models/events.d';
import { ID } from '../models/type';

const decimal = '.';

const ratingInputValidator = (rawInputVal: string): boolean => {
  let decimalInstances = 0;
  [...rawInputVal].map((valChar) => {
    if (valChar === decimal) {
      decimalInstances += 1;
    }
    return valChar;
  });
  if ([...rawInputVal].includes(' ')) {
    return false;
  }
  const decimalIndex = [...rawInputVal].findIndex(valChar => valChar === decimal);
  if (decimalInstances > 1) {
    return false;
  }
  if (rawInputVal === '10.') {
    return false;
  }
  if (decimalInstances === 0 && (rawInputVal.length > 10 || (rawInputVal.length === 2 && Number(rawInputVal) > 10))) {
    return false;
  }
  if (decimalInstances === 1 && (rawInputVal.length > 4 || [3,4].includes(decimalIndex))) {
    return false;
  }
  return true;
};

interface BaseComponentParams {
  commentor?: string;
  commentText?: string;
  rating?: string;
  saveCallback: (commentor: string, commentText: string, rating: string | number) => void;
  cancelCallback: (
    setCommentor: (val: string) => any,
    setCommentText: (val: string) => any,
    setRating: (val: string | number) => any
  ) => void;
}

const BaseComponent = ({ params }: { params: BaseComponentParams }): JSX.Element => {
  const [commentorState, setCommentorState] = useState(get(params, 'commentor', ''));
  const [commentTextState, setCommentTextState] = useState(get(params, 'comment_text', ''));
  const [ratingState, setRatingState] = useState(get(params, 'rating', ''));

  const updateCommentor = (e: React.ChangeEvent<HTMLInputElement>) => setCommentorState(e.target.value.toString().slice(0, 20));
  const updateCommentText = (e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentTextState(e.target.value);
  const updateRating = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toString();

    if (!val || val === decimal) {
      setRatingState('');
      return;
    }

    if (ratingInputValidator(val)) {
      setRatingState(val);
    }
  };

  const saveButton: Buttons.Button.Params = {
    id: 1,
    displayText: 'Save',
    params: [params.saveCallback, commentorState, commentTextState, ratingState],
    clickCallback: (
      saveComment: (commentor: string, commentText: string, rating: string | number) => void,
      commentor: string,
      commentText: string,
      rating: string | number
    ) => saveComment(commentor, commentText, rating)
  };

  const cancelButton: Buttons.Button.Params = {
    id: 2,
    displayText: 'Cancel',
    params: [params.cancelCallback, setCommentorState, setCommentTextState, setRatingState],
    clickCallback: (
      cancel: (
        setCommentor: (val: string) => any,
        setCommentText: (val: string) => any,
        setRating: (val: string | number) => any
      ) => void,
      setCommentor: (val: string) => any,
      setCommentText: (val: string) => any,
      setRating: (val: string | number) => any      
    ) => cancel(setCommentor, setCommentText, setRating)
  };

  const buttonsData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [
      saveButton,
      cancelButton
    ]
  };

  return (
    <div className="comment-details-base">
      <div className="commentor-container">
        <span className="label">Commentor</span>
        <input type="text" value={commentorState} onChange={(e) => updateCommentor(e)} />
      </div>
      <div className="rating-container">
        <span className="label">Rating</span>
        <input type="text" value={ratingState} onChange={(e) => updateRating(e)} />
      </div>
      <div className="comment-text-container">
        <span className="label">Comment Text</span>
        <textarea rows={5} value={commentTextState} onChange={(e) => updateCommentText(e)} />
      </div>
      <Buttons.Component params={buttonsData} />
    </div>
  );
};

export const StockSnapshotCommentDetails = ({ comment }: { comment: Data.Comment }) => {
  const commentUpdate = (commentor: string, commentText: string, rating: string | number) => {
    const httpParams: Http.HttpParams = new Http.HttpParams({ item: Http.httpCallMap.comment.update, additionalParams: { id: comment.id } });
    Http.execute(httpParams.type, httpParams.url, { commentor: commentor, comment_text: commentText, rating: rating })
      .pipe(take(1))
      .subscribe(() => {
        Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_UPDATE, null);
      });
  };

  const cancelEdits = (
    setCommentor: (val: string) => any,
    setCommentText: (val: string) => any,
    setRating: (val: string | number) => any
  ): void => {
    setCommentor(get(comment, 'commentor', ''));
    setCommentText(get(comment, 'commentText', ''));
    setRating(get(comment, 'rating', '').toString());
  };

  const baseComponentParams: BaseComponentParams = {
    commentor: get(comment, 'commentor', ''),
    commentText: get(comment, 'commentText', ''),
    rating: get(comment, 'rating', '').toString(),
    saveCallback: commentUpdate,
    cancelCallback: cancelEdits
  };

  return (
    <div className="stock-snapshot-comment-details">
      <BaseComponent params={baseComponentParams} />
    </div>
  );
};

export const NewStockSnapshotComment = ({ snapshotId }: { snapshotId: ID | null }) => {
  const [displayState, setDisplayState] = useState(false);
  const newCommentRef = useRef();

  Events.CreateEventListeners(Enums.PAGE_TYPE.NEW_STOCK_SNAPSHOT_COMMENT, newCommentRef, { displayStateSetter: setDisplayState })

  const buttonsData: Buttons.Params = {
    parentClass: 'horizontal-button-group',
    buttons: [{
      id: 1,
      displayText: 'Add New Comment',
      params: [setDisplayState],
      clickCallback: (setState: (val: boolean) => void) => setState(true)
    }]
  };

  const commentUpdate = (commentor: string, commentText: string, rating: string | number) => {
    const httpParams: Http.HttpParams = new Http.HttpParams({ item: Http.httpCallMap.comment.create, additionalParams: { id: snapshotId } });
    Http.execute(httpParams.type, httpParams.url, { commentor: commentor, comment_text: commentText, rating: rating })
      .pipe(take(1))
      .subscribe(() => {
        Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.STOCK_SNAPSHOT_COMMENT_UPDATE, null);
      });
  };

  const cancelEdits = (
    setCommentor: (val: string) => any,
    setCommentText: (val: string) => any,
    setRating: (val: string | number) => any
  ): void => {
    setCommentor('');
    setCommentText('');
    setRating('');
    Events.dispatchEvent(Enums.SYNTHETIC_EVENTS.HIDE_NEW_SNAPSHOT_COMMENT, null);
  };

  const baseComponentParams: BaseComponentParams = {
    saveCallback: commentUpdate,
    cancelCallback: cancelEdits
  };

  const newComment: JSX.Element | null = displayState
    ? <BaseComponent params={baseComponentParams} />
    : null;
  
  const showButtons: JSX.Element | null = displayState
    ? null
    : <Buttons.Component params={buttonsData} />;

  return (
    <div className="stock-snapshot-comment-details">
      {showButtons}
      {newComment}
    </div>
  );
};
