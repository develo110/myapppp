
/**
 * CLOUDINARY SERVICE
 * Handles uploading images and videos to Cloudinary.
 * 
 * NOTE: In a production app, the API_SECRET should NEVER be stored in the frontend.
 * You would typically generate the signature on a backend server.
 * This implementation is for demonstration purposes to make the app standalone.
 */

const CLOUD_NAME = 'dbhcy15gl';
const API_KEY = '365239848261496';
const API_SECRET = 'HGVhhjPti0stub_PIGFRQS0lNl4';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    
    // Generate Signature
    // Parameters to sign: timestamp
    // String format: key=value&key=value... + secret
    const strToSign = `timestamp=${timestamp}${API_SECRET}`;
    const signature = await sha1(strToSign);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp.toString());
    formData.append('signature', signature);
    
    // Use 'auto' resource type to handle both images and videos
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // Fallback to local object URL if upload fails (offline mode or quota exceeded)
    return URL.createObjectURL(file);
  }
};

/**
 * Helper to generate SHA-1 hash for Cloudinary signature
 */
async function sha1(str: string): Promise<string> {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
  return Array.from(new Uint8Array(hash))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');
}
