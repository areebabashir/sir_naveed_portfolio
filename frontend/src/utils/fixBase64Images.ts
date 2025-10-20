// Utility to fix base64 images in existing blog posts
export const fixBase64Images = async (content: string, token: string): Promise<string> => {
  // Find all base64 images in the content
  const base64Regex = /<img[^>]+src="data:image\/([^;]+);base64,([^"]+)"/g;
  let processedContent = content;
  let match;

  while ((match = base64Regex.exec(content)) !== null) {
    const [fullMatch, imageType, base64Data] = match;
    
    try {
      console.log('Processing base64 image...');
      
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `image/${imageType}` });
      
      // Create file from blob
      const file = new File([blob], `image-${Date.now()}.${imageType}`, {
        type: `image/${imageType}`
      });

      // Upload the file
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8000/api/blog/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = `http://localhost:8000${data.imageUrl}`;
      
      // Replace base64 src with uploaded image URL
      processedContent = processedContent.replace(
        fullMatch,
        `<img src="${imageUrl}"`
      );
      
      console.log('Successfully converted base64 image to:', imageUrl);
    } catch (error) {
      console.error('Error processing base64 image:', error);
      // Keep the original base64 image if upload fails
    }
  }

  return processedContent;
};
