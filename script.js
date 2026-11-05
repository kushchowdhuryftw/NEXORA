const CATEGORIES = {
  tech: "Technology & Innovation", music: "Music & Entertainment", sports: "Sports & Fitness",
  business: "Business & Networking", education: "Education & Workshops", art: "Art & Culture"
};

const EVENTS = [
  { id: 1, title: "AI Future Summit 2027", cat: "tech", date: "2027-03-15T10:00", location: "Bengaluru, India", organizer: "NovaTech Labs", seats: 120, popularity: 95, desc: "Two days of AI, robotics and software keynotes with live demos." },
  { id: 2, title: "Neon Nights Music Festival", cat: "music", date: "2027-02-20T18:00", location: "Mumbai, India", organizer: "Pulse Entertainment", seats: 300, popularity: 98, desc: "An evening of electronic, indie and live performances under the lights." },
  { id: 3, title: "City Marathon & Fitness Expo", cat: "sports", date: "2027-01-12T06:00", location: "Hyderabad, India", organizer: "Urban Run Club", seats: 500, popularity: 80, desc: "A community run with fitness workshops, nutrition talks and expo stalls." },
  { id: 4, title: "Startup & Networking Mixer", cat: "business", date: "2027-04-05T17:30", location: "Pune, India", organizer: "Founders Hub", seats: 80, popularity: 72, desc: "Meet founders, investors and professionals in a relaxed setting." },
  { id: 5, title: "Design Thinking Workshop", cat: "education", date: "2027-02-01T11:00", location: "Delhi, India", organizer: "Creative Minds Academy", seats: 40, popularity: 66, desc: "A hands-on workshop on prototyping, user research and creative problem solving." },
  { id: 6, title: "Digital Art & Culture Week", cat: "art", date: "2027-05-10T14:00", location: "Chennai, India", organizer: "Canvas Collective", seats: 200, popularity: 85, desc: "Exhibitions, live digital art installations and cultural performances." }
];

const REG_KEY = "nexora_registrations";
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const getRegs = () => JSON.parse(localStorage.getItem(REG_KEY) || "[]");
const fmt = d => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function countdown(d) {
  const diff = new Date(d) - new Date();
  if (diff <= 0) return "Event has started";
  const days = Math.floor(diff / 864e5), hrs = Math.floor(diff % 864e5 / 36e5), mins = Math.floor(diff % 36e5 / 6e4);
  return `Starts in ${days}d ${hrs}h ${mins}m`;
}
function seatsLeft(e) {
  return Math.max(0, e.seats - getRegs().filter(r => r.eventId == e.id).length);
}
function card(e) {
  return `<article class="card reveal">
    <img src="images/${e.cat}.svg" alt="${e.title}">
    <div class="card-body">
      <span class="tag">${CATEGORIES[e.cat]}</span>
      <h3>${e.title}</h3>
      <p class="meta">📅 ${fmt(e.date)}</p>
      <p class="meta">📍 ${e.location}</p>
      <p>${e.desc}</p>
      <p class="count" data-date="${e.date}">${countdown(e.date)}</p>
      <button class="btn primary small" onclick="showDetails(${e.id})">View Details</button>
    </div></article>`;
}

$("#featured").innerHTML = EVENTS.slice(0, 6).map(card).join("");

$("#catGrid").innerHTML = Object.entries(CATEGORIES).map(([k, v]) =>
  `<button class="card cat-btn" onclick="filterCat('${k}')"><img src="images/${k}.svg" alt=""><span>${v}</span></button>`).join("");
function filterCat(k) {
  $("#catFilter").value = k;
  renderExplore();
  $("#explore").scrollIntoView({ behavior: "smooth" });
}

