# Quick Test Guide

## 1. Test Interested Button ✅

1. Navigate to **Events Page**: `http://localhost:3000/events`
2. Log in if not already logged in
3. Click **"Interested?"** button on any event
4. Should see success toast: "Added to interested"
5. Button should change to **"Interested"** with filled heart ❤️
6. Click again to remove interest

## 2. Test View Details ✅

1. On Events Page
2. Click **"View Details"** button on any event
3. Should navigate to event details page
4. Verify you can see:
   - Full event poster image
   - Complete description (not truncated)
   - Full date, time, location
   - Number of interested people
   - Interest button

## 3. Test Add to Cart ✅

1. Navigate to **Store**: `http://localhost:3000/store`
2. Click **"Add"** button on any product
3. Should see toast: "Added to cart"
4. Click on cart icon or navigate to `/store/cart`
5. Product should be in cart

## 4. Test Cart Management ✅

1. In cart page: `/store/cart`
2. Use **+** and **-** buttons to change quantity
3. Click **Remove** to delete items
4. All changes should update instantly

## 5. Test Checkout & Payment ✅

### Setup
Make sure `.env` has:
```
STRIPE_SECRET_KEY=sk_test_...  ✅ (already configured)
```

### Test Flow
1. Add items to cart
2. Go to cart page
3. Click **"Checkout"** button
4. You'll be redirected to Stripe checkout page
5. Use test card: **4242 4242 4242 4242**
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)
6. Click **Pay**
7. Should redirect to success page
8. Verify order details shown

## 6. Test Order History ✅

1. Navigate to **Profile**: `http://localhost:3000/profile`
2. Click **"Order History"** tab
3. Should see your recent order
4. Verify:
   - Order ID
   - Items purchased
   - Total amount
   - Payment status: "completed"

## 7. Verify Profile Shows Name & Email ✅

1. On Profile page
2. Look at top section
3. Should see:
   - Your name (large heading)
   - Your email (with mail icon)
   - Profile picture
   - Member since date

## Expected Results

### ✅ Events
- Interested button works without errors
- View Details shows complete event info
- Description no longer truncated

### ✅ Store & Cart
- Add to cart works
- Cart persists across page refreshes
- Quantity updates work
- Remove items works

### ✅ Checkout
- Stripe checkout page loads
- Test payment succeeds
- Redirects to success page
- Order created in database

### ✅ Profile
- Name displayed prominently
- Email shown with icon
- Order history shows all purchases
- Transaction details visible

## Troubleshooting

### "Failed to update interest"
- Make sure you're logged in
- Clear browser cache and retry
- Check console for errors

### "Please login to buy products"
- Log in at `/login`
- Cart requires authentication

### Payment not working
- Verify Stripe keys in `.env`
- Use test card: 4242 4242 4242 4242
- Check browser console for errors

### Order not appearing
- Refresh profile page
- Check "Order History" tab
- Verify payment was successful

## Success Indicators

✅ No errors in browser console
✅ Toast notifications appear on actions
✅ UI updates instantly (optimistic updates)
✅ Data persists across page reloads
✅ Payment creates order in database
✅ Inventory updates after purchase

## Quick Demo Flow (2 minutes)

1. Go to `/events` → Click "Interested?" → See confirmation ✅
2. Click "View Details" → See full event ✅
3. Go to `/store` → Click "Add" on a product ✅
4. Go to `/store/cart` → Verify item is there ✅
5. Click "Checkout" → Use 4242... card → Pay ✅
6. See success page → Order confirmed ✅
7. Go to `/profile` → See order in history ✅
8. Verify name and email shown ✅

**All features working! 🎉**
