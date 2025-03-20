
import React from 'react';
import Navbar from '@/components/Navbar';
import { Badge as BadgeType } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for badges
const mockBadges: BadgeType[] = [
  {
    id: '1',
    name: 'الإسعافات الأولية',
    description: 'التدريب على الإسعافات الأولية الأساسية',
    imageUrl: '/placeholder.svg',
    requirements: ['إتمام دورة الإسعافات الأولية', 'اجتياز الاختبار العملي'],
    category: 'مهارات',
    dateEarned: new Date('2022-06-15')
  },
  {
    id: '2',
    name: 'المخيمات الكشفية',
    description: 'مهارات إقامة المخيمات وإدارتها',
    imageUrl: '/placeholder.svg',
    requirements: ['المشاركة في ٣ مخيمات كشفية', 'إتقان نصب الخيام'],
    category: 'مخيمات',
    dateEarned: new Date('2022-04-20')
  },
  {
    id: '3',
    name: 'العقد والربطات',
    description: 'إتقان العقد والربطات الكشفية الأساسية',
    imageUrl: '/placeholder.svg',
    requirements: ['إتقان ١٠ أنواع من العقد', 'استخدام العقد في تطبيقات عملية'],
    category: 'مهارات',
    dateEarned: new Date('2021-11-10')
  }
];

const BadgesPage = () => {
  return (
    <div className="min-h-screen bg-scout-50" dir="rtl">
      <Navbar />
      
      {/* Hero section */}
      <div className="pt-24 pb-12 px-6 bg-scout-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            الشارات الكشفية
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            اكتشف الشارات التي يمكنك الحصول عليها ومتطلبات كل شارة
          </motion.p>
        </div>
      </div>

      {/* Search section */}
      <div className="bg-white border-b border-scout-200 py-4 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-scout-400" />
            <Input placeholder="ابحث عن شارة..." className="pr-10 w-full" />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden bg-scout-100 flex items-center justify-center">
                <img 
                  src={badge.imageUrl} 
                  alt={badge.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-scout-900">
                    {badge.name}
                  </h3>
                  <span className="badge-chip bg-scout-100 text-scout-800">
                    {badge.category}
                  </span>
                </div>
                <p className="text-scout-600 mb-4">{badge.description}</p>
                {badge.requirements.length > 0 && (
                  <div>
                    <h4 className="font-medium text-scout-800 mb-2">المتطلبات:</h4>
                    <ul className="list-disc list-inside space-y-1 text-scout-600">
                      {badge.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BadgesPage;
