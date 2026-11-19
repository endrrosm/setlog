<div align="center">
  <img src="assets/icons/icon.png" alt="Setlog uygulama simgesi" width="104" />
  <h1>Setlog</h1>
  <p><strong>Antrenmanını kaydet. Beslenmeni takip et. Gelişimini gör.</strong></p>
  <p>Türkçe arayüz · Koyu tema · Cihazda veri saklama · Android / iOS / Web</p>
  <p><a href="#hızlı-başlangıç">Hızlı başlangıç</a> · <a href="#kullanım">Kullanım</a> · <a href="#geliştirme-ve-test">Geliştirme</a></p>
</div>

---

Setlog, antrenman programlarını ve günlük beslenme kayıtlarını tek uygulamada tutmak için geliştirilmiş bir Expo / React Native projesidir. Ağırlık, vücut ağırlığı, dropset ve kardiyo çalışmalarını destekler; yemek ve öğün kayıtlarından kalori ile makro besin toplamlarını hesaplar.

Hesap açma veya sunucu kurulumu gerektirmez. Kayıtlar kullanılan cihazda saklanır; ilk açılışta örnek antrenman ya da beslenme verisi bulunmaz.

## İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji](#teknoloji)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Komutlar](#komutlar)
- [Kullanım](#kullanım)
- [Veri saklama ve kayıt davranışı](#veri-saklama-ve-kayıt-davranışı)
- [Proje yapısı](#proje-yapısı)
- [Geliştirme ve test](#geliştirme-ve-test)
- [Derleme ve dağıtım](#derleme-ve-dağıtım)
- [Sorun giderme](#sorun-giderme)
- [Kapsam ve lisans](#kapsam-ve-lisans)

## Özellikler

### Spor

- **Hareket kütüphanesi:** Hareket oluşturma, düzenleme, silme, Türkçe uyumlu arama ve çoklu kas grubu filtresi.
- **Program yönetimi:** Hareketleri sıralama, set veya süre belirleme ve açılır program önizlemesi.
- **Dört kayıt biçimi:** Ağırlık ve tekrar, yalnızca tekrar, work-set / drop-set ve kardiyo süresi.
- **Antrenman sırasında esneklik:** Ek set ekleme ve o antrenmana özel alternatif hareket seçme.
- **Kaldığın yerden devam:** Devam eden antrenmanın girişlerini otomatik saklama.
- **Geçmiş ve gelişim:** Programa göre filtreleme, geçmiş tarihli antrenman girişi ve hareket bazlı grafikler.
- **Aktivite takibi:** Kaydırılabilir yedi günlük takvim, görünen aralıktaki antrenman sayısı ve güncel seri.

### Beslenme

- **Yemek kütüphanesi:** Referans gram miktarı, kalori, karbonhidrat, protein ve yağ değerleri tanımlama.
- **Kayıtlı öğünler:** Birlikte tüketilen yemekleri gram miktarlarıyla yeniden kullanılabilir öğünlerde birleştirme.
- **Günlük takip:** Kahvaltı, öğle yemeği, akşam yemeği ve ara öğünler için tüketim kaydı.
- **Otomatik hesaplama:** Tüketilen miktara göre öğün ve gün toplamlarını hesaplama.
- **Geçmiş kayıtlar:** Tarih seçerek önceki günlere öğün ekleme; tüketim miktarlarını düzenleme ve kaldırma.

## Teknoloji

Aşağıdaki sürümler projenin `package.json` dosyasındaki tanımlardır; kesin bağımlılık ağacı `package-lock.json` ile tutulur.

| Katman | Teknoloji / sürüm |
| --- | --- |
| Uygulama altyapısı | Expo `~58.0.25` |
| Arayüz | React `19.3.0`, React Native `0.88.1` |
| Web | React DOM `19.3.0`, React Native Web `^0.21.0` |
| Yerel depolama | AsyncStorage `2.2.0` |
| Güvenli ekran alanı | React Native Safe Area Context `~5.11.1` |
| Test | Node.js yerleşik test çalıştırıcısı (`node:test`) |
| Mobil derleme yapılandırması | EAS CLI `^27.2.0`, `eas.json` |

Uygulama JavaScript ile yazılmıştır. Arayüz React Native bileşenlerinden, iş kuralları ise ayrı JavaScript modüllerinden oluşur.

## Hızlı başlangıç

### Gereksinimler

- **Node.js 22.13+ (22.x) veya 24.3+ (24.x).** Kurulu React Native ve Metro paketlerinin Node.js koşulu: `^22.13.0 || ^24.3.0 || >=26.0.0`. Bu dokümantasyon güncellemesinde testler Node.js `24.18.0` ile çalıştırıldı.
- Node.js ile birlikte gelen **npm**.
- Mobil önizleme için SDK ile uyumlu **Expo Go**, Android emülatörü veya iOS simülatörü.
- Yerel iOS simülatörü için **macOS ve Xcode**; Android emülatörü için yapılandırılmış **Android Studio / Android SDK**.

### Kurulum

Depoyu bilgisayarınıza aldıktan sonra proje kökünde çalıştırın:

```sh
npm ci
npm start
```

`npm ci`, kilit dosyasındaki sürümleri kurar. Uygulamanın mevcut akışları için `.env`, API anahtarı veya veritabanı kurulumu gerekmez.

Metro açıldıktan sonra:

- **Fiziksel cihaz:** QR kodunu proje SDK’sını destekleyen Expo Go ile açın. Yerel ağ bağlantısında cihaz ve bilgisayar aynı ağda olmalıdır.
- **Android:** Hazır bir emülatörle `npm run android` çalıştırın.
- **iOS:** macOS üzerinde `npm run ios` çalıştırın.
- **Web:** `npm run web` çalıştırıp terminaldeki adresi açın.

> Expo Go sürümünün projenin Expo SDK sürümüyle uyumlu olması gerekir. Web önizlemesi, fiziksel cihazdaki davranışın doğrulandığı anlamına gelmez.

## Komutlar

| Komut | Açıklama |
| --- | --- |
| `npm ci` | Kilit dosyasına göre bağımlılıkları kurar. |
| `npm start` | Expo geliştirme sunucusunu başlatır. |
| `npm run android` | Geliştirme sunucusunu başlatıp Android hedefini açar. |
| `npm run ios` | Geliştirme sunucusunu başlatıp iOS hedefini açar. |
| `npm run web` | Web geliştirme önizlemesini açar. |
| `npm test` | `tests/*.test.js` dosyalarını çalıştırır. |
| `npm run build:web` | Web dağıtım çıktısını `dist/` dizinine üretir. |
| `npx expo start --clear` | Metro önbelleğini temizleyerek geliştirme sunucusunu başlatır. |

`android` ve `ios` komutları mağazaya yüklenebilir APK / AAB / IPA üretmez.

## Kullanım

Sol üstteki bölüm menüsünden **Spor** ve **Beslenme** arasında geçiş yapabilirsiniz. Her bölümün kendi alt sekmeleri vardır.

### 1. Hareketlerini ve programını oluştur

1. **Spor → Hareketler → Yeni hareket** yolundan hareketin adını ve kas grubunu girin.
2. İhtiyaca göre vücut ağırlığı veya dropset seçeneğini kullanın. Kardiyo hareketlerinde bu seçenekler kullanılmaz.
3. **Programlar → Yeni program** ekranında programa ad verin ve hareketleri ekleyin.
4. Her hareket için set / work-set sayısını veya kardiyo süresini belirleyin.
5. Yukarı / aşağı oklarla hareket sırasını düzenleyip programı kaydedin.

Kas grupları: **Göğüs, Omuz, Triceps, Sırt, Biceps, Bacak, Karın, Kardiyo**.

| Hareket türü | Program ayarı | Antrenman girişi |
| --- | --- | --- |
| Ağırlık | 1–30 set | Her set için kilo ve tekrar |
| Vücut ağırlığı | 1–30 set | Her set için yalnızca tekrar |
| Dropset | 1–30 work-set; her work-set için 2–30 drop-set | Her drop-set için ayrı giriş ve tamamlanma |
| Kardiyo | 1–300 dakika hedefi | Gerçekleşen süre, dakika olarak |

Dropset, vücut ağırlığı hareketleriyle de kullanılabilir. Örneğin **3 work-set × 2 drop-set**, ayrı ayrı tamamlanabilen **6 giriş** oluşturur.

### 2. Antrenmanını kaydet

1. **Bugün** ekranında program seçip **Antrenmana başla** düğmesine dokunun.
2. Setlerin değerlerini girin ve tamamladığınız girişleri işaretleyin.
3. Bir seti değiştirmek için tamamlanma işaretini kaldırın.
4. **Antrenmanı bitir → Antrenmanı kaydet** ile kaydı geçmişe ekleyin.

Kilo girişinde `27,5` ve `27.5` biçimleri desteklenir; `0` kg geçerlidir. Tekrar pozitif tam sayı, kardiyo süresi sıfırdan büyük bir sayı olmalıdır. Kaydetmek için en az bir set veya kardiyo girişi tamamlanmalıdır; eksik girişler tamamlanmış sayılmaz.

**Antrenmana özel değişiklikler:** Kardiyo dışındaki hareketlere başlangıç set sayısı kadar ek set eklenebilir. Dropsette her ek work-set, kendi drop-setlerini birlikte ekler. Alternatif hareket seçimi yalnızca aktif antrenmanı değiştirir; değiştirilen hareketin o antrenmandaki girişleri yerine yeni, boş girişler oluşturulur. Sonraki antrenman kayıtlı programı kullanır.

### 3. Geçmişini ve gelişimini incele

- Hareket kartındaki **Geçmiş** veya **Hareketler → Geçmişi gör**, aynı hareketin farklı programlardaki kayıtlarını bir araya getirir.
- Antrenman ekranında hareketin en son **3** tamamlanmış antrenman kaydı görünür.
- Grafik, uygun türdeki son **7** antrenmanı eskiden yeniye gösterir. Ağırlık hareketlerinde kilo, vücut ağırlığı hareketlerinde tekrar, kardiyoda toplam dakika kullanılır. Ağırlık ve tekrar grafiklerinde tamamlanan setlerin en yüksek / en düşük değerleri gösterilir.
- Aynı gün yapılan ayrı antrenmanlar ayrı grafik noktalarıdır. Grafik ölçeği verilere göre değişir.
- **Geçmiş** sekmesinde birden fazla program seçerek filtreleme yapılabilir. Silinmiş programların kayıtları da filtrelenebilir.
- **Geçmiş antrenman ekle** ile bugün veya önceki bir tarih için kayıt girilebilir. Önce aktif antrenmanı tamamlamak ya da iptal etmek gerekir.
- Geçmiş kartındaki **Sil**, onayın ardından yalnızca ilgili antrenmanı kaldırır.

Takvim başlangıçta bugün dahil son yedi günü gösterir; oklar veya yatay kaydırma ile birer gün ilerler. Güncel seri, bugün ya da dün biten ardışık antrenman günlerinden oluşur. Aynı gündeki birden fazla antrenman seride tek gün sayılır.

Program ve hareket filtreleri çoklu seçimi destekler. Programlarda seçilen kas grupları **VEYA** mantığıyla eşleşir. Hareket araması ve kas grubu filtresi birbirini temizler.

### 4. Yemeklerini ve öğünlerini tanımla

1. **Beslenme → Yemekler → Yemek ekle** ekranını açın.
2. Yemek adı, referans gram miktarı ve bu miktara ait kalori / karbonhidrat / protein / yağ değerlerini girin.
3. **Kayıtlı öğünler → Öğün oluştur** ile sık tükettiğiniz yemekleri miktarlarıyla bir araya getirin.
4. **Bugün** ekranından öğün vaktini seçip **Öğün kaydet** ile yemek veya kayıtlı öğün ekleyin.
5. Tükettiğiniz gram miktarlarını düzenleyip kaydedin; öğün ve gün toplamları otomatik hesaplanır.

Hesaplama her besin değeri için şu oranı kullanır:

```text
Tüketilen değer = Tanımlı besin değeri × Tüketilen gram / Referans gram
```

Örneğin 100 gramında 200 kcal bulunan bir yemeğin 150 gramı, kayda 300 kcal ekler. Aynı yemek birden fazla kez seçildiğinde gram miktarları birleştirilir.

Beslenme geçmişinden tarih seçebilir, geçmişe öğün kaydedebilir ve bir öğündeki toplam tüketim miktarlarını değiştirebilirsiniz. Gelecek tarihli kayıt kabul edilmez.

## Veri saklama ve kayıt davranışı

Tüm uygulama verileri AsyncStorage içinde **`setlog:v1`** anahtarında JSON olarak saklanır.

| Alan | İçerik |
| --- | --- |
| `version` | Veri şeması sürümü; mevcut değer `1` |
| `exercises` | Hareket tanımları |
| `programs` | Programlar ve hareket planları |
| `sessions` | Kaydedilmiş antrenmanlar |
| `active` | Devam eden antrenman veya `null` |
| `nutrition` | Kullanıldığında yemekler (`foods`), öğün şablonları (`meals`) ve tüketimler (`entries`) |

### Antrenman kayıtları

Antrenman başlatılırken program ve hareket bilgileri bağımsız bir kopyaya alınır. Sonradan program veya hareket adını değiştirmek eski antrenman adlarını değiştirmez. Hareket geçmişi kalıcı hareket kimliği üzerinden birleştirilir.

Hareket silindiğinde programlardan da çıkarılır; eski antrenmanlar ve aktif antrenman korunur. Program silmek de geçmiş antrenmanları silmez. Eski kilo / tekrar kayıtları kardiyo süresi olarak yeniden yorumlanmaz.

### Beslenme kayıtları

Yemek silmek, yemek kütüphanesindeki tanımı ve kayıtlı öğünlerdeki bağlantılarını kaldırır; tüketim geçmişindeki kopyalar korunur. Kayıtlı öğün silmek yemekleri veya tüketim geçmişini silmez.

**Yemek tanımını düzenlemek, aynı yemeğin geçmiş tüketim kayıtlarındaki adını ve besin değerlerini de günceller.** Tüketilmiş gram miktarları korunur; geçmiş kalori ve makro toplamları yeni değerlere göre değişir.

### Kalıcılık sınırları

- Değişiklikler sıraya alınarak otomatik kaydedilir; kaydedilmiş aktif antrenman yeniden açılışta devam eder.
- Okuma hatasında mevcut verinin üzerine yazılması engellenir; yazma hatası arayüzde bildirilir.
- Hesap, sunucu, bulut yedeği, cihazlar arası senkronizasyon ve uygulama içi veri içe / dışa aktarma bulunmaz.
- Uygulamayı kaldırmak veya tarayıcı site verilerini temizlemek kayıtları silebilir. Farklı cihaz ve tarayıcıların kayıtları birbirinden bağımsızdır.

## Proje yapısı

```text
fitApp/
├── App.js                     # Ana arayüz, spor akışları ve kalıcı durum yönetimi
├── index.js                   # Expo giriş noktası
├── app.json                   # Uygulama kimliği, tema ve simge ayarları
├── eas.json                   # EAS derleme ve gönderim profilleri
├── assets/icons/              # Uygulama ve platform simgeleri
├── src/
│   ├── model.js               # Antrenman modeli, doğrulama ve geçmiş
│   ├── training.js            # Hareket türleri, ek set ve alternatif hareket
│   ├── nutritionModel.js      # Besin hesaplama, tüketim ve öğün işlemleri
│   ├── nutritionCalendar.js   # Beslenme takvimi gün seçimi
│   ├── activity.js            # Haftalık aktivite ve seri hesaplama
│   ├── history.js             # Tarih, sıralama ve geçmiş silme işlemleri
│   ├── chart.js               # Grafik verileri ve ölçek hesaplama
│   ├── filters.js             # Program, hareket ve geçmiş filtreleri
│   ├── format.js              # Türkçe tarih ve ilerleme biçimlendirme
│   ├── amountStepper.js       # Miktar artırma / azaltma davranışı
│   ├── NutritionScreen.js     # Beslenme ekranları
│   ├── SessionExercise.js     # Antrenman hareketleri ve kayıt detayları
│   ├── ExerciseChart.js       # Hareket gelişim grafiği
│   ├── TrainingControls.js    # Hareket ve program seçenekleri
│   └── …                      # Takvim, gezinme, seçim ve giriş bileşenleri
├── tests/                     # İş kuralları için Node.js testleri
├── package.json               # Bağımlılıklar ve komutlar
└── package-lock.json          # Kilitli bağımlılık ağacı
```

## Geliştirme ve test

İş kuralları `src/` altındaki arayüzden bağımsız modüllerde tutulur. Bir davranışı değiştirirken ilgili model ve test dosyasını birlikte inceleyin; özellikle kayıt kopyalarının bağımsızlığını, eski veri uyumluluğunu ve yerel tarih hesaplarını koruyun.

```sh
npm test
```

Testler antrenman kopyaları, giriş doğrulama, kardiyo / dropset / vücut ağırlığı, alternatif hareket, ek set sınırları, grafikler, filtreler, takvim ve seri, beslenme hesapları ve tüketim düzenlemelerini kapsar.

**Son doğrulama — 20 Kasım 2026:** Node.js `24.18.0` ile **43 test başarılı, 0 başarısız**. Bu testler fiziksel cihaz, görsel arayüz veya uçtan uca testlerin yerine geçmez. Bu README güncellemesi sırasında web / mobil derleme yeniden çalıştırılmadı.

Arayüz değişikliklerinde web önizlemesinin yanında cihazda klavye davranışını, ekran sınırlarını, uygulamayı kapatıp devam etmeyi ve kalıcı kayıtları kontrol edin. `package.json` içinde ayrı lint veya tür kontrolü komutu tanımlı değildir.

## Derleme ve dağıtım

### Web çıktısı

```sh
npm run build:web
```

Bu komut `dist/` altında web çıktısı üretir. Çıktı üretmek siteyi otomatik yayımlamaz.

### EAS profilleri

Depoda şu profiller tanımlıdır:

| Profil | Yapılandırma |
| --- | --- |
| `development` | Geliştirme istemcisi ve dahili dağıtım |
| `preview` | Dahili dağıtım; Android için APK |
| `production` | Otomatik sürüm artırımıyla üretim derlemesi |

Expo hesabı, proje erişimi ve gerekli imzalama ayarları hazır olduğunda örnek komutlar:

```sh
npx eas build --platform android --profile preview
npx eas build --platform android --profile production
npx eas build --platform ios --profile production
```

`app.json` mevcut bir EAS proje kimliği ile Android / iOS için `com.setlog.fitness` uygulama kimliğini içerir. Kendi hesabınız altında dağıtırken proje bağlantısını ve uygulama kimliklerini kendi projenize göre yapılandırın.

`development` profili tanımlı olsa da `expo-dev-client` mevcut bağımlılıklarda yoktur; bu profil kullanılmadan önce geliştirme istemcisi kurulumu tamamlanmalıdır. EAS derlemesi mağaza yayını yapmaz; gönderim ve mağaza işlemleri ayrıdır. Depodaki yapılandırma tek başına başarılı bir mobil derleme veya mağaza yayını kanıtı değildir.

Capacitor paketleri bağımlılıklarda yer alır; depoda Capacitor yapılandırması veya yerel platform projesi bulunmadığından burada tanımlanan derleme akışı Expo / EAS üzerinden ilerler.

## Sorun giderme

| Durum | Kontrol / çözüm |
| --- | --- |
| Node.js sürüm uyumsuzluğu | `node --version` ile sürümü kontrol edin; yukarıdaki desteklenen sürümlerden birini kullanın. |
| Expo Go projeyi açmıyor | İstemcinin projenin Expo SDK sürümünü desteklediğini ve ağ bağlantısını kontrol edin. |
| Eski paket / arayüz çıktısı görünüyor | Sunucuyu durdurup `npx expo start --clear` çalıştırın. |
| Bağımlılıklar kurulamıyor | Proje kökünde `npm ci` çalıştırın; Node.js sürümünü ve npm hata çıktısını inceleyin. |
| Antrenman başlamıyor | Program seçildiğinden, programda hareket bulunduğundan ve başka aktif antrenman olmadığından emin olun. |
| Set tamamlanamıyor | Hareket türüne uygun kilo, pozitif tam sayı tekrar veya pozitif süre girin. |
| Kayıtlar okunamıyor | Uygulamayı kapatıp yeniden açın; veriyi korumak için depolamayı temizlemeyin. |
| Değişiklikler kaydedilemiyor | Depolama alanını kontrol edin; hata sürerken uygulamayı kapatmayın. |
| Başka cihazda kayıtlar görünmüyor | Kayıtlar yereldir; cihazlar arasında otomatik aktarım yoktur. |

## Kapsam ve lisans

Bu sürüm kişisel antrenman ve beslenme kaydı üzerine kuruludur. Besin değerleri kullanıcı tarafından girilir; hazır besin veritabanı, barkod tarama, sağlık platformu entegrasyonu veya otomatik antrenman / diyet önerisi bulunmaz.

Depoda bir `LICENSE` dosyası veya `package.json` içinde lisans tanımı bulunmuyor. Kullanım ve yeniden dağıtım koşulları için proje sahibinden bilgi alın; paket `private: true` olarak işaretlidir.
