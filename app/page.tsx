"use client";
import "./circle.css";
import {useEffect,useState} from "react";
type Report={done:string[];open:string[];owe:string[];waiting:string[];tomorrow:string[];headline:string};
type Key="done"|"open"|"owe"|"waiting";
const data:Report={headline:"Three loops need your attention before tomorrow.",done:["Updated the BYREDO installation visual","Sent production questions to Bam","Followed up with Red Bull"],open:["ASICS vertical project is newer than its latest render","ComplexCon estimate was edited but not sent"],owe:["Reply to Eddie’s lineup question"],waiting:["Bam — production budget response","Red Bull — sponsorship decision"],tomorrow:["Reply to Eddie before noon","Render and deliver ASICS vertical v12","Send the updated ComplexCon estimate"]};
const labels:Record<Key,string>={done:"DONE",open:"STILL OPEN",owe:"YOU OWE",waiting:"WAITING"};
const apps=[["Ps","PHOTOSHOP"],["Ae","AFTER EFFECTS"],["M","MAIL"],["C","CHROME"],["F","FINDER"]];
const tomorrowMeta=[
 {source:"MAIL · EDDIE",priority:"HIGH PRIORITY",action:"Open the thread and send a short lineup reply before noon."},
 {source:"AFTER EFFECTS · ASICS_VERTICAL_V12.AEP",priority:"DELIVERY",action:"Resume the newest composition, render the vertical master, and deliver it."},
 {source:"FINDER · COMPLEXCON_ESTIMATE_V04",priority:"FOLLOW-UP",action:"Review the latest numbers, attach the estimate, and send it to production."}
];
export default function Home(){
 const [report,setReport]=useState(data),[selected,setSelected]=useState<Key>("owe"),[analyzing,setAnalyzing]=useState(false);
 const [selectedTomorrow,setSelectedTomorrow]=useState<number|null>(null),[started,setStarted]=useState<number[]>([]);
 const analyze=async()=>{setAnalyzing(true);try{const events=[{app:"Photoshop",detail:"BYREDO_space_v08.psd edited"},{app:"After Effects",detail:"ASICS_vertical_v12.aep newer than render"},{app:"Mail",detail:"Eddie question received, no reply"},{app:"Finder",detail:"Estimate edited, not shared"}];const r=await fetch("/api/analyze-day",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({events})});if(r.ok)setReport(await r.json())}catch{}finally{setTimeout(()=>setAnalyzing(false),600)}};
 useEffect(()=>{const t=setTimeout(analyze,400);return()=>clearTimeout(t)},[]);
 return <main className="circle-shell"><div className="circle-grain"/>
  <header><div className="circle-brand">LOOP<span>●</span></div><p>YOUR WORK, UNDERSTOOD</p><button className={analyzing?"spin":""} onClick={analyze}>{analyzing?"···":"↻"}</button></header>
  <section className="cosmos">
   <div className="waterline"/>
   <div className="core"><small>TODAY’S<br/>CLOSURE</small><b>68<span>%</span></b><p>3 loops remain</p><i/></div>
   {(Object.keys(labels) as Key[]).map(key=><button key={key} className={"planet "+key+(selected===key?" active":"")} onClick={()=>setSelected(key)}><small>{labels[key]}</small><b>{report[key].length.toString().padStart(2,"0")}</b><span>{key==="done"?"COMPLETE":key==="waiting"?"PENDING":"ACTION"}</span></button>)}
   <div className={"detail-orb "+selected}><small>SELECTED LOOP</small><h1>{labels[selected]}</h1><div>{report[selected].map((x,i)=><p key={x}><b>0{i+1}</b><span>{x}</span></p>)}</div><button>{selected==="waiting"?"CHECK STATUS":"OPEN ITEMS"} ↗</button></div>
   <div className="apps-orbit">{apps.map(([short,name],i)=><div className={"app-dot d"+i} key={name}><b>{short}</b><small>{name}</small></div>)}</div>
   <div className="orbit-ring r1"/><div className="orbit-ring r2"/><div className="orbit-ring r3"/>
  </section>
  <section className="next-world"><div className="next-title"><small>NEXT ORBIT</small><h2>Tomorrow,<br/>start here.</h2></div>{report.tomorrow.map((x,i)=><button aria-haspopup="dialog" aria-label={`Open tomorrow task: ${x}`} onClick={()=>setSelectedTomorrow(i)} className={"next-planet n"+i+(started.includes(i)?" started":"")} key={x}><b>{started.includes(i)?"READY":`0${i+1}`}</b><span>{x}</span><i>↗</i></button>)}<div className="mirror-word">TOMORROW</div></section>
  {selectedTomorrow!==null&&<div className="tmr-overlay" role="presentation" onClick={()=>setSelectedTomorrow(null)}>
   <section className="tmr-orb" role="dialog" aria-modal="true" aria-labelledby="tmr-title" onClick={e=>e.stopPropagation()}>
    <button className="tmr-close" aria-label="Close tomorrow task" onClick={()=>setSelectedTomorrow(null)}>×</button>
    <small>TOMORROW · 0{selectedTomorrow+1}</small>
    <h2 id="tmr-title">{report.tomorrow[selectedTomorrow]}</h2>
    <div className="tmr-meta"><p><b>SOURCE</b><span>{tomorrowMeta[selectedTomorrow].source}</span></p><p><b>STATUS</b><span>{tomorrowMeta[selectedTomorrow].priority}</span></p><p><b>NEXT MOVE</b><span>{tomorrowMeta[selectedTomorrow].action}</span></p></div>
    <button className="tmr-start" onClick={()=>{setStarted(s=>s.includes(selectedTomorrow)?s:[...s,selectedTomorrow]);setSelectedTomorrow(null)}}>{started.includes(selectedTomorrow)?"READY TO START":"MARK AS READY"} ↗</button>
   </section>
  </div>}
  <footer><span>LOOP FOR macOS</span><span>GPT-5.6 + CODEX</span><span>LOCAL · PRIVATE · ALWAYS ON</span></footer>
 </main>
}
