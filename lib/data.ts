import { ShortVideo } from './schemas';

export const shortsData: ShortVideo[] = [
  {
    id: '1',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Big Buck Bunny',
    description: 'A delightful animated adventure featuring a large rabbit dealing with mischievous flying creatures in a vibrant forest setting.',
    tags: ['animation', 'nature', 'adventure', 'animals'],
    duration: 30,
    likes: 1247000,
    quality: '480p',
    comments: [
      { id: '1', author: 'Alice', text: 'Amazing animation!', timestamp: Date.now() - 86400000, likes: 12 },
      { id: '2', author: 'Bob', text: 'Love the forest scenes', timestamp: Date.now() - 43200000, likes: 8 }
    ],
    rating: 4.5,
    totalRatings: 1250
  },
  {
    id: '2',
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    title: 'Quick Sample',
    description: 'A brief cinematic moment capturing the essence of modern video technology and digital storytelling.',
    tags: ['tech', 'demo', 'short'],
    duration: 5,
    likes: 892000,
    quality: '720p',
    comments: [
      { id: '3', author: 'Charlie', text: 'Very smooth playback', timestamp: Date.now() - 3600000, likes: 5 }
    ],
    rating: 4.2,
    totalRatings: 890
  },
  {
    id: '3',
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    title: 'Ten Second Wonder',
    description: 'Experience ten seconds of carefully crafted visual content designed to showcase smooth playback.',
    tags: ['demo', 'tech', 'cinematic'],
    duration: 10,
    likes: 2156000,
    quality: '1080p',
    comments: [
      { id: '4', author: 'Diana', text: 'Perfect for quick entertainment', timestamp: Date.now() - 7200000, likes: 15 },
      { id: '5', author: 'Eve', text: 'Great quality!', timestamp: Date.now() - 1800000, likes: 7 }
    ],
    rating: 4.8,
    totalRatings: 2100
  },
  {
    id: '4',
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    title: 'Quick Escape',
    description: 'A short journey through time and space, perfect for testing video streaming capabilities.',
    tags: ['adventure', 'demo', 'scenic'],
    duration: 15,
    likes: 1678000,
    quality: '480p',
    comments: [
      { id: '6', author: 'Frank', text: 'Love the space theme', timestamp: Date.now() - 86400000 * 2, likes: 9 }
    ],
    rating: 4.1,
    totalRatings: 1650
  },
  {
    id: '5',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Big Buck Bunny: Full Adventure',
    description: 'The complete story of a giant rabbit and his forest friends in this charming open-source animated short film.',
    tags: ['animation', 'nature', 'animals', 'adventure'],
    duration: 596,
    likes: 3421000,
    quality: '1080p',
    comments: [
      { id: '7', author: 'Grace', text: 'Classic animation!', timestamp: Date.now() - 86400000 * 3, likes: 22 },
      { id: '8', author: 'Henry', text: 'Worth watching the full version', timestamp: Date.now() - 43200000, likes: 18 }
    ],
    rating: 4.9,
    totalRatings: 3400
  },
  {
    id: '6',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Elephants Dream',
    description: 'A surreal science fiction journey through a mechanical world, exploring themes of reality and perception.',
    tags: ['animation', 'sci-fi', 'artistic', 'adventure'],
    duration: 653,
    likes: 2834000,
    quality: '720p',
    comments: [
      { id: '9', author: 'Ivy', text: 'Mind-bending visuals', timestamp: Date.now() - 86400000 * 4, likes: 14 },
      { id: '10', author: 'Jack', text: 'Very creative', timestamp: Date.now() - 21600000, likes: 11 }
    ],
    rating: 4.6,
    totalRatings: 2800
  },
  {
    id: '7',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'For Bigger Blazes',
    description: 'An intense showcase of fire and energy, demonstrating the power of high-quality video streaming.',
    tags: ['action', 'demo', 'cinematic', 'intense'],
    duration: 15,
    likes: 1923000,
    quality: '1080p',
    comments: [
      { id: '11', author: 'Kate', text: 'Amazing fire effects!', timestamp: Date.now() - 3600000, likes: 13 }
    ],
    rating: 4.4,
    totalRatings: 1900
  },
  {
    id: '8',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'For Bigger Escapes',
    description: 'Embark on a visual journey showcasing breathtaking landscapes and the freedom of exploration.',
    tags: ['nature', 'scenic', 'adventure', 'relaxing'],
    duration: 15,
    likes: 2567000,
    quality: '720p',
    comments: [
      { id: '12', author: 'Liam', text: 'Beautiful scenery', timestamp: Date.now() - 7200000, likes: 16 },
      { id: '13', author: 'Mia', text: 'Very relaxing to watch', timestamp: Date.now() - 1800000, likes: 9 }
    ],
    rating: 4.7,
    totalRatings: 2550
  },
  {
    id: '9',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    title: 'For Bigger Fun',
    description: 'A vibrant celebration of joy and entertainment, perfect for uplifting your spirits.',
    tags: ['fun', 'urban', 'energetic', 'entertainment'],
    duration: 60,
    likes: 3102000,
    quality: '1080p',
    comments: [
      { id: '14', author: 'Noah', text: 'So much energy!', timestamp: Date.now() - 86400000, likes: 20 },
      { id: '15', author: 'Olivia', text: 'Makes me smile every time', timestamp: Date.now() - 43200000, likes: 17 }
    ],
    rating: 4.8,
    totalRatings: 3080
  },
  {
    id: '10',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    title: 'For Bigger Joyrides',
    description: 'Experience the thrill of the ride with stunning visuals and dynamic camera work.',
    tags: ['action', 'adventure', 'urban', 'exciting'],
    duration: 15,
    likes: 2890000,
    quality: '720p',
    comments: [
      { id: '16', author: 'Parker', text: 'Adrenaline rush!', timestamp: Date.now() - 3600000, likes: 19 },
      { id: '17', author: 'Quinn', text: 'Great camera work', timestamp: Date.now() - 1800000, likes: 12 }
    ],
    rating: 4.5,
    totalRatings: 2870
  },
];