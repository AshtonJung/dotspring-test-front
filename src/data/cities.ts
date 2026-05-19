export interface CityData {
  name: string
  nameKo: string
  countryKo: string
  imageUrl: string
}

// Unsplash CDN: 구형 숫자 ID 형식만 작동 (예: 1540959733332-eab4deabeeaf)
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=500&fit=crop&q=80`

// 슬러그 ID가 없거나 깨진 도시는 Picsum으로 대체 (시드 = 도시명, 항상 일정한 이미지)
const picsum = (seed: string) =>
  `https://picsum.photos/seed/${seed}/800/500`

export const CITIES: CityData[] = [
  // ── 한국 ──────────────────────────────────────────────────────────────────
  // 특별시 / 광역시 / 특별자치시
  { name: 'Seoul',       nameKo: '서울',     countryKo: '한국', imageUrl: picsum('seoul-korea-city') },
  { name: 'Busan',       nameKo: '부산',     countryKo: '한국', imageUrl: picsum('busan-korea-coast') },
  { name: 'Incheon',     nameKo: '인천',     countryKo: '한국', imageUrl: picsum('incheon-korea-port') },
  { name: 'Daegu',       nameKo: '대구',     countryKo: '한국', imageUrl: picsum('daegu-korea-city') },
  { name: 'Daejeon',     nameKo: '대전',     countryKo: '한국', imageUrl: picsum('daejeon-korea') },
  { name: 'Gwangju',     nameKo: '광주',     countryKo: '한국', imageUrl: picsum('gwangju-korea') },
  { name: 'Ulsan',       nameKo: '울산',     countryKo: '한국', imageUrl: picsum('ulsan-korea') },
  { name: 'Sejong',      nameKo: '세종',     countryKo: '한국', imageUrl: picsum('sejong-korea') },
  // 경기도
  { name: 'Suwon',       nameKo: '수원',     countryKo: '한국', imageUrl: picsum('suwon-korea') },
  { name: 'Seongnam',    nameKo: '성남',     countryKo: '한국', imageUrl: picsum('seongnam-korea') },
  { name: 'Goyang',      nameKo: '고양',     countryKo: '한국', imageUrl: picsum('goyang-korea') },
  { name: 'Yongin',      nameKo: '용인',     countryKo: '한국', imageUrl: picsum('yongin-korea') },
  { name: 'Bucheon',     nameKo: '부천',     countryKo: '한국', imageUrl: picsum('bucheon-korea') },
  { name: 'Ansan',       nameKo: '안산',     countryKo: '한국', imageUrl: picsum('ansan-korea') },
  { name: 'Anyang',      nameKo: '안양',     countryKo: '한국', imageUrl: picsum('anyang-korea') },
  { name: 'Namyangju',   nameKo: '남양주',   countryKo: '한국', imageUrl: picsum('namyangju-korea') },
  { name: 'Hwaseong',    nameKo: '화성',     countryKo: '한국', imageUrl: picsum('hwaseong-korea') },
  { name: 'Pyeongtaek',  nameKo: '평택',     countryKo: '한국', imageUrl: picsum('pyeongtaek-korea') },
  { name: 'Uijeongbu',   nameKo: '의정부',   countryKo: '한국', imageUrl: picsum('uijeongbu-korea') },
  { name: 'Siheung',     nameKo: '시흥',     countryKo: '한국', imageUrl: picsum('siheung-korea') },
  { name: 'Paju',        nameKo: '파주',     countryKo: '한국', imageUrl: picsum('paju-korea') },
  { name: 'Gwangmyeong', nameKo: '광명',     countryKo: '한국', imageUrl: picsum('gwangmyeong-korea') },
  { name: 'Gimpo',       nameKo: '김포',     countryKo: '한국', imageUrl: picsum('gimpo-korea') },
  { name: 'Gunpo',       nameKo: '군포',     countryKo: '한국', imageUrl: picsum('gunpo-korea') },
  { name: 'Gwangju-G',   nameKo: '광주(경기)',countryKo: '한국', imageUrl: picsum('gwangju-gyeonggi') },
  { name: 'Icheon',      nameKo: '이천',     countryKo: '한국', imageUrl: picsum('icheon-korea') },
  { name: 'Yangju',      nameKo: '양주',     countryKo: '한국', imageUrl: picsum('yangju-korea') },
  { name: 'Osan',        nameKo: '오산',     countryKo: '한국', imageUrl: picsum('osan-korea') },
  { name: 'Guri',        nameKo: '구리',     countryKo: '한국', imageUrl: picsum('guri-korea') },
  { name: 'Anseong',     nameKo: '안성',     countryKo: '한국', imageUrl: picsum('anseong-korea') },
  { name: 'Uiwang',      nameKo: '의왕',     countryKo: '한국', imageUrl: picsum('uiwang-korea') },
  { name: 'Hanam',       nameKo: '하남',     countryKo: '한국', imageUrl: picsum('hanam-korea') },
  { name: 'Yeoju',       nameKo: '여주',     countryKo: '한국', imageUrl: picsum('yeoju-korea') },
  { name: 'Dongducheon', nameKo: '동두천',   countryKo: '한국', imageUrl: picsum('dongducheon-korea') },
  { name: 'Gwacheon',    nameKo: '과천',     countryKo: '한국', imageUrl: picsum('gwacheon-korea') },
  // 강원특별자치도
  { name: 'Chuncheon',   nameKo: '춘천',     countryKo: '한국', imageUrl: picsum('chuncheon-korea') },
  { name: 'Wonju',       nameKo: '원주',     countryKo: '한국', imageUrl: picsum('wonju-korea') },
  { name: 'Gangneung',   nameKo: '강릉',     countryKo: '한국', imageUrl: picsum('gangneung-korea') },
  { name: 'Donghae',     nameKo: '동해',     countryKo: '한국', imageUrl: picsum('donghae-korea') },
  { name: 'Taebaek',     nameKo: '태백',     countryKo: '한국', imageUrl: picsum('taebaek-korea') },
  { name: 'Sokcho',      nameKo: '속초',     countryKo: '한국', imageUrl: picsum('sokcho-korea') },
  { name: 'Samcheok',    nameKo: '삼척',     countryKo: '한국', imageUrl: picsum('samcheok-korea') },
  // 충청북도
  { name: 'Cheongju',    nameKo: '청주',     countryKo: '한국', imageUrl: picsum('cheongju-korea') },
  { name: 'Chungju',     nameKo: '충주',     countryKo: '한국', imageUrl: picsum('chungju-korea') },
  { name: 'Jecheon',     nameKo: '제천',     countryKo: '한국', imageUrl: picsum('jecheon-korea') },
  // 충청남도
  { name: 'Cheonan',     nameKo: '천안',     countryKo: '한국', imageUrl: picsum('cheonan-korea') },
  { name: 'Gongju',      nameKo: '공주',     countryKo: '한국', imageUrl: picsum('gongju-korea') },
  { name: 'Boryeong',    nameKo: '보령',     countryKo: '한국', imageUrl: picsum('boryeong-korea') },
  { name: 'Asan',        nameKo: '아산',     countryKo: '한국', imageUrl: picsum('asan-korea') },
  { name: 'Seosan',      nameKo: '서산',     countryKo: '한국', imageUrl: picsum('seosan-korea') },
  { name: 'Nonsan',      nameKo: '논산',     countryKo: '한국', imageUrl: picsum('nonsan-korea') },
  { name: 'Gyeryong',    nameKo: '계룡',     countryKo: '한국', imageUrl: picsum('gyeryong-korea') },
  { name: 'Dangjin',     nameKo: '당진',     countryKo: '한국', imageUrl: picsum('dangjin-korea') },
  // 전북특별자치도
  { name: 'Jeonju',      nameKo: '전주',     countryKo: '한국', imageUrl: picsum('jeonju-korea') },
  { name: 'Gunsan',      nameKo: '군산',     countryKo: '한국', imageUrl: picsum('gunsan-korea') },
  { name: 'Iksan',       nameKo: '익산',     countryKo: '한국', imageUrl: picsum('iksan-korea') },
  { name: 'Jeongeup',    nameKo: '정읍',     countryKo: '한국', imageUrl: picsum('jeongeup-korea') },
  { name: 'Namwon',      nameKo: '남원',     countryKo: '한국', imageUrl: picsum('namwon-korea') },
  { name: 'Gimje',       nameKo: '김제',     countryKo: '한국', imageUrl: picsum('gimje-korea') },
  // 전라남도
  { name: 'Mokpo',       nameKo: '목포',     countryKo: '한국', imageUrl: picsum('mokpo-korea') },
  { name: 'Yeosu',       nameKo: '여수',     countryKo: '한국', imageUrl: picsum('yeosu-korea') },
  { name: 'Suncheon',    nameKo: '순천',     countryKo: '한국', imageUrl: picsum('suncheon-korea') },
  { name: 'Naju',        nameKo: '나주',     countryKo: '한국', imageUrl: picsum('naju-korea') },
  { name: 'Gwangyang',   nameKo: '광양',     countryKo: '한국', imageUrl: picsum('gwangyang-korea') },
  // 경상북도
  { name: 'Pohang',      nameKo: '포항',     countryKo: '한국', imageUrl: picsum('pohang-korea') },
  { name: 'Gyeongju',    nameKo: '경주',     countryKo: '한국', imageUrl: picsum('gyeongju-korea') },
  { name: 'Gimcheon',    nameKo: '김천',     countryKo: '한국', imageUrl: picsum('gimcheon-korea') },
  { name: 'Andong',      nameKo: '안동',     countryKo: '한국', imageUrl: picsum('andong-korea') },
  { name: 'Gumi',        nameKo: '구미',     countryKo: '한국', imageUrl: picsum('gumi-korea') },
  { name: 'Yeongju',     nameKo: '영주',     countryKo: '한국', imageUrl: picsum('yeongju-korea') },
  { name: 'Yeongcheon',  nameKo: '영천',     countryKo: '한국', imageUrl: picsum('yeongcheon-korea') },
  { name: 'Sangju',      nameKo: '상주',     countryKo: '한국', imageUrl: picsum('sangju-korea') },
  { name: 'Mungyeong',   nameKo: '문경',     countryKo: '한국', imageUrl: picsum('mungyeong-korea') },
  { name: 'Gyeongsan',   nameKo: '경산',     countryKo: '한국', imageUrl: picsum('gyeongsan-korea') },
  // 경상남도
  { name: 'Changwon',    nameKo: '창원',     countryKo: '한국', imageUrl: picsum('changwon-korea') },
  { name: 'Jinju',       nameKo: '진주',     countryKo: '한국', imageUrl: picsum('jinju-korea') },
  { name: 'Tongyeong',   nameKo: '통영',     countryKo: '한국', imageUrl: picsum('tongyeong-korea') },
  { name: 'Sacheon',     nameKo: '사천',     countryKo: '한국', imageUrl: picsum('sacheon-korea') },
  { name: 'Gimhae',      nameKo: '김해',     countryKo: '한국', imageUrl: picsum('gimhae-korea') },
  { name: 'Miryang',     nameKo: '밀양',     countryKo: '한국', imageUrl: picsum('miryang-korea') },
  { name: 'Geoje',       nameKo: '거제',     countryKo: '한국', imageUrl: picsum('geoje-korea') },
  { name: 'Yangsan',     nameKo: '양산',     countryKo: '한국', imageUrl: picsum('yangsan-korea') },
  // 제주특별자치도
  { name: 'Jeju',        nameKo: '제주',     countryKo: '한국', imageUrl: picsum('jeju-island-korea') },
  { name: 'Seogwipo',    nameKo: '서귀포',   countryKo: '한국', imageUrl: picsum('seogwipo-jeju') },

  // 일본
  { name: 'Tokyo',    nameKo: '도쿄',   countryKo: '일본', imageUrl: unsplash('1540959733332-eab4deabeeaf') },
  { name: 'Osaka',    nameKo: '오사카', countryKo: '일본', imageUrl: unsplash('1590559899731-a382839e5549') },
  { name: 'Kyoto',    nameKo: '교토',   countryKo: '일본', imageUrl: unsplash('1528360983277-13d401cdc186') },
  { name: 'Sapporo',  nameKo: '삿포로', countryKo: '일본', imageUrl: unsplash('1611246708939-d0a73eddfc52') },
  { name: 'Fukuoka',  nameKo: '후쿠오카', countryKo: '일본', imageUrl: unsplash('1490806842957-31f4c9a91c65') },
  { name: 'Nara',     nameKo: '나라',   countryKo: '일본', imageUrl: picsum('nara-japan') },
  { name: 'Okinawa',  nameKo: '오키나와', countryKo: '일본', imageUrl: picsum('okinawa-beach') },

  // 동남아시아
  { name: 'Bangkok',        nameKo: '방콕',       countryKo: '태국',       imageUrl: unsplash('1563492065599-dc10d69a4f58') },
  { name: 'Phuket',         nameKo: '푸껫',       countryKo: '태국',       imageUrl: picsum('phuket-thailand') },
  { name: 'Chiang Mai',     nameKo: '치앙마이',   countryKo: '태국',       imageUrl: picsum('chiangmai-thailand') },
  { name: 'Koh Samui',      nameKo: '코사무이',   countryKo: '태국',       imageUrl: picsum('kohsamui-beach') },
  { name: 'Singapore',      nameKo: '싱가포르',   countryKo: '싱가포르',   imageUrl: unsplash('1525625293386-3f8f99389edd') },
  { name: 'Bali',           nameKo: '발리',       countryKo: '인도네시아', imageUrl: unsplash('1537996134338-b69e4f2124b2') },
  { name: 'Yogyakarta',     nameKo: '족자카르타', countryKo: '인도네시아', imageUrl: picsum('yogyakarta-indonesia') },
  { name: 'Lombok',         nameKo: '롬복',       countryKo: '인도네시아', imageUrl: picsum('lombok-island') },
  { name: 'Hanoi',          nameKo: '하노이',     countryKo: '베트남',     imageUrl: picsum('hanoi-vietnam') },
  { name: 'Ho Chi Minh City', nameKo: '호치민',   countryKo: '베트남',     imageUrl: picsum('hochiminhcity-vietnam') },
  { name: 'Da Nang',        nameKo: '다낭',       countryKo: '베트남',     imageUrl: picsum('danang-vietnam') },
  { name: 'Kuala Lumpur',   nameKo: '쿠알라룸푸르', countryKo: '말레이시아', imageUrl: picsum('kualalumpur-malaysia') },
  { name: 'Cebu',           nameKo: '세부',       countryKo: '필리핀',     imageUrl: picsum('cebu-philippines') },
  { name: 'Manila',         nameKo: '마닐라',     countryKo: '필리핀',     imageUrl: picsum('manila-philippines') },
  { name: 'Boracay',        nameKo: '보라카이',   countryKo: '필리핀',     imageUrl: picsum('boracay-beach') },
  { name: 'Siem Reap',      nameKo: '씨엠립',     countryKo: '캄보디아',   imageUrl: picsum('siemreap-angkor') },
  { name: 'Luang Prabang',  nameKo: '루앙프라방', countryKo: '라오스',     imageUrl: picsum('luangprabang-laos') },
  { name: 'Yangon',         nameKo: '양곤',       countryKo: '미얀마',     imageUrl: picsum('yangon-myanmar') },

  // 유럽
  { name: 'Paris',        nameKo: '파리',       countryKo: '프랑스',   imageUrl: unsplash('1499856871958-5b9627545d1a') },
  { name: 'Nice',         nameKo: '니스',       countryKo: '프랑스',   imageUrl: picsum('nice-france-coast') },
  { name: 'Lyon',         nameKo: '리옹',       countryKo: '프랑스',   imageUrl: unsplash('1543200461-7e7b27d44a26') },
  { name: 'Marseille',    nameKo: '마르세유',   countryKo: '프랑스',   imageUrl: unsplash('1558618666-fcd25c85cd64') },
  { name: 'London',       nameKo: '런던',       countryKo: '영국',     imageUrl: unsplash('1513635269975-59663e0ac1ad') },
  { name: 'Edinburgh',    nameKo: '에든버러',   countryKo: '영국',     imageUrl: picsum('edinburgh-scotland') },
  { name: 'Rome',         nameKo: '로마',       countryKo: '이탈리아', imageUrl: unsplash('1552832230-c0197dd311b5') },
  { name: 'Venice',       nameKo: '베네치아',   countryKo: '이탈리아', imageUrl: picsum('venice-canal') },
  { name: 'Florence',     nameKo: '피렌체',     countryKo: '이탈리아', imageUrl: picsum('florence-italy') },
  { name: 'Milan',        nameKo: '밀라노',     countryKo: '이탈리아', imageUrl: picsum('milan-italy') },
  { name: 'Amalfi',       nameKo: '아말피',     countryKo: '이탈리아', imageUrl: unsplash('1516483638261-f4dbaf036963') },
  { name: 'Cinque Terre', nameKo: '친퀘테레',   countryKo: '이탈리아', imageUrl: picsum('cinqueterre-italy') },
  { name: 'Barcelona',    nameKo: '바르셀로나', countryKo: '스페인',   imageUrl: unsplash('1539037116277-4db20889f2d4') },
  { name: 'Madrid',       nameKo: '마드리드',   countryKo: '스페인',   imageUrl: picsum('madrid-spain') },
  { name: 'Seville',      nameKo: '세비야',     countryKo: '스페인',   imageUrl: picsum('seville-spain') },
  { name: 'Granada',      nameKo: '그라나다',   countryKo: '스페인',   imageUrl: unsplash('1543248939-4296e1fea89b') },
  { name: 'Valencia',     nameKo: '발렌시아',   countryKo: '스페인',   imageUrl: unsplash('1562883676-8c7f158cbef9') },
  { name: 'Amsterdam',    nameKo: '암스테르담', countryKo: '네덜란드', imageUrl: unsplash('1512470810-6e5f06c99f24') },
  { name: 'Brussels',     nameKo: '브뤼셀',     countryKo: '벨기에',   imageUrl: unsplash('1509966756634-9c23dd48de32') },
  { name: 'Bruges',       nameKo: '브뤼헤',     countryKo: '벨기에',   imageUrl: picsum('bruges-belgium') },
  { name: 'Berlin',       nameKo: '베를린',     countryKo: '독일',     imageUrl: picsum('berlin-germany') },
  { name: 'Prague',       nameKo: '프라하',     countryKo: '체코',     imageUrl: picsum('prague-czech') },
  { name: 'Vienna',       nameKo: '빈',         countryKo: '오스트리아', imageUrl: picsum('vienna-austria') },
  { name: 'Salzburg',     nameKo: '잘츠부르크', countryKo: '오스트리아', imageUrl: picsum('salzburg-austria') },
  { name: 'Hallstatt',    nameKo: '할슈타트',   countryKo: '오스트리아', imageUrl: picsum('hallstatt-lake') },
  { name: 'Budapest',     nameKo: '부다페스트', countryKo: '헝가리',   imageUrl: picsum('budapest-hungary') },
  { name: 'Porto',        nameKo: '포르투',     countryKo: '포르투갈', imageUrl: picsum('porto-portugal') },
  { name: 'Lisbon',       nameKo: '리스본',     countryKo: '포르투갈', imageUrl: picsum('lisbon-portugal') },
  { name: 'Dubrovnik',    nameKo: '두브로브니크', countryKo: '크로아티아', imageUrl: picsum('dubrovnik-croatia') },
  { name: 'Santorini',    nameKo: '산토리니',   countryKo: '그리스',   imageUrl: picsum('santorini-greece') },
  { name: 'Mykonos',      nameKo: '미코노스',   countryKo: '그리스',   imageUrl: unsplash('1555400038-63f5ba517a47') },
  { name: 'Athens',       nameKo: '아테네',     countryKo: '그리스',   imageUrl: picsum('athens-acropolis') },
  { name: 'Istanbul',     nameKo: '이스탄불',   countryKo: '튀르키예', imageUrl: picsum('istanbul-turkey') },
  { name: 'Copenhagen',   nameKo: '코펜하겐',   countryKo: '덴마크',   imageUrl: picsum('copenhagen-denmark') },
  { name: 'Stockholm',    nameKo: '스톡홀름',   countryKo: '스웨덴',   imageUrl: picsum('stockholm-sweden') },
  { name: 'Helsinki',     nameKo: '헬싱키',     countryKo: '핀란드',   imageUrl: picsum('helsinki-finland') },
  { name: 'Reykjavik',    nameKo: '레이캬비크', countryKo: '아이슬란드', imageUrl: picsum('reykjavik-iceland') },
  { name: 'Zurich',       nameKo: '취리히',     countryKo: '스위스',   imageUrl: unsplash('1536745933-886eed5bb879') },
  { name: 'Interlaken',   nameKo: '인터라켄',   countryKo: '스위스',   imageUrl: picsum('interlaken-switzerland') },
  { name: 'Krakow',       nameKo: '크라쿠프',   countryKo: '폴란드',   imageUrl: picsum('krakow-poland') },
  { name: 'Warsaw',       nameKo: '바르샤바',   countryKo: '폴란드',   imageUrl: unsplash('1520986606765-fc0e6a5a24a5') },
  { name: 'Tallinn',      nameKo: '탈린',       countryKo: '에스토니아', imageUrl: picsum('tallinn-estonia') },
  { name: 'Riga',         nameKo: '리가',       countryKo: '라트비아', imageUrl: unsplash('1548013147-eb7f79e7e7b4') },

  // 북미
  { name: 'New York',     nameKo: '뉴욕',       countryKo: '미국', imageUrl: unsplash('1496442226666-8d4d0e62e6e9') },
  { name: 'Los Angeles',  nameKo: 'LA',         countryKo: '미국', imageUrl: picsum('losangeles-california') },
  { name: 'San Francisco', nameKo: '샌프란시스코', countryKo: '미국', imageUrl: picsum('sanfrancisco-goldengate') },
  { name: 'Seattle',      nameKo: '시애틀',     countryKo: '미국', imageUrl: picsum('seattle-spaceneedle') },
  { name: 'Chicago',      nameKo: '시카고',     countryKo: '미국', imageUrl: picsum('chicago-skyline') },
  { name: 'Miami',        nameKo: '마이애미',   countryKo: '미국', imageUrl: picsum('miami-beach') },
  { name: 'Las Vegas',    nameKo: '라스베가스', countryKo: '미국', imageUrl: picsum('lasvegas-strip') },
  { name: 'Honolulu',     nameKo: '호놀룰루',   countryKo: '미국', imageUrl: picsum('honolulu-hawaii') },
  { name: 'Vancouver',    nameKo: '밴쿠버',     countryKo: '캐나다', imageUrl: picsum('vancouver-canada') },
  { name: 'Toronto',      nameKo: '토론토',     countryKo: '캐나다', imageUrl: picsum('toronto-cntower') },
  { name: 'Mexico City',  nameKo: '멕시코시티', countryKo: '멕시코', imageUrl: picsum('mexicocity-mexico') },
  { name: 'Cancun',       nameKo: '칸쿤',       countryKo: '멕시코', imageUrl: picsum('cancun-caribbean') },
  { name: 'Cusco',        nameKo: '쿠스코',     countryKo: '페루',   imageUrl: picsum('cusco-peru') },
  { name: 'Buenos Aires', nameKo: '부에노스아이레스', countryKo: '아르헨티나', imageUrl: picsum('buenosaires-argentina') },
  { name: 'Rio de Janeiro', nameKo: '리우데자네이루', countryKo: '브라질', imageUrl: picsum('rio-brazil') },

  // 오세아니아
  { name: 'Sydney',       nameKo: '시드니',     countryKo: '호주',     imageUrl: unsplash('1506973035872-a4ec16b8e8d9') },
  { name: 'Melbourne',    nameKo: '멜버른',     countryKo: '호주',     imageUrl: picsum('melbourne-australia') },
  { name: 'Queenstown',   nameKo: '퀸스타운',   countryKo: '뉴질랜드', imageUrl: picsum('queenstown-newzealand') },
  { name: 'Auckland',     nameKo: '오클랜드',   countryKo: '뉴질랜드', imageUrl: picsum('auckland-newzealand') },

  // 중동 / 아프리카
  { name: 'Dubai',        nameKo: '두바이',     countryKo: '아랍에미리트',  imageUrl: unsplash('1512453979798-5ea266f8880c') },
  { name: 'Cape Town',    nameKo: '케이프타운', countryKo: '남아프리카공화국', imageUrl: picsum('capetown-tablemountain') },
  { name: 'Marrakech',    nameKo: '마라케시',   countryKo: '모로코',    imageUrl: picsum('marrakech-morocco') },

  // 동아시아
  { name: 'Hong Kong',    nameKo: '홍콩',   countryKo: '홍콩', imageUrl: unsplash('1536599018102-9f803c140fc1') },
  { name: 'Taipei',       nameKo: '타이페이', countryKo: '대만', imageUrl: picsum('taipei-taiwan') },
  { name: 'Beijing',      nameKo: '베이징', countryKo: '중국', imageUrl: picsum('beijing-china') },
  { name: 'Shanghai',     nameKo: '상하이', countryKo: '중국', imageUrl: picsum('shanghai-china') },
  { name: 'Macau',        nameKo: '마카오', countryKo: '마카오', imageUrl: picsum('macau-casino') },

  // 남아시아
  { name: 'Mumbai',       nameKo: '뭄바이',  countryKo: '인도', imageUrl: picsum('mumbai-india') },
  { name: 'New Delhi',    nameKo: '뉴델리',  countryKo: '인도', imageUrl: picsum('newdelhi-india') },
  { name: 'Kathmandu',    nameKo: '카트만두', countryKo: '네팔', imageUrl: picsum('kathmandu-nepal') },
  { name: 'Colombo',      nameKo: '콜롬보',  countryKo: '스리랑카', imageUrl: picsum('colombo-srilanka') },
]

export function searchCities(query: string): CityData[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  // 공백·하이픈 제거 후 비교 (예: "sanfrancisco" → "san francisco" 매칭)
  const qNorm = q.replace(/[\s-]/g, '')
  return CITIES.filter((city) => {
    const nameEn = city.name.toLowerCase()
    const nameEnNorm = nameEn.replace(/[\s-]/g, '')
    return (
      city.nameKo.includes(q) ||
      nameEn.includes(q) ||
      nameEnNorm.includes(qNorm)
    )
  }).slice(0, 6)
}
