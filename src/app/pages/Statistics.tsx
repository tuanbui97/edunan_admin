import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState } from 'react';
import { mockDepartments, mockSchools } from '../mockData';

export default function Statistics() {
  const { suggestions } = useApp();
  const [timeRange, setTimeRange] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Filter by time and department
  const filteredSuggestions = suggestions.filter(s => {
    const matchDept = selectedDepartment === 'all' || s.departmentId === selectedDepartment;
    // For demo, showing all
    return matchDept;
  });

  // Data by department
  const byDepartment = mockDepartments.map(dept => ({
    name: dept.name.replace('Phòng ', ''),
    total: suggestions.filter(s => s.departmentId === dept.id).length,
    completed: suggestions.filter(s => s.departmentId === dept.id && s.status === 'completed').length,
    pending: suggestions.filter(s => s.departmentId === dept.id && s.status === 'pending').length,
  })).filter(d => d.total > 0);

  // Data by school
  const bySchool = mockSchools.map(school => ({
    name: school.name,
    count: suggestions.filter(s => s.schoolId === school.id).length,
  })).filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Data by district
  const byDistrict = Object.entries(
    mockSchools.reduce((acc, school) => {
      const count = suggestions.filter(s => s.schoolId === school.id).length;
      if (count > 0) {
        acc[school.district] = (acc[school.district] || 0) + count;
      }
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Data by status
  const byStatus = [
    { name: 'Chờ tiếp nhận', value: suggestions.filter(s => s.status === 'pending').length, color: '#f59e0b' },
    { name: 'Đã phân công', value: suggestions.filter(s => s.status === 'assigned').length, color: '#3b82f6' },
    { name: 'Đang xử lý', value: suggestions.filter(s => s.status === 'processing').length, color: '#8b5cf6' },
    { name: 'Hoàn thành', value: suggestions.filter(s => s.status === 'completed').length, color: '#10b981' },
    { name: 'Kết thúc', value: suggestions.filter(s => s.status === 'rejected').length, color: '#6b7280' },
  ].filter(d => d.value > 0);

  // Data by category
  const byCategory = Object.entries(
    suggestions.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  // Monthly trend
  const monthlyData = [
    { month: 'T8/2025', total: 5, completed: 4 },
    { month: 'T9/2025', total: 7, completed: 5 },
    { month: 'T10/2025', total: 8, completed: 7 },
    { month: 'T11/2025', total: 12, completed: 9 },
    { month: 'T12/2025', total: 10, completed: 8 },
    { month: 'T1/2026', total: 15, completed: 12 },
    { month: 'T2/2026', total: suggestions.length, completed: suggestions.filter(s => s.status === 'completed').length },
  ];

  // Performance by department (radar chart)
  const departmentPerformance = mockDepartments.map(dept => {
    const deptSugs = suggestions.filter(s => s.departmentId === dept.id);
    const completed = deptSugs.filter(s => s.status === 'completed').length;
    const total = deptSugs.length;
    return {
      department: dept.code,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      avgRating: (deptSugs.filter(s => s.rating).reduce((acc, s) => acc + (s.rating || 0), 0) / deptSugs.filter(s => s.rating).length || 0) * 20,
      responseSpeed: Math.floor(Math.random() * 30) + 70, // Mock data
    };
  }).filter(d => d.completionRate > 0);

  // Type distribution
  const byType = [
    { name: 'Nhạy cảm', value: suggestions.filter(s => s.type === 'sensitive').length, color: '#ef4444' },
    { name: 'Không nhạy cảm', value: suggestions.filter(s => s.type === 'non-sensitive').length, color: '#3b82f6' },
  ];

  // Priority distribution
  const byPriority = [
    { name: 'Cao', value: suggestions.filter(s => s.priority === 'high').length },
    { name: 'Trung bình', value: suggestions.filter(s => s.priority === 'medium').length },
    { name: 'Thấp', value: suggestions.filter(s => s.priority === 'low').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#f59e0b', '#3b82f6', '#8b5cf6', '#10b981', '#6b7280'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Thống kê và Báo cáo</h2>
          <p className="text-gray-600 mt-1">
            Phân tích tổng quan hệ thống
          </p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn phòng ban" />
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
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="department">Phòng ban</TabsTrigger>
          <TabsTrigger value="school">Trường học</TabsTrigger>
          <TabsTrigger value="trend">Xu hướng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Tổng kiến nghị</p>
                <p className="text-3xl font-semibold mt-1">{suggestions.length}</p>
                <p className="text-sm text-green-600 mt-2">↑ +12% so với tháng trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
                <p className="text-3xl font-semibold mt-1">
                  {suggestions.length > 0 ? Math.round((suggestions.filter(s => s.status === 'completed').length / suggestions.length) * 100) : 0}%
                </p>
                <p className="text-sm text-green-600 mt-2">↑ +5% so với tháng trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Thời gian xử lý TB</p>
                <p className="text-3xl font-semibold mt-1">4.5 ngày</p>
                <p className="text-sm text-green-600 mt-2">↓ -0.8 ngày</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600">Đánh giá TB</p>
                <p className="text-3xl font-semibold mt-1">
                  {(suggestions.filter(s => s.rating).reduce((acc, s) => acc + (s.rating || 0), 0) / suggestions.filter(s => s.rating).length || 0).toFixed(1)} ⭐
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {suggestions.filter(s => s.rating).length} đánh giá
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân bố theo trạng thái</CardTitle>
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
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kiến nghị theo lĩnh vực</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân loại kiến nghị</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={byType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mức độ ưu tiên</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={byPriority} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="category" dataKey="name" />
                    <YAxis type="number" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="department" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kiến nghị theo phòng ban</CardTitle>
              <CardDescription>Tổng số và trạng thái kiến nghị của từng phòng ban</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={byDepartment}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Tổng số" />
                  <Bar dataKey="completed" fill="#10b981" name="Hoàn thành" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Chờ xử lý" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất phòng ban</CardTitle>
              <CardDescription>Đánh giá tổng hợp về hiệu suất xử lý</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={departmentPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="department" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Tỷ lệ hoàn thành" dataKey="completionRate" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Radar name="Đánh giá" dataKey="avgRating" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Radar name="Tốc độ xử lý" dataKey="responseSpeed" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="school" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 trường có nhiều kiến nghị nhất</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={bySchool} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={200} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo địa bàn</CardTitle>
              <CardDescription>Số lượng kiến nghị từ các huyện/thành phố</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={byDistrict}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng theo thời gian</CardTitle>
              <CardDescription>Số lượng kiến nghị qua các tháng</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#3b82f6" name="Tổng số" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" name="Hoàn thành" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-2">Tăng trưởng tháng này</p>
                <p className="text-3xl font-semibold text-green-600">+12%</p>
                <p className="text-sm text-gray-600 mt-2">So với tháng trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-2">Cải thiện tỷ lệ hoàn thành</p>
                <p className="text-3xl font-semibold text-green-600">+5%</p>
                <p className="text-sm text-gray-600 mt-2">So với tháng trước</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-gray-600 mb-2">Giảm thời gian xử lý</p>
                <p className="text-3xl font-semibold text-green-600">-0.8 ngày</p>
                <p className="text-sm text-gray-600 mt-2">So với tháng trước</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
