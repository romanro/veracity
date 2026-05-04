import { format } from 'date-fns';

export const formatDateToMmDdYyyy = (date: string): string => {
  if (!date) {
    return '';
  }

  return format(new Date(date), 'MMM dd, yyyy');
};

export async function createBase64FromPreview(preview: string): Promise<string | null> {
  if (!preview) return null;

  try {
    const res = await fetch(preview);
    const blob = await res.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('Error: result is not a string');
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('Error converting to base64 ', err);
    return null;
  }
}
