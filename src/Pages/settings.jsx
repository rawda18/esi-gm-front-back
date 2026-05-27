// src/Pages/Settings.js

import { useState, useEffect } from 'react';
import { 
  Tag, Plus, Palette, Info, Bell, Cpu, Scissors, Shield, 
  Activity, FlaskConical, Monitor, Zap, Wifi, Atom, RefreshCw, Layers, 
  Scale, Server, Database, Radio, BatteryCharging, Camera, Printer,
  ScanLine, Headphones, Circle, X, Check 
} from 'lucide-react';
import Sidebare2 from '../components/Sidebare2';
import Sidebare3 from '../components/Sidebare3';
import { useTheme } from '../Context/ThemeContext';
import {
  fetchCategories,
  addCategory,
  deleteCategory,
  fetchNotificationPreferences,
  updateNotificationPreferences,
  fetchSystemInfo,
} from '../Api/settings.api';

// Available icon options for categories
const ICON_OPTIONS = [
  { name: 'Cpu', component: Cpu },
  { name: 'Scissors', component: Scissors },
  { name: 'Shield', component: Shield },
  { name: 'Activity', component: Activity },
  { name: 'FlaskConical', component: FlaskConical },
  { name: 'Monitor', component: Monitor },
  { name: 'Zap', component: Zap },
  { name: 'Wifi', component: Wifi },
  { name: 'Atom', component: Atom },
  { name: 'RefreshCw', component: RefreshCw },
  { name: 'Layers', component: Layers },
  { name: 'Scale', component: Scale },
  { name: 'Server', component: Server },
  { name: 'Database', component: Database },
  { name: 'Radio', component: Radio },
  { name: 'BatteryCharging', component: BatteryCharging },
  { name: 'Camera', component: Camera },
  { name: 'Printer', component: Printer },
  { name: 'ScanLine', component: ScanLine },
  { name: 'Headphones', component: Headphones },
  { name: 'Circle', component: Circle },
  { name: 'Palette', component: Palette },
];

// Suggested accent colors
const ACCENT_COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#a855f7'];

/**
 * Modal component for adding a new category
 */
function AddCategoryModal({ dark, onClose, onSave }) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Layers');
  const [loading, setLoading] = useState(false);

  const SelectedIconComp = ICON_OPTIONS.find((i) => i.name === selectedIcon)?.component || Layers;

  const handleSave = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      await onSave({ name: name.trim(), icon: selectedIcon });
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`w-[440px] rounded-2xl border shadow-xl flex flex-col ${
          dark ? 'bg-[#0B1120] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0]'
        }`}style={{ maxHeight: '90vh' }}
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-5 py-4 border-b ${
            dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'
          }`}
        >
          <h3 className={`text-base font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
            Add Category
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              dark ? 'hover:bg-gray-800 text-[#94A3B8]' : 'hover:bg-gray-100 text-[#64748B]'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Category Name Input */}
          <div className="mb-5">
            <label
              className={`block text-xs font-medium mb-2 ${
                dark ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
            >
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Microcontrollers"
              className={`w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                dark
                  ? 'bg-[#020817] border-[#2B4C9F] text-[#E8EAF0] placeholder-[#475569] focus:border-[#6366f1]'
                  : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A] placeholder-[#94A3B8] focus:border-[#6366f1]'
              }`}
            />
          </div>

          {/* Icon Grid Selection */}
          <div className="mb-5">
            <label
              className={`block text-xs font-medium mb-2 ${
                dark ? 'text-[#94A3B8]' : 'text-[#64748B]'
              }`}
            >
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map(({ name: iconName, component: IconComp }) => (
                <button
                  key={iconName}
                  onClick={() => setSelectedIcon(iconName)}
                  className={`aspect-square flex items-center justify-center rounded-xl border transition-all ${
                    selectedIcon === iconName
                      ? 'border-[#6366f1] bg-[#6366f1]/10 text-[#6366f1]'
                      : dark
                        ? 'border-[#2B4C9F] bg-[#020817] text-[#94A3B8] hover:border-[#6366f1]/50'
                        : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] hover:border-[#6366f1]/50'
                  }`}
                >
                  <IconComp size={17} />
                </button>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
              dark ? 'border-[#2B4C9F] bg-[#020817]' : 'border-[#E2E8F0] bg-[#F8FAFC]'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1]">
              <SelectedIconComp size={16} />
            </div>
            <span
              className={`text-sm ${
                name
                  ? dark
                    ? 'text-[#E8EAF0]'
                    : 'text-[#0F172A]'
                  : dark
                    ? 'text-[#475569]'
                    : 'text-[#94A3B8]'
              }`}
            >
              {name || 'Category name preview'}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`flex justify-end gap-3 px-5 py-4 border-t flex-shrink-0 ${
            dark ? 'border-[#2B4C9F]' : 'border-[#E2E8F0]'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              dark
                ? 'border-[#2B4C9F] text-[#94A3B8] hover:bg-gray-800'
                : 'border-[#E2E8F0] text-[#64748B] hover:bg-gray-50'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim() || loading}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-opacity ${
              name.trim() && !loading ? 'opacity-100' : 'opacity-40 cursor-not-allowed'
            } bg-[#2B4C9F] text-white hover:bg-[#1e3a8a]`}
          >
            <Check size={15} />
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Toggle Switch Component
 */
const Toggle = ({ checked, onChange, dark }) => (
  <button
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
      checked ? 'bg-[#2B4C9F]' : dark ? 'bg-[#1e2940]' : 'bg-gray-200'
    }`}
  >
    <span
      className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
        checked ? 'left-5' : 'left-0.5'
      }`}
    />
  </button>
);

