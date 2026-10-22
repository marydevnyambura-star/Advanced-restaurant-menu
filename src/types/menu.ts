export type DietaryTag =
  | 'halal'
  | 'spicy'
  | 'extra-crispy'
  | 'vegetarian'
  | 'bestseller'
  | 'value-combo'
  | 'alcoholic'
  | 'non-alcoholic'
  | 'sugar-free';

export interface CustomizationOption {
  spiceLevel?: string[];
  portionSizes?: { name: string; price: number }[];
  accompaniments?: { name: string; price: number }[];
  scoopOptions?: { count: number; name: string; price: number }[];
  iceCreamFlavors?: string[];
  sauceToppings?: { name: string; price: number }[];
  iceLevel?: ('Normal Ice' | 'Extra Ice' | 'No Ice')[];
  sweetnessLevel?: ('100% Regular' | 'Less Sweet (50%)' | 'No Sugar Added')[];
  glassOrBottle?: ('By the Glass' | 'Full Bottle / Carafe')[];
  sides?: { name: string; price: number }[];
  addons?: { name: string; price: number }[];
  drinkChoices?: string[];
  dietaryAdjustments?: string[];
}

export interface Dish {
  id: string;
  name: string;
  subtitle?: string;
  price: number; // in Kenyan Shillings (KSh)
  category:
    | 'african'
    | 'platters'
    | 'desserts'
    | 'burgers'
    | 'chicken'
    | 'fries'
    | 'street'
    | 'combos'
    | 'juices'
    | 'sodas'
    | 'cocktails'
    | 'mocktails'
    | 'wines';
  description: string;
  ingredients: string[];
  allergens: string[];
  dietary: DietaryTag[];
  calories?: number;
  prepTime: string;
  alcoholByVolume?: string; // e.g. "12.5% ABV" or "0.0% Non-Alcoholic"
  beveragePairing?: {
    name: string;
    description: string;
    price: number;
  };
  customization?: CustomizationOption;
  image?: string;
  isChefSpecial?: boolean;
  isAvailable: boolean;
  featuredNote?: string;
  // Platter & sharing fields
  servesCount?: string;
  includedItems?: string[];
  platterFilter?: 'individual' | 'sharing' | 'family' | 'vegetarian';
  isSamplePriceConfirmed?: boolean; // For newly added African/Platter/Dessert items
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  selectedSpiceLevel?: string;
  selectedPortionSize?: { name: string; price: number };
  selectedAccompaniment?: { name: string; price: number };
  selectedScoopCount?: { count: number; name: string; price: number };
  selectedFlavors?: string[];
  selectedSauceToppings?: { name: string; price: number }[];
  selectedIceLevel?: string;
  selectedSweetness?: string;
  selectedServingSize?: string;
  selectedSides: { name: string; price: number }[];
  selectedAddons: { name: string; price: number }[];
  selectedDrink?: string;
  selectedAdjustments: string[];
  includeBeveragePairing: boolean;
  specialInstructions?: string;
  itemTotal: number;
}

export interface DiningDetails {
  serviceMode: 'dine-in' | 'takeout' | 'curbside';
  tableNumber: string;
  guestCount: number;
  customerPhone?: string;
  paymentMethod: 'mpesa' | 'card' | 'cash';
}

export interface PlacedOrder {
  orderId: string;
  ticketNumber: string;
  timestamp: string;
  diningDetails: DiningDetails;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tipAmount: number;
  total: number;
  estimatedMinutes: number;
  status: 'Received' | 'In Fryer / Grill' | 'Packing' | 'Ready';
  mpesaPromptSent?: boolean;
}
