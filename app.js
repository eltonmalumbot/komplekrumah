import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const $=id=>document.getElementById(id);
const scene=new THREE.Scene();scene.background=new THREE.Color('#a8cbcb');scene.fog=new THREE.FogExp2('#b0cebc',0.0026);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.42;$('stage').appendChild(renderer.domElement);
const camera=new THREE.PerspectiveCamera(47,innerWidth/innerHeight,.12,1800);
camera.position.set(-143,135,150);const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=true;controls.dampingFactor=.065;controls.maxPolarAngle=1.47;controls.minDistance=24;controls.maxDistance=350;controls.enablePan=true;controls.mouseButtons.LEFT=THREE.MOUSE.ROTATE;
scene.add(new THREE.HemisphereLight(0xeaf9ff,0x678f65,2.1));const sun=new THREE.DirectionalLight(0xfff1c9,3);sun.position.set(-100,145,50);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-240;sun.shadow.camera.right=240;sun.shadow.camera.top=240;sun.shadow.camera.bottom=-240;sun.shadow.normalBias=.035;scene.add(sun);
const mat=(color,roughness=1,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const groundMat=mat('#54785d'),grass=mat('#658b68'),grass2=mat('#638762'), asphalt=mat('#525c59'),pavement=mat('#b4afa0'),lane=mat('#dbd6b6'),drain=mat('#7c9e99'),water=mat('#64b4c4',.36),cream=mat('#e5e0ce'),black=mat('#303a35'),metal=mat('#58665f',.55,.15),white=mat('#f2ead6'),windowMat=mat('#537d83',.22,.2);
const mesh=(geo,ma,x=0,y=0,z=0,cast=false)=>{const m=new THREE.Mesh(geo,ma);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;scene.add(m);return m;};
const box=(w,h,d,ma,x,y,z,cast=false)=>mesh(new THREE.BoxGeometry(w,h,d),ma,x,y,z,cast);
const ground=mesh(new THREE.PlaneGeometry(2200,2200),groundMat);ground.rotation.x=-Math.PI/2;
const rngSeed=71304;let seed=rngSeed;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const choose=a=>a[Math.floor(rand()*a.length)];
// Reference reconstruction: a diagonal cluster block approximating the submitted screenshot.
// Coordinates use a local design grid; geometry is intentionally NOT a cadastral survey.
const BLOCK_W=142,BLOCK_H=111,SPACING=24,ROWS=4;const group=new THREE.Group();scene.add(group);
const roads=[];const houses=[];const colliders=[];const v=(x,z)=>new THREE.Vector3(x,0,z);
function blockGroup(g,w,h,d,ma,x,y,z,cast=false){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),ma);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;g.add(m);return m;}
function road(x,z,w,d){const m=blockGroup(group,w,.10,d,asphalt,x,.065,z);roads.push({x,z,w,d});return m;}
const roadWidth=12, blockLength=152;
road(0,-78,172,roadWidth);road(0,78,172,roadWidth);
for(let i=0;i<5;i++){const z=-62+i*31;road(0,z,172,8);}
road(-86,0,roadWidth,181);road(86,0,roadWidth,181);
// Entrance spine, connectors and larger external access road
road(-108,-18,30,12);road(-133,-24,20,12);road(-150,-30,23,13);
road(-173,-43,26,120);
road(115,7,60,16);
const trees=[];
const leafMats=['#4e805c','#638d5d','#397553','#6c965b','#366c50'].map(c=>mat(c));
const trunkMat=mat('#6a5a43');
function tree(parent,x,z,size=1){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22*size,.3*size,2.5*size,6),trunkMat);trunk.position.set(x,1.3*size,z);trunk.castShadow=true;parent.add(trunk);
const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.7*size,1),choose(leafMats));crown.position.set(x,3.9*size,z);crown.castShadow=true;parent.add(crown);trees.push({x,z});}
function bush(parent,x,z,scale){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(scale,0),choose(leafMats));m.position.set(x,scale*.72,z);parent.add(m);}
function house(i,x,z,orient=1){
 const lot=new THREE.Group();group.add(lot);lot.position.set(x,0,z);
 const plot=blockGroup(lot,11,.12,18,choose([grass,grass2]),0,.13,0);
 // Schematic perimeter fence and garden with a driveway
 blockGroup(lot,10,.2,.18,cream,0,.45,8.8);blockGroup(lot,.14,.45,17,cream,-5.45,.4,0);blockGroup(lot,.14,.45,17,cream,5.45,.4,0);
 blockGroup(lot,3,.07,8.5,pavement,2.5,.25,4);
 const houseBase=blockGroup(lot,8.3,3.8,8.4,choose([mat('#f1e6d4'),mat('#dfddd0'),mat('#e4dccb'),mat('#f0e8d9')]),-.45,2.04,-2.2,true);
 const roofmat=choose([mat('#985e48'),mat('#81604d'),mat('#5a5552'),mat('#a16b54')]);
 const roof=new THREE.Mesh(new THREE.ConeGeometry(7.35,2.2,4),roofmat);roof.rotation.y=Math.PI/4;roof.scale.z=1.08;roof.position.set(-.45,5.13,-2.2);roof.castShadow=true;lot.add(roof);
 // front facade
 blockGroup(lot,2.1,2.45,.12,mat('#8e6b4b'),-2.2,1.4,2.06);
 blockGroup(lot,2.05,1.55,.13,windowMat,.45,2.2,2.07);blockGroup(lot,2.17,.1,.19,white,.45,2.96,2.16);blockGroup(lot,.08,1.65,.18,white,.45,2.2,2.16);
 blockGroup(lot,2.6,.24,.75,roofmat,2.65,3.25,2.42);
 blockGroup(lot,1.95,2.6,2.55,mat('#e3ded1'),3.05,1.35,4.6,true); // carport column / porch
 blockGroup(lot,.15,2.5,2.55,cream,3.9,1.4,4.6);
 blockGroup(lot,3.3,.08,5.5,pavement,2.5,.28,5.9);
 blockGroup(lot,2.6,.65,.12,metal,-2.1,.78,8.85);
 const flower=choose([mat('#d29e6e'),mat('#b7a28d'),mat('#b5a987')]);blockGroup(lot,1.2,.29,1.1,flower,-3.9,.3,5.4);bush(lot,-4,5.4,.62);
 const s=.55+rand()*.3;bush(lot,4.5,-5,s);
 lot.rotation.y=orient===1?0:Math.PI;
 lot.userData={type:'home',number:String(i+1).padStart(3,'0'),location:'Conceptual building plot',model:'Reconstructed RS-style residential model'};houses.push(lot);
 return lot;
}
// 4 rows of paired houses along the internal street grid; 96 conceptual parcels.
let count=0;for(let row=0;row<4;row++){for(let side=0;side<2;side++){for(let col=0;col<12;col++){const x=-70+col*12.6;const z=-66+row*31+(side===0?10.7:20.1);house(count++,x,z,side===0?1:-1);}}}
for(let i=0;i<5;i++){const z=-79+i*31;for(let x=-94;x<=94;x+=18){if(rand()>.15)tree(group,x,z+((i%2)?3.2:-3.2),.75+rand()*.4);}}
for(let i=0;i<22;i++){const x=-230+rand()*500,z=-235+rand()*450;if(Math.abs(x)<108&&Math.abs(z)<106)continue;tree(scene,x,z,1+rand()*1.8);}
// Surrounding abstract agricultural/green plots
for(let j=0;j<25;j++){const x=-315+rand()*630,z=-300+rand()*600;if(Math.abs(x)<120&&Math.abs(z)<105)continue;
const p=box(12+rand()*25,.04,18+rand()*32,choose([grass,grass2,mat('#819d6b'),mat('#72946b')]),x,.035,z);p.rotation.y=rand()*1.2;}
const pond=mesh(new THREE.PlaneGeometry(260,11),water,0,.14,0);pond.rotation.x=-Math.PI/2;pond.position.set(0,.14,130);pond.rotation.z=.4;
const banks=box(260,.15,2,mat('#93a48c'),0,.09,137);banks.rotation.y=-.4;
// Optional divider / entry structure and street lamps
function lamp(g,x,z){const pole=blockGroup(g,.16,5,.16,metal,x,2.5,z);const light=blockGroup(g,1.4,.17,.5,cream,x,5.05,z);return light;}
for(let i=0;i<5;i++)for(let j=0;j<7;j++)lamp(group,-76+j*24,-74+i*31);
blockGroup(group,9,.18,3,cream,-91,4.5,-22);
blockGroup(group,.45,4.5,.45,black,-94,2.3,-22);blockGroup(group,.45,4.5,.45,black,-87,2.3,-22);
const sign=blockGroup(group,6,1.45,.28,mat('#e0dbcc'),-90.5,3.2,-22);
const lettering=document.createElement('canvas');lettering.width=512;lettering.height=128;const lc=lettering.getContext('2d');lc.fillStyle='#16332b';lc.font='bold 36px sans-serif';lc.textAlign='center';lc.fillText('PASAI TIMUR',256,62);lc.font='18px sans-serif';lc.fillText('MODERNLAND CILEJIT',256,99);
const signt=new THREE.CanvasTexture(lettering);signt.colorSpace=THREE.SRGBColorSpace;const signboard=new THREE.Mesh(new THREE.PlaneGeometry(5.7,1.3),new THREE.MeshBasicMaterial({map:signt,transparent:true}));signboard.position.set(-90.5,3.2,-21.82);group.add(signboard);
// Direction of the screenshot block, rendered in-world as a tilted plan.
group.rotation.y=-.53;
const observer=new THREE.Vector3();
const defaultPosition=new THREE.Vector3(-143,135,150);const defaultTarget=new THREE.Vector3(0,0,0);
const pointer=new THREE.Vector2(),raycaster=new THREE.Raycaster();let mode='drone',time='day',yaw=2.6,pitch=-.12,walkPos=new THREE.Vector3(-99,1.75,-22),lastTime=performance.now(),dragging=false,dragX=0,dragY=0,lookTouch=null,joystick={x:0,y:0},audioCtx=null,oscillator=null;
function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2600);}
function showInfo(home){const data=home?.userData;const p=$('infoContent');if(data?.type==='home'){p.innerHTML='<span class="eyebrow soft">BUILDING / '+data.number+'</span><h2>Residential Plot<br/>#'+data.number+'</h2><p>Model rumah satu lantai konseptual yang dibuat untuk prototipe eksplorasi kawasan. Belum merepresentasikan alamat, kepemilikan, atau ukuran rumah yang sebenarnya.</p><div class="data-line"><span>Jenis objek</span><strong>MODEL 3D</strong></div><div class="data-line"><span>Ketelitian</span><strong>ILUSTRATIF</strong></div><div class="disclaimer">Nomor rumah di sini hanya ID objek simulasi, bukan nomor rumah asli.</div>';}else p.innerHTML='<span class="eyebrow soft">TENTANG PROYEK</span><h2>Eksplorasi digital<br/>Pasai Timur.</h2><p>Rekonstruksi konseptual mengikuti pola jalan pada screenshot yang dikirim. Belum merupakan hasil survei, pemetaan kavling atau fotogrametri.</p><div class="data-line"><span>Lokasi acuan</span><strong>MODERNLAND CILEJIT</strong></div><div class="data-line"><span>Denah</span><strong>REKONSTRUKSI</strong></div><div class="disclaimer">Siluet rumah adalah model generatif bergaya tipe rumah 1 lantai.</div>';$('infoPanel').classList.add('open');}
const onWalk=()=>{mode='walk';$('intro').classList.add('hidden');$('walkBtn').classList.add('selected');$('droneBtn').classList.remove('selected');$('viewLabel').textContent='STREET VIEW';$('mobileControls').classList.add('active');$('crosshair').classList.add('visible');controls.enabled=false;camera.position.copy(walkPos);updateWalkCamera();toast('Mode berjalan · WASD / joystick');};
const onDrone=()=>{mode='drone';$('intro').classList.add('hidden');$('droneBtn').classList.add('selected');$('walkBtn').classList.remove('selected');$('viewLabel').textContent='DRONE VIEW';$('mobileControls').classList.remove('active');$('crosshair').classList.remove('visible');camera.position.set(-110,102,120);controls.target.set(0,0,0);controls.enabled=true;controls.update();};
$('walkStart').onclick=onWalk;$('droneStart').onclick=onDrone;$('walkBtn').onclick=onWalk;$('droneBtn').onclick=onDrone;$('mobileExit').onclick=onDrone;
$('resetBtn').onclick=()=>{if(mode==='drone'){camera.position.copy(defaultPosition);controls.target.copy(defaultTarget);controls.update();}else{walkPos.set(-99,1.75,-22);yaw=2.6;pitch=-.12;updateWalkCamera();}toast('Posisi kamera di-reset');};
$('infoClose').onclick=()=>$('infoPanel').classList.remove('open');
$('helpToggle').onclick=()=>$('helpModal').classList.add('open');$('helpClose').onclick=$('helpDone').onclick=()=>$('helpModal').classList.remove('open');
$('mapToggle').onclick=()=>{$('minimapWrap').classList.toggle('collapsed');$('mapToggle').textContent=$('minimapWrap').classList.contains('collapsed')?'⌃':'⌄';};
function setTime(t){time=t;$('dayBtn').classList.toggle('selected',t==='day');$('eveningBtn').classList.toggle('selected',t==='evening');$('sceneLabel').textContent=t==='day'?'DAYLIGHT':'GOLDEN HOUR';scene.background.set(t==='day'?'#a8cbcb':'#d6a58f');scene.fog.color.set(t==='day'?'#b0cebc':'#bca28b');sun.color.set(t==='day'?'#fff1c9':'#ffb97d');sun.intensity=t==='day'?3:2.25;sun.position.set(t==='day'?-100:-140,t==='day'?145:42,50);renderer.toneMappingExposure=t==='day'?1.42:1.12;}
$('dayBtn').onclick=()=>setTime('day');$('eveningBtn').onclick=()=>setTime('evening');
$('soundToggle').onclick=()=>{if(!audioCtx){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();oscillator=audioCtx.createOscillator();const gain=audioCtx.createGain();oscillator.type='sine';oscillator.frequency.value=135;gain.gain.value=.006;oscillator.connect(gain).connect(audioCtx.destination);oscillator.start();$('soundToggle').textContent='◉';toast('Suara ambient sederhana aktif');}catch(e){toast('Audio tidak didukung');}}else{oscillator.stop();audioCtx.close();oscillator=null;audioCtx=null;$('soundToggle').textContent='◌';}};
const keys={};addEventListener('keydown',e=>{keys[e.code]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='Escape'&&document.pointerLockElement)document.exitPointerLock();if(e.code==='KeyR')$('resetBtn').click();});addEventListener('keyup',e=>keys[e.code]=false);
function updateWalkCamera(){camera.position.copy(walkPos);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;}
renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;dragX=e.clientX;dragY=e.clientY;if(mode==='walk'&&e.pointerType==='mouse'&& !matchMedia('(pointer:coarse)').matches)renderer.domElement.requestPointerLock?.();});
renderer.domElement.addEventListener('pointerup',e=>{dragging=false;});
addEventListener('pointermove',e=>{if(mode!=='walk')return;if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.0025;pitch=Math.max(-1.25,Math.min(.95,pitch-e.movementY*.002));}else if(dragging){yaw-=(e.clientX-dragX)*.004;pitch=Math.max(-1.2,Math.min(.9,pitch-(e.clientY-dragY)*.003));dragX=e.clientX;dragY=e.clientY;}});
renderer.domElement.addEventListener('click',e=>{if(mode!=='drone')return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(houses,true);if(hits.length){let p=hits[0].object;while(p&&!p.userData?.type)p=p.parent;if(p)showInfo(p);}});
const js=$('joystick'),knob=$('joystickKnob');function moveStick(e){const r=js.getBoundingClientRect();const x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2);const l=Math.hypot(x,y),k=Math.min(l,34)/(l||1);const ax=x*k,ay=y*k;joystick.x=ax/34;joystick.y=-ay/34;knob.style.transform='translate('+ax+'px,'+ay+'px)';}js.addEventListener('pointerdown',e=>{js.setPointerCapture(e.pointerId);moveStick(e);});js.addEventListener('pointermove',e=>{if(js.hasPointerCapture(e.pointerId))moveStick(e);});const endStick=()=>{joystick.x=0;joystick.y=0;knob.style.transform='';};js.addEventListener('pointerup',endStick);js.addEventListener('pointercancel',endStick);
const cv=$('minimap'),ctx=cv.getContext('2d');
function minimap(){const w=cv.width,h=cv.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#18352f';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(w/2,h/2);ctx.rotate(-.53);const s=2;ctx.scale(s,s);ctx.fillStyle='#334741';ctx.fillRect(-89,-85,178,170);ctx.fillStyle='#88988d';for(const r of roads)ctx.fillRect(r.x-r.w/2,r.z-r.d/2,r.w,r.d);ctx.fillStyle='#b0bbab';for(let row=0;row<4;row++)for(let side=0;side<2;side++)for(let col=0;col<12;col++){ctx.fillRect(-70+col*12.6-4,-66+row*31+(side===0?10.7:20.1)-5,8,10);}ctx.fillStyle='#79ae89';for(const t of trees) {ctx.beginPath();ctx.arc(t.x,t.z,1.5,0,Math.PI*2);ctx.fill();}ctx.restore();let pos=mode==='walk'?walkPos:controls.target;ctx.fillStyle='#d4f990';ctx.strokeStyle='#112c23';ctx.lineWidth=3;ctx.beginPath();ctx.arc(w/2+pos.x*s,h/2+pos.z*s,7,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#e7f1d8';ctx.font='bold 18px sans-serif';ctx.fillText('N ↑',19,26);}
function animate(t){requestAnimationFrame(animate);const dt=Math.min((t-lastTime)/1000,.05);lastTime=t;if(mode==='drone')controls.update();else {let forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)+joystick.y;let right=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+joystick.x;const len=Math.max(1,Math.hypot(forward,right));forward/=len;right/=len;let speed=keys.ShiftLeft?18:10;walkPos.x+=(-Math.sin(yaw)*forward+Math.cos(yaw)*right)*speed*dt;walkPos.z+=(-Math.cos(yaw)*forward-Math.sin(yaw)*right)*speed*dt;walkPos.x=THREE.MathUtils.clamp(walkPos.x,-215,215);walkPos.z=THREE.MathUtils.clamp(walkPos.z,-190,190);updateWalkCamera();}if(t%180<22)minimap();renderer.render(scene,camera);}
$('unitCount').textContent=String(houses.length);setTime('day');$('loadingBar').style.width='100%';setTimeout(()=>{$('loader').style.opacity='0';setTimeout(()=>$('loader').remove(),720);},550);animate(performance.now());
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
