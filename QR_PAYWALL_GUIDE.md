# 📱 QR Code & Paywall Setup

## 🔗 QR Code for Mobile Access

### **Your Live App URL:**
```
https://freshfoxstudio-bit.github.io/greenbackapp/web.html
```

### **Generate QR Code:**
1. **Go to**: https://qr-code-generator.com
2. **Enter URL**: `https://freshfoxstudio-bit.github.io/greenbackapp/web.html`
3. **Download** QR code image
4. **Print** or share with users

### **Alternative QR Generators:**
- **QR.io** - Free, customizable
- **QR Code Monkey** - Branding options
- **Canva** - Design templates

---

## 💳 Paywall Setup

### **✅ Paywall Features Added:**
- **30-day free trial** for new users
- **Subscription modal** blocks features after trial
- **Monthly plan**: $9.99/month
- **Yearly plan**: $99.99/year (17% savings)
- **Payment integration** ready for Stripe/PayPal

### **🔒 How Paywall Works:**
1. **New users** get 30-day free trial
2. **After 30 days** → paywall appears
3. **Users must subscribe** to continue scanning
4. **Payment processing** (simulated for demo)
5. **Premium features** unlocked after payment

### **💰 Revenue Model:**
- **Monthly**: $9.99 × 100 users = $999/month
- **Yearly**: $99.99 × 100 users = $9,999/year
- **Lifetime**: $299.99 × 100 users = $29,999

### **🔧 Real Payment Integration:**

#### **Stripe Integration:**
```javascript
// Add to subscribe function
const stripe = Stripe('your-publishable-key');
await stripe.redirectToCheckout({
  lineItems: [{price: 'price_xxx', quantity: 1}],
  mode: 'subscription',
  successUrl: 'https://yourapp.com/success',
  cancelUrl: 'https://yourapp.com/cancel'
});
```

#### **PayPal Integration:**
```javascript
// Add PayPal button
paypal.Buttons({
  createSubscription: (data, actions) => {
    return actions.subscription.create({
      'plan_id': 'YOUR_PLAN_ID'
    });
  },
  onApprove: (data, actions) => {
    console.log('Subscription approved!');
  }
}).render('#paypal-button-container');
```

### **📱 Testing Paywall:**
1. **Sign up** as new user
2. **Wait 30 days** OR manually set `trialDaysLeft: 0`
3. **Try scanning** → paywall appears
4. **Test subscription flow**

### **🎯 Free Paywall Options:**

#### **Option 1: Ad-Supported Free**
- **Show ads** between scans
- **Basic features** free
- **Premium** removes ads

#### **Option 2: Freemium**
- **5 scans/day** free
- **Unlimited** with subscription
- **Basic deals** free
- **Premium deals** paid

#### **Option 3: Referral-Based**
- **Refer 1 friend** = 1 month free
- **Refer 25 friends** = lifetime free
- **Family sharing** included

---

## 🚀 Next Steps

### **For Real Payments:**
1. **Create Stripe account**: stripe.com
2. **Get API keys**
3. **Add webhook** for subscription management
4. **Update subscribe function** with real payment

### **For QR Code:**
1. **Generate QR code** with your live URL
2. **Add to marketing materials**
3. **Test on mobile devices**
4. **Share with beta users**

### **For Testing:**
1. **Deploy changes** to GitHub
2. **Test paywall flow**
3. **Verify QR code works**
4. **Get user feedback**

---

**🎉 Your app now has a working paywall system ready for real payments!**
