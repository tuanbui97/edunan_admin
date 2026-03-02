import { useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function SpecialistDashboard() {
  const navigate = useNavigate();
  const { currentUser, suggestions } = useApp();

  const mySuggestions = suggestions.filter(s => 
    s.departmentId === currentUser?.departmentId && 
    s.type === 'sensitive' &&
    (s.status === 'assigned' || s.status === 'processing' || s.assignedTo === 'specialist-id')
  );

  const stats = {
    total: mySuggestions.length,
    assigned: mySuggestions.filter(s => s.status === 'assigned').length,
    processing: mySuggestions.filter(s => s.status === 'processing').length,
    completed: mySuggestions.filter(s => s.status === 'completed').length,
  };

  const assignedSuggestions = mySuggestions.filter(s => s.status === 'assigned');

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Chào mừng, {currentUser?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          Chuyên viên - {currentUser?.departmentName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số</p>
                <p className="text-3xl font-semibold mt-1">{stats.total}</p>
              </div>
              <FileText className="size-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cần xử lý</p>
                <p className="text-3xl font-semibold mt-1 text-yellow-600">{stats.assigned}</p>
              </div>
              <Clock className="size-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-3xl font-semibold mt-1 text-blue-600">{stats.processing}</p>
              </div>
              <AlertCircle className="size-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-3xl font-semibold mt-1 text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="size-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Kiến nghị cần xử lý</CardTitle>
          <CardDescription>Các kiến nghị được phân công cho bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {assignedSuggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="size-12 mx-auto mb-3 text-gray-400" />
              <p>Không có kiến nghị cần xử lý</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignedSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/suggestion/${suggestion.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex-1">
                      {suggestion.title}
                    </h4>
                    <Badge className="bg-blue-100 text-blue-800">
                      Cần xử lý
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {suggestion.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{suggestion.schoolName}</span>
                    <span>{suggestion.category}</span>
                    <span>
                      {new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    {suggestion.priority === 'high' && (
                      <Badge variant="outline" className="border-red-500 text-red-700">
                        Ưu tiên cao
                      </Badge>
                    )}
                    {suggestion.dueDate && (
                      <span className="text-orange-600">
                        Hạn: {new Date(suggestion.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* All My Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Tất cả kiến nghị của tôi</CardTitle>
          <CardDescription>Lịch sử xử lý kiến nghị</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mySuggestions.map(suggestion => (
              <div
                key={suggestion.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/suggestion/${suggestion.id}`)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex-1">
                    {suggestion.title}
                  </h4>
                  <Badge className={getStatusColor(suggestion.status)}>
                    {getStatusLabel(suggestion.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {suggestion.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{suggestion.schoolName}</span>
                  <span>{suggestion.category}</span>
                  <span>
                    {new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
