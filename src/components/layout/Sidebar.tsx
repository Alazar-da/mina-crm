// components/layout/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Calendar, 
  Ticket, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Customers', href: '/customers' },
  { icon: Target, label: 'Leads & Pipeline', href: '/leads' },
  { icon: Calendar, label: 'Follow-ups', href: '/follow-ups' },
  { icon: Ticket, label: 'Support Tickets', href: '/tickets' },
  { icon: FileText, label: 'Contracts', href: '/contracts' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({ isOpen: externalOpen, onClose, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('crm_user_session');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('session_expiry');
    localStorage.removeItem('sidebar_collapsed');
    router.push('/login');
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
      if (onClose) onClose();
    }
  };

  // Sidebar content with full labels (no icon-only mode)
  const sidebarContent = (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-all duration-300 border-r border-slate-200 dark:border-slate-800",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo Section */}
      <div className={cn(
        "p-6 border-b border-slate-200 dark:border-slate-800 flex items-center",
        isCollapsed ? "justify-center" : "justify-start"
      )}>
        <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shrink-0">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap"
            >
              Mina Tech
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                isCollapsed && "justify-center"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 shrink-0",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              )} />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 space-y-1">
        <Link
          href="/settings"
          onClick={handleLinkClick}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <Settings className="w-5 h-5 shrink-0 text-slate-400 dark:text-slate-500" />
          {!isCollapsed && (
            <span className="font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
              Settings
            </span>
          )}
        </Link>
        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && (
            <span className="font-medium whitespace-nowrap">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // Mobile sidebar (always full width, never collapsed)
  const mobileSidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 w-80 border-r border-slate-200 dark:border-slate-800">
      {/* Logo Section */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Mina Tech
          </span>
        </div>
        <button
          onClick={() => {
            setIsMobileOpen(false);
            if (onClose) onClose();
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </button>
      </div>

      {/* Navigation - Full labels on mobile */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                  : "hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
              )} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:text-blue-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-800 space-y-1">
        <Link
          href="/settings"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Settings className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <span className="font-medium text-slate-600 dark:text-slate-400">Settings</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar with Overlay */}
      <AnimatePresence>
        {(externalOpen || isMobileOpen) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsMobileOpen(false);
                if (onClose) onClose();
              }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 h-full z-50 lg:hidden shadow-2xl"
            >
              {mobileSidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}