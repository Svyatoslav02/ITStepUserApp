const cityData = {
  'Івано-Франківськ': {
    weather: {
      uk: {
        temp: '+20°C',
        humidity: '70%',
        wind: '10 км/год',
        icon: 'sun'
      }
    },
    history: {
      uk: [
        {
          title: 'Заснування міста',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ivano-FrankivskRatusha.jpg/1920px-Ivano-FrankivskRatusha.jpg',
          text: `Івано-Франківськ, до 1962 року знаний як Станиславів, розташований на Покутській рівнинній території південно-західної України, між річками Бистриця Надвірнянська та Бистриця Солотвинська.

Це обласний центр Івано-Франківської області, важливий економічний і культурний центр Прикарпаття та один із трьох головних центрів історико-географічного регіону Галичина.

Місто було засноване 1662 року галицьким старостою Андрієм Потоцьким на землях села Заболоття. Воно спочатку планувалося як фортеця для захисту від набігів кримських татар. Фортецю у формі шестикутника з бастіонами спроєктовано архітектором Франсуа Корассіні, будівництво тривало всього 5 місяців.

Назва Станиславів походить від імені сина Потоцького — Станислава, а також Святого Станислава — покровителя родини. Місто отримало магдебурзьке право 8 травня 1662 року, а в 1663 році король Ян ІІ Казимир затвердив герб із відчиненою брамою, трьома вежами та хрестом Пилява.

У 1962 році місто було перейменоване на Івано-Франківськ на честь українського письменника і громадського діяча Івана Франка. Вже на ранніх етапах розвитку місто стало багатонаціональним і важливим культурним та економічним центром Прикарпаття.`
        },
        {
          title: 'Фортеця та містобудування',
          image: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/%D0%91%D1%83%D0%B4%D1%96%D0%B2%D0%BD%D0%B8%D1%86%D1%82%D0%B2%D0%BE_%D1%87%D0%B5%D1%82%D0%B2%D0%B5%D1%80%D1%82%D0%BE%D1%97_%D1%80%D0%B0%D1%82%D1%83%D1%88%D1%96_%D0%B2_%D0%A1%D1%82%D0%B0%D0%BD%D1%96%D1%81%D0%BB%D0%B0%D0%B2%D0%BE%D0%B2%D1%96.jpg',
          text: `Фортеця Станиславова мала унікальну для Східної Європи структуру. Оборонні мури з дубовими палями, земляний вал шириною до 30 метрів, широкий рів, бастіони й редути — усе було зведено за стандартами французької військової інженерії.

Основу містобудування становила площа Ринок та ратуша — адміністративний і архітектурний центр. У 1672 році дерев'яні укріплення замінено на муровані, зведено кам’яні брами: Галицьку та Тисменицьку.

Місто активно розвивалось — від зростання ремесел і торгівлі до появи Академії при колегіаті, лікарень та громадських установ. Уже до кінця XVII ст. Станиславів став відомим центром ярмарків, шкіряного виробництва та перських товарів.`
        },
        {
          title: 'Цікаві факти про Івано-Франківськ',
          image: 'https://ukr-prokat.com/wp-content/uploads/2020/08/ivano-frankivsk.jpg',
          text: `Гуляючи по Івано-Франківську, ви часто зустрінете назви «Станіслав» або «Станіславів». Це стара назва міста, якою воно користувалось з 1662 до 1962 року. Нову назву — Івано-Франківськ — отримало 9 листопада 1962 року на честь 300-річчя міста та українського письменника Івана Франка.

Насправді, поселення на цій території існували ще раніше — Княгиня і Заболоття були тут задовго до 1662 року.

Спочатку місто будували як фортецю з дерев’яними, а згодом кам’яними стінами, земляним валом і ровом.

Ратуша Івано-Франківська — унікальна будівля в стилі функціоналізму, зовнішній вигляд якої змінювався чотири рази. Вона — єдина в Європі з позолоченим шоломоподібним куполом.

Найстарша частина міста — площа Ринок, що колись називалась площею Смерті через страти, які там проводили. Легенди розповідають про привидів опришків, що досі блукають цими місцями.

У 1919 році місто на кілька місяців було столицею ЗУНР, приймалися найважливіші рішення.

В Івано-Франківську є пам’ятник яйцю — унікальний в Європі.

Одне з перших міст Західної України, що отримало електропостачання — перші лампочки запалили на залізничному вокзалі у XIX столітті.`
        }
      ]
    },
    places: {
      uk: [
        // Їжа (Food)
        {
          id: 1,
          name: 'Ресторан "Десятка"',
          type: 'food',
          description: 'Затишний ресторан із балканською кухнею, коктейлями та можливістю перегляду спортивних трансляцій у стильному інтер’єрі з цегляними стінами.',
          rating: 4.7,
          image: 'https://lh3.googleusercontent.com/p/AF1QipNpBp_Ldp0GYgpwtTmKxWf9ayP5VOeddWnHA_sI=s1360-w1360-h1020-rw',
          address: 'Вул. Шашкевича, 4, Івано-Франківськ, Івано-Франківська область, 76018',
          reviews: [{ rating: 4.7 }],
          showShareButton: true
        },
        {
          id: 2,
          name: 'Vitaliano Pizza',
          type: 'food',
          description: 'Популярна піцерія з широким вибором піци та зручними опціями доставки.',
          rating: 4.8,
          image: 'https://lh3.googleusercontent.com/p/AF1QipOAD4duBjCJxjM2ZDmnq2ZB78SHH7uO6JrkqcYo=s1360-w1360-h1020-rw',
          address: 'Вул. Залізнична, 4а, Івано-Франківськ, Івано-Франківська область, 76018',
          reviews: [{ rating: 4.8 }],
          showShareButton: true
        },
        {
          id: 3,
          name: 'Ambasada',
          type: 'food',
          description: 'Стильний ресторан із вишуканою кухнею, коктейлями та вегетаріанськими стравами в центрі міста.',
          rating: 4.8,
          image: 'https://lh3.googleusercontent.com/p/AF1QipNz_cz4PBkrb5pS8JgrCm-1NKqScXNzzrxh9-gz=s1360-w1360-h1020-rw',
          address: 'Площа Міцкевича, 4, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.8 }],
          showShareButton: true
        },
        {
          id: 4,
          name: 'Cruce de Gustos',
          type: 'food',
          description: 'Ресторан із вишуканою європейською кухнею та унікальною атмосферою.',
          rating: 4.6,
          image: 'https://cruce-de-gustos.com.ua/wp-content/uploads/2020/12/photo_2020-12-17_11-32-21-1.jpg',
          address: 'Вул. Галицька, 7, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        // Культура (Culture)
        {
          id: 5,
          name: 'Ратуша Івано-Франківська',
          type: 'culture',
          description: 'Історична будівля в стилі функціоналізму з позолоченим куполом, музей історії міста.',
          rating: 4.6,
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ivano-FrankivskRatusha.jpg/1920px-Ivano-FrankivskRatusha.jpg',
          address: 'Площа Ринок, 1, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        {
          id: 6,
          name: 'Катедральний собор Воскресіння Христового',
          type: 'culture',
          description: 'Вражаючий бароковий собор, важливий релігійний та культурний центр міста.',
          rating: 4.9,
          image: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Cathedral_in_Ivano-Frankivsk.jpg',
          address: 'Вул. Гетьмана Мазепи, 1, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.9 }],
          showShareButton: true
        },
        {
          id: 7,
          name: 'Музей мистецтв Прикарпаття',
          type: 'culture',
          description: 'Музей із колекцією сакрального мистецтва та творів місцевих художників.',
          rating: 4.5,
          image: 'https://upload.wikimedia.org/wikipedia/commons/7/78/%D0%9A%D0%BE%D0%BB%D0%B5%D0%B3%D1%96%D0%B0%D0%BB%D1%8C%D0%BD%D0%B8%D0%B9_%D0%BA%D0%BE%D1%81%D1%82%D0%B5%D0%BB_%D0%9F%D1%80%D0%B8%D1%81%D0%B2%D1%8F%D1%82%D0%BE%D1%97_%D0%94%D1%96%D0%B2%D0%B8_%D0%9C%D0%B0%D1%80%D1%96%D1%97.jpg',
          address: 'Площа Шептицького, 8, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.5 }],
          showShareButton: true
        },
        {
          id: 8,
          name: 'Обласна музична філармонія',
          type: 'culture',
          description: 'Центр музичної культури з концертами класичної та сучасної музики.',
          rating: 4.7,
          image: 'https://gloshistorii.pl/wp-content/uploads/2018/07/dsc_0042-1024x683.jpg',
          address: 'Вул. Леся Курбаса, 3, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.7 }],
          showShareButton: true
        },
        {
          id: 9,
          name: 'Музей Небесної Сотні',
          type: 'culture',
          description: 'Музей, присвячений героям Небесної Сотні, з експозиціями про Євромайдан.',
          rating: 4.8,
          image: 'https://files.ratelist.top/uploads/images/bs/56099/photos/aed8a9d88ff3c6117e3259b1744cbdc9-original.webp',
          address: 'Вул. Гетьмана Мазепи, 1, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.8 }],
          showShareButton: true
        },
        {
          id: 10,
          name: 'Івано-Франківський драмтеатр',
          type: 'culture',
          description: 'Театр із різноманітними виставами, від класики до сучасних постановок.',
          rating: 4.6,
          image: 'https://cdn.places.in.ua/enterprises/20105/photos/63299391482167582_thumb.jpg',
          address: 'Вул. Незалежності, 42, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        {
          id: 11,
          name: 'Меморіальний сквер',
          type: 'culture',
          description: 'Тихе місце для вшанування пам’яті з історичними пам’ятниками.',
          rating: 4.5,
          image: 'https://www.mvk.if.ua/uploads/posts/2016-05/1462346433_1.jpg',
          address: 'Вул. Мельничука, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.5 }],
          showShareButton: true
        },
        // Природа (Nature)
        {
          id: 12,
          name: 'Міське озеро',
          type: 'nature',
          description: 'Мальовниче озеро в центрі міста, ідеальне місце для прогулянок та відпочинку.',
          rating: 4.7,
          image: 'https://versii.if.ua/wp-content/uploads/2025/03/miske_ozero-1024x576.jpg',
          address: 'Вул. Гетьмана Мазепи, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.7 }],
          showShareButton: true
        },
        {
          id: 13,
          name: 'Парк імені Тараса Шевченка',
          type: 'nature',
          description: 'Великий парк із зеленими алеями, фонтанами та зонами для відпочинку.',
          rating: 4.6,
          image: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/%D0%A4%D0%BE%D0%BD%D1%82%D0%B0%D0%BD_%D0%B2_%D0%A6%D0%9F%D0%9A%D1%96%D0%92_%D1%96%D0%BC._%D0%A2.%D0%A8%D0%B5%D0%B2%D1%87%D0%B5%D0%BD%D0%BA%D0%B0.jpg',
          address: 'Вул. Шевченка, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        {
          id: 14,
          name: 'Ботанічний сад',
          type: 'nature',
          description: 'Тихе місце з різноманітними рослинами, ідеальне для спокійних прогулянок.',
          rating: 4.4,
          image: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Curitiba_Botanic_Garden.jpg',
          address: 'Вул. Карпатська, 15, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.4 }],
          showShareButton: true
        },
        // Шопінг (Shopping)
        {
          id: 15,
          name: 'Панорама Плаза',
          type: 'shopping',
          description: 'Сучасний торговельний центр із магазинами одягу, техніки та ресторанами.',
          rating: 4.5,
          image: 'https://novobudovy.com/images/wm/1f9db9c32e628c6e376528d1f9a10118.jpg',
          address: 'Вул. Північний Бульвар, 2А, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.5 }],
          showShareButton: true
        },
        {
          id: 16,
          name: 'Велес Мол',
          type: 'shopping',
          description: 'Торговий центр із широким вибором магазинів та розважальних зон.',
          rating: 4.4,
          image: 'https://galka.if.ua/app/uploads/2023/08/eZy-Watermark_25-08-2023_03-49-34-8970PM.jpeg',
          address: 'Вул. Галицька, 201, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.4 }],
          showShareButton: true
        },
        {
          id: 17,
          name: 'Пасаж',
          type: 'shopping',
          description: 'Затишний торговий центр із бутиками та кав’ярнями в центрі міста.',
          rating: 4.3,
          image: 'https://ivano-frankivsk.bestrest.com.ua/sites/default/files/styles/thumb-1000x700px-zaokruglennya/public/images/info/39578/top-39578.jpg?itok=SMLxQyGG',
          address: 'Вул. Незалежності, 19, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.3 }],
          showShareButton: true
        },
        {
          id: 18,
          name: 'Менс Простір',
          type: 'shopping',
          description: 'Магазин для чоловіків із одягом, аксесуарами та барбершопом.',
          rating: 4.6,
          image: 'https://mens.com.ua/wp-content/uploads/2020/10/00004.jpg',
          address: 'Вул. Гетьмана Мазепи, 6, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        {
          id: 19,
          name: 'City Plaza',
          type: 'shopping',
          description: 'Торговий центр із різноманітними магазинами та фудкортом.',
          rating: 4.5,
          image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/504242144.jpg?k=6c2ab1f3bd6a671655cd3391bc9f69e7766139424ea9b03b4c442a9838482638&o=&hp=1',
          address: 'Вул. Галицька, 112, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.5 }],
          showShareButton: true
        },
        // Розваги (Entertainment)
        {
          id: 20,
          name: 'Fly Kids',
          type: 'entertainment',
          description: 'Найбільший дитячий розважальний комплекс із батутами, лабіринтами, гірками та анімаційними програмами.',
          rating: 4.7,
          image: 'https://veles.in.ua/wp-content/uploads/2023/08/DSC_3409_resized-1-768x513.jpg',
          address: 'Вул. Вовчинецька, 225А, ТРЦ Велес, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.7 }],
          showShareButton: true
        },
        {
          id: 21,
          name: 'Парк веселих розваг',
          type: 'entertainment',
          description: 'Сімейний розважальний центр із атракціонами, ігровими зонами та організацією дитячих свят.',
          rating: 4.3,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSpJySb3jh_5b7BEZ3LEFb3qdYFgKKabvLlg&s',
          address: 'Вул. Вовчинецька, 76000',
          reviews: [{ rating: 4.3 }],
          showShareButton: true
        },
        {
          id: 22,
          name: 'Unit Game Space',
          type: 'entertainment',
          description: 'Ігровий простір із сучасними консолями, VR-іграми та організацією турнірів.',
          rating: 4.6,
          image: 'https://veles.in.ua/wp-content/uploads/2024/07/YUnit-pryyednujsya-do-gry.png',
          address: 'Вул. Гетьмана Мазепи, 6, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        {
          id: 23,
          name: 'Чубі Бум',
          type: 'entertainment',
          description: 'Багатоповерховий розважальний центр із мотузковим парком, батутами та віртуальною реальністю.',
          rating: 4.8,
          image: 'https://eventlocations.com.ua//assets/cache_image/assets/gallery/553/1737_4096x4096_d20.jpg',
          address: 'Вул. Південний бульвар, 36В, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.8 }],
          showShareButton: true
        },
        {
          id: 24,
          name: 'Парк атракціонів Лис Микита',
          type: 'entertainment',
          description: 'Парк із різноманітними атракціонами для дітей і дорослих, ідеальний для сімейного відпочинку.',
          rating: 4.5,
          image: 'https://firtka.if.ua/media/cache/blog_thumb/data/blog/295786/290c25d01368b75848719ddeeb7ae2fa.jpeg',
          address: 'Вул. Гетьмана Мазепи, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.5 }],
          showShareButton: true
        },
        {
          id: 25,
          name: 'Kids Club',
          type: 'entertainment',
          description: 'Дитячий клуб із ігровими зонами, майстер-класами та організацією свят.',
          rating: 4.4,
          image: 'https://passport-cdn.kiwicollection.com/blog/drive/uploads/2020/05/102272-14-Kids-Club-Grand-Velas-Los-Cabos-1.jpg',
          address: 'Вул. Мулика, 21, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.4 }],
          showShareButton: true
        },
        // Кінотеатри (Cinemas)
        {
          id: 26,
          name: 'Кінотеатр "Люм’єр"',
          type: 'entertainment',
          description: 'Сучасний кінотеатр із комфортними залами, новинками кінопрокату та 3D-показами.',
          rating: 4.6,
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Lumiere_cinema_in_Ivano-Frankivsk.jpg/1200px-Lumiere_cinema_in_Ivano-Frankivsk.jpg',
          address: 'Вул. Грушевського, 3, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }],
          showShareButton: true
        },
        {
          id: 27,
          name: 'Кінобаза "Час Кіно"',
          type: 'entertainment',
          description: 'Затишний кінотеатр із камерними залами та ексклюзивними кінопоказами.',
          rating: 4.7,
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsmvAWBmJLoEJRWxWk-BkN6phpC7iY4akeDA&s',
          address: 'Вул. Галицька, 43, Івано-Франківськ, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.7 }],
          showShareButton: true
        }
      ]
    },
    accommodation: {
      uk: [
        // Готель (Hotel)
        {
          id: 101,
          title: 'Ganz Hotel',
          type: 'hotel',
          description: 'Сучасний готель із стильним дизайном та зручним розташуванням у центрі міста.',
          rating: 4.7,
          image: 'https://ganz.com.ua/wp-content/uploads/2020/11/facade_010-2-scaled.jpg',
          address: 'Вул. Гетьмана Мазепи, 4, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.7 }]
        },
        {
          id: 102,
          title: 'Atrium Hotel',
          type: 'hotel',
          description: 'Елегантний готель із просторими номерами та рестораном європейської кухні.',
          rating: 4.6,
          image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/42073787.jpg?k=3a200a9617d121ab94f8b9b0c29e4f802348f5b2b342f460c4c64bff18f5b5d5&o=&hp=1',
          address: 'Вул. Галицька, 31, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.6 }]
        },
        {
          id: 103,
          title: 'Nadiya Place',
          type: 'hotel',
          description: 'Комфортний готель із сучасними зручностями та привітним персоналом.',
          rating: 4.8,
          image: 'https://nadiyapalace.com/wp-content/uploads/2023/10/mg_8929-edit-2-sky-light-hh-1-1024x616.jpg',
          address: 'Вул. Незалежності, 40, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.8 }]
        },
        // Мотель (Motel)
        {
          id: 104,
          title: 'Мотель "Затишок"',
          type: 'motel',
          description: 'Комфортний мотель на околиці міста, ідеальний для мандрівників.',
          rating: 4.4,
          image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/110594862.jpg?k=82cc8b01c8b2824497d4eb39587fb9974d985ba75e39f68a2f28ef8ff3ffe9eb&o=&hp=1',
          address: 'Вул. Тисменицька, 220, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.4 }]
        },
        {
          id: 105,
          title: 'Мотель "Карпатський"',
          type: 'motel',
          description: 'Невеликий мотель із доступними цінами та зручним розташуванням.',
          rating: 4.3,
          image: 'https://karpat-ski.com/uploads/slider/1a1ad2972adf423c16317aa4fded9d4d.png',
          address: 'Вул. Надвірна, 10, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.3 }]
        },
        {
          id: 106,
          title: 'Мотель "Прикарпаття"',
          type: 'motel',
          description: 'Зручний мотель із паркінгом та основними зручностями.',
          rating: 4.2,
          image: 'https://hotel-prykarpattya.com.ua/wp-content/uploads/home-game-1024x682.jpg',
          address: 'Вул. Галицька, 201, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.2 }]
        },
        // Хостел (Hostel)
        {
          id: 107,
          title: 'Lama Hostel',
          type: 'hostel',
          description: 'Затишний хостел із сучасним дизайном та дружньою атмосферою.',
          rating: 4.5,
          image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/514259161.jpg?k=b9fe2dfc14f97b01e22d198a2a5152bfb52c3d9c666d6146bc1a0905a07ebf5a&o=&hp=1',
          address: 'Вул. Січових Стрільців, 10, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.5 }]
        },
        {
          id: 108,
          title: 'Хостел "Центр"',
          type: 'hostel',
          description: 'Бюджетний хостел у самому центрі міста з усіма зручностями.',
          rating: 4.4,
          image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/154476330.jpg?k=09bd07fde78f8b1a0710727cf2a81514b693a56b41c17c513ef26c2c9edd7d59&o=&hp=1',
          address: 'Вул. Незалежності, 12, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.4 }]
        },
        {
          id: 109,
          title: 'Хостел "Мандри"',
          type: 'hostel',
          description: 'Затишний хостел для мандрівників із спільною кухнею та лаундж-зоною.',
          rating: 4.3,
          image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/472358481.jpg?k=5b2293d3bcad177fe1fa1336c7299eada2f75a46bb56f6729778f7c1983a2acf&o=&hp=1',
          address: 'Вул. Шевченка, 25, Івано-Франківський, Івано-Франківська область, 76000',
          reviews: [{ rating: 4.3 }]
        }
      ]
    },
    events: {
      uk: [
        {
          id: 'evt1',
          title: 'Концерт Дзідзьо',
          type: 'concert',
          description: 'Запальний концерт популярного українського артиста Дзідзьо! Не пропустіть шанс насолодитися хітами та унікальною енергетикою.',
          date: '25 червня 2025, 19:00',
          image: 'https://i.ytimg.com/vi/qfHIVtNfDOA/maxresdefault.jpg',
          address: 'Концертний зал "Арена Центр", вул. Незалежності, 55',
          rating: 4.9,
          reviews: [{ rating: 5.0 }]
        },
        {
          id: 'evt2',
          title: 'Концерт Шмальгаузен',
          type: 'concert',
          description: 'Неймовірний виступ гурту шмальгаузен із їхньою новою програмою. Чекайте на потужний звук і незабутню атмосферу!',
          date: '1 липня 2023, 20:00',
          image: 'https://static.wixstatic.com/media/45de3e_ae6e22bed59d41eeb555a6f8e7b01fcf~mv2.jpg/v1/fill/w_1000,h_646,al_c,q_85,usm_0.66_1.00_0.01/45de3e_ae6e22bed59d41eeb555a6f8e7b01fcf~mv2.jpg',
          address: 'Палац культури "Народний дім", вул. Шевченка, 1',
          rating: 4.7,
          reviews: [{ rating: 4.8 }]
        }
      ]
    }
  }
};

export default cityData;