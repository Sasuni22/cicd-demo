import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/items`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setItems(d.data);
        setLoading(false);
      })
      .catch(() => {
        setMsg('Could not connect to server');
        setLoading(false);
      });
  }, []);

  const addItem = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await fetch(`${API}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => [data.data, ...prev]);
        setName('');
        setDescription('');
        setMsg('Item added successfully!');
        setTimeout(() => setMsg(''), 3000);
      } else {
        setMsg(data.error);
      }
    } catch {
      setMsg('Failed to add item');
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API}/api/items/${id}`, { method: 'DELETE' });
      setItems(prev => prev.filter(item => item._id !== id));
    } catch {
      setMsg('Failed to delete item');
    }
  };

  return (
    <div style={{
      maxWidth: 600,
      margin: '40px auto',
      fontFamily: 'Arial, sans-serif',
      padding: '0 20px'
    }}>
      <h1 style={{ color: '#1A3A5C', borderBottom: '2px solid #2563A8', paddingBottom: 10 }}>
        CI/CD Demo App
      </h1>
      <p style={{ color: '#6B7280' }}>
        Full-stack app with automated CI/CD pipeline
      </p>

      <form onSubmit={addItem} style={{ marginBottom: 24 }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Item name (required)"
          style={{
            width: '100%', padding: 10, fontSize: 16,
            marginBottom: 8, borderRadius: 4,
            border: '1px solid #D1D5DB', boxSizing: 'border-box'
          }}
        />
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description (optional)"
          style={{
            width: '100%', padding: 10, fontSize: 16,
            marginBottom: 8, borderRadius: 4,
            border: '1px solid #D1D5DB', boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 24px', background: '#2563A8',
            color: 'white', border: 'none', borderRadius: 4,
            fontSize: 16, cursor: 'pointer'
          }}
        >
          Add Item
        </button>
      </form>

      {msg && (
        <p style={{ color: msg.includes('success') ? 'green' : 'red' }}>
          {msg}
        </p>
      )}

      <h2 style={{ color: '#1A3A5C' }}>Items ({items.length})</h2>

      {loading && <p style={{ color: '#6B7280' }}>Loading...</p>}

      {!loading && items.length === 0 && (
        <p style={{ color: '#6B7280' }}>No items yet. Add one above!</p>
      )}

      {items.map(item => (
        <div key={item._id} style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: 12,
          border: '1px solid #D1D5DB', borderRadius: 6,
          marginBottom: 8, background: '#F9FAFB'
        }}>
          <div>
            <strong style={{ color: '#111827' }}>{item.name}</strong>
            {item.description && (
              <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: 14 }}>
                {item.description}
              </p>
            )}
            <small style={{ color: '#9CA3AF' }}>
              {new Date(item.createdAt).toLocaleDateString()}
            </small>
          </div>
          <button
            onClick={() => deleteItem(item._id)}
            style={{
              background: '#FEE2E2', color: '#B91C1C',
              border: 'none', borderRadius: 4,
              padding: '6px 12px', cursor: 'pointer', fontSize: 14
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}