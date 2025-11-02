// Simple search filter for courses
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const courseCards = Array.from(document.querySelectorAll('.course-card'));

function filterCourses(query){
  const q = query.trim().toLowerCase();
  courseCards.forEach(card => {
    const tags = card.dataset.tags || '';
    const title = card.querySelector('h5').innerText.toLowerCase();
    const match = tags.includes(q) || title.includes(q) || q === '';
    card.style.display = match ? '' : 'none';
  });
}

searchBtn.addEventListener('click', ()=> filterCourses(searchInput.value));
searchInput.addEventListener('keyup', (e)=>{ 
  if(e.key === 'Enter') filterCourses(searchInput.value);
});

// Registration form simple handling (front-end only)
const regForm = document.getElementById('regForm');
const regMsg = document.getElementById('regMsg');

regForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const course = document.getElementById('courseSelect').value;

  if(!name || !email){
    regMsg.style.display = 'block';
    regMsg.className = 'alert alert-danger';
    regMsg.innerText = 'Mohon isi nama dan email.';
    return;
  }

  // Simulasi pendaftaran
  regMsg.style.display = 'block';
  regMsg.className = 'alert alert-success';
  regMsg.innerHTML = `<strong>Pendaftaran terkirim!</strong> ${name} telah terdaftar pada kursus <em>${course}</em>. (Ini simulasi front-end)`;
  regForm.reset();
});
