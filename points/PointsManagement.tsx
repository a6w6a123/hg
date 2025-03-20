
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, Plus, Award, Star, Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  full_name: string;
  national_id: string;
  points?: number;
}

interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  reason: string;
  created_at: string;
  created_by: string;
  creator_name?: string;
  user_name?: string;
}

const PointsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [points, setPoints] = useState<number>(0);
  const [reason, setReason] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const { toast } = useToast();

  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, national_id, points')
        .order('full_name');
        
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data as User[];
    }
  });

  // Fetch points transactions
  const { data: transactions, isLoading: isLoadingTransactions, refetch: refetchTransactions } = useQuery({
    queryKey: ['points-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_transactions')
        .select(`
          id, 
          user_id, 
          points, 
          reason, 
          created_at, 
          created_by,
          users!points_transactions_user_id_fkey (full_name),
          creators:users!points_transactions_created_by_fkey (full_name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      
      // Transform the nested data to a flat structure
      return data.map((transaction: any) => ({
        id: transaction.id,
        user_id: transaction.user_id,
        points: transaction.points,
        reason: transaction.reason,
        created_at: transaction.created_at,
        created_by: transaction.created_by,
        user_name: transaction.users?.full_name,
        creator_name: transaction.creators?.full_name
      })) as PointsTransaction[];
    }
  });

  const handleAddPoints = async () => {
    if (selectedUsers.length === 0 || points === 0) {
      toast({
        title: "بيانات غير مكتملة",
        description: "يرجى اختيار مستخدم واحد على الأقل وتحديد عدد النقاط",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get current user (admin)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("يجب تسجيل الدخول لإضافة النقاط");
      
      // Get admin user data
      const { data: adminData, error: adminError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();
        
      if (adminError) throw adminError;
      
      const adminId = adminData.id;
      
      // Create transactions for each selected user
      const transactions = selectedUsers.map(userId => ({
        user_id: userId,
        points: points,
        reason: reason,
        created_by: adminId
      }));
      
      // Insert transactions
      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert(transactions);
        
      if (transactionError) throw transactionError;
      
      // Update users' points
      for (const userId of selectedUsers) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('points')
          .eq('id', userId)
          .single();
          
        if (userError) continue;
        
        const currentPoints = userData.points || 0;
        
        await supabase
          .from('users')
          .update({ points: currentPoints + points })
          .eq('id', userId);
      }
      
      toast({
        title: "تمت إضافة النقاط",
        description: `تم منح ${points} نقطة لـ ${selectedUsers.length} مستخدم`,
      });
      
      setSelectedUsers([]);
      setPoints(0);
      setReason("");
      setIsAddDialogOpen(false);
      refetchTransactions();
    } catch (error: any) {
      console.error('Error adding points:', error);
      toast({
        title: "خطأ في إضافة النقاط",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(user => user.id) || []);
    }
    setSelectAll(!selectAll);
  };

  const filteredUsers = users?.filter(user => 
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.national_id.includes(searchQuery)
  ) || [];

  const filteredTransactions = transactions?.filter(transaction => 
    transaction.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.reason.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          
          <Button 
            variant="scout" 
            onClick={() => {
              setSelectedUsers([]);
              setPoints(0);
              setReason("");
              setSelectAll(false);
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة نقاط
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Users with their points */}
          <div className="flex-1 rounded-md border">
            <Table>
              <TableCaption>المستخدمين ونقاطهم</TableCaption>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">رقم الهوية</TableHead>
                  <TableHead className="text-right">النقاط</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-scout-700 rounded-full border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.national_id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="font-bold">{user.points || 0}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      لا توجد نتائج للبحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Points transactions */}
          <div className="flex-1 rounded-md border">
            <Table>
              <TableCaption>معاملات النقاط</TableCaption>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">النقاط</TableHead>
                  <TableHead className="text-right">السبب</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingTransactions ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10">
                      <div className="flex justify-center">
                        <div className="animate-spin w-6 h-6 border-2 border-scout-700 rounded-full border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium">{transaction.user_name}</TableCell>
                      <TableCell>
                        <Badge className={transaction.points > 0 ? "bg-green-500" : "bg-red-500"}>
                          {transaction.points > 0 ? "+" : ""}{transaction.points}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={transaction.reason}>
                        {transaction.reason}
                      </TableCell>
                      <TableCell>{format(new Date(transaction.created_at), 'dd/MM/yyyy')}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      لا توجد معاملات
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Add Points Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>منح نقاط للمستخدمين</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>اختر المستخدمين</Label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Checkbox 
                    id="selectAll" 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll} 
                  />
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    اختر الكل
                  </label>
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                {users?.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2 rtl:space-x-reverse py-2 border-b last:border-0">
                    <Checkbox 
                      id={`user-${user.id}`} 
                      checked={selectedUsers.includes(user.id)} 
                      onCheckedChange={() => handleUserSelection(user.id)} 
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.full_name} ({user.national_id})
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                عدد النقاط
              </Label>
              <div className="col-span-3 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPoints(Math.max(0, points - 5))}
                >
                  -
                </Button>
                <Input
                  id="points"
                  type="number"
                  min="0"
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPoints(points + 5)}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                سبب المنح
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="col-span-3"
                rows={3}
                placeholder="اكتب سبب منح النقاط..."
              />
            </div>
          </div>
          <DialogFooter>
            <div className="w-full flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                سيتم منح <span className="font-bold text-scout-700">{points}</span> نقطة لـ <span className="font-bold text-scout-700">{selectedUsers.length}</span> مستخدم
              </div>
              <Button 
                type="submit" 
                onClick={handleAddPoints}
                disabled={selectedUsers.length === 0 || points === 0 || !reason}
              >
                <Award className="h-4 w-4 ml-2" />
                منح النقاط
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PointsManagement;
