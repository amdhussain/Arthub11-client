'use client';

import { useState } from 'react';
import api from '@/lib/axios';

export default function ApiTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/auth/login', { email, password });
      setResult({
        status: response.status,
        data: response.data,
      });
      console.log('Login success — full response:', response);
    } catch (err) {
      const errorInfo = {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
        fullError: err,
      };
      setError(errorInfo);
      console.error('Login failed — full error:', errorInfo);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/auth/signup', {
        email,
        username: email.split('@')[0],
        password,
      });
      setResult({
        status: response.status,
        data: response.data,
      });
      console.log('Signup success — full response:', response);
    } catch (err) {
      const errorInfo = {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      };
      setError(errorInfo);
      console.error('Signup failed — full error:', errorInfo);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 24, fontFamily: 'monospace' }}>
      <h2 style={{ marginBottom: 16 }}>API Connection Test</h2>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Email:</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4 }}>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={testLogin}
          disabled={loading}
          style={{ padding: '8px 16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Test Login'}
        </button>
        <button
          onClick={testSignup}
          disabled={loading}
          style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {loading ? 'Loading...' : 'Test Signup'}
        </button>
      </div>

      {result && (
        <div style={{ padding: 12, background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 4, marginBottom: 8 }}>
          <strong style={{ color: '#065f46' }}>SUCCESS (Status: {result.status})</strong>
          <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      {error && (
        <div style={{ padding: 12, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 4 }}>
          <strong style={{ color: '#991b1b' }}>ERROR (Status: {error.status})</strong>
          <pre style={{ marginTop: 8, fontSize: 12, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(error.data || { message: error.message }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
