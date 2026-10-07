import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import * as d3 from 'd3'
import {
  Activity, BrainCircuit, Cpu, Gauge, LockKeyhole, LogIn, Network,
  Play, ShieldCheck, Sparkles, Zap
} from 'lucide-react'
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts'
import './index.css'

type Capital = 5000 | 10000 | 25000 | 50000
type Leverage = 2 | 3 | 4 | 5

const options: { capital: Capital; leverage: Leverage }[] = [
  { capital: 5000, leverage: 2 },
  { capital: 10000, leverage: 3 },
  { capital: 25000, leverage: 4 },
  { capital: 50000, leverage: 5 },
]

function NeuralBackground() {
  const ref = useRef<SVGSVGElement>(null)
  useEffect(() => {
    const svg = d3.select(ref.current)
    const width = window.innerWidth
    const height = window.innerHeight
    svg.attr('viewBox', `0 0 ${width} ${height}`)
    const nodes = Array.from({ length: 42 }, (_, i) => ({
      id: i, x: Math.random() * width, y: Math.random() * height
    }))
    const links = nodes.flatMap((n) =>
      nodes.filter(m => m.id !== n.id && Math.hypot(n.x-m.x,n.y-m.y) < 190)
        .slice(0, 2).map(m => ({ source:n, target:m }))
    )
    const g = svg.append('g')
    const lines = g.selectAll('line').data(links).enter().append('line')
      .attr('x1', d=>d.source.x).attr('y1', d=>d.source.y)
      .attr('x2', d=>d.target.x).attr('y2', d=>d.target.y)
      .attr('class','neural-link')
    const circles = g.selectAll('circle').data(nodes).enter().append('circle')
      .attr('cx',d=>d.x).attr('cy',d=>d.y).attr('r',d=>d.id%5===0?3:2)
      .attr('class','neural-node')
    const timer = setInterval(() => {
      nodes.forEach(n => {
        n.x += (Math.random()-.5)*3
        n.y += (Math.random()-.5)*3
        if(n.x<0)n.x=width; if(n.x>width)n.x=0
        if(n.y<0)n.y=height; if(n.y>height)n.y=0
      })
      lines.attr('x1',d=>d.source.x).attr('y1',d=>d.source.y)
        .attr('x2',d=>d.target.x).attr('y2',d=>d.target.y)
      circles.attr('cx',d=>d.x).attr('cy',d=>d.y)
    }, 80)
    return () => { clearInterval(timer); svg.selectAll('*').remove() }
  }, [])
  return <svg ref={ref} className="neural-bg" />
}

function Chart() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const chart = createChart(ref.current, {
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#718096' },
      grid: { vertLines: { color: '#182235' }, horzLines: { color: '#182235' } },
      rightPriceScale: { borderColor: '#253047' },
      timeScale: { borderColor: '#253047', timeVisible: true, secondsVisible: false },
      width: ref.current.clientWidth, height: 330
    })
    const series = chart.addSeries(CandlestickSeries, {
      upColor:'#39f7c1', downColor:'#ff4d8d', borderVisible:false,
      wickUpColor:'#39f7c1', wickDownColor:'#ff4d8d'
    })
    let price = 100
    const data = Array.from({length: 70},(_,i)=>{
      const open=price, close=Math.max(70,open+(Math.random()-.43)*3.2)
      const high=Math.max(open,close)+Math.random()*2
      const low=Math.min(open,close)-Math.random()*2
      price=close
      return { time: (Date.now()/1000 - (70-i)*3600) as any, open, high, low, close }
    })
    series.setData(data)
    chart.timeScale().fitContent()
    const resize = () => ref.current && chart.applyOptions({width:ref.current.clientWidth})
    window.addEventListener('resize',resize)
    return () => { window.removeEventListener('resize',resize); chart.remove() }
  }, [])
  return <div ref={ref} className="chart" />
}

