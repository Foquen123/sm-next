'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import styles from './SidebarLink.module.css';

interface SidebarLinkProps {
  href: string;
  children: ReactNode;
  onClick: () => void;
}

const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
  return isActive
    ? `${styles['link']} ${styles['active']}`
    : `${styles['link']}`;
};

function SidebarLink({ children, href, onClick }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const baseClasses = `
    rounded-[15px] py-[18px] px-[30px]
    flex items-center justify-start
    font-medium text-base leading-[140%] text-white
    bg-none
    transition-all duration-300
    hover:bg-[var(--hover-color-1)]
  `;

  const activeClasses = 'bg-white text-black';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={getNavLinkClass({ isActive })}
    >
      {children}
    </Link>
  );
}

export default SidebarLink;
