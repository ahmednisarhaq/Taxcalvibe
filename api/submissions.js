import { ensureSchema,purgeExpired } from './_lib/db.js';

const clean=(value,max)=>String(value||'').trim().slice(0,max);

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const p=req.body||{};
  if(p.website)return res.status(200).json({ok:true});
  const name=clean(p.name,100),whatsapp=clean(p.whatsapp,30),email=clean(p.email,150);
  const consent=p.consent==='on'||p.consent===true||p.consent==='true';
  if(!name||!whatsapp||!email||!consent)return res.status(400).json({error:'Complete all required fields'});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return res.status(400).json({error:'Invalid email'});
  if(!/^[+0-9 ()-]{10,20}$/.test(whatsapp))return res.status(400).json({error:'Invalid WhatsApp number'});
  try{
    const sql=await ensureSchema();await purgeExpired(sql);
    await sql`INSERT INTO waitlist_entries(name,whatsapp,email,consent,source,submitted_at,page)
      VALUES(${name},${whatsapp},${email},TRUE,${clean(p.source,60)||'website'},${clean(p.submittedAt,50)},${clean(p.page,500)})`;
    return res.status(201).json({ok:true});
  }catch(error){console.error('waitlist submission failed',error);return res.status(500).json({error:'Unable to save submission'});}
}
