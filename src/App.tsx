import { useMemo, useState, useEffect, useLayoutEffect } from 'react';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  Clock,
  Facebook,
  Fuel,
  Gauge,
  Grid2X2,
  Instagram,
  List,
  MapPin,
  Maximize2,
  Menu,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  ZoomIn,
} from 'lucide-react';

/* ─── Filter State Types ────────────────────────── */
type FilterState = {
  makes: string[];
  models: string[];
  years: number[];
  fuels: string[];
  transmissions: string[];
  minYear: number;
  maxYear: number;
  minPrice: number;
  maxPrice: number;
};

const DEFAULT_FILTERS: FilterState = {
  makes: [],
  models: [],
  years: [],
  fuels: [],
  transmissions: [],
  minYear: 2020,
  maxYear: 2026,
  minPrice: 0,
  maxPrice: 300000,
};

const ALL_MAKES = [
  'Mercedes-Benz',
  'Audi',
  'Volvo',
];

const MAKE_MODELS_MAP: Record<string, string[]> = {
  'Mercedes-Benz': ['G 63 AMG'],
  'Audi': ['Q8 S-Line'],
  'Volvo': ['XC60 T8 Recharge'],
};

const ALL_MODELS = [
  'G 63 AMG',
  'Q8 S-Line',
  'XC60 T8 Recharge',
];

const ALL_YEARS = [2026, 2021, 2020];
const ALL_FUELS = ['Petrol', 'Hybrid'];
const ALL_TRANSMISSIONS = ['Automatic'];

type Page = 'home' | 'inventory' | 'about' | 'journal' | 'car' | 'contact';

type Car = {
  id: number;
  name: string;
  make: string;
  model: string;
  year: number;
  price: string;
  mileage: string;
  fuel: string;
  transmission: string;
  image: string;
  images?: string[];
  tag?: string;
  description: string;
};

const cars: Car[] = [
  {
    id: 1,
    name: 'Mercedes-Benz G 63 AMG 2021',
    make: 'Mercedes-Benz',
    model: 'G 63 AMG',
    year: 2021,
    price: 'Price on Request',
    mileage: 'Certified Pre-Owned',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/mercedes-g63-amg-2021/g63-1.jpg',
    images: [
      '/inventory/mercedes-g63-amg-2021/g63-1.jpg',
      '/inventory/mercedes-g63-amg-2021/g63-2.jpg',
      '/inventory/mercedes-g63-amg-2021/g63-3.jpg',
      '/inventory/mercedes-g63-amg-2021/g63-4.jpg',
      '/inventory/mercedes-g63-amg-2021/g63-5.jpg'
    ],
    tag: 'G63 AMG 2021 • V8 BITURBO • ON MOTORS EXCLUSIVE',
    description: '2021 Mercedes-AMG G 63 • Handcrafted 4.0L V8 Biturbo, AMG Night Package styling, exclusive diamond-stitched Nappa leather interior, Burmester Surround Sound system, AMG Ride Control suspension. Inspected, certified and ready for immediate delivery at ON Motors Saida.'
  },
  {
    id: 2,
    name: 'Audi Q8 S-Line 2020',
    make: 'Audi',
    model: 'Q8 S-Line',
    year: 2020,
    price: 'Price on Request',
    mileage: 'Certified Pre-Owned',
    fuel: 'Petrol',
    transmission: 'Automatic',
    image: '/inventory/audi-q8-sline-2020/q8-1.jpg',
    images: [
      '/inventory/audi-q8-sline-2020/q8-1.jpg',
      '/inventory/audi-q8-sline-2020/q8-2.jpg',
      '/inventory/audi-q8-sline-2020/q8-3.jpg'
    ],
    tag: 'Q8 S-LINE 2020 • QUATTRO AWD • LUXURY SPORT SUV',
    description: '2020 Audi Q8 S-Line • Legendary Quattro all-wheel drive, dual touchscreen MMI touch response, Valcona leather sport seats, panoramic glass roof, dynamic Matrix LED lighting, full digital virtual cockpit. Certified inspection and warranty included.'
  },
  {
    id: 3,
    name: 'Volvo XC60 T8 Recharge 2026',
    make: 'Volvo',
    model: 'XC60 T8 Recharge',
    year: 2026,
    price: 'Price on Request',
    mileage: 'Brand New (0 km)',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    image: '/inventory/volvo-xc60-t8-2026/xc60-1.jpg',
    images: [
      '/inventory/volvo-xc60-t8-2026/xc60-1.jpg',
      '/inventory/volvo-xc60-t8-2026/xc60-2.jpg',
      '/inventory/volvo-xc60-t8-2026/xc60-3.jpg'
    ],
    tag: 'XC60 T8 2026 • PLUG-IN HYBRID • BRAND NEW 0 KM',
    description: '2026 Volvo XC60 T8 Recharge • High performance plug-in hybrid eAWD powertrain, Scandinavian minimalist luxury interior with genuine driftwood trim and Orrefors crystal gear shifter, Google built-in ecosystem, 360-degree surround view camera, brand new showroom delivery.'
  }
];

