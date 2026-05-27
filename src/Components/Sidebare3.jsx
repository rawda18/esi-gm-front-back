import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, QrCode,
  LogOut, Wrench, X, Menu, ArrowUpRight,
} from 'lucide-react';
import logo from '../Pages/logo.jpg';
import { useTheme } from '../Context/ThemeContext';
import ThemeToggle from './ThemToggel';

const NavButton = ({ label, icon: Icon, active, dark, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-[10px] rounded-xl text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-[#2B4C9F] text-white shadow-md'
        : dark
          ? 'text-[#E8EAF0] hover:bg-gray-800'
          : 'text-[#0F172A] hover:bg-gray-100'
    }`}
  >
    <Icon size={18} className={active ? 'text-white' : dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
    <span>{label}</span>
  </button>
);

export default function Sidebare3({ activeLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('Storekeeper');
  const [userRole, setUserRole] = useState('Staff');
  const navigate = useNavigate();
  const { darkMode: dark } = useTheme(); // ✅ من Context مباشرة

  useEffect(() => {
    const name = localStorage.getItem('user_name') || 'Storekeeper';
    const role = localStorage.getItem('user_role') || 'Staff';
    setUserName(name);
    setUserRole(role);
  }, []);

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/storekeeper' },
    { label: 'Inventory', icon: Package, path: '/inventory' },
    { label: 'QR Scanner', icon: QrCode, path: '/qr-scanner' },
    { label: 'Material Outputs', icon: ArrowUpRight, path: '/material-outputs' },
    { label: 'Maintenance', icon: Wrench, path: '/maintenance' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#2B4C9F] text-white rounded-lg shadow-lg"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[60] md:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 flex-shrink-0 z-[70] w-64 flex flex-col h-screen
          transition-transform duration-300 ease-in-out border-r
          ${dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0]'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0 md:flex
        `}
        style={{ fontFamily: 'Inter' }}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between h-[97px] px-6 border-b ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="w-11 h-11 rounded-full object-cover" />
            <div className="flex flex-col">
              <span className={`text-lg font-bold leading-tight ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>ESI-GM</span>
              <span className={`text-[10px] font-medium ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>Lab Equipment</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className={`md:hidden ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto mt-2">
          {navItems.map((item) => (
            <NavButton
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={activeLabel === item.label}
              dark={dark}
              onClick={() => { navigate(item.path); setIsOpen(false); }}
            />
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className={`flex flex-col items-start w-full pt-4 px-4 gap-3 border-t ${dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'}`}>
          <div className="flex gap-3 mb-1 ml-1">
            <div className="flex flex-col px-3">
              <div className={`text-sm font-bold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>{userName}</div>
              <div className={`text-xs ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{userRole}</div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-16 self-stretch mb-3">
            <ThemeToggle /> {/* ✅ نفس الزر */}
            <button
              onClick={() => { localStorage.clear(); navigate('/login'); }}
              className={`flex items-center gap-2 bg-transparent transition-colors hover:text-red-500 ${
                dark ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => navigate('/dashboard/storekeeper')}
          className={`flex justify-center items-center w-full h-[55px] border-t transition-all ${
            dark ? 'border-[#2B4C9F] hover:bg-red-900/10' : 'border-[#E2E8F0] hover:bg-red-50'
          }`}
        >
          <X size={20} className={dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} />
        </button>
      </aside>
    </>
  );
}