import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, TrendingUp, Clock, CheckCircle, Search, Building } from 'lucide-react';
import { mockSchools } from '../mockData';

export default function PrincipalDashboard() {
  const navigate = useNavigate();
  const { currentUser, suggestions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const schoolSuggestions = suggestions.filter(s => 
    s.schoolId === currentUser?.schoolId && s.type === 'non-sensitive'
  );

  // Filter for search tab
  const filteredSuggestions = suggestions.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSchool = selectedSchool === 'all' || s.schoolId === selectedSchool;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchSearch && matchSchool && matchStatus;
  });

  const stats = {
    total: schoolSuggestions.length,
    pending: schoolSuggestions.filter(s => s.status === 'pending').length,
    processing: schoolSuggestions.filter(s => s.status === 'processing').length,
    completed: schoolSuggestions.filter(s => s.status === 'completed').length,
  };

  const pendingSuggestions = schoolSuggestions.filter(s => s.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Chào mừng, {currentUser?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          Hiệu trưởng - {currentUser?.schoolName}
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
              <TrendingUp className="size-8 text-blue-400" />
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

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Chờ xử lý ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="search">
            Tra cứu theo trường
          </TabsTrigger>
          <TabsTrigger value="all">
            Tất cả
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Kiến nghị chờ xử lý</CardTitle>
              <CardDescription>Các kiến nghị cần tiếp nhận và xử lý</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSuggestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="size-12 mx-auto mb-3 text-gray-400" />
                  <p>Không có kiến nghị chờ xử lý</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/suggestion/${suggestion.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1">
                          {suggestion.title}
                        </h4>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Chờ xử lý
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {suggestion.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Từ: {suggestion.createdByName}</span>
                        <span>{suggestion.category}</span>
                        <span>
                          {new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                        {suggestion.priority === 'high' && (
                          <Badge variant="outline" className="border-red-500 text-red-700">
                            Ưu tiên cao
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="size-5" />
                Tra cứu kiến nghị theo trường
              </CardTitle>
              <CardDescription>Tìm kiếm kiến nghị từ các trường trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tìm kiếm</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <Input
                      placeholder="Tiêu đề, nội dung..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trường học</label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trường</SelectItem>
                      {mockSchools.map(school => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trạng thái</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="rejected">Kết thúc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-3">Kết quả ({filteredSuggestions.length})</p>
                {filteredSuggestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Không tìm thấy kiến nghị phù hợp</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredSuggestions.map(suggestion => (
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
                          <span className="flex items-center gap-1">
                            <Building className="size-4" />
                            {suggestion.schoolName}
                          </span>
                          <span>{suggestion.category}</span>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tất cả kiến nghị</CardTitle>
              <CardDescription>Danh sách tất cả kiến nghị của trường</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {schoolSuggestions.map(suggestion => (
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
                      <span>Từ: {suggestion.createdByName}</span>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
