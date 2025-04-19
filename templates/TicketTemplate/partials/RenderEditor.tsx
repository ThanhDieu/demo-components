'use client';
import { RichTextTyniMCEditor } from '@/components/atoms';
import { useZaloOaStore } from '@/stores/useZaloOA.store';
import { Button, Flex } from 'antd';
import { useTranslations } from 'next-intl';

interface Props {
  isLoading?: boolean;
  onChangeContent: (value?: string) => void;
  content?: string;
  onSubmit: () => void;
  onCancel: () => void;
  defaultData?: string;
}
const RenderEditor: React.FC<Props> = ({
  isLoading,
  onChangeContent,
  content,
  onSubmit,
  onCancel,
  defaultData,
}) => {
  const { currentOa, zaloOas } = useZaloOaStore();
  const t = useTranslations();
  return (
    <>
      <RichTextTyniMCEditor
        value={content || defaultData || ''}
        onChange={(value) => {
          onChangeContent(value);
        }}
        height={200}
        isContent={true}
        zaloOAIds={currentOa?.id || (zaloOas || [])?.map((item) => item?.id)?.join(',') || ''}
      />
      <Flex className='gap-2 mt-3' justify='end'>
        <Button
          type='text'
          disabled={isLoading}
          onClick={() => {
            onCancel();
          }}
        >
          {t('GENERAL.CANCEL')}
        </Button>
        <Button disabled={isLoading} loading={isLoading} type='primary' onClick={() => onSubmit()}>
          {t('GENERAL.SAVE')}
        </Button>
      </Flex>
    </>
  );
};

export default RenderEditor;
