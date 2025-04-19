'use client';
import { LayoutContent } from '@/components/organisms';
import { ROUTES_FE } from '@/routers';
import StringUtils from '@/utils/StringUtils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { LuckyDrawTable, useLuckyDrawConfigListHook } from './partials';

const LuckyDrawConfigurationTemplate = ({ id: idMiniApp }: { id: string }) => {
  const t = useTranslations();
  const router = useRouter();
  const { list, isLoading, isFetching, refetch } = useLuckyDrawConfigListHook();

  return (
    <LayoutContent
      title='Vòng quay'
      renderIfTrue={true}
      extra={
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() =>
            router.push(
              `${StringUtils.generatePath(ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG_CREATE, {
                id: idMiniApp,
              })}`,
            )
          }
        >
          {t('GENERAL.CREATE')}
        </Button>
      }
      isLoading={isLoading}
    >
      <Card>
        <LuckyDrawTable tableSource={list || []} isLoading={isFetching} refetch={refetch} />
      </Card>
    </LayoutContent>
  );
};

export default LuckyDrawConfigurationTemplate;
