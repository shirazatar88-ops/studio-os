var CACHE="shiraz-studio-v21";
var ASSETS=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./icon-maskable-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==CACHE;}).map(function(x){return caches.delete(x);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET") return;
  var u=new URL(e.request.url);
  if(u.origin!==self.location.origin) return; /* never touch database/API traffic */
  /* online: always the newest copy from the server (bypassing the browser cache); offline: last saved copy */
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(function(res){var c=res.clone();caches.open(CACHE).then(function(x){x.put(e.request,c);});return res;}).catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(m){return m||caches.match("./index.html");});}));
});
