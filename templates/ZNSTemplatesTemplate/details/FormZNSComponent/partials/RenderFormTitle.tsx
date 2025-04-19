import { Card, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

interface Props {
  defaultData?: string;
}
const RenderFormTitle = ({ defaultData }: Props) => {
  const t = useTranslations();

  return (
    <Card title={t('ZNS_TEMPLATE.TITLE')} size='small' className='!mb-3'>
      <div className='text-neutral-400 mb-3'>{t('ZNS_TEMPLATE.TITLE_DES')}</div>
      <Form.Item
        name='title'
        rules={[
          { required: true, message: t('GENERAL.PLEASE_INPUT', { field: 'Title' }) },
          {
            max: 65,
            min: 9,
          },
        ]}
        initialValue={defaultData}
      >
        <Input showCount maxLength={65} minLength={9} />
      </Form.Item>
    </Card>
  );
};

export default RenderFormTitle;
