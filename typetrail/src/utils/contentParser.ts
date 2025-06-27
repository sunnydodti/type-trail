import type { StoryFile } from '../types/story';
type ContentType = StoryFile['type'];

// Keep track of the selected HTML tag for text extraction
let selectedHtmlTag: string = 'main';

export const setSelectedHtmlTag = (tag: string) => {
  selectedHtmlTag = tag;
};

export const getSelectedHtmlTag = () => {
  return selectedHtmlTag;
};

const cleanupContent = (text: string): string => {
  return text
    // First normalize all newlines
    .replace(/\r\n/g, '\n')
    // Remove duplicate chapter titles
    .replace(/(Chapter \d+)\s*[-:]\s*\1:?/g, '$1:')
    // Remove redundant chapter prefix from title
    .replace(/(Chapter \d+:)\s*Chapter \d+:/g, '$1')
    // Clean up extra spaces around punctuation
    .replace(/\s+([.,!?])/g, '$1')
    // Normalize spaces
    .replace(/[ \t]+/g, ' ')
    // Remove multiple consecutive newlines
    .replace(/\n\s*\n/g, '\n')
    // Remove spaces at start of lines
    .replace(/\n\s+/g, '\n')
    // Remove spaces at end of lines
    .replace(/\s+\n/g, '\n')
    // Final trim
    .trim();
};

const normalizeQuotes = (text: string): string => {
  return text
    .replace(/[''"]/g, "'")  // Replace all fancy single quotes with simple quote
    .replace(/[""]/g, '"');  // Replace all fancy double quotes with simple quote
};

export const parseContent = (content: string, type: ContentType): string => {
  switch (type) {
    case 'html': {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const mainContent = doc.querySelector(selectedHtmlTag);
      if (!mainContent) return '';
      
      // Get text content and normalize it
      const textContent = mainContent.textContent || '';
      return cleanupContent(normalizeQuotes(textContent));
    }
    case 'txt':
      return cleanupContent(normalizeQuotes(content));
    case 'json':
      try {
        const parsed = JSON.parse(content);
        return cleanupContent(normalizeQuotes(typeof parsed === 'string' ? parsed : JSON.stringify(parsed)));
      } catch {
        return cleanupContent(normalizeQuotes(content));
      }
    default:
      return cleanupContent(normalizeQuotes(content));
  }
};
