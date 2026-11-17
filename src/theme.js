// Colors copied from the website's style.css so the app matches Trabaho Tu Bunawan
export const colors = {
  forest: '#0F3D2E',
  green: '#1B7F45',
  leaf: '#2FB463',
  gold: '#F2B705',
  goldInk: '#5A4300',
  goldSoft: '#FFF4D2',
  mint: '#EEF7F1',
  blue: '#1F5FA6',      // the map-pin blue from the logo: used for places and verified badges
  blueSoft: '#E4EEF8',
  bg: '#F6F8F7',
  card: '#FFFFFF',
  ink: '#1B1F2A',
  muted: '#6B7280',
  line: '#E5E7EB',
  danger: '#C0392B',
  dangerSoft: '#FDECEA',
};
export const radius = { sm: 8, md: 12, lg: 16, xl: 24 };

// One soft shadow, tinted with the forest green. Only used on surfaces that float above the page.
export const shadow = {
  shadowColor: '#0F3D2E',
  shadowOpacity: 0.1,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};

// Every job category gets its own tint so the list is easy to scan: [background, icon color]
export const categoryTints = {
  1: ['#E4EEF8', '#1F5FA6'],  // Retail
  2: ['#FDE9DC', '#B4531F'],  // Food and Service
  3: ['#E3F1E8', '#1B7F45'],  // Farming and Agriculture
  4: ['#FFF1CC', '#8A6200'],  // Construction
  5: ['#E8E6F8', '#4B3FA8'],  // Education
  6: ['#DDF1F2', '#12717A'],  // Driver and Delivery
  7: ['#FBE4EE', '#A52D61'],  // Household Help
  8: ['#E6EAF0', '#374A63'],  // Office and Admin
  9: ['#FBE2E0', '#B03A2E'],  // Health
  10: ['#EEEEEE', '#555555'], // Others
};
export const tintFor = (categoryId) => categoryTints[categoryId] || categoryTints[10];

export const TAGLINE = 'Local Skills. Local Job. Better Futures.';
