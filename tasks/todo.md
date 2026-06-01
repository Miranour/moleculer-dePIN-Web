# dePIN Moleküler Platform — Web Uygulaması Görev Listesi

> **Kaynak:** `web tasarımı.pdf`
> **Oluşturulma:** 2026-05-28
> **Tech Stack:** React + Vite (veya Next.js App Router) · TanStack Query · TailwindCSS + Shadcn/ui · Recharts · RDKit.js · 3Dmol.js
> **Durum Takibi:** `[ ]` Bekliyor · `[x]` Tamamlandı · `[~]` Devam ediyor

---

## FAZA 0 — Proje Altyapısı & Temel Kurulum

- [x] **0.1** Vite + React veya Next.js App Router ile proje iskeletini kur (`npx create-vite@latest ./` veya `npx create-next-app@latest ./`)
- [x] **0.2** TailwindCSS kurulumu ve `tailwind.config.ts` yapılandırması (dark mode, renk paleti, özel fontlar)
- [x] **0.3** Shadcn/ui bileşen kütüphanesini ekle (`npx shadcn-ui@latest init`)
- [x] **0.4** TanStack Query kurulumu ve global `QueryClientProvider` sarmalayıcısını ekle
- [x] **0.5** Recharts veya Chart.js kütüphanesini kur
- [x] **0.6** ESLint + Prettier + Husky (pre-commit) yapılandırması
- [x] **0.7** Ortam değişkenleri (`.env.local`) şablonunu oluştur:
  - `VITE_API_BASE_URL`
  - `VITE_STRIPE_PUBLIC_KEY`
  - `VITE_FCM_VAPID_KEY`
- [x] **0.8** Klasör yapısını oluştur: `src/{pages, components, hooks, services, workers, store, types}`
- [x] **0.9** React Router (veya Next.js routing) ile temel sayfa iskeletini tanımla
- [x] **0.10** PWA altyapısı için `vite-plugin-pwa` kurulumu ve `manifest.json` yapılandırması

---

## FAZA 1 — Kimlik Doğrulama & Güvenlik Katmanı

- [x] **1.1** Giriş sayfası UI'ını tasarla (e-posta + şifre, "şifremi unuttum" linki)
- [x] **1.2** Kayıt sayfası UI'ını tasarla
- [x] **1.3** JWT tabanlı kimlik doğrulama servis katmanını yaz (`src/services/authService.ts`)
- [x] **1.4** `useAuth` custom hook'u oluştur (token saklama, refresh, logout)
- [x] **1.5** Protected route bileşenini yaz (yetkisiz erişimi yönlendir)
- [x] **1.6** Admin / Araştırmacı rol ayrımını route düzeyinde uygula
- [x] **1.7** API Gateway Rate Limiting hata durumlarını (`429 Too Many Requests`) ele alan global hata yakalayıcı ekle
- [x] **1.8** HTTPS zorunluluğunu geliştirme ortamında test et (redirect testi)

---

## FAZA 2 — Araştırmacı Paneli — Moleküler Çizim Sahnesi

> **Referans:** PDF Bölüm 1-A

- [x] **2.1** RDKit.js paketini kur ve Web Worker sarmalayıcısını yaz (`src/workers/rdkitWorker.ts`)
  - Worker içinde `initRDKit()` çağrısı yap
  - Ana thread ile `postMessage` protokolü tanımla
- [x] **2.2** Molekül çizim canvas bileşenini oluştur (`MoleculeDrawer.tsx`)
  - Atom ekleme / bağ çizme araçları
  - Undo/Redo yığını (Ctrl+Z / Ctrl+Y)
- [x] **2.3** Anlık kimyasal valans doğrulamasını Web Worker üzerinden entegre et
  - Hatalı bağları kırmızıyla vurgula, geçerli bağları yeşille onayla
  - Hata mesajını tooltip olarak göster
- [x] **2.4** Gerçek zamanlı SMILES string üreticisini bağla (Worker → ana thread → UI state)
- [x] **2.5** IndexedDB yedekleme katmanını yaz (`src/services/drawingCache.ts`)
  - Çizim her değiştiğinde otomatik kaydet (debounce 500ms)
  - Sayfa açılışında son kaydedilen çizimi geri yükle
