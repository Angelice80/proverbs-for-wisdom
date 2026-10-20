/* Proverbs For Wisdom: books, lessons and the verse finder.
   To add a lesson: add a line to LESSONS with its book id, chapter, verse, text and video link. */

const BOOKS = [
  {
    id: "children-7-10",
    title: "Proverbs For Children",
    tagline: "Learning Wisdom for a Lifetime",
    ages: "7–10",
    isbn: "979-8194265558",
    pages: 99,
    price: null,
    cover: "assets/covers/children-7-10.jpg",
    coverH: 950,
    amazon: "https://www.amazon.com/dp/B0HKCDXFRB",
    filter: "Ages 7–10",
  },
  {
    id: "children-11-13",
    title: "Proverbs For Children",
    tagline: "Live Wisely. Choose Well. Make a Difference.",
    ages: "11–13",
    isbn: "979-8176574050",
    pages: 183,
    price: "$19.99",
    cover: "assets/covers/children-11-13.jpg",
    coverH: 999,
    amazon: "https://www.amazon.com/dp/B0HMJCSPXB",
    filter: "Ages 11–13",
  },
  {
    id: "teens-1",
    title: "Proverbs For Teens, Volume 1",
    tagline: "Wisdom for the Person You Are Becoming",
    ages: "14–17",
    isbn: "979-8178985243",
    extra: "10 lessons",
    pages: 203,
    price: "$17.95",
    cover: "assets/covers/teens-vol-1.jpg",
    coverH: 1005,
    amazon: "https://www.amazon.com/dp/B0HLZBFCQY",
    filter: "Teens, Vol. 1",
  },
  {
    id: "teens-2",
    title: "Proverbs For Teens, Volume 2",
    tagline: "The second set of teen lessons",
    ages: "14–17",
    isbn: "979-8177669106",
    pages: 203,
    price: "$17.95",
    cover: null,
    amazon: "https://www.amazon.com/dp/B0HLSCQMD9",
    filter: "Teens, Vol. 2",
  },
];

