
import React from 'react';
import Navbar from '@/components/Navbar';
import { Trip } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users } from 'lucide-react';

const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'رحلة الربيع',
    description: 'رحلة استكشافية في الطبيعة لتعلم مهارات التخييم',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    location: 'وادي حنيفة',
    maxParticipants: 30,
    currentParticipants: 25,
    imageUrl: '/placeholder.svg',
    requirements: ['الحد الأدنى للعمر 15 سنة', 'اللياقة البدنية المناسبة'],
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'المخيم الكشفي السنوي',
    description: 'مخيم تدريبي شامل لمدة 5 أيام',
    startDate: new Date('2024-04-01'),
    endDate: new Date('2024-04-05'),
    location: 'منتزه الثمامة',
    maxParticipants: 50,
    currentParticipants: 35,
    imageUrl: '/placeholder.svg',
    requirements: ['إتمام التدريب الأساسي', 'موافقة ولي الأمر'],
    status: 'upcoming'
  }
];

const TripsPage = () => {
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
            الرحلات الكشفية
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            اكتشف الرحلات والمخيمات القادمة وانضم إليها
          </motion.p>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTrips.map((trip, index) => (
            <motion.div
              key={trip.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={trip.imageUrl} 
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                />
                <div className="absolute top-4 right-4">
                  <span className="badge-chip bg-scout-700 text-white">
                    {trip.status === 'upcoming' ? 'قادمة' : 
                     trip.status === 'ongoing' ? 'جارية' : 'منتهية'}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-scout-900 mb-2">
                  {trip.title}
                </h3>
                <p className="text-scout-600 mb-4">{trip.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-scout-500">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {trip.startDate.toLocaleDateString('ar-SA')} - {trip.endDate.toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-scout-500">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-scout-500">
                    <Users className="h-4 w-4" />
                    <span>{trip.currentParticipants}/{trip.maxParticipants} مشارك</span>
                  </div>
                </div>
                {trip.requirements.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-scout-800 mb-2">المتطلبات:</h4>
                    <ul className="list-disc list-inside space-y-1 text-scout-600">
                      {trip.requirements.map((req, idx) => (
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

export default TripsPage;
