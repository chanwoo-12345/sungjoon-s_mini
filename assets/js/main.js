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
   메뉴 (홈/다이어리/사진첩/방명록)
============================ */
function setupMenuTabs() {
  const menuItems = document.querySelectorAll(".menu-item");
  const contentTitle = document.querySelector(".content-title");
  const contentBody = document.querySelector(".content-body");

  if (!menuItems.length) return;

  const sampleContent = {
    "홈": "홈 화면입니다.",
    "다이어리": "여기는 다이어리 페이지가 들어옵니다.",
    "사진첩": "여기는 사진첩입니다.",
    "방명록": "여기는 방명록 화면입니다."
  };

  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      menuItems.forEach(m => m.classList.remove("active"));
      item.classList.add("active");

      const tabName = item.textContent.trim();
      contentTitle.textContent = tabName;
      contentBody.textContent = sampleContent[tabName] || "";
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

