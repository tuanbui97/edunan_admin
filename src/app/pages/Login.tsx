import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../mockData';
import { School, UserCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState('');

  const handleLogin = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      
      // Navigate based on role
      switch (user.role) {
        case 'school':
          navigate('/school');
          break;
        case 'principal':
          navigate('/principal');
          break;
        case 'department-leader':
          navigate('/department-leader');
          break;
        case 'specialist':
          navigate('/specialist');
          break;
        case 'office':
          navigate('/office');
          break;
        case 'director':
          navigate('/director');
          break;
        default:
          navigate('/');
      }
    }
  };

  const roleUsers = selectedRole ? mockUsers.filter(u => u.role === selectedRole) : [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <School className="size-10 text-blue-600" />
          </div>
          <CardTitle className="text-center text-2xl">
            Hệ thống Tiếp nhận & Xử lý Kiến nghị
          </CardTitle>
          <CardDescription className="text-center">
            Sở Giáo dục & Đào tạo Nghệ An
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Chọn vai trò</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Chọn vai trò của bạn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">Giáo viên / Nhân viên trường</SelectItem>
                <SelectItem value="principal">Hiệu trưởng</SelectItem>
                <SelectItem value="department-leader">Lãnh đạo phòng ban</SelectItem>
                <SelectItem value="specialist">Chuyên viên phòng ban</SelectItem>
                <SelectItem value="office">Văn phòng Sở</SelectItem>
                <SelectItem value="director">Lãnh đạo Sở</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedRole && (
            <div className="space-y-2">
              <Label>Chọn tài khoản demo</Label>
              <div className="space-y-2">
                {roleUsers.map(user => (
                  <Button
                    key={user.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleLogin(user.id)}
                  >
                    <UserCircle className="mr-2 size-4" />
                    <div className="text-left">
                      <div>{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {user.schoolName || user.departmentName || 'Sở GD&ĐT'}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {!selectedRole && (
            <div className="text-center text-sm text-muted-foreground py-8">
              Vui lòng chọn vai trò để tiếp tục
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
