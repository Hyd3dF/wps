import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description:
    "Oroya gizlilik politikası — hangi bilgileri topladığımızı, nasıl kullandığımızı ve nasıl koruduğumuzu açıklar.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      updatedAt="19 Haziran 2026"
      description="Bu Gizlilik Politikası, Oroya'nın hangi bilgileri topladığını, bu bilgileri nasıl kullandığını, kiminle paylaştığını ve nasıl koruduğunu açıklar."
    >
      <h2>1. Giriş</h2>
      <p>
        Oroya (&ldquo;biz&rdquo;), gizliliğini ciddiye alır. Bu politika,
        <a href="https://oroya.xyz">https://oroya.xyz</a> adresindeki
        hizmeti kullanırken topladığımız verileri ve bu verilerin
        işlenme biçimini açıklar. Hesap oluşturarak veya hizmeti
        kullanarak bu politikayı kabul etmiş sayılırsın.
      </p>

      <h2>2. Topladığımız Bilgiler</h2>
      <h3>2.1 Hesap Bilgileri</h3>
      <p>
        Hesap oluştururken şu bilgileri toplarız:
      </p>
      <ul>
        <li><strong>E-posta adresi</strong> — hesap doğrulama, giriş ve bildirimler için,</li>
        <li><strong>Kullanıcı adı ve görünen ad</strong> — platformda seni tanımlamak için,</li>
        <li><strong>Şifre</strong> — scrypt ile karıştırılarak (hash) saklanır; düz metin olarak tutulmaz,</li>
        <li><strong>Profil bilgileri</strong> — bio, avatar, website, GitHub ve Twitter bağlantıları (isteğe bağlı).</li>
      </ul>

      <h3>2.2 İçerik ve Etkileşim Verileri</h3>
      <p>
        Hizmeti kullanırken ürettiğin ve paylaştığın veriler:
      </p>
      <ul>
        <li>Açtığın konular, yazdığın yorumlar ve oda mesajları,</li>
        <li>Oyların, kaydettiğin konular ve takip ilişkilerin,</li>
        <li>Oda oluşturma ve oda üyelik bilgilerin,</li>
        <li>Odalarda paylaştığın dosya ve görsellerin depolama üzerindeki kopyaları.</li>
      </ul>

      <h3>2.3 Ödeme ve Abonelik Durumu</h3>
      <p>
        Ücretli planlara geçtiğinde, ödeme işlemleri Merchant of Record olarak
        <a href="https://paddle.com" rel="noopener noreferrer">Paddle</a>
        tarafından yürütülür. Oroya, kart bilgilerini veya tam ödeme
        detaylarını saklamaz. Yalnızca abonelik durumun (plan, dönem, başlangıç
        ve bitiş tarihi) ve Paddle&rsquo;dan gelen abonelik tanımlayıcısı
        tarafımızda tutulur.
      </p>

      <h3>2.4 Teknik ve Kullanım Verileri</h3>
      <p>
        Hizmetin güvenli ve çalışır durumda kalması için aşağıdaki teknik
        veriler otomatik olarak toplanabilir:
      </p>
      <ul>
        <li>Tarayıcı türü, cihaz bilgisi ve ekran çözünürlüğü,</li>
        <li>Erişim zaman damgaları, IP adresi ve yönlendiren sayfa (referer),</li>
        <li>Sunucu günlükleri (loglar) ve hata kayıtları,</li>
        <li>Hizmet içi etkinlik (açılan konular, kullanılan özellikler) için
          anonimleştirilmiş kullanım ölçümleri.</li>
      </ul>

      <h2>3. Bilgileri Nasıl Kullanıyoruz</h2>
      <p>Topladığımız bilgileri şu amaçlarla kullanırız:</p>
      <ul>
        <li>Hesabını oluşturmak, hizmeti sunmak ve sürdürmek,</li>
        <li>Giriş doğrulaması ve şifre sıfırlama işlemleri için seninle iletişim kurmak,</li>
        <li>Konular, yorumlar, bildirimler ve oda mesajları gibi içerikleri görüntülemek,</li>
        <li>Abonelik, faturalandırma ve plan yönetimini sağlamak,</li>
        <li>Hizmetin güvenliğini sağlamak, kötüye kullanımı ve dolandırıcılığı önlemek,</li>
        <li>Şartlar ihlallerini araştırmak ve moderasyon uygulamak,</li>
        <li>Hizmeti geliştirmek, performansı izlemek ve hataları gidermek,</li>
        <li>Yasal yükümlülüklere uymak ve yasal taleplere yanıt vermek.</li>
      </ul>

      <h2>4. Ödemelerin İşlenmesi</h2>
      <p>
        Ödemeler Paddle tarafından işlenir. Paddle, kart bilgileri, fatura
        bilgileri ve ödeme geçmişini kendi altyapısında işler ve saklar.
        Oroya, Paddle&rsquo;ın ödeme hizmeti sağlayıcısı olarak
        verilerinizi Paddle&rsquo;ın gizlilik politikası kapsamında
        işlediğini kabul eder. Kart verileri hiçbir zaman Oroya
        sunucularına iletilmez veya saklanmaz.
      </p>

      <h2>5. Çerezler ve Benzeri Teknolojiler</h2>
      <p>
        Oroya, oturum (giriş) bilgisini saklamak ve hizmetin çalışması için
        gerekli teknik çerezleri kullanır. Giriş yapma oturumunu sürdürmek,
        tercihlerini hatırlamak ve temel güvenliği sağlamak amacıyla çerezler
        ve yerel depolama kullanılabilir. Üçüncü taraf reklam veya izleme
        çerezleri bilgilendirme amacıyla kullanılır; bu durumda tarayıcı
        ayarlarından yönetebilirsin.
      </p>

      <h2>6. Bilgi Paylaşımı</h2>
      <p>
        Kişisel verilerini, aşağıdaki durumlar dışında üçüncü taraflarla satmaz
        veya paylaşmayız:
      </p>
      <ul>
        <li><strong>Hizmet sağlayıcılar:</strong> ödeme işleme (Paddle), barındırma
          (hosting) ve dosya depolama gibi hizmetleri yürüten güvenli
          sağlayıcılarla, yalnızca hizmeti sunmak için gerekli ölçüde,</li>
        <li><strong>Yasal yükümlülükler:</strong> yasal bir talep, mahkeme kararı
          veya geçerli bir yasal yükümlülük geldiğinde,</li>
        <li><strong>Güvenlik ve koruma:</strong> haklarımızı, kullanıcılarımızı
          veya hizmeti korumak için gerekli olduğunda,</li>
        <li><strong>İşlemler:</strong> Oroya&rsquo;nın varlıklarının tümünün veya
          bir kısmının devri durumunda, gizlilik yükümlülükleriyle aktarılır.</li>
      </ul>

      <h2>7. Veri Güvenliği</h2>
      <p>
        Verilerini korumak için makul teknik ve organizasyonel önlemler alırız:
      </p>
      <ul>
        <li>Şifreler düz metin olarak saklanmaz; scrypt ile tek yönlü karıştırılır (hash),</li>
        <li>Tüm veri aktarımı HTTPS/TLS üzerinden şifreli olarak yapılır,</li>
        <li>Erişim, en az yetki ilkesiyle sınırlandırılır ve denetlenir,</li>
        <li>Ödeme verileri hiçbir zaman Oroya altyapısında tutulmaz,</li>
        <li>Olağandışı etkinlik ve güvenlik olayları izlenir.</li>
      </ul>
      <p>
        Hiçbir sistem %100 güvenli değildir; ancak bir güvenlik ihlali tespit
        ettiğimizde, yasal yükümlülükler çerçevesinde etkilenen kullanıcıları
        bilgilendirmek için makul çabayı gösteririz.
      </p>

      <h2>8. Veri Saklama</h2>
      <p>
        Verilerini, hesabın aktif olduğu süre boyunca ve hesabını kapattıktan
        sonra yasal yükümlülükler, güvenlik ve yedeklerden kurtarma amacıyla
        makul bir süre daha saklarız. Hesabını kapattığında profil bilgilerin
        ve içeriğin platformdan kaldırılır; yedekler sistemden silinene kadar
        bir süre daha tutulabilir.
      </p>

      <h2>9. Hakların</h2>
      <p>
        Yürürlükteki veri koruma yasaları kapsamında, kişisel verilerine
        ilişkin şu haklara sahip olabilirsin:
      </p>
      <ul>
        <li>Verilerine erişme ve bir kopya isteme,</li>
        <li>Yanlış bilgilerin düzeltilmesini talep etme,</li>
        <li>Verilerinin silinmesini talep etme (hesap kapatma dahil),</li>
        <li>İşlemeye itiraz etme veya işlemeyi sınırlandırma,</li>
        <li>Veri taşınabilirliği — verilerini taşınabilir bir formatta isteme,</li>
        <li>Pazarlama iletilerine ilişkin onayı geri çekme.</li>
      </ul>
      <p>
        Bu haklarını kullanmak için
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yazabilirsin. Kimlik doğrulaması amacıyla talebine ek bilgi isteyebiliriz.
      </p>

      <h2>10. Çocuklar</h2>
      <p>
        Oroya 13 yaşından küçüklerin kullanımı için değildir. 13 yaşından küçük
        çocuğun hesap oluşturduğunu veya veri paylaştığını öğrendiğimizde,
        hesabı ve verileri derhal kaldırırız.
      </p>

      <h2>11. Uluslararası Veri Transferi</h2>
      <p>
        Verilerin, Oroya&rsquo;nın veya hizmet sağlayıcılarının bulunduğu
        ülkelerde işlenebilir. Bu ülkeler ikamet ettiğin ülkeden farklı olabilir.
        Bu tür transferlerde, yürürlükteki veri koruma yasalarına uygun uygun
        güvenceler sağlamaya çalışırız.
      </p>

      <h2>12. Politikada Değişiklikler</h2>
      <p>
        Bu politikayı zaman içinde güncelleyebiliriz. Önemli değişiklikler,
        hesabına kayıtlı e-posta adresine veya platform içinde duyuru yoluyla
        bildirilir. Değişiklik yürürlüğe girdikten sonra hizmeti kullanmaya
        devam etmen, güncellenmiş politikayı kabul ettiğin anlamına gelir.
      </p>

      <h2>13. İletişim</h2>
      <p>
        Gizliliğinle ilgili sorular, talepler veya ihlal bildirimleri için
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yazabilirsin.
      </p>
    </LegalPage>
  );
}
