// This is your test secret API key.
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const calculateOrderAmount = (order) => {
  const total = order.map((e) => e.TotalPrice);
  const FinalTotal = total.reduce((sum, element) => sum + element);
  // const Total = order.map(e=>e.TotalPrice)
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  return Math.round(FinalTotal * 1.1);
};

export default async function handler(req, res) {
  const { order } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(order),
    currency: 'jpy',
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}
