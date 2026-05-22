import * as cheerio from 'cheerio';

const cleanText = (value) => value.replace(/\s+/g, ' ').trim();

export const extractArticleText = async (url) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; AI Content Summarizer)'
    }
  });

  if (!response.ok) {
    throw new Error('Unable to fetch the article URL.');
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $('script, style, noscript, svg').remove();

  const selectors = ['article', 'main', '[role="main"]'];
  const collectedText = [];

  for (const selector of selectors) {
    const text = cleanText($(selector).text() || '');
    if (text.length > collectedText.join(' ').length) {
      collectedText.length = 0;
      collectedText.push(text);
    }
  }

  if (collectedText.length === 0) {
    $('h1, h2, h3, p, li').each((_, element) => {
      const text = cleanText($(element).text() || '');
      if (text) {
        collectedText.push(text);
      }
    });
  }

  return cleanText(collectedText.join(' '));
};