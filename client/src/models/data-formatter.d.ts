import { Enums } from './enum';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// export = DataFormatter;

export namespace DataFormatter {
  export const numberFormatMapping = {
    [Enums.NUMBER_FORMATS.NONE]: 1,
    [Enums.NUMBER_FORMATS.THOUSANDS]: 1000,
    [Enums.NUMBER_FORMATS.MILLIONS]: 1000000,
    [Enums.NUMBER_FORMATS.BILLIONS]: 1000000000
  };

  export const formatData = (
    data: string | number | date,
    formatType: Enums.DATA_FORMAT_TYPE,
    numberFormat?: Enums.NUMBER_FORMATS
  ): string | number | date => {
    if (!data) {
      return '';
    }
    switch (formatType) {
      case Enums.DATA_FORMAT_TYPE.NUMBER:
        return Number(numberFormat ? data / numberFormatMapping[numberFormat] : data).toFixed(2).toLocaleString('en-US');
      case Enums.DATA_FORMAT_TYPE.DOLLAR:
        return formatter.format(numberFormat ? data / numberFormatMapping[numberFormat] : data);
      case Enums.DATA_FORMAT_TYPE.PERCENT:
        return `${(Number(data) * 100).toFixed(2)}%`;
      case Enums.DATA_FORMAT_TYPE.DATE:
        const dataDate = new Date(data);
        const year = dataDate.getFullYear();
        const rawMonth = dataDate.getMonth() + 1;
        const month = rawMonth < 10 ? `0${rawMonth}` : rawMonth.toString();
        const rawDay = dataDate.getDate();
        const day = rawDay < 10 ? `0${rawDay}` : rawDay.toString();

        return `${year}-${month}-${day}`;
      case Enums.DATA_FORMAT_TYPE.TEXT:
      default:
        return data;
    }
  };
};
