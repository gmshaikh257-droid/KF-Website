
(function(){
'use strict';
var K='kent_cart_v3';
function abs(u){try{return new URL(u,location.href).href}catch(e){return u}}
function read(){
  var c;try{c=JSON.parse(localStorage.getItem(K))||[]}catch(e){c=window.__c||[]}
  if(!Array.isArray(c))return [];
  return c.filter(function(i){return i&&typeof i.code==='string'&&typeof i.name==='string'&&isFinite(i.price)&&i.q>0&&i.q<100});
}
function write(c){window.__c=c;try{localStorage.setItem(K,JSON.stringify(c))}catch(e){}paint()}
function qty(){return read().reduce(function(a,i){return a+i.q},0)}
function total(){return read().reduce(function(a,i){return a+i.price*i.q},0)}
function money(v){return 'PKR '+v.toLocaleString('en-PK')}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

var bar=document.getElementById('cartbar');
function paint(){
  var n=qty();
  document.querySelectorAll('.cn').forEach(function(e){e.textContent=n||'';e.style.display=n?'':'none'});
  document.body.classList.toggle('has-cart',n>0);
  if(bar){
    if(n>0){
      bar.hidden=false;
      document.getElementById('cb-n').textContent=n;
      document.getElementById('cb-lbl').textContent=n+(n===1?' item in cart':' items in cart');
      document.getElementById('cb-sum').textContent=money(total());
      requestAnimationFrame(function(){bar.classList.add('show')});
    }else{
      bar.classList.remove('show');
      setTimeout(function(){bar.hidden=true},350);
    }
  }
}

/* ---------- reveal on scroll ---------- */
if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -30px'});
  document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
}else{document.querySelectorAll('.rv').forEach(function(e){e.classList.add('in')})}

/* ---------- add to cart ---------- */
var toast=document.getElementById('toast'),tt=null;
document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-add]'); if(!b)return;
  ev.preventDefault();
  var d=b.dataset,c=read(),f=c.filter(function(i){return i.code===d.code})[0];
  if(f){f.q++}
  else{c.push({code:d.code,name:d.pname,price:+d.price,img:abs(d.img),url:abs(d.href||b.getAttribute('data-href')||'#'),q:1})}
  write(c);
  document.querySelectorAll('.cn,.cb-n').forEach(function(x){x.classList.add('pop');setTimeout(function(){x.classList.remove('pop')},320)});
  if(toast){toast.classList.add('show');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('show')},1700)}
  if(b.classList.contains('qa')){
    b.classList.add('ok');setTimeout(function(){b.classList.remove('ok')},1100);
  }else{
    var o=b.innerHTML;b.classList.add('ok');b.textContent='Added';
    setTimeout(function(){b.classList.remove('ok');b.innerHTML=o},1200);
  }
});

