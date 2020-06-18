var SquareConnect = require('square-connect');

var defaultClient = SquareConnect.ApiClient.instance;
var app = require('express')();
var bodyParser = require('body-parser');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.get("/", function (request, response)  {
  var amount = Number(request.query.amount)
  if (request.query.nonce == null) {
    response.send({
      code: 400,
      message: "nonce not found"
    })
  }
  var oauth2 = defaultClient.authentications['oauth2'];
  oauth2.accessToken = 'EAAAEKqzQAEPPY1r01gDWulWTsMhbIEHN42F7QpUQ-DG2YQUJAZTnCDh-DWx1bGd';
  defaultClient.basePath = 'https://connect.squareupsandbox.com'
  var transactionApi = new SquareConnect.TransactionsApi();
  transactionApi.charge("4CPVCMRZR1FHG", {
    idempotency_key: new Date(),
    card_nonce: request.query.nonce,
    amount_money: {
      amount: amount,
      currency: "USD"
    }
  
  }).then(function (data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    response.send(data);
  }, function (error) {
    console.error(JSON.parse(error.response.text).errors[0].detail);
    response.send(error);
  });
})
// Replace the IP address with your own local IP
app.listen(process.env.PORT || 8080)