- [x] **2.6** "Çizimi Sil / Yeni Başlat" onay modalını ekle
- [x] **2.7** Çizim araç çubuğu UI bileşenini tamamla (atom seçici, bağ tipi seçici, silgi, zoom)

---

## FAZA 3 — Araştırmacı Paneli — 3D Görselleştirme & Docking Alanı

> **Referans:** PDF Bölüm 1-A (3D Görselleştirme & Docking Alanı Sınırlandırması)

- [x] **3.1** 3Dmol.js veya NGL Viewer kütüphanesini kur
- [x] **3.2** RCSB PDB API entegrasyonunu yaz (`src/services/pdbService.ts`)
  - PDB ID ile protein verisini çek ve WebGL sahnesine yükle
- [x] **3.3** WebGL protein render bileşenini oluştur (`ProteinViewer.tsx`)
  - Protein yüzey / çubuk / sopa görünümü geçişleri
  - Kamera kontrolleri (döndür, yakınlaştır, kaydır)
- [x] **3.4** Kullanıcının çizdiği molekülü (SMILES) 3D sahneye ligand olarak ekle
- [x] **3.5** Grid Box (Bounding Box) Seçici bileşenini yaz
  - Mouse ile aktif bağlanma cebini (active site) işaretleme
  - X, Y, Z koordinatları + kutu boyutları UI'da göster ve iş paketine ekle
- [x] **3.6** "Simülasyonu Başlat" butonunu bağla → SMILES + PDB ID + Grid Box koordinatlarını API'ye gönder
- [x] **3.7** 3D sahne yükleme skeleti (skeleton loader) ekle

---

## FAZA 4 — Araştırmacı Paneli — Canlı İlerleme Takibi & Bildirimler

> **Referans:** PDF Bölüm 1-B

- [x] **4.1** SSE (Server-Sent Events) istemci servisini yaz (`src/services/sseService.ts`)
  - `EventSource` bağlantısı aç, `{ "progress": 45 }` mesajlarını dinle
  - Otomatik kopma-yeniden bağlanma mantığını ekle (exponential backoff)
- [x] **4.2** Progress bar bileşenini oluştur (`SimulationProgress.tsx`)
  - Akıcı animasyon (CSS transition ile)
  - Tahmini kalan süre göstergesi
- [x] **4.3** Service Worker dosyasını yaz (`public/sw.js`)
  - Web Push API aboneliği ve bildirim alımı
  - Simülasyon tamamlandığında masaüstü bildirimi gönder: `"Simülasyon tamamlandı! Bağlanma Skoru: -9.2 kcal/mol"`
- [x] **4.4** FCM (Firebase Cloud Messaging) veya VAPID anahtarlarıyla Web Push entegrasyonunu tamamla
- [x] **4.5** Bildirim izni isteme akışını UI'a ekle (izin talep modalı)
- [x] **4.6** SSE bağlantısını simülasyon tamamlandığında veya sekme kapandığında temiz şekilde kapat

---

## FAZA 5 — Araştırmacı Paneli — Dashboard & Analitik Ekranı

> **Referans:** PDF Bölüm 1-C

- [x] **5.1** Ana Dashboard sayfasını oluştur (`pages/dashboard/index.tsx`)
  - Özet kartlar: Toplam simülasyon, başarılı/başarısız, aktif kredi
- [x] **5.2** Tamamlanan simülasyon listesini TanStack Query ile çek ve tabloda göster
  - Filtreleme: tarih aralığı, skor aralığı, molekül adı
  - Sayfalama / sonsuz kaydırma
- [x] **5.3** ADMET Risk Puanları için interaktif radar grafik bileşenini yaz (`AdmetRadarChart.tsx`) — Recharts `RadarChart` kullan
- [x] **5.4** Molekül karşılaştırma için Scatter Plot bileşenini yaz (`MoleculeScatterPlot.tsx`)
  - X ekseni: bağlanma enerjisi (kcal/mol), Y ekseni: ADMET skoru
  - Hover tooltip ile molekül detayı göster
- [x] **5.5** Simülasyon detay modalını / sayfasını yaz (3D sonuç, tam skor tablosu, indirme butonu)
- [x] **5.6** Simülasyon raporunu PDF veya CSV olarak indirme özelliğini ekle

---

