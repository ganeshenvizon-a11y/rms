import React, { useState } from 'react';
import { getStoredEmployees, setStoredEmployees, addAuditLog } from '../../services/managerService';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  UserCheck,
  Search,
  Plus,
  Edit2,
  Trash2,
  Mail,
  Phone,
  X
} from 'lucide-react';

const ROLES = [
  'General Manager',
  'Executive Head Chef',
  'Sous Chef',
  'Senior Server',
  'POS Cashier & Sommelier',
  'Host & Reservationist',
  'Bartender',
  'Kitchen Porter / Dishwasher'
];

const STATUS_DOT = {
  'Clocked In': 'bg-green-500',
  'Off Duty': 'bg-on-surface-variant/40',
  'On Leave': 'bg-amber-500',
};

const ManagerEmployeeView = () => {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState(() => getStoredEmployees());
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Senior Server',
    email: '',
    phone: '',
    avatar: '',
    shift: 'Evening Service (16:00 - 00:00)',
    status: 'Clocked In',
    hourlyRate: '22.00',
    department: 'Floor Service',
  });

  const saveEmployees = (updated) => {
    setEmployees(updated);
    setStoredEmployees(updated);
  };

  const handleToggleStatus = (empId) => {
    const updated = employees.map((e) => {
      if (e.id === empId) {
        const newStatus = e.status === 'Clocked In' ? 'Off Duty' : 'Clocked In';
        addAuditLog('Staff Status Toggled', `Toggled ${e.name} status to ${newStatus}`, 'staff');
        showToast(`${e.name} is now ${newStatus}`, 'info');
        return { ...e, status: newStatus };
      }
      return e;
    });
    saveEmployees(updated);
  };

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      role: 'Senior Server',
      email: '',
      phone: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      shift: 'Evening Service (16:00 - 00:00)',
      status: 'Clocked In',
      hourlyRate: '22.00',
      department: 'Floor Service',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name || '',
      role: emp.role || 'Senior Server',
      email: emp.email || '',
      phone: emp.phone || '',
      avatar: emp.avatar || '',
      shift: emp.shift || 'Evening Service (16:00 - 00:00)',
      status: emp.status || 'Clocked In',
      hourlyRate: emp.hourlyRate ? emp.hourlyRate.toString() : '22.00',
      department: emp.department || 'Floor Service',
    });
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (empId, empName) => {
    if (window.confirm(`Are you sure you want to remove "${empName}" from the staff roster?`)) {
      const updated = employees.filter((e) => e.id !== empId);
      saveEmployees(updated);
      addAuditLog('Employee Removed', `Removed ${empName} from employee roster`, 'staff');
      showToast(`Removed "${empName}" from staff roster`, 'error');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      showToast('Please provide employee name and email', 'error');
      return;
    }

    const rateNum = parseFloat(formData.hourlyRate) || 20.0;

    if (editingEmployee) {
      const updated = employees.map((e) =>
        e.id === editingEmployee.id
          ? {
              ...e,
              name: formData.name,
              role: formData.role,
              email: formData.email,
              phone: formData.phone,
              avatar: formData.avatar || e.avatar,
              shift: formData.shift,
              status: formData.status,
              hourlyRate: rateNum,
              department: formData.department,
            }
          : e
      );
      saveEmployees(updated);
      addAuditLog('Employee Updated', `Updated staff record for ${formData.name}`, 'staff');
      showToast(`Updated record for ${formData.name}`, 'success');
    } else {
      const newEmp = {
        id: `emp-${Date.now()}`,
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        shift: formData.shift,
        status: formData.status,
        hourlyRate: rateNum,
        department: formData.department,
        joinDate: new Date().toISOString().split('T')[0],
      };
      saveEmployees([newEmp, ...employees]);
      addAuditLog('Employee Created', `Added ${formData.name} to staff roster as ${formData.role}`, 'staff');
      showToast(`Added ${formData.name} to staff roster`, 'success');
    }

    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      emp.name.toLowerCase().includes(query) ||
      emp.role.toLowerCase().includes(query) ||
      emp.email.toLowerCase().includes(query)
    );
    const matchesRole = roleFilter === 'all' || emp.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const clockedInCount = employees.filter((e) => e.status === 'Clocked In').length;

  return (
    <div className="space-y-6">

      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Employee Management</h2>
          <p className="text-on-surface-variant text-sm mt-1">
            You have {employees.length} team members on the roster this week.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant flex items-center gap-2.5 shadow-sm">
            <Users className="w-5 h-5 text-primary" />
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Total Staff</p>
              <p className="text-lg font-bold text-on-surface leading-tight">{employees.length}</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-outline-variant flex items-center gap-2.5 shadow-sm">
            <UserCheck className="w-5 h-5 text-secondary" />
            <div>
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">On Duty Now</p>
              <p className="text-lg font-bold text-on-surface leading-tight">{clockedInCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Utility Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-outline-variant flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search by name, role, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">All Roles</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-low border-none rounded-xl py-2.5 px-4 text-sm text-on-surface-variant focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Clocked In">Clocked In</option>
            <option value="Off Duty">Off Duty</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-md hover:brightness-110 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Employee Table */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-5 py-3 font-bold text-on-surface-variant uppercase text-[11px] tracking-widest">Employee</th>
                <th className="px-5 py-3 font-bold text-on-surface-variant uppercase text-[11px] tracking-widest">Role</th>
                <th className="px-5 py-3 font-bold text-on-surface-variant uppercase text-[11px] tracking-widest">Contact</th>
                <th className="px-5 py-3 font-bold text-on-surface-variant uppercase text-[11px] tracking-widest">Status</th>
                <th className="px-5 py-3 font-bold text-on-surface-variant uppercase text-[11px] tracking-widest">Shift / Rate</th>
                <th className="px-5 py-3 font-bold text-on-surface-variant uppercase text-[11px] tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{emp.name}</p>
                        <p className="text-[11px] text-on-surface-variant">Joined {emp.joinDate || '2022-01-01'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-bold">{emp.role}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-on-surface text-xs font-medium flex items-center gap-1"><Mail className="w-3 h-3 text-on-surface-variant" /> {emp.email}</p>
                    <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3" /> {emp.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleToggleStatus(emp.id)}
                      className="flex items-center text-xs font-semibold text-on-surface hover:opacity-70 transition-opacity"
                      title="Click to toggle clock-in status"
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_DOT[emp.status] || 'bg-on-surface-variant/40'}`} />
                      {emp.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs text-on-surface">{emp.shift}</p>
                    <p className="text-xs text-primary font-bold mt-0.5">${emp.hourlyRate?.toFixed(2)} / hr</p>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleOpenEditModal(emp)} className="p-2 rounded-lg hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors" title="Edit Record">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteEmployee(emp.id, emp.name)} className="p-2 rounded-lg hover:bg-error-container/30 text-on-surface-variant hover:text-error transition-colors" title="Remove Employee">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center text-on-surface-variant space-y-2">
            <Users className="w-8 h-8 text-on-surface-variant/40 mx-auto" />
            <p className="font-semibold text-on-surface">No staff members match the selected filters.</p>
          </div>
        )}

        <div className="p-3 bg-surface-container-low flex justify-between items-center px-5 border-t border-outline-variant">
          <span className="text-xs font-medium text-on-surface-variant">Showing {filteredEmployees.length} of {employees.length} employees</span>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant relative my-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 text-on-surface-variant hover:text-on-surface">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-on-surface mb-1">
              {editingEmployee ? `Edit Staff: ${editingEmployee.name}` : 'Register New Employee'}
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">Enter employee credentials, role, shift and hourly rate.</p>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Role & Designation *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@dakshin.in"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Shift Schedule</label>
                  <input
                    type="text"
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    placeholder="Evening Service (16:00 - 00:00)"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-on-surface mb-1">Hourly Wage ($)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="24.50"
                    className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Shift Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="Clocked In">Clocked In (On Shift)</option>
                  <option value="Off Duty">Off Duty</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/40">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold shadow-md transition-colors">
                  {editingEmployee ? 'Save Changes' : 'Register Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerEmployeeView;
