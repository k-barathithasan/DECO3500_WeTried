const sidebar=document.getElementById('sidebar')
const overlay=document.getElementById('overlay')
const openBtn=document.getElementById('openSidebar')
const closeSidebar=()=>{sidebar.classList.remove('open');overlay.classList.remove('show')}
const openSidebarFn=()=>{sidebar.classList.add('open');overlay.classList.add('show')}
if(openBtn){openBtn.addEventListener('click',openSidebarFn);overlay.addEventListener('click',closeSidebar);window.addEventListener('keydown',e=>{if(e.key==='Escape')closeSidebar()})}
const boardModal=document.getElementById('boardModal')
const boardBackdrop=document.getElementById('boardBackdrop')
const closeBoard=document.getElementById('closeBoard')
const boardImage=document.getElementById('boardImage')
const pinLayer=document.getElementById('pinLayer')
const clearPins=document.getElementById('clearPins')
let pinCount=0
let dragPin=null
let dragOffset=[0,0]

const openBoardWithSrc=src=>{
  boardImage.src=src
  boardModal.classList.add('show')
  pinLayer.innerHTML=''
  pinCount=0
}

document.querySelectorAll('.chip.alt').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const card=e.currentTarget.closest('.card')
    const img=card.querySelector('.hero img')
    if(img) openBoardWithSrc(img.src)
  })
})

const closeBoardFn=()=>boardModal.classList.remove('show')
closeBoard.addEventListener('click',closeBoardFn)
boardBackdrop.addEventListener('click',closeBoardFn)
window.addEventListener('keydown',e=>{ if(e.key==='Escape') closeBoardFn() })

const localPos=(evt)=>{
  const rect=pinLayer.getBoundingClientRect()
  const x=(evt.clientX-rect.left)/rect.width
  const y=(evt.clientY-rect.top)/rect.height
  return {x,y}
}

pinLayer.addEventListener('click',e=>{
  if(e.target!==pinLayer) return
  const p=localPos(e)
  const text=prompt('Add note')
  if(!text) return
  pinCount++
  const pin=document.createElement('div')
  pin.className='pin'
  pin.style.left=(p.x*100)+'%'
  pin.style.top=(p.y*100)+'%'
  pin.dataset.x=p.x
  pin.dataset.y=p.y
  pin.innerHTML='<span>'+pinCount+'</span><div class="label"></div>'
  pin.querySelector('.label').textContent=text
  pin.addEventListener('mousedown',ev=>{
    dragPin=pin
    dragOffset=[ev.offsetX,ev.offsetY]
  })
  pin.addEventListener('click',ev=>{
    if(ev.detail===1) pin.classList.toggle('show')
  })
  pin.addEventListener('contextmenu',ev=>{
    ev.preventDefault()
    if(confirm('Delete this pin?')) pin.remove()
  })
  pinLayer.appendChild(pin)
})

window.addEventListener('mousemove',e=>{
  if(!dragPin) return
  const rect=pinLayer.getBoundingClientRect()
  let x=(e.clientX-rect.left-dragOffset[0])/rect.width
  let y=(e.clientY-rect.top-dragOffset[1])/rect.height
  x=Math.min(0.98,Math.max(0.02,x))
  y=Math.min(0.98,Math.max(0.02,y))
  dragPin.style.left=(x*100)+'%'
  dragPin.style.top=(y*100)+'%'
  dragPin.dataset.x=x
  dragPin.dataset.y=y
})

window.addEventListener('mouseup',()=>{dragPin=null})

clearPins.addEventListener('click',()=>{ if(confirm('Clear all pins?')){ pinLayer.innerHTML=''; pinCount=0 }})

    const feed=document.getElementById('feed')

let posts=[{
  id:crypto.randomUUID(),
  author:"Yashida Yagami",
  role:"Head of Design",
  avatar:"https://images.unsplash.com/photo-1609344143650-30a2a1b2f3b0?q=80&w=256&auto=format&fit=crop",
  hero:"/Assets/Character2.png",
  title:"Feedback on Female Character Design – Need Input on Representation & Stereotypes",
  text:"Hi everyone, I’m working on a new female character for my game and would love your feedback. I want to know if this design contains any stereotypical traits, over-sexualization, or costume issues that might limit how inclusive and authentic she feels.",
  comments:[
    {name:"Sakura Iziyani",badge:"• Top 10 Reviewer",avatar:"https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=256&auto=format&fit=crop",text:"Overall, she looks strong and confident, but the costume feels skimpy. Maybe balance it with functional elements."},
    {name:"Kenko Iguan",badge:"• Reviewer",avatar:"https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop",text:"Function matters. Add a detail that hints at her background."}
  ]
}]

