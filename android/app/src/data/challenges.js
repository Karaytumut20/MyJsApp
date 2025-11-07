// CHALLENGES array'i artık tip tanımlamaları olmadan doğrudan JavaScript objeleri içeriyor.

export const CHALLENGES = [
  // A1 Seviyesi (Başlangıç)
  { id: '1', title: '5 İngilizce Kelime Öğren', description: 'Bugün 5 yeni İngilizce kelime (ve anlamlarını) öğren ve bir yere not et.', level: 'A1', focus: 'english' },
  { id: '2', title: '10 Dakika Meditasyon', description: 'Günün karmaşasından 10 dakika uzaklaş ve zihnini dinlendir.', level: 'A1', focus: 'health' },
  { id: '3', title: 'Hızlı Yürüyüş', description: 'En az 20 dakikalık tempolu bir yürüyüş yap.', level: 'A1', focus: 'health' },
  
  // B1 Seviyesi (Orta)
  { id: '10', title: 'Kısa Makale Oku', description: 'Seviyene uygun bir İngilizce haber veya makaleyi baştan sona oku.', level: 'B1', focus: 'english' },
  { id: '11', title: 'Yeni Bir Tarif Dene', description: 'Daha önce denemediğin, sağlıklı bir yemeğin tarifini bul ve yap.', level: 'B1', focus: 'health' },
  { id: '12', title: 'Günün Özeti (İngilizce)', description: 'Gününü 5 cümle ile İngilizce olarak bir deftere yaz.', level: 'B1', focus: 'mix' },

  // C1 Seviyesi (İleri)
  { id: '20', title: 'Native Speaker Dinle', description: 'En az 30 dakikalık bir İngilizce podcast veya konuşma dinle, bilinmeyen kelimeleri not al.', level: 'C1', focus: 'english' },
  { id: '21', title: '2 Litre Su İç', description: 'Vücudunun hidrasyonunu sağlamak için gün boyunca en az 2 litre su tüket.', level: 'C1', focus: 'health' },
  { id: '22', title: 'Gereksiz E-posta Silme', description: 'Gelen kutundaki gereksiz 100 e-postayı sil ve dijital dağınıklığını azalt.', level: 'C1', focus: 'mix' },

  // Genel (Mix)
  { id: '30', title: 'Esneklik Egzersizleri', description: '15 dakikalık temel esneme hareketlerini yap.', level: 'A1', focus: 'health' },
  { id: '31', title: '30 Dakika Odaklanma', description: 'Dikkatin dağılmadan tek bir işe 30 dakika odaklan (Pomodoro tekniği kullan).', level: 'B1', focus: 'mix' },
];

/**
 * Kullanıcının seviyesine ve odak alanına uygun görevleri filtreler.
 * Tip tanımlamaları kaldırıldı.
 */
export const filterChallenges = (level, focus) => {
  return CHALLENGES.filter(challenge => {
    const levelMatch = challenge.level === level;
    const focusMatch = challenge.focus === focus || challenge.focus === 'mix';
    return levelMatch && focusMatch;
  });
};