import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useTable } from '../../context/TableContext';
import { useToast } from '../../context/ToastContext';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/formatters';
import { RESTAURANT_INFO } from '../../utils/mockData';
import TopAppBar from '../../components/layout/TopAppBar';
import Modal from '../../components/common/Modal';
import Icon from '../../components/common/Icon';

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
  const { activeOrder, clearOrder } = useOrder();
  const { tableNumber } = useTable();
  const { showToast } = useToast();
  const canvasRef = useRef(null);
  useConfettiBurst(canvasRef);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);

  const handleDownloadReceipt = async () => {
    setIsDownloading(true);
    try {
      const res = await paymentService.downloadReceipt(activeOrder?.orderId || 'TBV-9842', activeOrder?.transaction);
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

  const handleRate = (star) => {
    setRating(star);
    showToast(`Thank you for rating us ${star} stars!`, 'success');
    setIsRatingOpen(false);
  };

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-10" />
      <TopAppBar variant="brand" />

      <main className="flex-1 pt-16 w-full max-w-lg mx-auto flex flex-col items-center justify-center px-4 py-8 relative">
        {/* Success Hero */}
        <div className="w-full relative mb-8 group">
          <div className="absolute inset-0 bg-secondary-container/20 blur-3xl rounded-full scale-75 animate-pulse" />
          <div className="relative rounded-[32px] overflow-hidden shadow-lg aspect-[4/5] md:aspect-square">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent z-10" />
            <img
              className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              src={RESTAURANT_INFO.heroImage}
              alt={RESTAURANT_INFO.name}
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <div className="w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center shadow-xl animate-bounce">
                <Icon name="check_circle" className="text-on-secondary-container text-4xl" filled />
              </div>
            </div>
          </div>
        </div>

        {/* Typography Content */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-2 leading-tight">Thank You for Dining With Us</h1>
          <div className="flex flex-col gap-1 items-center">
            <p className="text-xl font-semibold text-on-surface-variant flex items-center gap-2">
              <Icon name="verified" className="text-secondary" filled />
              Payment Successful
            </p>
            <p className="text-lg text-outline">Order #{activeOrder?.orderId || '—'} Completed</p>
            <p className="text-xl font-semibold text-primary mt-2">
              Total Paid: {formatCurrency(activeOrder?.totals?.grandTotal)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-4 max-w-sm">
          <button
            onClick={() => setIsRatingOpen(true)}
            className="w-full h-14 bg-primary text-on-primary rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Icon name="star" filled />
            {rating > 0 ? `You Rated ${rating} Stars` : 'Rate Your Experience'}
          </button>
          <button
            onClick={handleDownloadReceipt}
            disabled={isDownloading}
            className="w-full h-14 bg-surface border border-outline text-on-surface rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container/50 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            <Icon name="download" />
            {isDownloading ? 'Downloading...' : 'Download Receipt'}
          </button>
          <button
            onClick={handleVisitAgain}
            className="w-full h-12 text-primary font-semibold flex items-center justify-center gap-1 hover:underline active:scale-[0.98] transition-all"
          >
            <Icon name="restaurant_menu" />
            Visit Again
          </button>
        </div>

        {/* Decorative Gold Accents */}
        <div className="mt-12 flex items-center gap-4 opacity-30">
          <div className="h-px w-12 bg-secondary" />
          <Icon name="celebration" className="text-secondary" />
          <div className="h-px w-12 bg-secondary" />
        </div>
      </main>

      <Modal isOpen={isRatingOpen} onClose={() => setIsRatingOpen(false)} title={`Rate Table ${tableNumber}'s Experience`}>
        <div className="flex justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => handleRate(star)} className="p-1 hover:scale-125 transition-transform">
              <Icon
                name="star"
                filled={star <= rating}
                className={`text-3xl ${star <= rating ? 'text-secondary' : 'text-outline-variant'}`}
              />
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default ThankYouScreen;
