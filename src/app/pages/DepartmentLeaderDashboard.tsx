import { useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { FileText, Clock, CheckCircle, AlertCircle, Users, Search } from 'lucide-react';
import { mockSchools } from '../mockData';
import { useState } from 'react';

export default function DepartmentLeaderDashboard() {
  const navigate = useNavigate();
  const { currentUser, suggestions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');

  const departmentSuggestions = suggestions.filter(s => 
    s.departmentId === currentUser?.departmentId && s.type === 'sensitive'
  );

  // Filter for search tab
  const filteredSuggestions = departmentSuggestions.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSchool = selectedSchool === 'all' || s.schoolId === selectedSchool;
    return matchSearch && matchSchool;
  });

  const stats = {
    total: departmentSuggestions.length,
    pending: departmentSuggestions.filter(s => s.status === 'pending').length,
    assigned: departmentSuggestions.filter(s => s.status === 'assigned').length,
    processing: departmentSuggestions.filter(s => s.status === 'processing').length,
    completed: departmentSuggestions.filter(s => s.status === 'completed').length,
  };

  const pendingSuggestions = departmentSuggestions.filter(s => s.status === 'pending');
  const processingSuggestions = departmentSuggestions.filter(s => s.status === 'processing');

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Chào mừng, {currentUser?.name}
        </h2>
        <p className="text-gray-600 mt-1">
          {currentUser?.departmentName}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-sm text-gray-600">Chờ tiếp nhận</p>
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
                <p className="text-sm text-gray-600">Đã phân công</p>
                <p className="text-3xl font-semibold mt-1 text-blue-600">{stats.assigned}</p>
              </div>
              <Users className="size-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-3xl font-semibold mt-1 text-purple-600">{stats.processing}</p>
              </div>
              <AlertCircle className="size-8 text-purple-400" />
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
            Chờ tiếp nhận ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="processing">
            Cần phê duyệt ({stats.processing})
          </TabsTrigger>
          <TabsTrigger value="search">
            Tra cứu
          </TabsTrigger>
          <TabsTrigger value="all">
            Tất cả
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Kiến nghị chờ tiếp nhận</CardTitle>
              <CardDescription>Phân công chuyên viên xử lý các kiến nghị mới</CardDescription>
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
                          Chờ tiếp nhận
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
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing">
          <Card>
            <CardHeader>
              <CardTitle>Kiến nghị cần phê duyệt</CardTitle>
              <CardDescription>Các kiến nghị đã được chuyên viên xử lý, chờ phê duyệt</CardDescription>
            </CardHeader>
            <CardContent>
              {processingSuggestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="size-12 mx-auto mb-3 text-gray-400" />
                  <p>Không có kiến nghị cần phê duyệt</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {processingSuggestions.map(suggestion => (
                    <div
                      key={suggestion.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/suggestion/${suggestion.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1">
                          {suggestion.title}
                        </h4>
                        <Badge className="bg-purple-100 text-purple-800">
                          Cần phê duyệt
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {suggestion.content}
                      </p>
                      {suggestion.response && (
                        <div className="p-3 bg-blue-50 rounded mb-3">
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            Kết quả xử lý:
                          </p>
                          <p className="text-sm text-blue-800 line-clamp-2">
                            {suggestion.response}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Xử lý bởi: {suggestion.assignedToName}</span>
                        <span>{suggestion.schoolName}</span>
                        <span>{suggestion.category}</span>
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
                Tra cứu kiến nghị
              </CardTitle>
              <CardDescription>Tìm kiếm theo trường học và từ khóa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <span>{suggestion.schoolName}</span>
                          <span>{suggestion.category}</span>
                          <span>
                            {new Date(suggestion.createdAt).toLocaleDateString('vi-VN')}
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
              <CardDescription>Danh sách tất cả kiến nghị của phòng ban</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {departmentSuggestions.map(suggestion => (
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
                      {suggestion.assignedToName && (
                        <span>Xử lý: {suggestion.assignedToName}</span>
                      )}
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