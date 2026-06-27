/**
 * ============================================================
 *  PRODUCTS.JS — Каталог товарів
 * ============================================================
 *
 *  ЯК ДОДАТИ НОВУ КАТЕГОРІЮ:
 *  1. Додайте новий об'єкт у масив CATEGORIES з унікальним id та назвою.
 *
 *  ЯК ДОДАТИ НОВИЙ ТОВАР:
 *  1. Додайте новий об'єкт у масив PRODUCTS.
 *  2. Поле categoryId — має збігатися з id категорії.
 *  3. Поле image — шлях до фото відносно папки сайту.
 *     Приклад: "images/products/kilcia/kilce-001.jpg"
 *  4. Поле price — необов'язкове. Якщо не вказувати — буде "Ціна за запитом".
 *  5. Поле badge — необов'язкове. Наприклад: "Новинка", "Топ продаж".
 *  6. Поле details — додатковий текст у поп-апі (необов'язкове).
 *
 *  ЯК ПРИБРАТИ ТОВАР:
 *  Просто видаліть його об'єкт з масиву PRODUCTS.
 * ============================================================
 */

/**
 *  GOOGLE SHEETS ІНТЕГРАЦІЯ:
 *  1. Відкрийте таблицю → Файл → Поділитися → Опублікувати в інтернеті
 *  2. Оберіть аркуш, формат CSV, натисніть "Опублікувати"
 *  3. Скопіюйте посилання і вставте нижче замість порожнього рядка.
 *
 *  Перший рядок таблиці — назви колонок (ОБОВ'ЯЗКОВО):
 *  id | categoryId | name | desc | details | image | price | badge
 */
const SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRnNtyjTUSDcoS3-saI3CCsT65rb9VQI0AWEfGi5PG2bNu1nh2F-wt3ZJcyVgP0aiNoAtdmDvIdzeAn/pub?gid=0&single=true&output=csv';

const CATEGORIES = [
  { id: 'gidro',          name: 'Ущільнення для гідроциліндрів',    page: 'gidro.html' },
  { id: 'pnevmo',         name: 'Ущільнення для пневмоциліндрів',   page: 'pnevmo.html' },
  { id: 'kilcia',         name: 'Кільця ущільнюючі',                page: 'kilcia.html' },
  { id: 'vtulky',         name: 'Втулки направляючі',               page: 'vtulky.html', image: 'images/categories/vtylku.JPG' },
  { id: 'statychni',      name: 'Статичні ущільнення',              page: 'statychni.html' },
  { id: 'rotatsiyni',     name: 'Ротаційні ущільнення',             page: 'rotatsiyni.html' , image: 'images/categories/rotatsiyni.JPG' },
  { id: 'kompresory',     name: 'Компресорні комплектуючі',         page: 'kompresory.html',    image: 'images/categories/kompr.JPG' },
  { id: 'robotyzovani',   name: 'Ущільнення роботизованих КП',      page: 'robotyzovani.html',  image: 'images/categories/kaset.JPG' },
  { id: 'manzhety',       name: 'Манжети армовані',                 page: 'manzhety.html',      image: 'images/categories/corteco.JPG' },
  { id: 'remkomplekty',   name: 'Ремкомплекти',                     page: 'remkomplekty.html',  image: 'images/categories/remkomp.JPG' },
  { id: 'komplektuiuchi', name: 'Комплектуючі ГЦ',                  page: 'komplektuiuchi.html', image: 'images/categories/pidsh.JPG' },
];

/**
 *  ПІДКАТЕГОРІЇ:
 *  Ключ — id категорії з CATEGORIES.
 *  id підтипу вказується в колонці "subtype" таблиці Google Sheets.
 *  Приклад: subtype = nbr70
 */
