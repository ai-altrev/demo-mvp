async function fetchBlogContent() {
  const blogUrl = 'https://confessionsofanoriginal.blogspot.com/feeds/posts/default';
  try {
    const response = await fetch(blogUrl);
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
    await window.fs.writeFile('blog-content.json', content);
    return true;
  } catch (error) {
    console.error('Error saving blog content:', error);
    throw error;
  }
}

// Execute the fetch
async function main() {
  const posts = await fetchBlogContent();
  await saveBlogContent(posts);
  console.log(`Successfully fetched ${posts.length} posts`);
  return posts;
}