const onJournalPosts = [
  { category: 'News', title: 'The arrival of the 2024 collection', date: 'August 18, 2024', image: 'https://images.pexels.com/photos/14217531/pexels-photo-14217531.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Editorial', title: 'Why the V8 engine still matters', date: 'July 02, 2024', image: 'https://images.pexels.com/photos/18108314/pexels-photo-18108314.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
  { category: 'Culture', title: 'Inside Our Standard of Care', date: 'June 11, 2024', image: 'https://images.pexels.com/photos/29566879/pexels-photo-29566879.jpeg?auto=compress&cs=tinysrgb&h=650&w=940' },
];

function Logo({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <div className="logo brand-logo-wrap" onClick={() => onNavigate('home')} role="button" tabIndex={0} title="ON MOTORS">
      <img
        src="/on-motors-logo-transparent.png"
        alt="ON MOTORS"
        className="brand-logo-img"
      />
    </div>
  );
}

function Header({ page, onNavigate }: { page: Page; onNavigate: (page: Page) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const navigate = (nextPage: Page) => {
    onNavigate(nextPage);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };
  const isHero = page === 'home';
  return (
    <header className={`site-header${isHero ? ' header-transparent' : ''}`}>
      <div className="header-inner">
        <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <nav className="nav-links desktop-nav nav-left">
          <button className={page === 'inventory' ? 'nav-active' : ''} onClick={() => navigate('inventory')}>INVENTORY</button>
          <button className={page === 'about' ? 'nav-active' : ''} onClick={() => navigate('about')}>ABOUT</button>
          <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>JOURNAL</button>
        </nav>
        <Logo onNavigate={navigate} />
        <nav className="nav-links desktop-nav nav-right">
          <button className={page === 'contact' ? 'nav-active' : ''} onClick={() => navigate('contact')}>CONTACT US</button>
          <button className="book-test-drive" onClick={() => navigate('contact')}>TEST DRIVE</button>
        </nav>
      </div>

      {menuOpen && (
        <div className="mobile-nav-overlay">
          <div className="mobile-nav-header">
            <button className="mobile-menu-close" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <X size={28} />
            </button>
            <Logo onNavigate={navigate} />
          </div>
          <nav className="mobile-nav-body">
            <button className={page === 'inventory' ? 'nav-active' : ''} onClick={() => navigate('inventory')}>
              INVENTORY
            </button>
            <button className={page === 'about' ? 'nav-active' : ''} onClick={() => navigate('about')}>
              ABOUT
            </button>
            <button className={page === 'journal' ? 'nav-active' : ''} onClick={() => navigate('journal')}>
              JOURNAL
            </button>
            <div className="mobile-nav-divider" />
            <button className={page === 'contact' ? 'nav-active' : ''} onClick={() => navigate('contact')}>
              CONTACT US
            </button>
            <button className="mobile-book-test-drive" onClick={() => navigate('contact')}>
              BOOK TEST DRIVE
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

/* ─── Fullscreen Gallery Modal ───────────────────────── */
function FullscreenGalleryModal({
  images,
  initialIndex = 0,
  carTitle,
  onClose,
}: {
  images: string[];
  initialIndex?: number;
  carTitle: string;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [images.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      nextImage(); // Swiped left -> next
    } else if (distance < -minSwipeDistance) {
      prevImage(); // Swiped right -> prev
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div className="fullscreen-gallery-overlay" onClick={onClose}>
      <div className="fullscreen-gallery-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className="fullscreen-gallery-header">
          <div className="gallery-header-info">
            <span className="gallery-car-title">{carTitle}</span>
            <span className="gallery-counter">
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          <button className="gallery-close-btn" onClick={onClose} aria-label="Close Fullscreen Gallery">
            <X size={24} />
          </button>
        </div>

        {/* Main Stage */}
        <div
          className="fullscreen-stage"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="fullscreen-img-container">
            <img
              key={currentIndex}
              src={images[currentIndex]}
              alt={`${carTitle} photo ${currentIndex + 1}`}
              className="fullscreen-main-img"
              decoding="async"
            />
          </div>
        </div>

        {/* Bottom thumbnail strip */}
        {images.length > 1 && (
          <div className="fullscreen-thumbnails-strip">
            {images.map((imgUrl, idx) => (
              <button
                key={idx}
                className={`fullscreen-thumb-item ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Car Card ──────────────────────────────────────── */
function CarCard({
  car,
  onClick,
  viewMode = 'grid',
}: {
  car: Car;
  onClick: () => void;
  viewMode?: 'grid' | 'list';
}) {
  const isBrandNew = car.mileage.toLowerCase().includes('brand new') || car.mileage.startsWith('0');

  if (viewMode === 'list') {
    return (
      <article className="car-card car-card-list" onClick={onClick}>
        <div className="car-image-wrap">
          <img src={car.image} alt={car.name} loading="lazy" decoding="async" />
          <span className="car-badge">{car.make}</span>
        </div>
        <div className="car-info">
          <div className="car-list-top">
            <div className="car-list-title-row">
              <h3 className="car-name">{car.name}</h3>
              <span className="car-price car-desktop-price">{car.price}</span>
            </div>
            {car.tag && <div className="car-tag-pill">{car.tag}</div>}
            <p className="car-specs-line">{car.mileage} • {car.fuel} • {car.transmission}</p>
            <p className="car-list-description">{car.description}</p>
          </div>
          <div className="car-price-row">
            <span className="car-price car-mobile-price">{car.price}</span>
            <button className="car-more-details-btn" aria-label={`View details for ${car.name}`}>
              <span className="btn-full-text">DETAILS</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="car-card car-card-grid" onClick={onClick}>
      <div className="car-image-wrap">
        <img src={car.image} alt={car.name} loading="lazy" decoding="async" />
        <span className="car-badge">{car.make}</span>
      </div>
      <div className="car-info">
        <h3 className="car-name">{car.name}</h3>
        <p className="car-specs-line">{car.mileage} • {car.fuel} • {car.transmission}</p>
        <div className="car-price-row">
          <span className="car-price">{car.price}</span>
          <button className="car-more-details-btn" aria-label={`View details for ${car.name}`}>
            <span className="btn-full-text">MORE DETAILS</span>
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─── Home Page ─────────────────────────────────────── */
function HomePage({
  onNavigate,
  onSelectCar,
  onSearch,
}: {
  onNavigate: (page: Page) => void;
  onSelectCar: (id: number) => void;
  onSearch: (query: string) => void;
}) {
  const [q, setQ] = useState('');
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      onSearch(q.trim());
    } else {
      onNavigate('inventory');
    }
  };

  // Select 4 featured cars for the 4-in-a-row grid
  const featuredCars = cars.slice(0, 4);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section dark-emblem-hero">
        {/* Mobile Background Video (specifically fits whole hero on mobile) */}
        <div className="hero-mobile-video-bg">
          <video
            className="hero-video-element"
            autoPlay
            muted={isVideoMuted}
            loop
            playsInline
            src="/c300-coupe/c300video.mp4"
          />
          <div className="hero-video-gradient-overlay" />
          <button
            type="button"
            className="hero-video-sound-toggle"
            onClick={() => setIsVideoMuted(!isVideoMuted)}
            aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
            title={isVideoMuted ? 'Unmute video' : 'Mute video'}
          >
            {isVideoMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>

        <div className="hero-content">
          {/* Hero Emblem Graphic */}
          <div className="hero-desktop-emblem">
            <img
              src="/on-motors-logo-transparent.png"
              alt="ON MOTORS"
              className="hero-desktop-emblem-img"
            />
          </div>

          {/* Hero Slogan */}
          <p className="hero-subtext-clean">
            PREMIUM CARS, SUPERIOR SERVICE • SAIDA-BEIRUT HIGHWAY
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={20} className="hero-search-icon" />
            <input
              type="text"
              placeholder="Search make, model, or year..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">SEARCH</button>
          </form>
          <div className="hero-cta-row">
            <button className="hero-cta-primary" onClick={() => onNavigate('inventory')}>EXPLORE SHOWROOM</button>
            <a
              href="https://wa.me/96176070017?text=Hello%20ON%20Motors,%20I%20would%20like%20to%20inquire%20about%20your%20available%20cars."
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-ghost"
              style={{ textDecoration: 'none' }}
            >
              WHATSAPP CONCIERGE <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="home-stats-bar">
        <div className="home-stats-inner">
          <div className="stat-item">
            <span className="stat-number">PREMIER</span>
            <span className="stat-label">LUXURY COLLECTION</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">150-POINT</span>
            <span className="stat-label">INSPECTION STANDARD</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">AUTHENTIC PROVENANCE</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">VIP CONCIERGE CARE</span>
          </div>
        </div>
      </section>

      {/* Featured Cars / Showroom Refresh Announcement */}
      <section className="home-featured-section">
        {featuredCars.length > 0 ? (
          <>
            <div className="home-section-header">
              <p className="home-section-eyebrow">HANDPICKED SELECTION</p>
              <h2 className="home-section-title">Featured Inventory</h2>
              <p className="home-section-subtitle">
                Discover our newest arrivals, meticulously inspected and prepared for delivery.
              </p>
            </div>

            {/* 4 Cars Grid */}
            <div className="featured-4-grid">
              {featuredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onClick={() => onSelectCar(car.id)}
                />
              ))}
            </div>

            {/* CTAs */}
            <div className="home-featured-ctas">
              <button className="primary-button" onClick={() => onNavigate('inventory')}>
                VIEW FULL COLLECTION ({cars.length} CARS) <ArrowRight size={14} />
              </button>
              <button className="outline-button" onClick={() => onNavigate('about')}>
                THE SHOWROOM STANDARD
              </button>
            </div>
          </>
        ) : (
          <div className="collection-refresh-banner">
            <div className="cr-badge">
              <Sparkles size={14} /> NEW ARRIVALS IN TRANSIT
            </div>
            <h2 className="cr-title">Showroom Collection Refresh in Progress</h2>
            <p className="cr-desc">
              We are currently preparing and cataloging our upcoming collection of luxury motorcars, supercars, and premium SUVs. Connect directly with our showroom team on WhatsApp or follow our Instagram for live vehicle drops and custom vehicle sourcing.
            </p>
            <div className="cr-actions">
              <a
                href="https://wa.me/96176070017?text=Hello%20ON%20Motors,%20I%20would%20like%20to%20inquire%20about%20available%20and%20incoming%20vehicles."
                target="_blank"
                rel="noopener noreferrer"
                className="cr-btn-primary"
              >
                <MessageSquare size={16} /> INQUIRE ON WHATSAPP (+961 76 070 017)
              </a>
              <a
                href="https://www.instagram.com/onmotors1/"
                target="_blank"
                rel="noopener noreferrer"
                className="cr-btn-ghost"
              >
                <Instagram size={16} /> VIEW LIVE ON INSTAGRAM @onmotors1
              </a>
              <button className="cr-btn-outline" onClick={() => onNavigate('contact')}>
                CUSTOM VEHICLE SOURCING <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Category Spotlight Grid */}
      <section className="home-categories-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">EXPLORE BY CATEGORY</p>
          <h2 className="home-section-title">Browse Collections</h2>
        </div>
        <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="/inventory/mercedes-g63-amg-2021/g63-1.jpg" alt="Mercedes-AMG G 63" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>MERCEDES-AMG G 63</h3>
              <p>2021 V8 Biturbo • ON Motors Exclusive</p>
              <span className="category-cta">VIEW G 63 AMG <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="/inventory/audi-q8-sline-2020/q8-1.jpg" alt="Audi Q8 S-Line" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>AUDI Q8 S-LINE</h3>
              <p>2020 Quattro AWD • Luxury Sport SUV</p>
              <span className="category-cta">VIEW AUDI Q8 <ArrowRight size={13} /></span>
            </div>
          </div>
          <div className="category-card" onClick={() => onNavigate('inventory')}>
            <img src="/inventory/volvo-xc60-t8-2026/xc60-1.jpg" alt="Volvo XC60 T8 Recharge" loading="lazy" decoding="async" />
            <div className="category-overlay">
              <h3>VOLVO XC60 T8</h3>
              <p>2026 Plug-in Hybrid • Brand New 0 km</p>
              <span className="category-cta">VIEW VOLVO XC60 <ArrowRight size={13} /></span>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="home-why-section">
        <div className="home-why-inner">
          <div className="home-section-header">
            <p className="home-section-eyebrow">WHY CHOOSE US</p>
            <h2 className="home-section-title">A Quieter Kind of Confidence</h2>
            <p className="home-section-subtitle">
              We believe purchasing a remarkable pre-owned vehicle should feel as seamless as driving one.
            </p>
          </div>
          <div className="home-why-grid">
            <div className="why-card">
              <ShieldCheck size={36} strokeWidth={1.2} />
              <h3>150-Point Inspection</h3>
              <p>Every vehicle is rigorously evaluated across mechanical, electrical, and cosmetic standards by master technicians.</p>
            </div>
            <div className="why-card">
              <Sparkles size={36} strokeWidth={1.2} />
              <h3>Bespoke Concierge</h3>
              <p>Personalized consultation, nationwide enclosed vehicle transport, and custom financing solutions tailored to you.</p>
            </div>
            <div className="why-card">
              <CalendarDays size={36} strokeWidth={1.2} />
              <h3>Enduring Standard</h3>
              <p>Comprehensive protection options and dedicated ownership support long after you take delivery.</p>
            </div>
          </div>
          <div className="home-why-cta">
            <button className="outline-button" onClick={() => onNavigate('about')}>LEARN ABOUT OUR HERITAGE</button>
          </div>
        </div>
      </section>

      {/* Journal Preview */}
      <section className="home-journal-section">
        <div className="home-section-header">
          <p className="home-section-eyebrow">SHOWROOM JOURNAL</p>
          <h2 className="home-section-title">Latest Journal Stories</h2>
        </div>
        <div className="journal-preview-grid">
          {onJournalPosts.map((post) => (
            <article key={post.title} className="home-journal-card" onClick={() => onNavigate('journal')}>
              <div className="hj-image-wrap">
                <img src={post.image} alt={post.title} loading="lazy" decoding="async" />
              </div>
              <div className="hj-content">
                <span className="hj-category">{post.category}</span>
                <h3>{post.title}</h3>
                <div className="hj-meta">
                  <span>{post.date}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Dark Call-To-Action Banner */}
      <section className="home-bottom-cta">
        <div className="bottom-cta-inner">
          <p className="hero-eyebrow">READY TO DRIVE SOMETHING REMARKABLE?</p>
          <h2>Visit Our Showroom or Request a Personal Tour.</h2>
          <p>Our specialists are available for private appointments, test drives, and custom vehicle sourcing.</p>
          <div className="bottom-cta-buttons">
            <button className="primary-button-white" onClick={() => onNavigate('inventory')}>
              EXPLORE FULL INVENTORY
            </button>
            <button className="outline-button-white" onClick={() => onNavigate('contact')}>
              CONTACT CONCIERGE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── Sidebar Filter Content ────────────────────────── */
function SidebarFilterContent({
  filters,
  onChange,
  onClear,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
}) {
  const activeCount =
    filters.makes.length +
    filters.models.length +
    filters.years.length +
    filters.fuels.length +
    filters.transmissions.length +
    (filters.minYear !== DEFAULT_FILTERS.minYear || filters.maxYear !== DEFAULT_FILTERS.maxYear ? 1 : 0) +
    (filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice ? 1 : 0);

  const toggleItem = (key: 'makes' | 'models' | 'years' | 'fuels' | 'transmissions', val: any) => {
    const list = filters[key] as any[];
    onChange({
      ...filters,
      [key]: list.includes(val) ? list.filter(v => v !== val) : [...list, val],
    });
  };

  const availableModels = useMemo(() => {
    if (filters.makes.length === 0) return ALL_MODELS;
    const modelsSet = new Set<string>();
    filters.makes.forEach(m => {
      if (MAKE_MODELS_MAP[m]) {
        MAKE_MODELS_MAP[m].forEach(model => modelsSet.add(model));
      }
    });
    return Array.from(modelsSet);
  }, [filters.makes]);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    makes: false,
    models: false,
    years: false,
    price: false,
    fuels: false,
    transmissions: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="sf-header">
        <span className="sf-title">FILTERS {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}</span>
        {activeCount > 0 && (
          <button className="sf-clear" onClick={onClear}>Clear all</button>
        )}
      </div>

      {/* Brand / Make Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('makes')}
          type="button"
          aria-expanded={openSections.makes}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">BRAND / MAKE</span>
            {filters.makes.length > 0 && (
              <span className="sf-section-count">{filters.makes.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.makes ? ' open' : ''}`} />
        </button>
        {openSections.makes && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {ALL_MAKES.map(make => (
                <button
                  key={make}
                  className={`sf-chip${filters.makes.includes(make) ? ' active' : ''}`}
                  onClick={() => toggleItem('makes', make)}
                >
                  {make}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Model Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('models')}
          type="button"
          aria-expanded={openSections.models}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">MODEL</span>
            {filters.models.length > 0 && (
              <span className="sf-section-count">{filters.models.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.models ? ' open' : ''}`} />
        </button>
        {openSections.models && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {availableModels.map(model => (
                <button
                  key={model}
                  className={`sf-chip${filters.models.includes(model) ? ' active' : ''}`}
                  onClick={() => toggleItem('models', model)}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('years')}
          type="button"
          aria-expanded={openSections.years}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">YEAR</span>
            {(filters.years.length > 0 || filters.minYear !== DEFAULT_FILTERS.minYear || filters.maxYear !== DEFAULT_FILTERS.maxYear) && (
              <span className="sf-section-count">
                {filters.years.length > 0 ? `${filters.years.length}` : `${filters.minYear}–${filters.maxYear}`}
              </span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.years ? ' open' : ''}`} />
        </button>
        {openSections.years && (
          <div className="sf-accordion-body">
            <p className="sf-sub-label">SELECT SPECIFIC YEAR</p>
            <div className="sf-chips" style={{ marginBottom: '16px' }}>
              {ALL_YEARS.map(yr => (
                <button
                  key={yr}
                  className={`sf-chip${filters.years.includes(yr) ? ' active' : ''}`}
                  onClick={() => toggleItem('years', yr)}
                >
                  {yr}
                </button>
              ))}
            </div>
            <p className="sf-sub-label">YEAR RANGE <span className="sf-range-val">{filters.minYear} – {filters.maxYear}</span></p>
            <div className="sf-range-group">
              <input
                type="range" min={2005} max={2026}
                value={filters.minYear}
                onChange={e => onChange({ ...filters, minYear: Math.min(Number(e.target.value), filters.maxYear) })}
              />
              <input
                type="range" min={2005} max={2026}
                value={filters.maxYear}
                onChange={e => onChange({ ...filters, maxYear: Math.max(Number(e.target.value), filters.minYear) })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Price Range Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('price')}
          type="button"
          aria-expanded={openSections.price}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">PRICE RANGE</span>
            {(filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice) && (
              <span className="sf-section-count">${(filters.minPrice/1000).toFixed(0)}k–${(filters.maxPrice/1000).toFixed(0)}k</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.price ? ' open' : ''}`} />
        </button>
        {openSections.price && (
          <div className="sf-accordion-body">
            <p className="sf-sub-label">PRICE RANGE <span className="sf-range-val">${(filters.minPrice/1000).toFixed(0)}k – ${(filters.maxPrice/1000).toFixed(0)}k</span></p>
            <div className="sf-range-group">
              <input
                type="range" min={0} max={600000} step={5000}
                value={filters.minPrice}
                onChange={e => onChange({ ...filters, minPrice: Math.min(Number(e.target.value), filters.maxPrice) })}
              />
              <input
                type="range" min={0} max={600000} step={5000}
                value={filters.maxPrice}
                onChange={e => onChange({ ...filters, maxPrice: Math.max(Number(e.target.value), filters.minPrice) })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fuel Type Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('fuels')}
          type="button"
          aria-expanded={openSections.fuels}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">FUEL TYPE</span>
            {filters.fuels.length > 0 && (
              <span className="sf-section-count">{filters.fuels.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.fuels ? ' open' : ''}`} />
        </button>
        {openSections.fuels && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {ALL_FUELS.map(f => (
                <button
                  key={f}
                  className={`sf-chip${filters.fuels.includes(f) ? ' active' : ''}`}
                  onClick={() => toggleItem('fuels', f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transmission Dropdown */}
      <div className="sf-section sf-accordion">
        <button
          className="sf-accordion-header"
          onClick={() => toggleSection('transmissions')}
          type="button"
          aria-expanded={openSections.transmissions}
        >
          <div className="sf-accordion-title-wrap">
            <span className="sf-accordion-title">TRANSMISSION</span>
            {filters.transmissions.length > 0 && (
              <span className="sf-section-count">{filters.transmissions.length}</span>
            )}
          </div>
          <ChevronDown size={14} className={`sf-chevron${openSections.transmissions ? ' open' : ''}`} />
        </button>
        {openSections.transmissions && (
          <div className="sf-accordion-body">
            <div className="sf-chips">
              {ALL_TRANSMISSIONS.map(t => (
                <button
                  key={t}
                  className={`sf-chip${filters.transmissions.includes(t) ? ' active' : ''}`}
                  onClick={() => toggleItem('transmissions', t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function SidebarFilter({
  filters,
  onChange,
  onClear,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  onClear: () => void;
}) {
  return (
    <aside className="sidebar-filter">
      <SidebarFilterContent filters={filters} onChange={onChange} onClear={onClear} />
    </aside>
  );
}

function InventoryPage({
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  onSelectCar,
}: {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filters: FilterState;
  onFilterChange: React.Dispatch<React.SetStateAction<FilterState>>;
  sort: string;
  onSortChange: (s: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (v: 'grid' | 'list') => void;
  onSelectCar: (id: number) => void;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sortOptions = ['Newest first', 'Price: low to high', 'Price: high to low'];

  const activeCount =
    filters.makes.length +
    filters.models.length +
    filters.years.length +
    filters.fuels.length +
    filters.transmissions.length +
    (filters.minYear !== DEFAULT_FILTERS.minYear || filters.maxYear !== DEFAULT_FILTERS.maxYear ? 1 : 0) +
    (filters.minPrice !== DEFAULT_FILTERS.minPrice || filters.maxPrice !== DEFAULT_FILTERS.maxPrice ? 1 : 0);

  const displayCars = useMemo(() => {
    let result = cars;

    // Enhanced Multi-keyword Search
    if (searchQuery.trim() !== '') {
      const terms = searchQuery.toLowerCase().trim().split(/\s+/);
      result = result.filter(car => {
        const searchableText = `${car.name} ${car.make} ${car.model} ${car.tag || ''} ${car.year} ${car.fuel} ${car.transmission}`.toLowerCase();
        return terms.every(term => searchableText.includes(term));
      });
    }

    // Make / Brand
    if (filters.makes.length > 0) {
      result = result.filter(car => filters.makes.includes(car.make) || filters.makes.some(m => car.name.toLowerCase().includes(m.toLowerCase())));
    }

    // Model
    if (filters.models.length > 0) {
      result = result.filter(car => filters.models.includes(car.model) || filters.models.some(mod => car.name.toLowerCase().includes(mod.toLowerCase())));
    }

    // Exact Specific Years
    if (filters.years.length > 0) {
      result = result.filter(car => filters.years.includes(car.year));
    }

    // Fuel
    if (filters.fuels.length > 0) {
      result = result.filter(car => filters.fuels.includes(car.fuel));
    }

    // Transmission
    if (filters.transmissions.length > 0) {
      result = result.filter(car => filters.transmissions.includes(car.transmission));
    }

    // Year Range
    result = result.filter(car => car.year >= filters.minYear && car.year <= filters.maxYear);

    // Price — strip non-digits then compare (allow 'Price on Request' cars to always pass unless price filtered)
    result = result.filter(car => {
      if (
        car.price.toLowerCase().includes('call') ||
        car.price.toLowerCase().includes('inquire') ||
        car.price.toLowerCase().includes('poa') ||
        car.price.toLowerCase().includes('request')
      ) {
        return true;
      }
      const p = parseInt(car.price.replace(/\D/g, ''), 10);
      if (isNaN(p) || p === 0) return true;
      return p >= filters.minPrice && p <= filters.maxPrice;
    });

    // Sort
    if (sort === 'Price: low to high') {
      result = [...result].sort((a, b) => {
        const pA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const pB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;
        if (!pA && pB) return 1;
        if (pA && !pB) return -1;
        return pA - pB;
      });
    } else if (sort === 'Price: high to low') {
      result = [...result].sort((a, b) => {
        const pA = parseInt(a.price.replace(/\D/g, ''), 10) || 0;
        const pB = parseInt(b.price.replace(/\D/g, ''), 10) || 0;
        return pB - pA;
      });
    } else {
      result = [...result].sort((a, b) => b.year - a.year);
    }

    return result;
  }, [searchQuery, filters, sort]);

  return (
    <div className="inventory-page-wrapper">
      <h1 className="inventory-title">I N V E N T O R Y</h1>
      <div className="main-search-bar">
        <Search size={24} />
        <input
          type="text"
          placeholder="Search make, model, or keyword..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            title="Clear search"
            aria-label="Clear search"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #888)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
      <div className="inventory-layout">
        <SidebarFilter filters={filters} onChange={onFilterChange} onClear={() => onFilterChange(DEFAULT_FILTERS)} />
        <main className="inventory-main">
          <div className="inventory-toolbar">
            <span className="results-count">{displayCars.length} vehicle{displayCars.length !== 1 ? 's' : ''}</span>
            
            <div className="toolbar-actions">
              {/* Multiple Grid Layouts Switcher: 2x2 Grid & List */}
              <div className="view-mode-toggle" role="group" aria-label="Layout Grid Mode">
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('grid')}
                  title="2x2 Grid View"
                  aria-label="2x2 Grid View"
                >
                  <Grid2X2 size={15} />
                  <span className="view-toggle-text">2x2 Grid</span>
                </button>
                <button
                  type="button"
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => onViewModeChange('list')}
                  title="List Grid View"
                  aria-label="List Grid View"
                >
                  <List size={15} />
                  <span className="view-toggle-text">List</span>
                </button>
              </div>

              <button className="mobile-filter-toggle-btn" onClick={() => setMobileFilterOpen(true)}>
                <SlidersHorizontal size={14} /> FILTERS {activeCount > 0 && <span className="sf-badge">{activeCount}</span>}
              </button>

              <div className="sort-wrapper">
                <button className="sort-btn" onClick={() => setSortOpen(o => !o)}>
                  <SlidersHorizontal size={14} /> {sort} <ChevronDown size={13} />
                </button>
                {sortOpen && (
                  <div className="sort-menu">
                    {sortOptions.map(opt => (
                      <button key={opt} className={`sort-option${sort === opt ? ' active' : ''}`}
                        onClick={() => { onSortChange(opt); setSortOpen(false); }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`car-grid car-grid-${viewMode}`}>
            {displayCars.length > 0 ? (
              displayCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  viewMode={viewMode}
                  onClick={() => onSelectCar(car.id)}
                />
              ))
            ) : (
              <div className="inventory-empty-state">
                <div className="empty-state-icon">
                  <Sparkles size={32} />
                </div>
                <h3>Showroom Collection Updating</h3>
                <p>
                  Our upcoming lineup of luxury and certified pre-owned vehicles is currently being cataloged and prepared.
                  Looking for a specific vehicle? ON Motors sources elite vehicles on demand.
                </p>
                <div className="empty-state-actions">
                  <a
                    href="https://wa.me/96176070017?text=Hello%20ON%20Motors,%20I%20am%20looking%20for%20a%20specific%20vehicle%20and%20would%20like%20your%20assistance."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="empty-state-btn primary"
                  >
                    <MessageSquare size={15} /> CHAT ON WHATSAPP (+961 76 070 017)
                  </a>
                  <a
                    href="tel:+96176070017"
                    className="empty-state-btn secondary"
                  >
                    <Phone size={15} /> CALL SHOWROOM
                  </a>
                  <a
                    href="https://www.instagram.com/onmotors1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="empty-state-btn outline"
                  >
                    <Instagram size={15} /> @onmotors1
                  </a>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {mobileFilterOpen && (
        <div className="mobile-filter-modal-overlay">
          <div className="mobile-filter-modal">
            <div className="mobile-filter-modal-header">
              <span>FILTERS {activeCount > 0 && `(${activeCount})`}</span>
              <button className="mobile-filter-close" onClick={() => setMobileFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mobile-filter-modal-body">
              <SidebarFilterContent filters={filters} onChange={onFilterChange} onClear={() => onFilterChange(DEFAULT_FILTERS)} />
            </div>
            <div className="mobile-filter-modal-footer">
              <button className="sf-clear-btn" onClick={() => onFilterChange(DEFAULT_FILTERS)}>Clear All</button>
              <button className="sf-apply-btn" onClick={() => setMobileFilterOpen(false)}>
                SHOW {displayCars.length} VEHICLE{displayCars.length !== 1 ? 'S' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CarDetailsPage({
  carId,
  onNavigate,
  onOpenGallery,
}: {
  carId: number;
  onNavigate: (page: Page) => void;
  onOpenGallery?: (car: Car, index?: number) => void;
}) {
  const car = cars.find(c => c.id === carId);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!car) return <div style={{ padding: '100px 40px', textAlign: 'center' }}>Car not found.</div>;

  const gallery = car.images && car.images.length > 0 ? car.images : [car.image];
  const activeImage = gallery[activeImgIndex] || car.image;
  const whatsappMessage = encodeURIComponent(`Hello ON Motors, I am interested in the ${car.year} ${car.name}.`);

  const handleMainPhotoClick = () => {
    if (onOpenGallery) {
      onOpenGallery(car, activeImgIndex);
    }
  };

  return (
    <main className="car-details-page">
      <div className="car-details-wrapper">
        <div className="car-details-top-bar">
          <button className="back-btn" onClick={() => onNavigate('inventory')}>
            <ChevronLeft size={16} /> <span>BACK TO INVENTORY</span>
          </button>
        </div>

        <div className="car-details-showcase">
          {/* Left Column: Photo Frame & Thumbnails */}
          <div className="car-gallery-column">
            <div
              className="car-main-photo-frame clickable-photo-frame"
              onClick={handleMainPhotoClick}
              title="Click to view full screen gallery"
            >
              <img src={activeImage} alt={car.name} decoding="async" />
              {car.tag && <span className="photo-tag-badge">{car.tag}</span>}
              <div className="photo-fullscreen-hint">
                <Maximize2 size={13} />
                <span>FULLSCREEN ({activeImgIndex + 1}/{gallery.length})</span>
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="car-details-thumbnails-bar">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${activeImgIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImgIndex(idx)}
                  >
                    <img src={imgUrl} alt={`${car.name} view ${idx + 1}`} loading="lazy" decoding="async" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Specs & Actions */}
          <div className="car-info-column">
            <div className="car-title-block">
              <span className="car-eyebrow">ON MOTORS • {car.make.toUpperCase()}</span>
              <h1>{car.name.includes(String(car.year)) ? car.name : `${car.name} ${car.year}`}</h1>
              <div className="car-badges">
                {car.tag && <span className="badge tag-badge">{car.tag}</span>}
                <span className="badge make-badge">{car.make}</span>
                <span className="badge year-badge">{car.year}</span>
              </div>
            </div>

            {/* Price Card */}
            <div className="car-price-card">
              <div className="price-label">OFFERED AT</div>
              <div className="price-val">{car.price}</div>
              <div className="contact-subtext">
                {car.mileage.toLowerCase().includes('brand new') || car.mileage.startsWith('0')
                  ? 'Brand New Vehicle • Official Dealer Warranty Included'
                  : 'Certified Pre-Owned • Comprehensive Warranty & Inspection Included'}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="specs-grid-luxury">
              <div className="spec-card">
                <Gauge size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">MILEAGE</span>
                  <span className="spec-val">{car.mileage}</span>
                </div>
              </div>
              <div className="spec-card">
                <Fuel size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">FUEL TYPE</span>
                  <span className="spec-val">{car.fuel}</span>
                </div>
              </div>
              <div className="spec-card">
                <CalendarDays size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">MODEL YEAR</span>
                  <span className="spec-val">{car.year}</span>
                </div>
              </div>
              <div className="spec-card">
                <CheckCircle size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">TRANSMISSION</span>
                  <span className="spec-val">{car.transmission}</span>
                </div>
              </div>
              <div className="spec-card">
                <ShieldCheck size={18} strokeWidth={1.5} className="spec-icon" />
                <div className="spec-meta">
                  <span className="spec-label">WARRANTY</span>
                  <span className="spec-val">Included</span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="car-action-buttons">
              <a
                href={`https://wa.me/96176070017?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-concierge-btn"
              >
                <MessageSquare size={16} /> WHATSAPP CONCIERGE
              </a>
              <button className="book-testdrive-btn" onClick={() => onNavigate('contact')}>
                BOOK A TEST DRIVE
              </button>
            </div>

            {/* Vehicle Features Checklist */}
            <div className="car-full-description">
              <h2>VEHICLE FEATURES & HIGHLIGHTS</h2>
              <div className="car-features-checklist">
                {car.description
                  .split(/(?:✅|•|\n|, |; )/)
                  .map(p => p.trim())
                  .filter(p => p.length > 0 && !p.toLowerCase().startsWith('for more info') && !p.toLowerCase().startsWith('call us'))
                  .map(p => p.replace(/^(?:featuring|includes|equipped with)\s+/i, ''))
                  .map((feature, idx) => (
                    <div key={idx} className="feature-check-item">
                      <CheckCircle size={16} className="check-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function About({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <main className="page-main about-page">
      <section className="standard-hero">
        <p className="eyebrow">ABOUT ON MOTORS</p>
        <h1>PASSION FOR EXCELLENCE. DRIVEN BY DISTINCTION.</h1>
        <p>ON Motors — delivering premier luxury, performance, and certified pre-owned vehicles on the Saida-Beirut Highway, Lebanon.</p>
      </section>
      <section className="about-story">
        <div className="about-video-container">
          <video
            className="about-video-player"
            src="/onmotors-about.mp4"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
          <button
            type="button"
            className="about-video-sound-toggle"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            title={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            <span>{isMuted ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>
        </div>
        <div className="about-copy">
          <h2>CURATED SELECTION. UNCOMPROMISED QUALITY.</h2>
          <p>Located along the prime Saida-Beirut Highway, ON Motors delivers a premier automotive showroom experience tailored to car enthusiasts and discerning drivers, defined by "Premium Cars, Superior Service".</p>
          <p>From high-performance supercars and prestigious luxury SUVs to hand-selected certified pre-owned vehicles, every automobile in our care undergoes rigorous verification for mechanical integrity, provenance, and condition.</p>
          <p>We pride ourselves on unmatched customer transparency, vehicle trade-in and swapping, bespoke vehicle sourcing upon request, and comprehensive concierge service.</p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <button className="outline-button" onClick={() => onNavigate('inventory')}>EXPLORE SHOWROOM</button>
            <a
              href="https://wa.me/96176070017?text=Hello%20ON%20Motors,%20I%20would%20like%20to%20know%20more%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="primary-button"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              CONTACT CONCIERGE <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
      <section className="values">
        <div><ShieldCheck size={28} strokeWidth={1.5} /><h3>THOROUGHLY INSPECTED</h3><p>Every vehicle is meticulously checked, verified, and detailed to pristine showroom condition.</p></div>
        <div><Sparkles size={28} strokeWidth={1.5} /><h3>VIP CONCIERGE</h3><p>Personalized WhatsApp concierge assistance, transparent pricing, and on-demand vehicle sourcing.</p></div>
        <div><CalendarDays size={28} strokeWidth={1.5} /><h3>LEBANON HERITAGE</h3><p>Proudly serving clients across Lebanon from our prime Saida-Beirut Highway showroom location.</p></div>
      </section>
    </main>
  );
}

function OnJournal() {
  return (
    <main className="page-main club-page">
      <section className="standard-hero dark-hero">
        <p className="eyebrow">SHOWROOM JOURNAL</p>
        <h1>NOTES ON THE ROAD LESS TRAVELLED.</h1>
        <p>Stories, ideas, and considered advice for a life in motion.</p>
      </section>
      <section className="club-grid">
        {onJournalPosts.map((post) => (
          <article className="club-card" key={post.title}>
            <div className="club-image"><img src={post.image} alt={post.title} loading="lazy" decoding="async" /></div>
            <div className="club-copy">
              <p className="club-category">{post.category}</p>
              <h2>{post.title}</h2>
              <div className="club-meta"><span>{post.date}</span><ArrowRight size={17} /></div>
            </div>
          </article>
        ))}
      </section>
      <section className="newsletter">
        <h2>STAY IN THE KNOW</h2>
        <p>Good things, delivered occasionally.</p>
        <div className="email-form">
          <input placeholder="Enter your email address" type="email" />
          <button className="primary-button">SUBSCRIBE</button>
        </div>
      </section>
    </main>
  );
}

function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Vehicle Purchase',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <main className="page-main contact-page">
      {/* Hero Header */}
      <section className="standard-hero contact-hero">
        <p className="eyebrow">SHOWROOM & CONCIERGE</p>
        <h1>ON MOTORS</h1>
        <p>Located on the Saida-Beirut Highway, Lebanon. Whether you're looking for your next vehicle, inquiring about trade-ins / swapping, or scheduling a showroom visit, our team is at your service.</p>
      </section>

      {/* Main Channels Grid */}
      <section className="contact-channels-section">
        <div className="contact-grid">
          {/* Phone */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Phone size={24} />
            </div>
            <h3>PHONE & DIRECT CALLS</h3>
            <p className="contact-card-desc">Call our showroom sales desk directly for immediate assistance.</p>
            <div className="contact-card-details">
              <a href="tel:+96176070017" className="contact-link-bold">+961 76 070 017</a>
              <span className="contact-link-sub">Showroom Primary Hotline</span>
              <a href="tel:+96171450774" className="contact-link-bold" style={{ marginTop: '6px' }}>+961 71 450 774</a>
              <span className="contact-link-sub">Showroom Secondary Hotline</span>
            </div>
            <a href="tel:+96176070017" className="contact-card-action">CALL US NOW <ArrowRight size={14} /></a>
          </div>

          {/* WhatsApp */}
          <div className="contact-card highlight-card">
            <div className="contact-card-icon whatsapp-icon">
              <MessageSquare size={24} />
            </div>
            <h3>WHATSAPP CONCIERGE</h3>
            <p className="contact-card-desc">Direct 1-on-1 concierge assistance for quick inquiries, vehicle specs, and incoming arrivals.</p>
            <div className="contact-card-details">
              <span className="contact-link-bold">+961 76 070 017</span>
              <span className="contact-status-badge">• Online & Ready</span>
            </div>
            <a
              href="https://wa.me/96176070017?text=Hello%20ON%20Motors,%20I%20would%20like%20to%20inquire%20about%20a%20vehicle."
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-action whatsapp-action"
            >
              CHAT ON WHATSAPP <ArrowRight size={14} />
            </a>
          </div>

          {/* Social Channels (Instagram & Facebook) */}
          <div className="contact-card">
            <div className="contact-card-icon">
              <Instagram size={24} />
            </div>
            <h3>SOCIAL CHANNELS</h3>
            <p className="contact-card-desc">Follow our official channels for real-time deliveries, video walkthroughs, and updates.</p>
            <div className="social-links-grid" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              <a href="https://www.instagram.com/onmotors1/" target="_blank" rel="noreferrer" className="social-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Instagram size={15} /> @onmotors1
              </a>
              <a href="https://www.facebook.com/search/top?q=On%20Motors%20Saida" target="_blank" rel="noreferrer" className="social-chip" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Facebook size={15} /> ON Motors (Saida)
              </a>
            </div>
            <a href="https://www.instagram.com/onmotors1/" target="_blank" rel="noreferrer" className="contact-card-action">
              FOLLOW ON INSTAGRAM <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* Map & Form Section */}
      <section className="contact-map-form-section">
        <div className="contact-map-form-container">
          {/* Left: Contact Form */}
          <div className="contact-form-wrap">
            <h2>SEND US AN INQUIRY</h2>
            <p className="form-subtext">Fill out the form below and our vehicle specialist will get back to you promptly.</p>

            {formSubmitted ? (
              <div className="form-success-box">
                <CheckCircle size={32} color="#10b981" />
                <h3>THANK YOU FOR YOUR INQUIRY</h3>
                <p>Your message has been received. One of our concierges will reach out to you shortly via phone or WhatsApp.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-name">YOUR NAME *</label>
                    <input
                      id="c-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-email">EMAIL ADDRESS</label>
                    <input
                      id="c-email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="c-phone">PHONE / WHATSAPP NUMBER *</label>
                    <input
                      id="c-phone"
                      type="tel"
                      required
                      placeholder="+961 76 070 017"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="c-subject">INQUIRY TYPE</label>
                    <select
                      id="c-subject"
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Vehicle Purchase">Vehicle Purchase</option>
                      <option value="Custom Vehicle Sourcing">Custom Vehicle Sourcing</option>
                      <option value="Sell / Trade-in / Swap">Sell / Trade-in / Swap Vehicle</option>
                      <option value="Book Showroom Visit">Book Showroom Visit</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="c-message">YOUR MESSAGE *</label>
                  <textarea
                    id="c-message"
                    rows={4}
                    required
                    placeholder="Tell us about the vehicle you're looking for or how we can assist you..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="primary-button submit-btn">
                  SEND MESSAGE <Send size={14} />
                </button>
              </form>
            )}
          </div>

          {/* Right: Integrated Google Map & Location Details */}
          <div className="contact-location-wrap">
            <h2>OUR SHOWROOM</h2>
            <div className="location-info-card">
              <div className="info-item">
                <MapPin size={20} className="info-icon" />
                <div>
                  <span className="info-label">SHOWROOM ADDRESS</span>
                  <span className="info-val">Saida - Beirut Highway<br />Saida, Lebanon</span>
                </div>
              </div>
              <div className="info-item">
                <Clock size={20} className="info-icon" />
                <div>
                  <span className="info-label">OPERATING HOURS</span>
                  <span className="info-val">Monday – Saturday: 9:00 AM – 7:00 PM<br />Sunday: By Appointment</span>
                </div>
              </div>
            </div>

            {/* Google Map iFrame */}
            <div className="google-map-wrapper">
              <iframe
                title="ON Motors Showroom Location"
                src="https://maps.google.com/maps?q=Saida-Beirut+Highway,+Lebanon&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Saida+Beirut+Highway+Lebanon"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#111',
                  fontWeight: 700,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                  textDecoration: 'none'
                }}
              >
                <MapPin size={14} /> VIEW ON GOOGLE MAPS <ArrowRight size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  const [page, setPage] = useState<Page>('home');
  const [activeCarId, setActiveCarId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<string>('Newest first');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [galleryState, setGalleryState] = useState<{ car: Car; initialIndex: number } | null>(null);

  const handleOpenGallery = (car: Car, initialIndex: number = 0) => {
    setGalleryState({ car, initialIndex });
  };

  const handleCloseGallery = () => {
    setGalleryState(null);
  };

  // Always reset scroll position to the very top whenever navigating between pages or selecting a vehicle
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [page, activeCarId]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    window.scrollTo(0, 0);
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    setFilters(DEFAULT_FILTERS);
    setPage('inventory');
    window.scrollTo(0, 0);
  };

  const handleSelectCar = (id: number) => {
    setActiveCarId(id);
    setPage('car');
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-shell">
      <Header page={page} onNavigate={navigate} />
      {page === 'home'      && <HomePage onNavigate={navigate} onSelectCar={handleSelectCar} onSearch={handleHeroSearch} />}
      {page === 'inventory' && (
        <InventoryPage
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSelectCar={handleSelectCar}
        />
      )}
      {page === 'about'     && <About onNavigate={navigate} />}
      {page === 'journal'   && <OnJournal />}
      {page === 'contact'   && <ContactPage />}
      {page === 'car' && activeCarId && <CarDetailsPage carId={activeCarId} onNavigate={navigate} onOpenGallery={handleOpenGallery} />}

      {/* Fullscreen High-Resolution Gallery Lightbox */}
      {galleryState && (
        <FullscreenGalleryModal
          images={galleryState.car.images && galleryState.car.images.length > 0 ? galleryState.car.images : [galleryState.car.image]}
          initialIndex={galleryState.initialIndex}
          carTitle={`${galleryState.car.year} ${galleryState.car.name}`}
          onClose={handleCloseGallery}
        />
      )}

      <footer className="site-footer">
        <Logo onNavigate={navigate} />
        <div>
          <button onClick={() => navigate('inventory')}>INVENTORY</button>
          <button onClick={() => navigate('about')}>ABOUT</button>
          <button onClick={() => navigate('journal')}>JOURNAL</button>
          <button onClick={() => navigate('contact')}>CONTACT US</button>
          <a href="https://www.instagram.com/onmotors1/" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
            <Instagram size={14} /> @onmotors1
          </a>
          <a href="https://www.facebook.com/search/top?q=On%20Motors%20Saida" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600 }}>
            <Facebook size={14} /> Facebook
          </a>
        </div>
        <span>© 2025 ON Motors. All rights reserved. Saida-Beirut Highway, Lebanon.</span>
      </footer>
    </div>
  );
}

export default App;
