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
