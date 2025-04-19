'use client';

import { COLORS } from '@/common/colors';
import { PopoverShowMore } from '@/components/atoms';
import { EZMPFullWeekDays, EZMPLuckyDrawRuleType } from '@/enums/miniapp/mini-app.enums';
import { ILuckyDraw } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { Card, Col, Flex, List, Row, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { FaCalendarAlt, FaRegClock } from 'react-icons/fa';
import { ModalTestDraw } from '.';
const { Text, Title } = Typography;

type Props = { luckyDrawData?: ILuckyDraw };
const LuckyDrawCard = ({ luckyDrawData }: Props) => {
  const t = useTranslations();
  return (
    <Row gutter={[24, 24]}>
      {luckyDrawData?.gameRules?.map((rule, index) => (
        <Col xl={12} xxl={8} key={index}>
          <Card
            size='small'
            title={
              rule?.name
                ? `${rule?.name} ${rule?.priority ? `(${rule.priority})` : ''}`
                : `Rule ${index + 1}`
            }
            extra={
              <Tag color={rule.isDefault ? 'blue' : 'purple'}>
                {rule.isDefault ? EZMPLuckyDrawRuleType.DEFAULT : EZMPLuckyDrawRuleType.SPECIAL}
              </Tag>
            }
            actions={[<ModalTestDraw rule={rule} key={index} />]}
            className='!h-full'
          >
            {rule?.type === EZMPLuckyDrawRuleType.DEFAULT ? (
              <Typography.Text strong className='mb-3 block'>
                Áp dụng cho toàn bộ chương trình, trừ các trường hợp đặc biệt
              </Typography.Text>
            ) : (
              <Flex className='gap-1 flex-col mb-3' justify='space-between'>
                {rule.days && rule.days?.length > 0 && (
                  <PopoverShowMore
                    items={(rule.days || [])?.map((el, index) => ({
                      name: (
                        <Flex className='gap-2 mr-3'>
                          <Text className='flex gap-2 items-center'>
                            <FaCalendarAlt color={COLORS.primary} />
                            {el?.date || (el.day || el.day === 0 ? EZMPFullWeekDays[el.day] : '')}
                          </Text>
                          <span>-</span>
                          <Text className='flex gap-2 items-center'>
                            <FaRegClock color={COLORS.primary} /> {el.start} - {el.end}
                          </Text>
                        </Flex>
                      ),
                      id: index.toString(),
                    }))}
                    max={1}
                    isCustom={true}
                  />
                )}
              </Flex>
            )}
            <Title level={5}>Danh sách quà tặng</Title>
            <List
              dataSource={rule.zmaGameRuleGift}
              size='small'
              renderItem={(piece) => (
                <List.Item>
                  <div className='flex items-center gap-1' title={piece?.gift?.name}>
                    <span
                      className='w-4 h-4 inline-block rounded-full mr-2 border border-gray-300 border-solid'
                      style={{ background: piece.color }}
                    ></span>
                    <span>{piece.rate}% -</span>
                    <strong className='mr-1 line-clamp-1 max-w-52'>{piece?.gift?.name}</strong>
                    <span className='text-slate-400'>x{piece?.amountGift || 1}</span>
                  </div>
                  {/* {!!piece?.maxGift && (
                    <Tooltip
                      title={`Giải “${piece?.gift?.name}” tần suất trúng ${piece?.maxGift} giải/${t(
                        `TENANT.MINIAPP.RULE.${piece?.type}` as any,
                      )}/${t(`TENANT.MINIAPP.RULE.${piece?.graduality}` as any)}`}
                    >
                      <InfoCircleOutlined className='!text-primary text-xs cursor-pointer' />
                    </Tooltip>
                  )} */}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default LuckyDrawCard;
