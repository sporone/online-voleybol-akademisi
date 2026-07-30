const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-Q3Z1NGYM41";

const safeLabel = (value = "") =>
  String(value)
    .replace(/\s+/g, " ")
    .replace(/\b\d{6,}\b/g, "")
    .trim()
    .slice(0, 80);

export function trackEvent(name, parameters = {}) {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;
  window.gtag(name, {
    ...parameters,
    page_path: window.location.pathname,
  });
}

export function trackPageView() {
  trackEvent("page_view", {
    page_title: document.title,
    page_location: window.location.href,
  });
}

function installNavigationTracking() {
  if (window.__volleyballAnalyticsNavigation) return;
  window.__volleyballAnalyticsNavigation = true;

  const notify = () => window.setTimeout(trackPageView, 0);
  ["pushState", "replaceState"].forEach((method) => {
    const original = window.history[method];
    window.history[method] = function trackedHistory(...args) {
      const result = original.apply(this, args);
      notify();
      return result;
    };
  });
  window.addEventListener("popstate", notify);
}

function installInteractionTracking() {
  if (window.__volleyballAnalyticsInteractions) return;
  window.__volleyballAnalyticsInteractions = true;

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a,button");
    if (!target) return;

    const label = safeLabel(
      target.dataset.analyticsLabel ||
        target.getAttribute("aria-label") ||
        target.textContent,
    );
    const href = target instanceof HTMLAnchorElement ? target.href : "";

    if (href.includes("wa.me/") || href.includes("whatsapp.com/")) {
      trackEvent("whatsapp_click", { link_text: label || "WhatsApp" });
      return;
    }

    if (href && new URL(href, window.location.href).origin !== window.location.origin) {
      trackEvent("outbound_click", {
        link_text: label,
        link_domain: new URL(href, window.location.href).hostname,
      });
      return;
    }

    if (/video|izle|oynat/i.test(label)) {
      trackEvent("video_select", { video_title: label });
    } else if (/kayıt|kaydet|başvur|profil oluştur/i.test(label)) {
      trackEvent("registration_click", { action_label: label });
    } else if (/giriş|oturum/i.test(label)) {
      trackEvent("login_click", { action_label: label });
    } else if (/sınav|test|sonuç|tamamla/i.test(label)) {
      trackEvent("exam_interaction", { action_label: label });
    }
  });

  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    trackEvent("form_submit", {
      form_name: safeLabel(form.getAttribute("aria-label") || form.className || "form"),
    });
  });

  document.addEventListener(
    "play",
    (event) => {
      const media = event.target;
      if (!(media instanceof HTMLVideoElement)) return;
      trackEvent("video_start", {
        video_title: safeLabel(media.getAttribute("aria-label") || media.currentSrc),
      });
    },
    true,
  );
}

export function initAnalytics() {
  if (!GA_MEASUREMENT_ID || window.__volleyballAnalyticsLoaded) return;
  window.__volleyballAnalyticsLoaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("consent", "default", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    allow_google_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  script.onload = trackPageView;
  document.head.appendChild(script);

  window.vaTrack = trackEvent;
  installNavigationTracking();
  installInteractionTracking();
}

