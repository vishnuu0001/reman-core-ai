import React, { useState } from 'react';
import { Upload, Activity, ScanLine, Terminal, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeCore, generateAnalysisSteps } from '../services/AISimulationService';

import CameraFeed from './CameraFeed';
import ImageSelector from './ImageSelector';
import ResultCard from './ResultCard';

const Dashboard = () => {
    const [mode, setMode] = useState('upload');
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [coreType, setCoreType] = useState("Turbocharger");

    // Simulation State
    const [scanLog, setScanLog] = useState("");
    const [progress, setProgress] = useState(0);

    // --- Handlers ---
    const handleCapture = (imageSrc) => {
        setImage(imageSrc);
        setResult(null);
        setMode('preview');
    };

    const handleImageSelect = (imageSrc, type) => {
        setImage(imageSrc);
        setCoreType(type);
        setResult(null);
        setMode('preview');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setMode('preview');
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const runSimulation = async () => {
        if (!image) return;
        setAnalyzing(true);
        setResult(null);
        setScanLog("Initializing...");
        setProgress(0);

        const steps = generateAnalysisSteps();
        const stepDuration = 700;

        for (let i = 0; i < steps.length; i++) {
            await new Promise(r => setTimeout(r, stepDuration));
            setScanLog(steps[i]);
            setProgress(((i + 1) / steps.length) * 100);
        }

        const data = await analyzeCore(image, coreType);
        setResult(data);
        setAnalyzing(false);
    };

    const reset = () => {
        setImage(null);
        setResult(null);
        setMode('upload');
        setScanLog("");
        setProgress(0);
    };

    return (
        <div className="dashboard-container">
            <header className="app-header">
                <h1><Activity className="icon" /> RemanCore AI Predictor</h1>
            </header>

            <div className="main-grid">
                {/* --- LEFT COLUMN --- */}
                <div className="card input-section">
                    <div className="card-header">
                        <h2>Inspection Station</h2>
                        <div className="btn-group">
                            <button
                                onClick={() => { setMode('camera'); setImage(null); setResult(null); }}
                                className={mode === 'camera' ? 'active' : ''}
                            >
                                Camera
                            </button>
                            <button
                                onClick={() => { setMode('upload'); setImage(null); setResult(null); }}
                                className={mode === 'upload' ? 'active' : ''}
                            >
                                Upload / Gallery
                            </button>
                        </div>
                    </div>

                    <div className="controls">
                        <select value={coreType} onChange={(e) => setCoreType(e.target.value)}>
                            <option value="Turbocharger">Turbocharger</option>
                            <option value="Alternator">Alternator</option>
                            <option value="ECU Module">ECU Module</option>
                            <option value="Starter Motor">Starter Motor</option>
                            <option value="Transmission">Transmission</option>
                        </select>
                    </div>

                    <div className="viewport">
                        {mode === 'camera' && !image && (
                            <CameraFeed onCapture={handleCapture} />
                        )}

                        {mode === 'upload' && !image && (
                            <div className="upload-container-wrapper" style={{width: '100%', padding: '20px'}}>
                                <div className="upload-dropzone" style={{border: '2px dashed #334155', borderRadius: '12px', padding: '40px', textAlign: 'center', marginBottom: '20px', cursor: 'pointer', position: 'relative'}}>
                                    <Upload size={32} style={{marginBottom: '10px', color: '#64748b'}} />
                                    <p style={{margin: 0, color: '#94a3b8'}}>Tap to Upload File</p>
                                    <input type="file" onChange={handleFileUpload} accept="image/*" style={{opacity: 0, position: 'absolute', top:0, left:0, width:'100%', height:'100%'}} />
                                </div>
                                <ImageSelector onSelect={handleImageSelect} selectedImage={image} />
                            </div>
                        )}

                        {image && (
                            <>
                                <img src={image} alt="Core Inspection" />

                                {analyzing && (
                                    <>
                                        <motion.div
                                            className="scan-line"
                                            animate={{ top: ['0%', '100%', '0%'] }}
                                            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                        />
                                        <div className="simulation-log-overlay">
                                            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px'}}>
                                                <Terminal size={14} color="#00ff9d"/>
                                                <span style={{color:'#64748b', fontSize:'0.75rem'}}>AI_PROCESS_V1.2</span>
                                            </div>
                                            <p className="log-text">> {scanLog}</p>
                                            <div className="progress-bar">
                                                <div className="fill" style={{width: `${progress}%`}}></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {image && !analyzing && !result && (
                        <button className="analyze-btn" onClick={runSimulation}>
                            <ScanLine size={20} /> Run AI Diagnosis
                        </button>
                    )}
                    {result && (
                        <button className="analyze-btn" style={{background: '#334155'}} onClick={reset}>
                            Process Next Unit
                        </button>
                    )}
                </div>

                {/* --- RIGHT COLUMN --- */}
                <ResultCard result={result} loading={analyzing} />
            </div>
        </div>
    );
};

export default Dashboard;