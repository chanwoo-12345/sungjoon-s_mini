/* ============================================
   🎨 프로필 사진 업로드
============================================ */
document.getElementById("profile-upload")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("profile_photo", reader.result);
    document.getElementById("profile-image").style.backgroundImage = `url(${reader.result})`;
  };
  reader.readAsDataURL(file);
});


/* ============================================
   🏠 미니룸 사진 업로드
============================================ */
document.getElementById("room-upload")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("miniroom_photo", reader.result);
    document.getElementById("room-image").style.backgroundImage = `url(${reader.result})`;
  };
  reader.readAsDataURL(file);
});


/* ============================================
   📷 사진 업로드 (오너 전용)
============================================ */
document.getElementById("photo-upload")?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const photos = JSON.parse(localStorage.getItem("photos") || "[]");
    photos.push(reader.result);
    localStorage.setItem("photos", JSON.stringify(photos));
    renderPhotos();
  };
  reader.readAsDataURL(file);
});


/* ============================================
   📘 다이어리 작성 (오너 전용)
============================================ */
document.getElementById("diary-write-btn")?.addEventListener("click", () => {
  const text = document.getElementById("diary-text").value.trim();
  if (!text) return;

  const now = new Date();
  const date = `${now.getFullYear()}.${now.getMonth()+1}.${now.getDate()}`;

  const diaries = JSON.parse(localStorage.getItem("diaries") || "[]");
  diaries.push({ text, date });
  localStorage.setItem("diaries", JSON.stringify(diaries));

  document.getElementById("diary-text").value = "";
  renderDiary();
});


/* ============================================
   🔓 로그아웃
============================================ */
document.getElementById("logout-btn")?.addEventListener("click", () => {
  localStorage.removeItem("isOwner");
  alert("로그아웃 되었습니다!");
  location.href = "index.html";
});

// 프로필 수정 버튼 → 숨겨진 input 실행
document.getElementById("profile-btn").addEventListener("click", () => {
  document.getElementById("profile-upload").click();
});
