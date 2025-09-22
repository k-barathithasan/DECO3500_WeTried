const STORAGE_KEY = "inclusive_posts_v1";
const TRUSTED = [
  { id: "grace", label: "Grace " },
  { id: "amir", label: "Amir " },
  { id: "sana", label: "Sana " },
  { id: "leo", label: "Leo" }
];

function loadPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function savePosts(posts) { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
function nowISO() { return new Date().toISOString(); }
function formatTime(ts) { return new Date(ts).toLocaleString(); }

const composer = document.getElementById("composer");
const openComposerBtn = document.getElementById("openComposer");
const newPostBtn = document.getElementById("newPostBtn");
const closeComposer = document.getElementById("closeComposer");
const cancelPost = document.getElementById("cancelPost");
const postForm = document.getElementById("postForm");
const feedList = document.getElementById("feedList");
const charName = document.getElementById("charName");
const charDetails = document.getElementById("charDetails");
const inviteInput = document.getElementById("inviteInput");
const trustedList = document.getElementById("trustedList");
const searchInput = document.getElementById("searchInput");
const quickPost = document.getElementById("quickPost");

function openModal() {
  composer.classList.remove("hidden");
  composer.setAttribute("aria-hidden", "false");
  charName.focus();
}
function closeModal() {
  composer.classList.add("hidden");
  composer.setAttribute("aria-hidden", "true");
  postForm.reset();
}

openComposerBtn.addEventListener("click", openModal);
newPostBtn.addEventListener("click", openModal);
closeComposer.addEventListener("click", closeModal);
cancelPost.addEventListener("click", closeModal);
composer.addEventListener("click", (e) => { if (e.target === composer) closeModal(); });

function renderTrusted() {
  trustedList.innerHTML = "";
  TRUSTED.forEach(t => {
    const li = document.createElement("li");
    li.className = "trusted-item";
    li.innerHTML = `
      <span>👤 ${t.label}</span>
      <button class="invite-btn" data-id="${t.id}" data-label="${t.label}">＋ Invite</button>
    `;
    trustedList.appendChild(li);
  });

  trustedList.addEventListener("click", (e) => {
    const btn = e.target.closest(".invite-btn");
    if (!btn) return;
    const label = btn.getAttribute("data-label");
    const current = inviteInput.value.trim();
    inviteInput.value = current ? `${current}, ${label}` : label;
    inviteInput.focus();
  }, { once: true });
}

function renderPostCard(post) {
  const el = document.createElement("article");
  el.className = "post-card";
  const reviewers = (post.reviewers || []).map(r => `<span class="tag">@${r}</span>`).join(" ");
  const metaReviewers = reviewers ? `<div class="tag-list">${reviewers}</div>` : "";
  el.innerHTML = `
    <div class="post-header">
      <div class="post-title">${escapeHTML(post.characterName)}</div>
      <div class="post-meta">${formatTime(post.createdAt)}</div>
    </div>
    <div class="post-body">${escapeHTML(post.details)}</div>
    ${metaReviewers}
    <div class="post-actions-row">
      <button class="action-btn" data-like="${post.id}">👍 Like <span>(${post.likes || 0})</span></button>
      <button class="action-btn" data-comment="${post.id}">💬 Comment</button>
    </div>
  `;
  return el;
}

function renderFeed(filter = "") {
  const posts = loadPosts().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  feedList.innerHTML = "";
  const q = filter.trim().toLowerCase();
  posts
    .filter(p => !q || p.characterName.toLowerCase().includes(q) || p.details.toLowerCase().includes(q))
    .forEach(p => feedList.appendChild(renderPostCard(p)));
}

postForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = charName.value.trim();
  const details = charDetails.value.trim();
  const inviteRaw = inviteInput.value.trim();
  if (!name || !details) return;
  const reviewers = inviteRaw
    ? inviteRaw.split(",").map(s => s.trim()).filter(Boolean).map(normalizeReviewer)
    : [];
  const newPost = {
    id: crypto.randomUUID(),
    characterName: name,
    details,
    reviewers,
    createdAt: nowISO(),
    likes: 0
  };
  const posts = loadPosts();
  posts.push(newPost);
  savePosts(posts);
  closeModal();
  renderFeed(searchInput.value || "");
});

document.getElementById("openComposer").addEventListener("click", () => {
  openModal();
  if (quickPost.value.trim()) {
    charDetails.value = quickPost.value.trim();
    quickPost.value = "";
  }
});

feedList.addEventListener("click", (e) => {
  const likeBtn = e.target.closest("[data-like]");
  if (likeBtn) {
    const id = likeBtn.getAttribute("data-like");
    const posts = loadPosts();
    const p = posts.find(x => x.id === id);
    if (p) {
      p.likes = (p.likes || 0) + 1;
      savePosts(posts);
      renderFeed(searchInput.value || "");
    }
  }
  const commentBtn = e.target.closest("[data-comment]");
  if (commentBtn) {
    alert("Comments coming soon ✨");
  }
});

searchInput.addEventListener("input", () => renderFeed(searchInput.value));

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
function normalizeReviewer(s) {
  if (!s) return s;
  s = s.replace(/^@+/, "");
  return s;
}

renderTrusted();
renderFeed();
