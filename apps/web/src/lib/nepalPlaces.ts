export interface NepalLocation {
  name: string;
  name_ne?: string;
  category: 'District' | 'City / Hub' | 'Relief Point' | 'Highway' | 'Checkpoint';
  province?: string;
  district?: string;
  description?: string;
}

export const NEPAL_PLACES: NepalLocation[] = [
  // ----------------------------------------------------
  // 1. BAGMATI PROVINCE (Major Crisis & Relief Corridors)
  // ----------------------------------------------------
  { name: 'Kathmandu', name_ne: 'काठमाडौँ', category: 'District', province: 'Bagmati Province' },
  { name: 'Kathmandu (Balkhu Relief Terminal)', name_ne: 'काठमाडौँ (बल्खु)', category: 'City / Hub', district: 'Kathmandu', province: 'Bagmati Province' },
  { name: 'Kathmandu (Kalanki Transit Hub)', name_ne: 'काठमाडौँ (कलङ्की)', category: 'City / Hub', district: 'Kathmandu', province: 'Bagmati Province' },
  { name: 'Kathmandu (Koteshwor Hub)', name_ne: 'काठमाडौँ (कोटेश्वर)', category: 'City / Hub', district: 'Kathmandu', province: 'Bagmati Province' },
  { name: 'Kathmandu (Gongabu New Buspark)', name_ne: 'काठमाडौँ (गोंगबु नयाँ बसपार्क)', category: 'City / Hub', district: 'Kathmandu', province: 'Bagmati Province' },
  { name: 'Kathmandu (Chabahil / Boudha)', name_ne: 'काठमाडौँ (चाबहिल)', category: 'City / Hub', district: 'Kathmandu', province: 'Bagmati Province' },
  { name: 'Kathmandu (Nagdhunga Checkpost)', name_ne: 'नागढुङ्गा चेकपोइन्ट', category: 'Checkpoint', district: 'Kathmandu', province: 'Bagmati Province' },

  { name: 'Lalitpur', name_ne: 'ललितपुर', category: 'District', province: 'Bagmati Province' },
  { name: 'Lalitpur (Patan / Pulchowk)', name_ne: 'ललितपुर (पाटन/पुलचोक)', category: 'City / Hub', district: 'Lalitpur', province: 'Bagmati Province' },
  { name: 'Lalitpur (Lagankhel / Satdobato)', name_ne: 'ललितपुर (लगनखेल/सातदोबाटो)', category: 'City / Hub', district: 'Lalitpur', province: 'Bagmati Province' },
  { name: 'Lalitpur (Godawari / Lele)', name_ne: 'ललितपुर (गोदावरी/लेले)', category: 'City / Hub', district: 'Lalitpur', province: 'Bagmati Province' },

  { name: 'Bhaktapur', name_ne: 'भक्तपुर', category: 'District', province: 'Bagmati Province' },
  { name: 'Bhaktapur (Jagati Checkpost)', name_ne: 'जगाती चेकपोइन्ट (भक्तपुर)', category: 'Checkpoint', district: 'Bhaktapur', province: 'Bagmati Province' },
  { name: 'Bhaktapur (Suryabinayak / Thimi)', name_ne: 'भक्तपुर (सूर्यविनायक/थिमी)', category: 'City / Hub', district: 'Bhaktapur', province: 'Bagmati Province' },

  { name: 'Sindhupalchok', name_ne: 'सिन्धुपाल्चोक', category: 'District', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Melamchi Bazar)', name_ne: 'मेलम्ची बजार (सिन्धुपाल्चोक)', category: 'Relief Point', district: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Helambu)', name_ne: 'हेलम्बु (सिन्धुपाल्चोक)', category: 'Relief Point', district: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Chautara)', name_ne: 'चौतारा (सिन्धुपाल्चोक)', category: 'City / Hub', district: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Barhabise)', name_ne: 'बाह्रबिसे (सिन्धुपाल्चोक)', category: 'Relief Point', district: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Tatopani / Kodari Border)', name_ne: 'तातोपानी / कोदारी (सिन्धुपाल्चोक)', category: 'Checkpoint', district: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Balephi / Jalbire)', name_ne: 'बलेफी / जलबिरे (सिन्धुपाल्चोक)', category: 'Relief Point', district: 'Sindhupalchok', province: 'Bagmati Province' },
  { name: 'Sindhupalchok (Sukute Beach Hub)', name_ne: 'सुकुटे (सिन्धुपाल्चोक)', category: 'City / Hub', district: 'Sindhupalchok', province: 'Bagmati Province' },

  { name: 'Kavrepalanchok', name_ne: 'काभ्रेपलाञ्चोक', category: 'District', province: 'Bagmati Province' },
  { name: 'Kavre (Dhulikhel Hub)', name_ne: 'धुलिखेल (काभ्रे)', category: 'City / Hub', district: 'Kavrepalanchok', province: 'Bagmati Province' },
  { name: 'Kavre (Banepa / Panauti)', name_ne: 'बनेपा / पनौती (काभ्रे)', category: 'City / Hub', district: 'Kavrepalanchok', province: 'Bagmati Province' },
  { name: 'Kavre (Dolalghat Transit Checkpoint)', name_ne: 'दोलालघाट ट्रान्जिट चेकपोइन्ट (काभ्रे)', category: 'Checkpoint', district: 'Kavrepalanchok', province: 'Bagmati Province' },
  { name: 'Kavre (Panchkhal)', name_ne: 'पाँचखाल (काभ्रे)', category: 'City / Hub', district: 'Kavrepalanchok', province: 'Bagmati Province' },
  { name: 'Kavre (Bhakundebesi / Nepalthok Route)', name_ne: 'भकुण्डेबेँसी (काभ्रे)', category: 'Relief Point', district: 'Kavrepalanchok', province: 'Bagmati Province' },

  { name: 'Dhading', name_ne: 'धादिङ', category: 'District', province: 'Bagmati Province' },
  { name: 'Dhading (Malekhu Checkpoint)', name_ne: 'मलेखु चेकपोइन्ट (धादिङ)', category: 'Checkpoint', district: 'Dhading', province: 'Bagmati Province' },
  { name: 'Dhading (Naubise Junction)', name_ne: 'नौबिसे जक्सन (धादिङ)', category: 'Checkpoint', district: 'Dhading', province: 'Bagmati Province' },
  { name: 'Dhading (Gajuri / Benighat)', name_ne: 'गजुरी / बेनीघाट (धादिङ)', category: 'City / Hub', district: 'Dhading', province: 'Bagmati Province' },
  { name: 'Dhading (Dhading Besi)', name_ne: 'धादिङ बेँसी', category: 'City / Hub', district: 'Dhading', province: 'Bagmati Province' },

  { name: 'Nuwakot', name_ne: 'नुवाकोट', category: 'District', province: 'Bagmati Province' },
  { name: 'Nuwakot (Bidur / Battar)', name_ne: 'विदुर / बट्टार (नुवाकोट)', category: 'City / Hub', district: 'Nuwakot', province: 'Bagmati Province' },
  { name: 'Nuwakot (Trisuli Bazar)', name_ne: 'त्रिशूली बजार (नुवाकोट)', category: 'City / Hub', district: 'Nuwakot', province: 'Bagmati Province' },
  { name: 'Nuwakot (Betrawati Junction)', name_ne: 'बेत्रावती (नुवाकोट)', category: 'Checkpoint', district: 'Nuwakot', province: 'Bagmati Province' },

  { name: 'Rasuwa', name_ne: 'रसुवा', category: 'District', province: 'Bagmati Province' },
  { name: 'Rasuwa (Dhunche Checkpoint)', name_ne: 'धुन्चे चेकपोइन्ट (रसुवा)', category: 'Checkpoint', district: 'Rasuwa', province: 'Bagmati Province' },
  { name: 'Rasuwa (Syaphrubesi / Rasuwagadhi)', name_ne: 'स्याफ्रुबेँसी / रसुवागढी (रसुवा)', category: 'Relief Point', district: 'Rasuwa', province: 'Bagmati Province' },

  { name: 'Dolakha', name_ne: 'दोलखा', category: 'District', province: 'Bagmati Province' },
  { name: 'Dolakha (Charikot)', name_ne: 'चरिकोट (दोलखा)', category: 'City / Hub', district: 'Dolakha', province: 'Bagmati Province' },
  { name: 'Dolakha (Jiri Relief Station)', name_ne: 'जिरी (दोलखा)', category: 'Relief Point', district: 'Dolakha', province: 'Bagmati Province' },

  { name: 'Ramechhap', name_ne: 'रामेछाप', category: 'District', province: 'Bagmati Province' },
  { name: 'Ramechhap (Manthali Hub)', name_ne: 'मन्थली (रामेछाप)', category: 'City / Hub', district: 'Ramechhap', province: 'Bagmati Province' },

  { name: 'Sindhuli', name_ne: 'सिन्धुली', category: 'District', province: 'Bagmati Province' },
  { name: 'Sindhuli (Sindhuli Madi)', name_ne: 'सिन्धुली माढी', category: 'City / Hub', district: 'Sindhuli', province: 'Bagmati Province' },
  { name: 'Sindhuli (Khurkot BP Highway Checkpoint)', name_ne: 'खूर्कोट चेकपोइन्ट (सिन्धुली)', category: 'Checkpoint', district: 'Sindhuli', province: 'Bagmati Province' },
  { name: 'Sindhuli (Nepalthok Junction)', name_ne: 'नेपालथोक जक्सन (सिन्धुली)', category: 'Checkpoint', district: 'Sindhuli', province: 'Bagmati Province' },

  { name: 'Makwanpur', name_ne: 'मकवानपुर', category: 'District', province: 'Bagmati Province' },
  { name: 'Makwanpur (Hetauda Industrial Hub)', name_ne: 'हेटौँडा (मकवानपुर)', category: 'City / Hub', district: 'Makwanpur', province: 'Bagmati Province' },
  { name: 'Makwanpur (Rapti Bridge / Buddha Chowk)', name_ne: 'राप्ती पुल चेकपोइन्ट (हेटौँडा)', category: 'Checkpoint', district: 'Makwanpur', province: 'Bagmati Province' },
  { name: 'Makwanpur (Daman / Palung)', name_ne: 'दामन / पालुङ (मकवानपुर)', category: 'Relief Point', district: 'Makwanpur', province: 'Bagmati Province' },

  { name: 'Chitwan', name_ne: 'चितवन', category: 'District', province: 'Bagmati Province' },
  { name: 'Chitwan (Bharatpur / Narayangarh)', name_ne: 'भरतपुर / नारायणगढ (चितवन)', category: 'City / Hub', district: 'Chitwan', province: 'Bagmati Province' },
  { name: 'Chitwan (Mugling Junction Checkpoint)', name_ne: 'मुग्लिन जक्सन चेकपोइन्ट (चितवन)', category: 'Checkpoint', district: 'Chitwan', province: 'Bagmati Province' },
  { name: 'Chitwan (Kurintar River Corridor)', name_ne: 'कुरिनटार (चितवन)', category: 'Checkpoint', district: 'Chitwan', province: 'Bagmati Province' },
  { name: 'Chitwan (Ratnanagar / Tandi)', name_ne: 'रत्ननगर / टाँडी (चितवन)', category: 'City / Hub', district: 'Chitwan', province: 'Bagmati Province' },
  { name: 'Chitwan (Madi Flood Zone)', name_ne: 'माडी (चितवन)', category: 'Relief Point', district: 'Chitwan', province: 'Bagmati Province' },

  // ----------------------------------------------------
  // 2. GANDAKI PROVINCE
  // ----------------------------------------------------
  { name: 'Kaski', name_ne: 'कास्की', category: 'District', province: 'Gandaki Province' },
  { name: 'Kaski (Pokhara Metropolitan / Prithvi Chowk)', name_ne: 'पोखरा (पृथ्वीचोक)', category: 'City / Hub', district: 'Kaski', province: 'Gandaki Province' },
  { name: 'Kaski (Pokhara Lakeside Hub)', name_ne: 'पोखरा (लेकसाइड)', category: 'City / Hub', district: 'Kaski', province: 'Gandaki Province' },
  { name: 'Kaski (Hemja Highway Checkpoint)', name_ne: 'हेम्जा चेकपोइन्ट (पोखरा)', category: 'Checkpoint', district: 'Kaski', province: 'Gandaki Province' },

  { name: 'Tanahun', name_ne: 'तनहुँ', category: 'District', province: 'Gandaki Province' },
  { name: 'Tanahun (Damauli)', name_ne: 'दमौली (तनहुँ)', category: 'City / Hub', district: 'Tanahun', province: 'Gandaki Province' },
  { name: 'Tanahun (Dumre / Bandipur)', name_ne: 'डुम्रे / बन्दिपुर (तनहुँ)', category: 'City / Hub', district: 'Tanahun', province: 'Gandaki Province' },
  { name: 'Tanahun (Khairenitar / Abukhaireni)', name_ne: 'आँबुखैरेनी (तनहुँ)', category: 'Checkpoint', district: 'Tanahun', province: 'Gandaki Province' },

  { name: 'Gorkha', name_ne: 'गोरखा', category: 'District', province: 'Gandaki Province' },
  { name: 'Gorkha (Gorkha Bazar)', name_ne: 'गोरखा बजार', category: 'City / Hub', district: 'Gorkha', province: 'Gandaki Province' },
  { name: 'Gorkha (Barpak / Laprak Relief Hub)', name_ne: 'बारपाक / लाप्राक (गोरखा)', category: 'Relief Point', district: 'Gorkha', province: 'Gandaki Province' },
  { name: 'Gorkha (Arughat Bazar)', name_ne: 'आरुघाट (गोरखा)', category: 'Relief Point', district: 'Gorkha', province: 'Gandaki Province' },

  { name: 'Lamjung', name_ne: 'लमजुङ', category: 'District', province: 'Gandaki Province' },
  { name: 'Lamjung (Besisahar)', name_ne: 'बेसीसहर (लमजुङ)', category: 'City / Hub', district: 'Lamjung', province: 'Gandaki Province' },

  { name: 'Syangja', name_ne: 'स्याङ्जा', category: 'District', province: 'Gandaki Province' },
  { name: 'Syangja (Putalibazar / Waling)', name_ne: 'पुतलीबजार / वालिङ (स्याङ्जा)', category: 'City / Hub', district: 'Syangja', province: 'Gandaki Province' },

  { name: 'Nawalpur (Nawalparasi East)', name_ne: 'नवलपुर', category: 'District', province: 'Gandaki Province' },
  { name: 'Nawalpur (Kawasoti / Gaindakot)', name_ne: 'कावासोती / गैँडाकोट (नवलपुर)', category: 'City / Hub', district: 'Nawalpur', province: 'Gandaki Province' },
  { name: 'Nawalpur (Daunne Hills Checkpoint)', name_ne: 'दाउन्ने चेकपोइन्ट (नवलपुर)', category: 'Checkpoint', district: 'Nawalpur', province: 'Gandaki Province' },

  { name: 'Baglung', name_ne: 'बागलुङ', category: 'District', province: 'Gandaki Province' },
  { name: 'Myagdi (Beni)', name_ne: 'बेनी (म्याग्दी)', category: 'District', province: 'Gandaki Province' },
  { name: 'Parbat (Kushma)', name_ne: 'कुश्मा (पर्वत)', category: 'District', province: 'Gandaki Province' },
  { name: 'Mustang (Jomsom)', name_ne: 'जोमसोम (मुस्ताङ)', category: 'District', province: 'Gandaki Province' },
  { name: 'Manang (Chame)', name_ne: 'चामे (मनाङ)', category: 'District', province: 'Gandaki Province' },

  // ----------------------------------------------------
  // 3. KOSHI PROVINCE (Eastern Flood Zones)
  // ----------------------------------------------------
  { name: 'Morang', name_ne: 'मोरङ', category: 'District', province: 'Koshi Province' },
  { name: 'Morang (Biratnagar Metropolitan)', name_ne: 'विराटनगर (मोरङ)', category: 'City / Hub', district: 'Morang', province: 'Koshi Province' },
  { name: 'Morang (Belbari / Urlabari)', name_ne: 'बेलबारी / उर्लाबारी (मोरङ)', category: 'City / Hub', district: 'Morang', province: 'Koshi Province' },

  { name: 'Sunsari', name_ne: 'सुनसरी', category: 'District', province: 'Koshi Province' },
  { name: 'Sunsari (Itahari Junction Hub)', name_ne: 'इटहरी जक्सन (सुनसरी)', category: 'City / Hub', district: 'Sunsari', province: 'Koshi Province' },
  { name: 'Sunsari (Dharan Sub-Metropolitan)', name_ne: 'धरान (सुनसरी)', category: 'City / Hub', district: 'Sunsari', province: 'Koshi Province' },
  { name: 'Sunsari (Koshi Barrage Checkpoint)', name_ne: 'कोशी ब्यारेज चेकपोइन्ट (सुनसरी)', category: 'Checkpoint', district: 'Sunsari', province: 'Koshi Province' },
  { name: 'Sunsari (Inaruwa)', name_ne: 'इनरुवा (सुनसरी)', category: 'City / Hub', district: 'Sunsari', province: 'Koshi Province' },

  { name: 'Jhapa', name_ne: 'झापा', category: 'District', province: 'Koshi Province' },
  { name: 'Jhapa (Birtamod Hub)', name_ne: 'बिर्तामोड (झापा)', category: 'City / Hub', district: 'Jhapa', province: 'Koshi Province' },
  { name: 'Jhapa (Damak)', name_ne: 'दमक (झापा)', category: 'City / Hub', district: 'Jhapa', province: 'Koshi Province' },
  { name: 'Jhapa (Kakarbhitta Border Terminal)', name_ne: 'काँकडभिट्टा चेकपोइन्ट (झापा)', category: 'Checkpoint', district: 'Jhapa', province: 'Koshi Province' },
  { name: 'Jhapa (Bhadrapur / Chandragadhi)', name_ne: 'भद्रपुर / चन्द्रगढी (झापा)', category: 'City / Hub', district: 'Jhapa', province: 'Koshi Province' },

  { name: 'Udayapur (Gaighat / Katari)', name_ne: 'उदयपुर (गाईघाट/कटारी)', category: 'District', province: 'Koshi Province' },
  { name: 'Ilam (Ilam Bazar)', name_ne: 'इलाम बजार', category: 'District', province: 'Koshi Province' },
  { name: 'Dhankuta (Hile / Dhankuta Bazar)', name_ne: 'धनकुटा / हिले', category: 'District', province: 'Koshi Province' },
  { name: 'Panchthar (Phidim)', name_ne: 'फिदिम (पाँचथर)', category: 'District', province: 'Koshi Province' },
  { name: 'Taplejung (Fungling)', name_ne: 'ताप्लेजुङ (फुङलिङ)', category: 'District', province: 'Koshi Province' },
  { name: 'Sankhuwasabha (Khandbari)', name_ne: 'खाँदबारी (सङ्खुवासभा)', category: 'District', province: 'Koshi Province' },
  { name: 'Solukhumbu (Salleri / Namche)', name_ne: 'सोलुखुम्बु (सल्लेरी)', category: 'District', province: 'Koshi Province' },
  { name: 'Okhaldhunga (Rumjatar)', name_ne: 'ओखलढुङ्गा', category: 'District', province: 'Koshi Province' },
  { name: 'Khotang (Diktel)', name_ne: 'खोटाङ (दिक्तेल)', category: 'District', province: 'Koshi Province' },
  { name: 'Bhojpur', name_ne: 'भोजपुर', category: 'District', province: 'Koshi Province' },
  { name: 'Terhathum (Myanglung)', name_ne: 'तेह्रथुम (म्याङलुङ)', category: 'District', province: 'Koshi Province' },

  // ----------------------------------------------------
  // 4. MADHESH PROVINCE (Flood Inundation Corridors)
  // ----------------------------------------------------
  { name: 'Dhanusha', name_ne: 'धनुषा', category: 'District', province: 'Madhesh Province' },
  { name: 'Dhanusha (Janakpurdham Sub-Metro)', name_ne: 'जनकपुरधाम (धनुषा)', category: 'City / Hub', district: 'Dhanusha', province: 'Madhesh Province' },
  { name: 'Dhanusha (Dhalkebar Junction Checkpoint)', name_ne: 'ढल्केबर जक्सन (धनुषा)', category: 'Checkpoint', district: 'Dhanusha', province: 'Madhesh Province' },

  { name: 'Mahottari', name_ne: 'महोत्तरी', category: 'District', province: 'Madhesh Province' },
  { name: 'Mahottari (Bardibas Highway Hub)', name_ne: 'बर्दिबास (महोत्तरी)', category: 'City / Hub', district: 'Mahottari', province: 'Madhesh Province' },
  { name: 'Mahottari (Jaleshwor Border)', name_ne: 'जलेश्वर (महोत्तरी)', category: 'City / Hub', district: 'Mahottari', province: 'Madhesh Province' },
  { name: 'Mahottari (Gaushala / Lalgadh)', name_ne: 'गौशाला / लालगढ (महोत्तरी)', category: 'Relief Point', district: 'Mahottari', province: 'Madhesh Province' },

  { name: 'Parsa', name_ne: 'पर्सा', category: 'District', province: 'Madhesh Province' },
  { name: 'Parsa (Birgunj Metropolitan / ICP Port)', name_ne: 'वीरगञ्ज (पर्सा)', category: 'City / Hub', district: 'Parsa', province: 'Madhesh Province' },

  { name: 'Bara', name_ne: 'बारा', category: 'District', province: 'Madhesh Province' },
  { name: 'Bara (Simara / Kalaiya)', name_ne: 'सिमरा / कलैया (बारा)', category: 'City / Hub', district: 'Bara', province: 'Madhesh Province' },
  { name: 'Bara (Nijgadh Fast Track Hub)', name_ne: 'निजगढ (बारा)', category: 'City / Hub', district: 'Bara', province: 'Madhesh Province' },
  { name: 'Bara (Pathlaiya Junction Checkpoint)', name_ne: 'पथलैया जक्सन चेकपोइन्ट (बारा)', category: 'Checkpoint', district: 'Bara', province: 'Madhesh Province' },

  { name: 'Rautahat', name_ne: 'रौतहट', category: 'District', province: 'Madhesh Province' },
  { name: 'Rautahat (Gaur Flood Relief Point)', name_ne: 'गौर (रौतहट)', category: 'Relief Point', district: 'Rautahat', province: 'Madhesh Province' },
  { name: 'Rautahat (Chandranigahapur / Chandrapur)', name_ne: 'चन्द्रनिगाहपुर (रौतहट)', category: 'City / Hub', district: 'Rautahat', province: 'Madhesh Province' },

  { name: 'Sarlahi', name_ne: 'सर्लाही', category: 'District', province: 'Madhesh Province' },
  { name: 'Sarlahi (Lalgadh / Malangwa / Harion)', name_ne: 'मलङ्गवा / हरिवन (सर्लाही)', category: 'City / Hub', district: 'Sarlahi', province: 'Madhesh Province' },
  { name: 'Sarlahi (Nawalpur Sarlahi Highway)', name_ne: 'नवलपुर (सर्लाही)', category: 'Checkpoint', district: 'Sarlahi', province: 'Madhesh Province' },

  { name: 'Siraha', name_ne: 'सिराहा', category: 'District', province: 'Madhesh Province' },
  { name: 'Siraha (Lahan / Mirchaiya)', name_ne: 'लहान / मिर्चैया (सिराहा)', category: 'City / Hub', district: 'Siraha', province: 'Madhesh Province' },

  { name: 'Saptari', name_ne: 'सप्तरी', category: 'District', province: 'Madhesh Province' },
  { name: 'Saptari (Rajbiraj / Rupanagar / Kanchanpur)', name_ne: 'राजविराज / कञ्चनपुर (सप्तरी)', category: 'City / Hub', district: 'Saptari', province: 'Madhesh Province' },

  // ----------------------------------------------------
  // 5. LUMBINI PROVINCE
  // ----------------------------------------------------
  { name: 'Rupandehi', name_ne: 'रुपन्देही', category: 'District', province: 'Lumbini Province' },
  { name: 'Rupandehi (Butwal Sub-Metropolitan)', name_ne: 'बुटवल (रुपन्देही)', category: 'City / Hub', district: 'Rupandehi', province: 'Lumbini Province' },
  { name: 'Rupandehi (Bhairahawa / Belahiya Border)', name_ne: 'भैरहवा / बेलहिया चेकपोइन्ट (रुपन्देही)', category: 'Checkpoint', district: 'Rupandehi', province: 'Lumbini Province' },
  { name: 'Rupandehi (Lumbini Sanskriti Hub)', name_ne: 'लुम्बिनी (रुपन्देही)', category: 'City / Hub', district: 'Rupandehi', province: 'Lumbini Province' },

  { name: 'Banke', name_ne: 'बाँके', category: 'District', province: 'Lumbini Province' },
  { name: 'Banke (Nepalgunj Sub-Metro / Jamunaha Border)', name_ne: 'नेपालगञ्ज (बाँके)', category: 'City / Hub', district: 'Banke', province: 'Lumbini Province' },
  { name: 'Banke (Kohalpur Major Highway Junction)', name_ne: 'कोहलपुर जक्सन चेकपोइन्ट (बाँके)', category: 'Checkpoint', district: 'Banke', province: 'Lumbini Province' },

  { name: 'Dang', name_ne: 'दाङ', category: 'District', province: 'Lumbini Province' },
  { name: 'Dang (Tulsipur / Ghorahi)', name_ne: 'तुलसीपुर / घोराही (दाङ)', category: 'City / Hub', district: 'Dang', province: 'Lumbini Province' },
  { name: 'Dang (Bhalubang Junction)', name_ne: 'भालुवाङ जक्सन (दाङ)', category: 'Checkpoint', district: 'Dang', province: 'Lumbini Province' },
  { name: 'Dang (Lamahi Highway Hub)', name_ne: 'लमही (दाङ)', category: 'City / Hub', district: 'Dang', province: 'Lumbini Province' },

  { name: 'Kapilvastu (Taulihawa / Chandrauta / Gorusinghe)', name_ne: 'तौलिहवा / चन्द्रौटा (कपिलवस्तु)', category: 'District', province: 'Lumbini Province' },
  { name: 'Palpa (Tansen / Ramdi)', name_ne: 'तानसेन (पाल्पा)', category: 'District', province: 'Lumbini Province' },
  { name: 'Bardiya (Gulariya / Bhurigaon / Chisapani)', name_ne: 'गुलरिया / चिसापानी (बर्दिया)', category: 'District', province: 'Lumbini Province' },
  { name: 'Gulmi (Tamghas)', name_ne: 'तम्घास (गुल्मी)', category: 'District', province: 'Lumbini Province' },
  { name: 'Arghakhanchi (Sandhikharka)', name_ne: 'सन्धिखर्क (अर्घाखाँची)', category: 'District', province: 'Lumbini Province' },
  { name: 'Pyuthan (Khalanga)', name_ne: 'प्युठान', category: 'District', province: 'Lumbini Province' },
  { name: 'Rolpa (Liwang)', name_ne: 'लिवाङ (रोल्पा)', category: 'District', province: 'Lumbini Province' },
  { name: 'Parasi (Nawalparasi West / Sunwal / Bardaghat)', name_ne: 'परासी / सुनवल / बर्दघाट', category: 'District', province: 'Lumbini Province' },
  { name: 'Eastern Rukum (Rukumkot)', name_ne: 'पूर्वी रुकुम', category: 'District', province: 'Lumbini Province' },

  // ----------------------------------------------------
  // 6. KARNALI PROVINCE (Remote Disaster & Relief Corridors)
  // ----------------------------------------------------
  { name: 'Surkhet', name_ne: 'सुर्खेत', category: 'District', province: 'Karnali Province' },
  { name: 'Surkhet (Birendranagar Provincial Command Hub)', name_ne: 'वीरेन्द्रनगर (सुर्खेत)', category: 'City / Hub', district: 'Surkhet', province: 'Karnali Province' },
  { name: 'Surkhet (Chhinchu Junction Checkpoint)', name_ne: 'छिन्चु जक्सन (सुर्खेत)', category: 'Checkpoint', district: 'Surkhet', province: 'Karnali Province' },

  { name: 'Jajarkot', name_ne: 'जाजरकोट', category: 'District', province: 'Karnali Province' },
  { name: 'Jajarkot (Khalanga / Rimna Relief Base)', name_ne: 'खलङ्गा / रिम्ना (जाजरकोट)', category: 'Relief Point', district: 'Jajarkot', province: 'Karnali Province' },
  { name: 'Jajarkot (Bheri River Corridor)', name_ne: 'भेरी नदी करिडोर (जाजरकोट)', category: 'Relief Point', district: 'Jajarkot', province: 'Karnali Province' },

  { name: 'Western Rukum', name_ne: 'पश्चिम रुकुम', category: 'District', province: 'Karnali Province' },
  { name: 'Western Rukum (Musikot / Chaurjahari Relief Hub)', name_ne: 'मुसिकोट / चौरजहारी (पश्चिम रुकुम)', category: 'Relief Point', district: 'Western Rukum', province: 'Karnali Province' },

  { name: 'Dailekh (Dullu / Narayan)', name_ne: 'दैलेख', category: 'District', province: 'Karnali Province' },
  { name: 'Salyan (Sreenagar / Khalanga)', name_ne: 'सल्यान', category: 'District', province: 'Karnali Province' },
  { name: 'Kalikot (Manma / Nagma)', name_ne: 'मान्म (कालिकोट)', category: 'District', province: 'Karnali Province' },
  { name: 'Jumla (Khalanga Bazar / Chandannath)', name_ne: 'जुम्ला खलङ्गा', category: 'District', province: 'Karnali Province' },
  { name: 'Mugu (Gamgadhi / Rara Relief Base)', name_ne: 'गमगढी (मुगु)', category: 'District', province: 'Karnali Province' },
  { name: 'Humla (Simikot)', name_ne: 'सिमिकोट (हुम्ला)', category: 'District', province: 'Karnali Province' },
  { name: 'Dolpa (Dunai / Juphal)', name_ne: 'दुने (डोल्पा)', category: 'District', province: 'Karnali Province' },

  // ----------------------------------------------------
  // 7. SUDURPASHCHIM PROVINCE (Far-Western Corridors)
  // ----------------------------------------------------
  { name: 'Kailali', name_ne: 'कैलाली', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Kailali (Dhangadhi Sub-Metropolitan)', name_ne: 'धनगढी (कैलाली)', category: 'City / Hub', district: 'Kailali', province: 'Sudurpashchim Province' },
  { name: 'Kailali (Attariya Major Highway Junction)', name_ne: 'अत्तरिया जक्सन चेकपोइन्ट (कैलाली)', category: 'Checkpoint', district: 'Kailali', province: 'Sudurpashchim Province' },
  { name: 'Kailali (Tikapur / Lamki)', name_ne: 'टीकापुर / लम्की (कैलाली)', category: 'City / Hub', district: 'Kailali', province: 'Sudurpashchim Province' },
  { name: 'Kailali (Karnali Chisapani Bridge Checkpoint)', name_ne: 'कर्णाली चिसापानी पुल चेकपोइन्ट', category: 'Checkpoint', district: 'Kailali', province: 'Sudurpashchim Province' },

  { name: 'Kanchanpur', name_ne: 'कञ्चनपुर', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Kanchanpur (Bhimdatta / Mahendranagar)', name_ne: 'महेन्द्रनगर (कञ्चनपुर)', category: 'City / Hub', district: 'Kanchanpur', province: 'Sudurpashchim Province' },
  { name: 'Kanchanpur (Gaddachowki Border)', name_ne: 'गड्डाचौकी चेकपोइन्ट (कञ्चनपुर)', category: 'Checkpoint', district: 'Kanchanpur', province: 'Sudurpashchim Province' },

  { name: 'Dadeldhura (Amargadhi / Syaule)', name_ne: 'डडेल्धुरा / स्याउले', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Doti (Dipayal Silgadhi)', name_ne: 'दिपायल सिलगढी (डोटी)', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Achham (Mangalsen / Sanfebagar Relief Base)', name_ne: 'मङ्गलसेन / साँफेबगर (अछाम)', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Baitadi (Dasharathchand / Patan)', name_ne: 'बैतडी', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Bajhang (Chainpur)', name_ne: 'चैनपुर (बझाङ)', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Bajura (Martadi)', name_ne: 'मार्तडी (बाजुरा)', category: 'District', province: 'Sudurpashchim Province' },
  { name: 'Darchula (Khalanga / Gokuleshwor)', name_ne: 'दार्चुला खलङ्गा', category: 'District', province: 'Sudurpashchim Province' },

  // ----------------------------------------------------
  // 8. NATIONAL HIGHWAYS & EMERGENCY CORRIDORS
  // ----------------------------------------------------
  {
    name: 'Prithvi Highway (Kathmandu - Naubise - Malekhu - Mugling - Damauli - Pokhara)',
    name_ne: 'पृथ्वी राजमार्ग (काठमाडौँ - नौबिसे - मुग्लिन - पोखरा)',
    category: 'Highway',
    description: 'National Highway H04 (200 km) - Primary Western & Gandaki Corridor',
  },
  {
    name: 'Araniko Highway (Kathmandu - Bhaktapur - Dhulikhel - Dolalghat - Barhabise - Kodari)',
    name_ne: 'अरनिको राजमार्ग (काठमाडौँ - धुलिखेल - दोलालघाट - बाह्रबिसे - कोदारी)',
    category: 'Highway',
    description: 'National Highway H03 (115 km) - Primary Northern Trade & Sindhupalchok Relief Corridor',
  },
  {
    name: 'BP Highway (Dhulikhel - Nepalthok - Khurkot - Sindhuli Madi - Bardibas)',
    name_ne: 'बीपी राजमार्ग (धुलिखेल - नेपालथोक - खूर्कोट - सिन्धुली - बर्दिबास)',
    category: 'Highway',
    description: 'National Highway H08 (160 km) - Alternative Eastern Highway via Hills',
  },
  {
    name: 'East-West / Mahendra Highway (Kakarbhitta - Itahari - Lahan - Hetauda - Butwal - Kohalpur - Dhangadhi - Gaddachowki)',
    name_ne: 'पूर्व-पश्चिम (महेन्द्र) राजमार्ग (काँकडभिट्टा - हेटौँडा - बुटवल - कोहलपुर - महेन्द्रनगर)',
    category: 'Highway',
    description: 'National Highway H01 (1,028 km) - National Arterial Backbone',
  },
  {
    name: 'Tribhuvan Highway (Kathmandu - Thankot - Naubise - Daman - Hetauda - Birgunj)',
    name_ne: 'त्रिभुवन राजपथ (काठमाडौँ - नौबिसे - दामन - हेटौँडा - वीरगञ्ज)',
    category: 'Highway',
    description: 'National Highway H02 (189 km) - Historic Valley to Terai Supply Arterial',
  },
  {
    name: 'Siddhartha Highway (Pokhara - Syangja - Waling - Tansen - Butwal - Bhairahawa - Belahiya)',
    name_ne: 'सिद्धार्थ राजमार्ग (पोखरा - स्याङ्जा - तानसेन - बुटवल - भैरहवा)',
    category: 'Highway',
    description: 'National Highway H10 (181 km) - Gandaki to Lumbini Trade & Relief Corridor',
  },
  {
    name: 'Karnali Highway (Surkhet / Birendranagar - Dailekh - Kalikot - Jumla)',
    name_ne: 'कर्णाली राजमार्ग (सुर्खेत - कालिकोट - जुम्ला)',
    category: 'Highway',
    description: 'National Highway H13 (232 km) - Critical Upper Karnali Access Route',
  },
  {
    name: 'Mid-Hill / Pushpalal Highway (Panchthar - Okhaldhunga - Khurkot - Chautara - Pokhara - Baglung - Rukum - Jajarkot - Baitadi)',
    name_ne: 'मध्यपहाडी (पुष्पलाल) लोकमार्ग',
    category: 'Highway',
    description: 'National Trunk Route (1,776 km) - Complete East-West Mountain Transit Corridor',
  },
  {
    name: 'Madan Bhandari Highway (Jhapa - Dharan - Gaighat - Sindhuli - Hetauda - Butwal - Surkhet)',
    name_ne: 'मदन भण्डारी राजमार्ग',
    category: 'Highway',
    description: 'Inner Terai Strategic Transit Corridor (1,200 km)',
  },
  {
    name: 'Postal / Hulaki Highway (Jhapa - Morang - Janakpur - Birgunj - Nepalgunj - Dhangadhi)',
    name_ne: 'हुलाकी राजमार्ग (तराई करिडोर)',
    category: 'Highway',
    description: 'Southern Terai Border Arterial (1,792 km)',
  },
  {
    name: 'Pasang Lhamu Highway (Kathmandu - Trisuli - Betrawati - Dhunche - Syaphrubesi - Rasuwagadhi)',
    name_ne: 'पासाङ ल्हामु राजमार्ग (काठमाडौँ - त्रिशूली - धुन्चे - रसुवागढी)',
    category: 'Highway',
    description: 'Northern Frontier Rasuwa Crisis Route',
  },
  {
    name: 'Koshi Highway (Rani Biratnagar - Itahari - Dharan - Dhankuta - Hile - Khandbari)',
    name_ne: 'कोशी राजमार्ग (विराटनगर - इटहरी - धरान - धनकुटा - खाँदबारी)',
    category: 'Highway',
    description: 'National Highway H08 North-South River Basin Corridor',
  },
  {
    name: 'Mechi Highway (Kechana - Bhadrapur - Ilam - Phidim - Taplejung)',
    name_ne: 'मेची राजमार्ग (झापा - इलाम - फिदिम - ताप्लेजुङ)',
    category: 'Highway',
    description: 'National Highway H07 Eastern Hill Arterial (268 km)',
  },
  {
    name: 'Mahakali Highway (Dhangadhi - Attariya - Dadeldhura - Baitadi - Darchula)',
    name_ne: 'महाकाली राजमार्ग (धनगढी - डडेल्धुरा - बैतडी - दार्चुला)',
    category: 'Highway',
    description: 'National Highway H15 Far-Western Border Mountain Corridor (325 km)',
  },
  {
    name: 'Kathmandu-Terai Fast Track Corridor (Kathmandu - Sisneri - Nijgadh)',
    name_ne: 'काठमाडौँ-तराई द्रुतमार्ग करिडोर',
    category: 'Highway',
    description: 'Emergency Rapid Dispatch Route to Southern Plains',
  },
];

// Helper to filter locations by search term
export function searchNepalPlaces(
  query: string,
  categories?: NepalLocation['category'][],
  limit: number = 8
): NepalLocation[] {
  if (!query || !query.trim()) {
    if (categories && categories.length > 0) {
      return NEPAL_PLACES.filter((p) => categories.includes(p.category)).slice(0, limit);
    }
    return NEPAL_PLACES.slice(0, limit);
  }

  const q = query.trim().toLowerCase();

  return NEPAL_PLACES.filter((place) => {
    if (categories && categories.length > 0 && !categories.includes(place.category)) {
      return false;
    }

    const nameMatch = place.name.toLowerCase().includes(q);
    const neMatch = place.name_ne ? place.name_ne.includes(query.trim()) : false;
    const districtMatch = place.district ? place.district.toLowerCase().includes(q) : false;
    const provinceMatch = place.province ? place.province.toLowerCase().includes(q) : false;
    const descMatch = place.description ? place.description.toLowerCase().includes(q) : false;

    return nameMatch || neMatch || districtMatch || provinceMatch || descMatch;
  }).slice(0, limit);
}
