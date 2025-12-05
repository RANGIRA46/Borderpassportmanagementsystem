import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { useTranslationWithParams } from "./utils/TranslationUtils";
import {
  CreditCard,
  Wallet,
  Smartphone,
  DollarSign,
  CheckCircle,
  Clock,
  Download,
  Receipt,
  Shield,
  Info,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ModernPaymentCenter() {
  const { t } = useTranslationWithParams();
  const [selectedApplication, setSelectedApplication] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);

  const pendingPayments = [
    {
      id: "PASS-2024-001",
      type: "Passport Application",
      reference: "RW-PASS-2024-001234",
      amount: 85000,
      currency: "RWF",
      dueDate: "Nov 25, 2024",
      status: "pending"
    },
    {
      id: "VISA-2024-045",
      type: "Business Visa",
      reference: "RW-VISA-2024-045678",
      amount: 70,
      currency: "USD",
      dueDate: "Nov 28, 2024",
      status: "pending"
    }
  ];

  const paymentMethods = [
    {
      id: "momo",
      name: "MTN Mobile Money",
      description: "Pay with MoMo",
      icon: "📱",
      popular: true,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: "airtel",
      name: "Airtel Money",
      description: "Pay with Airtel",
      icon: "💳",
      color: "from-red-500 to-red-600"
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard",
      icon: "💳",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct transfer",
      icon: "🏦",
      color: "from-green-500 to-green-600"
    }
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      description: "Passport Application Fee",
      amount: 85000,
      currency: "RWF",
      date: "Nov 10, 2024",
      status: "completed",
      method: "MTN MoMo"
    },
    {
      id: "TXN-002",
      description: "Visa Processing Fee",
      amount: 50,
      currency: "USD",
      date: "Oct 28, 2024",
      status: "completed",
      method: "Credit Card"
    }
  ];

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      toast.success("Payment successful!", {
        description: "Receipt sent to your email"
      });
    }, 2000);
  };

  const selectedPaymentDetails = pendingPayments.find(p => p.id === selectedApplication);

  return (
    <div className="min-h-screen bg-blue-lightest dark:bg-[#0a0a0a] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl text-navy-dark dark:text-white">
                {t('payment.title', {}, 'Payment Center')}
              </h1>
              <p className="text-navy-medium/60 dark:text-white/60">
                {t('payment.description', {}, 'Secure and fast payment processing')}
              </p>
            </div>
          </div>

          <Alert className="border-blue-medium/20 bg-blue-medium/5">
            <Shield className="h-4 w-4 text-blue-medium" />
            <AlertDescription className="text-sm">
              <strong>Secure Payment:</strong> All transactions are encrypted with 256-bit SSL technology.
            </AlertDescription>
          </Alert>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Payments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                Pending Payments
              </h2>

              <div className="space-y-3">
                {pendingPayments.map((payment, index) => (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card
                      onClick={() => setSelectedApplication(payment.id)}
                      className={`p-6 cursor-pointer transition-all ${
                        selectedApplication === payment.id
                          ? "border-green-500 dark:border-green-500 bg-green-500/5 dark:bg-green-500/10 shadow-lg"
                          : "border-navy-medium/10 dark:border-white/10 hover:border-green-500/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                            <Receipt className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-navy-dark dark:text-white mb-1">
                              {payment.type}
                            </h3>
                            <p className="text-sm text-navy-medium/60 dark:text-white/60">
                              {payment.reference}
                            </p>
                          </div>
                        </div>
                        {selectedApplication === payment.id && (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold text-navy-dark dark:text-white">
                            {payment.amount.toLocaleString()} {payment.currency}
                          </div>
                          <div className="text-sm text-navy-medium/60 dark:text-white/60">
                            Due: {payment.dueDate}
                          </div>
                        </div>
                        <Badge className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Payment Methods */}
            {selectedApplication && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-medium text-navy-dark dark:text-white mb-4">
                  Select Payment Method
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-5 cursor-pointer transition-all relative overflow-hidden ${
                        paymentMethod === method.id
                          ? "border-green-500 dark:border-green-500 bg-green-500/5 dark:bg-green-500/10 shadow-lg"
                          : "border-navy-medium/10 dark:border-white/10 hover:border-green-500/50"
                      }`}
                    >
                      {method.popular && (
                        <Badge className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 border-0 text-white text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-2xl`}>
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-navy-dark dark:text-white">
                              {method.name}
                            </h3>
                            {paymentMethod === method.id && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-navy-medium/60 dark:text-white/60">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {paymentMethod && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6"
                  >
                    <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
                      <h3 className="font-medium text-navy-dark dark:text-white mb-4">
                        Payment Details
                      </h3>

                      {paymentMethod === "card" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Card Number</Label>
                            <Input placeholder="1234 5678 9012 3456" className="h-12" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Expiry Date</Label>
                              <Input placeholder="MM/YY" className="h-12" />
                            </div>
                            <div className="space-y-2">
                              <Label>CVV</Label>
                              <Input placeholder="123" type="password" className="h-12" />
                            </div>
                          </div>
                        </div>
                      )}

                      {(paymentMethod === "momo" || paymentMethod === "airtel") && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="+250 XXX XXX XXX" className="h-12" />
                          </div>
                          <Alert className="border-blue-medium/20 bg-blue-medium/5">
                            <Info className="h-4 w-4 text-blue-medium" />
                            <AlertDescription className="text-sm">
                              You'll receive a prompt on your phone to complete the payment.
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}

                      <Button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full h-14 mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-lg"
                      >
                        {processing ? (
                          <>
                            <Clock className="h-5 w-5 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-5 w-5 mr-2" />
                            Pay {selectedPaymentDetails?.amount.toLocaleString()} {selectedPaymentDetails?.currency}
                            <ArrowRight className="h-5 w-5 ml-2" />
                          </>
                        )}
                      </Button>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 border-navy-medium/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E]">
                <h3 className="font-medium text-navy-dark dark:text-white mb-4">
                  Recent Transactions
                </h3>

                <div className="space-y-3">
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="pb-3 border-b border-navy-medium/10 dark:border-white/10 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-navy-dark dark:text-white">
                            {txn.description}
                          </div>
                          <div className="text-xs text-navy-medium/60 dark:text-white/60">
                            {txn.date} • {txn.method}
                          </div>
                        </div>
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      </div>
                      <div className="text-sm font-medium text-navy-dark dark:text-white">
                        {txn.amount.toLocaleString()} {txn.currency}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Receipt
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Help Card */}
            <Card className="p-6 border-blue-medium/20 bg-blue-medium/5 dark:bg-blue-500/10">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-blue-medium dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-navy-dark dark:text-white">
                  <strong>Need Help?</strong>
                  <p className="mt-2 text-navy-medium/80 dark:text-white/80">
                    Contact our payment support team:
                  </p>
                  <p className="mt-1">📧 payments@immigration.rw</p>
                  <p className="mt-1">📞 +250 788 123 456</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
