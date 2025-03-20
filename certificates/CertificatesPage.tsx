
import React from 'react';
import Navbar from '@/components/Navbar';
import { Certificate } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for certificates
const mockCertificates: Certificate[] = [
  {
    id: '1',
    name: 'شهادة الإسعافات الأولية',
    description: 'شهادة تؤكد إتمام دورة الإسعافات الأولية بنجاح',
    issueDate: new Date('2023-03-15'),
    issuedTo: 'أحمد محمد',
    issuedBy: 'مركز التدريب الكشفي',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'شهادة القيادة الكشفية',
    description: 'شهادة تؤكد إتمام دورة القيادة الكشفية الأساسية',
    issueDate: new Date('2023-04-20'),
    issuedTo: 'عبدالله خالد',
    issuedBy: 'المفوضية الكشفية',
    imageUrl: '/placeholder.svg'
  }
];

const CertificatesPage = () => {
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
            الشهادات الكشفية
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            استعرض الشهادات التي حصلت عليها في مسيرتك الكشفية
          </motion.p>
        </div>
      </div>

      {/* Search section */}
      <div className="bg-white border-b border-scout-200 py-4 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-scout-400" />
            <Input placeholder="ابحث عن شهادة..." className="pr-10 w-full" />
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCertificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={certificate.imageUrl} 
                  alt={certificate.name}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-scout-900 mb-2">
                  {certificate.name}
                </h3>
                <p className="text-scout-600 mb-4">{certificate.description}</p>
                <div className="space-y-2 text-sm text-scout-500">
                  <p>تاريخ الإصدار: {certificate.issueDate.toLocaleDateString('ar-SA')}</p>
                  <p>صادرة لـ: {certificate.issuedTo}</p>
                  <p>جهة الإصدار: {certificate.issuedBy}</p>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