/* ---------- drawer ---------- */
var burger=document.getElementById('burger'),drawer=document.getElementById('drawer'),dclose=document.getElementById('dclose');
function setDrawer(open){
  if(!drawer)return;
  if(open){drawer.hidden=false;requestAnimationFrame(function(){drawer.classList.add('open')})}
  else{drawer.classList.remove('open');setTimeout(function(){drawer.hidden=true},300)}
  if(burger)burger.setAttribute('aria-expanded',open?'true':'false');
  document.body.style.overflow=open?'hidden':'';
}
if(burger)burger.addEventListener('click',function(){setDrawer(drawer.hidden)});
if(dclose)dclose.addEventListener('click',function(){setDrawer(false)});
if(drawer)drawer.addEventListener('click',function(e){if(e.target===drawer)setDrawer(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setDrawer(false)});

/* ---------- mobile search toggle ---------- */
var st=document.getElementById('sbtoggle'),ms=document.getElementById('msearch');
if(st&&ms)st.addEventListener('click',function(){
  var o=ms.classList.toggle('open');
  st.setAttribute('aria-expanded',o?'true':'false');
  if(o){var i=ms.querySelector('input');if(i)i.focus()}
});

/* ---------- hero slider ---------- */
var sl=document.getElementById('hero-slider');
if(sl){
  var tr=sl.querySelector('.slides'),len=tr.children.length,
      dots=[].slice.call(sl.querySelectorAll('.dots button')),i=0,timer=null,
      red=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function go(k){i=(k+len)%len;tr.style.transform='translateX('+(-i*100)+'%)';
    dots.forEach(function(d,j){d.setAttribute('aria-current',j===i?'true':'false')})}
  function play(){if(red)return;stop();timer=setInterval(function(){go(i+1)},4500)}
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

/* ---------- filter + sort + search ---------- */
var res=document.getElementById('results');
if(res){
  var fq=document.getElementById('fq'),sel=document.getElementById('sort'),
      ffam=document.getElementById('ffam'),fpr=document.getElementById('fprice'),
      clr=document.getElementById('clearf'),
      cnt=document.getElementById('count'),non=document.getElementById('none'),
      cards=[].slice.call(res.children),order=cards.slice();
  var url=new URLSearchParams(location.search);
  if(url.get('q')&&fq)fq.value=url.get('q');
  if(url.get('fam')&&ffam)ffam.value=url.get('fam');
  function apply(){
    var v=(fq&&fq.value||'').trim().toLowerCase(),
        fam=ffam?ffam.value:'', pr=fpr?fpr.value:'', m=0,
        lo=0,hi=1e9;
    if(pr){var b=pr.split('-');lo=+b[0];hi=+b[1]}
    cards.forEach(function(c){
      var price=+c.dataset.price;
      var ok = (!v||c.dataset.name.toLowerCase().indexOf(v)>-1||c.dataset.code.toLowerCase().indexOf(v)>-1)
            && (!fam||c.dataset.fam===fam)
            && (price>=lo&&price<=hi);
      c.classList.toggle('hide',!ok); if(ok)m++;
    });
    cnt.textContent=m+(m===1?' piece':' pieces');
    non.style.display=m?'none':'block';
    if(clr)clr.hidden=!(v||fam||pr||sel.value!=='default');
    var s=sel.value,a=order.slice();
    if(s==='name')a.sort(function(x,y){return x.dataset.name.localeCompare(y.dataset.name)});
    if(s==='price-asc')a.sort(function(x,y){return x.dataset.price-y.dataset.price});
    if(s==='price-desc')a.sort(function(x,y){return y.dataset.price-x.dataset.price});
    a.forEach(function(c){res.appendChild(c)});
  }
  [fq,ffam,fpr,sel].forEach(function(e){if(e)e.addEventListener(e.tagName==='INPUT'?'input':'change',apply)});
  if(clr)clr.addEventListener('click',function(){
    if(fq)fq.value='';if(ffam)ffam.value='';if(fpr)fpr.value='';sel.value='default';apply();
  });
  apply();
}

/* ---------- product gallery ---------- */
var main=document.querySelector('.gal .main img');
document.querySelectorAll('.thumbs button').forEach(function(t){
  t.addEventListener('click',function(){
    document.querySelectorAll('.thumbs button').forEach(function(x){x.setAttribute('aria-current','false')});
    t.setAttribute('aria-current','true');
    if(main){main.src=t.dataset.full; if(t.dataset.bg) main.parentNode.style.setProperty('--bg','url('+t.dataset.bg+')')}
  });
});

/* ---------- cart page ---------- */
if(document.getElementById('lines')){
  var WAB='https://wa.me/923357779940?text=';
  function render(){
    var c=read(),L=document.getElementById('lines'),cw=document.getElementById('cw'),mt=document.getElementById('mt');
    if(!c.length){cw.style.display='none';mt.style.display='block';return}
    cw.style.display='';mt.style.display='none';
    L.innerHTML=c.map(function(i){return '<div class="line"><a class="th" href="'+esc(i.url)+'"><img src="'+esc(i.img)+'" alt=""></a>'+
      '<div class="meta"><div class="c">'+esc(i.code)+'</div><h3>'+esc(i.name)+'</h3><div class="p">'+money(i.price)+'</div>'+
      '<div class="qty"><button data-a="-" data-c="'+i.code+'" aria-label="Decrease">&minus;</button><span>'+i.q+'</span>'+
      '<button data-a="+" data-c="'+i.code+'" aria-label="Increase">+</button></div><br>'+
      '<button class="rm" data-a="x" data-c="'+i.code+'">Remove</button></div></div>'}).join('');
    document.getElementById('subtotal').textContent=money(total());
    document.getElementById('total').textContent=money(total());
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-a]'); if(!b)return;
    var c=read(),it=c.filter(function(x){return x.code===b.dataset.c})[0]; if(!it)return;
    if(b.dataset.a==='+')it.q++;
    if(b.dataset.a==='-')it.q=Math.max(1,it.q-1);
    if(b.dataset.a==='x')c=c.filter(function(x){return x.code!==b.dataset.c});
    write(c);render();
  });
  var pb=document.getElementById('proceed'),co=document.getElementById('checkout');
  if(pb&&co)pb.addEventListener('click',function(){
    co.hidden=false; pb.hidden=true;
    co.scrollIntoView({behavior:'smooth',block:'start'});
    var f=document.getElementById('f-name'); if(f)setTimeout(function(){f.focus()},400);
  });
  document.getElementById('place').addEventListener('click',function(){
    var g=function(id){return (document.getElementById(id).value||'').trim()},
        nm=g('f-name'),ph=g('f-phone'),ad=g('f-addr'),ct=g('f-city'),nt=g('f-note'),
        pay=(document.querySelector('input[name=pay]:checked')||{}).value,
        err=document.getElementById('err');
    if(!nm||!ph||!ad||!ct){err.textContent='Please fill your name, phone, address and city.';err.style.display='block';return}
    if(!/^[0-9+\-\s()]{10,}$/.test(ph)){err.textContent='Please enter a valid phone number.';err.style.display='block';return}
    err.style.display='none';
    var c=read(),t='*NEW ORDER \u2014 Kent Furniture*\n\n';
    c.forEach(function(i){t+='\u2022 '+i.name+' ('+i.code+') x'+i.q+' \u2014 '+money(i.price*i.q)+'\n'});
    t+='\n*Total:* '+money(total())+'\n*Payment:* '+pay+'\n\n*Name:* '+nm+'\n*Phone:* '+ph+
       '\n*Address:* '+ad+'\n*City:* '+ct+(nt?'\n*Note:* '+nt:'')+
       '\n\nPlease confirm delivery charges and timing.';
    window.open(WAB+encodeURIComponent(t),'_blank');
  });
  render();
}
paint();
})();
