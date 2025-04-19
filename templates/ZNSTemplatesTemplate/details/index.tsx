import { ERadioItemZNSTypeTemplateCollapse, EZNSValueType } from '@/common/enums';
import {
  IZNSFeedback,
  IZNSParams,
  IZNSTable,
  Template,
} from '@/interfaces/templates/template.interface';
import { IZNSTemplateState } from '@/stores/useZNSTemplate.store';
import dayjs from 'dayjs';
import { IFormZNSType } from './context';
import { regexInsideBrackets } from './FormZNSComponent';

export const setupDataFormByDetail = (defaultZNSTemplate?: Template) => {
  const dataPost = defaultZNSTemplate?.dataPostZalo;

  const layoutPath = dataPost?.layout;
  const headerComponents = layoutPath?.header?.components?.[0];
  const bodyComponents = layoutPath?.body?.components;
  const footerComponents = layoutPath?.footer?.components?.[0];

  const buttons = footerComponents?.BUTTONS?.items;
  const logo = headerComponents?.LOGO;
  const banner = headerComponents?.IMAGES?.items;
  const title = bodyComponents?.[0]?.TITLE;
  let ratings, voucher: any, payment;
  const layout = bodyComponents
    ?.map((el: any) => {
      if (!el) return null;
      const { PARAGRAPH, TABLE, RATING, VOUCHER, PAYMENT } = el;
      if (RATING) {
        ratings = RATING?.items;
      }
      if (VOUCHER) voucher = VOUCHER;
      if (PAYMENT) payment = PAYMENT;
      return PARAGRAPH
        ? { type: ERadioItemZNSTypeTemplateCollapse.document, value: PARAGRAPH.value }
        : TABLE
        ? { type: ERadioItemZNSTypeTemplateCollapse.table, table: TABLE.rows }
        : null;
    })
    .filter(Boolean);

  const params = dataPost?.params?.map((item: IZNSParams) => {
    if (!layout?.length) return item;

    const table =
      layout.find((el: any) => el.type === ERadioItemZNSTypeTemplateCollapse.table)?.table || [];

    const matchedRow = table.find((tb: IZNSTable) => tb.value === `<${item.name}>`);

    return String(item.type) === '6' && matchedRow
      ? { ...item, row_type: matchedRow.row_type || 0 }
      : item;
  });
  const isInsideBrackets = (value: string) => regexInsideBrackets.test(value);

  return {
    forForm: {
      templateName: defaultZNSTemplate?.templateName,
      note: defaultZNSTemplate?.note,
      params,
      title: title?.value,
      layout,
      buttons,
      ratings,
      voucher: {
        ...voucher,
        start_date_prefix: !isInsideBrackets(voucher?.start_date) ? 'date' : 'string',
        end_date_prefix: !isInsideBrackets(voucher?.end_date) ? 'date' : 'string',
        start_date: isInsideBrackets(voucher?.start_date || '')
          ? voucher?.start_date
          : voucher?.start_date
          ? dayjs(dayjs(voucher?.start_date, 'HH:mm:ss DD/MM/YYYY'))
          : '',
        end_date: isInsideBrackets(voucher?.end_date)
          ? voucher?.end_date
          : dayjs(dayjs(voucher?.end_date, 'HH:mm:ss DD/MM/YYYY')),
      },
      payment,
    },
    forState: {
      type: defaultZNSTemplate?.templateZNSType,
      tag: defaultZNSTemplate?.templateZNSTag,
      logo,
      banner,
    },
  };
};

