// State Management
let currentUser = { name: "Alex Johnson", email: "alex@creator.com", role: "creator", authenticated: true };
let currentRole = "creator";
let selectedRegisterRole = "creator";
let currentTab = "dashboard";
let currentAdminSubScreen = "dashboard";
let isAdminAuthenticated = false;

// Navigation & Tab Switcher
function switchTab(tabId) {
  currentTab = tabId;
  const tabs = document.querySelectorAll('.tab-view');
  tabs.forEach(tab => tab.classList.add('hidden'));

  const navBtns = document.querySelectorAll('#main-nav button');
  navBtns.forEach(btn => btn.classList.remove('active'));

  const targetTab = document.getElementById(`tab-${tabId}`);
  if (targetTab) {
    targetTab.classList.remove('hidden');
  }

  const targetBtn = document.getElementById(`nav-${tabId}-btn`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }

  const banner = document.getElementById('protected-access-banner');
  if (!currentUser.authenticated && (tabId === 'wallet' || tabId === 'profile' || tabId === 'settings')) {
    if (banner) banner.classList.remove('hidden');
  } else {
    if (banner) banner.classList.add('hidden');
  }

  if (tabId === 'admin') {
    performAdminLogin();
  }
}

// Auth Modals & Views
function openAuthModal(view = 'login') {
  document.getElementById('auth-modal-overlay').classList.remove('hidden');
  switchAuthView(view);
}

function closeAuthModal() {
  document.getElementById('auth-modal-overlay').classList.add('hidden');
}

function switchAuthView(view) {
  document.getElementById('auth-form-login').classList.add('hidden');
  document.getElementById('auth-form-register').classList.add('hidden');
  document.getElementById('auth-form-forgot').classList.add('hidden');
  document.getElementById('auth-form-reset').classList.add('hidden');

  document.getElementById(`auth-form-${view}`).classList.remove('hidden');
}

function selectRegisterRole(role) {
  selectedRegisterRole = role;
  const creatorBtn = document.getElementById('role-creator-btn');
  const brandBtn = document.getElementById('role-brand-btn');
  if (role === 'creator') {
    creatorBtn.className = 'btn-primary';
    brandBtn.className = 'btn-secondary';
  } else {
    creatorBtn.className = 'btn-secondary';
    brandBtn.className = 'btn-primary';
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;
  const err = document.getElementById('login-error');

  if (email.includes('invalid') || pass === 'wrong') {
    err.classList.remove('hidden');
    return;
  }

  err.classList.add('hidden');
  currentUser = { name: email.split('@')[0], email: email, role: 'creator', authenticated: true };
  updateSessionUI();
  closeAuthModal();
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const pass = document.getElementById('register-password').value;
  const err = document.getElementById('register-error');

  if (email.includes('duplicate')) {
    err.innerText = "Email address already registered";
    err.classList.remove('hidden');
    return;
  }
  if (pass.length < 6) {
    err.innerText = "Password must be at least 6 characters";
    err.classList.remove('hidden');
    return;
  }

  err.classList.add('hidden');
  currentUser = { name: document.getElementById('register-name').value, email: email, role: selectedRegisterRole, authenticated: true };
  updateSessionUI();
  closeAuthModal();
  document.getElementById('onboarding-container').classList.remove('hidden');
}

function handleForgotSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('forgot-email').value;
  const err = document.getElementById('forgot-error');
  const succ = document.getElementById('forgot-success');

  if (email.includes('invalid')) {
    err.classList.remove('hidden');
    succ.classList.add('hidden');
  } else {
    err.classList.add('hidden');
    succ.classList.remove('hidden');
    setTimeout(() => switchAuthView('reset'), 1000);
  }
}

function handleResetSubmit(event) {
  event.preventDefault();
  const p1 = document.getElementById('reset-password').value;
  const p2 = document.getElementById('reset-confirm-password').value;
  const err = document.getElementById('reset-error');
  const succ = document.getElementById('reset-success');

  if (p1 !== p2) {
    err.classList.remove('hidden');
    succ.classList.add('hidden');
  } else {
    err.classList.add('hidden');
    succ.classList.remove('hidden');
  }
}

