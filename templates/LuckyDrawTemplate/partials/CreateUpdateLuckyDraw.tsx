'use client';
import { getCommonStatus } from '@/common/apiStatus';
import { COLORS } from '@/common/colors';
import { DATE_TIME_FORMAT } from '@/common/constants';
import { LoadingMini } from '@/components/atoms';
import { EZMPCommonStatus } from '@/enums/miniapp/mini-app.enums';
import {
  IActionGameForm,
  IGiftBranchInLuckyDraw,
  ILuckyDraw,
} from '@/interfaces/mini-app/luckyDraw.interfaces';
import { ROUTES_FE } from '@/routers';
import { useZMPLuckyDrawStore } from '@/stores/@miniApp/useZMPLuckyDrawStore';
import StringUtils from '@/utils/StringUtils';
import {
  Alert,
  Button,
  Col,
  DatePicker,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Switch,
  Tag,
  Tooltip,
} from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { IoIosInformationCircleOutline } from 'react-icons/io';
import {
  formatToRuleObject,
  FormItemDesOfALuckyDraw,
  FormItemExcludedDatesOfALuckyDraw,
  FormItemRuleCalcOfALuckyDraw,
  FormListRuleOfALuckyDraw,
  handleShowGiftListByNumber,
  useActionLuckyDrawConfigHook,
} from '.';
import Link from 'next/link';

type Props = {
  detailId?: string;
  miniAppId: string;
  form: FormInstance<IActionGameForm>;
  detailData?: ILuckyDraw;
};

