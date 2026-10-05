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
    const ro = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); ro.unobserve(e.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll("section:not(.hero) h2, .prose, .row, .vid, .mail, .social").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", (i % 4) * 90 + "ms");
      ro.observe(el);
    });
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
      const t0 = performance.now(), MIN = 2000, MAX = 5000;
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
    tilt($("#stage"), 16);
    document.querySelectorAll(".row").forEach((el) => tilt(el, 5));
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
})();