import React, { useEffect, useMemo, useRef, useState } from 'react';
import Sidebare3 from '../components/Sidebare3';
import Sidebare2 from '../components/Sidebare2';
import {
  Box,
  QrCode,
  Users,
  ClipboardList,
  ArrowUpRight,
  Settings,
  LogOut,
  Moon,
  Sun,
  Search,
  ChevronDown,
  Cpu,
  Filter,
} from 'lucide-react';
import { getItems } from '../Api/inventory.api.js';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';

const mockApi = {
  categories: [
    { id: 1, name: 'Microcontrollers', count: 6, icon: '🎛️' },
    { id: 2, name: 'Single Board Computers', count: 3, icon: '💻' },
    { id: 3, name: 'Sensors', count: 11, icon: '📡' },
    { id: 4, name: 'Actuators & Motors', count: 6, icon: '⚙️' },
    { id: 5, name: 'Motor Drivers', count: 3, icon: '🔌' },
    { id: 6, name: 'Test Equipment', count: 4, icon: '🔬' },
    { id: 7, name: 'Networking Equipment', count: 3, icon: '🌐' },
    { id: 8, name: 'Cables & Connectors', count: 6, icon: '🔗' },
    { id: 9, name: 'Communication Modules', count: 5, icon: '📶' },
  ],
  items: [
    {
      id: 1,
      name: 'Arduino Uno R3',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'ATmega328P-based microcontroller board with 14 digital I/O pins',
      qty: 25,
      location: 'Shelf A1',
      lab: 'Electronics Lab',
    },
    {
      id: 2,
      name: 'Arduino Mega 2560',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'ATmega2560-based board with 54 digital I/O pins, ideal for complex projects',
      qty: 15,
      location: 'Shelf A1',
      lab: 'Electronics Lab',
    },
    {
      id: 3,
      name: 'Arduino Nano',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'Compact ATmega328P board, breadboard-friendly',
      qty: 30,
      location: 'Shelf A2',
      lab: 'Electronics Lab',
    },
    {
      id: 4,
      name: 'ESP32 DevKit',
      category: 'Microcontrollers',
      status: 'Available',
      desc: 'Dual-core microcontroller with Wi-Fi and Bluetooth, perfect for IoT',
      qty: 40,
      location: 'Shelf A3',
      lab: 'Embedded Systems Lab',
    },
    {
      id: 5,
      name: 'HC-SR04 Ultrasonic Sensor',
      category: 'Sensors',
      status: 'In Use',
      desc: 'Distance measurement sensor for robotics and automation projects',
      qty: 12,
      location: 'Shelf C1',
      lab: 'Robotics Lab',
    },
    {
      id: 6,
      name: 'L298N Motor Driver',
      category: 'Motor Drivers',
      status: 'Under Maintenance',
      desc: 'Dual H-bridge motor driver module for DC motors and steppers',
      qty: 8,
      location: 'Shelf D2',
      lab: 'Electronics Lab',
    },
  ],
};

