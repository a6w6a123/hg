
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Plus, Edit, Trash2, Upload, FileText, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Certificate {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  template_url?: string;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
  national_id: string;
}

const CertificateManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isIssueDialogOpen, setIsIssueDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [templateUrl, setTemplateUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    certificateNumber: "",
    notes: ""
  });
  const { toast } = useToast();

  // Fetch certificates
  const { data: certificates, isLoading: isLoadingCertificates, refetch: refetchCertificates } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching certificates:', error);
        throw error;
      }
      
      return data as Certificate[];
    }
  });

  // Fetch users for assignment
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, national_id')
        .order('full_name');
        
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      return data as User[];
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedTemplate(file);
  };

  const uploadFile = async (file: File | null, folder: string) => {
    if (!file) return "";
    
    const fileExt = file.name.split('.').pop();
    const filePath = `${folder}/${Date.now()}.${fileExt}`;
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error: any) {
      console.error(`Error uploading ${folder}:`, error);
      toast({
        title: `خطأ في رفع الملف`,
        description: error.message,
        variant: "destructive",
      });
      return "";
    }
  };

  const handleAddCertificate = async () => {
    try {
      // Upload files if selected
      let imageUrlUploaded = "";
      let templateUrlUploaded = "";
      
      if (selectedImage) {
        imageUrlUploaded = await uploadFile(selectedImage, 'certificate-images');
      }
      
      if (selectedTemplate) {
        templateUrlUploaded = await uploadFile(selectedTemplate, 'certificate-templates');
      }
      
      // Insert new certificate
      const { error } = await supabase
        .from('certificates')
        .insert({
          name: formData.name,
          description: formData.description,
          image_url: imageUrlUploaded,
          template_url: templateUrlUploaded,
        });
        
      if (error) throw error;
      
      toast({
        title: "تم إضافة الشهادة",
        description: `تم إضافة شهادة ${formData.name} بنجاح`,
      });
      
      // Reset form and close dialog
      setFormData({
        name: "",
        description: "",
        certificateNumber: "",
        notes: ""
      });
      setSelectedImage(null);
      setSelectedTemplate(null);
      setImageUrl("");
      setTemplateUrl("");
      setIsAddDialogOpen(false);
      refetchCertificates();
    } catch (error: any) {
      console.error('Error adding certificate:', error);
      toast({
        title: "خطأ في إضافة الشهادة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEditCertificate = async () => {
    if (!selectedCertificate) return;
    
    try {
      // Upload new files if selected
      let imageUrlUploaded = selectedCertificate.image_url || "";
      let templateUrlUploaded = selectedCertificate.template_url || "";
      
      if (selectedImage) {
        imageUrlUploaded = await uploadFile(selectedImage, 'certificate-images');
      }
      
      if (selectedTemplate) {
        templateUrlUploaded = await uploadFile(selectedTemplate, 'certificate-templates');
      }
      
      // Update certificate
      const { error } = await supabase
        .from('certificates')
        .update({
          name: formData.name,
          description: formData.description,
          image_url: imageUrlUploaded,
          template_url: templateUrlUploaded,
        })
        .eq('id', selectedCertificate.id);
        
      if (error) throw error;
      
      toast({
        title: "تم تعديل الشهادة",
        description: `تم تعديل شهادة ${formData.name} بنجاح`,
      });
      
      setIsEditDialogOpen(false);
      refetchCertificates();
    } catch (error: any) {
      console.error('Error editing certificate:', error);
      toast({
        title: "خطأ في تعديل الشهادة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCertificate = async () => {
    if (!selectedCertificate) return;
    
    try {
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', selectedCertificate.id);
        
      if (error) throw error;
      
      toast({
        title: "تم حذف الشهادة",
        description: `تم حذف شهادة ${selectedCertificate.name} بنجاح`,
      });
      
      setIsDeleteDialogOpen(false);
      refetchCertificates();
    } catch (error: any) {
      console.error('Error deleting certificate:', error);
      toast({
        title: "خطأ في حذف الشهادة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleIssueCertificate = async () => {
    if (!selectedCertificate || !selectedUser) return;
    
    try {
      const { error } = await supabase
        .from('user_certificates')
        .insert({
          user_id: selectedUser,
          certificate_id: selectedCertificate.id,
          certificate_number: formData.certificateNumber,
          notes: formData.notes,
        });
        
      if (error) throw error;
      
      toast({
        title: "تم إصدار الشهادة",
        description: `تم إصدار الشهادة بنجاح`,
      });
      
      setIsIssueDialogOpen(false);
      setSelectedUser("");
      setFormData({
        ...formData,
        certificateNumber: "",
        notes: ""
      });
    } catch (error: any) {
      console.error('Error issuing certificate:', error);
      toast({
        title: "خطأ في إصدار الشهادة",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredCertificates = certificates?.filter(certificate => 
    certificate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (certificate.description && certificate.description.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="بحث عن شهادة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
        
        <Button 
          variant="scout" 
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              certificateNumber: "",
              notes: ""
            });
            setSelectedImage(null);
            setSelectedTemplate(null);
            setImageUrl("");
            setTemplateUrl("");
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 ml-2" />
          إضافة شهادة جديدة
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableCaption>قائمة الشهادات المتاحة</TableCaption>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-right">اسم الشهادة</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">تاريخ الإضافة</TableHead>
              <TableHead className="text-right">صورة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingCertificates ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin w-6 h-6 border-2 border-scout-700 rounded-full border-t-transparent"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCertificates.length > 0 ? (
              filteredCertificates.map((certificate) => (
                <TableRow key={certificate.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{certificate.name}</TableCell>
                  <TableCell className="max-w-xs truncate" title={certificate.description}>
                    {certificate.description}
                  </TableCell>
                  <TableCell>{format(new Date(certificate.created_at), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    {certificate.image_url ? (
                      <a href={certificate.image_url} target="_blank" rel="noopener noreferrer" className="text-scout-700 hover:underline flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        عرض
                      </a>
                    ) : "لا توجد صورة"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCertificate(certificate);
                          setFormData({
                            name: certificate.name,
                            description: certificate.description || "",
                            certificateNumber: "",
                            notes: ""
                          });
                          setImageUrl(certificate.image_url || "");
                          setTemplateUrl(certificate.template_url || "");
                          setIsEditDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCertificate(certificate);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCertificate(certificate);
                          setSelectedUser("");
                          setFormData({
                            ...formData,
                            certificateNumber: "",
                            notes: ""
                          });
                          setIsIssueDialogOpen(true);
                        }}
                        className="h-8 text-scout-700"
                      >
                        منح للمستخدم
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  لا توجد نتائج للبحث
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Certificate Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>إضافة شهادة جديدة</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                اسم الشهادة
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                صورة الشهادة
              </Label>
              <div className="col-span-3">
                <Label 
                  htmlFor="certificate-image" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-scout-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط للرفع</span> أو اسحب وأفلت
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG أو PDF (MAX. 5MB)</p>
                  </div>
                  <Input 
                    id="certificate-image" 
                    type="file" 
                    accept="image/*,.pdf"
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </Label>
                {selectedImage && (
                  <div className="mt-2 text-sm text-scout-600">
                    تم اختيار: {selectedImage.name}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template" className="text-right">
                قالب الشهادة
              </Label>
              <div className="col-span-3">
                <Label 
                  htmlFor="certificate-template" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-scout-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط للرفع</span> أو اسحب وأفلت
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG أو PDF (MAX. 5MB)</p>
                  </div>
                  <Input 
                    id="certificate-template" 
                    type="file" 
                    accept="image/*,.pdf"
                    className="hidden" 
                    onChange={handleTemplateChange}
                  />
                </Label>
                {selectedTemplate && (
                  <div className="mt-2 text-sm text-scout-600">
                    تم اختيار: {selectedTemplate.name}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddCertificate}>
              إضافة الشهادة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Certificate Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>تعديل الشهادة</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                اسم الشهادة
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                الوصف
              </Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                صورة الشهادة
              </Label>
              <div className="col-span-3">
                {imageUrl && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <a 
                        href={imageUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-scout-700 hover:underline flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        عرض الصورة الحالية
                      </a>
                    </div>
                  </div>
                )}
                <Label 
                  htmlFor="edit-certificate-image" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-scout-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لتغيير الصورة</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG أو PDF (MAX. 5MB)</p>
                  </div>
                  <Input 
                    id="edit-certificate-image" 
                    type="file" 
                    accept="image/*,.pdf"
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </Label>
                {selectedImage && (
                  <div className="mt-2 text-sm text-scout-600">
                    تم اختيار: {selectedImage.name}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-template" className="text-right">
                قالب الشهادة
              </Label>
              <div className="col-span-3">
                {templateUrl && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2">
                      <a 
                        href={templateUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-scout-700 hover:underline flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        عرض القالب الحالي
                      </a>
                    </div>
                  </div>
                )}
                <Label 
                  htmlFor="edit-certificate-template" 
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-scout-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">اضغط لتغيير القالب</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG أو PDF (MAX. 5MB)</p>
                  </div>
                  <Input 
                    id="edit-certificate-template" 
                    type="file" 
                    accept="image/*,.pdf"
                    className="hidden" 
                    onChange={handleTemplateChange}
                  />
                </Label>
                {selectedTemplate && (
                  <div className="mt-2 text-sm text-scout-600">
                    تم اختيار: {selectedTemplate.name}
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditCertificate}>
              حفظ التغييرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Certificate Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>حذف الشهادة</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-4">هل أنت متأكد من حذف شهادة "{selectedCertificate?.name}"؟</p>
            <p className="text-destructive">هذا الإجراء لا يمكن التراجع عنه.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={handleDeleteCertificate}>
              حذف
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Issue Certificate Dialog */}
      <Dialog open={isIssueDialogOpen} onOpenChange={setIsIssueDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>منح شهادة "{selectedCertificate?.name}" لمستخدم</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user" className="text-right">
                المستخدم
              </Label>
              <Select
                value={selectedUser}
                onValueChange={setSelectedUser}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="اختر مستخدمًا" />
                </SelectTrigger>
                <SelectContent>
                  {users?.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.national_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="certificateNumber" className="text-right">
                رقم الشهادة
              </Label>
              <Input
                id="certificateNumber"
                name="certificateNumber"
                value={formData.certificateNumber}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="مثال: CERT-2024-001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                ملاحظات
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
                placeholder="أدخل أي ملاحظات حول منح هذه الشهادة..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleIssueCertificate} disabled={!selectedUser}>
              منح الشهادة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificateManagement;
