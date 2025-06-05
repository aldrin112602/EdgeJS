"use strict";

const selector = (selector) => document.querySelector(selector);
function removeComments(template) {
  return template.replace(/\{\{--.*?--\}\}/gs, "");
}

function injectScriptSections(sections) {
  const scriptSectionKeys = ["js", "scripts", "script", "javascript"];

  scriptSectionKeys.forEach((key) => {
    if (sections[key]) {
      const temp = document.createElement("div");
      temp.innerHTML = sections[key];
      const scripts = temp.querySelectorAll("script");

      scripts.forEach((s) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (s.src) script.src = s.src;
        else script.textContent = s.textContent;
        document.body.appendChild(script);
      });
    }
  });
}

function extractSections(template) {
  const sectionRegex = /@section\(['"](.+?)['"]\)([\s\S]*?)@endsection/g;
  const sections = {};
  let match;

  while ((match = sectionRegex.exec(template)) !== null) {
    const sectionName = match[1];
    const sectionContent = match[2].trim();
    sections[sectionName] = sectionContent;
  }

  return sections;
}

function applyLayout(layout, sections) {
  console.log("Applying layout with sections:", sections);
  if (!layout) {
    console.error("No layout provided.");
    return "";
  }
  return layout.replace(
    /@yield\(['"](.+?)['"](?:,\s*['"](.+?)['"])?\)/g,
    (_, name, fallback) => {
      return sections[name] || fallback || "";
    }
  );
}

const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    page: params.get("page") || "index",
  };
};

const router = {
  currentPage: getUrlParams().page,
  setPage: function (page) {
    if (page) {
      this.currentPage = page;
    } else {
      this.currentPage = "index";
    }
  },
  getPage: function () {
    return this.currentPage;
  },
  getUrlParams: function () {
    return getUrlParams();
  },
  getUrlParam: function (name) {
    const params = getUrlParams();
    return params[name] || null;
  },
  getUrl: function () {
    const params = getUrlParams();
    return `?page=${params.page}`;
  },
  getFullUrl: function () {
    return window.location.origin + this.getUrl();
  },
  getFullUrlWithParam: function (name, value) {
    const params = getUrlParams();
    params[name] = value;
    return `${window.location.origin}?${new URLSearchParams(
      params
    ).toString()}`;
  },
  getFullUrlWithoutParam: function (name) {
    const params = getUrlParams();
    params.delete(name);
    return `${window.location.origin}?${new URLSearchParams(
      params
    ).toString()}`;
  },
  getFullUrlWithParams: function (params) {
    const currentParams = getUrlParams();
    Object.keys(params).forEach((key) => {
      currentParams[key] = params[key];
    });
    return `${window.location.origin}?${new URLSearchParams(
      currentParams
    ).toString()}`;
  },
  getFullUrlWithoutParams: function (paramNames) {
    const params = getUrlParams();
    paramNames.forEach((name) => {
      params.delete(name);
    });
    return `${window.location.origin}?${new URLSearchParams(
      params
    ).toString()}`;
  },
  getCurrentUrl: function () {
    return window.location.href;
  },
  getCurrentPath: function () {
    return window.location.pathname;
  },
  getCurrentHash: function () {
    return window.location.hash;
  },
  getCurrentSearch: function () {
    return window.location.search;
  },
  getCurrentOrigin: function () {
    return window.location.origin;
  },
  getCurrentProtocol: function () {
    return window.location.protocol;
  },
  getCurrentHost: function () {
    return window.location.host;
  },
  getCurrentPort: function () {
    return window.location.port;
  },
  getCurrentHostname: function () {
    return window.location.hostname;
  },
  getCurrentHref: function () {
    return window.location.href;
  },
  getCurrentUrlParams: function () {
    return getUrlParams();
  },
  getCurrentUrlParam: function (name) {
    const params = getUrlParams();
    return params[name] || null;
  },
  getCurrentUrlWithParam: function (name, value) {
    const params = getUrlParams();
    params[name] = value;
    return `${window.location.origin}?${new URLSearchParams(
      params
    ).toString()}`;
  },
  getCurrentUrlWithoutParam: function (name) {
    const params = getUrlParams();
    params.delete(name);
    return `${window.location.origin}?${new URLSearchParams(
      params
    ).toString()}`;
  },
  getCurrentUrlWithParams: function (params) {
    const currentParams = getUrlParams();
    Object.keys(params).forEach((key) => {
      currentParams[key] = params[key];
    });
    return `${window.location.origin}?${new URLSearchParams(
      currentParams
    ).toString()}`;
  },
  getCurrentUrlWithoutParams: function (paramNames) {
    const params = getUrlParams();
    paramNames.forEach((name) => {
      params.delete(name);
    });
    return `${window.location.origin}?${new URLSearchParams(
      params
    ).toString()}`;
  },
  navigateTo: function (page) {
    this.setPage(page);
    window.history.pushState({}, "", this.getUrl());
    window.dispatchEvent(new Event("popstate"));
  },
  reload: function () {
    window.location.reload();
  },
  back: function () {
    window.history.back();
  },
  forward: function () {
    window.history.forward();
  },
  replaceState: function (state, title, url) {
    window.history.replaceState(state, title, url);
  },
  pushState: function (state, title, url) {
    window.history.pushState(state, title, url);
  },
  onPopState: function (callback) {
    window.addEventListener("popstate", callback);
  },
  offPopState: function (callback) {
    window.removeEventListener("popstate", callback);
  },
  onHashChange: function (callback) {
    window.addEventListener("hashchange", callback);
  },
  offHashChange: function (callback) {
    window.removeEventListener("hashchange", callback);
  },
  onUrlChange: function (callback) {
    window.addEventListener("popstate", callback);
    window.addEventListener("hashchange", callback);
  },
  offUrlChange: function (callback) {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("hashchange", callback);
  },
  getCurrentPage: function () {
    return this.getPage();
  },
  setCurrentPage: function (page) {
    this.setPage(page);
    window.history.pushState({}, "", this.getUrl());
    window.dispatchEvent(new Event("popstate"));
  },
};

const edge = {
  render: async function (
    view,
    options = {
      method: "GET",
      headers: {
        "Content-Type": "text/html",
      },
    }
  ) {
    const viewPath = view.replace(/\./g, "/");
    const data = await this.fetchContent(`app/${viewPath}.edge`, options);

    return data;
  },

  fetchContent: async function (url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
};

const Route = {
  get: function (url, fnc) {
    fnc
      .then(async (viewContent) => {
        const layoutMatch = viewContent.match(/@extends\(['"](.+?)['"]\)/);
        const layoutView = layoutMatch
          ? layoutMatch[1].replace(/\./g, "/")
          : null;
        const sections = extractSections(viewContent);
        let finalHtml = viewContent;
        if (layoutView) {
          const layoutTemplate = await edge.render(layoutView);
          finalHtml = applyLayout(layoutTemplate, sections);
        }
        selector("#app").innerHTML = removeComments(finalHtml);
        injectScriptSections(sections);
      })
      .catch((error) => {
        console.error(`Error rendering view: ${url}`, error);
      });
  },
};
