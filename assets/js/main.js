/* ============================
   방문자 TODAY / TOTAL 카운트
============================ */
function updateVisitCount() {
  const todayKey = "visit_today";
  const totalKey = "visit_total";

  const todaySpan = document.getElementById("today-count");
  const totalSpan = document.getElementById("total-count");

  if (!todaySpan || !totalSpan) return; // 요소 없으면 실행 안 함 (owner.html 초기)

  let today = localStorage.getItem(todayKey);
  let total = localStorage.getItem(totalKey);

  const todayDate = new Date().toDateString();
  const lastVisitDate = localStorage.getItem("last_visit_date");

  // TOTAL 증가
  if (!total) total = 0;
  total++;
  localStorage.setItem(totalKey, total);

  // TODAY 증가 or 리셋
  if (lastVisitDate !== todayDate) {
    today = 1;
    localStorage.setItem("last_visit_date", todayDate);
  } else {
    today = Number(today) + 1;
  }
  localStorage.setItem(todayKey, today);

  todaySpan.textContent = today;
  totalSpan.textContent = total;
}


/* ============================
   메뉴(홈/다이어리/사진첩/방명록)
============================ */
function setupMenuTabs() {
  const menuItems = document.querySelectorAll(".menu-item");
  const tabHome = document.querySelector(".tab-home");
  const tabs = document.querySelectorAll(".tab-content");

  if (!menuItems.length) return;

  const tabMap = {
    "홈": ".tab-home",
    "다이어리": ".tab-diary",
    "사진첩": ".tab-photo",
    "방명록": ".tab-guestbook"
  };

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {

      // 메뉴 UI 업데이트
      menuItems.forEach(m => m.classList.remove("active"));
      item.classList.add("active");

      // 탭 전환
      const tabName = item.textContent.trim();
      tabs.forEach(t => t.classList.remove("active"));

      const selectedTab = document.querySelector(tabMap[tabName]);
      if (selectedTab) selectedTab.classList.add("active");
    });
  });
}

/* ============================
   페이지 로드 시 실행
============================ */
window.addEventListener("DOMContentLoaded", () => {
  updateVisitCount();
  setupMenuTabs();
});

/* ============================
   📝 방명록 저장 기능
============================ */
function initGuestbook() {
  const nameInput = document.getElementById("guest-name");
  const messageInput = document.getElementById("guest-message");
  const submitBtn = document.getElementById("guest-submit");
  const listEl = document.getElementById("guest-list");

  if (!nameInput || !messageInput || !submitBtn || !listEl) return;

  // 기존 저장된 목록 불러오기
  let guestbook = JSON.parse(localStorage.getItem("guestbook") || "[]");

  function renderGuestbook() {
    listEl.innerHTML = "";

    guestbook.forEach((entry, index) => {
      const item = document.createElement("div");
      item.classList.add("guestbook-item");

      item.innerHTML = `
        <div class="guestbook-meta">${entry.name} • ${entry.date}</div>
        <div class="guestbook-text">${entry.message}</div>
      `;

      // owner.html이라면 삭제 기능 추가
      if (window.location.pathname.includes("owner.html")) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "삭제";
        delBtn.classList.add("delete-btn");

        delBtn.addEventListener("click", () => {
          guestbook.splice(index, 1);
          localStorage.setItem("guestbook", JSON.stringify(guestbook));
          renderGuestbook();
        });

        item.appendChild(delBtn);
      }

      listEl.appendChild(item);
    });
  }

  submitBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const msg = messageInput.value.trim();
    if (!name || !msg) return;

    const today = new Date();
    const date = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`;

    const newEntry = { name, message: msg, date };
    guestbook.push(newEntry);

    localStorage.setItem("guestbook", JSON.stringify(guestbook));

    nameInput.value = "";
    messageInput.value = "";
    renderGuestbook();
  });

  renderGuestbook();
}

window.addEventListener("DOMContentLoaded", () => {

  // 방문자 수 증가를 index.html에서 딱 1번만 실행하도록 막기
  if (window.location.pathname.includes("index.html")) {
    if (!sessionStorage.getItem("visited_once")) {
      updateVisitCount();
      sessionStorage.setItem("visited_once", "true");
    }
  }
   
  setupMenuTabs();
  initGuestbook();  // 방명록 기능 실행
  initPhotoUpload();
  initDiary();
  initProfilePhoto();
  initMiniRoom();
  applyPermission();
  initLogout();
  initBGM();

});

/* ============================
   📷 사진 업로드 기능
============================ */
function initPhotoUpload() {
  const uploadInput = document.getElementById("photo-upload");
  const photoGrid = document.querySelector(".photo-grid");

  if (!uploadInput || !photoGrid) return;

  let photos = JSON.parse(localStorage.getItem("photos") || "[]");

  function renderPhotos() {
    photoGrid.innerHTML = "";
    photos.forEach((src, idx) => {
      const div = document.createElement("div");
      div.classList.add("photo-item");
      div.innerHTML = `<img src="${src}">`;

      // 삭제 기능 (owner.html에서만)
      if (window.location.pathname.includes("owner.html")) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "삭제";
        delBtn.classList.add("delete-btn");
        delBtn.addEventListener("click", () => {
          photos.splice(idx, 1);
          localStorage.setItem("photos", JSON.stringify(photos));
          renderPhotos();
        });
        div.appendChild(delBtn);
      }

      photoGrid.appendChild(div);
    });
  }

  uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      photos.push(reader.result);
      localStorage.setItem("photos", JSON.stringify(photos));
      renderPhotos();
    };
    reader.readAsDataURL(file);
  });

  renderPhotos();
}

/* ============================
   📘 다이어리 작성 기능
============================ */
function initDiary() {
  const textArea = document.getElementById("diary-text");
  const submitBtn = document.getElementById("diary-submit");
  const listEl = document.getElementById("diary-list");

  if (!textArea || !submitBtn || !listEl) return;

  let diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

  function renderDiary() {
    listEl.innerHTML = "";

    diaries.forEach((entry, index) => {
      const div = document.createElement("div");
      div.classList.add("diary-item");

      div.innerHTML = `
        <div class="diary-date">${entry.date}</div>
        <div class="diary-text">${entry.text}</div>
      `;

      // owner만 삭제 가능
      if (window.location.pathname.includes("owner.html")) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "삭제";
        delBtn.classList.add("delete-diary-btn");

        delBtn.addEventListener("click", () => {
          diaries.splice(index, 1);
          localStorage.setItem("diaries", JSON.stringify(diaries));
          renderDiary();
        });

        div.appendChild(delBtn);
      }

      listEl.appendChild(div);
    });
  }

  submitBtn.addEventListener("click", () => {
    const text = textArea.value.trim();
    if (!text) return;

    const now = new Date();
    const date = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}`;

    diaries.push({ text, date });
    localStorage.setItem("diaries", JSON.stringify(diaries));

    textArea.value = "";
    renderDiary();
  });

  renderDiary();
}

