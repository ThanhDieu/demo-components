import { EZNSValueType } from '@/common/enums';
import NumberUtils from '@/utils/NumberUtils';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { Button, Form, Segmented } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { RenderCostSummaryForPlayground } from '.';
import {
  getCurrentZNSButton,
  PreviewTemplateZNSCustom,
  PreviewTemplateZNSFeedback,
  PreviewTemplateZNSPayment,
  PreviewTemplateZNSVerified,
  PreviewTemplateZNSVoucher,
  useZNSTemplateDetails,
} from './FormZNSComponent';

interface PreviewTemplateProps {}

const PreviewTemplate: React.FC<PreviewTemplateProps> = () => {
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, setModeTemplate, modeTemplate } = stateZNSTemplateStore;
  const t = useTranslations();
  const buttonsWatch = Form.useWatch('buttons', formZNSDetails) as any[];
  const calcPrice = useMemo(() => {
    return (
      (selectedItemZNSTemplate?.type?.price || 0) +
      (getCurrentZNSButton(buttonsWatch?.[0]?.type)?.primaryPrice || 0) +
      (getCurrentZNSButton(buttonsWatch?.[1]?.type)?.secondaryPrice || 0)
    );
  }, [selectedItemZNSTemplate, buttonsWatch]);

  return (
    <div className='bg-bgPurpleLight p-4 pr-0 rounded-lg shadow-md h-full'>
      <div className='flex items-center justify-between pb-3'>
        <h3 className='font-semibold'>{t('TEMPLATE.PREVIEW_TEMPLATE')}</h3>
        <Segmented
          shape='round'
          options={[
            { value: 'light', icon: <SunOutlined /> },
            { value: 'dark', icon: <MoonOutlined /> },
          ]}
          onChange={(value: any) => setModeTemplate(value)}
          value={modeTemplate}
        />
      </div>
      <div className='pr-4 h-full custom-scrollbar min-h-[50vh] max-h-[calc(100vh_-_250px)] overflow-auto overflow-x-hidden'>
        <div
          className={clsx(
            'rounded-md mt-3 mb-6 overflow-hidden p-1',
            modeTemplate === 'light' ? 'bg-white' : 'bg-bgDark',
            modeTemplate === 'dark' ? 'text-[#bdbbc3]' : 'text-bgDark',
          )}
        >
          <RenderChildren type={selectedItemZNSTemplate?.type?.value} />
        </div>
        <div className='flex flex-col gap-5'>
          <div className='flex w-full justify-between items-center'>
            <span>{t('ZNS_TEMPLATE.ZNS_CUSTOM')}</span>
            <span className='font-semibold'>
              {selectedItemZNSTemplate?.type?.price || '200'} VND
            </span>
          </div>
          {/* hiển thị giá tiền của nút chính và nút phụ */}
          <RenderCostSummaryForPlayground />
          <div className='flex w-full justify-between items-center'>
            <span>{t('TEMPLATE.ESTIMATED_COST')}</span>
            <span className='font-semibold'>
              {NumberUtils.numberToCurrency(calcPrice) || '200'} VND/ZNS
            </span>
          </div>
          <div className='w-full'>
            <Button type='primary' className='w-full' disabled>
              {t('ZNS_TEMPLATE.TRY_SEND_TEMPLATE_ZNS')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RenderChildren = ({ type }: { type?: number }) => {
  switch (type) {
    case EZNSValueType.VERIFIED:
      return <PreviewTemplateZNSVerified />;
    case EZNSValueType.FEEDBACK:
      return <PreviewTemplateZNSFeedback />;
    case EZNSValueType.VOUCHER:
      return <PreviewTemplateZNSVoucher />;
    case EZNSValueType.PAYMENT:
      return <PreviewTemplateZNSPayment />;
    default:
      return <PreviewTemplateZNSCustom />;
  }
};

export default PreviewTemplate;
