(function(){
  var target=new Date(2026,10,6,0,0,0).getTime();
  var cEl=document.getElementById('count'),lock=document.getElementById('lock'),main=document.getElementById('main');
  var unlocked=false;
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    var d=target-Date.now();
    if(d<=0){unlock();return}
    var s=Math.floor(d/1000);
    var v=[[Math.floor(s/86400),'Days'],[Math.floor(s%86400/3600),'Hours'],[Math.floor(s%3600/60),'Min'],[s%60,'Sec']];
    cEl.innerHTML=v.map(function(x){return '<div class="box"><b>'+pad(x[0])+'</b><small>'+x[1]+'</small></div>'}).join('');
  }
  function unlock(){
    if(unlocked)return;unlocked=true;
    lock.classList.add('hidden');main.classList.remove('hidden');
    window.scrollTo(0,0);setupScratch();burst();observe();
  }
  tick();setInterval(tick,1000);
  var pk=document.getElementById('peek');
  if(/preview/.test(location.search))pk.classList.add('preview-visible');
  pk.onclick=unlock;
  document.getElementById('boom').onclick=burst;

  // floating emojis
  var fl=document.getElementById('float'),em=['🎈','💖','✨','🌸','🎉','🍰'];
  for(var i=0;i<16;i++){var s=document.createElement('span');s.textContent=em[i%em.length];
    s.style.left=Math.random()*100+'%';s.style.animationDuration=(9+Math.random()*10)+'s';s.style.animationDelay=(-Math.random()*14)+'s';fl.appendChild(s)}

  // scratch card
  function setupScratch(){
    var c=document.getElementById('sc'),box=c.parentElement,w=box.clientWidth,h=box.clientHeight,dpr=window.devicePixelRatio||1;
    c.width=w*dpr;c.height=h*dpr;var x=c.getContext('2d');x.scale(dpr,dpr);
    var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#ff8fb8');g.addColorStop(.5,'#ffc27a');g.addColorStop(1,'#ff8fb8');
    x.fillStyle=g;x.fillRect(0,0,w,h);
    x.fillStyle='#ffffffcc';x.font='600 20px Poppins,sans-serif';x.textAlign='center';x.fillText('✨ Scratch here ✨',w/2,h/2+6);
    var down=false,done=false,n=0;
    function pos(e){var r=c.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}
    function sc(e){if(!down||done)return;var p=pos(e);x.globalCompositeOperation='destination-out';x.beginPath();x.arc(p[0],p[1],20,0,7);x.fill();
      if(++n%8===0)check()}
    function check(){
      var d=x.getImageData(0,0,c.width,c.height).data,t=0,k=0;
      for(var i=3;i<d.length;i+=64){k++;if(d[i]===0)t++}
      if(t/k>.5){done=true;c.style.opacity=0;c.style.pointerEvents='none';document.getElementById('hint').textContent='Surprise! 🎉 Scroll down ↓';burst()}
    }
    c.addEventListener('pointerdown',function(e){down=true;c.setPointerCapture(e.pointerId);sc(e)});
    c.addEventListener('pointermove',sc);
    c.addEventListener('pointerup',function(){down=false});
  }

  // scroll reveal
  function observe(){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('in')})},{threshold:.25});
    document.querySelectorAll('.mem').forEach(function(m){io.observe(m)});
  }

  // confetti
  var fx=document.getElementById('fx'),f=fx.getContext('2d'),parts=[],run=false;
  function size(){fx.width=innerWidth;fx.height=innerHeight}size();addEventListener('resize',size);
  function burst(){
    var cols=['#ff4d8d','#ffb347','#7be0c3','#8ab4ff','#ffd6e5','#fff'];
    for(var i=0;i<140;i++)parts.push({x:innerWidth/2,y:innerHeight/3,vx:(Math.random()-.5)*14,vy:Math.random()*-12-2,r:Math.random()*6+3,c:cols[i%cols.length],a:1,rot:Math.random()*6});
    if(!run){run=true;loop()}
  }
  function loop(){
    f.clearRect(0,0,fx.width,fx.height);
    parts=parts.filter(function(p){return p.a>0.02});
    parts.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.vy+=.25;p.vx*=.99;p.a-=.008;p.rot+=.1;
      f.save();f.globalAlpha=Math.max(p.a,0);f.translate(p.x,p.y);f.rotate(p.rot);f.fillStyle=p.c;f.fillRect(-p.r,-p.r/2,p.r*2,p.r);f.restore()});
    if(parts.length)requestAnimationFrame(loop);else run=false;
  }
})();