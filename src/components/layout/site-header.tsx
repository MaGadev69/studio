// src/components/layout/site-header.tsx
'use client';

import Link from 'next/link';
import { BotMessageSquare, Home, Search, Users } from 'lucide-react'; // Added Users icon
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Upload Invoice', icon: Home },
    { href: '/reports', label: 'View Reports', icon: Search },
    { href: '/clients', label: 'Clients', icon: Users }, // Added Clients link
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BotMessageSquare className="h-6 w-6 text-primary" />
          <span className="font-bold">InvoiceAI</span>
        </Link>
        <nav className="flex items-center space-x-4 text-sm font-medium md:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-primary flex items-center',
                pathname === item.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="mr-1 hidden h-4 w-4 sm:inline-block" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
