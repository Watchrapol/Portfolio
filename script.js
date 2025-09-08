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
  centeredSlides: true,
  slidesPerView: 'auto',
  spaceBetween: 24,
  grabCursor: true,
  effect: 'coverflow',
  coverflowEffect: { rotate: 0, stretch: 0, depth: 120, modifier: 1, slideShadows: false },

  // ✅ แก้เคสดับ/เพี้ยนเมื่ออยู่ใน flex/grid, ซ่อน/แสดง, หรือปรับขนาด
  observer: true,
  observeParents: true,
  resizeObserver: true,
  updateOnWindowResize: true,

  autoplay: { delay: 3000, disableOnInteraction: false },
  pagination: { el: '.swiper-pagination', clickable: true },

});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔁 Restart animations for every section on enter
(() => {
  const els = document.querySelectorAll('.rerun');
  if (!els.length) return;

  const COOLDOWN = 800; // ms
  const lastRun = new WeakMap();
  const queue = new Set();
  let scheduled = false;

  const restart = (el) => {
    el.style.animation = 'none';
    // reflow เพื่อเริ่มรอบใหม่
    void el.offsetWidth;
    el.style.animation = '';
  };

  const scheduleRestart = (el) => {
    // กันรีสตาร์ทถี่ ๆ ต่อ element
    const t = Date.now();
    if ((t - (lastRun.get(el) || 0)) < COOLDOWN) return;
    lastRun.set(el, t);

    queue.add(el);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(() => {
        queue.forEach(restart);
        queue.clear();
        scheduled = false;
      });
    }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      const el = en.target;
      const once = el.getAttribute('data-once') === 'true';
      const on = el.dataset.inview === '1';
      const r = en.intersectionRatio;

      // เข้าเฟรม “มากพอ” ครั้งแรก → ค่อยเริ่ม
      if (!on && r >= 0.60) {
        scheduleRestart(el);
        el.dataset.inview = '1';
      }
      // ออกจากเฟรมเกือบหมดจริง ๆ → เตรียมรอบใหม่ (ถ้าไม่ได้ตั้งเล่นครั้งเดียว)
      else if (on && !once && r <= 0.05) {
        el.style.animation = 'none';
        el.dataset.inview = '0';
      }
    });
  }, {
    threshold: [0, 0.05, 0.6, 1],
    // ลบส่วนบน ~80px เผื่อ navbar, และบัฟเฟอร์บน/ล่างกันเด้ง
    rootMargin: '-80px 0px -20% 0px'
  });

  els.forEach(el => { el.dataset.inview = '0'; io.observe(el); });

  // เล่นรอบแรกให้ของที่อยู่ในจอหลังโหลด
  window.addEventListener('load', () => {
    els.forEach(el => {
      const r = el.getBoundingClientRect();
      const visible = r.top < innerHeight * 0.4 && r.bottom > innerHeight * 0.6;
      if (visible) { scheduleRestart(el); el.dataset.inview = '1'; }
    });
  });
})();

/*/////////////////////////////////////////////////////////////////*/
// ===== Copy email =====
document.querySelectorAll('.copy-email').forEach(btn => {
  btn.addEventListener('click', async () => {
    const email = btn.dataset.copy || 'watcharapol.m@ku.th';
    try {
      await navigator.clipboard.writeText(email);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = prev, 1200);
    } catch (e) {
      btn.textContent = 'Copy failed';
      setTimeout(() => btn.textContent = 'Copy', 1200);
    }
  });
});

// ===== Mailto fallback =====
document.getElementById('mailtoBtn')?.addEventListener('click', () => {
  const name = encodeURIComponent(document.getElementById('name').value.trim());
  const email = encodeURIComponent(document.getElementById('email').value.trim());
  const subject = encodeURIComponent(document.getElementById('subject').value.trim() || 'Hello Auy');
  const message = encodeURIComponent(document.getElementById('message').value.trim());

  const body = `From: ${name} (${email})%0A%0A${message}`;
  const mailto = `mailto:watcharapol.m@ku.th?subject=${subject}&body=${body}`;
  window.location.href = mailto;
});

// ===== Formspree submit (AJAX) =====
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formStatus.textContent = 'Sending...';

    const formData = new FormData(contactForm);
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      if (res.ok) {
        formStatus.textContent = 'ขอบคุณครับ! ผมได้รับข้อความแล้ว';
        contactForm.reset();
      } else {
        formStatus.textContent = 'ส่งไม่สำเร็จ ลองส่งผ่านอีเมลแทนได้ครับ';
      }
    } catch (err) {
      formStatus.textContent = 'เครือข่ายมีปัญหา ลองอีกครั้งหรือส่งอีเมลแทน';
    }
  });
}
/*//////////////สลับภาษา//////////////////*/
const root = document.body;
const saved = localStorage.getItem('lang') || 'th';
root.dataset.lang = saved;

document.getElementById('langToggle')?.addEventListener('click', () => {
  root.dataset.lang = root.dataset.lang === 'th' ? 'en' : 'th';
  localStorage.setItem('lang', root.dataset.lang);
});