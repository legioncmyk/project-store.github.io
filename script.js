const accounts = [
  { id: 1, game: 'Mobile Legends', title: 'Akun Sultan ML Mythic', level: 68, rank: 'Mythic', skin: 120, bind: 'Google', price: 1250000, status: 'tersedia' },
  { id: 2, game: 'Free Fire', title: 'Akun FF Evo Bundle', level: 63, rank: 'Heroic', skin: 48, bind: 'FB', price: 740000, status: 'pending' },
  { id: 3, game: 'PUBG Mobile', title: 'Akun PUBG Conqueror', level: 75, rank: 'Conqueror', skin: 70, bind: 'Twitter', price: 1850000, status: 'tersedia' },
  { id: 4, game: 'Mobile Legends', title: 'Akun ML Epic Murah', level: 38, rank: 'Epic', skin: 35, bind: 'VK', price: 390000, status: 'terjual' },
  { id: 5, game: 'Free Fire', title: 'Akun FF Sultan Old', level: 80, rank: 'Grandmaster', skin: 140, bind: 'Google', price: 2200000, status: 'tersedia' }
];

const secureStore = {
  key: 'zallstore-user',
  getUser() {
    try { return JSON.parse(localStorage.getItem(this.key)); } catch { return null; }
  },
  setUser(data) {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
};

const txKey = 'zallstore-transactions';
const currency = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const marketGrid = document.getElementById('marketGrid');
const filterGame = document.getElementById('filterGame');
const filterRank = document.getElementById('filterRank');
const filterPrice = document.getElementById('filterPrice');
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function maskUser(name) {
  return `${name.slice(0, 2)}***`;
}

function loadFilters() {
  [...new Set(accounts.map((a) => a.game))].forEach((game) => {
    filterGame.insertAdjacentHTML('beforeend', `<option value="${game}">${game}</option>`);
  });
  [...new Set(accounts.map((a) => a.rank))].forEach((rank) => {
    filterRank.insertAdjacentHTML('beforeend', `<option value="${rank}">${rank}</option>`);
  });
}

function getFiltered() {
  const game = filterGame.value;
  const rank = filterRank.value;
  const maxPrice = Number(filterPrice.value || Infinity);

  return accounts.filter((a) => {
    const gameOK = game === 'all' || a.game === game;
    const rankOK = rank === 'all' || a.rank === rank;
    const priceOK = a.price <= maxPrice;
    return gameOK && rankOK && priceOK;
  });
}

function buyAccount(id) {
  const user = secureStore.getUser();
  if (!user) {
    showToast('Silakan login dulu sebelum membeli akun.');
    return;
  }

  const account = accounts.find((a) => a.id === id);
  if (!account || account.status !== 'tersedia') {
    showToast('Akun tidak tersedia untuk dibeli.');
    return;
  }

  account.status = 'pending';
  const tx = JSON.parse(localStorage.getItem(txKey) || '[]');
  tx.unshift({
    user: maskUser(user.username),
    item: account.title,
    amount: account.price,
    status: 'Pembayaran diverifikasi'
  });
  localStorage.setItem(txKey, JSON.stringify(tx.slice(0, 10)));
  renderMarket();
  renderDashboard();
  showToast('Akun berhasil dibeli (simulasi transaksi aman).');
}

function renderMarket() {
  marketGrid.innerHTML = '';
  const data = getFiltered();
  if (!data.length) {
    marketGrid.innerHTML = '<div class="card">Tidak ada akun sesuai filter.</div>';
    return;
  }

  data.forEach((a) => {
    marketGrid.insertAdjacentHTML('beforeend', `
      <article class="account-card card">
        <h3>${a.title}</h3>
        <p class="meta">${a.game} • Level ${a.level} • Rank ${a.rank}</p>
        <p class="meta">Skin: ${a.skin} • Bind: ${a.bind}</p>
        <strong>${currency(a.price)}</strong>
        <div class="status ${a.status}">${a.status.toUpperCase()}</div>
        <button class="cta" ${a.status !== 'tersedia' ? 'disabled' : ''} data-buy="${a.id}">Beli Aman</button>
      </article>
    `);
  });

  marketGrid.querySelectorAll('[data-buy]').forEach((btn) => {
    btn.addEventListener('click', () => buyAccount(Number(btn.dataset.buy)));
  });
}

function renderDashboard() {
  const user = secureStore.getUser();
  const dashboard = document.getElementById('dashboardPanel');
  const loginPanel = document.getElementById('loginPanel');

  if (!user) {
    dashboard.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    return;
  }

  document.getElementById('profileName').textContent = `User: ${maskUser(user.username)}`;
  dashboard.classList.remove('hidden');
  loginPanel.classList.add('hidden');

  const tx = JSON.parse(localStorage.getItem(txKey) || '[]').filter((t) => t.user.startsWith(user.username.slice(0, 2)));
  document.getElementById('transactionList').innerHTML = tx.length
    ? tx.map((t) => `<li>${t.item} - ${currency(t.amount)} (${t.status})</li>`).join('')
    : '<li>Belum ada transaksi.</li>';

  const owned = accounts.filter((a) => a.status === 'pending').slice(0, 5);
  document.getElementById('ownedList').innerHTML = owned.length
    ? owned.map((a) => `<li>${a.title} - status ${a.status}</li>`).join('')
    : '<li>Belum ada akun dibeli/dijual.</li>';
}

function setupLogin() {
  const form = document.getElementById('loginForm');
  const loginToggle = document.getElementById('loginToggle');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const pin = document.getElementById('pin').value.trim();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      showToast('Username minimal 3 karakter, hanya huruf/angka/_');
      return;
    }
    if (!/^\d{4}$/.test(pin)) {
      showToast('PIN harus 4 digit angka.');
      return;
    }

    secureStore.setUser({ username, token: btoa(`${username}:${Date.now()}`) });
    renderDashboard();
    showToast('Login berhasil. Selamat datang!');
  });

  loginToggle.addEventListener('click', () => {
    localStorage.removeItem(secureStore.key);
    renderDashboard();
    showToast('Session direset. Silakan login ulang.');
  });
}

function setupSlider() {
  const track = document.getElementById('sliderTrack');
  const slides = [...track.children];
  const dots = document.getElementById('sliderDots');
  let index = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dots.appendChild(dot);
  });

  function goTo(i) {
    index = i;
    track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
    [...dots.children].forEach((d, idx) => d.classList.toggle('active', idx === index));
  }

  setInterval(() => goTo((index + 1) % slides.length), 4200);
}

window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('hidden'), 750);
  loadFilters();
  renderMarket();
  renderDashboard();
  setupLogin();
  setupSlider();

  [filterGame, filterRank, filterPrice].forEach((el) => el.addEventListener('input', renderMarket));
});
