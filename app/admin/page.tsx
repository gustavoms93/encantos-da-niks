"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from "firebase/auth";
import { collection, doc, getDoc, onSnapshot, runTransaction, serverTimestamp } from "firebase/firestore";
import { firebaseConfigured, firebaseServices } from "../../lib/firebase";
import { MIN_STOCK_ALERT } from "../../lib/inventory";

type Item = { id: number; name: string; quantity: number | null };
const catalog = [
  [2,"Mix de Colar Unissex"],[3,"Colar Machado Viking"],[4,"Colar Camada Dupla Estrela"],
  [5,"Brinco Geométrico Gótico"],[6,"Anel Borboleta"],[7,"Brincos Dark Love Roxo"],
  [8,"Cinto Rock Star"],[9,"Tiara Rock Rebite"],[10,"Pulseira Cruz"],
  [12,"Caneca Dragon Ball Z Goku Sayajin Fases"],[13,"Caneca One Piece"],[14,"Caneca Dragon Ball"],
  [15,"Caneca Homem-Aranha"],[16,"Caneca Pequeno Príncipe"],[17,"Álbum de Desenho Pokémon"],
  [18,"Álbum de Desenho Os Cavaleiros do Zodíaco"],[19,"Bonecos Como Treinar Seu Dragão"],
  [21,"Camiseta Unissex Corvo"],[22,"Meia-calça Coração"],
] as const;
const initial: Item[] = catalog.map(([id,name])=>({id,name,quantity:null}));
const panel: React.CSSProperties={maxWidth:1040,margin:"40px auto",padding:"20px",fontFamily:"system-ui, sans-serif",color:"#23182f"};
const btn: React.CSSProperties={padding:"10px 14px",borderRadius:8,border:"1px solid #d6c5df",background:"#fff",cursor:"pointer"};
export default function AdminPage(){
 const [user,setUser]=useState<User|null>(null),[checking,setChecking]=useState(true),[authorized,setAuthorized]=useState(false);
 const [items,setItems]=useState<Item[]>(initial),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState<number|null>(null);
 const [edits,setEdits]=useState<Record<number,string>>({}),[reasons,setReasons]=useState<Record<number,string>>({});
 useEffect(()=>{const services=firebaseServices();if(!services){setChecking(false);return;}
   return onAuthStateChanged(services.auth,async u=>{
     setUser(u);setAuthorized(false);setChecking(true);setError("");
     if(u){try{const admin=await getDoc(doc(services.db,"admins",u.uid));setAuthorized(admin.exists())}catch{setError("Não foi possível verificar a permissão de administração.")}}
     setChecking(false);
   });
 },[]);
 useEffect(()=>{const services=firebaseServices();if(!services||!authorized)return;
   return onSnapshot(collection(services.db,"inventory"),snap=>{const quantities=new Map(snap.docs.map(d=>[Number(d.id),d.data().quantity as number]));setItems(initial.map(p=>({...p,quantity:quantities.has(p.id)?quantities.get(p.id)!:null})))},()=>setError("Não foi possível carregar o estoque."));
 },[authorized]);
 async function save(item:Item){
   const services=firebaseServices();if(!services||!user)return;
   const next=Number(edits[item.id]);const reason=(reasons[item.id]||"Ajuste manual").trim();
   if(!Number.isInteger(next)||next<0||next>1000000){setError("Informe uma quantidade inteira entre 0 e 1.000.000.");return}
   if(!reason||reason.length>100){setError("Informe um motivo de até 100 caracteres.");return}
   setBusy(item.id);setError("");
   try{
     await runTransaction(services.db,async tx=>{
       const ref=doc(services.db,"inventory",String(item.id));
       const previous=await tx.get(ref);
       const before=previous.exists()?Number(previous.data().quantity):0;
       tx.set(ref,{quantity:next,updatedAt:serverTimestamp()});
       const movement=doc(collection(services.db,"inventory_movements"));
       tx.set(movement,{productId:item.id,before,after:next,delta:next-before,reason,actor:user.uid,createdAt:serverTimestamp()});
     });
     setEdits(p=>{const n={...p};delete n[item.id];return n});
   }catch{setError("Não foi possível salvar. Verifique as regras do Firestore e sua conexão.")}
   finally{setBusy(null)}
 }
 const total=items.reduce((n,p)=>n+(p.quantity||0),0);
 return <main style={panel}>
   <p style={{letterSpacing:2,fontSize:12}}>ENCANTOS DA NIKS</p><h1 style={{fontSize:32,fontWeight:700}}>Administração do estoque</h1>
   <p>Atualize a quantidade disponível. O catálogo público acompanha as alterações do Firebase sem novo deploy.</p>
   {!firebaseConfigured?<p role="alert">Firebase ainda não configurado. Adicione as variáveis NEXT_PUBLIC_FIREBASE_* no ambiente de hospedagem.</p>:
   checking?<p>Verificando acesso…</p>:
   !user?<form onSubmit={async e=>{e.preventDefault();const s=firebaseServices();if(!s)return;setError("");try{await signInWithEmailAndPassword(s.auth,email,password);setPassword("")}catch{setError("Não foi possível entrar. Confira suas credenciais.")}}} style={{display:"grid",maxWidth:380,gap:12}}>
     <label>E-mail<input required type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} style={{display:"block",width:"100%",padding:12}}/></label>
     <label>Senha<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:"block",width:"100%",padding:12}}/></label>
     <button style={btn}>Entrar</button>
   </form>:
   !authorized?<div><p>Esta conta não está autorizada a administrar o estoque.</p><button style={btn} onClick={()=>{const s=firebaseServices();if(s)void signOut(s.auth)}}>Sair</button></div>:
   <section>
     <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8,alignItems:"center"}}>
       <p><strong>{total}</strong> unidades · <strong>{items.filter(p=>p.quantity!==null&&p.quantity<=MIN_STOCK_ALERT).length}</strong> produtos com estoque baixo ou esgotado</p>
       <button style={btn} onClick={()=>{const s=firebaseServices();if(s)void signOut(s.auth)}}>Sair</button>
     </div>
     <div style={{display:"grid",gap:10}}>
       {items.map(item=><article key={item.id} style={{padding:16,border:"1px solid #e7dbea",borderRadius:12,display:"grid",gap:10}}>
         <div><strong>{item.name}</strong><div style={{fontSize:13}}>{item.quantity===null?"Estoque não cadastrado":item.quantity===0?"Esgotado":item.quantity<=MIN_STOCK_ALERT?"Estoque baixo":"Disponível"} · {item.quantity===null?"—":item.quantity} unidades</div></div>
         <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"end"}}>
           <label>Nova quantidade<input type="number" min="0" max="1000000" step="1" value={edits[item.id]??String(item.quantity??0)} onChange={e=>setEdits(p=>({...p,[item.id]:e.target.value}))} style={{display:"block",width:110,padding:10}}/></label>
           <label>Motivo<input maxLength={100} value={reasons[item.id]??"Ajuste manual"} onChange={e=>setReasons(p=>({...p,[item.id]:e.target.value}))} style={{display:"block",width:180,padding:10}}/></label>
           <button style={btn} disabled={busy!==null} onClick={()=>void save(item)}>{busy===item.id?"Salvando…":"Salvar estoque"}</button>
         </div>
       </article>)}
     </div>
   </section>}
   {error&&<p role="alert" style={{color:"#a21d36"}}>{error}</p>}
 </main>;
}
