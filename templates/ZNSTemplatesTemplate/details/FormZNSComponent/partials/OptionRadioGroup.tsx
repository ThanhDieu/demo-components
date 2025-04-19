'use client';
import { Radio } from 'antd';
import React from 'react';

interface RadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props {
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
}

const OptionRadioGroup: React.FC<Props> = ({ options, onChange, selectedValue }) => {
  const handleChange = (value: string) => {
    onChange(value);
  };
  return (
    <>
      <Radio.Group value={selectedValue} style={{ marginBottom: 16 }}>
        {options.map((option) => (
          <Radio.Button
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            onClick={() => handleChange(option.value)}
          >
            {option.label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </>
  );
};

export default OptionRadioGroup;
