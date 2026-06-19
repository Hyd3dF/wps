import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "İade Politikası",
  description:
    "Oroya iade politikası — abonelik iptali, iade koşulları, teknik sorunlar ve iade talep süreci.",
};

export default function RefundPage() {
  return (
    <LegalPage
      kind="refund"
      title="İade Politikası"
      updatedAt="19 Haziran 2026"
      description="Bu İade Politikası, Oroya ücretli aboneliklerinde iptal ve iade koşullarını, teknik sorunlar karşısında destek sürecini ve hangi durumlarda iade yapılabileceğini açıklar."
    >
      <h2>1. Genel Bakış</h2>
      <p>
        Oroya&rsquo;da ücretli planlar (Pro ve Ultra) aylık veya yıllık
        abonelik olarak sunulur. Bu politika, aboneliğini iptal etme, iade
        talep etme ve teknik sorunlar karşısında destek alma koşullarını
        belirler. Politika, abonelik satın alırken kabul ettiğin
        <a href="/terms">Kullanım Şartları</a> ile birlikte uygulanır.
      </p>

      <h2>2. Ödeme Sağlayıcı</h2>
      <p>
        Tüm ödemeler, Merchant of Record (kayıtlı satıcı) olarak
        <a href="https://paddle.com" rel="noopener noreferrer">Paddle</a>
        tarafından işlenir. İade ve iptal işlemleri, Paddle&rsquo;ın
        koşulları ve yürürlükteki tüketici koruma yasaları çerçevesinde
        yürütülür. Kart bilgileri Oroya sunucularında saklanmaz; iade
        işlemleri ödemenin yapıldığı karta, Paddle üzerinden iade edilir.
      </p>

      <h2>3. Abonelik İptali</h2>
      <p>
        Aboneliğini istediğin zaman, bir sonraki yenileme tarihinden önce
        iptal edebilirsin. İptal ettiğinde, mevcut faturalandırma dönemi
        sonuna kadar plan özelliklerine erişimin devam eder; yeni bir dönem
        için ücret tahsil edilmez.
      </p>
      <p>
        İptal işlemini başlatmak için
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yazabilir veya hesap ayarlarındaki abonelik bölümünü kullanabilirsin.
        İptal talebinde bulunulduğunda, iptal onayını e-posta ile göndeririz.
      </p>

      <h2>4. İade Koşulları</h2>
      <p>
        Aşağıdaki koşullarda iade talebinde bulunabilirsin:
      </p>
      <ul>
        <li>
          <strong>Yıllık aboneliklerde ilk 14 gün:</strong> Yıllık planı
          satın aldıktan sonraki 14 gün içinde, hiçbir önemli kullanım
          olmadan iptal edersen tam iade alırsın.
        </li>
        <li>
          <strong>Aylık aboneliklerde ilk 7 gün:</strong> Aylık planı satın
          aldıktan sonraki 7 gün içinde, makul kullanım ötesinde iade
          talep edebilirsin.
        </li>
        <li>
          <strong>Teknik erişim sorunu:</strong> Ücretli özelliklere
          erişemediğini bildirdiğin ve sorunu makul süre içinde
          çözemediğimiz durumlarda, etkilenen döneme orantılı iade yapılır.
        </li>
        <li>
          <strong>Yinelenen ücret:</strong> İptal ettiğin halde hata sonucu
          yeniden ücretlendirildiysen, ilgili tutar tam olarak iade edilir.
        </li>
        <li>
          <strong>Yasal haklar:</strong> Yürürlükteki tüketici koruma
          yasalarının tanıdığı iade hakları bu politikaya önceliklidir.
        </li>
      </ul>

      <h2>5. İade Talep Süreci</h2>
      <p>
        İade talebi için şu adımları izle:
      </p>
      <ol>
        <li>
          <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine,
          kayıt olduğun e-posta adresinden yaz.
        </li>
        <li>
          Mesajına kullanıcı adını, abonelik planını ve iade gerekçesini ekle.
          Mümkünse Paddle fatura numarasını veya e-postasını da belirt.
        </li>
        <li>
          Talebini aldığımızı ve incelediğimizi belirten bir onay e-postası
          göndeririz.
        </li>
        <li>
          Onaylanan iadeler, genellikle 5-10 iş günü içinde Paddle üzerinden
          ödemenin yapıldığı karta yansır. Kartınıza yansıma süresi bankana
          bağlı olarak değişebilir.
        </li>
      </ol>

      <h2>6. Teknik Sorunlar ve Destek</h2>
      <p>
        Ücretli özelliklere erişimde teknik bir sorun yaşarsan, önce
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        bildir. Destek taleplerini makul süre içinde yanıtlamaya çalışırız.
        Sorun, Oroya kaynaklı ve çözülemeyen bir erişim kaybına yol açarsa,
        etkilenen dönem için orantılı iade veya süre uzatması sunarız.
      </p>
      <p>
        Hesabını veya içeriğini kaybettiğin iddialarında, kimlik doğrulaması
        amacıyla ek bilgi isteyebiliriz.
      </p>

      <h2>7. İade Yapılmayan Durumlar</h2>
      <p>
        Aşağıdaki durumlarda iade yapılmaz:
      </p>
      <ul>
        <li>
          İade penceresi (yıllıkta 14 gün, aylıkta 7 gün) kapandıktan sonra
          yapılan iptal talepleri — bu durumda dönem sonuna kadar erişim
          devam eder, ancak geriye dönük iade yapılmaz.
        </li>
        <li>
          Ücretli özellikleri belirgin biçimde kullandıktan sonra, yalnızca
          fikir değişikliği gerekçesiyle talep edilen iadeler.
        </li>
        <li>
          Şartlar ihlali nedeniyle hesabın kapatıldığı durumlar.
        </li>
        <li>
          Açıkça yanlış bilgi verilmesi veya kötüye kullanım amaçlı iade
          talepleri.
        </li>
      </ul>
      <p>
        Bu sınırlamalar, yürürlükteki tüketici koruma yasalarının tanıdığı
        zorunlu iade haklarını ortadan kaldırmaz.
      </p>

      <h2>8. Ödeme Sağlayıcısının Rolü</h2>
      <p>
        Paddle, ödemelerin işlenmesinden ve iadelerin kartına iade
        edilmesinden sorumludur. Oroya, iade taleplerini değerlendirir ve
        onaylar; onaylanan iadelerin kartına yansıması Paddle tarafından
        yürütülür. Paddle&rsquo;ın iade süreleri ve yöntemleri konusunda
        ayrıntılı bilgi
        <a href="https://paddle.com" rel="noopener noreferrer">paddle.com</a>
        adresinde bulunabilir.
      </p>

      <h2>9. İletişim</h2>
      <p>
        İptal ve iade talepleri, teknik sorunlar veya ödemeyle ilgili diğer
        sorular için
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yazabilirsin.
      </p>
    </LegalPage>
  );
}
