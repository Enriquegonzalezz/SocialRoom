import { ReactNode } from 'react';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function LocaleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="relative">
      {/* Language Switcher en la esquina superior derecha */}
      <div className="fixed top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      {children}
    </div>
  );
}
