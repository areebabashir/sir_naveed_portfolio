import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { simpleBase64Fix } from '@/utils/simpleBase64Fix';

interface FixBlogContentProps {
  blogId: string;
  currentContent: string;
  onContentFixed: (newContent: string) => void;
}

const FixBlogContent: React.FC<FixBlogContentProps> = ({ 
  blogId, 
  currentContent, 
  onContentFixed 
}) => {
  const { token } = useAuth();
  const [isFixing, setIsFixing] = useState(false);
  const [message, setMessage] = useState('');

  const hasBase64Images = currentContent.includes('data:image/');

  if (!hasBase64Images) {
    return null;
  }

  const handleFixContent = async () => {
    try {
      setIsFixing(true);
      setMessage('Fixing base64 images...');

      // Fix base64 images
      const fixedContent = await simpleBase64Fix(currentContent, token!);
      
      // Update the blog post
      const response = await fetch(`http://localhost:8000/api/blog/${blogId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: fixedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update blog post');
      }

      setMessage('Content fixed successfully!');
      onContentFixed(fixedContent);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error fixing content:', error);
      setMessage('Failed to fix content. Please try again.');
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="mb-4">
      <Alert>
        <AlertDescription className="flex items-center justify-between">
          <span>
            This blog post contains base64 images that may not display properly. 
            Click "Fix Content" to convert them to proper image files.
          </span>
          <Button 
            onClick={handleFixContent} 
            disabled={isFixing}
            size="sm"
            variant="outline"
          >
            {isFixing ? 'Fixing...' : 'Fix Content'}
          </Button>
        </AlertDescription>
      </Alert>
      
      {message && (
        <Alert className={message.includes('successfully') ? 'border-green-500' : 'border-red-500'}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FixBlogContent;