const CreateUpdateLuckyDraw = ({ detailId, form, miniAppId, detailData }: Props) => {
  const t = useTranslations();
  const {
    onFinish,
    onChangeTotalPiece,
    warningText,
    setWarningText,
    isLoading,
    errorMessage,
    seErrorMessage,
  } = useActionLuckyDrawConfigHook(form, detailId);
  const { setCurrentZMPLuckyDraw } = useZMPLuckyDrawStore();
  const defaultWatch = Form.useWatch('isDefault', form);
  const router = useRouter();

  const handleInitData = () => {
    if (detailId) {
      form.setFieldsValue({
        ...detailData,
        rangeDate: [
          dayjs(detailData?.startTime, DATE_TIME_FORMAT),
          dayjs(detailData?.endTime, DATE_TIME_FORMAT),
        ],
        gameRules: detailData?.gameRules?.map((rule, index) => ({
          ...rule,
          ...(rule?.days?.length && index > 0 ? formatToRuleObject(rule?.days) : {}),
          zmaGameRuleGift: rule?.zmaGameRuleGift?.map((el) => ({
            ...el,
            giftId: {
              label: el?.gift?.name,
              value: el?.gift?.id,
            },
            amountGift: el?.amountGift || 1,
          })),
        })),
      });
    } else {
      form.resetFields();
      setCurrentZMPLuckyDraw(undefined);
      form.setFieldsValue({
        gameRules: [
          {
            zmaGameRuleGift: handleShowGiftListByNumber(6),
            isDefault: false,
            name: 'Default',
            priority: 0,
          },
        ],
      });
    }
  };

  useEffect(() => {
    if (!!form) handleInitData();
  }, [detailId, form, detailData]);

  const error = () => {
    Modal.error({
      title: 'Cập nhật vòng quay thất bại',
      content: (
        <div style={{ maxHeight: 300, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
          {Array.isArray(errorMessage) ? (
            <ul>
              {errorMessage.map((item: IGiftBranchInLuckyDraw, index) => (
                <li key={index}>
                  Sản phẩm <strong>{item.giftName}</strong> hiện không có trong:{' '}
                  <Link
                    href={StringUtils.generatePath(
                      `${ROUTES_FE.TENANT.MINI_APP.BRANCH}/:branchId`,
                      {
                        id: miniAppId,
                        branchId: item.branchId,
                      },
                    )}
                    target='_blank'
                  >
                    {item.branchName}
                  </Link>
                </li>
              ))}
              <li className='text-error'>Vui lòng thêm sản phẩm vào chi nhánh</li>
            </ul>
          ) : (
            errorMessage
          )}
        </div>
      ),
      width: 700,
      onOk: () => seErrorMessage(undefined),
    });
  };
  useEffect(() => {
    if (!!errorMessage) error();
  }, [errorMessage]);

  return (
    <LoadingMini spinning={isLoading}>
      <Form<IActionGameForm> layout='vertical' form={form} onFinish={onFinish} autoComplete='off'>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name='name'
              label={t('GENERAL.NAME')}
              rules={[
                {
                  required: true,
                  message: t('GENERAL.PLEASE_INPUT', { field: t('GENERAL.NAME') }),
                },
              ]}
            >
              <Input
                className='w-full'
                placeholder={t('GENERAL.ENTER_INPUT', { field: t('GENERAL.NAME') })}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label={t('TENANT.STATUS')}
              name='status'
              initialValue={EZMPCommonStatus.ACTIVE}
            >
              <Select
                disabled={!!defaultWatch}
                options={[EZMPCommonStatus.ACTIVE, EZMPCommonStatus.INACTIVE].map((item) => {
                  const status = getCommonStatus(item);
                  return {
                    label: item,
                    value: item,
                    color: status?.color,
                  };
                })}
                optionRender={(option) => {
                  return (
                    <Tag color={option?.data.color} className='capitalize'>
                      {option?.data?.label}
                    </Tag>
                  );
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name='isDefault'
              label={
                <span className='inline-flex gap-1 items-center'>
                  <span>Đặt làm mặc định</span>
                  <Tooltip title='Mỗi chương trình có duy nhất một vòng quay là mặc định'>
                    <IoIosInformationCircleOutline
                      className='cursor-pointer'
                      color={COLORS.primary}
                      size={16}
                    />
                  </Tooltip>
                </span>
              }
              valuePropName='checked'
              extra='Áp dụng cho tất cả cửa hàng'
            >
              <Switch
                onChange={() => form.setFieldValue('status', EZMPCommonStatus.ACTIVE)}
                disabled={!!detailId && detailData?.isDefault}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label='Thời gian bắt đầu - kết thúc'
              name='rangeDate'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Thời gian bắt đầu - kết thúc',
                },
              ]}
              extra="Chọn ngày và giờ, sau đó nhấn 'OK' để xác nhận"
              className='!w-full'
            >
              <DatePicker.RangePicker
                className='w-full'
                showTime={{ format: 'HHmm' }}
                format={DATE_TIME_FORMAT}
                disabledDate={(current: dayjs.Dayjs) => {
                  return current && current.isBefore(dayjs().startOf('day'));
                }}
                disabledTime={(date) => {
                  const now = dayjs();
                  if (date?.isSame(now, 'day')) {
                    return {
                      disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
                      disabledMinutes: (hour) =>
                        hour === now.hour()
                          ? Array.from({ length: now.minute() }, (_, i) => i)
                          : [],
                    };
                  }
                  return {};
                }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <FormItemExcludedDatesOfALuckyDraw form={form} defaultData={detailData?.specialDates} />
          </Col>
          <Col span={12}>
            <FormItemRuleCalcOfALuckyDraw
              form={form}
              defaultData={detailData?.zmaGameGeneralRule}
            />
          </Col>

          <Col span={6}>
            <Form.Item
              name='pieceCount'
              label={'Số miếng'}
              rules={[
                {
                  required: true,
                },
                {
                  max: 8,
                  min: 6,
                  type: 'number',
                },
              ]}
              initialValue={6}
            >
              <InputNumber
                className='!w-full'
                placeholder={t('GENERAL.ENTER_INPUT', { field: '' })}
                onChange={(value) => onChangeTotalPiece(value as number)}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <FormItemDesOfALuckyDraw defaultData={detailData?.description || ''} form={form} />
          </Col>
          <Col span={24}>
            {!!warningText && (
              <Alert
                message={warningText}
                type='warning'
                showIcon
                closable
                onClose={() => setWarningText(undefined)}
              />
            )}
            <FormListRuleOfALuckyDraw form={form} />
          </Col>
        </Row>
        <Form.Item className='w-full flex justify-end !mb-0'>
          <div className='gap-4 flex'>
            <Button
              onClick={() =>
                router.push(
                  detailId
                    ? `${StringUtils.formatIdRouter(
                        ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG,
                        miniAppId,
                      )}/${detailId}`
                    : `${StringUtils.formatIdRouter(
                        ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG,
                        miniAppId,
                      )}`,
                )
              }
            >
              {t('GENERAL.CANCEL')}
            </Button>
            <Button type='primary' htmlType='submit' disabled={isLoading}>
              {t('GENERAL.SAVE')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </LoadingMini>
  );
};

export default CreateUpdateLuckyDraw;
