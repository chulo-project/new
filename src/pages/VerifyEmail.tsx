import React, { useState } from 'react';
import { ArrowLeft, Key, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyEmail: React.FC = () => {
  const { user, requestVerification } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'verify' | 'success'>('input');
  const [error, setError] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleRequestVerification = async () => {
    setIsSendingCode(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setStep('verify');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (verificationCode !== generatedCode) {
      setError('Invalid verification code. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the actual verification function
      await requestVerification();
      setStep('success');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    window.location.href = '/profile';
  };

  if (!user) {
    return null;
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verified Successfully!
            </h2>
                         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border dark:border-gray-700">
               <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
               Your email has been verified successfully. You now have access to all features including posting recipes and writing reviews.
               </p>
               <button
                 onClick={() => window.location.href = '/'}
                 className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium mb-3"
               >
                 Start Exploring Recipes
               </button>
               <button
                 onClick={() => window.location.href = '/profile'}
                 className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
               >
                 Back to Profile
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Back Button */}
          <button
            onClick={() => setStep('input')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verify Your Email
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              We've sent a 6-digit code to {user.email}
            </p>
          </div>

          {/* Demo Code Display */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
              <strong>Demo Code:</strong> {generatedCode}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border dark:border-gray-700">
            <form onSubmit={handleVerificationSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-lg tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 focus:ring-4 focus:ring-orange-200 dark:focus:ring-orange-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSendingCode(true);
                  // Simulate API call delay
                  setTimeout(() => {
                    setIsSendingCode(false);
                    const code = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedCode(code);
                  }, 1500);
                }}
                disabled={isSendingCode}
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors text-sm"
              >
                {isSendingCode ? 'Sending Code...' : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Back Button */}
        <div>
          <button
            onClick={handleBackClick}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Verify your email to unlock all features
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border dark:border-gray-700">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
              To unlock all features including posting recipes and writing reviews, please verify your email address.
            </p>
            
            <button
              onClick={handleRequestVerification}
              disabled={isSendingCode}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingCode ? 'Sending Code...' : 'Send Verification Code'}
            </button>
            
            <button
              onClick={handleBackClick}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 