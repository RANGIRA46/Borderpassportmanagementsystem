import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useTranslation } from "./utils/LanguageSelector";
import { 
  Shield, 
  Key, 
  Lock, 
  Fingerprint, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Upload,
  Cpu,
  Database,
  Layers
} from "lucide-react";

interface ChipData {
  id: string;
  type: 'passport' | 'id' | 'visa';
  digitalSignature: string;
  publicKey: string;
  biometricHash: string;
  encryptionLevel: string;
  issueDate: string;
  expiryDate: string;
  issuerCertificate: string;
  securityFeatures: string[];
  integrityStatus: 'valid' | 'invalid' | 'tampered';
}

interface BiometricSecurityLayer {
  id: string;
  type: 'fingerprint' | 'face' | 'iris' | 'voice';
  encrypted: boolean;
  hashValue: string;
  securityLevel: number;
  lastUpdated: string;
}

export function SecureChipData() {
  const { t } = useTranslation();
  const [selectedChip, setSelectedChip] = useState<ChipData | null>(null);
  const [biometricLayers, setBiometricLayers] = useState<BiometricSecurityLayer[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [securityProgress, setSecurityProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock chip data
  const [chipData] = useState<ChipData[]>([
    {
      id: "CHIP-001",
      type: "passport",
      digitalSignature: "RSA-4096-SHA256-CERT",
      publicKey: "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG...",
      biometricHash: "SHA-512:A1B2C3D4E5F6...",
      encryptionLevel: "AES-256-GCM",
      issueDate: "2024-01-15",
      expiryDate: "2034-01-15",
      issuerCertificate: "RW-GOV-PKI-ROOT-2024",
      securityFeatures: ["PKI", "Biometric", "RFID", "Hologram", "Watermark"],
      integrityStatus: "valid"
    },
    {
      id: "CHIP-002", 
      type: "visa",
      digitalSignature: "ECDSA-P384-SHA384",
      publicKey: "-----BEGIN PUBLIC KEY-----\nMHYwEAYHKoZIzj0CA...",
      biometricHash: "SHA-512:B2C3D4E5F6G7...",
      encryptionLevel: "AES-256-CBC",
      issueDate: "2024-03-10",
      expiryDate: "2025-03-10",
      issuerCertificate: "US-DHS-PKI-VISA-2024",
      securityFeatures: ["PKI", "Biometric", "NFC", "Anti-Tamper"],
      integrityStatus: "valid"
    }
  ]);

  // Mock biometric security layers
  useEffect(() => {
    setBiometricLayers([
      {
        id: "BIO-001",
        type: "fingerprint",
        encrypted: true,
        hashValue: "SHA-512:F1A2B3C4D5E6...",
        securityLevel: 95,
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      {
        id: "BIO-002",
        type: "face",
        encrypted: true,
        hashValue: "SHA-512:G2H3I4J5K6L7...",
        securityLevel: 92,
        lastUpdated: "2024-01-15T10:30:00Z"
      },
      {
        id: "BIO-003",
        type: "iris",
        encrypted: true,
        hashValue: "SHA-512:M3N4O5P6Q7R8...",
        securityLevel: 98,
        lastUpdated: "2024-01-15T10:30:00Z"
      }
    ]);

    // Simulate security verification progress
    const timer = setInterval(() => {
      setSecurityProgress(prev => {
        if (prev >= 100) {
          setVerificationStatus('success');
          clearInterval(timer);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const handleChipRead = (chip: ChipData) => {
    setSelectedChip(chip);
    setVerificationStatus('pending');
    setSecurityProgress(0);
  };

  const validateDigitalSignature = (chip: ChipData) => {
    // Simulate digital signature validation
    return chip.integrityStatus === 'valid';
  };

  const getSecurityLevelColor = (level: number) => {
    if (level >= 95) return "text-green-600";
    if (level >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const BiometricIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'fingerprint': return <Fingerprint className="h-4 w-4" />;
      case 'face': return <Eye className="h-4 w-4" />;
      case 'iris': return <Eye className="h-4 w-4" />;
      case 'voice': return <Cpu className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-navy-medium" />
            {t('secureChipData.title', 'Secure Chip Data & Digital Signatures')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('secureChipData.subtitle', 'PKI-based security with multi-layer biometric protection')}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          {t('secureChipData.certified', 'PKI Certified')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chip Selection Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                {t('secureChipData.availableChips', 'Available Chips')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {chipData.map((chip) => (
                <div
                  key={chip.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedChip?.id === chip.id ? 'border-navy-medium bg-blue-lightest' : 'hover:border-blue-light'
                  }`}
                  onClick={() => handleChipRead(chip)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{chip.id}</p>
                      <p className="text-sm text-muted-foreground capitalize">{chip.type}</p>
                    </div>
                    <Badge 
                      variant={chip.integrityStatus === 'valid' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {chip.integrityStatus}
                    </Badge>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {chip.securityFeatures.slice(0, 3).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Panel */}
        <div className="lg:col-span-2">
          {selectedChip ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">{t('secureChipData.overview', 'Overview')}</TabsTrigger>
                <TabsTrigger value="signature">{t('secureChipData.signature', 'Signature')}</TabsTrigger>
                <TabsTrigger value="biometric">{t('secureChipData.biometric', 'Biometric')}</TabsTrigger>
                <TabsTrigger value="security">{t('secureChipData.security', 'Security')}</TabsTrigger>
              </TabsList>

              {/* Security Verification Status */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>{t('secureChipData.verificationProgress', 'Security Verification Progress')}</span>
                    <Badge variant={verificationStatus === 'success' ? 'default' : 'secondary'}>
                      {verificationStatus}
                    </Badge>
                  </div>
                  <Progress value={securityProgress} className="mt-2" />
                </AlertDescription>
              </Alert>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('secureChipData.chipInformation', 'Chip Information')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>{t('secureChipData.chipId', 'Chip ID')}</Label>
                        <Input value={selectedChip.id} readOnly />
                      </div>
                      <div>
                        <Label>{t('secureChipData.documentType', 'Document Type')}</Label>
                        <Input value={selectedChip.type.toUpperCase()} readOnly />
                      </div>
                      <div>
                        <Label>{t('secureChipData.issueDate', 'Issue Date')}</Label>
                        <Input value={selectedChip.issueDate} readOnly />
                      </div>
                      <div>
                        <Label>{t('secureChipData.expiryDate', 'Expiry Date')}</Label>
                        <Input value={selectedChip.expiryDate} readOnly />
                      </div>
                    </div>
                    
                    <div>
                      <Label>{t('secureChipData.securityFeatures', 'Security Features')}</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedChip.securityFeatures.map((feature, idx) => (
                          <Badge key={idx} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signature" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      {t('secureChipData.digitalSignatureValidation', 'Digital Signature Validation')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label>{t('secureChipData.signatureAlgorithm', 'Signature Algorithm')}</Label>
                        <Input value={selectedChip.digitalSignature} readOnly />
                      </div>
                      <div>
                        <Label>{t('secureChipData.issuerCertificate', 'Issuer Certificate')}</Label>
                        <Input value={selectedChip.issuerCertificate} readOnly />
                      </div>
                      <div>
                        <Label>{t('secureChipData.publicKey', 'Public Key')}</Label>
                        <textarea 
                          className="w-full h-24 p-2 border rounded-md font-mono text-xs"
                          value={selectedChip.publicKey + "..."}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-green-800">
                        {t('secureChipData.signatureValid', 'Digital signature is valid and verified')}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t('secureChipData.downloadCertificate', 'Download Certificate')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        {t('secureChipData.verifyCertChain', 'Verify Cert Chain')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="biometric" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Fingerprint className="h-5 w-5" />
                      {t('secureChipData.biometricSecurityLayers', 'Biometric Security Layers')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {biometricLayers.map((layer) => (
                      <div key={layer.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BiometricIcon type={layer.type} />
                            <span className="font-medium capitalize">{layer.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={layer.encrypted ? 'default' : 'destructive'}>
                              {layer.encrypted ? 'Encrypted' : 'Unencrypted'}
                            </Badge>
                            <span className={`text-sm ${getSecurityLevelColor(layer.securityLevel)}`}>
                              {layer.securityLevel}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              {t('secureChipData.biometricHash', 'Biometric Hash')}
                            </Label>
                            <Input value={layer.hashValue} readOnly className="font-mono text-xs" />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              {t('secureChipData.lastUpdated', 'Last Updated')}
                            </Label>
                            <Input value={new Date(layer.lastUpdated).toLocaleString()} readOnly />
                          </div>
                        </div>
                        
                        <Progress value={layer.securityLevel} className="mt-3" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      {t('secureChipData.multiLayerSecurity', 'Multi-Layer Security Analysis')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {t('secureChipData.encryptionLevel', 'Encryption Level')}
                          </span>
                        </div>
                        <p className="text-lg font-semibold">{selectedChip.encryptionLevel}</p>
                        <Progress value={95} className="mt-2" />
                      </div>
                      
                      <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {t('secureChipData.dataIntegrity', 'Data Integrity')}
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-green-600">Verified</p>
                        <Progress value={100} className="mt-2" />
                      </div>
                    </div>

                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        {t('secureChipData.securityNotice', 'All security layers are active and functioning normally. No threats detected.')}
                      </AlertDescription>
                    </Alert>

                    <div className="flex gap-2">
                      <Button>
                        <Shield className="h-4 w-4 mr-2" />
                        {t('secureChipData.runSecurityScan', 'Run Security Scan')}
                      </Button>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('secureChipData.exportSecurityReport', 'Export Report')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Cpu className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {t('secureChipData.selectChip', 'Select a Chip to Analyze')}
                </h3>
                <p className="text-muted-foreground text-center">
                  {t('secureChipData.selectChipDesc', 'Choose a secure chip from the left panel to view its digital signature, biometric data, and security layers.')}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}