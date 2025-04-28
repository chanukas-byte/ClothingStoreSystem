import React, { useState, useRef, useEffect } from 'react';
import './VirtualRoom.css';
import NavB from './NavBar';
import maleDummy from '../assets/male-dummy.jpeg';
import femaleDummy from '../assets/female-dummy.jpeg';

const VirtualRoom = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedClothes, setSelectedClothes] = useState({
    top: { item: null, color: null },
    bottom: { item: null, color: null },
    accessory: { item: null, color: null }
  });
  const [matchingScores, setMatchingScores] = useState({
    top: 0,
    bottom: 0,
    accessory: 0
  });
  const [colorPopup, setColorPopup] = useState({ show: false, type: null });
  
  // New state for chatbot
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your style assistant. How can I help you with color combinations and styles today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const chatContainerRef = useRef(null);
  
  // New state for clothing display
  const [displayedClothing, setDisplayedClothing] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // useEffect to fetch clothing image when item and color are both set
  useEffect(() => {
    if (selectedGender) {
      ['top', 'bottom', 'accessory'].forEach(type => {
        const { item, color } = selectedClothes[type];
        if (item && color) {
          fetchClothingItem(type, item, color);
        }
      });
    }
  }, [selectedClothes, selectedGender]);

  const clothingOptions = {
    male: {
      tops: ['Classic T-Shirt', 'Formal Shirt', 'Polo Shirt', 'Sweater'],
      bottoms: ['Slim Fit Jeans', 'Formal Trousers', 'Chino Pants', 'Cargo Pants'],
      accessories: ['Leather Watch', 'Sunglasses', 'Leather Belt', 'Wallet'],
      colors: ['Black', 'White', 'Gray', 'Navy', 'Charcoal']
    },
    female: {
      tops: ['Blouse', 'T-Shirt', 'Sweater', 'Tank Top'],
      bottoms: ['Skinny Jeans', 'Pencil Skirt', 'Palazzo Pants', 'Shorts'],
      accessories: ['Necklace', 'Earrings', 'Bracelet', 'Handbag'],
      colors: ['Black', 'White', 'Gray', 'Navy', 'Charcoal']
    }
  };

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setSelectedClothes({ 
      top: { item: null, color: null }, 
      bottom: { item: null, color: null }, 
      accessory: { item: null, color: null } 
    });
    setMatchingScores({
      top: 0,
      bottom: 0,
      accessory: 0
    });
    setDisplayedClothing(null);
  };

  const handleClothingSelect = (type, item) => {
    setSelectedClothes(prev => ({
      ...prev,
      [type]: { ...prev[type], item }
    }));
    setColorPopup({ show: true, type });
    calculateMatchingScore(type);
  };

  // New function to fetch clothing items
  const fetchClothingItem = (type, item, color = null) => {
    setIsLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // In a real application, this would be an API call to fetch the actual clothing image
      // For now, we'll use more realistic placeholder images based on the type, item, and color
      const clothingImages = {
        male: {
          tops: {
            'Classic T-Shirt': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+T-Shirt',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+T-Shirt',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+T-Shirt',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+T-Shirt',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+T-Shirt'
            },
            'Formal Shirt': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Formal+Shirt',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Formal+Shirt',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Formal+Shirt',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Formal+Shirt',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Formal+Shirt'
            },
            'Polo Shirt': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Polo+Shirt',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Polo+Shirt',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Polo+Shirt',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Polo+Shirt',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Polo+Shirt'
            },
            'Sweater': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Sweater',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Sweater',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Sweater',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Sweater',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Sweater'
            }
          },
          bottoms: {
            'Slim Fit Jeans': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Jeans',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Jeans',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Jeans',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Jeans',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Jeans'
            },
            'Formal Trousers': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Trousers',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Trousers',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Trousers',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Trousers',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Trousers'
            },
            'Chino Pants': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Chinos',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Chinos',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Chinos',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Chinos',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Chinos'
            },
            'Cargo Pants': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Cargo',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Cargo',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Cargo',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Cargo',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Cargo'
            }
          },
          accessories: {
            'Leather Watch': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Watch',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Watch',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Watch',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Watch',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Watch'
            },
            'Sunglasses': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Sunglasses',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Sunglasses',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Sunglasses',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Sunglasses',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Sunglasses'
            },
            'Leather Belt': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Belt',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Belt',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Belt',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Belt',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Belt'
            },
            'Wallet': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Wallet',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Wallet',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Wallet',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Wallet',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Wallet'
            }
          }
        },
        female: {
          tops: {
            'Blouse': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Blouse',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Blouse',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Blouse',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Blouse',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Blouse'
            },
            'T-Shirt': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+T-Shirt',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+T-Shirt',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+T-Shirt',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+T-Shirt',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+T-Shirt'
            },
            'Sweater': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Sweater',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Sweater',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Sweater',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Sweater',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Sweater'
            },
            'Tank Top': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Tank+Top',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Tank+Top',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Tank+Top',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Tank+Top',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Tank+Top'
            }
          },
          bottoms: {
            'Skinny Jeans': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Jeans',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Jeans',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Jeans',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Jeans',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Jeans'
            },
            'Pencil Skirt': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Skirt',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Skirt',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Skirt',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Skirt',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Skirt'
            },
            'Palazzo Pants': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Palazzo',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Palazzo',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Palazzo',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Palazzo',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Palazzo'
            },
            'Shorts': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Shorts',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Shorts',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Shorts',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Shorts',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Shorts'
            }
          },
          accessories: {
            'Necklace': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Necklace',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Necklace',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Necklace',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Necklace',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Necklace'
            },
            'Earrings': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Earrings',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Earrings',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Earrings',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Earrings',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Earrings'
            },
            'Bracelet': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Bracelet',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Bracelet',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Bracelet',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Bracelet',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Bracelet'
            },
            'Handbag': {
              'Black': 'https://via.placeholder.com/300x400/000000/ffffff?text=Black+Handbag',
              'White': 'https://via.placeholder.com/300x400/ffffff/000000?text=White+Handbag',
              'Gray': 'https://via.placeholder.com/300x400/808080/ffffff?text=Gray+Handbag',
              'Navy': 'https://via.placeholder.com/300x400/000080/ffffff?text=Navy+Handbag',
              'Charcoal': 'https://via.placeholder.com/300x400/36454F/ffffff?text=Charcoal+Handbag'
            }
          }
        }
      };
      
      // Get the image URL based on the selected gender, type, item, and color
      let imageUrl;
      
      if (type === 'top') {
        imageUrl = clothingImages[selectedGender].tops[item]?.[color] || 
                  `https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${item}`;
      } else if (type === 'bottom') {
        imageUrl = clothingImages[selectedGender].bottoms[item]?.[color] || 
                  `https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${item}`;
      } else if (type === 'accessory') {
        imageUrl = clothingImages[selectedGender].accessories[item]?.[color] || 
                  `https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${item}`;
      } else {
        imageUrl = `https://via.placeholder.com/300x400/1a1a1a/ffffff?text=${item}`;
      }
      
      setDisplayedClothing({
        type,
        item,
        color: color || selectedClothes[type].color,
        imageUrl
      });
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  const handleColorSelect = (color) => {
    if (colorPopup.type) {
      const type = colorPopup.type;
      setSelectedClothes(prev => ({
        ...prev,
        [type]: { ...prev[type], color }
      }));
      setColorPopup({ show: false, type: null });
      calculateMatchingScore(type);
    }
  };

  const closeColorPopup = () => {
    setColorPopup({ show: false, type: null });
  };

  const calculateMatchingScore = (type) => {
    const item = selectedClothes[type];
    let score = 0;

    if (item.item && item.color) {
      // Check if this color matches with other selected items
      const otherColors = [];
      if (type !== 'top' && selectedClothes.top.color) otherColors.push(selectedClothes.top.color);
      if (type !== 'bottom' && selectedClothes.bottom.color) otherColors.push(selectedClothes.bottom.color);
      if (type !== 'accessory' && selectedClothes.accessory.color) otherColors.push(selectedClothes.accessory.color);

      // If there are other colors selected, check for matches
      if (otherColors.length > 0) {
        // Perfect match (100%) if color matches with any other item
        if (otherColors.includes(item.color)) {
          score = 100;
        } else {
          // Check for complementary colors (70%)
          const isComplementary = (
            (item.color === 'Black' && otherColors.includes('White')) ||
            (item.color === 'White' && otherColors.includes('Black')) ||
            (item.color === 'Gray' && (otherColors.includes('Black') || otherColors.includes('White'))) ||
            (item.color === 'Navy' && otherColors.includes('White')) ||
            (item.color === 'Charcoal' && otherColors.includes('White'))
          );
          score = isComplementary ? 70 : 50;
        }
      } else {
        // If this is the first item with color, give base score
        score = 50;
      }
    }

    setMatchingScores(prev => ({
      ...prev,
      [type]: score
    }));
  };

  // New function to handle chatbot responses
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    
    // Simple bot responses based on keywords
    let botResponse = "I'm here to help with style advice!";
    
    // Check for color combination queries
    const colorCombinationRegex = /(blue|red|black|yellow|white|gray|gold|green|pink|purple)\s*(\+|and)\s*(blue|red|black|yellow|white|gray|gold|green|pink|purple)/i;
    const colorMatch = inputMessage.match(colorCombinationRegex);
    
    if (colorMatch) {
      const color1 = colorMatch[1].toLowerCase();
      const color2 = colorMatch[3].toLowerCase();
      
      // Color combination database with scores and descriptions
      const colorCombinations = {
        'blue+red': {
          score: 85,
          description: "Blue and red create a bold, contrasting look. This classic combination works well for casual and sporty styles. Try using blue as the dominant color with red accents for a balanced outfit."
        },
        'blue+black': {
          score: 95,
          description: "Blue and black is a sophisticated, professional combination. Navy blue with black creates a sleek, modern look perfect for business casual settings."
        },
        'blue+yellow': {
          score: 80,
          description: "Blue and yellow are complementary colors that create vibrant energy. Use this combination sparingly - perhaps a blue outfit with yellow accessories for a pop of color."
        },
        'blue+white': {
          score: 90,
          description: "Blue and white is a timeless, clean combination reminiscent of nautical style. Perfect for summer and spring outfits with a fresh, crisp feel."
        },
        'blue+gray': {
          score: 85,
          description: "Blue and gray create a calm, professional look. This combination works well in both casual and formal settings, with gray adding sophistication to blue."
        },
        'blue+gold': {
          score: 75,
          description: "Blue and gold create an elegant, luxurious combination. Navy blue with gold accents is particularly striking for evening wear or formal occasions."
        },
        'blue+green': {
          score: 70,
          description: "Blue and green are analogous colors that create a harmonious, natural feel. This combination works best when the colors are distinctly different in shade."
        },
        'blue+pink': {
          score: 65,
          description: "Blue and pink create a playful, youthful combination. This works well for casual styles, especially in lighter shades for a softer look."
        },
        'blue+purple': {
          score: 60,
          description: "Blue and purple are close on the color spectrum and can sometimes blend together. For best results, use distinctly different shades and add a neutral color as a buffer."
        },
        'red+black': {
          score: 90,
          description: "Red and black create a powerful, dramatic combination. This classic pairing is perfect for evening wear and makes a bold statement."
        },
        'red+yellow': {
          score: 75,
          description: "Red and yellow create a warm, energetic combination. Use this pairing carefully as it can be quite bold - perhaps with one color as the dominant and the other as an accent."
        },
        'red+white': {
          score: 85,
          description: "Red and white create a clean, striking contrast. This combination is perfect for summer and works well in both casual and formal settings."
        },
        'red+gray': {
          score: 80,
          description: "Red and gray create a sophisticated, modern look. Gray tones down the intensity of red, making it more wearable for everyday styles."
        },
        'red+gold': {
          score: 70,
          description: "Red and gold create a luxurious, festive combination. This pairing works well for special occasions and evening wear."
        },
        'red+green': {
          score: 65,
          description: "Red and green are complementary colors that can be festive but also challenging to wear together. For best results, use one color as the dominant and the other as a subtle accent."
        },
        'red+pink': {
          score: 60,
          description: "Red and pink are close on the color spectrum and can sometimes compete. For a more harmonious look, choose shades that are distinctly different in intensity."
        },
        'red+purple': {
          score: 55,
          description: "Red and purple can create a rich, deep combination but may be challenging to wear together. Consider using one as the dominant color and the other as a subtle accent."
        },
        'black+yellow': {
          score: 85,
          description: "Black and yellow create a striking, high-contrast combination. This pairing works well for casual styles and creates a bold, modern look."
        },
        'black+white': {
          score: 100,
          description: "Black and white is the ultimate classic combination. This timeless pairing works for any occasion and creates a clean, sophisticated look."
        },
        'black+gray': {
          score: 90,
          description: "Black and gray create a sleek, monochromatic look. This sophisticated combination works well for professional settings and evening wear."
        },
        'black+gold': {
          score: 95,
          description: "Black and gold create an elegant, luxurious combination. This classic pairing is perfect for formal occasions and evening wear."
        },
        'black+green': {
          score: 80,
          description: "Black and green create a rich, natural combination. Forest green with black is particularly striking for autumn and winter styles."
        },
        'black+pink': {
          score: 75,
          description: "Black and pink create a striking contrast between the soft and the bold. This combination works well for casual styles and creates a playful yet sophisticated look."
        },
        'black+purple': {
          score: 85,
          description: "Black and purple create a rich, mysterious combination. This pairing works well for evening wear and creates a sense of luxury and elegance."
        },
        'yellow+white': {
          score: 80,
          description: "Yellow and white create a bright, cheerful combination. This pairing is perfect for summer and spring styles with a fresh, sunny feel."
        },
        'yellow+gray': {
          score: 70,
          description: "Yellow and gray create an interesting contrast between warmth and coolness. This combination works well when yellow is used as an accent color against a gray base."
        },
        'yellow+gold': {
          score: 65,
          description: "Yellow and gold are close on the color spectrum and can sometimes blend together. For best results, use distinctly different shades and add a neutral color as a buffer."
        },
        'yellow+green': {
          score: 75,
          description: "Yellow and green create a fresh, natural combination reminiscent of spring. This pairing works well for casual styles and creates a cheerful, energetic look."
        },
        'yellow+pink': {
          score: 70,
          description: "Yellow and pink create a playful, youthful combination. This pairing works well for casual styles and creates a cheerful, energetic look."
        },
        'yellow+purple': {
          score: 60,
          description: "Yellow and purple are complementary colors that can create a bold contrast. This combination works best when one color is used as the dominant and the other as an accent."
        },
        'white+gray': {
          score: 95,
          description: "White and gray create a clean, sophisticated combination. This classic pairing works well for both casual and formal settings and creates a timeless, elegant look."
        },
        'white+gold': {
          score: 90,
          description: "White and gold create an elegant, luxurious combination. This pairing works well for formal occasions and creates a sense of refinement and sophistication."
        },
        'white+green': {
          score: 85,
          description: "White and green create a fresh, natural combination. This pairing works well for spring and summer styles and creates a clean, vibrant look."
        },
        'white+pink': {
          score: 80,
          description: "White and pink create a soft, romantic combination. This pairing works well for casual and formal styles and creates a gentle, feminine look."
        },
        'white+purple': {
          score: 75,
          description: "White and purple create a clean, regal combination. This pairing works well for both casual and formal settings and creates a sense of elegance and sophistication."
        },
        'gray+gold': {
          score: 85,
          description: "Gray and gold create a sophisticated, luxurious combination. This pairing works well for both casual and formal settings and creates a sense of refinement and elegance."
        },
        'gray+green': {
          score: 80,
          description: "Gray and green create a natural, calming combination. This pairing works well for both casual and professional settings and creates a sense of balance and harmony."
        },
        'gray+pink': {
          score: 75,
          description: "Gray and pink create a soft, sophisticated combination. This pairing works well for both casual and formal settings and creates a sense of elegance and femininity."
        },
        'gray+purple': {
          score: 80,
          description: "Gray and purple create a rich, sophisticated combination. This pairing works well for both casual and formal settings and creates a sense of elegance and mystery."
        },
        'gold+green': {
          score: 70,
          description: "Gold and green create a rich, natural combination. This pairing works well for both casual and formal settings and creates a sense of luxury and elegance."
        },
        'gold+pink': {
          score: 65,
          description: "Gold and pink create a luxurious, feminine combination. This pairing works well for formal occasions and creates a sense of elegance and sophistication."
        },
        'gold+purple': {
          score: 75,
          description: "Gold and purple create a rich, regal combination. This pairing works well for formal occasions and creates a sense of luxury and elegance."
        },
        'green+pink': {
          score: 60,
          description: "Green and pink create an interesting contrast between nature and femininity. This combination works best when one color is used as the dominant and the other as an accent."
        },
        'green+purple': {
          score: 65,
          description: "Green and purple create a rich, natural combination. This pairing works best when the colors are distinctly different in shade and one is used as the dominant."
        },
        'pink+purple': {
          score: 70,
          description: "Pink and purple create a soft, feminine combination. This pairing works well for casual and formal styles and creates a gentle, romantic look."
        }
      };
      
      // Check if we have a specific combination in our database
      const combinationKey = `${color1}+${color2}`;
      const reverseCombinationKey = `${color2}+${color1}`;
      
      if (colorCombinations[combinationKey]) {
        const combo = colorCombinations[combinationKey];
        botResponse = `Color Combination Score: ${combo.score}%\n\n${combo.description}`;
      } else if (colorCombinations[reverseCombinationKey]) {
        const combo = colorCombinations[reverseCombinationKey];
        botResponse = `Color Combination Score: ${combo.score}%\n\n${combo.description}`;
      } else {
        botResponse = `I don't have specific information about ${color1} and ${color2} together. Try another color combination!`;
      }
    } else if (inputMessage.toLowerCase().includes('color') || inputMessage.toLowerCase().includes('match')) {
      if (selectedClothes.top.color && selectedClothes.bottom.color) {
        botResponse = `Your current combination of ${selectedClothes.top.color} and ${selectedClothes.bottom.color} is ${matchingScores.top > 70 ? 'a great match!' : 'interesting. Try pairing with neutral colors for a more balanced look.'}`;
      } else {
        botResponse = "I can help you find the perfect color combinations. Try entering two colors with a '+' or 'and' between them, like 'blue+red' or 'black and white'.";
      }
    } else if (inputMessage.toLowerCase().includes('style') || inputMessage.toLowerCase().includes('outfit')) {
      botResponse = "For a modern look, try mixing classic pieces with trendy accessories. Would you like specific recommendations?";
    } else if (inputMessage.toLowerCase().includes('help') || inputMessage.toLowerCase().includes('how')) {
      botResponse = "I can help you with color matching, style advice, and outfit combinations. Try entering two colors with a '+' or 'and' between them, like 'blue+red' or 'black and white'.";
    }
    
    // Add bot response after a short delay to simulate thinking
    setTimeout(() => {
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    }, 500);
    
    setInputMessage('');
  };

  return (
    <div className="virtual-room">
      <NavB />
      <div className="container">
        <h2>Virtual Fitting Room</h2>
        
        {!selectedGender ? (
          <div className="gender-selection">
            <h3>Select Your Style</h3>
            <div className="gender-buttons">
              <button onClick={() => handleGenderSelect('male')}>Men's Collection</button>
              <button onClick={() => handleGenderSelect('female')}>Women's Collection</button>
            </div>
            <div className="virtual-room-description">
              <div className="description-content">
                <h4>Welcome to Your Personal Style Studio</h4>
                <p>Experience the future of fashion with our AI-powered virtual fitting room. Mix and match our curated collection of premium clothing items to create your perfect ensemble.</p>
                <div className="feature-grid">
                  <div className="feature-item">
                    <span className="feature-icon">🎯</span>
                    <h5>Smart Style Matching</h5>
                    <p>Our AI analyzes color combinations and style compatibility to help you create harmonious outfits.</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🎨</span>
                    <h5>Color Coordination</h5>
                    <p>Explore our carefully selected color palette designed to complement your style preferences.</p>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">✨</span>
                    <h5>Real-time Feedback</h5>
                    <p>Get instant style scores and recommendations as you build your perfect look.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="fitting-room">
            <div className="dummy-display">
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Loading clothing item...</p>
                </div>
              ) : (
                <div className="dummy-container">
                  <img 
                    src={selectedGender === 'male' ? maleDummy : femaleDummy} 
                    alt={`${selectedGender} dummy`} 
                    className="dummy"
                  />
                  {displayedClothing && displayedClothing.item && displayedClothing.color && (
                    <div className="clothing-display">
                      <img 
                        src={displayedClothing.imageUrl} 
                        alt={displayedClothing.item} 
                        className="clothing-image"
                      />
                      <div className="clothing-info">
                        <h4>{displayedClothing.item}</h4>
                        <div className="color-display">
                          <span className="color-label">Color:</span>
                          <span className="color-value">{displayedClothing.color}</span>
                          <span 
                            className="color-swatch" 
                            style={{ backgroundColor: displayedClothing.color.toLowerCase() }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="clothing-selection">
              <div className="clothing-category">
                <h3>Tops</h3>
                <div className="options">
                  {clothingOptions[selectedGender].tops.map((top, index) => (
                    <button
                      key={index}
                      onClick={() => handleClothingSelect('top', top)}
                      className={selectedClothes.top.item === top ? 'selected' : ''}
                    >
                      {top}
                      {selectedClothes.top.color && <span className="color-indicator" style={{ backgroundColor: selectedClothes.top.color.toLowerCase() }}></span>}
                    </button>
                  ))}
                </div>
                {matchingScores.top > 0 && (
                  <div className="category-score">
                    <span>Style Score: {matchingScores.top}%</span>
                  </div>
                )}
              </div>

              <div className="clothing-category">
                <h3>Bottoms</h3>
                <div className="options">
                  {clothingOptions[selectedGender].bottoms.map((bottom, index) => (
                    <button
                      key={index}
                      onClick={() => handleClothingSelect('bottom', bottom)}
                      className={selectedClothes.bottom.item === bottom ? 'selected' : ''}
                    >
                      {bottom}
                      {selectedClothes.bottom.color && <span className="color-indicator" style={{ backgroundColor: selectedClothes.bottom.color.toLowerCase() }}></span>}
                    </button>
                  ))}
                </div>
                {matchingScores.bottom > 0 && (
                  <div className="category-score">
                    <span>Style Score: {matchingScores.bottom}%</span>
                  </div>
                )}
              </div>

              <div className="clothing-category">
                <h3>Accessories</h3>
                <div className="options">
                  {clothingOptions[selectedGender].accessories.map((accessory, index) => (
                    <button
                      key={index}
                      onClick={() => handleClothingSelect('accessory', accessory)}
                      className={selectedClothes.accessory.item === accessory ? 'selected' : ''}
                    >
                      {accessory}
                      {selectedClothes.accessory.color && <span className="color-indicator" style={{ backgroundColor: selectedClothes.accessory.color.toLowerCase() }}></span>}
                    </button>
                  ))}
                </div>
                {matchingScores.accessory > 0 && (
                  <div className="category-score">
                    <span>Style Score: {matchingScores.accessory}%</span>
                  </div>
                )}
              </div>

              {(selectedClothes.top.color || selectedClothes.bottom.color || selectedClothes.accessory.color) && (
                <div className="matching-details">
                  <h3>Style Details</h3>
                  <div className="details-content">
                    {selectedClothes.top.color && (
                      <div className="detail-item">
                        <span className="item-name">Top:</span>
                        <span className="color-name">{selectedClothes.top.color}</span>
                        <span className="color-dot" style={{ backgroundColor: selectedClothes.top.color.toLowerCase() }}></span>
                      </div>
                    )}
                    {selectedClothes.bottom.color && (
                      <div className="detail-item">
                        <span className="item-name">Bottom:</span>
                        <span className="color-name">{selectedClothes.bottom.color}</span>
                        <span className="color-dot" style={{ backgroundColor: selectedClothes.bottom.color.toLowerCase() }}></span>
                      </div>
                    )}
                    {selectedClothes.accessory.color && (
                      <div className="detail-item">
                        <span className="item-name">Accessory:</span>
                        <span className="color-name">{selectedClothes.accessory.color}</span>
                        <span className="color-dot" style={{ backgroundColor: selectedClothes.accessory.color.toLowerCase() }}></span>
                      </div>
                    )}
                    <div className="matching-status">
                      {selectedClothes.top.color && selectedClothes.bottom.color && (
                        <p className="status-text">
                          {selectedClothes.top.color === selectedClothes.bottom.color ? 
                            "Perfect match! Monochromatic style." :
                            ((selectedClothes.top.color === 'Black' && selectedClothes.bottom.color === 'White') ||
                             (selectedClothes.top.color === 'White' && selectedClothes.bottom.color === 'Black') ||
                             (selectedClothes.top.color === 'Gray' && (selectedClothes.bottom.color === 'Black' || selectedClothes.bottom.color === 'White')) ||
                             (selectedClothes.top.color === 'Navy' && selectedClothes.bottom.color === 'White') ||
                             (selectedClothes.top.color === 'Charcoal' && selectedClothes.bottom.color === 'White')) ?
                            "Elegant combination! Classic style." :
                            "Modern mix! Contemporary style."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chatbot */}
        <div className="chatbot-icon" onClick={() => setChatOpen(!chatOpen)}>
          <span className="chat-icon">💬</span>
          <span className="chat-label">Style Assistant</span>
        </div>

        {chatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <h4>Style Assistant</h4>
              <button className="close-chat" onClick={() => setChatOpen(false)}>×</button>
            </div>
            <div className="chat-messages" ref={chatContainerRef}>
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
                  {message.text}
                </div>
              ))}
            </div>
            <form className="chat-input" onSubmit={handleChatSubmit}>
              <input 
                type="text" 
                placeholder="Ask about colors and styles..." 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button type="submit">Send</button>
            </form>
          </div>
        )}

        {/* Color Selection Popup */}
        {colorPopup.show && (
          <div className="color-popup-overlay">
            <div className="color-popup">
              <div className="color-popup-header">
                <h3>Select Color</h3>
                <button className="close-popup" onClick={closeColorPopup}>&times;</button>
              </div>
              <div className="color-options">
                {clothingOptions[selectedGender].colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(color)}
                    className={`color-btn ${selectedClothes[colorPopup.type].color === color ? 'selected' : ''}`}
                    style={{ 
                      backgroundColor: color.toLowerCase(),
                      borderColor: color.toLowerCase() === 'white' ? '#e0e0e0' : 'transparent'
                    }}
                    title={color}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualRoom; 

 