function performLogout() {
  currentUser = { name: "", email: "", role: "", authenticated: false };
  updateSessionUI();
  switchTab('dashboard');
}

function updateSessionUI() {
  const nameLabel = document.getElementById('session-user-name');
  const loginBtn = document.getElementById('login-modal-open-btn');
  const registerBtn = document.getElementById('register-modal-open-btn');
  const logoutBtn = document.getElementById('logout-act-btn');

  if (currentUser.authenticated) {
    nameLabel.innerText = `${currentUser.name} (${currentUser.role})`;
    loginBtn.classList.add('hidden');
    registerBtn.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    nameLabel.innerText = "Guest";
    loginBtn.classList.remove('hidden');
    registerBtn.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }

  const creatorView = document.getElementById('dashboard-creator-view');
  const brandView = document.getElementById('dashboard-brand-view');
  if (currentUser.role === 'brand') {
    if (creatorView) creatorView.classList.add('hidden');
    if (brandView) brandView.classList.remove('hidden');
  } else {
    if (creatorView) creatorView.classList.remove('hidden');
    if (brandView) brandView.classList.add('hidden');
  }
}

function completeOnboarding(skip = false) {
  document.getElementById('onboarding-container').classList.add('hidden');
  switchTab('dashboard');
}

// Discover & Search Filters
function filterDiscover() {}

function resetDiscoverFilters() {
  document.getElementById('discover-search').value = '';
  document.getElementById('discover-category').value = 'all';
  document.getElementById('discover-followers').value = 'all';
  document.getElementById('discover-engagement').value = 'all';
  document.getElementById('discover-industry').value = '';
  document.getElementById('discover-budget').value = 'all';
}

function toggleBookmark(id) {
  const btn = document.getElementById(`bookmark-btn-${id}`);
  const status = document.getElementById(`bookmark-status-${id}`);
  if (status.classList.contains('hidden')) {
    status.classList.remove('hidden');
    btn.innerText = "Bookmarked";
  } else {
    status.classList.add('hidden');
    btn.innerText = "Bookmark";
  }
}

function triggerDirectMessage(name) {
  switchTab('messages');
  openChatThread(name);
}

function viewCampaignBriefModal(title) {
  switchTab('campaigns');
}

// AI Brief Generator
function openAIBriefModal() {
  document.getElementById('ai-brief-modal-overlay').classList.remove('hidden');
}

function closeAIBriefModal() {
  document.getElementById('ai-brief-modal-overlay').classList.add('hidden');
}

function generateAIBrief() {
  const goals = document.getElementById('ai-goals-input').value || "Product launch campaign";
  const audience = document.getElementById('ai-audience-input').value || "Young professionals";
  const outputBox = document.getElementById('ai-output-container');
  const outputText = document.getElementById('ai-generated-text');

  outputText.innerText = `AI Proposed Brief: Target ${audience} to achieve ${goals}. Deliverables: 1 Sponsored Video Reel + 2 Instagram Stories with promo code discount.`;
  outputBox.classList.remove('hidden');
}

function applyAIBriefToCampaign() {
  closeAIBriefModal();
  openCampaignCreationModal();
  const outputText = document.getElementById('ai-generated-text').innerText;
  document.getElementById('new-camp-deliverables').value = outputText;
}

// Multi-step Campaign Form
function openCampaignCreationModal() {
  document.getElementById('campaign-creation-modal').classList.remove('hidden');
  nextCampaignStep(1);
}

function closeCampaignCreationModal() {
  document.getElementById('campaign-creation-modal').classList.add('hidden');
}

