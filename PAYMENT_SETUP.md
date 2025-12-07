# Payment Gateway Setup Guide

## Overview
This application uses **Stripe** for secure payment processing. All transactions are recorded in the database with full order tracking.

## Features Implemented

### 1. Cart Functionality ✅
- Add products to cart from store page
- Update quantities
- Remove items
- Persistent cart (stored in database)

### 2. Checkout Process ✅
- Stripe Checkout integration
- Secure payment processing
- Order confirmation page
- Real-time inventory updates

### 3. Transaction Recording ✅
- All orders stored in MongoDB
- Payment status tracking (pending/completed/failed)
- Order history in user profile
- Product purchase history

### 4. Webhook Integration ✅
- Automatic order creation on successful payment
- Inventory management
- Duplicate order prevention

## Environment Variables Required

Add these to your `.env` or `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_USER_SECRET=your_user_secret
JWT_SELLER_SECRET=your_seller_secret
```

## Stripe Setup Instructions

### 1. Get Your Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** > **API Keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Add it to `.env` as `STRIPE_SECRET_KEY`

### 2. Set Up Webhook (for production)

1. In Stripe Dashboard, go to **Developers** > **Webhooks**
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add it to `.env` as `STRIPE_WEBHOOK_SECRET`

### 3. Test Mode (Local Development)

For local testing, you can use Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook secret starting with whsec_
# Add it to your .env file
```

## Testing the Payment Flow

### Test Cards (Stripe Test Mode)

Use these test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

For all test cards:
- Use any future expiry date (e.g., 12/25)
- Use any 3-digit CVC (e.g., 123)
- Use any ZIP code (e.g., 12345)

### Flow Walkthrough

1. **Browse Products**: Navigate to `/store`
2. **Add to Cart**: Click "Add" button on any product
3. **View Cart**: Go to `/store/cart`
4. **Checkout**: Click "Checkout" button
5. **Payment**: Enter test card details on Stripe checkout page
6. **Confirmation**: Redirected to success page with order details
7. **View Orders**: Check order history in profile (`/profile`)

## API Endpoints

### Cart Management

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
  ```json
  { "productId": "...", "quantity": 1 }
  ```
- `PUT /api/cart` - Update quantity
  ```json
  { "productId": "...", "quantity": 2 }
  ```
- `DELETE /api/cart?productId=...` - Remove item

### Checkout

- `POST /api/create-checkout-session` - Create Stripe checkout session
  ```json
  {
    "items": [...],
    "shippingAddress": {
      "fullName": "...",
      "email": "...",
      "mobile": "...",
      "addressLines": [...]
    }
  }
  ```

### Orders

- `GET /api/orders` - Get user's order history
- `POST /api/orders` - Create order (called from success page)
  ```json
  { "paymentSessionId": "cs_test_..." }
  ```

### Webhooks

- `POST /api/webhooks/stripe` - Stripe webhook handler

## Database Schema

### Order Model

```javascript
{
  userId: ObjectId,
  items: [{
    productId: ObjectId,
    quantity: Number,
    priceAtPurchase: Number
  }],
  totalAmount: Number,
  shippingAddress: {
    fullName: String,
    email: String,
    mobile: String,
    addressLines: [String]
  },
  paymentStatus: String, // 'pending' | 'completed' | 'failed'
  paymentSessionId: String, // Stripe session ID (unique)
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

1. **Server-side authentication** - All cart/order operations require valid JWT
2. **Payment verification** - Orders only created after Stripe confirms payment
3. **Webhook validation** - Stripe signatures verified before processing
4. **Duplicate prevention** - PaymentSessionId uniqueness prevents double orders
5. **Transaction safety** - MongoDB transactions ensure atomicity

## Troubleshooting

### "Cart is empty" error
- Ensure user is logged in
- Check that items were added to cart before checkout

### Webhook not receiving events
- Verify webhook secret is correct
- Check webhook endpoint is publicly accessible
- Use Stripe CLI for local testing

### Order not created after payment
- Check webhook handler logs
- Verify payment was successful in Stripe Dashboard
- Ensure MongoDB connection is stable

### "Failed to add to cart"
- User must be logged in
- Product must exist and have stock

## Production Checklist

- [ ] Switch to live Stripe API keys (remove `_test_`)
- [ ] Configure production webhook endpoint
- [ ] Set correct `NEXT_PUBLIC_BASE_URL`
- [ ] Enable webhook signature verification
- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure email notifications for orders
- [ ] Test all payment flows end-to-end
- [ ] Review and adjust inventory management logic
- [ ] Set up automated backups for order data

## Support

For Stripe-related issues, visit:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com/)

For application issues, check the console logs and MongoDB records.
