const sidebar=document.getElementById('sidebar')
const overlay=document.getElementById('overlay')
const openBtn=document.getElementById('openSidebar')
const closeSidebar=()=>{sidebar.classList.remove('open');overlay.classList.remove('show')}
const openSidebarFn=()=>{sidebar.classList.add('open');overlay.classList.add('show')}
if(openBtn){openBtn.addEventListener('click',openSidebarFn);overlay.addEventListener('click',closeSidebar);window.addEventListener('keydown',e=>{if(e.key==='Escape')closeSidebar()})}

/* ---------- BOARD (Annotation) ---------- */
const boardModal=document.getElementById('boardModal')
const boardBackdrop=document.getElementById('boardBackdrop')
const closeBoard=document.getElementById('closeBoard')
const boardImage=document.getElementById('boardImage')
const pinLayer=document.getElementById('pinLayer')
const clearPins=document.getElementById('clearPins')

/* NEW: drawing canvas + tools */
let mode='pen'
const drawCanvas=document.getElementById('drawCanvas')
const dctx=drawCanvas.getContext('2d')
const toolPins=document.getElementById('toolPins')
const toolPen=document.getElementById('toolPen')
const toolErase=document.getElementById('toolErase')
const strokeColor=document.getElementById('strokeColor')
const strokeSize=document.getElementById('strokeSize')
const clearDraw=document.getElementById('clearDraw')

let pinCount=0
let dragPin=null
let dragOffset=[0,0]

const closeBoardFn=()=>boardModal.classList.remove('show')
closeBoard.addEventListener('click',closeBoardFn)
boardBackdrop.addEventListener('click',closeBoardFn)
window.addEventListener('keydown',e=>{ if(e.key==='Escape') closeBoardFn() })

/* Helpers */
const setActiveTool=b=>{
  ;[toolPins,toolPen,toolErase].forEach(x=>x.removeAttribute('data-active'))
  b.setAttribute('data-active','1')
}
const fitCanvas=()=>{
  // Match canvas size to displayed image size
  drawCanvas.width=boardImage.clientWidth
  drawCanvas.height=boardImage.clientHeight
  drawCanvas.style.width=boardImage.clientWidth+'px'
  drawCanvas.style.height=boardImage.clientHeight+'px'
}
const openBoard=src=>{
  boardImage.onload=()=>{
    fitCanvas()
    dctx.clearRect(0,0,drawCanvas.width,drawCanvas.height)
  }
  boardImage.src=src
  boardModal.classList.add('show')
  pinLayer.innerHTML=''
  pinCount=0
  // default to Pen
  mode='pen'
  setActiveTool(toolPen)
  drawCanvas.style.pointerEvents='auto'
  pinLayer.style.pointerEvents='none'
}

/* Tool switching */
toolPins.onclick=()=>{mode='pins';setActiveTool(toolPins);drawCanvas.style.pointerEvents='none';pinLayer.style.pointerEvents='auto'}
toolPen.onclick =()=>{mode='pen'; setActiveTool(toolPen); drawCanvas.style.pointerEvents='auto'; pinLayer.style.pointerEvents='none'}
toolErase.onclick=()=>{mode='erase';setActiveTool(toolErase);drawCanvas.style.pointerEvents='auto';pinLayer.style.pointerEvents='none'}

window.addEventListener('resize',()=>{ if(boardModal.classList.contains('show')) fitCanvas() })

/* Drawing */
let drawing=false
let lastX=0,lastY=0
const getLocal=evt=>{const r=drawCanvas.getBoundingClientRect();return {x:evt.clientX-r.left,y:evt.clientY-r.top}}

drawCanvas.addEventListener('pointerdown',e=>{
  if(mode==='pins') return
  drawing=true
  dctx.lineCap='round'
  dctx.lineJoin='round'
  dctx.lineWidth=parseFloat(strokeSize.value)
  dctx.strokeStyle=mode==='pen'?strokeColor.value:'rgba(0,0,0,1)'
  dctx.globalCompositeOperation=mode==='pen'?'source-over':'destination-out'
  const p=getLocal(e); lastX=p.x; lastY=p.y
})
drawCanvas.addEventListener('pointermove',e=>{
  if(!drawing) return
  const p=getLocal(e)
  dctx.beginPath()
  dctx.moveTo(lastX,lastY)
  dctx.lineTo(p.x,p.y)
  dctx.stroke()
  lastX=p.x; lastY=p.y
})
drawCanvas.addEventListener('pointerup',()=>drawing=false)
drawCanvas.addEventListener('pointercancel',()=>drawing=false)
clearDraw.onclick=()=>dctx.clearRect(0,0,drawCanvas.width,drawCanvas.height)

