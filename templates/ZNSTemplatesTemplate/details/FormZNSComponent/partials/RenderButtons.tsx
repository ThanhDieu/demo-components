'use client';

import { useZaloOaStore } from '@/stores/useZaloOA.store';
import { mockButtonZNS } from '@/stores/useZNSTemplate.store';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, FormInstance, Input, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { FaRegTrashAlt } from 'react-icons/fa';
import { getCurrentZNSButton, useZNSTemplateDetails } from '..';

const RenderButtons = ({ min }: { min?: number }) => {
  const { formZNSDetails: form, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { commonZNSTemplate } = stateZNSTemplateStore;
  const { currentOa } = useZaloOaStore();
  const t = useTranslations('ZNS_TEMPLATE');
  const t2 = useTranslations();

  const handleOptionChange = (value: string, name: number) => {
    const currentButton = getCurrentZNSButton(value);
    if (currentButton?.id) {
      form?.setFieldValue(['buttons', name, 'title'], currentButton?.defaultValue);
      form?.setFieldValue(
        ['buttons', name, 'content'],
        String(value) === '3' ? `https://oa.zalo.me/${currentOa?.zoaId}` : '',
      );
    }
  };

  return (
    <Form.List name='buttons'>
      {(fields, { add, remove }) => (
        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
          {fields.map(({ name, key, ...restField }) => {
            const isMainButton = name === 0;
            return (
              <Card
                size='small'
                title={isMainButton ? t('PRIMARY_BUTTON') : t('SECONDARY_BUTTON')}
                key={key}
                extra={
                  (!min || fields?.length > min) && (
                    <Button
                      danger
                      onClick={() => {
                        remove(name);
                      }}
                      type='text'
                      icon={<FaRegTrashAlt size={18} />}
                    />
                  )
                }
              >
                <Form.Item
                  {...restField}
                  name={[name, 'type']}
                  label={t('TYPE_BUTTON')}
                  rules={[
                    {
                      required: true,
                      message: t2('GENERAL.PLEASE_CHOOSE', {
                        field: t('TYPE_BUTTON'),
                      }),
                    },
                  ]}
                >
                  <Select
                    placeholder={t('SELECT_BUTTON')}
                    onChange={(value) => handleOptionChange(value, name)}
                    options={commonZNSTemplate?.button?.map((item) => ({
                      ...item,
                      value: item?.priority,
                      label: `${item?.title} (+${
                        isMainButton ? item?.primaryPrice : item?.secondaryPrice
                      }đ)`,
                    }))}
                    optionRender={(option) => (
                      <div>
                        <div>
                          {option?.data?.title} (+
                          {isMainButton ? option.data?.primaryPrice : option.data?.secondaryPrice}đ)
                        </div>
                        <div className='text-xs text-gray-400'>{option?.data?.description}</div>
                      </div>
                    )}
                  />
                </Form.Item>
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues?.buttons?.[name] !== currentValues?.buttons?.[name]
                  }
                >
                  {({ getFieldValue }) => {
                    const currentButton = getCurrentZNSButton(
                      getFieldValue(['buttons', name, 'type']),
                    );
                    return (
                      <div className='border border-solid border-neutral-200 p-4'>
                        <Form.Item
                          {...restField}
                          name={[name, 'title']}
                          label={t('CONTENT_BUTTON')}
                          rules={[
                            {
                              required: true,
                              message: t2('GENERAL.PLEASE_INPUT', {
                                field: t('CONTENT_BUTTON'),
                              }),
                            },
                            { max: 30, min: 5 },
                          ]}
                          initialValue={currentButton?.defaultValue}
                        >
                          <Input
                            placeholder={t2('GENERAL.ENTER_INPUT', {
                              field: t('CONTENT_BUTTON'),
                            })}
                            showCount
                            maxLength={30}
                            minLength={5}
                          />
                        </Form.Item>
                        <RenderButtonByType
                          type={currentButton?.buttonTag !== 2 ? currentButton?.type : 3}
                          form={form}
                          name={name}
                          {...restField}
                        />
                      </div>
                    );
                  }}
                </Form.Item>
              </Card>
            );
          })}

          <Button
            type='primary'
            ghost
            className='w-1/4'
            onClick={() =>
              add({
                type: mockButtonZNS[0]?.priority,
              })
            }
            icon={<PlusCircleOutlined />}
            disabled={fields?.length >= 2}
          >
            {t('ACTION_BUTTON')}
          </Button>
        </div>
      )}
    </Form.List>
  );
};
const RenderButtonByType = ({
  type,
  form,
  name,
  ...restField
}: {
  type?: number;
  form?: FormInstance<any>;
  name: number;
}) => {
  const t = useTranslations();
  switch (type) {
    case 1:
      return (
        <Form.Item
          {...restField}
          name={[name, 'content']}
          rules={[
            { required: true, message: '' },
            {
              pattern: /^[0-9]+$/,
              message: 'Số điện thoại không đúng định dạng',
            },
            {
              max: 15,
              min: 4,
              message: 'Giá trị phải nằm trong khoảng 4-15 ký tự',
            },
          ]}
          className='!w-full'
          label='Số điện thoại'
        >
          <Input placeholder='Nhập Số điện thoại' />
        </Form.Item>
      );
    case 2:
      return (
        <Form.Item
          {...restField}
          name={[name, 'content']}
          label='Đường dẫn liên kết'
          rules={[
            { required: true, message: '' },
            { type: 'url', warningOnly: true },
          ]}
        >
          <Input placeholder={t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.URL') })} />
        </Form.Item>
      );
    case 3:
      return (
        <Form.Item {...restField} name={[name, 'content']} hidden>
          <Input />
        </Form.Item>
      );
    default:
      return null;
  }
};

export default RenderButtons;