const SUBCATEGORIES = {

  /**
   *  ГІДРОЦИЛІНДРИ — 2 яруси:
   *  Ярус 1: групи (id + name + children)
   *  Ярус 2: серії всередині групи (id + name)
   *
   *  ЯК ДОДАТИ НОВУ ГРУПУ:
   *    Додай новий об'єкт у масив gidro: { id: '...', name: '...', children: [] }
   *
   *  ЯК ДОДАТИ НОВУ СЕРІЮ:
   *    Додай { id: '...', name: '...', short: '...' } у children потрібної групи.
   *    name — повна назва (у флайауті меню), short — коротка (у табах на сторінці).
   *    short необов'язкове: якщо не вказати — береться name.
   *    В Google Sheets колонка subtype = id серії (наприклад 'k21').
   */
  /**
   *  ФОТО ПІДКАТЕГОРІЇ:
   *  До будь-якої підкатегорії (або L1-групи) можна додати поле image:
   *    image: 'images/categories/manzhety.jpg'
   *  Воно відображається як банер вгорі сторінки при виборі цієї підкатегорії.
   *  Якщо поле не вказано — банер не показується.
   */
  gidro: [
    {
      id: 'manzhety',
      name: 'Манжети гідравлічні',
      // image: 'images/categories/manzhety.jpg',
      children: [
        { id: 'k21',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K21',  short: 'K21', image: 'images/categories/k21.jpg'},
        { id: 'k22',   name: 'МАНЖЕТИ ШТОКОВІ K22',      short: 'K22',   image: 'images/categories/K22_1.JPG' },
        { id: 'k23',   name: 'МАНЖЕТИ ШТОКОВІ K23',      short: 'K23',   image: 'images/categories/k23.JPG' },
        { id: 'k31',   name: 'МАНЖЕТИ ШТОКОВІ K31',      short: 'K31',   image: 'images/categories/k31.JPG' },
        { id: 'k32',   name: 'МАНЖЕТИ ШТОКОВІ K32',      short: 'K32',   image: 'images/categories/k32.JPG' },
        { id: 'k33',   name: 'МАНЖЕТИ ШТОКОВІ K33',      short: 'K33',   image: 'images/categories/k33.JPG' },
        { id: 'k36',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K36', short: 'K36',   image: 'images/categories/k36.JPG' },
        { id: 'k37',   name: 'МАНЖЕТИ ШТОКОВІ K37',      short: 'K37',   image: 'images/categories/k37.JPG' },
        { id: 'k38',   name: 'МАНЖЕТИ ШТОКОВІ K38',      short: 'K38',   image: 'images/categories/k38.JPG' },
        { id: 'k39',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K39', short: 'K39',   image: 'images/categories/k39.JPG' },
        { id: 'k40',   name: 'МАНЖЕТИ ПОРШНЕВІ K40',     short: 'K40',   image: 'images/categories/k40.JPG' },
        { id: 'k95',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K95', short: 'K95',   image: 'images/categories/k95.JPG' },
        { id: 'fr200', name: 'МАНЖЕТИ ШТОКОВІ FR 200',   short: 'FR 200', image: 'images/categories/fr200.JPG' },
        { id: 'xt200', name: 'МАНЖЕТИ ШТОКОВІ XT 200',   short: 'XT 200', image: 'images/categories/xt200.JPG' },
      ],
    },
    {
      id: 'budoznymachi',
      name: 'Брудознімачі',
      children: [
        { id: 'bud_k09_k05', name: 'БРУДОЗНІМАЧІ K09/K05/WWS', short: 'K09/K05/WWS', image: 'images/categories/k05.JPG' },
        { id: 'bud_k06',  name: 'БРУДОЗНІМАЧІ K06',  short: 'K06' , image: 'images/categories/k06.JPG'  },
        { id: 'bud_k07',  name: 'БРУДОЗНІМАЧІ K07',  short: 'K07', image: 'images/categories/k07.JPG'  },
        { id: 'bud_k10',  name: 'БРУДОЗНІМАЧІ K10', short: 'K10' , image: 'images/categories/k10.JPG' },
        { id: 'bud_k12',  name: 'БРУДОЗНІМАЧІ K12',  short: 'K12', image: 'images/categories/k12.JPG'  },
        { id: 'bud_k101', name: 'БРУДОЗНІМАЧІ K101', short: 'K101', image: 'images/categories/k101.JPG' },
        { id: 'bud_k107', name: 'БРУДОЗНІМАЧІ K107', short: 'K107', image: 'images/categories/k107.JPG' },
        { id: 'bud_k27',  name: 'БРУДОЗНІМАЧІ K27',  short: 'K27' , image: 'images/categories/k27.JPG'  },
        { id: 'bud_k703', name: 'БРУДОЗНІМАЧІ K703', short: 'K703' , image: 'images/categories/k703.JPG' },
        { id: 'bud_k94',  name: 'БРУДОЗНІМАЧІ K94',  short: 'K94' , image: 'images/categories/k94.JPG'  },
        { id: 'z07',      name: 'БРУДОЗНІМАЧІ Z07',  short: 'Z07' , image: 'images/categories/Z07.JPG'  },
        { id: 'bud_inshi', name: 'Інші брудознімачі', short: 'Інші' },
      ],
    },
    {
      id: 'shtok',
      name: 'Ущільнення штоків',
      children: [
        { id: 'sh_k01', name: 'УЩІЛЬНЕННЯ K01', short: 'K01' , image: 'images/categories/k01.JPG' },
        { id: 'sh_k29', name: 'УЩІЛЬНЕННЯ K29', short: 'K29', image: 'images/categories/k29.JPG'  },
        { id: 'sh_k34', name: 'УЩІЛЬНЕННЯ K34', short: 'K34', image: 'images/categories/k34.JPG'  },
        { id: 'sh_k35', name: 'УЩІЛЬНЕННЯ K35', short: 'K35', image: 'images/categories/k35.JPG'  },
      ],
    },
    {
      id: 'porshni',
      name: 'Ущільнення поршнів',
      children: [
        { id: 'p_k03',  name: 'УЩІЛЬНЕННЯ K03',  short: 'K03', image: 'images/categories/k03.JPG'    },
        { id: 'p_k16',  name: 'УЩІЛЬНЕННЯ K16',  short: 'K16' , image: 'images/categories/k16.JPG'   },
        { id: 'p_k17',  name: 'УЩІЛЬНЕННЯ K17',  short: 'K17' , image: 'images/categories/k17.JPG'   },
        { id: 'p_k18',  name: 'УЩІЛЬНЕННЯ K18',  short: 'K18' , image: 'images/categories/k18.JPG'   },
        { id: 'p_k19',  name: 'УЩІЛЬНЕННЯ K19',  short: 'K19'  , image: 'images/categories/k19.JPG'  },
        { id: 'p_k26',  name: 'УЩІЛЬНЕННЯ K26',  short: 'K26' , image: 'images/categories/k26.JPG'   },
        { id: 'p_k42',  name: 'УЩІЛЬНЕННЯ K42',  short: 'K42' , image: 'images/categories/k42.JPG'   },
        { id: 'p_k43',  name: 'УЩІЛЬНЕННЯ K43',  short: 'K43' , image: 'images/categories/k43.JPG'   },
        { id: 'p_k46',  name: 'УЩІЛЬНЕННЯ K46',  short: 'K46' , image: 'images/categories/k46.JPG'   },
        { id: 'p_k48',  name: 'УЩІЛЬНЕННЯ K48',  short: 'K48' , image: 'images/categories/k48.JPG'   },
        { id: 'p_k49',  name: 'УЩІЛЬНЕННЯ K49',  short: 'K49' , image: 'images/categories/k49.JPG'   },
        { id: 'p_k501', name: 'УЩІЛЬНЕННЯ K501', short: 'K501' , image: 'images/categories/k501.JPG'  },
      ],
    },
    {
      id: 'napravliaiuchi',
      name: 'Направляючі елементи',
      children: [
        { id: 'np_shtok',   name: 'Направляюче кільце штока' , image: 'images/categories/k68.JPG'   },
        { id: 'np_porshen', name: 'Направляюче кільце поршня' , image: 'images/categories/k69.JPG'   },
        { id: 'np_ptfe',    name: 'Стрічка PTFE+40% Br'   , image: 'images/categories/ptfe.JPG'       },
        { id: 'np_smola',   name: 'Стрічка поліефірна смола' , image: 'images/categories/sfpr.JPG'   },
      ],
    },
  ],

  /**
   *  ПНЕВМОЦИЛІНДРИ — 1 ярус підкатегорій.
   *  ЯК ДОДАТИ: { id: 'унікальний_id', name: 'Назва' }
   *  В Google Sheets колонка subtype = id підкатегорії.
   */
  pnevmo: [
    { id: 'k25',     name: 'ПОРШНІ K25',       short: 'K25' , image: 'images/categories/k25.JPG' },
    { id: 'k30',     name: 'УЩІЛЬНЕННЯ К30',   short: 'К30', image: 'images/categories/k30.JPG'  },
    { id: 'k50',     name: 'УЩІЛЬНЕННЯ К50',   short: 'К50' , image: 'images/categories/k50.JPG' },
    { id: 'k52',     name: 'УЩІЛЬНЕННЯ К52',   short: 'К52', image: 'images/categories/k52.JPG'  },
    { id: 'k53',     name: 'УЩІЛЬНЕННЯ К53',   short: 'К53' , image: 'images/categories/k53.JPG' },
    { id: 'k54',     name: 'УЩІЛЬНЕННЯ К54',   short: 'К54' , image: 'images/categories/k54.JPG' },
    { id: 'k55',     name: 'УЩІЛЬНЕННЯ К55',   short: 'К55', image: 'images/categories/k55.JPG'  },
    { id: 'k56',     name: 'УЩІЛЬНЕННЯ К56',   short: 'К56' , image: 'images/categories/k56.JPG' },
    { id: 'k57',     name: 'УЩІЛЬНЕННЯ К57',   short: 'К57' , image: 'images/categories/k57.JPG' },
    { id: 'k58',     name: 'УЩІЛЬНЕННЯ К58',   short: 'К58' , image: 'images/categories/k58.JPG' },
    { id: 'k59',     name: 'УЩІЛЬНЕННЯ К59',   short: 'К59', image: 'images/categories/k59.JPG'  },
    { id: 'k62',     name: 'УЩІЛЬНЕННЯ К62',   short: 'К62' , image: 'images/categories/k62.JPG' },
    { id: 'k63',     name: 'УЩІЛЬНЕННЯ К63',   short: 'К63' , image: 'images/categories/k63.JPG' },
    { id: 'k64',     name: 'УЩІЛЬНЕННЯ К64',   short: 'К64' , image: 'images/categories/k64.JPG' },
    { id: 'k65',     name: 'УЩІЛЬНЕННЯ К65',   short: 'К65', image: 'images/categories/k65.JPG'  },
    { id: 'pnev_mpz', name: 'УЩІЛЬНЕННЯ 10MPZ, Z5',    short: '10mpz', image: 'images/categories/10mpz.JPG'   },
  ],

  /**
   *  СТАТИЧНІ УЩІЛЬНЕННЯ — 1 ярус підкатегорій.
   *  ЯК ДОДАТИ: { id: 'унікальний_id', name: 'Назва' }
   *  В Google Sheets колонка subtype = id підкатегорії.
   */
  statychni: [
    { id: 'st_k82', name: 'УЩІЛЬНЕННЯ K82', short: 'K82' , image: 'images/categories/k82.JPG' },
    { id: 'st_k83', name: 'УЩІЛЬНЕННЯ K83', short: 'K83' , image: 'images/categories/k83.JPG' },
    { id: 'st_k84', name: 'УЩІЛЬНЕННЯ K84', short: 'K84', image: 'images/categories/k84.JPG' },
    { id: 'st_k85', name: 'УЩІЛЬНЕННЯ K85', short: 'K85', image: 'images/categories/k85.JPG' },
    { id: 'st_k86', name: 'УЩІЛЬНЕННЯ K86', short: 'K86', image: 'images/categories/k86.JPG' },
  ],

  kilcia: [
    { id: 'nbr70',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ NBR 70',  short: 'NBR 70' , image: 'images/categories/nbr70.JPG'  },
    { id: 'nbr90',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ NBR 90',  short: 'NBR 90' , image: 'images/categories/nbr90.JPG'  },
        { id: 'xring',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ X-Ring',  short: 'X-Ring' , image: 'images/categories/xring.JPG' },
    { id: 'fpm80',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ FPM 80',  short: 'FPM 80'   },
    { id: 'epdm70', name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ EPDM 70', short: 'EPDM 70' },
    { id: 'vmq70',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ VMQ 70',  short: 'VMQ 70'  },
    { id: 'shnury', name: 'ШНУРИ УЩІЛЬНЮЮЧІ',           short: 'Шнури' , image: 'images/categories/shnur.JPG'   },
  ],

  manzhety: [
    { id: 'manzh_asl',     name: 'ASL (рульові рейки)', short: 'ASL',  image: 'images/categories/asl.JPG'     },
    { id: 'manzh_bahd',    name: 'BAHD',                short: 'BAHD',  image: 'images/categories/bahd.JPG'    },
    { id: 'manzh_combi',   name: 'COMBI',               short: 'COMBI',  image: 'images/categories/combi.JPG'   },
    { id: 'manzh_corteco', name: 'Corteco',             short: 'Corteco',  image: 'images/categories/corteco.JPG' },
    { id: 'manzh_dmhui',   name: 'DMHUI',               short: 'DMHUI',  image: 'images/categories/dmh.JPG'   },
    { id: 'manzh_sog',     name: 'SOG',                 short: 'SOG',  image: 'images/categories/sog.JPG'     },
    { id: 'manzh_kasety',  name: 'Касети',              short: 'Касети',  image: 'images/categories/kaset.JPG'  },
  ],

  kompresory: [
    { id: 'komp_usch', name: 'КОМПРЕСОРНІ УЩІЛЬНЕННЯ',  image: 'images/categories/kompr.JPG' },
    { id: 'brs',       name: 'ВТУЛКИ КОМПРЕСОРНІ BRS',        },
  ],

  remkomplekty: [
    { id: 'rem_hyva',     name: 'HYVA',     short: 'HYVA',  image: 'images/categories/remkomp.JPG'     },
    { id: 'rem_edbro',    name: 'EDBRO',    short: 'EDBRO',    image: 'images/categories/remkomp.JPG'    },
    { id: 'rem_hydromas', name: 'HYDROMAS', short: 'HYDROMAS',   image: 'images/categories/remkomp.JPG'  },
  ],

  komplektuiuchi: [
    { id: 'kompl_pidsh',      name: 'ПІДШИПНИКИ ШС',   short: 'Підшипники ШС',  image: 'images/categories/pidsh.JPG' },
    { id: 'kompl_buks',       name: 'БУКСИ',            short: 'Букси',  image: 'images/categories/buks.JPG'         },
    { id: 'kompl_porsh',       name: 'ПОРШНІ',            short: 'Поршні',  image: 'images/categories/porshen.JPG'         },
    { id: 'kompl_vuho_shtok', name: 'ВУХО ГЦ ШТОК',    short: 'Вухо шток',  image: 'images/categories/vshtok.JPG'     },
    { id: 'kompl_vuho_truba', name: 'ВУХО ГЦ ТРУБА',   short: 'Вухо труба',  image: 'images/categories/vtruba.JPG'    },
    { id: 'kompl_khrom',      name: 'ШТОКИ ХРОМОВАНІ', short: 'Штоки'         },
    { id: 'kompl_trubu',      name: 'ТРУБИ ХОНІНГОВАНІ', short: 'Труби'        },
  ]
};

const PRODUCTS = [

  // ——— Ущільнюючі кільця ———
  {
    id: 1,
    categoryId: 'kilcia',
    name: 'Кільце ущільнювальне O-ring',
    desc: 'Гумове кільце круглого перерізу для гідравлічних та пневматичних з\'єднань.',
    details: 'Доступні діаметри: 5–200 мм. Матеріал: NBR, EPDM, FKM. Застосування: гідросистеми тракторів, комбайнів, обприскувачів.',
    image: 'images/products/kilcia/oring.jpg',
    price: '',
    badge: '',
  },

  // ——— Манжети ———
  {
    id: 4,
    categoryId: 'manzhety',
    name: 'Манжета гумова V-подібна',
    desc: 'V-образна манжета для ущільнення штоків та поршнів.',
    details: 'Виготовляється з маслостійкої гуми NBR. Підходить для гідроциліндрів тракторів МТЗ, ЮМЗ, Т-150. Широкий діапазон розмірів.',
    image: 'images/products/manzhety/v-shaped.jpg',
    price: '',
    badge: '',
  },

  // ——— Втулки ———
  {
    id: 7,
    categoryId: 'vtulky',
    name: 'Втулка гумова захисна',
    desc: 'Захисна гумова втулка для осей та вільних кінців валів.',
    details: 'Стійка до мастил та паливних рідин. Використовується для захисту підшипникових вузлів від пилу та бруду в умовах польових робіт.',
    image: 'images/products/vtulky/zakhysna.jpg',
    price: '',
    badge: '',
  },

  // ——— Сальники ———
  {
    id: 9,
    categoryId: 'salnyky',
    name: 'Сальник валовий',
    desc: 'Манжетне ущільнення для обертових валів трансмісій та редукторів.',
    details: 'Стандарт ГОСТ 8752. Типи: з пружиною, з пилозахисним пелюстком. Матеріал: NBR, ACM. Широкий вибір типорозмірів.',
    image: 'images/products/salnyky/valovyi.jpg',
    price: '',
    badge: '',
  },

  // ——— Прокладки ———
  {
    id: 11,
    categoryId: 'prokladky',
    name: 'Прокладка пароніт',
    desc: 'Пароніт ПМБ для ущільнення фланцевих з\'єднань, маслостійкий.',
    details: 'Марка ПМБ (маслобензостійкий). Товщина: 0,5–4 мм. Виготовлення прокладок під будь-який розмір за кресленням або зразком.',
    image: 'images/products/prokladky/paronit.jpg',
    price: '',
    badge: '',
  },

  // ——— Інші ущільнення ———
  {
    id: 13,
    categoryId: 'inshi',
    name: 'Шевронне ущільнення',
    desc: 'Комплект шевронних манжет для гідравлічних пресів та циліндрів.',
    details: 'Комплект складається з опорних, робочих та натискних манжет. Матеріал: гума марки 51-1462. Стійкість до тиску до 32 МПа.',
    image: 'images/products/inshi/shevronni.jpg',
    price: '',
    badge: '',
  },

];
