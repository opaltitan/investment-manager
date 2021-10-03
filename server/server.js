// const http = require('http')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
let jsonParser = bodyParser.json();

app.use(bodyParser.json());

const { Client } = require('pg');
const connProps = require('./connection_props');
const dataFormatter = require('./data_formatter.js');

// Stock API
const https = require('https');
const stockApiOptions = connProps.finAPI;

app.use(cors());

const client = new Client(connProps.params);
client.connect();

const extractQueryResults = (results) => results && results['rows'] && results['rows'].length ? results['rows'][0]['query_results'] : null;

app.get('/portfolios', async (_req, res) => {
  const results = await client.query('SELECT * FROM select_portfolio_all();');

  res.send(extractQueryResults(results));
});

app.get('/portfolio/:id', async (req, res) => {
  const id = req.params.id;
  const results = await client.query(`SELECT * FROM select_portfolio(${id});`);

  res.send(extractQueryResults(results));
});

// app.post('/portfolio/:id/transaction', async (req, res) => {
  // To-Do
  // const portfolioId = req.params.id;
  // const body = req.body;

  // const result = await client.query(`call insert_portfolio_transaction(${portfolioId}, ${body.stockId});`);

  // res.send({ result: result });
// });

app.delete('/portfolio/:id', async (req, res) => {
  const id = req.params.id;
  const result = await client.query(`call delete_portfolio(${id});`);

  res.send({ result: result });
});

app.post('/portfolio', async (req, res) => {
  const body = req.body;
  const result = await client.query(`call insert_portfolio('${body.name}');`);
  res.send({ result: result });
});

app.get('/watchlists', async (_req, res) => {
  const results = await client.query('SELECT * FROM select_watchlist_all();');
  res.send(extractQueryResults(results));
});

app.get('/watchlist/:id', async (req, res) => {
  const id = req.params.id;
  const results = await client.query(`SELECT * FROM select_watchlist(${id});`);

  res.send(extractQueryResults(results));
});

app.delete('/watchlist/:id', async (req, res) => {
  const id = req.params.id;
  const result = await client.query(`call delete_watchlist(${id});`);

  res.send({ result: result });
});

app.post('/watchlist', async (req, res) => {
  const body = req.body;
  const result = await client.query(`call insert_watchlist('${body.name}');`);
  res.send({ result: result });
});

app.post('/watchlist/:id/stock', async (req, res) => {
  const watchlistId = req.params.id;
  const body = req.body;

  const result = await client.query(`call insert_watchlist_stock(${watchlistId}, ${body.stockId});`);

  res.send({ result: result });
});

app.delete('/watchlist/:id/stock/:stockId', async(req, res) => {
  const watchlistId = req.params.id;
  const stockId = req.params.stockId;

  const result = await client.query(`call delete_watchlist_stock(${watchlistId}, ${stockId});`);

  res.send({ result: result });
});

app.post('/internal_search', async (req, res) => {
  const body = req.body;

  const results = await client.query(`SELECT * FROM select_stock_search('${body.searchTerm}');`)

  res.send(extractQueryResults(results));
});

app.get('/stock/:id', async (req, res) => {
  const stockId = req.params.id;

  const results = await client.query(`SELECT * FROM select_stock(${stockId});`);

  res.send(extractQueryResults(results));
});

const finStatementMapping = {
  incomeStatement: {
    apiType: 'INCOME_STATEMENT',
    dbType: 'financial_statement_income'
  },
  cashFlow: {
    apiType: 'CASH_FLOW',
    dbType: 'financial_statement_cash_flow'
  },
  balanceSheet: {
    apiType: 'BALANCE_SHEET',
    dbType: 'financial_statement_balance_sheet'
  }
}

const importFinancialStatement = (type, ticker) => {
  return new Promise(
    (resolve, reject) => {
      const reqOptions = {
        hostname: stockApiOptions.host,
        port: stockApiOptions.port,
        path: `/query?function=${type.apiType}&symbol=${ticker}&apikey=${stockApiOptions.apiKey}`,
        method: 'GET'
      };

      const apiReq = https.request(reqOptions, apiRes => {
        let aggData = '';

        apiRes.on('data', async(dataChunk) => {
          aggData += dataChunk;
        });

        apiRes.on('end', async() => {
          const responseData = JSON.parse(aggData);
          let quarterlyReports = responseData['quarterlyReports'];
          quarterlyReports.forEach((report) => report['financial_statement_type'] = type.dbType);

          resolve(quarterlyReports);
        });
      });

      apiReq.on('error', error => {
        reject(error);
      });

      apiReq.end();
    }
  );
};

const importFinancialStatements = (ticker) => {
  return Promise.all([
    importFinancialStatement(finStatementMapping.incomeStatement, ticker),
    importFinancialStatement(finStatementMapping.cashFlow, ticker),
    importFinancialStatement(finStatementMapping.balanceSheet, ticker)
  ]);
}

