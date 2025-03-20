
import React from 'react';
import Navbar from '@/components/Navbar';
import { Task } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'إعداد تقرير الرحلة السابقة',
    description: 'كتابة تقرير مفصل عن الرحلة الكشفية الأخيرة',
    assignedTo: ['أحمد محمد', 'خالد عبدالله'],
    dueDate: new Date('2024-03-20'),
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    title: 'تجهيز معدات المخيم',
    description: 'فحص وتجهيز المعدات اللازمة للمخيم القادم',
    assignedTo: ['فهد سعد', 'عمر خالد'],
    dueDate: new Date('2024-03-25'),
    status: 'in-progress',
    priority: 'medium'
  }
];

const TasksPage = () => {
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
            المهام الكشفية
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            تابع المهام المسندة إليك وحالة إنجازها
          </motion.p>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockTasks.map((task, index) => (
            <motion.div
              key={task.id}
              className="glass-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-scout-900">
                    {task.title}
                  </h3>
                  <span className={`badge-chip ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority === 'high' ? 'عالية' :
                     task.priority === 'medium' ? 'متوسطة' : 'منخفضة'}
                  </span>
                </div>
                <p className="text-scout-600 mb-4">{task.description}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-scout-500">
                    <Calendar className="h-4 w-4" />
                    <span>تاريخ الإنجاز: {task.dueDate.toLocaleDateString('ar-SA')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-scout-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>الحالة: {
                      task.status === 'pending' ? 'معلق' :
                      task.status === 'in-progress' ? 'قيد التنفيذ' : 'مكتمل'
                    }</span>
                  </div>
                </div>
                {task.assignedTo.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-scout-800 mb-2">المكلفون بالمهمة:</h4>
                    <div className="flex flex-wrap gap-2">
                      {task.assignedTo.map((person, idx) => (
                        <span key={idx} className="badge-chip bg-scout-100 text-scout-800">
                          {person}
                        </span>
                      ))}
                    </div>
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

export default TasksPage;
