const tabs = document.querySelectorAll(".tab");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".tab-panel");
const joinButtons = document.querySelectorAll(".join-training");
const trainingList = document.getElementById("training-list");
const trainingDetail = document.getElementById("training-detail");
const trainingTitle = document.getElementById("training-title");
const backToList = document.getElementById("back-to-list");

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
  if (name !== "all") {
    trainingList?.classList.add("is-active");
    trainingDetail?.classList.remove("is-active");
  }
};

[...tabs, ...navItems].forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

joinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (trainingTitle) {
      trainingTitle.textContent = button.dataset.title || "Eğitim Detayı";
    }
    trainingList?.classList.remove("is-active");
    trainingDetail?.classList.add("is-active");
  });
});

backToList?.addEventListener("click", () => {
  trainingDetail?.classList.remove("is-active");
  trainingList?.classList.add("is-active");
});

activateTab("all");
