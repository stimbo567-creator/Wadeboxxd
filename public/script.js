

function saveToken(t, u) {
  localStorage.setItem("wb_token", t);
  localStorage.setItem("wb_user", u);
}

function getToken() {
  return localStorage.getItem("wb_token");
}

function getUser() {
  return localStorage.getItem("wb_user");
}

function logout() {
  localStorage.removeItem("wb_token");
  localStorage.removeItem("wb_user");
  updateAuthUI();
}

function updateAuthUI() {
  const un = getUser();
  const userLabel = document.getElementById("auth-username");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (!userLabel || !loginBtn || !registerBtn || !logoutBtn) return;

  if (un) {
    userLabel.textContent = "Logged in as: " + un;
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userLabel.textContent = "";
    loginBtn.style.display = "inline-block";
    registerBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
}

updateAuthUI();


const authModal = document.getElementById("auth-modal");
const authTitle = document.getElementById("auth-title");
const authSubmitBtn = document.getElementById("auth-submit-btn");

let authMode = "login";

if (document.getElementById("login-btn")) {
  document.getElementById("login-btn").onclick = () => {
    authMode = "login";
    authTitle.textContent = "Login";
    authModal.style.display = "flex";
  };
}

if (document.getElementById("register-btn")) {
  document.getElementById("register-btn").onclick = () => {
    authMode = "register";
    authTitle.textContent = "Register";
    authModal.style.display = "flex";
  };
}

if (document.getElementById("auth-close-btn")) {
  document.getElementById("auth-close-btn").onclick = () => {
    authModal.style.display = "none";
  };
}

if (document.getElementById("logout-btn")) {
  document.getElementById("logout-btn").onclick = logout;
}

if (authSubmitBtn) {
  authSubmitBtn.onclick = () => {
    const username = document.getElementById("auth-username-input").value.trim();
    const password = document.getElementById("auth-password-input").value.trim();
    if (!username || !password) return alert("Missing fields!");

    const url = authMode === "login" ? "/api/users/login" : "/api/users/register";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) return alert(d.error);
        saveToken(d.token, d.username);
        authModal.style.display = "none";
        updateAuthUI();

        const nameField = document.getElementById("name");
        if (nameField) nameField.value = d.username;
      });
  };
}


function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


const starEls = document.querySelectorAll("#stars span");
let selectedRating = 0;

if (starEls.length) {
  starEls.forEach(star => {
    star.addEventListener("mouseover", () => {
      const v = star.dataset.value;
      starEls.forEach(s => s.classList.toggle("hovered", s.dataset.value <= v));
    });

    star.addEventListener("mouseout", () => {
      starEls.forEach(s => s.classList.remove("hovered"));
    });

    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.value);
      starEls.forEach(s =>
        s.classList.toggle("selected", s.dataset.value <= selectedRating)
      );
    });
  });
}


const movieSelect = document.getElementById("movie");
const reviewFeed = document.getElementById("review-feed");

if (movieSelect) loadMovies();
if (reviewFeed) loadReviews();

function loadMovies() {
  fetch("/movies")
    .then(r => r.json())
    .then(movies => {
      movieSelect.innerHTML = "";
      movies.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.title;
        movieSelect.appendChild(opt);
      });

      const u = getUser();
      if (document.getElementById("name")) {
        document.getElementById("name").value = u || "";
      }
    });
}

function loadReviews() {
  fetch("/reviews")
    .then(r => r.json())
    .then(list => {
      reviewFeed.innerHTML = "";
      list.forEach(addReviewToFeed);
    });
}

function addReviewToFeed(r) {
  const div = document.createElement("div");
  div.className = "review-item";

  div.innerHTML = `
    <strong>${escapeHtml(r.username || "Unknown")}</strong> reviewed 
    <em>${escapeHtml(r.movieTitle || "Unknown Movie")}</em> - ${"★".repeat(r.rating)}<br>
    ${escapeHtml(r.comment || "")}<br>
    <small>${new Date(r.createdAt).toLocaleString()}</small>
  `;

  reviewFeed.prepend(div);
}

const submitBtn = document.getElementById("submit");

if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    const username = getUser();
    const token = getToken();
    if (!username || !token) return alert("Login required!");

    const movieId = parseInt(movieSelect.value);
    const comment = document.getElementById("comment").value.trim();

    if (!movieId || selectedRating === 0)
      return alert("Choose a movie + stars!");

    fetch("/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        username,
        movieId,
        rating: selectedRating,
        comment
      })
    })
      .then(r => r.json())
      .then(review => {
        if (review.error) return alert(review.error);
        document.getElementById("comment").value = "";
        selectedRating = 0;
        starEls.forEach(s => s.classList.remove("selected"));
        addReviewToFeed(review);
      });
  });
}


const loadProfileBtn = document.getElementById("load-reviews");
if (loadProfileBtn) {
  loadProfileBtn.addEventListener("click", () => {
    let username =
      document.getElementById("profile-name").value.trim() || getUser();
    if (!username) return alert("Enter username!");

    fetch(`/reviews/user/${encodeURIComponent(username)}`)
      .then(r => r.json())
      .then(rows => {
        const container = document.getElementById("user-reviews");
        container.innerHTML = "";

        if (rows.length === 0) {
          container.innerHTML = "<p>No reviews yet 😔</p>";
          return;
        }

        rows.forEach(r => {
          const div = document.createElement("div");
          div.className = "review-item";

          div.innerHTML = `
            <strong>${escapeHtml(r.username)}</strong> reviewed
            <em>${escapeHtml(r.movieTitle)}</em> - ${"★".repeat(r.rating)}<br>
            ${escapeHtml(r.comment || "")}<br>
            <small>${new Date(r.createdAt).toLocaleString()}</small>
          `;

          container.appendChild(div);
        });
      });
  });
}


const movieGrid = document.getElementById("movie-grid");
if (movieGrid) {
  fetch("/movies")
    .then(r => r.json())
    .then(movies => {
      movieGrid.innerHTML = "";
      movies.forEach(m => {
        const card = document.createElement("div");
        card.className = "movie-card";
        card.innerHTML = `
          <strong>${escapeHtml(m.title)}</strong><br>
          <small>${escapeHtml(m.year || "")} ${
          m.genre ? " • " + escapeHtml(m.genre) : ""
        }</small>
        `;
        movieGrid.appendChild(card);
      });
    });
}
