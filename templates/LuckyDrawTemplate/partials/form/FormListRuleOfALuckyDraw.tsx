'use client';
import { EZMPLuckyDrawRuleType } from '@/enums/miniapp/mini-app.enums';
import { IActionGameForm, ILuckyDrawPiece } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { useZMPLuckyDrawStore } from '@/stores/@miniApp/useZMPLuckyDrawStore';
import { CloseOutlined, InfoCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Col,
  ColorPicker,
  Form,
  FormInstance,
  FormListFieldData,
  Input,
  InputNumber,
  Row,
  Select,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { Color } from 'antd/es/color-picker';
import { useTranslations } from 'next-intl';
import { handleShowGiftListByNumber, RenderFormCardSpecial } from '.';
import { useLuckyDrawGiftListHook } from '..';

type Props = {
  form: FormInstance<IActionGameForm>;
};

const FormListRuleOfALuckyDraw = ({ form }: Props) => {
  const { currentZMPLuckyDraw } = useZMPLuckyDrawStore();
  const pieceCountWatch = Form.useWatch('pieceCount', form);
  const { list: giftOptions, isLoading } = useLuckyDrawGiftListHook();

  return (
    <Form.Item label='Cấu hình vòng quay' className='!mb-0' required>
      <Form.List name='gameRules' initialValue={currentZMPLuckyDraw?.gameRules || [{}]}>
        {(fields, { add, remove }) => (
          <Row gutter={[16, 16]}>
            {fields.map((field) => (
              <Col span={12} key={field.key}>
                <Card
                  size='small'
                  title={
                    <Tag color={field?.name > 0 ? 'purple' : 'blue'}>
                      {field?.name > 0
                        ? EZMPLuckyDrawRuleType.SPECIAL
                        : EZMPLuckyDrawRuleType.DEFAULT}
                    </Tag>
                  }
                  extra={
                    field?.name > 0 && (
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    )
                  }
                  className='h-full'
                >
                  <Row gutter={[12, 12]} className='mb-3'>
                    <Col span={field.name > 0 ? 16 : 24}>
                      <Form.Item
                        name={[field.name, 'name']}
                        label='Tiêu đề'
                        rules={[{ required: true, message: 'Vui lòng nhập' }]}
                        className='!mb-1'
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    {field.name > 0 && (
                      <Col span={8}>
                        <Form.Item
                          name={[field.name, 'priority']}
                          label='Độ ưu tiên'
                          rules={[{ required: true, message: 'Vui lòng nhập' }]}
                          className='!mb-1 '
                          initialValue={1}
                        >
                          <InputNumber className='!w-full' />
                        </Form.Item>
                      </Col>
                    )}
                  </Row>
                  {field?.name === 0 && (
                    <Form.Item>
                      <Typography.Text strong>
                        Áp dụng cho toàn bộ chương trình, trừ các trường hợp đặc biệt
                      </Typography.Text>
                    </Form.Item>
                  )}
                  <RenderFormItemApplicable
                    field={field}
                    isLoading={isLoading}
                    form={form}
                    giftOptions={giftOptions}
                  />
                </Card>
              </Col>
            ))}

            <Col span={12}>
              <Button
                type='dashed'
                onClick={() =>
                  add({
                    zmaGameRuleGift: handleShowGiftListByNumber(pieceCountWatch),
                    type: EZMPLuckyDrawRuleType.SPECIAL,
                    isDefault: false,
                  })
                }
                block
              >
                + Thêm quy tắc
              </Button>
            </Col>
          </Row>
        )}
      </Form.List>
    </Form.Item>
  );
};

const RenderFormItemApplicable = ({
  field,
  giftOptions,
  form,
  isLoading,
}: {
  field: FormListFieldData;
  giftOptions: any[];
  form: FormInstance<IActionGameForm>;
  isLoading: boolean;
}) => {
  const t = useTranslations();
  const gameRulesWatch = Form.useWatch('gameRules', form);
  const pieces = gameRulesWatch?.[field.name]?.zmaGameRuleGift || [];
  const totalProportion = pieces?.reduce(
    (sum: number, item: ILuckyDrawPiece) => sum + (item?.rate || 0),
    0,
  );
  const validateGiftOption = (_rule: any, value: any) => {
    const isValid = giftOptions.some((opt) => opt.value === value?.value);
    if (isValid || !value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Sản phẩm không còn tồn tại'));
  };

  return (
    <>
      <Form.Item
        initialValue={
          field.name === 0 ? EZMPLuckyDrawRuleType.DEFAULT : EZMPLuckyDrawRuleType.SPECIAL
        }
        className='!mb-0'
        name={[field.name, 'isDefault']}
        noStyle
        hidden
        valuePropName='checked'
      >
        <Checkbox />
      </Form.Item>
      {field?.name > 0 && (
        <RenderFormCardSpecial type={EZMPLuckyDrawRuleType.APPLICABLE} form={form} field={field} />
      )}

      <Form.Item label='Danh sách quà tặng' help='Tổng tỷ lệ của quà tặng phải là: 100%'>
        <Row gutter={[6, 6]} className='mb-3'>
          <Col span={10}>
            <span className='text-error pr-1'>*</span>Quà tặng
          </Col>
          <Col span={6}>
            Tỷ lệ (<strong>{totalProportion.toFixed(2)}</strong>%)
          </Col>
          <Col span={5}>
            Số lượng{' '}
            <Tooltip title='Số lượng phát khi 1 lần trúng'>
              <InfoCircleOutlined className='!text-primary' />
            </Tooltip>
          </Col>
          <Col span={3}>Màu</Col>
        </Row>
        <Form.List name={[field.name, 'zmaGameRuleGift']}>
          {(subFields) => (
            <div>
              {subFields.map((subField) => (
                <Card key={subField.key} className='!mb-2 !bg-gray-100' size='small'>
                  <Row gutter={[6, 6]}>
                    <Col span={10}>
                      <Form.Item
                        name={[subField.name, 'giftId']}
                        rules={[
                          { required: true, message: 'Vui lòng chọn' },
                          {
                            validator: validateGiftOption,
                          },
                        ]}
                        className='!mb-0'
                      >
                        <Select
                          options={giftOptions}
                          showSearch
                          optionFilterProp='label'
                          loading={isLoading}
                          disabled={isLoading}
                          placeholder='Chọn quà'
                          labelInValue
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        className='!mb-0'
                        name={[subField.name, 'rate']}
                        rules={[
                          {
                            validator: async (_) => {
                              if (totalProportion !== 100) {
                                return Promise.reject();
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder='0'
                          suffix='%'
                          min={0}
                          max={100}
                          onChange={() => form.validateFields()}
                          className='!w-full'
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item
                        className='!mb-0 w-full'
                        name={[subField.name, 'amountGift']}
                        initialValue={1}
                        rules={[
                          {
                            required: true,
                            message: '',
                          },
                        ]}
                      >
                        <InputNumber className='!w-full' placeholder='1' min={1} max={100} />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        getValueFromEvent={(color: Color) => color.toHexString()}
                        className='!mb-0'
                        name={[subField.name, 'color']}
                      >
                        <ColorPicker format='hex' />
                      </Form.Item>
                    </Col>
                  </Row>
                  {/* <Collapse
                    className='!mb-0 !p-0'
                    size='small'
                    expandIconPosition='end'
                    ghost
                    items={[
                      {
                        key: subField.key,
                        label: <span className='text-primary'>Mở rộng</span>,
                        children: (
                          <>
                            <Row gutter={[6, 6]}>
                              <Col span={8}>
                                <Form.Item
                                  label='Quà tối đa'
                                  name={[subField.name, 'maxGift']}
                                  className='!mb-0 w-full'
                                >
                                  <InputNumber placeholder='0' min={0} className='!w-full' />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  label='Loại'
                                  name={[subField.name, 'type']}
                                  className='!mb-0 w-full'
                                  initialValue={ZMALevelType.BRANCH}
                                >
                                  <Select
                                    options={[ZMALevelType.BRANCH, ZMALevelType.MINIAPP].map(
                                      (item) => ({
                                        value: item,
                                        label: t(('TENANT.MINIAPP.RULE.' + item) as any),
                                      }),
                                    )}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  label='Thời gian'
                                  name={[subField.name, 'graduality']}
                                  className='!mb-0 w-full'
                                  initialValue={ZMAGradualityType.WEEKLY}
                                >
                                  <Select
                                    options={[
                                      ZMAGradualityType.DAILY,
                                      ZMAGradualityType.WEEKLY,
                                    ].map((item) => ({
                                      value: item,
                                      label: t(('TENANT.MINIAPP.RULE.' + item) as any),
                                    }))}
                                  />
                                </Form.Item>
                              </Col>
                              <Col span={24}>
                                <Typography.Text>VD: Trúng 1 phần quà/store/tuần</Typography.Text>
                              </Col>
                            </Row>
                          </>
                        ),
                        className: '-mx-3',
                      },
                    ]}
                  /> */}
                </Card>
              ))}
            </div>
          )}
        </Form.List>
      </Form.Item>
    </>
  );
};

export default FormListRuleOfALuckyDraw;
