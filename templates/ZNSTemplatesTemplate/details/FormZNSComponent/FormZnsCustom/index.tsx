'use client';

import { ERadioItemZNSTypeTemplateCollapse, EZNSValueType } from '@/common/enums';
import { mockButtonZNS } from '@/stores/useZNSTemplate.store';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, CollapseProps } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import {
  EKeyCollapseFormZNSCustom,
  OptionRadioGroup,
  RenderButtons,
  RenderDnDFormLayout,
  RenderFormImage,
  RenderFormLogo,
  RenderFormTitle,
  useZNSTemplateDetails,
} from '..';

const DEFAULT_DATA_CUSTOM = {
  TABLE: [
    { title: 'Mã đơn hàng', value: '<order_code>' },
    { title: 'Trạng thái', value: '<payment_status>' },
  ],
  TITLE: 'Xin chào <customer_name>,',
  PARAGRAPH: [
    'Cảm ơn bạn đã mua sản phẩm <product_name> tại cửa hàng chúng tôi.',
    'Chúng tôi rất vui vì trong rất nhiều lựa chọn, bạn đã luôn chọn sử dụng các sản phẩm của <company_name>.',
  ],
};

interface Props {}
const FormZnsCustom: React.FC<Props> = () => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, defaultZNSTemplate } = stateZNSTemplateStore;
  const [itemLogoRadio, setItemLogoRadio] = useState<ERadioItemZNSTypeTemplateCollapse>(
    ERadioItemZNSTypeTemplateCollapse.logo,
  );

  useEffect(() => {
    if (
      formZNSDetails &&
      selectedItemZNSTemplate?.type?.value === EZNSValueType.CUSTOM &&
      !defaultZNSTemplate
    ) {
      formZNSDetails.setFieldsValue({
        title: DEFAULT_DATA_CUSTOM.TITLE,
        layout: [
          ...DEFAULT_DATA_CUSTOM.PARAGRAPH.map((el) => ({
            type: ERadioItemZNSTypeTemplateCollapse.document,
            value: el,
          })),
          {
            type: ERadioItemZNSTypeTemplateCollapse.table,
            table: DEFAULT_DATA_CUSTOM.TABLE,
          },
        ],
      });
    }
  }, [selectedItemZNSTemplate?.type?.value, defaultZNSTemplate, formZNSDetails]);

  useEffect(() => {
    if (selectedItemZNSTemplate?.logo || selectedItemZNSTemplate?.banner)
      setItemLogoRadio(
        selectedItemZNSTemplate?.logo
          ? ERadioItemZNSTypeTemplateCollapse.logo
          : ERadioItemZNSTypeTemplateCollapse.image,
      );
  }, [selectedItemZNSTemplate?.logo, selectedItemZNSTemplate?.banner]);

  const itemsCollapse: CollapseProps['items'] = [
    {
      key: EKeyCollapseFormZNSCustom.logo,
      label: (
        <>
          <div className='font-bold text-lg'>{t('ZNS_TEMPLATE.LOGO_IMAGE')}</div>
          <div className='text-xs text-neutral-400'>{t('ZNS_TEMPLATE.LOGO_IMAGE_DES')}</div>
        </>
      ),
      children: (
        <RenderLogoImagePrivate
          {...{
            itemLogoRadio,
            setItemLogoRadio,
            form: formZNSDetails,
          }}
        />
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
      children: (
        <RenderButtons
          min={itemLogoRadio === ERadioItemZNSTypeTemplateCollapse.image ? 1 : undefined}
        />
      ),
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

const RenderLogoImagePrivate = ({ itemLogoRadio, setItemLogoRadio, form }: any) => {
  const t = useTranslations();
  return (
    <>
      <div className='mb-4'>
        {itemLogoRadio === ERadioItemZNSTypeTemplateCollapse.logo && <RenderFormLogo />}
        {itemLogoRadio === ERadioItemZNSTypeTemplateCollapse.image && <RenderFormImage />}
      </div>
      <OptionRadioGroup
        selectedValue={itemLogoRadio}
        options={[
          { label: t('ZNS_TEMPLATE.LOGO'), value: ERadioItemZNSTypeTemplateCollapse.logo },
          { label: t('ZNS_TEMPLATE.IMAGE'), value: ERadioItemZNSTypeTemplateCollapse.image },
        ]}
        onChange={(value) => {
          setItemLogoRadio(value as ERadioItemZNSTypeTemplateCollapse);
          if (
            value === ERadioItemZNSTypeTemplateCollapse.image &&
            !form?.getFieldValue('buttons')
          ) {
            form?.setFieldValue('buttons', [
              {
                type: mockButtonZNS[0]?.priority,
              },
            ]);
          }
        }}
      />
    </>
  );
};

const RenderContentPrivate = () => {
  return (
    <>
      <RenderFormTitle defaultData={DEFAULT_DATA_CUSTOM.TITLE} />
      <RenderDnDFormLayout
        tableDefaultData={DEFAULT_DATA_CUSTOM.TABLE}
        paragraphDefaultData={DEFAULT_DATA_CUSTOM.PARAGRAPH}
      />
    </>
  );
};

export default FormZnsCustom;
