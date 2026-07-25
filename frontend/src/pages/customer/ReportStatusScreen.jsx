import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { REPORT_STAGES } from '../../utils/issueCategories';
import BottomNavBar from '../../components/layout/BottomNavBar';
import Icon from '../../components/common/Icon';

const CURRENT_STAGE_COPY = {
  submitted: { badge: 'Report Received', title: 'Report Received', body: "We've logged your report and are getting a team member ready." },
  staff_notified: { badge: 'Staff Notified', title: 'Staff Notified', body: 'Our restaurant staff has been alerted to your issue.' },
  staff_assigned: { badge: 'Staff Reviewing', title: 'Review in Progress', body: "Our restaurant staff is reviewing your request. We'll be with you shortly." },
  resolving: { badge: 'Resolving', title: 'Resolution In Progress', body: 'Our team is actively working to resolve your issue.' },
  resolved: { badge: 'Resolved', title: 'Issue Resolved', body: 'Thanks for your patience — this issue has been marked resolved.' },
};

const ReportStatusScreen = () => {
  const navigate = useNavigate();
  const { issueReport, advanceIssueReportStage, clearIssueReport } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();

  if (!issueReport) {
    return (
      <>
        <header className="sticky top-0 z-40 bg-surface shadow-sm flex items-center justify-between px-4 h-16">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-colors active:scale-95">
            <Icon name="arrow_back" className="text-on-surface" />
          </button>
          <h1 className="text-lg font-bold text-primary tracking-tight">Dakshin Premium</h1>
          <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
            Table {tableNumber}
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-2">
          <Icon name="fact_check" className="text-4xl text-on-surface-variant" />
          <p className="text-on-surface font-semibold">No report to track yet</p>
          <p className="text-sm text-on-surface-variant">Reports you submit will show up here.</p>
        </main>
        <BottomNavBar />
      </>
    );
  }

  const stageCopy = CURRENT_STAGE_COPY[issueReport.status] || CURRENT_STAGE_COPY.submitted;
  const reportedAt = new Date(issueReport.createdAt).toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCancelReport = () => {
    clearIssueReport();
    showToast('Report cancelled', 'info');
    navigate('/order-tracking');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface shadow-sm flex items-center justify-between px-4 h-16">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant/50 transition-colors active:scale-95">
          <Icon name="arrow_back" className="text-on-surface" />
        </button>
        <h1 className="text-lg font-bold text-primary tracking-tight">Dakshin Premium</h1>
        <div className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
          Table {tableNumber}
        </div>
      </header>

      <main className="flex-1 px-4 pt-6 pb-28 max-w-md mx-auto w-full">
        <section className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Report Status</h2>
            <p className="text-base text-on-surface-variant mt-1">Tracking your issue in real-time.</p>
          </div>
          {issueReport.stageIndex < 4 && (
            <button
              onClick={advanceIssueReportStage}
              className="px-3 py-1 bg-secondary-container/40 text-on-secondary-container rounded-full text-[10px] font-bold whitespace-nowrap"
            >
              Advance Demo Stage &#8594;
            </button>
          )}
        </section>

        {/* Issue Summary Card */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 mb-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[11px] text-on-surface-variant block uppercase tracking-wider">Ticket ID</span>
              <span className="font-semibold text-on-surface text-lg">#{issueReport.id}</span>
            </div>
            <div className="bg-primary text-on-primary px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1">
              <Icon name="priority_high" className="text-sm" />
              {issueReport.priority}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-outline-variant/20 pt-4">
            <div>
              <span className="text-[11px] text-on-surface-variant block">Order</span>
              <span className="text-sm font-semibold text-on-surface">#{issueReport.orderId || '—'}</span>
            </div>
            <div>
              <span className="text-[11px] text-on-surface-variant block">Category</span>
              <span className="text-sm font-semibold text-on-surface">{issueReport.categoryLabel}</span>
            </div>
            <div>
              <span className="text-[11px] text-on-surface-variant block">Reported</span>
              <span className="text-sm font-semibold text-on-surface">{reportedAt}</span>
            </div>
            <div>
              <span className="text-[11px] text-on-surface-variant block">Table</span>
              <span className="text-sm font-semibold text-on-surface">{issueReport.tableNumber}</span>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <section className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full mb-4 animate-pulse">
            <Icon name="pending_actions" className="text-lg" />
            <span className="uppercase tracking-widest text-[11px] font-bold">{stageCopy.badge}</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-1">{stageCopy.title}</h3>
          <p className="text-base text-on-surface-variant">{stageCopy.body}</p>
        </section>

        {/* Status Timeline */}
        <section className="mb-8">
          <div className="space-y-6 relative">
            {REPORT_STAGES.map((stage, idx) => {
              const isCompleted = idx < issueReport.stageIndex;
              const isCurrent = idx === issueReport.stageIndex;
              const isLast = idx === REPORT_STAGES.length - 1;

              return (
                <div key={stage.id} className="flex gap-4 relative">
                  {!isLast && (
                    <div
                      className={`absolute left-[11px] top-6 bottom-[-24px] w-0.5 ${
                        isCompleted ? 'bg-primary' : 'bg-surface-container-highest'
                      }`}
                    />
                  )}
                  {isCompleted || isCurrent ? (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${isCompleted ? 'bg-primary' : 'bg-surface border-2 border-primary'}`}>
                      {isCompleted ? (
                        <Icon name="check" className="text-on-primary text-base" />
                      ) : (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                      )}
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-surface-variant border-2 border-outline z-10 flex-shrink-0 opacity-40" />
                  )}
                  <div className={idx > issueReport.stageIndex ? 'opacity-40' : ''}>
                    <p className={`text-sm font-semibold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>{stage.title}</p>
                    <p className={`text-xs ${isCurrent ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {isCompleted ? 'Done' : isCurrent ? 'In progress' : 'Pending'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Staff Information */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 mb-8 flex items-center justify-between shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary-fixed flex items-center justify-center">
              <Icon name="support_agent" className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Arjun Nair</p>
              <p className="text-xs text-on-surface-variant">Head Waiter</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-on-surface-variant">Expected Response</p>
            <p className="text-sm font-bold text-primary">Within 5 mins</p>
          </div>
        </div>

        {/* Customer Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => showToast('Staff notified — someone will reach your table shortly.', 'success')}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Icon name="chat" />
            Contact Staff
          </button>
          <button
            onClick={() => navigate('/report-issue')}
            className="w-full h-14 bg-surface border border-outline text-on-surface rounded-xl font-semibold hover:bg-surface-variant/20 active:scale-[0.98] transition-all"
          >
            Update Issue
          </button>
          <button
            onClick={handleCancelReport}
            className="w-full h-12 text-primary font-semibold hover:bg-primary/5 rounded-xl transition-all"
          >
            Cancel Report
          </button>
        </div>
      </main>

      <BottomNavBar />
    </>
  );
};

export default ReportStatusScreen;
