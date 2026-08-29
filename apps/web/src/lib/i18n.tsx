import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Locale = 'ne' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  ne: {
    // App identity & Header
    'app.title': 'राहत सवारी ई-पास प्रणाली',
    'app.subtitle': 'नेपाल सरकार',
    'app.dept': 'नेपाल सरकार | विपद् प्रतिकार्य तथा राहत समन्वय प्रणाली',
    'app.description': 'बाढी/विपद् प्रतिकार्य सवारी ई-पास तथा मार्ग समन्वय पोर्टल',
    'nav.brand': 'नेपाल सरकार राहत ई-पास पोर्टल',

    // Navigation
    'nav.home': 'गृहपृष्ठ',
    'nav.apply': 'ई-पास आवेदन',
    'nav.track': 'स्थिति जाँच',
    'nav.roads': 'सडक स्थिति',
    'nav.verify': 'पास प्रमाणीकरण',
    'nav.admin': 'कमाण्ड सेन्टर',
    'nav.coordination': 'प्रत्यक्ष समन्वय',
    'nav.audit': 'अडिट लग',
    'lang.ne': 'नेपाली',
    'lang.en': 'English',

    // Emergency Notice
    'home.notice': 'अत्यन्त जरुरी सूचना',
    'home.notice.text': 'बाढी तथा पहिरो प्रभावित क्षेत्रमा सञ्चालन हुने सम्पूर्ण राहत, उद्धार तथा अत्यावश्यक स्वास्थ्य सामग्री ढुवानी सवारीसाधनका लागि डिजिटल ई-पास अनिवार्य गरिएको छ।',

    // Hero Section
    'home.hero.badge': 'नेपाल सरकार | बाढी प्रतिकार्य आपतकालीन डेस्क',
    'home.hero.title': 'विपद् प्रतिकार्य सवारी ई-पास तथा समन्वय प्रणाली',
    'home.hero.subtitle': 'प्रभावित जिल्लाहरूमा तत्काल राहत, उद्धार टोली, र स्वास्थ्य सामग्री ढुवानीलाई सहज र व्यवस्थित बनाउन नेपाल सरकारको आधिकारिक ई-पास पोर्टल।',
    'home.hero.desc': 'प्रभावित जिल्लाहरूमा तत्काल राहत, उद्धार टोली, र स्वास्थ्य सामग्री ढुवानीलाई सहज र व्यवस्थित बनाउन नेपाल सरकारको आधिकारिक ई-पास पोर्टल।',
    'home.hero.applyBtn': 'नयाँ ई-पास आवेदन गर्नुहोस्',
    'home.hero.cta_apply': 'नयाँ ई-पास आवेदन गर्नुहोस्',
    'home.hero.trackBtn': 'आवेदनको स्थिति हेर्नुहोस्',
    'home.hero.cta_track': 'आवेदनको स्थिति हेर्नुहोस्',
    'home.hero.roadsBtn': 'राजमार्ग स्थिति नक्सा',

    // Live Metrics
    'home.stats.activePasses': 'सक्रिय ई-पास',
    'home.stats.active': 'सक्रिय ई-पास',
    'home.stats.approved': 'स्वीकृत ढुवानी',
    'home.stats.scans': 'चेकपोइन्ट स्क्यान',
    'home.stats.checkpoints': 'चेकपोइन्ट स्क्यान',
    'home.stats.roads': 'राजमार्ग अद्यावधिक',

    // Access Cards
    'home.roads.title': 'सडक तथा राजमार्ग अवस्था',
    'home.roads.desc': 'पहिरो र बाढीका कारण अवरुद्ध वा खुला रहेका प्रमुख राजमार्गहरूको ताजा विवरण।',
    'home.roads.liveUpdates': 'प्रत्यक्ष अद्यावधिक',
    'home.verify.title': 'चेकपोइन्ट पास स्क्यान',
    'home.verify.desc': 'सुरक्षाकर्मी तथा चेकपोइन्ट अधिकारीद्वारा QR कोड स्क्यान गरी डिजिटल पास प्रमाणीकरण।',

    // Clearance guidelines
    'home.guidelines.title': 'सवारी पास प्राथमिकता निर्देशिका',
    'home.guidelines.subtitle': 'विपद् क्षेत्रमा सवारी आवागमनको वर्गीकरण तथा प्रमाणीकरण स्तर',
    'home.guidelines.criticalTitle': 'अत्यावश्यक (P1: Critical)',
    'home.guidelines.criticalVehicles': 'एम्बुलेन्स, खोजी तथा उद्धार टोली, चिकित्सक टोली',
    'home.guidelines.criticalClearance': 'तत्काल स्वचालित क्लियरेन्स (शून्य प्रतीक्षा)',
    'home.guidelines.highTitle': 'उच्च प्राथमिकता (P2: High)',
    'home.guidelines.highVehicles': 'औषधि, रगत, अक्सिजन, अत्यावश्यक स्वास्थ्य सामग्री',
    'home.guidelines.highClearance': 'प्राथमिक करिडोर रुट तथा द्रुत मार्ग',
    'home.guidelines.mediumTitle': 'सामान्य प्राथमिकता (P3: Medium)',
    'home.guidelines.mediumVehicles': 'खाद्यान्न, पिउने पानी, राहत सामग्री, भारी उपकरण',
    'home.guidelines.mediumClearance': 'समन्वयित रुट तथा तोकिएको समय तालिका',

    // Apply Form Wizard
    'apply.title': 'राहत सवारी ई-पास आवेदन फाराम',
    'apply.subtitle': 'कृपया सवारी, चालक तथा ढुवानी गरिने सामग्रीको सही विवरण भर्नुहोस्',
    'apply.step1': '१. निवेदक तथा संस्था',
    'apply.step2': '२. सवारी तथा चालक विवरण',
    'apply.step3': '३. यात्रा तथा मार्ग विवरण',
    'apply.step4': '४. सामग्री तथा उद्देश्य',
    'apply.name': 'निवेदकको पूरा नाम',
    'apply.phone': 'सम्पर्क मोबाइल नम्बर',
    'apply.email': 'इमेल ठेगाना',
    'apply.org': 'संस्था वा समूहको नाम',
    'apply.orgType': 'संस्थाको प्रकार',
    'apply.orgId': 'दर्ता नम्बर / परिचयपत्र नं (ऐच्छिक)',
    'apply.vehicleNo': 'सवारी दर्ता नम्बर (उदा: बा २ ख १२३४)',
    'apply.vehicleType': 'सवारी साधनको प्रकार',
    'apply.vehicleOwner': 'सवारी धनी / संस्था',
    'apply.driverName': 'चालकको पूरा नाम',
    'apply.driverPhone': 'चालकको मोबाइल नम्बर',
    'apply.passengerCount': 'सवार व्यक्ति संख्या',
    'apply.vehicleCapacity': 'सवारी क्षमता / टन',
    'apply.emergencyContact': '२४/७ आकस्मिक सम्पर्क नम्बर',
    'apply.from': 'प्रस्थान स्थान (जिल्ला/नगरपालिका)',
    'apply.to': 'गन्तव्य स्थान (जिल्ला/राहत वितरण क्षेत्र)',
    'apply.checkpoints': 'मध्यवर्ती चेकपोइन्टहरू (कमा छुट्याएर)',
    'apply.departure': 'प्रस्थान मिति तथा समय',
    'apply.return': 'फिर्ता हुने अनुमानित समय',
    'apply.route': 'प्रस्तावित राजमार्ग / करिडोर',
    'apply.purpose': 'यात्रा तथा मिसनको मुख्य उद्देश्य',
    'apply.cargo': 'सामग्रीको मुख्य वर्ग',
    'apply.cargoDetails': 'सामग्रीको विस्तृत विवरण (परिमाण सहित)',
    'apply.isEmergency': 'यो आकस्मिक जीवन रक्षा सम्बन्धी मिसन हो',
    'apply.submit': 'आवेदन पेश गर्नुहोस्',
    'apply.submitting': 'आवेदन पेश हुँदैछ...',
    'apply.next': 'अर्को चरण',
    'apply.prev': 'अघिल्लो चरण',

    // Apply Form Placeholders
    'apply.placeholderName': 'उदा: डा. राम शर्मा',
    'apply.placeholderPhone': '९८XXXXXXXX',
    'apply.placeholderEmail': 'relief@redcross.org.np',
    'apply.placeholderEmergencyContact': '२४/७ आकस्मिक नम्बर (९८XXXXXXXX)',
    'apply.placeholderOrg': 'उदा: नेपाल रेडक्रस सोसाइटी',
    'apply.placeholderVehicleNo': 'उदा: बा २ ख १२३४ वा बा.प्र. ०१-००२ ख ९९९९',
    'apply.placeholderDriverName': 'चालकको पूरा नाम',
    'apply.placeholderDriverPhone': 'चालकको मोबाइल नम्बर (९८XXXXXXXX)',
    'apply.placeholderCapacity': 'उदा: ५ टन / १० सिट',
    'apply.placeholderFrom': 'उदा: काठमाडौँ (बल्खु)',
    'apply.placeholderTo': 'उदा: सिन्धुपाल्चोक (मेलम्ची)',
    'apply.placeholderRoute': 'उदा: अरनिको राजमार्ग -> जिरो किलो -> चौतारा',
    'apply.placeholderCheckpoints': 'उदा: जगाती, दोलालघाट, बन्देउ',
    'apply.placeholderCargoDetails': 'उदा: २०० बोरा चामल, ५० कार्टुन जीवनजल, १०० थान त्रिपाल, प्राथमिक उपचार किट',
    'apply.placeholderPurpose': 'उदा: बाढी प्रभावित परिवारहरूलाई आपतकालीन खाद्यान्न र स्वास्थ्य सामग्री वितरण',

    // Validation Errors
    'apply.errApplicantName': 'कृपया निवेदकको पूरा नाम प्रविष्ट गर्नुहोस्',
    'apply.errPhone': 'कृपया सम्पर्क नम्बर प्रविष्ट गर्नुहोस्',
    'apply.errOrg': 'कृपया संस्थाको नाम प्रविष्ट गर्नुहोस्',
    'apply.errVehicleNo': 'कृपया सवारी दर्ता नम्बर प्रविष्ट गर्नुहोस्',
    'apply.errDriverName': 'कृपया चालकको नाम प्रविष्ट गर्नुहोस्',
    'apply.errDriverPhone': 'कृपया चालकको फोन नम्बर प्रविष्ट गर्नुहोस्',
    'apply.errFrom': 'कृपया प्रस्थान स्थान प्रविष्ट गर्नुहोस्',
    'apply.errTo': 'कृपया गन्तव्य स्थान प्रविष्ट गर्नुहोस्',
    'apply.errRoute': 'कृपया प्रस्तावित मार्ग प्रविष्ट गर्नुहोस्',
    'apply.errPurpose': 'कृपया यात्राको उद्देश्य प्रविष्ट गर्नुहोस्',
    'apply.errCargo': 'कृपया सामग्रीको विवरण प्रविष्ट गर्नुहोस्',
    'apply.errSubmit': 'त्रुटि: आवेदन पेश गर्न सकिएन',

    // Application submitted
    'applied.title': 'आवेदन दर्ता भयो',
    'applied.desc': 'तपाईंको ई-पास आवेदन सरकारी प्रणालीमा दर्ता भएको छ। स्वीकृतिपछि पास जारी हुन्छ। स्थिति जाँच गर्न तलको कोड सुरक्षित राख्नुहोस्।',
    'applied.idLabel': 'ट्रयाकिङ कोड',
    'applied.idHint': 'स्थिति जाँच पृष्ठमा यही कोड प्रविष्ट गर्नुहोस्। पास जारी भएपछि यही कोडले QR कार्ड खोल्छ।',
    'applied.advisoryTitle': 'यात्रा अघि',
    'applied.advisory': 'चेकपोइन्टमा डिजिटल QR पास अनिवार्य छ। पास जारी भएको पुष्टि नभई सवारी नचलाउनुहोस्।',
    'applied.copy': 'कपी',
    'applied.copied': 'कपी भयो',

    // Track Application
    'track.title': 'ई-पास आवेदन स्थिति',
    'track.subtitle': 'आवेदनपछि पाएको ट्रयाकिङ कोड प्रविष्ट गर्नुहोस्',
    'track.placeholder': 'ट्रयाकिङ कोड (उदा: EP-20260829-0DE4)',
    'track.search': 'स्थिति हेर्नुहोस्',
    'track.searching': 'खोजी हुँदैछ...',
    'track.codeLabel': 'ट्रयाकिङ कोड',
    'track.storedLabel': 'यस उपकरणमा सुरक्षित आवेदन',
    'track.notFound': 'आवेदन फेला परेन',
    'track.notFoundHint': 'कोड ठीक छ कि छैन जाँच गर्नुहोस्। कोड EP- बाट सुरु हुन्छ।',
    'track.redirecting': 'ई-पास तयार छ। QR कार्ड खोलिँदैछ…',
    'track.pendingHint': 'प्रशासनले पास जारी गरेपछि यही कोडले QR कार्ड खोल्छ।',
    'track.openPass': 'ई-पास कार्ड खोल्नुहोस्',
    'track.vehicle': 'गाडी नम्बर',
    'track.driver': 'चालक',
    'track.route': 'प्रस्थान → गन्तव्य',
    'track.cargo': 'सामग्री',
    'track.unauthTitle': 'पहुँच प्रतिबन्धित | प्रमाणीकरण आवश्यक',
    'track.unauthDesc': 'सवारी आवागमन तथा ई-पास स्थिति सुरक्षा र गोपनीयताका कारण सुरक्षित गरिएको छ। यो पृष्ठ केवल वैध आवेदन भएका निवेदक वा अधिकृत सुरक्षा अधिकारीहरूका लागि मात्र उपलब्ध छ।',
    'track.status.submitted': 'दर्ता भएको (Submitted)',
    'track.status.under_review': 'प्रशासनिक समीक्षामा',
    'track.status.approved': 'स्वीकृत (Approved)',
    'track.status.issued': 'ई-पास जारी (Issued)',
    'track.status.rejected': 'अस्वीकृत (Rejected)',
    'track.status.revoked': 'खारेज गरिएको (Revoked)',
    'viewpass.notFound': 'ई-पास फेला परेन',
    'viewpass.notFoundHint': 'पास अझै जारी भएको छैन, वा कोड मिलेन।',
    'viewpass.back': 'फर्कनुहोस्',
    'viewpass.home': 'गृहपृष्ठमा फर्कनुहोस्',
    'viewpass.print': 'प्रिन्ट गर्नुहोस्',
    'viewpass.share': 'साझा गर्नुहोस्',
    'viewpass.shared': 'लिङ्क कपी भयो',
    'viewpass.active': 'सक्रिय',
    'viewpass.scanHint': 'चेकपोइन्टमा स्क्यान गरी प्रमाणित गर्नुहोस्',

    // Status mapping
    'status.all': 'सबै (All)',
    'status.submitted': 'दर्ता भएको (Submitted)',
    'status.under_review': 'प्रशासनिक समीक्षामा (Under Review)',
    'status.info_requested': 'थप विवरण माग गरिएको (Info Requested)',
    'status.approved': 'स्वीकृत (Approved)',
    'status.issued': 'ई-पास जारी (Issued)',
    'status.active': 'सक्रिय ई-पास (Active)',
    'status.completed': 'सम्पन्न (Completed)',
    'status.rejected': 'अस्वीकृत (Rejected)',
    'status.held': 'होल्डमा (Held)',
    'status.revoked': 'खारेज (Revoked)',
    'status.expired': 'म्याद सकिएको (Expired)',

    // Priorities
    'priority.critical': 'अत्यावश्यक (P1: Critical)',
    'priority.high': 'उच्च (P2: High)',
    'priority.medium': 'मध्यम (P3: Medium)',
    'priority.normal': 'सामान्य (P4: Normal)',

    // Road Conditions
    'roads.title': 'राजमार्ग तथा सडक अवस्था अनुगमन',
    'roads.subtitle': 'बाढी, पहिरो तथा अवरोध सम्बन्धी प्रत्यक्ष सुरक्षा सूचना',
    'roads.addBtn': '+ सडक अवस्था थप्नुहोस्',
    'roads.addModalTitle': 'नयाँ सडक अवस्था प्रतिवेदन दर्ता',
    'roads.roadNameLabel': 'राजमार्ग वा सडक खण्डको नाम',
    'roads.statusLabel': 'सडक सञ्चालन अवस्था',
    'roads.descLabel': 'विस्तृत विवरण तथा सुरक्षा निर्देशन',
    'roads.submitBtn': 'सडक प्रतिवेदन सुरक्षित गर्नुहोस्',
    'roads.status.open': 'खुला (Open)',
    'roads.status.restricted': 'एकतर्फी / जोखिमयुक्त (Restricted)',
    'roads.status.emergency_only': 'आपतकालीन राहत मात्र (Emergency Only)',
    'roads.status.closed': 'पूर्ण बन्द (Closed)',
    'roads.statusOpen': 'खुला (Open)',
    'roads.statusRestricted': 'एकतर्फी / जोखिमयुक्त (Restricted)',
    'roads.statusEmergency': 'आपतकालीन राहत मात्र (Emergency Only)',
    'roads.statusClosed': 'पूर्ण बन्द (Closed)',
    'roads.filter.all': 'सबै सडकहरू',
    'roads.filter.open': 'खुला',
    'roads.filter.restricted': 'एकतर्फी / जोखिमयुक्त',
    'roads.filter.closed': 'पूर्ण बन्द',
    'roads.searchPlaceholder': 'राजमार्ग वा स्थान खोज्नुहोस्...',
    'roads.noAlerts': 'हाल कुनै सडक अवरोध सूचना दर्ता गरिएको छैन',

    // Scanner / Verification
    'scanner.title': 'चेकपोइन्ट QR प्रमाणीकरण स्क्यानर',
    'scanner.subtitle': 'सवारी पासको आधिकारिकता तत्काल जाँच गर्नुहोस्',
    'scanner.checkpointLocation': 'चेकपोइन्ट स्थान',
    'scanner.officerName': 'जाँच अधिकारीको नाम',
    'scanner.cameraError': 'क्यामरा खोल्न सकिएन। कृपया क्यामरा अनुमति दिनुहोस् वा तस्बिर अपलोड गर्नुहोस्।',

    // Admin Login & Dashboard
    'admin.dept': 'नेपाल सरकार | गृह मन्त्रालय',
    'admin.title': 'सुरक्षा तथा कमाण्ड नियन्त्रण कक्ष',
    'admin.subtitle': 'नेपाल सरकार | आपतकालीन राहत सवारी समन्वय तथा ई-पास नियन्त्रण कक्ष',
    'admin.login': 'प्रशासन तथा कमाण्ड सेन्टर लगइन',
    'admin.subTitle': 'सुरक्षा जाँच तथा समन्वय अधिकारी प्रमाणीकरण पोर्टल',
    'admin.username': 'प्रयोगकर्ता नाम (Username)',
    'admin.password': 'पासवर्ड (Password)',
    'admin.loginBtn': 'लगइन गर्नुहोस् (Sign In)',
    'admin.loggingIn': 'प्रमाणीकरण हुँदैछ...',
    'admin.securityAdvisory': 'अधिकृत पहुँच क्षेत्र (Authorized Personnel Only)',
    'admin.securityWarning': 'अनधिकृत पहुँचको प्रयास कानून बमोजिम दण्डनीय हुनेछ। सबै कार्यहरू अडिट लगमा सुरक्षित गरिन्छन्।',
    'admin.usernamePlaceholder': 'उदा: superadmin वा officer_dolalghat',
    'admin.passwordPlaceholder': '••••••••••••',
    'admin.authFailed': 'प्रमाणीकरण असफल भयो। प्रयोगकर्ता नाम वा पासवर्ड जाँच्नुहोस्।',
    'admin.dashboard': 'कमाण्ड सेन्टर (Admin Hub)',
    'admin.logout': 'लगआउट (Sign Out)',
    'admin.issueRequired': 'ई-पास जारी नभएसम्म यो आवेदन बन्द गर्न मिल्दैन।',
    'admin.close': 'बन्द गर्नुहोस्',
    'admin.review': 'समीक्षा गर्नुहोस् (Review)',
    'admin.overview': 'कमाण्ड सिंहावलोकन',
    'admin.coordination': 'प्रत्यक्ष समन्वय म्याट्रिक्स',
    'admin.auditLogs': 'सुरक्षा अडिट लगहरू',
    'admin.applications': 'ई-पास आवेदनहरू',
    'admin.checkpoints': 'चेकपोइन्ट स्टेसनहरू',
    'admin.users': 'सदस्य तथा सुरक्षा अधिकारी',
    'admin.roads': 'सडक तथा राजमार्ग अवस्था',
    'admin.scanner': 'QR प्रमाणीकरण स्क्यानर',
    'admin.track': 'आवेदन स्थिति ट्रयाकिङ',
    'admin.approve': 'स्वीकृत गर्नुहोस् (Approve)',
    'admin.issue': 'ई-पास जारी गर्नुहोस् (Issue Pass)',
    'admin.reject': 'अस्वीकृत गर्नुहोस् (Reject)',
    'admin.revoke': 'खारेज गर्नुहोस् (Revoke Pass)',
    'admin.hold': 'होल्डमा राख्नुहोस् (Hold)',
    'admin.requestInfo': 'थप विवरण माग्नुहोस् (Request Info)',
    'admin.viewDetails': 'पूर्ण विवरण (View Manifest)',
    'admin.manifest': 'सवारी तथा राहत सामग्री घोषणापत्र',
    'admin.actions': 'कार्यहरू (Actions)',
    'admin.status': 'अवस्था (Status)',
    'admin.priority': 'प्राथमिकता (Priority)',
    'admin.cargo': 'सामग्री (Cargo)',
    'admin.route': 'रुट तथा गन्तव्य',
    'admin.vehicle': 'सवारी तथा चालक',
    'admin.applicant': 'निवेदक तथा संस्था',
    'admin.all': 'सबै (All)',
    'admin.refresh': 'ताजा गर्नुहोस्',
    'admin.searchPlaceholder': 'खोज्नुहोस् (ID, सवारी, संस्था, रुट)...',
    'admin.filterPriority': 'सबै प्राथमिकता',
    'admin.noData': 'कुनै रेकर्ड फेला परेन। (No records found)',
    'admin.groupOperations': 'राहत तथा पास कार्यसञ्चालन',
    'admin.groupInfrastructure': 'पूर्वाधार तथा स्टेसनहरू',
    'admin.groupSecurity': 'सुरक्षा, अडिट तथा समन्वय',
    'admin.tabAllPasses': 'सबै आवेदन तथा ई-पास',
    'admin.tabVerify': 'ई-पास प्रमाणीकरण तथा स्क्यान',
    'admin.tabTrack': 'आवेदन स्थिति ट्रयाकिङ',
    'admin.tabRoads': 'सडक तथा राजमार्ग अवस्था',
    'admin.tabCheckpoints': 'चेकपोइन्ट स्टेसनहरू',
    'admin.tabUsers': 'सदस्य तथा सुरक्षा अधिकारी',
    'admin.metricTotalApplied': 'कुल दर्ता आवेदन',
    'admin.metricUrgentPriority': 'अति आवश्यक (P1: Critical)',
    'admin.metricActivePasses': 'सक्रिय ई-पास',
    'admin.metricRejected': 'अस्वीकृत / खारेज',
    'admin.metricPending': 'समीक्षा पर्खिरहेका',
    'admin.metricCheckpoints': 'सक्रिय चेकपोइन्टहरू',
    'admin.metricRoadAlerts': 'सडक अवरोध सूचनाहरू',
    'admin.addCheckpoint': '+ नयाँ चेकपोइन्ट थप्नुहोस्',
    'admin.stationName': 'चेकपोइन्ट स्टेसनको नाम',
    'admin.stationLocation': 'स्थान / खण्ड',
    'admin.stationDistrict': 'जिल्ला',
    'admin.stationHighway': 'राजमार्ग / रुट',
    'admin.createStationBtn': 'चेकपोइन्ट दर्ता गर्नुहोस्',
    'admin.officerFullName': 'अधिकारीको पूरा नाम',
    'admin.assignedStation': 'खटाइएको चेकपोइन्ट स्टेसन',
    'admin.addMember': '+ नयाँ सदस्य थप्नुहोस् (Add Member)',
    'admin.role': 'जिम्मेवारी प्रकार (Role)',
    'admin.badge': 'ब्याज / दर्जा नं',
    'admin.phone': 'सम्पर्क फोन',
    'admin.createMemberBtn': 'सदस्य खाता सिर्जना गर्नुहोस्',

    // Footer
    'footer.services': 'सेवाहरू',
    'footer.hotlines': 'आपतकालीन हटलाइनहरू',
    'footer.tollFree': 'राहत समन्वय टोल फ्री',
    'footer.floodWarning': 'बाढी पूर्वसूचना',
    'footer.policeAmbulance': 'प्रहरी / एम्बुलेन्स',
    'footer.phone1149': '११४९',
    'footer.phone1155': '११५५',
    'footer.phone100_102': '१०० / १०२',
    'footer.copyright': 'सर्वाधिकार सुरक्षित',
    'footer.powered': 'नेपाल सरकार',
    'footer.location': 'सिंहदरबार, काठमाडौँ, नेपाल',
    'footer.gateway': 'नेपाल बाढी प्रतिकार्य ई-पास पोर्टल',
  },
  en: {
    // App identity & Header
    'app.title': 'Relief Vehicle E-Pass System',
    'app.subtitle': 'Government of Nepal',
    'app.dept': 'Government of Nepal | Disaster Response & Relief Coordination',
    'app.description': 'Flood & Disaster Response Vehicle E-Pass & Route Coordination Portal',
    'nav.brand': 'Government of Nepal Relief E-Pass Portal',

    // Navigation
    'nav.home': 'Home',
    'nav.apply': 'Apply E-Pass',
    'nav.track': 'Track Status',
    'nav.roads': 'Road Conditions',
    'nav.verify': 'Verify Pass',
    'nav.admin': 'Command Center',
    'nav.coordination': 'Live Coordination',
    'nav.audit': 'Audit Logs',
    'lang.ne': 'नेपाली',
    'lang.en': 'English',

    // Emergency Notice
    'home.notice': 'Emergency Advisory',
    'home.notice.text': 'A verified digital E-Pass is mandatory for all relief, rescue, and essential medical transport vehicles operating in disaster-declared zones.',

    // Hero Section
    'home.hero.badge': 'Government of Nepal | Disaster Response Emergency Desk',
    'home.hero.title': 'Disaster Response Vehicle E-Pass & Fleet Coordination',
    'home.hero.subtitle': 'Official portal of the Government of Nepal to streamline relief transit, rescue missions, and medical supply corridors during flood emergencies.',
    'home.hero.desc': 'Official portal of the Government of Nepal to streamline relief transit, rescue missions, and medical supply corridors during flood emergencies.',
    'home.hero.applyBtn': 'Apply for Movement Pass',
    'home.hero.cta_apply': 'Apply for Movement Pass',
    'home.hero.trackBtn': 'Track Existing Application',
    'home.hero.cta_track': 'Track Existing Application',
    'home.hero.roadsBtn': 'Highway Clearance Map',

    // Live Metrics
    'home.stats.activePasses': 'Active E-Passes',
    'home.stats.active': 'Active E-Passes',
    'home.stats.approved': 'Approved Missions',
    'home.stats.scans': 'Checkpoint Scans',
    'home.stats.checkpoints': 'Checkpoint Scans',
    'home.stats.roads': 'Highway Advisories',

    // Access Cards
    'home.roads.title': 'Road & Highway Status',
    'home.roads.desc': 'Live highway closure updates, landslide alerts, and safe transit corridors.',
    'home.roads.liveUpdates': 'Live Highway Updates',
    'home.verify.title': 'Checkpoint Pass Verification',
    'home.verify.desc': 'Field QR inspection with cryptographic offline signature validation.',

    // Clearance guidelines
    'home.guidelines.title': 'Clearance Priority Guidelines',
    'home.guidelines.subtitle': 'Vehicle classification and fast-track transit protocols',
    'home.guidelines.criticalTitle': 'Critical Priority (Tier 1: P1)',
    'home.guidelines.criticalVehicles': 'Ambulances, Search & Rescue Teams, Medical Evacuation',
    'home.guidelines.criticalClearance': 'Instant Automated Clearance (Zero Wait)',
    'home.guidelines.highTitle': 'High Priority (Tier 2: P2)',
    'home.guidelines.highVehicles': 'Medicines, Blood Bank, Oxygen, Emergency Medical Staff',
    'home.guidelines.highClearance': 'Priority Corridor Transit & Escort',
    'home.guidelines.mediumTitle': 'Medium Priority (Tier 3: P3)',
    'home.guidelines.mediumVehicles': 'Food Aid, Drinking Water, Shelter Kits, Heavy Excavators',
    'home.guidelines.mediumClearance': 'Coordinated Highway Transit Schedules',

    // Apply Form Wizard
    'apply.title': 'Relief Vehicle E-Pass Application Form',
    'apply.subtitle': 'Please provide accurate details for vehicle, driver, and cargo to expedite review',
    'apply.step1': '1. Applicant & Org',
    'apply.step2': '2. Vehicle & Driver',
    'apply.step3': '3. Journey & Corridor',
    'apply.step4': '4. Cargo & Purpose',
    'apply.name': 'Full Name of Applicant',
    'apply.phone': 'Contact Phone Number',
    'apply.email': 'Email Address',
    'apply.org': 'Organization / Group Name',
    'apply.orgType': 'Organization Type',
    'apply.orgId': 'Registration / ID Number (Optional)',
    'apply.vehicleNo': 'Vehicle Plate Number (e.g. BA 2 KHA 1234)',
    'apply.vehicleType': 'Vehicle Type',
    'apply.vehicleOwner': 'Vehicle Owner / Entity',
    'apply.driverName': 'Driver Full Name',
    'apply.driverPhone': 'Driver Mobile Number',
    'apply.passengerCount': 'Passenger Count aboard',
    'apply.vehicleCapacity': 'Payload / Seating Capacity',
    'apply.emergencyContact': '24/7 Emergency Contact Phone',
    'apply.from': 'Departure Location (District/Municipality)',
    'apply.to': 'Destination (District/Relief Point)',
    'apply.checkpoints': 'Intermediate Checkpoints (Comma separated)',
    'apply.departure': 'Departure Date & Time',
    'apply.return': 'Estimated Return Date & Time',
    'apply.route': 'Proposed Highways / Corridors',
    'apply.purpose': 'Mission Purpose & Scope',
    'apply.cargo': 'Primary Cargo Classification',
    'apply.cargoDetails': 'Detailed Cargo Breakdown (Quantities & Items)',
    'apply.isEmergency': 'This is a life-critical emergency mission',
    'apply.submit': 'Submit Application',
    'apply.submitting': 'Submitting Application...',
    'apply.next': 'Next Step',
    'apply.prev': 'Previous Step',

    // Apply Form Placeholders
    'apply.placeholderName': 'e.g. Dr. Ram Sharma',
    'apply.placeholderPhone': '9841XXXXXX',
    'apply.placeholderEmail': 'relief@redcross.org.np',
    'apply.placeholderEmergencyContact': '24/7 Emergency Phone (98XXXXXXXX)',
    'apply.placeholderOrg': 'e.g. Nepal Red Cross Society',
    'apply.placeholderVehicleNo': 'e.g. BA 2 KHA 1234 or BA.PRA. 01-002 KHA 9999',
    'apply.placeholderDriverName': 'Driver Full Name',
    'apply.placeholderDriverPhone': 'Driver Mobile Phone (98XXXXXXXX)',
    'apply.placeholderCapacity': 'e.g. 5 Tons / 10 Seats',
    'apply.placeholderFrom': 'e.g. Kathmandu (Balkhu)',
    'apply.placeholderTo': 'e.g. Sindhupalchok (Melamchi)',
    'apply.placeholderRoute': 'e.g. Araniko Highway -> Zero Kilo -> Chautara',
    'apply.placeholderCheckpoints': 'e.g. Jagati, Dolalghat, Bandeu',
    'apply.placeholderCargoDetails': 'e.g. 200 bags rice, 50 cartons ORS, 100 tarpaulins, first aid kits',
    'apply.placeholderPurpose': 'e.g. Emergency relief food and medical supply delivery to flood-affected families',

    // Validation Errors
    'apply.errApplicantName': 'Please enter applicant full name',
    'apply.errPhone': 'Please enter contact phone number',
    'apply.errOrg': 'Please enter organization name',
    'apply.errVehicleNo': 'Please enter vehicle registration plate number',
    'apply.errDriverName': 'Please enter driver full name',
    'apply.errDriverPhone': 'Please enter driver mobile phone number',
    'apply.errFrom': 'Please enter departure location',
    'apply.errTo': 'Please enter destination point',
    'apply.errRoute': 'Please enter proposed travel route / corridor',
    'apply.errPurpose': 'Please enter mission purpose and scope',
    'apply.errCargo': 'Please enter detailed cargo description',
    'apply.errSubmit': 'Error: Failed to submit application. Please try again.',

    // Application submitted
    'applied.title': 'Application registered',
    'applied.desc': 'Your e-pass request is in the government system. Keep the tracking code below. After the pass is issued, the same code opens the QR card.',
    'applied.idLabel': 'Tracking code',
    'applied.idHint': 'Use this code on Track Status. When the pass is issued, tracking it opens the QR card.',
    'applied.advisoryTitle': 'Before you travel',
    'applied.advisory': 'Checkpoints will scan the digital QR pass. Do not start the journey until the pass is issued.',
    'applied.copy': 'Copy',
    'applied.copied': 'Copied',

    // Track Application
    'track.title': 'Track application status',
    'track.subtitle': 'Enter the tracking code you received after submitting',
    'track.placeholder': 'Tracking code (e.g. EP-20260829-0DE4)',
    'track.search': 'Check status',
    'track.searching': 'Checking…',
    'track.codeLabel': 'Tracking code',
    'track.storedLabel': 'Saved on this device',
    'track.notFound': 'Application not found',
    'track.notFoundHint': 'Check the code. It starts with EP-.',
    'track.redirecting': 'E-pass is ready. Opening the QR card…',
    'track.pendingHint': 'When an officer issues the pass, this same code opens the QR card.',
    'track.openPass': 'Open e-pass card',
    'track.vehicle': 'Vehicle number',
    'track.driver': 'Driver',
    'track.route': 'From → To',
    'track.cargo': 'Cargo',
    'track.unauthTitle': 'Access Restricted | Authorization Required',
    'track.unauthDesc': 'Disaster fleet tracking contains sensitive movement data. Tracking is restricted to registered applicants with a valid authorization token or authenticated emergency officers.',
    'track.status.submitted': 'Submitted (Under Initial Review)',
    'track.status.under_review': 'Under Review',
    'track.status.approved': 'Approved (Pending Issuance)',
    'track.status.issued': 'Pass Issued (Active)',
    'track.status.rejected': 'Rejected',
    'track.status.revoked': 'Revoked',
    'viewpass.notFound': 'E-pass not found',
    'viewpass.notFoundHint': 'The pass has not been issued yet, or the code does not match.',
    'viewpass.back': 'Back',
    'viewpass.home': 'Back to home',
    'viewpass.print': 'Print',
    'viewpass.share': 'Share',
    'viewpass.shared': 'Link copied',
    'viewpass.active': 'Active',
    'viewpass.scanHint': 'Scan at the checkpoint to verify',

    // Status mapping
    'status.all': 'All Statuses',
    'status.submitted': 'Submitted (Under Review)',
    'status.under_review': 'Under Review',
    'status.info_requested': 'Info Requested',
    'status.approved': 'Approved (Pending Issuance)',
    'status.issued': 'Pass Issued (Active)',
    'status.active': 'Active Pass',
    'status.completed': 'Completed',
    'status.rejected': 'Rejected',
    'status.held': 'Held / Paused',
    'status.revoked': 'Revoked',
    'status.expired': 'Expired',

    // Priorities
    'priority.critical': 'Critical (P1)',
    'priority.high': 'High (P2)',
    'priority.medium': 'Medium (P3)',
    'priority.normal': 'Normal (P4)',

    // Road Conditions
    'roads.title': 'Live Highway & Corridor Conditions',
    'roads.subtitle': 'Real-time road closures, landslide blockages, and emergency clearance advisories',
    'roads.addBtn': '+ Add Road Advisory',
    'roads.addModalTitle': 'Report New Road Advisory',
    'roads.roadNameLabel': 'Highway / Route Section Name',
    'roads.statusLabel': 'Current Road Transit Status',
    'roads.descLabel': 'Advisory Details & Detour Notes',
    'roads.submitBtn': 'Publish Road Advisory',
    'roads.status.open': 'Open',
    'roads.status.restricted': 'Restricted / Single-Lane',
    'roads.status.emergency_only': 'Emergency Only',
    'roads.status.closed': 'Closed',
    'roads.statusOpen': 'Open',
    'roads.statusRestricted': 'Restricted / Single-Lane',
    'roads.statusEmergency': 'Emergency Only',
    'roads.statusClosed': 'Closed',
    'roads.filter.all': 'All Highways',
    'roads.filter.open': 'Open',
    'roads.filter.restricted': 'Restricted',
    'roads.filter.closed': 'Closed',
    'roads.searchPlaceholder': 'Search highway or location...',
    'roads.noAlerts': 'No Active Road Closures or Advisories Reported',

    // Scanner / Verification
    'scanner.title': 'Checkpoint QR Verification Scanner',
    'scanner.subtitle': 'Instant online & offline cryptographic verification for highway officers',
    'scanner.checkpointLocation': 'Checkpoint Station',
    'scanner.officerName': 'Inspecting Officer Name',
    'scanner.cameraError': 'Unable to access camera. Please check permissions or upload an image.',

    // Admin Login & Dashboard
    'admin.dept': 'Government of Nepal | Ministry of Home Affairs',
    'admin.title': 'Emergency Command & Control Center',
    'admin.subtitle': 'Government of Nepal | Emergency Relief Vehicle Coordination & E-Pass Command Desk',
    'admin.login': 'Duty Administration & Command Portal',
    'admin.subTitle': 'Security Inspection & Relief Coordination Portal',
    'admin.username': 'Username',
    'admin.password': 'Password',
    'admin.loginBtn': 'Sign In',
    'admin.loggingIn': 'Authenticating...',
    'admin.securityAdvisory': 'Authorized Personnel Only',
    'admin.securityWarning': 'Unauthorized access attempts are prohibited by law. All activities are recorded in security audit logs.',
    'admin.usernamePlaceholder': 'e.g. superadmin or officer_dolalghat',
    'admin.passwordPlaceholder': '••••••••••••',
    'admin.authFailed': 'Authentication failed. Please check your credentials.',
    'admin.dashboard': 'Admin Command Center',
    'admin.logout': 'Sign Out',
    'admin.issueRequired': 'This request stays open until an e-pass is issued.',
    'admin.close': 'Close',
    'admin.review': 'Review',
    'admin.overview': 'Command Overview',
    'admin.coordination': 'Live Fleet Coordination',
    'admin.auditLogs': 'Security Audit Trail',
    'admin.applications': 'E-Pass Applications',
    'admin.checkpoints': 'Checkpoint Stations',
    'admin.users': 'Duty Officers & Staff',
    'admin.roads': 'Highway Advisories',
    'admin.scanner': 'QR Verification Scanner',
    'admin.track': 'Track Application',
    'admin.approve': 'Approve',
    'admin.issue': 'Issue Pass',
    'admin.reject': 'Reject',
    'admin.revoke': 'Revoke Pass',
    'admin.hold': 'Hold Application',
    'admin.requestInfo': 'Request Info',
    'admin.viewDetails': 'View Manifest',
    'admin.manifest': 'Vehicle & Relief Manifest',
    'admin.actions': 'Actions',
    'admin.status': 'Status',
    'admin.priority': 'Priority',
    'admin.cargo': 'Cargo',
    'admin.route': 'Route & Destination',
    'admin.vehicle': 'Vehicle & Driver',
    'admin.applicant': 'Applicant & Org',
    'admin.all': 'All',
    'admin.refresh': 'Refresh',
    'admin.searchPlaceholder': 'Search by ID, Vehicle, Org, Route...',
    'admin.filterPriority': 'All Priorities',
    'admin.noData': 'No records found.',
    'admin.groupOperations': 'Relief & Pass Operations',
    'admin.groupInfrastructure': 'Infrastructure & Stations',
    'admin.groupSecurity': 'Security & Coordination',
    'admin.tabAllPasses': 'All Applied Passes & Status',
    'admin.tabVerify': 'Verify Pass & Scanner',
    'admin.tabTrack': 'Track Application Status',
    'admin.tabRoads': 'Highway & Corridor Conditions',
    'admin.tabCheckpoints': 'Checkpoint Stations',
    'admin.tabUsers': 'Duty Officers & Members',
    'admin.metricTotalApplied': 'Total Applications',
    'admin.metricUrgentPriority': 'Urgent Priority (P1)',
    'admin.metricActivePasses': 'Active E-Passes',
    'admin.metricRejected': 'Rejected / Revoked',
    'admin.metricPending': 'Pending Review',
    'admin.metricCheckpoints': 'Active Checkpoints',
    'admin.metricRoadAlerts': 'Road Closures & Alerts',
    'admin.addCheckpoint': '+ Add Checkpoint Station',
    'admin.stationName': 'Checkpoint Station Name',
    'admin.stationLocation': 'Location / Post',
    'admin.stationDistrict': 'District',
    'admin.stationHighway': 'Highway / Corridor',
    'admin.createStationBtn': 'Create Checkpoint Station',
    'admin.officerFullName': 'Officer Full Name',
    'admin.assignedStation': 'Assigned Checkpoint Station',
    'admin.addMember': '+ Add Staff Member',
    'admin.role': 'Role Type',
    'admin.badge': 'Badge / ID Number',
    'admin.phone': 'Contact Phone',
    'admin.createMemberBtn': 'Create Member Account',

    // Footer
    'footer.services': 'Services',
    'footer.hotlines': 'Emergency Hotlines',
    'footer.tollFree': 'Relief Coordination Toll-Free',
    'footer.floodWarning': 'Flood Early Warning',
    'footer.policeAmbulance': 'Police / Ambulance',
    'footer.phone1149': '1149',
    'footer.phone1155': '1155',
    'footer.phone100_102': '100 / 102',
    'footer.copyright': 'All Rights Reserved',
    'footer.powered': 'Government of Nepal',
    'footer.location': 'Singha Durbar, Kathmandu, Nepal',
    'footer.gateway': 'Nepal Flood Response E-Pass Gateway',
  },
};

