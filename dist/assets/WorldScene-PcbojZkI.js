import{P as p}from"./phaser-DBy6FrJS.js";import{PLAYER_SPEED as P,INTERACT_RADIUS as $,SCENE_KEYS as v,PLAYER_SPAWN as M,TILE_SIZE as d,ZOOM as L,MAP_WIDTH as b,MAP_HEIGHT as x,TILESET_KEY as A,TILES as k,ZONES as r,OBJECT_TYPES as E}from"./gameConfig-D5w6vaLC.js";import{p as j,s as J,A as w}from"./AudioManager-CmC_a3V4.js";import{c as N,v as R,a as B,s as T,b as U,p as z}from"./index-BcV2Zblr.js";import"./phaser-0YPJO2g1.js";class F extends Phaser.Physics.Arcade.Sprite{constructor(e,t,s,i){super(e,t,s,"player"),this.scene=e,this._inputCtrl=i,e.add.existing(this),e.physics.add.existing(this),this.setCollideWorldBounds(!0),this.body.setSize(10,10),this.body.setOffset(3,6),this.setDepth(10),this._facing="down",this._isMoving=!1,this._isJumping=!1,this._dustTimer=0,this._createAnimations(),this._createShadow(),this._createIdleBob()}_createShadow(){this._shadow=this.scene.add.ellipse(this.x,this.y+7,12,5,0,.28).setDepth(9)}_createIdleBob(){this._bobTween=this.scene.tweens.add({targets:this,scaleY:1.02,scaleX:.985,duration:900,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",paused:!0})}_spawnDust(){const e=this.scene.add.circle(this.x+Phaser.Math.Between(-4,4),this.y+6,1.5,16777215,.28).setDepth(8);this.scene.tweens.add({targets:e,y:e.y-4,alpha:0,scale:2.2,duration:420,ease:"Sine.easeOut",onComplete:()=>e.destroy()})}jump(){if(this._isJumping)return;this._isJumping=!0,this._bobTween&&!this._bobTween.paused&&(this._bobTween.pause(),this.setScale(1));const e=this.y;this.scene.tweens.add({targets:this,y:e-14,duration:160,ease:"Quad.easeOut",yoyo:!0,onComplete:()=>{this.y=e,this._isJumping=!1,this._spawnDust(),this.scene.tweens.add({targets:this,scaleY:.88,scaleX:1.12,duration:80,yoyo:!0,ease:"Quad.easeOut",onComplete:()=>this.setScale(1)}),this.scene.tweens.add({targets:this._shadow,scaleX:1.35,scaleY:.6,alpha:.18,duration:80,yoyo:!0,ease:"Quad.easeOut"})}}),this.scene.tweens.add({targets:this._shadow,scaleX:.72,scaleY:.72,alpha:.16,duration:160,ease:"Quad.easeOut"});try{this.scene.sound.play("sfx_interact",{volume:.35})}catch{}}get isJumping(){return this._isJumping}_createAnimations(){const e=this.scene.anims;if(e.exists("walk-down"))return;[{key:"walk-down",start:0},{key:"walk-left",start:3},{key:"walk-right",start:6},{key:"walk-up",start:9}].forEach(({key:s,start:i})=>{e.create({key:s,frames:e.generateFrameNumbers("player",{frames:[i,i+1,i+2]}),frameRate:8,repeat:-1}),e.create({key:s.replace("walk","idle"),frames:e.generateFrameNumbers("player",{frames:[i]}),frameRate:4,repeat:-1})})}update(){this._shadow&&(this._shadow.setPosition(this.x,this.y+7),this._shadow.setAlpha(this._isMoving?.22:.28),this._shadow.setScale(this._isMoving?1.1:1));const e=this._inputCtrl.getDirection(),t=e.x!==0||e.y!==0;if(t){const i=Math.sqrt(e.x*e.x+e.y*e.y);this.setVelocity(e.x/i*P,e.y/i*P),e.y>0?this._facing="down":e.y<0?this._facing="up":e.x<0?this._facing="left":e.x>0&&(this._facing="right")}else this.setVelocity(0,0);t?(this._dustTimer+=this.scene.game.loop.delta,this._dustTimer>110&&(this._dustTimer=0,this._spawnDust()),this._bobTween?.isPaused?.()===!1&&(this._bobTween.pause(),this.setScale(1))):this._bobTween?.isPaused?.()&&this._bobTween.resume();const s=t?`walk-${this._facing}`:`idle-${this._facing}`;this.anims.currentAnim?.key!==s&&this.play(s),this._isMoving=t}destroy(e){this._shadow?.destroy(),this._bobTween?.remove(),super.destroy(e)}get facing(){return this._facing}get isMoving(){return this._isMoving}}class I{constructor(e,t,s,{id:i,type:a,label:n,data:l}){this.scene=e,this.x=t,this.y=s,this.id=i,this.type=a,this.label=n,this.data=l,this._active=!1,this._gfx=null,this._pulseTimer=null,this._createVisual()}_createVisual(){const t={project:440020,skills:1096065,about:8141549,contact:16096779,exit:16096779}[this.type]||8141549,s=this.scene.add.ellipse(this.x,this.y+10,14,6,0,.22).setDepth(4),i=this.scene.add.circle(this.x,this.y,14,t,0).setDepth(5).setStrokeStyle(1.5,t,.5),a=this.scene.add.circle(this.x,this.y,12,t,.22).setDepth(5).setBlendMode(Phaser.BlendModes.ADD),n={project:"🖥️",skills:"📚",about:"👤",contact:"📬",exit:"🚪"},l=this.scene.add.text(this.x,this.y,n[this.type]||"❓",{fontSize:"16px",resolution:2}).setOrigin(.5).setDepth(6);this.scene.tweens.add({targets:l,y:this.y-4,duration:1200+Math.random()*500,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"}),this.scene.tweens.add({targets:a,alpha:{from:.22,to:.48},scale:{from:1,to:1.35},duration:900+Math.random()*300,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"}),this.scene.tweens.add({targets:i,scale:{from:1,to:1.45},alpha:{from:.5,to:0},duration:1400,repeat:-1,ease:"Sine.easeInOut"});const o=[];for(let c=0;c<2;c++){const h=this.scene.add.circle(this.x+Phaser.Math.Between(-8,8),this.y+Phaser.Math.Between(-8,8),1,16777215,.85).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);this.scene.tweens.add({targets:h,y:h.y-10,alpha:0,scale:1.8,duration:1300+c*400,repeat:-1,delay:c*600+Math.random()*800,ease:"Sine.easeInOut"}),o.push(h)}this._shadow=s,this._ring=i,this._glow=a,this._icon=l,this._sparkles=o,this._color=t}setActive(e){this._active!==e&&(this._active=e,this.scene.tweens.add({targets:[this._glow,this._ring],alpha:e?.85:.22,scale:e?1.25:1,duration:220,ease:"Back.easeOut"}),this.scene.tweens.add({targets:this._icon,scale:e?1.18:1,duration:200,ease:"Back.easeOut"}),this.scene.tweens.add({targets:this._shadow,alpha:e?.35:.22,scaleX:e?1.2:1,duration:200}),e&&(this._sparkles.forEach(t=>{t.setPosition(this.x+Phaser.Math.Between(-6,6),this.y),t.setAlpha(1).setScale(.2),this.scene.tweens.add({targets:t,y:t.y-14,alpha:0,scale:2,duration:500,ease:"Sine.easeOut"})}),this.scene.cameras.main.shake(80,.002)))}get isActive(){return this._active}destroy(){this._shadow?.destroy(),this._ring?.destroy(),this._glow?.destroy(),this._icon?.destroy(),this._sparkles?.forEach(e=>e.destroy())}}class Y{constructor(e){this.scene=e,this._cursors=e.input.keyboard.createCursorKeys(),this._wasd=e.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,down:Phaser.Input.Keyboard.KeyCodes.S,left:Phaser.Input.Keyboard.KeyCodes.A,right:Phaser.Input.Keyboard.KeyCodes.D}),this._actionKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),this._jumpKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),this._spaceKey=this._jumpKey,this._escKey=e.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC),this._prevJumpState=!1,this._vDir={up:!1,down:!1,left:!1,right:!1},this._vAction=!1,this._actionConsumed=!1,this._prevActionState=!1,this._isTouchDevice="ontouchstart"in window||navigator.maxTouchPoints>0,this._isTouchDevice&&this._buildVirtualDPad()}_buildVirtualDPad(){const e=document.createElement("div");e.id="virtual-dpad",e.innerHTML=`
      <button id="dpad-empty-tl"></button>
      <button id="dpad-up"    style="grid-column:2;grid-row:1" title="Up">▲</button>
      <button id="dpad-empty-tr"></button>
      <button id="dpad-left"  style="grid-column:1;grid-row:2" title="Left">◀</button>
      <button id="dpad-empty-c" style="grid-column:2;grid-row:2;background:rgba(255,255,255,0.04);border-radius:8px;"></button>
      <button id="dpad-right" style="grid-column:3;grid-row:2" title="Right">▶</button>
      <button id="dpad-empty-bl"></button>
      <button id="dpad-down"  style="grid-column:2;grid-row:3" title="Down">▼</button>
      <button id="dpad-empty-br"></button>
    `,document.body.appendChild(e);const t=document.createElement("button");t.id="btn-action",t.textContent="E",t.title="Interact (E)",document.body.appendChild(t);const s=document.createElement("button");s.id="btn-jump",s.textContent="⤒",s.title="Jump (Space)",s.style.cssText=`
      position:fixed; bottom:3rem; right:7.5rem; z-index:150;
      width:48px; height:48px; border-radius:50%;
      background:rgba(16,185,129,0.18); border:2px solid rgba(52,211,153,0.5);
      color:#6ee7b7; font-weight:700; font-size:1.1rem; cursor:pointer;
      box-shadow:0 4px 12px rgba(16,185,129,0.3); backdrop-filter:blur(6px);
    `,document.body.appendChild(s),this._jumpBtn=s,["up","down","left","right"].forEach(a=>{const n=document.getElementById(`dpad-${a}`);if(!n)return;const l=o=>{this._vDir[a]=o};n.addEventListener("touchstart",o=>{o.preventDefault(),l(!0)}),n.addEventListener("touchend",o=>{o.preventDefault(),l(!1)}),n.addEventListener("mousedown",()=>l(!0)),n.addEventListener("mouseup",()=>l(!1)),n.addEventListener("mouseleave",()=>l(!1))}),t.addEventListener("touchstart",a=>{a.preventDefault(),this._vAction=!0}),t.addEventListener("touchend",a=>{a.preventDefault(),this._vAction=!1}),t.addEventListener("mousedown",()=>{this._vAction=!0}),t.addEventListener("mouseup",()=>{this._vAction=!1}),this._vJump=!1,s.addEventListener("touchstart",a=>{a.preventDefault(),this._vJump=!0}),s.addEventListener("touchend",a=>{a.preventDefault(),this._vJump=!1}),s.addEventListener("mousedown",()=>{this._vJump=!0}),s.addEventListener("mouseup",()=>{this._vJump=!1}),s.addEventListener("mouseleave",()=>{this._vJump=!1})}_isTyping(){const e=document.activeElement;return e&&(e.tagName==="INPUT"||e.tagName==="TEXTAREA"||e.isContentEditable)}getDirection(){if(this._isTyping())return{x:0,y:0};const e=this._cursors.up.isDown||this._wasd.up.isDown||this._vDir.up,t=this._cursors.down.isDown||this._wasd.down.isDown||this._vDir.down,s=this._cursors.left.isDown||this._wasd.left.isDown||this._vDir.left;return{x:(this._cursors.right.isDown||this._wasd.right.isDown||this._vDir.right?1:0)-(s?1:0),y:(t?1:0)-(e?1:0)}}isActionJustPressed(){if(this._isTyping())return!1;const e=Phaser.Input.Keyboard.JustDown(this._actionKey)||this._vAction;return e&&!this._prevActionState?(this._prevActionState=!0,!0):(e||(this._prevActionState=!1),!1)}isJumpJustPressed(){if(this._isTyping())return!1;const e=Phaser.Input.Keyboard.JustDown(this._jumpKey)||this._vJump;return e&&!this._prevJumpState?(this._prevJumpState=!0,!0):(e||(this._prevJumpState=!1),!1)}isEscapeJustPressed(){return Phaser.Input.Keyboard.JustDown(this._escKey)}destroy(){document.getElementById("virtual-dpad")?.remove(),document.getElementById("btn-action")?.remove(),document.getElementById("btn-jump")?.remove()}}class H{constructor(e,t){this.scene=e,this.player=t,this._objects=[],this._nearest=null,this._eventEmitter=new Phaser.Events.EventEmitter}register(e){this._objects.push(e)}update(){if(!this.player||!this.player.active)return;const e=this.player.x,t=this.player.y;let s=1/0,i=null;for(const a of this._objects){const n=a.x-e,l=a.y-t,o=Math.sqrt(n*n+l*l);o<=$&&o<s&&(s=o,i=a)}i!==this._nearest&&(this._nearest&&(this._nearest.setActive(!1),this._eventEmitter.emit("proximity-exit",this._nearest)),i&&(i.setActive(!0),this._eventEmitter.emit("proximity-enter",i)),this._nearest=i)}get nearestObject(){return this._nearest}on(e,t,s){return this._eventEmitter.on(e,t,s),this}off(e,t,s){return this._eventEmitter.off(e,t,s),this}}class g{static KEYS={POSITION:"devquest_pos",MUTED:"devquest_muted",NAME:"devquest_name"};static savePosition(e,t){localStorage.setItem(g.KEYS.POSITION,JSON.stringify({x:e,y:t}))}static loadPosition(){try{const e=localStorage.getItem(g.KEYS.POSITION);return e?JSON.parse(e):null}catch{return null}}static saveMutePreference(e){localStorage.setItem(g.KEYS.MUTED,e?"true":"false")}static loadMutePreference(){return localStorage.getItem(g.KEYS.MUTED)==="true"}static saveName(e){localStorage.setItem(g.KEYS.NAME,e)}static loadName(){return localStorage.getItem(g.KEYS.NAME)||"Guest"}static clearAll(){Object.values(g.KEYS).forEach(e=>localStorage.removeItem(e))}}class D{constructor(e){this.data=e,this._el=null,this._onClose=null}open(e){this._onClose=e;const t=document.createElement("div");t.className="modal-backdrop",t.id="active-modal-backdrop",t.innerHTML=`
      <div class="modal-panel glass-card" style="padding:0;overflow:hidden;">
        ${this._renderContent(this.data)}
      </div>
    `,document.getElementById("modal-portal").appendChild(t),this._el=t,t.addEventListener("click",s=>{s.target===t&&this.close()}),this._escHandler=s=>{s.key==="Escape"&&this.close()},document.addEventListener("keydown",this._escHandler),t.querySelector(".modal-close-btn")?.addEventListener("click",()=>this.close())}close(){!this._el||this._isClosing||(this._isClosing=!0,this._el.style.opacity="0",this._el.style.transition="opacity 0.2s ease",setTimeout(()=>{this._el?.remove(),this._el=null},200),document.removeEventListener("keydown",this._escHandler),this._onClose?.())}_renderContent(e){return'<div style="padding:2rem;"><p>No content</p></div>'}_closeBtn(){return`
      <button class="modal-close-btn" title="Close (Esc)" style="
        position:absolute; top:1rem; right:1rem;
        background:rgba(255,255,255,0.08); border:1px solid #2a2a4a;
        border-radius:8px; width:32px; height:32px;
        color:#94a3b8; cursor:pointer; font-size:1rem;
        transition:background 0.2s, color 0.2s;
        display:flex; align-items:center; justify-content:center;
        z-index:10;
      " onmouseover="this.style.background='rgba(255,255,255,0.15)';this.style.color='#e2e8f0'"
         onmouseout="this.style.background='rgba(255,255,255,0.08)';this.style.color='#94a3b8'">
        ✕
      </button>
    `}}class W extends D{_renderContent(e){const t=e.techStack.map(a=>`<span class="tech-chip">${a}</span>`).join(""),s=e.githubUrl?`<a href="${e.githubUrl}" target="_blank" rel="noopener" class="modal-action-btn modal-btn-github">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
           GitHub
         </a>`:"",i=e.demoUrl?`<a href="${e.demoUrl}" target="_blank" rel="noopener" class="modal-action-btn modal-btn-demo">
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
           Live Demo
         </a>`:"";return`
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header gradient band -->
        <div style="
          background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e3a5f 100%);
          padding: 2rem 2rem 1.5rem;
          border-radius: 12px 12px 0 0;
        ">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
            <span style="font-size:1.5rem">🖥️</span>
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#a5b4fc;margin-bottom:4px;">${e.year||""}</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0;">${e.title}</h2>
            </div>
          </div>
          <p style="font-size:0.9rem;color:#cbd5e1;line-height:1.5;">${e.shortDescription}</p>
        </div>

        <!-- Thumbnail (if available) -->
        ${e.thumbnail?`
        <div style="height:180px; overflow:hidden; background:#0f172a; border-bottom:1px solid #1e293b;">
          <img src="${e.thumbnail}" alt="${e.title}" style="width:100%;height:100%;object-fit:cover;display:block;"
            onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'height:100%;display:flex;align-items:center;justify-content:center;font-size:3rem;background:linear-gradient(135deg,#1e1b4b,#312e81)\\'>🖥️</div>'"
          />
        </div>`:""}

        <!-- Body -->
        <div style="padding:1.5rem 2rem;">
          <!-- Full description -->
          <p style="font-size:0.875rem;color:#94a3b8;line-height:1.75;margin-bottom:1.5rem;">
            ${e.fullDescription}
          </p>

          <!-- Tech stack -->
          <div style="margin-bottom:1.5rem;">
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:10px;">TECH STACK</p>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">${t}</div>
          </div>

          <!-- Action buttons -->
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            ${s}
            ${i}
          </div>
        </div>

        <style>
          .modal-action-btn {
            display:inline-flex; align-items:center; gap:8px;
            padding:10px 20px; border-radius:8px;
            font-family:'Inter',sans-serif; font-weight:600; font-size:0.85rem;
            text-decoration:none; transition:all 0.2s;
          }
          .modal-btn-github {
            background:#1e293b; color:#e2e8f0;
            border:1px solid #334155;
          }
          .modal-btn-github:hover { background:#334155; transform:translateY(-2px); }
          .modal-btn-demo {
            background:linear-gradient(135deg,#7c3aed,#6d28d9);
            color:#fff; border:none;
            box-shadow:0 4px 16px rgba(124,58,237,0.35);
          }
          .modal-btn-demo:hover { transform:translateY(-2px); box-shadow:0 6px 24px rgba(124,58,237,0.5); }
        </style>
      </div>
    `}}class X extends D{_renderContent(e){const t=i=>{const n={advanced:3,intermediate:2,beginner:1}[i]??1;return Array(3).fill(0).map((l,o)=>`<span style="width:6px;height:6px;border-radius:50%;display:inline-block;background:${o<n?"currentColor":"rgba(148,163,184,0.25)"};"></span>`).join("")},s=e.map(i=>`
      <div style="margin-bottom:1.25rem;">
        <div style="
          display:flex; align-items:center; gap:8px;
          margin-bottom:10px;
          font-family:'Press Start 2P',monospace; font-size:7px;
          color:${i.color||"#7c3aed"};
        ">
          <span style="
            display:inline-block; width:8px; height:8px; border-radius:2px;
            background:${i.color||"#7c3aed"};
          "></span>
          ${i.category.toUpperCase()}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${i.items.map(a=>`
            <div class="skill-badge" style="position:relative;">
              <span style="font-size:14px">${a.icon}</span>
              <span style="color:#e2e8f0;">${a.name}</span>
              <span style="display:flex;gap:2px;margin-left:4px;color:${i.color||"#7c3aed"};">
                ${t(a.level)}
              </span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");return`
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#064e3b,#065f46,#14532d);
          padding:2rem 2rem 1.5rem;
          border-radius:12px 12px 0 0;
        ">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">📚</span>
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#6ee7b7;margin-bottom:4px;">SKILL LIBRARY</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0;">Technical Skills</h2>
            </div>
          </div>
          <p style="font-size:0.85rem;color:#a7f3d0;margin-top:8px;line-height:1.5;">
            Explore my toolkit — grouped by discipline.
          </p>
        </div>

        <!-- Skill grid -->
        <div style="padding:1.5rem 2rem;">
          ${s}

          <!-- Legend -->
          <div style="
            margin-top:1rem; padding:12px; border-radius:8px;
            background:rgba(255,255,255,0.04); border:1px solid #1e293b;
            display:flex; gap:16px; flex-wrap:wrap;
            font-size:0.75rem; color:#64748b;
          ">
            <span>● ● ● Advanced</span>
            <span>● ● ○ Intermediate</span>
            <span>● ○ ○ Beginner</span>
          </div>
        </div>
      </div>
    `}}class Z extends D{_renderContent(e){const t=e.socials?.map(i=>{const a={github:"🐙",linkedin:"💼",twitter:"🐦",instagram:"📸"};return`
        <a href="${i.url}" target="_blank" rel="noopener" class="social-link-btn">
          ${a[i.icon]||"🔗"} ${i.platform}
        </a>
      `}).join("")||"",s=e.available?`<span style="display:inline-flex;align-items:center;gap:5px;padding:3px 10px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);border-radius:99px;font-size:0.7rem;color:#34d399;">
           <span style="width:6px;height:6px;border-radius:50%;background:#10b981;animation:pulse-glow 1.5s ease infinite;"></span>
           Available for opportunities
         </span>`:"";return`
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#1e1b4b,#312e81,#1e1b4b);
          padding:2rem;
          border-radius:12px 12px 0 0;
          display:flex; align-items:center; gap:1.5rem;
          flex-wrap:wrap;
        ">
          <!-- Avatar -->
          ${e.avatar?`
          <img src="${e.avatar}" alt="${e.name}"
            style="
              width:80px; height:80px; border-radius:50%; flex-shrink:0;
              object-fit:cover;
              border:3px solid rgba(196,181,253,0.3);
              box-shadow:0 0 24px rgba(124,58,237,0.4);
              background:#1e1b4b;
            "
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div style="
            width:80px; height:80px; border-radius:50%; flex-shrink:0;
            background:linear-gradient(135deg,#7c3aed,#06b6d4);
            display:none; align-items:center; justify-content:center;
            font-size:2.5rem;
            border:3px solid rgba(196,181,253,0.3);
            box-shadow:0 0 24px rgba(124,58,237,0.4);
          ">👨‍💻</div>
          `:`
          <div style="
            width:80px; height:80px; border-radius:50%; flex-shrink:0;
            background:linear-gradient(135deg,#7c3aed,#06b6d4);
            display:flex; align-items:center; justify-content:center;
            font-size:2.5rem;
            border:3px solid rgba(196,181,253,0.3);
            box-shadow:0 0 24px rgba(124,58,237,0.4);
          ">👨‍💻</div>
          `}

          <div style="flex:1;min-width:200px;">
            <div style="margin-bottom:8px;">${s}</div>
            <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0 0 4px;">${e.name}</h2>
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#a5b4fc;">${e.role}</p>
            ${e.location?`<p style="font-size:0.8rem;color:#64748b;margin-top:6px;">📍 ${e.location}</p>`:""}
          </div>
        </div>

        <!-- Body -->
        <div style="padding:1.5rem 2rem;">
          <!-- Bio -->
          <p style="font-size:0.9rem;color:#94a3b8;line-height:1.75;margin-bottom:1.5rem;">
            ${e.bio}
          </p>

          <!-- Social links -->
          ${t?`
          <div style="margin-bottom:1.5rem;">
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:10px;">FIND ME ON</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">${t}</div>
          </div>`:""}

          <!-- Resume -->
          ${e.resumeUrl?`
          <a href="${e.resumeUrl}" target="_blank" rel="noopener" class="btn-primary" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;padding:10px 24px;border-radius:8px;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-weight:600;font-size:0.875rem;">
            📄 Download Resume
          </a>`:""}
        </div>

        <style>
          .social-link-btn {
            display:inline-flex; align-items:center; gap:6px;
            padding:8px 14px; border-radius:8px;
            background:rgba(255,255,255,0.05); border:1px solid #2a2a4a;
            color:#94a3b8; text-decoration:none; font-size:0.8rem;
            transition:all 0.2s;
          }
          .social-link-btn:hover {
            background:rgba(124,58,237,0.15);
            border-color:rgba(124,58,237,0.4);
            color:#e2e8f0; transform:translateY(-1px);
          }
        </style>
      </div>
    `}}class G extends D{_renderContent(e){const t=e.socials?.map(s=>{const i={github:"#e2e8f0",linkedin:"#0ea5e9",twitter:"#38bdf8",instagram:"#e1306c"};return`
        <a href="${s.url}" target="_blank" rel="noopener" style="
          display:flex; align-items:center; gap:10px;
          padding:12px 16px; border-radius:10px;
          background:rgba(255,255,255,0.04); border:1px solid #1e293b;
          color:${i[s.icon]||"#94a3b8"}; text-decoration:none;
          font-size:0.875rem; font-weight:500;
          transition:all 0.2s;
        " onmouseover="this.style.background='rgba(255,255,255,0.08)';this.style.borderColor='#334155'"
           onmouseout="this.style.background='rgba(255,255,255,0.04)';this.style.borderColor='#1e293b'">
           ${s.platform==="GitHub"?"🐙":s.platform==="LinkedIn"?"💼":s.platform==="Instagram"?"📸":"🐦"}
          ${s.platform}
          <svg style="margin-left:auto;opacity:0.4" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      `}).join("")||"";return`
      <div style="position:relative;">
        ${this._closeBtn()}

        <!-- Header -->
        <div style="
          background:linear-gradient(135deg,#431407,#7c2d12,#1e293b);
          padding:2rem;
          border-radius:12px 12px 0 0;
        ">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="font-size:1.5rem">📬</span>
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#fcd34d;margin-bottom:4px;">GET IN TOUCH</p>
              <h2 style="font-size:1.35rem;font-weight:700;color:#e2e8f0;margin:0;">Say Hello! 👋</h2>
            </div>
          </div>
          <p style="font-size:0.85rem;color:#fed7aa;margin-top:8px;line-height:1.5;">
            I'm always open to new opportunities, collaborations, or just a good conversation.
          </p>
        </div>

        <!-- Body -->
        <div style="padding:1.5rem 2rem;display:flex;flex-direction:column;gap:1.25rem;">

          <!-- Email -->
          <div style="
            display:flex; align-items:center; justify-content:space-between;
            padding:14px 16px; border-radius:10px;
            background:rgba(251,191,36,0.08); border:1px solid rgba(251,191,36,0.25);
            flex-wrap:wrap; gap:10px;
          ">
            <div>
              <p style="font-family:'Press Start 2P',monospace;font-size:6px;color:#fbbf24;margin-bottom:4px;">EMAIL</p>
              <p style="color:#e2e8f0;font-size:0.9rem;font-weight:500;">${e.email}</p>
            </div>
            <button id="copy-email-btn" style="
              background:rgba(251,191,36,0.15); border:1px solid rgba(251,191,36,0.35);
              border-radius:8px; padding:8px 16px; color:#fbbf24;
              font-size:0.8rem; font-weight:600; cursor:pointer;
              transition:all 0.2s; font-family:'Inter',sans-serif;
              display:flex; align-items:center; gap:6px; white-space:nowrap;
            ">
              📋 Copy Email
            </button>
          </div>

          <!-- Social Links -->
          ${t?`
          <div>
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:10px;">SOCIAL LINKS</p>
            <div style="display:flex;flex-direction:column;gap:8px;">${t}</div>
          </div>`:""}

          <!-- Quick Message Form -->
          <div style="padding:16px;background:rgba(255,255,255,0.03);border-radius:10px;border:1px solid #1e293b;">
            <p style="font-family:'Press Start 2P',monospace;font-size:7px;color:#7c3aed;margin-bottom:12px;">QUICK MESSAGE</p>
            <input id="contact-name" type="text" placeholder="Your name" maxlength="40" style="
              width:100%; padding:10px 12px; border-radius:8px; margin-bottom:8px;
              background:#0f172a; border:1px solid #1e293b; color:#e2e8f0;
              font-family:'Inter',sans-serif; font-size:0.85rem; outline:none;
              transition:border-color 0.2s; box-sizing:border-box;
            " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'" />
            <input id="contact-email-field" type="email" placeholder="your@email.com" maxlength="80" style="
              width:100%; padding:10px 12px; border-radius:8px; margin-bottom:8px;
              background:#0f172a; border:1px solid #1e293b; color:#e2e8f0;
              font-family:'Inter',sans-serif; font-size:0.85rem; outline:none;
              transition:border-color 0.2s; box-sizing:border-box;
            " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'" />
            <textarea id="contact-msg" placeholder="Your message... (min 10 chars)" rows="3" maxlength="500" style="
              width:100%; padding:10px 12px; border-radius:8px; margin-bottom:4px;
              background:#0f172a; border:1px solid #1e293b; color:#e2e8f0;
              font-family:'Inter',sans-serif; font-size:0.85rem; outline:none;
              resize:vertical; transition:border-color 0.2s; box-sizing:border-box;
            " onfocus="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#7c3aed'" onblur="if(this.style.borderColor!=='rgb(239, 68, 68)')this.style.borderColor='#1e293b'"></textarea>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
              <span id="contact-char-count" style="font-size:0.7rem;color:#475569;">0 / 500</span>
              <span id="contact-status" style="font-size:0.7rem;color:#94a3b8;"></span>
            </div>
            <button id="contact-send-btn" style="
              width:100%; padding:12px; border-radius:8px;
              background:linear-gradient(135deg,#7c3aed,#6d28d9);
              color:#fff; font-weight:600; font-size:0.875rem;
              border:none; cursor:pointer; font-family:'Inter',sans-serif;
              transition:all 0.2s; display:flex;align-items:center;justify-content:center;gap:8px;
            " onmouseover="this.style.transform='translateY(-1px)'"
               onmouseout="this.style.transform='none'">
              <span id="contact-send-label">Send Message 🚀</span>
            </button>
            <p style="font-size:0.68rem;color:#475569;margin-top:8px;text-align:center;line-height:1.4;">
              ✉️ Direct to <b style="color:#94a3b8">${e.email}</b> via FormSubmit — no backend needed.<br/>
              <span style="color:#334155">Fallback to email app if offline.</span>
            </p>
          </div>
        </div>
      </div>
    `}open(e){super.open(e),this._bindContactEvents()}_bindContactEvents(){const e=o=>{o&&["keydown","keyup","keypress"].forEach(c=>o.addEventListener(c,h=>h.stopPropagation()))};e(document.getElementById("contact-name")),e(document.getElementById("contact-email-field")),e(document.getElementById("contact-msg"));const t=document.getElementById("copy-email-btn");t&&this.data.email&&t.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(this.data.email),t.textContent="✅ Copied!",t.style.background="rgba(16,185,129,0.2)",t.style.borderColor="rgba(16,185,129,0.5)",t.style.color="#34d399",this._showToast("Email copied to clipboard! 📋"),setTimeout(()=>{t.innerHTML="📋 Copy Email",t.style.background="rgba(251,191,36,0.15)",t.style.borderColor="rgba(251,191,36,0.35)",t.style.color="#fbbf24"},2e3)}catch{const o=document.createElement("textarea");o.value=this.data.email,document.body.appendChild(o),o.select(),document.execCommand("copy"),o.remove(),this._showToast("Email copied! 📋")}});const s=document.getElementById("contact-send-btn"),i=document.getElementById("contact-send-label"),a=document.getElementById("contact-status"),n=document.getElementById("contact-msg"),l=document.getElementById("contact-char-count");n&&l&&n.addEventListener("input",()=>{l.textContent=`${n.value.length} / 500`,l.style.color=n.value.length>450?"#f59e0b":"#475569"}),s&&s.addEventListener("click",async()=>{const o=document.getElementById("contact-name")?.value||"",c=document.getElementById("contact-email-field")?.value||"",h=document.getElementById("contact-msg")?.value||"";N(["contact-name","contact-email-field","contact-msg"]);const{valid:_,errors:y}=R({name:o,email:c,message:h});if(!_){y.name&&B(document.getElementById("contact-name"),y.name),y.email&&B(document.getElementById("contact-email-field"),y.email),y.message&&B(n,y.message),T(y.name||y.email||y.message,"#ef4444");return}s.disabled=!0,s.style.opacity="0.7",s.style.cursor="not-allowed",i&&(i.textContent="Sending... ⏳"),a&&(a.textContent="Sending...");const m=await U({name:o,email:c,message:h});s.disabled=!1,s.style.opacity="1",s.style.cursor="pointer",m.ok?(m.via==="ajax"?(T("Message sent! I'll reply soon ✨","#10b981"),a&&(a.textContent="✅ Sent! Check dianferdi01@gmail.com",a.style.color="#10b981")):m.via==="mailto"&&(T("Opening email app — message ready to send ✉️","#0ea5e9"),a&&(a.textContent="📧 Email app opened",a.style.color="#0ea5e9")),document.getElementById("contact-name").value="",document.getElementById("contact-email-field").value="",n.value="",l&&(l.textContent="0 / 500"),i&&(i.textContent="Sent! ✅"),setTimeout(()=>{i&&(i.textContent="Send Message 🚀"),a&&(a.textContent="")},3e3)):(T("Failed, but saved locally. Try again ✨","#f59e0b"),a&&(a.textContent="⚠️ Saved locally",a.style.color="#f59e0b"),i&&(i.textContent="Send Message 🚀"))})}_showToast(e,t="#10b981"){T(e,t)}}class se extends p.Scene{constructor(){super({key:v.WORLD}),this._player=null,this._inputController=null,this._proximityMgr=null,this._modalOpen=!1,this._exiting=!1,this._activeModal=null,this._exitObject=null}create(){this.registry.get("playerName");const e=this.registry.get("muted")||g.loadMutePreference();this._buildTilemap();const t=g.loadPosition(),s=t?.x??M.x*d,i=t?.y??M.y*d;this._inputController=new Y(this),this._player=new F(this,s,i,this._inputController),this.physics.add.collider(this._player,this._collisionLayer),this.cameras.main.setZoom(L),this.cameras.main.startFollow(this._player,!0,.12,.12),this.cameras.main.setBounds(0,0,b*d,x*d),this._interactiveObjects=[],this._spawnInteractiveObjects(),this._proximityMgr=new H(this,this._player),this._interactiveObjects.forEach(a=>this._proximityMgr.register(a)),this._proximityMgr.on("proximity-enter",a=>{this.scene.get(v.UI)?.showIndicator(a,this.cameras.main)},this),this._proximityMgr.on("proximity-exit",()=>{this.scene.get(v.UI)?.hideIndicator()},this),this._setupAudio(e),this.input.keyboard.on("keydown-ESC",()=>{this._modalOpen?this._closeModal():this._exiting||this._exitToMenu()}),this.events.once("shutdown",()=>{!this._exiting&&this._player&&g.savePosition(this._player.x,this._player.y),this._inputController?.destroy(),this._inputController=null,this._interactiveObjects?.forEach(a=>{try{a.destroy()}catch{}}),this._interactiveObjects=[],this._exitObject=null,this._proximityMgr?.removeAllListeners?.();try{this.scene.get(v.UI)?.hideIndicator?.()}catch{}try{this.tweens.killAll()}catch{}try{this.time.removeAllEvents()}catch{}this._modalOpen=!1,this._exiting=!1,window.__worldExitFallback&&(clearTimeout(window.__worldExitFallback),window.__worldExitFallback=null)}),this._drawZoneLabels(),this._createAtmosphere(),this._createAmbientParticles(),this._createZoneDecorations(),this._createFloatingProps(),this._checkDeviceCapability()}_buildTilemap(){const e=this._generateMapData(),t=this.make.tilemap({data:e,tileWidth:d,tileHeight:d}),s=t.addTilesetImage(A,A,d,d);this._groundLayer=t.createLayer(0,s,0,0),this._groundLayer.setDepth(0);const i=this._generateWallData(),a=this.make.tilemap({data:i,tileWidth:d,tileHeight:d}),n=a.addTilesetImage(A,A,d,d);this._collisionLayer=a.createLayer(0,n,0,0),this._collisionLayer.setDepth(1),this._collisionLayer.setCollisionByExclusion([-1]),this.physics.world.setBounds(0,0,b*d,x*d)}_generateMapData(){const{FLOOR_WOOD:e,FLOOR_TILE:t,FLOOR_CARPET:s,FLOOR_DARK:i,PATH:a}=k,n=[];for(let l=0;l<x;l++){const o=[];for(let c=0;c<b;c++)this._inZone(c,l,r.ABOUT)?o.push(s):this._inZone(c,l,r.PROJECTS)?o.push(i):this._inZone(c,l,r.SKILLS)?o.push(e):this._inZone(c,l,r.CONTACT)?o.push(t):o.push(a);n.push(o)}return n}_generateWallData(){const{WALL_TOP:e,WALL_SIDE:t,WALL_CORNER:s}=k,i=Array.from({length:x},()=>Array(b).fill(-1)),a=o=>{const{x:c,y:h,w:_,h:y}=o;for(let u=c;u<c+_;u++)i[h][u]=e,i[h+y-1][u]=e;for(let u=h;u<h+y;u++)i[u][c]=t,i[u][c+_-1]=t;i[h][c]=s,i[h][c+_-1]=s,i[h+y-1][c]=s,i[h+y-1][c+_-1]=s;const m=Math.floor(c+_/2)-1,f=h>10?h:h+y-1;for(let u=0;u<3;u++)i[f][m+u]=-1};for(let o=0;o<b;o++)i[0][o]=k.WALL_TOP,i[x-1][o]=k.WALL_TOP;for(let o=0;o<x;o++)i[o][0]=k.WALL_SIDE,i[o][b-1]=k.WALL_SIDE;Object.values(r).forEach(a);const n=Math.floor(b/2)-1,l=x-1;for(let o=0;o<3;o++)i[l][n+o]=-1;return i}_inZone(e,t,s){return e>=s.x&&e<s.x+s.w&&t>=s.y&&t<s.y+s.h}_spawnInteractiveObjects(){const e=o=>(o+.5)*d,t=o=>(o+.5)*d,s=new I(this,e(r.ABOUT.x+5),t(r.ABOUT.y+5),{id:"about_board",type:E.ABOUT,label:"About Me",data:z});this._interactiveObjects.push(s),j.forEach((o,c)=>{const h=c%3,_=Math.floor(c/3),y=new I(this,e(r.PROJECTS.x+4+h*6),t(r.PROJECTS.y+4+_*6),{id:o.mapObjectId,type:E.PROJECT,label:o.title,data:o});this._interactiveObjects.push(y)});const i=new I(this,e(r.SKILLS.x+5),t(r.SKILLS.y+5),{id:"skills_shelf",type:E.SKILLS,label:"Skills",data:J});this._interactiveObjects.push(i);const a=new I(this,e(r.CONTACT.x+5),t(r.CONTACT.y+5),{id:"contact_desk",type:E.CONTACT,label:"Contact",data:z});this._interactiveObjects.push(a);const n=Math.floor(b/2),l=new I(this,e(n),t(x-2),{id:"exit_door",type:E.EXIT,label:"🚪 Exit — Walk in or press E",data:{title:"Exit"}});this._interactiveObjects.push(l),this._exitObject=l}_drawZoneLabels(){const e=[{zone:r.ABOUT,label:"[ ABOUT ME ]",color:"#a78bfa"},{zone:r.PROJECTS,label:"[ PROJECTS ]",color:"#22d3ee"},{zone:r.SKILLS,label:"[ SKILLS ]",color:"#34d399"},{zone:r.CONTACT,label:"[ CONTACT ]",color:"#fbbf24"}],t=Math.floor(b/2)*d,s=(x-1.5)*d;this.add.rectangle(t,s+6,42,14,986906,.85).setDepth(7).setStrokeStyle(1,16096779,.6),this.add.text(t,s+6,"EXIT",{fontFamily:"'Press Start 2P', monospace",fontSize:"5px",color:"#fbbf24"}).setOrigin(.5).setDepth(8);const i=this.add.text(t,s+18,"▼",{fontFamily:"monospace",fontSize:"8px",color:"#fbbf24"}).setOrigin(.5).setDepth(8);this.tweens.add({targets:i,y:s+21,alpha:.4,duration:700,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"}),e.forEach(({zone:a,label:n,color:l})=>{const o=(a.x+a.w/2)*d,c=(a.y+2)*d;this.add.text(o,c,n,{fontFamily:"'Press Start 2P', monospace",fontSize:"5px",color:l,stroke:"#000000",strokeThickness:2,alpha:.75}).setOrigin(.5).setDepth(8)})}_createAtmosphere(){const e=b*d,t=x*d,s=this.add.graphics().setScrollFactor(0).setDepth(100).setAlpha(.35);s.fillGradientStyle(986906,986906,0,0,.45),s.fillRect(-400,-300,e+800,180),s.fillGradientStyle(0,0,986906,986906,.45),s.fillRect(-400,t-100,e+800,180);for(let a=0;a<t;a+=6)this.add.rectangle(e/2,a,e,1,16777215,.015).setDepth(99);[{x:r.ABOUT.x+10,y:r.ABOUT.y+8,color:8141549,alpha:.08},{x:r.PROJECTS.x+11,y:r.PROJECTS.y+8,color:440020,alpha:.07},{x:r.SKILLS.x+10,y:r.SKILLS.y+8,color:1096065,alpha:.07},{x:r.CONTACT.x+11,y:r.CONTACT.y+8,color:16096779,alpha:.07}].forEach(a=>{const n=this.add.circle(a.x*d,a.y*d,90,a.color,a.alpha).setDepth(2).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:n,alpha:a.alpha*1.6,scale:1.08,duration:2500+Math.random()*1e3,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})}),this.tweens.add({targets:this.cameras.main,zoom:L*1.03,duration:4e3,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})}_createAmbientParticles(){const e=b*d,t=x*d;for(let i=0;i<22;i++){const a=p.Math.Between(10,e-10),n=p.Math.Between(10,t-10),l=this.add.circle(a,n,p.Math.FloatBetween(1,2.2),16498468,p.Math.FloatBetween(.3,.7)).setDepth(7).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:l,x:a+p.Math.Between(-60,60),y:n+p.Math.Between(-40,40),alpha:.05,duration:p.Math.Between(4e3,8e3),yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:i*120}),this.tweens.add({targets:l,scale:1.6,duration:1200,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})}["</>","{ }","01","=>","npm","git","vue","php","< />"].forEach((i,a)=>{const n=p.Math.Between(20,e-20),l=p.Math.Between(20,t-20),o=this.add.text(n,l,i,{fontFamily:"'Press Start 2P', monospace",fontSize:"5px",color:"#2a2a4a"}).setOrigin(.5).setDepth(3).setAlpha(.35);this.tweens.add({targets:o,y:l-16,alpha:.12,duration:3e3+a*250,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:a*200}),this.tweens.add({targets:o,angle:p.Math.Between(-8,8),duration:2e3+a*300,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})});for(let i=0;i<12;i++){const a=p.Math.Between(r.PROJECTS.x*d+10,(r.PROJECTS.x+r.PROJECTS.w)*d-10),n=p.Math.Between(r.PROJECTS.y*d+20,(r.PROJECTS.y+r.PROJECTS.h)*d-20),l=this.add.circle(a,n,.8,16777215,.9).setDepth(4);this.tweens.add({targets:l,alpha:.08,duration:900+i*80,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:i*150})}}_createZoneDecorations(){const e=m=>m*d,t=m=>m*d,s=(r.ABOUT.x+r.ABOUT.w/2)*d;(r.ABOUT.y+r.ABOUT.h/2)*d,["🌿","🪴","🌱"].forEach((m,f)=>{const u=s+(f-1)*28,O=t(r.ABOUT.y+r.ABOUT.h-3),C=this.add.text(u,O,m,{fontSize:"14px"}).setOrigin(.5).setDepth(6);this.tweens.add({targets:C,angle:4,duration:1600+f*200,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"}),this.tweens.add({targets:C,y:O-2,duration:1800+f*200,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:f*300})});const i=this.add.circle(e(r.ABOUT.x+3),t(r.ABOUT.y+3),14,16498468,.18).setDepth(5).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:i,alpha:.32,scale:1.2,duration:1100,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"});for(let m=0;m<3;m++){const f=e(r.PROJECTS.x+5+m*6),u=t(r.PROJECTS.y+4),O=this.add.rectangle(f,u,16,10,988970).setDepth(5).setStrokeStyle(1,440020,.6),C=this.add.rectangle(f,u,12,6,440020,.35).setDepth(6).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:C,alpha:.08,duration:400+m*150,yoyo:!0,repeat:-1,ease:"Stepped",delay:m*200}),this.tweens.add({targets:O,y:u-1,duration:2e3+m*400,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})}["📘","📗","📙"].forEach((m,f)=>{const u=e(r.SKILLS.x+6+f*4),O=t(r.SKILLS.y+5),C=this.add.text(u,O,m,{fontSize:"12px"}).setOrigin(.5).setDepth(6);this.tweens.add({targets:C,y:O-4,duration:1700+f*250,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:f*250});const K=this.add.circle(u+6,O-4,1,3462041,.9).setDepth(7).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:K,alpha:0,scale:2,duration:1400,repeat:-1,delay:f*600,ease:"Sine.easeInOut"})});const a=e(r.CONTACT.x+r.CONTACT.w/2),n=t(r.CONTACT.y+6),l=this.add.text(a,n,"✉️",{fontSize:"18px"}).setOrigin(.5).setDepth(6);this.tweens.add({targets:l,y:n-5,duration:1600,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"}),this.tweens.add({targets:l,angle:5,duration:2e3,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"});const o=this.add.text(a+18,n-6,"💌",{fontSize:"10px"}).setOrigin(.5).setDepth(7);this.tweens.add({targets:o,y:n-14,alpha:.2,duration:1800,yoyo:!0,repeat:-1,ease:"Sine.easeInOut",delay:600});const c=Math.floor(b/2)*d,h=(x-1)*d+8;this.add.rectangle(c-10,h-4,4,16,7877903).setDepth(5),this.add.rectangle(c+10,h-4,4,16,7877903).setDepth(5),this.add.rectangle(c,h-12,24,4,9584654).setDepth(5);const _=this.add.rectangle(c,h-2,14,12,16096779,.28).setDepth(6).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:_,alpha:.12,duration:800,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"});const y=this.add.text(c,h-2,"🚪",{fontSize:"10px"}).setOrigin(.5).setDepth(7);this.tweens.add({targets:y,y:h-4,duration:1200,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})}_createFloatingProps(){const e=b*d;for(let t=0;t<4;t++){const s=p.Math.Between(30,120),i=this.add.rectangle(p.Math.Between(-80,e),s,p.Math.Between(80,140),12,16777215,.06).setDepth(8).setScrollFactor(.3);this.tweens.add({targets:i,x:e+100,duration:25e3+t*5e3,repeat:-1,ease:"Linear",delay:t*3e3})}for(let t=0;t<6;t++){const s=p.Math.Between(8,e-8),i=p.Math.Between(8,x*d-8),a=this.add.circle(s,i,10,16777215,.025).setDepth(2).setBlendMode(p.BlendModes.ADD);this.tweens.add({targets:a,alpha:.06,duration:3e3+t*400,yoyo:!0,repeat:-1,ease:"Sine.easeInOut"})}}_setupAudio(e){this._muted=e,w.init(this),w.setMuted(e),w.playBGM(this,"bgm_world",{volume:.3}),this._bgm=w._bgm}toggleMute(){const e=w.toggle();return this._muted=e,g.saveMutePreference(e),this._bgm=w._bgm,e}update(){if(!(this._modalOpen||this._exiting)&&!(!this._player||!this._proximityMgr||!this._inputController)){if(this._player.update(),this._proximityMgr.update(),this._inputController.isJumpJustPressed()&&this._player.jump(),this._exitObject&&this._player){const e=this._player.x-this._exitObject.x,t=this._player.y-this._exitObject.y;if(Math.hypot(e,t)<26){this._exitToMenu();return}}if(this._inputController.isActionJustPressed()){const e=this._proximityMgr.nearestObject;e&&(w.playSFX(this,"sfx_interact",{volume:.6}),this._openModal(e))}this.game.getFrame()%300===0&&g.savePosition(this._player.x,this._player.y)}}_exitToMenu(){if(!this._exiting&&!this._modalOpen){this._exiting=!0,window.__worldExitFallback&&(clearTimeout(window.__worldExitFallback),window.__worldExitFallback=null);try{w.playSFX(this,"sfx_close",{volume:.6})}catch{}g.savePosition(M.x*d,M.y*d),w.stopAllImmediate();try{this.sound.stopAll()}catch{}try{this.tweens.killAll()}catch{}try{this.cameras.main.stopFollow()}catch{}document.getElementById("hud")?.remove(),document.getElementById("virtual-dpad")?.remove(),document.getElementById("btn-action")?.remove(),document.getElementById("btn-jump")?.remove(),document.getElementById("interaction-indicator")?.classList.add("hidden"),document.getElementById("lite-mode-banner")?.remove();try{this.scene.isActive(v.UI)&&this.scene.stop(v.UI)}catch{}window.__worldExitFallback=setTimeout(()=>{window.__worldExitFallback=null;try{this.scene.isActive(v.WORLD)?this.scene.start(v.MAIN_MENU):this.scene.isActive(v.MAIN_MENU)||this.scene.start(v.MAIN_MENU)}catch(e){console.warn("[World] exit failed, reload",e),window.location.reload()}},120)}}_openModal(e){if(e.type===E.EXIT){this._exitToMenu();return}this._modalOpen=!0,this.scene.pause();let t;switch(e.type){case E.PROJECT:t=new W(e.data);break;case E.SKILLS:t=new X(e.data);break;case E.ABOUT:t=new Z(e.data);break;case E.CONTACT:t=new G(e.data);break;default:this._modalOpen=!1,this.scene.resume();return}t.open(()=>this._closeModal()),this._activeModal=t,w.playSFX(this,"sfx_open",{volume:.6})}_closeModal(){this._modalOpen&&(this._modalOpen=!1,this._activeModal?.close(),this._activeModal=null,w.playSFX(this,"sfx_close",{volume:.5}),this.scene.resume())}_checkDeviceCapability(){if(!(navigator.hardwareConcurrency<4||window.innerWidth<480))return;const t=document.createElement("div");t.id="lite-mode-banner",t.innerHTML=`
      <div style="
        position:fixed; top:0; left:0; right:0; z-index:9998;
        background:rgba(15,15,26,0.95); border-bottom:1px solid #2a2a4a;
        padding:10px 16px; display:flex; align-items:center; justify-content:space-between;
        font-family:'Inter',sans-serif; font-size:0.78rem; color:#94a3b8;
        backdrop-filter:blur(8px);
      ">
        <span>⚡ This device may experience performance issues. Try <strong style="color:#06b6d4">Lite Mode</strong> for a smoother experience.</span>
        <div style="display:flex;gap:8px;flex-shrink:0;">
          <button onclick="document.getElementById('lite-mode-banner').remove()" style="background:none;border:1px solid #334155;border-radius:6px;padding:4px 10px;color:#94a3b8;cursor:pointer;font-size:0.75rem;">Dismiss</button>
        </div>
      </div>
    `,document.body.appendChild(t)}}export{se as default};
