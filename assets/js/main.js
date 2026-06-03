const LANG_STORAGE_KEY = "lab_site_lang";
const SITE_CONTENT = window.SITE_CONTENT_DATA || {};
let currentLang = "zh";
let revealObserver = null;

function getCurrentContent() {
  return SITE_CONTENT[currentLang] || SITE_CONTENT.zh;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || "";
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function applyMeta(content) {
  document.title = content.meta.title;
  document.documentElement.setAttribute("lang", currentLang === "zh" ? "zh-CN" : "en");

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.setAttribute("content", content.meta.description);

  const keywordMeta = document.querySelector('meta[name="keywords"]');
  if (keywordMeta) keywordMeta.setAttribute("content", content.meta.keywords);
}

function applyStaticUI(content) {
  const { ui } = content;
  setText("skip-link", ui.skipLink);
  setText("nav-toggle", ui.navMenu);
  setText("nav-lab", ui.navLab);
  setText("nav-members", ui.navMembers);
  setText("nav-research", ui.navResearch);
  setText("sidebar-members-title", ui.sidebarMembersTitle || "");
  setText("hero-btn-lab", ui.heroBtnLab);
  setText("hero-btn-join", ui.heroBtnJoin);
  setText("hero-overview-title", ui.heroOverviewTitle);
  setText("mentor-profile-label", ui.mentorProfileLabel);
  setText("mentor-profile-title", ui.mentorProfileTitle);
  setText("mentor-overview-title", ui.mentorOverviewTitle);
  setText("mentor-links-title", ui.mentorLinksTitle || "");
  setText("mentor-areas-title", ui.mentorAreasTitle);
  setText("mentor-services-title", ui.mentorServicesTitle);
  setText("members-label", ui.membersLabel);
  setText("members-title", ui.membersTitle);
  setText("mentor-photo-label", ui.mentorPhotoLabel);
  setText("mentor-photo-note", ui.mentorPhotoNote);
  setText("mentor-history-title", ui.mentorHistoryTitle);
  setText("mentor-contact-title", ui.mentorContactTitle);
  setText("team-subtitle", ui.teamSubtitle);
  setText("lab-label", ui.labLabel);
  setText("lab-title", ui.labTitle);
  setText("lab-focus-title", ui.labFocusTitle);
  setText("lab-philosophy-title", ui.labPhilosophyTitle);
  setText("lab-culture-title", ui.labCultureTitle);
  setText("lab-welcome-title", ui.labWelcomeTitle);
  setText("news-label", ui.newsLabel);
  setText("news-title", ui.newsTitle);
  setText("research-label", ui.researchLabel);
  setText("research-title", ui.researchTitle);
  setText("research-directions-title", ui.researchDirectionsTitle);
  setText("research-outcomes-title", ui.researchOutcomesTitle);
  setText("research-publications-title", ui.researchPublicationsTitle);
  setText("join-label", ui.joinLabel);
  setText("join-title", ui.joinTitle);
  setText("join-expectations-title", ui.joinExpectationsTitle);
  setText("join-process-title", ui.joinProcessTitle);
  setText("footer-contact-title", ui.footerContactTitle);
  setText("footer-links-title", ui.footerLinksTitle);

  const nav = document.getElementById("site-nav");
  if (nav) nav.setAttribute("aria-label", ui.navAria);
  const toggle = document.getElementById("nav-toggle");
  if (toggle) toggle.setAttribute("aria-label", ui.navMenuAria);

  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.textContent = ui.langButton;
    langToggle.setAttribute("aria-label", ui.langButtonAria);
  }
}

function renderHero(content) {
  const { hero } = content;
  setText("nav-lab-name", hero.shortName);
  setText("hero-kicker", hero.kicker);
  setText("hero-title", hero.labName);
  setText("hero-tagline", hero.tagline);

  const keywordRoot = document.getElementById("hero-keywords");
  if (keywordRoot) {
    keywordRoot.innerHTML = "";
    (hero.keywords || []).forEach((keyword) => {
      const li = document.createElement("li");
      li.textContent = keyword;
      keywordRoot.appendChild(li);
    });
  }
  renderList("hero-highlights", hero.highlights || []);
}

