// Simple utility to fix base64 images in blog content
export const simpleBase64Fix = async (content: string, token: string): Promise<string> => {
  console.log('Starting simple base64 fix...');
  console.log('Content length:', content.length);
  console.log('Has base64:', content.includes('data:image/'));
  
  if (!content.includes('data:image/')) {
    console.log('No base64 images found');
    return content;
  }

  // Simple regex to find base64 images
  const base64Pattern = /<img[^>]*src="data:image\/([^;]+);base64,([^"]+)"/g;
  let fixedContent = content;
  let match;
  let count = 0;

  while ((match = base64Pattern.exec(content)) !== null) {
    count++;
    console.log(`Found base64 image ${count}:`, match[0].substring(0, 100) + '...');
    
    try {
      const [fullMatch, imageType, base64Data] = match;
      
      // Convert base64 to blob
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: `image/${imageType}` });
      
      // Create file
      const file = new File([blob], `fixed-image-${Date.now()}-${count}.${imageType}`, {
        type: `image/${imageType}`
      });

      console.log('Created file:', file.name, file.size, 'bytes');

      // Upload file
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
        console.error('Upload failed:', response.status, response.statusText);
        continue;
      }

      const result = await response.json();
      const imageUrl = `http://localhost:8000${result.imageUrl}`;
      
      console.log('Upload successful:', imageUrl);
      
      // Replace in content
      fixedContent = fixedContent.replace(fullMatch, `<img src="${imageUrl}"`);
      console.log('Replaced base64 with URL');
      
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  console.log(`Processed ${count} base64 images`);
  return fixedContent;
};
