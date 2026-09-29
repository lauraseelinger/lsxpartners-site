#!/usr/bin/env python3
"""
Wrap an HTML deliverable in the LSX password gate.

The whole document is encrypted with AES-256-GCM (PBKDF2-SHA256, 200k iters)
and written into a small shell page. Nothing but the shell is readable without
the password, so crawlers and assistants never see the content.

Usage: python3 build-gated-page.py <source.html> <out.html> <password> <brand> <title> <button>
"""
import base64, hashlib, os, pathlib, sys, json
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

src, out, pw, brand, headline, btn = sys.argv[1:7]
plain = pathlib.Path(src).read_bytes()
salt = os.urandom(16); iv = os.urandom(12); iters = 200000
key = hashlib.pbkdf2_hmac('sha256', pw.encode(), salt, iters, dklen=32)
ct = AESGCM(key).encrypt(iv, plain, None)
P = {"salt": base64.b64encode(salt).decode(), "iv": base64.b64encode(iv).decode(),
     "ct": base64.b64encode(ct).decode(), "iter": iters}

SHELL = '''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>%(title)s</title>
<link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{--rust:#b55434;--cream:#fcf5e5;--card:#fffdf7;--line:#e7dcc5;--ink:#3a2a22;--muted:#8a7a6f;}
  *{box-sizing:border-box} body{margin:0;min-height:100vh;background:var(--cream);color:var(--ink);
    font-family:'Space Mono',ui-monospace,monospace;display:flex;align-items:center;justify-content:center;padding:24px;}
  .lockcard{max-width:400px;width:100%%;text-align:center;background:var(--card);border:1px solid var(--line);
    border-top:4px solid var(--rust);border-radius:16px;padding:32px 28px;}
  .brand{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);margin-bottom:14px;}
  h2{font-family:'Literata',Georgia,serif;font-size:23px;margin:0 0 6px;}
  p{font-size:12.5px;color:var(--muted);margin:0 0 16px;line-height:1.5;}
  input{display:block;width:100%%;margin:8px 0;padding:11px 13px;border-radius:9px;border:1px solid var(--line);
    font-family:'Space Mono',monospace;font-size:13px;background:var(--cream);color:var(--ink);}
  button{background:var(--rust);color:#fff;border:none;border-radius:9px;padding:12px 30px;
    font-family:'Space Mono',monospace;font-size:14px;font-weight:700;cursor:pointer;margin-top:8px;width:100%%;}
  button:hover{filter:brightness(1.07)} .err{color:#b00020;font-size:12px;margin-top:12px;min-height:16px}
</style></head><body>
<div class="lockcard">
  <div class="brand">%(brand)s</div>
  <h2>%(headline)s</h2>
  <p>This document is password-protected. Enter the password to view it.</p>
  <input id="pw" type="password" placeholder="Password" autocomplete="off" autofocus>
  <button id="go">%(btn)s</button>
  <div class="err" id="err"></div>
</div>
<script>
var P = %(payload)s;
function b64(s){var bin=atob(s),u=new Uint8Array(bin.length);for(var i=0;i<bin.length;i++)u[i]=bin.charCodeAt(i);return u;}
async function open_(){
  var pw=document.getElementById('pw').value;
  try{
    var enc=new TextEncoder();
    var km=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveKey']);
    var key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(P.salt),iterations:P.iter,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
    var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(P.iv)},key,b64(P.ct));
    document.open();document.write(new TextDecoder().decode(pt));document.close();
  }catch(e){ document.getElementById('err').textContent='Incorrect password. Please try again.'; }
}
document.getElementById('go').onclick=open_;
document.getElementById('pw').addEventListener('keydown',function(e){if(e.key==='Enter')open_();});
</script>
</body></html>
'''
pathlib.Path(out).write_text(SHELL % {"title": headline+" · LSX Partners", "brand": brand,
    "headline": headline, "btn": btn, "payload": json.dumps(P)})
print("wrote %s  (%.0f KB from %.0f KB source)" % (out, pathlib.Path(out).stat().st_size/1024, len(plain)/1024))
