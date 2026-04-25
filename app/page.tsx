'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [page, setPage] = useState('store')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Default products if database is empty
  const defaultProducts = [
    { id: 1, name: "Brand Identity Kit", price: 49, category: "Design", emoji: "🎨", seller_name: "Studio Vera" },
    { id: 2, name: "Landing Page Template", price: 29, category: "UI Kit", emoji: "⚡", seller_name: "Pixels & Co." },
    { id: 3, name: "Python Scripts Bundle", price: 39, category: "Code", emoji: "🐍", seller_name: "DevCore" },
    { id: 4, name: "Notion Business OS", price: 19, category: "Template", emoji: "📋", seller_name: "Clara M." },
    { id: 5, name: "Cinematic LUT Pack", price: 24, category: "Photo/Video", emoji: "🎞️", seller_name: "Frame & Light" },
    { id: 6, name: "Legal Templates Pack", price: 59, category: "Documents", emoji: "📄", seller_name: "LegalKit" },
  ]

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase.from('products').select('*')
      if (data && data.length > 0) {
        setProducts(data)
      } else {
        setProducts(defaultProducts)
      }
      setLoading(false)
    }
    loadProducts()
  }, [])

  const [form, setForm] = useState({ name: '', price: '', category: 'Design', description: '', emoji: '🎨', seller_name: '' })

  async function handlePublish() {
    const { error } = await supabase.from('products').insert([form])
    if (!error) {
      alert('Product published!')
      setPage('store')
    } else {
      alert('Error: ' + error.message)
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', background: '#f9f6f0', minHeight: '100vh' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#0f0e0c', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 onClick={() => setPage('store')} style={{ color: '#c9a84c', fontSize: '1.5rem', margin: 0, fontStyle: 'italic', cursor: 'pointer' }}>Mercat</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setPage('store')} style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer' }}>Store</button>
          <button onClick={() => setPage('sell')} style={{ background: '#c9a84c', border: 'none', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Start Selling</button>
        </div>
      </nav>

      {/* STORE PAGE */}
      {page === 'store' && (
        <>
          <div style={{ background: '#0f0e0c', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
            <p style={{ color: '#c9a84c', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Digital Marketplace</p>
            <h2 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.2 }}>Buy & Sell <span style={{ color: '#c9a84c', fontStyle: 'italic' }}>Digital</span> Products</h2>
            <p style={{ color: '#aaa', marginBottom: '2rem' }}>Templates, code, design assets and more</p>
            <button onClick={() => setPage('sell')} style={{ background: '#c9a84c', border: 'none', padding: '0.75rem 2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>Start Selling</button>
          </div>

          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Featured Products</h3>
            {loading ? (
              <p style={{ color: '#888' }}>Loading products...</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {products.map(p => (
                  <div key={p.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                    <div style={{ background: '#f0ebe0', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
                      {p.emoji}
                    </div>
                    <div style={{ padding: '1.2rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{p.category}</div>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1rem' }}>by {p.seller_name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>${p.price}</span>
                        <button onClick={() => setSelectedProduct(p)} style={{ background: '#0f0e0c', color: 'white', border: 'none', padding: '0.45rem 1.1rem', borderRadius: '4px', cursor: 'pointer' }}>Buy</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer style={{ background: '#0f0e0c', color: '#aaa', padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#c9a84c', fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>Mercat</p>
            <p style={{ fontSize: '0.85rem' }}>© 2026 Mercat. The marketplace for digital products.</p>
          </footer>
        </>
      )}

      {/* SELL PAGE */}
      {page === 'sell' && (
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '2rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom: '0.5rem' }}>Upload a Product</h2>
          <p style={{ color: '#888', marginBottom: '2rem', fontSize: '0.9rem' }}>Fill in the details to list your product</p>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem' }}>Product Name</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Brand Identity Kit" style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem' }}>Your Name</label>
            <input value={form.seller_name} onChange={e => setForm({...form, seller_name: e.target.value})} placeholder="e.g. John Doe" style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem' }}>Price (USD)</label>
            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="29" style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem' }}>Emoji Icon</label>
            <input value={form.emoji} onChange={e => setForm({...form, emoji: e.target.value})} placeholder="🎨" style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }} />
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem' }}>Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}>
              <option>Design</option>
              <option>Code</option>
              <option>Template</option>
              <option>Photo/Video</option>
              <option>Documents</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.4rem' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What's included? Who is it for?" rows={4} style={{ width: '100%', padding: '0.65rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }} />
          </div>

          <button onClick={handlePublish} style={{ width: '100%', background: '#c9a84c', border: 'none', padding: '0.85rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
            Publish Product
          </button>
        </div>
      )}

      {/* BUY POPUP */}
      {selectedProduct && (
        <div onClick={() => setSelectedProduct(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '12px', padding: '2rem', maxWidth: '420px', width: '100%' }}>
            <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '1rem' }}>{selectedProduct.emoji}</div>
            <h3 style={{ marginBottom: '0.3rem' }}>{selectedProduct.name}</h3>
            <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '1.5rem' }}>by {selectedProduct.seller_name}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>${selectedProduct.price}</span>
              <button style={{ background: '#c9a84c', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Checkout →</button>
            </div>
            <button onClick={() => setSelectedProduct(null)} style={{ width: '100%', marginTop: '1rem', background: 'transparent', border: '1px solid #ddd', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', color: '#888' }}>Cancel</button>
          </div>
        </div>
      )}

    </main>
  )
}