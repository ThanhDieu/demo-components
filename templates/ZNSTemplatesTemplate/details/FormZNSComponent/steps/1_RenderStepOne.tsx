import { EZNSValueType } from '@/common/enums';
import { LoadingMini } from '@/components/atoms';
import { useTemplateSampleStore } from '@/stores/useTemplateSample.store';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import {
  FormZnsCustom,
  FormZnsFeedback,
  FormZnsPayment,
  FormZnsVerified,
  FormZnsVoucher,
  TagZnsList,
  TypeZnsList,
} from '..';

const RenderStepOne = () => {
  const { loading, selectedItemZNSTemplate, defaultZNSTemplate } = useZNSTemplateStore();
  const t = useTranslations();
  const categoryTemplate = useTemplateSampleStore((state) => state.selectedTemplate);

  return (
    <>
      <Form.Item
        name='templateName'
        label={t('ZNS_TEMPLATE.ZNS_NAME')}
        rules={[
          {
            required: true,
            message: t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.ZNS_NAME') }),
          },
          {
            min: 10,
            max: 60,
          },
        ]}
        initialValue={selectedItemZNSTemplate?.templateName}
      >
        <Input
          placeholder={t('GENERAL.ENTER_INPUT', { field: t('ZNS_TEMPLATE.ZNS_NAME') })}
          showCount
          minLength={10}
          maxLength={60}
        />
      </Form.Item>
      <LoadingMini spinning={loading}>
        <Form.Item label={t('TEMPLATE.TEMPLATE_DESCRIPTION')} required>
          {(!!defaultZNSTemplate?.categoryId || !!categoryTemplate?.categoryId) && (
            <div className='mb-3'>
              <span>{t('GENERAL.CATEGORY')}:</span>
              <span className='bg-green-200 p-1 px-2 rounded-md text-sm text-primary font-semibold ml-3'>
                {(defaultZNSTemplate || categoryTemplate)?.category?.name}
              </span>
            </div>
          )}
          {/* tạo các copmponent chọn zns */}
          <div>
            <h4 className='font-bold text-lg'>{t('ZNS_TEMPLATE.SELECT_ZNS')}</h4>
            <TypeZnsList />
          </div>
          <div className='mt-4'>
            <h4 className='font-bold text-lg'>{t('ZNS_TEMPLATE.PURPOSE_SEND_ZNS')}</h4>
            <TagZnsList />
          </div>
          <div className='mt-4 text-gray-500'>
            <RenderChildren type={selectedItemZNSTemplate?.type?.value} />
          </div>
        </Form.Item>
      </LoadingMini>
    </>
  );
};

const RenderChildren = ({ type }: { type?: number }) => {
  switch (type) {
    case EZNSValueType.VERIFIED:
      return <FormZnsVerified />;
    case EZNSValueType.FEEDBACK:
      return <FormZnsFeedback />;
    case EZNSValueType.PAYMENT:
      return <FormZnsPayment />;
    case EZNSValueType.VOUCHER:
      return <FormZnsVoucher />;
    default:
      return <FormZnsCustom />;
  }
};

export default RenderStepOne;
