const content = `# Oroya

> Oroya, kalıcı ve aranabilir tartışmalar için konu odaklı bir sosyal platformdur.

## Herkese açık içerik
- Ana sayfa: https://oroya.xyz/
- Keşfet: https://oroya.xyz/explore
- Site haritası: https://oroya.xyz/sitemap.xml
- Kullanıcı profilleri: https://oroya.xyz/u/{username}
- Herkese açık konular: https://oroya.xyz/topics/{id}

## Güvenlik ve erişim sınırları
- Yalnızca herkese açık profil ve konu sayfaları taranabilir.
- API yolları, özel odalar, bildirimler, ayarlar ve oturum sayfaları botlara kapalıdır.
- E-posta, kimlik doğrulama verileri ve özel mesajlar yayınlanmaz.
- Otomatik erişim sunucunun hız limitlerine tabidir.
`;

export function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
