'use client'

import React from 'react';

interface WalletStatusProps {
  connected: boolean;
  account: string;
  onConnect: () => void;
}

const WalletStatus: React.FC<WalletStatusProps> = ({ connected, account, onConnect }) => {
  if (!connected) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-white/70 mb-6">
            Connect your MetaMask wallet to start using the prediction market orchestrator
          </p>
          <button
            onClick={onConnect}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Wallet Connected</h3>
            <p className="text-white/70 text-sm">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
          </div>
        </div>
        <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
          Connected
        </div>
      </div>
    </div>
  );
};

export default WalletStatus;
