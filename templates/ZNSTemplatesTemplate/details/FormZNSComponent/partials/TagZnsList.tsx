'use client';
import { IZNSTag } from '@/interfaces/templates/template.interface';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { CiFaceSmile } from 'react-icons/ci';
import { SlHandbag, SlPresent } from 'react-icons/sl';
import TypeZnsItem from './TypeZnsItem';

const ItemsZNSPurpose = {
  1: <SlHandbag size={24} />,
  2: <CiFaceSmile size={24} />,
  3: <SlPresent size={24} />,
};

const TagZnsList = () => {
  const { commonZNSTemplate, selectedItemZNSTemplate, setSelectedItemZNSTemplate } =
    useZNSTemplateStore();

  const hadleSelectItem = (item: IZNSTag) => {
    if (selectedItemZNSTemplate?.tag?.id === item?.id) return;
    setSelectedItemZNSTemplate('tag', item);
  };

  return (
    selectedItemZNSTemplate?.type?.validTags &&
    selectedItemZNSTemplate?.type?.validTags?.length > 1 && (
      <div className='grid grid-cols-3 gap-3 mt-4'>
        {selectedItemZNSTemplate.type.validTags.map((item) => {
          const tagItem = commonZNSTemplate?.tag?.find((t) => item === t.value && t.enabled);
          return (
            <TypeZnsItem
              key={tagItem?.id}
              icon={(ItemsZNSPurpose as any)?.[item] || ItemsZNSPurpose[1]}
              title={tagItem?.name || ''}
              subTitle={tagItem?.title}
              isChooseItem={
                !!selectedItemZNSTemplate?.tag?.value &&
                selectedItemZNSTemplate?.tag?.value === tagItem?.value
              }
              onClick={() => tagItem && hadleSelectItem(tagItem)}
              description={tagItem?.description}
            />
          );
        })}
      </div>
    )
  );
};

export default TagZnsList;
