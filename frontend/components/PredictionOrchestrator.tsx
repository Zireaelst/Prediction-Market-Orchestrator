'use client'

import React, { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { ConnectButton } from './DynamicRainbowKit';
import { parseEther, formatEther } from 'viem';
import Notification from './Notification';
import LoadingSpinner from './LoadingSpinner';

type ProcessingStage = 'idle' | 'submitting' | 'waiting_data' | 'agents_analyzing' | 'completed' | 'error';

interface TransactionResult {
  hash: string;
  blockNumber?: number;
  snowtraceUrl?: string;
}

const PredictionOrchestrator: React.FC = () => {
    const { address, isConnected } = useAccount();
    const [question, setQuestion] = useState('');
    const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
    const [lastResponse, setLastResponse] = useState('');
    const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error' | 'info';
    } | null>(null);

    const { writeContract, data: hash, error, isPending } = useWriteContract();
    
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const contractAddress = process.env.NEXT_PUBLIC_ORCHESTRATOR_ADDRESS as `0x${string}`;
    
    const contractABI = [
        {
            inputs: [
                { name: "question", type: "string" },
                { name: "args", type: "string[]" }
            ],
            name: "askQuestion",
            outputs: [{ name: "", type: "bytes32" }],
            stateMutability: "nonpayable",
            type: "function"
        }
    ] as const;

    useEffect(() => {
        if (isConfirmed && hash) {
            const result: TransactionResult = {
                hash: hash,
                snowtraceUrl: createSnowtraceUrl(hash)
            };
            setTransactionResult(result);
            setProcessingStage('agents_analyzing');
            showNotification('Ajanlar veri analiz ediyor...', 'info');
            
            // TODO: Listen for contract events
            // Şimdilik 5 saniye sonra tamamlandı diyelim
            setTimeout(() => {
                setProcessingStage('completed');
                setLastResponse('Bu bir örnek AI analiz sonucudur. Contract event listener henüz implement edilmedi.');
                showNotification('Analiz tamamlandı!', 'success');
            }, 5000);
        }
    }, [isConfirmed, hash]);

    useEffect(() => {
        if (error) {
            setProcessingStage('error');
            let errorMessage = 'İşlem başarısız. Lütfen tekrar deneyin.';
            
            if (error.message?.includes('User rejected')) {
                errorMessage = 'İşlem kullanıcı tarafından reddedildi';
            } else if (error.message?.includes('insufficient funds')) {
                errorMessage = 'Gas ücretleri için yetersiz AVAX';
            }
            
            showNotification(errorMessage, 'error');
        }
    }, [error]);

    const getStageMessage = (stage: ProcessingStage): string => {
        switch (stage) {
            case 'idle':
                return 'Tahmin sorunuzu girin ve analizi başlatın';
            case 'submitting':
                return 'İşlem blockchain\'e gönderiliyor...';
            case 'waiting_data':
                return 'İşlem onaylanıyor...';
            case 'agents_analyzing':
                return 'Ajanlar analiz ediyor...';
            case 'completed':
                return 'İşlem yapıldı!';
            case 'error':
                return 'Bir hata oluştu';
            default:
                return '';
        }
    };

    const createSnowtraceUrl = (txHash: string): string => {
        return `https://testnet.snowtrace.io/tx/${txHash}`;
    };

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ message, type });
    };

    const askQuestion = async () => {
        if (!question.trim() || !isConnected || !contractAddress) return;

        setProcessingStage('submitting');
        setTransactionResult(null);
        setLastResponse('');
        
        try {
            showNotification('İşlem blockchain\'e gönderiliyor...', 'info');
            
            writeContract({
                address: contractAddress,
                abi: contractABI,
                functionName: 'askQuestion',
                args: [question, []]
            });

            setProcessingStage('waiting_data');
            
        } catch (error: any) {
            console.error('Question submission failed:', error);
            setProcessingStage('error');
            showNotification('İşlem başarısız. Lütfen tekrar deneyin.', 'error');
        }
    };

    const resetForm = () => {
        setQuestion('');
        setProcessingStage('idle');
        setLastResponse('');
        setTransactionResult(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 md:p-8">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                        AI Tahmin Piyasası
                    </h1>
                    <p className="text-xl text-white/70 max-w-2xl mx-auto">
                        Yapay zeka destekli tahmin analizleri ile geleceği öngörün
                    </p>
                </div>
                
                {/* Modern RainbowKit Connect Button */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 animate-fade-in">
                    <div className="flex flex-col items-center space-y-6">
                        {!isConnected ? (
                            <>
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold text-white mb-2">Cüzdanınızı Bağlayın</h3>
                                    <p className="text-white/60 text-lg mb-6">
                                        AI tahmin piyasasında işlem yapmak için cüzdanınızı bağlayın
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-2">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-white mb-1">Cüzdan Bağlandı</h3>
                                    {address && (
                                        <p className="text-white/60 text-sm font-mono">
                                            {address.slice(0, 6)}...{address.slice(-4)}
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
                        <div className="scale-110">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
                
                {isConnected && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 animate-fade-in">
                        {/* Modern Soru Sorma Arayüzü */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-3">Nasıl yardımcı olabilirim?</h2>
                            <p className="text-white/60 text-lg">Tahmin sorunuzu yazın, AI ajanlarımız analiz etsin</p>
                        </div>
                        
                        {/* Durum Göstergesi */}
                        {processingStage !== 'idle' && (
                            <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="flex items-center justify-center space-x-3">
                                    {(processingStage !== 'completed' && processingStage !== 'error') && (
                                        <LoadingSpinner size="sm" />
                                    )}
                                    <span className={`text-sm font-medium ${
                                        processingStage === 'completed' ? 'text-green-400' :
                                        processingStage === 'error' ? 'text-red-400' :
                                        'text-blue-400'
                                    }`}>
                                        {getStageMessage(processingStage)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Modern Input Container */}
                        <div className="relative mb-6">
                            <div className="relative bg-white/10 rounded-2xl border border-white/20 focus-within:border-blue-400/50 focus-within:bg-white/15 transition-all duration-300 group">
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Herhangi bir şey sor..."
                                    rows={1}
                                    className="w-full p-6 pr-20 rounded-2xl bg-transparent text-white placeholder-white/50 border-0 focus:ring-0 outline-none resize-none text-lg leading-relaxed min-h-[80px]"
                                    style={{ 
                                        height: 'auto',
                                        minHeight: '80px',
                                        maxHeight: '200px'
                                    }}
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = 'auto';
                                        target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                                    }}
                                />
                                
                                {/* Send Button */}
                                <div className="absolute right-3 bottom-3 flex items-center space-x-2">
                                    <button
                                        onClick={askQuestion}
                                        disabled={
                                            (processingStage !== 'idle' && processingStage !== 'completed' && processingStage !== 'error') 
                                            || !question.trim() 
                                            || isPending 
                                            || isConfirming
                                        }
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white p-3 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                        {(isPending || isConfirming || processingStage === 'agents_analyzing') ? (
                                            <LoadingSpinner size="sm" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </button>
                                    
                                    {/* Voice Input Button */}
                                    <button className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all duration-200 border border-white/20">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Araçlar */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                    <span className="text-sm">Araçlar</span>
                                </button>
                            </div>
                            
                            {(processingStage === 'completed' || processingStage === 'error') && (
                                <button
                                    onClick={resetForm}
                                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="text-sm">Yeni Soru</span>
                                </button>
                            )}
                        </div>

                        {/* Örnek Sorular */}
                        {processingStage === 'idle' && !question && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    "Bitcoin fiyatı gelecek hafta 50.000$ üzerinde olacak mı?",
                                    "Tesla hissesi bu ay %10 yükselir mi?",
                                    "Ethereum 2024 sonunda 5000$ olur mu?",
                                    "Dolar/TL kuru 35'i geçer mi?"
                                ].map((exampleQuestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setQuestion(exampleQuestion)}
                                        className="text-left p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 text-white/80 hover:text-white text-sm"
                                    >
                                        {exampleQuestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Modern İşlem Sonucu */}
                {transactionResult && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-white/10 animate-scale-in">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">İşlem Detayları</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-white/60 text-sm">İşlem Hash</span>
                                    <button className="text-blue-400 hover:text-blue-300 text-xs">Kopyala</button>
                                </div>
                                <p className="text-white font-mono text-sm break-all bg-black/20 rounded-lg p-3">
                                    {transactionResult.hash}
                                </p>
                            </div>
                            
                            {transactionResult.blockNumber && (
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                    <span className="text-white/60 text-sm block mb-2">Blok Numarası</span>
                                    <p className="text-white text-lg font-semibold">{transactionResult.blockNumber}</p>
                                </div>
                            )}
                            
                            {transactionResult.snowtraceUrl && (
                                <a
                                    href={transactionResult.snowtraceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    <span className="font-semibold">Snowtrace'de Görüntüle</span>
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Modern Analiz Sonucu */}
                {lastResponse && (
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 animate-scale-in">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-white">AI Analiz Sonucu</h2>
                        </div>
                        
                        <div className="bg-gradient-to-br from-black/30 to-gray-900/30 rounded-2xl p-6 border border-white/10">
                            <pre className="text-white/90 whitespace-pre-wrap text-sm leading-relaxed font-mono">
                                {lastResponse}
                            </pre>
                        </div>
                        
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/10">
                            <div className="flex items-center space-x-2 text-white/60 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Analiz tamamlandı</span>
                            </div>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm">Kopyala</span>
                            </button>
                        </div>
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