function getLinkIconMarkup(item) {
  const label = String(item.label || "").toLowerCase();

  if (label.includes("github")) {
    return `
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.59 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.66-.22.66-.49 0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.46-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.89 1.58 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.15-4.56-5.13 0-1.13.39-2.05 1.03-2.78-.1-.26-.45-1.31.1-2.73 0 0 .84-.28 2.75 1.06A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.36 1.91-1.34 2.75-1.06 2.75-1.06.55 1.42.2 2.47.1 2.73.64.73 1.03 1.65 1.03 2.78 0 3.99-2.34 4.86-4.57 5.12.36.32.68.95.68 1.93 0 1.39-.01 2.5-.01 2.84 0 .27.17.59.67.49A10.25 10.25 0 0 0 22 12.25C22 6.59 17.52 2 12 2Z"/>
      </svg>
    `;
  }

  if (label.includes("scholar")) {
    return `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Z"/>
        <path fill="#34A853" d="M6 13.2V17c0 2.21 2.69 4 6 4s6-1.79 6-4v-3.8l-6 3.27-6-3.27Z"/>
        <path fill="#AECBFA" d="M12 8.2 5.39 11.8 12 15.4l6.61-3.6L12 8.2Z"/>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 6.5h16v11H4z"></path>
      <path d="m5 8 7 5 7-5"></path>
    </svg>
  `;
}

function renderLinkGroup(rootId, items, className = "") {
  const root = document.getElementById(rootId);
  if (!root) return;
  root.innerHTML = "";
  (items || []).forEach((item) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.className = className;
    a.setAttribute("aria-label", item.label);
    a.innerHTML = `<span class="link-icon" aria-hidden="true">${getLinkIconMarkup(item)}</span><span>${item.label}</span>`;
    if (item.url.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noreferrer noopener";
    }
    root.appendChild(a);
  });
}

function renderMentor(content) {
  const { mentor } = content;
  setText("mentor-name", mentor.name);
  setText("mentor-title", mentor.title || mentor.role || "");
  setText("mentor-direction", mentor.direction || "");
  setText("mentor-bio", mentor.bio);
  renderList("mentor-history", mentor.history || []);
  renderList("mentor-contact", mentor.contact || []);
  renderList("mentor-research-areas", mentor.researchAreas || []);
  renderList("mentor-academic-services", mentor.academicServices || []);
  renderLinkGroup("mentor-links", content.footer?.links || [], "mentor-link-btn");

  const photoImg = document.getElementById("mentor-photo-image");
  if (photoImg) {
    photoImg.alt = currentLang === "zh" ? `${mentor.name} 导师照片` : `${mentor.name} portrait`;
  }
}

function renderLab(content) {
  const { lab } = content;
  renderList("lab-focus", lab.focus || []);
  setText("lab-philosophy", lab.philosophy);
  setText("lab-culture", lab.culture);
  setText("lab-welcome", lab.welcome);
}

function renderNews(content) {
  const timeline = document.getElementById("news-timeline");
  if (!timeline) return;
  timeline.innerHTML = "";
  (content.news || []).forEach((entry) => {
    const item = document.createElement("article");
    item.className = "timeline-item reveal";
    item.innerHTML = `
      <div class="timeline-meta">
        <span class="timeline-date">${entry.date}</span>
        <span class="timeline-tag">${entry.tag}</span>
      </div>
      <h3>${entry.title}</h3>
      <p>${entry.summary}</p>
    `;
    timeline.appendChild(item);
  });
}

function getStudyOrder(gradeLabel) {
  if (/(三年级|Year 3)/.test(gradeLabel)) return 1;
  if (/(二年级|Year 2)/.test(gradeLabel)) return 2;
  if (/(一年级|Year 1)/.test(gradeLabel)) return 3;
  return 10;
}

function buildMemberGroups(content) {
  const members = [];
  (content.students?.master || []).forEach((item) => {
    members.push({
      name: item.name,
      group: item.grade,
      order: getStudyOrder(item.grade),
      direction: item.direction,
      status: content.ui.memberStatusCurrent,
    });
  });

  (content.alumni || []).forEach((item) => {
    members.push({
      name: item.name,
      group: content.ui.alumniGroupLabel(item.year),
      order: 100 + (3000 - item.year),
      direction: item.focus,
      status: content.ui.memberStatusAlumni,
      destination: item.destination,
    });
  });

  const groupedMap = members.reduce((map, member) => {
    if (!map[member.group]) map[member.group] = { order: member.order, members: [] };
    map[member.group].members.push(member);
    return map;
  }, {});

  return Object.keys(groupedMap)
    .sort((a, b) => groupedMap[a].order - groupedMap[b].order)
    .map((group) => ({ group, members: groupedMap[group].members }));
}

function renderMembers(content) {
  const root = document.getElementById("member-groups");
  if (!root) return;
  root.innerHTML = "";

  const grouped = buildMemberGroups(content);
  grouped.forEach((group) => {
    const wrapper = document.createElement("section");
    wrapper.className = "student-group reveal";
    wrapper.innerHTML = `
      <div class="student-group-header">
        <h3>${group.group}</h3>
        <span class="student-count">${content.ui.memberCount(group.members.length)}</span>
      </div>
      <div class="student-grid"></div>
    `;

    const grid = wrapper.querySelector(".student-grid");
    group.members.forEach((member) => {
      const card = document.createElement("article");
      card.className = "student-card";
      card.innerHTML = `
        <h4>${member.name}</h4>
        <p>${content.ui.identityPrefix}：${member.status}</p>
        <p>${content.ui.directionPrefix}：${member.direction || "-"}</p>
        ${member.destination ? `<p class="member-destination">${content.ui.destinationPrefix}：${member.destination}</p>` : ""}
        <span class="student-chip">${group.group}</span>
      `;
      grid.appendChild(card);
    });

    root.appendChild(wrapper);
  });
}

function renderSideMembers(content) {
  const root = document.getElementById("side-members-list");
  if (!root) return;
  root.innerHTML = "";

  const mentor = content.mentor
    ? [{
        name: content.mentor.name,
        meta: content.mentor.role || "",
      }]
    : [];

  const currentMembers = [...(content.students?.master || [])]
    .sort((a, b) => getStudyOrder(a.grade) - getStudyOrder(b.grade))
    .map((m) => ({
      name: m.name,
      meta: `${m.grade} · ${m.direction || "-"}`,
    }));

  const alumniMembers = [...(content.alumni || [])]
    .sort((a, b) => b.year - a.year)
    .map((m) => ({
      name: m.name,
      meta: `${content.ui.alumniGroupLabel(m.year)} · ${m.destination || "-"}`,
    }));

  const chunks = [...mentor, ...currentMembers, ...alumniMembers];

  chunks.forEach((item) => {
    const row = document.createElement("div");
    row.className = "side-member-item";
    row.innerHTML = `<strong>${item.name}</strong><span>${item.meta}</span>`;
    root.appendChild(row);
  });
}

function renderResearch(content) {
  const directionRoot = document.getElementById("research-directions");
  const outcomeRoot = document.getElementById("research-outcomes");
  const publicationRoot = document.getElementById("research-publications");
  if (!directionRoot || !outcomeRoot || !publicationRoot) return;

  directionRoot.innerHTML = "";
  outcomeRoot.innerHTML = "";
  publicationRoot.innerHTML = "";

  (content.research?.directions || []).forEach((direction) => {
    const card = document.createElement("article");
    card.className = "card research-card reveal";
    card.innerHTML = `<h4>${direction.title}</h4><p>${direction.summary}</p>`;
    directionRoot.appendChild(card);
  });

  (content.research?.outcomes || []).forEach((outcome) => {
    const card = document.createElement("article");
    card.className = "card research-card reveal";
    card.innerHTML = `<h4>${outcome.title}</h4><p>${outcome.summary}</p>`;
    outcomeRoot.appendChild(card);
  });

  const buildPublicationSummary = (pub) => {
    if (pub.summary && String(pub.summary).trim() && pub.summary !== "#") return pub.summary;
    const title = (pub.title || "").replace(/[.:;!?]+$/g, "");
    if (currentLang === "zh") {
      return `该工作围绕“${title}”展开，面向${pub.venue || "相关学术场景"}提供可复现的方法与实验验证。`;
    }
    return `This work investigates "${title}" and provides reproducible methods and validation in ${pub.venue || "its target academic setting"}.`;
  };

  (content.research?.publications || []).forEach((pub) => {
    const item = document.createElement("article");
    item.className = "publication-item reveal";
    const linkPart = pub.link
      ? `<a class="publication-link" href="${pub.link}" target="_blank" rel="noreferrer noopener">${pub.linkText || "Link"}</a>`
      : "";
    const cover = pub.cover || "./assets/images/paper-placeholder.svg";
    const summary = buildPublicationSummary(pub);
    item.innerHTML = `
      <div class="publication-media">
        <img class="publication-cover" src="${cover}" alt="${pub.title} cover" loading="lazy" onerror="this.src='./assets/images/paper-placeholder.svg'" />
      </div>
      <div class="publication-body">
        <h4 class="publication-title">${pub.title}</h4>
        <p class="publication-meta">${pub.authors} · ${pub.venue} · ${pub.year}</p>
        <p class="publication-summary">${summary}</p>
        <p class="publication-note">${pub.note || ""}</p>
        ${linkPart}
      </div>
    `;
    publicationRoot.appendChild(item);
  });
}

function renderJoin(content) {
  renderList("join-expectations", content.join.expectations || []);
  renderList("join-process", content.join.process || []);
  setText("join-note", content.join.note);
}

function renderFooter(content) {
  const footer = content.footer || {};
  setText("footer-email", footer.email || "");
  setText("footer-address", footer.address || "");
  setText("footer-copy", footer.copy || "");

  const links = document.getElementById("footer-links");
  if (!links) return;
  renderLinkGroup("footer-links", footer.links || []);
}

function bindMobileNav() {
  const btn = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      nav.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function bindLanguageToggle() {
  const langToggle = document.getElementById("lang-toggle");
  if (!langToggle) return;

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem(LANG_STORAGE_KEY, currentLang);
    renderPage();
  });
}

function bindMentorPhoto() {
  const photoWrap = document.querySelector(".mentor-photo");
  const photoImg = document.getElementById("mentor-photo-image");
  if (!photoWrap || !photoImg) return;

  const showFallback = () => photoWrap.classList.add("image-error");
  const showImage = () => photoWrap.classList.remove("image-error");

  if (photoImg.complete) {
    if (photoImg.naturalWidth > 0) showImage();
    else showFallback();
  } else {
    photoImg.addEventListener("load", showImage, { once: true });
    photoImg.addEventListener("error", showFallback, { once: true });
  }
}

function bindReveal() {
  const items = document.querySelectorAll(".reveal");
  document.documentElement.classList.add("js-anim");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
  }

  items.forEach((item) => {
    if (!item.classList.contains("is-visible")) revealObserver.observe(item);
  });
}

function renderPage() {
  const content = getCurrentContent();
  applyMeta(content);
  applyStaticUI(content);
  renderHero(content);
  renderMentor(content);
  renderMembers(content);
  renderLab(content);
  renderNews(content);
  renderResearch(content);
  renderJoin(content);
  renderFooter(content);
  renderSideMembers(content);
  bindMentorPhoto();
  bindReveal();
}

function bootstrap() {
  if (!SITE_CONTENT.zh || !SITE_CONTENT.en) {
    console.error("Site content data is missing. Please check assets/data/site-content.js");
    return;
  }

  const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if (storedLang === "zh" || storedLang === "en") {
    currentLang = storedLang;
  } else {
    currentLang = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  bindMobileNav();
  bindLanguageToggle();
  renderPage();
}

document.addEventListener("DOMContentLoaded", bootstrap);
