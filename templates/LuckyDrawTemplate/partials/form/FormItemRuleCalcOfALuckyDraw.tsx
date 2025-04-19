'use client';
import { EZMAGlobalRuleType } from '@/enums/miniapp/mini-app.enums';
import { IActionGameForm } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { IZMAGeneralRule } from '@/interfaces/mini-app/miniApp.interfaces';
import { Button, Form, FormInstance, Input, Modal, Select } from 'antd';
import Compact from 'antd/es/space/Compact';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { RuleConvertPriceCard, RuleRangePriceCard } from '../../../RuleTemplate/partials';

type Props = {
  form: FormInstance<IActionGameForm>;
  defaultData?: IZMAGeneralRule;
  label?: string;
};

const FormItemRuleCalcOfALuckyDraw = ({ form, defaultData, label }: Props) => {
  const t = useTranslations();
  const ruleSpinCountWatch = Form.useWatch('zmaGameGeneralRuleType', form);
  const zmaGameGeneralRuleIdWatch = Form.useWatch('zmaGameGeneralRuleId', form);
  const [temp, setTemp] = useState<IZMAGeneralRule>();
  const [openEditor, setOpenEditor] = useState<boolean>();

  const handleChange = (value: IZMAGeneralRule) => {
    setTemp(value);
    form.setFieldValue('zmaGameGeneralRuleId', value?.id);
    setOpenEditor(false);
  };

  useEffect(() => {
    if (defaultData && form) {
      setTemp(defaultData);
    }
  }, [defaultData, form]);

  useEffect(() => {
    if (temp && form) {
      form.setFieldsValue({
        zmaGameGeneralRuleType: temp?.type || temp?.description,
        zmaGameGeneralRuleId: temp?.id,
      });
    }
  }, [temp]);
  return (
    <div className='w-full flex gap-4'>
      <Form.Item
        label={label || 'Cách tính lượt'}
        required
        extra={
          !!ruleSpinCountWatch && (
            <Button type='link' size='small' onClick={() => setOpenEditor(true)}>
              Xem chi tiết
            </Button>
          )
        }
      >
        <Compact>
          <Form.Item
            name='zmaGameGeneralRuleType'
            className='!mb-0'
            rules={[
              {
                required: true,
                message: 'Vui lòng chọn cách tính',
              },
            ]}
          >
            <Select
              options={[EZMAGlobalRuleType.RANGE_PRICE, EZMAGlobalRuleType.CONVERT_PRICE].map(
                (item) => {
                  return {
                    label: t(`TENANT.MINIAPP.RULE.${item}` as any),
                    value: item,
                  };
                },
              )}
              className='!w-52'
              onChange={() => {
                setOpenEditor(true);
              }}
              placeholder='Chọn cách tính'
            />
          </Form.Item>
          <Form.Item
            name='zmaGameGeneralRuleId'
            rules={[{ required: true, message: 'Vui lòng cài đặt cách tính' }]}
            className='!mb-0 mt-2 !w-full'
          >
            <Input
              addonBefore='Rule ID'
              readOnly
              onClick={() => setOpenEditor(true)}
              disabled={!ruleSpinCountWatch}
            />
          </Form.Item>
        </Compact>
      </Form.Item>

      {openEditor && (
        <Modal
          open={openEditor}
          cancelButtonProps={{
            className: '!hidden',
          }}
          footer={null}
          title='Bắt buộc nhập và lưu cách tích lượt'
          onCancel={() => setOpenEditor(false)}
          width={800}
          maskClosable={!!zmaGameGeneralRuleIdWatch}
        >
          {ruleSpinCountWatch === EZMAGlobalRuleType.CONVERT_PRICE ? (
            <RuleConvertPriceCard
              onFinish={handleChange}
              onCancel={zmaGameGeneralRuleIdWatch ? () => setOpenEditor(false) : undefined}
              ruleDetail={temp}
            />
          ) : (
            <RuleRangePriceCard
              onFinish={handleChange}
              onCancel={zmaGameGeneralRuleIdWatch ? () => setOpenEditor(false) : undefined}
              ruleDetail={temp}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default FormItemRuleCalcOfALuckyDraw;
