import { getCommonStatus } from '@/common/apiStatus';
import { DateTimeFormat } from '@/components/atoms';
import { I__Name__ } from '@/interfaces/mini-app/__lowerName__.interfaces';
import { TableColumnsType, Tag } from 'antd';

export const config__Name__Information = (t: any): TableColumnsType<I__Name__> => [
  {
    title: t('GENERAL.NAME'),
    dataIndex: 'name',
    ellipsis: true
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
    width: 180,
  },
];

export { default as __Name__Table } from './__Name__Table';
export { default as CreateUpdate__Name__Modal } from './CreateUpdate__Name__Modal';
