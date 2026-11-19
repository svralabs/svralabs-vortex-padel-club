import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------
     1. GSAP ENTRANCE & SCROLL ANIMATIONS
  ----------------------------------------------------- */
  if (!prefersReducedMotion) {
    // Ensure all elements have immediate visibility
    gsap.set(
      [
        '.navbar-pill',
        '.hero-left > *',
        '.racket-visual-container',
        '.about-card',
        '.night-court-card',
        '.gear-photo-card',
        '.facility-card',
        '.testimonial-card',
        '.cta-banner-card',
      ],
      { opacity: 1, visibility: 'visible' }
    );

    // Subtle Hero Entrance Motion
    gsap.from('.navbar-pill', {
      y: -16,
      duration: 0.5,
      ease: 'power2.out',
      clearProps: 'all',
    });

    gsap.from('.hero-left > *', {
      y: 20,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
      clearProps: 'all',
    });

    gsap.from('.racket-visual-container', {
      scale: 0.95,
      duration: 0.7,
      ease: 'power2.out',
      clearProps: 'all',
    });

    // Section Scroll Triggers (translating gently into place with clearProps)
    const sections = [
      { trigger: '.about-grid', elements: '.about-intro > *, .about-card' },
      { trigger: '.experience-grid', elements: '.night-court-card, .gear-experience-col > *' },
      { trigger: '.facilities-grid', elements: '.facility-card' },
      { trigger: '.testimonial-card', elements: '.testimonial-card' },
      { trigger: '.cta-banner-card', elements: '.cta-banner-card' },
    ];

    sections.forEach(({ trigger, elements }) => {
      const el = document.querySelector(trigger);
      if (el) {
        gsap.from(elements, {
          scrollTrigger: {
            trigger: trigger,
            start: 'top 92%',
            toggleActions: 'play none none none',
            once: true,
          },
          y: 28,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power2.out',
          clearProps: 'all',
        });
      }
    });

    // Refresh ScrollTrigger after assets load
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  /* ----------------------------------------------------
     2. BOOKING MODAL & DYNAMIC PRICING ENGINE
  ----------------------------------------------------- */
  const bookingModal = document.getElementById('booking-modal') as HTMLElement | null;
  const openTriggers = document.querySelectorAll('.open-booking-trigger, #open-booking-modal, #mobile-open-booking-modal');
  const closeBtn = document.getElementById('close-booking-modal') as HTMLElement | null;
  const bookingForm = document.getElementById('court-booking-form') as HTMLFormElement | null;
  const toast = document.getElementById('booking-toast') as HTMLElement | null;

  // Set default booking date to tomorrow
  const dateInput = document.getElementById('booking-date') as HTMLInputElement | null;
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.value = tomorrow.toISOString().split('T')[0];
    dateInput.min = new Date().toISOString().split('T')[0];
  }

  // Open / Close Modal Helpers
  const openModal = () => {
    if (bookingModal) {
      bookingModal.classList.add('is-visible');
      bookingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      calculateTotal();
    }
  };

  const closeModal = () => {
    if (bookingModal) {
      bookingModal.classList.remove('is-visible');
      bookingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal?.classList.contains('is-visible')) {
      closeModal();
    }
  });

  // Dynamic Price Calculation
  const courtRadios = document.querySelectorAll('.court-radio') as NodeListOf<HTMLInputElement>;
  const courtOptionCards = document.querySelectorAll('.court-option-card') as NodeListOf<HTMLLabelElement>;
  const durationSelect = document.getElementById('booking-duration') as HTMLSelectElement | null;
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox') as NodeListOf<HTMLInputElement>;
  const totalDisplay = document.getElementById('booking-total-display') as HTMLElement | null;
  const slotPills = document.querySelectorAll('.slot-pill') as NodeListOf<HTMLButtonElement>;

  let selectedSlot = '08:00';

  slotPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      slotPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      selectedSlot = pill.getAttribute('data-slot') || '08:00';
    });
  });

  courtRadios.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      courtOptionCards.forEach((c) => c.classList.remove('is-selected'));
      courtOptionCards[index]?.classList.add('is-selected');
      calculateTotal();
    });
  });

  if (durationSelect) {
    durationSelect.addEventListener('change', calculateTotal);
  }

  addonCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', calculateTotal);
  });

  function calculateTotal() {
    let baseRate = 250000;
    courtRadios.forEach((radio) => {
      if (radio.checked) {
        baseRate = parseInt(radio.getAttribute('data-rate') || '250000', 10);
      }
    });

    const duration = parseFloat(durationSelect?.value || '1');
    let addonsTotal = 0;

    addonCheckboxes.forEach((chk) => {
      if (chk.checked) {
        addonsTotal += parseInt(chk.getAttribute('data-price') || '0', 10);
      }
    });

    const grandTotal = Math.round(baseRate * duration + addonsTotal);

    if (totalDisplay) {
      totalDisplay.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
    }
  }

  // Booking Form Submission with WhatsApp Link Generation
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let selectedCourtName = 'Panoramic Indoor';
      courtRadios.forEach((r) => {
        if (r.checked) {
          selectedCourtName = r.closest('label')?.querySelector('.court-option-name')?.textContent || r.value;
        }
      });

      const dateVal = dateInput?.value || 'Besok';
      const durationVal = durationSelect?.value || '1';
      const totalText = totalDisplay?.textContent || 'Rp 250.000';

      const addonsList: string[] = [];
      addonCheckboxes.forEach((chk) => {
        if (chk.checked) {
          const name = chk.closest('label')?.querySelector('.addon-name')?.textContent;
          if (name) addonsList.push(name);
        }
      });

      const message = `Halo Concierge Vortex Padel Club! Saya ingin konfirmasi booking court:\n\n• Lapangan: ${selectedCourtName}\n• Tanggal: ${dateVal}\n• Waktu: ${selectedSlot} WIB\n• Durasi: ${durationVal} Jam\n• Add-ons: ${addonsList.length > 0 ? addonsList.join(', ') : 'None'}\n• Estimasi Total: ${totalText}\n\nMohon konfirmasi ketersediaan slot. Terima kasih!`;

      // Show toast confirmation
      if (toast) {
        toast.classList.add('is-active');
        setTimeout(() => {
          toast.classList.remove('is-active');
          closeModal();
          // Redirect to WhatsApp
          window.open(`https://wa.me/6281288997722?text=${encodeURIComponent(message)}`, '_blank');
        }, 1200);
      }
    });
  }

  /* ----------------------------------------------------
     3. FACILITIES FILTER & CAROUSEL
  ----------------------------------------------------- */
  const facilityInput = document.getElementById('facility-filter-input') as HTMLInputElement | null;
  const facilityCards = document.querySelectorAll('.facility-card') as NodeListOf<HTMLElement>;
  const viewAllBtn = document.getElementById('filter-all-facilities') as HTMLElement | null;
  const facPrevBtn = document.getElementById('fac-prev-btn') as HTMLElement | null;
  const facNextBtn = document.getElementById('fac-next-btn') as HTMLElement | null;

  if (facilityInput) {
    facilityInput.addEventListener('input', () => {
      const query = facilityInput.value.toLowerCase().trim();
      facilityCards.forEach((card) => {
        const text = card.textContent?.toLowerCase() || '';
        if (text.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', () => {
      if (facilityInput) facilityInput.value = '';
      facilityCards.forEach((c) => (c.style.display = ''));
    });
  }

  if (facPrevBtn && facNextBtn) {
    let facIndex = 0;
    const scrollFacility = (direction: 'next' | 'prev') => {
      facIndex = direction === 'next' ? (facIndex + 1) % 4 : (facIndex - 1 + 4) % 4;
      gsap.to('.facility-card', {
        scale: 0.98,
        duration: 0.15,
        onComplete: () => {
          gsap.to('.facility-card', { scale: 1, duration: 0.25 });
        },
      });
    };

    facNextBtn.addEventListener('click', () => scrollFacility('next'));
    facPrevBtn.addEventListener('click', () => scrollFacility('prev'));
  }

  /* ----------------------------------------------------
     4. TESTIMONIAL SLIDER INTERACTIVITY
  ----------------------------------------------------- */
  const testimonials = [
    {
      quote: `"Joining the padel club has been the best decision for my free time. The atmosphere is amazing, and every match brings excitement and new friends!"`,
      author: 'Marina S.',
      role: 'Club Member (Gold Tier)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    },
    {
      quote: `"The panoramic glass courts and shadowless LED floodlights give an international tournament feel. Best place in the city to level up your spin."`,
      author: 'Alexandre Roy',
      role: 'Intermediate League Finalist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    },
    {
      quote: `"From private coaching with pro trainers to the post-game acai bowls at the lounge, Vortex is second to none. Absolutely hooked!"`,
      author: 'Sophia Chen',
      role: 'Weekend Padel Enthusiast',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
    },
  ];

  let currentTestIndex = 0;
  const quoteElem = document.getElementById('testimonial-quote-text');
  const authorElem = document.getElementById('testimonial-author-name');
  const authorImg = document.getElementById('testimonial-author-img') as HTMLImageElement | null;
  const counterElem = document.getElementById('testimonial-counter');
  const testPrevBtn = document.getElementById('test-prev-btn');
  const testNextBtn = document.getElementById('test-next-btn');

  const updateTestimonial = (index: number) => {
    currentTestIndex = (index + testimonials.length) % testimonials.length;
    const data = testimonials[currentTestIndex];

    gsap.to('#testimonial-slider', {
      opacity: 0.5,
      y: 6,
      duration: 0.18,
      onComplete: () => {
        if (quoteElem) quoteElem.textContent = data.quote;
        if (authorElem) authorElem.textContent = data.author;
        if (authorImg) authorImg.src = data.image;
        if (counterElem) counterElem.textContent = `${currentTestIndex + 1}/8`;

        gsap.to('#testimonial-slider', {
          opacity: 1,
          y: 0,
          duration: 0.25,
          clearProps: 'transform,opacity',
        });
      },
    });
  };

  testNextBtn?.addEventListener('click', () => updateTestimonial(currentTestIndex + 1));
  testPrevBtn?.addEventListener('click', () => updateTestimonial(currentTestIndex - 1));

  /* ----------------------------------------------------
     5. MOBILE MENU DRAWER
  ----------------------------------------------------- */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileDrawer?.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('is-open');
      menuToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ----------------------------------------------------
     6. FOOTER NEWSLETTER & CONTACT FEEDBACK
  ----------------------------------------------------- */
  const newsletterForm = document.getElementById('newsletter-form') as HTMLFormElement | null;
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email') as HTMLInputElement | null;
    if (emailInput && toast) {
      toast.querySelector('.toast-msg')!.textContent = `Thank you! Subscribed with ${emailInput.value}`;
      toast.classList.add('is-active');
      emailInput.value = '';
      setTimeout(() => toast.classList.remove('is-active'), 3000);
    }
  });
});