/* Pins (only in Pins mode) */
const localPos=(evt)=>{
  const rect=pinLayer.getBoundingClientRect()
  const x=(evt.clientX-rect.left)/rect.width
  const y=(evt.clientY-rect.top)/rect.height
  return {x,y}
}
pinLayer.addEventListener('click',e=>{
  if(mode!=='pins') return
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

/* ---------- FEED & POSTS ---------- */
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

/* render adds a small 'Give Badge' button on each comment (except "You") */
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
              <div class="row">
                <span class="name">${c.name}</span>
                <span class="badge-text">${c.badge||''}</span>
                ${c.name!=='You' ? `<button class="badge-inline-btn give-badge-comment"
                    data-name="${c.name}"
                    data-avatar="${c.avatar}"
                    data-role="${(c.badge||'Reviewer').replace('•','').trim()}"
                    data-context="${p.id}">Give Badge</button>` : ``}
              </div>
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

/* Hook up Create Board + toggle reviews */
feed.addEventListener('click',e=>{
  const card=e.target.closest('.card')
  if(!card) return
  if(e.target.classList.contains('create-board')){
    const img=card.querySelector('.hero img')
    if(img){ openBoard(img.src) }
  }
  if(e.target.classList.contains('reviews')){
    const section=card.querySelector('.comments')
    const collapsed=section.dataset.collapsed==='1'
    section.dataset.collapsed=collapsed?'0':'1'
    section.style.display=collapsed?'':'none'
  }
})

/* Add comment */
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

/* ---------- BADGE SYSTEM (unchanged) ---------- */
const BADGE_KEY='fv_badges_v1'
const REVIEWERS_KEY='fv_reviewers_v1'
const badgeCatalog={
  insightful:{label:'Insightful',cls:'badge--insightful'},
  inclusive:{label:'Inclusive',cls:'badge--inclusive'},
  constructive:{label:'Constructive',cls:'badge--constructive'},
  fast:{label:'Fast Responder',cls:'badge--fast'},
  mentor:{label:'Kind Mentor',cls:'badge--mentor'}
}

const reviewersList=document.getElementById('reviewersList')
const leaderboardRowTemplate=document.getElementById('leaderboardRowTemplate')
const badgeChipTemplate=document.getElementById('badgeChipTemplate')
const badgeHistoryItemTemplate=document.getElementById('badgeHistoryItemTemplate')
const badgeModal=document.getElementById('badgeModal')
const badgeBackdrop=document.getElementById('badgeBackdrop')
const closeBadgeModal=document.getElementById('closeBadgeModal')
const badgeForm=document.getElementById('badgeForm')
const badgeRecipient=document.getElementById('badgeRecipient')
const badgeContext=document.getElementById('badgeContext')
const badgeNote=document.getElementById('badgeNote')
const badgeDetailsModal=document.getElementById('badgeDetailsModal')
const badgeDetailsBackdrop=document.getElementById('badgeDetailsBackdrop')
const closeBadgeDetails=document.getElementById('closeBadgeDetails')
const badgeSummary=document.getElementById('badgeSummary')
const badgeHistory=document.getElementById('badgeHistory')
const viewAllBadges=document.getElementById('viewAllBadges')

const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v??d}catch{return d}}
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v))

let reviewers=load(REVIEWERS_KEY,null)
if(!reviewers){
  reviewers=[
    {id:crypto.randomUUID(),name:'Sakura Iziyani',role:'Top 10 Reviewer',avatar:'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=256&auto=format&fit=crop',tally:{insightful:0,inclusive:0,constructive:0,fast:0,mentor:0}},
    {id:crypto.randomUUID(),name:'Kenko Iguan',role:'Reviewer',avatar:'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=256&auto=format&fit=crop',tally:{insightful:0,inclusive:0,constructive:0,fast:0,mentor:0}}
  ]
  save(REVIEWERS_KEY,reviewers)
}
let badges=load(BADGE_KEY,[])

const findReviewerById=id=>reviewers.find(r=>r.id===id)
const findReviewerByName=name=>reviewers.find(r=>r.name.toLowerCase()===name.toLowerCase())
const ensureReviewer=({name,avatar,role})=>{
  let r=findReviewerByName(name)
  if(r) return r
  r={id:crypto.randomUUID(),name,role:role||'Reviewer',avatar:avatar||'',tally:{insightful:0,inclusive:0,constructive:0,fast:0,mentor:0}}
  reviewers.push(r); save(REVIEWERS_KEY,reviewers); renderLeaderboard()
  return r
}

