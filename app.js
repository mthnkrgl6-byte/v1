const tabs = document.querySelectorAll(".tab");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".tab-panel");

const activateTab = (name) => {
  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === name);
  });
  navItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.tab === name);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `tab-${name}`);
  });
};

[...tabs, ...navItems].forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

activateTab("all");
