import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description:
    "Oroya platformunun kullanım şartları — hesap, içerik, yasak davranışlar, abonelik ve sorumluluklar.",
};

export default function TermsPage() {
  return (
    <LegalPage
      kind="terms"
      title="Kullanım Şartları"
      updatedAt="19 Haziran 2026"
      description="Bu Kullanım Şartları, Oroya platformunu kullanırken uygulanacak kuralları ve koşulları belirler. Hesap oluşturarak veya hizmeti kullanarak bu şartları kabul etmiş sayılırsın."
    >
      <h2>1. Sözleşmenin Tarafları ve Kabulü</h2>
      <p>
        Oroya (&ldquo;Oroya&rdquo;, &ldquo;biz&rdquo; veya &ldquo;platform&rdquo;),
        kullanıcılarının konu açtığı, tartışmalar yürüttüğü ve gerçek zamanlı
        odalarda iletişim kurabildiği bir konu-odaklı sosyal platformdur.
        Platforma <a href="https://oroya.xyz">https://oroya.xyz</a> adresi
        üzerinden erişilir.
      </p>
      <p>
        Bu Kullanım Şartları (&ldquo;Şartlar&rdquo;), hizmeti kullanan tüm
        kullanıcılar (&ldquo;siz&rdquo; veya &ldquo;kullanıcı&rdquo;) ile Oroya
        arasında hukuki bir anlaşma oluşturur. Hesap oluşturarak, giriş yaparak
        veya hizmete erişerek bu Şartları okuduğunuzu ve kabul ettiğinizi beyan
        edersiniz. Şartları kabul etmiyorsanız hizmeti kullanmayınız.
      </p>
      <p>
        Kayıt sırasında &ldquo;Kullanım Şartları&rsquo;nı kabul ediyorum&rdquo;
        kutusunu işaretleyerek bu Şartları açıkça kabul etmiş olursunuz. Bu
        kutuyu işaretlemeden hesap oluşturamazsınız.
      </p>

      <h2>2. Hizmetin Tanımı</h2>
      <p>
        Oroya; konu (topic) açma, markdown destekli içerik yayınlama, iç içe
        yorumlar, oylama, kaydetme, gerçek zamanlı odalar, kullanıcı profilleri,
        takip ve bildirimler gibi özellikler sunar. Hizmetin kapsamı ve
        özellikleri zaman içinde değişebilir; bazı özellikler yalnızca ücretli
        abonelik planlarında kullanılabilir.
      </p>
      <p>
        Hizmeti 18 yaşından küçük olmayan veya bulunduğu yargı bölgesinde
        reşit sayılmayan kişilerin kullanması yasaktır. Hesap oluştururken
        yaş şartını karşıladığınızı beyan edersiniz.
      </p>

      <h2>3. Hesap Oluşturma ve Kullanım</h2>
      <p>
        Hesap oluştururken doğru, güncel ve eksiksiz bilgiler (görünen ad,
        kullanıcı adı, e-posta ve şifre) vermekle yükümlüsünüz. Hesap
        güvenliğinden ve hesabınızla yapılan tüm etkinliklerden siz
        sorumlusunuz. Şifrenizi güvenli bir şekilde saklamalı ve başkalarıyla
        paylaşmamalısınız.
      </p>
      <p>
        Her kullanıcı yalnızca bir hesap oluşturabilir. Başkası adına hesap
        açmak, yanıltıcı kimlik bilgileri kullanmak veya kullanıcı adını
        başkasının markasını/kişiliğini taklit edecek şekilde seçmek yasaktır.
      </p>
      <p>
        Hesabınızın yetkisiz kullanıldığını düşünüyorsanız derhal
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        bildirmelisiniz.
      </p>

      <h2>4. Kullanıcı İçeriği</h2>
      <p>
        Konular, yorumlar, oda mesajları, profil bilgileri ve platformda
        paylaştığınız diğer tüm materyaller (&ldquo;içerik&rdquo;) sizin
        sorumluluğunuzdadır. İçeriğin yayınlanmasıyla, içeriğin size ait
        olduğunu veya yayınlama hakkına sahip olduğunuzu beyan edersiniz.
      </p>
      <p>
        Oroya&rsquo;ya, içeriğinizi platformda görüntülemek, çoğaltmak,
        dağıtmak ve hizmetin çalışması için gerekli teknik işlemleri yapmak
        amacıyla sınırlı, dünya çapında, telifsiz, devredilebilir, alt lisans
        verilebilir bir lisans vermiş olursunuz. Bu lisans, hesabınızı
        kapattığınızda veya içeriği sildiğinizde, yayından kaldırma süresi
        kadar sona erer.
      </p>
      <p>
        Yalnızca kendi içeriğinizden veya başkalarının açıkça izin verdiği
        içerikten sorumlusunuz. Başkalarının haklarını ihlal eden içerik
        yayınlamayınız.
      </p>

      <h2>5. Kabul Edilebilir Kullanım ve Yasak Davranışlar</h2>
      <p>
        Hizmeti kullanırken aşağıdaki davranışlarda bulunmak yasaktır. Bu
        liste tamamlayıcı değildir ve Oroya, uygun gördüğü durumlarda içeriği
        kaldırma veya hesabı kapatma hakkını saklı tutar:
      </p>
      <ul>
        <li>
          Yasa dışı, tehditkar, taciz edici, nefret söylemi içeren, ırkçı,
          cinsiyetçi veya başkalarına zarar verecek içerik yayınlamak,
        </li>
        <li>
          Çocukların istismarına ilişkin her türlü içerik (bu tür içerikler
          sıfır tolerans kapsamındadır ve ilgili makamlara bildirilir),
        </li>
        <li>
          Başkalarının özel bilgilerini (doxing) izinsiz paylaşmak,
        </li>
        <li>
          Telif hakkı, marka veya diğer fikri mülkiyet haklarını ihlal eden
          içerik yayınlamak,
        </li>
        <li>
          Spam, zincir mesaj, ticari amaçlı izinsiz reklam veya tekrarlanan
          düşük kaliteli içerik yayınlamak,
        </li>
        <li>
          Virüs, zararlı yazılım veya başka bir kod enjekte etmeye yönelik
          içerik paylaşmak,
        </li>
        <li>
          Hizmeti otomatik araçlarla (bot, scraper, crawler) izinsiz taramak,
          veri toplamak veya aşırı yük bindirmek,
        </li>
        <li>
          Hizmetin güvenliğini test etmek, zafiyet aramak veya yetkisiz erişim
          elde etmeye çalışmak (Oroya&rsquo;nın açıkça izin verdiği durumlar
          hariç),
        </li>
        <li>
          Başka bir kullanıcının hesabını ele geçirmeye, kimliğini taklit
          etmeye çalışmak,
        </li>
        <li>
          Hizmeti, Oroya&rsquo;nın yazılı onayı olmadan ticari amaçla
          yeniden satmak veya bir API üzerinden toplu erişim sağlamak.
        </li>
      </ul>

      <h2>6. Odalar ve Gerçek Zamanlı İletişim</h2>
      <p>
        Odalar, kullanıcıların gerçek zamanlı mesajlaştığı topluluk alanlarıdır.
        Bir odaya katılarak, o odanın sahibinin veya moderatörlerin ek kurallar
        uygulayabileceğini kabul edersiniz. Oda sahibi, kendi odasında uygun
        gördüğü üyeleri çıkarabilir veya mesajları silebilir.
      </p>
      <p>
        Oda mesajlarında ve gerçek zamanlı iletişimde de 5. maddedeki kurallar
        geçerlidir. Yasak içerik paylaşımı, oda kapatma veya kullanıcı
        uzaklaştırması ile sonuçlanabilir.
      </p>

      <h2>7. Moderasyon</h2>
      <p>
        Oroya, içeriği önceden denetlemez; ancak içerik veya davranış bu
        Şartları ihlal ederse müdahale etme hakkını saklı tutar. İhlal
        durumunda uygulanabilecek yaptırımlar arasında içeriğin kaldırılması,
        konuların sabitlenmesinin/kaldırılmasının engellenmesi, oda erişiminin
        kısıtlanması, geçici askıya alma ve kalıcı hesap kapatma bulunur.
      </p>
      <p>
        Uygunsuz içerik bildirimini
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yapabilirsiniz. Bildirimlerde incelemeyi hızlandıracak ayrıntıları
        (ilgili bağlantı, kullanıcı adı ve gerekçesi) paylaşmanız rica olunur.
      </p>

      <h2>8. Abonelikler ve Ödemeler</h2>
      <p>
        Ücretli planlar (Pro ve Ultra), aylık veya yıllık abonelik olarak
        sunulur. Ödemeler, Merchant of Record olarak Paddle üzerinden
        işlenir; kart bilgileri Oroya sunucularında saklanmaz. Ödeme
        işleme, faturalandırma ve iade süreçleri Paddle&rsquo;ın koşullarına
        tabidir.
      </p>
      <p>
        Aboneliğin, seçtiğin plan ve dönem sonunda, iptal edene kadar otomatik
        olarak yenileneceğini kabul edersiniz. Yenileme tarihinden önce
        iptal etmediğin takdirde bir sonraki dönem ücreti tahsil edilir.
        İptal sonrası mevcut dönem sonuna kadar plan özelliklerine erişim
        devam eder.
      </p>
      <p>
        İade koşulları için
        <a href="/refund">İade Politikası</a> sayfasına bakınız. Tüm ücretli
        kullanım, bu Şartlar ile
        <a href="/refund">İade Politikası</a> ve
        <a href="/privacy">Gizlilik Politikası</a>&rsquo;na tabidir.
      </p>

      <h2>9. Fikri Mülkiyet</h2>
      <p>
        Oroya markası, logosu, tasarımı, kodu ve hizmetle ilgili diğer tüm
        fikri mülkiyet hakları Oroya&rsquo;ya aittir. Bu Şartlar, Oroya
        fikri mülkiyeti üzerinde hiçbir hak devri anlamına gelmez. Hizmeti
        kullanırken Oroya&rsquo;nın marka ve tasarımını izinsiz kullanamazsınız.
      </p>

      <h2>10. Garanti Reddi</h2>
      <p>
        Hizmet &ldquo;olduğu gibi&rdquo; ve &ldquo;kullanılabilir olduğu ölçüde&rdquo;
        sunulur. Oroya, hizmetin kesintisiz, hatasız, güvenli veya belirli bir
        amaca uygun olduğu konusunda açık veya zımni hiçbir garanti vermez.
        Gerektiğinde bakım, güncelleme veya geçici kesinti yapılabilir.
      </p>

      <h2>11. Sorumluluğun Sınırlandırılması</h2>
      <p>
        Yürürlükteki yasaların izin verdiği azami ölçüde, Oroya; hizmetin
        kullanımından veya kullanılamamasından doğan doğrudan, dolaylı, arızi,
        sonuçsal veya cezai zararlardan sorumlu tutulamaz. Oroya&rsquo;nın
        toplam sorumluluğu, söz konusu olaydan önceki 12 ay içinde sizden
        alınan toplam abonelik tutarını aşamaz.
      </p>

      <h2>12. Hesabın Kapatılması ve Fesih</h2>
      <p>
        Hesabını istediğin zaman ayarlardan kapatabilir veya
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yazarak kapatılmasını talep edebilirsin. Hesap kapatıldığında profilin
        ve içeriğin platformdan kaldırılır; bazı veriler yedeklerden ve
        yasal saklama yükümlülüklerinden dolayı bir süre daha tutulabilir.
      </p>
      <p>
        Oroya, bu Şartları ihlal ettiğini düşündüğü durumlarda hesabını
        askıya alabilir veya kalıcı olarak kapatabilir. Ücretli abonelik
        döneminde Şartlar ihlali nedeniyle hesabın kapatılması durumunda, iade
        hakların <a href="/refund">İade Politikası</a> kapsamında değerlendirilir.
      </p>

      <h2>13. Şartlarda Değişiklikler</h2>
      <p>
        Oroya bu Şartları zaman zaman güncelleme hakkını saklı tutar. Önemli
        değişiklikler, hesabına kayıtlı e-posta adresine veya platform içinde
        bildirim yoluyla duyurulur. Değişiklik yürürlüğe girdikten sonra
        hizmeti kullanmaya devam etmen, güncellenmiş Şartları kabul ettiğin
        anlamına gelir.
      </p>

      <h2>14. Uyuşmazlıklar ve Uygulanacak Hukuk</h2>
      <p>
        Bu Şartlar, Oroya&rsquo;nın tescilli bulunduğu yargı bölgesi
        hukukuna tabidir. Çıkan uyuşmazlıklarda öncelikle
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> üzerinden
        dostane çözüm aranır. Çözüme ulaşılamaması durumunda, yetkili
        mahkemeler Oroya&rsquo;nın yerleşim yeri mahkemeleridir.
      </p>

      <h2>15. İletişim</h2>
      <p>
        Bu Şartlar veya hizmetle ilgili her türlü soru için
        <a href="mailto:support@fluxsphere.sbs">support@fluxsphere.sbs</a> adresine
        yazabilirsin.
      </p>
    </LegalPage>
  );
}
