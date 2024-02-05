import { metaTagsStore } from './state';
import { generateMetasMarkup } from './render/static';

// Function to generate metas static HTML
export const generateStaticHtml = () => {
  const metas = metaTagsStore.getState();
  return generateMetasMarkup(metas);
};
export const resetMetaTags = () => {
  metaTagsStore.clear();
};
