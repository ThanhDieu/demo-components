'use client';

import { EEventType } from '@/common/enums';
import { ActionTable, ModalDeleteRecord } from '@/components/molecules';
import { ILuckyDraw } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { ROUTES_FE } from '@/routers';
import { useZMPLuckyDrawStore } from '@/stores/@miniApp/useZMPLuckyDrawStore';
import StringUtils from '@/utils/StringUtils';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Table, TableColumnsType } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { cofigInformation, useActionLuckyDrawConfigHook } from '.';
type Props = {
  isLoading: boolean;
  tableSource: ILuckyDraw[];
  refetch?: any;
};
const LuckyDrawTable: React.FC<Props> = ({ isLoading, tableSource, refetch }) => {
  const {
    openModal,
    setCurrentZMPLuckyDraw,
    setOpenModal: onOpenModal,
    currentZMPLuckyDraw,
  } = useZMPLuckyDrawStore();

  const param = useParams();
  const idMiniApp = param?.id as string;
  const t = useTranslations();
  const router = useRouter();
  const { onFinish } = useActionLuckyDrawConfigHook(undefined, currentZMPLuckyDraw?.id);

  const items = [
    {
      label: t('TENANT.DETAIL'),
      key: '2',
      icon: <EyeOutlined className='!text-primary' />,
      onClick: () => {
        currentZMPLuckyDraw?.id &&
          idMiniApp &&
          router.push(
            `${StringUtils.generatePath(ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG_DETAIL, {
              id: idMiniApp,
              luckyDrawId: currentZMPLuckyDraw?.id,
            })}`,
          );
      },
    },
    {
      label: t('GENERAL.EDIT'),
      key: '3',
      icon: <EditOutlined className='!text-blue' />,
      onClick: () => {
        currentZMPLuckyDraw?.id &&
          idMiniApp &&
          router.push(
            `${StringUtils.generatePath(ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG_UPDATE, {
              id: idMiniApp,
              luckyDrawId: currentZMPLuckyDraw?.id,
            })}`,
          );
      },
    },
    {
      label: t('GENERAL.DELETE'),
      key: '1',
      icon: <DeleteOutlined className='!text-red-500' />,
      onClick: () => {
        onOpenModal(EEventType.DELETE);
      },
    },
  ];

  const columns: TableColumnsType<ILuckyDraw> = [
    ...cofigInformation(t),
    {
      title: '',
      key: 'action',
      align: 'right',
      render: (_value, record) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <ActionTable items={items} onClick={() => setCurrentZMPLuckyDraw(record)} />
          </div>
        );
      },
      width: 60,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tableSource}
        rowKey='id'
        rowClassName='cursor-pointer'
        onRow={(record) => {
          return {
            onClick: () => {
              setCurrentZMPLuckyDraw(record);
              record?.id &&
                idMiniApp &&
                router.push(
                  `${StringUtils.formatIdRouter(
                    ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG,
                    idMiniApp,
                  )}/${record?.id}`,
                );
            },
          };
        }}
        loading={isLoading}
      />
      {openModal === EEventType.DELETE && (
        <ModalDeleteRecord
          handleDelete={async () => {
            await onFinish();
            refetch();
            onOpenModal(undefined);
          }}
          onOpenModal={onOpenModal}
          openModal={openModal}
        />
      )}
      {/* {openModal === EEventType.EDIT && (
        <ModalConfirm
          open={openModal === EEventType.EDIT}
          title='Bạn có chắc muốn đặt vòng quay này thành mặc định'
        />
      )} */}
    </>
  );
};

export default LuckyDrawTable;
