const navigation = {
  navbar: 'div[class^="_sidebarColumn_"]',
  navBarCollapse: '[aria-label="Collapse sidebar"]',
  navExpand: 'button[aria-label="Expand sidebar"]',
  navToggle: '[aria-label="Collapse sidebar"], [aria-label="Expand sidebar"]',
  navOpen: 'button[aria-label="Open navigation"]', //smaller screen
};

const homepage = {
  heroTitle: "h1",
  mainCta: 'a[href*="/modules"]',
  articleViewAll: 'a[href*="/articles"]',
  featureSection: "section.features",
  featuredTitle: "section h2",
  popularModulesCard: "div[data-slot=card]",
  popularModulesTitle: "div[data-slot=card] h3",
  popularModulesList: "div[data-slot=card-content] strong",
};

const modules = {
  heroTitle: "span[class*='eyebrow']",
};

export default { navigation, homepage, modules };
