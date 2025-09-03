// เปลี่ยนพื้นหลัง/เงา navbar เมื่อเลื่อนลง
const onScroll = () => document.body.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll);
onScroll();

// ทำ active link ตาม section ปัจจุบัน
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const current = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      current?.classList.add('active');
    }
  });
}, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });

sections.forEach(sec => io.observe(sec));

///////////////////////////////////////////////////////////////////////////////about-card///////////////////////////////////////////////
const sw = new Swiper('.mySwiper', {
    loop: true,
    centeredSlides: true,        // การ์ดกลางอยู่ตรงกลาง
    slidesPerView: 'auto',       // ใช้ความกว้างจาก CSS ของ .swiper-slide
    spaceBetween: 24,            // ระยะห่างการ์ด
    grabCursor: true,
    effect: 'coverflow',
    coverflowEffect: {
        rotate: 0,                 // หมุนข้าง ๆ (0 = ไม่หมุน)
        stretch: 0,                // ยืดเข้าออก
        depth: 120,                // ระยะลึก (perspective)
        modifier: 1,
        slideShadows: false
    },
    autoplay: { delay: 3000, disableOnInteraction: false },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    pagination: { el: '.swiper-pagination', clickable: true },
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔁 Restart animations for every section on enter
// รีสตาร์ทอนิเมชันทุกครั้งที่ element เข้าจอ
(() => {
  const restart = (el) => { el.classList.remove('animate'); void el.offsetWidth; el.classList.add('animate'); };

  // 2.1 reveal/fade
  const revEls = document.querySelectorAll('.reveal, .reveal-right');
  const io1 = new IntersectionObserver(es => {
    es.forEach(en => en.isIntersecting ? restart(en.target) : en.target.classList.remove('animate'));
  }, { threshold: 0.2, rootMargin: '0px 0px -5% 0px' });
  revEls.forEach(el => io1.observe(el));

  // 2.2 typing effect (ถ้ามี)
  const typEls = document.querySelectorAll('.typing');
  const io2 = new IntersectionObserver(es => {
    es.forEach(en => {
      if (en.isIntersecting) { en.target.classList.remove('typing'); void en.target.offsetWidth; en.target.classList.add('typing'); }
    });
  }, { threshold: 0.2 });
  typEls.forEach(el => io2.observe(el));

  // 2.3 Lottie (ถ้าใช้)
  const lotEls = document.querySelectorAll('lottie-player, dotlottie-wc');
  const io3 = new IntersectionObserver(es => {
    es.forEach(en => en.isIntersecting ? (en.target.play?.()) : (en.target.pause?.()));
  }, { threshold: 0.1 });
  lotEls.forEach(el => io3.observe(el));
})();


