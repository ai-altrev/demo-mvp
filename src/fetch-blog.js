async function fetchBlogContent() {
  const proxyUrl = 'http://localhost:3000/fetch-blog';  // Update this when deployed
  try {
    const response = await fetch(proxyUrl);
    const text = await response.text();
    
    // Parse the XML/RSS feed
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    const entries = xmlDoc.getElementsByTagName('entry');
    const posts = [];
    
    // Handle Atom feeds (Blogger typically uses Atom)
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      posts.push({
        title: entry.getElementsByTagName('title')[0]?.textContent || '',
        content: entry.getElementsByTagName('content')[0]?.textContent || '',
        published: entry.getElementsByTagName('published')[0]?.textContent || '',
        updated: entry.getElementsByTagName('updated')[0]?.textContent || '',
        author: entry.getElementsByTagName('author')[0]?.getElementsByTagName('name')[0]?.textContent || '',
        link: entry.getElementsByTagName('link')[0]?.getAttribute('href') || '',
        categories: Array.from(entry.getElementsByTagName('category')).map(cat => cat.getAttribute('term'))
      });
    }
    
    return posts;
  } catch (error) {
    console.error('Error fetching blog content:', error);
    throw error;
  }
}

// Function to save the content
async function saveBlogContent(posts) {
  try {
    const content = JSON.stringify(posts, null, 2);
    await window.fs.writeFile('data/blog-content.json', content);
    console.log('Successfully saved blog content');
    return true;
  } catch (error) {
    console.error('Error saving blog content:', error);
    throw error;
  }
}

// Function to analyze content
async function analyzeBlogContent(posts) {
  const analysis = {
    totalPosts: posts.length,
    categories: {},
    postsByYear: {},
    averageWordCount: 0,
    totalWords: 0
  };
  
  posts.forEach(post => {
    // Analyze categories
    post.categories.forEach(category => {
      analysis.categories[category] = (analysis.categories[category] || 0) + 1;
    });
    
    // Analyze posts by year
    const year = new Date(post.published).getFullYear();
    analysis.postsByYear[year] = (analysis.postsByYear[year] || 0) + 1;
    
    // Calculate word count
    const wordCount = post.content.split(/\s+/).length;
    analysis.totalWords += wordCount;
  });
  
  analysis.averageWordCount = Math.round(analysis.totalWords / posts.length);
  
  return analysis;
}

// Execute the fetch and analysis
async function main() {
  try {
    const posts = await fetchBlogContent();
    await saveBlogContent(posts);
    const analysis = await analyzeBlogContent(posts);
    console.log('Analysis results:', analysis);
    return analysis;
  } catch (error) {
    console.error('Error in main execution:', error);
    throw error;
  }
}

// Export functions for use in other files
export { fetchBlogContent, saveBlogContent, analyzeBlogContent, main };