/**
 * Main Settings Page Component
 */
export default function Settings() {
  const { darkMode: dark } = useTheme();
  const [userRole, setUserRole] = useState('');
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStock: true,
    maintenance: true,
    requests: true,
  });
  const [systemInfo, setSystemInfo] = useState({
    platformVersion: '',
    lastBackup: '',
    databaseStatus: '',
    storageUsed: 0,
    storageTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load user role from localStorage
  useEffect(() => {
    const role = localStorage.getItem('user_role') || localStorage.getItem('role') || 'admin';
    setUserRole(role);
  }, []);

  // Load all settings data on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        // Load categories
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        
        // Load notification preferences
        const notificationsData = await fetchNotificationPreferences();
        setNotifications(notificationsData);
        
        // Load system information
        const systemData = await fetchSystemInfo();
        setSystemInfo(systemData);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  /**
   * Save a new category
   */
  const handleSaveCategory = async ({ name, icon }) => {
    const newCategory = await addCategory({ name, icon });
    setCategories((prev) => [...prev, newCategory]);
  };

  /**
   * Delete a category
   */
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
        setCategories((prev) => prev.filter(cat => cat.id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(error.message);
      }
    }
  };

  /**
   * Update notification preference
   */
  const handleNotificationChange = async (key, value) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    await updateNotificationPreferences(updated);
  };

  // CSS Classes based on theme
  const cardClass = `rounded-2xl border p-5 mb-5 ${
    dark ? 'bg-[#0f172a] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0] shadow-sm'
  }`;

  const labelClass = `text-xs font-medium ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`;
  const titleClass = `text-sm font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`;
  const valueClass = `text-sm font-medium ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`;
  const sectionTitleClass = `text-base font-semibold ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`;

  if (loading) {
    return (
      <div className={`flex min-h-screen ${dark ? 'bg-[#0A0E1A]' : 'bg-[#FFF]'}`}>
        {userRole?.toLowerCase() === 'storekeeper' ? (
          <Sidebare3 activeLabel="Settings" />
        ) : (
          <Sidebare2 activeLabel="Settings" />
        )}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4C9F] mx-auto mb-4"></div>
            <p className={dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}>Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        dark ? 'bg-[#0A0E1A]' : 'bg-[#FFF]'
      }`}
      style={{ fontFamily: 'Inter' }}
    >
      {/* Add Category Modal */}
      {showModal && (
        <AddCategoryModal
          dark={dark}
          onClose={() => setShowModal(false)}
          onSave={handleSaveCategory}
        />
      )}

      {/* Sidebar based on user role */}
      {userRole?.toLowerCase() === 'storekeeper' ? (
        <Sidebare3 activeLabel="Settings" />
      ) : (
        <Sidebare2 activeLabel="Settings" />
      )}

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto ">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className={`text-3xl font-bold mt-0 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
              Settings
            </h2>
            <p className={`text-sm ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>
              Configure system settings and categories
            </p>
          </div>

          {/* Material Categories Section */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Tag size={18} className={dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} />
                <div>
                  <h3 className={sectionTitleClass}>Material Categories</h3>
                  <p className={labelClass}>{categories.length} categories defined</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B4C9F] text-white text-sm font-medium hover:bg-[#1e3a8a] transition-colors"
              >
                <Plus size={15} />
                Add Category
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 ">
              {categories.map((cat) => {
                const IconComp = ICON_OPTIONS.find((i) => i.name === cat.icon)?.component || Cpu;
                return (
                  <div
                    key={cat.id}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${
                      dark
                        ? 'border-[#2B4C9F] bg-[#020817]'
                        : 'border-[#E2E8F0] bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center text-[#6366f1] flex-shrink-0">
                        <IconComp size={15} />
                      </div>
                      <span className={`text-sm font-medium ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'}`}>
                        {cat.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <X size={14} className="text-red-500" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Theme Section */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-4">
              <Palette size={18} className={dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} />
              <h3 className={sectionTitleClass}>Color Theme</h3>
            </div>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className={`${labelClass} mb-2`}>Primary Color</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#2B4C9F]" />
                  <div>
                    <p className={valueClass}>#2B4C9F</p>
                    <p className={labelClass}>Indigo</p>
                  </div>
                </div>
              </div>
              <div>
                <p className={`${labelClass} mb-2`}>Accent Colors</p>
                <div className="flex gap-2 mt-1">
                  {ACCENT_COLORS.map((c) => (
                    <div key={c} className="w-6 h-6 rounded-full" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Information Section */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-4">
              <Info size={18} className={dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} />
              <h3 className={sectionTitleClass}>System Information</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className={`${labelClass} mb-1`}>Platform Version</p>
                <p className={valueClass}>{systemInfo.platformVersion}</p>
              </div>
              <div>
                <p className={`${labelClass} mb-1`}>Database Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-sm font-medium text-green-500">Connected</span>
                </div>
              </div>
              <div>
                <p className={`${labelClass} mb-1`}>Last Backup</p>
                <p className={valueClass}>{systemInfo.lastBackup}</p>
              </div>
              <div>
                <p className={`${labelClass} mb-1`}>Storage Used</p>
                <p className={valueClass}>{systemInfo.storageUsed} GB / {systemInfo.storageTotal} GB</p>
              </div>
            </div>
          </div>

          {/* Notification Preferences Section */}
          <div className={cardClass}>
            <div className="flex items-center gap-2 mb-4">
              <Bell size={18} className={dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} />
              <h3 className={sectionTitleClass}>Notification Preferences</h3>
            </div>
            {[
              {
                key: 'lowStock',
                label: 'Low Stock Alerts',
                desc: 'Notify when material quantity drops below threshold',
              },
              {
                key: 'maintenance',
                label: 'Maintenance Reminders',
                desc: 'Send reminders for upcoming maintenance schedules',
              },
              {
                key: 'requests',
                label: 'Request Notifications',
                desc: 'Notify about new material requests',
              },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                className={`flex items-center justify-between py-3 ${
                  i < arr.length - 1
                    ? dark
                      ? 'border-b border-[#1E293B]'
                      : 'border-b border-[#E2E8F0]'
                    : ''
                }`}
              >
                <div>
                  <p className={titleClass}>{item.label}</p>
                  <p className={labelClass}>{item.desc}</p>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={(v) => handleNotificationChange(item.key, v)}
                  dark={dark}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}