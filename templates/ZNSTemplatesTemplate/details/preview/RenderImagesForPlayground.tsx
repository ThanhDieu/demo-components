'use client';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import StringUtils from '@/utils/StringUtils';
import { Carousel, Image } from 'antd';
import React from 'react';
type Props = {};
const RenderImagesForPlayground: React.FC<Props> = () => {
  const banners = useZNSTemplateStore((state) => state?.selectedItemZNSTemplate?.banner);
  return (
    <Carousel autoplay autoplaySpeed={5000} speed={1000} pauseOnDotsHover>
      {banners
        ?.filter((bn) => bn?.fileUrl)
        .map((bn, index) => (
          <div key={index}>
            <Image
              src={StringUtils.formatImageUrl(bn?.fileUrl)}
              className='!w-full !h-auto !mb-2'
              preview={false}
            />
          </div>
        ))}
    </Carousel>
  );
};

export default RenderImagesForPlayground;
