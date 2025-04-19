'use client';

import { ERadioItemZNSTypeTemplateCollapse, EZNSValueType } from '@/common/enums';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import {
  EKeyCollapseFormZNSCustom,
  RenderButtons,
  RenderDnDFormLayout,
  RenderFormLogo,
  RenderFormTitle,
  RenderPaymentInfoFormContent,
  useZNSTemplateDetails,
} from '..';

const DEFAULT_DATA_PAYMENT = {
  TABLE: [
    { title: 'Quý khách', value: '<customer_name>' },
    { title: 'Mã hợp đồng', value: '<contract_number>' },
    { title: 'Số tiền', value: '<price>' },
    { title: 'Ghi chú', value: 'Quý khách vui lòng thanh toán đúng hạn.' },
  ],
  TITLE: 'Thông tin thanh toán',
  PARAGRAPH: ['OA name trân trọng thông báo đến Quý khách cước phí như sau:'],
};

interface Props {}
const FormZnsPayment: React.FC<Props> = () => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, defaultZNSTemplate } = stateZNSTemplateStore;

  useEffect(() => {
    if (
      formZNSDetails &&
      selectedItemZNSTemplate?.type?.value === EZNSValueType.PAYMENT &&
      !defaultZNSTemplate
    ) {
      formZNSDetails.setFieldsValue({
        title: DEFAULT_DATA_PAYMENT.TITLE,
        layout: [
          ...DEFAULT_DATA_PAYMENT.PARAGRAPH.map((el) => ({
            type: ERadioItemZNSTypeTemplateCollapse.document,
            value: el,
          })),
          {
            type: ERadioItemZNSTypeTemplateCollapse.table,
            table: DEFAULT_DATA_PAYMENT.TABLE,
          },
        ],
      });
    }
  }, [selectedItemZNSTemplate?.type?.value, defaultZNSTemplate, formZNSDetails]);

  const itemsCollapse: CollapseProps['items'] = [
    {
      key: EKeyCollapseFormZNSCustom.logo,
      label: (
        <div className='font-bold text-lg'>
          Logo <span className='text-error'>*</span>
        </div>
      ),
      children: (
        <div className='mb-4'>
          <RenderFormLogo />
        </div>
      ),
    },
    {
      key: EKeyCollapseFormZNSCustom.content,
      label: <div className='font-bold text-lg'>{t('ZNS_TEMPLATE.CONTENT_ZNS')}</div>,
      children: <RenderContentPrivate />,
    },
    {
      key: EKeyCollapseFormZNSCustom.button,
      label: (
        <>
          <div className='font-bold text-lg'>{t('ZNS_TEMPLATE.ACTION_BUTTON')}</div>
          <div className='text-xs text-neutral-400'>{t('ZNS_TEMPLATE.ACTION_BUTTON_DES')}</div>
        </>
      ),
      children: <RenderButtons />,
    },
  ];

  return (
    <Collapse
      items={itemsCollapse}
      bordered={false}
      defaultActiveKey={[
        EKeyCollapseFormZNSCustom.logo,
        EKeyCollapseFormZNSCustom.content,
        EKeyCollapseFormZNSCustom.button,
      ]}
      expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
    />
  );
};

const RenderContentPrivate = () => {
  return (
    <>
      <RenderFormTitle defaultData={DEFAULT_DATA_PAYMENT.TITLE} />
      <RenderDnDFormLayout
        tableDefaultData={DEFAULT_DATA_PAYMENT.TABLE}
        paragraphDefaultData={DEFAULT_DATA_PAYMENT.PARAGRAPH}
      />
      <RenderPaymentInfoFormContent />
    </>
  );
};

export default FormZnsPayment;
