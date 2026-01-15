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
const detailVideos = document.getElementById("detail-videos");
const detailQuizzes = document.getElementById("detail-quizzes");
const quizQuestions = document.getElementById("quiz-questions");
const trainingVideo = document.getElementById("training-video");
const videoPlaceholder = document.getElementById("video-placeholder");
const adminGrid = document.querySelector(".admin-grid");
const addTrainingButton = document.getElementById("add-training");
const saveAllButton = document.getElementById("save-all");
const resetTrainingsButton = document.getElementById("reset-trainings");
const toast = document.createElement("div");
toast.className = "toast";
toast.textContent = "Değişiklikler kaydedildi.";
document.body.appendChild(toast);

const trainings = [];
let trainingCounter = 0;
let activeTrainingId = null;

const persistTrainings = () => {
  localStorage.setItem("kalde-trainings", JSON.stringify(trainings));
};

const resetTrainings = () => {
  trainings.length = 0;
  trainingCounter = 0;
  activeTrainingId = null;
  localStorage.removeItem("kalde-trainings");
  renderTrainingCards();
  renderAdminColumns();
};

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

const setActiveVideo = (video) => {
  if (!trainingVideo || !videoPlaceholder) return;
  if (video?.url) {
    trainingVideo.src = video.url;
    trainingVideo.style.display = "block";
    videoPlaceholder.style.display = "none";
  } else {
    trainingVideo.removeAttribute("src");
    trainingVideo.style.display = "none";
    videoPlaceholder.style.display = "flex";
  }
};

const renderTrainingDetail = (training) => {
  if (detailVideos) {
    detailVideos.innerHTML = "";
    if (!training.videos.length) {
      detailVideos.innerHTML = '<p class="admin-empty">Henüz video eklenmedi.</p>';
      setActiveVideo(null);
    } else {
      training.videos.forEach((video) => {
        const item = document.createElement("div");
        item.className = "detail-item";
        item.innerHTML = `
          <span>${video.title}</span>
          <button type="button" class="play-video">Oynat</button>
        `;
        item.querySelector(".play-video").addEventListener("click", (event) => {
          event.stopPropagation();
          setActiveVideo(video);
        });
        item.addEventListener("click", () => setActiveVideo(video));
        detailVideos.appendChild(item);
      });
      setActiveVideo(training.videos[0]);
    }
  }
  if (detailQuizzes) {
    detailQuizzes.innerHTML = "";
    if (!training.quizzes.length) {
      detailQuizzes.innerHTML = '<p class="admin-empty">Henüz soru eklenmedi.</p>';
    } else {
      training.quizzes.forEach((quiz) => {
        const item = document.createElement("div");
        item.className = "detail-item";
        item.innerHTML = `<span>${quiz.question}</span><span>${quiz.answer}</span>`;
        detailQuizzes.appendChild(item);
      });
    }
  }
  if (quizQuestions) {
    quizQuestions.innerHTML = "";
    if (!training.quizzes.length) {
      quizQuestions.innerHTML = '<p class="admin-empty">Henüz soru eklenmedi.</p>';
    } else {
      training.quizzes.forEach((quiz, index) => {
        const item = document.createElement("div");
        item.className = "quiz-question";
        item.innerHTML = `
          <h3>${index + 1}. Soru : ${quiz.question}</h3>
          <div class="quiz-options">
            <label><input type="radio" name="q${index}" /> ${quiz.answer}</label>
          </div>
        `;
        quizQuestions.appendChild(item);
      });
    }
  }
};