function nextCampaignStep(step) {
  document.getElementById('camp-step-1').classList.add('hidden');
  document.getElementById('camp-step-2').classList.add('hidden');
  document.getElementById('camp-step-3').classList.add('hidden');
  document.getElementById('camp-step-4').classList.add('hidden');

  document.getElementById(`camp-step-${step}`).classList.remove('hidden');
}

function saveCampaignDraft() {
  closeCampaignCreationModal();
}

function publishCampaign() {
  const title = document.getElementById('new-camp-title').value;
  const err = document.getElementById('campaign-form-error');
  if (!title) {
    err.classList.remove('hidden');
    return;
  }
  err.classList.add('hidden');
  closeCampaignCreationModal();
  switchTab('campaigns');
}

function submitCampaignPitch() {}

function acceptApplicant(id) {}

function rejectApplicant(id) {}

function submitMilestone() {}

function requestMilestoneRevision() {}

function approveMilestone() {}

function editCampaign(id) {
  openCampaignCreationModal();
}

function togglePauseCampaign(id) {
  const btn = document.getElementById('campaign-pause-btn');
  if (btn.innerText === "Pause Campaign") {
    btn.innerText = "Resume Campaign";
  } else {
    btn.innerText = "Pause Campaign";
  }
}

function openCancelCampaignModal() {
  document.getElementById('cancel-campaign-modal').classList.remove('hidden');
}

function closeCancelCampaignModal() {
  document.getElementById('cancel-campaign-modal').classList.add('hidden');
}

function confirmCancelCampaign() {
  closeCancelCampaignModal();
}

// Wallet & Razorpay
function openWithdrawModal() {
  document.getElementById('wallet-withdraw-modal-overlay').classList.remove('hidden');
}

function closeWithdrawModal() {
  document.getElementById('wallet-withdraw-modal-overlay').classList.add('hidden');
}

function submitWithdrawal() {
  const amount = parseFloat(document.getElementById('withdraw-amount').value || 0);
  const err = document.getElementById('withdraw-error');
  if (amount > 5420) {
    err.classList.remove('hidden');
    return;
  }
  err.classList.add('hidden');
  closeWithdrawModal();
}

function openRazorpayModal() {
  document.getElementById('razorpay-modal-overlay').classList.remove('hidden');
}

function closeRazorpayModal() {
  document.getElementById('razorpay-modal-overlay').classList.add('hidden');
}

function submitRazorpayPayment() {
  const badge = document.getElementById('razorpay-success');
  badge.classList.remove('hidden');
  setTimeout(() => closeRazorpayModal(), 1200);
}

function filterWalletTransactions() {}

// Contracts
function submitContractSignature() {
  const badge = document.getElementById('contract-signed-badge');
  badge.classList.remove('hidden');
}

function signPublicContract() {}

// Profile
function toggleProfileEditForm() {
  const form = document.getElementById('profile-edit-form');
  form.classList.toggle('hidden');
}

function saveProfileEdit() {
  const insta = document.getElementById('edit-profile-insta').value;
  const err = document.getElementById('profile-edit-error');
  if (insta && !insta.startsWith('http')) {
    err.classList.remove('hidden');
    return;
  }
  err.classList.add('hidden');
  document.getElementById('profile-display-name').innerText = document.getElementById('edit-profile-name').value;
  document.getElementById('profile-bio-val').innerText = document.getElementById('edit-profile-bio').value;
  toggleProfileEditForm();
}

// Support Assistant
function openSupportAssistant() {
  document.getElementById('support-widget').classList.remove('hidden');
}

function closeSupportAssistant() {
  document.getElementById('support-widget').classList.add('hidden');
}

