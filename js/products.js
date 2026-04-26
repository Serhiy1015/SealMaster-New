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
  kilcia: [
    { id: 'nbr70',  name: 'NBR 70'  },
    { id: 'nbr90',  name: 'NBR 90'  },
    { id: 'fpm80',  name: 'FPM 80'  },
    { id: 'epdm70', name: 'EPDM 70' },
    { id: 'vmq70',  name: 'VMQ 70'  },
    { id: 'xring',  name: 'X-Ring'  },
    { id: 'p4',     name: 'P4'      },
    { id: 'vring',  name: 'V-Ring'  },
    { id: 'shnury', name: 'Шнури'   },
  ],
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