type SelectedItemType = IZNSTemplateState['selectedItemZNSTemplate'];
export const prepareDataBeforeSendZNS = (
  values: IFormZNSType,
  selectedItemZNSTemplate?: Partial<SelectedItemType>,
  defaultZNSTemplate?: Template,
) => {
  const isBanner = !!selectedItemZNSTemplate?.banner && selectedItemZNSTemplate?.banner?.length > 0;
  return {
    categoryId: defaultZNSTemplate?.categoryId,
    templateName: values?.templateName,
    note: values?.note,
    templateZNSTypeId: selectedItemZNSTemplate?.type?.id,
    templateZNSTagId: selectedItemZNSTemplate?.tag?.id,
    dataPostZalo: {
      layout: {
        header: {
          components: [
            isBanner && {
              IMAGES: {
                items: selectedItemZNSTemplate?.banner?.map((item) => ({
                  type: 'IMAGE',
                  media_id: item.media_id,
                  fileUrl: item.fileUrl,
                })),
              },
            },
            !!selectedItemZNSTemplate?.logo &&
              !isBanner && {
                LOGO: {
                  light: {
                    type: 'IMAGE',
                    media_id: selectedItemZNSTemplate?.logo?.light?.media_id,
                    fileUrl: selectedItemZNSTemplate?.logo?.light?.fileUrl,
                  },
                  dark: {
                    type: 'IMAGE',
                    media_id: selectedItemZNSTemplate?.logo?.dark?.media_id,
                    fileUrl: selectedItemZNSTemplate?.logo?.dark?.fileUrl,
                  },
                },
              },
          ].filter(Boolean),
        },
        body: {
          components: [
            !!values?.title && {
              TITLE: {
                value: values.title,
              },
            },
            selectedItemZNSTemplate?.type?.value === EZNSValueType.VERIFIED && {
              OTP: { value: '<otp>' },
            },
            ...(values?.layout || [])?.map((item: any) => {
              if (item.type === ERadioItemZNSTypeTemplateCollapse.table) {
                return {
                  TABLE: {
                    rows: item?.table,
                  },
                };
              }
              return {
                PARAGRAPH: {
                  value: item?.value,
                },
              };
            }),
            selectedItemZNSTemplate?.type?.value === EZNSValueType.FEEDBACK && {
              RATING: {
                items: values?.ratings?.map((el: IZNSFeedback) => ({
                  ...el,
                  answers:
                    el?.answers && el?.answers?.length > 0
                      ? el?.answers?.filter(Boolean)
                      : undefined,
                })),
              },
            },
            selectedItemZNSTemplate?.type?.value === EZNSValueType.VOUCHER && {
              VOUCHER: {
                name: values?.voucher.name,
                condition: values?.voucher.condition,
                start_date:
                  values?.voucher?.start_date_prefix === 'date'
                    ? dayjs(values.voucher.start_date).format('HH:mm:00 DD/MM/YYYY')
                    : values?.voucher.start_date,
                end_date:
                  values?.voucher?.end_date_prefix === 'date'
                    ? dayjs(values.voucher.end_date).format('HH:mm:00 DD/MM/YYYY')
                    : values?.voucher.end_date,
                voucher_code: values?.voucher.voucher_code,
                display_code: values?.voucher.display_code,
              },
            },
            selectedItemZNSTemplate?.type?.value === EZNSValueType.PAYMENT && {
              PAYMENT: {
                ...values?.payment,
                bank_account: values?.payment?.account_number,
              },
            },
          ].filter(Boolean),
        },

        footer: {
          components: [
            values.buttons && values.buttons?.length > 0
              ? {
                  BUTTONS: {
                    items: [
                      values.buttons?.[0] && {
                        content: values.buttons[0]?.content,
                        type: values.buttons[0]?.type,
                        title: values.buttons[0]?.title,
                      },
                      values.buttons?.[1] && {
                        content: values.buttons[1]?.content,
                        type: values.buttons[1]?.type,
                        title: values.buttons[1]?.title,
                      },
                    ].filter(Boolean),
                  },
                }
              : undefined,
            ,
          ].filter(Boolean),
        },
      },

      params: values?.params?.map((param) => ({
        type: String(param.type),
        name: param?.name,
        sample_value: param.sample_value,
      })),
    },
  };
};

export { default as FormRequest } from './FormRequest';
export { default as ModalTemplateSample } from './ModalTemplateSample';
export { default as RenderButtonActionForPlayground } from './preview/RenderButtonActionForPlayground';
export { default as RenderCostSummaryForPlayground } from './preview/RenderCostSummaryForPlayground';
export { default as RenderImagesForPlayground } from './preview/RenderImagesForPlayground';
export { default as RenderItemContentForPlayground } from './preview/RenderItemContentForPlayground';
export { default as RenderLogoForPlayground } from './preview/RenderLogoForPlayground';
export { default as RenderOuterCardForPlayground } from './preview/RenderOuterCardForPlayground';
export { default as RenderTableContentForPlayground } from './preview/RenderTableContentForPlayground';
export { default as PreviewTemplate } from './PreviewTemplate';
