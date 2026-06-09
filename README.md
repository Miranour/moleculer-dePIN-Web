# dePINLab - Merkeziyetsiz Moleküler Simülasyon Platformu

dePINLab, araştırmacıların ve bilim insanlarının merkeziyetsiz bir ağ (dePIN) üzerinden moleküler simülasyon ve docking işlemlerini gerçekleştirebilecekleri modern bir web uygulamasıdır. Bu uygulama, dağıtık mimariyle ve yüksek performanslı backend servisleriyle uyumlu çalışacak şekilde tasarlanmıştır.

## 🚀 Teknolojiler
Bu proje, modern web standartlarına uygun olarak en güncel teknolojilerle geliştirilmiştir:

- **Core:** React 19, TypeScript, Vite
- **State Management (Durum Yönetimi):** Zustand, TanStack React Query
- **Styling (Tasarım):** Tailwind CSS, Shadcn UI, Lucide React
- **Routing:** React Router v7
- **Moleküler Modelleme:** 3Dmol.js, RDKit
- **Ödemeler & Finans:** Stripe
- **PWA (Progressive Web App):** Vite PWA Plugin
- **Test:** Vitest, Playwright, React Testing Library

## 📂 Proje Yapısı

```text
src/
├── assets/       # Statik dosyalar (Görseller, ikonlar vb.)
├── components/   # Yeniden kullanılabilir UI bileşenleri (Shadcn UI vb.)
├── hooks/        # Özelleştirilmiş (Custom) React Hook'ları
├── integration/  # Dış entegrasyonlar (Stripe, Cüzdan bağlama vb.)
├── lib/          # Yardımcı araçlar (utils) ve konfigürasyonlar
├── mocks/        # Geliştirme aşaması için Mock veriler (MSW)
├── pages/        # Ana sayfa bileşenleri ve yönlendirme (routing)
├── services/     # API istekleri ve Backend haberleşmesi
└── workers/      # Arayüzü dondurmamak için Web Worker'lar (Ağır hesaplamalar)
```

## 🛠️ Kurulum ve Çalıştırma
Projeyi yerel bilgisayarınızda (test ortamında) çalıştırmak için aşağıdaki adımları takip edin:

### Gereksinimler
- Node.js (v18 veya üzeri)
- Backend servislerinin (Docker üzerinden) çalışıyor olması önerilir.

### Adımlar
1. Proje dizininde gerekli paketleri yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Uygulamayı tarayıcınızda açın:
   Geliştirme sunucusu genellikle `https://localhost:5173` adresinde başlar (Projeye Basic SSL eklentisi dahildir).

## 🧪 Testler
Projede yüksek kod kalitesini sağlamak adına kapsamlı test araçları bulunur:

- **Birim (Unit) Testleri:** `npm run test` (Vitest & JSDOM kullanır)
- **Uçtan Uca (E2E) Testleri:** Playwright kullanılarak test edilir. Raporları incelemek için `npx playwright show-report` komutunu kullanabilirsiniz.

## 📦 Derleme (Build)
Uygulamayı canlı (production) ortama hazırlamak için:
```bash
npm run build
```
Bu komut, TypeScript hatalarını denetler (`tsc -b`) ve `dist` klasörü altında optimize edilmiş üretim dosyalarını oluşturur.