const h=t=>{const d=document.createElement('div');d.innerHTML=t.trim();return d.firstChild}

const renderPost=p=>h(`
  <article class="card" data-id="${p.id}">
    <div class="post-head">
      <div class="avatar"><img src="${p.avatar}"></div>
      <div class="author"><b>${p.author}</b><span>${p.role}</span></div>
    </div>
    <div class="card-body">
      <a class="hero" href="#"><img src="${p.hero}"></a>
      <h2 class="post-title">${p.title}</h2>
      <p class="post-meta">${p.text}</p>
      <div class="actions">
        <button class="chip reviews">Reviews</button>
        <button class="chip alt create-board">Create Board</button>
      </div>
      <div class="comments" data-collapsed="0">
        ${p.comments.map(c=>`
          <div class="comment">
            <div class="avatar"><img src="${c.avatar}"></div>
            <div class="bubble">
              <div class="row"><span class="name">${c.name}</span><span class="badge-text">${c.badge}</span></div>
              <p>${c.text}</p>
            </div>
          </div>
        `).join('')}
        <form class="comment-form">
          <input type="text" name="commentText" placeholder="Add a comment" required>
          <button type="submit">Post</button>
        </form>
      </div>
    </div>
  </article>
`)

const renderAll=()=>{feed.innerHTML='';posts.forEach(p=>feed.appendChild(renderPost(p)))}
renderAll()

feed.addEventListener('click',e=>{
  const card=e.target.closest('.card')
  if(!card) return
  if(e.target.classList.contains('create-board')){
    const img=card.querySelector('.hero img')
    if(img){boardImage.src=img.src;boardModal.classList.add('show');pinLayer.innerHTML=''}
  }
  if(e.target.classList.contains('reviews')){
    const section=card.querySelector('.comments')
    const collapsed=section.dataset.collapsed==='1'
    section.dataset.collapsed=collapsed?'0':'1'
    section.style.display=collapsed?'':'none'
  }
})

feed.addEventListener('submit',e=>{
  if(!e.target.classList.contains('comment-form')) return
  e.preventDefault()
  const card=e.target.closest('.card')
  const id=card.dataset.id
  const input=e.target.querySelector('input[name="commentText"]')
  const val=input.value.trim()
  if(!val) return
  const p=posts.find(x=>x.id===id)
  p.comments.push({name:"You",badge:"• Member",avatar:"https://images.unsplash.com/photo-1531123414780-f742f46f1d1f?q=80&w=256&auto=format&fit=crop",text:val})
  renderAll()
})

const postModal=document.getElementById('postModal')
const postBackdrop=document.getElementById('postBackdrop')
const closePostModal=document.getElementById('closePostModal')
const postForm=document.getElementById('postForm')
const addPostBtn=document.getElementById('addPost')

const openPostModal=()=>postModal.classList.add('show')
const closePost=()=>postModal.classList.remove('show')

addPostBtn.addEventListener('click',openPostModal)
postBackdrop.addEventListener('click',closePost)
closePostModal.addEventListener('click',closePost)
window.addEventListener('keydown',e=>{if(e.key==='Escape')closePost()})

postForm.addEventListener('submit',e=>{
  e.preventDefault()
  const data={
    id:crypto.randomUUID(),
    author:document.getElementById('pfAuthor').value.trim(),
    role:document.getElementById('pfRole').value.trim(),
    avatar:document.getElementById('pfAvatar').value.trim(),
    hero:document.getElementById('pfHero').value.trim(),
    title:document.getElementById('pfTitle').value.trim(),
    text:document.getElementById('pfText').value.trim(),
    comments:[]
  }
  posts.unshift(data)
  renderAll()
  postForm.reset()
  closePost()
})
let mode = 'pen'
const drawCanvas = document.getElementById('drawCanvas')
const dctx = drawCanvas.getContext('2d')
const toolPins = document.getElementById('toolPins')
const toolPen = document.getElementById('toolPen')
const toolErase = document.getElementById('toolErase')
const strokeColor = document.getElementById('strokeColor')
const strokeSize = document.getElementById('strokeSize')
const clearDraw = document.getElementById('clearDraw')

