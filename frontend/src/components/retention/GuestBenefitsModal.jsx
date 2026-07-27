import React, { useState } from 'react';
import Modal from '../common/Modal';
import Icon from '../common/Icon';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';
import {
  PROTOTYPE_VISIT_MILESTONES,
  INITIAL_CHEF_PREVIEWS,
  INITIAL_REGIONAL_FOOD_FESTIVALS,
} from '../../data/restaurantPrototypeData';
import { Heart, Sparkles, Calendar, Bell, Users, Award, Info, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const GuestBenefitsModal = ({ isOpen, onClose }) => {
  const { customerMembership, updateCustomerMembership } = useOrder();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('MILESTONES'); // 'MILESTONES', 'CELEBRATIONS', 'PREVIEWS', 'REFERRAL'
  const [expandedConditionId, setExpandedConditionId] = useState(null);

  // Celebration preference state
  const [celebrationDay, setCelebrationDay] = useState(customerMembership?.celebrationPreferences?.day || 14);
  const [celebrationMonth, setCelebrationMonth] = useState(customerMembership?.celebrationPreferences?.month || 8);
  const [occasionType, setOccasionType] = useState(customerMembership?.celebrationPreferences?.occasionType || 'Birthday');
  const [guestNote, setGuestNote] = useState(customerMembership?.celebrationPreferences?.guestNote || '');
  const [isCelebrationSaved, setIsCelebrationSaved] = useState(false);

  // Favourite Dish Alert Channel Preference
  const [selectedChannel, setSelectedChannel] = useState('In-app');

  const handleSaveCelebration = (e) => {
    e.preventDefault();
    updateCustomerMembership({
      celebrationPreferences: {
        day: Number(celebrationDay),
        month: Number(celebrationMonth),
        occasionType,
        guestNote,
      },
    });
    setIsCelebrationSaved(true);
    showToast('Celebration hospitality preferences saved!', 'success');
  };

  const handleRedeemBenefit = (benefitId) => {
    updateCustomerMembership((prev) => ({
      ...prev,
      activeHospitalityBenefits: prev.activeHospitalityBenefits.map((b) =>
        b.benefitId === benefitId ? { ...b, status: 'Redeemed', redeemedAt: new Date().toLocaleTimeString() } : b
      ),
    }));
    showToast('Hospitality benefit marked as redeemed for your visit!', 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Restaurant Community & Guest Benefits">
      <div className="space-y-4 text-left max-h-[75vh] overflow-y-auto pr-1">
        {/* Community Status Header Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-4 rounded-2xl border border-amber-500/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-500/15 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              {customerMembership?.statusLevel || 'Regular Guest'}
            </span>
            <span className="text-xs text-on-surface-variant font-medium">
              {customerMembership?.completedVisits || 5} completed visits
            </span>
          </div>
          <h3 className="text-lg font-bold text-primary">Guest Benefits</h3>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {customerMembership?.statusEarnedReason || 'Recognized after 5 completed visits.'} Participation is based on genuine visits, non-cash hospitality, and mutual respect.
          </p>

          {/* Compact Community Profile Summary (No Spend Rankings!) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-amber-200/40 text-center">
            <div className="bg-surface/80 p-2 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Completed Visits</p>
              <p className="text-sm font-bold text-primary">{customerMembership?.completedVisits || 5}</p>
            </div>
            <div className="bg-surface/80 p-2 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Events Attended</p>
              <p className="text-sm font-bold text-secondary">{customerMembership?.regionalEventsAttended || 2}</p>
            </div>
            <div className="bg-surface/80 p-2 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Saved Favourites</p>
              <p className="text-sm font-bold text-amber-800">{customerMembership?.favouriteDishesCount || 3}</p>
            </div>
            <div className="bg-surface/80 p-2 rounded-xl border border-outline-variant/20">
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Guests Referred</p>
              <p className="text-sm font-bold text-emerald-700">{customerMembership?.referredGuestsCount || 1}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/30 gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { key: 'MILESTONES', label: 'Visit Milestones', icon: Award },
            { key: 'CELEBRATIONS', label: 'Celebrations', icon: Calendar },
            { key: 'PREVIEWS', label: 'Chef Previews', icon: Sparkles },
            { key: 'REFERRAL', label: 'Referral Recognition', icon: Users },
          ].map(({ key, label, icon: IconComponent }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-2 px-3 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === key
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Visit Milestones & Hospitality Benefits */}
        {activeTab === 'MILESTONES' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Your Milestone Progression</h4>
              <p className="text-xs text-on-surface-variant">
                Hospitality milestones are unlocked by completed visits. Ordering remains available without joining.
              </p>
            </div>

            <div className="space-y-3">
              {PROTOTYPE_VISIT_MILESTONES.map((m) => {
                const isUnlocked = (customerMembership?.completedVisits || 5) >= m.visitCount;
                const isExpanded = expandedConditionId === m.id;

                return (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'border-amber-300 bg-amber-50/50'
                        : 'border-outline-variant/30 bg-surface opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isUnlocked ? 'text-amber-900' : 'text-on-surface-variant'}`}>
                            {m.title}
                          </span>
                          <span className="text-[10px] font-semibold bg-surface-container-high px-2 py-0.5 rounded-full text-on-surface-variant">
                            {m.visitCount} {m.visitCount === 1 ? 'visit' : 'completed visits'}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface font-semibold">{m.benefit}</p>
                      </div>

                      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${
                        isUnlocked ? 'bg-emerald-500/10 text-emerald-800' : 'bg-surface-container text-on-surface-variant'
                      }`}>
                        {isUnlocked ? 'Reached' : 'Upcoming'}
                      </span>
                    </div>

                    {/* View benefit conditions toggle */}
                    <div className="pt-2 mt-2 border-t border-outline-variant/20 flex justify-between items-center text-[11px]">
                      <button
                        onClick={() => setExpandedConditionId(isExpanded ? null : m.id)}
                        className="text-primary font-semibold hover:underline flex items-center gap-1"
                      >
                        <Info className="w-3 h-3" />
                        <span>View benefit conditions</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isUnlocked && m.id === 'VISIT-5' && (
                        <button
                          onClick={() => handleRedeemBenefit('BEN-501')}
                          disabled={customerMembership?.activeHospitalityBenefits?.[0]?.status === 'Redeemed'}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-lg text-[10px] shadow transition-colors"
                        >
                          {customerMembership?.activeHospitalityBenefits?.[0]?.status === 'Redeemed'
                            ? 'Redeemed'
                            : 'Redeem Benefit'}
                        </button>
                      )}
                    </div>

                    {/* Detailed Condition Card */}
                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-surface border border-outline-variant/40 space-y-1 text-[11px] text-on-surface-variant">
                        <p><strong className="text-on-surface">Eligibility:</strong> {m.conditions.eligibility}</p>
                        <p><strong className="text-on-surface">Validity Period:</strong> {m.conditions.validity}</p>
                        <p><strong className="text-on-surface">Applicability:</strong> {m.conditions.applicability}</p>
                        <p><strong className="text-on-surface">Advance Confirmation:</strong> {m.conditions.confirmationRequired}</p>
                        <p className="text-[10px] text-outline italic pt-1">
                          * Hospitality benefits are subject to restaurant availability and staff confirmation prior to ordering.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Celebration Hospitality */}
        {activeTab === 'CELEBRATIONS' && (
          <form onSubmit={handleSaveCelebration} className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Celebration Hospitality</h4>
              <p className="text-xs text-on-surface-variant">
                Optionally share date-only celebration preferences for birthday or anniversary hospitality.
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 space-y-1">
              <p className="font-semibold">Hospitality elements may include:</p>
              <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-amber-900/80">
                <li>Complimentary chef dessert during your visit month</li>
                <li>Handwritten table welcome note</li>
                <li>Celebration plating request</li>
                <li>Chef greeting when available on floor</li>
              </ul>
              <p className="text-[10px] font-bold text-amber-800 pt-1">
                * Subject to restaurant availability and prior confirmation. Full date of birth is not required.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-on-surface block mb-1">Occasion Type</label>
                <select
                  value={occasionType}
                  onChange={(e) => setOccasionType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface"
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Family Gathering">Family Gathering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Day</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={celebrationDay}
                    onChange={(e) => setCelebrationDay(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-on-surface block mb-1">Month</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={celebrationMonth}
                    onChange={(e) => setCelebrationMonth(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface font-bold text-center"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-on-surface block">Optional Guest Note</label>
              <input
                type="text"
                value={guestNote}
                onChange={(e) => setGuestNote(e.target.value)}
                placeholder="e.g. Prefer quiet table or high chair"
                className="w-full p-2.5 rounded-xl border border-outline-variant bg-surface text-xs"
              />
            </div>

            {/* Favourite Dish Notification Channel Preference */}
            <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-secondary" />
                  Favourite Dish Availability Alerts
                </span>
                <span className="text-[10px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  Prototype preference only
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Select notification channel for dish availability updates:</p>
              <div className="flex gap-2">
                {['In-app', 'SMS', 'WhatsApp'].map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setSelectedChannel(ch)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                      selectedChannel === ch
                        ? 'bg-primary text-on-primary border-primary'
                        : 'bg-surface text-on-surface-variant border-outline-variant/40'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
            >
              Save Celebration Preferences
            </button>
          </form>
        )}

        {/* Tab 3: Chef Previews & Food Festivals */}
        {activeTab === 'PREVIEWS' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Chef Preview Invitations</h4>
              <p className="text-xs text-on-surface-variant">
                Preview limited regional menu items before their public launch. 12 prototype seats shown per event.
              </p>
            </div>

            <div className="space-y-3">
              {INITIAL_CHEF_PREVIEWS.map((prev) => (
                <div key={prev.id} className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-bold text-xs text-primary">{prev.eventTitle}</h5>
                      <p className="text-[11px] text-on-surface-variant font-medium">
                        {prev.date} at {prev.time} · {prev.dietaryTheme}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-500/10 text-amber-800 px-2 py-0.5 rounded-full">
                      {prev.availableSeats} of {prev.totalSeats} seats remaining
                    </span>
                  </div>
                  <p className="text-xs text-on-surface italic">{prev.chefNote}</p>
                  <button
                    onClick={() => showToast('Invitation request logged for prototype seats!', 'success')}
                    className="px-3.5 py-1.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Request Invitation
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Regional Food Festivals</h4>
              {INITIAL_REGIONAL_FOOD_FESTIVALS.map((fest) => (
                <div key={fest.id} className="p-3 rounded-xl bg-surface border border-outline-variant/30 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-on-surface">{fest.title}</span>
                    <span className="text-[10px] font-semibold text-secondary bg-secondary-container/20 px-2 py-0.5 rounded-full">
                      {fest.accessLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">{fest.description}</p>
                  <p className="text-[10px] text-outline font-medium">{fest.period}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Referral Recognition */}
        {activeTab === 'REFERRAL' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Referral Recognition</h4>
              <p className="text-xs text-on-surface-variant">
                Invite friends to dine. When your friend completes their genuine first visit, both guests receive recognition toward the next milestone.
              </p>
            </div>

            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Users className="w-4 h-4 text-emerald-700" />
                Ethical Referral Principles
              </div>
              <ul className="list-disc pl-4 text-[11px] space-y-1 text-emerald-900/80">
                <li>Recognition is awarded ONLY after a completed first visit.</li>
                <li>No rewards for uploading contact lists or spam links.</li>
                <li>No rewards based on positive reviews or forced social praise.</li>
              </ul>
            </div>

            <div className="p-3.5 bg-surface rounded-xl border border-outline-variant/30 space-y-2">
              <h5 className="font-bold text-xs text-on-surface">Your Prototype Referral Code</h5>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="MANGAMMA-GUEST-1048"
                  className="flex-1 p-2 rounded-xl border border-outline-variant font-mono font-bold text-center text-xs bg-surface-container-low text-primary"
                />
                <button
                  onClick={() => showToast('Referral code copied to clipboard!', 'info')}
                  className="px-3.5 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-primary/90"
                >
                  Copy Code
                </button>
              </div>
              <p className="text-[11px] text-on-surface-variant italic text-center">
                Share with a friend to enter at table order placement.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GuestBenefitsModal;