/* Render leaderboard with 3 buttons only */
const renderLeaderboard=()=>{
  reviewersList.innerHTML=''
  const sorted=[...reviewers].sort((a,b)=>{
    const sa=Object.values(a.tally).reduce((s,n)=>s+n,0)
    const sb=Object.values(b.tally).reduce((s,n)=>s+n,0)
    return sb-sa
  })
  sorted.forEach(r=>{
    const node=leaderboardRowTemplate.content.firstElementChild.cloneNode(true)
    node.dataset.reviewerId=r.id
    node.querySelector('.avatar').src=r.avatar
    node.querySelector('.name').textContent=r.name
    node.querySelector('.role').textContent=r.role
    reviewersList.appendChild(node)
  })
}
renderLeaderboard()

const openModal=(el)=>el.classList.add('show')
const closeModal=(el)=>el.classList.remove('show')

reviewersList?.addEventListener('click', e => {
  const row = e.target.closest('.reviewer-row');
  if (!row) return;
  const id = row.dataset.reviewerId;

  // Give badge modal
  if (e.target.matches('[data-action="open-badge"], .btn--give-badge')) {
    const r = findReviewerById(id);
    badgeModal.dataset.reviewerId = id;
    badgeRecipient.value = r.name;
    badgeContext.value = '';
    badgeForm.reset();
    openModal(badgeModal);
  }

  // View badges modal
  else if (e.target.matches('[data-action="view-badges"], .btn--view-badges')) {
    showBadgeDetails(id);
  }

  // Open reviewer profile
  else if (e.target.matches('[data-action="profile"], .btn--profile')) {
    window.location.href = `profile.html?id=${encodeURIComponent(id)}`;
  }
})

/* Give badge from a comment */
feed.addEventListener('click',e=>{
  const btn=e.target.closest('.give-badge-comment')
  if(!btn) return
  const name=btn.dataset.name
  const avatar=btn.dataset.avatar
  const role=btn.dataset.role
  const context=btn.dataset.context
  const r=ensureReviewer({name,avatar,role})
  badgeModal.dataset.reviewerId=r.id
  badgeRecipient.value=r.name
  badgeContext.value=context||''
  badgeForm.reset()
  openModal(badgeModal)
})

closeBadgeModal.addEventListener('click',()=>closeModal(badgeModal))
badgeBackdrop.addEventListener('click',()=>closeModal(badgeModal))
window.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(badgeModal) })

badgeForm.addEventListener('submit',e=>{
  e.preventDefault()
  const reviewerId=badgeModal.dataset.reviewerId
  const fd=new FormData(badgeForm)
  const type=fd.get('badgeType')
  const note=(badgeNote?.value||'').trim()
  const entry={id:crypto.randomUUID(),reviewerId,type,note,when:new Date().toISOString(),context:badgeContext.value||''}
  badges.push(entry)
  const r=findReviewerById(reviewerId)
  r.tally[type]=(r.tally[type]||0)+1
  save(BADGE_KEY,badges)
  save(REVIEWERS_KEY,reviewers)
  renderLeaderboard()
  closeModal(badgeModal)
})

/* Badge details modal */
const showBadgeDetails=(reviewerId)=>{
  const r=findReviewerById(reviewerId)
  const catalogOrder=['insightful','inclusive','constructive','fast','mentor']
  badgeSummary.innerHTML=''
  catalogOrder.forEach(key=>{
    const chip=badgeChipTemplate.content.firstElementChild.cloneNode(true)
    chip.classList.add(badgeCatalog[key].cls)
    chip.textContent=`${badgeCatalog[key].label}: ${r.tally[key]||0}`
    badgeSummary.appendChild(chip)
  })
  badgeHistory.innerHTML=''
  badges
    .filter(b=>b.reviewerId===reviewerId)
    .sort((a,b)=>new Date(b.when)-new Date(a.when))
    .forEach(b=>{
      const node=badgeHistoryItemTemplate.content.firstElementChild.cloneNode(true)
      const chip=node.querySelector('.badge')
      chip.classList.add(badgeCatalog[b.type].cls)
      chip.textContent=badgeCatalog[b.type].label
      node.querySelector('.who').textContent=r.name
      node.querySelector('.why').textContent=b.note||'—'
      node.querySelector('.when').textContent=new Date(b.when).toLocaleString()
      const link=node.querySelector('.contextLink')
      if(b.context){ link.href=`#post-${b.context}`; link.style.display='' } else { link.style.display='none' }
      badgeHistory.appendChild(node)
    })
  openModal(badgeDetailsModal)
}
closeBadgeDetails.addEventListener('click',()=>closeModal(badgeDetailsModal))
badgeDetailsBackdrop.addEventListener('click',()=>closeModal(badgeDetailsModal))
window.addEventListener('keydown',e=>{ if(e.key==='Escape') closeModal(badgeDetailsModal) })

viewAllBadges?.addEventListener('click',()=>{
  if(reviewers.length>0){
    showBadgeDetails(reviewers[0].id)
  }
})
