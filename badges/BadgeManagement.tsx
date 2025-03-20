import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash, Edit, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BadgeData {
  id?: string;
  name: string;
  description: string;
  image_url: string;
  created_at?: string;
}

interface UserOption {
  id: string;
  full_name: string;
}

const BadgeManagement: React.FC = () => {
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<BadgeData | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBadges();
    fetchUsers();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("badges")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error: any) {
      console.error("Error fetching badges:", error.message);
      toast({
        variant: "destructive",
        title: "خطأ في جلب الشارات",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .order("full_name");

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsUploading(true);
      
      if (!name || !description) {
        toast({
          variant: "destructive",
          title: "خطأ في البيانات",
          description: "الرجاء إدخال جميع البيانات المطلوبة",
        });
        return;
      }

      let imageUrl = currentBadge?.image_url || "";

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `badges/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("badges")
          .upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("badges")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      if (currentBadge?.id) {
        // Update existing badge
        const { error } = await supabase
          .from("badges")
          .update({
            name,
            description,
            image_url: imageUrl,
          })
          .eq("id", currentBadge.id);

        if (error) throw error;
        toast({
          title: "تم تحديث الشارة بنجاح",
        });
      } else {
        // Add new badge
        const { error } = await supabase.from("badges").insert([
          {
            name,
            description,
            image_url: imageUrl,
          },
        ]);

        if (error) throw error;
        toast({
          title: "تمت إضافة الشارة بنجاح",
        });
      }

      resetForm();
      setIsDialogOpen(false);
      fetchBadges();
    } catch (error: any) {
      console.error("Error saving badge:", error.message);
      toast({
        variant: "destructive",
        title: "خطأ في حفظ الشارة",
        description: error.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("badges").delete().eq("id", id);

      if (error) throw error;
      toast({
        title: "تم حذف الشارة بنجاح",
      });
      fetchBadges();
    } catch (error: any) {
      console.error("Error deleting badge:", error.message);
      toast({
        variant: "destructive",
        title: "خطأ في حذف الشارة",
        description: error.message,
      });
    }
  };

  const handleEdit = (badge: BadgeData) => {
    setCurrentBadge(badge);
    setName(badge.name);
    setDescription(badge.description);
    setImagePreview(badge.image_url);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setCurrentBadge(null);
    setName("");
    setDescription("");
    setImageFile(null);
    setImagePreview(null);
  };

  const openNewBadgeDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleAssignBadge = async () => {
    try {
      if (!selectedBadgeId || !selectedUserId) {
        toast({
          variant: "destructive",
          title: "خطأ في البيانات",
          description: "الرجاء اختيار المستخدم والشارة",
        });
        return;
      }

      const { error } = await supabase.from("user_badges").insert([
        {
          user_id: selectedUserId,
          badge_id: selectedBadgeId,
        },
      ]);

      if (error) throw error;

      toast({
        title: "تم إسناد الشارة بنجاح",
      });
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      console.error("Error assigning badge:", error.message);
      toast({
        variant: "destructive",
        title: "خطأ في إسناد الشارة",
        description: error.message,
      });
    }
  };

  const openAssignDialog = (badgeId: string) => {
    setSelectedBadgeId(badgeId);
    setIsAssignDialogOpen(true);
  };

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-scout-800">إدارة الشارات</h1>
        <Button onClick={openNewBadgeDialog}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة شارة جديدة
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-scout-700" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <Card key={badge.id} className="overflow-hidden border border-scout-200">
              <div className="aspect-video w-full overflow-hidden bg-scout-100">
                {badge.image_url ? (
                  <img
                    src={badge.image_url}
                    alt={badge.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-scout-100 text-scout-500">
                    <Award className="h-12 w-12" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{badge.name}</span>
                  <Badge variant="outline" className="text-xs">
                    شارة
                  </Badge>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {badge.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(badge)}
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => badge.id && handleDelete(badge.id)}
                  >
                    <Trash className="h-4 w-4 ml-1" />
                    حذف
                  </Button>
                </div>
                <Button
                  variant="scout"
                  size="sm"
                  onClick={() => badge.id && openAssignDialog(badge.id)}
                >
                  إسناد
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for adding/editing badges */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentBadge ? "تعديل الشارة" : "إضافة شارة جديدة"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="badge-name">اسم الشارة</Label>
              <Input
                id="badge-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسم الشارة"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="badge-description">وصف الشارة</Label>
              <Textarea
                id="badge-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="أدخل وصف الشارة"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="badge-image">صورة الشارة</Label>
              <Input
                id="badge-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-2 border rounded overflow-hidden h-40">
                  <img
                    src={imagePreview}
                    alt="معاينة"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={isUploading}>
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentBadge ? "تحديث" : "إضافة"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for assigning badges to users */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إسناد الشارة لمستخدم</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="user-select">اختر المستخدم</Label>
              <Select onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المستخدم" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAssignBadge}>إسناد الشارة</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgeManagement;
