// components/posts/[id].tsx
import { useState } from 'react';

interface PostProps {
  id: number;
  title: string;
  content: string;
  author: { name: string };
  createdAt: string;
}

export default function Post({ id, title, content, author, createdAt }: PostProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Format date nicely
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  
  // Truncate content if it's too long
  const isLongContent = content.length > 250;
  const displayContent = expanded || !isLongContent ? content : `${content.substring(0, 250)}...`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-700 whitespace-pre-line mb-4">{displayContent}</p>
      
      {isLongContent && (
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-blue-500 hover:underline mb-3 text-sm"
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>By <span className="font-medium">{author.name}</span></span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}