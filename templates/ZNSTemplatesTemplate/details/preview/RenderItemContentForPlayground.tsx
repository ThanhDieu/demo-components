'use client';

import { ERadioItemZNSTypeTemplateCollapse } from '@/common/enums';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { RenderTableContentForPlayground } from '..';
import { formatTextWithBoldTags } from '../FormZNSComponent';

type Props = {
  type: ERadioItemZNSTypeTemplateCollapse;
  item: any;
  index: number;
};

const RenderItemContentForPlayground = ({ type, item, index }: Props) => {
  const { modeTemplate } = useZNSTemplateStore();
  switch (type) {
    case ERadioItemZNSTypeTemplateCollapse.table:
      return <RenderTableContentForPlayground tables={item?.table || []} name={index} />;
    default:
      return (
        <div className='leading-snug mb-3'>{formatTextWithBoldTags(item?.value, modeTemplate)}</div>
      );
  }
};

export default RenderItemContentForPlayground;