const FilterDropdown = ({ label, dark, items = [], onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center gap-8 px-4 py-2.5 rounded-xl border cursor-pointer bg-[#2B4C9F] border-[#2B4C9F] text-white"
      >
        <span className="text-sm font-medium">{label}</span>
        <ChevronDown size={16} />
      </div>
      {open && (
        <div
          className={`absolute mt-2 w-52 rounded-xl border shadow-lg z-50 ${
            dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-gray-200'
          }`}
        >
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                dark ? 'hover:bg-gray-800' : ''
              }`}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LaboratoryInventory = () => {
  const { darkMode: dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('user_role') || localStorage.getItem('role') || 'admin';
    setUserRole(role);
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const data = await getItems();
        setItems(data);
        setCategories(mockApi.categories);
      } catch (error) {
        console.error('Failed to load data:', error);
        setItems(mockApi.items);
        setCategories(mockApi.categories);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'All Status' || item.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [items, searchTerm, categoryFilter, statusFilter]);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        dark ? 'bg-[#0A0E1A] text-[#FFF]' : 'bg-[#FFF] text-[#0A0E1A]'
      }`}
    >
      {userRole?.toLowerCase() === 'storekeeper' ? (
        <Sidebare3 activeLabel="Inventory" />
      ) : (
        <Sidebare2 activeLabel="Inventory" />
      )}

      <main className="flex-1 p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold">Laboratory Inventory</h2>
            <p className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-sm`}>
              Browse and search all available materials
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border ${
              dark ? 'bg-[#020817] border-[#2B4C9F]' : 'bg-white border-[#E2E8F0] hover:bg-gray-100'
            }`}
          >
            {dark ? <Sun size={20} className="text-[#FFF]" /> : <Moon size={20} className="text-[#0F172A]" />}
          </button>
        </header>

        <div
          className={`p-4 rounded-2xl border mb-6 ${
            dark
              ? 'bg-[#0f172a] border-[#2B4C9F]'
              : 'bg-white border-gray-100 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]'
          }`}
        >
          <div className="flex gap-4 items-center">
            <div
              className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl border ${
                dark ? 'bg-[#161b26] border-[#1E293B]' : 'bg-gray-50 border-[#E2E8F0]'
              }`}
            >
              <Search size={18} className={`${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'}`} />
              <input
                type="text"
                placeholder="Search materials by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <div className="flex gap-2">
              <FilterDropdown
                label={categoryFilter}
                dark={dark}
                items={['All Categories', ...categories.map((c) => c.name)]}
                onSelect={setCategoryFilter}
              />
              <FilterDropdown
                label={statusFilter}
                dark={dark}
                items={[
                  'All Status',
                  'Available',
                  'Reserved',
                  'In Use',
                  'Under Maintenance',
                  'Damaged',
                  'Lost',
                ]}
                onSelect={setStatusFilter}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 font-medium">
            <Filter size={14} /> Showing {filteredItems.length} of {items.length} materials
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`p-4 rounded-2xl border text-center transition-all hover:scale-[1.02] cursor-pointer ${
                dark ? 'bg-[#121825] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0] shadow-sm'
              }`}
            >
              <div className="flex items-start gap-2">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    dark ? 'bg-slate-800 text-blue-400' : 'bg-gray-50 text-gray-600'
                  }`}
                >
                  {cat.icon}
                </div>
                <p
                  className={`flex items-start pt-3 text-lg ${dark ? 'text-[#94A3B8]' : 'text-[#64748B]'} text-sm leading-none`}
                >
                  {cat.count}
                </p>
              </div>
              <p
                className={`text-[12px] font-semibold mt-1 ${dark ? 'text-[#E8EAF0]' : 'text-[#0F172A]'} tracking-tighter`}
              >
                {cat.name}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="text-sm text-slate-500">Loading inventory...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-3xl border overflow-hidden transition-all hover:shadow-lg ${
                  dark
                    ? 'bg-[#0f172a] border-[#2B4C9F]'
                    : 'bg-[rgba(241,245,249,0.30)] border-[#E2E8F0] shadow-sm'
                }`}
              >
                <div
                  className={`p-5 border-b ${dark ? 'border-[rgba(30,41,59,0.50)]' : 'border-gray-100/10'}`}
                >
                  <div
                    className={`border-b ${dark ? 'border-[rgba(30,41,59,0.50)]' : 'border-gray-100/10'} pb-3`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-base pb-1">{item.name}</h4>
                      <span className="text-[10px] border border-[rgba(0,201,80,0.20)] font-bold px-2 py-1 rounded-full bg-[rgba(0,201,80,0.10)] text-green-600">
                        {item.status}
                      </span>
                    </div>
                    <span className="flex items-start text-[10px] font-bold border border-[rgba(173,70,255,0.50)] px-2 py-1 rounded-lg bg-[rgba(173,70,255,0.20)] text-purple-600 w-fit items-center gap-1">
                      <Cpu size={12} /> {item.category}
                    </span>
                  </div>
                  <p
                    className={`text-xs mt-4 leading-relaxed ${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}
                  >
                    {item.desc}
                  </p>
                </div>

                <div
                  className={`p-5 border m-4 rounded-xl ${
                    dark
                      ? 'bg-[rgba(18,24,37,0.50)] border-[rgba(30,41,59,0.50)]'
                      : 'bg-[rgba(248,250,252,0.50)] border-[rgba(226,232,240,0.50)]'
                  } space-y-3`}
                >
                  <div className="flex justify-between text-xs">
                    <span
                      className={`font-medium flex items-center gap-1 ${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}
                    >
                      <Settings size={14} /> Specifications
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Quantity :</span>
                    <span className="font-bold text-green-500 bg-[rgba(0,201,80,0.20)] px-2 rounded">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Location :</span>
                    <span className="font-semibold">{item.location}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className={`${dark ? 'text-[#94A3B8]' : 'text-gray-500'}`}>Laboratory:</span>
                    <span className="font-semibold">{item.lab}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default LaboratoryInventory;