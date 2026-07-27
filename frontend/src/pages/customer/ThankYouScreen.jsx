import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { paymentService } from '../../services/paymentService';
import { formatInvoiceAmount } from '../../utils/formatters';
import { RESTAURANT_INFO } from '../../utils/mockData';
import TopAppBar from '../../components/layout/TopAppBar';
import Modal from '../../components/common/Modal';
import Icon from '../../components/common/Icon';
import CustomerPreferencesModal from '../../components/preferences/CustomerPreferencesModal';
import DiagnosticFeedbackModal from '../../components/retention/DiagnosticFeedbackModal';
import GuestBenefitsModal from '../../components/retention/GuestBenefitsModal';
import SignatureDishStoryModal from '../../components/retention/SignatureDishStoryModal';
import ContentRemovalModal from '../../components/retention/ContentRemovalModal';
import { Heart, RefreshCw, MessageSquare, Award, Camera, ShieldCheck } from 'lucide-react';

const CONFETTI_COLORS = ['#93000b', '#fed01b', '#735c00', '#ffffff'];

const useConfettiBurst = (canvasRef) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let frameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
        this.size = Math.random() * 6 + 4;
        this.speedY = Math.random() * -15 - 5;
        this.speedX = Math.random() * 6 - 3;
        this.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.gravity = 0.25;
      }
      update() {
        this.speedY += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    for (let i = 0; i < 60; i++) {
      setTimeout(() => particles.push(new Particle()), i * 30);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter((p) => p.y < canvas.height + 20);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [canvasRef]);
};

const ThankYouScreen = () => {
  const navigate = useNavigate();
  const { activeOrder, clearOrder, customerMemory, saveCustomerMemory, forgetCustomerMemory } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();
  const canvasRef = useRef(null);
  useConfettiBurst(canvasRef);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrefsOpen, setIsPrefsOpen] = useState(false);

  // Retention Modals state
  const [isDiagnosticFeedbackOpen, setIsDiagnosticFeedbackOpen] = useState(false);
  const [isGuestBenefitsOpen, setIsGuestBenefitsOpen] = useState(false);
  const [isSignatureDishOpen, setIsSignatureDishOpen] = useState(false);
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const res = await paymentService.downloadReceipt(activeOrder?.orderId || 'INV-9842', activeOrder?.transaction);
      const blob = new Blob([res.data.receiptText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', res.data.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Receipt downloaded to your device!', 'success');
    } catch (err) {
      showToast('Could not download receipt', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleVisitAgain = () => {
    clearOrder();
    navigate('/');
  };

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
      <TopAppBar
        variant="brand"
        onOpenPreferences={() => setIsPrefsOpen(true)}
      />

      <main className="flex-1 pt-16 w-full max-w-lg mx-auto flex flex-col items-center justify-center px-4 py-8 relative space-y-6">
        {/* Success Hero */}
        <div className="w-full relative group max-w-xs">
          <div className="absolute inset-0 bg-secondary-container/20 blur-3xl rounded-full scale-75 animate-pulse" />
          <div className="relative rounded-[32px] overflow-hidden shadow-lg aspect-[4/3]">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10" />
            <img
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              src={RESTAURANT_INFO.heroImage}
              alt={RESTAURANT_INFO.name}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <Icon name="check_circle" className="text-on-secondary-container text-3xl" filled />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Content */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-4xl font-bold text-primary leading-tight">Thank You for Dining With Us</h1>
          <div className="flex flex-col gap-1 items-center">
            <p className="text-base font-semibold text-on-surface-variant flex items-center gap-2">
              <Icon name="verified" className="text-secondary" filled />
              Payment Successful
            </p>
            <p className="text-xs text-outline">Order #{activeOrder?.orderId || 'ORD-1048'} Completed</p>
            <p className="text-lg font-bold text-primary mt-1">
              Total Paid: {formatInvoiceAmount(activeOrder?.totals?.totalPayable || activeOrder?.totals?.grandTotal || activeOrder?.grandTotal || 672)}
            </p>
          </div>
        </div>

        {/* Connected Customer Experience Sequence */}
        <section className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-primary uppercase tracking-wider">
              Connected Guest Experience
            </h3>
            <span className="text-[10px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
              Optional Steps
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Step 1: Share Diagnostic Feedback */}
            <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">1. Share Useful Feedback</h4>
                  <p className="text-[11px] text-on-surface-variant">Help us improve kitchen speed, food quality & service.</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsDiagnosticFeedbackOpen(true)}
                  className="px-3 py-1.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow hover:bg-primary/90 transition-colors"
                >
                  Feedback
                </button>
              </div>
            </div>

            {/* Step 2: Explore Community Benefits */}
            <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-700 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">2. Explore Guest Benefits</h4>
                  <p className="text-[11px] text-on-surface-variant">5 completed visits · Regular Guest milestone unlocked.</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsGuestBenefitsOpen(true)}
                  className="px-3 py-1.5 bg-amber-600 text-white font-bold text-xs rounded-xl shadow hover:bg-amber-700 transition-colors"
                >
                  View Benefits
                </button>
              </div>
            </div>

            {/* Step 3: Share Dish Moment */}
            <div className="p-3.5 bg-surface rounded-2xl border border-outline-variant/30 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-on-surface">3. Share a Dish Moment</h4>
                  <p className="text-[11px] text-on-surface-variant">Watch Masala Dosa story or submit authentic content.</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setIsSignatureDishOpen(true)}
                  className="px-3 py-1.5 bg-secondary text-on-secondary font-bold text-xs rounded-xl shadow hover:opacity-90 transition-opacity"
                >
                  Dish Story
                </button>
              </div>
            </div>

            {/* Step 4: Privacy & Removal Controls */}
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between text-xs">
              <span className="text-on-surface-variant text-[11px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Control your privacy & permissions anytime
              </span>
              <button
                onClick={() => setIsRemovalModalOpen(true)}
                className="text-primary font-bold text-[11px] hover:underline"
              >
                Privacy Controls
              </button>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-3 max-w-sm">
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="w-full h-12 bg-surface border border-outline text-on-surface rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container/50 text-xs disabled:opacity-60"
          >
            <Icon name="download" />
            {isDownloading ? 'Downloading...' : 'Download Receipt'}
          </button>
          <button
            onClick={handleVisitAgain}
            className="w-full h-12 text-primary font-semibold flex items-center justify-center gap-1 hover:underline text-xs"
          >
            <Icon name="restaurant_menu" />
            Visit Again
          </button>
        </div>
      </main>

      {/* Connected Systems Retention Modals */}
      <DiagnosticFeedbackModal
        isOpen={isDiagnosticFeedbackOpen}
        onClose={() => setIsDiagnosticFeedbackOpen(false)}
        order={activeOrder}
      />

      <GuestBenefitsModal
        isOpen={isGuestBenefitsOpen}
        onClose={() => setIsGuestBenefitsOpen(false)}
      />

      <SignatureDishStoryModal
        isOpen={isSignatureDishOpen}
        onClose={() => setIsSignatureDishOpen(false)}
        dish={{ id: 'dish-001', name: 'Masala Dosa' }}
      />

      <ContentRemovalModal
        isOpen={isRemovalModalOpen}
        onClose={() => setIsRemovalModalOpen(false)}
      />
    </>
  );
};

export default ThankYouScreen;
