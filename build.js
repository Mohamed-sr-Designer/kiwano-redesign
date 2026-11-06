// KIWANO redesign generator: node build.js → static HTML pages.
// All facts, stats, quotes, roles and project media are from kiwanomedia.com.
const fs = require('fs'), path = require('path');
const OUT = __dirname;
const up = (p, w = 1400) => /\.gif$|Tikka-(16|19)\.webp$/.test(p) // these two are rejected by the CDN resizer
  ? `https://kiwanomedia.com/wp-content/uploads/${p}`
  : `https://i0.wp.com/kiwanomedia.com/wp-content/uploads/${p}?w=${w}&ssl=1`;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const seq = (pre, a, b, suf = '-scaled.webp') => Array.from({ length: b - a + 1 }, (_, i) => `${pre}${String(a + i).padStart(2, '0')}${suf}`);

/* ---------- Data ---------- */
const CATS = { 'commercial-ads': 'Commercial Ads', 'media-production': 'Media Production', 'social-media': 'Social Media', 'talent-management': 'Talent Management', 'creative-designs': 'Creative Designs' };
const [A, M, S, T, C] = Object.keys(CATS);
const P = [
  { s: 'dreem-eid-commercial-ad', t: 'Dreem Eid 2023 Commercial Ad', cv: '2025/02/1920-x-1080.webp', c: [A], yt: ['PMH0Q3H4-g8', 'qJw_n_ItHlc'], big: 1, g: [],
    d: 'For several years KIWANO has been the digital architect behind Dreem, a leader in the Middle Eastern powdered dessert sector. This Eid film is one of the high-quality ad copies from that partnership, and you can watch the film and its behind the scenes here.' },
  { s: 'rivoli', t: 'Rivoli', ar: 'جمالك بين إيديكي', cv: '2025/05/Rivoli-08-scaled.webp', c: [A, S], g: ['2025/05/Rivoli-01-scaled.webp', '2025/05/Rivoli-02.webp', '2025/05/Rivoli-03-scaled.webp', '2025/05/Rivoli-04.webp'],
    d: 'KIWANO fuels the digital presence of Rivoli, a leading brand in Egypt\'s personal care industry, with social media management, media production and two digital ad copies, amplified through influencer campaigns and on-ground activations.' },
  { s: 'al-asdekaa-spread-cheese-ad', t: 'Al Asdekaa Spread Cheese Commercial Ad', cv: '2025/03/Work-Covers-08-08.webp', c: [A], g: [...seq('2025/03/Al-Asdekaaa-', 8, 9), '2025/03/Al-Asdekaaa-10-scaled-e1741659189189.webp', '2025/03/Al-Asdekaaa-11-scaled.webp', '2025/03/15a391152498595.631f6fb00aca0.gif', '2025/03/Al-Asdekaaa-12-scaled.webp'],
    d: 'KIWANO collaborated with Al Asdekaa, a pioneering dairy brand, on the launch of their squirt cheese spread bottle, taking the creative reins on a dynamic social media ad that introduced the product.' },
  { s: 'americana-recipe', t: 'Americana Foods Recipes', cv: '2025/05/Amricana-Cover-04-scaled.webp', c: [M], g: [...seq('2025/05/Amreicana', 1, 6).map(x => x.replace('Amreicana0', 'Amreicana')), '2025/05/Amreicana7.webp', '2025/05/Amreicana.gif'],
    d: 'KIWANO partnered with Americana to craft deliciously styled recipe videos and food content, combining cinematic visuals with scroll-stopping social media edits.' },
  { s: 'dreem-recipes', t: 'Dreem Recipes', cv: '2021/07/Work-Covers-107.webp', c: [M, S], g: [...seq('2025/03/Dreem-', 1, 7), '2025/02/dream-3.gif'] },
  { s: 'oxi-libya', t: 'Oxi Libya', cv: '2025/05/Oxi-10-scaled.webp', c: [M], g: seq('2025/05/Oxi-', 1, 6),
    d: 'KIWANO helped Oxi Libya showcase its products through video production, lifestyle visuals and creative storytelling across digital platforms.' },
  { s: 'ahlawy-biscuit', t: 'Ahlawy Biscuit', cv: '2025/03/Work-Covers-09-scaled.webp', c: [M, S, C], big: 1, g: ['2025/03/Ahlawy-13-scaled.webp', '2025/03/Ahlawy-14-scaled.webp', '2025/03/Ahlawy-15-scaled.webp', '2025/03/Ahlawy-16.1-scaled.webp', '2025/03/Ahlawy-17.1-scaled.webp', '2025/03/Ahlawy-18-scaled.webp', '2025/03/Ahlawy-19-scaled.webp', '2025/03/Ahlawy-20.1-scaled.webp', '2025/03/Ahlawy-21-scaled.webp', '2025/03/Ahlawy.3.gif'],
    d: 'Ahlawy\'s social media journey started with KIWANO. From content and media production to event coverage and full social media management, the team handles every aspect of this well-known biscuit brand\'s digital presence.' },
  { s: 'dreem-jingles', t: 'Dreem Jingles', cv: '2025/05/Jingles-Cover_Artboard-1-copy-scaled.webp', c: [C], g: [...seq('2025/05/Jingles-', 21, 23), '2025/05/Dreem-jingles.gif'] },
  { s: 'rivoli-podcast', t: 'Rivoli Podcast', ar: 'اكتشفي جمالك', cv: '2025/05/Rivoli-Podcast-Cover-16-scaled.webp', c: [C, T], g: seq('2025/05/Rivoli-Podcast-', 1, 9),
    d: 'KIWANO produced the Rivoli Podcast from concept to post, delivering branding, media assets and full audio-visual production.' },
  { s: 'bfestive-events', t: 'Bfestive Events, Summer 2022', cv: '2025/05/Bfestival-12-scaled.webp', c: [M], g: seq('2025/05/bfestival-', 1, 5),
    d: 'A standout Summer \'22 for BFestive Events, with event branding, vibrant visuals and storytelling content that celebrates moments.' },
  { s: 'magic', t: 'Magic', cv: '2025/05/Magic-Cover_Artboard-1-scaled.webp', c: [M], g: [...seq('2025/05/Magic-', 21, 24), '2025/05/Magic-gif.gif'] },
  { s: 'hardees', t: 'Hardee\'s', cv: '2025/03/Work-Covers-16-scaled.webp', c: [M], big: 1, g: seq('2025/03/Hardees-', 45, 51) },
  { s: 'chicken-tikka', t: 'Chicken Tikka', cv: '2025/05/Tikka-Cover-25-scaled.webp', c: [M], g: ['2025/05/Tikka-15-scaled.webp', '2025/05/Tikka-16.webp', '2025/05/Tikka-17-scaled.webp', '2025/05/Tikka-18.webp', '2025/05/Tikka-19.webp', '2025/05/Tikka-20.webp'] },
  { s: 'harvest-schools', t: 'Harvest Schools', cv: '2025/03/Work-Covers-14-scaled.webp', c: [M, S, C], g: [...seq('2025/03/Harvest-', 21, 30), '2025/03/Harvest.gif'] },
  { s: 'sweet-girl-factory', t: 'Sweet Girl Factory', cv: '2025/03/Work-Sweet-13.2-13-scaled.webp', c: [M], g: [...seq('2025/03/Sweet-Girl-', 16, 20), '2025/03/Sweet-Girl.gif'] },
  { s: 'brew-and-chew-menu-design', t: 'Brew & Chew Menu Design', cv: '2025/03/Work-Covers-11.webp', c: [C], g: ['2025/03/BrewChew-30-scaled.webp', '2025/03/BrewChew-31-scaled.webp', '2025/03/BrewChew-32-1-scaled.webp', '2025/03/BrewChew-33-scaled.webp', '2025/03/BrewChew-34-scaled.webp', '2025/03/BrewChew.gif'],
    d: 'A creatively designed, easy-to-navigate menu that complements Brew & Chew\'s dining experience, showcases the offering and reinforces the brand identity.' },
  { s: 'al-ahram-cookware', t: 'Al-Ahram Cookware', cv: '2025/03/Work-Covers-10.webp', c: [S, C], g: [...seq('2025/03/AlAhram-', 22, 26), '2025/03/ezgif.com-video-to-gif.gif', '2025/03/gif-2.gif', '2025/03/gif-3.1.gif', '2025/03/gif-5.1.gif', '2025/03/gif-5.2.gif', '2025/03/gif-6.1.gif', '2025/03/gif-7.1.gif', '2025/03/gif-8.1.gif', ...seq('2025/03/AlAhram-', 27, 28), '2025/03/AlAhram-1.gif', '2025/03/AlAhram-2.gif', '2025/03/motion-1.1-ezgif.com-optimize-1.gif', '2025/03/Motion2.gif', '2025/03/AlAhram-29-scaled.webp', '2025/03/Alahram2.gif'] },
  { s: 'beytna-homewear', t: 'Beytna Homewear', cv: '2025/05/Baytona-Coverr-25-scaled.webp', c: [M, C], g: ['2025/05/Beytna-08-scaled.webp', '2025/05/Beytna-09-scaled.webp', '2025/05/Beytna-gif2.gif', ...seq('2025/05/Beytna-', 10, 12), '2025/05/Beytna-13.webp', '2025/05/Beytna-14-scaled.webp', '2025/05/Beytna-Gif.gif'] },
  { s: '3seer-time', t: '3seer Time', cv: '2025/03/Work-Covers-18-scaled.webp', c: [M, S, C], big: 1, g: [...seq('2025/03/3aseer-time-', 8, 18), '2025/03/3aser-time.gif'] },
  { s: 'eskendrella', t: 'Eskendrella', cv: '2025/05/Work-Covers-24-scaled.webp', c: [C], g: ['2025/05/Eskendrella-02-scaled-e1746634593491.webp', '2025/05/Eskendrella-03.webp', '2025/05/Eskendrella-01-scaled.webp', '2025/05/304d18157476841.637a09d64bc2c.gif'] },
  { s: 'ramadan-nutrition-series', t: 'Ramadan\'25 Nutrition Series', cv: '2025/05/Ramadan-11-scaled.webp', c: [M], g: seq('2025/05/Ramadan-', 1, 2),
    d: 'A full Ramadan\'25 nutrition video series blending informative health content with sleek visuals.' },
  { s: 'kheir-zaman', t: 'Kheir Zaman', cv: '2025/03/Work-Covers-17-scaled.webp', c: [M], g: seq('2025/03/Khair-Zaman-', 1, 7) },
  { s: 'capers-cafe-restaurant', t: 'Capers Cafe & Restaurant', cv: '2025/05/Capers-Cover-14-scaled.webp', c: [M, C], g: [...seq('2025/05/Capers-', 1, 11), '2025/05/42e663119198861.6099405813207.gif'],
    d: 'Capers\' visual identity, crafted through creative branding, food photography and social media content for a refined dining experience.' },
  { s: 'butterfly-restaurant', t: 'Butterfly Restaurant', cv: '2025/03/Work-Covers-15-scaled.webp', c: [M, S, C], g: [...seq('2025/03/Butterflyy-', 31, 44), '2025/03/butterfly.gif'] },
  { s: 'hamata-restaurant', t: 'Hamata Restaurant', cv: '2025/05/Hamata-05-scaled.webp', c: [M, C], g: [...seq('2025/05/Hamata-', 1, 4), '2025/05/Hamata-05-1-scaled.webp', ...seq('2025/05/Hamata-', 6, 11), '2025/05/Hamata.gif'],
    d: 'The spirit of Hamata, captured with bold food visuals, cinematic production and a distinct brand identity designed for Alexandria\'s seafood lovers.' },
  { s: 'pubs-pizza', t: 'Pub\'s Pizza', cv: '2025/05/Pubs-Cover-15-scaled.webp', c: [M, S, C], g: seq('2025/05/Pubs-', 1, 9),
    d: 'Bold visuals for Pub\'s Pizza, with mouthwatering food styling, creative photography and scroll-stopping social media content.' },
  { s: 'lametna', t: 'Lametna Pasta', cv: '2025/05/Lametna-Cover-13-scaled.webp', c: [M], g: seq('2025/05/Lametna-', 1, 13),
    d: 'Lametna\'s Ramadan campaign, launched with vibrant visuals, storytelling and a social media strategy tailored for seasonal engagement.' },
  { s: 'kebab-shaker', t: 'Kebab Shaker', cv: '2025/05/Shaker-Cover-07-scaled.webp', c: [M, S, C], g: ['2025/05/Shaker-1-1-scaled.webp', ...seq('2025/05/Shaker-', 2, 9).map(x => x.replace('Shaker-0', 'Shaker-')), '2025/05/Shakerrr-10-scaled.webp', '2025/05/Shakerrr-11-scaled.webp', '2025/05/8-ezgif.com-optimize-1.gif'],
    d: 'Kebab Shaker\'s visuals, spiced up with mouthwatering food styling, creative photography and ad-ready video content tailored for social media.' },
  { s: 'shihlin-taiwan-street', t: 'Shihlin Taiwan Street', cv: '2025/03/Work-Covers-12.webp', c: [M, S, C], g: [...seq('2025/03/Shihlin-', 1, 15), '2025/03/Shihlin.gif'] },
  { s: 'mulberry', t: 'Mulberry', cv: '2025/05/Mulberry-06-scaled.webp', c: [S, C], big: 1, g: [...seq('2025/05/Mulberry-', 1, 5), '2025/05/Mulberry-06-1-scaled.webp', ...seq('2025/05/Mulberry-', 7, 12), '2025/05/Mulberry-4.gif', '2025/05/Mulberry-6.gif', '2025/05/Mulberry-1.gif', '2025/05/Mulberry-3.gif', '2025/05/Mulberry-13-scaled.webp', '2025/05/Mulberry-5.gif', '2025/05/Mulberry-2.gif', '2025/05/Mulberry.gif'],
    d: 'From warm photography to elegant branding, KIWANO helped Mulberry Cafe tell its story through inviting visuals, styled content and social-ready campaigns.' },
  { s: 'al-raed-labs', t: 'Al Raed Labs', cv: '2025/05/Al-Raed-Cover-09-scaled.webp', c: [S, C], g: seq('2025/05/Al-Raed-', 1, 9),
    d: 'Sleek branding, clean visuals and healthcare-focused media production that builds trust and professional appeal.' },
  { s: 'eau-water-conceptual-project', t: 'EAU Water, Conceptual Project', cv: '2025/05/Work-Covers-23-1-scaled.webp', c: [S], g: ['2025/05/Eau-water-01-scaled.webp', '2025/05/Eau-water-02.webp', '2025/05/Eau-water-03-scaled.webp', '2025/05/Eau-waterr-04.webp'] },
  { s: 'shobash', t: 'Shobash', cv: '2025/05/Shobash-Cover_Artboard-1-copy-2-scaled.webp', c: [C], g: ['2025/05/Shobash_Artboard-1-scaled.webp', ...seq('2025/05/Shobash-', 2, 7)] },
];
const SERV = [
  { k: 'ads', cat: A, n: 'Commercial Ads', img: '2025/02/srvs-18.webp', hook: 'A big idea, a fully equipped crew, any location, any time.',
    body: 'Your ad gets the best quality in the shortest shooting period. The latest one was shot in a day. And if you want to go straight to TV, the copywriters write the screenplay so your product lands smooth and smart, never forced.',
    get: ['Concept and campaign idea', 'Screenplay and copywriting', 'Fully equipped crew on any location', 'Filming, editing and final delivery'],
    who: ['Creative copywriters', 'Videographers and photographers', 'Food stylists and hand models', 'Motion graphics designers'] },
  { k: 'prod', cat: M, n: 'Media Production', img: '2025/03/srvs-16-14.webp', hook: '"Rolling." "Anddd... action!"',
    body: 'Exclusive setups, art direction and styling sessions that bring your visual identity to life. Videographers bring the moves, angles and cuts. Photographers put the light where the product shines. Reel-makers know what is trending right now.',
    get: ['Videography', 'Set-up photography', 'Product photography', 'Lifestyle photography', 'Reel-making for TikTok and Instagram'],
    who: ['Videographers and photographers', 'Food stylists, hand models and chefs', 'Content creators', 'Video editors'] },
  { k: 'social', cat: S, n: 'Social Media', img: '2025/02/srvs-15.webp', hook: 'Listen, monitor, analyze, then build the relationship.',
    body: 'Dedicated account managers link you to the world and the world to you. Before anything is posted the team studies your brand and market, then a monthly agenda, scheduled flow and post-by-post monitoring keep it moving.',
    get: ['Social media management', 'Creative content and scriptwriting', 'Two monthly reports: digital analysis and media buying', 'Monthly social listening on you and your major competitors'],
    who: ['Account managers and executives', 'Creative strategists', 'Community management', 'Media buyers'] },
  { k: 'talent', cat: T, n: 'Talent Management', img: '2025/03/srvs-16-16.webp', hook: 'The right influencers, the ones who fit who you are.',
    body: 'An influencer strategy lets your brand connect authentically with diverse audiences. KIWANO manages the process from A to Z, to generate the required results within the allocated budget.',
    get: ['Extensive influencer research', 'Influencer strategy selection', 'Negotiating and sealing deals', 'Scenarios and scripts'],
    who: ['PR and talent management', 'Creative copywriters', 'Account managers'] },
  { k: 'design', cat: C, n: 'Creative Designs', img: '2025/03/srvs-16-17.webp', hook: 'A colour, a typeface and a persona nobody can mistake.',
    body: 'A distinct identity that settles into your audience\'s subconscious. The graphics and motion team makes your name stand out and gives it its own persona among competitors.',
    get: ['Social media designs', 'Motion graphics', 'Outdoor printings', 'Branding', 'Typography'],
    who: ['Graphic designers', 'Motion graphics designers', 'Creative copywriters'] },
];
const NUMS = [[5, '+', 'Years on the local and global market'], [200, '+', 'Satisfied clients on the local and global market'], [5, 'K+', 'Videos produced'], [1, 'B+', 'Views'], [1, 'M+', 'Photos captured'], [5, 'M+', 'Ads spending on different platforms']];
const STORIES = [
  { s: 'dreem-eid-commercial-ad', bg: '#B81F26', logo: '2025/02/Work-23.webp', cv: '2025/02/1920-x-1080.webp', c: ['Social media', 'Media production', 'Talent', 'Ad copies'], n: 'Dreem', d: 'For several years we have been the digital architects behind Dreem, the leader in the Middle Eastern powdered dessert sector, driving online growth and engagement.' },
  { s: 'rivoli', bg: '#5E2279', logo: '2025/02/Clients-Logos-35.webp', cv: '2025/05/Rivoli-08-scaled.webp', c: ['Social media', 'Media production', 'Influencers', 'On-ground'], n: 'Rivoli', d: 'A leading brand in Egypt\'s personal care industry. We launched two digital ad copies, then amplified their reach with influencer campaigns and on-ground activations.' },
  { s: 'ahlawy-biscuit', bg: '#8E1A1C', logo: '2025/02/Work-25.webp', cv: '2025/03/Work-Covers-09-scaled.webp', c: ['Content', 'Media production', 'Event coverage', 'Social media'], n: 'Ahlawy', d: 'Ahlawy\'s social media journey started with us. We handle every aspect of this well-known biscuit brand\'s digital presence.' },
  { s: 'al-asdekaa-spread-cheese-ad', bg: '#123B73', logo: '2025/02/Work-10.webp', cv: '2025/03/Work-Covers-08-08.webp', c: ['Commercial ad', 'Product launch'], n: 'Al Asdekaa', d: 'A pioneering dairy brand launching an innovative squirt cheese spread bottle. We took the creative reins on the ad that introduced it to the world.' },
  { s: 'brew-and-chew-menu-design', bg: '#4A2A17', logo: '2025/02/Work-27.webp', cv: '2025/03/Work-Covers-11.webp', c: ['Creative design', 'Menu'], n: 'Brew & Chew', d: 'A well-designed menu is a crucial ingredient for a successful restaurant. This one is easy to navigate and carries the spirit of the brand.' },
];
const TEAM = [
  ['Yasmin Ewaily', 'Senior Account Manager & Team Lead', 'accounts', '2025/02/Team-93.webp'], ['Yara Gomaa', 'Account Manager & Quality', 'accounts', '2025/04/Team-22.webp'], ['Manar Eleslam', 'Account Manager & Quality', 'accounts', '2025/02/Team-98.webp'], ['Donia Ahmed', 'Account Executive', 'accounts', '2025/07/donia.png'], ['Aya Mohamed', 'Account Executive', 'accounts'], ['Salma Fares', 'Account Executive', 'accounts'], ['Ayten Mohamed', 'Account Executive', 'accounts'], ['Madona Magdy', 'Account Executive', 'accounts'], ['Habiba Emad', 'Account Executive', 'accounts'],
  ['Amy Ayman', 'Senior Creative Strategist & Team Lead', 'creative', '2025/02/Team-89.webp'], ['Mennatullah Samir', 'Senior Creative Copywriter & Quality', 'creative', '2025/06/menna-s.png'], ['Salma Ali', 'Creative Copywriter', 'creative', '2025/06/salma.png'], ['Ariam Ahmed', 'Creative Copywriter', 'creative', '2025/07/ariam.png'], ['Hannah Osama', 'Creative Copywriter', 'creative'], ['Romario Ehab', 'Creative Copywriter', 'creative'],
  ['Ahmed Nabil', 'Senior Graphic Designer & Team Lead', 'design'], ['Kirollos Mamdouh', 'Senior Graphic Designer & Quality', 'design', '2025/07/kiro-1.png'], ['Abdelrahman Samy', 'Graphic Designer', 'design', '2025/06/samy.png'], ['Mai Mahmoud', 'Graphic Designer', 'design', '2025/06/mai.png'], ['Rewan Elsayed', 'Graphic Designer', 'design', '2025/06/rewan.png'], ['Saleh Ali', 'Motion Graphics Designer', 'design'],
  ['Nancy El-Emam', 'Senior Food Stylist, Hand Model & Chef', 'food'], ['Aya Ismail', 'Senior Food Stylist, Hand Model & Chef', 'food'], ['Sherouk Mohamed', 'Food Stylist, Hand Model & Chef', 'food'], ['Hana Mohamed', 'Food Stylist, Hand Model & Chef', 'food'], ['Nour Mohamed', 'Food Stylist, Hand Model & Chef', 'food'], ['Namis Nafea', 'Food Stylist, Hand Model & Chef', 'food'],
  ['Mohamed Khaled', 'Senior Videographer & Photographer', 'camera', '2025/02/Team-104.webp'], ['Ahmed Khallaf', 'Videographer & Photographer', 'camera'], ['Youssr Ali', 'Content Creator', 'camera', '2025/06/yousser.png'],
  ['Heba Abdullah', 'Senior Community Management Executive', 'community', '2025/02/Team-99.webp'], ['Rabab Ibrahim', 'Community Management Executive', 'community', '2025/06/rabab.png'],
  ['Tarek Elsayed', 'Senior Media Buyer', 'media'], ['Ahmed Adel', 'Media Buyer', 'media'],
  ['Menna Mourad', 'PR & Talent Management Senior Executive', 'talent', '2025/06/menna-m.png'],
  ['Umna Hesham', 'Executive Operations Assistant', 'ops', '2025/02/Team-91.webp'], ['Pakename Mohamed', 'Administrative Manager', 'ops'],
];
const DEPTS = [['accounts', 'Accounts', 'Your link to everyone'], ['creative', 'Strategy & copy', 'Ideas and words'], ['design', 'Design & motion', 'How it looks and moves'], ['food', 'Food set', 'Stylists, hand models, chefs'], ['camera', 'Camera & creators', 'On set, on location'], ['community', 'Community', 'Comments and DMs'], ['media', 'Media buying', 'Where the budget goes'], ['talent', 'PR & talent', 'Influencer deals'], ['ops', 'Operations', 'Keeps it all running']];
const QUOTES = [
  ['Farida El Wakil', 'BFestive Events', 'KIWANO set for us everything we requested and more. Everything was more than perfect.', '116'],
  ['Sara Tahtamooni', 'Owner of Dandara Clothing Brand', 'Amazing team! kiwano has helped me achieve great results with their creativity and expertise. Their professionalism and seamless communication make them a fantastic marketing partner. Highly recommend! I have been recommending your service to everyone i know in the field.', '117'],
  ['Amira Rizk', 'Dreem Mashreq Foods, Marketing Category Manager', 'Kiwano Team was one of the most creative, responsive, and competent teams I ever worked with throughout my 18 years career in Marketing. They exert a great effort mixed with an exceptional passion and drive to keep introducing new ideas and methods to help grow brands further. Thank You, Kiwano for having full ownership of your clients\' brands and welfare.', '108'],
  ['Salma Helal', 'AlAhram Cookware, Marketing Manager', 'Cooperating with KIWANO has been an exceptional experience. Their communication was consistently clear and prompt, keeping us informed at every step. The creativity they brought to the table resulted in innovative campaigns that resonated well with our target audience. Most impressively, their strategies delivered tangible results, exceeding our expectations.', '109.1'],
  ['Mayada Hisham', 'Co-Founder of Ricci Aesthetic Clinics', 'I wanted to thank you for being professional, dedicated, creative and responsible. Kiwano team, you are the best and I would highly recommend you to all of my friends. Keep going!', '110'],
  ['Adham ElNaggari', 'Business Owner of ElNaggari', 'Kiwano Agency is instrumental in ElNaggari\'s growth. Their expertise in social media, online marketing, media production, and consultancy were crucial to our success. Their commitment and adaptability make them an exceptional partner. Highly recommended for exceptional results!', '111'],
  ['Muhammad Bazalo', 'Business Owner of Bazalo Furniture', 'Kiwano\'s team was professional, creative, and responsive to our needs and goals. They helped us grow our online presence, engage with our audience, and generate more leads and sales. I highly recommend Kiwano to anyone looking for a reliable and effective partner in marketing', '112'],
  ['Ahmed Ghozlan', 'Cofounder of Buckets Restaurant', 'Regarding graphic designs, photography or a vision to what\'s new kiwano agency are always pioneers giving innovative ideas and solutions according to the markets need. Highly recommended for delivering creative and innovative marketing strategy.', '113'],
  ['Yara Fathalla', 'Business Development Executive, Gomla Market', 'We have enjoyed a long and fruitful relationship with Kiwano Agency. We have worked together on a variety of brands in the media production field, including video production, photography, and graphic design.The agency has also helped us achieve great success in influencer management.', '114'],
  ['Dr. Rovaida Mohamed', 'Owner and Marketing Director of The Fctry', 'The team is very flexible, innovative and always a great add for achieving our goals. We have been working in several projects ( Brand Photoshoot, Catalogues and website creation) and always are very committed and Supportive. When we seek professional opinions and quality in every step we always go to KIWANO.', '115'],
];
const FAQ = [
  ['What does a media agency in Egypt do?', 'A media agency in Egypt creates visual content such as commercial ads, social media videos, and branded campaigns. It helps businesses communicate their message through high-quality media production and storytelling.'],
  ['What services does a media agency offer?', 'A media agency offers services including media production, commercial ads, social media content creation, photography, creative design, and influencer management to support brand growth.'],
  ['What is media production and why is it important?', 'Media production is the process of creating video, photography, and visual content for brands. It is important because high-quality visuals improve engagement, build brand identity, and increase conversions.'],
  ['How much does media production cost in Egypt?', 'Media production costs in Egypt vary depending on the project type, production quality, crew size, and post-production requirements. Each project is usually customized based on brand needs.'],
  ['What is the difference between a media agency and a marketing agency?', 'A media agency focuses on content creation and production, such as videos and visual campaigns. A marketing agency focuses on strategy, advertising, and performance. Many brands work with both.'],
  ['Do media agencies handle social media content?', 'Yes, media agencies create and manage social media content, including videos, reels, and visuals tailored for platforms like Instagram, TikTok, and Facebook.'],
  ['Why should businesses in Egypt work with a media agency?', 'Businesses in Egypt work with media agencies to create professional content, improve brand visibility, and produce high-quality campaigns that stand out in competitive markets.'],
  ['What industries benefit from media production services?', 'Media production services are used by industries such as FMCG, food & beverage, restaurants, fashion, real estate, healthcare, and lifestyle brands.'],
  ['How do I choose the best media agency in Egypt?', 'To choose the best media agency in Egypt, review their portfolio, check their production quality, evaluate their creative approach, and ensure they understand your brand goals.'],
  ['Do you offer commercial ads and video production in Egypt?', 'Yes, KIWANO provides commercial ads production and video production in Egypt, including concept development, filming, editing, and final delivery.'],
];
const GUIDES = [
  ['media-production-in-egypt-process-cost-benefits-2026', 'Media Production in Egypt: Process, Cost & Benefits (2026)', 'What the process looks like, what drives the cost and how brands use video to grow.'],
  ['what-does-a-media-agency-in-egypt-do-full-guide', 'What Does a Media Agency in Egypt Do? (Full Guide)', 'Media production, commercial ads and social content, explained in full.'],
  ['choose-media-agency-egypt', 'How to Choose the Right Media Agency in Egypt (2026 Guide)', 'Key factors, questions to ask and how to find the right partner for your brand.'],
];
const TRACKS = {
  social: [['Study your brand', 'A thorough look at the brand before anyone writes a post.'], ['Search the market', 'Meticulous research on the space you compete in.'], ['Competitor, SWOT & TOWS', 'Detailed analyses of where you are strong and exposed.'], ['Define your STP', 'Segments, targeting and positioning, concluded from the research.'], ['Build the strategy', 'Tone of voice, tactics, actions and creative campaigns.'], ['Monthly agenda', 'Built on your brief, then the posting flow is scheduled.'], ['Monitor every post', 'Each post\'s performance is followed through the month.'], ['Two reports', 'Digital analysis and media buying, read together.'], ['Social listening', 'What is being said about you and your major competitors.']],
  prod: [['Concept', 'Tailored creative concepts built on your business goals.'], ['Script', 'A compelling story, visualized frame by frame.'], ['Setup & styling', 'Exclusive setups, art direction and styling sessions.'], ['Filming & photography', 'A fully equipped crew, on any location at any time.'], ['Post-production', 'Editing and motion, to modern standards.'], ['Platform delivery', 'Formatted for each platform and placement.']],
};
const ROLES = [
  { t: 'Kiwano Intern', o: 'Alexandria Office', f: 'https://docs.google.com/forms/d/e/1FAIpQLSc7LPPY9gV3BQJ1NgQtN56ORA0oFOs_npJsjHM3xc3s9-afdQ/viewform',
    intro: 'Hands-on exposure in a creative media agency. Interns start with general onboarding and foundational training, then move into a specific role and department based on performance, interests and business needs.',
    a: ['Tracks you could land in', ['Account Executive: client coordination, task follow-up and daily account operations', 'Community Management: content scheduling, monitoring comments and messages', 'Creative Copywriter: captions, scripts and creative ideas', 'Videographer: setup, shooting assistance and on-set coordination', 'Video Editor: basic editing and formatting for platforms', 'Chef: food preparation and presentation for shoots', 'Food Stylist: food styling and visual presentation', 'Hand Model: showcasing products on set']],
    b: ['Requirements', ['Pursuing a degree in Marketing, Media Production, Business Administration, Advertising or related', 'Strong understanding of social media platforms and digital marketing trends', 'Passion for content creation and media production', 'Proficient in Microsoft Office', 'Google Analytics, video editing or digital marketing tools are a plus', 'Excellent written and verbal communication', 'Team-oriented, organized, detail-minded', 'Eager to follow emerging marketing technologies and production techniques']] },
  { t: 'Business Development & Sales Executive', o: 'Alexandria Office', f: 'https://docs.google.com/forms/d/1J29MFu7QtGmL_8bP41p6IX5FHUJ9OSpn15vm-r-gU90/edit?usp=drive_web&ouid=109683629732774597516',
    a: ['Key responsibilities', ['Generate new business through cold calling, networking, referrals, social media, research and direct outreach', 'Qualify and develop leads into clients', 'Present and sell the agency\'s services', 'Understand client needs and recommend solutions', 'Manage the sales cycle from outreach to handover', 'Prepare presentations, proposals, quotations and offers', 'Build long-term relationships that encourage retention and upselling', 'Negotiate commercial terms and close deals', 'Maintain an organized pipeline and regular reports', 'Stay informed on market trends and competitors']],
    b: ['Requirements', ['Proven experience as a Business Development, Sales or Account Executive', 'Excellent communication, presentation, negotiation and objection-handling skills', 'Able to translate client needs into business solutions', 'Confident in cold outreach and pitching', 'PR or media relations knowledge is a plus']] },
  { t: 'Account Manager & Social Media Specialist', o: 'Cairo / Alexandria Office', f: 'https://docs.google.com/forms/d/e/1FAIpQLSeHtwFOLZudul9ruNKk-NfEkL7e9F26E-Fu6UShVO7MJK6MyQ/viewform',
    a: ['Key responsibilities', ['Main point of contact for assigned accounts', 'Develop and execute social media strategies tailored to client goals', 'Plan engaging content with creative teams across Instagram, Facebook, LinkedIn, TikTok and Twitter', 'Manage accounts, scheduling and audience engagement', 'Track, analyze and report on performance', 'Oversee day-to-day execution and timely delivery', 'Present plans, progress and results to clients', 'Identify growth through upselling and cross-selling']],
    b: ['Requirements', ['Bachelor\'s in Marketing, Communications, Business or related', '2+ years in account or social media management within an agency', 'Strong grasp of analytics, tools such as Hootsuite, Buffer or Meta Business Suite, and paid strategies', 'Exceptional interpersonal and presentation skills', 'Able to manage multiple clients and campaigns', 'Creative mindset and strong organization']] },
  { t: 'Senior Motion Graphic Designer', o: 'Cairo / Alexandria Office', f: 'https://docs.google.com/forms/d/1ZCdqN_xt2Xc3rFx9J1abatHblzfyQaZ7BOKylLNbYfs/edit',
    a: ['Key responsibilities', ['Create and animate compelling motion graphics for campaigns', 'Collaborate with creative and content teams', 'Manage timelines and deliver high-quality outputs', 'Use AI tools to enhance motion design workflows']],
    b: ['Requirements', ['Bachelor\'s in Motion Design, Animation or related (preferred)', '3-5 years in motion graphics production', 'After Effects, Premiere Pro and Adobe Creative Suite', 'Familiarity with AI tools such as Runway', 'Attention to detail and creative problem-solving', 'A showreel demonstrating your expertise']] },
  { t: 'Operations Manager', o: 'Alexandria Office', f: 'https://docs.google.com/forms/d/1iVUwIE3r3szohyqyQ_p9gPHwd50eiOtFnmLqZj_pe60/edit',
    a: ['Key responsibilities', ['Own and improve the operational workflow', 'Develop and maintain SOPs and processes', 'Manage capacity, workload, allocation and utilization', 'Monitor timelines, delivery, dependencies and risks', 'Solve bottlenecks and coordinate between departments', 'Support Team Leaders with workload planning', 'Manage project and workflow tools', 'Report on operations and track KPIs']],
    b: ['Qualifications', ['Bachelor\'s in Business Administration, Operations, Project Management or related', '5+ years in Operations, Project or Resource Management', 'Agency or production experience preferred', 'Strong workflow, resource planning and coordination skills', 'Experience building SOPs, reports and systems', 'Focused on efficiency, accountability, structure and scalability']] },
  { t: 'Senior Creative Copywriter', o: 'Alexandria Office', f: 'https://docs.google.com/forms/d/1Ef1CaLV2BfRxvImyIY12rQ3Tagm_z1MOkyk8sqThv9s/edit?usp=drive_web&ouid=109683629732774597516',
    a: ['Key responsibilities', ['Write and edit content for social, websites, email and ads', 'Craft persuasive, on-brand copy for campaigns and launches', 'Conceptualize ideas, narratives and content strategies', 'Collaborate with designers, videographers, marketing and production', 'Keep tone and messaging consistent', 'Analyze performance and adapt', 'Stay updated on digital trends and platform changes']],
    b: ['Requirements', ['Ideally 2+ years in content creation or copywriting', 'Exceptional writing and proofreading in Arabic and English', 'Strong understanding of social platforms and audience behavior', 'Storytelling and conceptual thinking', 'Organized and detail-minded', 'Planning tools, analytics and SEO are a plus']] },
];

