const $ = (selector) => document.querySelector(selector);

$("#startBtn").addEventListener("click", () => {
  $("#letter").scrollIntoView({behavior:"smooth"});
  heartBurst(8);
});

document.querySelectorAll(".reason-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".reason-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    $("#reasonReveal").textContent = card.dataset.message;
    heartBurst(3);
  });
});

$("#choiceA").addEventListener("click", () => {
  $("#answer").textContent = "Nice guess… but no. It's MY CAT LADY. In every timeline. No refunds. 🐈♡";
  heartBurst(5);
});
$("#choiceB").addEventListener("click", () => {
  $("#answer").textContent = "CORRECT. 🎉 Your prize is unlimited affection, terrible jokes, and me choosing you again and again. ♡";
  heartBurst(10);
});

// Local photo gallery: chosen images stay in this browser session and are not uploaded.
const picker = $("#photoPicker");
const gallery = $("#gallery");
picker.addEventListener("change", (event) => {
  const files = Array.from(event.target.files || []).filter(file => file.type.startsWith("image/")).slice(0,12);
  if (!files.length) return;
  gallery.innerHTML = "";
  files.forEach((file,index) => {
    const card = document.createElement("div");
    card.className = "gallery-photo";
    const img = document.createElement("img");
    img.alt = index === 0 ? "A memory together" : "A favourite photo";
    img.src = URL.createObjectURL(file);
    const caption = document.createElement("span");
    caption.className = "photo-caption";
    caption.textContent = index === 0 ? "our little moment ♡" : index === 1 ? "my Cat Lady ✿" : "one of my favourites ♡";
    const remove = document.createElement("button");
    remove.className = "remove-photo"; remove.type = "button"; remove.textContent = "×";
    remove.setAttribute("aria-label","Remove photo");
    remove.addEventListener("click", () => { URL.revokeObjectURL(img.src); card.remove(); });
    card.append(img,caption,remove); gallery.appendChild(card);
  });
  picker.value = "";
});

// Reveal sections as they enter the viewport.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  });
},{threshold:.1});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Seven Promises: tap the heart to open; both characters jump together as each step scrolls into view.
const heartTrigger = $("#heartTrigger");
const promiseWorld = $("#promiseWorld");
const promiseSteps = Array.from(document.querySelectorAll(".promise-step"));
let promisesOpened = false;

heartTrigger.addEventListener("click", () => {
  if (promisesOpened) return;
  promisesOpened = true;
  promiseWorld.hidden = false;
  heartTrigger.classList.add("heart-opened");
  $("#sevenPromises").scrollIntoView({behavior:"smooth",block:"start"});
  setTimeout(() => promiseWorld.scrollIntoView({behavior:"smooth",block:"start"}), 350);
  const stepObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const step = entry.target;
        step.classList.add("active");
        stepObserver.unobserve(step);
        // A shared jump class makes Batman and Cat Lady animate together.
        document.querySelectorAll(".promise-character").forEach(character => {
          character.classList.remove("jumping");
          void character.offsetWidth;
          character.classList.add("jumping");
        });
        setTimeout(() => document.querySelectorAll(".promise-character").forEach(c => c.classList.remove("jumping")), 700);
      }
    });
  },{threshold:.55});
  promiseSteps.forEach(step => stepObserver.observe(step));
  heartBurst(16);
});

function heartBurst(count=5) {
  const symbols = ["♡","♥","✦","✧"];
  for(let i=0;i<count;i++){
    const item=document.createElement("span");
    item.className="floating-heart";
    item.textContent=symbols[Math.floor(Math.random()*symbols.length)];
    item.style.cssText=`position:fixed;left:${Math.random()*100}vw;bottom:-25px;z-index:20;pointer-events:none;color:#ff9fc8;font-size:${12+Math.random()*18}px;animation:heartFloat ${2.5+Math.random()*2}s linear forwards`;
    document.body.appendChild(item);
    setTimeout(()=>item.remove(),4800);
  }
}
const floatStyle = document.createElement("style");
floatStyle.textContent="@keyframes heartFloat{to{transform:translateY(-110vh) rotate(25deg);opacity:0}} .promise-character.jumping{animation:duoJump .65s ease}";
document.head.appendChild(floatStyle);
window.addEventListener("load",()=>setTimeout(()=>heartBurst(4),450));
