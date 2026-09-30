(function () {
  const data = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);

  // Header and footer text
  document.title = data.artist + " — Drawings";
  $("artist-name").textContent = data.artist;
  $("tagline").textContent = data.tagline || "";
  $("about").textContent = data.about || "";
  $("footer-name").textContent = data.artist;
  $("year").textContent = new Date().getFullYear();
  if (data.email) {
    const a = document.createElement("a");
    a.href = "mailto:" + data.email;
    a.textContent = data.email;
    $("contact").append("Contact: ", a);
  }

  // Filters
  const series = [...new Set(data.drawings.map((d) => d.series).filter(Boolean))];
  let active = "All";
  let visible = data.drawings;

  function renderFilters() {
    const nav = $("filters");
    nav.innerHTML = "";
    if (series.length < 2) return;
    for (const name of ["All", ...series]) {
      const b = document.createElement("button");
      b.textContent = name;
      b.setAttribute("aria-pressed", name === active);
      b.onclick = () => { active = name; renderFilters(); renderGallery(); };
      nav.append(b);
    }
  }

  // Gallery
  function renderGallery() {
    visible = active === "All" ? data.drawings : data.drawings.filter((d) => d.series === active);
    const ul = $("gallery");
    ul.innerHTML = "";
    visible.forEach((d, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button class="card" aria-label="View ${escapeHtml(d.title)}">
          <img src="${d.src}" alt="${escapeHtml(d.title)}" loading="lazy">
        </button>
        <p class="caption"><span>${escapeHtml(d.title)}</span><span>${d.year || ""}</span></p>`;
      li.querySelector("button").onclick = () => openLightbox(i);
      ul.append(li);
    });
  }

  // Lightbox
  const lb = $("lightbox");
  let current = 0;

  function show(i) {
    current = (i + visible.length) % visible.length;
    const d = visible[current];
    $("lb-img").src = d.src;
    $("lb-img").alt = d.title;
    $("lb-title").textContent = d.title;
    $("lb-meta").textContent = [d.medium, d.year].filter(Boolean).join(", ");
  }
  function openLightbox(i) {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }

  lb.querySelector(".lb-close").onclick = closeLightbox;
  lb.querySelector(".lb-prev").onclick = () => show(current - 1);
  lb.querySelector(".lb-next").onclick = () => show(current + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  // Swipe on touch screens
  let touchX = null;
  lb.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  renderFilters();
  renderGallery();
})();
