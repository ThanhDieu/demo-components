'use client';

import { DATE_TIME_FORMAT_HAS_SECOND } from '@/common/constants';
import { EEventType } from '@/common/enums';
import { AvatarComponent } from '@/components/atoms';
import { CardTitle } from '@/components/molecules';
import { Pagination } from '@/hooks/usePagination';
import { IComment } from '@/interfaces/task.interfaces';
import { Button, Card, Flex, List, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { LuDot } from 'react-icons/lu';
import { useTicketContextStore } from './context';
import RenderEditor from './RenderEditor';

const TicketComment = () => {
  const t = useTranslations();
  const { data: session } = useSession();
  const {
    selectedDetail,
    ticketPage: commentPage,
    openModal,
    onOpenModal,
    onActionTicketComment,
    isActionLoading,
  } = useTicketContextStore();
  const { apiData: commentList } = commentPage as any as Pagination<IComment>;
  const currentUser = useMemo(() => session?.user, [session?.user]);
  const [currentComment, setCurrentComment] = useState<IComment>();
  const [comment, setComment] = useState<string>();

  const handleCancel = () => {
    setComment(undefined);
    setCurrentComment(undefined);
  };
  const handleSendComment = async () => {
    if (comment && selectedDetail?.id) {
      await onActionTicketComment?.(currentComment?.id, {
        content: comment || '',
        ticketId: currentComment?.id ? undefined : selectedDetail.id,
      });
      handleCancel();
    }
  };

  return (
    <Card title={<CardTitle titleName={'Comment'} icon={<FaRegCommentDots size={20} />} />}>
      <div className='flex gap-4'>
        <AvatarComponent
          name={currentUser?.displayName}
          avatar={currentUser?.avatar || ''}
          className='!rounded-full'
          isFull
        />
        <div className='w-[calc(100%_-_34px)]'>
          {openModal === EEventType.SEND ? (
            <>
              <RenderEditor
                isLoading={isActionLoading}
                onCancel={handleCancel}
                onChangeContent={(value) => setComment(value)}
                content={comment}
                onSubmit={handleSendComment}
              />
            </>
          ) : (
            <Card
              size='small'
              className='!bg-gray-100 cursor-pointer'
              onClick={() => onOpenModal(EEventType.SEND)}
            >
              <p className='mb-0'>Add a comment...</p>
            </Card>
          )}
        </div>
      </div>
      {(commentList || [])?.length > 0 && (
        <List
          className='!mt-4 max-h-96 custom-scrollbar overflow-auto overfloe-x-hidden !pr-4'
          itemLayout='vertical'
          dataSource={commentList}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                className='!mb-0'
                avatar={
                  <AvatarComponent
                    name={item?.user?.displayName}
                    avatar={item?.user?.userProfile?.avatar || ''}
                    className='!rounded-full'
                    isFull
                  />
                }
                title={
                  <Flex justify='space-between' align='center'>
                    <span className='text-[14px]'>{item?.user?.displayName || ''}</span>
                    <p className='font-light text-xs pl-2 mb-0'>
                      {dayjs(item?.updatedAt).format(DATE_TIME_FORMAT_HAS_SECOND)}
                    </p>
                  </Flex>
                }
                description={
                  <div>
                    {currentComment?.id === item.id ? (
                      <RenderEditor
                        isLoading={isActionLoading}
                        onCancel={() => {
                          setComment(undefined);
                          setCurrentComment(undefined);
                        }}
                        onChangeContent={(value) => setComment(value)}
                        content={comment}
                        onSubmit={handleSendComment}
                      />
                    ) : (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: item?.content || '' }} />
                        <Flex className='gap-1' align='center' justify='end'>
                          <Button
                            type='text'
                            key='1'
                            size='small'
                            onClick={() => {
                              setCurrentComment(item);
                              setComment(item?.content);
                            }}
                          >
                            <span className='text-xs'>Edit</span>
                          </Button>
                          <LuDot />
                          <Popconfirm
                            title='Delete this comment'
                            description="Once you delete, it's gone for good."
                            onConfirm={() =>
                              onActionTicketComment?.(item?.id, { content: '' }, EEventType.DELETE)
                            }
                          >
                            <Button type='text' key='2' size='small'>
                              <span className='text-xs'>Delete</span>
                            </Button>
                          </Popconfirm>
                        </Flex>
                      </>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default TicketComment;
