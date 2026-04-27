const toggle = document.querySelector(".menu-toggle");
const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".nav a");
const revealItems = document.querySelectorAll(".reveal");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const cursorTargets = document.querySelectorAll("a, button");
const observedSections = [...navLinks]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

let lastScrollY = window.scrollY;

toggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("menu-open");
  toggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll(".case-card, .client-item").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 8, 7) * 45}ms`;
});

const updateHeader = () => {
  const currentScroll = window.scrollY;
  const shouldHide = currentScroll > lastScrollY && currentScroll > 220 && !document.body.classList.contains("menu-open");

  header?.classList.toggle("is-scrolled", currentScroll > 24);
  header?.classList.toggle("is-hidden", shouldHide);
  lastScrollY = currentScroll;
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

observedSections.forEach((section) => sectionObserver.observe(section));

if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
  let ringX = 0;
  let ringY = 0;
  let mouseX = 0;
  let mouseY = 0;

  const moveRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(moveRing);
  };

  window.addEventListener(
    "mousemove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      document.body.classList.add("cursor-active");
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", () => {
    document.body.classList.remove("cursor-active", "cursor-hover");
  });

  cursorTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    target.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  moveRing();
}
