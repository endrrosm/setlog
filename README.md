# Setlog

Türkçe, koyu temalı Android/iOS fitness günlüğü. Expo / React Native ile geliştirilmiştir; web önizlemesi de bulunur.

## Çalıştırma

Node.js 20.19+ gereklidir.

```sh
npm install
npm start
```

Terminaldeki QR kodunu uyumlu Expo Go ile açın. Proje Expo SDK 54'e sabitlenmiştir; Expo Go sürümü bu SDK'yı desteklemelidir. Android emülatörü için `npm run android`, macOS üzerinde iOS simülatörü için `npm run ios`, tarayıcı önizlemesi için `npm run web` kullanılır. Fiziksel cihaz ve bilgisayar aynı ağda olmalıdır.

```sh
npm test
npm run build:web
```

## Kullanım

1. **Hareketler → Yeni hareket:** ad ve kas grubu belirleyin.
2. **Programlar → Yeni program / Düzenle:** hareketleri seçin, her birine 1–30 set atayın. Hareket kutusunun sağ üstündeki gövdesiz yukarı/aşağı oklarla sırasını değiştirin. İlk harekette yukarı, son harekette aşağı düğmesi devre dışıdır. Yeni sıra **Programı kaydet** ile saklanır ve sonraki antrenmanlarda kullanılır.
3. **Bugün:** programı seçerek antrenmana başlayın.
4. Her sette kilo ve tekrar girip onay kutusuna dokunun. Vücut ağırlığı hareketlerinde kilo için `0`, kesirli kiloda `27,5` veya `27.5` girilebilir. Onayı kaldırarak seti düzenleyebilirsiniz.
5. Hareket kartındaki **Geçmiş** tüm programlardaki tarih/set/kilo/tekrar kayıtlarını açar. Her hareketin son 3 antrenman kaydı (tarih, program, set, kilo ve tekrar) doğrudan kartta görünür. Üçten az kayıt varsa mevcut kayıtlar gösterilir.
6. **Antrenmanı bitir → Antrenmanı kaydet:** tamamlanan setler geçmişe eklenir. Eksik setler tamamlanmış sayılmaz.
7. **Hareketler → Geçmişi gör:** antrenman dışında da hareketin tüm programlardaki geçmişine ulaşabilirsiniz.
   Hareket geçmişinin üstündeki çizgi grafik, son 7 antrenmanın tamamlanan setlerdeki en yüksek kilosunu eskiden yeniye gösterir. Y ekseni ağırlıklara göre dinamik ölçeklenir. X ekseninde tarihler 75 derece eğimli gösterilir. Yeşil çizgi en yüksek, gri çizgi en düşük tamamlanmış set kilosudur; ölçek ikisini de kapsar. Noktalara dokunarak tam tarih, program ve yalnızca en yüksek kilo görülebilir. Yediden az kayıt varsa mevcut kayıtlar gösterilir; aynı gün yapılan ayrı antrenmanlar ayrı noktadır.
8. **Programlar / Hareketler → Düzenle → Sil:** onay vererek programı veya hareketi silebilirsiniz. Hareket silinince tüm programlardan çıkarılır; boş kalan programlara yeniden hareket eklenebilir. Eski kayıtlar ve devam eden antrenman korunur. Silinen hareketin geçmişi **Geçmiş** sekmesindeki eski antrenmanlardan açılabilir.

## Veri ve kapsam

