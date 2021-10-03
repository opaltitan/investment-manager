
const methodTypes = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

class Endpoint {
  constructor(method, url) {
    this.method = method;
    this.url = url;
  }
}

const DataFormatTypes = {
  ARRAY: 'ARRAY',
  OBJECT: 'OBJECT',
  PROPERTY: 'PROPERTY'
};

const Endpoints = {
  GetSearchTicker: new Endpoint(methodTypes.GET, '/search/:ticker'),
};

const EndpointConfig = [
  {
    endpoint: Endpoints.GetSearchTicker,
    baseDataFormat: DataFormatTypes.ARRAY,
    arrayKey: '1. symbol',
    dataStructure: [
      {
        fieldName: '1. symbol',
        dataFormatType: DataFormatTypes.PROPERTY,
        convertedFieldName: 'ticker'
      },
      {
        fieldName: '2. name',
        dataFormatType: DataFormatTypes.PROPERTY,
        convertedFieldName: 'stock_name'
      }
    ]
  }
];

const formatObjectData = (dataStructure, rawData) => {
  return dataStructure.reduce((acc, curr, _i) => {
    let formattedData;
    switch (curr.dataFormatType) {
      case DataFormatTypes.ARRAY:
        formattedData = formatArrayData(curr, rawData);
        break;
      case DataFormatTypes.OBJECT:
        formattedData = formatObjectData(curr.dataStructure, rawData);
        break;
      case DataFormatTypes.PROPERTY:
        formattedData = rawData && rawData.length && rawData[0]
          ? rawData[0][curr.fieldName]
          : (rawData ? rawData[curr.fieldName] : null);
        break;
    }

    return { ...acc, [curr.convertedFieldName || curr.fieldName]: formattedData };
  }, {});
};

const formatArrayData = (endpointConfigItem, rawData) => {
  if (
    !rawData
    || !rawData[0]
    || rawData[0][endpointConfigItem.arrayKey] === null
    || rawData[0][endpointConfigItem.arrayKey] === undefined
  ) {
    return [];
  }
  const uniqueKeyArray = rawData.reduce((acc, curr, _i) => {
    const keyVal = curr[endpointConfigItem.arrayKey];

    return acc.includes(keyVal) ? acc : [...acc, keyVal];
  }, []);

  const formattedArrayData = [];
  uniqueKeyArray.forEach((filterVal) => {
    const filteredRawData = rawData.filter(
      (datum) => datum[endpointConfigItem.arrayKey] === filterVal
    );
    formattedArrayData.push(
      formatObjectData(endpointConfigItem.dataStructure, filteredRawData)
    );
  });

  return formattedArrayData;
};

const formatData = (endpoint, rawData) => {
  const endpointConfigItem = {
    ...EndpointConfig.find(
      (configItem) => configItem.endpoint == endpoint
    )
  };

  let formattedData;
  switch (endpointConfigItem.baseDataFormat) {
    case DataFormatTypes.ARRAY:
      formattedData = formatArrayData(endpointConfigItem, rawData);
      break;
    case DataFormatTypes.OBJECT:
      formattedData = formatObjectData(endpointConfigItem.dataStructure, rawData);
      break;
    case DataFormatTypes.PROPERTY:
      formattedData = null;
      break;
  }

  return formattedData;
};

module.exports = {
  Endpoint,
  Endpoints,
  formatData
};
