export function parseContent(content: string, type: 'txt' | 'html' | 'json'): string {
  let parsed = '';

  switch (type) {
    case 'html': {
      // Extract body content first
      const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      let bodyContent = bodyMatch ? bodyMatch[1] : content;
      
      // Remove scripts and styles first
      bodyContent = bodyContent
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

      // Handle common HTML entities
      parsed = bodyContent
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&ldquo;/g, '"')
        .replace(/&rdquo;/g, '"')
        .replace(/&lsquo;/g, "'")
        .replace(/&rsquo;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–');

      // Then handle HTML structure
      parsed = parsed
        .replace(/<br\s*\/?>/gi, '\n')  // Replace <br> with newline
        .replace(/<p[^>]*>/gi, '')      // Remove <p> opening tags
        .replace(/<\/p>/gi, '\n')       // Replace </p> with newline
        .replace(/<div[^>]*>/gi, '')    // Remove <div> opening tags
        .replace(/<\/div>/gi, '\n')     // Replace </div> with newline
        .replace(/<[^>]+>/g, '')        // Remove all other tags
        .replace(/\r\n/g, '\n')         // Normalize line endings
        .replace(/\r/g, '\n')           // Normalize line endings
        .replace(/\t/g, '    ')         // Replace tabs with spaces
        .replace(/\n\s*\n/g, '\n')      // Collapse multiple empty lines
        .replace(/^\s+|\s+$/gm, '')     // Trim each line
        .trim();
      break;
    }

    case 'json': {
      try {
        // Try to extract text content from JSON
        const obj = JSON.parse(content);
        if (typeof obj === 'string') {
          parsed = obj;
        } else if (Array.isArray(obj) && obj.every(item => typeof item === 'string')) {
          parsed = obj.join('\n');
        } else {
          parsed = JSON.stringify(obj, null, 2);
        }
      } catch {
        parsed = content;
      }
      break;
    }    case 'txt':
    default: {
      // Just normalize line endings and tabs
      parsed = content
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\t/g, '    ');
      break;
    }
  }

  // Final cleanup to ensure consistent text for typing
  return parsed
    .replace(/\s+/g, ' ')           // Replace multiple spaces with single space
    .replace(/\n\s*/g, '\n')        // Remove spaces after newlines
    .replace(/\s*\n/g, '\n')        // Remove spaces before newlines
    .replace(/\n{3,}/g, '\n\n')     // Limit consecutive newlines to 2
    .trim();
}
