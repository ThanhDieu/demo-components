import { getCommonStatus } from '@/common/apiStatus';
import { COLORS } from '@/common/colors';
import { DateTimeFormat } from '@/components/atoms';
import { CopyText } from '@/components/molecules';
import { EZMPCommonStatus } from '@/enums/miniapp/mini-app.enums';
import { ILuckyDraw } from '@/interfaces/mini-app/luckyDraw.interfaces';
import StringUtils from '@/utils/StringUtils';
import { TableColumnsType, Tag } from 'antd';
import { FaCheckCircle, FaRegTimesCircle } from 'react-icons/fa';

export function splitPercentage(total: number, parts: number): number[] {
  const raw = +(total / parts).toFixed(2);
  const result = Array(parts).fill(raw);

  let currentTotal = +result.reduce((a, b) => a + b, 0).toFixed(2);
  let diff = +(total - currentTotal).toFixed(2);

  let i = 0;
  while (Math.abs(diff) >= 0.01) {
    const adjustment = diff > 0 ? 0.01 : -0.01;
    result[i] = +(result[i] + adjustment).toFixed(2);
    diff = +(diff - adjustment).toFixed(2);
    i = (i + 1) % parts;
  }

  return result;
}

export const handleShowGiftListByNumber = (pieceCount: number) => {
  return splitPercentage(100, pieceCount)?.map((item) => ({
    giftId: '',
    rate: item,
    color: COLORS.primary,
    amountGift: 1,
  }));
};

export const cofigInformation = (t: any): TableColumnsType<ILuckyDraw> => [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   key: 'id',
  //   render: (value) => (
  //     <div key={value}>
  //       {StringUtils.sliceApiKeys(value)}
  //       <CopyText value={value} />
  //     </div>
  //   ),
  //   width: 180,
  // },
  {
    title: t('GENERAL.NAME'),
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: 'Mặc định',
    dataIndex: 'isDefault',
    render: (value) =>
      value ? (
        <FaCheckCircle color={COLORS.success} size={20} />
      ) : (
        <FaRegTimesCircle color={COLORS.bgGray} size={20} />
      ),
    align: 'center',
  },
  {
    title: 'Thời gian áp dụng',
    dataIndex: 'startTime',
    key: 'startTime',
    render: (startTime, record) => {
      return (
        <div className='flex gap-2 items-center'>
          <DateTimeFormat data={startTime} /> -
          <DateTimeFormat data={record?.endTime} />
        </div>
      );
    },
  },
  {
    title: 'Số miếng',
    dataIndex: 'pieceCount',
    align: 'center',
  },
  {
    title: t('TENANT.STATUS'),
    dataIndex: 'status',
    key: 'status',
    render: (value) => {
      const status = getCommonStatus(value);
      return <Tag color={status.color}>{value}</Tag>;
    },
    width: 150,
  },
  {
    title: t('GENERAL.CREATED_AT'),
    key: 'createdAt',
    dataIndex: 'createdAt',
    render: (createdAt) => <DateTimeFormat data={createdAt} hasIcon />,
    width: 120,
  },
];

export const tempLuckyDrawData = {
  name: 'Vòng quay mùa hè sôi động',
  pieceCount: 6,
  status: EZMPCommonStatus.ACTIVE,
  startTime: '2025-05-06T08:00:00Z',
  endTime: '2025-06-27T23:59:59Z',
  isDefault: false,
  gameType: 'SPIN',
  description: `<div>Tặng 1 lần tham gia Vòng xoay cho hóa đơn từ 199.000 VND.</div>
            <ul>
              <li>Không giới hạn số lượt quay trong mỗi hóa đơn.</li>
              <li>Được áp dụng đồng thời với combo trong thực đơn.</li>
              <li>Không được áp dụng đồng thời ưu đãi/ voucher.</li>
              <li>Không áp dụng mua mang về và đặt qua app giao hàng.</li>
              <li>Không áp dụng các ngày <strong>Thứ 7, Chủ nhật</strong> và các ngày <strong>Lễ, Tết</strong>.</li>
              <li><strong>Thời gian áp dụng:</strong> 06/05/2025 đến 27/06/2025</li>
           </ul>`,
};

export { default as FormItemDesOfALuckyDraw } from './FormItemDesOfALuckyDraw';
export { default as FormItemExcludedDatesOfALuckyDraw } from './FormItemExcludedDatesOfALuckyDraw';
export { default as FormItemMultiTimeRangePicker } from './FormItemMultiTimeRangePicker';
export { default as FormItemRuleCalcOfALuckyDraw } from './FormItemRuleCalcOfALuckyDraw';
export { default as FormItemSpecicalDates } from './FormItemSpecicalDates';
export { default as FormListRuleOfALuckyDraw } from './FormListRuleOfALuckyDraw';
export { default as RenderFormCardSpecial } from './RenderFormCardSpecial';
