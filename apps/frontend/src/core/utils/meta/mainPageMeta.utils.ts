import { type TGeneratePageMetaFunction } from './generatePageMeta.models';
import { generatePageMeta } from './generatePageMeta.utils';

export const generateMainPageMeta: TGeneratePageMetaFunction = async (params) => {
  return generatePageMeta(params);
};
