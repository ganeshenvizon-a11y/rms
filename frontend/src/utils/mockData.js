export const RESTAURANT_INFO = {
  name: "Dakshin Heritage",
  tagline: "Authentic South Indian Tiffin & Fine Dining Gastronomy",
  established: "1992",
  location: "Indiranagar Suite & Garden, Bengaluru",
  logo: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=300&q=80",
  heroImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
  rating: 4.9,
  reviewsCount: 2180,
  taxRate: 0.05, // 5% GST
  vatRate: 0.08, // 8% VAT
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
    id: 'dish-1',
    name: 'Desi Ghee Roast Masala Dosa',
    italianName: 'Golden Crispy Ghee Dosa',
    category: 'dosas',
    price: 12.50,
    prepTime: '10-12 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    calories: '520 kcal',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    description: 'Golden crispy fermented rice crepe roasted in pure clarified desi ghee, filled with seasoned potato masala. Served with hot drumstick sambar and coconut-tomato chutneys.',
    ingredients: ['Fermented Rice Batter', 'Pure Desi Ghee', 'Spiced Potato Masala', 'Drumstick Sambar', 'Coconut Chutney', 'Tomato Chutney'],
    customizations: [
      { id: 'ghee', name: 'Ghee Level', required: false, options: [
        { name: 'Standard Ghee Roast', price: 0 },
        { name: 'Extra Pure Cow Ghee', price: 1.50 },
        { name: 'Ghee Podi Roast (Spiced Powder)', price: 2.00 }
      ]},
      { id: 'chutney', name: 'Extra Chutney Dip', required: false, options: [
        { name: 'Mint Coriander Chutney', price: 1.00 },
        { name: 'Fiery Garlic Red Chutney', price: 1.20 }
      ]}
    ]
  },
  {
    id: 'dish-2',
    name: 'Mysore Red Masala Dosa Special',
    italianName: 'Spicy Mysore Chutney Dosa',
    category: 'dosas',
    price: 13.50,
    prepTime: '12-15 min',
    isVeg: true,
    isSpicy: true,
    isChefSpecial: true,
    rating: 4.9,
    calories: '560 kcal',
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    description: 'Crispy dosa smeared inside with authentic spicy red garlic-chilli paste, stuffed with tempered potato mash, served with rich coconut chutney and piping hot sambar.',
    ingredients: ['Crispy Dosa Batter', 'Mysore Spicy Red Chilli Paste', 'Tempered Potato Mash', 'Butter', 'Fresh Coconut Chutney'],
    customizations: [
      { id: 'cheese', name: 'Cheese Addition', required: false, options: [
        { name: 'Melted Amul Cheese Grating', price: 2.50 }
      ]}
    ]
  },
  {
    id: 'dish-3',
    name: 'Steamed Rice Idli & Medu Vada Platter',
    italianName: 'Idli Vada Combo Feast',
    category: 'starters',
    price: 9.00,
    prepTime: '8-10 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    calories: '380 kcal',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    description: 'Two pillow-soft steamed rice cakes and one crispy golden lentil donut. Served with traditional lentil vegetable sambar and trio of coconut, tomato, & coriander chutneys.',
    ingredients: ['Parboiled Rice', 'Urad Dal', 'Whole Black Peppercorns', 'Curry Leaves', 'Mustard Seeds', 'Drumstick Sambar'],
    customizations: [
      { id: 'vadaExtra', name: 'Add Extra Vada', required: false, options: [
        { name: '1 Extra Crispy Medu Vada', price: 3.00 },
        { name: 'Sambar Dipped Vada (Sambar Vada)', price: 3.50 }
      ]}
    ]
  },
  {
    id: 'dish-4',
    name: 'Chettinad Seeraga Samba Chicken Biryani',
    italianName: 'Chettinad Special Biryani',
    category: 'rice_biryani',
    price: 19.50,
    prepTime: '20-25 min',
    isVeg: false,
    isSpicy: true,
    isChefSpecial: true,
    rating: 4.9,
    calories: '780 kcal',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    description: 'Aromatic Seeraga Samba short-grain rice slow-cooked with tender chicken, freshly ground Karaikudi Chettinad spices, star anise, marathi moggu, accompanied by onion raita & salan.',
    ingredients: ['Seeraga Samba Rice', 'Farm Chicken', 'Chettinad Masala', 'Kalpasi (Stone Flower)', 'Ghee', 'Shallots', 'Raita'],
    customizations: [
      { id: 'spiceLevel', name: 'Spice Level', required: false, options: [
        { name: 'Authentic Chettinad Spicy', price: 0 },
        { name: 'Mild Spice', price: 0 }
      ]}
    ]
  },
  {
    id: 'dish-5',
    name: 'Malabar Layered Parotta & Veg Kurma',
    italianName: 'Kerala Parotta & Kurma',
    category: 'curries',
    price: 16.50,
    prepTime: '15-18 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.8,
    calories: '680 kcal',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    description: 'Flaky, multi-layered hand-tossed Kerala parottas (2 pcs) served with rich creamy coconut-cashew vegetable kurma infused with cardamom and fennel.',
    ingredients: ['Refined Flour Parotta', 'Coconut Paste', 'Cashews', 'Green Peas', 'Carrots', 'Cardamom', 'Fennel Seeds'],
    customizations: [
      { id: 'curryChoice', name: 'Curry Option', required: false, options: [
        { name: 'Coconut Veg Kurma (Included)', price: 0 },
        { name: 'Upgrade to Spicy Chicken Sukka Gravy', price: 3.50 }
      ]}
    ]
  },
  {
    id: 'dish-6',
    name: 'Hyderabadi Shahi Paneer Dum Biryani',
    italianName: 'Royal Hyderabadi Biryani',
    category: 'rice_biryani',
    price: 18.00,
    prepTime: '20-22 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    calories: '710 kcal',
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80',
    description: 'Long-grain Basmati rice dum-cooked on low flame with marinated cottage cheese cubes, saffron milk, fried onions, mint, and whole aromatic spices.',
    ingredients: ['Aged Basmati Rice', 'Paneer Cubes', 'Kashmiri Saffron', 'Caramelised Shallots', 'Mint', 'Mirchi Ka Salan'],
    customizations: []
  },
  {
    id: 'dish-7',
    name: 'Malabar Coconut Fish Curry (Meen Curry)',
    italianName: 'Kerala Coastal Fish Curry',
    category: 'curries',
    price: 21.00,
    prepTime: '18-22 min',
    isVeg: false,
    isSpicy: true,
    isChefSpecial: true,
    rating: 4.9,
    calories: '610 kcal',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    description: 'Fresh Seer Fish steaks simmered in creamy coconut milk gravy flavoured with Malabar tamarind (Kodampuli), fresh turmeric, fenugreek, and tempered curry leaves.',
    ingredients: ['Fresh Seer Fish', 'First-press Coconut Milk', 'Kodampuli Tamarind', 'Shallots', 'Green Chillies', 'Curry Leaves'],
    customizations: [
      { id: 'bread', name: 'Accompaniment', required: false, options: [
        { name: 'Soft Lace Appams (2 pcs)', price: 3.00 },
        { name: 'Steamed Red Matta Rice', price: 2.50 }
      ]}
    ]
  },
  {
    id: 'dish-8',
    name: 'Tender Coconut Elaneer Payasam',
    italianName: 'Elaneer Coconut Kheer',
    category: 'desserts',
    price: 8.50,
    prepTime: '5 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    calories: '320 kcal',
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    description: 'Chilled signature sweet dessert crafted with soft tender coconut pulp, coconut water, cardamom-infused milk, topped with ghee-roasted cashews and almonds.',
    ingredients: ['Tender Coconut Meat', 'Coconut Water', 'Whole Milk', 'Green Cardamom', 'Ghee-roasted Cashews', 'Saffron'],
    customizations: []
  },
  {
    id: 'dish-9',
    name: 'Kumbakonam Degree Filter Kaapi',
    italianName: 'Traditional Filter Coffee',
    category: 'beverages',
    price: 4.50,
    prepTime: '5 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: true,
    rating: 4.9,
    calories: '110 kcal',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    description: 'Authentic South Indian Filter Coffee brewed from dark roasted Chicory-infused Arabica coffee beans, mixed with thick frothy full-cream milk in a traditional brass Dabarah & Tumbler.',
    ingredients: ['Arabica & Chicory Coffee Brew', 'Full Cream Milk', 'Organic Jaggery / Sugar'],
    customizations: [
      { id: 'sweetness', name: 'Sweetness Level', required: false, options: [
        { name: 'Standard Sweetness', price: 0 },
        { name: 'Less Sugar / No Sugar', price: 0 },
        { name: 'Organic Palm Jaggery (Karupatti)', price: 1.00 }
      ]}
    ]
  },
  {
    id: 'dish-10',
    name: 'Madurai Special Cooling Jigarthanda',
    italianName: 'Madurai Nannari Shake',
    category: 'beverages',
    price: 6.00,
    prepTime: '5 min',
    isVeg: true,
    isSpicy: false,
    isChefSpecial: false,
    rating: 4.8,
    calories: '280 kcal',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    description: 'Famous Madurai cooling dessert drink prepared with natural almond gum (badam pisin), nannari root syrup, reduced milk, topped with a scoop of nannari ice cream.',
    ingredients: ['Badam Pisin (Almond Gum)', 'Reduced Basundi Milk', 'Nannari Syrup', 'Nannari Ice Cream'],
    customizations: []
  }
];
