// ReferralPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCopy, FaShare } from 'react-icons/fa';

function ReferralPage() {
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [referralInput, setReferralInput] = useState('');
  const [applyingCode, setApplyingCode] = useState(false);
  const [applyMessage, setApplyMessage] = useState(null);
  const [discounts, setDiscounts] = useState([]);

  const fetchDiscounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:3001/discounts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  useEffect(() => {
    fetchReferralCode();
    fetchDiscounts();
  }, []);

  const fetchReferralCode = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post('http://localhost:3001/referral/generate', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setReferralCode(response.data.code);
    } catch (error) {
      console.error('Error fetching referral code:', error);
      setError('Failed to generate referral code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join TastyTracks!',
        text: `Use my referral code ${referralCode} to sign up for TastyTracks and get a special discount!`,
        url: window.location.origin
      })
      .catch(error => console.error('Error sharing:', error));
    } else {
      copyToClipboard();
    }
  };

  const applyReferralCode = async () => {
    if (!referralInput.trim()) return;

    try {
      setApplyingCode(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.post('http://localhost:3001/referral/apply', {
        code: referralInput
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setApplyMessage({ type: 'success', text: 'Referral code applied successfully!' });
      setReferralInput('');
    } catch (error) {
      console.error('Error applying referral code:', error);
      setApplyMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to apply referral code' 
      });
    } finally {
      setApplyingCode(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] dark:bg-gray-100 text-white dark:text-gray-800 p-6 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-teal-400 dark:text-teal-600 mb-6">Referral Program</h1>

        <div className="bg-gray-800 dark:bg-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Referral Code</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <p>Loading your referral code...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 mb-4">{error}</div>
          ) : (
            <>
              <div className="flex items-center mb-4">
                <div className="flex-1 bg-gray-700 dark:bg-gray-200 p-3 rounded-l-lg font-mono text-xl text-center">
                  {referralCode}
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="bg-teal-600 hover:bg-teal-700 p-3 rounded-r-lg"
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
              </div>
              
              {copied && (
                <div className="text-green-500 text-center mb-4">
                  Copied to clipboard!
                </div>
              )}
              
              <button
                onClick={shareReferral}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg flex items-center justify-center"
              >
                <FaShare className="mr-2" /> Share Your Referral Code
              </button>
              
              <div className="mt-4 text-sm text-gray-400 dark:text-gray-600">
                Share this code with friends. When they sign up using your code, both of you will receive rewards!
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-800 dark:bg-white rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Apply a Referral Code</h2>
          
          <div className="flex mb-4">
            <input
              type="text"
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value)}
              placeholder="Enter referral code"
              className="flex-1 p-3 rounded-l-lg bg-gray-700 dark:bg-gray-200 text-white dark:text-gray-800"
            />
            <button 
              onClick={applyReferralCode}
              disabled={applyingCode}
              className="bg-teal-600 hover:bg-teal-700 p-3 rounded-r-lg"
            >
              {applyingCode ? 'Applying...' : 'Apply'}
            </button>
          </div>
          
          {applyMessage && (
            <div className={`text-${applyMessage.type === 'success' ? 'green' : 'red'}-500 text-center mb-4`}>
              {applyMessage.text}
            </div>
          )}
        </div>
        {discounts.length > 0 && (
          <div className="bg-gray-800 dark:bg-white rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Available Discounts</h2>
            <div className="space-y-4">
              {discounts.map(discount => (
                <div key={discount._id} className="bg-gray-700 dark:bg-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-mono text-teal-400 dark:text-teal-600">{discount.code}</h3>
                      <p className="text-sm text-gray-300 dark:text-gray-600">
                        {discount.amount}{discount.type === 'percentage' ? '%' : '$'} off your next order
                      </p>
                    </div>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Expires: {new Date(discount.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default ReferralPage;