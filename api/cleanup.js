import { ensureSchema,purgeExpired } from './_lib/db.js';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  const secret=process.env.CRON_SECRET;
  if(!secret||req.headers.authorization!==`Bearer ${secret}`)return res.status(401).json({error:'Unauthorized'});
  try{const sql=await ensureSchema();const deleted=await purgeExpired(sql);return res.status(200).json({ok:true,deleted});}
  catch(error){console.error('retention cleanup failed',error);return res.status(500).json({error:'Cleanup failed'});}
}
