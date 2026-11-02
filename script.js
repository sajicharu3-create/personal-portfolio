console.log('Script file loaded');
console.log(document.getElementById('contact-form'));


const navList = document.querySelectorAll(".menu a");
navList.forEach(active=>{
    active.addEventListener("click",()=>{
        navList.forEach(remove=>{
            remove.classList.remove("active");
        })
        active.classList.add("active");
    })
})

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".menu a");

const observer = new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

navLinks.forEach(link=>{

link.classList.remove("active");

});

document
.querySelector(`a[href="#${entry.target.id}"]`)
.classList.add("active");

}

});

},{
threshold:.6
});

sections.forEach(section=>observer.observe(section));

document.getElementById('contact-form').addEventListener('submit', async function(e) {
    console.log('Submit event fired');
  e.preventDefault();

  const formData = {
    name: this.name.value,
    email: this.email.value,
    subject: this.subject.value,
    message: this.message.value
  };
  console.log(formData);

  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('http://127.0.0.1:5500/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      alert('Message sent successfully!');
      this.reset();
    } else {
      alert('Something went wrong. Please try again.');
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again.');
  }finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

const magicSections = document.querySelectorAll('.magic-section');

const magicObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('active', entry.isIntersecting);
  });
}, { threshold: 0.4 });

magicSections.forEach(el => magicObserver.observe(el));





// Track scroll direction globally
let lastScrollY = window.scrollY;
const shimmerPositions = new WeakMap();

function updateShimmer() {
  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;
  lastScrollY = currentY;

  document.querySelectorAll('.shimmer-section').forEach(section => {
    const rect = section.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
    section.classList.toggle('active', isVisible);

    if (!isVisible) return;

    let pos = shimmerPositions.get(section) || 0;
    pos += delta * 0.6;
    pos = ((pos % 220) + 220) % 220; // wraps around instead of stopping at the edge
    shimmerPositions.set(section, pos);

    section.style.setProperty('--pos', pos + '%');
  });
}

window.addEventListener('scroll', updateShimmer);
updateShimmer();





function animateCount(el, target, duration) {
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = Math.round(target * (1 - Math.pow(1 - t, 2)));
    el.textContent = val + '%';
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target + '%';
  }
  requestAnimationFrame(tick);
}

const skillRows = document.querySelectorAll('.skill-row');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      const percentLabel = entry.target.querySelector('.skill-percent');
      const target = parseInt(fill.dataset.target);

      fill.classList.add('play'); // triggers the bounce keyframes
      animateCount(percentLabel, target, 1300);

      skillObserver.unobserve(entry.target); // only plays the first time
    }
  });
}, { threshold: 0.5 });

skillRows.forEach(row => skillObserver.observe(row));




const origin = document.getElementById('sparkle-origin');

function spawnSparkle() {
  const rect = origin.getBoundingClientRect();
  const startX = rect.left + window.scrollX;
  const startY = rect.top + window.scrollY;

  const el = document.createElement('div');
  el.className = 'gold-sparkle';
  const size = 3 + Math.random() * 4;
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.left = startX + 'px';
  el.style.top = startY + 'px';
  document.body.appendChild(el);

  // random left/right bias — decides which side this sparkle drifts toward first
  const dir = Math.random() < 0.5 ? -8 : 4;

  // randomized per-sparkle motion — different every time, no fixed track
  const ampX1 = 50 + Math.random() * 40, freqX1 = 0.5 + Math.random() * 0.5;
  const ampX2 = 10 + Math.random() * 20, freqX2 = 1.2 + Math.random() * 0.8;
  const ampY = 20 + Math.random() * 30, freqY = 0.3 + Math.random() * 0.4;
  const totalRise = window.innerHeight * 1.4; // enough to clear the header and exit the screen
  const duration = 9000 + Math.random() * 3000;
  const start = performance.now();

  function frame(now) {
    const t = (now - start) / 3000;
    const p = (now - start) / duration;
    if (p >= 1) { el.remove(); return; }

    const x = dir * ( Math.sin(t * freqX1) * ampX1 + Math.sin(t * freqX2) * ampX2);
    const y = -p * totalRise + Math.sin(t * freqY) * ampY;
    const opacity = p < 0.08 ? p / 0.08 : (p > 0.85 ? (1 - p) / 0.15 : 1);

    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.opacity = opacity;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

setInterval(spawnSparkle, 2000); // one every 2 seconds, as you asked