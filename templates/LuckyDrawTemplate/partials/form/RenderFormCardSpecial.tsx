'use client';
import { EZMPLuckyDrawRuleType } from '@/enums/miniapp/mini-app.enums';
import { IActionGameForm } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { Card, Form, FormInstance, FormListFieldData } from 'antd';
import { FormItemSpecicalDates } from '.';
import FormItemMultiTimeRangePicker from './FormItemMultiTimeRangePicker';

type Props = {
  field: FormListFieldData;
  type: EZMPLuckyDrawRuleType;
  form: FormInstance<IActionGameForm>;
};

const RenderFormCardSpecial = ({ field, type, form }: Props) => {
  const lowerType = type.toLowerCase();
  const rangeDateWatch = Form.useWatch('rangeDate', form);
  const itemWatch = Form.useWatch(['gameRules', field.name], form);
  const messageError = form.getFieldError(['gameRules', field.name, `${lowerType}Time`]);
  return (
    <Card size='small' title='Cấu hình thời gian đặc biệt' className='!bg-primary/20 !mb-3'>
      <Form.Item status='error' help={messageError?.[0]} className='!mb-0'>
        <FormItemMultiTimeRangePicker
          name={[field.name, `${lowerType}Time`]}
          onChange={(value) => {
            form.setFieldValue(
              ['gameRules', field.name, `${lowerType}Time`],
              value?.length > 0 ? JSON.stringify(value) : undefined,
            );
            form.validateFields();
          }}
          defaultData={
            itemWatch?.applicableTime && typeof itemWatch?.applicableTime === 'string'
              ? JSON.parse(itemWatch.applicableTime)
              : []
          }
        />
      </Form.Item>

      <FormItemSpecicalDates
        name={{
          dates: [field.name, `${lowerType}Dates`],
          days: [field.name, `${lowerType}Days`],
        }}
        range={rangeDateWatch}
        data={itemWatch}
      />
    </Card>
  );
};
export default RenderFormCardSpecial;
