import React, { useState } from 'react';
import { getStoredManagerSettings, setStoredManagerSettings, addAuditLog } from '../../services/managerService';
import { useToast } from '../../context/ToastContext';
import {
  Settings,
  Store,
  DollarSign,
  Clock,
  Save,
  CheckCircle2,
  Receipt
} from 'lucide-react';

const ManagerSettingsView = () => {
  const { showToast } = useToast();
  const [settings, setSettings] = useState(() => getStoredManagerSettings());

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleOperatingHoursChange = (day, value) => {
    setSettings((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: value,
      },
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setStoredManagerSettings(settings);
    addAuditLog('System Settings Updated', 'Updated restaurant tax rates, operating hours & receipt preferences', 'system');
    showToast('Restaurant settings saved successfully!', 'success');
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">

      {/* Top Action Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            System &amp; Restaurant Settings
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Configure financial tax rates, POS receipt text, operating hours, and alert thresholds.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-primary hover:brightness-110 text-on-primary font-semibold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* Grid of Setting Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Section 1: Business Profile */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Store className="w-4 h-4 text-primary" />
            Restaurant Identity &amp; Contact
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Restaurant Name</label>
              <input
                type="text"
                value={settings.restaurantName}
                onChange={(e) => handleInputChange('restaurantName', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Tagline / Subheading</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Physical Address</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Contact Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Taxes & Financial Rules */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <DollarSign className="w-4 h-4 text-primary" />
            Financial &amp; Tax Accounting
          </h3>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-on-surface mb-1">Service Tax (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">VAT Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.vatRate}
                  onChange={(e) => handleInputChange('vatRate', parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-semibold text-on-surface mb-1">Service Charge (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.serviceCharge}
                  onChange={(e) => handleInputChange('serviceCharge', parseFloat(e.target.value))}
                  className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleInputChange('currency', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div className="p-3 bg-green-50/60 border border-green-200/60 rounded-xl text-on-surface-variant text-[11px] space-y-1">
              <p className="font-semibold text-green-900 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Auto-Tax Calculation Active
              </p>
              <p>
                Current total tax levy applied on customer checkout: <strong className="text-on-surface">{(settings.taxRate + settings.vatRate).toFixed(1)}%</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Receipt & Printing */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Receipt className="w-4 h-4 text-secondary" />
            POS Receipt Customization
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-on-surface mb-1">Receipt Header Greeting</label>
              <input
                type="text"
                value={settings.receiptHeader}
                onChange={(e) => handleInputChange('receiptHeader', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-semibold text-on-surface mb-1">Receipt Footer Message</label>
              <textarea
                rows={2}
                value={settings.receiptFooter}
                onChange={(e) => handleInputChange('receiptFooter', e.target.value)}
                className="w-full p-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface focus:outline-none focus:border-primary"
              />
            </div>

            <label className="flex items-center gap-2 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoPrintReceipt}
                onChange={(e) => handleInputChange('autoPrintReceipt', e.target.checked)}
                className="w-4 h-4 accent-primary rounded"
              />
              <span className="font-semibold text-on-surface">Auto-Print Thermal Receipt upon Counter Payment Settlement</span>
            </label>
          </div>
        </div>

        {/* Section 4: Operational Hours */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant shadow-sm space-y-4">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2 pb-3 border-b border-outline-variant/50">
            <Clock className="w-4 h-4 text-tertiary" />
            Weekly Operating Schedule
          </h3>

          <div className="space-y-2 text-xs">
            {Object.keys(settings.operatingHours || {}).map((day) => (
              <div key={day} className="flex items-center justify-between gap-3">
                <span className="capitalize font-semibold text-on-surface w-24">{day}:</span>
                <input
                  type="text"
                  value={settings.operatingHours[day]}
                  onChange={(e) => handleOperatingHoursChange(day, e.target.value)}
                  className="flex-1 p-1.5 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
};

export default ManagerSettingsView;
