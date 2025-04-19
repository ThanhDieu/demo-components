import { EZNSValueType } from '@/common/enums';
import { IZNSParams, IZNSPayment, IZNSVoucher } from '@/interfaces/templates/template.interface';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Flex, Form, Input, Popover, Select, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { RenderTagFormTable, useZNSTemplateDetails } from '..';

const RenderStepTwo = () => {
  const { formZNSDetails: form, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, commonZNSTemplate, step } = stateZNSTemplateStore;
  const t = useTranslations();

  const paramWatch: IZNSParams[] = Form.useWatch('params', form);
  const voucherWatch: IZNSVoucher = Form.useWatch('voucher', form);
  const paymentWatch: IZNSPayment | undefined = Form.useWatch('payment', form);

  const getPlaceholder = useMemo(() => {
    if (!paramWatch) return [];
    return paramWatch?.map((item: any) => {
      const currentItem = commonZNSTemplate?.params?.find((el) => el.type === item.type);
      return {
        ...item,
        sample: currentItem?.sample_value,
        length: currentItem?.length,
      };
    });
  }, [paramWatch]);

  useEffect(() => {
    if (!paramWatch || !form) return;

    const updateField = (index: number, name: string, type: number) => {
      form.setFieldValue(['params', index], {
        sample_value: paramWatch[index]?.sample_value || '',
        name,
        type,
        disabled: true,
      });
    };

    if (selectedItemZNSTemplate?.type?.value === EZNSValueType.VERIFIED) {
      updateField(0, 'otp', 12);
    }

    const findFieldIndex = (fieldName: string) =>
      paramWatch.findIndex((pr) => pr.name === fieldName);

    if (findFieldIndex('phone') > -1) {
      updateField(findFieldIndex('phone'), 'phone', 2);
    }
    if (findFieldIndex('expire') > -1) {
      updateField(findFieldIndex('expire'), 'expire', 11);
    }

    const updateValueInFormIndex = (fieldWatch: any, dataKey: string, valueSelect: number) => {
      const dateIndex = paramWatch.findIndex((pr) => `<${pr.name}>` === fieldWatch?.[dataKey]);
      if (dateIndex > -1 && paramWatch[dateIndex]?.name) {
        updateField(dateIndex, paramWatch[dateIndex].name, valueSelect);
      }
    };

    if (paymentWatch && selectedItemZNSTemplate?.type?.value === EZNSValueType.PAYMENT) {
      updateValueInFormIndex(paymentWatch, 'amount', 14);
      updateValueInFormIndex(paymentWatch, 'note', 15);
    }

    if (voucherWatch && selectedItemZNSTemplate?.type?.value === EZNSValueType.VOUCHER) {
      const updateDateField = (
        prefix: keyof typeof voucherWatch,
        dateKey: keyof typeof voucherWatch,
      ) => {
        if (voucherWatch?.[prefix] === 'string') {
          updateValueInFormIndex(voucherWatch, dateKey, 11);
        }
      };

      updateDateField('start_date_prefix', 'start_date');
      updateDateField('end_date_prefix', 'end_date');

      const findCodeIndex = paramWatch.findIndex((pr) =>
        `<${pr.name}>`.includes(voucherWatch?.voucher_code),
      );
      if (findCodeIndex > -1 && paramWatch[findCodeIndex]?.name) {
        updateField(findCodeIndex, paramWatch[findCodeIndex].name, 4);
      }
    }
  }, [paramWatch, form]);

  return (
    <Form.Item
      label={
        <div>
          {t('ZNS_TEMPLATE.STEP_2.DES')}{' '}
          <a
            target='_blank'
            href='https://zalo.cloud/blog/cac-dinh-dang-du-lieu-khi-truyen-vao-tham-so-tren-noi-dung-zns/hd5soyjh3gv18ophwzdn49ty'
          >
            {t('ZALO_OA.HERE')}
          </a>
        </div>
      }
      required
    >
      {/* tạo các copmponent chọn zns */}
      <Form.Item
        className='!mb-0'
        label={
          <div className='flex gap-2'>
            <h4 className='font-medium text-lg mb-0'>{t('ZNS_TEMPLATE.STEP_2.PARAM')}</h4>
            <Popover
              title={t('ZNS_TEMPLATE.STEP_2.PARAM')}
              content={<Typography.Text>{t('ZNS_TEMPLATE.STEP_2.PARAM_DES')}</Typography.Text>}
              overlayStyle={{
                maxWidth: 250,
              }}
            >
              <InfoCircleOutlined className='!text-primary' />
            </Popover>
          </div>
        }
      >
        <Form.List name='params'>
          {(fields) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Flex key={key} className='gap-2'>
                  <Form.Item
                    {...restField}
                    name={[name, 'name']}
                    rules={[{ required: step === 2 }]}
                    className='!w-[70%]'
                    label={name === 0 ? t('ZNS_TEMPLATE.STEP_2.NAME') : ''}
                  >
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={
                      name === 0 ? (
                        <div>
                          {t('TENANT.CAMPAIGN.SETUP_LIST_ROW_3')}{' '}
                          <Popover
                            content={
                              <div>
                                <span>{t('ZNS_TEMPLATE.STEP_2.TECHNIAL_DES')}</span>
                                <br />
                                <div>
                                  VD:&nbsp;<strong>{t('UID.customerName')} (30)</strong>
                                  <br />
                                  <ul className='mb-0'>
                                    <li>
                                      <span className='font-medium'>{t('UID.customerName')}</span>:{' '}
                                      {t('ZNS_TEMPLATE.STEP_2.TECHNIAL_DES_1')}
                                    </li>
                                    <li>
                                      <span className='font-medium'>(30)</span>:{' '}
                                      {t('ZNS_TEMPLATE.STEP_2.TECHNIAL_DES_2')}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            }
                          >
                            <InfoCircleOutlined className='!text-primary' />
                          </Popover>
                        </div>
                      ) : (
                        ''
                      )
                    }
                    name={[name, 'type']}
                    initialValue={1}
                    className='w-full'
                  >
                    <Select
                      options={(commonZNSTemplate?.params || [])?.map((item) => ({
                        value: item.type,
                        label: item.name,
                        disabled: !!item?.type && [12, 13, 14, 15].includes(item.type),
                      }))}
                      disabled={paramWatch?.[name]?.disabled}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    label={
                      name === 0 ? (
                        <div>
                          {t('ZNS_TEMPLATE.STEP_2.CONTENT')}{' '}
                          <Popover content={t('ZNS_TEMPLATE.STEP_2.CONTENT_DES')}>
                            <InfoCircleOutlined className='!text-primary' />
                          </Popover>
                        </div>
                      ) : (
                        ''
                      )
                    }
                    name={[name, 'sample_value']}
                    rules={[
                      {
                        required: step === 2,
                        message: t('GENERAL.PLEASE_INPUT', { field: t('ZNS_TEMPLATE.DES_') }),
                      },
                    ]}
                    className='w-full'
                  >
                    <Input
                      placeholder={getPlaceholder?.[key]?.sample}
                      showCount
                      maxLength={getPlaceholder?.[key]?.length}
                    />
                  </Form.Item>
                  <Form.Item label={name === 0 ? <div className='opacity-0'>Tag</div> : ''}>
                    <RenderTagFormTable index={name} disabled={getPlaceholder?.[key]?.type !== 6} />
                  </Form.Item>
                  <Form.Item name='row_type' hidden noStyle>
                    <Input />
                  </Form.Item>
                  <Form.Item name='disabled' hidden noStyle valuePropName='checked'>
                    <Checkbox />
                  </Form.Item>
                </Flex>
              ))}
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item
        name='note'
        className='!w-full'
        label={<h4 className='font-medium text-lg mb-0'>{t('GENERAL.NOTE')}</h4>}
        rules={[
          {
            required: step === 2,
            message: t('GENERAL.PLEASE_INPUT', { field: t('GENERAL.NOTE') }),
          },
        ]}
      >
        <TextArea
          rows={3}
          placeholder={t('TEMPLATE.DETAIL_DESCRIPTION')}
          className='w-full'
          showCount
          maxLength={400}
          minLength={1}
        />
      </Form.Item>
    </Form.Item>
  );
};
export default RenderStepTwo;
