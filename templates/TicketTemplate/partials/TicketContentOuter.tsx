'use client';

import { DEFAULT_FILE } from '@/common/constants';
import { EEventType } from '@/common/enums';
import { CardTitle } from '@/components/molecules';
import { ITicket } from '@/interfaces/task.interfaces';
import { ROUTES_FE } from '@/routers';
import StringUtils from '@/utils/StringUtils';
import { EditOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Typography, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { ReactNode, useState } from 'react';
import { VscPreview } from 'react-icons/vsc';
import { RenderEditor, TicketComment } from '.';
import { useTicketContextStore } from './context';

type Props = {
  children: ReactNode;
};

const TicketContentOuter = ({ children }: Props) => {
  const { selectedDetail, onOpenModal, openModal } = useTicketContextStore();
  const t = useTranslations();
  const router = useRouter();
  return (
    <Card bordered={false}>
      <Row gutter={[16, 24]}>
        <Col span={14}>
          <Card
            title={
              <CardTitle
                titleName={StringUtils.capitalize(t('OACONTENT.CONTENT'))}
                icon={<VscPreview />}
              />
            }
            className='h-full '
            classNames={{
              header: '!bg-white',
            }}
            extra={
              <Button onClick={() => onOpenModal(EEventType.UPDATE)} icon={<EditOutlined />}>
                {t('GENERAL.EDIT')}
              </Button>
            }
          >
            <RenderContent ticketDetails={selectedDetail} openModal={openModal} />
            <div className='flex justify-end mt-3'>
              {!!selectedDetail?.conversationId && (
                <Button
                  type='primary'
                  ghost
                  onClick={() =>
                    selectedDetail?.conversation
                      ? router.push(
                          `${ROUTES_FE.TENANT.OA.CHAT}/?conversationId=${selectedDetail?.conversationId}&lastMessageId=${selectedDetail?.messageId}`,
                        )
                      : null
                  }
                >
                  {t('TENANT.DETAIL')}
                </Button>
              )}
            </div>
          </Card>
        </Col>
        <Col span={10}>{children}</Col>
        <Col span={14}>
          <TicketComment />
        </Col>
      </Row>
    </Card>
  );
};

const RenderContent = React.memo(
  ({ ticketDetails }: { ticketDetails?: ITicket; openModal?: EEventType }) => {
    const { selectedDetail, onOpenModal, openModal, isActionLoading, onActionTicket } =
      useTicketContextStore();
    const [content, setContent] = useState<string>();
    const t = useTranslations();

    const cleanContent = ticketDetails?.content
      ?.replace(/<br\s*\/?>/gi, '')
      ?.replace(/<p>\s*<\/p>/gi, '')
      ?.trim();
    const handleCancel = () => {
      setContent(undefined);
      onOpenModal(undefined);
    };
    const handleUpdateContent = async () => {
      if (content && selectedDetail?.id) {
        await onActionTicket?.(
          selectedDetail?.id,
          {
            content: content || '',
          } as any,
          EEventType.UPDATE,
        );
        handleCancel();
      }
    };

    return (
      <div className='flex flex-col gap-2'>
        {openModal === EEventType.EDIT ? (
          <RenderEditor
            isLoading={isActionLoading}
            onCancel={handleCancel}
            onChangeContent={(value) => setContent(value)}
            content={content}
            onSubmit={handleUpdateContent}
            defaultData={selectedDetail?.content}
          />
        ) : (
          <Card
            className='!bg-gray-100 cursor-pointer'
            onClick={() => onOpenModal(EEventType.EDIT)}
          >
            {cleanContent ? (
              <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
            ) : (
              <div>Add a content...</div>
            )}
          </Card>
        )}
        {ticketDetails?.attachments && ticketDetails?.attachments?.length > 0 && (
          <div>
            <Typography.Title level={5}>{t('TICKET.ATTACHMENT')}: </Typography.Title>
            <Upload
              listType='picture-card'
              fileList={ticketDetails.attachments.map((value, index) => ({
                uid: index.toString(),
                name: `image${index}.png`,
                status: 'done',
                url: value || DEFAULT_FILE,
              }))}
              disabled
            >
              {null}
            </Upload>
          </div>
        )}
      </div>
    );
  },
);

export default TicketContentOuter;
