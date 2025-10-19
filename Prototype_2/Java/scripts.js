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
