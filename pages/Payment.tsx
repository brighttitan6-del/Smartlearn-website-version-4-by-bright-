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
    { id: 'DAILY', name: 'Daily Access', price: 2000, duration: '24 Hours', desc: 'Perfect for quick revision', popular: false },
    { id: 'WEEKLY', name: 'Weekly Access', price: 10000, duration: '7 Days', desc: 'Best value for exams', popular: true },
    { id: 'MONTHLY', name: 'Monthly Access', price: 35000, duration: '30 Days', desc: 'Full unrestricted learning', popular: false },
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
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Upgrade Your Learning Experience</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            {user?.subscriptionStatus === 'EXPIRED' 
              ? "Your subscription has expired. Please renew to continue accessing premium lessons." 
              : "Unlock unlimited access to video lessons, resources, and live classes."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id as SubscriptionPlan)}
              className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all transform hover:scale-105 ${
                selectedPlan === plan.id 
                  ? 'border-primary-600 bg-primary-50 dark:bg-slate-800 ring-2 ring-primary-500 ring-offset-2 shadow-lg' 
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary-300 shadow-sm'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  MOST POPULAR
                </div>
              )}
              <div className="flex justify-between items-center mb-4 mt-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                {selectedPlan === plan.id && <div className="text-primary-600 bg-primary-100 rounded-full p-1"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></div>}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">MWK {plan.price.toLocaleString()}</span>
              </div>
              <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-4 bg-primary-50 dark:bg-slate-800 inline-block px-2 py-1 rounded">{plan.duration}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{plan.desc}</p>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl mt-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Secure Payment</h3>
            </div>
            
            <form onSubmit={handlePayment} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('AIRTEL')}
                      className={`py-3 px-4 border rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'AIRTEL' 
                          ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      Airtel Money
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('TNM')}
                      className={`py-3 px-4 border rounded-xl font-bold text-sm flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'TNM' 
                          ? 'bg-green-50 border-green-500 text-green-700 shadow-sm' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      TNM Mpamba
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., 0999123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isProcessing || !phoneNumber}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-600/20"
                >
                  {isProcessing ? (
                    <>
                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       Processing...
                    </>
                  ) : (
                    'Confirm Upgrade'
                  )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  Secure transaction powered by Smartlearn Pay.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};