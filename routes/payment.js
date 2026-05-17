import express from 'express';
import axios from 'axios';
import crypto from 'crypto';

const router = express.Router();

// Initialize a donation/payment
router.post('/initialize', async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      { email, amount },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment after redirect
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params;

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );
    const { status, amount, customer } = response.data.data;
    res.json({ status, amount, customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Paystack Webhook
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;
    if (event.event === 'charge.success') {
      console.log('Payment confirmed:', event.data);
    }
  }
  res.sendStatus(200);
});

export default router;