const setActiveTool = b => {
  ;[toolPins, toolPen, toolErase].forEach(x => x.removeAttribute('data-active'))
  b.setAttribute('data-active', '1')
}

toolPins.onclick = () => {
  mode = 'pins'
  setActiveTool(toolPins)
  drawCanvas.style.pointerEvents = 'none'
  pinLayer.style.pointerEvents = 'auto'
}

toolPen.onclick = () => {
  mode = 'pen'
  setActiveTool(toolPen)
  drawCanvas.style.pointerEvents = 'auto'
  pinLayer.style.pointerEvents = 'none'
}

toolErase.onclick = () => {
  mode = 'erase'
  setActiveTool(toolErase)
  drawCanvas.style.pointerEvents = 'auto'
  pinLayer.style.pointerEvents = 'none'
}

const fitCanvas = () => {
  drawCanvas.width = boardImage.clientWidth
  drawCanvas.height = boardImage.clientHeight
  drawCanvas.style.width = boardImage.clientWidth + 'px'
  drawCanvas.style.height = boardImage.clientHeight + 'px'
}

const openBoard = src => {
  boardImage.onload = () => {
    fitCanvas()
    dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height)
  }
  boardImage.src = src
  boardModal.classList.add('show')
  pinLayer.innerHTML = ''
  pinCount = 0
  mode = 'pen'
  setActiveTool(toolPen)
  drawCanvas.style.pointerEvents = 'auto'
  pinLayer.style.pointerEvents = 'none'
}

document.querySelectorAll('.chip.alt').forEach(btn => {
  btn.addEventListener('click', e => {
    const card = e.currentTarget.closest('.card')
    const img = card.querySelector('.hero img')
    if (img) openBoard(img.src)
  })
})

window.addEventListener('resize', () => {
  if (boardModal.classList.contains('show')) fitCanvas()
})

let drawing = false
let lastX = 0,
  lastY = 0

const getLocal = evt => {
  const r = drawCanvas.getBoundingClientRect()
  return { x: evt.clientX - r.left, y: evt.clientY - r.top }
}

drawCanvas.addEventListener('pointerdown', e => {
  if (mode === 'pins') return
  drawing = true
  dctx.lineCap = 'round'
  dctx.lineJoin = 'round'
  dctx.lineWidth = parseFloat(strokeSize.value)
  dctx.strokeStyle = mode === 'pen' ? strokeColor.value : 'rgba(0,0,0,1)'
  dctx.globalCompositeOperation = mode === 'pen' ? 'source-over' : 'destination-out'
  const p = getLocal(e)
  lastX = p.x
  lastY = p.y
})

drawCanvas.addEventListener('pointermove', e => {
  if (!drawing) return
  const p = getLocal(e)
  dctx.beginPath()
  dctx.moveTo(lastX, lastY)
  dctx.lineTo(p.x, p.y)
  dctx.stroke()
  lastX = p.x
  lastY = p.y
})

drawCanvas.addEventListener('pointerup', () => (drawing = false))
drawCanvas.addEventListener('pointercancel', () => (drawing = false))
clearDraw.onclick = () => dctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height)

/* Pins */
pinLayer.addEventListener('click', e => {
  if (mode !== 'pins') return
  if (e.target !== pinLayer) return
  const rect = pinLayer.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const text = prompt('Add note')
  if (!text) return
  pinCount++
  const pin = document.createElement('div')
  pin.className = 'pin'
  pin.style.left = x * 100 + '%'
  pin.style.top = y * 100 + '%'
  pin.innerHTML = `<span>${pinCount}</span><div class="label">${text}</div>`
  pin.addEventListener('mousedown', ev => {
    dragPin = pin
    dragOffset = [ev.offsetX, ev.offsetY]
  })
  pin.addEventListener('click', ev => {
    if (ev.detail === 1) pin.classList.toggle('show')
  })
  pin.addEventListener('contextmenu', ev => {
    ev.preventDefault()
    if (confirm('Delete this pin?')) pin.remove()
  })
  pinLayer.appendChild(pin)
})


