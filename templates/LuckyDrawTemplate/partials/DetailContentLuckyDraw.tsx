'use client';
import { DATE_FORMAT } from '@/common/constants';
import { PopoverShowMore } from '@/components/atoms';
import { CardTitle } from '@/components/molecules';
import { EZMPFullWeekDays } from '@/enums/miniapp/mini-app.enums';
import { ILuckyDraw } from '@/interfaces/mini-app/luckyDraw.interfaces';
import NumberUtils from '@/utils/NumberUtils';
import { Card, Col, Flex, Popover, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { LuFerrisWheel } from 'react-icons/lu';
import { LuckyDrawCard } from '.';
import { cofigInformation } from './form';

const DetailContentLuckyDraw = ({
  detailData,
  isLoading,
}: {
  detailData?: ILuckyDraw;
  isLoading?: boolean;
}) => {
  const t = useTranslations();
  const inforItems = cofigInformation(t).map((item: any) => ({
    key: item.dataIndex,
    label: item.title,
    content: item?.render
      ? item?.render((detailData as any)?.[item.dataIndex], detailData)
      : (detailData as any)?.[item.dataIndex],
  }));
  const isDefault = inforItems?.find((item) => item.key === 'isDefault');
  const showList = ['id', 'name', 'status', 'pieceCount', 'startTime', 'createdAt']
    .map((el) => {
      const findex = inforItems.findIndex((item) => item.key === el);
      if (findex > -1) {
        return inforItems[findex];
      }
      return;
    })
    .filter(Boolean);
  return (
    <Card
      title={<CardTitle icon={<LuFerrisWheel size={20} />} titleName='Thông tin vòng quay' />}
      extra={
        <Flex align='center' className='gap-2 font-medium'>
          {isDefault?.label} : {isDefault?.content}
        </Flex>
      }
      loading={isLoading}
    >
      <Row gutter={24} className='mb-3'>
        {showList.map((item, index) => (
          <Col span={12} key={index}>
            <Row gutter={24} className='mb-3'>
              <Col span={6} className='font-medium'>
                {item?.label}
              </Col>
              <Col span={18}>{item?.content}</Col>
            </Row>
          </Col>
        ))}
        <Col span={12}>
          <Row gutter={24} className='mb-3'>
            <Col span={6} className='font-medium'>
              Ngoại trừ
            </Col>
            <Col span={18}>
              <PopoverShowMore
                items={(detailData?.specialDates || [])?.map((item, index) => ({
                  id: String(index),
                  name:
                    item?.day || item?.day === 0
                      ? EZMPFullWeekDays[item.day]
                      : dayjs(item?.date).format(DATE_FORMAT),
                }))}
                max={3}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={24} className='mb-3'>
            <Col span={6} className='font-medium'>
              Thể lệ chương trình
            </Col>
            <Col span={18}>
              {!!detailData?.description && (
                <Popover
                  content={
                    <div className='flex flex-col gap-2 custom-scrollbar max-h-[400px] overflow-y-auto overflow-x-hidden'>
                      <div dangerouslySetInnerHTML={{ __html: detailData?.description || '' }} />
                    </div>
                  }
                  overlayClassName='!max-w-[300px] !min-w-[200px]'
                >
                  <span className='text-primary cursor-pointer'>Thông tin chi tiết</span>
                </Popover>
              )}
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row gutter={24} className='mb-3'>
            <Col span={6} className='font-medium'>
              Quy định tính lượt
            </Col>
            <Col span={18}>
              <Popover
                content={
                  <div className='flex flex-col gap-2 custom-scrollbar max-h-[400px] overflow-y-auto overflow-x-hidden'>
                    {detailData?.zmaGameGeneralRule?.config?.map((item, index) => (
                      <Flex className='gap-4' key={index}>
                        <span className='inline-flex gap-2'>
                          Price:{' '}
                          <strong>{NumberUtils.numberToCurrency(item?.from || 0)} VND</strong>
                        </span>
                        {!!item?.to && (
                          <span className='inline-flex gap-2'>
                            - <strong>{NumberUtils.numberToCurrency(item?.to || 0)} VND</strong>
                          </span>
                        )}
                        <span className='inline-flex gap-2'>
                          Play: <strong>{NumberUtils.numberToCurrency(item?.play || 0)}</strong>
                        </span>
                      </Flex>
                    ))}
                  </div>
                }
                overlayClassName='!max-w-[500px] !min-w-[200px]'
                title={detailData?.zmaGameGeneralRuleId ? detailData?.zmaGameGeneralRule?.name : ''}
              >
                <span className='text-primary cursor-pointer'>
                  {detailData?.zmaGameGeneralRuleId ? detailData?.zmaGameGeneralRule?.name : ''}
                </span>
              </Popover>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className='mt-3'>
        <Typography.Title level={5}>Danh sách cấu hình vòng quay:</Typography.Title>
        <LuckyDrawCard luckyDrawData={detailData} />
      </div>
    </Card>
  );
};

export default DetailContentLuckyDraw;