app.post('/stock/:id/snapshot', async(req, res) => {
  const stockId = req.params.id;
  const internalStockDataPull = await client.query(`SELECT * FROM select_stock(${stockId});`);
  const ticker = internalStockDataPull['rows'][0]['ticker'];

  const snapshotCreateOptions = {
    text: 'call insert_stock_snapshot($1::integer, $2::integer);',
    values: [stockId, 0]
  };
  const snapshotInsert = await client.query(snapshotCreateOptions);
  const stockSnapshotId = snapshotInsert['rows'][0]['p_stock_snapshot_id'];

  importFinancialStatements(ticker).then(async(statements) => {
    const financialStatementCreateOptions = {
      text: 'call insert_stock_financial_statements($1::integer, $2::json);',
      values: [stockSnapshotId, JSON.stringify(statements.flat())]
    };
    await client.query(financialStatementCreateOptions);

    res.send({ result: true });
  });
});

app.get('/snapshot/:id', async(req, res) => {
  const snapshotId = req.params.id;

  const results = await client.query(`SELECT * FROM select_stock_snapshot(${snapshotId});`);

  res.send(extractQueryResults(results));
});

app.post('/snapshot/:id/comment', async(req, res) => {
  const snapshotId = req.params.id;

  const payload = {
    ...req.body,
    stock_snapshot_id: snapshotId
  };

  const commentCreateOptions = {
    text: 'call insert_stock_snapshot_comment($1::json);',
    values: [JSON.stringify(payload)]
  };
  await client.query(commentCreateOptions);

  res.send({ result: true });
});

app.put('/comment/:id', async(req, res) => {
  const commentId = req.params.id;

  const payload = {
    ...req.body,
    stock_snapshot_comment_id: commentId
  };

  const commentUpdateOptions = {
    text: 'call update_stock_snapshot_comment($1::json);',
    values: [JSON.stringify(payload)]
  };
  await client.query(commentUpdateOptions);

  res.send({ result: true });
});

app.get('/search/:ticker', async(req, res) => {
  const ticker = req.params.ticker;
  const reqOptions = {
    hostname: stockApiOptions.host,
    port: stockApiOptions.port,
    path: `/query?function=SYMBOL_SEARCH&datatype=json&keywords=${ticker}&apikey=${stockApiOptions.apiKey}`,
    method: 'GET'
  };

  const apiReq = https.request(reqOptions, apiRes => {
    let aggData = '';

    apiRes.on('data', async(dataChunk) => {
      aggData += dataChunk;
    });

    apiRes.on('end', async() => {
      const responseData = JSON.parse(aggData);

      res.send(
        dataFormatter.formatData(
          dataFormatter.Endpoints.GetSearchTicker,
          responseData['bestMatches']
        )
      );
    });
  });

  apiReq.on('error', error => {
    console.error(error);
  });

  apiReq.end();
});

app.post('/stock/:ticker', async(req, res) => {
  const ticker = req.params.ticker;
  const pgTickerCheckOptions = {
    text: 'select * from select_stock_by_ticker($1::text)',
    values: [ticker]
  };

  const checkResult = await client.query(pgTickerCheckOptions);
  if (checkResult['rows'] && checkResult['rows'][0]['query_results'] && checkResult['rows'][0]['query_results'].length) {
    res.send({
      alreadyExists: true
    });
  } else {
    const reqOptions = {
      hostname: stockApiOptions.host,
      port: stockApiOptions.port,
      path: `/query?function=OVERVIEW&datatype=json&symbol=${ticker}&apikey=${stockApiOptions.apiKey}`,
      method: 'GET'
    };
  
    const apiReq = https.request(reqOptions, apiRes => {
      let aggData = '';
  
      apiRes.on('data', async(dataChunk) => {
        aggData += dataChunk;
      });
  
      apiRes.on('end', async() => {
        const stockData = JSON.parse(aggData);

        const pgQueryOptions = {
          text: 'call insert_stock($1::text, $2::text, $3::text, $4::text, $5::text, $6::integer);',
          values: [
            stockData['Symbol'],
            stockData['Name'],
            stockData['Description'],
            stockData['Industry'],
            stockData['Sector'],
            0
          ]
        };
  
        const result = await client.query(pgQueryOptions);

        res.send({ id: result['rows'][0]['p_stock_id'] });
      });
    });
  
    apiReq.on('error', error => {
      console.error(error);
    });
  
    apiReq.end();
  }
});

// app.get('/user_data/:id', (req, res) => {
//   const id = Number(req.params['id']);
//   const user = data.users.find((user) => user['id'] === id);
//   res.send(user);
// });

// app.get('/user_data/:id/properties', (req, res) => {
//   const id = Number(req.params['id']);
//   const propertiesOwned = data.ownership.filter(own => own.user_id === id);
//   const properties = data.properties.filter((property) => {
//     return propertiesOwned.find(owned => owned.property_id === property.id)
//   });
//   res.send(properties);
// });

// app.get('/property_data', (req, res) => {
//   res.send(data.properties);
// });

// app.get('/property_data/:id', (req, res) => {
//   const id = Number(req.params['id']);
//   res.send(data.properties.find(property => property.id === id));
// });

// app.get('/property_data/:id/rent', (req, res) => {
//   const id = Number(req.params['id']);
//   res.send(data.rent.filter(r => r.property_id === id));
// });

app.listen(3800, () => console.log('Server ready'))
