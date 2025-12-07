// src/components/ResultCard.js
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Shield, Clock, BarChart2 } from 'lucide-react';

const ResultCard = ({ result, loading }) => {
    return (
        <div className="card results-section" style={{minHeight: '400px', display:'flex', flexDirection:'column'}}>
            <div className="card-header">
                <h2>2. AI Diagnostic Report</h2>
            </div>

            {/* State 1: Idle */}
            {!result && !loading && (
                <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', color: '#64748b'
                }}>
                    Waiting for core analysis...
                </div>
            )}

            {/* State 2: Loading */}
            {loading && (
                <div className="loading-state" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div className="spinner" style={{
                        width: '50px', height: '50px', border: '4px solid rgba(255,255,255,0.1)',
                        borderTop: '4px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{marginTop: '20px', color: '#94a3b8'}}>Processing visual data...</p>
                </div>
            )}

            {/* State 3: Final Result */}
            {result && !loading && (
                <div className="results-content fade-in">

                    {/* STATUS BADGE */}
                    <div className={`status-badge ${result.status.toLowerCase()}`} style={{
                        padding: '24px', borderRadius: '12px', textAlign: 'center', marginBottom: '24px',
                        background: result.status === 'Pass' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.15)',
                        border: result.status === 'Pass' ? '1px solid #10b981' : '1px solid #ef4444',
                        color: result.status === 'Pass' ? '#10b981' : '#ef4444'
                    }}>
                        {result.status === 'Pass' ? <CheckCircle size={48} /> : <XCircle size={48} />}
                        <h1 style={{margin: '10px 0 0 0', fontSize: '2.5rem', textTransform: 'uppercase', letterSpacing:'2px'}}>
                            {result.status === 'Salvage' ? 'REJECTED' : 'ACCEPTED'}
                        </h1>
                        <p style={{margin: 0, opacity: 0.8}}>{result.status === 'Pass' ? 'Condition Meets Reman Standards' : 'Critical Defects Detected - Recycle'}</p>
                    </div>

                    {/* METRICS */}
                    <div className="metric-grid">
                        <div className="metric-box">
                            <label><Clock size={12}/> EST. NEW LIFE</label>
                            <span className="value" style={{color: result.predictedLifeYears < 3 ? '#ef4444' : 'white'}}>
                {result.predictedLifeYears} <small>Yrs</small>
              </span>
                        </div>
                        <div className="metric-box">
                            <label><Shield size={12}/> WARRANTY</label>
                            <span className="value">
                {result.warrantyMonths} <small>Mo</small>
              </span>
                        </div>
                        <div className="metric-box">
                            <label><BarChart2 size={12}/> CONFIDENCE</label>
                            <span className="value">{result.confidence}</span>
                        </div>
                    </div>

                    {/* DEFECT LIST */}
                    <div className="defects-list">
                        <h3 style={{fontSize: '0.9rem', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px'}}>
                            IDENTIFIED ANOMALIES
                        </h3>
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {result.defects.map((d, i) => (
                                <li key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', padding: '12px',
                                    marginBottom: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px',
                                    borderLeft: d.severity === 'High' ? '4px solid #ef4444' : d.severity === 'Medium' ? '4px solid #f59e0b' : '4px solid #10b981'
                                }}>
                                    <span>{d.name}</span>
                                    <span className="severity-tag" style={{
                                        fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.1)'
                                    }}>{d.severity}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResultCard;