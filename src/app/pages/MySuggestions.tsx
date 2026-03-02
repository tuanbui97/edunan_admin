import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, Search, Filter } from 'lucide-react';

export default function MySuggestions() {
  const navigate = useNavigate();
  const { currentUser, suggestions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const mySuggestions = suggestions.filter(s => 
    s.schoolId === currentUser?.schoolId
  );

  const filteredSuggestions = mySuggestions.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchType = typeFilter === 'all' || s.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const stats = {
    all: mySuggestions.length,
    pending: mySuggestions.filter(s => s.status === 'pending').length,
    processing: mySuggestions.filter(s => s.status === 'assigned' || s.status === 'processing').length,
    completed: mySuggestions.filter(s => s.status === 'completed').length,
    rejected: mySuggestions.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Kiến nghị của tôi</h2>
          <p className="text-gray-600 mt-1">
            Quản lý và theo dõi các kiến nghị đã gửi
          </p>
        </div>
        <Button onClick={() => navigate('/create-suggestion')}>
          <FileText className="mr-2 size-4" />
          Tạo kiến nghị mới
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            Tất cả ({stats.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Chờ xử lý ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Đang xử lý ({stats.processing})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Hoàn thành ({stats.completed})
          </TabsTrigger>
          {stats.rejected > 0 && (
            <TabsTrigger value="rejected">
              Kết thúc ({stats.rejected})
            </TabsTrigger>
          )}
        </TabsList>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm theo tiêu đề, nội dung..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 size-4" />
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="sensitive">Nhạy cảm</SelectItem>
                  <SelectItem value="non-sensitive">Không nhạy cảm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {['all', 'pending', 'processing', 'completed', 'rejected'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {filteredSuggestions
              .filter(s => tab === 'all' || 
                     (tab === 'processing' && (s.status === 'assigned' || s.status === 'processing')) ||
                     s.status === tab)
              .length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  <FileText className="size-12 mx-auto mb-3 text-gray-400" />
                  <p>Không có kiến nghị nào</p>
                </CardContent>
              </Card>
            ) : (
              filteredSuggestions
                .filter(s => tab === 'all' || 
                       (tab === 'processing' && (s.status === 'assigned' || s.status === 'processing')) ||
                       s.status === tab)
                .map(suggestion => (
                  <Card
                    key={suggestion.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/suggestion/${suggestion.id}`)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg flex-1">
                          {suggestion.title}
                        </h3>
                        <Badge className={getStatusColor(suggestion.status)}>
                          {getStatusLabel(suggestion.status)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {suggestion.content}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="size-4" />
                          {suggestion.category}
                        </span>
                        <span>
                          {suggestion.departmentName}
                        </span>
                        <span>
                          {suggestion.type === 'sensitive' ? '🔒 Nhạy cảm' : '📝 Không nhạy cảm'}
                        </span>
                        <span>
                          {new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        {suggestion.priority && (
                          <Badge variant="outline" className={
                            suggestion.priority === 'high' ? 'border-red-500 text-red-700' :
                            suggestion.priority === 'medium' ? 'border-yellow-500 text-yellow-700' :
                            'border-gray-500 text-gray-700'
                          }>
                            {suggestion.priority === 'high' ? 'Ưu tiên cao' :
                             suggestion.priority === 'medium' ? 'Ưu tiên TB' : 'Ưu tiên thấp'}
                          </Badge>
                        )}
                      </div>

                      {suggestion.response && (
                        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm font-medium text-green-900 mb-1">
                            ✓ Đã có phản hồi
                          </p>
                          <p className="text-sm text-green-800 line-clamp-2">
                            {suggestion.response}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
