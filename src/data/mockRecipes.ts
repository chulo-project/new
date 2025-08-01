import { Recipe } from '../types';

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Classic Margherita Pizza',
    description: 'A simple yet delicious pizza with fresh tomatoes, mozzarella, and basil',
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    ingredients: ['Pizza dough', 'Tomato sauce', 'Fresh mozzarella', 'Fresh basil', 'Olive oil'],
    instructions: ['Preheat oven to 475°F', 'Roll out dough', 'Add sauce and cheese', 'Bake for 12-15 minutes'],
    cuisine: 'Italian',
    category: 'Main Course',
    calories: 285,
    rating: 4.8,
    tags: ['vegetarian', 'italian', 'pizza', 'cheese']
  },
  {
    id: '2',
    title: 'Chicken Tikka Masala',
    description: 'Creamy and flavorful Indian curry with tender chicken pieces',
    image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 45,
    servings: 6,
    difficulty: 'Medium',
    ingredients: ['Chicken breast', 'Yogurt', 'Tomato sauce', 'Heavy cream', 'Spices'],
    instructions: ['Marinate chicken', 'Cook chicken', 'Prepare sauce', 'Combine and simmer'],
    cuisine: 'Indian',
    category: 'Main Course',
    calories: 320,
    rating: 4.9,
    tags: ['spicy', 'indian', 'chicken', 'curry']
  },
  {
    id: '3',
    title: 'Caesar Salad',
    description: 'Crisp romaine lettuce with creamy Caesar dressing and parmesan',
    image: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing'],
    instructions: ['Wash and chop lettuce', 'Make dressing', 'Toss ingredients', 'Serve immediately'],
    cuisine: 'American',
    category: 'Salad',
    calories: 180,
    rating: 4.6,
    tags: ['salad', 'vegetarian', 'quick', 'healthy']
  },
  {
    id: '4',
    title: 'Chocolate Chip Cookies',
    description: 'Soft and chewy homemade cookies with chocolate chips',
    image: 'https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 20,
    servings: 24,
    difficulty: 'Easy',
    ingredients: ['Flour', 'Butter', 'Brown sugar', 'Chocolate chips', 'Eggs'],
    instructions: ['Mix dry ingredients', 'Cream butter and sugar', 'Combine all', 'Bake for 10-12 minutes'],
    cuisine: 'American',
    category: 'Dessert',
    calories: 150,
    rating: 4.7,
    tags: ['dessert', 'cookies', 'chocolate', 'sweet']
  },
  {
    id: '5',
    title: 'Beef Tacos',
    description: 'Seasoned ground beef tacos with fresh toppings',
    image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 30,
    servings: 4,
    difficulty: 'Easy',
    ingredients: ['Ground beef', 'Taco shells', 'Lettuce', 'Tomatoes', 'Cheese', 'Sour cream'],
    instructions: ['Cook beef with seasonings', 'Warm taco shells', 'Prepare toppings', 'Assemble tacos'],
    cuisine: 'Mexican',
    category: 'Main Course',
    calories: 350,
    rating: 4.5,
    tags: ['mexican', 'beef', 'tacos', 'quick']
  },
  {
    id: '6',
    title: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta cheese and olives',
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 15,
    servings: 4,
    difficulty: 'Easy',
    ingredients: ['Cucumber', 'Tomatoes', 'Red onion', 'Feta cheese', 'Olives', 'Olive oil'],
    instructions: ['Chop vegetables', 'Make dressing', 'Combine ingredients', 'Add feta and olives'],
    cuisine: 'Greek',
    category: 'Salad',
    calories: 210,
    rating: 4.4,
    tags: ['mediterranean', 'healthy', 'vegetarian', 'fresh']
  },
  {
    id: '7',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, and pancetta',
    image: 'https://images.pexels.com/photos/4518842/pexels-photo-4518842.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 25,
    servings: 4,
    difficulty: 'Medium',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan cheese', 'Pancetta', 'Black pepper'],
    instructions: ['Cook pasta', 'Fry pancetta', 'Mix eggs and cheese', 'Combine while hot'],
    cuisine: 'Italian',
    category: 'Main Course',
    calories: 420,
    rating: 4.9,
    tags: ['italian', 'pasta', 'creamy', 'traditional']
  },
  {
    id: '8',
    title: 'Thai Green Curry',
    description: 'Aromatic Thai curry with coconut milk and vegetables',
    image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800',
    cookTime: 35,
    servings: 4,
    difficulty: 'Medium',
    ingredients: ['Green curry paste', 'Coconut milk', 'Vegetables', 'Thai basil', 'Rice'],
    instructions: ['Heat curry paste', 'Add coconut milk', 'Add vegetables', 'Simmer and serve'],
    cuisine: 'Thai',
    category: 'Main Course',
    calories: 280,
    rating: 4.6,
    tags: ['thai', 'curry', 'vegetarian', 'spicy']
  }
];

export const getRecipeById = (id: string): Recipe | undefined => {
  return mockRecipes.find(recipe => recipe.id === id);
};

export const searchRecipes = (query: string): Recipe[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockRecipes.filter(recipe => 
    recipe.title.toLowerCase().includes(lowercaseQuery) ||
    recipe.description.toLowerCase().includes(lowercaseQuery) ||
    recipe.cuisine.toLowerCase().includes(lowercaseQuery) ||
    recipe.category.toLowerCase().includes(lowercaseQuery) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(lowercaseQuery))
  );
};

export const getSearchSuggestions = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  const suggestions = new Set<string>();
  
  mockRecipes.forEach(recipe => {
    if (recipe.title.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(recipe.title);
    }
    recipe.tags.forEach(tag => {
      if (tag.toLowerCase().includes(lowercaseQuery)) {
        suggestions.add(tag);
      }
    });
    if (recipe.cuisine.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(recipe.cuisine);
    }
  });
  
  return Array.from(suggestions).slice(0, 8);
};