import { Common } from '../models/common';

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
