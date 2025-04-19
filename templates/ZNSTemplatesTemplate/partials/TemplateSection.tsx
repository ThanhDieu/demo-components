import { Category } from '@/interfaces/templates/category.interface';
import React from 'react';
import TemplateCard from './TemplateCard';
import { TemplateSample } from '@/interfaces/templates/templateSample.interface';

interface TemplateSectionProps {
  category: Category;
  templateSamples: TemplateSample[];
}

const TemplateSection: React.FC<TemplateSectionProps> = ({ category, templateSamples }) => {
  const templates = templateSamples.filter((template) => template.categoryId == category.id);
  if (templates.length === 0) return null;
  return (
    <div className='mb-8 '>
      <h2 className='font-bold mb-3'>{category.name}</h2>
      <div className='flex gap-4 flex-wrap'>
        {templates.map((item, index) => (
          <TemplateCard data={item} key={index} mode='library' />
        ))}
      </div>
    </div>
  );
};

export default TemplateSection;
