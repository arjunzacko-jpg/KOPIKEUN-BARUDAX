import React, { useState, useMemo } from "react";
import { Coffee, Plus, Minus, Send, Clock, MapPin, X, Receipt as ReceiptIcon, Instagram } from "lucide-react";

const MENU = [
  { id: "ks1", cat: "Kopi Susu", name: "Kopi Susu Gula Aren", desc: "Robusta lokal, susu segar, gula aren asli", price: 18000 },
  { id: "ks2", cat: "Kopi Susu", name: "Es Kopi Susu Klasik", desc: "Racikan andalan, manis pas", price: 16000 },
  { id: "ks3", cat: "Kopi Susu", name: "Kopi Susu Vanila", desc: "Sentuhan vanila lembut", price: 17000 },
  { id: "ks4", cat: "Kopi Susu", name: "Piccolo Latte", desc: "Espresso ganda, susu tipis", price: 20000 },
  { id: "kh1", cat: "Kopi Hitam", name: "Kopi Tubruk", desc: "Racikan tradisional, diseduh kasar", price: 10000 },
  { id: "kh2", cat: "Kopi Hitam", name: "Americano", desc: "Espresso, air panas, simpel", price: 15000 },
  { id: "kh3", cat: "Kopi Hitam", name: "Long Black", desc: "Untuk yang suka pahit tegas", price: 15000 },
  { id: "kh4", cat: "Kopi Hitam", name: "Cold Brew", desc: "Diseduh dingin 12 jam", price: 20000 },
  { id: "nk1", cat: "Non-Kopi", name: "Matcha Latte", desc: "Matcha grade A, susu segar", price: 20000 },
  { id: "nk2", cat: "Non-Kopi", name: "Chocolate Malt", desc: "Coklat kental, malt renyah", price: 18000 },
  { id: "nk3", cat: "Non-Kopi", name: "Taro Latte", desc: "Manis lembut warna ungu", price: 19000 },
  { id: "nk4", cat: "Non-Kopi", name: "Teh Tarik", desc: "Ditarik sampai berbusa", price: 12000 },
  { id: "cm1", cat: "Camilan", name: "Pisang Goreng Coklat", desc: "Krispi luar, lumer dalam", price: 12000 },
  { id: "cm2", cat: "Camilan", name: "Roti Bakar Srikaya", desc: "Roti tebal, srikaya homemade", price: 15000 },
  { id: "cm3", cat: "Camilan", name: "Kentang Goreng", desc: "Disajikan dengan saus sambal", price: 15000 },
  { id: "cm4", cat: "Camilan", name: "Croissant Coklat", desc: "Berlapis, isi coklat leleh", price: 17000 },
];

const CATEGORIES = ["Semua", "Kopi Susu", "Kopi Hitam", "Non-Kopi", "Camilan"];
const WA_NUMBER = "6281234567890";

function rupiah(n) {
  return "Rp" + n.toLocaleString("id-ID");
}

