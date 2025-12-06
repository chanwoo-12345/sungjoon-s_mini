/* ============================
   🔐 권한 체크
============================ */
if (localStorage.getItem("isOwner") !== "true") {
  window.location.href = "visitor.html";
}

/* ============================
   owner-only UI 표시
============================ */
function showOwnerUI() {
  document.querySelectorAll(".owner-only")
    .forEach(el => el.style.display = "inline-block");
}

/* ============================
   📝 방명록 (삭제 가능)
============================ */
function initOwnerGuestbook() {
  const list = document.getElementById("guest-list");
  const name = document.getElementById("guest-name");
  const msg = document.getElementById("guest-message");
  const submit = document.getElementById("guest-submit");

  if (!list || !name || !msg) return;

  let guestbook = JSON.parse(localStorage.getItem("guestbook") || "[]");

  function render() {
    list.innerHTML = "";
    guestbook.forEach((entry, index) => {
      const div = document.createElement("div");
      div.classList.add("guestbook-item");
      div.innerHTML = `
        <div class="guestbook-meta">${entry.name} • ${entry.date}</div>
        <div class="guestbook-text">${entry.message}</div>
        <button class="delete-btn owner-only">삭제</button>
      `;
      div.querySelector("button").addEventListener("click", () => {
        guestbook.splice(index, 1);
        localStorage.setItem("guestbook", JSON.stringify(guestbook));
        render();
      });
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
    name.value = "";
    msg.value = "";
    localStorage.setItem("guestbook", JSON.stringify(guestbook));
    render();
  });

  render();
}

/* ============================
   📘 다이어리
============================ */
function initOwnerDiary() {
  const text = document.getElementById("diary-text");
  const submit = document.getElementById("diary-submit");
  const list = document.getElementById("diary-list");

  if (!text || !submit || !list) return;

  let diaries = JSON.parse(localStorage.getItem("diaries") || "[]");

  function render() {
    list.innerHTML = "";
    diaries.forEach((entry, index) => {
      const div = document.createElement("div");
      div.classList.add("diary-item");
      div.innerHTML = `
        <div class="diary-date">${entry.date}</div>
        <div class="diary-text">${entry.text}</div>
        <button class="delete-diary-btn owner-only">삭제</button>
      `;
      div.querySelector("button").addEventListener("click", () => {
        diaries.splice(index, 1);
        localStorage.setItem("diaries", JSON.stringify(diaries));
        render();
      });
      list.appendChild(div);
    });
  }

  submit.addEventListener("click", () => {
    if (!text.value.trim()) return;
    const now = new Date();
    diaries.push({
      text: text.value.trim(),
      date: `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}`,
    });
    localStorage.setItem("diaries", JSON.stringify(diaries));
    text.value = "";
    render();
  });

  render();
}

/* ============================
   📷 사진 업로드·삭제
============================ */
function initOwnerPhotos() {
  const upload = document.getElementById("photo-upload");
  const grid = document.querySelector(".photo-grid");

  if (!upload || !grid) return;

  let photos = JSON.parse(localStorage.getItem("photos") || "[]");

  function render() {
    grid.innerHTML = "";
    photos.forEach((src, index) => {
      const div = document.createElement("div");
      div.classList.add("photo-item");
      div.innerHTML = `<img src="${src}"><button class="delete-btn owner-only">삭제</button>`;
      div.querySelector("button").addEventListener("click", () => {
        photos.splice(index, 1);
        localStorage.setItem("photos", JSON.stringify(photos));
        render();
      });
      grid.appendChild(div);
    });
  }

  upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      photos.push(reader.result);
      localStorage.setItem("photos", JSON.stringify(photos));
      render();
    };
    reader.readAsDataURL(file);
  });

  render();
}

/* ============================
   🎨 프로필 사진 변경
============================ */
function initOwnerProfile() {
  const input = document.getElementById("profile-upload");
  const box = document.querySelector(".profile-photo");
  if (!input || !box) return;

  const saved = localStorage.getItem("profile_photo");
  if (saved) box.style.backgroundImage = `url(${saved})`;

  input.addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      box.style.backgroundImage = `url(${reader.result})`;
      localStorage.setItem("profile_photo", reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ============================
   🎨 미니룸 변경
============================ */
function initOwnerMiniRoom() {
  const input = document.getElementById("room-upload");
  const box = document.querySelector(".miniroom-box");
  if (!input || !box) return;

  const saved = localStorage.getItem("miniroom_img");
  if (saved) box.style.backgroundImage = `url(${saved})`;

  input.addEventListener("change", e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      box.style.backgroundImage = `url(${reader.result})`;
      localStorage.setItem("miniroom_img", reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ============================
   🔒 로그아웃
============================ */
function initLogout() {
  const btn = document.getElementById("logout-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    localStorage.removeItem("isOwner");
    sessionStorage.removeItem("visited_once");
    window.location.href = "index.html";
  });
}

/* ============================
   초기 실행
============================ */
window.addEventListener("DOMContentLoaded", () => {
  showOwnerUI();
  initOwnerGuestbook();
  initOwnerDiary();
  initOwnerPhotos();
  initOwnerProfile();
  initOwnerMiniRoom();
  initLogout();
});
