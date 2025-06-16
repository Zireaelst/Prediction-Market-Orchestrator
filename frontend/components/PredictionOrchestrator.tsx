'use client'

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletStatus from './WalletStatus';
import Notification from './Notification';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const PredictionOrchestrator: React.FC = () => {
    const [connected, setConnected] = useState(false);
    const [account, setAccount] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [lastResponse, setLastResponse] = useState('');
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
    };

    const connectWallet = async () => {
        if (!window.ethereum) {
            showNotification('MetaMask is not installed. Please install MetaMask to continue.', 'error');
            return;
        }

        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xA869' }], // Avalanche Fuji Testnet
            });
            
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            setAccount(accounts[0]);
            setConnected(true);
            showNotification('Wallet connected successfully!', 'success');
        } catch (error: any) {
            console.error('Wallet connection failed:', error);
            if (error.code === 4001) {
                showNotification('Please connect your wallet to continue', 'error');
            } else if (error.code === 4902) {
                showNotification('Please add Avalanche Fuji network to MetaMask', 'error');
            } else {
                showNotification('Failed to connect wallet. Please try again.', 'error');
            }
        }
    };

    const askQuestion = async () => {
        if (!question || !connected) return;

        setLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            const contractAddress = process.env.NEXT_PUBLIC_ORCHESTRATOR_ADDRESS;
            if (!contractAddress) {
                throw new Error('Contract address not configured');
            }
            
            const contractABI = [
                "function askQuestion(string memory question, string[] memory args) external returns (bytes32)"
            ];

            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            
            const tx = await contract.askQuestion(question, []);
            const receipt = await tx.wait();
            
            // Listen for response
            listenForResponse();
            
        } catch (error: any) {
            console.error('Question submission failed:', error);
            let errorMessage = 'Transaction failed. Please try again.';
            
            if (error.code === 4001) {
                errorMessage = 'Transaction was rejected by user';
            } else if (error.code === -32602) {
                errorMessage = 'Invalid transaction parameters';
            } else if (error.message?.includes('insufficient funds')) {
                errorMessage = 'Insufficient AVAX for gas fees';
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    const listenForResponse = () => {
        if (!window.ethereum) return;
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contractAddress = process.env.NEXT_PUBLIC_ORCHESTRATOR_ADDRESS;
        
        if (!contractAddress) {
            console.error('Contract address not configured');
            return;
        }
        
        const contractABI = [
            "event ResponseReceived(bytes32 indexed requestId, bytes response)"
        ];

        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        contract.on("ResponseReceived", (requestId, response) => {
            try {
                setLastResponse(ethers.utils.toUtf8String(response));
            } catch (error) {
                console.error('Error parsing response:', error);
                setLastResponse('Invalid response format received');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-8 text-center">
                    Merkeziyetsiz Tahmin Piyasası Orkestratörü
                </h1>
                
                <WalletStatus 
                    connected={connected} 
                    account={account} 
                    onConnect={connectWallet} 
                />
                
                {connected && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Ask a Question</h2>
                        <div className="space-y-4">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your prediction question..."
                                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border-0 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            
                            <button
                                onClick={askQuestion}
                                disabled={loading || !question}
                                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    'Start Analysis'
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {lastResponse && (
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Analysis Result:</h2>
                        <pre className="text-white/80 whitespace-pre-wrap">
                            {lastResponse}
                        </pre>
                    </div>
                )}
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default PredictionOrchestrator;
