import { useMemo, useState } from 'react'
import {
  Activity, ArrowDownRight, ArrowRight, ArrowUpRight, Bookmark, BookOpen, BriefcaseBusiness,
  Check, ChevronDown, CircleHelp, ClipboardList, Command, Compass, Cpu, FileText, Filter,
  FlaskConical, FolderOpen, Gauge, GraduationCap, Grid2X2, Leaf, Lightbulb, Menu, Plus,
  Search, ShieldAlert, Sparkles, Sprout, Target, UploadCloud, Waves, X, Zap
} from 'lucide-react'
import { initialProjects, patents, themes, type Patent, type Project } from './data'

type Page = 'Overview' | 'Patent Explorer' | 'Project Ideas' | 'Saved Ideas' | 'Submit Project' | 'College Dashboard'
const nav: { label: Page; icon: typeof Grid2X2 }[] = [
  { label:'Overview', icon:Grid2X2 }, { label:'Patent Explorer', icon:Compass }, { label:'Project Ideas', icon:Lightbulb },
  { label:'Saved Ideas', icon:Bookmark }, { label:'Submit Project', icon:UploadCloud }, { label:'College Dashboard', icon:GraduationCap }
]
const statusStyle: Record<string,string> = {
  Active:'status-active', Expired:'status-expired', Pending:'status-pending',
  'In review':'status-pending', Approved:'status-active', Submitted:'status-neutral'
}

