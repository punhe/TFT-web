'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiMail, 
  FiBarChart2, 
  FiPlus,
  FiCheckCircle,
  FiZap,
  FiUser,
  FiLogOut,
  FiSettings
} from 'react-icons/fi';
import { useState } from 'react';
import { m } from 'framer-motion';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  NavbarMenuToggle, 
  NavbarMenu, 
  NavbarMenuItem, 
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
  Skeleton
} from '@heroui/react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: FiHome },
    { href: '/campaigns', label: 'Campaigns', icon: FiMail },
    { href: '/analytics', label: 'Analytics', icon: FiBarChart2 },
    { href: '/test', label: 'Test', icon: FiCheckCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
      className="bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm"
      maxWidth="xl"
      height="5rem"
      classNames={{
        wrapper: "px-6",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[3px]",
          "data-[active=true]:after:rounded-t-full",
          "data-[active=true]:after:bg-gradient-to-r",
          "data-[active=true]:after:from-primary",
          "data-[active=true]:after:to-secondary",
        ],
      }}
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden text-gray-700"
        />
        <NavbarBrand as={Link} href="/" className="cursor-pointer gap-4">
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-2xl blur-lg animate-pulse-slow" />
            <Image 
              src="/assests/favicon.ico" 
              alt="Punhe CRM" 
              width={56}
              height={56}
              className="relative w-14 h-14 rounded-2xl shadow-lg ring-2 ring-white/50"
              priority
            />
          </m.div>
          <m.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden sm:block"
          >
            <p className="font-bold text-xl bg-gradient-to-r from-gray-900 via-primary to-secondary bg-clip-text text-transparent">
              Punhe CRM
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <FiZap className="text-warning" size={12} />
              Email journeys that feel human
            </p>
          </m.div>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-2" justify="center">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <NavbarItem key={item.href} isActive={isActive}>
              <m.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold shadow-sm border border-primary/20' 
                      : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-primary' : ''} />
                  <span>{item.label}</span>
                </Link>
              </m.div>
            </NavbarItem>
          );
        })}
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        {/* New Campaign Button */}
        <NavbarItem className="hidden lg:flex">
          <m.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              as={Link}
              href="/campaigns/new"
              className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-600 to-secondary text-white font-semibold rounded-xl px-5 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              startContent={<FiPlus className="text-lg" />}
            >
              <span className="relative z-10">New Campaign</span>
            </Button>
          </m.div>
        </NavbarItem>

        {/* User Menu */}
        <NavbarItem>
          {loading ? (
            <Skeleton className="w-10 h-10 rounded-full" />
          ) : user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <m.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar
                    as="button"
                    className="transition-transform cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50"
                    color="primary"
                    name={getUserInitials()}
                    size="sm"
                    src={user.user_metadata?.avatar_url}
                    showFallback
                    fallback={
                      <span className="text-sm font-semibold">{getUserInitials()}</span>
                    }
                  />
                </m.div>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Profile Actions" 
                variant="flat"
                className="w-64"
              >
                <DropdownItem key="profile" className="h-auto py-3 gap-2" textValue="Profile">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-gray-900">
                      {user.user_metadata?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </DropdownItem>
                <DropdownItem 
                  key="settings" 
                  startContent={<FiSettings className="text-gray-500" />}
                  className="py-2"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  startContent={<FiLogOut />}
                  className="py-2"
                  onPress={handleSignOut}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <m.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex gap-2"
            >
              <Button
                as={Link}
                href="/login"
                variant="light"
                className="text-gray-600 hover:text-primary font-medium"
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href="/register"
                className="bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl"
              >
                Sign Up
              </Button>
            </m.div>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="bg-white/95 backdrop-blur-xl pt-6">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <NavbarMenuItem key={`${item.href}-${index}`}>
              <m.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-semibold border border-primary/20' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-primary/10' : 'bg-gray-100'}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-lg">{item.label}</span>
                </Link>
              </m.div>
            </NavbarMenuItem>
          );
        })}
        
        <NavbarMenuItem className="mt-4">
          <m.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Button
              as={Link}
              href="/campaigns/new"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl py-6 shadow-lg"
              startContent={<FiPlus className="text-lg" />}
              onClick={() => setIsMenuOpen(false)}
            >
              New Campaign
            </Button>
          </m.div>
        </NavbarMenuItem>

        {/* Mobile user section */}
        {user && (
          <NavbarMenuItem className="mt-4 pt-4 border-t border-gray-200">
            <m.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-3 px-4 py-2">
                <Avatar
                  size="sm"
                  name={getUserInitials()}
                  className="ring-2 ring-primary/20"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.full_name || 'User'}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button
                variant="flat"
                color="danger"
                className="w-full rounded-xl"
                startContent={<FiLogOut />}
                onPress={() => {
                  setIsMenuOpen(false);
                  handleSignOut();
                }}
              >
                Log Out
              </Button>
            </m.div>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
}