export default function CafeApp() {
  const [activeCat, setActiveCat] = useState("Semua");
  const [cart, setCart] = useState({});
  const [note, setNote] = useState("");
  const [customer, setCustomer] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = activeCat === "Semua" ? MENU : MENU.filter((m) => m.cat === activeCat);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ ...MENU.find((m) => m.id === id), qty }));
  }, [cart]);

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = cartItems.reduce((sum, i) => sum + i.qty, 0);

  function addItem(id) {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }
  function removeItem(id) {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) - 1) };
      return next;
    });
  }

  function sendOrder() {
    if (cartItems.length === 0) return;
    let lines = [`*Pesanan baru - Kedai Kopi Seroja*`, ""];
    cartItems.forEach((i) => {
      lines.push(`${i.qty}x ${i.name} = ${rupiah(i.price * i.qty)}`);
    });
    lines.push("");
    lines.push(`Total: ${rupiah(total)}`);
    if (customer.trim()) lines.push(`Atas nama: ${customer.trim()}`);
    if (note.trim()) lines.push(`Catatan: ${note.trim()}`);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
  }

  return (
    <div className="app-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap');

        .app-root {
          --bg-dark: #241811;
          --bg-darker: #17100b;
          --paper: #EDE4D3;
          --paper-shadow: #D8CBAF;
          --gold: #C89B3C;
          --rust: #8B3A2B;
          --rust-bright: #A8452F;
          --cream: #F5EFE6;
          --ink: #241510;
          font-family: 'DM Sans', sans-serif;
          background: var(--bg-dark);
          color: var(--cream);
          min-height: 100vh;
        }
        .app-root * { box-sizing: border-box; }
        .display {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 0.04em;
        }
        .mono { font-family: 'Space Mono', monospace; }

        .dotted-leader {
          flex: 1;
          border-bottom: 1.5px dotted rgba(36,21,16,0.35);
          margin: 0 6px 5px;
          min-width: 12px;
        }
        .dotted-leader-light {
          flex: 1;
          border-bottom: 1.5px dotted rgba(245,239,230,0.25);
          margin: 0 6px 5px;
          min-width: 12px;
        }

        .receipt-tear::before, .receipt-tear::after {
          content: "";
          display: block;
          height: 12px;
          background-image: radial-gradient(circle at 6px 6px, var(--bg-dark) 6px, transparent 7px);
          background-size: 12px 12px;
          background-repeat: repeat-x;
        }
        .receipt-tear::before { margin-bottom: -1px; }
        .receipt-tear::after { transform: scaleY(-1); margin-top: -1px; }

        .cat-tab {
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1.5px solid rgba(245,239,230,0.25);
          background: transparent;
          color: var(--cream);
          cursor: pointer;
          white-space: nowrap;
          font-size: 14px;
          transition: all 0.15s ease;
        }
        .cat-tab:hover { border-color: var(--gold); }
        .cat-tab.active {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--ink);
        }

        .menu-card {
          background: var(--paper);
          border-radius: 4px;
          padding: 16px 18px;
          position: relative;
          box-shadow: 2px 3px 0 rgba(0,0,0,0.25);
        }
        .menu-card::after {
          content: "";
          position: absolute;
          left: 10px; right: 10px; bottom: 6px;
          border-bottom: 1px dashed rgba(36,21,16,0.2);
        }

        .qty-btn {
          width: 26px; height: 26px;
          border-radius: 50%;
          border: 1.5px solid var(--ink);
          background: transparent;
          color: var(--ink);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .qty-btn:hover { background: var(--ink); color: var(--paper); }

        .cta-btn {
          background: var(--rust);
          color: var(--cream);
          font-weight: 700;
          border: none;
          border-radius: 4px;
          padding: 12px 20px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: background 0.15s ease;
        }
        .cta-btn:hover { background: var(--rust-bright); }
        .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .receipt-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px dotted rgba(36,21,16,0.35);
          font-family: 'Space Mono', monospace;
          font-size: 13px;
          color: var(--ink);
          padding: 4px 2px;
          outline: none;
        }
        .receipt-input::placeholder { color: rgba(36,21,16,0.45); }

        .cart-drawer {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          transform: translateY(100%);
          transition: transform 0.28s ease;
          z-index: 40;
          max-height: 85vh;
          overflow-y: auto;
        }
        .cart-drawer.open { transform: translateY(0); }

        @media (min-width: 900px) {
          .cart-drawer { position: static; transform: none; max-height: none; overflow: visible; background: transparent !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 30, background: "var(--bg-darker)", borderBottom: "1px solid rgba(245,239,230,0.1)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Coffee size={24} color="var(--gold)" />
            <span className="display" style={{ fontSize: 26, lineHeight: 1 }}>KEDAI KOPI SEROJA</span>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            style={{ background: "var(--gold)", border: "none", borderRadius: 999, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "var(--ink)", fontWeight: 700 }}
          >
            <ReceiptIcon size={16} />
            <span className="mono" style={{ fontSize: 13 }}>{itemCount} · {rupiah(total)}</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: "56px 20px 40px", textAlign: "center", borderBottom: "1px solid rgba(245,239,230,0.08)" }}>
        <p className="mono" style={{ color: "var(--gold)", fontSize: 13, letterSpacing: "0.15em", marginBottom: 10 }}>
          UMKM LOKAL · NGOPI SEJAK 2020
        </p>
        <h1 className="display" style={{ fontSize: "clamp(40px, 8vw, 76px)", margin: "0 0 14px", lineHeight: 0.95 }}>
          NGOPI SANTAI,<br />HARGA RAKYAT
        </h1>
        <p style={{ maxWidth: 480, margin: "0 auto", color: "rgba(245,239,230,0.75)", fontSize: 15, lineHeight: 1.6 }}>
          Racikan kopi nusantara dari biji pilihan petani lokal. Pesan langsung dari sini, kami siapkan, tinggal ambil atau kami antar.
        </p>
      </section>

      {/* Main layout */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px 120px" }}>
        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 32 }}>
          <div>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`cat-tab ${activeCat === cat ? "active" : ""}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {filtered.map((item) => {
                const qty = cart[item.id] || 0;
                return (
                  <div key={item.id} className="menu-card">
                    <p style={{ color: "var(--ink)", fontWeight: 700, fontSize: 15, margin: "0 0 4px" }}>{item.name}</p>
                    <p style={{ color: "rgba(36,21,16,0.65)", fontSize: 12.5, margin: "0 0 14px", lineHeight: 1.4, minHeight: 32 }}>{item.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span className="mono" style={{ color: "var(--rust)", fontWeight: 700, fontSize: 14 }}>{rupiah(item.price)}</span>
                      {qty === 0 ? (
                        <button className="qty-btn" style={{ width: "auto", borderRadius: 4, padding: "5px 12px", fontSize: 13, fontWeight: 700 }} onClick={() => addItem(item.id)}>
                          + Tambah
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button className="qty-btn" onClick={() => removeItem(item.id)} aria-label="Kurangi"><Minus size={14} /></button>
                          <span className="mono" style={{ color: "var(--ink)", fontWeight: 700, minWidth: 14, textAlign: "center" }}>{qty}</span>
                          <button className="qty-btn" onClick={() => addItem(item.id)} aria-label="Tambah"><Plus size={14} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart / Receipt - desktop sidebar via CSS grid override, mobile via drawer */}
          <div className={`cart-drawer ${cartOpen ? "open" : ""}`} style={{ background: "rgba(0,0,0,0.5)" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px 40px", display: "flex", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", maxWidth: 380 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 4px" }}>
              <span className="display" style={{ fontSize: 22, color: "var(--cream)" }}>PESANAN ANDA</span>
              <button onClick={() => setCartOpen(false)} style={{ background: "transparent", border: "none", color: "var(--cream)", cursor: "pointer" }} aria-label="Tutup">
                <X size={22} />
              </button>
            </div>

            <div className="receipt-tear" />
            <div style={{ background: "var(--paper)", padding: "18px 20px" }}>
              <div style={{ textAlign: "center", marginBottom: 14 }}>
                <p className="display" style={{ color: "var(--ink)", fontSize: 20, margin: 0 }}>KEDAI KOPI SEROJA</p>
                <p className="mono" style={{ color: "rgba(36,21,16,0.6)", fontSize: 11, margin: "2px 0 0" }}>Jl. Melati No. 12, Tangerang</p>
              </div>

              {cartItems.length === 0 ? (
                <p className="mono" style={{ color: "rgba(36,21,16,0.55)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>
                  Keranjang masih kosong.<br />Yuk pilih menu dulu.
                </p>
              ) : (
                <div style={{ marginBottom: 12 }}>
                  {cartItems.map((i) => (
                    <div key={i.id} style={{ marginBottom: 10 }}>
                      <div style={{ display: "flex", alignItems: "baseline" }}>
                        <span className="mono" style={{ color: "var(--ink)", fontSize: 12.5 }}>{i.qty}x {i.name}</span>
                        <span className="dotted-leader" />
                        <span className="mono" style={{ color: "var(--ink)", fontSize: 12.5 }}>{rupiah(i.price * i.qty)}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                        <button className="qty-btn" style={{ width: 20, height: 20 }} onClick={() => removeItem(i.id)} aria-label="Kurangi"><Minus size={11} /></button>
                        <button className="qty-btn" style={{ width: 20, height: 20 }} onClick={() => addItem(i.id)} aria-label="Tambah"><Plus size={11} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop: "1.5px dashed rgba(36,21,16,0.3)", paddingTop: 10, marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "baseline" }}>
                  <span className="mono" style={{ color: "var(--ink)", fontWeight: 700, fontSize: 14 }}>TOTAL</span>
                  <span className="dotted-leader" />
                  <span className="mono" style={{ color: "var(--rust)", fontWeight: 700, fontSize: 15 }}>{rupiah(total)}</span>
                </div>
              </div>

              <input
                className="receipt-input"
                placeholder="Nama pemesan"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                style={{ marginBottom: 8 }}
              />
              <input
                className="receipt-input"
                placeholder="Catatan (opsional): tanpa gula, dsb"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ marginBottom: 4 }}
              />
            </div>
            <div className="receipt-tear" style={{ transform: "scaleY(-1)" }} />

            <button className="cta-btn" style={{ width: "100%", marginTop: 16 }} onClick={sendOrder} disabled={cartItems.length === 0}>
              <Send size={16} />
              Pesan via WhatsApp
            </button>
          </div>
          </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(245,239,230,0.1)", padding: "28px 20px", marginBottom: cartOpen ? 0 : 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(245,239,230,0.7)", fontSize: 13 }}>
            <MapPin size={15} /> Jl. Melati No. 12, Tangerang, Banten
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(245,239,230,0.7)", fontSize: 13 }}>
            <Clock size={15} /> Setiap hari, 08.00 - 22.00
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(245,239,230,0.7)", fontSize: 13 }}>
            <Instagram size={15} /> @kedaikopiseroja
          </div>
        </div>
        <p className="mono" style={{ textAlign: "center", color: "rgba(245,239,230,0.35)", fontSize: 11, marginTop: 20 }}>
          Kedai Kopi Seroja · UMKM Binaan Lokal · Nomor WhatsApp pada tombol pesan adalah contoh, ganti dengan nomor asli pemilik usaha.
        </p>
      </footer>

      {/* Floating cart button for mobile, hidden on desktop where sidebar is visible */}
      <style>{`
        @media (min-width: 900px) {
          .main-grid { grid-template-columns: 1fr 380px !important; align-items: start; }
          .cart-drawer { display: block !important; }
        }
        @media (max-width: 899px) {
          .cart-drawer:not(.open) { display: none; }
        }
      `}</style>
    </div>
  );
}