function App() {
  const [page, setPage] = useState<Page>('Overview')
  const [mobileNav, setMobileNav] = useState(false)
  const [saved, setSaved] = useState<string[]>(['UP-001','UP-004'])
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [query, setQuery] = useState('')
  const [theme, setTheme] = useState('All themes')
  const [status, setStatus] = useState('All statuses')
  const [selected, setSelected] = useState<Patent | null>(null)
  const [toast, setToast] = useState('')
  const [submitTitle, setSubmitTitle] = useState('')
  const [submitTheme, setSubmitTheme] = useState('Water Management')
  const [submitDescription, setSubmitDescription] = useState('')
  const [submitTeam, setSubmitTeam] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const filtered = useMemo(() => patents.filter(p =>
    (theme === 'All themes' || p.theme === theme) &&
    (status === 'All statuses' || p.status === status) &&
    `${p.title} ${p.summary} ${p.tags.join(' ')} ${p.number}`.toLowerCase().includes(query.toLowerCase())
  ), [query, theme, status])

  const notify = (message:string) => { setToast(message); window.setTimeout(() => setToast(''), 2600) }
  const toggleSave = (id:string) => {
    setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current,id])
    notify(saved.includes(id) ? 'Removed from saved ideas' : 'Idea saved to your library')
  }
  const go = (next:Page) => { setPage(next); setMobileNav(false); setSelected(null) }
  const submitProject = (e:React.FormEvent) => {
    e.preventDefault()
    if (!submitTitle.trim() || !submitDescription.trim() || !submitTeam.trim()) return
    const similarity = Math.max(8, ...projects.map(p => Math.min(96, Math.round((submitTitle.toLowerCase().split(' ').filter(w => w.length > 3 && p.title.toLowerCase().includes(w)).length / Math.max(1, submitTitle.split(' ').length))*100))))
    setProjects([{ id:`PRJ-${String(25 + projects.length).padStart(3,'0')}`, title:submitTitle, team:submitTeam, theme:submitTheme, status:'Submitted', description:submitDescription, similarity }, ...projects])
    setSubmitted(true)
    notify('Project submitted to the demo workspace')
  }

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
      <div className="brand-row">
        <div className="brand-mark"><Command size={19}/></div>
        <div><div className="brand-name">usepatent<span>.</span></div><div className="brand-caption">INNOVATION WORKSPACE</div></div>
        <button className="icon-button mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
      </div>
      <div className="workspace-pill"><span className="online-dot"/> Student workspace <ChevronDown size={14}/></div>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="main-nav">
        {nav.map(item => <button key={item.label} onClick={() => go(item.label)} className={`nav-link ${page === item.label ? 'active' : ''}`}><item.icon size={18}/><span>{item.label}</span>{item.label === 'Saved Ideas' && <span className="nav-count">{saved.length}</span>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><b>Need a starting point?</b><p>Explore a theme and turn an existing innovation into your next project.</p><button onClick={() => go('Patent Explorer')}>Explore patents <ArrowUpRight size={14}/></button></div>
        <div className="profile-row"><div className="avatar">S</div><div className="profile-copy"><b>Student account</b><span>Demo workspace</span></div><button className="icon-button"><ChevronDown size={16}/></button></div>
      </div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>{page}</b></div>
        <div className="topbar-right"><span className="demo-pill"><span/> DEMO DATA</span><button className="top-help" onClick={() => notify('Help centre is coming soon')}> <CircleHelp size={16}/> Help</button><div className="avatar small-avatar">S</div></div>
      </header>

      <div className="page-content">
        {page === 'Overview' && <Overview go={go} savedCount={saved.length} projects={projects} />}
        {page === 'Patent Explorer' && <Explorer filtered={filtered} query={query} setQuery={setQuery} theme={theme} setTheme={setTheme} status={status} setStatus={setStatus} onSelect={setSelected} saved={saved} toggleSave={toggleSave}/>}
        {page === 'Project Ideas' && <Ideas go={go} onSelect={setSelected} saved={saved} toggleSave={toggleSave}/>}
        {page === 'Saved Ideas' && <Saved saved={saved} onSelect={setSelected} toggleSave={toggleSave} go={go}/>}
        {page === 'Submit Project' && <Submit title={submitTitle} setTitle={setSubmitTitle} theme={submitTheme} setTheme={setSubmitTheme} description={submitDescription} setDescription={setSubmitDescription} team={submitTeam} setTeam={setSubmitTeam} onSubmit={submitProject} submitted={submitted} setSubmitted={setSubmitted} projects={projects}/>}
        {page === 'College Dashboard' && <College projects={projects}/>}
      </div>
      <footer className="footer"><span>© 2026 UsePatent</span><span>Turn patents into lessons. Turn lessons into ideas.</span><span className="footer-status"><span/> All systems operational</span></footer>
    </main>

    {selected && <PatentModal patent={selected} onClose={() => setSelected(null)} saved={saved.includes(selected.id)} onSave={() => toggleSave(selected.id)}/>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>
}

function PageHeading({eyebrow,title,description,action}:{eyebrow:string;title:string;description:string;action?:React.ReactNode}) {
  return <div className="page-heading"><div><div className="eyebrow"><Sparkles size={13}/>{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action && <div className="heading-action">{action}</div>}</div>
}
function Overview({go,savedCount,projects}:{go:(p:Page)=>void;savedCount:number;projects:Project[]}) {
  return <>
    <PageHeading eyebrow="YOUR INNOVATION WORKSPACE" title={<>Discover what exists.<br/><span className="gradient-text">Build what comes next.</span></>} description="Explore real-world innovation patterns, understand patents in plain English, and find the gap your next college project could solve." action={<button className="button-primary" onClick={() => go('Patent Explorer')}>Explore patents <ArrowUpRight size={16}/></button>}/>
    <div className="hero-banner">
      <div className="hero-orb orb-one"/><div className="hero-orb orb-two"/>
      <div className="hero-banner-content"><div className="hero-kicker"><Zap size={14}/> YOUR NEXT IDEA STARTS HERE</div><h2>Don't start from scratch.<br/><span>Start from insight.</span></h2><p>Every great project begins with understanding what's already been tried — and what still needs solving.</p><button className="button-glass" onClick={() => go('Project Ideas')}>Find your project direction <ArrowRight size={15}/></button></div>
      <div className="hero-visual"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="core-icon"><Command size={34}/></div><div className="float-node node-a"><Waves size={17}/><span>Water</span></div><div className="float-node node-b"><Sprout size={17}/><span>Agri</span></div><div className="float-node node-c"><Cpu size={17}/><span>AI / IoT</span></div></div>
      <div className="banner-index">01 <span>/</span> 03</div>
    </div>
    <div className="section-row"><div><div className="section-label">WORKSPACE SNAPSHOT</div><h2 className="section-title">Your discovery at a glance</h2></div><button className="text-button" onClick={() => go('College Dashboard')}>View dashboard <ArrowUpRight size={15}/></button></div>
    <div className="stats-grid">
      <Stat icon={FileText} label="Patent records" value="1,284" delta="Across 5 themes" color="blue"/>
      <Stat icon={Lightbulb} label="Project directions" value="36" delta="Curated from innovation gaps" color="violet"/>
      <Stat icon={Bookmark} label="Saved ideas" value={String(savedCount).padStart(2,'0')} delta="In your personal library" color="cyan"/>
      <Stat icon={ClipboardList} label="Your submissions" value={String(projects.length).padStart(2,'0')} delta="Demo project workspace" color="green"/>
    </div>
    <div className="overview-bottom">
      <div className="panel featured-panel"><div className="panel-head"><div><div className="section-label">PICK UP WHERE YOU LEFT OFF</div><h3>Featured innovation</h3></div><span className="demo-tag">DEMO RECORD</span></div><div className="featured-art"><div className="water-rings"><Waves size={38}/></div><div className="art-label">WATER SYSTEMS <span>01 / 06</span></div></div><div className="featured-info"><div><span className="theme-chip">Water Management</span><h4>Smart water distribution monitoring system</h4><p>Understand how sensor networks can spot unusual water flow — and where a campus-scale version could go further.</p></div><button className="round-arrow" onClick={() => go('Patent Explorer')}><ArrowUpRight size={19}/></button></div></div>
      <div className="panel quick-panel"><div className="section-label">EXPLORE BY THEME</div><h3>Find your area of impact</h3><div className="theme-list">{[{n:'Water Management',i:Waves,c:'blue',count:'248'},{n:'Waste Management',i:Leaf,c:'green',count:'196'},{n:'Healthcare',i:Activity,c:'pink',count:'312'},{n:'Agriculture',i:Sprout,c:'lime',count:'174'}].map(t=><button key={t.n} className="theme-row" onClick={() => go('Patent Explorer')}><span className={`theme-icon ${t.c}`}><t.i size={17}/></span><b>{t.n}</b><span className="theme-count">{t.count}</span><ArrowUpRight size={14}/></button>)}</div><button className="text-button full-text" onClick={() => go('Patent Explorer')}>Browse all themes <ArrowRight size={14}/></button></div>
    </div>
  </>
}
function Stat({icon:Icon,label,value,delta,color}:{icon:typeof Activity;label:string;value:string;delta:string;color:string}) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${color}`}><Icon size={17}/></span></div><div className="stat-value">{value}</div><div className="stat-delta">{delta}</div><div className="stat-spark"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div></div>
}
function Explorer({filtered,query,setQuery,theme,setTheme,status,setStatus,onSelect,saved,toggleSave}:{filtered:Patent[];query:string;setQuery:(v:string)=>void;theme:string;setTheme:(v:string)=>void;status:string;setStatus:(v:string)=>void;onSelect:(p:Patent)=>void;saved:string[];toggleSave:(id:string)=>void}) {
  return <><PageHeading eyebrow="PATENT DISCOVERY" title={<>Patent <span className="gradient-text">Explorer</span></>} description="Search by theme, understand the innovation in plain English, and inspect the opportunity around it." action={<span className="record-count"><span/> {filtered.length} demo records shown</span>}/>
    <div className="notice"><ShieldAlert size={17}/><div><b>Research starting point, not legal advice.</b><span>All records on this prototype are fictional demo entries. A patent's status alone does not establish whether a project is free to use. Always verify official records, claims, ownership, jurisdiction and applicable rights.</span></div></div>
    <div className="filter-bar"><div className="search-field"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search patents, technologies, keywords..."/><kbd>⌘ K</kbd></div><div className="select-wrap"><Filter size={15}/><select value={theme} onChange={e=>setTheme(e.target.value)}>{themes.map(t=><option key={t}>{t}</option>)}</select><ChevronDown size={14}/></div><div className="select-wrap"><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option><option>Active</option><option>Expired</option><option>Pending</option></select><ChevronDown size={14}/></div></div>
    <div className="results-label"><span>DISCOVERY RESULTS</span><span>Sorted by relevance <ChevronDown size={13}/></span></div>
    <div className="patent-grid">{filtered.map(p=><PatentCard key={p.id} patent={p} onSelect={()=>onSelect(p)} saved={saved.includes(p.id)} onSave={()=>toggleSave(p.id)}/>)}</div>
    {filtered.length===0 && <div className="empty-state"><Search size={25}/><h3>No matching demo records</h3><p>Try another keyword or clear one of the filters.</p><button className="button-secondary" onClick={()=>{setQuery('');setTheme('All themes');setStatus('All statuses')}}>Clear filters</button></div>}
  </>
}
function PatentCard({patent:p,onSelect,saved,onSave}:{patent:Patent;onSelect:()=>void;saved:boolean;onSave:()=>void}) {
  const Icon = p.theme==='Water Management'?Waves:p.theme==='Waste Management'?Leaf:p.theme==='Healthcare'?Activity:p.theme==='Agriculture'?Sprout:Zap
  return <article className="patent-card"><div className={`patent-art art-${p.theme.split(' ')[0].toLowerCase()}`}><div className="patent-art-grid"/><div className="patent-art-icon"><Icon size={28}/></div><span className="demo-tag">DEMO</span><button className={`save-button ${saved?'saved':''}`} onClick={onSave} aria-label="Save patent"><Bookmark size={16} fill={saved?'currentColor':'none'}/></button></div><div className="patent-card-body"><div className="card-meta"><span>{p.theme}</span><span className={`status ${statusStyle[p.status]}`}>{p.status}</span></div><button className="patent-title" onClick={onSelect}>{p.title}</button><p>{p.summary}</p><div className="tag-row">{p.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><div className="patent-card-foot"><span>{p.number}</span><button onClick={onSelect}>Explore <ArrowUpRight size={14}/></button></div></div></article>
}
function Ideas({go,onSelect,saved,toggleSave}:{go:(p:Page)=>void;onSelect:(p:Patent)=>void;saved:string[];toggleSave:(id:string)=>void}) {
  return <><PageHeading eyebrow="INNOVATION GAP FINDER" title={<>Find the gap.<br/><span className="gradient-text">Shape the next idea.</span></>} description="Project directions are generated from the limitations and unanswered needs described in demo innovation records." action={<button className="button-primary" onClick={()=>go('Submit Project')}>Submit a project <ArrowUpRight size={16}/></button>}/><div className="ideas-intro"><div className="ideas-intro-icon"><Target size={22}/></div><div><b>How to use these directions</b><p>Use them as research prompts, not ready-made project claims. Check prior art, validate the need with users, and develop your own technical contribution.</p></div></div><div className="idea-list">{patents.map((p,i)=><div className="idea-card" key={p.id}><div className="idea-number">0{i+1}</div><div className="idea-main"><div className="card-meta"><span>{p.theme}</span><span className="match-label"><Sparkles size={12}/> {p.score}% relevance</span></div><h3>{p.idea}</h3><p><b>Opportunity:</b> {p.gap}</p><div className="idea-source"><FileText size={13}/> Inspired by demo record: {p.title}</div></div><div className="idea-actions"><button className={`save-button inline-save ${saved.includes(p.id)?'saved':''}`} onClick={()=>toggleSave(p.id)}><Bookmark size={16} fill={saved.includes(p.id)?'currentColor':'none'}/></button><button className="round-arrow" onClick={()=>onSelect(p)}><ArrowUpRight size={17}/></button></div></div>)}</div></>
}
function Saved({saved,onSelect,toggleSave,go}:{saved:string[];onSelect:(p:Patent)=>void;toggleSave:(id:string)=>void;go:(p:Page)=>void}) {
  const items=patents.filter(p=>saved.includes(p.id))
  return <><PageHeading eyebrow="YOUR PERSONAL LIBRARY" title={<>Saved <span className="gradient-text">ideas</span></>} description="Keep promising innovation directions together while you research and refine your project."/><div className="saved-summary"><Bookmark size={18}/><b>{items.length} saved items</b><span>Only visible in this demo session</span></div>{items.length?<div className="patent-grid">{items.map(p=><PatentCard key={p.id} patent={p} onSelect={()=>onSelect(p)} saved={true} onSave={()=>toggleSave(p.id)}/>)}</div>:<div className="empty-state"><Bookmark size={25}/><h3>Your library is waiting</h3><p>Save a patent or project direction to find it here.</p><button className="button-primary" onClick={()=>go('Patent Explorer')}>Explore patents <ArrowRight size={15}/></button></div>}</>
}
function Submit({title,setTitle,theme,setTheme,description,setDescription,team,setTeam,onSubmit,submitted,setSubmitted,projects}:{title:string;setTitle:(v:string)=>void;theme:string;setTheme:(v:string)=>void;description:string;setDescription:(v:string)=>void;team:string;setTeam:(v:string)=>void;onSubmit:(e:React.FormEvent)=>void;submitted:boolean;setSubmitted:(v:boolean)=>void;projects:Project[]}) {
  return <><PageHeading eyebrow="CONTRIBUTE TO THE COMMUNITY" title={<>Put your idea <span className="gradient-text">in motion.</span></>} description="Share your team's project direction. The demo similarity indicator is a simple keyword overlap, not a validated plagiarism or patent search."/><div className="submit-layout"><form className="panel submit-form" onSubmit={onSubmit}><div className="form-title"><div><div className="section-label">PROJECT DETAILS</div><h3>New project submission</h3></div><span className="demo-tag">DEMO FORM</span></div><label>Project title <input required value={title} onChange={e=>{setTitle(e.target.value);setSubmitted(false)}} placeholder="e.g. Smart campus water monitor"/></label><div className="form-two"><label>Theme<select value={theme} onChange={e=>setTheme(e.target.value)}>{themes.slice(1).map(t=><option key={t}>{t}</option>)}</select></label><label>Team / student name<input required value={team} onChange={e=>setTeam(e.target.value)} placeholder="e.g. Team AquaTech"/></label></div><label>Project summary<textarea required rows={5} value={description} onChange={e=>{setDescription(e.target.value);setSubmitted(false)}} placeholder="What problem are you solving? How does your proposed solution work?"/></label><div className="form-hint"><ShieldAlert size={15}/> Do not include confidential information. Submissions are stored only in this browser session.</div><button className="button-primary submit-button" type="submit">Submit project <ArrowUpRight size={16}/></button>{submitted&&<div className="success-note"><Check size={16}/> Project added to your demo workspace.</div>}</form><div className="submit-side"><div className="panel guidance-panel"><div className="guidance-icon"><Sparkles size={20}/></div><h3>Before you submit</h3><ul><li><Check size={14}/> Describe the real-world problem clearly.</li><li><Check size={14}/> Explain what is new in your approach.</li><li><Check size={14}/> Review similar projects and patents.</li><li><Check size={14}/> Avoid claiming legal clearance from a status label.</li></ul></div><div className="panel similarity-panel"><div className="section-label">SIMILARITY PREVIEW</div><h3>How the demo check works</h3><p>After submission, a lightweight title keyword comparison is shown in the College Dashboard. It is only a prototype signal.</p><div className="similarity-meter"><span style={{width:'34%'}}/></div><div className="meter-legend"><span>Keyword overlap</span><b>Illustrative only</b></div></div></div></div></>
}
function College({projects}:{projects:Project[]}) {
  return <><PageHeading eyebrow="INSTITUTION VIEW" title={<>College <span className="gradient-text">dashboard</span></>} description="A lightweight view for mentors and coordinators to track project activity and guide student teams." action={<span className="demo-tag">SAMPLE DATA</span>}/><div className="stats-grid college-stats"><Stat icon={ClipboardList} label="Total submissions" value={String(projects.length).padStart(2,'0')} delta="Across student teams" color="blue"/><Stat icon={Check} label="Approved projects" value={String(projects.filter(p=>p.status==='Approved').length).padStart(2,'0')} delta="Ready to progress" color="green"/><Stat icon={Activity} label="Under review" value={String(projects.filter(p=>p.status==='In review').length).padStart(2,'0')} delta="Mentor attention" color="violet"/><Stat icon={Gauge} label="Themes covered" value={String(new Set(projects.map(p=>p.theme)).size).padStart(2,'0')} delta="Demo categories" color="cyan"/></div><div className="panel projects-panel"><div className="panel-head"><div><div className="section-label">STUDENT INNOVATION PIPELINE</div><h3>Recent project submissions</h3></div><span className="record-count">{projects.length} projects</span></div><div className="table-wrap"><table><thead><tr><th>PROJECT</th><th>TEAM</th><th>THEME</th><th>STATUS</th><th>SIMILARITY SIGNAL</th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td><b>{p.title}</b><small>{p.id}</small></td><td>{p.team}</td><td>{p.theme}</td><td><span className={`status ${statusStyle[p.status]}`}>{p.status}</span></td><td><div className="similarity-cell"><div className="mini-meter"><span style={{width:`${p.similarity}%`}}/></div><b>{p.similarity}%</b></div></td></tr>)}</tbody></table></div><div className="table-note"><ShieldAlert size={14}/> Similarity is a demo keyword signal only. It is not a plagiarism verdict or legal assessment.</div></div><div className="college-bottom"><div className="panel insight-panel"><div className="section-label">PROJECT MIX</div><h3>Explore across themes</h3>{['Water Management','Waste Management','Healthcare','Agriculture'].map((t,i)=><div className="mix-row" key={t}><span>{t}</span><div className="mix-track"><i style={{width:`${[76,54,34,23][i]}%`}}/></div><b>{projects.filter(p=>p.theme===t).length}</b></div>)}</div><div className="panel mentor-panel"><div className="mentor-icon"><GraduationCap size={21}/></div><h3>Mentor review workspace</h3><p>In a production version, mentors can assign reviewers, add feedback, and move projects through approval stages.</p><span className="coming-soon">ROADMAP FEATURE</span></div></div></>
}
function PatentModal({patent:p,onClose,saved,onSave}:{patent:Patent;onClose:()=>void;saved:boolean;onSave:()=>void}) {
  return <div className="modal-backdrop" onClick={onClose}><div className="patent-modal" onClick={e=>e.stopPropagation()}><div className="modal-top"><span className="eyebrow"><Sparkles size={13}/> DEMO PATENT BRIEF</span><button className="icon-button" onClick={onClose}><X size={19}/></button></div><div className="modal-theme">{p.theme} <span className={`status ${statusStyle[p.status]}`}>{p.status}</span></div><h2>{p.title}</h2><div className="modal-number">{p.number} · Published example year {p.year}</div><div className="modal-section"><div className="section-label">THE IDEA IN SIMPLE ENGLISH</div><p>{p.summary}</p></div><div className="modal-gap"><div className="gap-icon"><Target size={19}/></div><div><div className="section-label">POTENTIAL INNOVATION GAP</div><p>{p.gap}</p></div></div><div className="modal-section"><div className="section-label">POSSIBLE COLLEGE PROJECT DIRECTION</div><p>{p.idea}</p></div><div className="legal-note"><ShieldAlert size={17}/><p><b>Important:</b> This is fictional sample content for demonstrating the interface. Patent status is not a permission-to-use label. Verify the official patent register, claims, family, ownership, jurisdiction, licences and other applicable rights before relying on any record.</p></div><div className="modal-actions"><button className="button-secondary" onClick={onSave}><Bookmark size={15} fill={saved?'currentColor':'none'}/>{saved?'Saved':'Save idea'}</button><button className="button-primary" onClick={onClose}>Done <Check size={15}/></button></div></div></div>
}
export default App
