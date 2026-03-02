import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { mockSchools, mockDepartments, mockCategories } from '../mockData';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, Send, Paperclip, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateSuggestion() {
  const navigate = useNavigate();
  const { currentUser, addSuggestion } = useApp();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    type: 'non-sensitive' as 'sensitive' | 'non-sensitive',
    schoolId: currentUser?.schoolId || '',
    category: '',
    departmentId: '',
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments([...attachments, ...newFiles]);
      toast.success(`Đã thêm ${newFiles.length} file`);
    }
  };

  const removeFile = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on type
    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.type === 'sensitive' && !formData.departmentId) {
      toast.error('Vui lòng chọn phòng ban');
      return;
    }

    if (formData.type === 'non-sensitive' && !formData.schoolId) {
      toast.error('Vui lòng chọn trường học');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const school = mockSchools.find(s => s.id === formData.schoolId);
    const department = mockDepartments.find(d => d.id === formData.departmentId);

    addSuggestion({
      title: formData.title,
      content: formData.content,
      type: formData.type,
      category: formData.category,
      schoolId: formData.schoolId,
      schoolName: school?.name || '',
      departmentId: formData.departmentId,
      departmentName: department?.name || '',
      createdBy: currentUser?.id || '',
      createdByName: formData.type === 'sensitive' ? 'Ẩn danh' : currentUser?.name || '',
      isAnonymous: formData.type === 'sensitive',
      priority: formData.priority,
      attachments: attachments.map(file => file.name),
    });

    toast.success('Đã gửi kiến nghị thành công!');
    setLoading(false);
    navigate('/my-suggestions');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Gửi kiến nghị mới</CardTitle>
          <CardDescription>
            Phản ánh các vấn đề về chuyên môn, cơ sở vật chất, nhân sự, tài chính...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type Selection */}
            <div className="space-y-3">
              <Label>Loại kiến nghị *</Label>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as any })}
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="non-sensitive" id="non-sensitive" />
                  <Label htmlFor="non-sensitive" className="flex-1 cursor-pointer">
                    <div className="font-medium">Cấp trường</div>
                    <div className="text-sm text-gray-600">
                      Gửi đến Hiệu trưởng của trường. Hiệu trưởng có thể chuyển tiếp lên Sở nếu cần.
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-lg p-4">
                  <RadioGroupItem value="sensitive" id="sensitive" />
                  <Label htmlFor="sensitive" className="flex-1 cursor-pointer">
                    <div className="font-medium">Cấp Sở</div>
                    <div className="text-sm text-gray-600">
                      Gửi trực tiếp đến Phòng ban của Sở. Thông tin của bạn sẽ được ẩn danh.
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {formData.type === 'sensitive' && (
              <Alert>
                <AlertCircle className="size-4" />
                <AlertDescription>
                  Kiến nghị cấp Sở sẽ được gửi trực tiếp đến phòng ban phụ trách của Sở. 
                  Thông tin cá nhân của bạn sẽ được bảo mật và hiển thị là "Ẩn danh".
                </AlertDescription>
              </Alert>
            )}

            {/* School Selection (for non-sensitive) */}
            {formData.type === 'non-sensitive' && (
              <div className="space-y-2">
                <Label htmlFor="school">Trường học *</Label>
                <Select
                  value={formData.schoolId}
                  onValueChange={(value) => setFormData({ ...formData, schoolId: value })}
                >
                  <SelectTrigger id="school">
                    <SelectValue placeholder="Chọn trường" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSchools.map(school => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name} - {school.district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Lĩnh vực *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Chọn lĩnh vực" />
                </SelectTrigger>
                <SelectContent>
                  {mockCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department (for sensitive) */}
            {formData.type === 'sensitive' && (
              <div className="space-y-2">
                <Label htmlFor="department">Phòng ban phụ trách *</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Mức độ ưu tiên</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề kiến nghị *</Label>
              <Input
                id="title"
                placeholder="Tóm tắt nội dung kiến nghị"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung chi tiết *</Label>
              <Textarea
                id="content"
                placeholder="Mô tả chi tiết vấn đề cần phản ánh..."
                rows={6}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <Label htmlFor="attachments">Đính kèm file (nếu có)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                <Paperclip className="size-4" />
              </div>
              {attachments.length > 0 && (
                <div className="mt-2">
                  <Label className="font-bold">File đã chọn:</Label>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="bg-gray-100 px-2 py-1 rounded flex items-center">
                        {file.name}
                        <X
                          className="size-4 ml-2 cursor-pointer"
                          onClick={() => removeFile(index)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                <Send className="mr-2 size-4" />
                {loading ? 'Đang gửi...' : 'Gửi kiến nghị'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}