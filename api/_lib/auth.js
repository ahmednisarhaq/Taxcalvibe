import { timingSafeEqual } from 'node:crypto';

function equal(a,b){
  const left=Buffer.from(String(a));const right=Buffer.from(String(b));
  return left.length===right.length && timingSafeEqual(left,right);
}

export function authorized(req){
  const expectedUser=process.env.ADMIN_USERNAME;
  const expectedPass=process.env.ADMIN_PASSWORD;
  if(!expectedUser||!expectedPass) return false;
  const header=req.headers.authorization||'';
  if(!header.startsWith('Basic ')) return false;
  try{
    const decoded=Buffer.from(header.slice(6),'base64').toString('utf8');
    const colon=decoded.indexOf(':');
    if(colon<0)return false;
    return equal(decoded.slice(0,colon),expectedUser)&&equal(decoded.slice(colon+1),expectedPass);
  }catch{return false}
}

export function requireAdmin(req,res){
  if(authorized(req))return true;
  res.setHeader('WWW-Authenticate','Basic realm="TaxAI Waitlist Admin", charset="UTF-8"');
  res.setHeader('Cache-Control','no-store');
  res.status(401).send('Authentication required');
  return false;
}

export function sameOrigin(req){
  const origin=req.headers.origin;
  if(!origin)return true;
  return new URL(origin).host===req.headers.host;
}
