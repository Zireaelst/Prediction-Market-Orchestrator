# Prediction Market Orchestrator Frontend

Bu frontend, hackathon için geliştirilmiş basit ve işlevsel bir arayüz sağlar. Kullanıcılar tahmin sorularını girebilir ve AI ajanlarından analiz alabilirler.

## 🚀 Özellikler

### ✅ Tamamlanan Özellikler
- **Cüzdan Bağlantısı**: MetaMask cüzdanı bağlama desteği
- **Soru Formu**: Tahmin sorusu girme alanı
- **İşlem Akışı**: Orchestrator.sol smart contract'ı ile entegrasyon
- **Durum Göstergeleri**: Real-time işlem durumu takibi
- **Snowtrace Entegrasyonu**: İşlem sonrası block explorer linki

### 📊 Durum Göstergeleri
1. **İşlem blockchain'e gönderiliyor...** - Transaction submit ediliyor
2. **Veri bekleniyor...** - Transaction confirm ediliyor
3. **Ajanlar analiz ediyor...** - AI ajanları çalışıyor
4. **İşlem yapıldı!** - Analiz tamamlandı

## 🛠️ Kurulum

### 1. Dependencies Yükleme
```bash
cd frontend
npm install
```

### 2. Ortam Değişkenlerini Ayarlama
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
NEXT_PUBLIC_ORCHESTRATOR_ADDRESS=0x_YOUR_CONTRACT_ADDRESS_HERE
```

### 3. Development Server'ı Başlatma
```bash
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## 🔧 Kullanım

### 1. Cüzdan Bağlama
- "Cüzdan Bağla" butonuna tıklayın
- MetaMask'ta Avalanche Fuji testnet'e geçin
- Hesabınızı onaylayın

### 2. Soru Sorma
- Textarea'ya tahmin sorunuzu yazın
- Örnek: "Bitcoin fiyatı gelecek hafta 50.000$ üzerinde olacak mı?"
- "Analiz Başlat" butonuna tıklayın

### 3. İşlem Takibi
- Real-time durum güncellemelerini izleyin
- İşlem hash'i ve Snowtrace linkini görüntüleyin
- AI analiz sonucunu bekleyin

### 4. Sonuçları İnceleme
- AI analiz sonucunu okuyun
- Snowtrace'de işlem detaylarını görüntüleyin
- "Yeni Soru" ile başka sorular sorun

## 🌐 Teknik Detaylar

### Smart Contract Entegrasyonu
- **Chain**: Avalanche Fuji Testnet
- **Contract**: Orchestrator.sol
- **Function**: `askQuestion(string memory question, string[] memory args)`
- **Event**: `ResponseReceived(bytes32 indexed requestId, bytes response)`

### Frontend Stack
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Web3**: Ethers.js v5
- **Language**: TypeScript

### Responsive Design
- Mobile-first yaklaşım
- Tüm ekran boyutlarında uyumlu
- Modern glassmorphism tasarım

## 🧪 Test Senaryoları

### Başarılı Flow
1. Cüzdan bağla ✅
2. Geçerli soru gir ✅
3. Transaction approve et ✅
4. Durum güncellemelerini izle ✅
5. Sonucu görüntüle ✅

### Hata Durumları
- MetaMask kurulu değil ❌
- Yanlış network ❌
- Insufficient gas ❌
- User rejection ❌
- Contract error ❌

## 🔗 Önemli Linkler

- **Avalanche Fuji Testnet**: https://testnet.snowtrace.io/
- **Fuji Faucet**: https://faucet.avax.network/
- **MetaMask Network Setup**: Avalanche Fuji (Chain ID: 43113)

## 📝 Geliştirme Notları

### Hackathon İçin Optimizasyonlar
- Basit ve anlaşılır UI/UX
- Hızlı development cycle
- Minimal dependencies
- Mobile responsive
- Error handling

### Gelecek Geliştirmeler
- [ ] Multiple chain support
- [ ] Historical predictions
- [ ] User profiles
- [ ] Prediction marketplace
- [ ] Social features

## 🐛 Bilinen Problemler

1. **Event Listening**: Contract events real-time dinlenir, bazen delay olabilir
2. **Network Switching**: Manual network switch gerekebilir
3. **Gas Estimation**: Otomatik gas estimation yapılır

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Console log'larını kontrol edin
2. MetaMask bağlantısını doğrulayın
3. Contract adresinin doğru olduğundan emin olun
4. Avalanche Fuji testnet'te AVAX token'ınız olduğunu kontrol edin
