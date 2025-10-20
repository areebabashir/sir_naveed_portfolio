import React from 'react';

interface ContentDebugProps {
  content: string;
  title: string;
}

const ContentDebug: React.FC<ContentDebugProps> = ({ content, title }) => {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <h3 className="font-bold text-yellow-800 mb-2">Content Debug Info</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Title:</strong> {title || 'No title'}</p>
        <p><strong>Content Length:</strong> {content?.length || 0} characters</p>
        <p><strong>Content Type:</strong> {typeof content}</p>
        <p><strong>Content Preview:</strong></p>
        <div className="bg-white p-2 border rounded max-h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-xs">
            {content?.substring(0, 200) || 'No content'}
            {content?.length > 200 ? '...' : ''}
          </pre>
        </div>
        <p><strong>Raw Content:</strong></p>
        <div className="bg-white p-2 border rounded max-h-32 overflow-y-auto">
          <pre className="whitespace-pre-wrap text-xs">
            {JSON.stringify(content, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ContentDebug;