/* ---------- The character (hand-drawn vector, traced from the client's mascot) ---------- */
const CC = { R: '#E5391C', RD: '#A61C10', O: '#F47A1A', Y: '#FBC31C', G: '#2F9B46', DK: '#33241F', RL: '#F4552B' };
const leaf = (x, y0, y1, w, f) => { const h = y1 - y0; return `<path fill="${f}" d="M${x} ${y0}C${x + w} ${y0 + h * .34} ${x + w} ${y0 + h * .68} ${x} ${y1}C${x - w} ${y0 + h * .68} ${x - w} ${y0 + h * .34} ${x} ${y0}Z"/>`; };
const st = (d, c, w = 8) => `<path fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`;
const dot = (x, y, c, r = 5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
function ornHalf(c) { // left half, mirrored for the right
  const { O, Y, G, R } = c;
  return `<path fill="${Y}" d="M207 28l9 22-21-5z"/>`
    + `<path fill="${Y}" d="M191 47C170 58 170 90 194 100 188 82 188 64 191 47Z"/><path fill="${G}" d="M188 60C178 68 178 84 190 92 186 80 186 70 188 60Z"/>`
    + st('M150 137C147 110 170 92 192 100 207 106 204 127 190 124 182 122 182 112 190 111', G, 7)
    + st('M161 143C170 124 186 124 207 139', O, 7) + st('M173 118C181 112 186 113 190 111', Y, 3)
    + st('M131 183C146 151 190 146 217 178', Y, 8) + st('M149 171C164 158 188 159 204 172', O, 5)
    + dot(166, 76, O) + dot(147, 113, O, 5.5) + dot(131, 146, O, 5.5) + dot(121, 176, Y, 4)
    + `<path fill="${Y}" d="M127 192C115 210 120 232 136 246 131 228 128 210 127 192Z"/>`
    + st('M127 272C127 244 164 236 167 256 168 270 148 271 148 258', O, 7) + st('M131 287C143 276 160 274 170 282', Y, 6)
    + st('M188 236C192 264 178 296 151 322', G, 10) + st('M178 282C172 298 164 310 154 320', Y, 2.5)
    + dot(139, 306, O, 6) + dot(171, 327, O, 5) + dot(155, 343, Y, 4.5) + dot(198, 318, Y, 4)
    + st('M165 347C180 356 190 372 205 390', O, 8) + st('M181 342C192 352 199 362 208 374', Y, 5);
}
function eyeL(id) {
  return `<g class="eye"><clipPath id="ec${id}"><path d="M144 196C158 180 186 180 205 203 186 214 158 212 144 196Z"/></clipPath>
<path fill="${CC.Y}" d="M130 193C150 163 196 166 218 208 192 226 150 220 130 193Z"/><path fill="${CC.G}" d="M138 195C155 172 192 174 211 206 189 219 154 215 138 195Z"/>
<g class="lid"><path fill="${CC.DK}" d="M144 196C158 180 186 180 205 203 186 214 158 212 144 196Z"/><g clip-path="url(#ec${id})"><g class="pupil"><circle cx="175" cy="197" r="10" fill="${CC.Y}"/><circle cx="175" cy="197" r="4.5" fill="${CC.DK}"/></g></g></g></g>`;
}
function maskCore(c, withEyes, id) {
  const m = 'translate(460 0) scale(-1 1)';
  const nose = `<path fill="${c.Y}" d="M213 146H247L233 214H227Z"/><path fill="${c.O}" d="M230 168L256 240C259 252 250 257 240 257H220C210 257 201 252 204 240Z"/><path fill="${c.Y}" d="M230 200L244 244H216Z"/><path fill="${c.RD||c.R}" d="M227.5 214h5V254h-5z"/>`;
  const mouth = `<path fill="${c.O}" d="M167 280C167 263 180 264 190 267H270C280 264 293 263 293 280V288C293 305 280 304 270 301H190C180 304 167 305 167 288Z"/><rect x="186" y="280" width="88" height="8" rx="4" fill="${c.RD||c.R}"/>`;
  const fore = leaf(230, 20, 162, 40, c.Y) + leaf(230, 40, 152, 29, c.G) + leaf(230, 56, 140, 20, c.O) + leaf(230, 72, 128, 12, c.R) + leaf(230, 86, 118, 5, c.O);
  const chin = leaf(230, 318, 411, 29, c.O) + leaf(230, 332, 402, 20, c.G) + leaf(230, 346, 394, 12, c.R) + leaf(230, 356, 386, 5, c.Y);
  return fore + chin + ornHalf(c) + `<g transform="${m}">${ornHalf(c)}</g>` + nose + mouth
    + (withEyes ? eyeL(id + 'a') + `<g transform="${m}">${eyeL(id + 'b')}</g>` : '');
}
const shadowC = { R: '#A61C10', O: '#A61C10', Y: '#A61C10', G: '#A61C10', RD: '#A61C10' };
const MASK = 'M230 11C312 22 349 128 347 214 345 312 290 397 230 416 170 397 115 312 113 214 111 128 148 22 230 11Z';
const maskSvg = id => `<path d="${MASK}" fill="#7E130B" transform="translate(0 8)"/><path d="${MASK}" fill="${CC.R}"/><path d="${MASK}" fill="none" stroke="${CC.RL}" stroke-width="3" transform="translate(230 214) scale(.975) translate(-230 -214)"/>
<g transform="translate(0 2.6)">${maskCore(shadowC, false, id)}</g>${maskCore(CC, true, id)}`;
function hem() { let s = ''; for (let i = 0; i < 9; i++) { const x = 139 + i * 20.2; s += `<path fill="${CC.Y}" d="M${x} 412l10-24 10 24z"/><path fill="${CC.G}" d="M${x + 4} 412l6-14 6 14z"/>`; } return s; }
const SK = '#8A4D2C', SKD = '#6B3820';
const foot = x => `<path stroke="${SK}" stroke-width="27" stroke-linecap="butt" d="M${x} 410V446"/><path fill="${SK}" d="M${x - 27} 462C${x - 27} 446 ${x + 27} 446 ${x + 27} 462 ${x + 27} 472 ${x - 27} 472 ${x - 27} 462Z"/><path fill="#4B2A18" d="M${x - 30} 466H${x + 30}C${x + 32} 474 ${x + 26} 477 ${x + 20} 477H${x - 20}C${x - 26} 477 ${x - 32} 474 ${x - 30} 466Z"/><path stroke="#4B2A18" stroke-width="7" d="M${x - 16} 453H${x + 16}"/>`;
const arm = () => `<g>${st('M136 280C120 292 106 310 102 330', '#8E1712', 30)}${st('M102 334L100 341', CC.Y, 30).replace('stroke-linecap="round"', 'stroke-linecap="butt"')}${st('M101 344L104 364', SK, 19)}<circle cx="105" cy="374" r="15.5" fill="${SK}"/><path stroke="${SKD}" stroke-width="2.5" fill="none" stroke-linecap="round" d="M98 381v-8M105 383v-9M112 381v-8"/></g>`;
const charSvg = id => `<svg viewBox="70 0 320 480" aria-hidden="true" focusable="false">
<ellipse cx="230" cy="476" rx="120" ry="9" fill="#000" opacity=".22"/>
<g class="fl">${foot(178)}</g><g class="fr">${foot(282)}</g>
<g class="up"><path fill="#8E1712" d="M150 290H310L322 414H138Z"/><path fill="#6E0F0B" d="M139 386H321L322 414H138Z"/>${hem()}
<g>${arm()}</g><g class="arm-r"><g transform="translate(460 0) scale(-1 1)">${arm()}</g></g>
${maskSvg(id)}</g></svg>`;
const peekSvg = () => `<svg viewBox="100 0 260 430" aria-hidden="true" focusable="false">${maskSvg('p')}</svg>`;

/* ---------- Partials ---------- */
const NAV = [['work.html', 'Work'], ['services.html', 'Services'], ['about.html', 'About'], ['careers.html', 'Careers'], ['contact.html', 'Contact']];
const WA = 'https://wa.me/201005420322';
const LOGO = up('2025/02/Kiwano-Logo-01-01.png', 1600);
const SOCIAL = [['Facebook', 'https://www.facebook.com/kiwanomedia'], ['Instagram', 'https://www.instagram.com/kiwanomedia'], ['TikTok', 'https://www.tiktok.com/@kiwanomedia'], ['YouTube', 'https://www.youtube.com/@kiwanomedia'], ['Behance', 'https://www.behance.net/kiwanomedia'], ['LinkedIn', 'https://www.linkedin.com/company/kiwanomedia/']];
function page({ file, title, desc, body, active, root = '' }) {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta name="theme-color" content="#C9211F">
<link rel="icon" href="${up('2025/02/cropped-Fav-Icon-02.png', 96)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preconnect" href="https://i0.wp.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Cairo:wght@700&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/style.css?v=4">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"KIWANO Media Agency","url":"https://kiwanomedia.com","email":"info@kiwanomedia.com","telephone":"+201005420322","address":{"@type":"PostalAddress","streetAddress":"Mostafa Kamel, Smouha","addressLocality":"Alexandria","addressCountry":"EG"}}</script>
</head><body>
<nav class="nav" aria-label="Main"><a href="${root}index.html" aria-label="KIWANO home"><img src="${LOGO}" alt="KIWANO" width="156" height="40"></a><ul>${NAV.map(([h, n]) => `<li><a href="${root}${h}"${active === h ? ' aria-current="page"' : ''}>${n}</a></li>`).join('')}</ul><button class="burger" aria-expanded="false">Menu</button></nav>
<div class="mob">${'<div>' + NAV.map(([h, n]) => `<a class="d" href="${root}${h}">${n}</a>`).join('') + '</div>'}<p>info@kiwanomedia.com<br>(+20) 100 542 0322</p></div>
<main>${body}</main>
<div class="band" aria-hidden="true"></div><section class="close sec"><div class="wrap cgrid"><div class="txt rv"><h2 class="d h2">Ready to be part of a <span class="i">tribe?</span></h2><a class="big" href="mailto:info@kiwanomedia.com">info@kiwanomedia.com</a><a class="big" href="tel:+201005420322" style="margin-top:4px">(+20) 100 542 0322</a><p style="margin-top:24px"><a class="btn" href="${root}contact.html">Start a brief</a></p></div><div class="peek">${peekSvg()}</div></div></section>
<footer class="foot"><div class="wrap"><div class="foot-g"><p>Mostafa Kamel, Smouha, Alexandria, Egypt<br>Sunday to Thursday, 10:00 to 05:00</p><ul>${SOCIAL.map(([n, u]) => `<li><a href="${u}" target="_blank" rel="noopener">${n}</a></li>`).join('')}</ul></div><div class="bot"><span>© 2026 Kiwano Media Agency</span><span>Tax ID 574-829-016</span></div></div></footer>
<a class="wa" href="${WA}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-3-.9-5.4-3.2-6.8-5.8-.5-.9-.9-2-.8-3 .1-.7.5-1.3 1-1.7.3-.2.8-.3 1.1 0l1 2.1c.1.3.1.5-.1.8l-.5.7c-.2.2-.2.4 0 .7.7 1.3 1.8 2.3 3.1 3 .3.1.5.1.7-.1l.7-.8c.2-.3.5-.3.8-.2l2 1c.3.2.4.3.5.5 0 .4 0 .9-.3 1.5Z"/></svg></a>
<div class="modal" role="dialog" aria-modal="true" aria-label="Video player"><button class="cl">Close</button><div class="boxv"></div></div>
<script src="${root}assets/app.js?v=3"></script></body></html>`;
  const fp = path.join(OUT, file); fs.mkdirSync(path.dirname(fp), { recursive: true }); fs.writeFileSync(fp, html);
}
const catNames = p => p.c.map(c => CATS[c]);

const BAND = '<div class="band" aria-hidden="true"></div>';
const PH = t => t[3] ? up(t[3], 500) : up('2025/06/Kiwanoer-1.png', 500);
/* ---------- Home ---------- */
const doorInner = id => `<div class="box"><div class="floor"></div><img class="wm" src="${LOGO}" alt=""><div class="fig"><div class="walker">${charSvg(id)}</div></div></div><div class="seam"></div>`;
const STRIPS = [
  ['dreem-eid-commercial-ad', 'Dreem', 'Years as the digital architects behind the leader in powdered desserts.'],
  ['rivoli', 'Rivoli', 'Social, production and two digital ad copies for a leader in personal care.'],
  ['hardees', 'Hardee\'s', 'Food photography that makes you hungry.'],
  ['ahlawy-biscuit', 'Ahlawy', 'Their social media journey started with us.'],
  ['3seer-time', '3seer Time', 'Production, social and design under one brand.'],
  ['mulberry', 'Mulberry', 'Warm photography and elegant branding for a cafe.'],
  ['al-asdekaa-spread-cheese-ad', 'Al Asdekaa', 'The ad that launched their squirt cheese bottle.'],
].map(([s, n, d]) => ({ p: P.find(x => x.s === s), n, d }));
const logos = Array.from({ length: 48 }, (_, i) => up(`2025/03/White-Logos-${String(i + 1).padStart(2, '0')}.webp`, 300));
const lrow = (a, b, rev) => { const l = logos.slice(a, b); return `<div class="lrow ${rev ? 'rev' : ''}">${[...l, ...l].map(u => `<img src="${u}" alt="" loading="lazy" width="751" height="439">`).join('')}</div>`; };
const home = `
<section class="gate" aria-label="Welcome"><div class="gate-pin">
  <div class="stage"><img class="poster" src="${up('2025/05/highlight-Cover-23.webp', 1800)}" alt=""><div class="yt" data-id="ocGunjuen58"></div>
    <div class="st-in"><h1 class="d">We know it all,<br><span class="i">have it all.</span></h1><div class="st-acts"><button class="btn" data-yt="ocGunjuen58">Watch with sound</button><a class="btn line" href="work.html">See the work</a></div></div></div>
  <div class="door l">${doorInner('l')}</div><div class="door r">${doorInner('r')}</div>
  <div class="hi ar" dir="rtl" lang="ar">أهلاً!</div>
  <p class="g-t a">Made in Egypt, rooted in Africa, driven by global ambition.</p><p class="g-t b">Scroll to come in</p>
</div></section>
${BAND}<section class="flood sec"><div class="wrap"><p class="d state rv">KIWANO is where imagination meets impact. A <span class="i">tribe</span> of storytellers and makers, with the whole pipeline under one roof.</p>
<ul class="nums rv">${[[NUMS[0], 'Years in the market'], [NUMS[1], 'Satisfied clients'], [NUMS[2], 'Videos produced'], [NUMS[3], 'Views']].map(([n, l]) => `<li><b>${n[0]}${n[1]}</b><span>${l}</span></li>`).join('')}</ul></div></section>
<section class="sec"><div class="wrap"><div class="head rv"><h2 class="d h2">The <span class="i">work</span></h2><a class="lnk" href="work.html">All ${P.length} projects</a></div>
<div class="strips rv">${STRIPS.map((s, i) => `<a class="strip ${i === 0 ? 'on' : ''}" href="work/${s.p.s}.html"><img src="${up(s.p.cv, 1500)}" alt="" loading="lazy"><span class="v">${esc(s.n)}</span><div class="tx"><h3 class="d">${esc(s.n)}</h3><p>${s.d}</p></div></a>`).join('')}</div></div></section>
<section class="sec" style="padding-top:0"><div class="wrap"><h2 class="d h2 rv">What we <span class="i">do</span></h2><div class="rows rv">${SERV.map(s => `<a class="row" href="services.html#${s.k}"><span class="d">${s.n}</span><p>${s.hook}</p></a>`).join('')}</div></div></section>
<section class="food"><div class="wrap fg2"><div class="rv"><h2 class="d">Yes, there are <span class="i">chefs</span> in the office.</h2><p>Six food stylists, hand models and chefs work next to the camera crew. That's why our food looks the way it does.</p></div><div class="fims rv">${[['hardees', "Hardee's"], ['kebab-shaker', 'Kebab Shaker'], ['pubs-pizza', "Pub's Pizza"]].map(([s, n]) => `<a href="work/${s}.html" aria-label="${esc(n)}"><img src="${up(P.find(x => x.s === s).cv, 700)}" alt="" loading="lazy"></a>`).join('')}</div></div></section>
<section class="sec people"><div class="wrap head rv"><h2 class="d h2">The <span class="i">people</span></h2><a class="lnk" href="about.html#team">Meet all ${TEAM.length + 2} kiwanoers</a></div><div class="pwrap rv"><div class="prow">${(() => { const l = [['Ahmed Sabry', 'Cofounder / CEO', '', '2025/02/Ceos-86-scaled.webp', 1], ['Ahmed Gamal', 'Cofounder / COO', '', '2025/02/Ceos-87-scaled.webp', 1], ...TEAM.filter(t => t[3])]; return [...l, ...l].map((t, i) => `<figure class="pc" ${i >= l.length ? 'aria-hidden="true"' : ''}><div class="pi ${t[4] ? 'fd' : ''}"><img src="${up(t[3], 500)}" alt="${i >= l.length ? '' : esc(t[0])}" loading="lazy"></div>${t[4] ? '' : `<figcaption><b>${t[0]}</b><span>${t[1]}</span></figcaption>`}</figure>`).join(''); })()}</div></div></section>
<section class="sec" style="padding-top:0"><div class="wrap"><h2 class="d h2 rv">200+ clients, <span class="i">some of them</span></h2></div><div class="lwrap rv">${lrow(0, 24)}${lrow(24, 48, 1)}</div></section>
<section class="sec" style="padding-top:0"><div class="wrap says">${[
  ['One of the most creative, responsive, and competent teams I ever worked with throughout my 18 years career in Marketing.', QUOTES[2]],
  ['Their communication was consistently clear and prompt, keeping us informed at every step.', QUOTES[3]],
  ['KIWANO set for us everything we requested and more.', QUOTES[0]],
].map(([q, w]) => `<figure class="rv"><blockquote>"${q}"</blockquote><figcaption><b>${w[0]}</b><span>${w[1]}</span></figcaption></figure>`).join('')}</div></section>`;
page({ file: 'index.html', title: 'KIWANO | Full-Service Marketing & Media Agency in Egypt', desc: 'A content-first media agency in Alexandria, Egypt. Commercial ads, media production, social media, talent management and creative design, all under one roof.', body: home });

/* ---------- About ---------- */
const about = `
<header class="pg red"><div class="wrap"><h1 class="d h1">A fearless <span class="i">tribe.</span></h1><p class="lead">Made in Egypt, rooted in Africa and driven by global ambition. Storytellers, makers and innovators.</p></div></header>${BAND}
<section class="sec"><div class="wrap two"><h2 class="d h2 rv" style="font-size:clamp(2.2rem,4.6vw,5rem)">We don't just create content.</h2><div class="rv"><p class="lead">We build movements, moments and meaning.</p><p style="margin-top:18px" class="dim">As a content-first media agency, we craft bold, culture-driven stories and visuals for mobile, social and cinematic screens. With the entire creative pipeline under one roof, we move fast, stay flexible and deliver uncompromising quality, and we mentor a new generation of fearless creators along the way.</p><p class="dim">Our guides are authenticity, creativity, excellence, agility, respect and impact.</p></div></div></section>
<section class="sec" style="padding-top:0"><div class="wrap"><h2 class="d h2 rv" style="margin-bottom:.6em">The <span class="i">founders</span></h2><div class="found rv"><img src="${up('2025/02/Ceos-86-scaled.webp', 900)}" alt="Ahmed Sabry, Cofounder and CEO" loading="lazy"><img src="${up('2025/02/Ceos-87-scaled.webp', 900)}" alt="Ahmed Gamal, Cofounder and COO" loading="lazy"></div></div></section>
<section class="sec" style="padding-top:0" id="team"><div class="wrap"><h2 class="d h2 rv" style="margin-bottom:.6em">The <span class="i">kiwanoers</span></h2>${DEPTS.map(([k, n]) => `<div class="dep"><h3>${n}</h3><div class="tg">${TEAM.filter(t => t[2] === k).map(t => `<figure class="pc"><div class="pi"><img src="${PH(t)}" alt="${t[3] ? esc(t[0]) : ''}" loading="lazy"></div><figcaption><b>${t[0]}</b><span>${t[1]}</span></figcaption></figure>`).join('')}</div></div>`).join('')}</div></section>`;
page({ file: 'about.html', title: 'About KIWANO | A Tribe of Storytellers in Egypt', desc: 'KIWANO is a content-first media agency made in Egypt and rooted in Africa. Meet the founders and the kiwanoers.', body: about, active: 'about.html' });

/* ---------- Services ---------- */
const svc = `
<header class="pg"><div class="wrap"><h1 class="d h1">Five crafts,<br><span class="i">one roof.</span></h1><p class="lead">What each service includes and who works on it. Use one, or run them together.</p></div></header>
<div class="wrap">${SERV.map(s => { const ex = P.filter(p => p.c.includes(s.cat)); return `<section class="sv two" id="${s.k}"><h2 class="d h2 rv" style="font-size:clamp(2.2rem,4.8vw,5.2rem)">${s.n}</h2><div class="rv"><p class="lead">${s.hook}</p><p class="dim" style="margin-top:12px">${s.body}</p><ul class="list">${s.get.map(g => `<li>${g}</li>`).join('')}</ul><p class="who">On it: ${s.who.join(', ')}.</p><div class="ims">${ex.slice(0, 2).map(p => `<a href="work/${p.s}.html" aria-label="${esc(p.t)}"><img src="${up(p.cv, 800)}" alt="" loading="lazy"></a>`).join('')}</div><p style="margin-top:18px;display:flex;gap:22px;flex-wrap:wrap"><a class="lnk" href="contact.html#${s.k}">Brief us on this</a><a class="lnk" href="work.html#${s.cat}">See ${ex.length} project${ex.length > 1 ? 's' : ''}</a></p></div></section>`; }).join('')}</div>
<section class="sec" style="background:var(--ink-2)"><div class="wrap two"><h2 class="d h2 rv" style="font-size:clamp(2.2rem,4.8vw,5.2rem)">How the work <span class="i">moves</span></h2><div class="rv"><h3 style="margin-bottom:10px">On a social media account</h3><ol class="steps">${TRACKS.social.map(([a, b]) => `<li><div><b>${a}</b><span>${b}</span></div></li>`).join('')}</ol><h3 style="margin:36px 0 10px">On a production</h3><ol class="steps">${TRACKS.prod.map(([a, b]) => `<li><div><b>${a}</b><span>${b}</span></div></li>`).join('')}</ol></div></div></section>
<section class="sec"><div class="wrap two"><h2 class="d h2 rv" style="font-size:clamp(2.2rem,4.8vw,5.2rem)">Questions</h2><div class="rv">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}<div style="margin-top:34px"><h3 style="margin-bottom:6px">Read more</h3>${GUIDES.map(([u, t]) => `<p style="padding:.25em 0"><a class="lnk" href="https://kiwanomedia.com/${u}/" target="_blank" rel="noopener">${t}</a></p>`).join('')}</div></div></div></section>`;
page({ file: 'services.html', title: 'Services | Commercial Ads, Media Production, Social Media | KIWANO', desc: 'What KIWANO delivers across commercial ads, media production, social media, talent management and creative designs, and who works on each.', body: svc, active: 'services.html' });

/* ---------- Work ---------- */
const counts = k => P.filter(p => p.c.includes(k)).length;
const work = `
<header class="pg"><div class="wrap"><h1 class="d h1">The <span class="i">work</span></h1></div></header>
<section style="padding-bottom:var(--sec)"><div class="wrap"><div class="fil" role="group" aria-label="Filter by service"><button data-c="all" aria-pressed="true">All<sup>${P.length}</sup></button>${Object.entries(CATS).map(([k, n]) => `<button data-c="${k}" aria-pressed="false">${n}<sup>${counts(k)}</sup></button>`).join('')}</div>
<div class="wgrid" data-f>${P.map(p => `<a class="wc" href="work/${p.s}.html" data-c="${p.c.join(' ')}"><div class="im"><img src="${up(p.cv, 1100)}" alt="${esc(p.t)} cover" loading="lazy"></div><h3>${esc(p.t)}</h3><small>${catNames(p).join(', ')}</small></a>`).join('')}</div></div></section>`;
page({ file: 'work.html', title: 'Work | 33 Projects by KIWANO Media Agency', desc: 'Commercial ads, media production, social media, talent and design work by KIWANO for Dreem, Rivoli, Hardee\'s, Americana and more.', body: work, active: 'work.html' });

/* ---------- Case pages ---------- */
P.forEach((p, i) => {
  const nx = P[(i + 1) % P.length];
  const body = `
