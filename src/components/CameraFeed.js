import React, { useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

const CameraFeed = ({ onCapture }) => {
    const webcamRef = useRef(null);

    // Define video constraints to prefer rear camera on mobile devices
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "environment"
    };

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            onCapture(imageSrc);
        }
    }, [webcamRef, onCapture]);

    return (
        <div className="webcam-wrapper">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="webcam-feed"
                onUserMediaError={(err) => console.log("Camera Error:", err)}
            />

            {/* Overlay UI for the camera */}
            <div className="camera-overlay">
                <div className="crosshair" />
                <button className="capture-btn" onClick={capture}>
                    <Camera size={20} /> Capture Core
                </button>
            </div>
        </div>
    );
};

export default CameraFeed;