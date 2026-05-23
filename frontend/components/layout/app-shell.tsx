"use client";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
const nav = ["overview","sources","events","geography","opportunities","admin"];
export function AppShell({children}:{children:React.ReactNode}){const[s,setS]=useState(true);return <div className="min-h-screen flex"><aside className={`${s?"w-64":"w-20"} bg-slate-900 text-white p-4 transition-all`}><button onClick={()=>setS(!s)}><Menu/></button><div className="mt-6 space-y-2">{nav.map(n=><Link key={n} href={`/${n}`} className="block rounded px-3 py-2 hover:bg-slate-700 capitalize">{n}</Link>)}</div></aside><main className="flex-1"><header className="h-16 border-b bg-white/80 dark:bg-slate-900/80 px-6 flex items-center justify-between"><input placeholder="Search leads, entities, regions" className="w-96 rounded-md border px-3 py-2 bg-transparent"/><div className="flex items-center gap-4"><Bell className="w-5 h-5"/><button className="rounded-full bg-blue-600 text-white px-3 py-1">JD</button></div></header><div className="p-6">{children}</div></main></div>}
