import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SubscriptionPlan } from '../types';

export const Payment: React.FC = () => {
  const { user, subscribe } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'AIRTEL' | 'TNM'>('AIRTEL');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    { id: 'DAILY', name: 'Daily Access', price: 2000, duration: '24 Hours', desc: 'Perfect for quick revision' },
    { id: 'WEEKLY', name: 'Weekly Access', price: 10000, duration: '7 Days', desc: 'Best value for exams' },
    { id: 'MONTHLY', name: 'Monthly Access', price: 35000, duration: '30 Days', desc: 'Full unrestricted learning' },
  ];

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !phoneNumber) return;

    setIsProcessing(true);
    // Simulate payment processing
    const success = await subscribe(selectedPlan, paymentMethod, phoneNumber);
    setIsProcessing(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Choose Your Learning Plan</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            {user?.subscriptionStatus === 'EXPIRED' 
              ? "Your subscription has expired. Please renew to continue." 
              : "Unlock unlimited access to video lessons and resources."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as SubscriptionPlan)}
              className={`cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                selectedPlan === plan.id 
                  ? 'border-primary-600 bg-primary-50 dark:bg-slate-800 ring-2 ring-primary-500 ring-offset-2' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                {selectedPlan === plan.id && <div className="text-primary-600">✓</div>}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">MWK {plan.price.toLocaleString()}</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{plan.duration}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{plan.desc}</p>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl mt-8 animate-fade-in">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Payment Details</h3>
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('AIRTEL')}
                      className={`py-3 px-4 border rounded-lg font-bold text-sm ${
                        paymentMethod === 'AIRTEL' 
                          ? 'bg-red-50 border-red-500 text-red-700' 
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Airtel Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('TNM')}
                      className={`py-3 px-4 border rounded-lg font-bold text-sm ${
                        paymentMethod === 'TNM' 
                          ? 'bg-green-50 border-green-500 text-green-700' 
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      TNM Mpamba
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 0999123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={isProcessing || !phoneNumber}
                  className="w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {isProcessing ? 'Processing Transaction...' : 'Activate Subscription Now'}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  By continuing, you authorize Smartlearn to initiate a transaction on your mobile money account.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};