'use client';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import StringUtils from '@/utils/StringUtils';
import { Image } from 'antd';
import clsx from 'clsx';
import React from 'react';
const defaultLogo = 'https://stc-oa.zdn.vn/uploads/2024/09/23/f748f141717d5967fd9a96780f9bf848.png';

type Props = {
  className?: string;
  fileUrl?: string;
};
const RenderLogoForPlayground: React.FC<Props> = ({ className, fileUrl }) => {
  const { modeTemplate } = useZNSTemplateStore();
  const logo = useZNSTemplateStore(
    (state) => state?.selectedItemZNSTemplate?.logo?.[modeTemplate || 'light'],
  );
  return (
    <Image
      src={
        logo?.fileUrl || fileUrl
          ? StringUtils.formatImageUrl(fileUrl || logo?.fileUrl)
          : defaultLogo
      }
      className={clsx('!w-[175px] !h-[41px] mb-4', className)}
      preview={false}
    />
  );
};

export default RenderLogoForPlayground;
