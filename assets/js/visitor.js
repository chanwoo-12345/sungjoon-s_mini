/* ============================
   📝 방명록 (작성만 가능)
============================ */
function initVisitorGuestbook() {
  const name = document.getElementById("guest-name");
  const msg = document.getElementById("guest-message");
  const submit = document.getElementById("guest-submit");
  const list = document.getElementById("guest-list");

  if (!name || !msg || !submit || !list) return;
  
  let guestbook = JSON.parse(localStorage.getItem("guestbook") || "[]");

  function render() {
    list.innerHTML = "";
    guestbook.forEach(entry => {
      const div = document.createElement("div");
      div.classList.add("guestbook-item");
      div.innerHTML = `
        <div class="guestbook-meta">${entry.name} • ${entry.date}</div>
        <div class="guestbook-text">${entry.message}</div>
      `;
      list.appendChild(div);
    });
  }

  submit.addEventListener("click", () => {
    if (!name.value.trim() || !msg.value.trim()) return;

    const now = new Date();
    guestbook.push({
      name: name.value.trim(),
      message: msg.value.trim(),
      date: `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}`,
    });

    localStorage.setItem("guestbook", JSON.stringify(guestbook));
    name.value = "";
    msg.value = "";
    render();
  });

  render();
}

/* ============================
   📘 다이어리 (읽기만)
============================ */
function initVisitorDiary() {
  const list = document.getElementById("diary-list");
  if (!list) return;

  let diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
  list.innerHTML = "";

  diaries.forEach(entry => {
    const div = document.createElement("div");
    div.classList.add("diary-item");
    div.innerHTML = `
      <div class="diary-date">${entry.date}</div>
      <div class="diary-text">${entry.text}</div>
    `;
    list.appendChild(div);
  });
}

/* ============================
   📷 사진첩 (보기만)
============================ */
function initVisitorPhotos() {
  const grid = document.querySelector(".photo-grid");
  if (!grid) return;

  let photos = JSON.parse(localStorage.getItem("photos") || "[]");
  grid.innerHTML = "";

  photos.forEach(src => {
    const div = document.createElement("div");
    div.classList.add("photo-item");
    div.innerHTML = `<img src="${src}">`;
    grid.appendChild(div);
  });
}

/* ============================
   초기 실행
============================ */
window.addEventListener("DOMContentLoaded", () => {
  initVisitorGuestbook();
  initVisitorDiary();
  initVisitorPhotos();
});
