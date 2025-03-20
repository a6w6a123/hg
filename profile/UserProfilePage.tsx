
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, ScrollText, MapPin, Calendar, CheckSquare, Star, User, Mail, Phone, MapPinned, CalendarDays, Edit } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const UserProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    bio: "",
  });

  // Fetch user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      // Set form data
      if (data) {
        setFormData({
          fullName: data.full_name || "",
          email: data.email || "",
          phone: data.phone_number || "",
          address: data.address || "",
          dateOfBirth: data.date_of_birth ? new Date(data.date_of_birth).toISOString().split('T')[0] : "",
          bio: data.bio || "",
        });
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Stats query
  const { data: statsData } = useQuery({
    queryKey: ['user-stats', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;
      
      // In a real app, this would fetch real stats from the database
      // For now, we'll return mock data
      return {
        badges: 5,
        certificates: 2,
        trips: 3,
        activities: 8,
        tasks: 12,
        points: 450,
      };
    },
    enabled: !!userData?.id,
  });

  // Recent achievements query (mock data for now)
  const { data: achievementsData } = useQuery({
    queryKey: ['user-achievements', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;
      
      return [
        { 
          id: 1, 
          type: 'badge', 
          title: 'شارة التخييم', 
          date: '2023-12-15', 
          icon: Award, 
          color: 'bg-amber-100 text-amber-600' 
        },
        { 
          id: 2, 
          type: 'certificate', 
          title: 'شهادة القائد المتميز', 
          date: '2024-01-20', 
          icon: ScrollText, 
          color: 'bg-blue-100 text-blue-600' 
        },
        { 
          id: 3, 
          type: 'trip', 
          title: 'رحلة المخيم الصيفي', 
          date: '2024-02-05', 
          icon: MapPin, 
          color: 'bg-green-100 text-green-600' 
        },
        { 
          id: 4, 
          type: 'task', 
          title: 'إكمال التدريب القيادي', 
          date: '2024-02-25', 
          icon: CheckSquare, 
          color: 'bg-purple-100 text-purple-600' 
        },
      ];
    },
    enabled: !!userData?.id,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = () => {
    // In a real app, this would update the user profile in the database
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث بيانات الملف الشخصي",
    });
    setIsEditProfileOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
  };

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-scout-700 mx-auto mb-4"></div>
          <p className="text-scout-700">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <Card className="bg-white border border-scout-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-scout-800 to-scout-600 h-32 relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2 text-white hover:bg-white/20"
                onClick={() => setIsEditProfileOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex justify-center -mt-16 px-6">
              <Avatar className="h-32 w-32 ring-4 ring-white">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.full_name || "User"}`} 
                  alt={userData?.full_name || "Profile"} 
                />
                <AvatarFallback className="text-2xl font-bold bg-scout-100 text-scout-800">
                  {userData?.full_name?.substring(0, 2) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <CardContent className="text-center pt-4">
              <h2 className="text-2xl font-bold text-scout-900 mb-1">{userData?.full_name}</h2>
              
              <div className="flex justify-center gap-2 mb-4">
                <Badge variant="outline">{userData?.role === 'admin' ? 'مسؤول النظام' : 'كشاف'}</Badge>
                <Badge variant="outline" className="bg-scout-50">رقم الهوية: {userData?.national_id}</Badge>
              </div>
              
              {statsData && (
                <div className="flex items-center justify-center gap-4 py-3 mb-4 border-y border-scout-100">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 text-amber-500" />
                    <span className="font-bold">{statsData.points}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-scout-50">
                    <User className="h-4 w-4 text-scout-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-scout-500">رقم الهوية</p>
                    <p className="font-medium">{userData?.national_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-scout-50">
                    <Mail className="h-4 w-4 text-scout-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-scout-500">البريد الإلكتروني</p>
                    <p className="font-medium">{userData?.email}</p>
                  </div>
                </div>
                
                {userData?.phone_number && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-scout-50">
                      <Phone className="h-4 w-4 text-scout-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-scout-500">رقم الجوال</p>
                      <p className="font-medium">{userData.phone_number}</p>
                    </div>
                  </div>
                )}
                
                {userData?.address && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-scout-50">
                      <MapPinned className="h-4 w-4 text-scout-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-scout-500">العنوان</p>
                      <p className="font-medium">{userData.address}</p>
                    </div>
                  </div>
                )}
                
                {userData?.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-scout-50">
                      <CalendarDays className="h-4 w-4 text-scout-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-scout-500">تاريخ الميلاد</p>
                      <p className="font-medium">{formatDate(userData.date_of_birth)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Stats Card */}
          {statsData && (
            <Card className="bg-white border border-scout-100 shadow-sm mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-scout-900">الإحصائيات</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-scout-600">الشارات</span>
                    <span className="text-sm font-medium">{statsData.badges}</span>
                  </div>
                  <Progress value={statsData.badges * 20} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-scout-600">الشهادات</span>
                    <span className="text-sm font-medium">{statsData.certificates}</span>
                  </div>
                  <Progress value={statsData.certificates * 50} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-scout-600">الرحلات</span>
                    <span className="text-sm font-medium">{statsData.trips}</span>
                  </div>
                  <Progress value={statsData.trips * 33} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-scout-600">المهام</span>
                    <span className="text-sm font-medium">{statsData.tasks}</span>
                  </div>
                  <Progress value={statsData.tasks * 8} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-scout-600">الأنشطة</span>
                    <span className="text-sm font-medium">{statsData.activities}</span>
                  </div>
                  <Progress value={statsData.activities * 12} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Card */}
          <Card className="bg-white border border-scout-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-scout-900">نبذة عني</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-scout-700">
                {userData?.bio || "لا توجد نبذة شخصية متاحة. يمكنك إضافة نبذة من خلال تعديل الملف الشخصي."}
              </p>
            </CardContent>
          </Card>
          
          {/* Achievements Tabs */}
          <Card className="bg-white border border-scout-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold text-scout-900">إنجازاتي</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-5 mb-6">
                  <TabsTrigger value="all">الكل</TabsTrigger>
                  <TabsTrigger value="badges">الشارات</TabsTrigger>
                  <TabsTrigger value="certificates">الشهادات</TabsTrigger>
                  <TabsTrigger value="trips">الرحلات</TabsTrigger>
                  <TabsTrigger value="tasks">المهام</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  {achievementsData && achievementsData.length > 0 ? (
                    <div className="space-y-4">
                      {achievementsData.map((achievement) => (
                        <div 
                          key={achievement.id} 
                          className="flex items-center gap-4 p-4 rounded-lg border border-scout-100 hover:bg-scout-50 transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.color}`}>
                            <achievement.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{achievement.title}</h4>
                            <p className="text-sm text-scout-600">{formatDate(achievement.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-scout-600">
                      <p>لا توجد إنجازات بعد</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="badges" className="mt-0">
                  {achievementsData && achievementsData.filter(a => a.type === 'badge').length > 0 ? (
                    <div className="space-y-4">
                      {achievementsData
                        .filter(a => a.type === 'badge')
                        .map((achievement) => (
                          <div 
                            key={achievement.id} 
                            className="flex items-center gap-4 p-4 rounded-lg border border-scout-100 hover:bg-scout-50 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.color}`}>
                              <achievement.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-scout-600">{formatDate(achievement.date)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-scout-600">
                      <p>لا توجد شارات بعد</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="certificates" className="mt-0">
                  {achievementsData && achievementsData.filter(a => a.type === 'certificate').length > 0 ? (
                    <div className="space-y-4">
                      {achievementsData
                        .filter(a => a.type === 'certificate')
                        .map((achievement) => (
                          <div 
                            key={achievement.id} 
                            className="flex items-center gap-4 p-4 rounded-lg border border-scout-100 hover:bg-scout-50 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.color}`}>
                              <achievement.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-scout-600">{formatDate(achievement.date)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-scout-600">
                      <p>لا توجد شهادات بعد</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="trips" className="mt-0">
                  {achievementsData && achievementsData.filter(a => a.type === 'trip').length > 0 ? (
                    <div className="space-y-4">
                      {achievementsData
                        .filter(a => a.type === 'trip')
                        .map((achievement) => (
                          <div 
                            key={achievement.id} 
                            className="flex items-center gap-4 p-4 rounded-lg border border-scout-100 hover:bg-scout-50 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.color}`}>
                              <achievement.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-scout-600">{formatDate(achievement.date)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-scout-600">
                      <p>لا توجد رحلات بعد</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tasks" className="mt-0">
                  {achievementsData && achievementsData.filter(a => a.type === 'task').length > 0 ? (
                    <div className="space-y-4">
                      {achievementsData
                        .filter(a => a.type === 'task')
                        .map((achievement) => (
                          <div 
                            key={achievement.id} 
                            className="flex items-center gap-4 p-4 rounded-lg border border-scout-100 hover:bg-scout-50 transition-colors"
                          >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${achievement.color}`}>
                              <achievement.icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{achievement.title}</h4>
                              <p className="text-sm text-scout-600">{formatDate(achievement.date)}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-scout-600">
                      <p>لا توجد مهام بعد</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right col-span-1">
                الاسم الكامل
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right col-span-1">
                البريد الإلكتروني
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right col-span-1">
                رقم الجوال
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right col-span-1">
                العنوان
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateOfBirth" className="text-right col-span-1">
                تاريخ الميلاد
              </Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right col-span-1">
                نبذة شخصية
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveProfile}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePage;
