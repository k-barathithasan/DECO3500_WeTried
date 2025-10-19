const yearEl=document.getElementById('year')
if(yearEl){yearEl.textContent=new Date().getFullYear()}
const burger=document.getElementById('burger')
if(burger){burger.addEventListener('click',()=>{const links=document.querySelector('.nav-links');if(!links)return;links.style.display=links.style.display==='flex'?'none':'flex'})}

const loginForm=document.getElementById('loginForm')
if(loginForm){
  const email=document.getElementById('email')
  const password=document.getElementById('password')
  const remember=document.getElementById('remember')
  loginForm.addEventListener('submit',e=>{
    e.preventDefault()
    const ok=email.value.includes('@')&&password.value.length>=6
    if(!ok){alert('Enter a valid email and password');return}
    if(remember&&remember.checked){localStorage.setItem('fv_demo_user',email.value)}
    window.location.href='/Html/Homepage.html'
  })
  const demo=document.getElementById('demoLogin')
  if(demo){demo.addEventListener('click',()=>{window.location.href='index.html'})}
}