function App() {
  const [logged, setLogged] = useState(() => sessionStorage.getItem('neural-auth') === '1')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [capital,setCapital] = useState<Capital>(10000)
  const [leverage,setLeverage] = useState<Leverage>(3)
  const [day,setDay] = useState(1)

  useEffect(() => {
    if (!logged) return
    const t=setInterval(()=>setDay(d=>d>=30?1:d+1),2200)
    return ()=>clearInterval(t)
  },[logged])

  const baseReturn=0.96
  const leveragedReturn=baseReturn*leverage
  const profit=capital*leveragedReturn
  const final=capital+profit

  const login = (e:React.FormEvent) => {
    e.preventDefault()
    if(email && password){ sessionStorage.setItem('neural-auth','1'); setLogged(true) }
  }

  if(!logged) return <div className="login-screen"><NeuralBackground/><div className="login-card">
    <div className="brand"><BrainCircuit size={34}/><div><b>NEURAL/BOT</b><span>HFT INTELLIGENCE LAB</span></div></div>
    <div className="eyebrow">SECURE SIMULATION TERMINAL</div>
    <h1>Adaptive HFT<br/><em>Intelligence.</em></h1>
    <p>Accesso alla sandbox di simulazione del motore neurale ad alta frequenza.</p>
    <form onSubmit={login}>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/>
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required/>
      <button className="primary"><LogIn size={17}/> ENTER TERMINAL</button>
    </form>
    <small><LockKeyhole size={13}/> DEMO AUTH — nessun account reale viene creato</small>
  </div></div>

  return <div className="app"><NeuralBackground/>
    <header className="topbar">
      <div className="brand"><BrainCircuit/><div><b>NEURAL/BOT</b><span>HFT INTELLIGENCE TERMINAL</span></div></div>
      <div className="top-status"><span className="pulse"/> ENGINE ONLINE <span className="sep"/> DAY {day}/30 <span className="sep"/> SIMULATION</div>
    </header>
    <div className="layout">
      <aside className="sidebar">
        {[
          ['OVERVIEW',Activity],['NEURAL CORE',BrainCircuit],['MARKET DATA',Network],
          ['EXECUTION',Zap],['RISK MATRIX',ShieldCheck]
        ].map(([label,Icon]:any)=><div className="nav-item" key={label}><Icon size={17}/>{label}</div>)}
        <div className="sys"><div><span>CPU</span><b>18%</b></div><div className="bar"><i style={{width:'18%'}}/></div><div><span>GPU</span><b>64%</b></div><div className="bar"><i style={{width:'64%'}}/></div><div><span>LATENCY</span><b>0.83 ms</b></div></div>
      </aside>
      <main>
        <div className="hero"><div><div className="eyebrow">ADAPTIVE HFT INTELLIGENCE</div><h1>Neural execution <em>engine</em></h1><p>Reinforcement learning · multi-agent signal processing · synthetic market execution</p></div><button className="live"><span className="pulse"/> LIVE FEED</button></div>
        <section className="metrics">
          {[
            ['MODEL ACCURACY','97.42%','▲ 2.81%',Gauge],['SIGNALS / SEC','12,840','▲ 18.4%',Activity],
            ['ACTIVE NODES','2,418','STABLE',Network],['LATENCY','0.83 ms','− 0.12 ms',Cpu]
          ].map(([a,b,c,Icon]:any)=><div className="metric" key={a}><Icon size={18}/><span>{a}</span><strong>{b}</strong><small>{c}</small></div>)}
        </section>
        <section className="panel"><div className="panel-head"><div><b>BTC/USDT · SYNTHETIC MARKET</b><span>NEURAL PREDICTION STREAM</span></div><div className="legend"><i/>UPTREND <i/>DOWNTREND</div></div><Chart/></section>
        <div className="grid2">
          <section className="panel smallpanel"><div className="panel-head"><b>NEURAL ACTIVITY</b><span>LIVE NODES</span></div><div className="activity">{Array.from({length:12},(_,i)=><div key={i} style={{height:`${30+Math.random()*65}%`}}/>)}</div></section>
          <section className="panel smallpanel"><div className="panel-head"><b>ORDER FLOW MATRIX</b><span>DEPTH</span></div><div className="matrix">{Array.from({length:36},(_,i)=><span key={i} className={i%7===0?'hot':''}/>)}</div></section>
        </div>
      </main>
      <aside className="rightbar">
        <div className="eyebrow">SIMULATION PARAMETERS</div><h2>Capital allocation</h2>
        <div className="choices">{options.map(o=><button className={capital===o.capital?'selected':''} onClick={()=>{setCapital(o.capital);setLeverage(o.leverage)}} key={o.capital}><b>€{o.capital.toLocaleString()}</b><span>LEVERAGE {o.leverage}×</span></button>)}</div>
        <div className="return-card"><span>MODEL BASE RETURN</span><strong>+96%</strong><small>30 DAY HYPOTHESIS</small></div>
        <div className="result"><span>LEVERAGED RETURN</span><b>+{(leveragedReturn*100).toFixed(0)}%</b><div><span>SIMULATED PROFIT</span><strong>€{profit.toLocaleString('it-IT',{maximumFractionDigits:0})}</strong></div><div><span>SIMULATED FINAL</span><strong>€{final.toLocaleString('it-IT',{maximumFractionDigits:0})}</strong></div></div>
        <button className="run"><Play size={16}/> RUN 30-DAY MODEL</button>
        <div className="disclaimer"><Sparkles size={14}/><p>SIMULATION ONLY. Il +96% è un'ipotesi del modello demo, non una previsione o garanzia. La leva amplifica profitti e perdite. Nessun ordine reale viene inviato.</p></div>
      </aside>
    </div>
  </div>
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)