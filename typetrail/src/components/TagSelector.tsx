import React from 'react';
import { getSelectedHtmlTag, setSelectedHtmlTag } from '../utils/contentParser';

const commonTags = ['main', 'article', 'div#content', 'body'];

export const TagSelector = () => {
  const [selectedTag, setSelectedTag] = React.useState(getSelectedHtmlTag());

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTag = e.target.value;
    setSelectedTag(newTag);
    setSelectedHtmlTag(newTag);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>
        Select content tag: 
        <select 
          value={selectedTag}
          onChange={handleTagChange}
          style={{ marginLeft: '0.5rem' }}
        >
          {commonTags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
