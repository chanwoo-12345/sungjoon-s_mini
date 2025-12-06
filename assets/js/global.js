/* ============================
   📅 TODAY / TOTAL 방문자 카운트
============================ */
function updateVisitCountOnce() {
  if (!window.location.pathname.includes("visitor.html")) return;

  const todayKey = "visit_today";
  const totalKey = "visit_total";

  if (!sessionStorage.getItem("visited_once")) {
    let total = Number(localStorage.getItem(totalKey) || 0);
    total++;
    localStorage.setItem(totalKey, total);

    const todayDate = new Date().toDateString();
    const lastVisitDate = localStorage.getItem("last_visit_date");

    let today = 1;
    if (lastVisitDate === todayDate) {
      today = Number(localStorage.getItem(todayKey) || 0) + 1;
    }

    localStorage.setItem(todayKey, today);
    localStorage.setItem("last_visit_date", todayDate);
    
    sessionStorage.setItem("visited_once", "true");
  }

  const tSpan = document.getElementById("today-count");
  const allSpan = document.getElementById("total-count");

  if (tSpan && allSpan) {
    tSpan.textContent = localStorage.getItem(todayKey) || 1;
    allSpan.textContent = localStorage.getItem(totalKey) || 1;
  }
}

/* ============================
   📌 메뉴 탭 전환
============================ */
function setupMenuTabs() {
  const menuItems = document.querySelectorAll(".menu-item");
  const tabs = document.querySelectorAll(".tab-content");
  
  if (!menuItems.length) return;

  const map = {
    "홈": ".tab-home",
    "다이어리": ".tab-diary",
    "사진첩": ".tab-photo",
    "방명록": ".tab-guestbook",
  };

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(m => m.classList.remove("active"));
      item.classList.add("active");

      tabs.forEach(t => t.classList.remove("active"));
      const tab = document.querySelector(map[item.textContent.trim()]);
      if (tab) tab.classList.add("active");
    });
  });
}

/* ============================
   🎵 BGM 플레이어
============================ */
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

/* ============================
   📌 공통 초기 실행
============================ */
window.addEventListener("DOMContentLoaded", () => {
  updateVisitCountOnce();
  setupMenuTabs();
  initBGM();
});
