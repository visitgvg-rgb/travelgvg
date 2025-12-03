
// Helper function to shuffle an array using the Fisher-Yates algorithm
export const shuffleArray = <T,>(array: T[]): T[] => {
  if (!array || !Array.isArray(array)) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Helper function to sort by package and then shuffle within each package
export const sortAndShuffleListings = <T extends { package: string }>(listings: T[]): T[] => {
  if (!listings || !Array.isArray(listings)) return [];
  
  const premium = listings.filter(item => item.package === 'premium');
  const standard = listings.filter(item => item.package === 'standard');
  const free = listings.filter(item => item.package === 'free');
  const others = listings.filter(item => !['premium', 'standard', 'free'].includes(item.package));

  const shuffledPremium = shuffleArray(premium);
  const shuffledStandard = shuffleArray(standard);
  const shuffledFree = shuffleArray(free);

  return [...shuffledPremium, ...shuffledStandard, ...shuffledFree, ...others];
};