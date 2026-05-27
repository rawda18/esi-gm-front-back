import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Box, QrCode, Users, ClipboardList,
  Settings, LogOut, Wrench, X, ArrowUpRight,
} from 'lucide-react';
import logo from '../Pages/logo.jpg';
import { useTheme } from '../Context/ThemeContext';
import ThemeToggle from './ThemToggel';

const NavItem = ({ icon: Icon, label, active, dark, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
      active
        ? 'bg-[#2B4C9F] text-white shadow-md'
        : dark
          ? 'text-[#E8EAF0] hover:bg-gray-800'
          : 'text-[#0F172A] hover:bg-gray-100'
    }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default function Sidebare2({ activeLabel }) {
  const navigate = useNavigate();
  const { darkMode: dark } = useTheme(); // ✅ من Context مباشرة
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('Administrator');

  useEffect(() => {
    const name = localStorage.getItem('user_name') || 'Admin';
    const role = localStorage.getItem('user_role') || 'Administrator';
    setUserName(name);
    setUserRole(role);
  }, []);

  return (
    <aside
      className={`hidden md:flex md:w-64 flex-col border-r ${
        dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-[#FFF] border-[#E2E8F0]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-[97px] px-6 border-b ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}>
        <div className="flex-shrink-0 w-[48px] h-[48px]">
          <img src="/logo.png" alt="logo" className="w-full h-full rounded-full object-cover" />
        </div>
        <div className="ml-4">
          <h1 className={`text-base font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>ESI-GM</h1>
          <p className={`text-[10px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Lab Equipment</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 space-y-2">
        {[
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard/admin' },
          { icon: Box, label: 'Inventory', path: '/inventory' },
          { icon: QrCode, label: 'QR Scanner', path: '/qr-scanner' },
          { icon: Users, label: 'Users', path: '/users' },
          { icon: ClipboardList, label: 'Requests', path: '/requests' },
          { icon: ArrowUpRight, label: 'Material Outputs', path: '/material-outputs' },
          { icon: Wrench, label: 'Maintenance', path: '/maintenance' },
          { icon: Settings, label: 'Settings', path: '/settings' },
        ].map(({ icon, label, path }) => (
          <NavItem
            key={label}
            icon={icon}
            label={label}
            active={activeLabel === label}
            dark={dark}
            onClick={() => navigate(path)}
          />
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className={`p-6 border-t ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}>
        <div className="mb-4">
          <p className={`text-xs font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>{userName}</p>
          <p className={`text-[10px] ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{userRole}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <ThemeToggle /> {/* ✅ نفس الزر كـ Sidebare3 */}
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className={`flex items-center gap-2 transition-colors hover:text-red-500 ${
              dark ? 'text-[#94A3B8]' : 'text-[#64748B]'
            }`}
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => navigate('/dashboard/admin')}
        className={`flex flex-col items-start w-full h-[52px] pt-[16.667px] px-4 border-t ${
          dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'
        } bg-transparent rounded-none`}
      >
        <X className="w-[20px] h-[20px] flex-shrink-0" />
      </button>
    </aside>
  );
}
