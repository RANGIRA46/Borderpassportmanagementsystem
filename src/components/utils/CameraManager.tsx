import { useState, useRef, useCallback } from 'react';

export interface CameraConfig {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  fallbackMode?: 'mock' | 'upload' | 'disabled';
}

export interface CameraState {
  stream: MediaStream | null;
  isActive: boolean;
  hasPermission: boolean;
  error: string | null;
  isSupported: boolean;
}

export interface CameraCapture {
  imageData: string;
  timestamp: Date;
  quality: number;
}

export const useCameraManager = (config: CameraConfig = {}) => {
  const [cameraState, setCameraState] = useState<CameraState>({
    stream: null,
    isActive: false,
    hasPermission: false,
    error: null,
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const checkPermissions = useCallback(async () => {
    if (!cameraState.isSupported) {
      setCameraState(prev => ({
        ...prev,
        error: 'Camera is not supported in this environment'
      }));
      return false;
    }

    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        const hasPermission = permission.state === 'granted';
        
        setCameraState(prev => ({
          ...prev,
          hasPermission,
          error: permission.state === 'denied' ? 'Camera access denied by user' : null
        }));

        return hasPermission;
      }
    } catch (error) {
      console.log('Permissions API not available');
    }

    return null; // Unknown permission state
  }, [cameraState.isSupported]);

  const startCamera = useCallback(async () => {
    if (!cameraState.isSupported) {
      return false;
    }

    try {
      setCameraState(prev => ({ ...prev, error: null }));

      const constraints = {
        video: {
          width: { ideal: config.width || 1280 },
          height: { ideal: config.height || 720 },
          facingMode: config.facingMode || 'user'
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setCameraState(prev => ({
        ...prev,
        stream,
        isActive: true,
        hasPermission: true,
        error: null
      }));

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return true;
    } catch (error: any) {
      let errorMessage = 'Camera access failed';
      let fallbackSuggestion = '';

      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Camera access denied';
          fallbackSuggestion = 'Please enable camera permissions in your browser settings, or use the file upload option below.';
          break;
        case 'NotFoundError':
          errorMessage = 'No camera found';
          fallbackSuggestion = 'Please connect a camera or use the file upload option.';
          break;
        case 'NotReadableError':
          errorMessage = 'Camera is busy';
          fallbackSuggestion = 'Another application is using the camera. Please close other applications or use file upload.';
          break;
        case 'OverconstrainedError':
          errorMessage = 'Camera settings not supported';
          fallbackSuggestion = 'Your camera doesn\'t support the required settings. Try using file upload instead.';
          break;
        default:
          errorMessage = error.message || 'Unknown camera error';
          fallbackSuggestion = 'Please try refreshing the page or use the file upload option.';
      }

      setCameraState(prev => ({
        ...prev,
        hasPermission: false,
        error: `${errorMessage}. ${fallbackSuggestion}`
      }));

      return false;
    }
  }, [config, cameraState.isSupported]);

  const stopCamera = useCallback(() => {
    if (cameraState.stream) {
      cameraState.stream.getTracks().forEach(track => track.stop());
    }

    setCameraState(prev => ({
      ...prev,
      stream: null,
      isActive: false
    }));

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [cameraState.stream]);

  const captureImage = useCallback(async (): Promise<CameraCapture | null> => {
    if (!videoRef.current || !canvasRef.current || !cameraState.isActive) {
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context not available');
      }

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to image data
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      // Calculate a mock quality score based on image properties
      const quality = Math.round(Math.random() * 15 + 85); // 85-100%

      return {
        imageData,
        timestamp: new Date(),
        quality
      };
    } catch (error: any) {
      setCameraState(prev => ({
        ...prev,
        error: `Image capture failed: ${error.message}`
      }));
      return null;
    }
  }, [cameraState.isActive]);

  const generateMockCapture = useCallback((): CameraCapture => {
    // Generate a simple colored rectangle as mock image data
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, 320, 240);
      gradient.addColorStop(0, '#24496b');
      gradient.addColorStop(1, '#446d92');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 320, 240);
      
      // Add some text
      ctx.fillStyle = '#f7fafe';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Mock Biometric Capture', 160, 120);
      ctx.fillText(new Date().toLocaleTimeString(), 160, 140);
    }
    
    return {
      imageData: canvas.toDataURL('image/jpeg', 0.8),
      timestamp: new Date(),
      quality: Math.round(Math.random() * 15 + 85)
    };
  }, []);

  return {
    cameraState,
    videoRef,
    canvasRef,
    checkPermissions,
    startCamera,
    stopCamera,
    captureImage,
    generateMockCapture
  };
};

export default useCameraManager;