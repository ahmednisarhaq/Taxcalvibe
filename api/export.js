import { requireAdmin } from './_lib/auth.js';
import { ensureSchema,purgeExpired } from './_lib/db.js';

const csv=value=>'"'+String(value??'').replaceAll('"','""')+'"';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!requireAdmin(req,res))return;
  if(req.method!=='GET')return res.status(405).send('Method not allowed');
  try{
    const sql=await ensureSchema();await purgeExpired(sql);
    const rows=await sql`SELECT id,created_at,expires_at,name,whatsapp,email,source FROM waitlist_entries ORDER BY created_at DESC`;
    const lines=[['ID','Received at','Expires at','Name','WhatsApp','Email','Source'].map(csv).join(',')];
    for(const row of rows)lines.push([row.id,row.created_at?.toISOString?.()||row.created_at,row.expires_at?.toISOString?.()||row.expires_at,row.name,row.whatsapp,row.email,row.source].map(csv).join(','));
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.setHeader('Content-Disposition',`attachment; filename="taxai-waitlist-${new Date().toISOString().slice(0,10)}.csv"`);
    return res.status(200).send('\uFEFF'+lines.join('\r\n'));
  }catch(error){console.error('CSV export failed',error);return res.status(500).send('Unable to export entries');}
}
