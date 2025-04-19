'use client';

import { Form } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';

interface Props {
  name: number;
  defaultData?: string;
  availableDelete?: boolean;
  isRequired?: boolean;
  label?: string;
}
const RenderFormContent = ({ name, defaultData, isRequired, ...restField }: Props) => {
  const t = useTranslations();

  return (
    <Form.Item
      {...restField}
      name={[name, 'value']}
      className='!w-full'
      initialValue={defaultData}
      rules={[
        {
          required: isRequired,
          message: t('GENERAL.ENTER_INPUT', { field: t('TEMPLATE.DETAIL_DESCRIPTION') }),
        },
        {
          min: 9,
          max: 400,
          message: t('ZNS_TEMPLATE.VALID.FIELD_LEN', {
            field: t('GENERAL.VALUE'),
            numbers: '9-400',
          }),
        },
      ]}
    >
      <TextArea
        rows={3}
        placeholder={t('TEMPLATE.DETAIL_DESCRIPTION')}
        className='w-full mt-3'
        showCount
        maxLength={400}
        minLength={9}
      />
    </Form.Item>
  );
};

export default RenderFormContent;
