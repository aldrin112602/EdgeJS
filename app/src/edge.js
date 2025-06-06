((w, d) => {
  "use strict";

  w.selector = (selector) => d.querySelector(selector);
  const removeComments = (template) => template.replace(/\{\{--.*?--\}\}/g, "");
  const injectScriptSections = (sections) => {
    const scriptSectionKeys = ["js", "scripts", "script", "javascript"];

    scriptSectionKeys.forEach((key) => {
      if (sections[key]) {
        const temp = d.createElement("div");
        temp.innerHTML = sections[key];
        const scripts = temp.querySelectorAll("script");

        scripts.forEach((s) => {
          const script = d.createElement("script");
          script.type = "text/javascript";
          if (s.src) script.src = s.src;
          else script.textContent = s.textContent;
          d.body.appendChild(script);
        });
      }
    });
  };

  const extractSections = (template) => {
    const sections = {};

    const inlineSectionRegex =
      /@section\(\s*['"](.+?)['"]\s*,\s*['"]([\s\S]*?)['"]\s*\)/g;
    const blockSectionRegex =
      /@section\(\s*['"](.+?)['"]\s*\)([\s\S]*?)@endsection/g;

    template = template.replace(inlineSectionRegex, (match, name, content) => {
      sections[name] = content.trim();
      return "";
    });

    let match;
    while ((match = blockSectionRegex.exec(template)) !== null) {
      const sectionName = match[1];
      const sectionContent = match[2].trim();
      if (!sections[sectionName]) {
        sections[sectionName] = sectionContent;
      }
    }

    return sections;
  };

  const applyLayout = (layout, sections) => {
    if (!layout) {
      console.error("No layout provided.");
      return "";
    }

    return layout.replace(
      /@yield\(\s*['"](.+?)['"]\s*(?:,\s*['"]([\s\S]*?)['"])?\s*\)/g,
      (_, name, fallback) => {
        return sections[name] !== undefined ? sections[name] : fallback || "";
      }
    );
  };

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      page: params.get("page") || "index",
    };
  };

  w.router = {
    currentPage: getUrlParams().page,

    setPage: function (page) {
      this.currentPage = page || "index";
    },

    getPage: function () {
      return this.currentPage;
    },

    getUrlParam: function (name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    },

    navigateTo: function (page) {
      this.setPage(page);
      const url = `?page=${this.currentPage}`;
      window.history.pushState({}, "", url);
      window.dispatchEvent(new Event("popstate"));
    },

    back: function () {
      window.history.back();
    },

    forward: function () {
      window.history.forward();
    },

    onPopState: function (callback) {
      window.addEventListener("popstate", callback);
    },

    offPopState: function (callback) {
      window.removeEventListener("popstate", callback);
    },
  };

  w.edge = {
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

      return removeComments(data);
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

  w.Route = {
    get: (url, fnc) => {
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

          selector("#app").innerHTML = finalHtml;
          injectScriptSections(sections);
        })
        .catch((error) => {
          console.error(`Error rendering view: ${url}`, error);
        });
    },
  };

  d.addEventListener("DOMContentLoaded", () => {
    console.info(
      "%c⚡ EdgeJS v1.0.0%c Because why should PHP devs have all the fun?\n%cNow serving Blade-like templates in pure JS!",
      "background: #1E3A8A; color: #FACC15; font-size: 18px; padding: 6px 10px; border-radius: 4px; font-weight: bold;",
      "background: #1E3A8A; color: #FACC15; font-size: 16px; padding: 4px 6px; border-radius: 4px;",
      "background: #047857; color: #FFFFFF; font-size: 14px; padding: 3px 8px; border-radius: 4px;"
    );
  });
})(window, document);
