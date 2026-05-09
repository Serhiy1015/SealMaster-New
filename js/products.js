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
  { id: 'vtulky',         name: 'Втулки направляючі',               page: 'vtulky.html' },
  { id: 'statychni',      name: 'Статичні ущільнення',              page: 'statychni.html' },
  { id: 'rotatsiyni',     name: 'Ротаційні ущільнення',             page: 'rotatsiyni.html' },
  { id: 'kompresory',     name: 'Компресорні комплектуючі',         page: 'kompresory.html' },
  { id: 'robotyzovani',   name: 'Ущільнення роботизованих КП',      page: 'robotyzovani.html' },
  { id: 'manzhety',       name: 'Манжети армовані',                 page: 'manzhety.html' },
  { id: 'remkomplekty',   name: 'Ремкомплекти',                     page: 'remkomplekty.html' },
  { id: 'komplektuiuchi', name: 'Комплектуючі ГЦ',                  page: 'komplektuiuchi.html' },
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
        { id: 'k21',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K21',  short: 'K21'    },
        { id: 'k22',   name: 'МАНЖЕТИ ШТОКОВІ K22',      short: 'K22'    },
        { id: 'k23',   name: 'МАНЖЕТИ ШТОКОВІ K23',      short: 'K23'    },
        { id: 'k31',   name: 'МАНЖЕТИ ШТОКОВІ K31',      short: 'K31'    },
        { id: 'k32',   name: 'МАНЖЕТИ ШТОКОВІ K32',      short: 'K32'    },
        { id: 'k33',   name: 'МАНЖЕТИ ШТОКОВІ K33',      short: 'K33'    },
        { id: 'k36',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K36', short: 'K36'    },
        { id: 'k37',   name: 'МАНЖЕТИ ШТОКОВІ K37',      short: 'K37'    },
        { id: 'k38',   name: 'МАНЖЕТИ ШТОКОВІ K38',      short: 'K38'    },
        { id: 'k39',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K39', short: 'K39'    },
        { id: 'k40',   name: 'МАНЖЕТИ ПОРШНЕВІ K40',     short: 'K40'    },
        { id: 'k95',   name: 'МАНЖЕТИ УНІВЕРСАЛЬНІ K95', short: 'K95'    },
        { id: 'fr200', name: 'МАНЖЕТИ ШТОКОВІ FR 200',   short: 'FR 200' },
        { id: 'xt200', name: 'МАНЖЕТИ ШТОКОВІ XT 200',   short: 'XT 200' },
        { id: 'm_inshi', name: 'Інші' },
      ],
    },
    {
      id: 'budoznymachi',
      name: 'Брудознімачі',
      children: [
        { id: 'bud_k09_k05', name: 'БРУДОЗНІМАЧІ K09/K05/WWS', short: 'K09/K05/WWS' },
        { id: 'bud_k06',  name: 'БРУДОЗНІМАЧІ K06',  short: 'K06'  },
        { id: 'bud_k07',  name: 'БРУДОЗНІМАЧІ K07',  short: 'K07'  },
        { id: 'bud_k10',  name: 'БРУДОЗНІМАЧІ K10', short: 'K10' },
        { id: 'bud_k101', name: 'БРУДОЗНІМАЧІ K101', short: 'K101' },
        { id: 'bud_k107', name: 'БРУДОЗНІМАЧІ K107', short: 'K107' },
        { id: 'bud_k11',  name: 'БРУДОЗНІМАЧІ K11',  short: 'K11'  },
        { id: 'bud_k12',  name: 'БРУДОЗНІМАЧІ K12',  short: 'K12'  },
        { id: 'bud_k27',  name: 'БРУДОЗНІМАЧІ K27',  short: 'K27'  },
        { id: 'bud_k703', name: 'БРУДОЗНІМАЧІ K703', short: 'K703' },
        { id: 'bud_k91',  name: 'БРУДОЗНІМАЧІ K91',  short: 'K91'  },
        { id: 'bud_k94',  name: 'БРУДОЗНІМАЧІ K94',  short: 'K94'  },
        { id: 'z07',      name: 'БРУДОЗНІМАЧІ Z07',  short: 'Z07'  },
        { id: 'bud_inshi', name: 'Інші брудознімачі', short: 'Інші' },
      ],
    },
    {
      id: 'shtok',
      name: 'Ущільнення штоків',
      children: [
        { id: 'sh_k01', name: 'УЩІЛЬНЕННЯ K01', short: 'K01' },
        { id: 'sh_k04', name: 'УЩІЛЬНЕННЯ K04', short: 'K04' },
        { id: 'sh_k29', name: 'УЩІЛЬНЕННЯ K29', short: 'K29' },
        { id: 'sh_k34', name: 'УЩІЛЬНЕННЯ K34', short: 'K34' },
        { id: 'sh_k35', name: 'УЩІЛЬНЕННЯ K35', short: 'K35' },
      ],
    },
    {
      id: 'porshni',
      name: 'Ущільнення поршнів',
      children: [
        { id: 'p_k03',  name: 'УЩІЛЬНЕННЯ K03',  short: 'K03'   },
        { id: 'p_k15',  name: 'УЩІЛЬНЕННЯ K15',  short: 'K15'   },
        { id: 'p_k16',  name: 'УЩІЛЬНЕННЯ K16',  short: 'K16'   },
        { id: 'p_k17',  name: 'УЩІЛЬНЕННЯ K17',  short: 'K17'   },
        { id: 'p_k18',  name: 'УЩІЛЬНЕННЯ K18',  short: 'K18'   },
        { id: 'p_k19',  name: 'УЩІЛЬНЕННЯ K19',  short: 'K19'   },
        { id: 'p_k26',  name: 'УЩІЛЬНЕННЯ K26',  short: 'K26'   },
        { id: 'p_k42',  name: 'УЩІЛЬНЕННЯ K42',  short: 'K42'   },
        { id: 'p_k43',  name: 'УЩІЛЬНЕННЯ K43',  short: 'K43'   },
        { id: 'p_k46',  name: 'УЩІЛЬНЕННЯ K46',  short: 'K46'   },
        { id: 'p_k48',  name: 'УЩІЛЬНЕННЯ K48',  short: 'K48'   },
        { id: 'p_k49',  name: 'УЩІЛЬНЕННЯ K49',  short: 'K49'   },
        { id: 'p_k501', name: 'УЩІЛЬНЕННЯ K501', short: 'K501'  },
        { id: 'p_mhm-e', name: 'УЩІЛЬНЕННЯ MHM-E', short: 'MHM-E' },
      ],
    },
    {
      id: 'napravliaiuchi',
      name: 'Направляючі елементи',
      children: [
        { id: 'np_shtok',   name: 'Направляюче кільце штока'    },
        { id: 'np_porshen', name: 'Направляюче кільце поршня'   },
        { id: 'np_ptfe',    name: 'Стрічка PTFE+40% Br'         },
        { id: 'np_smola',   name: 'Стрічка поліефірна смола'    },
      ],
    },
  ],

  /**
   *  ПНЕВМОЦИЛІНДРИ — 1 ярус підкатегорій.
   *  ЯК ДОДАТИ: { id: 'унікальний_id', name: 'Назва' }
   *  В Google Sheets колонка subtype = id підкатегорії.
   */
  pnevmo: [
    { id: 'k25',     name: 'ПОРШНІ K25',       short: 'K25'  },
    { id: 'k30',     name: 'УЩІЛЬНЕННЯ К30',   short: 'К30'  },
    { id: 'k50',     name: 'УЩІЛЬНЕННЯ К50',   short: 'К50'  },
    { id: 'k51',     name: 'УЩІЛЬНЕННЯ К51',   short: 'К51'  },
    { id: 'k52',     name: 'УЩІЛЬНЕННЯ К52',   short: 'К52'  },
    { id: 'k53',     name: 'УЩІЛЬНЕННЯ К53',   short: 'К53'  },
    { id: 'k54',     name: 'УЩІЛЬНЕННЯ К54',   short: 'К54'  },
    { id: 'k55',     name: 'УЩІЛЬНЕННЯ К55',   short: 'К55'  },
    { id: 'k56',     name: 'УЩІЛЬНЕННЯ К56',   short: 'К56'  },
    { id: 'k57',     name: 'УЩІЛЬНЕННЯ К57',   short: 'К57'  },
    { id: 'k58',     name: 'УЩІЛЬНЕННЯ К58',   short: 'К58'  },
    { id: 'k59',     name: 'УЩІЛЬНЕННЯ К59',   short: 'К59'  },
    { id: 'k62',     name: 'УЩІЛЬНЕННЯ К62',   short: 'К62'  },
    { id: 'k63',     name: 'УЩІЛЬНЕННЯ К63',   short: 'К63'  },
    { id: 'k64',     name: 'УЩІЛЬНЕННЯ К64',   short: 'К64'  },
    { id: 'k65',     name: 'УЩІЛЬНЕННЯ К65',   short: 'К65'  },
    { id: 'pnev_sf', name: 'ПНЕВМАТИКА SF',    short: 'SF'   },
  ],

  /**
   *  СТАТИЧНІ УЩІЛЬНЕННЯ — 1 ярус підкатегорій.
   *  ЯК ДОДАТИ: { id: 'унікальний_id', name: 'Назва' }
   *  В Google Sheets колонка subtype = id підкатегорії.
   */
  statychni: [
    { id: 'st_k82', name: 'УЩІЛЬНЕННЯ K82', short: 'K82' },
    { id: 'st_k83', name: 'УЩІЛЬНЕННЯ K83', short: 'K83' },
    { id: 'st_k84', name: 'УЩІЛЬНЕННЯ K84', short: 'K84' },
    { id: 'st_k85', name: 'УЩІЛЬНЕННЯ K85', short: 'K85' },
    { id: 'st_k86', name: 'УЩІЛЬНЕННЯ K86', short: 'K86' },
  ],

  kilcia: [
    { id: 'nbr70',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ NBR 70',  short: 'NBR 70'  },
    { id: 'nbr90',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ NBR 90',  short: 'NBR 90'  },
    { id: 'fpm80',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ FPM 80',  short: 'FPM 80'  },
    { id: 'epdm70', name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ EPDM 70', short: 'EPDM 70' },
    { id: 'vmq70',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ VMQ 70',  short: 'VMQ 70'  },
    { id: 'xring',  name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ X-Ring',  short: 'X-Ring'  },
    { id: 'p4',     name: 'КІЛЬЦЯ УЩІЛЬНЮЮЧІ P4',      short: 'P4'      },
    { id: 'shnury', name: 'ШНУРИ УЩІЛЬНЮЮЧІ',           short: 'Шнури'   },
  ],

  kompresory: [
    { id: 'komp_usch', name: 'КОМПРЕСОРНІ УЩІЛЬНЕННЯ', },
    { id: 'brs',       name: 'ВТУЛКИ КОМПРЕСОРНІ BRS',        },
  ],

  komplektuiuchi: [
    { id: 'kompl_pidsh',      name: 'ПІДШИПНИКИ ШС',   short: 'Підшипники ШС' },
    { id: 'kompl_buks',       name: 'БУКСИ',            short: 'Букси'         },
    { id: 'kompl_k18',        name: 'ПОРШНІ К18',       short: 'К18'           },
    { id: 'kompl_vuho_shtok', name: 'ВУХО ГЦ ШТОК',    short: 'Вухо шток'     },
    { id: 'kompl_vuho_truba', name: 'ВУХО ГЦ ТРУБА',   short: 'Вухо труба'    },
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
