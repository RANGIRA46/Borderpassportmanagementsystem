import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import useCameraManager, { CameraCapture } from './utils/CameraManager';
import { 
  Camera, 
  Upload, 
  Fingerprint, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Info,
  Settings,
  PlayCircle,
  StopCircle,
  Download,
  Smartphone
} from "lucide-react";

interface BiometricCaptureProps {
  onCapture?: (capture: CameraCapture) => void;
  captureType?: 'facial' | 'fingerprint' | 'iris';
  required?: boolean;
}

export function BiometricCapture({ 
  onCapture, 
  captureType = 'facial', 
  required = false 
}: BiometricCaptureProps) {
  const [captureMode, setCaptureMode] = useState<'camera' | 'upload' | 'mock'>('camera');
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
  const [recentCaptures, setRecentCaptures] = useState<CameraCapture[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    cameraState,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    captureImage,
    generateMockCapture
  } = useCameraManager({
    width: 1280,
    height: 720,
    facingMode: 'user'
  });

  const handleStartCamera = async () => {
    const success = await startCamera();
    if (!success && cameraState.error) {
      // If camera fails, suggest alternative methods
      setCaptureMode('upload');
    }
  };

  const handleCapture = async () => {
    setIsCapturing(true);
    setCaptureProgress(0);

    // Simulate capture progress
    const progressInterval = setInterval(() => {
      setCaptureProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 20 + 5;
      });
    }, 150);

    // Wait for capture simulation
    await new Promise(resolve => setTimeout(resolve, 1000));

    let capture: CameraCapture | null = null;

    if (captureMode === 'camera' && cameraState.isActive) {
      capture = await captureImage();
    } else if (captureMode === 'mock') {
      capture = generateMockCapture();
    }

    if (capture) {
      setRecentCaptures(prev => [capture, ...prev.slice(0, 2)]);
      onCapture?.(capture);
    }

    setIsCapturing(false);
    setCaptureProgress(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      const capture: CameraCapture = {
        imageData,
        timestamp: new Date(),
        quality: Math.round(Math.random() * 15 + 80) // 80-95% for uploaded images
      };

      setRecentCaptures(prev => [capture, ...prev.slice(0, 2)]);
      onCapture?.(capture);
    };
    reader.readAsDataURL(file);
  };

  const getCaptureIcon = () => {
    switch (captureType) {
      case 'fingerprint': return <Fingerprint className="h-5 w-5" />;
      case 'iris': return <Eye className="h-5 w-5" />;
      default: return <Camera className="h-5 w-5" />;
    }
  };

  const getCaptureTitle = () => {
    switch (captureType) {
      case 'fingerprint': return 'Fingerprint Capture';
      case 'iris': return 'Iris Scan';
      default: return 'Facial Recognition Capture';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          {getCaptureIcon()}
          <span className="ml-2">{getCaptureTitle()}</span>
          {required && <Badge className="ml-2 bg-red-100 text-red-800">Required</Badge>}
        </CardTitle>
        <CardDescription>
          Choose your preferred method for biometric capture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Capture Method Selection */}
        <Tabs value={captureMode} onValueChange={(value) => setCaptureMode(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="camera" disabled={!cameraState.isSupported}>
              <Camera className="h-4 w-4 mr-2" />
              Live Camera
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="mock">
              <Smartphone className="h-4 w-4 mr-2" />
              Demo Mode
            </TabsTrigger>
          </TabsList>

          {/* Camera Capture Tab */}
          <TabsContent value="camera" className="space-y-4">
            {!cameraState.isSupported ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Camera is not supported in this environment. Please use the file upload option.
                </AlertDescription>
              </Alert>
            ) : cameraState.error ? (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {cameraState.error}
                </AlertDescription>
              </Alert>
            ) : !cameraState.isActive ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Camera Ready</h3>
                <p className="text-gray-600 mb-4">Click to start your camera for biometric capture</p>
                <Button onClick={handleStartCamera}>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Camera Feed */}
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {/* Capture Guide Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-white border-dashed rounded-full opacity-50"></div>
                  </div>
                  
                  {/* Instructions */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <Alert className="bg-black/50 border-white/20">
                      <Info className="h-4 w-4 text-white" />
                      <AlertDescription className="text-white">
                        {captureType === 'facial' && "Position your face within the circle and look directly at the camera"}
                        {captureType === 'fingerprint' && "Place your finger on the scanner"}
                        {captureType === 'iris' && "Look directly into the scanner and keep your eye open"}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* Capture Progress */}
                {isCapturing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Capturing biometric data...</span>
                      <span>{Math.round(captureProgress)}%</span>
                    </div>
                    <Progress value={captureProgress} className="w-full" />
                  </div>
                )}

                {/* Camera Controls */}
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={handleCapture}
                    disabled={isCapturing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isCapturing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Capturing...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Capture {captureType === 'facial' ? 'Photo' : 'Biometric'}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>
                    <StopCircle className="h-4 w-4 mr-2" />
                    Stop Camera
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload {captureType === 'facial' ? 'Photo' : 'Biometric Image'}</h3>
              <p className="text-gray-600 mb-4">
                {captureType === 'facial' && "Select a clear photo of your face"}
                {captureType === 'fingerprint' && "Upload a fingerprint scan image"}
                {captureType === 'iris' && "Upload an iris scan image"}
              </p>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Supported formats: JPG, PNG, WEBP. Maximum file size: 10MB.
                Ensure the image is clear and well-lit for best results.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Demo Mode Tab */}
          <TabsContent value="mock" className="space-y-4">
            <div className="text-center py-8 bg-blue-50 rounded-lg">
              <Smartphone className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Demo Mode</h3>
              <p className="text-gray-600 mb-4">
                Generate a simulated biometric capture for testing purposes
              </p>
              <Button onClick={handleCapture} disabled={isCapturing}>
                {isCapturing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Generate Mock Capture
                  </>
                )}
              </Button>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Demo mode generates simulated biometric data for testing. 
                This should not be used for actual identity verification.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Recent Captures */}
        {recentCaptures.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Recent Captures</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentCaptures.map((capture, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Capture #{index + 1}</span>
                    <Badge variant={capture.quality > 90 ? "default" : capture.quality > 75 ? "secondary" : "destructive"}>
                      {capture.quality}% Quality
                    </Badge>
                  </div>
                  <img 
                    src={capture.imageData} 
                    alt={`Capture ${index + 1}`}
                    className="w-full h-24 object-cover rounded border mb-2"
                  />
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{capture.timestamp.toLocaleTimeString()}</span>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quality Guidelines */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>For best results:</strong>
            <ul className="mt-2 text-sm space-y-1">
              <li>• Ensure good lighting with no shadows</li>
              <li>• {captureType === 'facial' && "Look directly at the camera with a neutral expression"}</li>
              <li>• {captureType === 'fingerprint' && "Keep finger clean and dry"}</li>
              <li>• {captureType === 'iris' && "Keep your eye open and steady"}</li>
              <li>• Avoid movement during capture</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

export default BiometricCapture;