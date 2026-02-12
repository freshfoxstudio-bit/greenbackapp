
document.addEventListener('DOMContentLoaded', () => {
  // SPLASH SCREENS & JINGLE
  function showSplashScreens() {
    const jingle = document.getElementById('jingle');
    const splashLogo = document.getElementById('splash-logo');
    const splashGreenback = document.getElementById('splash-greenback');
    const pageAuth = document.getElementById('page-auth');

    // Start jingle
    jingle.play().catch(err => console.log('Jingle autoplay blocked:', err));

    // First splash: 5 seconds
    setTimeout(() => {
      splashLogo.classList.remove('active');
      splashGreenback.classList.add('active');
    }, 5000);

    // Second splash: 5 seconds, then show auth
    setTimeout(() => {
      splashGreenback.classList.remove('active');
      pageAuth.classList.add('active');
      // Stop jingle when auth page shows
      setTimeout(() => {
        jingle.pause();
        jingle.currentTime = 0;
      }, 500);
    }, 10000);
  }

  // Start splash screens on load
  showSplashScreens();
  // APP STATE
  let currentUser = null;
  let budget = 100.00;
  let cartItems = [];
  let savingsData = { current: 0, month: 0, year: 0, lifetime: 0 };

  // SAMPLE DATA WITH TAX INFO
  const sampleDeals = [
    { id: 1, name: 'Milk', price: 2.50, sale: 1.99, savings: 0.51, flyer: '🥛', category: 'dairy', taxRate: 0.0 },
    { id: 2, name: 'Bread', price: 3.00, sale: 2.29, savings: 0.71, flyer: '🍞', category: 'bakery', taxRate: 0.0 },
    { id: 3, name: 'Cheese', price: 5.99, sale: 3.99, savings: 2.00, flyer: '🧀', category: 'dairy', taxRate: 0.0 },
    { id: 4, name: 'Eggs', price: 4.50, sale: 2.99, savings: 1.51, flyer: '🥚', category: 'dairy', taxRate: 0.0 },
    { id: 5, name: 'Chicken', price: 8.99, sale: 5.99, savings: 3.00, flyer: '🍗', category: 'meat', taxRate: 0.0 },
    { id: 6, name: 'Apples', price: 4.99, sale: 3.49, savings: 1.50, flyer: '🍎', category: 'produce', taxRate: 0.0 },
  ];

  // TAX RATES BY STATE (simplified)
  const taxRates = {
    'AL': 0.04, 'AK': 0.00, 'AZ': 0.056, 'AR': 0.065, 'CA': 0.0725,
    'CO': 0.029, 'CT': 0.0635, 'DE': 0.00, 'FL': 0.06, 'GA': 0.04,
    'HI': 0.04, 'ID': 0.06, 'IL': 0.0625, 'IN': 0.07, 'IA': 0.06,
    'KS': 0.065, 'KY': 0.06, 'LA': 0.0445, 'ME': 0.055, 'MD': 0.06,
    'MA': 0.0625, 'MI': 0.06, 'MN': 0.06875, 'MS': 0.07, 'MO': 0.04225,
    'MT': 0.00, 'NE': 0.055, 'NV': 0.0685, 'NH': 0.00, 'NJ': 0.06625,
    'NM': 0.05125, 'NY': 0.04, 'NC': 0.0475, 'ND': 0.05, 'OH': 0.0575,
    'OK': 0.045, 'OR': 0.00, 'PA': 0.06, 'RI': 0.07, 'SC': 0.06,
    'SD': 0.045, 'TN': 0.07, 'TX': 0.0625, 'UT': 0.0595, 'VT': 0.06,
    'VA': 0.053, 'WA': 0.065, 'WV': 0.06, 'WI': 0.05, 'WY': 0.04
  };

  let userLocation = { state: 'CA', city: '' }; // Default location

  // GET USER LOCATION
  function getUserLocation() {
    const saved = localStorage.getItem('userLocation');
    if (saved) {
      userLocation = JSON.parse(saved);
    } else {
      // In production, use geolocation API
      const state = prompt('Enter your US state code (e.g., CA, NY, TX) for tax calculation:');
      if (state && taxRates[state.toUpperCase()]) {
        userLocation.state = state.toUpperCase();
        localStorage.setItem('userLocation', JSON.stringify(userLocation));
      }
    }
  }

  // CALCULATE TAX
  function calculateTax(amount, taxRate = null) {
    const rate = taxRate !== null ? taxRate : taxRates[userLocation.state] || 0.0725;
    return amount * rate;
  }

  // PRODUCT API SIMULATION
  async function searchProductAPI(barcodeOrName) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock product database
    const productDatabase = {
      '123456789012': { name: 'Organic Milk', price: 4.99, category: 'dairy', image: 'milk.jpg' },
      '234567890123': { name: 'Whole Wheat Bread', price: 3.49, category: 'bakery', image: 'bread.jpg' },
      '345678901234': { name: 'Cheddar Cheese', price: 5.99, category: 'dairy', image: 'cheese.jpg' },
    };

    // Search by barcode or name
    let product = productDatabase[barcodeOrName];
    if (!product) {
      // Search by name
      const searchLower = barcodeOrName.toLowerCase();
      product = Object.values(productDatabase).find(p => 
        p.name.toLowerCase().includes(searchLower)
      );
    }

    if (product) {
      // Find best deal
      const deal = sampleDeals.find(d => d.name.toLowerCase().includes(product.name.toLowerCase()));
      return {
        ...product,
        salePrice: deal ? deal.sale : product.price * 0.9, // 10% discount if no specific deal
        savings: deal ? deal.savings : product.price * 0.1,
        coupon: deal ? `🎫 ${Math.round((deal.savings / product.price) * 100)}% OFF` : '🎫 10% OFF',
        taxRate: taxRates[userLocation.state] || 0.0725
      };
    }

    return null;
  }

  // DOM ELEMENTS
  const pageAuth = document.getElementById('page-auth');
  const appContainer = document.getElementById('appContainer');
  const authForm = document.getElementById('authForm');
  const signupForm = document.getElementById('signupForm');
  const authPhone = document.getElementById('authPhone');
  const authPassword = document.getElementById('authPassword');
  const signInBtn = document.getElementById('signInBtn');
  const toggleSignUpBtn = document.getElementById('toggleSignUpBtn');
  const toggleSignInBtn = document.getElementById('toggleSignInBtn');
  const signupPhone = document.getElementById('signupPhone');
  const signupPassword = document.getElementById('signupPassword');
  const signupConfirm = document.getElementById('signupConfirm');
  const signupReferral = document.getElementById('signupReferral');
  const signUpBtn = document.getElementById('signUpBtn');

  // AUTH TOGGLE
  toggleSignUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authForm.style.display = 'none';
    signupForm.style.display = 'block';
  });

  toggleSignInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    authForm.style.display = 'block';
    signupForm.style.display = 'none';
  });

  // GENERATE REFERRAL CODE
  function generateReferralCode() {
    return 'GREEN' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  // SIGN UP
  signUpBtn.addEventListener('click', () => {
    const phone = signupPhone.value.trim();
    const password = signupPassword.value;
    const confirm = signupConfirm.value;
    const referralCode = signupReferral.value.trim();

    if (!phone || !password || password !== confirm) {
      alert('Please fill in all fields correctly');
      return;
    }

    let userData = {
      phone,
      password,
      referralCode: generateReferralCode(),
      referralCount: 0,
      altPhone: '',
      trialDaysLeft: 30,
      usedReferral: referralCode || null,
      createdAt: new Date().toISOString(),
      savings: { current: 0, month: 0, year: 0, lifetime: 0 }
    };

    // If used referral code, add free month to both users
    if (referralCode) {
      userData.trialDaysLeft = 60;
    }

    localStorage.setItem('greenbackUser_' + phone, JSON.stringify(userData));
    loginUser(userData);
  });

  // SIGN IN
  signInBtn.addEventListener('click', () => {
    const phone = authPhone.value.trim();
    const password = authPassword.value;

    if (!phone || !password) {
      alert('Please enter phone and password');
      return;
    }

    let userData = localStorage.getItem('greenbackUser_' + phone);

    if (!userData) {
      alert('Account not found. Please sign up.');
      return;
    }

    userData = JSON.parse(userData);

    if (userData.password !== password) {
      alert('Incorrect password');
      return;
    }

    loginUser(userData);
  });



  // NAVIGATION SYSTEM
  function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // Update nav buttons
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-page') === pageId) {
        btn.classList.add('active');
      }
    });
    
    // Update deals when sales page is shown
    if (pageId === 'page-sales') {
      updateDealsDisplay();
    }
  }

  // NAVIGATION EVENT LISTENERS
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = btn.getAttribute('data-page');
      showPage(pageId);
    });
  });

  // BACK BUTTONS
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pageId = btn.getAttribute('data-page');
      showPage(pageId || 'page-scanner');
    });
  });

  // LOGOUT
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      currentUser = null;
      cartItems = [];
      savingsData = { current: 0, month: 0, year: 0, lifetime: 0 };
      pageAuth.style.display = 'flex';
      appContainer.style.display = 'none';
      authPhone.value = '';
      authPassword.value = '';
    }
  });

  // LOGIN USER
  function loginUser(userData) {
    currentUser = userData;
    savingsData = userData.savings || { current: 0, month: 0, year: 0, lifetime: 0 };
    pageAuth.style.display = 'none';
    appContainer.style.display = 'flex';
    updateProfileDisplay();
    updateSavingsDisplay();
    document.getElementById('scanMessage').textContent = 'Ready to scan! Click the Scan button.';
  }

  // UPDATE PROFILE DISPLAY
  function updateProfileDisplay() {
    document.getElementById('profilePhone').textContent = currentUser.phone;
    
    const isSubscribed = checkSubscriptionStatus();
    const subscriptionPrompt = document.getElementById('subscriptionPrompt');
    
    if (isSubscribed) {
      if (currentUser.isSubscribed && !currentUser.subscriptionExpiry) {
        document.getElementById('planStatus').textContent = 'Lifetime Premium';
        document.getElementById('daysLeft').textContent = '∞';
      } else if (currentUser.isSubscribed && currentUser.subscriptionExpiry) {
        const expiryDate = new Date(currentUser.subscriptionExpiry);
        document.getElementById('planStatus').textContent = 'Premium';
        document.getElementById('daysLeft').textContent = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
      } else {
        document.getElementById('planStatus').textContent = 'Free Trial';
        document.getElementById('daysLeft').textContent = Math.max(0, currentUser.trialDaysLeft);
      }
      subscriptionPrompt.style.display = 'none';
    } else {
      document.getElementById('planStatus').textContent = 'Expired';
      document.getElementById('daysLeft').textContent = '0';
      subscriptionPrompt.style.display = 'block';
    }
    
    document.getElementById('referralCode').textContent = currentUser.referralCode;
    document.getElementById('referralCount').textContent = currentUser.referralCount;

    if (currentUser.referralCount >= 25) {
      document.getElementById('superStatus').style.display = 'block';
    }

    if (currentUser.altPhone) {
      document.getElementById('altPhoneDisplay').textContent = 'Alt: ' + currentUser.altPhone;
    }
  }

  // SUBSCRIBE FUNCTION
  function subscribe() {
    const plan = confirm('Choose your plan:\n\nOK = Monthly ($9.99)\nCancel = Yearly ($99.99)\n\nYearly saves you $19.89!');
    const isYearly = !plan;
    const price = isYearly ? 99.99 : 9.99;
    const duration = isYearly ? 365 : 30;
    
    if (confirm(`Confirm ${isYearly ? 'Yearly' : 'Monthly'} subscription for $${price}?`)) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + duration);
      
      currentUser.isSubscribed = true;
      currentUser.subscriptionExpiry = expiryDate.toISOString();
      currentUser.trialDaysLeft = 0;
      
      localStorage.setItem('greenbackUser_' + currentUser.phone, JSON.stringify(currentUser));
      updateProfileDisplay();
      
      alert(`🎉 Successfully subscribed! Your ${isYearly ? 'yearly' : 'monthly'} subscription is now active.`);
    }
  }

  // SAVINGS DISPLAY
  function updateSavingsDisplay() {
    document.getElementById('currentSavings').textContent = '$' + savingsData.current.toFixed(2);
    document.getElementById('monthSavings').textContent = '$' + savingsData.month.toFixed(2);
    document.getElementById('yearSavings').textContent = '$' + savingsData.year.toFixed(2);
    document.getElementById('lifetimeSavings').textContent = '$' + savingsData.lifetime.toFixed(2);
  }

  // COPY REFERRAL CODE
  document.getElementById('copyCodeBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(currentUser.referralCode);
    alert('Code copied: ' + currentUser.referralCode);
  });

  // ADD ALT PHONE
  document.getElementById('addAltPhoneBtn').addEventListener('click', () => {
    const altPhone = document.getElementById('altPhone').value.trim();
    if (altPhone) {
      currentUser.altPhone = altPhone;
      localStorage.setItem('greenbackUser_' + currentUser.phone, JSON.stringify(currentUser));
      document.getElementById('altPhoneDisplay').textContent = 'Alt: ' + altPhone;
      document.getElementById('altPhone').value = '';
      alert('Alternative phone added!');
    }
  });

  // UPDATE BUDGET
  document.getElementById('budgetBtn').addEventListener('click', () => {
    const newBudget = parseFloat(document.getElementById('budgetInput').value);
    if (!isNaN(newBudget) && newBudget >= 0) {
      budget = newBudget;
      document.getElementById('budgetDisplay').textContent = '$' + budget.toFixed(2);
      document.getElementById('budgetInput').value = '';
      alert('Budget updated to $' + budget.toFixed(2));
    }
  });

  // ENHANCED SCAN WITH PRODUCT API
  document.getElementById('scanBtn').addEventListener('click', async () => {
    if (!enforcePaywall()) return;
    
    if (scanning) return;
    scanning = true;
    const btn = document.getElementById('scanBtn');
    const scanMsg = document.getElementById('scanMessage');
    btn.classList.add('glow');
    scanMsg.textContent = '📷 Requesting camera access...';

    try {
      // Try to request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      stream.getTracks().forEach(track => track.stop());
      scanMsg.textContent = '✓ Camera access granted! Scanning...';
      
      // Simulate barcode scan
      setTimeout(async () => {
        const mockBarcode = Math.random().toString().substr(2, 12);
        scanMsg.textContent = `🔍 Scanning barcode: ${mockBarcode}...`;
        
        // Search product API
        const product = await searchProductAPI(mockBarcode);
        
        btn.classList.remove('glow');
        scanning = false;
        
        if (product) {
          scanMsg.textContent = `✅ Found: ${product.name} - ${product.coupon}`;
          addItemToCart({
            ...product,
            flyer: getCategoryEmoji(product.category),
            price: product.price,
            sale: product.salePrice
          });
        } else {
          // Fallback to random deal
          scanMsg.textContent = '✅ Scan complete! Item added to cart.';
          addItemToCart(sampleDeals[Math.floor(Math.random() * sampleDeals.length)]);
        }
      }, 1800);
    } catch (err) {
      btn.classList.remove('glow');
      scanning = false;
      console.log('Camera error:', err.name, err.message);
      
      // If camera request failed, still add item (demo mode)
      if (err.name === 'NotAllowedError') {
        scanMsg.textContent = '⚠️ Camera denied - searching demo item...';
      } else if (err.name === 'NotFoundError') {
        scanMsg.textContent = '⚠️ No camera found - searching demo item...';
      } else {
        scanMsg.textContent = '⚠️ Camera unavailable - searching demo item...';
      }
      
      // Still add item in demo mode
      setTimeout(async () => {
        const mockBarcode = Math.random().toString().substr(2, 12);
        const product = await searchProductAPI(mockBarcode);
        
        if (product) {
          scanMsg.textContent = `✅ Found: ${product.name} - ${product.coupon}`;
          addItemToCart({
            ...product,
            flyer: getCategoryEmoji(product.category),
            price: product.price,
            sale: product.salePrice
          });
        } else {
          addItemToCart(sampleDeals[Math.floor(Math.random() * sampleDeals.length)]);
          scanMsg.textContent = '✅ Demo item added to cart!';
        }
      }, 500);
    }
  });

  // GET CATEGORY EMOJI
  function getCategoryEmoji(category) {
    const emojis = {
      'dairy': '🥛', 'bakery': '🍞', 'meat': '🍗', 'produce': '🍎',
      'seafood': '🐟', 'frozen': '🧊', 'snacks': '🍿', 'beverages': '🥤'
    };
    return emojis[category] || '🛒';
  }

  // INITIALIZE LOCATION
  getUserLocation();

  // ADD TO CART
  function addItemToCart(item) {
    cartItems.push(item);
    updateCartDisplay();
  }

  // UPDATE CART WITH TAX
  function updateCartDisplay() {
    const cartList = document.getElementById('cartList');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartSavings = document.getElementById('cartSavings');
    let subtotal = 0;
    let savings = 0;
    let tax = 0;

    if (cartItems.length === 0) {
      cartList.innerHTML = '<p class="empty-state">Your cart is empty</p>';
      cartSubtotal.textContent = '$0.00';
      cartSavings.textContent = '$0.00';
      document.getElementById('totalBill').textContent = '$0.00';
      document.getElementById('scannerSavings').textContent = '$0.00';
      return;
    }

    cartList.innerHTML = cartItems.map((item, i) => {
      const itemTax = calculateTax(item.salePrice || item.sale);
      const itemTotal = (item.salePrice || item.sale) + itemTax;
      
      subtotal += (item.salePrice || item.sale);
      savings += (item.savings || 0);
      tax += itemTax;
      
      return `<div class="cart-item sale">
        <h4>${item.flyer || '🛒'} ${item.name}</h4>
        <p>Regular: $${item.price.toFixed(2)} → Sale: $${(item.salePrice || item.sale).toFixed(2)}</p>
        <p style="color:var(--neon);">Save: $${(item.savings || 0).toFixed(2)} ${item.coupon || ''}</p>
        <p style="color:var(--muted);font-size:12px;">Tax: $${itemTax.toFixed(2)} (${(userLocation.state || 'CA')})</p>
        <p style="color:#e6fff2;font-weight:bold;">Total: $${itemTotal.toFixed(2)}</p>
      </div>`;
    }).join('');

    const total = subtotal + tax;
    cartSubtotal.textContent = '$' + subtotal.toFixed(2);
    cartSavings.textContent = '$' + savings.toFixed(2);
    document.getElementById('totalBill').textContent = '$' + total.toFixed(2);
    document.getElementById('scannerSavings').textContent = '$' + savings.toFixed(2);

    savingsData.current = savings;
    savingsData.month = (savingsData.month || 0) + savings;
    savingsData.year = (savingsData.year || 0) + savings;
    savingsData.lifetime = (savingsData.lifetime || 0) + savings;
    updateSavingsDisplay();
  }

  // POPULATE DEALS
  function updateDealsDisplay() {
    const dealsList = document.getElementById('salesList');
    dealsList.innerHTML = sampleDeals.map(deal => `
      <div class="sale-item">
        <div class="sale-header">
          <span class="sale-emoji">${deal.flyer}</span>
          <h3>${deal.name}</h3>
        </div>
        <div class="sale-pricing">
          <span class="regular-price">$${deal.price.toFixed(2)}</span>
          <span class="sale-price">$${deal.sale.toFixed(2)}</span>
          <span class="savings-amount">Save $${deal.savings.toFixed(2)}</span>
        </div>
        <button class="add-to-cart-btn" onclick="addItemToCart(${JSON.stringify(deal).replace(/"/g, '&quot;')})">
          Add to Cart
        </button>
      </div>
    `).join('');
  }

  // PHONE VERIFICATION SYSTEM
  function sendVerificationCode(phone) {
    // Simulate sending verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode_' + phone, code);
    localStorage.setItem('codeExpiry_' + phone, Date.now() + 300000); // 5 minutes
    alert(`Verification code sent to ${phone}: ${code} (Demo - In production, this would be SMS)`);
    return code;
  }

  function verifyCode(phone, enteredCode) {
    const storedCode = localStorage.getItem('verificationCode_' + phone);
    const expiry = localStorage.getItem('codeExpiry_' + phone);
    
    if (!storedCode || !expiry) return false;
    if (Date.now() > parseInt(expiry)) {
      localStorage.removeItem('verificationCode_' + phone);
      localStorage.removeItem('codeExpiry_' + phone);
      return false;
    }
    
    return storedCode === enteredCode;
  }

  // ENHANCED SIGN UP WITH VERIFICATION
  signUpBtn.addEventListener('click', () => {
    const phone = signupPhone.value.trim();
    const password = signupPassword.value;
    const confirm = signupConfirm.value;
    const referralCode = signupReferral.value.trim();

    if (!phone || !password || password !== confirm) {
      alert('Please fill in all fields correctly');
      return;
    }

    // Check if phone already exists
    if (localStorage.getItem('greenbackUser_' + phone)) {
      alert('An account with this phone number already exists');
      return;
    }

    // Send verification code
    const code = sendVerificationCode(phone);
    const enteredCode = prompt(`Enter the 6-digit verification code sent to ${phone}:`);
    
    if (!enteredCode || !verifyCode(phone, enteredCode)) {
      alert('Invalid or expired verification code');
      return;
    }

    let userData = {
      phone,
      password,
      referralCode: generateReferralCode(),
      referralCount: 0,
      altPhone: '',
      trialDaysLeft: 30,
      usedReferral: referralCode || null,
      createdAt: new Date().toISOString(),
      savings: { current: 0, month: 0, year: 0, lifetime: 0 },
      isSubscribed: false,
      subscriptionExpiry: null
    };

    // If used referral code, add free month to both users
    if (referralCode) {
      userData.trialDaysLeft = 60;
      // Process referral reward
      processReferralReward(referralCode);
    }

    localStorage.setItem('greenbackUser_' + phone, JSON.stringify(userData));
    loginUser(userData);
  });

  // PROCESS REFERRAL REWARDS
  function processReferralReward(referralCode) {
    // Find all users and check for matching referral code
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('greenbackUser_')) {
        const userData = JSON.parse(localStorage.getItem(key));
        if (userData.referralCode === referralCode) {
          // Give referrer 30 days free
          userData.trialDaysLeft = (userData.trialDaysLeft || 0) + 30;
          userData.referralCount = (userData.referralCount || 0) + 1;
          
          // Check for lifetime subscription
          if (userData.referralCount >= 25) {
            userData.isSubscribed = true;
            userData.subscriptionExpiry = null; // Lifetime
            userData.trialDaysLeft = 999;
          }
          
          localStorage.setItem(key, JSON.stringify(userData));
          break;
        }
      }
    }
  }

  // SUBSCRIPTION CHECK
  function checkSubscriptionStatus() {
    if (!currentUser) return false;
    
    // Lifetime subscription
    if (currentUser.isSubscribed && !currentUser.subscriptionExpiry) {
      return true;
    }
    
    // Paid subscription
    if (currentUser.isSubscribed && currentUser.subscriptionExpiry) {
      return new Date(currentUser.subscriptionExpiry) > new Date();
    }
    
    // Free trial
    return currentUser.trialDaysLeft > 0;
  }

  // PAYWALL CHECK
  function enforcePaywall() {
    if (checkSubscriptionStatus()) return true;
    
    alert('Your free trial has expired. Please subscribe to continue using all features.');
    showPage('page-profile');
    return false;
  }

  // PAGE NAVIGATION
  const navItems = document.querySelectorAll('.nav-item');
  const pages = document.querySelectorAll('#appContainer .page');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const pageId = item.getAttribute('data-page');
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(pageId).classList.add('active');
      
      if (pageId === 'page-sales') {
        updateDealsDisplay();
      }
    });
  });

  // BACK BUTTONS
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pageId = btn.getAttribute('data-page');
      navItems.forEach(nav => nav.classList.remove('active'));
      navItems[0].classList.add('active');
      pages.forEach(page => page.classList.remove('active'));
      document.getElementById(pageId).classList.add('active');
    });
  });

  // LOGOUT
  document.getElementById('logoutBtn').addEventListener('click', () => {
    if (currentUser && currentUser.phone) {
      localStorage.setItem('greenbackUser_' + currentUser.phone, JSON.stringify(currentUser));
    }
    currentUser = null;
    cartItems = [];
    savingsData = { current: 0, month: 0, year: 0, lifetime: 0 };
    pageAuth.style.display = 'flex';
    appContainer.style.display = 'none';
    authForm.style.display = 'block';
    signupForm.style.display = 'none';
    authPhone.value = '';
    authPassword.value = '';
  });

  // POST-LOGIN DEDUCT TRIAL DAYS
  setInterval(() => {
    if (currentUser && currentUser.trialDaysLeft > 0) {
      currentUser.trialDaysLeft--;
      document.getElementById('daysLeft').textContent = currentUser.trialDaysLeft;
    }
  }, 86400000); // Update daily

}); // Close DOMContentLoaded
