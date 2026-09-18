
(function(){
'use strict';
var K='kent_cart_v2';
function read(){try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return window.__c||[]}}
function write(c){window.__c=c;try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}paint()}
function n(){return read().reduce(function(a,i){return a+i.q},0)}
function paint(){var t=n();document.querySelectorAll('.cn').forEach(function(e){e.textContent=t||'';e.dataset.n=t;e.style.display=t?'':'none'})}
function money(v){return 'PKR '+v.toLocaleString('en-PK')}

/* ---- reveal on scroll ---- */
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -30px'});
 document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
}else{document.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')})}

/* ---- add to cart ---- */
var toast=document.getElementById('toast'),tt=null;
document.addEventListener('click',function(ev){
 var b=ev.target.closest('[data-add]'); if(!b)return;
 ev.preventDefault();
 var d=b.dataset,c=read(),f=c.filter(function(i){return i.code===d.code})[0];
 if(f)f.q++; else c.push({code:d.code,name:d.pname,price:+d.price,img:d.img,slug:d.slug,q:1});
 write(c);
 document.querySelectorAll('.cn').forEach(function(x){x.classList.add('pop');setTimeout(function(){x.classList.remove('pop')},320)});
 if(toast){toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},1800)}
 var o=b.innerHTML;b.classList.add('ok');b.textContent='Added';
 setTimeout(function(){b.classList.remove('ok');b.innerHTML=o},1200);
});

/* ---- hero slider ---- */
var sl=document.getElementById('hero-slider');
if(sl){
 var tr=sl.querySelector('.slides'),len=tr.children.length,
     dots=[].slice.call(sl.querySelectorAll('.dots button')),i=0,timer=null,
     red=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function go(k){i=(k+len)%len;tr.style.transform='translateX('+(-i*100)+'%)';
  dots.forEach(function(d,j){d.setAttribute('aria-current',j===i?'true':'false')})}
 function play(){if(red)return;stop();timer=setInterval(function(){go(i+1)},5000)}
 function stop(){if(timer){clearInterval(timer);timer=null}}
 dots.forEach(function(d,j){d.addEventListener('click',function(e){e.preventDefault();go(j);play()})});
 var x0=null,y0=null,lock=false;
 sl.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY;lock=false;stop()},{passive:true});
 sl.addEventListener('touchmove',function(e){if(x0===null)return;
  var dx=e.touches[0].clientX-x0,dy=e.touches[0].clientY-y0;
  if(!lock&&Math.abs(dx)>Math.abs(dy)+6)lock=true;
  if(lock)tr.style.transform='translateX(calc('+(-i*100)+'% + '+dx+'px))'},{passive:true});
 sl.addEventListener('touchend',function(e){if(x0===null)return;
  var dx=e.changedTouches[0].clientX-x0;
  if(lock&&Math.abs(dx)>45)go(dx<0?i+1:i-1);else go(i);x0=null;play()},{passive:true});
 sl.addEventListener('mouseenter',stop);sl.addEventListener('mouseleave',play);
 document.addEventListener('visibilitychange',function(){document.hidden?stop():play()});
 play();
}

/* ---- filter + sort + search ---- */
var res=document.getElementById('results');
if(res){
 var q=document.getElementById('fq'),sel=document.getElementById('sort'),
     cnt=document.getElementById('count'),non=document.getElementById('none'),
     cards=[].slice.call(res.children),order=cards.slice();
 var url=new URLSearchParams(location.search);
 if(url.get('q')&&q)q.value=url.get('q');
 function apply(){
  var v=(q&&q.value||'').trim().toLowerCase(),m=0;
  cards.forEach(function(c){
   var ok=!v||c.dataset.name.toLowerCase().indexOf(v)>-1||c.dataset.code.toLowerCase().indexOf(v)>-1;
   c.classList.toggle('hide',!ok); if(ok)m++;
  });
  cnt.textContent=m+(m===1?' piece':' pieces');
  non.style.display=m?'none':'block';
  var s=sel.value,a=order.slice();
  if(s==='name')a.sort(function(x,y){return x.dataset.name.localeCompare(y.dataset.name)});
  if(s==='price-asc')a.sort(function(x,y){return x.dataset.price-y.dataset.price});
  if(s==='price-desc')a.sort(function(x,y){return y.dataset.price-x.dataset.price});
  a.forEach(function(c){res.appendChild(c)});
 }
 if(q)q.addEventListener('input',apply);
 sel.addEventListener('change',apply);
 apply();
}

