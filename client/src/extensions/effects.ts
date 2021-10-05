import { useState, useEffect } from 'react';
import { Observable, of, Subscription } from 'rxjs';
import { Http } from '../http.d';

export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay]
  );

  return debouncedValue;
};


const standardObsCallback = (data: any, setStateData: (data: any) => void): void => {
  setStateData(data);
};

export const dataPullEffectCallback = (
  httpType: string,
  httpUrl: string,
  httpBody: Object | null,
  validUrlCheck: boolean,
  setStateData: (newStateData: any) => void,
  obsCallback = standardObsCallback
) => {
  const obs: Observable<any> = validUrlCheck
    ? Http.execute(httpType, httpUrl, httpBody)
    : of(null);
  const sub: Subscription = obs.subscribe((data) => {
    obsCallback(data, setStateData);
  });

  return sub.unsubscribe;
};

export const DataLoadEffectFactory = (
  initialDataVal: any,
  httpCallMapItem: Http.HttpCallMapItem,
  additionalHttpParams: Http.HttpAdditionalParams,
  httpBody: Object | null,
  effectTrigger: number,
  effectCallback = dataPullEffectCallback,
  obsCallback = standardObsCallback
): any => {
  const [stateData, setStateData] = useState(initialDataVal);
  const httpParams: Http.HttpParams = new Http.HttpParams({ item: httpCallMapItem, additionalParams: additionalHttpParams ? additionalHttpParams : null });
  const stringifiedHttpBody: string | null = httpBody ? JSON.stringify(httpBody) : null;

  useEffect(
    () => {
      effectCallback(
        httpParams.type,
        httpParams.url,
        stringifiedHttpBody,
        httpParams.validUrl,
        setStateData,
        obsCallback
      );
    },
    [httpParams.type, httpParams.url, stringifiedHttpBody, httpParams.validUrl, setStateData, obsCallback, effectTrigger, effectCallback]
  );

  return stateData;
};