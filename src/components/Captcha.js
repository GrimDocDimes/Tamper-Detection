import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const Captcha = ({ onCaptchaChange, isValid }) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    onCaptchaChange('', false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserInput(value);
    const isCorrect = value.toLowerCase() === captchaText.toLowerCase();
    onCaptchaChange(value, isCorrect);
  };

  const drawCaptcha = () => {
    return (
      <div className="relative bg-gray-100 border border-gray-300 rounded p-4 h-16 flex items-center justify-center">
        <div 
          className="text-2xl font-bold text-gray-700 select-none"
          style={{
            fontFamily: 'monospace',
            letterSpacing: '4px',
            transform: 'skew(-5deg)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {captchaText.split('').map((char, index) => (
            <span 
              key={index}
              style={{
                color: '#374151',
                transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
                display: 'inline-block',
                margin: '0 2px'
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
          title="Refresh Captcha"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Security Code
      </label>
      {drawCaptcha()}
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the code above"
        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isValid === null 
            ? 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
            : isValid 
            ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
            : 'border-red-300 focus:ring-red-500 focus:border-red-500'
        }`}
      />
      {isValid === false && (
        <p className="text-sm text-red-600">Incorrect security code. Please try again.</p>
      )}
    </div>
  );
};

export default Captcha;
