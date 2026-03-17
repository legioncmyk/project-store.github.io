import React, { useMemo, useState } from 'react';

const seedAccounts = [
  { id: 1, game: 'Mobile Legends', rank: 'Mythic', title: 'Akun Mythic 120 Skin', price: 1250000, status: 'tersedia' },
  { id: 2, game: 'Free Fire', rank: 'Heroic', title: 'Akun Evo Bundle', price: 740000, status: 'pending' },
  { id: 3, game: 'PUBG Mobile', rank: 'Conqueror', title: 'Akun Conqueror Rare', price: 1850000, status: 'tersedia' }
];

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function App() {
  const [user, setUser] = useState(() => localStorage.getItem('zr-user') || '');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [filters, setFilters] = useState({ game: 'all', rank: 'all', maxPrice: '' });
  const [accounts, setAccounts] = useState(seedAccounts);
  const [toast, setToast] = useState('');

  const games = [...new Set(seedAccounts.map((a) => a.game))];
  const ranks = [...new Set(seedAccounts.map((a) => a.rank))];

  const filtered = useMemo(() => accounts.filter((a) => {
    const byGame = filters.game === 'all' || filters.game === a.game;
    const byRank = filters.rank === 'all' || filters.rank === a.rank;
    const byPrice = !filters.maxPrice || a.price <= Number(filters.maxPrice);
    return byGame && byRank && byPrice;
  }), [accounts, filters]);

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }

  function login(e) {
    e.preventDefault();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(name) || !/^\d{4}$/.test(pin)) {
      notify('Input login tidak valid.');
      return;
    }
    localStorage.setItem('zr-user', name);
    setUser(name);
    setName('');
    setPin('');
    notify('Login berhasil.');
  }

  function buy(id) {
    if (!user) return notify('Login dulu sebelum beli akun.');
    setAccounts((prev) => prev.map((a) => (a.id === id && a.status === 'tersedia' ? { ...a, status: 'pending' } : a)));
    notify('Akun berhasil dibeli (simulasi aman).');
  }

  return (
    <div className="app">
      <header>
        <h1>ZALLSTORE <span>React</span></h1>
        {user ? <button onClick={() => { localStorage.removeItem('zr-user'); setUser(''); }}>Logout</button> : <small>Mode React Version</small>}
      </header>

      <section className="card">
        <h2>Filter Marketplace</h2>
        <div className="grid">
          <select value={filters.game} onChange={(e) => setFilters((f) => ({ ...f, game: e.target.value }))}>
            <option value="all">Semua Game</option>
            {games.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={filters.rank} onChange={(e) => setFilters((f) => ({ ...f, rank: e.target.value }))}>
            <option value="all">Semua Rank</option>
            {ranks.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <input type="number" placeholder="Harga maksimum" value={filters.maxPrice} onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))} />
        </div>
      </section>

      <section className="cards">
        {filtered.map((a) => (
          <article className="card" key={a.id}>
            <h3>{a.title}</h3>
            <p>{a.game} • {a.rank}</p>
            <strong>{fmt(a.price)}</strong>
            <p className={`status ${a.status}`}>{a.status}</p>
            <button disabled={a.status !== 'tersedia'} onClick={() => buy(a.id)}>Beli Aman</button>
          </article>
        ))}
      </section>

      {!user && (
        <section className="card">
          <h2>Login</h2>
          <form onSubmit={login} className="grid">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" maxLength={20} />
            <input value={pin} onChange={(e) => setPin(e.target.value)} type="password" placeholder="PIN 4 digit" maxLength={4} />
            <button type="submit">Masuk Dashboard</button>
          </form>
        </section>
      )}

      {user && <section className="card"><h2>Dashboard</h2><p>Selamat datang, {user.slice(0, 2)}***</p></section>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
