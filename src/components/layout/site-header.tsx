'use client';

import Link from 'next/link';
import { BotMessageSquare, FileText, Home, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Upload Invoice', icon: Home },
    { href: '/reports', label: 'View Reports', icon: Search },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold">InvoiceAI</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="mr-1 inline-block h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
