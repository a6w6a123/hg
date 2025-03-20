import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { Award, Calendar, MapPin, ClipboardCheck, User, Users, Shield, Home, Settings, LogOut, Bell, BarChart4, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/contexts/UserContext';
import StatisticsCards from '@/components/dashboard/StatisticsCards';
import ActivitiesAndTasks from '@/components/dashboard/ActivitiesAndTasks';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import VisualizationSection from '@/components/dashboard/VisualizationSection';

const Dashboard = () => {
  const { signOut } = useAuth();
  const { userData, isLoading } = useUserData();
  const navigate = useNavigate();
  
  const userName = userData?.full_name || 'الكشاف';

  // Handle navigation
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-scout-50" dir="rtl">
        <Sidebar className="border-l border-scout-200">
          <SidebarHeader className="flex items-center p-4 border-b border-scout-200">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gradient-to-br from-scout-600 to-scout-800 text-white shadow-md">
                <span className="text-lg font-bold">ك</span>
              </div>
              <span className="text-xl font-bold text-scout-900">كشافة</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="flex flex-col flex-grow py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-scout-500 font-medium">لوحة التحكم</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 font-medium bg-scout-100 w-full"
                        onClick={() => handleNavigation('/dashboard')}
                      >
                        <Home className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الرئيسية</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/badges')}
                      >
                        <Award className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الشارات</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/certificates')}
                      >
                        <Shield className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الشهادات</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/attendance')}
                      >
                        <Calendar className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الحضور والغياب</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-scout-500 font-medium">الأنشطة</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/trips')}
                      >
                        <MapPin className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الرحلات</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/tasks')}
                      >
                        <ClipboardCheck className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>المهام</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/programs')}
                      >
                        <Users className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>البرامج</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-6">
              <SidebarGroupLabel className="text-scout-500 font-medium">الإعدادات</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/profile')}
                      >
                        <User className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الملف الشخصي</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild className="group hover:bg-scout-100 transition-colors w-full">
                      <Button 
                        variant="ghost" 
                        className="flex items-center justify-start gap-3 py-2 px-3 rounded-md text-scout-800 w-full"
                        onClick={() => handleNavigation('/settings')}
                      >
                        <Settings className="h-5 w-5 text-scout-600 group-hover:text-scout-800" />
                        <span>الإعدادات</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="p-4 border-t border-scout-200">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 text-scout-800"
              onClick={signOut}
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
            <SidebarTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5 text-scout-600" />
              </Button>
            </SidebarTrigger>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-scout-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleNavigation('/profile')}
              >
                <User className="h-5 w-5 text-scout-600" />
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <WelcomeSection userName={userName} userData={userData} />
            <StatisticsCards />
            <VisualizationSection />
            <ActivitiesAndTasks />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
