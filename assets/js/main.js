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
