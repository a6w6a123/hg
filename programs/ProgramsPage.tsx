
import React from 'react';
import Navbar from '@/components/Navbar';
import { Program } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User } from 'lucide-react';

const mockPrograms: Program[] = [
  {
    id: '1',
    title: 'برنامج المهارات الكشفية الأساسية',
    description: 'برنامج تدريبي شامل للمهارات الكشفية الأساسية',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-30'),
    location: 'مقر الكشافة',
    responsible: 'القائد محمد أحمد',
    imageUrl: '/placeholder.svg',
    status: 'active'
  },
  {
    id: '2',
    title: 'برنامج القيادة الكشفية',
    description: 'برنامج تطوير مهارات القيادة للكشافة المتقدمين',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-30'),
    location: 'مركز التدريب الكشفي',
    responsible: 'القائد عبدالله خالد',
    imageUrl: '/placeholder.svg',
    status: 'planned'
  }
];

const ProgramsPage = () => {
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
            البرامج الكشفية
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            تعرف على البرامج التدريبية والأنشطة المتاحة
          </motion.p>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPrograms.map((program, index) => (
            <motion.div
              key={program.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={program.imageUrl} 
                  alt={program.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className={`badge-chip ${
                    program.status === 'active' ? 'bg-green-100 text-green-800' :
                    program.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {program.status === 'active' ? 'جاري' :
                     program.status === 'planned' ? 'مخطط' : 'منتهي'}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-scout-900 mb-2">
                  {program.title}
                </h3>
                <p className="text-scout-600 mb-4">{program.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-scout-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {program.startDate.toLocaleDateString('ar-SA')} - {program.endDate.toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-scout-500">
                    <MapPin className="h-4 w-4" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-scout-500">
                    <User className="h-4 w-4" />
                    <span>{program.responsible}</span>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
