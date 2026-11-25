import { curatedQuestions } from "./questionsData";
import { menuItems } from "./menuData";
import { sets } from "./setsData";
import { foodItems } from "./foodData";
import type { Question } from "../types";

const unique = (values: string[]): string[] => [...new Set(values)];

const shuffle = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const padOptions = (
  options: string[],
  correctAnswer: string,
  fallbackPool: string[],
  targetCount = 4,
): string[] => {
  const seen = new Set<string>();
  const result: string[] = [];

  seen.add(correctAnswer);
  result.push(correctAnswer);

  for (const opt of options) {
    if (!seen.has(opt) && result.length < targetCount) {
      seen.add(opt);
      result.push(opt);
    }
  }

  for (const fallback of fallbackPool) {
    if (result.length >= targetCount) break;
    if (!seen.has(fallback)) {
      seen.add(fallback);
      result.push(fallback);
    }
  }

  return shuffle(result);
};

// ─── ROLL QUESTIONS ───────────────────────────────────────────────────────────

const allIngredientStrings = unique(
  menuItems.flatMap((item) => item.ingredients),
);
const allIngredientListStrings = menuItems.map((item) =>
  item.ingredients.join(", "),
);

const generatedQuestions: Question[] = menuItems.flatMap((item, itemIndex) => {
  const ingredients = unique(item.ingredients);
  const ingredientListStr = ingredients.join(", ");

  const distractorIngredients = allIngredientStrings.filter(
    (ing) => !ingredients.includes(ing),
  );
  const missingIngredient =
    distractorIngredients[
      itemIndex % Math.max(distractorIngredients.length, 1)
    ] || "Тунец";

  // Other rolls in the same category (excluding self)
  const similarItems = menuItems.filter(
    (other) => other.id !== item.id && other.category === item.category,
  );
  // Fallback: any other roll if no same-category ones exist
  const allOtherItems = menuItems.filter((other) => other.id !== item.id);
  const comparisonItem =
    similarItems.length > 0
      ? similarItems[itemIndex % similarItems.length]
      : allOtherItems[itemIndex % allOtherItems.length];

  const comparisonIngredients = comparisonItem.ingredients;
  const uniqueToItem = ingredients.filter(
    (ing) => !comparisonIngredients.includes(ing),
  );
  const differenceAnswer =
    uniqueToItem.length > 0 ? uniqueToItem.join(", ") : "Составом ингредиентов";

  const ingredientListOptions = padOptions(
    [ingredientListStr, ...similarItems.map((s) => s.ingredients.join(", "))],
    ingredientListStr,
    allIngredientListStrings.filter((s) => s !== ingredientListStr),
  );

  const missingOptions = padOptions(
    [missingIngredient, ...ingredients.slice(0, 3)],
    missingIngredient,
    distractorIngredients,
  );

  const compareOptions = padOptions(
    [
      differenceAnswer,
      ...comparisonIngredients.slice(0, 2),
      "Только размером порции",
      "Они полностью одинаковые",
    ],
    differenceAnswer,
    distractorIngredients,
  );

  return [
    {
      id: `generated-${item.id}-ingredients`,
      text: `Какие ингредиенты входят в ролл «${item.name}»?`,
      type: "multiple-choice",
      options: ingredientListOptions,
      correctAnswer: ingredientListStr,
      category: "ingredients",
    },
    {
      id: `generated-${item.id}-missing`,
      text: `Какого ингредиента НЕТ в ролле «${item.name}»?`,
      type: "multiple-choice",
      options: missingOptions,
      correctAnswer: missingIngredient,
      category: "ingredients",
    },
    {
      id: `generated-${item.id}-compare`,
      text: `Чем отличается состав «${item.name}» от ролла «${comparisonItem.name}»?`,
      type: "multiple-choice",
      options: compareOptions,
      correctAnswer: differenceAnswer,
      category: "ingredients",
    },
    {
      id: `generated-${item.id}-partial`,
      text: `Какой вариант содержит полный состав ролла «${item.name}»?`,
      type: "multiple-choice",
      options: ingredientListOptions,
      correctAnswer: ingredientListStr,
      category: "ingredients",
    },
  ] as Question[];
});

// ─── SET QUESTIONS ────────────────────────────────────────────────────────────

const allSetCompositions = sets.map((set) =>
  set.rolls
    .map(
      ({ rollId }) =>
        menuItems.find((item) => item.id === rollId)?.name || rollId,
    )
    .join(", "),
);

