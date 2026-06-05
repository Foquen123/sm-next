'use client';

import { useState } from 'react';
import styles from './layout.module.css';
import SidebarLink from '@/components/layout/SidebarLink/SidebarLink';
import { siteConfig } from '@/config/site-config';

const getOverlayClass = (isOpen: boolean): string => {
  return isOpen
    ? `${styles['overlay']}`
    : `${styles['overlay']} ${styles['overlay--hide']}`;
};

const getSidebarClass = (isOpen: boolean): string => {
  return isOpen
    ? `${styles['sidebar']}`
    : `${styles['sidebar']} ${styles['sidebar--hide']}`;
};

function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const overlayClass = getOverlayClass(isSidebarOpen);
  const sidebarClass = getSidebarClass(isSidebarOpen);
  const showSidebar = () => {
    setIsSidebarOpen(true);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };
  return (
    <div className={styles['layout']}>
      <div onClick={closeSidebar} className={overlayClass}></div>
      <aside className={sidebarClass}>
        {siteConfig.menuUrls.map((i) => (
          <SidebarLink key={i.url} onClick={closeSidebar} href={i.url}>
            {i.name}
          </SidebarLink>
        ))}
      </aside>
      <button onClick={showSidebar} className={styles['burger-btn']}>
        <svg
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.25 25H43.75"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.25 12.5H43.75"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.25 37.5H43.75"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {children}
    </div>
  );
}

export default MenuLayout;
