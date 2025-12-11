'use client';

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
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
      maxWidth="xl"
      isBordered
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-white"
        />
        <NavbarBrand>
          <img 
            src="/assests/favicon.ico" 
            alt="Punhe CRM" 
            className="w-8 h-8 mr-2"
          />
          <p className="font-bold text-white text-lg">Punhe CRM</p>
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
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
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
            color="secondary"
            variant="solid"
            startContent={<FiPlus />}
            className="bg-white text-blue-600 font-semibold hover:bg-white/90"
          >
            New Campaign
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-gradient-to-b from-blue-600 to-purple-600">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <NavbarMenuItem key={`${item.href}-${index}`} isActive={isActive}>
              <Link
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/20 text-white font-semibold' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
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
            color="secondary"
            variant="solid"
            startContent={<FiPlus />}
            className="w-full bg-white text-blue-600 font-semibold hover:bg-white/90 mt-2"
            onClick={() => setIsMenuOpen(false)}
          >
            New Campaign
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}

