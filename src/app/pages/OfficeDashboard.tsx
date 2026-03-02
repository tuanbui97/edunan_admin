import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, getStatusLabel, getStatusColor } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FileText, TrendingUp, Clock, CheckCircle, Search, Building } from 'lucide-react';
import { mockSchools, mockDepartments } from '../mockData';

export default function OfficeDashboard() {
  const navigate = useNavigate();
  const { suggestions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const stats = {
    total: suggestions.length,
    pending: suggestions.filter(s => s.status === 'pending').length,
    processing: suggestions.filter(s => s.status === 'assigned' || s.status === 'processing').length,
    completed: suggestions.filter(s => s.status === 'completed').length,
  };

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(s => {
    const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       s.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSchool = selectedSchool === 'all' || s.schoolId === selectedSchool;
    const matchDepartment = selectedDepartment === 'all' || s.departmentId === selectedDepartment;
    const matchStatus = selectedStatus === 'all' || s.status === selectedStatus;
    return matchSearch && matchSchool && matchDepartment && matchStatus;
  });

  // Data by department
  const byDepartment = Object.entries(
    suggestions.reduce((acc, s) => {
      acc[s.departmentName] = (acc[s.departmentName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({
    name: name.replace('Phòng ', ''),
    count
  }));

  // Data by status
  const byStatus = [
    { name: 'Chờ tiếp nhận', value: suggestions.filter(s => s.status === 'pending').length },
    { name: 'Đã phân công', value: suggestions.filter(s => s.status === 'assigned').length },
    { name: 'Đang xử lý', value: suggestions.filter(s => s.status === 'processing').length },
    { name: 'Hoàn thành', value: suggestions.filter(s => s.status === 'completed').length },
    { name: 'Kết thúc', value: suggestions.filter(s => s.status === 'rejected').length },
  ].filter(d => d.value > 0);

  // Data by category
  const byCategory = Object.entries(
    suggestions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Trend by month (mock data)
  const byMonth = [
    { month: 'T10', count: 8 },
    { month: 'T11', count: 12 },
    { month: 'T12', count: 10 },
    { month: 'T1', count: 15 },
    { month: 'T2', count: suggestions.length },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  const avgRating = suggestions
    .filter(s => s.rating)
    .reduce((acc, s) => acc + (s.rating || 0), 0) / suggestions.filter(s => s.rating).length || 0;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Tổng quan hệ thống
        </h2>
        <p className="text-gray-600 mt-1">
          Văn phòng và Truyền thông - Giám sát toàn tỉnh
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng kiến nghị</p>
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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="search">Tra cứu kiến nghị</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Kiến nghị theo phòng ban</CardTitle>
                <CardDescription>Phân bố kiến nghị giữa các phòng ban</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={byDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân bố theo trạng thái</CardTitle>
                <CardDescription>Tỷ lệ các trạng thái xử lý</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng theo tháng</CardTitle>
                <CardDescription>Số lượng kiến nghị qua các tháng</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={byMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#3b82f6" name="Số kiến nghị" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kiến nghị theo lĩnh vực</CardTitle>
                <CardDescription>Top lĩnh vực có nhiều kiến nghị nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={byCategory} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Mức độ hài lòng trung bình</p>
                  <div className="text-4xl font-semibold text-yellow-600 mb-2">
                    {avgRating.toFixed(1)} ⭐
                  </div>
                  <p className="text-sm text-gray-600">
                    ({suggestions.filter(s => s.rating).length} đánh giá)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Thời gian xử lý trung bình</p>
                  <div className="text-4xl font-semibold text-blue-600 mb-2">
                    4.5 ngày
                  </div>
                  <p className="text-sm text-gray-600">
                    Mục tiêu: &lt; 7 ngày
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Tỷ lệ hoàn thành</p>
                  <div className="text-4xl font-semibold text-green-600 mb-2">
                    {stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(0) : 0}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {stats.completed}/{stats.total} kiến nghị
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          {/* Search Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="size-5" />
                Tra cứu kiến nghị
              </CardTitle>
              <CardDescription>Tìm kiếm và lọc kiến nghị theo các tiêu chí</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <label className="text-sm font-medium">Phòng ban</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả phòng ban</SelectItem>
                      {mockDepartments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
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
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="pending">Chờ tiếp nhận</SelectItem>
                      <SelectItem value="assigned">Đã phân công</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="rejected">Kết thúc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card>
            <CardHeader>
              <CardTitle>Kết quả ({filteredSuggestions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSuggestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="size-12 mx-auto mb-3 text-gray-400" />
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
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building className="size-4" />
                          {suggestion.schoolName}
                        </span>
                        <span>{suggestion.departmentName}</span>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo và thống kê</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={() => navigate('/statistics')}>
            Xem chi tiết thống kê
          </Button>
          <Button variant="outline">
            Xuất báo cáo Excel
          </Button>
          <Button variant="outline">
            Báo cáo tuần
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
