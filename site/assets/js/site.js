(function(){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px'});
 document.querySelectorAll('.rv').forEach(function(e){io.observe(e)});
 var n=0;
 document.addEventListener('click',function(ev){
  var b=ev.target.closest('[data-add]'); if(!b)return;
  n++; document.querySelectorAll('.cn').forEach(function(x){x.textContent=n;x.classList.add('pop');setTimeout(function(){x.classList.remove('pop')},320)});
  var t=b.innerHTML; b.classList.add('ok'); b.innerHTML='Added';
  setTimeout(function(){b.classList.remove('ok');b.innerHTML=t},1200);
 });
 var q=document.getElementById('q'), cards=[].slice.call(document.querySelectorAll('[data-name]'));
 if(q)q.addEventListener('input',function(){var v=q.value.toLowerCase();
  cards.forEach(function(c){c.style.display=(c.dataset.name.toLowerCase().indexOf(v)>-1||c.dataset.code.toLowerCase().indexOf(v)>-1)?'':'none'})});
 document.querySelectorAll('[data-chip]').forEach(function(ch){ch.addEventListener('click',function(){
  document.querySelectorAll('[data-chip]').forEach(function(x){x.setAttribute('aria-pressed','false')});
  ch.setAttribute('aria-pressed','true');});});
})();
