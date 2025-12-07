// 방문자 / 오너 판별 후 body에 클래스 부여
document.addEventListener("DOMContentLoaded", () => {
  const isOwner = localStorage.getItem("isOwner") === "true";

  if (isOwner) {
    document.body.classList.add("owner-mode");
  }
});

/* ============================================
   📌 전역: 메뉴 탭 전환
============================================ */
function setupTabs() {
  const menuItems = document.querySelectorAll(".menu-item");
  const tabs = document.querySelectorAll(".tab-content");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const target = item.dataset.tab;

      menuItems.forEach(m => m.classList.remove("active"));
      item.classList.add("active");

      tabs.forEach(t => t.classList.remove("active"));
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });
}


/* ============================================
   📌 방문자 오늘/전체 카운트 (visitor 증가 + owner 표시)
============================================ */
function updateVisitCount() {
  const todaySpan = document.getElementById("today-count");
  const totalSpan = document.getElementById("total-count");

  if (!todaySpan || !totalSpan) return;

  let today = Number(localStorage.getItem("visit_today") || 0);
  let total = Number(localStorage.getItem("visit_total") || 0);

  const todayDate = new Date().toDateString();
  const lastVisit = localStorage.getItem("last_visit_date");

  // -------------------------------
  // 방문자 페이지일 때만 카운트 증가
  // -------------------------------
  if (location.pathname.includes("visitor.html")) {

    // 날짜가 바뀌면 오늘 방문자 수 리셋
    if (lastVisit !== todayDate) {
      today = 1;
      localStorage.setItem("last_visit_date", todayDate);
    } else {
      today++;
    }

    total++;

    localStorage.setItem("visit_today", today);
    localStorage.setItem("visit_total", total);
  }

  // -------------------------------
  // owner.html & visitor.html 모두 숫자 렌더링
  // -------------------------------
  todaySpan.textContent = localStorage.getItem("visit_today") || 0;
  totalSpan.textContent = localStorage.getItem("visit_total") || 0;
}



/* ============================================
   📌 방명록 목록 렌더링 (읽기 전용)
============================================ */
function renderGuestbook() {
  const listEl = document.getElementById("guest-list");
  if (!listEl) return;

  const guestbook = JSON.parse(localStorage.getItem("guestbook") || "[]");
  listEl.innerHTML = "";

  guestbook.forEach((entry, index) => {
    const item = document.createElement("div");
    item.classList.add("guestbook-item");

    item.innerHTML = `
      <div class="guestbook-meta">${entry.name} • ${entry.date}</div>
      <div class="guestbook-text">${entry.message}</div>
    `;

    // 오너에게만 삭제 버튼 보임
    if (location.pathname.includes("owner.html")) {
      const del = document.createElement("button");
      del.textContent = "삭제";
      del.classList.add("delete-btn");
      del.onclick = () => {
        guestbook.splice(index, 1);
        localStorage.setItem("guestbook", JSON.stringify(guestbook));
        renderGuestbook();
      };
      item.appendChild(del);
    }

    listEl.appendChild(item);
  });
}


/* ============================================
   📌 사진첩 렌더링 (조회만)
============================================ */
function renderPhotos() {
  const listEl = document.getElementById("photo-list");
  if (!listEl) return;

  const photos = JSON.parse(localStorage.getItem("photos") || "[]");
  listEl.innerHTML = "";

  photos.forEach((src, index) => {
    const div = document.createElement("div");

    div.innerHTML = `<img src="${src}">`;

    if (location.pathname.includes("owner.html")) {
      const del = document.createElement("button");
      del.textContent = "삭제";
      del.classList.add("delete-btn");

      del.onclick = () => {
        photos.splice(index, 1);
        localStorage.setItem("photos", JSON.stringify(photos));
        renderPhotos();
      };
      div.appendChild(del);
    }

    div.classList.add("photo-item");
    listEl.appendChild(div);
  });
}


/* ============================================
   📌 다이어리 렌더링
============================================ */
function renderDiary() {
  const listEl = document.getElementById("diary-list");
  if (!listEl) return;

  const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
  listEl.innerHTML = "";

  diaries.forEach((d, index) => {
    const box = document.createElement("div");
    box.classList.add("diary-item");

    box.innerHTML = `
      <div class="diary-date">${d.date}</div>
      <div class="diary-text">${d.text}</div>
    `;

    if (location.pathname.includes("owner.html")) {
      const del = document.createElement("button");
      del.textContent = "삭제";
      del.classList.add("delete-diary-btn");

      del.onclick = () => {
        diaries.splice(index, 1);
        localStorage.setItem("diaries", JSON.stringify(diaries));
        renderDiary();
      };

      box.appendChild(del);
    }

    listEl.appendChild(box);
  });
}


/* ============================================
   📌 프로필/미니룸 이미지 로드
============================================ */
function loadImages() {
  const profile = document.getElementById("profile-image");
  const room = document.getElementById("room-image");

  const p = localStorage.getItem("profile_photo");
  const r = localStorage.getItem("miniroom_photo");

  if (p) profile.style.backgroundImage = `url(${p})`;
  if (r) room.style.backgroundImage = `url(${r})`;
}


/* ============================================
   📌 페이지 로드시 실행되는 공통 함수
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  updateVisitCount();
  renderGuestbook();
  renderPhotos();
  renderDiary();
  loadImages();
});
