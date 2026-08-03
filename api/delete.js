import { requireAdmin,sameOrigin } from './_lib/auth.js';
import { ensureSchema } from './_lib/db.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!requireAdmin(req,res))return;
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!sameOrigin(req))return res.status(403).json({error:'Invalid origin'});
  const ids=Array.isArray(req.body?.ids)?req.body.ids.map(Number).filter(Number.isSafeInteger):[];
  if(!ids.length)return res.status(400).json({error:'Select at least one entry'});
  try{
    const sql=await ensureSchema();
    const deleted=await sql.query('DELETE FROM waitlist_entries WHERE id = ANY($1::bigint[]) RETURNING id',[ids]);
    return res.status(200).json({ok:true,deleted:deleted.length});
  }catch(error){console.error('manual delete failed',error);return res.status(500).json({error:'Unable to delete entries'});}
}
