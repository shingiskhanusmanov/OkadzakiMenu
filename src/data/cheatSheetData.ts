export interface CheatSheetCategory {
  id: string;
  name: string;
  note: string;
}

export const cheatSheetCategories: CheatSheetCategory[] = [
  { id: "sets", name: "Сеты", note: "Готовые наборы роллов для компании" },
  {
    id: "rolls",
    name: "Суши и роллы",
    note: "Фирменные, классические, запеченные и темпура",
  },
  { id: "pizza", name: "Пиццы", note: "Пицца и комбо" },
  { id: "ramen", name: "Рамён и Том Ям", note: "Супы и острые блюда" },
  {
    id: "enoki",
    name: "Эноки и крылья",
    note: "Закуски и блюда в корейском стиле",
  },
  {
    id: "burgers",
    name: "Бургеры и клаб-сэндвичи",
    note: "Бургеры, картофель и комбо",
  },
  {
    id: "tokpokki",
    name: "Токпокки и кимбап",
    note: "Корейские блюда и закуски",
  },
  {
    id: "hot",
    name: "Горячие блюда",
    note: "Лапша, рис, паста и основные блюда",
  },
  {
    id: "kids",
    name: "Детское меню",
    note: "Детские комбо с напитком и игрушкой",
  },
  { id: "breakfast", name: "Завтраки", note: "Завтраки весь день" },
  { id: "salads", name: "Салаты", note: "Свежие салаты и закуски" },
  {
    id: "sides",
    name: "Гарниры",
    note: "Фри, наггетсы, рис и дополнительные блюда",
  },
  { id: "bread", name: "Хлеб", note: "Хлебная корзина и чесночный хлеб" },
  { id: "bar", name: "Барное меню", note: "Морсы и напитки" },
  { id: "desserts", name: "Десерты", note: "Чизкейки, торты и сладкие блюда" },
  {
    id: "sauces",
    name: "Соусы",
    note: "Соевый соус, васаби, имбирь и фирменные соусы",
  },
];
