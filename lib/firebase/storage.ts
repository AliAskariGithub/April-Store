// lib/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

export async function uploadImageFile(file: File, path: string): Promise<string> {
  try {
    if (storage && storage.app.options.storageBucket) {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    }
  } catch (error) {
    console.warn('Firebase Storage upload fallback:', error);
  }

  // Fallback to data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}