function sendSupportMessage() {
  const input = document.getElementById('support-input-text');
  const log = document.getElementById('support-chat-log');
  if (!input.value.trim()) return;

  const userMsg = document.createElement('div');
  userMsg.style.cssText = "background: #0284c7; padding: 6px 10px; border-radius: 6px; margin-bottom: 6px; align-self: flex-end; text-align: right;";
  userMsg.innerText = input.value;
  log.appendChild(userMsg);

  setTimeout(() => {
    const botMsg = document.createElement('div');
    botMsg.style.cssText = "background: #0f172a; padding: 6px 10px; border-radius: 6px; margin-bottom: 6px;";
    botMsg.innerText = "Support AI: Thanks for reaching out! Our team is available 24/7.";
    botMsg.setAttribute('data-testid', 'support-chat-latest-response');
    log.appendChild(botMsg);
    log.scrollTop = log.scrollHeight;
  }, 200);

  input.value = '';
}

// Messages & Chat
function openChatThread(name) {
  document.getElementById('chat-thread-title').innerText = name;
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chat-input-text');
  const history = document.getElementById('chat-history');
  if (!input.value.trim()) return;

  const msg = document.createElement('div');
  msg.style.cssText = "background: #0284c7; padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; margin-left: auto; max-width: 80%;";
  msg.innerText = input.value;
  history.appendChild(msg);

  input.value = '';
  document.getElementById('attachment-preview-box').classList.add('hidden');
}

function attachFileToChat() {
  document.getElementById('attachment-preview-box').classList.remove('hidden');
}

// Notifications
function toggleNotifications() {
  const menu = document.getElementById('notifications-dropdown-menu');
  menu.classList.toggle('hidden');
}

function markNotificationRead(id) {
  const item = document.querySelector(`[data-testid="notification-item-${id}"]`);
  if (item) item.style.opacity = '0.4';
}

function markAllNotificationsRead() {
  const count = document.getElementById('notifications-count-badge');
  if (count) count.innerText = '0';
}

// Settings
function toggleTheme() {
  const current = document.body.getAttribute('data-theme');
  const status = document.getElementById('theme-status-lbl');
  if (current === 'dark') {
    document.body.setAttribute('data-theme', 'light');
    document.body.style.backgroundColor = '#f8fafc';
    document.body.style.color = '#0f172a';
    status.innerText = 'Light Mode';
  } else {
    document.body.setAttribute('data-theme', 'dark');
    document.body.style.backgroundColor = '#0f172a';
    document.body.style.color = '#f8fafc';
    status.innerText = 'Dark Mode';
  }
}

function saveSettingsSecurity() {}

// Admin Panel
function performAdminLogin() {
  isAdminAuthenticated = true;
  const loginBox = document.getElementById('admin-login-box');
  const panel = document.getElementById('admin-panel-content');
  if (loginBox) loginBox.classList.add('hidden');
  if (panel) panel.classList.remove('hidden');
}

function switchAdminScreen(screenId) {
  performAdminLogin();
  document.getElementById('admin-sub-dashboard').classList.add('hidden');
  document.getElementById('admin-sub-users').classList.add('hidden');
  document.getElementById('admin-sub-campaigns').classList.add('hidden');
  document.getElementById('admin-sub-disputes').classList.add('hidden');
  document.getElementById('admin-sub-announcements').classList.add('hidden');

  const sub = document.getElementById(`admin-sub-${screenId}`);
  if (sub) sub.classList.remove('hidden');
}

function toggleUserSuspend(id) {
  const lbl = document.getElementById(`admin-user-status-val-${id}`);
  const btn = document.querySelector(`[data-testid="admin-user-suspend-btn-${id}"]`);
  if (lbl.innerText === "Active") {
    lbl.innerText = "Suspended";
    lbl.className = "badge badge-warning";
    btn.innerText = "Restore";
  } else {
    lbl.innerText = "Active";
    lbl.className = "badge badge-success";
    btn.innerText = "Suspend";
  }
}

function filterAdminUsers() {}

function resolveDisputeRefund(id) {
  const lbl = document.getElementById(`dispute-status-lbl-${id}`);
  lbl.innerText = "Refunded & Closed";
  lbl.className = "badge badge-success";
}

function publishAnnouncement() {
  document.getElementById('admin-toast-msg').classList.remove('hidden');
}
