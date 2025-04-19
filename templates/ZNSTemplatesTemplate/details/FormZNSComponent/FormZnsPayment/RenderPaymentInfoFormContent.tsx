'use client';
import { Card, Form, Input, Select } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { regexInsideBrackets, regexParams, useZNSTemplateDetails } from '..';
import { MockBankList } from './znsPaymentData';

const parent = 'payment';
const InitData = {
  note: '<bank_transfer_note>',
  account_name: 'CÔNG TY OA NAME',
  account_number: '0123456789',
  amount: '<transfer_amount>',
  bank_account: '0123456789',
};
const RenderPaymentInfoFormContent: React.FC = () => {
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
          {t('ZNS_TEMPLATE.PAYMENT_INFO')} <span className='text-red-500'>*</span>
        </div>
      }
    >
      {/* Lưu ý section */}
      <div className='p-4 border-l-8 border-primary text-sm text-gray-700 mb-6 border-solid border'>
        <p className='font-semibold text-blue-600'> {t('ZNS_TEMPLATE.NOTE')}</p>
        <ul className='list-disc pl-4 mb-0'>
          <li>
            {t('ZNS_TEMPLATE.PAYMENT_INFO_DES')}{' '}
            <Link
              href='https://zalo.cloud/news/cap-nhat-moi-zns-payment-request-template-zns-yeu-cau-thanh-toan/v02ab1fwp4z3yycknnvb7g3x'
              className='text-blue-600'
              target='_blank'
            >
              {t('ZNS_TEMPLATE.HERE')}
            </Link>
            .
          </li>
          <li>{t('ZNS_TEMPLATE.PAYMENT_DES_1')}</li>
          <li>
            {t('ZNS_TEMPLATE.PAYMENT_DES_2')} <strong>{t('ZNS_TEMPLATE.PAYMENT_DES_3')}</strong>.
          </li>
          <li>{t('ZNS_TEMPLATE.PAYMENT_DES_4')}</li>
        </ul>
      </div>

      {/* Form fields */}
      <Form.Item noStyle>
        <Form.Item name={[parent, 'bank_account']} hidden noStyle>
          <Input />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.BANK')}
          name={[parent, 'bank_code']}
          rules={[
            {
              required: true,
              message: t('GENERAL.PLEASE_CHOOSE', { field: t('ZNS_TEMPLATE.BANK') }),
            },
          ]}
        >
          <Select
            className='w-full'
            options={MockBankList.map((item) => ({
              label: `${item.name} (${item.shortName})`,
              value: item.bin,
            }))}
            placeholder={t('ZNS_TEMPLATE.BANK_DES')}
            showSearch
            optionFilterProp='label'
          />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.ACCOUNT_NAME')}
          name={[parent, 'account_name']}
          rules={[
            {
              required: true,
              message: t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.ACCOUNT_NAME') }),
            },
            {
              validator: (_, value) => {
                const matches = value.match(regexParams);
                if (matches) {
                  return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.NOT_PARAM')));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            className='w-full'
            maxLength={100}
            showCount
            placeholder={t('GENERAL.ENTER_INPUT', { field: t('ZNS_TEMPLATE.ACCOUNT_NAME') })}
          />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.ACCOUNT_NUMBER')}
          name={[parent, 'account_number']}
          rules={[
            {
              required: true,
              message: t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.ACCOUNT_NUMBER') }),
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
        >
          <Input
            className='w-full'
            maxLength={20}
            showCount
            placeholder={`${t('GENERAL.ENTER_INPUT', {
              field: t('ZNS_TEMPLATE.ACCOUNT_NUMBER'),
            })} (VD: 33281826xxx)`}
          />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.MONEY')}
          name={[parent, 'amount']}
          required
          rules={[
            {
              validator(_rule, value) {
                const isInsideBrackets = regexInsideBrackets.test(value);
                if (!value) {
                  return Promise.reject(
                    new Error(`${t('ZNS_TEMPLATE.VALID.MONEY_PARAM')} (VD: <transfer_amount>)`),
                  );
                }
                if (!Number(value) && !isInsideBrackets) {
                  return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.ERROR_FORMAT')));
                }
                if (Number(value) && (value < 2000 || value > 500000000)) {
                  return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.MONEY')));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            className='w-full'
            placeholder={`${t('ZNS_TEMPLATE.VALID.MONEY_PARAM')} (VD: <transfer_amount>)`}
          />
        </Form.Item>
        <Form.Item
          label={t('ZNS_TEMPLATE.TRANS_DES')}
          name={[parent, 'note']}
          rules={[
            {
              required: true,
              message: t('GENERAL.ENTER_INPUT', {
                field: t('ZNS_TEMPLATE.TRANS_DES'),
              }),
            },
            {
              validator(_rule, value) {
                const isInsideBrackets = regexInsideBrackets.test(value);
                const specialCharRegex = /^[^@\[\]\^_!"•#$%¥&'()*+,€\-./:;{|<}=~>?]+$/.test(value);

                if (!value) {
                  return Promise.reject(
                    new Error(
                      t('GENERAL.ENTER_INPUT', {
                        field: t('ZNS_TEMPLATE.TRANS_DES'),
                      }),
                    ),
                  );
                }
                if (value && !isInsideBrackets && !specialCharRegex) {
                  return Promise.reject(
                    new Error(
                      `${t('ZNS_TEMPLATE.VALID.CHAR_SPEC')}: @[]^_!"•#$%¥&\'()*+,€-./:;{|<}=~>?)`,
                    ),
                  );
                }
                if (value && !isInsideBrackets) {
                  return Promise.reject(new Error(t('ZNS_TEMPLATE.VALID.ERROR_FORMAT')));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <Input.TextArea
            placeholder={`${t('ZNS_TEMPLATE.VALID.CONTENT_PARAM')} (VD: <bank_transfer_note>)`}
            autoSize
            className='w-full'
            maxLength={90}
            showCount
          />
        </Form.Item>
      </Form.Item>
    </Card>
  );
};

export default RenderPaymentInfoFormContent;
