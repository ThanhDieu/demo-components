'use client';
import { IZNSTable } from '@/interfaces/templates/template.interface';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { regexParams } from '..';

interface Props {
  name: number;
  defaultValue?: IZNSTable[];
}

const RenderFormTable = ({ name, defaultValue }: Props) => {
  const t = useTranslations();

  return (
    <>
      <div className='text-neutral-400 mb-4'>{t('ZNS_TEMPLATE.TABLE_DES')}</div>
      <Flex className='mb-1'>
        <div className='w-1/2 font-medium'>{t('ZNS_TEMPLATE.TITLE')}</div>
        <div className='w-1/2 font-medium'>{t('ZNS_TEMPLATE.DES_')}</div>
      </Flex>
      <Form.List name={[name, 'table']} initialValue={defaultValue}>
        {(subFields, subOpt) => (
          <>
            {subFields.map((tableField) => (
              <Flex key={tableField.key} className='gap-2 mb-3'>
                <Form.Item
                  name={[tableField.name, 'title']}
                  rules={[
                    {
                      required: true,
                      message: t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.TITLE') }),
                    },
                    {
                      min: 3,
                      max: 36,
                      message: t('ZNS_TEMPLATE.VALID.FIELD_LEN', {
                        field: t('ZNS_TEMPLATE.TITLE'),
                        numbers: '3-36',
                      }),
                    },
                    {
                      validator: (_, value) => {
                        const matches = value?.match(regexParams);
                        if (matches) {
                          return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.NOT_PARAM')));
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  className='!mb-0 !w-full'
                >
                  <Input
                    placeholder={t('GENERAL.ENTER_INPUT', { field: t('ZNS_TEMPLATE.TITLE') })}
                    showCount
                    maxLength={36}
                    minLength={3}
                  />
                </Form.Item>
                <Form.Item
                  name={[tableField.name, 'value']}
                  rules={[
                    {
                      required: true,
                      message: t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.DES_') }),
                    },
                    {
                      min: 3,
                      max: 90,
                      message: t('ZNS_TEMPLATE.VALID.FIELD_LEN', {
                        field: t('GENERAL.VALUE'),
                        numbers: '3-90',
                      }),
                    },
                  ]}
                  className='!mb-0 !w-full'
                >
                  <Input
                    showCount
                    maxLength={90}
                    minLength={3}
                    placeholder={t('GENERAL.ENTER_INPUT', { field: t('ZNS_TEMPLATE.DES_') })}
                  />
                </Form.Item>
                {subFields?.length > 2 && (
                  <MinusCircleOutlined
                    onClick={() => {
                      subOpt.remove(tableField.name);
                    }}
                    className='!h-8'
                  />
                )}
              </Flex>
            ))}
            {subFields?.length < 8 && (
              <Form.Item noStyle>
                <Button type='dashed' onClick={() => subOpt.add()} block icon={<PlusOutlined />}>
                  {t('ZNS_TEMPLATE.ADD_ROW')}
                </Button>
              </Form.Item>
            )}
          </>
        )}
      </Form.List>
    </>
  );
};

export default RenderFormTable;
