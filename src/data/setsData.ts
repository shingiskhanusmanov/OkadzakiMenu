import type { SetItem } from '../types';

export const sets: SetItem[] = [
  {
    id: 'set-almaty',
    name: 'Сет Алматы',
    totalPieces: 40,
    price: 14000,
    description: '40 штук + Пепперони + Кола. Большой набор для компании.',
    rolls: [
      { rollId: 'philadelphia', quantity: 8 },
      { rollId: 'pocheluy-geyshi', quantity: 8 },
      { rollId: 'alaska-losos', quantity: 8 },
      { rollId: 'yassay-kurica', quantity: 8 },
      { rollId: 'canada', quantity: 8 },
    ],
  },
  {
    id: 'set-tempura',
    name: 'Сет Темпура',
    totalPieces: 40,
    price: 13000,
    description: '40 штук + Пепперони + Кола. Для любителей темпуры.',
    rolls: [
      { rollId: 'pocheluy-geyshi', quantity: 8 },
      { rollId: 'losos-tempura', quantity: 8 },
      { rollId: 'italiano-tempura', quantity: 8 },
      { rollId: 'yassay-kurica', quantity: 8 },
      { rollId: 'texas-ugr', quantity: 8 },
    ],
  },
  {
    id: 'set-zapechennyy',
    name: 'Сет Запеченный',
    totalPieces: 40,
    price: 13500,
    description: '40 штук + Пепперони + Кола. Для любителей запеченных роллов.',
    rolls: [
      { rollId: 'philadelphia', quantity: 8 },
      { rollId: 'alaska-kurica', quantity: 8 },
      { rollId: 'alaska-losos', quantity: 8 },
      { rollId: 'yassay-kurica', quantity: 8 },
      { rollId: 'texas-losos', quantity: 8 },
    ],
  },
  {
    id: 'set-astana',
    name: 'Сет Астана',
    totalPieces: 32,
    price: 12000,
    description: '32 штуки + Пепперони + Кола.',
    rolls: [
      { rollId: 'philadelphia', quantity: 8 },
      { rollId: 'canada', quantity: 8 },
      { rollId: 'yassay-kurica', quantity: 8 },
      { rollId: 'texas-losos', quantity: 8 },
    ],
  },
  {
    id: 'set-tokio',
    name: 'Сет Токио',
    totalPieces: 32,
    price: 11500,
    description: '32 штуки + Пепперони + Кола.',
    rolls: [
      { rollId: 'philadelphia', quantity: 8 },
      { rollId: 'alaska-kurica', quantity: 8 },
      { rollId: 'yassay-losos', quantity: 8 },
      { rollId: 'vulkan-krevetka', quantity: 8 },
    ],
  },
  {
    id: 'set-okinava',
    name: 'Сет Окинава',
    totalPieces: 32,
    price: 10000,
    description: '32 штуки + Кола.',
    rolls: [
      { rollId: 'philadelphia', quantity: 8 },
      { rollId: 'alaska-kurica', quantity: 8 },
      { rollId: 'krispi-kurica', quantity: 8 },
      { rollId: 'texas-losos', quantity: 8 },
    ],
  },
  {
    id: 'set-optimalnyy',
    name: 'Сет Оптимальный',
    totalPieces: 24,
    price: 9500,
    description: '24 штуки + Пепперони + Кола. Оптимальный выбор.',
    rolls: [
      { rollId: 'philadelphia', quantity: 8 },
      { rollId: 'yassay-losos', quantity: 8 },
      { rollId: 'alaska-kurica', quantity: 8 },
    ],
  },
  {
    id: 'set-bonapart',
    name: 'Сет Бонапарт',
    totalPieces: 80,
    price: 23000,
    description: '80 штук + Пепперони + Маргарита + Кола 2Л. Для большой компании!',
    rolls: [
      { rollId: 'philadelphia', quantity: 16 },
      { rollId: 'canada', quantity: 8 },
      { rollId: 'yassay-kurica', quantity: 8 },
      { rollId: 'yassay-losos', quantity: 8 },
      { rollId: 'alaska-kurica', quantity: 8 },
      { rollId: 'italiano-tempura', quantity: 8 },
      { rollId: 'texas-losos', quantity: 8 },
      { rollId: 'takumi-losos', quantity: 8 },
      { rollId: 'krispi-kurica', quantity: 8 },
    ],
  },
];

export const getSetById = (id: string): SetItem | undefined =>
  sets.find((s) => s.id === id);
