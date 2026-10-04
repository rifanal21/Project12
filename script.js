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
    const frame = (src) => h("div", { class: cls }, h("iframe", {
      src, title: v.title, loading: "lazy", allowfullscreen: "",
      referrerpolicy: "strict-origin-when-cross-origin",
      allow: "encrypted-media; picture-in-picture; fullscreen"
    }));
    let m = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{11})/);
    if (m) return frame("https://www.youtube-nocookie.com/embed/" + m[1]);
    m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return frame("https://drive.google.com/file/d/" + m[1] + "/preview");
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
})();