<header class="pg" style="padding-bottom:clamp(24px,3vw,44px)"><div class="wrap"><p style="margin-bottom:20px"><a class="lnk" href="../work.html">All work</a></p><div class="case-t"><h1 class="d h2">${esc(p.t)}${p.ar ? `<br><span class="ar" dir="rtl" lang="ar" style="font-size:.6em">${p.ar}</span>` : ''}</h1><p class="dim">${catNames(p).join(', ')}</p></div>${p.d ? `<p class="lead" style="color:inherit">${esc(p.d)}</p>` : ''}</div></header>
<section><div class="wrap gal"><img src="${up(p.cv, 1800)}" alt="${esc(p.t)} cover">
${(p.yt || []).map(id => `<div class="vid"><button data-yt="${id}" data-inline aria-label="Play video"><img src="https://i.ytimg.com/vi/${id}/maxresdefault.jpg" alt="" loading="lazy"><span class="pl">Play</span></button></div>`).join('')}
${p.g.map(g => `<img src="${up(g, 1800)}" alt="${esc(p.t)} project image" loading="lazy">`).join('')}
</div></section>
<a class="next" href="${nx.s}.html"><div class="wrap"><p>Next</p><p class="d h2">${esc(nx.t)}</p></div></a>`;
  page({ file: `work/${p.s}.html`, title: `${p.t} | KIWANO Work`, desc: p.d || `${p.t}: ${catNames(p).join(', ')} by KIWANO Media Agency.`, body, active: 'work.html', root: '../' });
});

/* ---------- Careers ---------- */
const careers = `
<header class="pg"><div class="wrap"><h1 class="d h1">Join the <span class="i">tribe.</span></h1><p class="lead">Applications are reviewed within a month, and we only contact shortlisted candidates. After an interview, feedback can take up to two weeks. If you hear nothing by then, you weren't shortlisted this time, and thank you for trying.</p></div></header>
<section style="padding-bottom:var(--sec)"><div class="wrap">${ROLES.map(r => `<details class="role"><summary>${r.t}<small>${r.o}</small></summary>${r.intro ? `<p style="padding:0 0 16px;max-width:70ch">${r.intro}</p>` : ''}<div class="bd"><div><h4>${r.a[0]}</h4><ul>${r.a[1].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>${r.b[0]}</h4><ul>${r.b[1].map(x => `<li>${esc(x)}</li>`).join('')}</ul></div></div><p style="padding-bottom:26px"><a class="btn" href="${r.f}" target="_blank" rel="noopener">Apply now</a></p></details>`).join('')}</div></section>`;
page({ file: 'careers.html', title: 'Careers at KIWANO | Open Roles in Alexandria & Cairo', desc: 'Open roles at KIWANO Media Agency, including internships, account management, motion design, operations, sales and copywriting.', body: careers, active: 'careers.html' });

/* ---------- Contact ---------- */
const contact = `
<header class="pg red"><div class="wrap"><h1 class="d h1">We're the <span class="i">co-authors</span> you need.</h1><p class="lead">Tell us what you're after. We'll review it and schedule a free call to learn more about your needs.</p></div></header>${BAND}
<section class="sec"><div class="wrap"><form class="frm" id="brief" novalidate>
<fieldset><legend>What do you need?</legend><div class="cks">${SERV.map(s => `<label><input type="checkbox" name="svc" value="${s.k}" data-l="${s.n}"><span>${s.n}</span></label>`).join('')}</div></fieldset>
<fieldset><legend>Who should we call?</legend><div class="fg"><label>Your name<input name="name" autocomplete="name" required></label><label>Brand<input name="brand" autocomplete="organization" required></label><label>Phone or WhatsApp<input name="phone" type="tel" autocomplete="tel"></label><label class="full">What should change after this work?<textarea name="goal" rows="2"></textarea></label></div></fieldset>
<div><div class="acts"><a class="btn" id="wa" href="${WA}" target="_blank" rel="noopener">Send on WhatsApp</a><a class="lnk" id="mail" href="mailto:info@kiwanomedia.com">Send by email</a></div><p class="err" role="alert"></p></div></form></div></section>
<section class="sec" style="padding-top:0"><div class="wrap cin"><div><h3>Alexandria</h3><p>Mostafa Kamel, Smouha, Alexandria, Egypt</p></div><div><h3>Cairo</h3><p>Soon</p></div><div><h3>Phone</h3><p><a href="tel:+201005420322">(+20) 100 542 0322</a><br><a href="tel:+201206866663">(+20) 120 686 6663</a></p></div><div><h3>Hours</h3><p>Sunday to Thursday<br>10:00 to 05:00</p></div></div></section>`;
page({ file: 'contact.html', title: 'Contact KIWANO | Start a Brief', desc: 'Start a brief with KIWANO Media Agency in Alexandria, Egypt.', body: contact, active: 'contact.html' });

console.log('Built', 6 + P.length, 'pages.');
