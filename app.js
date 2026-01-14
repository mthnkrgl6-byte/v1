const tabs = document.querySelectorAll(".tab");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".tab-panel");
const joinButtons = document.querySelectorAll(".join-training");
const trainingList = document.getElementById("training-list");
const trainingDetail = document.getElementById("training-detail");
const trainingTitle = document.getElementById("training-title");
const backToList = document.getElementById("back-to-list");
const quizStart = document.getElementById("quiz-start");
const videoComplete = document.getElementById("video-complete");
const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");
const quizTitle = document.getElementById("quiz-title");
const backToDetail = document.getElementById("back-to-detail");

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
    if (quizTitle) {
      quizTitle.textContent = `Quiz : ${button.dataset.title || "Eğitim Detayı"}`;
    }
    trainingList?.classList.remove("is-active");
    trainingDetail?.classList.add("is-active");
    quizStart?.setAttribute("disabled", "disabled");
    if (progressLabel) {
      progressLabel.textContent = "İlerleme: %0";
    }
    if (progressFill) {
      progressFill.style.width = "0%";
    }
  });
});

backToList?.addEventListener("click", () => {
  trainingDetail?.classList.remove("is-active");
  trainingList?.classList.add("is-active");
});

videoComplete?.addEventListener("click", () => {
  quizStart?.removeAttribute("disabled");
  if (progressLabel) {
    progressLabel.textContent = "İlerleme: %100";
  }
  if (progressFill) {
    progressFill.style.width = "100%";
  }
});

quizStart?.addEventListener("click", () => {
  if (!quizStart.hasAttribute("disabled")) {
    activateTab("quiz");
  }
});

backToDetail?.addEventListener("click", () => {
  activateTab("all");
  trainingList?.classList.remove("is-active");
  trainingDetail?.classList.add("is-active");
});

activateTab("all");
