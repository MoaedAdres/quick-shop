# Stripe Webhook-Based Payment Setup

## Alternative Approach (No Payment APIs Required)

Instead of the payment APIs, you can use Stripe's **webhook-based approach**:

### 1. Create Checkout Session API (Required)
```javascript
// Backend: /api/create-checkout-session
POST /api/create-checkout-session

{
  "items": [...],
  "amount": 2500,
  "currency": "usd"
}

// Response
{
  "sessionId": "cs_xxx"
}
```

### 2. Stripe Webhook (Required)
```javascript
// Backend: /api/webhooks/stripe
POST /api/webhooks/stripe

// Stripe sends payment events to this endpoint
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "payment_status": "paid",
      "amount_total": 2500,
      // ... other payment data
    }
  }
}
```

### 3. Frontend Flow
1. User clicks "Pay"
2. Frontend calls `/api/create-checkout-session`
3. Redirect to Stripe Checkout
4. User completes payment on Stripe
5. Stripe sends webhook to your backend
6. Backend creates order and sends success email

## Benefits of Webhook Approach:
- ✅ **Simpler**: No payment intent APIs needed
- ✅ **Secure**: All payment processing on Stripe's servers
- ✅ **Reliable**: Webhooks ensure payment confirmation
- ✅ **User-friendly**: Redirect to Stripe's optimized checkout

## Required Backend Endpoints:
1. `POST /api/create-checkout-session` - Create Stripe checkout session
2. `POST /api/webhooks/stripe` - Handle Stripe webhooks
3. `GET /api/orders/:id` - Get order status

## Frontend Changes:
Replace `StripePayment` component with `StripeCheckoutSession` component. 