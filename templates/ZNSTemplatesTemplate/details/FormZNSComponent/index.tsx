import { mockButtonZNS } from '@/stores/useZNSTemplate.store';

export const regexParams = /<[^>]+>/g;
export const regexInsideBrackets = /^<[^<>]+>$/;

export const extractTemplateParams = (data: any): string[] => {
  const paramsSet = new Set<string>();

  const traverse = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(traverse);
    } else if (typeof obj === 'string') {
      const matches = obj.match(regexParams);
      if (matches) {
        matches.forEach((match) => paramsSet.add(match));
      }
    }
  };

  traverse(data);

  return Array.from(paramsSet).map((value) => value.replace('<', '').replace('>', ''));
};

export const getCurrentZNSButton = (value: string) =>
  mockButtonZNS?.find((b) => String(b.priority) === String(value));

export const formatTextWithBoldTags = (text: string, mode: 'light' | 'dark') => {
  const result = [];
  let lastIndex = 0;

  const matches = [...text.matchAll(regexParams)];

  matches.forEach((match, idx) => {
    const startIndex = match.index!;
    const endIndex = startIndex + match[0].length;

    if (lastIndex < startIndex) {
      result.push(text.slice(lastIndex, startIndex));
    }

    result.push(
      <strong className={mode === 'dark' ? 'text-white' : 'text-black'} key={idx}>
        {match[0]}
      </strong>,
    );

    lastIndex = endIndex;
  });

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }

  return result;
};

export enum EKeyCollapseFormZNSCustom {
  logo = 'logo',
  content = 'content',
  button = 'button',
}

export * from '../context';
export { default as FormZnsCustom } from './FormZnsCustom';
export { default as PreviewTemplateZNSCustom } from './FormZnsCustom/PreviewTemplateZNSCustom';
export { default as FormZnsFeedback } from './FormZnsFeedback';
export { default as PreviewTemplateZNSFeedback } from './FormZnsFeedback/PreviewTemplateZNSFeedback';
export { default as RenderRatingItemFormContent } from './FormZnsFeedback/RenderRatingItemFormContent';
export { default as FormZnsPayment } from './FormZnsPayment';
export { default as PreviewTemplateZNSPayment } from './FormZnsPayment/PreviewTemplateZNSPayment';
export { default as RenderPaymentInfoFormContent } from './FormZnsPayment/RenderPaymentInfoFormContent';
export { default as FormZnsVerified } from './FormZnsVerified';
export { default as PreviewTemplateZNSVerified } from './FormZnsVerified/PreviewTemplateZNSVerified';
export { default as FormZnsVoucher } from './FormZnsVoucher';
export { default as PreviewTemplateZNSVoucher } from './FormZnsVoucher/PreviewTemplateZNSVoucher';
export { default as RenderVoucherItemFormContent } from './FormZnsVoucher/RenderVoucherItemFormContent';
export { default as OptionRadioGroup } from './partials/OptionRadioGroup';
export { default as RenderButtons } from './partials/RenderButtons';
export { default as RenderDnDFormLayout } from './partials/RenderDnDFormLayout';
export { default as RenderFormContent } from './partials/RenderFormContent';
export { default as RenderFormImage } from './partials/RenderFormImage';
export { default as RenderFormLogo } from './partials/RenderFormLogo';
export { default as RenderFormTable } from './partials/RenderFormTable';
export { default as RenderFormTitle } from './partials/RenderFormTitle';
export { default as RenderTagFormTable } from './partials/RenderTagFormTable';
export { default as TagZnsList } from './partials/TagZnsList';
export { default as TypeZnsItem } from './partials/TypeZnsItem';
export { default as TypeZnsList } from './partials/TypeZnsList';
export { default as RenderStepOne } from './steps/1_RenderStepOne';
export { default as RenderStepTwo } from './steps/2_RenderStepTwo';
