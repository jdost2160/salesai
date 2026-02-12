import React, { useState } from 'react';

export default function SalesAI() {
  const [prospectInfo, setProspectInfo] = useState('');
  const [yourProduct, setYourProduct] = useState('');
  
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            SalesAI
          </h1>
          <p style={{ color: '#64748b' }}>AI-Powered B2B Email Writer</p>
        </header>

        <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Generate Personalized Emails
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
              Prospect Information
            </label>
            <textarea
              value={prospectInfo}
              onChange={(e) => setProspectInfo(e.target.value)}
              placeholder="Enter prospect details..."
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>
              Your Product/Service
            </label>
            <textarea
              value={yourProduct}
              onChange={(e) => setYourProduct(e.target.value)}
              placeholder="Describe your product..."
              style={{
                width: '100%',
                height: '120px',
                padding: '1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '0.875rem'
              }}
            />
          </div>

          <button
            style={{
              width: '100%',
              background: '#0f172a',
              color: 'white',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Generate Email Variations
          </button>
        </div>

        <div style={{ marginTop: '2rem', background: 'white', borderRadius: '1rem', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Coming Soon:
          </h3>
          <ul style={{ color: '#64748b', lineHeight: '2' }}>
            <li>✓ Reply Tracking Dashboard</li>
            <li>✓ Campaign Management</li>
            <li>✓ Performance Analytics</li>
            <li>✓ CRM Integrations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
