export const MOCK_USER = null;

export const MOCK_TRIPS = [
  {
    id: "trip_1",
    name: "Japan Adventure",
    description: "A two-week journey through Tokyo, Kyoto, and Osaka.",
    startDate: "2024-10-10",
    endDate: "2024-10-24",
    coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop",
    status: "upcoming",
    destinationCount: 3,
    progress: 30,
    budget: {
      total: 5000,
      spent: 2150,
      categories: [
        { name: 'Flights', value: 1200 },
        { name: 'Hotels', value: 600 },
        { name: 'Food', value: 200 },
        { name: 'Activities', value: 150 }
      ]
    },
    cities: [
      {
        id: "city_1",
        name: "Tokyo",
        activities: [
          { id: "act_1", time: "10:00 AM", name: "Meiji Shrine", loc: "Shibuya", cost: 0 },
          { id: "act_2", time: "01:00 PM", name: "Sushi Lunch", loc: "Tsukiji", cost: 35 },
          { id: "act_3", time: "04:00 PM", name: "Akihabara Tour", loc: "Akihabara", cost: 15 }
        ]
      }
    ]
  }
];
export const POPULAR_CITIES = [
  { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400&auto=format&fit=crop' },
  { name: 'Bali', country: 'Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400&auto=format&fit=crop' },
  { name: 'New York', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=400&auto=format&fit=crop' },
  { name: 'Rome', country: 'Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=400&auto=format&fit=crop' }
];

export const ACTIVITIES = [];
