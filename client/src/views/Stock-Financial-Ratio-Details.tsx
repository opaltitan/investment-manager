import { find, findIndex, mean } from 'lodash';
import { DualAxis } from 'react-data-tables';
import { DataFormatter } from 'simple-text-display-formatter';
import { Data } from '../models/data';

const lineItemNames = {
  totalRevenue: 'totalRevenue',
  netIncome: 'netIncomeFromContinuingOperations',
  operatingCashFlow: 'operatingCashflow',
  changeInOperatingAssets: 'changeInOperatingAssets',
  changeInOperatingLiabilities: 'changeInOperatingLiabilities',
  cashflowFromInvestment: 'cashflowFromInvestment'
}

const ratioNames: { [x: string]: string } = {
  quarterlyRevenueGrowth: 'quarterlyRevenueGrowth',
  averageTTMRevenueGrowth: 'averageTTMRevenueGrowth',
  totalTTMRevenueGrowth: 'totalTTMRevenueGrowth',
  quarterlyIncomeGrowth: 'quarterlyIncomeGrowth',
  averageTTMIncomeGrowth: 'averageTTMIncomeGrowth',
  totalTTMIncomeGrowth: 'totalTTMIncomeGrowth',
  quarterlyOperatingCashflowGrowth: 'quarterlyOperatingCashflowGrowth',
  averageTTMOperatingCashflowGrowth: 'averageTTMOperatingCashflowGrowth',
  totalTTMOperatingCashflowGrowth: 'totalTTMOperatingCashflowGrowth',
  quarterlyFreeCashflowGrowth: 'quarterlyFreeCashflowGrowth',
  averageTTMFreeCashflowGrowth: 'averageTTMFreeCashflowGrowth',
  totalTTMFreeCashflowGrowth: 'totalTTMFreeCashflowGrowth',
};

const yAxisItems: Array<DualAxis.Field> = [
  { columnName: ratioNames.quarterlyRevenueGrowth,
    displayValue: 'Quarterly Revenue Growth',
    rawValue: 'Quarterly Revenue Growth' },
  { columnName: ratioNames.averageTTMRevenueGrowth,
    displayValue: 'Average TTM Revenue Growth',
    rawValue: 'Average TTM Revenue Growth' },
  { columnName: ratioNames.totalTTMRevenueGrowth,
    displayValue: 'Total TTM Revenue Growth',
    rawValue: 'Total TTM Revenue Growth' },
  { columnName: ratioNames.quarterlyIncomeGrowth,
    displayValue: 'Quarterly Income Growth',
    rawValue: 'Quarterly Income Growth' },
  { columnName: ratioNames.averageTTMIncomeGrowth,
    displayValue: 'Average TTM Income Growth',
    rawValue: 'Average TTM Income Growth' },
  { columnName: ratioNames.totalTTMIncomeGrowth,
    displayValue: 'Total TTM Income Growth',
    rawValue: 'Total TTM Income Growth' },
  { columnName: ratioNames.quarterlyOperatingCashflowGrowth,
    displayValue: 'Quarterly OCF Growth',
    rawValue: 'Quarterly OCF Growth' },
  { columnName: ratioNames.averageTTMOperatingCashflowGrowth,
    displayValue: 'Average TTM OCF Growth',
    rawValue: 'Average TTM OCF Growth' },
  { columnName: ratioNames.totalTTMOperatingCashflowGrowth,
    displayValue: 'Total TTM OCF Growth',
    rawValue: 'Total TTM OCF Growth' },
  { columnName: ratioNames.quarterlyFreeCashflowGrowth,
    displayValue: 'Quarterly FCF Growth',
    rawValue: 'Quarterly FCF Growth' },
  { columnName: ratioNames.averageTTMFreeCashflowGrowth,
    displayValue: 'Average TTM FCF Growth',
    rawValue: 'Average TTM FCF Growth' },
  { columnName: ratioNames.totalTTMFreeCashflowGrowth,
    displayValue: 'Total TTM FCF Growth',
    rawValue: 'Total TTM FCF Growth' }
];

const currentQuarterArrayIndex = (quarterDate: Date, data: Array<Data.FinancialStatement>): number => {
  return findIndex(data, (finStat) => finStat.date_ending === quarterDate);
};

const lineItemAmount = (finStat: Data.FinancialStatement, lineItemType: string): number => {
  const foundLineItem: Data.LineItem | undefined = find(finStat.line_items, (lineItem) => lineItem.line_item_type.lookup_type_value === lineItemType);
  return foundLineItem ? foundLineItem.amount : 0;
};


