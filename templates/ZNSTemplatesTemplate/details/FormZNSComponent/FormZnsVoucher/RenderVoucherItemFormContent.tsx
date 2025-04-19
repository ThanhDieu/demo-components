'use client';
import { DATE_FORMAT_2, TIME_FORMAT } from '@/common/constants';
import { Card, DatePicker, Form, Input, Segmented, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { CiText } from 'react-icons/ci';
import { FaBarcode, FaQrcode } from 'react-icons/fa';
import { regexInsideBrackets, useZNSTemplateDetails } from '..';

const parent = 'voucher';
const InitData = {
  condition: 'Cho đơn hàng trên 200K',
  display_code: '2',
  name: 'Giảm 70.000đ',
  voucher_code: '<voucher_code>',
  start_date_prefix: 'string',
  end_date_prefix: 'string',
};
const RenderVoucherItemFormContent = () => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  useEffect(() => {
    if (formZNSDetails && !stateZNSTemplateStore?.defaultZNSTemplate) {
      formZNSDetails.setFieldValue(parent, InitData);
    }
  }, [formZNSDetails, stateZNSTemplateStore?.defaultZNSTemplate]);

  return (
    <Card
      size='small'
      title={
        <div>
          {t('ZNS_TEMPLATE.VOUCHER_INFO')} <span className='text-red-600'>*</span>
        </div>
      }
    >
      <Form.Item noStyle>
        <Form.Item
          name={[parent, 'name']}
          label={t('ZNS_TEMPLATE.TITLE')}
          rules={[{ required: true }]}
        >
          <Input showCount maxLength={30} />
        </Form.Item>
        <Form.Item
          name={[parent, 'condition']}
          label={t('ZNS_TEMPLATE.CONDITION')}
          rules={[
            {
              required: true,
              message: t('GENERAL.PLEASE_INPUT', {
                field: t('ZNS_TEMPLATE.CONDITION'),
              }),
            },
          ]}
        >
          <Input placeholder={t('ZNS_TEMPLATE.CONDITION_DES')} showCount maxLength={40} />
        </Form.Item>

        <Form.Item label={t('ZNS_TEMPLATE.DATE_START')} className='!mb-0'>
          <RenderDatePrivate fieldName='start_date' />
        </Form.Item>
        <Form.Item required label={t('ZNS_TEMPLATE.DATE_END')} className='!mb-0'>
          <RenderDatePrivate fieldName='end_date' />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.VOUCHER_CODE')}
          name={[parent, 'voucher_code']}
          rules={[{ required: true }]}
        >
          <Input showCount maxLength={25} />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.DISPLAY_CODE')}
          name={[parent, 'display_code']}
          rules={[{ required: true }]}
        >
          <Segmented
            options={[
              { label: 'Bar code', value: '2', icon: <FaBarcode /> },
              { label: 'QR code', value: '1', icon: <FaQrcode /> },
              { label: 'Text only', value: '3', icon: <CiText /> },
            ]}
          />
        </Form.Item>
      </Form.Item>
    </Card>
  );
};

const RenderDatePrivate = ({ fieldName }: { fieldName: string; isRequired?: boolean }) => {
  const { formZNSDetails } = useZNSTemplateDetails();
  const t = useTranslations();
  return (
    <Space.Compact className='!w-full'>
      <Form.Item name={[parent, `${fieldName}_prefix`]} noStyle initialValue={'string'}>
        <Select
          className='!w-1/3'
          onChange={() => {
            formZNSDetails.setFieldValue([parent, fieldName], undefined);
          }}
        >
          <Select.Option value='string'>{t('ZNS_TEMPLATE.STEP_2.PARAM')}</Select.Option>
          <Select.Option value='date'>{t('ZNS_TEMPLATE.DATE_TIME')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues[parent][`${fieldName}_prefix`] !== currentValues[parent][`${fieldName}_prefix`]
        }
      >
        {({ getFieldValue }) =>
          getFieldValue([parent, `${fieldName}_prefix`]) === 'date' ? (
            <Form.Item
              name={[parent, fieldName]}
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('Vui lòng chọn ngày giờ'));
                    }
                    if (fieldName === 'start_date') {
                      const endDate = getFieldValue([parent, 'end_date']);
                      if (endDate && dayjs(value).isAfter(dayjs(endDate))) {
                        return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.DATE_COMPARE')));
                      }
                    }

                    if (fieldName === 'end_date') {
                      const startDate = getFieldValue([parent, 'start_date']);
                      if (startDate && dayjs(value).isBefore(dayjs(startDate))) {
                        return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.DATE_COMPARE_2')));
                      }
                    }

                    return Promise.resolve();
                  },
                },
              ]}
              className='!w-full'
            >
              <DatePicker
                showTime
                format={`${TIME_FORMAT} ${DATE_FORMAT_2}`}
                placeholder={t('ZNS_TEMPLATE.DATE_TIME')}
                className='w-full'
                onChange={() => formZNSDetails.validateFields()}
              />
            </Form.Item>
          ) : (
            <Form.Item
              className='!w-full'
              name={[parent, fieldName]}
              rules={[
                {
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(
                        new Error(
                          t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.STEP_2.PARAM') }),
                        ),
                      );
                    }
                    const isInsideBrackets = regexInsideBrackets.test(value);
                    if (!isInsideBrackets) {
                      return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.ERROR_FORMAT')));
                    }

                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                placeholder={`${t('GENERAL.ENTER_INPUT', {
                  field: t('ZNS_TEMPLATE.STEP_2.PARAM'),
                })}. VD: <${fieldName}>`}
              />
            </Form.Item>
          )
        }
      </Form.Item>
    </Space.Compact>
  );
};

export default RenderVoucherItemFormContent;