// Build Case-Insensitive Lookup Maps for both locales
const normalizedTranslations: Record<Locale, Map<string, string>> = {
  ne: new Map(),
  en: new Map(),
};

(['ne', 'en'] as Locale[]).forEach((loc) => {
  const dict = translations[loc];
  for (const [k, v] of Object.entries(dict)) {
    normalizedTranslations[loc].set(k.toLowerCase().trim(), v);
  }
});

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const saved = localStorage.getItem('preferred_language');
    return (saved === 'en' || saved === 'ne') ? saved : 'ne';
  });

  useEffect(() => {
    document.documentElement.lang = locale;
    localStorage.setItem('preferred_language', locale);
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
  };

  const t = (key: string): string => {
    if (!key) return '';
    const cleanKey = key.trim();
    const lowerKey = cleanKey.toLowerCase();

    // 1. Direct match in current locale
    if (translations[locale]?.[cleanKey]) {
      return translations[locale][cleanKey];
    }
    // 2. Case-insensitive match in current locale
    if (normalizedTranslations[locale].has(lowerKey)) {
      return normalizedTranslations[locale].get(lowerKey)!;
    }
    // 3. Fallback to English direct match
    if (translations['en']?.[cleanKey]) {
      return translations['en'][cleanKey];
    }
    // 4. Fallback to English case-insensitive match
    if (normalizedTranslations['en'].has(lowerKey)) {
      return normalizedTranslations['en'].get(lowerKey)!;
    }

    // 5. Intelligent dot-key fallback formatting (e.g. 'admin.title' -> 'Title', 'admin.review' -> 'Review')
    if (cleanKey.includes('.')) {
      const parts = cleanKey.split('.');
      const subKey = parts[parts.length - 1];
      const directSub = t(subKey);
      if (directSub !== subKey) {
        return directSub;
      }
      return subKey.charAt(0).toUpperCase() + subKey.slice(1).replace(/_/g, ' ');
    }

    // 6. Return original key as fallback
    return cleanKey;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
};

