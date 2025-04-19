'use client';

import { ERadioItemZNSTypeTemplateCollapse, EZNSValueType } from '@/common/enums';
import { CaretRightOutlined } from '@ant-design/icons';
import { Card, Collapse, CollapseProps, Flex, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import {
  EKeyCollapseFormZNSCustom,
  RenderButtons,
  RenderFormContent,
  RenderFormLogo,
  RenderFormTitle,
  RenderRatingItemFormContent,
  useZNSTemplateDetails,
} from '..';

const DEFAULT_DATA_FEEDBACK = {
  TITLE: 'Đánh giá sản phẩm',
  PARAGRAPH:
    'Xin chào <customer_name>, đơn hàng <order_id> đã được giao thành công. Bạn có hài lòng về sản phẩm của bên <shop_name> không? Bạn vui lòng để lại đánh giá cho <shop_name> biết nhé!',
};

const FormZnsFeedback = () => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, defaultZNSTemplate } = stateZNSTemplateStore;

  useEffect(() => {
    if (
      formZNSDetails &&
      !defaultZNSTemplate &&
      selectedItemZNSTemplate?.type?.value === EZNSValueType.FEEDBACK
    ) {
      formZNSDetails.setFieldsValue({
        layout: [
          {
            type: ERadioItemZNSTypeTemplateCollapse.document,
            value: DEFAULT_DATA_FEEDBACK.PARAGRAPH,
          },
        ],
      });
    }
  }, [formZNSDetails, defaultZNSTemplate, selectedItemZNSTemplate?.type?.value]);

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
  const t = useTranslations();
  return (
    <>
      <RenderFormTitle defaultData={DEFAULT_DATA_FEEDBACK.TITLE} />
      <div className='layout-content'>
        <Form.List name='layout'>
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Card
                    size='small'
                    title={
                      <Flex className='gap-1'>
                        <span className='text-error'>*</span>
                        {t('ZNS_TEMPLATE.TEXTAREA')}
                      </Flex>
                    }
                    key={key}
                    className='!mt-3'
                    classNames={{
                      body: '!pt-6',
                    }}
                  >
                    <Form.Item {...restField} name={[name, 'type']} hidden>
                      <Input />
                    </Form.Item>
                    <RenderFormContent
                      isRequired={true}
                      name={name}
                      defaultData={DEFAULT_DATA_FEEDBACK.PARAGRAPH}
                      {...restField}
                    />
                  </Card>
                );
              })}
            </>
          )}
        </Form.List>
        <RenderRatingItemFormContent />
      </div>
    </>
  );
};

export default FormZnsFeedback;
