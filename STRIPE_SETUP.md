# Stripe Payment Setup Guide

## Environment Variables

Add the following to your `.env` file:

```env
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Backend API URL
VITE_API_BASE_URL=http://localhost:8000/api
```

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### 1. Create Checkout Session
```
POST /api/payments/create-checkout-session
```

**Request Body:**
```json
{
  "amount": 2500, // Amount in cents
  "currency": "usd",
  "shipping_address": {
    "address": "123 Main St",
    "city": "New York",
    "province": "NY",
    "country": "US",
    "zip": "10001",
    "contact_person": "John Doe",
    "full_name": "John Doe",
    "mobile_no": "+1234567890",
    "phone_country": "US"
  },
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Product Name",
        "price": "25.00",
        "supplier": {
          "name": "Supplier Name",
          "code": "SUP001"
        },
        "product_id": "12345",
        "sku_id": "SKU123",
        "sku_attr": "Red, Large"
      },
      "quantity": 1
    }
  ],
  "success_url": "https://yourdomain.com/dashboard/orders?success=true",
  "cancel_url": "https://yourdomain.com/dashboard/cart"
}
```

**Response:**
```json
{
  "data": {
    "session_id": "cs_xxx",
    "url": "https://checkout.stripe.com/pay/cs_xxx"
  },
  "message": null
}
```

### 2. Stripe Webhook (Required)
```
POST /api/webhooks/stripe
```

**Webhook Events to Handle:**
- `checkout.session.completed` - Payment successful
- `checkout.session.expired` - Session expired
- `payment_intent.succeeded` - Payment confirmed

**Example Webhook Payload:**
```json
{
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_xxx",
      "payment_status": "paid",
      "amount_total": 2500,
      "customer_details": {
        "email": "customer@example.com",
        "name": "John Doe"
      },
      "metadata": {
        "order_id": "123"
      }
    }
  }
}
```

## Stripe Dashboard Setup

1. Create a Stripe account at https://stripe.com
2. Get your publishable key from the Stripe Dashboard
3. Replace `pk_test_your_publishable_key_here` with your actual test key
4. For production, use your live publishable key

## Testing

Use Stripe's test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Authentication:** 4000 0025 0000 3155

Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits 