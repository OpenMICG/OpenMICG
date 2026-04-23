const LANG_STORAGE_KEY = "lab_site_lang";
const SITE_CONTENT = window.SITE_CONTENT_DATA || {};
let currentLang = "zh";
let revealObserver = null;

function getCurrentContent() {
  return SITE_CONTENT[currentLang] || SITE_CONTENT.zh;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderList(id, items) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = "";
  items.forEach((item) => {
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
  setText("nav-mentor", ui.navMentor);
  setText("nav-lab", ui.navLab);
  setText("nav-members", ui.navMembers);
  setText("nav-research", ui.navResearch);
  setText("nav-join", ui.navJoin);
  setText("hero-btn-lab", ui.heroBtnLab);
  setText("hero-btn-join", ui.heroBtnJoin);
  setText("hero-overview-title", ui.heroOverviewTitle);
  setText("members-label", ui.membersLabel);
  setText("members-title", ui.membersTitle);
  setText("mentor-photo-label", ui.mentorPhotoLabel);
  setText("mentor-photo-note", ui.mentorPhotoNote);
  setText("mentor-history-title", ui.mentorHistoryTitle);
  setText("mentor-contact-title", ui.mentorContactTitle);
  setText("postdoc-focus-title", ui.postdocFocusTitle);
  setText("postdoc-contact-title", ui.postdocContactTitle);
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
  const mentorPhoto = document.querySelector(".mentor-photo");
  if (mentorPhoto) mentorPhoto.setAttribute("aria-label", ui.mentorPhotoAria);

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
  keywordRoot.innerHTML = "";
  hero.keywords.forEach((keyword) => {
    const li = document.createElement("li");
    li.textContent = keyword;
    keywordRoot.appendChild(li);
  });

  renderList("hero-highlights", hero.highlights);
}

function renderMentor(content) {
  const { mentor } = content;
  setText("mentor-name", mentor.name);
  setText("mentor-role", mentor.role);
  setText("mentor-bio", mentor.bio);
  renderList("mentor-history", mentor.history);
  renderList("mentor-contact", mentor.contact);

  const photoImg = document.getElementById("mentor-photo-image");
  if (photoImg) {
    const isZh = currentLang === "zh";
    photoImg.alt = isZh ? `${mentor.name} 导师照片` : `${mentor.name} portrait`;
  }
}

function renderPostdoc(content) {
  const { postdoc } = content;
  if (!postdoc) return;
  setText("postdoc-name", postdoc.name);
  setText("postdoc-role", postdoc.role);
  setText("postdoc-bio", postdoc.bio);
  renderList("postdoc-focus", postdoc.focus || []);
  renderList("postdoc-contact", postdoc.contact || []);
}

function renderLab(content) {
  const { lab } = content;
  renderList("lab-focus", lab.focus);
  setText("lab-philosophy", lab.philosophy);
  setText("lab-culture", lab.culture);
  setText("lab-welcome", lab.welcome);
}

function renderNews(content) {
  const timeline = document.getElementById("news-timeline");
  timeline.innerHTML = "";
  content.news.forEach((entry) => {
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
  const masterStudents = content.students?.master ?? [];
  const alumniMembers = content.alumni ?? [];

  masterStudents.forEach((item) => {
    members.push({
      name: item.name,
      group: item.grade,
      order: getStudyOrder(item.grade),
      direction: item.direction,
      status: content.ui.memberStatusCurrent,
    });
  });

  alumniMembers.forEach((item) => {
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
    if (!map[member.group]) {
      map[member.group] = { order: member.order, members: [] };
    }
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
        <p>${content.ui.directionPrefix}：${member.direction}</p>
        ${
          member.destination
            ? `<p class="member-destination">${content.ui.destinationPrefix}：${member.destination}</p>`
            : ""
        }
        <span class="student-chip">${group.group}</span>
      `;
      grid.appendChild(card);
    });

    root.appendChild(wrapper);
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

  content.research.directions.forEach((direction) => {
    const card = document.createElement("article");
    card.className = "card research-card reveal";
    card.innerHTML = `<h4>${direction.title}</h4><p>${direction.summary}</p>`;
    directionRoot.appendChild(card);
  });

  content.research.outcomes.forEach((outcome) => {
    const card = document.createElement("article");
    card.className = "card research-card reveal";
    card.innerHTML = `<h4>${outcome.title}</h4><p>${outcome.summary}</p>`;
    outcomeRoot.appendChild(card);
  });

  (content.research.publications || []).forEach((pub) => {
    const item = document.createElement("article");
    item.className = "publication-item reveal";
    const linkPart = pub.link
      ? `<a class="publication-link" href="${pub.link}" target="_blank" rel="noreferrer noopener">${pub.linkText || "Link"}</a>`
      : "";
    item.innerHTML = `
      <h4 class="publication-title">${pub.title}</h4>
      <p class="publication-meta">${pub.authors} · ${pub.venue} · ${pub.year}</p>
      <p class="publication-note">${pub.note || ""}</p>
      ${linkPart}
    `;
    publicationRoot.appendChild(item);
  });
}

function renderJoin(content) {
  renderList("join-expectations", content.join.expectations);
  renderList("join-process", content.join.process);
  setText("join-note", content.join.note);
}

function renderFooter(content) {
  const { footer } = content;
  setText("footer-email", footer.email);
  setText("footer-address", footer.address);
  setText("footer-copy", footer.copy);

  const links = document.getElementById("footer-links");
  links.innerHTML = "";
  footer.links.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.setAttribute("aria-label", item.label);
    a.innerHTML = `<span class="link-icon" aria-hidden="true">${item.icon}</span><span>${item.label}</span>`;
    if (item.url.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noreferrer noopener";
    }
    links.appendChild(a);
  });
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
    if (!item.classList.contains("is-visible")) {
      revealObserver.observe(item);
    }
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

function renderPage() {
  const content = getCurrentContent();
  applyMeta(content);
  applyStaticUI(content);
  renderHero(content);
  renderMentor(content);
  renderPostdoc(content);
  renderMembers(content);
  renderLab(content);
  renderNews(content);
  renderResearch(content);
  renderJoin(content);
  renderFooter(content);
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
