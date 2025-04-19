import { EEventType } from '@/common/enums';
import { ActionTable, ModalDeleteRecord } from '@/components/molecules';
import { I__Name__ } from '@/interfaces/mini-app/__lowerName__.interfaces';
import { ROUTES_FE } from '@/routers';
import { use__Name__Store } from '@/stores/@miniApp/use__Name__Store.store';
import StringUtils from '@/utils/StringUtils';
import { DeleteOutlined, EditFilled, EyeOutlined } from '@ant-design/icons';
import { Table, TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { config__Name__Information } from '.';

const __Name__Table: React.FC = () => {
  const {
    __lowerName__List,
    openModal,
    setCurrent__Name__,
    setOpenModal: onOpenModal,
  } = use__Name__Store();

  const t = useTranslations();
  const router = useRouter();
  const param = useParams();
  const miniAppId = param?.id;

  const items = (record: I__Name__) => [
    {
      label: t('TENANT.DETAIL'),
      key: '2',
      icon: <EyeOutlined className='!text-primary' />,
      onClick: () => {
        onOpenModal(undefined);
        if (record?.id)
          router.push(
            StringUtils.generatePath(
              `${ROUTES_FE.TENANT.MINI_APP.__lowerName__}/:__lowerName__Id`,
              {
                id: miniAppId as string,
                __lowerName__Id: record?.id,
              },
            ),
          );
      },
    },
    {
      label: t('GENERAL.UPDATE'),
      key: '3',
      icon: <EditFilled className='!text-blue' />,
      onClick: () => {
        onOpenModal(EEventType.UPDATE);
      },
    },
    {
      label: t('GENERAL.DELETE'),
      key: '1',
      icon: <DeleteOutlined className='!text-red-500' />,
      onClick: () => onOpenModal(EEventType.DELETE),
    },
  ];

  const columns: TableColumnsType<I__Name__> = [
    ...config__Name__Information(t),
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_value, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ActionTable items={items(record)} onClick={() => setCurrent__Name__(record)} />
        </div>
      ),
      width: 60,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={__lowerName__List}
        rowKey='id'
        rowClassName='cursor-pointer'
        onRow={(record) => ({
          onClick: () => {
            setCurrent__Name__(record);
            onOpenModal(undefined);
            if (record?.id)
              router.push(
                StringUtils.generatePath(
                  `${ROUTES_FE.TENANT.MINI_APP.AFFILIATE_CAMPAIGN}/:__lowerName__Id`,
                  {
                    id: miniAppId as string,
                    __lowerName__Id: record.id,
                  },
                ),
              );
          },
        })}
      />
      {openModal === EEventType.DELETE && (
        <ModalDeleteRecord
          handleDelete={onOpenModal}
          onOpenModal={onOpenModal}
          openModal={openModal}
        />
      )}
    </>
  );
};

export default __Name__Table;