/* SAMPLE lessons for the preview (KJV text). Replace with Jerry's real list; video: null means no link yet. */
const LESSONS = [
  { book: "children-7-10", ch: 1, v: 8, text: "My son, hear the instruction of thy father, and forsake not the law of thy mother.", video: null },
  { book: "children-7-10", ch: 3, v: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding.", video: null },
  { book: "children-11-13", ch: 4, v: 23, text: "Keep thy heart with all diligence; for out of it are the issues of life.", video: null },
  { book: "children-11-13", ch: 13, v: 20, text: "He that walketh with wise men shall be wise: but a companion of fools shall be destroyed.", video: null },
  { book: "teens-1", ch: 15, v: 1, text: "A soft answer turneth away wrath: but grievous words stir up anger.", video: null },
  { book: "teens-1", ch: 16, v: 16, text: "How much better is it to get wisdom than gold! and to get understanding rather to be chosen than silver!", video: null },
  { book: "teens-1", ch: 17, v: 3, text: "The fining pot is for silver, and the furnace for gold: but the LORD trieth the hearts.", video: null },
];

/* Verses per chapter in Proverbs, used to catch typos like 17:40. */
const VERSES = [33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24, 29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31];

const DOMAIN = "proverbsforwisdom.org";
const BASE = location.href.replace(/[#?].*$/, "").replace(/[^/]*$/, "");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const $ = (sel, root = document) => root.querySelector(sel);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const icon = (name, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const bookById = (id) => BOOKS.find((b) => b.id === id);
const slug = (l) => `${l.ch}-${l.v}`;
const nb = (t) => esc(t).replace(/ (\d+)$/, "&nbsp;$1");
const factsLine = (b) => `${b.pages} pages · ${b.price || "Limited availability"}`;
const findLesson = (ch, v) => LESSONS.find((l) => l.ch === ch && l.v === v);

function thumb(book, cls = "") {
  return book.cover
    ? `<img src="${book.cover}" alt="" width="760" height="${book.coverH}" loading="lazy" class="${cls}">`
    : `<span class="mini-placeholder ${cls}" aria-hidden="true"></span>`;
}

/* ---------- shelf ---------- */
function renderShelf() {
  $("#books").innerHTML = BOOKS.map((b) => {
    const cover = b.cover
      ? `<img src="${b.cover}" alt="Cover of ${esc(b.title)}, ages ${b.ages}" width="760" height="${b.coverH}">`
      : `<span class="cover-placeholder"><b>Proverbs For Teens</b><em>Volume 2</em><small>Cover art coming</small></span>`;
    const buyLabel = b.price ? "Buy on Amazon" : "See it on Amazon";
    return `<li class="book">
      <a class="book-cover" href="${b.amazon}" rel="noopener" tabindex="-1" aria-hidden="true">${cover}</a>
      <span class="book-ages">Ages ${b.ages}</span>
      <span class="book-title">${nb(b.title)}</span>
      <span class="book-facts">${factsLine(b)}</span>
      <a class="book-buy" href="${b.amazon}" rel="noopener">${buyLabel}<span class="sr">: ${esc(b.title)}, ages ${b.ages}</span>${icon("out")}</a>
    </li>`;
  }).join("");
}

/* ---------- comparison table ---------- */
function renderTable() {
  $("#facts-body").innerHTML = BOOKS.map((b) => `<tr>
    <td><div class="ft-book">${thumb(b)}<div><div class="ft-title">${nb(b.title)}</div><div class="ft-sub">${esc(b.tagline)}${b.extra ? ` · ${b.extra}` : ""}</div><div class="ft-isbn">ISBN ${b.isbn}</div></div></div></td>
    <td>${b.ages}</td>
    <td>${b.pages}</td>
    <td>${b.price ? b.price : `<span class="ft-muted">Limited</span>`}</td>
    <td><a href="${b.amazon}" rel="noopener">Buy<span class="sr"> on Amazon: ${esc(b.title)}, ages ${b.ages}</span>${icon("out")}</a></td>
  </tr>`).join("");
}

/* ---------- lesson library ---------- */
function lessonRow(l) {
  const s = slug(l);
  return `<li class="lesson" id="lesson-${s}">
    <div class="lesson-ref" aria-label="Proverbs ${l.ch}:${l.v}">${l.ch}<span class="colon">:</span>${l.v}</div>
    <p class="lesson-verse">${esc(l.text)}</p>
    <div class="lesson-actions">
      <button type="button" class="btn btn-navy btn-small" data-act="watch" data-slug="${s}">${icon("play")}Watch<span class="sr"> the lesson on Proverbs ${l.ch}:${l.v}</span></button>
      <button type="button" class="btn btn-quiet" data-act="qr" aria-expanded="false" aria-controls="x-${s}">${icon("qr")}Link &amp; QR</button>
    </div>
    <div class="lesson-extra" id="x-${s}" hidden>
      <img src="assets/qr/${s}.svg" alt="QR code for the Proverbs ${l.ch}:${l.v} lesson" width="120" height="120" loading="lazy">
      <p><span class="addr">${DOMAIN}/${s}</span>Scan the code or type the address to open this lesson. Ready to print in a book.</p>
      <button type="button" class="btn btn-quiet" data-act="copy" data-slug="${s}">${icon("link")}<span>Copy link</span></button>
    </div>
    <p class="lesson-msg" hidden>Preview: Jerry's video for ${l.ch}:${l.v} opens here once he sends the link.</p>
  </li>`;
}

function renderLibrary() {
  $("#library").innerHTML = BOOKS.map((b) => {
    const items = LESSONS.filter((l) => l.book === b.id).sort((a, z) => a.ch - z.ch || a.v - z.v);
    return `<section class="lesson-group" data-book="${b.id}" aria-label="${esc(b.title)}, ages ${b.ages}">
      <div class="group-head">${thumb(b)}<div><div class="group-title">${nb(b.title)}</div><div class="group-ages">Ages ${b.ages}</div></div></div>
      ${items.length
        ? `<ol class="lesson-list">${items.map(lessonRow).join("")}</ol>`
        : `<div class="lesson-list"><p class="empty">Lessons for this book are on the way.</p></div>`}
    </section>`;
  }).join("");

  const filters = $(".filters");
  filters.insertAdjacentHTML("beforeend", BOOKS.map((b) =>
    `<button type="button" class="chip" data-filter="${b.id}" aria-pressed="false">${b.filter}</button>`).join(""));
  filters.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (chip) setFilter(chip.dataset.filter);
  });

  $("#library").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;
    const row = btn.closest(".lesson");
    if (btn.dataset.act === "watch") watch(btn.dataset.slug, row);
    if (btn.dataset.act === "qr") {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      $(".lesson-extra", row).hidden = open;
    }
    if (btn.dataset.act === "copy") copyLink(btn);
  });
}

function setFilter(id) {
  document.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.filter === id)));
  document.querySelectorAll(".lesson-group").forEach((g) => { g.hidden = id !== "all" && g.dataset.book !== id; });
}

function watch(s, row) {
  const [ch, v] = s.split("-").map(Number);
  const lesson = findLesson(ch, v);
  if (lesson && lesson.video) { location.href = lesson.video; return; }
  const msg = row && $(".lesson-msg", row);
  if (msg) msg.hidden = false;
}

async function copyLink(btn) {
  const label = $("span", btn);
  const url = BASE + btn.dataset.slug;
  try {
    await navigator.clipboard.writeText(url);
    label.textContent = "Copied";
  } catch {
    label.textContent = "Couldn't copy. Use the address shown.";
  }
  setTimeout(() => { label.textContent = "Copy link"; }, 2400);
}

