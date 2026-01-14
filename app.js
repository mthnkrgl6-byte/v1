const tabs = document.querySelectorAll(".tab");
const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".tab-panel");
const cardsContainer = document.querySelector(".cards");
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
const adminGrid = document.querySelector(".admin-grid");
const addTrainingButton = document.getElementById("add-training");
const saveAllButton = document.getElementById("save-all");
const toast = document.createElement("div");
toast.className = "toast";
toast.textContent = "Değişiklikler kaydedildi.";
document.body.appendChild(toast);

const trainings = [];
let trainingCounter = 0;

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

const attachJoinHandlers = () => {
  document.querySelectorAll(".join-training").forEach((button) => {
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
};

const renderTrainingCards = () => {
  if (!cardsContainer) return;
  cardsContainer.innerHTML = trainings
    .map((training) => {
      const statusClass = training.statusClass ? `status ${training.statusClass}` : "status";
      return `
        <article class="card" data-training-id="${training.id}">
          <div class="card-image">
            <img src="${training.image}" alt="${training.title}" />
          </div>
          <h3>${training.title}</h3>
          <p>${training.subtitle}</p>
          <button class="cta join-training" data-title="${training.detailTitle}">Eğitime Katıl</button>
          <div class="progress">
            <span>${training.progress}</span>
            <span class="${statusClass}">${training.status}</span>
          </div>
        </article>
      `;
    })
    .join("");
  attachJoinHandlers();
};

const syncAdminColumns = () => {
  const adminColumns = document.querySelectorAll(".admin-column");
  adminColumns.forEach((column, index) => {
    const training = trainings[index];
    if (training) {
      column.dataset.trainingId = training.id;
    }
  });
};

const initializeTrainings = () => {
  document.querySelectorAll(".card").forEach((card) => {
    const title = card.querySelector("h3")?.textContent?.trim() || "Yeni Eğitim";
    const subtitle = card.querySelector("p")?.textContent?.trim() || "Teknik bilgiler";
    const progress = card.querySelector(".progress span")?.textContent?.trim() || "İlerleme: %0";
    const statusElement = card.querySelector(".status");
    const status = statusElement?.textContent?.trim() || "Başarı";
    const statusClass = statusElement?.classList.contains("success")
      ? "success"
      : statusElement?.classList.contains("warning")
        ? "warning"
        : "";
    const image = card.querySelector("img")?.getAttribute("src") || "";
    const id = `training-${trainingCounter += 1}`;
    trainings.push({
      id,
      title,
      subtitle,
      progress,
      status,
      statusClass,
      image,
      detailTitle: `${title} Teknik Bilgiler`,
    });
  });
  renderTrainingCards();
  syncAdminColumns();
};

[...tabs, ...navItems].forEach((tab) => {
  tab.addEventListener("click", () => activateTab(tab.dataset.tab));
});

attachJoinHandlers();

initializeTrainings();

const updateTrainingTitle = (column) => {
  const trainingId = column.dataset.trainingId;
  const headerTitle = column.querySelector(".admin-header h3");
  const headerCategory = column.querySelector(".admin-header span");
  const training = trainings.find((item) => item.id === trainingId);
  if (training && headerTitle) {
    training.title = headerTitle.textContent.trim();
    training.detailTitle = `${training.title} Teknik Bilgiler`;
  }
  if (training && headerCategory) {
    training.subtitle = headerCategory.textContent.trim() || training.subtitle;
  }
};

const addTraining = () => {
  trainingCounter += 1;
  const id = `training-${trainingCounter}`;
  trainings.push({
    id,
    title: "Yeni Eğitim",
    subtitle: "Diğer",
    progress: "İlerleme: %0",
    status: "Başarı",
    statusClass: "",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
    detailTitle: "Yeni Eğitim Teknik Bilgiler",
  });
  if (adminGrid) {
    const column = createTrainingColumn();
    column.dataset.trainingId = id;
    adminGrid.appendChild(column);
  }
  renderTrainingCards();
};

const removeTraining = (trainingId) => {
  const index = trainings.findIndex((item) => item.id === trainingId);
  if (index >= 0) {
    trainings.splice(index, 1);
  }
  renderTrainingCards();
};

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

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("is-visible");
  setTimeout(() => toast.classList.remove("is-visible"), 2000);
};

const createAdminItem = (title, subtitle) => {
  const item = document.createElement("div");
  item.className = "admin-item";
  item.innerHTML = `
    <div>
      <strong>${title}</strong>
      <p>${subtitle}</p>
    </div>
    <button type="button">Sil</button>
  `;
  item.querySelector("button").addEventListener("click", () => item.remove());
  return item;
};

const createTrainingColumn = (title = "Yeni Eğitim", category = "Diğer") => {
  const column = document.createElement("article");
  column.className = "admin-column";
  column.innerHTML = `
    <div class="admin-header">
      <h3 contenteditable="true">${title}</h3>
      <span contenteditable="true">${category}</span>
    </div>
    <div class="admin-section">
      <h4>Video Yönetimi</h4>
      <div class="admin-form video-form">
        <label>Video Başlığı<input type="text" placeholder="Örn: Eğitim Başlığı" /></label>
        <label>Video Dosyası<input type="file" /></label>
        <label>Kısa Not<textarea placeholder="Eğitim notları"></textarea></label>
        <div class="admin-actions">
          <button class="cta add-video">Video Ekle</button>
          <button class="cta outline">Sil</button>
        </div>
      </div>
      <div class="admin-list video-list"></div>
    </div>
    <div class="admin-section">
      <h4>Quiz Soruları</h4>
      <div class="admin-form quiz-form">
        <label>Soru<input type="text" placeholder="Soru metni" /></label>
        <label>Doğru Cevap<input type="text" placeholder="Doğru cevap" /></label>
        <div class="admin-actions">
          <button class="cta add-quiz">Soru Ekle</button>
          <button class="cta outline">Sil</button>
        </div>
      </div>
      <div class="admin-list quiz-list"></div>
    </div>
    <div class="admin-section">
      <h4>Sertifika Oluştur</h4>
      <label>Sertifika Şablonu<input type="file" class="certificate-input" /></label>
      <span class="certificate-name">Şablon seçilmedi</span>
      <button class="cta">Sertifika Oluştur</button>
    </div>
    <div class="admin-footer">
      <button class="cta outline">Eğitimi Sil</button>
      <button class="cta save-training">Kaydet</button>
    </div>
  `;
  return column;
};

const handleVideoAdd = (column) => {
  const titleInput = column.querySelector(".video-form input[type='text']");
  const noteInput = column.querySelector(".video-form textarea");
  const fileInput = column.querySelector(".video-form input[type='file']");
  const title = titleInput?.value.trim() || "Başlıksız Video";
  const note = noteInput?.value.trim() || "Not eklenmedi";
  const fileName = fileInput?.files?.[0]?.name || "Dosya seçilmedi";
  const list = column.querySelector(".video-list");
  if (list) {
    list.appendChild(createAdminItem(title, `${fileName} · ${note}`));
  }
  if (titleInput) titleInput.value = "";
  if (noteInput) noteInput.value = "";
  if (fileInput) fileInput.value = "";
};

const handleQuizAdd = (column) => {
  const quizInputs = column.querySelectorAll(".quiz-form input[type='text']");
  const questionInput = quizInputs[0];
  const answerInput = quizInputs[1];
  const question = questionInput?.value.trim() || "Soru girilmedi";
  const answer = answerInput?.value.trim() || "Cevap girilmedi";
  const list = column.querySelector(".quiz-list");
  if (list) {
    list.appendChild(createAdminItem(question, `Doğru: ${answer}`));
  }
  if (questionInput) questionInput.value = "";
  if (answerInput) answerInput.value = "";
};

addTrainingButton?.addEventListener("click", () => {
  addTraining();
  showToast("Yeni eğitim eklendi.");
});

saveAllButton?.addEventListener("click", () => {
  showToast("Tüm eğitimler kaydedildi.");
});

adminGrid?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const column = target.closest(".admin-column");
  if (!column) return;
  if (target.classList.contains("add-video")) {
    event.preventDefault();
    handleVideoAdd(column);
  }
  if (target.classList.contains("add-quiz")) {
    event.preventDefault();
    handleQuizAdd(column);
  }
  if (target.classList.contains("save-training")) {
    event.preventDefault();
    updateTrainingTitle(column);
    renderTrainingCards();
    showToast("Eğitim kaydedildi.");
  }
  if (target.textContent === "Eğitimi Sil") {
    const trainingId = column.dataset.trainingId;
    column.remove();
    if (trainingId) {
      removeTraining(trainingId);
    }
    showToast("Eğitim silindi.");
  }
});

adminGrid?.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.classList.contains("certificate-input")) {
    const column = target.closest(".admin-column");
    const name = target.files?.[0]?.name || "Şablon seçilmedi";
    const label = column?.querySelector(".certificate-name");
    if (label) {
      label.textContent = name;
    }
  }
});