/* ============================
   🎨 프로필 사진 변경 (owner.html)
============================ */
function initProfilePhoto() {
  const input = document.getElementById("profile-upload");
  const profile = document.querySelector(".profile-photo");

  if (!input || !profile) return;

  // 기존 저장된 프로필 불러오기
  const saved = localStorage.getItem("profile_photo");
  if (saved) profile.style.backgroundImage = `url(${saved})`;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      profile.style.backgroundImage = `url(${reader.result})`;
      localStorage.setItem("profile_photo", reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ============================
   🎨 미니룸 사진 변경 (owner.html)
============================ */
function initMiniRoom() {
  const input = document.getElementById("room-upload");
  const room = document.querySelector(".miniroom-box");

  if (!input || !room) return;

  // 기존 저장값
  const saved = localStorage.getItem("miniroom_img");
  if (saved) room.style.backgroundImage = `url(${saved})`;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      room.style.backgroundImage = `url(${reader.result})`;
      room.style.backgroundSize = "cover";
      localStorage.setItem("miniroom_img", reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ============================
   ⚠ 방문자는 편집 기능 숨기기
============================ */
function applyPermission() {
  const isOwner = localStorage.getItem("isOwner") === "true";

  // 프로필 변경
  const profileUpload = document.getElementById("profile-upload");
  if (profileUpload && !isOwner) profileUpload.style.display = "none";

  // 미니룸 변경
  const roomUpload = document.getElementById("room-upload");
  if (roomUpload && !isOwner) roomUpload.style.display = "none";

  // 다이어리 작성 UI
  const diaryBox = document.querySelector(".diary-write-box");
  if (diaryBox && !isOwner) diaryBox.style.display = "none";

  // 사진 업로드
  const photoUpload = document.getElementById("photo-upload");
  if (photoUpload && !isOwner) photoUpload.style.display = "none";
}

/* =============================
   🔒 로그아웃 기능
============================= */
function initLogout() {
  const btn = document.getElementById("logout-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("isOwner");  // 권한 제거
    sessionStorage.removeItem("visited_once"); // 방문자 락 초기화
    window.location.href = "index.html"; // 방문자 홈으로 이동
  });
}

/* =============================
   🎵 BGM 토글 플레이어
============================= */
function initBGM() {
  const audio = document.getElementById("bgm");
  const btn = document.getElementById("bgm-btn");
  if (!audio || !btn) return;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.textContent = "⏸ 정지";
    } else {
      audio.pause();
      btn.textContent = "▶ 재생";
    }
  });
}