function showLesson(ch, v) {
  const row = document.getElementById(`lesson-${ch}-${v}`);
  if (!row) return;
  const group = row.closest(".lesson-group");
  if (group.hidden) setFilter("all");
  row.classList.add("is-found");
  row.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  setTimeout(() => row.classList.remove("is-found"), 1800);
}

/* ---------- verse finder ---------- */
function parseVerse(raw) {
  const s = raw.trim().toLowerCase().replace(/^(proverbs|prov|pr)\.?\s*/, "");
  if (!s) return { state: "empty" };
  const m = s.match(/^(\d{1,2})(?:\s*[:.\-\s]\s*(\d{1,3})?)?$/);
  if (!m) return { state: "invalid", msg: "Type the chapter and verse with a colon, like 17:3." };
  const ch = Number(m[1]);
  if (ch < 1 || ch > 31) return { state: "invalid", msg: "Proverbs has 31 chapters. Check the chapter number." };
  if (m[2] === undefined) return { state: "partial", ch, msg: `Now add the verse, like ${ch}:1.` };
  const v = Number(m[2]);
  if (v < 1 || v > VERSES[ch - 1]) return { state: "invalid", msg: `Proverbs ${ch} has ${VERSES[ch - 1]} verses. Check the verse number.` };
  return { state: "verse", ch, v };
}

function initFinder() {
  const form = $("#finder");
  const input = $("#verse");
  const status = $("#finder-status");
  const result = $("#finder-result");
  let current = null;

  function update() {
    const p = parseVerse(input.value);
    current = null;
    result.hidden = true;
    status.dataset.state = p.state;
    if (p.state === "empty") { status.textContent = "Type a chapter and verse, like 17:3."; return; }
    if (p.state !== "verse") { status.textContent = p.msg; return; }
    const lesson = findLesson(p.ch, p.v);
    if (!lesson) {
      status.dataset.state = "missing";
      status.textContent = `There's no lesson for Proverbs ${p.ch}:${p.v} yet.`;
      return;
    }
    current = lesson;
    const book = bookById(lesson.book);
    status.dataset.state = "found";
    status.textContent = `Found Proverbs ${lesson.ch}:${lesson.v} in ${book.title}.`;
    result.innerHTML = `${thumb(book)}
      <div class="fr-text"><span class="fr-ref">Proverbs ${lesson.ch}:${lesson.v}</span><span class="fr-book">${esc(book.filter)} · <a href="#lesson-${slug(lesson)}" data-show>See it in the list</a></span></div>
      <button type="submit" class="btn fr-watch">${icon("play")}Watch</button>`;
    result.hidden = false;
  }

  input.addEventListener("input", update);
  result.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-show]");
    if (!a || !current) return;
    e.preventDefault();
    showLesson(current.ch, current.v);
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    update();
    if (!current) { input.focus(); return; }
    if (current.video) { location.href = current.video; return; }
    $(".fr-book", result).textContent = "Preview: Jerry's video link goes here.";
    showLesson(current.ch, current.v);
  });

  /* Short links (/17-3) land here as #17-3. */
  const m = location.hash.match(/^#(\d{1,2})-(\d{1,3})$/);
  if (m) {
    input.value = `${m[1]}:${m[2]}`;
    update();
    if (current) setTimeout(() => showLesson(current.ch, current.v), 300);
  }
}

/* ---------- contact (preview: nothing is sent) ---------- */
function initContact() {
  const form = $("#contact-form");
  const status = $("#form-status");
  const rules = {
    "c-name": (v) => v.trim() ? "" : "Please add your name.",
    "c-email": (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please add an email address Jerry can reply to.",
    "c-msg": (v) => v.trim() ? "" : "Please write a message.",
  };

  function check(id) {
    const el = document.getElementById(id);
    const err = rules[id](el.value);
    let note = document.getElementById(`${id}-err`);
    if (err) {
      if (!note) {
        note = document.createElement("span");
        note.id = `${id}-err`;
        note.className = "field-error";
        el.after(note);
      }
      note.textContent = err;
      el.setAttribute("aria-invalid", "true");
      el.setAttribute("aria-describedby", note.id);
    } else if (note) {
      note.remove();
      el.removeAttribute("aria-invalid");
      el.removeAttribute("aria-describedby");
    }
    return !err;
  }

  Object.keys(rules).forEach((id) => {
    document.getElementById(id).addEventListener("blur", (e) => { if (e.target.value) check(id); });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) {
      status.dataset.state = "error";
      status.textContent = "A few details are missing. They're marked above.";
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    btn.textContent = "Sending…";
    status.textContent = "";
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = "Send to Jerry";
      form.reset();
      status.dataset.state = "sent";
      status.innerHTML = `${icon("check")}<span>Thanks! In this preview nothing is sent. On the live site this goes to Jerry's inbox.</span>`;
    }, 700);
  });
}

renderShelf();
renderTable();
renderLibrary();
initFinder();
initContact();
