export const RESTAURANT_INFO = {
  name: "Dakshin Heritage Restaurant",
  tagline: "Authentic South Indian Tiffin & Fine Dining Gastronomy",
  established: "1992",
  location: "123 Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
  address: "123 Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
  gstin: "36ABCDE1234F1Z5",
  fssai: "12345678901234",
  logo: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80",
  heroImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
  rating: 4.9,
  reviewsCount: 2180,
  taxRate: 0.05, // 5% GST
};

export const CATEGORIES = [
  { id: 'all', name: 'Full South Menu', icon: 'Utensils' },
  { id: 'dosas', name: 'Dosas & Tiffins', icon: 'Sparkles' },
  { id: 'starters', name: 'Vadas & Appetizers', icon: 'Flame' },
  { id: 'rice_biryani', name: 'Biryanis & Rice Specials', icon: 'Wheat' },
  { id: 'curries', name: 'Curries & Gravies', icon: 'Flame' },
  { id: 'desserts', name: 'Payasam & Sweets', icon: 'Cake' },
  { id: 'beverages', name: 'Filter Coffee & Drinks', icon: 'Wine' },
];

export const DISHES = [
  {
    id: 'dish-001',
    name: 'Masala Dosa',
    shortDescription: 'Crisp fermented rice crepe with spiced potato filling & chutney',
    price: 140,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    category: 'dosas',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: true,
    jainAvailable: true,

    spiceLevel: 'MEDIUM',
    allergens: ['DAIRY'],
    glutenStatus: 'GLUTEN_FREE_OPTION_AVAILABLE',

    portionLabel: 'Regular',
    serves: '1 person',

    bestseller: true,
    bestsellerReason: 'Most ordered breakfast dish this month',

    preparationTimeMinutes: 15,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [
      {
        itemId: 'dish-008',
        name: 'Filter Coffee',
        price: 60,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      },
    ],

    customizationAvailable: true,
    newCustomerRecommendation: true,
    newCustomerReason: 'Balanced spice and one of our most popular choices',

    culturalStory:
      'Originating in the temple kitchens of Udupi, Karnataka, the Masala Dosa is a masterpiece of fermented rice and black gram batter, pan-roasted to a paper-thin gold crust and filled with crushed potatoes tempered with mustard seeds and curry leaves.',

    // Backward compatibility fields
    isVeg: true,
    isSpicy: false,
    description: 'Crisp fermented rice crepe with spiced potato filling & chutney',
    prepTime: '15 min',

    modifierGroups: [
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'mild', label: 'Mild', priceDelta: 0 },
          { id: 'medium', label: 'Medium', priceDelta: 0 },
          { id: 'spicy', label: 'Spicy', priceDelta: 0 },
        ],
      },
      {
        id: 'cooking-fat',
        label: 'Cooking Preference',
        type: 'SINGLE_SELECT',
        required: false,
        options: [
          { id: 'oil', label: 'Standard Oil Roast', priceDelta: 0 },
          { id: 'butter', label: 'Desi Butter Roast', priceDelta: 20 },
          { id: 'ghee', label: 'Pure Cow Ghee Roast', priceDelta: 30 },
        ],
      },
      {
        id: 'remove',
        label: 'Remove Ingredients',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'onion', label: 'No Onion', priceDelta: 0 },
          { id: 'garlic', label: 'No Garlic', priceDelta: 0 },
          { id: 'chilli', label: 'No Green Chilli', priceDelta: 0 },
        ],
      },
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'extra-chutney', label: 'Extra Coconut Chutney', priceDelta: 20 },
          { id: 'extra-sambar', label: 'Extra Drumstick Sambar', priceDelta: 25 },
          { id: 'extra-cheese', label: 'Extra Amul Cheese', priceDelta: 40 },
        ],
      },
      {
        id: 'size',
        label: 'Portion Size',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'regular', label: 'Regular · Serves 1', priceDelta: 0 },
          { id: 'large', label: 'Jumbo Roast · Serves 1–2', priceDelta: 60 },
        ],
      },
      {
        id: 'combo',
        label: 'Make It a Combo',
        type: 'SINGLE_SELECT',
        required: false,
        options: [
          { id: 'none', label: 'No Combo', priceDelta: 0 },
          { id: 'coffee-combo', label: 'Add Kumbakonam Filter Coffee', priceDelta: 50 },
        ],
      },
    ],
  },
  {
    id: 'dish-002',
    name: 'Chettinad Chicken Biryani',
    shortDescription: 'Seeraga samba rice cooked with tender chicken and aromatic Karaikudi spices',
    price: 320,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    category: 'rice_biryani',

    foodType: 'NON_VEGETARIAN',
    containsEgg: false,
    veganAvailable: false,
    jainAvailable: false,

    spiceLevel: 'SPICY',
    allergens: ['DAIRY'],
    glutenStatus: 'GLUTEN_FREE_RECIPE',

    portionLabel: 'Regular portion',
    serves: '1 person',

    bestseller: true,
    bestsellerReason: 'Top ordered dinner dish with 95% repeat orders',

    preparationTimeMinutes: 20,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [
      {
        itemId: 'drink-002',
        name: 'Cooling Mint Lassi',
        price: 70,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      },
    ],

    customizationAvailable: true,
    newCustomerRecommendation: true,
    newCustomerReason: 'Authentic Chettinad flavor signature specialty',

    culturalStory:
      'Crafted using tiny fragrant Seeraga Samba rice grains native to Tamil Nadu, Chettinad biryani relies on stone-ground peppercorns, marathi moggu, and star anise for its deep savory heat.',

    isVeg: false,
    isSpicy: true,
    description: 'Seeraga samba rice cooked with tender chicken and aromatic Karaikudi spices',
    prepTime: '20 min',

    modifierGroups: [
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'mild', label: 'Mild Spice', priceDelta: 0 },
          { id: 'medium', label: 'Medium Spice', priceDelta: 0 },
          { id: 'spicy', label: 'Authentic Chettinad Spicy', priceDelta: 0 },
        ],
      },
      {
        id: 'size',
        label: 'Portion Size',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'regular', label: 'Regular Portion · Serves 1', priceDelta: 0 },
          { id: 'family', label: 'Family Bucket · Serves 3–4', priceDelta: 450 },
        ],
      },
      {
        id: 'remove',
        label: 'Remove Ingredients',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'fried-onions', label: 'Remove Fried Onions (Birista)', priceDelta: 0 },
          { id: 'mint', label: 'No Fresh Mint Leaves', priceDelta: 0 },
        ],
      },
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'extra-chicken', label: 'Extra Chicken Pieces (2 pcs)', priceDelta: 90 },
          { id: 'extra-raita', label: 'Extra Cucumber Onion Raita', priceDelta: 30 },
          { id: 'boiled-egg', label: 'Add Boiled Egg', priceDelta: 25 },
        ],
      },
      {
        id: 'combo',
        label: 'Make It a Combo',
        type: 'SINGLE_SELECT',
        required: false,
        options: [
          { id: 'none', label: 'No Combo', priceDelta: 0 },
          { id: 'soft-drink', label: 'Add Chilled Soft Drink (300ml)', priceDelta: 40 },
        ],
      },
    ],
  },
  {
    id: 'dish-003',
    name: 'Paneer Butter Masala',
    shortDescription: 'Cottage cheese cubes simmered in creamy tomato gravy with kasuri methi',
    price: 290,
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
    category: 'curries',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: true,
    jainAvailable: false,

    spiceLevel: 'MILD',
    allergens: ['DAIRY', 'NUTS'],
    glutenStatus: 'GLUTEN_FREE_RECIPE',

    portionLabel: 'Regular portion',
    serves: '1–2 persons',

    bestseller: true,
    bestsellerReason: 'Frequently reordered by families for main course',

    preparationTimeMinutes: 18,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [
      {
        itemId: 'bread-001',
        name: 'Butter Naan',
        price: 50,
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
      },
    ],

    customizationAvailable: true,
    newCustomerRecommendation: false,
    newCustomerReason: '',

    culturalStory:
      'A rich North-meets-South favorite featuring hand-crafted paneer gently poached in a velvet reduction of vine-ripened tomatoes, butter, cashew paste, and sun-dried fenugreek leaves.',

    isVeg: true,
    isSpicy: false,
    description: 'Cottage cheese cubes simmered in creamy tomato gravy with kasuri methi',
    prepTime: '18 min',

    modifierGroups: [
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'mild', label: 'Mild & Creamy', priceDelta: 0 },
          { id: 'medium', label: 'Medium Spice', priceDelta: 0 },
          { id: 'spicy', label: 'Spicy', priceDelta: 0 },
        ],
      },
      {
        id: 'size',
        label: 'Portion Size',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'regular', label: 'Regular Portion · Serves 1–2', priceDelta: 0 },
          { id: 'large', label: 'Large Portion · Serves 3–4', priceDelta: 120 },
        ],
      },
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'extra-paneer', label: 'Extra Fresh Paneer Cubes', priceDelta: 60 },
          { id: 'extra-cream', label: 'Extra Fresh Malai Cream', priceDelta: 25 },
        ],
      },
      {
        id: 'combo',
        label: 'Make It a Combo',
        type: 'SINGLE_SELECT',
        required: false,
        options: [
          { id: 'none', label: 'No Combo', priceDelta: 0 },
          { id: 'naan-combo', label: 'Add 2 Garlic Butter Naans', priceDelta: 90 },
        ],
      },
    ],
  },
  {
    id: 'dish-004',
    name: 'Special South Veg Thali',
    shortDescription: 'Complete traditional feast with rice, sambar, rasam, 2 curries, appalam & dessert',
    price: 220,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    category: 'curries',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: false,
    jainAvailable: true,

    spiceLevel: 'MEDIUM',
    allergens: ['DAIRY', 'GLUTEN'],
    glutenStatus: 'CONTAINS_GLUTEN',

    portionLabel: 'Full Thali',
    serves: '1 person',

    bestseller: true,
    bestsellerReason: 'Highest rated complete meal for lunch',

    preparationTimeMinutes: 15,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [
      {
        itemId: 'drink-003',
        name: 'Spiced Neer Mor (Buttermilk)',
        price: 40,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
      },
    ],

    customizationAvailable: true,
    newCustomerRecommendation: true,
    newCustomerReason: 'The ultimate sampler of authentic South Indian daily specialties',

    culturalStory:
      'Served traditionally on a banana leaf arrangement, the Thali balances all six tastes (Shadrasa) prescribed in Ayurveda, ranging from tangy tamarind rasam to soothing curd rice.',

    isVeg: true,
    isSpicy: false,
    description: 'Complete traditional feast with rice, sambar, rasam, 2 curries, appalam & dessert',
    prepTime: '15 min',

    modifierGroups: [
      {
        id: 'size',
        label: 'Thali Tier',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'regular', label: 'Regular Thali · Serves 1', priceDelta: 0 },
          { id: 'deluxe', label: 'Deluxe Royal Thali (Includes Paneer Curry & Malabar Parotta)', priceDelta: 70 },
        ],
      },
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'extra-rice', label: 'Extra Steamed Ponni Rice', priceDelta: 30 },
          { id: 'extra-dal', label: 'Extra Paruppu Ghee Dal', priceDelta: 25 },
          { id: 'extra-sweet', label: 'Extra Gulab Jamun (2 pcs)', priceDelta: 40 },
        ],
      },
      {
        id: 'combo',
        label: 'Make It a Combo',
        type: 'SINGLE_SELECT',
        required: false,
        options: [
          { id: 'none', label: 'No Combo', priceDelta: 0 },
          { id: 'buttermilk-combo', label: 'Add Chilled Spiced Buttermilk', priceDelta: 30 },
        ],
      },
    ],
  },
  {
    id: 'dish-005',
    name: 'Mysore Red Masala Dosa',
    shortDescription: 'Crisp dosa smeared with fiery red garlic-chilli chutney and potato mash',
    price: 160,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    category: 'dosas',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: false,
    jainAvailable: false,

    spiceLevel: 'SPICY',
    allergens: ['DAIRY'],
    glutenStatus: 'GLUTEN_FREE_OPTION_AVAILABLE',

    portionLabel: 'Regular',
    serves: '1 person',

    bestseller: false,
    bestsellerReason: '',

    preparationTimeMinutes: 15,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [],

    customizationAvailable: true,
    newCustomerRecommendation: false,
    newCustomerReason: '',

    culturalStory:
      'Inspired by the royal kitchens of Mysuru Palace, this signature dosa features an inner layer of pungent red chilli chutney spread before adding seasoned mashed potatoes.',

    isVeg: true,
    isSpicy: true,
    description: 'Crisp dosa smeared with fiery red garlic-chilli chutney and potato mash',
    prepTime: '15 min',

    modifierGroups: [
      {
        id: 'spice',
        label: 'Red Chutney Intensity',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'medium', label: 'Standard Mysore Spice', priceDelta: 0 },
          { id: 'spicy', label: 'Extra Fiery Chutney', priceDelta: 0 },
        ],
      },
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'cheese', label: 'Melted Amul Cheese Grating', priceDelta: 40 },
        ],
      },
    ],
  },
  {
    id: 'dish-006',
    name: 'Malabar Egg Kottu Parotta',
    shortDescription: 'Shredded flaky parotta wok-tossed with scrambled eggs, onions & salan gravy',
    price: 210,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'starters',

    foodType: 'CONTAINS_EGG',
    containsEgg: true,
    veganAvailable: false,
    jainAvailable: false,

    spiceLevel: 'SPICY',
    allergens: ['EGG', 'GLUTEN'],
    glutenStatus: 'CONTAINS_GLUTEN',

    portionLabel: 'Regular',
    serves: '1 person',

    bestseller: false,
    bestsellerReason: '',

    preparationTimeMinutes: 15,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [],

    customizationAvailable: true,
    newCustomerRecommendation: false,
    newCustomerReason: '',

    culturalStory:
      'A famous street food delicacy across Kerala and Tamil Nadu where soft flaky parottas are rhythmic-chopped on a flat iron griddle alongside eggs, curry spices, and onion-tomato gravy.',

    isVeg: false,
    isSpicy: true,
    description: 'Shredded flaky parotta wok-tossed with scrambled eggs, onions & salan gravy',
    prepTime: '15 min',

    modifierGroups: [
      {
        id: 'spice',
        label: 'Spice Level',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'medium', label: 'Medium', priceDelta: 0 },
          { id: 'spicy', label: 'Street Style Spicy', priceDelta: 0 },
        ],
      },
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'extra-egg', label: 'Extra Scrambled Egg', priceDelta: 30 },
        ],
      },
    ],
  },
  {
    id: 'dish-007',
    name: 'Tender Coconut Elaneer Payasam',
    shortDescription: 'Chilled dessert of soft coconut pulp, cardamom milk & ghee-roasted cashews',
    price: 110,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    category: 'desserts',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: true,
    jainAvailable: true,

    spiceLevel: 'MILD',
    allergens: ['DAIRY', 'NUTS'],
    glutenStatus: 'GLUTEN_FREE_RECIPE',

    portionLabel: 'Individual cup',
    serves: '1 person',

    bestseller: true,
    bestsellerReason: 'Top rated dessert by 98% of diners',

    preparationTimeMinutes: 5,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [],

    customizationAvailable: true,
    newCustomerRecommendation: true,
    newCustomerReason: 'A delicate cooling dessert unique to coastal Karnataka and Kerala',

    culturalStory:
      'Created using tender coconut water and tender coconut meat blended into cold condensed milk infused with green cardamom and saffron strands.',

    isVeg: true,
    isSpicy: false,
    description: 'Chilled dessert of soft coconut pulp, cardamom milk & ghee-roasted cashews',
    prepTime: '5 min',

    modifierGroups: [
      {
        id: 'extras',
        label: 'Add Extras',
        type: 'MULTI_SELECT',
        required: false,
        options: [
          { id: 'extra-cashew', label: 'Extra Ghee Roasted Cashews & Pistachios', priceDelta: 30 },
        ],
      },
    ],
  },
  {
    id: 'dish-008',
    name: 'Kumbakonam Degree Filter Coffee',
    shortDescription: 'Traditional dark-roast chicory coffee with frothy full-cream milk in brass dabarah',
    price: 60,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    category: 'beverages',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: true,
    jainAvailable: true,

    spiceLevel: 'MILD',
    allergens: ['DAIRY'],
    glutenStatus: 'GLUTEN_FREE_RECIPE',

    portionLabel: 'Brass Dabarah',
    serves: '1 person',

    bestseller: true,
    bestsellerReason: 'Iconic South Indian beverage ordered with 80% of breakfast items',

    preparationTimeMinutes: 5,
    availabilityStatus: 'AVAILABLE',

    recommendedPairings: [],

    customizationAvailable: true,
    newCustomerRecommendation: false,
    newCustomerReason: '',

    culturalStory:
      'Brewed using a traditional drip filter from dark-roasted plantation Arabica and pea-berry beans with 15% chicory for body, poured back and forth from height into a polished brass dabarah.',

    isVeg: true,
    isSpicy: false,
    description: 'Traditional dark-roast chicory coffee with frothy full-cream milk in brass dabarah',
    prepTime: '5 min',

    modifierGroups: [
      {
        id: 'sweetness',
        label: 'Sweetness & Milk Option',
        type: 'SINGLE_SELECT',
        required: true,
        options: [
          { id: 'standard', label: 'Standard Sweetness with Full Cream Milk', priceDelta: 0 },
          { id: 'less-sugar', label: 'Less Sugar / No Sugar', priceDelta: 0 },
          { id: 'jaggery', label: 'Organic Palm Jaggery (Karupatti)', priceDelta: 15 },
        ],
      },
    ],
  },
  {
    id: 'dish-009',
    name: 'Crispy Medu Vada (2 pcs)',
    shortDescription: 'Golden fried savory urad dal donuts served with sambar and coconut chutney',
    price: 90,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    category: 'starters',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: true,
    jainAvailable: true,

    spiceLevel: 'MILD',
    allergens: ['DAIRY'],
    glutenStatus: 'GLUTEN_FREE_RECIPE',

    portionLabel: '2 pieces',
    serves: '1 person',

    bestseller: false,
    bestsellerReason: '',

    preparationTimeMinutes: 10,
    availabilityStatus: 'LIMITED_AVAILABILITY',

    recommendedPairings: [],

    customizationAvailable: false,
    newCustomerRecommendation: false,
    newCustomerReason: '',

    culturalStory:
      'Crunchy on the outside and airy inside, Medu Vada is crafted from spiced urad dal paste, whole peppercorns, curry leaves, and ginger.',

    isVeg: true,
    isSpicy: false,
    description: 'Golden fried savory urad dal donuts served with sambar and coconut chutney',
    prepTime: '10 min',

    modifierGroups: [],
  },
  {
    id: 'dish-010',
    name: 'Saffron Rava Kesari',
    shortDescription: 'Warm semolina dessert cooked in ghee with saffron, cashews & raisins',
    price: 100,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    category: 'desserts',

    foodType: 'VEGETARIAN',
    containsEgg: false,
    veganAvailable: false,
    jainAvailable: true,

    spiceLevel: 'MILD',
    allergens: ['DAIRY', 'GLUTEN', 'NUTS'],
    glutenStatus: 'CONTAINS_GLUTEN',

    portionLabel: 'Regular bowl',
    serves: '1 person',

    bestseller: false,
    bestsellerReason: '',

    preparationTimeMinutes: 0,
    availabilityStatus: 'SOLD_OUT',

    recommendedPairings: [],

    customizationAvailable: false,
    newCustomerRecommendation: false,
    newCustomerReason: '',

    culturalStory:
      'A festive South Indian sweet prepared by roasting fine semolina in pure ghee, infusing with saffron water, and garnishing with fried nuts.',

    isVeg: true,
    isSpicy: false,
    description: 'Warm semolina dessert cooked in ghee with saffron, cashews & raisins',
    prepTime: '0 min',

    modifierGroups: [],
  },
];
