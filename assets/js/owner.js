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

/* ============================================
   프로필 수정 기능
============================================ */

// 팝업 열기
document.getElementById("edit-profile-btn").onclick = () => {
  document.getElementById("profile-modal").style.display = "flex";

  // 현재 값 불러오기
  document.getElementById("edit-nickname").value =
    localStorage.getItem("nickname") || "✦ 성준★별빛남자 ✦";

  document.getElementById("edit-status").value =
    localStorage.getItem("status") || "";
};

// 팝업 닫기
document.getElementById("close-profile").onclick = () => {
  document.getElementById("profile-modal").style.display = "none";
};

// 저장 버튼
document.getElementById("save-profile").onclick = () => {
  const nickname = document.getElementById("edit-nickname").value.trim();
  const status = document.getElementById("edit-status").value.trim();
  const file = document.getElementById("edit-photo").files[0];

  if (nickname) localStorage.setItem("nickname", nickname);
  if (status) localStorage.setItem("status", status);

  // 이미지 변경
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      localStorage.setItem("profile_photo", reader.result);
      document.getElementById("profile-image").style.backgroundImage =
        `url(${reader.result})`;
    };
    reader.readAsDataURL(file);
  }

  // 즉시 적용
  document.querySelector(".profile-name").textContent = nickname;
  document.querySelector(".profile-status")?.textContent = status;

  alert("프로필이 저장되었습니다!");
  location.reload(); // 방문자 페이지도 새 값 사용 가능하도록
};