## FAZA 6 — Araştırmacı Paneli — Cüzdan & Ödeme Entegrasyonu

> **Referans:** PDF Bölüm 1-C (Cüzdan & Stripe Entegrasyonu)

- [ ] **6.1** Cüzdan sayfasını oluştur (`pages/wallet/index.tsx`)
  - Mevcut bakiye, işlem geçmişi
- [ ] **6.2** Stripe.js veya Iyzico SDK'sını entegre et
  - `useStripe` / `useElements` hook'larıyla ödeme formu
  - Güvenli kart bilgisi girişi (Stripe Elements)
- [ ] **6.3** Bakiye yükleme akışını yaz: tutar seç → ödeme → başarı/hata UI'ı
- [ ] **6.4** TanStack Query ile Optimistic Update uygula (ödeme onayı gelmeden bakiyeyi anında güncelle, hata durumunda geri al)
- [ ] **6.5** İşlem geçmişi tablosunu sayfalı ve filtrelenebilir şekilde yaz
- [ ] **6.6** Webhook (Stripe → Backend) sonrası UI'ın otomatik güncellendiğini doğrula (TanStack Query `invalidateQueries`)

---

## FAZA 7 — Sistem Admin Paneli — Ağ Sağlığı & Worker İzleme

> **Referans:** PDF Bölüm 2-A

- [ ] **7.1** Admin panel layout bileşenini oluştur (sidebar + topbar, koyu tema)
- [ ] **7.2** Worker listesi ekranını yaz (`pages/admin/workers/index.tsx`)
  - Tablo: Worker ID, donanım sınıfı (RTX 4090, 3060 vb.), ping (ms), İtibar Skoru, bağlantı durumu
  - Gerçek zamanlı güncelleme (SSE veya polling 5s)
- [ ] **7.3** İtibar Skoru görsel göstergesini yaz (renk kodlu badge: yeşil/sarı/kırmızı)
- [ ] **7.4** Kuyruk izleme ekranını yaz (`pages/admin/queue/index.tsx`)
  - RabbitMQ/Kafka anlık yükü (bekleyen iş sayısı, erime hızı)
  - Recharts `LineChart` ile zaman serisi grafikleri
- [ ] **7.5** "İşi Yönlendir" özelliğini yaz: seçili işi yüksek itibar skorlu Worker havuzuna manuel kaydır
- [ ] **7.6** Admin SSE bağlantısını yaz (ağ anlık durumu push)

---

## FAZA 8 — Sistem Admin Paneli — Güvenlik, Anti-Fraud & Payout Yönetimi

> **Referans:** PDF Bölüm 2-B

- [ ] **8.1** Karantina & Doğrulama Logları ekranını yaz (`pages/admin/quarantine/index.tsx`)
  - Şüpheli Worker listesi + karantinaya alınma sebebi
  - "Validator'a Gönder" aksiyon butonu
- [ ] **8.2** Şüpheli iş detay modalını yaz (iş süresi, donanım gücü oranı karşılaştırması)
- [ ] **8.3** Kripto / Banka Payout yönetimi ekranını yaz (`pages/admin/payouts/index.tsx`)
  - Bekleyen çekim talepleri listesi
  - "Onayla" butonu → Mass Payout API / USDT-USDC ağ entegrasyonu tetikle
- [ ] **8.4** Finansal Defter (Ledger) ekranını yaz (`pages/admin/ledger/index.tsx`)
  - Kilitli (bloke) toplam kredi
  - Platform payı (%60) ve Worker hak edişleri (%40) grafiksel bilanço
  - Recharts `BarChart` veya `PieChart`
- [ ] **8.5** Tüm admin aksiyonları için audit log kaydını backend'e gönder

---

## FAZA 9 — PWA, Performans & SEO

- [ ] **9.1** `manifest.json`'ı tamamla: uygulama adı, ikonlar (192x192, 512x512), tema rengi, `display: standalone`
- [ ] **9.2** Service Worker önbelleğe alma stratejisini belirle (Workbox: `StaleWhileRevalidate` API yanıtları için, `CacheFirst` statik assets için)
- [ ] **9.3** Lighthouse PWA denetimini çalıştır ve puanı ≥90 yap
- [ ] **9.4** Kod bölme (code splitting) uygula: her sayfa için lazy import (`React.lazy` / `Suspense`)
- [ ] **9.5** Resim optimizasyonu: WebP formatı, `loading="lazy"` niteliği
- [ ] **9.6** SEO meta etiketleri her sayfa için ekle (`<title>`, `<meta name="description">`, `og:*`)
- [ ] **9.7** Erişilebilirlik (a11y) denetimi: ARIA etiketleri, klavye navigasyonu, renk kontrastı
- [ ] **9.8** `robots.txt` ve `sitemap.xml` oluştur (Admin rotalarını dışla)

