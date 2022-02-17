const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "vft2jmbb6dzcqzr6",
  publicKey: "g37wz6555rbrqc9x",
  privateKey: "6ed3c6cb0d498c3437143e7bdfb96b80",
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (error, response) => {
    if (error) {
      res.status(200).send(error);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,

      options: {
        submitForSettlement: true,
      },
    },
    (error, result) => {
      if (error) {
        res.status(500).json(error);
      } else {
        res.send(result);
      }
    }
  );
};
