'use client';
import { LayoutContent } from '@/components/organisms';
import { useBreadcrumb } from '@/components/organisms/partials/Breadcrumb/context';
import { ROUTES_FE } from '@/routers';
import StringUtils from '@/utils/StringUtils';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DetailContentLuckyDraw, useLuckyDrawGiftDetailHook } from './partials';

const LuckyDrawConfigurationDetailTemplate = ({
  detailId,
  miniAppId,
}: {
  detailId: string;
  miniAppId: string;
}) => {
  const t = useTranslations();
  const { detail: detailData, isLoading } = useLuckyDrawGiftDetailHook(detailId);
  const router = useRouter();
  //Breadcrumb
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    if (detailId) setTitle(t('TENANT.DETAIL'));

    return () => {
      setTitle();
    };
  }, [setTitle, detailId]);

  return (
    <LayoutContent
      title={detailData?.name}
      renderIfTrue={true}
      extra={
        <Button
          type='primary'
          icon={<EditOutlined />}
          onClick={() =>
            !!detailData?.id &&
            router.push(
              `${StringUtils.generatePath(ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG_UPDATE, {
                id: miniAppId,
                luckyDrawId: detailData?.id,
              })}`,
            )
          }
        >
          {t('GENERAL.EDIT')}
        </Button>
      }
      icon={
        <Button type='text' icon={<ArrowLeftOutlined />} onClick={() => router.back()}></Button>
      }
      isLoading={isLoading}
    >
      <DetailContentLuckyDraw detailData={detailData} isLoading={isLoading} />
    </LayoutContent>
  );
};

export default LuckyDrawConfigurationDetailTemplate;
