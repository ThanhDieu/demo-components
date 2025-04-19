'use client';

import { ILuckyDrawRule } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { Button, Modal, Typography } from 'antd';
import { useState } from 'react';
const { Text } = Typography;

type Props = { rule?: ILuckyDrawRule };
const ModalTestDraw = ({ rule }: Props) => {
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  const handleTest = (rule?: ILuckyDrawRule) => {
    if (!rule || !rule?.zmaGameRuleGift) return;
    const total = rule.zmaGameRuleGift?.reduce((sum, piece) => sum + piece.rate, 0);
    const rand = Math.random() * total;

    let cumulative = 0;
    for (const piece of rule.zmaGameRuleGift) {
      cumulative += piece.rate;
      if (rand <= cumulative && piece?.gift?.name) {
        setSelectedGift(piece?.gift?.name);
        return;
      }
    }
  };
  return (
    <>
      <Button disabled={!rule} size='small' type='primary' onClick={() => handleTest(rule)}>
        Test
      </Button>
      {selectedGift && (
        <Modal
          centered={true}
          title='Kết quả thử nghiệm'
          open={!!selectedGift}
          onCancel={() => setSelectedGift(null)}
          footer={[
            <Button key='close' type='primary' onClick={() => setSelectedGift(null)}>
              OK
            </Button>,
          ]}
          width={300}
        >
          <p>
            🎉 Kết quả quay: <strong>{selectedGift}</strong>
          </p>
        </Modal>
      )}
    </>
  );
};

export default ModalTestDraw;
