document.documentElement.classList.add('js');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Menu HP */
const menuBtn = document.querySelector('.menu-btn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  menuBtn.querySelector('.sr-only').textContent = open ? 'Buka menu' : 'Tutup menu';
  document.body.classList.toggle('menu-open', !open);
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.querySelector('.sr-only').textContent = 'Buka menu';
  document.body.classList.remove('menu-open');
}));

/* Efek mengetik di hero */
const typed = document.querySelector('.typed');
const roles = ['System Analyst', 'Web Developer'];
if (!reduce) {
  let r = 0, i = roles[0].length, deleting = true;
  const tick = () => {
    const word = roles[r];
    typed.textContent = word.slice(0, i);
    if (deleting) {
      i--;
      if (i < 0) { deleting = false; r = (r + 1) % roles.length; i = 0; }
      setTimeout(tick, i === word.length - 1 ? 1600 : 45);
    } else {
      i++;
      if (i > roles[r].length) { deleting = true; i = roles[r].length; setTimeout(tick, 1600); return; }
      setTimeout(tick, 85);
    }
  };
  setTimeout(tick, 2200);
}

/* Judul: kata naik satu per satu, lalu garis emas memanjang */
document.querySelectorAll('[data-heading]').forEach((el) => {
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(' ').map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
});

/* Angka berjalan */
const countUp = (el) => {
  const end = parseFloat(el.dataset.count);
  if (reduce) { el.textContent = end; return; }
  const start = performance.now();
  const step = (t) => {
    const p = Math.min((t - start) / 1300, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

/* Muncul saat di-scroll */
const revealEls = document.querySelectorAll('.about-text p, .contact-card, .timeline li, .softs li, .center-head > p, .skill-block, .tiles li, .stats li, .laptop, .magang-text, .work, .certs, .org');
revealEls.forEach((el) => {
  el.classList.add('reveal');
  const idx = [...el.parentElement.children].indexOf(el);
  el.style.setProperty('--d', Math.min(idx, 8) * 70 + 'ms');
});
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in');
    el.querySelectorAll?.('[data-count]').forEach(countUp);
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach((el) => io.observe(el));
const photo = document.querySelector('.about-photo');
photo.classList.add('wipe');
const photoIo = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) { photo.classList.add('in'); photoIo.disconnect(); }
}, { threshold: 0.2 });
photoIo.observe(document.querySelector('.about-side'));
document.querySelectorAll('[data-heading]').forEach((el) => io.observe(el));

/* Menu aktif, garis progres, tombol ke atas */
const navLinks = [...menu.querySelectorAll('a')];
const secIo = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
document.querySelectorAll('main section[id]').forEach((s) => secIo.observe(s));

const bar = document.querySelector('.progress span');
const toTop = document.querySelector('.to-top');
const header = document.querySelector('.top');
const wa = document.querySelector('.wa');
let ticking = false;
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  toTop.classList.toggle('show', scrollY > 700);
  header.classList.toggle('scrolled', scrollY > 20);
  wa.classList.toggle('hide', innerWidth <= 760 && scrollY < innerHeight * .8);
  ticking = false;
};
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();

/* Kartu miring mengikuti kursor */
if (!reduce && matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* Galeri */
const galleries = {
  kevatie: { title: 'Kevatie, sistem stok jas hujan', items: [
    ['img/kevatie-login.webp', 'Halaman login'],
    ['img/kevatie-dashboard.webp', 'Grafik distribusi stok per model dan per warna di dashboard Pemilik'],
    ['img/kevatie-masuk.webp', 'Form pencatatan barang masuk oleh Bagian Gudang'],
    ['img/kevatie-keluar.webp', 'Form pencatatan barang keluar dengan data pelanggan dan channel penjualan'],
    ['img/kevatie-import.webp', 'Import pesanan dari file CSV marketplace dalam tiga langkah'],
    ['img/kevatie-laporan.webp', 'Laporan stok per bulan yang bisa dicetak ke PDF']] },
  setara: { title: 'Setara Booth, sistem photo booth', items: [
    ['img/setara-dashboard.webp', 'Dashboard admin: pendapatan, sesi foto, foto dicetak, dan status booth'],
    ['img/setara-booth.webp', 'Layar pembuka mode booth untuk pelanggan']] },
  setda: { title: 'Magang di Setda Provinsi Jawa Barat', items: [
    ['img/setda-index.webp', 'Halaman utama prototipe pendaftaran magang'],
    ['img/setda-registrasi.webp', 'Form registrasi akun peserta'],
    ['img/setda-dashboard.webp', 'Dashboard peserta magang'],
    ['img/setda-dashboard-statistics.webp', 'Statistik peserta per status dan asal perguruan tinggi'],
    ['img/setda-coding.webp', 'Menulis kode di Visual Studio Code'],
    ['img/setda-tracker.webp', 'Task tracker dan daftar hadir kerja praktik'],
    ['img/setda-tim.webp', '']] },
  bnsp: { title: 'Sertifikat Badan Nasional Sertifikasi Profesi', items: [
    ['img/sertif-bnsp-1.webp', 'Sertifikat kompetensi Certified Associate Data Scientist (CADS)'],
    ['img/sertif-bnsp-2.webp', 'Daftar 9 unit kompetensi']] },
  ept: { title: 'English Proficiency Test', items: [['img/sertif-ept.webp', 'Language Center Universitas Komputer Indonesia, skor 503']] },
  dicoding: { title: 'Dicoding', items: [['img/sertif-dicoding.webp', 'Belajar Dasar Pemrograman Web']] },
  rajaban: { title: 'Rajaban Akbar Karang Taruna', items: [
    ['img/rajaban-idcard.webp', 'Kartu panitia Rajaban Akbar 2026, bagian bendahara']] },
  paramuda: { title: 'Mega Project Paramuda Indonesia', items: [
    ['img/paramuda-rw10.webp', 'Relawan dan warga setelah kegiatan Pajajaran'],
    ['img/paramuda-kegiatan.webp', 'Kegiatan bersama anak-anak']] },
};
const viewer = document.getElementById('viewer');
const vImg = viewer.querySelector('img');
const vCap = viewer.querySelector('figcaption');
const vTitle = viewer.querySelector('.viewer-title');
const vCount = viewer.querySelector('.viewer-count');
const vPrev = viewer.querySelector('.viewer-prev');
const vNext = viewer.querySelector('.viewer-next');
let cur = null, pos = 0;
const show = () => {
  const [src, cap] = cur.items[pos];
  vImg.src = src; vImg.alt = cap; vCap.textContent = cap;
  vCount.textContent = `${pos + 1} dari ${cur.items.length}`;
  const many = cur.items.length > 1;
  vPrev.hidden = !many; vNext.hidden = !many; vCount.hidden = !many;
};
document.querySelectorAll('[data-gallery]').forEach((btn) => btn.addEventListener('click', () => {
  cur = galleries[btn.dataset.gallery]; pos = 0;
  vTitle.textContent = cur.title; show(); viewer.showModal();
}));
vPrev.addEventListener('click', () => { pos = (pos - 1 + cur.items.length) % cur.items.length; show(); });
vNext.addEventListener('click', () => { pos = (pos + 1) % cur.items.length; show(); });
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
viewer.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') vNext.click();
  if (e.key === 'ArrowLeft') vPrev.click();
});
