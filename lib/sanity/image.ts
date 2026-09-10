import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from './client';

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: any) {
  if (!builder || !source) return '';
  try {
    return builder.image(source).auto('format').fit('max').url();
  } catch {
    return '';
  }
}
