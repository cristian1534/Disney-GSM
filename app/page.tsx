"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  key: 'overall' | 'friendliness' | 'food';
  label: string;
  desc: string;
}

interface Option {
  label: string;
  value: 50 | 75 | 100;
}

interface Ratings {
  overall: number;
  friendliness: number;
  food: number;
  [key: string]: number; // Index signature for string access
}

interface RestaurantTheme {
  bgImage: string;
  color: string;
  icon: string;
}

interface RestaurantThemes {
  [key: string]: RestaurantTheme;
}

const categories: Category[] = [
  { key: "overall", label: "Overall Experience", desc: "Evaluate performance of the service team." },
  { key: "friendliness", label: "Friendliness", desc: "Evaluate the kindness and attentiveness of the staff." },
  { key: "food", label: "Food Quality", desc: "Evaluate the taste, freshness, and presentation of the food." },
];

const options: Option[] = [
  { label: "Good", value: 50 },
  { label: "Very Good", value: 75 },
  { label: "Excellent", value: 100 },
];

const mickeyFaces: Record<number, string> = {
  50: "😞",
  75: "😐",
  100: "😃",
};

// Disney themes for each restaurant
const restaurantThemes: RestaurantThemes = {
  "Royal Palace": {
    bgImage: "url('/globe.svg')",
    color: "#e7b10a",
    icon: "👑"
  },
  "Animator's Palate": {
    bgImage: "url('/file.svg')",
    color: "#e74c3c",
    icon: "🎨"
  },
  "Enchanted Garden": {
    bgImage: "url('/window.svg')",
    color: "#2ecc71",
    icon: "🌿"
  }
};

interface RatingCardProps {
  restaurant: string;
}