/* ---- product gallery ---- */
var main=document.querySelector('.gal .main img');
document.querySelectorAll('.thumbs button').forEach(function(t){
 t.addEventListener('click',function(){
  document.querySelectorAll('.thumbs button').forEach(function(x){x.setAttribute('aria-current','false')});
  t.setAttribute('aria-current','true'); if(main)main.src=t.dataset.full;
 });
});

/* ---- cart page ---- */
var root=document.getElementById('cart-root');
if(root&&document.getElementById('lines')){
 var WAB='https://wa.me/923357779940?text=';
 function render(){
  var c=read(),L=document.getElementById('lines'),cw=document.getElementById('cw'),mt=document.getElementById('mt');
  if(!c.length){cw.style.display='none';mt.style.display='block';return}
  cw.style.display='';mt.style.display='none';
  L.innerHTML=c.map(function(i){return '<div class="line"><a class="th" href="/product/'+i.slug+'/"><img src="'+i.img+'" alt=""></a>'+
   '<div class="meta"><div class="c">'+i.code+'</div><h3>'+i.name+'</h3><div class="p">'+money(i.price)+'</div>'+
   '<div class="qty"><button data-a="-" data-c="'+i.code+'" aria-label="Decrease">&minus;</button><span>'+i.q+'</span>'+
   '<button data-a="+" data-c="'+i.code+'" aria-label="Increase">+</button></div><br>'+
   '<button class="rm" data-a="x" data-c="'+i.code+'">Remove</button></div></div>'}).join('');
  var tot=c.reduce(function(a,i){return a+i.price*i.q},0);
  document.getElementById('subtotal').textContent=money(tot);
  document.getElementById('total').textContent=money(tot);
 }
 document.addEventListener('click',function(e){
  var b=e.target.closest('[data-a]'); if(!b)return;
  var c=read(),it=c.filter(function(x){return x.code===b.dataset.c})[0]; if(!it)return;
  if(b.dataset.a==='+')it.q++;
  if(b.dataset.a==='-')it.q=Math.max(1,it.q-1);
  if(b.dataset.a==='x')c=c.filter(function(x){return x.code!==b.dataset.c});
  write(c);render();
 });
 document.getElementById('place').addEventListener('click',function(){
  var g=function(id){return (document.getElementById(id).value||'').trim()},
      nm=g('f-name'),ph=g('f-phone'),ad=g('f-addr'),ct=g('f-city'),nt=g('f-note'),
      pay=(document.querySelector('input[name=pay]:checked')||{}).value,
      err=document.getElementById('err');
  if(!nm||!ph||!ad||!ct){err.textContent='Please fill your name, phone, address and city.';err.style.display='block';return}
  if(!/^[0-9+\-\s()]{10,}$/.test(ph)){err.textContent='Please enter a valid phone number.';err.style.display='block';return}
  err.style.display='none';
  var c=read(),tot=c.reduce(function(a,i){return a+i.price*i.q},0),
      t='*NEW ORDER \u2014 Kent Furniture*\n\n';
  c.forEach(function(i){t+='\u2022 '+i.name+' ('+i.code+') x'+i.q+' \u2014 '+money(i.price*i.q)+'\n'});
  t+='\n*Total:* '+money(tot)+'\n*Payment:* '+pay+'\n\n*Name:* '+nm+'\n*Phone:* '+ph+
     '\n*Address:* '+ad+'\n*City:* '+ct+(nt?'\n*Note:* '+nt:'')+
     '\n\nPlease confirm delivery charges and timing.';
  window.open(WAB+encodeURIComponent(t),'_blank');
 });
 render();
}
paint();
})();
