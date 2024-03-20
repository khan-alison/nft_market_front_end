import { Dispatch, SetStateAction, useState } from 'react';

export const useModal = (
  defaultState = false,
): {
  visible: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  setVisible: Dispatch<SetStateAction<boolean>>;
} => {
  const [visible, setVisible] = useState(defaultState);

  const onOpenModal = () => setVisible(true);

  const onCloseModal = () => setVisible(false);

  return {
    visible,
    onOpenModal,
    onCloseModal,
    setVisible,
  };
};
