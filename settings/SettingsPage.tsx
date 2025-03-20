import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Moon, Globe, CircleUser, Phone, Shield, Settings as SettingsIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SettingsPage = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState('ar');
  const [theme, setTheme] = useState('light');
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newActivity: true,
    upcomingEvents: true,
    achievements: true,
    systemUpdates: false,
  });
  
  const handleNotificationChange = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings]
    });
  };
  
  const handleSaveNotifications = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات الإشعارات بنجاح",
    });
  };
  
  const handleSaveAppearance = () => {
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعدادات المظهر بنجاح",
    });
  };
  
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "تم إرسال الرسالة",
      description: "سنتواصل معك قريباً",
    });
  };

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
            الإعدادات
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            تخصيص تجربتك وإدارة إعدادات حسابك
          </motion.p>
        </div>
      </div>
      
      {/* Settings Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs defaultValue="notifications" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Left Sidebar - Settings Navigation */}
            <div className="md:col-span-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="sticky top-28"
              >
                <Card className="border-0 shadow-md">
                  <CardContent className="p-4">
                    <TabsList orientation="vertical" className="flex flex-col h-auto w-full bg-transparent space-y-1">
                      <TabsTrigger value="notifications" className="justify-start data-[state=active]:bg-scout-100 py-2 px-3">
                        <Bell className="h-5 w-5 ml-2" />
                        الإشعارات
                      </TabsTrigger>
                      <TabsTrigger value="appearance" className="justify-start data-[state=active]:bg-scout-100 py-2 px-3">
                        <Moon className="h-5 w-5 ml-2" />
                        المظهر واللغة
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="justify-start data-[state=active]:bg-scout-100 py-2 px-3">
                        <Shield className="h-5 w-5 ml-2" />
                        الخصوصية والأمان
                      </TabsTrigger>
                      <TabsTrigger value="help" className="justify-start data-[state=active]:bg-scout-100 py-2 px-3">
                        <Phone className="h-5 w-5 ml-2" />
                        المساعدة والدعم
                      </TabsTrigger>
                      <TabsTrigger value="about" className="justify-start data-[state=active]:bg-scout-100 py-2 px-3">
                        <SettingsIcon className="h-5 w-5 ml-2" />
                        عن التطبيق
                      </TabsTrigger>
                    </TabsList>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-scout-900">إعدادات الإشعارات</CardTitle>
                      <CardDescription>تحكم في نوع الإشعارات التي تصلك وكيفية استلامها</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-scout-800">قنوات الإشعارات</h3>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <Bell className="h-5 w-5 text-scout-600" />
                              <span>إشعارات البريد الإلكتروني</span>
                            </div>
                            <Switch 
                              checked={notificationSettings.emailNotifications} 
                              onCheckedChange={() => handleNotificationChange('emailNotifications')}
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <Bell className="h-5 w-5 text-scout-600" />
                              <span>إشعارات التطبيق</span>
                            </div>
                            <Switch 
                              checked={notificationSettings.pushNotifications}
                              onCheckedChange={() => handleNotificationChange('pushNotifications')}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-medium text-scout-800">أنواع الإشعارات</h3>
                          <div className="flex items-center justify-between py-2">
                            <span>الأنشطة الجديدة والتعديلات</span>
                            <Switch 
                              checked={notificationSettings.newActivity}
                              onCheckedChange={() => handleNotificationChange('newActivity')}
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span>الفعاليات والمواعيد القادمة</span>
                            <Switch 
                              checked={notificationSettings.upcomingEvents}
                              onCheckedChange={() => handleNotificationChange('upcomingEvents')}
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span>الإنجازات والشارات الجديدة</span>
                            <Switch 
                              checked={notificationSettings.achievements}
                              onCheckedChange={() => handleNotificationChange('achievements')}
                            />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span>تحديثات النظام والصيانة</span>
                            <Switch 
                              checked={notificationSettings.systemUpdates}
                              onCheckedChange={() => handleNotificationChange('systemUpdates')}
                            />
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="scout" onClick={handleSaveNotifications}>
                            حفظ الإعدادات
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Appearance Tab */}
              <TabsContent value="appearance">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-scout-900">المظهر واللغة</CardTitle>
                      <CardDescription>خصص مظهر التطبيق ولغة العرض</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-scout-800">السمة</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div 
                              className={`border-2 rounded-md p-4 cursor-pointer ${theme === 'light' ? 'border-scout-700' : 'border-scout-200'}`}
                              onClick={() => setTheme('light')}
                            >
                              <div className="bg-white h-20 rounded-md border border-scout-200 mb-2"></div>
                              <div className="text-center">فاتح</div>
                            </div>
                            <div 
                              className={`border-2 rounded-md p-4 cursor-pointer ${theme === 'dark' ? 'border-scout-700' : 'border-scout-200'}`}
                              onClick={() => setTheme('dark')}
                            >
                              <div className="bg-gray-900 h-20 rounded-md border border-gray-800 mb-2"></div>
                              <div className="text-center">داكن</div>
                            </div>
                            <div 
                              className={`border-2 rounded-md p-4 cursor-pointer ${theme === 'system' ? 'border-scout-700' : 'border-scout-200'}`}
                              onClick={() => setTheme('system')}
                            >
                              <div className="bg-gradient-to-r from-white to-gray-900 h-20 rounded-md border border-scout-200 mb-2"></div>
                              <div className="text-center">تلقائي</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-medium text-scout-800">اللغة</h3>
                          <div className="max-w-sm">
                            <Select value={language} onValueChange={setLanguage}>
                              <SelectTrigger>
                                <Globe className="h-4 w-4 ml-2" />
                                <SelectValue placeholder="اختر اللغة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ar">العربية</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="scout" onClick={handleSaveAppearance}>
                            حفظ الإعدادات
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Privacy Tab */}
              <TabsContent value="privacy">
                {/* Privacy and security content */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-scout-900">الخصوصية والأمان</CardTitle>
                      <CardDescription>تحكم في خصوصية بياناتك وأمان حسابك</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="font-medium text-scout-800">رؤية الملف الشخصي</h3>
                          <div className="max-w-sm">
                            <Select defaultValue="team">
                              <SelectTrigger>
                                <CircleUser className="h-4 w-4 ml-2" />
                                <SelectValue placeholder="من يمكنه رؤية ملفك الشخصي" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="public">الجميع</SelectItem>
                                <SelectItem value="team">أعضاء الفريق فقط</SelectItem>
                                <SelectItem value="leaders">القادة فقط</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-medium text-scout-800">البيانات والخصوصية</h3>
                          <div className="flex items-center justify-between py-2">
                            <span>السماح بمشاركة بياناتي في الإحصائيات</span>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span>إظهار اسمي في قوائم الإنجازات</span>
                            <Switch defaultChecked />
                          </div>
                        </div>
                        
                        <div className="pt-4 flex flex-wrap gap-4">
                          <Button variant="scout">
                            حفظ الإعدادات
                          </Button>
                          <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            طلب حذف الحساب
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Help Tab */}
              <TabsContent value="help">
                {/* Help & support content */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md mb-8">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-scout-900">الأسئلة الشائعة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          {
                            question: "كيف يمكنني التسجيل في نشاط أو رحلة؟",
                            answer: "يمكنك التسجيل في الأنشطة والرحلات من صفحة الرحلات أو البرامج، حيث ستجد زر 'التسجيل' بجوار النشاط المتاح."
                          },
                          {
                            question: "كيف يمكنني تغيير كلمة المرور الخاصة بي؟",
                            answer: "يمكنك تغيير كلمة المرور من صفحة الملف الشخصي، ثم الانتقال إلى تبويب 'الأمان' واتباع الخطوات هناك."
                          },
                          {
                            question: "كيف يمكنني الحصول على شارة جديدة؟",
                            answer: "للحصول على شارة، يجب عليك إكمال جميع متطلباتها التي يمكنك الاطلاع عليها في صفحة الشارات، ثم التواصل مع القائد للتحقق والموافقة."
                          }
                        ].map((item, index) => (
                          <div key={index} className="border border-scout-200 rounded-lg p-4">
                            <h3 className="font-medium text-scout-900 mb-2">{item.question}</h3>
                            <p className="text-scout-600">{item.answer}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-scout-900">اتصل بنا</CardTitle>
                      <CardDescription>لديك سؤال أو استفسار؟ راسلنا وسنرد عليك في أقرب وقت</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleContactFormSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">الموضوع</label>
                            <Select defaultValue="help">
                              <SelectTrigger>
                                <SelectValue placeholder="اختر الموضوع" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="help">طلب مساعدة</SelectItem>
                                <SelectItem value="suggestion">اقتراح تحسين</SelectItem>
                                <SelectItem value="bug">الإبلاغ عن خطأ</SelectItem>
                                <SelectItem value="other">أخرى</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">الرسالة</label>
                            <Textarea 
                              placeholder="اكتب رسالتك هنا..."
                              className="h-32"
                            />
                          </div>
                          <div className="pt-2">
                            <Button type="submit" variant="scout">
                              إرسال
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* About Tab */}
              <TabsContent value="about">
                {/* About tab content */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-scout-900">عن التطبيق</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex flex-col items-center py-6">
                          <div className="w-20 h-20 flex items-center justify-center rounded-xl bg-scout-700 text-white mb-4">
                            <span className="text-3xl font-bold">ك</span>
                          </div>
                          <h2 className="text-2xl font-bold text-scout-900">كشافة</h2>
                          <p className="text-scout-600 mt-1">الإصدار 1.0.0</p>
                        </div>
                        
                        <div className="prose max-w-none text-scout-700">
                          <p>
                            تطبيق كشافة هو منصة متكاملة لإدارة أنشطة الكشافة، تم تطويره لتسهيل عمل القادة وتحسين تجربة الكشافين في متابعة أنشطتهم وإنجازاتهم.
                          </p>
                          <p>
                            يهدف التطبيق إلى توفير بيئة رقمية تساعد على تنظيم الأنشطة والرحلات، وتسهيل عملية متابعة الشارات والإنجازات، وتحسين التواصل بين أعضاء المجموعة الكشفية.
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-medium text-scout-800">معلومات الاتصال:</h3>
                          <p className="text-scout-600">البريد الإلكتروني: info@example.com</p>
                          <p className="text-scout-600">الهاتف: +966 12 345 6789</p>
                          <p className="text-scout-600">العنوان: الرياض، المملكة العربية السعودية</p>
                        </div>
                        
                        <div className="pt-4">
                          <Button variant="outline">
                            سياسة الخصوصية
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