- **Geçmiş:** programa göre çoklu filtreleme yapılır. Silinmiş programların geçmiş kayıtları da filtrelenebilir. **Temizle ×** tüm kayıtları yeniden gösterir.
- Filtrelerde seçim tik yerine arka plan rengiyle gösterilir; seçim ve temizleme panel boyutunu değiştirmez.
- Geçmiş kayıtları kapalı başlar; başlıkta gün adı içeren tarih, program adı ve tamamlanan set yüzdesi gösterilir. Kartın geneline dokunarak set detayları açılıp kapatılabilir; büyük ok ilerleme çubuğunun yanındadır. Sil ve hareket geçmişi bağlantıları kendi işlemlerini yapar. Yüzde, kaydın kendi planlanmış set sayısından hesaplanır.
- Programlar sekmesindeki kartlarda kas grupları ve toplam set sayısının altında program önizlemesi bulunur: hareketler antrenman sırasıyla ve set sayılarıyla listelenir.
- Bugün ekranında önce program açılır menüsü ve başlatma düğmesi, ardından takvim ve son antrenman görünür. Program seçilmemişken başlatma düğmesi gri görünür; dokunulunca yalnızca program seçme uyarısı gösterir. Seçim yapılınca seçilen programla antrenman başlar. Aynı davranış geçmiş kayıt girişinde de geçerlidir.
- Bugün ve geçmiş kayıt ekleme menüleri, seçim kutusuyla aynı ekran katmanında kutunun 6 px altına açılır. Seçim kutusunun kopyası oluşturulmaz; kutu sabit kalır ve içerik aşağı itilmez. Menü dışına dokunmak seçim değiştirmeden kapatır. Seçili programın yazı boyutu sabittir; seçim yumuşak yeşil arka planla vurgulanır.
- Takvim başlangıçta bugün dahil son 7 günü gösterir ve birer gün kaydırılır. Örneğin 27 Ekim–2 Kasım aralığından iki gün geri kayınca 25–31 Ekim görünür. Antrenman yapılan günlerde 🔥 gösterilir. Görünen 7 gündeki toplam antrenman sayısı ve güncel seri yan yanadır. Seri bugün veya dün biten ardışık antrenman günleridir; aynı gündeki birden fazla antrenman tek seri günü sayılır. Oklar bir gün kaydırır; Bugüne dön başlangıç aralığını açar.
- Kas grupları: Göğüs, Omuz, Triceps, Sırt, Biceps, Bacak, Karın, Kardiyo. Bu sekiz seçenek hareket tanımlamada ve filtrelerde ortaktır. Eski “Diğer” kayıtları korunur; düzenlerken mevcut gruplardan biri seçilmelidir.
- Takvim parmak hareketini izleyen yatay animasyonla kayar; oklar da bir günlük kaydırma animasyonu yapar. Geçiş tamamlandığında tarih aralığı ve toplam tek güncellemeyle değişir. Eski aralığı yeniden yazan yerel kaydırma olayları kullanılmaz.
- Sekme değiştirildiğinde yeni sayfa en üstten açılır. Kayıt silme onayında “Evet, bu kaydı sil” üstte, “Vazgeç” alttadır; karttaki Sil yazısının boyutu sabit kalırken dokunma alanı genişletilmiştir.
- Program önizlemeleri kapalı başlar; önizleme başlığına dokunarak hareket ve set listesini açıp kapatabilirsiniz.
- Geçmiş kaydının sağ üstündeki küçük **Sil** yazısı yalnızca o antrenman kaydını siler. Tarih ve program adıyla **Emin misin?** onayı istenir; aynı programın diğer kayıtları korunur. Son kaydı silinen program geçmiş filtresinden çıkar.
- **Geçmiş antrenman ekle:** takvimden bugün veya geçmiş bir tarih seçilir. Tarihin altındaki tek açılır menüden program seçilir. Altındaki önizlemede tarih, program, hareketler ve set sayıları görünür. En alttaki **Geçmiş antrenman kaydı gir** düğmesi normal set/kilo/tekrar giriş ekranını açar; program seçilmeden düğme pasiftir. Seçilen tarih yarım kalan kayıtla birlikte saklanır. Tamamlanınca geçmişe dönülür; listeler tarihe göre sıralanır. Devam eden bir antrenman varsa önce tamamlanmalı veya iptal edilmelidir.
- **Hareketler:** kas grubuna göre çoklu filtreleme yapılır. Arama alanına girildiğinde veya yazıldığında grup filtresi temizlenir; aramadaki **×** metnin tamamını siler. Kas grubu seçmek de mevcut aramayı temizler.
- **Programlar:** program isimlerinin altında içerdikleri kas grupları listelenir. Çoklu kas grubu filtresi **VEYA** mantığıyla çalışır: Göğüs ve Omuz seçildiğinde bunlardan en az birini içeren programlar gösterilir. Seçimler kaldırılınca tüm programlar görünür.

- Başlangıçta gerçek olmayan antrenman verisi bulunmaz.
- Hareketler, programlar, antrenman geçmişi ve devam eden antrenman cihazda AsyncStorage içinde saklanır.
- Aktif antrenman uygulama yeniden açıldığında devam eder.
- Program/hareket isim değişiklikleri eski antrenmanların o günkü adlarını değiştirmez. Geçmiş, kalıcı hareket kimliğiyle birleştirilir.
- Kayıt hatası görünür şekilde bildirilir. Okuma hatasında eski verinin üzerine yazılmaz.
- Hesap, sunucu, cihazlar arası senkronizasyon ve bulut yedeği bu sürüme dahil değildir. Uygulamayı kaldırmak veya tarayıcı verilerini temizlemek yerel kayıtları silebilir.
- App Store / Google Play yayını ve imzalı APK/IPA üretimi yapılmamıştır.

## Dosyalar

- `App.js`: mobil arayüz, program/hareket düzenleme, antrenman ve geçmiş akışları.
- `src/model.js`: antrenman snapshot'ı, set doğrulama ve hareket bazlı geçmiş.
- `tests/model.test.js`: kayıt bağımsızlığı, veri doğrulama, programlar arası geçmiş testleri.

## Doğrulama

- `npm test`: 23 test (son 7 antrenman grafiği ve dinamik kilo ölçeği dahil); kayıt koruma, sekiz kas grubu, filtreler, Türkçe arama, tek antrenman silme, tarih ve gün adı biçimi, set ilerleme yüzdesi, takvim aralığı/toplam tutarlılığı, sürükleme mesafesi ve güncel seri dahil.
- `expo export --platform all`: Android ve iOS Hermes paketleri ile web çıktısı üretildi. Bu işlem imzalı APK/IPA üretmez.
- Expo'nun yerel bağımlılık haritasıyla sürüm uyumluluk kontrolü geçti.
- Ortamdaki tarayıcı kontrol aracı başlatılamadığı için görsel/uçtan uca arayüz testi yapılamadı. Fiziksel cihaz üzerinde klavye, kalıcı kayıt ve uygulamayı kapatıp devam etme akışı ayrıca doğrulanmalıdır.
- Bağımlılık denetimi: uyumlu düzeltmeler denendi; son kurulumda 37 uyarı (2 yüksek, 34 orta, 1 düşük) devam ediyor. Yüksek uyarılar `image-size` ve `postcss` paketlerinde. Mağaza/üretim yayını öncesi SDK yükseltmesi ve bağımlılık incelemesi gereklidir; kırıcı `--force` düzeltmesi uygulanmadı. React ve React Native sürümleri, uyumsuz ikinci kopyaları önlemek için overrides ile sabitlendi.