const ratioCalculations: { [x: string]: (y: DualAxis.Field, data: Array<Data.FinancialStatement>) => number } = {
  [ratioNames.quarterlyRevenueGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentRevenue: number = lineItemAmount(data[currentQuarterIndex], lineItemNames.totalRevenue);
    const firstPriorRevenue: number = lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.totalRevenue);

    return (currentRevenue - firstPriorRevenue) / firstPriorRevenue;
  },
  [ratioNames.averageTTMRevenueGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentRevenue: number = lineItemAmount(data[currentQuarterIndex], lineItemNames.totalRevenue);
    const firstPriorRevenue: number = lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.totalRevenue);
    const secondPriorRevenue: number = lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.totalRevenue);
    const thirdPriorRevenue: number = lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.totalRevenue);

    return mean([
      (currentRevenue - firstPriorRevenue) / firstPriorRevenue,
      (firstPriorRevenue - secondPriorRevenue) / secondPriorRevenue,
      (secondPriorRevenue - thirdPriorRevenue) / thirdPriorRevenue
    ]);
  },
  [ratioNames.totalTTMRevenueGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentRevenue: number = lineItemAmount(data[currentQuarterIndex], lineItemNames.totalRevenue);
    const thirdPriorRevenue: number = lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.totalRevenue);

    return (currentRevenue - thirdPriorRevenue) / thirdPriorRevenue;
  },
  [ratioNames.quarterlyIncomeGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentIncome: number = lineItemAmount(data[currentQuarterIndex], lineItemNames.netIncome);
    const firstPriorIncome: number = lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.netIncome);

    return (currentIncome - firstPriorIncome) / firstPriorIncome;
  },
  [ratioNames.averageTTMIncomeGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentIncome: number = lineItemAmount(data[currentQuarterIndex], lineItemNames.netIncome);
    const firstPriorIncome: number = lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.netIncome);
    const secondPriorIncome: number = lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.netIncome);
    const thirdPriorIncome: number = lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.netIncome);

    return mean([
      (currentIncome - firstPriorIncome) / firstPriorIncome,
      (firstPriorIncome - secondPriorIncome) / secondPriorIncome,
      (secondPriorIncome - thirdPriorIncome) / thirdPriorIncome
    ]);
  },
  [ratioNames.totalTTMIncomeGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentIncome: number = lineItemAmount(data[currentQuarterIndex], lineItemNames.netIncome);
    const thirdPriorIncome: number = lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.netIncome);

    return (currentIncome - thirdPriorIncome) / thirdPriorIncome;    
  },
  [ratioNames.quarterlyOperatingCashflowGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingLiabilities);
    const firstPriorAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingLiabilities);

    return (currentAdjustedOCF - firstPriorAdjustedOCF) / firstPriorAdjustedOCF;
  },
  [ratioNames.averageTTMOperatingCashflowGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingLiabilities);
    const firstPriorAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingLiabilities);
    const secondPriorAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.changeInOperatingLiabilities);
    const thirdPriorAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingLiabilities);

    return mean([
      (currentAdjustedOCF - firstPriorAdjustedOCF) / firstPriorAdjustedOCF,
      (firstPriorAdjustedOCF - secondPriorAdjustedOCF) / secondPriorAdjustedOCF,
      (secondPriorAdjustedOCF - thirdPriorAdjustedOCF) / thirdPriorAdjustedOCF
    ]);
  },
  [ratioNames.totalTTMOperatingCashflowGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingLiabilities);
    const thirdPriorAdjustedOCF: number =
      lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingLiabilities);

    return (currentAdjustedOCF - thirdPriorAdjustedOCF) / thirdPriorAdjustedOCF;
  },
  [ratioNames.quarterlyFreeCashflowGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentFCF: number =
      lineItemAmount(data[currentQuarterIndex], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.cashflowFromInvestment);
    const firstPriorFCF: number =
      lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.cashflowFromInvestment);

    return (currentFCF - firstPriorFCF) / firstPriorFCF;
  },
  [ratioNames.averageTTMFreeCashflowGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentFCF: number =
      lineItemAmount(data[currentQuarterIndex], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.cashflowFromInvestment);
    const firstPriorFCF: number =
      lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex + 1], lineItemNames.cashflowFromInvestment);
    const secondPriorFCF: number =
      lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex + 2], lineItemNames.cashflowFromInvestment);
    const thirdPriorFCF: number =
      lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.cashflowFromInvestment);

    return mean([
      (currentFCF - firstPriorFCF) / firstPriorFCF,
      (firstPriorFCF - secondPriorFCF) / secondPriorFCF,
      (secondPriorFCF - thirdPriorFCF) / thirdPriorFCF
    ]);
  },
  [ratioNames.totalTTMFreeCashflowGrowth]: (y, data) => {
    const currentQuarterIndex: number = currentQuarterArrayIndex(y.rawValue as Date, data);
    const currentFCF: number =
      lineItemAmount(data[currentQuarterIndex], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex], lineItemNames.cashflowFromInvestment);
    const thirdPriorFCF: number =
      lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.operatingCashFlow)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingAssets)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.changeInOperatingLiabilities)
      - lineItemAmount(data[currentQuarterIndex + 3], lineItemNames.cashflowFromInvestment);

    return (currentFCF - thirdPriorFCF) / thirdPriorFCF;
  }
};

export const StockFinancialRatioDetails = ({ data }: { data: Array<Data.FinancialStatement> }): JSX.Element => {
  const xAxisItems: Array<DualAxis.Field> = data.map(finStat => {
    return {
      columnName: `date_ending`,
      displayValue: DataFormatter.format(finStat.date_ending, DataFormatter.DISPLAY_FORMAT_TYPE.DATE),
      rawValue: finStat.date_ending
    };
  });
  const dataDeriver = (x: DualAxis.Field, y: DualAxis.Field, data: Array<Data.FinancialStatement>): string | Date | number => {
    console.log(y.columnName);
    return ratioCalculations[y.columnName](x, data);
  };

  const config: DualAxis.Config = {
    parentClass: 'financial-statement-ratio-table',
    fields: {
      x: xAxisItems,
      y: yAxisItems,
      dataDeriver: dataDeriver,
      dataFormat: DataFormatter.DISPLAY_FORMAT_TYPE.PERCENT
    }
  }

  return (
    <div className="financial-statement-ratio-details">
      <DualAxis.Component config={config} data={data} />
    </div>
  );
}