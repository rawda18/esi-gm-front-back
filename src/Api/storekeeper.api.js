// src/Api/storekeeper.api.js
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchMaterials = async () => {
  try {
    const response = await api.get('/storekeeper/materials/');
    return response.data.map(material => {
      let displayStatus = 'Available';
      const rawStatus = (material.status_display || material.status || 'available').toLowerCase();
      
      if (rawStatus === 'available') displayStatus = 'Available';
      else if (rawStatus === 'reserved') displayStatus = 'Reserved';
      else if (rawStatus === 'in use' || rawStatus === 'in_use') displayStatus = 'In Use';
      else if (rawStatus === 'under maintenance' || rawStatus === 'under_maintenance') displayStatus = 'Under Maintenance';
      else if (rawStatus === 'damaged') displayStatus = 'Damaged';
      else if (rawStatus === 'lost') displayStatus = 'Lost';
      else displayStatus = 'Available';
      
      return {
        id: material.id,
        name: material.name,
        category: material.category,
        desc: material.description || '',
        qty: material.quantity,
        loc: material.location || '',
        lab: material.laboratory?.name || '',
        status: displayStatus,
      };
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
};

export const updateMaterialStatus = async (id, newStatus) => {
  try {
    let backendStatus = '';
    
    if (newStatus === 'Available') backendStatus = 'available';
    else if (newStatus === 'Reserved') backendStatus = 'reserved';
    else if (newStatus === 'In Use') backendStatus = 'in_use';
    else if (newStatus === 'Under Maintenance') backendStatus = 'under_maintenance';
    else if (newStatus === 'Damaged') backendStatus = 'damaged';
    else if (newStatus === 'Lost') backendStatus = 'lost';
    else backendStatus = 'available';
    
    console.log('Sending status:', backendStatus);
    
    const response = await api.patch(`/storekeeper/materials/${id}/`, { status: backendStatus });
    return response.data;
  } catch (error) {
    console.error('Error updating material status:', error);
    return false;
  }
};

export const addMaterial = async (newMaterial) => {
  try {
    let labId = null;
    try {
      const labsResponse = await api.get('/api/laboratories/');
      const lab = labsResponse.data.find(lab => lab.name === newMaterial.lab);
      if (lab) labId = lab.id;
      else throw new Error(`Laboratory "${newMaterial.lab}" not found`);
    } catch (err) {
      console.warn('Failed to fetch labs, using default lab (id=1)');
      labId = 1;
    }

    const payload = {
      name: newMaterial.name,
      category: newMaterial.category,
      description: newMaterial.desc,
      quantity: newMaterial.qty,
      location: newMaterial.loc,
      laboratory_id: labId,
      unit: 'piece',
      min_stock: 0,
    };
    console.log('PAYLOAD:', payload);
    const response = await api.post('/storekeeper/materials/create/', payload);
    return {
      id: response.data.id,
      name: response.data.name,
      category: response.data.category,
      desc: response.data.description,
      qty: response.data.quantity,
      loc: response.data.location,
      lab: response.data.laboratory?.name || newMaterial.lab,
      status: response.data.status,
    };
  } catch (error) {
    console.error('Error adding material:', error);
    throw error;
  }
};

export const fetchInventoryStats = async () => {
  try {
    const response = await api.get('/storekeeper/stats/');
    return {
      totalOutputs: response.data.total_materials || 0,
      available: response.data.available_items || 0,
      lowStock: response.data.low_stock_alerts || 0,
      needsMaintenance: response.data.needs_maintenance || 0,
    };
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    const materials = await fetchMaterials();
    return {
      totalOutputs: materials.length,
      available: materials.filter(m => m.status === 'Available').length,
      lowStock: materials.filter(m => m.qty < 10).length,
      needsMaintenance: materials.filter(m => m.status === 'Under Maintenance').length,
    };
  }
};