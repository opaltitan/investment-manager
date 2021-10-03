import { find, filter, reduce, map } from 'lodash';
import { Title } from './Common';
import { Expander } from 'simple-react-expander';
import { Enums } from '../models/enum.d';
import { DualAxis } from 'react-data-tables';
import { DataFormatter } from 'simple-text-display-formatter';
import { Data } from '../models/data';

interface FinancialStatementGroup {
  financial_statement_type: Data.LookupValueType;
  financialStatements: Array<Data.FinancialStatement>;
}

const FinancialStatementSection = ({ data }: { data: FinancialStatementGroup }): JSX.Element => {
  const financialStatementExpanderHeader =
    <div className="financial-statement-expander-header">
      <Title size={Enums.TEXT_SIZE.MEDIUM} text={data.financial_statement_type.lookup_type_value_display} />
    </div>;

  const xAxisItems: Array<DualAxis.Field> = data.financialStatements.map(finStat => {
    return {
      columnName: `date_ending`,
      displayValue: DataFormatter.format(finStat.date_ending, DataFormatter.DISPLAY_FORMAT_TYPE.DATE),
      rawValue: finStat.date_ending
    };
  });
  const yAxisItems: Array<DualAxis.Field> =
    data.financialStatements.reduce((acc, curr) => {
      return [
        ...acc,
        ...map(
          filter(
            curr.line_items.map((lineItem) => lineItem.line_item_type),
            lineItem => !find(acc, accLineItem => accLineItem.rawValue === lineItem.lookup_type_value)
          ),
          lineItem => {
            return {
              columnName: lineItem.lookup_type_value,
              displayValue: lineItem.lookup_type_value_display,
              rawValue: lineItem.lookup_type_value
            };
          }
        )
      ];
    }, Array<DualAxis.Field>());
  const dataDeriver = (x: DualAxis.Field, y: DualAxis.Field, data: Array<Data.FinancialStatement>): number => {
    const foundFinStat: Data.FinancialStatement | undefined = find(data, finStat => finStat.date_ending === x.rawValue as Date);
    if (!foundFinStat) {
      return 0;
    }
    const foundLineItem: Data.LineItem | undefined = find(foundFinStat.line_items, lineItem => lineItem.line_item_type.lookup_type_value === y.rawValue as string);
    return foundLineItem ? foundLineItem.amount : 0;
  };

  const config: DualAxis.Config = {
    parentClass: 'financial-statement-table',
    fields: {
      x: xAxisItems,
      y: yAxisItems,
      dataDeriver: dataDeriver,
      dataFormat: DataFormatter.DISPLAY_FORMAT_TYPE.DOLLAR
    }
  };

  return (
    <Expander.Component header={financialStatementExpanderHeader}
                        initialState={true}>
      <div className="financial-statement-group">
        <DualAxis.Component config={config} data={data.financialStatements} />
      </div>
    </Expander.Component>
  );
};

const generateFinancialStatementGroups = (financialStatements: Array<Data.FinancialStatement>): Array<FinancialStatementGroup> => {
  console.log(financialStatements);
  const types: Array<Data.LookupValueType> = reduce(financialStatements, (acc, curr) => {
    return !!find(acc, accFinStat => accFinStat.id === curr.financial_statement_type.id) ? [...acc] : [...acc, curr.financial_statement_type]
  }, Array<Data.LookupValueType>());

  return types.map((type) => {
    return {
      financial_statement_type: type,
      financialStatements: filter(financialStatements, finStat => finStat.financial_statement_type.id === type.id)
    };
  });
};

export const StockFinancialStatementDetails = ({ data }: { data: Array<Data.FinancialStatement> }): JSX.Element => {
  const groups: Array<FinancialStatementGroup> = generateFinancialStatementGroups(data);

  const financialStatementsExpanderHeader =
    <div className="financial-statements-expander-header">
      <Title size={Enums.TEXT_SIZE.MEDIUM} text="Financial Statements" />
    </div>

  return (
    <Expander.Component header={financialStatementsExpanderHeader}
                        initialState={true}>
      <>
      {
        groups.map((group) =>
          <FinancialStatementSection key={group.financial_statement_type.id}
                                     data={group} />
        )
      }
      </>
    </Expander.Component>
  )
};
