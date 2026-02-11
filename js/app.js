const { InteractionManager } = require("react-native");

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
  showSplashScreen
  // APP STATE
  let currentUser = null;
  let budget = 100.00;
  let cartItems = [];
  let savingsData = { current: 0, month: 0, year: 0, lifetime: 0 };

  // SAMPLE DATA
  const sampleDeals = [
    { id: 1, name: 'Milk', price: 2.50, sale: 1.99, savings: 0.51, flyer: '🥛' },
    { id: 2, name: 'Bread', price: 3.00, sale: 2.29, savings: 0.71, flyer: '🍞' },
    { id: 3, name: 'Cheese', price: 5.99, sale: 3.99, savings: 2.00, flyer: '🧀' },
    { id: 4, name: 'Eggs', price: 4.50, sale: 2.99, savings: 1.51, flyer: '🥚' },
  ];

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
    document.getElementById('planStatus').textContent = currentUser.trialDaysLeft > 0 ? 'Free Trial' : 'Expired';
    document.getElementById('daysLeft').textContent = Math.max(0, currentUser.trialDaysLeft);
    document.getElementById('referralCode').textContent = currentUser.referralCode;
    document.getElementById('referralCount').textContent = currentUser.referralCount;

    if (currentUser.referralCount >= 25) {
      document.getElementById('superStatus').style.display = 'block';
    }

    if (currentUser.altPhone) {
      document.getElementById('altPhoneDisplay').textContent = 'Alt: ' + currentUser.altPhone;
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

  // SCAN BUTTON
  let scanning = false;
  document.getElementById('scanBtn').addEventListener('click', async () => {
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
      
      setTimeout(() => {
        btn.classList.remove('glow');
        scanning = false;
        scanMsg.textContent = '✅ Scan complete! Item added to cart.';
        // Add random item
        addItemToCart(sampleDeals[Math.floor(Math.random() * sampleDeals.length)]);
      }, 1800);
    } catch (err) {
      btn.classList.remove('glow');
      scanning = false;
      console.log('Camera error:', err.name, err.message);
      
      // If camera request failed, still add item (demo mode)
      if (err.name === 'NotAllowedError') {
        scanMsg.textContent = '⚠️ Camera denied - opening demo item...';
      } else if (err.name === 'NotFoundError') {
        scanMsg.textContent = '⚠️ No camera found - opening demo item...';
      } else {
        scanMsg.textContent = '⚠️ Camera unavailable - opening demo item...';
      }
      
      // Still add item in demo mode
      setTimeout(() => {
        addItemToCart(sampleDeals[Math.floor(Math.random() * sampleDeals.length)]);
        scanMsg.textContent = '✅ Demo item added to cart!';
      }, 500);
    }
  });

  // ADD TO CART
  function addItemToCart(item) {
    cartItems.push(item);
    updateCartDisplay();
  }

  // UPDATE CART
  function updateCartDisplay() {
    const cartList = document.getElementById('cartList');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartSavings = document.getElementById('cartSavings');
    let total = 0;
    let savings = 0;

    if (cartItems.length === 0) {
      cartList.innerHTML = '<p class="empty-state">Your cart is empty</p>';
      cartSubtotal.textContent = '$0.00';
      cartSavings.textContent = '$0.00';
      return;
    }

    cartList.innerHTML = cartItems.map((item, i) => {
      total += item.sale;
      savings += item.savings;
      return `<div class="cart-item sale">
        <h4>${item.flyer} ${item.name}</h4>
        <p>Regular: $${item.price.toFixed(2)} → Sale: $${item.sale.toFixed(2)}</p>
        <p style="color:var(--neon);">Save: $${item.savings.toFixed(2)}</p>
      </div>`;
    }).join('');

    cartSubtotal.textContent = '$' + total.toFixed(2);
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
      <div class="deal-card">
        <h4>${deal.flyer} ${deal.name}</h4>
        <p>Was: $${deal.price.toFixed(2)}</p>
        <div class="deal-price">Now: $${deal.sale.toFixed(2)}</div>
        <p style="color:var(--neon);font-size:12px;">Save: $${deal.savings.toFixed(2)}</p>
      </div>
    `).join('');
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
