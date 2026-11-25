import type { MenuItem } from "../types";

const publicAsset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path}`;

export const menuItems: MenuItem[] = [
  // ============ КЛАССИЧЕСКИЕ ============
  {
    id: "philadelphia",
    name: "Филадельфия",
    category: "classic",
    ingredients: ["Лосось", "Сливочный сыр", "Огурец", "Рис", "Нори"],
    description: "Классический ролл с нежным лососем и сливочным сыром",
    allergens: ["Рыба", "Молочные продукты"],
  },
  {
    id: "canada",
    name: "Канада (Дракон)",
    category: "classic",
    ingredients: ["Лосось", "Угорь", "Авокадо", "Сливочный сыр", "Рис", "Нори"],
    description: "Сочный ролл с лососем и угрем под авокадо",
    allergens: ["Рыба", "Молочные продукты"],
  },
  {
    id: "pocheluy-geyshi",
    name: "Поцелуй Гейши",
    category: "special",
    imageUrl: publicAsset("potseluy-geyshi.jpeg"),
    ingredients: [
      "Угорь",
      "Авокадо",
      "Сливочный сыр",
      "Икра тобико",
      "Рис",
      "Нори",
    ],
    description: "Изысканный ролл с угрем ",
    allergens: ["Рыба", "Молочные продукты"],
  },
  {
    id: "vulkan-krevetka",
    name: "Вулкан с креветкой",
    category: "baked",
    imageUrl: publicAsset("vulkan.webp"),
    ingredients: [
      "Креветка",
      "Авокадо",
      "Сливочный сыр",
      "Запеченный соус",
      "Рис",
      "Нори",
    ],
    description: "Запеченный ролл с сочной креветкой",
    allergens: ["Морепродукты", "Молочные продукты"],
  },
  {
    id: "takumi-losos",
    name: "Такуми с белым соусом с лососем",
    category: "special",
    imageUrl: publicAsset("takumi-beliy-sous.webp"),
    ingredients: ["Лосось", "Белый соус", "Авокадо", "Огурец", "Рис", "Нори"],
    description: "Утонченный ролл с лососем и белым соусом",
    allergens: ["Рыба", "Молочные продукты"],
  },

  // ============ ЗАПЕЧЕННЫЕ ============
  {
    id: "alaska-losos",
    name: "Аляска запеченная с лососем",
    category: "baked",
    imageUrl: publicAsset("alyaska_zapechennaya_lososem.jpeg"),
    ingredients: [
      "Лосось",
      "Сливочный сыр",
      "Запеченный соус",
      "Икра тобико",
      "Рис",
      "Нори",
    ],
    description: "Запеченный ролл с лососем под золотистым соусом",
    allergens: ["Рыба", "Молочные продукты"],
  },
  {
    id: "alaska-kurica",
    name: "Аляска запеченная с курицей",
    category: "baked",
    ingredients: [
      "Курица",
      "Сливочный сыр",
      "Запеченный соус",
      "Икра тобико",
      "Рис",
      "Нори",
    ],
    description: "Запеченный ролл с нежной курицей",
    allergens: ["Птица", "Молочные продукты"],
  },
  {
    id: "krispi-kurica",
    name: "Криспи пай с курицей",
    category: "baked",
    imageUrl: publicAsset("krispis_pay.webp"),
    ingredients: [
      "Курица",
      "Сливочный сыр",
      "Хрустящая панировка",
      "Запеченный соус",
      "Рис",
      "Нори",
    ],
    description: "Хрустящий запеченный ролл с курицей",
    allergens: ["Птица", "Молочные продукты", "Глютен"],
  },

  // ============ ТЕМПУРА ============
  {
    id: "yassay-kurica",
    name: "Яссай темпура с курицей",
    category: "tempura",
    imageUrl: undefined,
    ingredients: [
      "Курица темпура",
      "Огурец",
      "Сливочный сыр",
      "Соус спайси",
      "Рис",
      "Нори",
    ],
    description: "Ролл с хрустящей курицей в темпуре",
    allergens: ["Птица", "Молочные продукты", "Глютен"],
  },
  {
    id: "yassay-losos",
    name: "Яссай темпура с лососем",
    category: "tempura",
    imageUrl: publicAsset("yassay_tempura.webp"),
    ingredients: [
      "Лосось темпура",
      "Огурец",
      "Сливочный сыр",
      "Соус спайси",
      "Рис",
      "Нори",
    ],
    description: "Ролл с лососем в хрустящей темпуре",
    allergens: ["Рыба", "Молочные продукты", "Глютен"],
  },
  {
    id: "texas-losos",
    name: "Техас темпура с лососем",
    category: "tempura",
    imageUrl: undefined,
    ingredients: [
      "Лосось темпура",
      "Авокадо",
      "Сливочный сыр",
      "Острый соус",
      "Рис",
      "Нори",
    ],
    description: "Острый ролл с лососем в темпуре и авокадо",
    allergens: ["Рыба", "Молочные продукты", "Глютен"],
  },
  {
    id: "texas-ugr",
    name: "Техас темпура с угрем",
    category: "tempura",
    imageUrl: undefined,
    ingredients: [
      "Угорь темпура",
      "Авокадо",
      "Сливочный сыр",
      "Острый соус",
      "Рис",
      "Нори",
    ],
    description: "Острый ролл с угрем в темпуре",
    allergens: ["Рыба", "Молочные продукты", "Глютен"],
  },
  {
    id: "italiano-tempura",
    name: "Итальяно темпура",
    category: "tempura",
    imageUrl: publicAsset("italyano_tempura.webp"),
    ingredients: [
      "Лосось темпура",
      "Сливочный сыр",
      "Шпинат",
      "Базилик",
      "Рис",
      "Нори",
    ],
    description: "Итальянский ролл с лососем в темпуре и шпинатом",
    allergens: ["Рыба", "Молочные продукты", "Глютен"],
  },
  {
    id: "losos-tempura",
    name: "Лосось темпура",
    category: "tempura",
    imageUrl: publicAsset("losos_tempura.webp"),
    ingredients: [
      "Лосось темпура",
      "Огурец",
      "Сливочный сыр",
      "Кунжут",
      "Рис",
      "Нори",
    ],
    description: "Классический ролл с лососем в хрустящей темпуре",
    allergens: ["Рыба", "Молочные продукты", "Глютен"],
  },
];

// Helper: get roll by ID
export const getRollById = (id: string): MenuItem | undefined =>
  menuItems.find((item) => item.id === id);

// Helper: get all ingredients as flat unique list
export const getAllIngredients = (): string[] => {
  const all = menuItems.flatMap((item) => item.ingredients);
  return [...new Set(all)];
};
