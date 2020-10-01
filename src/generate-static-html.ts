import { getState, clearStore } from './state';
import { generateMetasMarkup } from './render/static';

// Function to generate metas static HTML
export const generateStaticHtml = () => {
  const metas = getState();
  return generateMetasMarkup(metas);
};
export const resetMetaTags = () => {
  clearStore();
};
