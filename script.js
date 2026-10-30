(function () {
  const $ = (s) => document.querySelector(s);
  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    kids.flat().forEach((c) => e.append(c));
    return e;
  }
  const tags = (list, cls) => h("div", { class: cls || "tags" }, list.map((t) => h("span", { class: "tag" }, t)));

  // Identitas
  document.title = DATA.name + " – Portofolio";
  $("#brand").textContent = DATA.name;
  $("#role").textContent = DATA.role;
  $("#name").textContent = DATA.name;
  $("#tagline").textContent = DATA.tagline;
  $("#updated").textContent = DATA.updated;

  // Foto (jika file tidak ada, tampil inisial)
  const initials = DATA.name.split(" ").filter((w) => w.length > 2).slice(-2).map((w) => w[0]).join("") || "R";
  const img = h("img", { src: DATA.photo, alt: "Foto " + DATA.name });
  img.onerror = () => $("#arch").replaceChildren(h("span", {}, initials));
  $("#arch").append(img);

  // Konten
  $("#about").append(...DATA.about.map((p) => h("p", {}, p)));

  $("#projects").append(...DATA.projects.map((p) => {
    const inner = p.link && p.link.startsWith("#");
    const title = p.link ? h("a", inner ? { href: p.link } : { href: p.link, target: "_blank", rel: "noopener" }, p.title) : p.title;
    return h("div", { class: "row" },
      h("div", { class: "key" }, p.year),
      h("div", {}, h("h3", {}, title), h("p", {}, p.desc), tags(p.tags)));
  }));

  $("#skills").append(...DATA.skills.map((s) =>
    h("div", { class: "row" }, h("div", { class: "key" }, s.group), tags(s.items, "items"))));

  $("#experience").append(...DATA.experience.map((x) =>
    h("div", { class: "row" },
      h("div", { class: "key" }, x.period),
      h("div", {}, h("h3", {}, x.title), h("p", { class: "muted" }, x.sub), h("p", {}, x.desc)))));

  const c = DATA.contact;
  $("#contact").append(
    h("p", { class: "prose" }, c.intro),
    h("p", { style: "margin-top:1.25rem" }, h("a", { class: "mail", href: "mailto:" + c.email }, c.email)),
    h("div", { class: "social" }, c.links.map((l) => h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.label)))
  );

  // Video: YouTube, Google Drive, file langsung, atau tautan luar
  function embed(v) {
    const u = v.url, cls = "frame" + (v.vertical ? " v" : "");
    const frame = (src, extra) => h("div", { class: cls + (extra || "") }, h("iframe", {
      src, title: v.title, loading: "lazy", allowfullscreen: "",
      referrerpolicy: "strict-origin-when-cross-origin",
      allow: "encrypted-media; picture-in-picture; fullscreen"
    }));
    let m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
    if (m) return frame("https://www.youtube-nocookie.com/embed/" + m[1]);
    m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return frame("https://drive.google.com/file/d/" + m[1] + "/preview");
    m = u.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/);
    if (m) return frame("https://www.instagram.com/" + (m[1] === "reels" ? "reel" : m[1]) + "/" + m[2] + "/embed", " s");
    m = u.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    if (m) return frame("https://www.tiktok.com/embed/v2/" + m[1], " s");
    if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) {
      const vid = h("video", { controls: "", preload: "metadata", playsinline: "" });
      vid.src = u;
      return h("div", { class: cls }, vid);
    }
    let host = u;
    try { host = new URL(u).hostname.replace("www.", ""); } catch (e) {}
    return h("a", { class: cls + " ext", href: u, target: "_blank", rel: "noopener" }, "Tonton di " + host);
  }
  if (DATA.videos && DATA.videos.length && $("#videos")) {
    $("#videos").append(...DATA.videos.map((v) =>
      h("figure", { class: "vid" }, embed(v), h("h3", {}, v.title), v.desc ? h("p", { class: "muted" }, v.desc) : "")));
  } else {
    const sec = $("#konten"), lnk = document.querySelector('nav a[href="#konten"]');
    if (sec) sec.remove();
    if (lnk) lnk.remove();
  }

  // Garis kontur peta (motif SIG), tergambar sekali saat halaman dibuka
  const svg = $("#contours");
  const NS = "http://www.w3.org/2000/svg";
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const peaks = [{ x: 570, y: 270, p: 0.6, n: 15 }, { x: 150, y: 450, p: 2.1, n: 9 }];
  let idx = 0;
  peaks.forEach((pk) => {
    for (let k = 1; k <= pk.n; k++) {
      const r = k * 21, pts = [];
      for (let i = 0; i <= 90; i++) {
        const a = (i / 90) * Math.PI * 2;
        const w = 1 + 0.16 * Math.sin(3 * a + pk.p + k * 0.12) + 0.09 * Math.sin(5 * a - pk.p * 1.7);
        pts.push((pk.x + Math.cos(a) * r * w).toFixed(1) + "," + (pk.y + Math.sin(a) * r * w * 0.82).toFixed(1));
      }
      const path = document.createElementNS(NS, "path");
      path.setAttribute("d", "M" + pts.join("L") + "Z");
      path.setAttribute("pathLength", "1");
      if (!still) {
        path.style.strokeDasharray = "1";
        path.style.strokeDashoffset = "1";
        path.style.transition = "stroke-dashoffset 1.8s cubic-bezier(.4,0,.2,1) " + idx * 0.05 + "s";
      }
      svg.append(path);
      idx++;
    }
  });
  if (!still) requestAnimationFrame(() => requestAnimationFrame(() =>
    svg.querySelectorAll("path").forEach((p) => (p.style.strokeDashoffset = "0"))));

  // Tandai menu aktif saat scroll
  const links = [...document.querySelectorAll("nav a")];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.setAttribute("aria-current", a.hash === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section").forEach((s) => io.observe(s));

  // Nama: kata naik satu per satu
  const nm = $("#name");
  nm.textContent = "";
  nm.setAttribute("aria-label", DATA.name);
  DATA.name.split(" ").forEach((w, i) => nm.append(h("span", { class: "w", "aria-hidden": "true" }, h("span", { style: "--i:" + i }, w)), " "));

  // Pita berjalan dari daftar keahlian, dan angka statistik dari data
  const mq = $("#mq"), mqItems = DATA.skills.flatMap((s) => s.items);
  for (let k = 0; k < 2; k++) mqItems.forEach((t) => mq.append(h("span", {}, t), h("i", {}, "\u2726")));
  const mq2 = $("#mq2");
  for (let k = 0; k < 2; k++) [...mqItems].reverse().forEach((t) => mq2.append(h("span", {}, t), h("i", {}, "\u2726")));
  [[DATA.projects.length, "Proyek"], [(DATA.videos || []).length, "Video"], [mqItems.length, "Keahlian"]]
    .filter((x) => x[0] > 0)
    .forEach(([n, label]) => $("#stats").append(h("div", { class: "stat" }, h("b", { "data-n": n }, String(n)), h("span", {}, label))));

  // Animasi: teks mengetik, muncul saat scroll, dan bar progres scroll
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = DATA.skills.map((s) => s.group), tp = $("#typed");
  if (tp && words.length) {
    if (reduced) tp.textContent = words[0];
    else {
      let wi = 0, ci = 0, del = false;
      (function tick() {
        const w = words[wi];
        ci += del ? -1 : 1;
        tp.textContent = w.slice(0, ci);
        let t = del ? 40 : 90;
        if (!del && ci === w.length) { del = true; t = 1400; }
        else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; t = 300; }
        setTimeout(tick, t);
      })();
    }
  }
  if (!reduced) {
    document.querySelectorAll("section:not(.hero) h2").forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.setAttribute("aria-label", el.textContent.trim());
      el.textContent = "";
      words.forEach((w, i) => el.append(h("span", { class: "hw", "aria-hidden": "true" }, h("span", { style: "--i:" + i }, w)), " "));
    });
    const ro = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll("section:not(.hero) h2, .prose, .row, .vid, .mail, .social, .stat").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", (i % 4) * 90 + "ms");
      ro.observe(el);
    });
    const so = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      so.unobserve(e.target);
      const n = +e.target.dataset.n, t0 = performance.now();
      (function f(t) {
        const k = Math.min(1, (t - t0) / 1300);
        e.target.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(f);
      })(t0);
    }), { threshold: 0.6 });
    document.querySelectorAll(".stat b").forEach((b) => { b.textContent = "0"; so.observe(b); });
    const bar = h("div", { class: "progress" });
    document.body.append(bar);
    addEventListener("scroll", () => {
      const m = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = "scaleX(" + (m > 0 ? scrollY / m : 0) + ")";
    }, { passive: true });
  }

  // Layar loading: hitung 0-100%, lalu buka portofolio
  const ld = $("#loader");
  if (ld) {
    if (reduced) { ld.remove(); document.body.classList.add("ready"); }
    else {
      const t0 = performance.now(), MIN = 1500, MAX = 5000;
      let loaded = document.readyState === "complete", shown = 0;
      if (!loaded) addEventListener("load", () => (loaded = true));
      (function step(now) {
        const el = now - t0;
        const target = (loaded && el >= MIN) || el >= MAX ? 100 : Math.min(90, (el / MIN) * 90);
        shown += (target - shown) * 0.1;
        if (target === 100 && shown > 99.4) shown = 100;
        $("#ldPct").textContent = Math.round(shown);
        $("#ldBar").style.transform = "scaleX(" + shown / 100 + ")";
        if (shown < 100) return requestAnimationFrame(step);
        setTimeout(() => {
          ld.classList.add("out");
          setTimeout(() => document.body.classList.add("ready"), 250);
          setTimeout(() => ld.remove(), 1100);
        }, 350);
      })(t0);
    }
  }

  // Efek 3D: kartu dan foto miring mengikuti kursor (hanya di perangkat dengan mouse)
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && matchMedia("(hover: hover)").matches) {
    const tilt = (el, max) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
        el.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * max + "deg");
        el.style.setProperty("--rx", (-((e.clientY - r.top) / r.height - 0.5)) * max + "deg");
      });
      el.addEventListener("pointerleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    };
    document.querySelectorAll(".row").forEach((el) => tilt(el, 2.5));
  }

  // Menu liquid glass: pill kaca bergeser ke menu aktif dan bisa diseret (mouse)
  const nav = $("nav"), pill = h("span", { class: "glass-pill" });
  nav.prepend(pill);
  const items = () => [...nav.querySelectorAll("a")];
  const active = () => items().find((a) => a.getAttribute("aria-current") === "true") || items()[0];
  let curX = 0, curW = 0, drag = null, hold = false, idleT, suppress = false;
  function place(a, anim) {
    if (!a) return;
    if (anim !== false) {
      pill.classList.add("moving");
      clearTimeout(place.t);
      place.t = setTimeout(() => pill.classList.remove("moving"), 380);
    }
    curX = a.offsetLeft; curW = a.offsetWidth;
    pill.style.width = curW + "px";
    pill.style.transform = "translateX(" + curX + "px)";
    nav.scrollTo({ left: a.offsetLeft - nav.clientWidth / 2 + a.offsetWidth / 2, behavior: "smooth" });
  }
  place(active(), false);
  addEventListener("load", () => place(active(), false));
  addEventListener("resize", () => place(active(), false));
  if (document.fonts) document.fonts.ready.then(() => place(active(), false));
  new MutationObserver(() => { if (!drag && !hold) place(active()); })
    .observe(nav, { attributes: true, attributeFilter: ["aria-current"], subtree: true });

  // Klik: pill meluncur dulu, penanda aktif ditahan sampai scroll selesai
  nav.addEventListener("click", (e) => {
    if (suppress) { e.preventDefault(); e.stopPropagation(); return; }
    const a = e.target.closest("a");
    if (!a) return;
    place(a);
    hold = true;
    clearTimeout(idleT);
    idleT = setTimeout(() => { hold = false; place(active()); }, 1200);
  }, true);
  addEventListener("scroll", () => {
    if (!hold) return;
    clearTimeout(idleT);
    idleT = setTimeout(() => { hold = false; place(active()); }, 160);
  }, { passive: true });

  // Seret: pill mengikuti kursor, lepas = menempel ke menu terdekat lalu pindah ke bagian itu
  nav.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch" || !e.target.closest("a")) return;
    drag = { x0: e.clientX, startX: curX, moved: false, id: e.pointerId };
  });
  nav.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return;
      drag.moved = true;
      nav.setPointerCapture(drag.id);
      nav.classList.add("dragging");
      pill.classList.remove("moving");
      pill.classList.add("drag");
    }
    const ls = items(), last = ls[ls.length - 1];
    const x = Math.max(ls[0].offsetLeft, Math.min(last.offsetLeft + last.offsetWidth - curW, drag.startX + dx));
    pill.style.transform = "translateX(" + x + "px)";
    pill.dataset.x = x;
  });
  const release = () => {
    if (!drag) return;
    const d = drag; drag = null;
    pill.classList.remove("drag");
    nav.classList.remove("dragging");
    if (!d.moved) return;
    const cx = parseFloat(pill.dataset.x) + curW / 2;
    const target = items().reduce((b, a) =>
      Math.abs(a.offsetLeft + a.offsetWidth / 2 - cx) < Math.abs(b.offsetLeft + b.offsetWidth / 2 - cx) ? a : b);
    target.click();
    suppress = true;
    setTimeout(() => (suppress = false), 120);
  };
  nav.addEventListener("pointerup", release);
  nav.addEventListener("pointercancel", release);

  // Sorotan latar mengikuti kursor dan tombol magnetis (hanya perangkat dengan mouse)
  if (!reduced && matchMedia("(hover: hover)").matches) {
    addEventListener("pointermove", (e) => {
      document.documentElement.style.setProperty("--sx", e.clientX + "px");
      document.documentElement.style.setProperty("--sy", e.clientY + "px");
      document.documentElement.style.setProperty("--px", (e.clientX / innerWidth - 0.5) * 2);
      document.documentElement.style.setProperty("--py", (e.clientY / innerHeight - 0.5) * 2);
    }, { passive: true });
    document.querySelectorAll(".btn, .social a").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.translate = (e.clientX - r.left - r.width / 2) * 0.18 + "px " + (e.clientY - r.top - r.height / 2) * 0.24 + "px";
      });
      el.addEventListener("pointerleave", () => (el.style.translate = ""));
    });
  }

  // Footer dan tombol kembali ke atas
  $("#foot").append(h("span", {}, "\u00a9 " + new Date().getFullYear() + " " + DATA.name), h("span", {}, "Dibuat dengan HTML, CSS, dan JavaScript"));
  const up = h("button", { class: "totop", "aria-label": "Kembali ke atas" }, "\u2191");
  document.body.append(up);
  up.onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  addEventListener("scroll", () => up.classList.toggle("show", scrollY > 700), { passive: true });

  // Latar konstelasi: titik-titik biru yang saling terhubung dan mendekat ke kursor
  if (!reduced) {
    const cv = h("canvas", { id: "bg" });
    document.body.prepend(cv);
    const ctx = cv.getContext("2d");
    let W, H, pts = [], mx = -999, my = -999;
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * d; cv.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      pts = Array.from({ length: Math.round(Math.min(70, (W * H) / 30000)) }, () => ({
        x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25
      }));
    };
    size();
    addEventListener("resize", size);
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const line = (x1, y1, x2, y2, rgb, a) => {
      ctx.strokeStyle = "rgba(" + rgb + "," + a + ")";
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };
    (function draw() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, W, H);
        for (const p of pts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        for (let i = 0; i < pts.length; i++) {
          const a = pts[i];
          ctx.fillStyle = "rgba(140,185,255,.4)";
          ctx.beginPath(); ctx.arc(a.x, a.y, 1.4, 0, 6.283); ctx.fill();
          for (let k = i + 1; k < pts.length; k++) {
            const b = pts[k], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < 130) line(a.x, a.y, b.x, b.y, "100,150,255", 0.12 * (1 - d / 130));
          }
        }
      }
      requestAnimationFrame(draw);
    })();
  }

  // Lanyard: kartu tergantung, berayun seperti bandul, dan bisa ditarik lalu dilepas
  const swing = $("#swing"), lan = $("#stage");
  if (swing && lan) {
    $("#bName").textContent = DATA.name;
    $("#bRole").textContent = DATA.role;
    let a = reduced ? 0 : 14, v = 0, drag = false, last = performance.now(), moved = 0;
    swing.addEventListener("pointerdown", (e) => {
      drag = true; v = 0;
      swing.setPointerCapture(e.pointerId);
      lan.classList.add("grab");
    });
    swing.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const r = lan.getBoundingClientRect();
      const na = Math.max(-30, Math.min(30, -Math.atan2(e.clientX - (r.left + r.width / 2), e.clientY - r.top) * 57.2958));
      v = Math.max(-1, Math.min(1, (na - a) * 0.25));
      a = na;
      moved = performance.now();
    });
    const drop = () => { drag = false; lan.classList.remove("grab"); if (performance.now() - moved > 80) v = 0; };
    swing.addEventListener("pointerup", drop);
    swing.addEventListener("pointercancel", drop);
    (function loop(now) {
      const dt = Math.min(2.5, (now - last) / 16.67);
      last = now;
      if (!reduced && !drag) {
        if (!document.body.classList.contains("ready")) { a = 14; v = 0; }
        else {
          v += (-0.0045 * a + Math.sin(now / 1800) * 0.0025) * dt;
          v *= Math.pow(0.986, dt);
          a += v * dt;
        }
      }
      swing.style.transform = "rotate(" + a + "deg)";
      requestAnimationFrame(loop);
    })(last);
  }
})();