function RatingCard({ restaurant }: RatingCardProps) {
  const [ratings, setRatings] = useState<Ratings>({ overall: 100, friendliness: 100, food: 100 });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedCategories, setCompletedCategories] = useState(3); // Start with all completed
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const theme = restaurantThemes[restaurant] || restaurantThemes["Animator's Palate"];

  // Check if all categories have been rated
  useEffect(() => {
    const completed = Object.values(ratings).filter(value => value > 0).length;
    setCompletedCategories(completed);
    
    if (completed === Object.keys(ratings as Ratings).length) {
      setShowCompletionMessage(true);
    }
  }, [ratings]);

  const handleSelect = (category: string, value: number) => {
    // Animation effect when selecting
    setActiveCategory(category);
    setTimeout(() => setActiveCategory(null), 700);
    
    // Try to play sound effect on selection
    try {
      const audio = new Audio();
      audio.src = value === 100 ? 
        "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" : 
        "https://www.soundjay.com/buttons/sounds/button-09.mp3";
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio play prevented:', e));
    } catch (e) {
      console.log('Audio error:', e);
    }
    
    // Show confetti if the rating is excellent
  if (value === 100) {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }
    
    setRatings({ ...ratings, [category]: value });
  };

  const average = Math.round(
    (ratings.overall + ratings.friendliness + ratings.food) / 3
  );

  return (
    <div 
      className="bg-white shadow-xl rounded-2xl p-6 border-4 w-full max-w-lg mx-auto transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
      style={{
        borderColor: theme.color,
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), ${theme.bgImage}`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: showConfetti ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: [
                  theme.color, 
                  '#FFD700', 
                  '#FF69B4', 
                  '#00BFFF', 
                  '#7CFC00'
                ][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Completion message */}
      {showCompletionMessage && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl max-w-md text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: theme.color }}>Thank you!</h3>
            <p className="mb-4 text-gray-800">Thank you for completing the survey for {restaurant}!</p>
            <p className="text-sm text-gray-600 mb-4">Your feedback helps us create magical experiences.</p>
            <button 
              className="px-4 py-2 rounded-lg font-bold text-white transition-all hover:scale-105"
              style={{ backgroundColor: theme.color }}
              onClick={() => setShowCompletionMessage(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-center mb-4">
        <span className="text-2xl mr-2">{theme.icon}</span>
        <h2 className="text-xl sm:text-2xl font-bold mb-0 text-center" style={{ color: theme.color }}>
          {restaurant}
        </h2>
        <span className="text-2xl ml-2">{theme.icon}</span>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Survey Progress</span>
          <span>{completedCategories} of {Object.keys(ratings).length} completed</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${(completedCategories / Object.keys(ratings).length) * 100}%`,
              backgroundColor: theme.color 
            }}
          ></div>
        </div>
      </div>

      {categories.map((cat) => (
        <div 
          key={cat.key} 
          className={`mb-8 p-4 rounded-xl transition-all duration-300 ${activeCategory === cat.key ? 'scale-105' : ''}`}
          style={{
            backgroundColor: activeCategory === cat.key ? `${theme.color}20` : 'transparent',
            boxShadow: activeCategory === cat.key ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-base sm:text-lg font-semibold" style={{ color: theme.color }}>
              {cat.label}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 text-center italic">
            {cat.desc}
          </p>

          <div className="flex justify-center mb-3 text-5xl sm:text-6xl transition-all duration-300 transform hover:scale-125">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-20 animate-ping" style={{ animationDuration: '3s' }}>
                {mickeyFaces[ratings[cat.key]]}
              </div>
              {mickeyFaces[ratings[cat.key]]}
            </div>
          </div>

          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full transition-all duration-500 ease-out flex items-center justify-center text-xs font-bold"
              style={{ 
                width: `${ratings[cat.key]}%`,
                backgroundColor: ratings[cat.key] === 100 ? theme.color : ratings[cat.key] === 75 ? '#f39c12' : '#e74c3c'
              }}
            >
              <span className="text-white drop-shadow-md">{ratings[cat.key]}%</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
            {options.map((opt) => {
              const ratingValue = ratings[cat.key as keyof Ratings];
              return (
                <button
                  key={opt.label}
                  onClick={() => handleSelect(cat.key, opt.value)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-110 ${
                    ratingValue === opt.value
                      ? "shadow-lg animate-pulse"
                      : "opacity-80 hover:opacity-100 hover:shadow-md"
                  }`}
                  style={{
                    backgroundColor: ratingValue === opt.value ? theme.color : '#f0f0f0',
                    color: ratingValue === opt.value ? 'white' : '#333',
                    animationDuration: '2s',
                    boxShadow: ratingValue === opt.value ? `0 0 10px ${theme.color}80` : 'none'
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {ratings[cat.key as keyof Ratings] < 100 && (
            <div className="text-center mt-3 animate-pulse">
              <p className="text-red-600 text-xs sm:text-sm">
                We&apos;re sorry your experience didn&apos;t fully meet expectations.
              </p>
            </div>
          )}
        </div>
      ))}

      <div className="mt-6 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-[#0a284b]">Final Score</h3>
        <p className="text-xl sm:text-2xl font-extrabold text-[#e7b10a]">{average}%</p>

        <div className="text-4xl sm:text-5xl mt-2">
          {average >= 90 ? "😃" : average >= 70 ? "😐" : "😞"}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const router = useRouter();
  const [fromLogin, setFromLogin] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(restaurantThemes["Animator's Palate"]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("Animator's Palate");

  useEffect(() => {
    // Check if the user is coming from the login page
    const params = new URLSearchParams(window.location.search);
    const fromLoginParam = params.get('fromLogin');
    
    if (fromLoginParam === 'true') {
      setFromLogin(true);
      // Show welcome animation for 2 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    } else {
      // Redirect to login if not coming from login page
      router.push('/login');
    }
  }, [router]);

  // If not from login, don't render the content yet
  if (!fromLogin) {
    return null;
  }

  const restaurants = ["Royal Palace", "Animator's Palate", "Enchanted Garden"];

  const handleRestaurantChange = (restaurant: string) => {
    setSelectedRestaurant(restaurant);
    setSelectedTheme(restaurantThemes[restaurant]);
  };

  if (showWelcome) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-blue-900">
        <div className="text-center animate-bounce">
          <div className="text-6xl mb-4">✨🏰✨</div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Disney Cruise Line</h1>
          <p className="text-xl text-blue-200">Preparing your magical survey experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center py-6 sm:py-10 space-y-8 sm:space-y-10 px-4 transition-all duration-500"
      style={{
        backgroundImage: `linear-gradient(rgba(10, 40, 75, 0.9), rgba(10, 40, 75, 0.95)), ${selectedTheme.bgImage}`,
        backgroundColor: '#0a284b',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute top-4 right-4">
        {/* El botón de login se ha eliminado ya que ahora el flujo comienza con la página de login */}
      </div>
      
      <>
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-8 text-center animate-float">
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">Disney Cruise Line</span>
           <span className="block mt-2 text-white">✨ Guest Survey ✨</span>
         </h1>

        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-center mb-3" style={{ color: selectedTheme.color }}>
            Select Restaurant
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {restaurants.map((restaurant: string) => (
              <button
                key={restaurant}
                onClick={() => handleRestaurantChange(restaurant)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${selectedRestaurant === restaurant ? 'scale-105 shadow-md' : 'opacity-80'}`}
                style={{
                  backgroundColor: selectedRestaurant === restaurant ? restaurantThemes[restaurant].color : '#f0f0f0',
                  color: selectedRestaurant === restaurant ? 'white' : '#333'
                }}
              >
                {restaurant}
              </button>
            ))}
          </div>
        </div>

        <RatingCard key={selectedRestaurant} restaurant={selectedRestaurant} />
      </>
    </div>
  );
}