const searchEl = $("#search"), catEl = $("#catFilter"), dateEl = $("#dateFilter"), sortEl = $("#sort");
function renderExplore() {
  const q = searchEl.value.trim().toLowerCase(), c = catEl.value, d = dateEl.value;
  let list = EVENTS.filter(e => e.title.toLowerCase().includes(q) && (c === "all" || e.cat === c) && (!d || e.date.slice(0, 10) >= d));
  list.sort((a, b) => sortEl.value === "popularity" ? b.popularity - a.popularity : a.date.localeCompare(b.date));
  $("#eventGrid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No events match your filters.</p>`;
  observeReveal();
}
[searchEl, catEl, dateEl, sortEl].forEach(el => el.addEventListener("input", renderExplore));

function showDetails(id) {
  const e = EVENTS.find(x => x.id === id), left = seatsLeft(e);
  $("#detailsBody").innerHTML = `
    <img class="banner" src="images/${e.cat}.svg" alt="${e.title}">
    <span class="tag">${CATEGORIES[e.cat]}</span>
    <h2>${e.title}</h2>
    <p class="meta">📅 ${fmt(e.date)} · <span class="count" data-date="${e.date}">${countdown(e.date)}</span></p>
    <p class="meta">📍 Venue: ${e.location}</p>
    <p>${e.desc}</p>
    <p><strong>Organizer:</strong> ${e.organizer}</p>
    <p><strong>Registration:</strong> ${left > 0 ? left + " seats left" : "Sold out"}</p>
    ${left > 0 ? `<button class="btn primary" onclick="goRegister(${e.id})">Register Now</button>` : ""}`;
  $("#details").classList.remove("hidden");
  $("#details").scrollIntoView({ behavior: "smooth" });
}
function goRegister(id) {
  $("#eventSelect").value = id;
  $("#register").scrollIntoView({ behavior: "smooth" });
}

$("#eventSelect").innerHTML = `<option value="">Choose an event</option>` +
  EVENTS.map(e => `<option value="${e.id}">${e.title}</option>`).join("");

$("#regForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const name = $("#rName").value.trim(), email = $("#rEmail").value.trim();
  const phone = $("#rPhone").value.trim(), eventId = $("#eventSelect").value;
  const errs = {
    name: name.length < 2 ? "Please enter your full name." : "",
    email: EMAIL_RE.test(email) ? "" : "Enter a valid email address.",
    phone: /^\+?\d{10,13}$/.test(phone.replace(/[\s-]/g, "")) ? "" : "Enter a valid phone number (10 to 13 digits).",
    eventId: eventId ? "" : "Please select an event."
  };
  Object.entries(errs).forEach(([k, v]) => $("#err-" + k).textContent = v);
  if (Object.values(errs).some(Boolean)) return;

  const e = EVENTS.find(x => x.id == eventId);
  if (seatsLeft(e) <= 0) { $("#err-eventId").textContent = "Sorry, this event is sold out."; return; }

  const regs = getRegs();
  regs.push({ name, email, phone, eventId: e.id, registeredAt: new Date().toISOString() });
  localStorage.setItem(REG_KEY, JSON.stringify(regs));

  $("#confirm").innerHTML = `<h3>🎉 Registration Confirmed!</h3>
    <p>Thanks ${name}, you are registered for <strong>${e.title}</strong>.</p>
    <p>📅 ${fmt(e.date)} · 📍 ${e.location}</p>
    <p class="meta">Your details are saved on this device.</p>`;
  $("#confirm").classList.remove("hidden");
  ev.target.reset();
});

$("#newsForm").addEventListener("submit", ev => {
  ev.preventDefault();
  const em = $("#newsEmail").value.trim();
  const ok = EMAIL_RE.test(em);
  $("#newsMsg").textContent = ok ? "Subscribed! Watch your inbox for upcoming events." : "Please enter a valid email address.";
  if (ok) { localStorage.setItem("nexora_newsletter", em); ev.target.reset(); }
});

const themeBtn = $("#themeToggle");
if (localStorage.getItem("nexora_theme") === "light") document.body.classList.add("light");
const setIcon = () => themeBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
setIcon();
themeBtn.onclick = () => {
  document.body.classList.toggle("light");
  localStorage.setItem("nexora_theme", document.body.classList.contains("light") ? "light" : "dark");
  setIcon();
};

$("#menuBtn").onclick = () => $("#navLinks").classList.toggle("open");
$$("#navLinks a").forEach(a => a.onclick = () => $("#navLinks").classList.remove("open"));

const revObs = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("show"); revObs.unobserve(en.target); }
}), { threshold: 0.15 });
function observeReveal() { $$(".reveal:not(.show)").forEach(el => revObs.observe(el)); }
observeReveal();

function animateCounter(el) {
  const target = +el.dataset.target, step = Math.max(1, Math.ceil(target / 80));
  let n = 0;
  const tick = () => { n = Math.min(target, n + step); el.textContent = n.toLocaleString(); if (n < target) requestAnimationFrame(tick); };
  tick();
}
const statObs = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { $$(".counter").forEach(animateCounter); statObs.disconnect(); }
}), { threshold: 0.3 });
statObs.observe($("#stats"));

setInterval(() => $$(".count[data-date]").forEach(el => el.textContent = countdown(el.dataset.date)), 60000);

window.addEventListener("load", () => $("#loader").classList.add("hidden"));
