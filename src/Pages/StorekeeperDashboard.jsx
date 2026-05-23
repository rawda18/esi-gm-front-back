import { useState, useEffect } from 'react';
import { Icon } from '../components/Icon';
import ThemeToggel from '../components/ThemToggel';
import Sidebare3 from '../components/Sidebare3';
import {
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
  Wrench,
} from 'lucide-react';
import AddMaterialModal from './AddMaterialModal';
import AddMaintenanceModal from './AddMaintenanceModal';
import { useNavigate } from 'react-router-dom';
import { fetchMaterials, updateMaterialStatus, addMaterial, fetchInventoryStats } from '../Api/storekeeper.api';
import { addMaintenanceItem } from '../Api/maintenance.api';

const statusStyles = {
  Available: 'bg-green-100 text-green-600',
  Reserved: 'bg-blue-100 text-blue-600',
  'In Use': 'bg-purple-100 text-purple-600',
  'Under Maintenance': 'bg-orange-100 text-orange-600',
  Damaged: 'bg-red-100 text-red-600',
  Lost: 'bg-gray-200 text-gray-500',
};

export default function StorekeeperDashboard({ onAddMaintenance }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [qrItem, setQrItem] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddMaintenance, setShowAddMaintenance] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState([
    { label: 'Total Outputs', value: 0, icon: <Package size={24} />, iconColor: '#6366F1', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Available Items', value: 0, icon: <TrendingUp size={24} />, iconColor: '#05DF72', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Low Stock Alerts', value: 0, icon: <AlertTriangle size={24} />, iconColor: '#FDC700', iconBg: 'rgba(99,102,241,0.15)' },
    { label: 'Needs Maintenance', value: 0, icon: <Wrench size={24} />, iconColor: '#FF6467', iconBg: 'rgba(99,102,241,0.15)' },
  ]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(materials.length / itemsPerPage);
  const indexOfLastItem = page * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = Array.isArray(materials) ? materials.slice(indexOfFirstItem, indexOfLastItem) : [];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const materialsData = await fetchMaterials();
    const statsData = await fetchInventoryStats();
    setMaterials(Array.isArray(materialsData) ? materialsData : []);
    setStats(prev => [
      { ...prev[0], value: statsData.totalOutputs },
      { ...prev[1], value: statsData.available },
      { ...prev[2], value: statsData.lowStock },
      { ...prev[3], value: statsData.needsMaintenance },
    ]);
  };

  const handleStatusChange = async (id, newStatus) => {
    const success = await updateMaterialStatus(id, newStatus);
    if (success) {
      setMaterials(prev =>
        prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      );
      const newStats = await fetchInventoryStats();
      setStats(prevStats => [
        { ...prevStats[0], value: newStats.totalOutputs },
        { ...prevStats[1], value: newStats.available },
        { ...prevStats[2], value: newStats.lowStock },
        { ...prevStats[3], value: newStats.needsMaintenance },
      ]);
    }
  };

  const handleAddMaterial = async (item) => {
    try {
      const newItem = await addMaterial(item);
      setMaterials(prev => [...prev, newItem]);
      const newStats = await fetchInventoryStats();
      setStats(prevStats => [
        { ...prevStats[0], value: newStats.totalOutputs },
        { ...prevStats[1], value: newStats.available },
        { ...prevStats[2], value: newStats.lowStock },
        { ...prevStats[3], value: newStats.needsMaintenance },
      ]);
    } catch (error) {
      console.error('Failed to add material:', error);
    }
  };

  // ✅ DELETE function
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      try {
        const response = await fetch(`http://localhost:8000/storekeeper/materials/${id}/delete/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        });

        if (response.status === 200) {
          alert('Material deleted successfully');
          await loadData();
        } else if (response.status === 400) {
          const error = await response.json();
          alert(error.error || 'Cannot delete material because it is currently borrowed');
        } else {
          alert('Delete failed');
        }
      } catch (error) {
        console.error('Error deleting material:', error);
        alert('An error occurred while deleting');
      }
    }
  };

  // ✅ EDIT functions
  const handleEdit = (item) => {
    setEditingMaterial(item);
    setShowEditModal(true);
  };

  const handleUpdateMaterial = async (updatedMaterial) => {
    try {
      const response = await fetch(`http://localhost:8000/storekeeper/materials/${updatedMaterial.id}/update/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedMaterial)
      });

      if (response.status === 200) {
        alert('✅ Material updated successfully');
        await loadData();
        setShowEditModal(false);
      } else {
        alert('❌ Update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ An error occurred');
    }
  };

  const handleAddMaintenanceSubmit = async (form) => {
    try {
      const item = materials.find((m) => m.name === form.material);
      if (!item) {
        console.error('Material not found:', form.material);
        return;
      }
      await handleStatusChange(item.id, 'Under Maintenance');
      await addMaintenanceItem(item.id, form.issue, form.priority);
      await loadData();
      setShowAddMaintenance(false);
    } catch (error) {
      console.error('Failed to add maintenance:', error);
    }
  };

  return (
    <div className="flex dynamic-bg transition-colors duration-300" style={{ fontFamily: 'Inter' }}>
      <Sidebare3 activeLabel="Dashboard" />
      <main className="flex-1 relative overflow-y-auto p-4 sm:p-6 lg:p-8">
        

        
        <div className="w-full mb-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
            <div className="whitespace-nowrap">
              <h2 className="text-title-custom text-[30px] mt-3">Storekeeper Dashboard</h2>
              <p className="text-small-custom text-sm mt-[-9px]">
                Manage laboratory inventory and materials
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddMaintenance(true)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-xl text-sm transition-all"
              >
                <Wrench size={18} /> Add to Maintenance
              </button>
              <button
                onClick={() => setShowAddMaterial(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-xl text-sm transition-all"
              >
                + Add Material
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 glass-card border-1 border-[#1E40AF4D] w-[190px] h-[110px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-small-custom whitespace-nowrap">{s.label}</p>
                  <div
                    className="p-1.5 rounded-lg mt-[-11px]"
                    style={{ background: s.iconBg, color: s.iconColor }}
                  >
                    {s.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold mt-[-20px]" style={{ color: s.iconColor }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Inventory Table */}
          <div className="card-bg rounded-3xl border-1 border-[var(--br)] p-6 mb-8 bg-[var(--card)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-title-custom">Inventory Management</h3>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-small-custom"
                  size={18}
                />
                <input
                  type="text"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search materials..."
                  className="bg-[var(--btn-signin-bg)] border-1 border-[var(--br)] rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 text-small-custom"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[650px]">
                <thead>
                  <tr className="text-small-custom text-[11px] uppercase border-b border-[var(--br)]">
                    <th className="pb-3 font-semibold">Material Name</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Quantity</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Location</th>
                    <th className="pb-3 font-semibold">QR Code</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-title-custom">
                  {currentMaterials.map((item) => (
                    <tr key={item.id} className="border-b border-[var(--card-border)] last:border-0">
                      <td className="py-4">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-xs text-small-custom">
                          {item.desc?.substring(0, 30) || 'No description'}
                        </p>
                      </td>
                      <td className="py-4 text-small-custom">{item.category}</td>
                      <td className="py-4 font-medium cursor-pointer hover:text-indigo-500" onClick={() => setQrItem(item)}>
                        {item.qty}
                      </td>
                      <td className="py-4">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-none outline-none cursor-pointer ${statusStyles[item.status] || 'bg-gray-100 text-gray-600'}`}
                        >
                          <option value="Available">Available</option>
                          <option value="Reserved">Reserved</option>
                          <option value="In Use">In Use</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Damaged">Damaged</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-4 text-small-custom">{item.loc}</td>
                      <td className="py-4">
                        <button className="text-indigo-500 hover:underline" onClick={() => setQrItem(item)}>View</button>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2 text-gray-400">
                          <Pencil size={16} className="cursor-pointer hover:text-indigo-500" onClick={() => handleEdit(item)} />
                          <Trash2 size={16} className="cursor-pointer hover:text-red-500" onClick={() => handleDelete(item.id)} />
                          <ArrowRight size={16} className="cursor-pointer hover:text-indigo-500" onClick={() => console.log('Transfer material:', item)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Materials Catalog */}
          <div className="card-bg rounded-3xl border-1 border-[var(--br)] mt-8 mb-6">
            <div className="bg-[linear-gradient(90deg,rgba(30,64,175,0.2)_0%,rgba(173,70,255,0.2)_100%)] rounded-3xl py-2 px-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                <div className="flex flex-col gap-1 px-6">
                  <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg">
                    <span className="scale-[1.5]">
                      <Package size={24} />
                    </span>
                    <span className="text-2xl text-title-custom">Materials Catalog</span>
                  </div>
                  <p className="text-xs text-small-custom ml-7">Showing materials</p>
                </div>
                <button onClick={() => navigate('/inventory')} className="mr-5 flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-[10px] text-xs font-semibold transition-all mt-3">
                  View Inventory <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((item) => (
                <div key={item.id} className="card-bg rounded-2xl p-3 border-1 border-[var(--br)] bg-[var(--card)] shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 transition-all flex flex-col h-full mt-2">
                  <div className="mb-1">
                    <h4 className="font-bold text-title-custom text-base truncate">{item.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300 px-2.5 py-1 rounded-full font-bold uppercase">
                      {item.category || 'General'}
                    </span>
                  </div>
                  <p className="text-[15px] text-small-custom leading-relaxed flex-grow">{item.desc}</p>
                  <div className="space-y-2 border-t border-dashed border-[var(--br)]">
                    <div className="flex items-center gap-1.5 text-small-custom text-xs">
                      <span className="font-medium">Specifications</span>
                    </div>
                    <div className="gap-x-4 gap-y-2 text-xs">
                      <div className="flex justify-between items-center bg-[var(--gradient-mid)] p-2 rounded-lg">
                        <span className="text-small-custom">Quantity:</span>
                        <span className={`font-bold ${item.qty > 20 ? 'text-green-500' : 'text-orange-500'}`}>{item.qty}</span>
                      </div>
                      <div className="flex justify-between items-center bg-[var(--gradient-mid)] p-2 rounded-lg">
                        <span className="text-small-custom">Location:</span>
                        <span className="text-title-custom font-medium">{item.loc}</span>
                      </div>
                      <div className="col-span-2 flex justify-between items-center bg-[var(--gradient-mid)] p-2 rounded-lg">
                        <span className="text-small-custom">Laboratory:</span>
                        <span className="text-title-custom font-medium truncate ml-2">{item.lab}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--card-border)]">
              <button onClick={() => setPage(page - 1)} disabled={page === 1} className="flex items-center gap-1.5 bg-[var(--gradient-mid)] hover:bg-gray-200 dark:hover:bg-gray-700 text-title-custom px-3.5 py-1.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-[-9px]">
                <ChevronLeft size={16} /> Previous
              </button>
              <div className="text-sm text-small-custom">
                Page <span className="font-bold text-title-custom">{page}</span> of{' '}
                <span className="font-medium text-title-custom">{totalPages}</span>
              </div>
              <button onClick={() => page < totalPages && setPage(page + 1)} disabled={page === totalPages} className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-sm transition-all mt-[-9px]">
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* QR Modal */}
        {qrItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setQrItem(null)}>
            <div className="bg-[var(--muted)] dark:bg-gray-900 rounded-2xl p-6 w-72 flex flex-col items-center gap-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-title-custom self-start">QR Code</h3>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-7"></div>
              <p className="font-bold text-title-custom">{qrItem.name}</p>
              <p className="text-xs text-small-custom mt-[-12px]">Code: QR-{qrItem.name.toUpperCase().replace(/\s+/g, '-')}-001</p>
              <button onClick={() => setQrItem(null)} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-xl text-sm transition-all">Close</button>
            </div>
          </div>
        )}

        {/* Add Material Modal */}
        {showAddMaterial && <AddMaterialModal onClose={() => setShowAddMaterial(false)} onAdd={handleAddMaterial} />}

        {/* Add Maintenance Modal */}
        {showAddMaintenance && (
          <AddMaintenanceModal
            onClose={() => setShowAddMaintenance(false)}
            materials={materials}
            onSubmit={handleAddMaintenanceSubmit}
          />
        )}

        {/* ✅ EDIT MODAL */}
        {showEditModal && editingMaterial && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4">Edit Material</h3>
              <input
                type="text"
                defaultValue={editingMaterial.name}
                id="edit-name"
                className="w-full p-2 border rounded mb-3 dark:bg-gray-800"
                placeholder="Name"
              />
              <input
                type="text"
                defaultValue={editingMaterial.category}
                id="edit-category"
                className="w-full p-2 border rounded mb-3 dark:bg-gray-800"
                placeholder="Category"
              />
              <input
                type="number"
                defaultValue={editingMaterial.qty}
                id="edit-quantity"
                className="w-full p-2 border rounded mb-3 dark:bg-gray-800"
                placeholder="Quantity"
              />
              <input
                type="text"
                defaultValue={editingMaterial.loc}
                id="edit-location"
                className="w-full p-2 border rounded mb-3 dark:bg-gray-800"
                placeholder="Location"
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-300 rounded dark:bg-gray-700">Cancel</button>
                <button
                  onClick={() => {
                    const updated = {
                      id: editingMaterial.id,
                      name: document.getElementById('edit-name').value,
                      category: document.getElementById('edit-category').value,
                      quantity: parseInt(document.getElementById('edit-quantity').value),
                      location: document.getElementById('edit-location').value,
                    };
                    handleUpdateMaterial(updated);
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}