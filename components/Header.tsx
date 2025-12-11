'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiMail, 
  FiBarChart2, 
  FiPlus,
  FiMenu,
  FiX,
  FiCheckCircle
} from 'react-icons/fi';
import { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Button } from '@heroui/react';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: FiHome },
    { href: '/campaigns', label: 'Campaigns', icon: FiMail },
    { href: '/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/test', label: 'Test', icon: FiCheckCircle },
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white/90 backdrop-blur-md text-gray-900 shadow-sm border-b border-gray-200"
      maxWidth="xl"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-gray-900"
        />
        <NavbarBrand as={Link} href="/" className="cursor-pointer">
          <Image 
            src="/assests/favicon.ico" 
            alt="Punhe CRM" 
            width={120}
            height={120}
            className="w-[120px] h-[120px] mr-4 rounded-2xl shadow-sm"
            priority
          />
          <div className="hidden sm:block">
            <p className="font-bold text-xl text-gray-900 leading-tight">Punhe CRM</p>
            <p className="text-xs text-gray-500">Email journeys that feel human</p>
          </div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <Link
                href={item.href}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-slate-100 text-gray-900 font-semibold border border-slate-200 shadow-sm' 
                    : 'text-gray-600 hover:bg-slate-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Button
            as={Link}
            href="/campaigns/new"
            color="primary"
            variant="solid"
            startContent={<FiPlus />}
            className="font-semibold rounded-full px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
          >
            New Campaign
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-white/95 backdrop-blur-md">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <NavbarMenuItem key={`${item.href}-${index}`} isActive={isActive}>
              <Link
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-slate-100 text-gray-900 font-semibold' 
                    : 'text-gray-700 hover:bg-slate-50 hover:text-gray-900'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </NavbarMenuItem>
          );
        })}
        <NavbarMenuItem>
          <Button
            as={Link}
            href="/campaigns/new"
            color="primary"
            variant="solid"
            startContent={<FiPlus />}
            className="w-full font-semibold mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            onClick={() => setIsMenuOpen(false)}
          >
            New Campaign
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

