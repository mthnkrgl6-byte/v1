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
const adminGrid = document.querySelector(".admin-grid");
const addTrainingButton = document.getElementById("add-training");
const saveAllButton = document.getElementById("save-all");
const toast = document.createElement("div");
toast.className = "toast";
toast.textContent = "Değişiklikler kaydedildi.";
document.body.appendChild(toast);

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
  if (adminGrid) {
    adminGrid.appendChild(createTrainingColumn());
    showToast("Yeni eğitim eklendi.");
  }
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
    showToast("Eğitim kaydedildi.");
  }
  if (target.textContent === "Eğitimi Sil") {
    column.remove();
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
