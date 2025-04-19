'use client';
import { ERadioItemZNSTypeTemplateCollapse, EZNSValueType } from '@/common/enums';
import { Card, Flex, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { RenderFormContent, RenderFormLogo, useZNSTemplateDetails } from '..';

const DEFAULT_DATA = {
  PARAGRAPH:
    'Tuyệt đối KHÔNG chia sẻ mã xác thực cho bất kỳ ai dưới bất kỳ hình thức nào. Mã xác thực có hiệu lực trong 5 phút.',
};
const FormZnsVerified = () => {
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { defaultZNSTemplate, selectedItemZNSTemplate } = stateZNSTemplateStore;
  const t = useTranslations();

  useEffect(() => {
    if (
      formZNSDetails &&
      !defaultZNSTemplate &&
      selectedItemZNSTemplate?.type?.value === EZNSValueType.VERIFIED
    ) {
      formZNSDetails.setFieldsValue({
        layout: [
          { type: ERadioItemZNSTypeTemplateCollapse.document, value: DEFAULT_DATA.PARAGRAPH },
        ],
        otp: '<otp>',
      });
    }
  }, [formZNSDetails, defaultZNSTemplate, selectedItemZNSTemplate?.type?.value]);

  return (
    <>
      <RenderFormLogo />
      <Form.Item noStyle name='otp' hidden initialValue={'<otp>'}>
        <Input />
      </Form.Item>
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
                        {t('ZNS_TEMPLATE.CONTENT_OTP')}
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
                      defaultData={DEFAULT_DATA.PARAGRAPH}
                      {...restField}
                    />
                  </Card>
                );
              })}
            </>
          )}
        </Form.List>
      </div>
    </>
  );
};

export default FormZnsVerified;
