import { useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function SchoolDashboard() {
  const navigate = useNavigate();
  const { currentUser, suggestions } = useApp();

  const mySuggestions = suggestions.filter(s => 
    s.schoolId === currentUser?.schoolId
  );

  const stats = {
    total: mySuggestions.length,
    pending: mySuggestions.filter(s => s.status === 'pending' || s.status === 'assigned').length,
    processing: mySuggestions.filter(s => s.status === 'processing').length,
    completed: mySuggestions.filter(s => s.status === 'completed').length,
  };

  const recentSuggestions = mySuggestions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Chào mừng, {currentUser?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          {currentUser?.schoolName}
        </p>
      </div>

      {/* Quick Action */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Gửi kiến nghị mới</h3>
              <p className="text-blue-100">
                Phản ánh các vấn đề về chuyên môn, cơ sở vật chất, nhân sự...
              </p>
            </div>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/create-suggestion')}
            >
              <Plus className="mr-2 size-5" />
              Tạo kiến nghị
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số kiến nghị</p>
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
                <p className="text-sm text-gray-600">Chờ xử lý</p>
                <p className="text-3xl font-semibold mt-1 text-yellow-600">{stats.pending}</p>
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

      {/* Recent Suggestions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Kiến nghị gần đây</CardTitle>
              <CardDescription>5 kiến nghị mới nhất của trường bạn</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/my-suggestions')}>
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentSuggestions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="size-12 mx-auto mb-3 text-gray-400" />
              <p>Chưa có kiến nghị nào</p>
              <Button 
                variant="link" 
                onClick={() => navigate('/create-suggestion')}
                className="mt-2"
              >
                Tạo kiến nghị đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSuggestions.map(suggestion => (
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
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FileText className="size-4" />
                      {suggestion.category}
                    </span>
                    <span>
                      {new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span>
                      {suggestion.type === 'sensitive' ? '🔒 Nhạy cảm' : '📝 Không nhạy cảm'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
