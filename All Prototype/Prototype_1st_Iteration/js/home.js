const STORAGE_KEY = "inclusive_posts_v1";
const TRUSTED = [
  { id: "grace", label: "Grace" },
  { id: "amir", label: "Amir" },
  { id: "sana", label: "Sana" },
  { id: "leo", label: "Leo" }
];

function loadPosts() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function savePosts(posts) { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
function nowISO() { return new Date().toISOString(); }
function formatTime(ts) { return new Date(ts).toLocaleString(); }
function uuid() { return (crypto && crypto.randomUUID) ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(16).slice(2)}`; }
function $(id){ return document.getElementById(id); }

const composer = $("composer");
const openComposerBtn = $("openComposer");
const newPostBtn = $("newPostBtn");
const closeComposer = $("closeComposer");
const cancelPost = $("cancelPost");
const postForm = $("postForm");
const feedList = $("feedList");
const charName = $("charName");
const charDetails = $("charDetails");
const inviteInput = $("inviteInput");
const trustedList = $("trustedList");
const quickPost = $("quickPost");
const searchBox = $("channelSearch") || $("searchInput");
const groupSelect = $("groupSelect");
const typeSelect = $("typeSelect");

let currentGroup = "all";
let currentType = "all";

function openModal() {
  if (!composer) return;
  composer.classList.remove("hidden");
  composer.setAttribute("aria-hidden", "false");
  if (charName) charName.focus();
}
function closeModal() {
  if (!composer) return;
  composer.classList.add("hidden");
  composer.setAttribute("aria-hidden", "true");
  if (postForm) postForm.reset();
}

if (openComposerBtn) openComposerBtn.addEventListener("click", () => {
  openModal();
  if (quickPost && quickPost.value.trim()) {
    if (charDetails) charDetails.value = quickPost.value.trim();
    quickPost.value = "";
  }
});
if (newPostBtn) newPostBtn.addEventListener("click", openModal);
if (closeComposer) closeComposer.addEventListener("click", closeModal);
if (cancelPost) cancelPost.addEventListener("click", closeModal);
if (composer) composer.addEventListener("click", (e) => { if (e.target === composer) closeModal(); });

function renderTrusted() {
  if (!trustedList) return;
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
}
if (trustedList) {
  trustedList.addEventListener("click", (e) => {
    const btn = e.target.closest(".invite-btn");
    if (!btn || !inviteInput) return;
    const label = (btn.getAttribute("data-label") || "").trim();
    const current = inviteInput.value.trim();
    inviteInput.value = current ? `${current}, ${label}` : label;
    inviteInput.focus();
  });
}

function escapeHTML(s) {
  return s.replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[c]));
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

function renderFeedTextFilter(p, q) {
  if (!q) return true;
  const name = (p.characterName || "").toLowerCase();
  const details = (p.details || "").toLowerCase();
  return name.includes(q) || details.includes(q);
}
function renderFeedGroupFilter(p) {
  if (currentGroup === "all") return true;
  return (p.group || "all") === currentGroup;
}
function renderFeedTypeFilter(p) {
  if (currentType === "all") return true;
  return (p.type || "characters") === currentType;
}

function renderFeed(filter = "") {
  if (!feedList) return;
  const q = (filter || "").trim().toLowerCase();
  const posts = loadPosts().sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  feedList.innerHTML = "";
  posts
    .filter(p => renderFeedTextFilter(p, q))
    .filter(renderFeedGroupFilter)
    .filter(renderFeedTypeFilter)
    .forEach(p => feedList.appendChild(renderPostCard(p)));
}

if (postForm) {
  postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = (charName && charName.value || "").trim();
    const details = (charDetails && charDetails.value || "").trim();
    const inviteRaw = (inviteInput && inviteInput.value || "").trim();
    if (!name || !details) return;
    const reviewers = inviteRaw ? inviteRaw.split(",").map(s => s.trim()).filter(Boolean).map(s => s.replace(/^@+/, "")) : [];
    const newPost = {
      id: uuid(),
      characterName: name,
      details,
      reviewers,
      createdAt: nowISO(),
      likes: 0,
      group: groupSelect ? groupSelect.value : "all",
      type: typeSelect ? typeSelect.value : "characters"
    };
    const posts = loadPosts();
    posts.push(newPost);
    savePosts(posts);
    closeModal();
    renderFeed(searchBox ? searchBox.value : "");
  });
}

if (feedList) {
  feedList.addEventListener("click", (e) => {
    const likeBtn = e.target.closest("[data-like]");
    if (likeBtn) {
      const id = likeBtn.getAttribute("data-like");
      const posts = loadPosts();
      const p = posts.find(x => x.id === id);
      if (p) {
        p.likes = (p.likes || 0) + 1;
        savePosts(posts);
        renderFeed(searchBox ? searchBox.value : "");
      }
      return;
    }
    const commentBtn = e.target.closest("[data-comment]");
    if (commentBtn) {
      alert("Comments coming soon");
    }
  });
}

if (searchBox) {
  searchBox.addEventListener("input", () => renderFeed(searchBox.value));
}

document.querySelectorAll(".guild").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".guild").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentGroup = btn.dataset.group || "all";
    renderFeed(searchBox ? searchBox.value : "");
  });
});

document.querySelectorAll(".pill").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentType = btn.dataset.filter || "all";
    renderFeed(searchBox ? searchBox.value : "");
  });
});

renderTrusted();
renderFeed(searchBox ? searchBox.value : "");
