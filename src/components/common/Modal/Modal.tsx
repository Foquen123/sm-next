'use client';
import { ReactNode } from 'react';

interface IProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({ isOpen, onClose, children }: IProps) {
  return (
    <>
      <div
        className="transition-all absolute z-50 w-0 h-0 p-10"
        style={{
          opacity: isOpen ? '100%' : '0%',
          pointerEvents: isOpen ? 'all' : 'none',
          // display: isOpen ? 'inherit' : 'none',
        }}
      >
        <div
          className="fixed w-screen h-screen top-0 left-0 z-40 bg-black/25 transition-all"
          onClick={onClose}
        ></div>
        <div
          className="fixed bg-white z-50 p-2.5 rounded-lg max-w-[60%] w-full max-[450px]:max-w-[80%] max-h-[85vh] overflow-hidden h-full flex flex-col"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="flex flex-col gap-2.5 overflow-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
