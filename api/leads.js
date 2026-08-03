import { requireAdmin } from './_lib/auth.js';
import { ensureSchema,purgeExpired } from './_lib/db.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(!requireAdmin(req,res))return;
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  try{
    const sql=await ensureSchema();await purgeExpired(sql);
    const rows=await sql`SELECT id,created_at,expires_at,name,whatsapp,email,source FROM waitlist_entries ORDER BY created_at DESC`;
    return res.status(200).json({entries:rows});
  }catch(error){console.error('admin list failed',error);return res.status(500).json({error:'Unable to load entries'});}
}
