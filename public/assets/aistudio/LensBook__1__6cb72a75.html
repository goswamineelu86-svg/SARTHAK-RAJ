<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>LensBook</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Instrument+Serif&display=swap">
<style>
:root{--a:#5b5bd6;--ad:#a5a5ff;--bg:#f7f6ff;--panel:#fff;--ink:#1d1f2b;--mute:#667085;--line:#e4e4ee;--acc:var(--a);--on:#fff;--soft:color-mix(in srgb,var(--acc) 10%,var(--panel));box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
:root[data-theme=sunset]{--a:#d9480f;--ad:#ff9466;--bg:#fff8f3}
:root[data-theme=forest]{--a:#2b8a5f;--ad:#62d1a0;--bg:#f3faf6}
:root[data-theme=ocean]{--a:#0b7285;--ad:#56c6d8;--bg:#f1fafb}
:root[data-mode=dark]{--bg:#0f1115;--panel:#181b21;--ink:#eceef3;--mute:#98a2b3;--line:#2a2f39;--acc:var(--ad);--on:#101114}
html{scroll-padding-top:env(safe-area-inset-top,0px);height:100%}*{box-sizing:border-box}
body{margin:0;height:100%;background:var(--bg);color:var(--ink);font:15px/1.55 'DM Sans',system-ui,sans-serif;display:flex;flex-direction:column}
.hide{display:none!important}.mute{color:var(--mute)}
header.top{display:flex;gap:10px;align-items:center;padding:10px 16px;border-bottom:1px solid var(--line);background:var(--panel)}
.logo{font:400 26px 'Instrument Serif',Georgia,serif;display:flex;align-items:center;gap:8px;color:var(--acc)}
#ttl{flex:1;min-width:0;font:inherit;font-weight:700;border:0;background:transparent;color:var(--ink);padding:6px 10px;border-radius:10px}#ttl:hover,#ttl:focus{background:var(--soft);outline:0}
.btn{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:8px 14px;font:700 14px 'DM Sans',sans-serif;cursor:pointer;min-height:38px}
.btn:hover{border-color:var(--acc)}.btn.pri{background:var(--acc);color:var(--on);border-color:var(--acc)}.btn:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--acc);outline-offset:2px}.btn:disabled{opacity:.5;cursor:default}
main{flex:1;min-height:0;display:grid;grid-template-columns:290px minmax(0,1fr) 370px;gap:12px;padding:12px}
.pn{background:var(--panel);border:1px solid var(--line);border-radius:20px;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.pn>h2{margin:0;padding:14px 16px 8px;font:400 24px 'Instrument Serif',serif;display:flex;justify-content:space-between;align-items:center}
.sc{flex:1;overflow:auto;padding:4px 14px 14px}
.si{display:flex;gap:10px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:14px;margin-bottom:8px}
.si .t{flex:1;min-width:0;cursor:pointer}.si .t b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.si small{color:var(--mute)}.si input{accent-color:var(--acc);width:18px;height:18px}
.af{border:1px dashed var(--acc);border-radius:14px;padding:12px;margin:10px 0}
.af input[type=text],.af textarea,.cp input{width:100%;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font:inherit;background:var(--bg);color:var(--ink);margin-bottom:8px}
.af textarea{min-height:130px;resize:vertical}.row{display:flex;gap:8px;flex-wrap:wrap}
.msgs{flex:1;overflow:auto;padding:8px 18px;display:flex;flex-direction:column;gap:12px}
.m{max-width:88%;padding:10px 14px;border-radius:18px}.m.u{align-self:flex-end;background:var(--acc);color:var(--on);border-bottom-right-radius:4px}
.m.a{background:var(--soft);border-bottom-left-radius:4px}.m.err{border:1px solid #d64545}
.m p{margin:0 0 8px}.m ul,.m ol{margin:0 0 8px;padding-left:20px}.m h4{margin:8px 0 4px}.ma{margin-top:6px}
.cit{background:var(--acc);color:var(--on);border:0;border-radius:999px;padding:0 7px;font:700 11px 'DM Sans';cursor:pointer;margin:0 2px;vertical-align:super}
.guide{border:1px solid var(--line);border-radius:16px;padding:14px;background:linear-gradient(135deg,var(--soft),var(--panel))}.guide h3{margin:0 0 6px;font:400 20px 'Instrument Serif',serif}
.sgs{display:flex;flex-wrap:wrap;gap:8px;padding:6px 18px}.sgs .btn{font-weight:500;font-size:13px;min-height:34px;padding:5px 12px}
.cp{display:flex;gap:8px;padding:10px 14px 14px;border-top:1px solid var(--line)}.cp input{margin:0}
.empty{margin:auto;text-align:center;max-width:360px;padding:24px}.empty h3{font:400 28px 'Instrument Serif',serif;margin:6px 0}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tile{border:1px solid var(--line);border-radius:16px;padding:12px;background:var(--soft);text-align:left;cursor:pointer;color:var(--ink);font:700 14px 'DM Sans'}.tile:hover{border-color:var(--acc)}.tile span{display:block;font-size:22px}
.tile:disabled{opacity:.5;cursor:default}
.out{border:1px solid var(--line);border-radius:16px;margin:12px 0;overflow:hidden}
.out>header{display:flex;justify-content:space-between;align-items:center;padding:6px 8px 6px 14px;background:var(--soft);font-weight:700;gap:6px}.out>header .btn{min-height:30px;padding:3px 10px;font-size:12px}
.out .body{padding:6px 14px 12px;font-size:14px}.out .body p{margin:0 0 8px}.out .body ul,.out .body ol{padding-left:20px;margin:0 0 8px}.out h4{margin:10px 0 4px}
.mm .mc{text-align:center;font:400 22px 'Instrument Serif',serif;background:var(--acc);color:var(--on);border-radius:12px;padding:8px;margin-bottom:10px}.mg{display:grid;gap:8px}
.mb{border-left:6px solid var(--c);background:var(--soft);border-radius:8px;padding:8px 12px}.mb ul{margin:4px 0 0;padding-left:18px}
.al{padding:6px 10px;border-radius:12px;margin:6px 0}.al.A{background:var(--soft)}.al.B{background:color-mix(in srgb,var(--acc) 22%,var(--panel))}.al.on{outline:2px solid var(--acc)}
dialog{border:1px solid var(--line);border-radius:18px;background:var(--panel);color:var(--ink);max-width:640px;width:92%;padding:18px}dialog::backdrop{background:rgba(0,0,0,.45)}
#dtx{white-space:pre-wrap;max-height:55vh;overflow:auto;font-size:14px}
.toast{position:fixed;left:50%;bottom:76px;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 18px;border-radius:999px;font-weight:600;z-index:20}
.tabs{display:none}
@media(max-width:960px){main{grid-template-columns:1fr;padding:8px}.pn:not(.show){display:none}
 .tabs{display:flex;background:var(--panel);border-top:1px solid var(--line)}.tabs button{flex:1;border:0;background:none;color:var(--mute);padding:13px;font:700 14px 'DM Sans'}.tabs button.on{color:var(--acc);box-shadow:inset 0 3px 0 var(--acc)}}
body{background:radial-gradient(900px 500px at 8% -10%,color-mix(in srgb,var(--acc) 16%,transparent),transparent 70%),radial-gradient(800px 500px at 100% 0,color-mix(in srgb,var(--acc) 10%,transparent),transparent 70%),var(--bg)}
header.top{background:color-mix(in srgb,var(--panel) 82%,transparent);backdrop-filter:blur(10px);position:relative}
header.top::after{content:'';position:absolute;left:0;right:0;bottom:-1px;height:2px;background:linear-gradient(90deg,var(--acc),transparent 70%)}
.pn{box-shadow:0 12px 32px -14px color-mix(in srgb,var(--acc) 35%,transparent)}
.m{animation:rise .25s ease}@keyframes rise{from{opacity:0;transform:translateY(6px)}}
.tile{display:flex;align-items:center;gap:12px;border-radius:20px;background:var(--panel);padding:14px;min-height:58px;transition:transform .15s,box-shadow .15s}
.tile:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 20px -12px var(--ic);border-color:var(--ic)}
.tile svg{width:24px;height:24px;flex:none;color:var(--ic)}.tile .nw{display:inline-block;margin-left:auto;font-size:11px;background:var(--soft);border-radius:999px;padding:2px 8px;color:var(--mute)}
.sl{border-radius:16px;padding:18px;background:linear-gradient(135deg,var(--acc),color-mix(in srgb,var(--acc) 55%,#000));color:var(--on);min-height:200px}.sl h4{font:400 24px 'Instrument Serif',serif;margin:0 0 8px;color:inherit}.sl ul{margin:0;padding-left:20px}.sl li{margin:4px 0}
.nv{display:flex;gap:8px;align-items:center;justify-content:space-between;margin-top:10px;flex-wrap:wrap}
.fcd{border:2px solid var(--line);border-radius:16px;min-height:170px;padding:18px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;font-size:17px;cursor:pointer;background:var(--soft)}.fcd.bk{background:var(--panel);font-weight:500;font-size:15px;border-color:var(--acc)}
.qo{display:block;width:100%;text-align:left;margin:6px 0;border-radius:14px}.qo.ok{border-color:#2f9e44;background:color-mix(in srgb,#2f9e44 18%,var(--panel))}.qo.no{border-color:#d64545;background:color-mix(in srgb,#d64545 18%,var(--panel))}
.ig{border-radius:16px;overflow:hidden;border:1px solid var(--line)}.ig .hd{padding:16px;background:linear-gradient(135deg,var(--acc),color-mix(in srgb,var(--acc) 50%,#7048e8));color:var(--on)}.ig .hd h4{font:400 26px 'Instrument Serif',serif;margin:0;color:inherit}
.ig .st{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px;padding:12px}.ig .st div{background:var(--soft);border-radius:12px;padding:8px;text-align:center}.ig .st b{display:block;font:400 24px 'Instrument Serif',serif;color:var(--acc)}
.ig .sc2{display:grid;gap:8px;padding:0 12px 12px}.ig .sc2 div{display:flex;gap:10px;border:1px solid var(--line);border-radius:12px;padding:8px 10px;align-items:center}.ig .sc2 i{font-style:normal;font-size:24px;min-width:26px;text-align:center;color:var(--acc);font-weight:700}
.ig .fl{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 12px}.ig .fl span{background:var(--acc);color:var(--on);border-radius:999px;padding:3px 12px;font-size:12px;font-weight:700}
table.dt{width:100%;border-collapse:collapse;font-size:13px}table.dt th{background:var(--acc);color:var(--on);text-align:left;padding:7px 9px}table.dt td{padding:7px 9px;border-bottom:1px solid var(--line);vertical-align:top}.ov{overflow:auto}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
</style></head>
<body>
<header class="top">
 <div class="logo"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="3"/><path d="M16.5 16.5L23 23" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>LensBook</div>
 <input id="ttl" aria-label="Notebook title">
 <select id="thm" class="btn" aria-label="Theme"><option value="aurora">Aurora</option><option value="sunset">Sunset</option><option value="forest">Forest</option><option value="ocean">Ocean</option></select>
 <button class="btn" id="mode" aria-label="Toggle dark mode">Dark</button>
</header>
<main>
 <section class="pn" id="p1"><h2>Sources <span id="cnt" class="mute" style="font:500 14px 'DM Sans'"></span></h2><div class="sc">
  <button class="btn pri" id="addb" style="width:100%">+ Add source</button>
  <div class="af hide" id="af"><input type="text" id="st" placeholder="Source title" aria-label="Source title"><textarea id="sx" placeholder="Paste your chapter, notes or article here…" aria-label="Source text"></textarea>
   <div class="row"><button class="btn pri" id="sadd">Add</button><button class="btn" id="sup">Upload PDF or text</button><button class="btn" id="ssm">Sample</button><button class="btn" id="scn">Cancel</button></div><input type="file" id="sf" accept=".pdf,application/pdf,.txt,.md,.csv,text/plain" class="hide" aria-label="Upload text file"></div>
  <div id="sl" style="margin-top:12px"></div></div></section>
 <section class="pn" id="p2"><h2>Chat <button class="btn" id="gd">Notebook guide</button></h2><div class="msgs" id="ms"></div><div class="sgs" id="sg"></div>
  <div class="cp"><input id="q" aria-label="Ask about your sources" placeholder="Ask about your sources…"><button class="btn pri" id="go">Send</button></div></section>
 <section class="pn" id="p3"><h2>Studio</h2><div class="sc"><div class="tiles" id="tl"></div><div id="ot"></div></div></section>
</main>
<nav class="tabs"><button data-p="p1">Sources</button><button data-p="p2" class="on">Chat</button><button data-p="p3">Studio</button></nav>
<dialog id="dlg"><h3 id="dti" style="margin:0 0 8px;font:400 24px 'Instrument Serif',serif"></h3><div id="dtx"></div><div class="row" style="margin-top:12px"><button class="btn pri" id="dcl">Close</button></div></dialog>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
const $=s=>document.querySelector(s),esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const SAMPLE='Photosynthesis is the process by which green plants make food using sunlight. It takes place mainly in the chloroplasts, which contain a green pigment called chlorophyll. Chlorophyll absorbs light energy from the Sun and uses it to convert carbon dioxide and water into glucose. Oxygen is released as a by-product of photosynthesis through tiny pores called stomata. The roots absorb water from the soil, and the xylem carries this water up to the leaves. Carbon dioxide enters the leaf through the stomata from the air. The glucose produced is either used for energy or stored as starch in the plant. Photosynthesis is essential for life on Earth because it supplies oxygen and forms the base of every food chain.';
let NB={title:'Untitled notebook',theme:'aurora',mode:'',src:[],nx:1},MSG=[],OUT=[],G=null,busy=false,ai=null,play=false;
try{const j=JSON.parse(localStorage.getItem('lensbook')||'null');if(j&&j.src)NB=Object.assign(NB,j)}catch(e){}
const save=()=>{try{localStorage.setItem('lensbook',JSON.stringify(NB))}catch(e){}};
const toast=t=>{const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),2400)};
function theme(){const r=document.documentElement;r.dataset.theme=NB.theme;r.dataset.mode=NB.mode||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');$('#thm').value=NB.theme;$('#mode').textContent=r.dataset.mode==='dark'?'Light':'Dark'}
const inl=s=>s.replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\[S(\d+)\]/g,(m,n)=>`<button class="cit" data-act="cite" data-n="${n}" aria-label="Open source ${n}">${n}</button>`);
function md(t){let h='',m=null;const cl=()=>{if(m){h+=`</${m}>`;m=null}};
 esc(t).split('\n').forEach(l=>{let x;if(x=l.match(/^\s*[-*\u2022]\s+(.*)/)){if(m!=='ul'){cl();h+='<ul>';m='ul'}h+=`<li>${inl(x[1])}</li>`}
  else if(x=l.match(/^\s*\d+[.)]\s+(.*)/)){if(m!=='ol'){cl();h+='<ol>';m='ol'}h+=`<li>${inl(x[1])}</li>`}
  else if(x=l.match(/^#{1,4}\s*(.*)/)){cl();h+=`<h4>${inl(x[1])}</h4>`}else if(l.trim()){cl();h+=`<p>${inl(l)}</p>`}else cl()});cl();return h}
async function getAI(){if(ai)return ai;try{if(typeof claude!=='undefined')ai=await claude.use('sample')}catch(e){ai=null}return ai}
async function run(p,onText,json){const a=await getAI();if(!a)throw{code:'none'};return json?a.json(p,{cache:false}):a(p,{cache:false,onText})}
const errMsg=e=>e.code==='none'?'AI isn\u2019t available in this view. Open the page on claude.ai and allow access when asked.':e.code==='not_granted'?'Access was declined. Reload the page and allow Claude to answer when asked.':e.code==='rate_limited'?'Too many requests. Please wait a minute and try again.':(e.message||'Something went wrong. Please try again.');
function srcText(){let left=120000;return NB.src.filter(s=>s.on).map(s=>{const t=s.text.slice(0,Math.min(60000,left));left-=t.length;return`[S${s.n}] ${s.title}\n${t}`}).join('\n\n---\n\n')}
const BASE=(q)=>`You are a study assistant inside a notebook app. Use ONLY the sources below. Never invent facts. Cite each claim with its source tag like [S1] or [S1][S2]. Write clearly for a class 10 student, in the same language as the sources or question. If the text shows page markers like [p. 12], mention the page after the source tag, for example [S1] (p. 12).\n\nSOURCES:\n${srcText(q)}\n\n`;
const on=()=>NB.src.some(s=>s.on);
function renderSrc(){$('#cnt').textContent=NB.src.length?`${NB.src.filter(s=>s.on).length} of ${NB.src.length} selected`:'';
 $('#sl').innerHTML=NB.src.length?NB.src.map(s=>`<div class="si"><input type="checkbox" data-act="tog" data-n="${s.n}" ${s.on?'checked':''} aria-label="Use ${esc(s.title)}"><div class="t" data-act="view" data-n="${s.n}"><b>${esc(s.title)}</b><small>S${s.n} \u00b7 ${s.text.split(/\s+/).length} words</small></div><button class="btn" data-act="rm" data-n="${s.n}" aria-label="Remove source">\u2715</button></div>`).join(''):'<p class="mute">No sources yet. Paste text, upload a .txt file, or try the sample.</p>'}
function renderChat(){const ms=$('#ms');
 if(!NB.src.length&&!MSG.length){ms.innerHTML='<div class="empty"><div style="font-size:44px">\ud83d\udcda</div><h3>Add a source to begin</h3><p class="mute">Paste a chapter or upload a PDF or text file. Then ask questions, listen to an audio overview, or build a study guide.</p><button class="btn pri" data-act="open">+ Add source</button></div>'}
 else{ms.innerHTML=(G?`<div class="guide"><h3>Notebook guide</h3>${md(G.summary)}</div>`:'')+MSG.map((x,i)=>x.r==='u'?`<div class="m u">${esc(x.t)}</div>`:`<div class="m a${x.err?' err':''}">${x.t?md(x.t):'<span class="mute">Thinking\u2026</span>'}${!x.live&&x.t&&!x.err?`<div class="ma"><button class="btn" data-act="note" data-i="${i}" style="min-height:30px;padding:3px 10px;font-size:12px">Save to notes</button></div>`:''}</div>`).join('');ms.scrollTop=ms.scrollHeight}
 const q=G?G.questions:['Summarize these sources','What are the key terms?','Give me 5 practice questions'];
 $('#sg').innerHTML=NB.src.length?q.map((x,i)=>`<button class="btn" data-act="sq" data-q="${i}">${esc(x)}</button>`).join(''):''}
async function send(q){q=q.trim();if(!q||busy)return;if(!on()){toast('Add or select a source first');return}
 busy=true;MSG.push({r:'u',t:q});const m={r:'a',t:'',live:true};MSG.push(m);renderChat();$('#q').value='';
 const hist=MSG.slice(-9,-2).map(x=>(x.r==='u'?'Student: ':'Assistant: ')+x.t).join('\n');
 try{const r=await run(BASE(q+' '+(MSG.filter(x=>x.r==='u').slice(-2,-1)[0]||{t:''}).t)+`CONVERSATION SO FAR:\n${hist||'(none)'}\n\nQUESTION: ${q}\n\nAnswer using short paragraphs or bullet points. If the sources do not contain the answer, say so briefly.`,({text})=>{m.t=text;renderChat()});m.t=r.text}catch(e){m.t=errMsg(e);m.err=1}
 m.live=false;busy=false;renderChat()}
async function guide(){if(busy)return;if(!on()){toast('Add or select a source first');return}busy=true;$('#gd').textContent='Working\u2026';
 try{const j=await run(BASE()+'Return ONLY JSON: {"summary":"a 3-4 sentence summary with [S#] citations","questions":["3 short questions a student could ask about these sources"]}',null,1);G={summary:j.summary,questions:(j.questions||[]).slice(0,3)}}catch(e){toast(errMsg(e))}
 busy=false;$('#gd').textContent='Notebook guide';renderChat()}
const K={audio:['\ud83c\udfa7','Audio Overview'],brief:['\ud83d\udcc4','Briefing Doc'],study:['\ud83c\udf93','Study Guide'],faq:['\u2753','FAQ'],time:['\ud83d\udd52','Timeline'],mind:['\ud83e\udde0','Mind Map'],note:['\ud83d\udcdd','Saved note']};
const T={brief:'TASK: Write a Briefing Doc: a 2-sentence overview, then 6-8 key points as bullets with citations, then a "Terms to know" list.',study:'TASK: Write a Study Guide with three headed sections: "Short-answer questions" (6 questions each followed by its answer), "Essay prompts" (3), and "Glossary" (8 key terms with definitions). Add citations.',faq:'TASK: Write an FAQ of 8 questions students commonly ask about these sources, each with a concise answer and citations.',time:'TASK: Build a timeline or ordered sequence of the events or steps in the sources, as a numbered list with one short line each and citations.'};
const pal=['#e03131','#f08c00','#2f9e44','#1c7ed6','#7048e8','#d6336c'];
async function gen(k){if(busy)return;if(!on()){toast('Add or select a source first');return}busy=true;const o={k,html:'<p class="mute">Generating\u2026</p>',raw:''};OUT.unshift(o);renderOut();
 try{if(k==='audio'){const j=await run(BASE()+'TASK: Write a friendly two-host podcast script (hosts Alex and Sam) explaining the key ideas for a class 10 student. 12-16 lines, each under 40 words, accurate to the sources, no citations. Return ONLY JSON: {"lines":[{"host":"Alex","text":"..."}]}',null,1);o.lines=(j.lines||[]).filter(l=>l&&l.text);o.raw=o.lines.map(l=>l.host+': '+l.text).join('\n');o.html='aud'}
  else if(k==='mind'){const j=await run(BASE()+'TASK: Build a mind map. Return ONLY JSON: {"title":"central topic","branches":[{"name":"branch","points":["2-4 short points"]}]} with 4-6 branches.',null,1);o.raw=j.title+'\n'+(j.branches||[]).map(b=>b.name+': '+b.points.join('; ')).join('\n');
   o.html=`<div class="mm"><div class="mc">${esc(j.title||'Mind map')}</div><div class="mg">${(j.branches||[]).map((b,i)=>`<div class="mb" style="--c:${pal[i%6]}"><b>${esc(b.name)}</b><ul>${(b.points||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`).join('')}</div></div>`}
  else{const r=await run(BASE()+T[k],({text})=>{o.html=md(text);renderOut()});o.raw=r.text;o.html=md(r.text)}}catch(e){o.html=`<p style="color:#d64545">${esc(errMsg(e))}</p>`}
 busy=false;renderOut()}
function renderOut(){$('#ot').innerHTML=OUT.map((o,i)=>`<article class="out"><header><span>${K[o.k][0]} ${K[o.k][1]}</span><span>${o.k==='audio'&&o.lines?`<button class="btn" data-act="play" data-i="${i}">Play</button><button class="btn" data-act="stop">Stop</button>`:''}<button class="btn" data-act="copy" data-i="${i}">Copy</button><button class="btn" data-act="del" data-i="${i}" aria-label="Delete">\u2715</button></span></header><div class="body">${o.html==='aud'?(o.lines||[]).map((l,j)=>`<div class="al ${/^sam/i.test(l.host)?'B':'A'}" data-j="${j}"><b>${esc(l.host)}:</b> ${esc(l.text)}</div>`).join(''):o.html}</div></article>`).join('')}
function speak(o){if(!('speechSynthesis' in window)){toast('Speech is not supported here');return}speechSynthesis.cancel();play=true;let j=0;const L=()=>[...document.querySelectorAll('.al')];
 const nx=()=>{document.querySelectorAll('.al.on').forEach(x=>x.classList.remove('on'));if(!play||j>=o.lines.length)return;const l=o.lines[j],el=document.querySelector(`.out:first-child .al[data-j="${j}"]`)||null;j++;if(el){el.classList.add('on');el.scrollIntoView({block:'nearest'})}
  const u=new SpeechSynthesisUtterance(l.text);u.lang=/[\u0900-\u097F]/.test(l.text)?'hi-IN':'en-IN';u.pitch=/^sam/i.test(l.host)?1.25:.9;u.rate=.98;u.onend=nx;u.onerror=nx;speechSynthesis.speak(u)};nx()}
function showSrc(n){const s=NB.src.find(x=>x.n==n);if(!s)return;$('#dti').textContent=`S${s.n}: ${s.title}`;$('#dtx').textContent=s.text;$('#dlg').showModal()}
Object.assign(K,{slides:['🖼️','Slide Deck'],video:['🎬','Video Overview'],flash:['🗂️','Flashcards'],quiz:['❓','Quiz'],info:['📊','Infographic'],table:['📋','Data Table']});
const JP={
 audio:`TASK: Write a friendly two-host podcast script (hosts Alex and Sam) explaining the key ideas for a class 10 student. 12-16 lines, each under 40 words, accurate to the sources, no citations. Return ONLY JSON: {"lines":[{"host":"Alex","text":"..."}]}`,
 mind:`TASK: Build a mind map. Return ONLY JSON: {"title":"central topic","branches":[{"name":"branch","points":["2-4 short points"]}]} with 4-6 branches.`,
 slides:`TASK: Create a slide deck of 6-8 slides. Return ONLY JSON: {"slides":[{"title":"","bullets":["2-4 short bullets"],"narration":"2 sentences a narrator would say"}]}`,
 flash:`TASK: Create 10 flashcards. Return ONLY JSON: {"cards":[{"front":"term or question","back":"short answer"}]}`,
 quiz:`TASK: Create a 6-question multiple-choice quiz. Return ONLY JSON: {"questions":[{"q":"","options":["A","B","C","D"],"answer":0,"why":"one-sentence explanation"}]} where answer is the index (0-3) of the correct option.`,
 info:`TASK: Design an infographic. Return ONLY JSON: {"title":"","tagline":"","stats":[{"value":"short number or word","label":""}],"sections":[{"icon":"one emoji","heading":"","text":"one sentence"}],"steps":["ordered short steps if the topic is a process, otherwise an empty list"],"terms":["6 key terms"]} with 3 stats and 4-5 sections.`,
 table:`TASK: Build a data table comparing the key items in the sources. Return ONLY JSON: {"title":"","columns":["3-5 column names"],"rows":[["cells"]]} with 5-8 rows.`};
JP.video=JP.slides;
const IP={audio:'M5 10v4M9 6v12M13 9v6M17 4v16',slides:'M3 5h18v14H3zM10 5v14',video:'M3 7h12v10H3zM15 11l6-3v8l-6-3',mind:'M3 12h5M8 12l6-6h6M8 12l6 6h6',report:'M6 3h9l4 4v14H6zM9 12h7M9 16h7',flash:'M8 7h12v13H8zM4 4h12',quiz:'M3 4h18v16H3zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .8-1 1.7M12 17v.01',info:'M5 20V10M11 20V4M17 20v-7',table:'M3 5h18v14H3zM3 10h18M3 15h18M9 5v14'};
function tiles(){const L=[['audio','Audio Overview','#4263eb'],['slides','Slide Deck','#c2255c'],['video','Video Overview','#12b886'],['mind','Mind Map','#7048e8'],['report','Reports','#a61e4d',1],['flash','Flashcards','#f08c00'],['quiz','Quiz','#1098ad'],['info','Infographic','#fd7e14'],['table','Data Table','#4263eb']];
 $('#tl').innerHTML=L.map(x=>`<button class='tile' style='--ic:${x[2]}' data-act='gen' data-k='${x[0]}'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'><path d='${IP[x[0]]}'/></svg>${x[1]}${x[3]?"<span class='nw'>New!</span>":''}</button>`).join('')+`<div class='row' style='grid-column:1/-1;align-items:center'><span class='mute' style='font-size:13px'>Report types:</span>${[['brief','Briefing'],['study','Study guide'],['faq','FAQ'],['time','Timeline']].map(x=>`<button class='btn' style='min-height:30px;padding:3px 10px;font-size:12px' data-act='gen' data-k='${x[0]}'>${x[1]}</button>`).join('')}</div>`}
function fin(o){const d=o.d,k=o.k;
 if(k==='audio'){o.lines=(d.lines||[]).filter(l=>l&&l.text);o.raw=o.lines.map(l=>l.host+': '+l.text).join('\n')}
 else if(k==='mind')o.raw=d.title+'\n'+(d.branches||[]).map(b=>b.name+': '+(b.points||[]).join('; ')).join('\n');
 else if(k==='slides'||k==='video')o.raw=(d.slides||[]).map((s,i)=>`${i+1}. ${s.title}\n`+(s.bullets||[]).map(b=>'- '+b).join('\n')).join('\n\n');
 else if(k==='flash')o.raw=(d.cards||[]).map(c=>c.front+' => '+c.back).join('\n');
 else if(k==='quiz')o.raw=(d.questions||[]).map((q,i)=>`${i+1}. ${q.q}\n`+q.options.map((x,j)=>`   ${'ABCD'[j]}. ${x}`).join('\n')).join('\n');
 else if(k==='info')o.raw=d.title+'\n'+(d.sections||[]).map(s=>s.heading+': '+s.text).join('\n');
 else if(k==='table')o.raw=[(d.columns||[]).join('\t'),...(d.rows||[]).map(r=>r.join('\t'))].join('\n');
 if(((k==='slides'||k==='video')&&!(d.slides||[]).length)||(k==='flash'&&!(d.cards||[]).length)||(k==='quiz'&&!(d.questions||[]).length)||(k==='table'&&!(d.rows||[]).length))throw{message:'The AI reply was empty. Please try again.'}}
async function gen(k){if(busy)return;if(k==='report')k='brief';if(!on()){toast('Add or select a source first');return}busy=true;
 const o={k,html:"<p class='mute'>Generating…</p>",raw:'',i:0,f:0,qi:0,sc:0,pk:-1};OUT.unshift(o);renderOut();
 try{if(JP[k]){o.d=await run(BASE()+JP[k],null,1);fin(o)}else{const r=await run(BASE()+T[k],({text})=>{o.html=md(text);renderOut()});o.raw=r.text;o.html=md(r.text)}}
 catch(e){o.d=null;o.err=1;o.html=`<p style='color:#d64545'>${esc(errMsg(e))}</p>`}
 busy=false;renderOut();if(k==='video'&&o.d)vplay(o)}
function body(o,i){if(!o.d)return o.html;const d=o.d,k=o.k;
 if(k==='audio')return(o.lines||[]).map((l,j)=>`<div class='al ${/^sam/i.test(l.host)?'B':'A'}' data-j='${j}'><b>${esc(l.host)}:</b> ${esc(l.text)}</div>`).join('');
 if(k==='mind')return`<div class='mm'><div class='mc'>${esc(d.title||'Mind map')}</div><div class='mg'>${(d.branches||[]).map((b,j)=>`<div class='mb' style='--c:${pal[j%6]}'><b>${esc(b.name)}</b><ul>${(b.points||[]).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`).join('')}</div></div>`;
 if(k==='slides'||k==='video'){const s=d.slides[o.i]||{title:'',bullets:[]};return`<div class='sl'><h4>${esc(s.title)}</h4><ul>${(s.bullets||[]).map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div><div class='nv'><button class='btn' data-x='nav' data-d='-1' data-i='${i}'>Prev</button><span class='mute'>${o.i+1} / ${d.slides.length}</span>${k==='video'?`<button class='btn pri' data-x='vp' data-i='${i}'>Play narration</button>`:''}<button class='btn' data-x='nav' data-d='1' data-i='${i}'>Next</button></div>`}
 if(k==='flash'){const c=d.cards[o.i];return`<div class='fcd${o.f?' bk':''}' data-x='ff' data-i='${i}' role='button' tabindex='0' aria-label='Flip card'>${esc(o.f?c.back:c.front)}</div><div class='nv'><button class='btn' data-x='nav' data-d='-1' data-i='${i}'>Prev</button><span class='mute'>${o.i+1} / ${d.cards.length}</span><button class='btn' data-x='nav' data-d='1' data-i='${i}'>Next</button></div>`}
 if(k==='quiz'){const Q=d.questions;if(o.qi>=Q.length)return`<h4>Score: ${o.sc} / ${Q.length}</h4><p>${o.sc/Q.length>=.8?'Excellent work!':'Review the sources and try again.'}</p><button class='btn pri' data-x='qr' data-i='${i}'>Retry</button>`;
  const q=Q[o.qi],a=+q.answer;return`<p><b>${o.qi+1}. ${esc(q.q)}</b></p>${q.options.map((x,j)=>`<button class='btn qo${o.pk>=0?(j===a?' ok':j===o.pk?' no':''):''}' data-x='qa' data-i='${i}' data-k='${j}'>${'ABCD'[j]}. ${esc(x)}</button>`).join('')}${o.pk>=0?`<p class='mute'>${esc(q.why||'')}</p><button class='btn pri' data-x='qn' data-i='${i}'>${o.qi+1<Q.length?'Next':'See score'}</button>`:''}`}
 if(k==='info')return`<div class='ig'><div class='hd'><h4>${esc(d.title||'')}</h4><div>${esc(d.tagline||'')}</div></div><div class='st'>${(d.stats||[]).map(s=>`<div><b>${esc(s.value)}</b><small>${esc(s.label)}</small></div>`).join('')}</div><div class='sc2'>${(d.sections||[]).map(s=>`<div><i>${esc(s.icon||'✨')}</i><span><b>${esc(s.heading)}</b><br>${esc(s.text)}</span></div>`).join('')}</div>${(d.steps||[]).length?`<div class='sc2'>${d.steps.map((s,j)=>`<div><i>${j+1}</i><span>${esc(s)}</span></div>`).join('')}</div>`:''}<div class='fl'>${(d.terms||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div>`;
 if(k==='table')return`<div class='ov'><b>${esc(d.title||'')}</b><table class='dt'><thead><tr>${(d.columns||[]).map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${(d.rows||[]).map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 return o.html}
function renderOut(){$('#ot').innerHTML=OUT.map((o,i)=>`<article class='out'><header><span>${K[o.k][0]} ${K[o.k][1]}</span><span>${o.k==='audio'&&o.d?`<button class='btn' data-act='play' data-i='${i}'>Play</button>`:''}${(o.k==='audio'||o.k==='video')&&o.d?"<button class='btn' data-act='stop'>Stop</button>":''}<button class='btn' data-act='copy' data-i='${i}'>Copy</button><button class='btn' data-act='del' data-i='${i}' aria-label='Delete'>✕</button></span></header><div class='body'>${body(o,i)}</div></article>`).join('')}
function vplay(o){if(!('speechSynthesis' in window)){toast('Speech is not supported here');return}speechSynthesis.cancel();play=true;o.i=0;const s=o.d.slides;
 const nx=()=>{if(!play||o.i>=s.length)return;renderOut();const u=new SpeechSynthesisUtterance(s[o.i].narration||s[o.i].title);u.rate=.97;u.onend=()=>{if(o.i<s.length-1){o.i++;nx()}else renderOut()};u.onerror=u.onend;speechSynthesis.speak(u)};nx()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-x]');if(!t)return;const o=OUT[+t.dataset.i],x=t.dataset.x;if(!o||!o.d)return;
 if(x==='nav'){const n=o.k==='flash'?o.d.cards.length:o.d.slides.length;o.i=Math.max(0,Math.min(n-1,o.i+ +t.dataset.d));o.f=0;renderOut()}
 else if(x==='ff'){o.f=o.f?0:1;renderOut()}
 else if(x==='qa'){if(o.pk>=0)return;o.pk=+t.dataset.k;if(o.pk===+o.d.questions[o.qi].answer)o.sc++;renderOut()}
 else if(x==='qn'){o.qi++;o.pk=-1;renderOut()}else if(x==='qr'){o.qi=0;o.sc=0;o.pk=-1;renderOut()}
 else if(x==='vp')vplay(o)});
document.addEventListener('keydown',e=>{if(e.target.dataset&&e.target.dataset.x==='ff'&&(e.key==='Enter'||e.key===' ')){e.preventDefault();e.target.click()}});
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act,n=+t.dataset.n,i=+t.dataset.i;
 if(a==='tog'){const s=NB.src.find(x=>x.n===n);s.on=t.checked;save();renderSrc()}
 else if(a==='view'||a==='cite')showSrc(n);
 else if(a==='rm'){NB.src=NB.src.filter(x=>x.n!==n);save();renderSrc();renderChat()}
 else if(a==='open'){$('#af').classList.remove('hide');pane('p1');$('#st').focus()}
 else if(a==='sq')send(G?G.questions[+t.dataset.q]:['Summarize these sources','What are the key terms of these sources?','Give me 5 practice questions with answers from these sources.'][+t.dataset.q]);
 else if(a==='note'){OUT.unshift({k:'note',html:md(MSG[i].t),raw:MSG[i].t});renderOut();toast('Saved to Studio notes')}
 else if(a==='play')speak(OUT[i]);
 else if(a==='stop'){play=false;if('speechSynthesis' in window)speechSynthesis.cancel();document.querySelectorAll('.al.on').forEach(x=>x.classList.remove('on'))}
 else if(a==='copy'){const r=OUT[i].raw||'';try{navigator.clipboard.writeText(r).then(()=>toast('Copied'),()=>toast('Copy not allowed here'))}catch(x){toast('Copy not allowed here')}}
 else if(a==='del'){OUT.splice(i,1);renderOut()}
 else if(a==='gen')gen(t.dataset.k)});
function pane(id){document.querySelectorAll('.pn').forEach(p=>p.classList.toggle('show',p.id===id));document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.p===id))}
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>pane(b.dataset.p));
$('#tl').innerHTML=['audio','brief','study','faq','time','mind'].map(k=>`<button class="tile" data-act="gen" data-k="${k}"><span>${K[k][0]}</span>${K[k][1]}</button>`).join('');
$('#addb').onclick=()=>$('#af').classList.toggle('hide');$('#scn').onclick=()=>$('#af').classList.add('hide');
$('#ssm').onclick=()=>{$('#st').value='Photosynthesis chapter';$('#sx').value=SAMPLE};$('#sup').onclick=()=>$('#sf').click();
$('#sf').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#sx').value=r.result;if(!$('#st').value)$('#st').value=f.name.replace(/\.\w+$/,'')};r.readAsText(f)};
$('#sadd').onclick=()=>{const t=$('#st').value.trim(),x=$('#sx').value.trim();if(x.length<40){toast('Paste at least a few sentences.');return}if(NB.src.length>=8){toast('Up to 8 sources.');return}
 NB.src.push({n:NB.nx++,title:t||x.slice(0,30)+'\u2026',text:x,on:true});save();$('#st').value=$('#sx').value='';$('#af').classList.add('hide');renderSrc();renderChat();pane('p2')};
$('#go').onclick=()=>send($('#q').value);$('#q').onkeydown=e=>{if(e.key==='Enter')send($('#q').value)};$('#gd').onclick=guide;
$('#dcl').onclick=()=>$('#dlg').close();
$('#ttl').value=NB.title;$('#ttl').onchange=e=>{NB.title=e.target.value||'Untitled notebook';save()};
$('#thm').onchange=e=>{NB.theme=e.target.value;save();theme()};$('#mode').onclick=()=>{NB.mode=document.documentElement.dataset.mode==='dark'?'light':'dark';save();theme()};
async function pdfText(file){if(typeof pdfjsLib==='undefined')throw new Error('The PDF reader could not load. Check your internet connection and try again.');
 pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer(),isEvalSupported:false}).promise,n=Math.min(pdf.numPages,80);let out='';
 for(let p=1;p<=n;p++){const c=await(await pdf.getPage(p)).getTextContent();let line='';c.items.forEach(it=>{line+=it.str+(it.hasEOL?'\n':' ')});out+=line+'\n\n'}
 return{text:out.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim(),pages:pdf.numPages,read:n}}
async function loadFile(f){if(!f)return;const nm=f.name.replace(/\.\w+$/,'');$('#af').classList.remove('hide');
 if(/\.pdf$/i.test(f.name)||f.type==='application/pdf'){toast('Reading PDF…');try{const r=await pdfText(f);if(r.text.length<40){toast('No readable text found. This looks like a scanned PDF.');return}
  $('#sx').value=r.text;if(!$('#st').value)$('#st').value=nm;toast(r.read<r.pages?`Read the first ${r.read} of ${r.pages} pages. Press Add.`:`Read ${r.pages} pages. Press Add.`)}catch(x){toast(x.message||'Could not read this PDF')}}
 else{const rd=new FileReader();rd.onload=()=>{$('#sx').value=rd.result;if(!$('#st').value)$('#st').value=nm};rd.readAsText(f)}}
$('#sf').onchange=e=>{const f=e.target.files[0];e.target.value='';loadFile(f)};
['dragover','drop'].forEach(ev=>document.addEventListener(ev,e=>{if(e.target.closest&&e.target.closest('#p1')){e.preventDefault();if(ev==='drop')loadFile(e.dataTransfer.files[0])}}));
const CK={},STW=new Set('the a an and or of in on at to for with by from as is are was were be it its this that these those which who what when where how why do does did can could may will would should has have had not no'.split(' '));
const tk=s=>(s.toLowerCase().match(/[a-z0-9\u0900-\u097f]{3,}/g)||[]).filter(w=>!STW.has(w));
function chunks(s){const key=s.n+':'+s.text.length;if(CK[key])return CK[key];const out=[],t=s.text;let i=0;
 while(i<t.length){let e=Math.min(t.length,i+1600);if(e<t.length){const b=t.lastIndexOf('\n',e);if(b>i+800)e=b;else{const d=t.lastIndexOf('. ',e);if(d>i+800)e=d+1}}out.push({s:s.n,t:t.slice(i,e).trim()});i=e}
 return CK[key]=out.filter(c=>c.t)}
function srcText(q){const S=NB.src.filter(s=>s.on),tot=S.reduce((a,s)=>a+s.text.length,0),B=120000,L=1600;
 if(tot<=B)return S.map(s=>`[S${s.n}] ${s.title}\n${s.text}`).join('\n\n---\n\n');
 const all=S.flatMap(chunks);all.forEach((c,i)=>{c.i=i;if(!c.f){c.f={};tk(c.t).forEach(w=>c.f[w]=(c.f[w]||0)+1)}});
 const max=Math.floor(B/L),qt=[...new Set(tk(q||''))],sel=new Set();
 if(qt.length){const N=all.length,idf={};qt.forEach(w=>{const d=all.filter(c=>c.f[w]).length;idf[w]=Math.log(1+(N-d+.5)/(d+.5))});
  all.map(c=>({c,v:qt.reduce((a,w)=>a+(c.f[w]?idf[w]*(1+Math.log(c.f[w])):0),0)})).filter(x=>x.v>0).sort((a,b)=>b.v-a.v).slice(0,Math.floor(max*.7)).forEach(x=>sel.add(x.c.i))}
 const step=Math.max(1,Math.floor(all.length/Math.max(1,max-sel.size)));for(let i=0;i<all.length&&sel.size<max;i+=step)sel.add(i);
 return S.map(s=>{const cs=all.filter(c=>c.s===s.n&&sel.has(c.i));return cs.length?`[S${s.n}] ${s.title} (selected excerpts of a longer document)\n`+cs.map(c=>c.t).join('\n\u2026\n'):''}).filter(Boolean).join('\n\n---\n\n')}
let PEND='';
async function pdfText(file,cb){if(typeof pdfjsLib==='undefined')throw new Error('The PDF reader could not load. Check your internet connection and try again.');
 pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer(),isEvalSupported:false}).promise,n=Math.min(pdf.numPages,500);let out='';
 for(let p=1;p<=n;p++){if(cb)cb(p,n);const c=await(await pdf.getPage(p)).getTextContent();let line='';c.items.forEach(it=>{line+=it.str+(it.hasEOL?'\n':' ')});out+=`[p. ${p}]\n`+line+'\n\n'}
 return{text:out.replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim(),pages:pdf.numPages,read:n}}
async function loadFile(f){if(!f)return;const nm=f.name.replace(/\.\w+$/,'');$('#af').classList.remove('hide');PEND='';$('#sx').readOnly=false;
 if(/\.pdf$/i.test(f.name)||f.type==='application/pdf'){const tt=document.createElement('div');tt.className='toast';tt.textContent='Reading PDF…';document.body.append(tt);
  try{const r=await pdfText(f,(p,n)=>{tt.textContent=`Reading page ${p} of ${n}…`});tt.remove();
   if(r.text.replace(/\[p\. \d+\]/g,'').trim().length<40){toast('No readable text found. This looks like a scanned PDF.');return}
   if(!$('#st').value)$('#st').value=nm;PEND=r.text;$('#sx').value=`PDF loaded: ${r.read} of ${r.pages} pages, about ${Math.round(r.text.length/1000)}k characters. Press Add to use it as a source.`;$('#sx').readOnly=true}
  catch(x){tt.remove();toast(x.message||'Could not read this PDF')}}
 else{const rd=new FileReader();rd.onload=()=>{$('#sx').value=rd.result;if(!$('#st').value)$('#st').value=nm};rd.readAsText(f)}}
$('#sadd').onclick=()=>{const t=$('#st').value.trim(),x=(PEND||$('#sx').value).trim();if(x.length<40){toast('Paste at least a few sentences.');return}if(NB.src.length>=8){toast('Up to 8 sources.');return}
 NB.src.push({n:NB.nx++,title:t||x.slice(0,30)+'…',text:x.slice(0,2000000),on:true});try{localStorage.setItem('lensbook',JSON.stringify(NB))}catch(e){toast('Kept for this session only (too large to store in the browser).')}
 PEND='';$('#sx').readOnly=false;$('#st').value=$('#sx').value='';$('#af').classList.add('hide');renderSrc();renderChat();pane('p2');if(x.length>120000)toast('Large document: LensBook will search it for the most relevant parts.')};
$('#scn').onclick=()=>{PEND='';$('#sx').readOnly=false;$('#sx').value='';$('#af').classList.add('hide')};
$('#ssm').onclick=()=>{PEND='';$('#sx').readOnly=false;$('#st').value='Photosynthesis chapter';$('#sx').value=SAMPLE};
theme();renderSrc();renderChat();renderOut();tiles();pane(NB.src.length?'p2':'p1');
</script></body></html>
