import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Pencil, Key, Shield, Award, Badge, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const ProfilePage = () => {
  const { user } = useAuth();
  const { userData, isLoading } = useUserData();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [searchNationalId, setSearchNationalId] = useState('');
  const [isSearchingUser, setIsSearchingUser] = useState(false);
  const [foundUserData, setFoundUserData] = useState<any>(null);

  // Mock badges data
  const mockBadges = [
    { id: '1', name: 'الإسعافات الأولية', date: '2022-06-15', imageUrl: '/placeholder.svg' },
    { id: '2', name: 'المخيمات الكشفية', date: '2022-04-20', imageUrl: '/placeholder.svg' },
    { id: '3', name: 'العقد والربطات', date: '2021-11-10', imageUrl: '/placeholder.svg' },
  ];

  // Mock certificates data
  const mockCertificates = [
    { id: '1', name: 'شهادة الإسعافات الأولية', date: '2023-03-15', imageUrl: '/placeholder.svg' },
    { id: '2', name: 'شهادة القيادة الكشفية', date: '2023-01-22', imageUrl: '/placeholder.svg' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      full_name: formData.get('fullName') as string,
      email: formData.get('email') as string,
      phone_number: formData.get('phoneNumber') as string,
      address: formData.get('address') as string,
      date_of_birth: formData.get('dateOfBirth') as string,
    };
    
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('auth_id', user?.id);
        
      if (error) throw error;
      
      setIsEditing(false);
      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم حفظ التغييرات بنجاح",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "خطأ في تحديث الملف الشخصي",
        description: "حدث خطأ أثناء محاولة تحديث البيانات",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would update the user password
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تحديث كلمة المرور بنجاح",
    });
  };

  const handleSearchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchNationalId) {
      toast({
        title: "رقم الهوية مطلوب",
        description: "يرجى إدخال رقم الهوية للبحث عن المستخدم",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearchingUser(true);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('national_id', searchNationalId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setFoundUserData(data);
        toast({
          title: "تم العثور على المستخدم",
          description: `تم العثور على المستخدم ${data.full_name || 'بدون اسم'}`,
        });
      } else {
        setFoundUserData(null);
        toast({
          title: "لم يتم العثور على المستخدم",
          description: "لا يوجد مستخدم بهذا الرقم",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      toast({
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن المستخدم",
        variant: "destructive",
      });
    } finally {
      setIsSearchingUser(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-scout-700" />
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return '';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
            الملف الشخصي
          </motion.h1>
          <motion.p 
            className="text-xl text-scout-200 max-w-3xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            إدارة بياناتك الشخصية وعرض إنجازاتك
          </motion.p>
        </div>
      </div>
      
      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - User Info Summary */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="sticky top-28"
            >
              <Card className="border-0 shadow-md overflow-hidden mb-6">
                <div className="bg-scout-700 p-6 flex flex-col items-center">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage src={undefined} alt={userData?.full_name || ''} />
                    <AvatarFallback className="text-3xl bg-scout-800 text-white">
                      {getInitials(userData?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="mt-4 text-xl font-bold text-white">{userData?.full_name || 'مستخدم'}</h2>
                  <p className="text-scout-200">{userData?.role === 'admin' ? 'مسؤول' : 'كشاف'}</p>
                </div>
                <CardContent className="p-0">
                  <ul className="divide-y divide-scout-100">
                    <li className="p-4 flex items-center">
                      <User className="h-5 w-5 text-scout-500 ml-3" />
                      <div>
                        <p className="text-sm text-scout-500">رقم الهوية</p>
                        <p className="font-medium">{userData?.national_id || '---'}</p>
                      </div>
                    </li>
                    <li className="p-4 flex items-center">
                      <Shield className="h-5 w-5 text-scout-500 ml-3" />
                      <div>
                        <p className="text-sm text-scout-500">تاريخ الانضمام</p>
                        <p className="font-medium">{userData?.created_at ? format(new Date(userData.created_at), 'dd/MM/yyyy', { locale: ar }) : '---'}</p>
                      </div>
                    </li>
                    <li className="p-4 flex items-center">
                      <Award className="h-5 w-5 text-scout-500 ml-3" />
                      <div>
                        <p className="text-sm text-scout-500">الشارات</p>
                        <p className="font-medium">{mockBadges.length} شارات</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              {/* Search User by National ID Card */}
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-white py-5">
                  <CardTitle className="text-lg font-semibold text-scout-900">البحث عن مستخدم برقم الهوية</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearchUser} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-scout-700 mb-2">رقم الهوية</label>
                      <div className="flex gap-2">
                        <Input 
                          value={searchNationalId}
                          onChange={(e) => setSearchNationalId(e.target.value)}
                          placeholder="أدخل رقم الهوية"
                        />
                        <Button 
                          type="submit" 
                          variant="outline"
                          disabled={isSearchingUser}
                        >
                          {isSearchingUser ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : 'بحث'}
                        </Button>
                      </div>
                    </div>
                  </form>
                  
                  {foundUserData && (
                    <div className="mt-4 p-3 bg-scout-50 rounded-md">
                      <h3 className="font-semibold">{foundUserData.full_name || 'بدون اسم'}</h3>
                      <p className="text-sm text-scout-600">الرقم: {foundUserData.national_id}</p>
                      {foundUserData.role && (
                        <p className="text-sm text-scout-600">
                          الدور: {foundUserData.role === 'admin' ? 'مسؤول' : 'كشاف'}
                        </p>
                      )}
                      {foundUserData.email && (
                        <p className="text-sm text-scout-600">البريد: {foundUserData.email}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6 bg-white shadow-sm">
                <TabsTrigger value="profile" className="data-[state=active]:bg-scout-100">
                  <User className="h-4 w-4 ml-2" />
                  معلومات الحساب
                </TabsTrigger>
                <TabsTrigger value="badges" className="data-[state=active]:bg-scout-100">
                  <Badge className="h-4 w-4 ml-2" />
                  الشارات
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-scout-100">
                  <Key className="h-4 w-4 ml-2" />
                  الأمان
                </TabsTrigger>
              </TabsList>
              
              {/* Profile Information Tab */}
              <TabsContent value="profile">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-white py-5 flex flex-row items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-scout-900">المعلومات الشخصية</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-4 w-4" />
                        {isEditing ? 'إلغاء التعديل' : 'تعديل المعلومات'}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">الاسم الكامل</label>
                            <Input
                              name="fullName"
                              defaultValue={userData?.full_name || ''}
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-scout-50' : ''}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">رقم الهوية</label>
                            <Input
                              name="nationalId"
                              defaultValue={userData?.national_id || ''}
                              readOnly={true}
                              className="bg-scout-50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">البريد الإلكتروني</label>
                            <Input
                              name="email"
                              defaultValue={userData?.email || ''}
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-scout-50' : ''}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">رقم الجوال</label>
                            <Input
                              name="phoneNumber"
                              defaultValue={userData?.phone_number || ''}
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-scout-50' : ''}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">العنوان</label>
                            <Input
                              name="address"
                              defaultValue={userData?.address || ''}
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-scout-50' : ''}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">تاريخ الميلاد</label>
                            <Input
                              name="dateOfBirth"
                              type="date"
                              defaultValue={formatDate(userData?.date_of_birth)}
                              readOnly={!isEditing}
                              className={!isEditing ? 'bg-scout-50' : ''}
                            />
                          </div>
                        </div>
                        {isEditing && (
                          <div className="flex justify-end">
                            <Button type="submit" variant="scout">
                              حفظ التغييرات
                            </Button>
                          </div>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Badges Tab */}
              <TabsContent value="badges">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden mb-8">
                    <CardHeader className="bg-white py-5">
                      <CardTitle className="text-xl font-semibold text-scout-900">الشارات المحصلة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockBadges.map((badge) => (
                          <div key={badge.id} className="flex flex-col items-center p-4 border border-scout-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="w-20 h-20 mb-3">
                              <img 
                                src={badge.imageUrl} 
                                alt={badge.name} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-scout-900 mb-1">{badge.name}</h3>
                            <p className="text-sm text-scout-600">
                              تم الحصول عليها في {format(new Date(badge.date), 'dd/MM/yyyy', { locale: ar })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-white py-5">
                      <CardTitle className="text-xl font-semibold text-scout-900">الشهادات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockCertificates.map((certificate) => (
                          <div key={certificate.id} className="flex p-4 border border-scout-200 rounded-lg hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 ml-4">
                              <img 
                                src={certificate.imageUrl} 
                                alt={certificate.name} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-scout-900 mb-1">{certificate.name}</h3>
                              <p className="text-sm text-scout-600">
                                تم الحصول عليها في {format(new Date(certificate.date), 'dd/MM/yyyy', { locale: ar })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-white py-5">
                      <CardTitle className="text-xl font-semibold text-scout-900">تغيير كلمة المرور</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordChange}>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">كلمة المرور الحالية</label>
                            <Input type="password" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">كلمة المرور الجديدة</label>
                            <Input type="password" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-scout-700 mb-2">تأكيد كلمة المرور الجديدة</label>
                            <Input type="password" />
                          </div>
                          <div className="mt-6">
                            <Button type="submit" variant="scout">
                              تحديث كلمة المرور
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
