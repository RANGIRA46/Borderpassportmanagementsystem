import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Download,
  Shield
} from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile' | 'card' | 'bank';
  icon: React.ReactNode;
  fees: string;
  processingTime: string;
  available: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  applicationRef: string;
  description: string;
}

export function PaymentCenter() {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [applicationRef, setApplicationRef] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mtn-momo',
      name: 'MTN Mobile Money',
      type: 'mobile',
      icon: <Smartphone className="h-5 w-5" />,
      fees: '1.5%',
      processingTime: 'Instant',
      available: true
    },
    {
      id: 'airtel-money',
      name: 'Airtel Money',
      type: 'mobile',
      icon: <Smartphone className="h-5 w-5" />,
      fees: '1.5%',
      processingTime: 'Instant',
      available: true
    },
    {
      id: 'visa-card',
      name: 'Visa Card',
      type: 'card',
      icon: <CreditCard className="h-5 w-5" />,
      fees: '2.9% + $0.30',
      processingTime: '2-3 minutes',
      available: true
    },
    {
      id: 'mastercard',
      name: 'MasterCard',
      type: 'card',
      icon: <CreditCard className="h-5 w-5" />,
      fees: '2.9% + $0.30',
      processingTime: '2-3 minutes',
      available: true
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer',
      type: 'bank',
      icon: <Building className="h-5 w-5" />,
      fees: 'Free',
      processingTime: '1-2 business days',
      available: true
    }
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001234',
      amount: 50000,
      currency: 'RWF',
      method: 'MTN Mobile Money',
      status: 'completed',
      date: new Date('2024-01-20'),
      applicationRef: 'PA2024001234',
      description: 'Passport Application Fee'
    },
    {
      id: 'TXN001235',
      amount: 75000,
      currency: 'RWF',
      method: 'Visa Card',
      status: 'pending',
      date: new Date('2024-01-21'),
      applicationRef: 'VA2024005678',
      description: 'Visa Application Fee'
    },

  ];

  const serviceFees = [
    { service: 'Passport Application', amount: 50000, currency: 'RWF', description: 'Standard passport processing' },
    { service: 'Express Passport', amount: 100000, currency: 'RWF', description: 'Expedited processing (24-48h)' },
    { service: 'Visa Application', amount: 75000, currency: 'RWF', description: 'Tourist/Business visa' },

    { service: 'Document Replacement', amount: 30000, currency: 'RWF', description: 'Lost/damaged document replacement' }
  ];

  const handlePayment = async () => {
    setProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock payment success
    alert(`Payment successful!\n\nTransaction ID: TXN${Date.now()}\nAmount: ${amount} RWF\nMethod: ${paymentMethods.find(m => m.id === selectedMethod)?.name}\n\nYou will receive an SMS confirmation shortly.`);

    setProcessing(false);
    setAmount('');
    setApplicationRef('');
    setPhoneNumber('');
    setSelectedMethod('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl mb-2 text-navy-dark">Payment Center</h1>
        <p className="text-navy-medium">Secure payment processing for all government services</p>
      </div>

      <Tabs defaultValue="pay" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pay">Make Payment</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="fees">Service Fees</TabsTrigger>
          <TabsTrigger value="help">Help & Support</TabsTrigger>
        </TabsList>

        <TabsContent value="pay" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="text-navy-dark">Payment Details</CardTitle>
                  <CardDescription>Enter your payment information below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="applicationRef">Application Reference</Label>
                      <Input
                        id="applicationRef"
                        value={applicationRef}
                        onChange={(e) => setApplicationRef(e.target.value)}
                        placeholder="e.g., PA2024001234"
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount">Amount (RWF)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`border rounded-lg p-3 cursor-pointer transition-all ${selectedMethod === method.id
                              ? 'border-navy-medium bg-blue-lightest'
                              : 'border-blue-light hover:border-blue-medium'
                            } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={() => method.available && setSelectedMethod(method.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-navy-medium">{method.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-navy-dark">{method.name}</div>
                              <div className="text-xs text-navy-medium">
                                Fee: {method.fees} • {method.processingTime}
                              </div>
                            </div>
                            {!method.available && (
                              <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(selectedMethod === 'mtn-momo' || selectedMethod === 'airtel-money') && (
                    <div>
                      <Label htmlFor="phoneNumber">Mobile Money Number</Label>
                      <Input
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+250 7XX XXX XXX"
                      />
                    </div>
                  )}

                  <Button
                    onClick={handlePayment}
                    disabled={!selectedMethod || !amount || !applicationRef || processing}
                    className="w-full bg-navy-medium hover:bg-navy-dark text-white"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay {amount ? `${parseInt(amount).toLocaleString()} RWF` : ''}
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div>
              <Card className="border-blue-light">
                <CardHeader>
                  <CardTitle className="text-navy-dark">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-medium">Service Fee:</span>
                      <span className="text-navy-dark">{amount ? `${parseInt(amount).toLocaleString()} RWF` : '0 RWF'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-navy-medium">Processing Fee:</span>
                      <span className="text-navy-dark">
                        {selectedMethod && amount ?
                          paymentMethods.find(m => m.id === selectedMethod)?.fees === 'Free' ?
                            'Free' :
                            `${Math.ceil(parseInt(amount) * 0.015).toLocaleString()} RWF`
                          : '0 RWF'
                        }
                      </span>
                    </div>
                    <div className="border-t border-blue-light pt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-navy-dark">Total:</span>
                        <span className="text-navy-dark">
                          {selectedMethod && amount ?
                            (parseInt(amount) + (paymentMethods.find(m => m.id === selectedMethod)?.fees === 'Free' ? 0 : Math.ceil(parseInt(amount) * 0.015))).toLocaleString() + ' RWF'
                            : '0 RWF'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      All payments are processed securely using bank-grade encryption.
                      Your financial information is never stored on our servers.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="text-navy-dark">Payment History</CardTitle>
              <CardDescription>View all your previous transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div key={transaction.id} className="border border-blue-light rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-navy-dark">{transaction.description}</h4>
                          <Badge className={getStatusColor(transaction.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(transaction.status)}
                              <span>{transaction.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-navy-medium">
                          <div>
                            <span>Amount: </span>
                            <span className="font-medium text-navy-dark">
                              {transaction.amount.toLocaleString()} {transaction.currency}
                            </span>
                          </div>
                          <div>
                            <span>Method: </span>
                            <span className="font-medium text-navy-dark">{transaction.method}</span>
                          </div>
                          <div>
                            <span>Date: </span>
                            <span className="font-medium text-navy-dark">{transaction.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-navy-medium mt-1">
                          Transaction ID: {transaction.id} • Application: {transaction.applicationRef}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-blue-medium text-navy-medium">
                          <Receipt className="h-3 w-3 mr-1" />
                          Receipt
                        </Button>
                        <Button variant="outline" size="sm" className="border-blue-medium text-navy-medium">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <Card className="border-blue-light">
            <CardHeader>
              <CardTitle className="text-navy-dark">Official Service Fees</CardTitle>
              <CardDescription>Current fees for all government services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceFees.map((fee, index) => (
                  <div key={index} className="border border-blue-light rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-navy-dark">{fee.service}</h4>
                      <div className="text-right">
                        <div className="font-bold text-navy-dark">
                          {fee.amount.toLocaleString()} {fee.currency}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-navy-medium">{fee.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-light">
              <CardHeader>
                <CardTitle className="text-navy-dark">Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="font-medium text-navy-dark mb-1">What payment methods are accepted?</h5>
                  <p className="text-sm text-navy-medium">We accept MTN Mobile Money, Airtel Money, Visa, MasterCard, and bank transfers.</p>
                </div>
                <div>
                  <h5 className="font-medium text-navy-dark mb-1">How long does payment processing take?</h5>
                  <p className="text-sm text-navy-medium">Mobile money payments are instant, cards take 2-3 minutes, and bank transfers take 1-2 business days.</p>
                </div>
                <div>
                  <h5 className="font-medium text-navy-dark mb-1">Is my payment information secure?</h5>
                  <p className="text-sm text-navy-medium">Yes, we use bank-grade encryption and never store your financial information.</p>
                </div>
                <div>
                  <h5 className="font-medium text-navy-dark mb-1">Can I get a refund?</h5>
                  <p className="text-sm text-navy-medium">Refunds are processed according to government policy. Contact support for assistance.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-light">
              <CardHeader>
                <CardTitle className="text-navy-dark">Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-navy-dark">Payment Support Hotline</h5>
                    <p className="text-navy-medium">+250 788 123 456</p>
                    <p className="text-sm text-navy-medium">Available 24/7</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-navy-dark">Email Support</h5>
                    <p className="text-navy-medium">payments@immigration.gov.rw</p>
                    <p className="text-sm text-navy-medium">Response within 4 hours</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-navy-dark">Office Hours</h5>
                    <p className="text-navy-medium">Monday - Friday: 8:00 AM - 5:00 PM</p>
                    <p className="text-navy-medium">Saturday: 8:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}