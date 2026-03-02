import { Outlet, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { LogOut, Menu, Bell, FileText, BarChart3, HelpCircle, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '../components/ui/sheet';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, suggestions } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/');
  };

  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'Trang chủ', path: getRolePath() },
    ];

    // Add create suggestion for school users and principals
    if (currentUser?.role === 'school' || currentUser?.role === 'principal') {
      baseItems.push(
        { icon: FileText, label: 'Gửi kiến nghị mới', path: '/create-suggestion' }
      );
    }

    // Add FAQ for all
    baseItems.push({ icon: HelpCircle, label: 'Câu hỏi thường gặp', path: '/faq' });

    // Add statistics for leaders (not school, not principal, not specialist)
    if (['department-leader', 'office', 'director'].includes(currentUser?.role || '')) {
      baseItems.push({ icon: BarChart3, label: 'Thống kê', path: '/statistics' });
    }

    return baseItems;
  };

  const getRolePath = () => {
    switch (currentUser?.role) {
      case 'school': return '/school';
      case 'principal': return '/principal';
      case 'department-leader': return '/department-leader';
      case 'specialist': return '/specialist';
      case 'office': return '/office';
      case 'director': return '/director';
      default: return '/';
    }
  };

  const getRoleLabel = () => {
    const labels: Record<string, string> = {
      'school': 'Giáo viên / Nhân viên',
      'principal': 'Hiệu trưởng',
      'department-leader': 'Lãnh đạo phòng ban',
      'specialist': 'Chuyên viên',
      'office': 'Văn phòng Sở',
      'director': 'Lãnh đạo Sở',
    };
    return labels[currentUser?.role || ''] || '';
  };

  const pendingCount = suggestions.filter(s => s.status === 'pending').length;

  const menuItems = getMenuItems();

  const MenuContent = () => (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          className="w-full justify-start"
          onClick={() => {
            navigate(item.path);
            setMobileMenuOpen(false);
          }}
        >
          <item.icon className="mr-2 size-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <MenuContent />
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block text-blue-600">
                <svg className="size-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                </svg>
              </div>
              <div>
                <h1 className="font-semibold text-gray-900 text-sm lg:text-base">
                  Sở GD&ĐT Nghệ An
                </h1>
                <p className="text-xs text-gray-600">
                  Hệ thống Tiếp nhận & Xử lý Kiến nghị
                </p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-5" />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </Button>
              
              <div className="hidden md:block text-right mr-2">
                <div className="font-medium text-sm">{currentUser.name}</div>
                <div className="text-xs text-gray-600">{getRoleLabel()}</div>
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="size-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-lg border p-4">
              <MenuContent />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}