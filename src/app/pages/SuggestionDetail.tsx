import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Separator } from '../components/ui/separator';
import { Switch } from '../components/ui/switch';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
  ArrowLeft, 
  Calendar, 
  Building, 
  User, 
  FileText, 
  Clock,
  CheckCircle,
  Star,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SuggestionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, suggestions, updateSuggestion } = useApp();
  
  const suggestion = suggestions.find(s => s.id === id);
  const [response, setResponse] = useState('');
  const [assignee, setAssignee] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [showRealIdentity, setShowRealIdentity] = useState(false);

  if (!suggestion) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Không tìm thấy kiến nghị</p>
          <Button variant="link" onClick={() => navigate(-1)} className="mt-4">
            Quay lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  const canAssign = currentUser?.role === 'department-leader' && suggestion.status === 'pending';
  const canDirectResponse = currentUser?.role === 'department-leader' && suggestion.status === 'pending';
  const canProcess = currentUser?.role === 'specialist' && suggestion.status === 'assigned';
  const canApprove = currentUser?.role === 'department-leader' && suggestion.status === 'processing';
  const canRate = (currentUser?.role === 'school' || currentUser?.role === 'principal') && 
                   suggestion.status === 'completed' && !suggestion.rating;
  const isPrincipal = currentUser?.role === 'principal' && suggestion.type === 'non-sensitive' && suggestion.status === 'pending';
  const canViewRealIdentity = currentUser?.role === 'department-leader' && suggestion.isAnonymous;
  const canRejectPrincipal = currentUser?.role === 'principal' && suggestion.type === 'non-sensitive' && suggestion.status === 'pending';
  const canRejectDepartmentLeader = currentUser?.role === 'department-leader' && suggestion.status === 'pending';

  // Get real identity if available
  const realCreatorName = suggestion.isAnonymous && showRealIdentity 
    ? `${suggestion.createdByName} (Thông tin thật: Nguyễn Văn A - GV Toán, Trường THCS A)` 
    : suggestion.createdByName;

  const handleAssign = () => {
    if (!assignee) {
      toast.error('Vui lòng chọn chuyên viên');
      return;
    }
    updateSuggestion(suggestion.id, {
      status: 'assigned',
      assignedTo: 'specialist-id',
      assignedToName: assignee,
    });
    toast.success('Đã phân công xử lý');
  };

  const handleDirectResponseAndComplete = () => {
    if (!response) {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }
    updateSuggestion(suggestion.id, {
      status: 'completed',
      response: response,
    });
    toast.success('Đã gửi phản hồi và hoàn thành');
    setResponse('');
  };

  const handleSubmitResponse = () => {
    if (!response) {
      toast.error('Vui lòng nhập nội dung xử lý');
      return;
    }
    updateSuggestion(suggestion.id, {
      status: 'processing',
      response: response,
    });
    toast.success('Đã gửi kết quả xử lý');
    setResponse('');
  };

  const handleApprove = () => {
    updateSuggestion(suggestion.id, {
      status: 'completed',
    });
    toast.success('Đã phê duyệt và hoàn thành');
  };

  const handleReject = () => {
    if (!response) {
      toast.error('Vui lòng nhập lý do kt thúc');
      return;
    }
    updateSuggestion(suggestion.id, {
      status: 'rejected',
      response: response,
    });
    toast.success('Đã kết thúc kiến nghị');
    setResponse('');
  };

  const handleRate = () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn đánh giá');
      return;
    }
    updateSuggestion(suggestion.id, {
      rating: rating,
      ratingComment: ratingComment,
    });
    toast.success('Cảm ơn bạn đã đánh giá!');
  };

  const handleForwardToDepartment = () => {
    updateSuggestion(suggestion.id, {
      type: 'sensitive',
      status: 'pending',
    });
    toast.success('Đã chuyển tiếp kiến nghị lên Sở');
  };

  const handlePrincipalResponse = () => {
    if (!response) {
      toast.error('Vui lòng nhập phản hồi');
      return;
    }
    updateSuggestion(suggestion.id, {
      status: 'completed',
      response: response,
    });
    toast.success('Đã gửi phản hồi');
    setResponse('');
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 size-4" />
        Quay lại
      </Button>

      {/* View Real Identity - Place at top for department leaders */}
      {canViewRealIdentity && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium mb-1">Quyền truy cập thông tin thật</p>
              <p className="text-sm">
                Bật để xem thông tin thật của người gửi. Chỉ sử dụng khi thực sự cần thiết để xử lý kiến nghị.
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {showRealIdentity ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
              <Switch
                checked={showRealIdentity}
                onCheckedChange={setShowRealIdentity}
              />
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Suggestion Details */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{suggestion.title}</CardTitle>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="size-4" />
                  {new Date(suggestion.createdAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="size-4" />
                  {suggestion.schoolName}
                </span>
                <span className="flex items-center gap-1">
                  <User className="size-4" />
                  {realCreatorName}
                </span>
              </div>
            </div>
            <Badge className={getStatusColor(suggestion.status)}>
              {getStatusLabel(suggestion.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Loại kiến nghị</p>
              <p className="font-medium mt-1">
                {suggestion.type === 'sensitive' ? '🔒 Nhạy cảm' : '📝 Không nhạy cảm'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lĩnh vực</p>
              <p className="font-medium mt-1">{suggestion.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phòng ban phụ trách</p>
              <p className="font-medium mt-1">{suggestion.departmentName}</p>
            </div>
            {suggestion.priority && (
              <div>
                <p className="text-sm text-gray-600">Mức độ ưu tiên</p>
                <Badge className="mt-1" variant="outline">
                  {suggestion.priority === 'high' ? 'Cao' :
                   suggestion.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                </Badge>
              </div>
            )}
            {suggestion.assignedToName && (
              <div>
                <p className="text-sm text-gray-600">Người xử lý</p>
                <p className="font-medium mt-1">{suggestion.assignedToName}</p>
              </div>
            )}
            {suggestion.dueDate && (
              <div>
                <p className="text-sm text-gray-600">Hạn xử lý</p>
                <p className="font-medium mt-1 flex items-center gap-1">
                  <Clock className="size-4" />
                  {new Date(suggestion.dueDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Content */}
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="size-5" />
              Nội dung chi tiết
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap">
              {suggestion.content}
            </div>
          </div>

          {/* Response */}
          {suggestion.response && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="size-5 text-green-600" />
                  Phản hồi / Kết quả xử lý
                </h3>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200 whitespace-pre-wrap">
                  {suggestion.response}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Cập nhật lúc: {new Date(suggestion.updatedAt).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </>
          )}

          {/* Rating */}
          {suggestion.rating && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="size-5 text-yellow-500" />
                  Đánh giá
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`size-6 ${
                        star <= suggestion.rating! 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    ({suggestion.rating}/5 sao)
                  </span>
                </div>
                {suggestion.ratingComment && (
                  <p className="text-gray-700 italic">"{suggestion.ratingComment}"</p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions for Department Leader - Assign */}
      {canAssign && (
        <Card>
          <CardHeader>
            <CardTitle>Phân công xử lý</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="assignee">Chọn chuyên viên</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Chọn chuyên viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lê Văn C">Lê Văn C</SelectItem>
                  <SelectItem value="Nguyễn Văn X">Nguyễn Văn X</SelectItem>
                  <SelectItem value="Phạm Văn Y">Phạm Văn Y</SelectItem>
                  <SelectItem value="Lê Thị Z">Lê Thị Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAssign} className="w-full">
              Phân công
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions for Department Leader - Direct Response */}
      {canDirectResponse && (
        <Card>
          <CardHeader>
            <CardTitle>Phản hồi trực tiếp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Phản hồi</Label>
              <Textarea
                id="response"
                placeholder="Nhập nội dung phản hồi..."
                rows={6}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <Button onClick={handleDirectResponseAndComplete} className="w-full">
              Gửi phản hồi và hoàn thành
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions for Specialist - Process */}
      {canProcess && (
        <Card>
          <CardHeader>
            <CardTitle>Xử lý kiến nghị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="response">Kết quả xử lý / Tham mưu</Label>
              <Textarea
                id="response"
                placeholder="Nhập nội dung xử lý, tham mưu..."
                rows={6}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <Button onClick={handleSubmitResponse} className="w-full">
              Gửi kết quả xử lý
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions for Department Leader - Approve */}
      {canApprove && (
        <Card>
          <CardHeader>
            <CardTitle>Phê duyệt kết quả</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleApprove} className="w-full">
              <CheckCircle className="mr-2 size-4" />
              Phê duyệt và hoàn thành
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Actions for Principal - Response or Forward */}
      {isPrincipal && suggestion.status === 'pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Xử lý kiến nghị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal-response">Phản hồi</Label>
              <Textarea
                id="principal-response"
                placeholder="Nhập nội dung phản hồi..."
                rows={6}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handlePrincipalResponse} className="flex-1">
                Gửi phản hồi
              </Button>
              <Button variant="outline" onClick={handleForwardToDepartment}>
                Chuyển lên Sở
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions for School/Principal - Rate */}
      {canRate && (
        <Card>
          <CardHeader>
            <CardTitle>Đánh giá mức độ hài lòng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mức độ hài lòng</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`size-10 transition-colors ${
                        star <= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating-comment">Nhận xét (tùy chọn)</Label>
              <Textarea
                id="rating-comment"
                placeholder="Nhận xét về chất lượng xử lý..."
                rows={4}
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
              />
            </div>
            <Button onClick={handleRate} className="w-full" disabled={rating === 0}>
              Gửi đánh giá
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reject with reason for Principal */}
      {canRejectPrincipal && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Kết thúc kiến nghị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason-principal">Lý do kết thúc</Label>
              <Textarea
                id="reject-reason-principal"
                placeholder="Nhập lý do kết thúc kiến nghị..."
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <Button onClick={handleReject} variant="destructive" className="w-full">
              Kết thúc kiến nghị
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Reject with reason for Department Leader */}
      {canRejectDepartmentLeader && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Kết thúc kiến nghị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason-dept">Lý do kết thúc</Label>
              <Textarea
                id="reject-reason-dept"
                placeholder="Nhập lý do kết thúc kiến nghị..."
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
              />
            </div>
            <Button onClick={handleReject} variant="destructive" className="w-full">
              Kết thúc kiến nghị
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}