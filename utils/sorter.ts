/**
 * Sort restaurants by relevance to a keyword
 * @param {Array} restaurants - Array of restaurant objects
 * @param {String} keyword - Search keyword
 * @returns {Array} - Sorted array of restaurants
 */
export function sortRestaurantsByKeyword(restaurants, keyword) {
  // Split keyword into separate words for better matching
  const keywordParts = keyword.toLowerCase().split(/\s+/);

  // Calculate relevance score for each restaurant
  const scoredRestaurants = restaurants.map((restaurant) => {
    const name = restaurant.name.toLowerCase();
    let score = 0;

    // Check for exact match in name (highest priority)
    if (name.includes(keyword.toLowerCase())) {
      score += 100;
    }

    // Check for individual keyword parts
    keywordParts.forEach((part) => {
      if (name.includes(part)) {
        score += 50;
      }

      // Bonus points for having the keyword part at the beginning of name
      if (name.startsWith(part)) {
        score += 20;
      }

      // Bonus points for having keyword part as a whole word
      const regex = new RegExp(`\\b${part}\\b`, "i");
      if (regex.test(name)) {
        score += 15;
      }
    });

    // Prioritize restaurants with shorter distances
    if (restaurant.distance) {
      const distanceValue = parseInt(restaurant.distance);
      if (!isNaN(distanceValue)) {
        // Slight boost for closer restaurants (but less important than name match)
        score += (10 - Math.min(distanceValue, 10)) * 2;
      }
    }

    // Prioritize restaurants with higher ratings
    if (restaurant.rating) {
      score += restaurant.rating * 2;
    }

    return {
      ...restaurant,
      score,
    };
  });

  // Sort by score in descending order
  return scoredRestaurants
    .sort((a, b) => b.score - a.score)
    .map((r) => {
      // Remove the score field before returning (optional)
      const { score, ...restaurantWithoutScore } = r;
      return restaurantWithoutScore;
    });
}