const setQuestions: Question[] = sets.flatMap((set, setIndex) => {
  const rollNames = set.rolls.map(
    ({ rollId }) =>
      menuItems.find((item) => item.id === rollId)?.name || rollId,
  );
  const composition = rollNames.join(", ");

  const absentRoll =
    menuItems.find((item) => !rollNames.includes(item.name))?.name ||
    "Итальяно темпура";

  const comparisonSet = sets[(setIndex + 1) % sets.length];
  const comparisonRolls = comparisonSet.rolls.map(
    ({ rollId }) =>
      menuItems.find((item) => item.id === rollId)?.name || rollId,
  );

  const uniqueRoll =
    rollNames.find((name) => !comparisonRolls.includes(name)) || rollNames[0];

  const sizeOptions = padOptions(
    [`${set.totalPieces} штук`],
    `${set.totalPieces} штук`,
    [24, 32, 40, 64, 80]
      .filter((n) => n !== set.totalPieces)
      .map((n) => `${n} штук`),
  );

  const rollOptions = padOptions(
    [rollNames[0], absentRoll, ...rollNames.slice(1)],
    rollNames[0],
    menuItems.map((m) => m.name),
  );

  const compositionOptions = padOptions(
    [composition, ...allSetCompositions.filter((s) => s !== composition)],
    composition,
    allSetCompositions,
  );

  const absentOptions = padOptions(
    [absentRoll, ...rollNames.slice(0, 3)],
    absentRoll,
    menuItems.map((m) => m.name),
  );

  const compareOptions = padOptions(
    [uniqueRoll, ...comparisonRolls.slice(0, 3)],
    uniqueRoll,
    menuItems.map((m) => m.name),
  );

  return [
    {
      id: `generated-${set.id}-size`,
      text: `Сколько роллов входит в «${set.name}»?`,
      type: "multiple-choice",
      options: sizeOptions,
      correctAnswer: `${set.totalPieces} штук`,
      category: "sets",
    },
    {
      id: `generated-${set.id}-roll`,
      text: `Какой из роллов входит в состав «${set.name}»?`,
      type: "multiple-choice",
      options: rollOptions,
      correctAnswer: rollNames[0],
      category: "sets",
    },
    {
      id: `generated-${set.id}-all`,
      text: `Какой список полностью описывает состав «${set.name}»?`,
      type: "multiple-choice",
      options: compositionOptions,
      correctAnswer: composition,
      category: "sets",
    },
    {
      id: `generated-${set.id}-absent`,
      text: `Какой ролл НЕ входит в «${set.name}»?`,
      type: "multiple-choice",
      options: absentOptions,
      correctAnswer: absentRoll,
      category: "sets",
    },
    {
      id: `generated-${set.id}-compare`,
      text: `Какой ролл есть в «${set.name}», но отсутствует в «${comparisonSet.name}»?`,
      type: "multiple-choice",
      options: compareOptions,
      correctAnswer: uniqueRoll,
      category: "sets",
    },
  ] as Question[];
});

// ─── FOOD (PIZZA / OTHER) QUESTIONS ──────────────────────────────────────────

const allFoodIngredientStrings = unique(
  foodItems.flatMap((food) => food.ingredients),
);

const foodQuestions: Question[] = foodItems.flatMap((item, itemIndex) => {
  const ingredients = unique(item.ingredients);
  const ingredientStr = ingredients.join(", ");

  const distractors = allFoodIngredientStrings.filter(
    (ing) => !ingredients.includes(ing),
  );
  const missingIngredient =
    distractors[itemIndex % Math.max(distractors.length, 1)] || "Пармезан";

  const similarFoods = foodItems.filter(
    (food) => food.id !== item.id && food.category === item.category,
  );
  const allOtherFoods = foodItems.filter((food) => food.id !== item.id);
  const comparisonFood =
    similarFoods.length > 0
      ? similarFoods[itemIndex % similarFoods.length]
      : allOtherFoods[itemIndex % allOtherFoods.length];

  const comparisonIngredients = comparisonFood.ingredients;
  const uniqueToItem = ingredients.find(
    (ing) => !comparisonIngredients.includes(ing),
  );
  const compareAnswer = uniqueToItem || ingredients[0];

  const allFoodIngredientLists = foodItems.map((f) => f.ingredients.join(", "));

  const ingredientOptions = padOptions(
    [ingredientStr, ...similarFoods.map((f) => f.ingredients.join(", "))],
    ingredientStr,
    allFoodIngredientLists,
  );

  const missingOptions = padOptions(
    [missingIngredient, ...ingredients.slice(0, 3)],
    missingIngredient,
    distractors,
  );

  const compareOptions = padOptions(
    [compareAnswer, ...comparisonIngredients.slice(0, 3)],
    compareAnswer,
    allFoodIngredientStrings,
  );

  return [
    {
      id: `food-${item.id}-ingredients`,
      text: `Какие ингредиенты указаны для блюда «${item.name}»?`,
      type: "multiple-choice",
      options: ingredientOptions,
      correctAnswer: ingredientStr,
      category: "ingredients",
    },
    {
      id: `food-${item.id}-missing`,
      text: `Какого ингредиента НЕТ в составе «${item.name}»?`,
      type: "multiple-choice",
      options: missingOptions,
      correctAnswer: missingIngredient,
      category: "ingredients",
    },
    {
      id: `food-${item.id}-compare`,
      text: `Какой ингредиент есть в «${item.name}», но отсутствует в «${comparisonFood.name}»?`,
      type: "multiple-choice",
      options: compareOptions,
      correctAnswer: compareAnswer,
      category: "ingredients",
    },
  ] as Question[];
});

// ─── COMBINED BANK ────────────────────────────────────────────────────────────

const baseQuestions = [
  ...curatedQuestions,
  ...generatedQuestions,
  ...setQuestions,
  ...foodQuestions,
];

export const questionsBank: Question[] = Array.from(
  { length: 400 },
  (_, index) => {
    const source = baseQuestions[index % baseQuestions.length];
    return { ...source, id: `${source.id}-pool-${index + 1}` };
  },
);

export const pickRandomQuestions = (count = 20): Question[] => {
  const shuffled = shuffle([...questionsBank]);
  return shuffled.slice(0, count);
};
