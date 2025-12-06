/* ============================================
   📝 방명록 작성 (방문자 전용)
============================================ */
document.addEventListener("DOMContentLoaded", () => {
  const nameEl = document.getElementById("guest-name");
  const msgEl = document.getElementById("guest-message");
  const btn = document.getElementById("guest-submit");

  if (!btn) return;

  btn.addEventListener("click", () => {
    const name = nameEl.value.trim();
    const msg = msgEl.value.trim();

    if (!name || !msg) return;

    const today = new Date();
    const date = `${today.getFullYear()}.${today.getMonth()+1}.${today.getDate()}`;

    const guestbook = JSON.parse(localStorage.getItem("guestbook") || "[]");

    guestbook.push({ name, message: msg, date });
    localStorage.setItem("guestbook", JSON.stringify(guestbook));

    nameEl.value = "";
    msgEl.value = "";

    renderGuestbook();
  });
});

