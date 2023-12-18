
const stripe = require('stripe')('');
const express = require('express');
const router = express.Router();


const YOUR_DOMAIN = 'http://localhost:4242';

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [{
        price: req.body.price_id, // Pass the price ID from the form
        quantity: 1,
      }],
    mode: 'subscription',
    success_url: `http://localhost:5173/profile/{CHECKOUT_SESSION_ID}?priceId=${req.body.price_id}`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.redirect(303, session.url);
});

router.post('/create-portal-session', async (req, res) => {
  // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
  // Typically this is stored alongside the authenticated user in your database.
  const { session_id } = req.body;
  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  // This is the url to which the customer will be redirected when they are done
  // managing their billing with the portal.
  const returnUrl = YOUR_DOMAIN;

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: checkoutSession.customer,
    return_url: returnUrl,
  });

  res.redirect(303, portalSession.url);
});




module.exports = router;
