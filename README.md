# Blog Content Analyzer

This project is designed to fetch and analyze content from the blog "Confessions of an Original" (https://confessionsofanoriginal.blogspot.com).

## Project Structure

- `src/fetch-blog.js`: Script for fetching blog content
- `data/`: Directory for storing fetched blog content
- `analysis/`: Directory for analysis scripts

## Setup

Due to CORS restrictions, we'll need to:
1. Use a CORS proxy service
2. Or download the content directly and store it in the data directory
3. Or use the Blogger API

## Next Steps

1. Implement proper CORS handling
2. Add content analysis features
3. Create visualization tools for the blog content