const attachJoinHandlers = () => {
  document.querySelectorAll(".join-training").forEach((button) => {
    button.addEventListener("click", () => {
      activeTrainingId = button.closest(".card")?.dataset.trainingId || null;
      const training = trainings.find((item) => item.id === activeTrainingId);
      if (trainingTitle) {
        trainingTitle.textContent = training?.detailTitle || button.dataset.title || "Eğitim Detayı";
      }
      if (quizTitle) {
        quizTitle.textContent = `Quiz : ${training?.detailTitle || button.dataset.title || "Eğitim Detayı"}`;
      }
      if (training) {
        renderTrainingDetail(training);
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
  const listEmpty = trainingList?.querySelector(".admin-empty");
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
  if (listEmpty) {
    listEmpty.style.display = trainings.length ? "none" : "block";
  }
  attachJoinHandlers();
};

const renderAdminColumns = () => {
  if (!adminGrid) return;
  const emptyState = adminGrid.nextElementSibling;
  adminGrid.innerHTML = trainings
    .map((training) => createTrainingColumn(training))
    .join("");
  adminGrid.querySelectorAll(".admin-column").forEach((column) => {
    const trainingId = column.dataset.trainingId;
    const training = trainings.find((item) => item.id === trainingId);
    if (!training) return;
    const videoList = column.querySelector(".video-list");
    const quizList = column.querySelector(".quiz-list");
    if (videoList && training.videos.length) {
      videoList.innerHTML = "";
      training.videos.forEach((video) => {
        videoList.appendChild(createAdminItem(video.title, `${video.file} · ${video.note}`));
      });
    }
    if (quizList && training.quizzes.length) {
      quizList.innerHTML = "";
      training.quizzes.forEach((quiz) => {
        quizList.appendChild(createAdminItem(quiz.question, `Doğru: ${quiz.answer}`));
      });
    }
  });
  if (emptyState && emptyState.classList.contains("admin-empty")) {
    emptyState.style.display = trainings.length ? "none" : "block";
  }
};

const initializeTrainings = () => {
  localStorage.removeItem("kalde-trainings");
  renderTrainingCards();
  renderAdminColumns();
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
  const previewImage = column.querySelector(".preview-image");
  const training = trainings.find((item) => item.id === trainingId);
  if (training && headerTitle) {
    training.title = headerTitle.textContent.trim();
    training.detailTitle = `${training.title} Teknik Bilgiler`;
  }
  if (training && headerCategory) {
    training.subtitle = headerCategory.textContent.trim() || training.subtitle;
  }
  if (training && previewImage) {
    training.image = previewImage.src;
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
    videos: [],
    quizzes: [],
  });
  renderTrainingCards();
  renderAdminColumns();
  persistTrainings();
};

const removeTraining = (trainingId) => {
  const index = trainings.findIndex((item) => item.id === trainingId);
  if (index >= 0) {
    trainings.splice(index, 1);
  }
  renderTrainingCards();
  renderAdminColumns();
  persistTrainings();
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

const createTrainingColumn = (training) => `
  <article class="admin-column" data-training-id="${training.id}">
    <div class="admin-header">
      <h3 contenteditable="true">${training.title}</h3>
      <span contenteditable="true">${training.subtitle}</span>
    </div>
    <div class="admin-section">
      <h4>Eğitim Önizleme</h4>
      <img class="preview-image" src="${training.image}" alt="Eğitim önizleme" />
      <label>Önizleme Görsel URL<input type="text" class="preview-url" placeholder="https://..." value="${training.image}" /></label>
      <label>Önizleme Görseli Yükle<input type="file" class="preview-input" accept="image/*" /></label>
    </div>
    <div class="admin-section">
      <h4>Video Yönetimi</h4>
      <div class="admin-form video-form">
        <label>Video Başlığı<input type="text" placeholder="Örn: Eğitim Başlığı" /></label>
        <label>Video URL<input type="text" class="video-url" placeholder="https://..." /></label>
        <label>Video Dosyası<input type="file" /></label>
        <label>Kısa Not<textarea placeholder="Eğitim notları"></textarea></label>
        <div class="admin-actions">
          <button class="cta add-video">Video Ekle</button>
          <button class="cta outline">Sil</button>
        </div>
      </div>
      <div class="admin-list video-list">
        <p class="admin-empty">Henüz video eklenmedi.</p>
      </div>
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
      <div class="admin-list quiz-list">
        <p class="admin-empty">Henüz soru eklenmedi.</p>
      </div>
    </div>
    <div class="admin-section">
      <h4>Sertifika Oluştur</h4>
      <label>Sertifika Şablonu<input type="file" class="certificate-input" /></label>
      <span class="certificate-name">Şablon seçilmedi</span>
      <button class="cta">Sertifika Oluştur</button>
    </div>
    <div class="admin-footer">
      <button class="cta outline delete-training">Eğitimi Sil</button>
      <button class="cta save-training">Kaydet</button>
    </div>
  </article>
`;

const handleVideoAdd = (column) => {
  const titleInput = column.querySelector(".video-form input[type='text']");
  const urlInput = column.querySelector(".video-form .video-url");
  const noteInput = column.querySelector(".video-form textarea");
  const fileInput = column.querySelector(".video-form input[type='file']");
  const title = titleInput?.value.trim() || "Başlıksız Video";
  const url = urlInput?.value.trim() || "";
  const note = noteInput?.value.trim() || "Not eklenmedi";
  const fileName = fileInput?.files?.[0]?.name || "Dosya seçilmedi";
  const list = column.querySelector(".video-list");
  if (list) {
    list.querySelector(".admin-empty")?.remove();
    list.appendChild(createAdminItem(title, `${fileName} · ${note}`));
  }
  const training = trainings.find((item) => item.id === column.dataset.trainingId);
  if (training) {
    training.videos.push({ title, note, file: fileName, url });
    if (training.id === activeTrainingId) {
      renderTrainingDetail(training);
    }
    persistTrainings();
  }
  if (titleInput) titleInput.value = "";
  if (urlInput) urlInput.value = "";
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
    list.querySelector(".admin-empty")?.remove();
    list.appendChild(createAdminItem(question, `Doğru: ${answer}`));
  }
  const training = trainings.find((item) => item.id === column.dataset.trainingId);
  if (training) {
    training.quizzes.push({ question, answer });
    if (training.id === activeTrainingId) {
      renderTrainingDetail(training);
    }
    persistTrainings();
  }
  if (questionInput) questionInput.value = "";
  if (answerInput) answerInput.value = "";
};

addTrainingButton?.addEventListener("click", () => {
  addTraining();
  showToast("Yeni eğitim eklendi.");
});

saveAllButton?.addEventListener("click", () => {
  persistTrainings();
  showToast("Tüm eğitimler kaydedildi.");
});

resetTrainingsButton?.addEventListener("click", () => {
  resetTrainings();
  showToast("Tüm eğitimler sıfırlandı.");
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
    persistTrainings();
    renderTrainingCards();
    showToast("Eğitim kaydedildi.");
  }
  if (target.classList.contains("delete-training")) {
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
  if (target.classList.contains("preview-input")) {
    const column = target.closest(".admin-column");
    const file = target.files?.[0];
    const preview = column?.querySelector(".preview-image");
    if (file && preview) {
      preview.src = URL.createObjectURL(file);
      updateTrainingTitle(column);
      renderTrainingCards();
      persistTrainings();
    }
  }
});

adminGrid?.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.classList.contains("preview-url")) {
    const column = target.closest(".admin-column");
    const preview = column?.querySelector(".preview-image");
    if (preview && target.value.trim()) {
      preview.src = target.value.trim();
      updateTrainingTitle(column);
      renderTrainingCards();
      persistTrainings();
    }
  }
});