---

## FAZA 10 — Test & Doğrulama

- [ ] **10.1** Birim testleri: `vitest` + `@testing-library/react` kurulumu
  - RDKit Worker valans mantığı testi
  - SSE servis kopma/bağlanma testi
  - TanStack Query Optimistic Update testi
- [ ] **10.2** Entegrasyon testleri: Mock API (MSW) ile tam akış testi
  - Giriş → Molekül çiz → Simülasyon başlat → Progress izle → Sonuç görüntüle
- [ ] **10.3** E2E testleri: Playwright ile kritik kullanıcı yolculukları
  - Araştırmacı ödeme akışı
  - Admin payout onay akışı
- [ ] **10.4** Performans testi: React DevTools Profiler ile re-render analizi
- [ ] **10.5** Güvenlik testi: XSS, CSRF korumaları; Content Security Policy başlığı doğrula

---

## FAZA 11 — Dağıtım & DevOps

- [ ] **11.1** Dockerfile ve `.dockerignore` yaz (multi-stage build: build → nginx serve)
- [ ] **11.2** `nginx.conf` yapılandır: SPA fallback (`try_files $uri /index.html`), gzip, cache headers
- [ ] **11.3** CI/CD pipeline yaz (GitHub Actions veya GitLab CI):
  - lint → test → build → docker push → deploy
- [ ] **11.4** Staging ortamı için environment ayarlarını yapılandır
- [ ] **11.5** Production build'i doğrula: `npm run build && npm run preview`
- [ ] **11.6** Domain ve SSL sertifikası yapılandır (Certbot / Let's Encrypt)

---

## Genel Notlar & Kararlar

| Konu | Seçilen Yaklaşım | Not |
|---|---|---|
| Frontend framework | React + Vite | Next.js App Router da geçerli alternatif |
| Stil | TailwindCSS + Shadcn/ui | Dark mode varsayılan |
| Sunucu state | TanStack Query | Optimistic updates zorunlu |
| Gerçek zamanlı | SSE (Server-Sent Events) | WebSocket değil, daha hafif |
| 3D render | 3Dmol.js | NGL Viewer alternatif |
| Kimya motoru | RDKit.js + Web Worker | Sunucuya yük bindirmeden |
| Lokal yedek | IndexedDB | Çizim kayıplarını önler |
| PWA | vite-plugin-pwa + Workbox | Masaüstü bildirimleri için zorunlu |
| Ödeme | Stripe.js + Iyzico | Sunucu tarafı webhook doğrulaması şart |
| Kripto payout | Mass Payout API / USDT-USDC | Admin onayı tetikler |

---

## Gözden Geçirme Bölümü

> Bu bölüm her tamamlanan faz sonrası güncellenir.

| Faz | Tamamlanma Tarihi | Gözlemler / Açık Noktalar |
|---|---|---|
| Faza 0 | 2026-05-30 | Vite, Tailwind, Shadcn, TanStack, Router kuruldu. |
| Faza 1 | 2026-05-30 | Login/Register UI, Protected Routes, JWT simulated auth, Axios interceptor, HTTPS enforced |
| Faza 2 | 2026-05-30 | MoleculeDrawer, RDKit Web Worker, IndexedDB cache, Lab page UI |
| Faza 3 | 2026-05-30 | 3Dmol.js CDN, PDB API, ProteinViewer, GridBox |
| Faza 4 | 2026-05-30 | SSE Client, Push Service Worker, Simulation Progress UI |
| Faza 5 | 2026-05-30 | Recharts integration, Dashboard UI, CSV export |
| Faza 6 | — | — |
| Faza 7 | — | — |
| Faza 8 | — | — |
| Faza 9 | — | — |
| Faza 10 | — | — |
| Faza 11 | — | — |
