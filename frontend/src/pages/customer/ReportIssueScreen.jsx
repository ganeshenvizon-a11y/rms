import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { ISSUE_CATEGORIES } from '../../utils/issueCategories';
import Icon from '../../components/common/Icon';

const ReportIssueScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, submitIssueReport } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!selectedCategory) {
      showToast('Please select an issue category', 'error');
      return;
    }
    setIsSubmitting(true);
    submitIssueReport({
      category: selectedCategory.id,
      categoryLabel: selectedCategory.label,
      details,
      orderId: activeOrder?.orderId,
      tableNumber,
    });
    navigate('/report-submitted');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-sm h-14 flex items-center px-4 justify-between">
        <button onClick={() => navigate(-1)} className="active:scale-95 transition-transform" aria-label="Go back">
          <Icon name="arrow_back" className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Dakshin Premium</h1>
        <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-semibold">
          Table {tableNumber}
        </div>
      </header>

      <main className="mt-14 pb-32 pt-6 px-4 flex-1 max-w-md mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-on-surface">Report an Issue</h2>
          <p className="text-base text-on-surface-variant mt-1">We&apos;re here to help. Tell us what went wrong.</p>
        </div>

        {/* Order Information Card */}
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-soft border border-outline-variant mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">Order Reference</span>
              <p className="text-2xl font-semibold text-on-surface">#{activeOrder?.orderId || '—'}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider">Table</span>
              <p className="text-2xl font-semibold text-on-surface">{tableNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-surface-variant">
            <div className="flex-1">
              <span className="text-[11px] text-on-surface-variant block mb-1">Status</span>
              <div className="flex items-center gap-1 text-secondary text-sm font-semibold capitalize">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                {activeOrder?.status || 'Served'}
              </div>
            </div>
            <div className="flex-1">
              <span className="text-[11px] text-on-surface-variant block mb-1">Est. Time</span>
              <p className="text-sm font-semibold text-on-surface">Delivered</p>
            </div>
          </div>
        </div>

        {/* Issue Categories */}
        <section className="mb-8">
          <h3 className="text-xs font-semibold text-on-surface-variant uppercase mb-4 tracking-wider">
            What&apos;s the issue?
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {ISSUE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-4 bg-surface-container-lowest border rounded-xl text-left active:scale-[0.98] transition-all shadow-soft flex flex-col justify-between h-24 ${
                    isActive ? 'border-primary bg-primary/5' : 'border-outline-variant'
                  }`}
                >
                  <Icon name={cat.icon} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
                  <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Input Field & Upload */}
        <section className="space-y-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Additional Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-xl p-4 focus:ring-2 focus:ring-primary-container text-base placeholder:text-on-surface-variant/50 transition-shadow"
              placeholder="Describe your issue..."
              rows={4}
            />
          </div>
          <button
            type="button"
            className="w-full py-4 px-6 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2 text-on-surface-variant text-sm font-semibold hover:bg-surface-container-low active:scale-95 transition-all"
          >
            <Icon name="photo_camera" />
            Upload Photo (Optional)
          </button>
        </section>
      </main>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-md p-4 border-t border-surface-variant/30 flex justify-center z-50">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full max-w-md h-14 bg-primary text-on-primary rounded-2xl text-lg font-semibold active:scale-95 transition-transform shadow-lg flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
          <Icon name="send" />
        </button>
      </div>
    </>
  );
};

export default ReportIssueScreen;
