'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: string;
}

export function KPICard({ title, value, change, isPositive, icon: Icon, color }: KPICardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
          
          {change && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded",
                isPositive ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {isPositive ? '+' : ''}{change}
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "p-3 rounded-xl",
          color
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </motion.div>
  );
}
