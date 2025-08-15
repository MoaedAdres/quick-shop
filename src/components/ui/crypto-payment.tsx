import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, CheckCircle, Clock, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { useGetCryptoPaymentStatus, useGetSupportedCurrencies } from '@/Api/queriesAndMutations';
import type { CryptoPaymentResponse, SupportedCurrency } from '@/Types/types';

interface CryptoPaymentProps {
  paymentData: CryptoPaymentResponse['data'];
  onPaymentComplete?: () => void;
  onPaymentFailed?: (error: string) => void;
}

const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  paymentData,
  onPaymentComplete,
  onPaymentFailed,
}) => {
  const [isPolling, setIsPolling] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Fetch payment status with polling
  const { data: paymentStatus, refetch: refetchStatus } = useGetCryptoPaymentStatus(
    paymentData.payment_id,
    isPolling
  );

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const expirationTime = new Date(paymentData.expiration_estimate_date).getTime();
      const now = new Date().getTime();
      const difference = expirationTime - now;
      
      if (difference > 0) {
        setTimeLeft(Math.floor(difference / 1000));
      } else {
        setTimeLeft(0);
        setIsPolling(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [paymentData.expiration_estimate_date]);

  // Poll payment status
  useEffect(() => {
    if (!isPolling) return;

    const pollInterval = setInterval(() => {
      refetchStatus();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [isPolling, refetchStatus]);

  // Handle payment status changes
  useEffect(() => {
    if (paymentStatus?.data) {
      const status = paymentStatus.data.payment_status;
      
      if (status === 'finished' || status === 'confirmed') {
        setIsPolling(false);
        onPaymentComplete?.();
        toast.success('Payment confirmed successfully!');
      } else if (status === 'failed' || status === 'expired' || status === 'refunded') {
        setIsPolling(false);
        onPaymentFailed?.(status);
        if (status === 'expired') {
          toast.error('Payment expired. Please try again.');
        } else {
          toast.error(`Payment ${status}. Please try again.`);
        }
      }
    }
  }, [paymentStatus, onPaymentComplete, onPaymentFailed]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-600 bg-yellow-100';
      case 'confirming': return 'text-blue-600 bg-blue-100';
      case 'confirmed': 
      case 'finished': return 'text-green-600 bg-green-100';
      case 'failed': 
      case 'expired': 
      case 'refunded': return 'text-red-600 bg-red-100';
      case 'partially_paid': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return Clock;
      case 'confirming': return RefreshCw;
      case 'confirmed': 
      case 'finished': return CheckCircle;
      case 'failed': 
      case 'expired': 
      case 'refunded': return AlertCircle;
      case 'partially_paid': return Clock;
      default: return Clock;
    }
  };

  const currentStatus = paymentStatus?.data?.payment_status || paymentData.payment_status;
  const StatusIcon = getStatusIcon(currentStatus);

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Complete Your Payment
        </h2>
        <p className="text-muted-foreground">
          Send exactly <span className="font-semibold text-foreground">{paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}</span> to the address below
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${getStatusColor(currentStatus)}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium capitalize">{currentStatus.replace('_', ' ')}</span>
        </div>
        {timeLeft > 0 && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)} remaining
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-lg border">
          <QRCode
            value={paymentData.pay_address}
            size={200}
            level="M"
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-4">
        {/* Payment Address */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Payment Address</label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(paymentData.pay_address, 'Address')}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Copy className="w-4 h-4" />
              Copy
            </motion.button>
          </div>
          <div className="font-mono text-sm bg-background rounded-md p-3 border break-all">
            {paymentData.pay_address}
          </div>
        </div>

        {/* Amount */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Amount to Send</label>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(paymentData.pay_amount.toString(), 'Amount')}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              <Copy className="w-4 h-4" />
              Copy
            </motion.button>
          </div>
          <div className="font-mono text-lg font-bold text-foreground">
            {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            ≈ ${paymentData.price_amount} {paymentData.price_currency.toUpperCase()}
          </div>
        </div>

        {/* Network */}
        <div className="bg-muted/50 rounded-lg p-4">
          <label className="text-sm font-medium text-foreground">Network</label>
          <div className="text-sm text-muted-foreground mt-1 capitalize">
            {paymentData.network} Network
          </div>
        </div>
      </div>

      {/* Progress */}
      {paymentStatus?.data && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Received</span>
            <span className="text-foreground font-medium">
              {paymentStatus.data.amount_received} / {paymentData.pay_amount} {paymentData.pay_currency.toUpperCase()}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((paymentStatus.data.amount_received / paymentData.pay_amount) * 100, 100)}%` 
              }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Instructions:</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Send the exact amount to the address above</li>
          <li>• Payment will be confirmed automatically</li>
          <li>• Do not send from an exchange (use a personal wallet)</li>
          <li>• Make sure you're on the correct network</li>
        </ul>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetchStatus()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Check Status
        </motion.button>
      </div>

      {/* Order Info */}
      <div className="border-t border-border pt-4 text-center text-sm text-muted-foreground">
        <p>Order #{paymentData.order_id}</p>
        <p>Payment ID: {paymentData.payment_id}</p>
      </div>
    </div>
  );
};

export default CryptoPayment;
