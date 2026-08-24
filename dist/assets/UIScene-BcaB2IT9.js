import{P as d}from"./phaser-DBy6FrJS.js";import{SCENE_KEYS as r}from"./gameConfig-D5w6vaLC.js";import"./phaser-0YPJO2g1.js";class a extends d.Scene{constructor(){super({key:r.UI}),this._indicatorEl=null,this._hudEl=null,this._currentObj=null}create(){this._indicatorEl=document.getElementById("interaction-indicator"),this._buildHUD(),this.events.once("shutdown",()=>{this._hudEl?.remove(),this._hudEl=null,this.hideIndicator(),this.input.keyboard.off("keydown-ESC")}),this.events.once("destroy",()=>{this._hudEl?.remove(),this.hideIndicator()})}_buildHUD(){this._hudEl&&this._hudEl.remove();const e=this.registry.get("playerName")||"Guest",t=document.createElement("div");t.id="hud",t.style.cssText="position:fixed;top:10px;left:10px;right:10px;display:flex;justify-content:space-between;align-items:center;z-index:90;pointer-events:none;",t.innerHTML=`
      <div id="hud-name" title="Your adventurer name" style="
        font-family:'Press Start 2P',monospace;
        font-size:7px;
        color:#94a3b8;
        background:rgba(15,15,26,0.75);
        border:1px solid #2a2a4a;
        border-radius:8px;
        padding:6px 10px;
        backdrop-filter:blur(8px);
        pointer-events:all;
      ">⚔️ ${e}</div>

      <button id="hud-mute-btn" title="Toggle Audio" style="
        background:rgba(15,15,26,0.75);
        border:1px solid #2a2a4a;
        border-radius:8px;
        padding:6px 10px;
        font-size:16px;
        cursor:pointer;
        backdrop-filter:blur(8px);
        transition:background 0.2s;
        pointer-events:all;
      ">🔊</button>
    `,document.body.appendChild(t),this._hudEl=t;const i=document.getElementById("hud-mute-btn"),s=this.registry.get("muted")||!1;i.textContent=s?"🔇":"🔊",i.addEventListener("click",()=>{const n=this.scene.get(r.WORLD);if(n&&typeof n.toggleMute=="function"){const o=n.toggleMute();i.textContent=o?"🔇":"🔊"}})}showIndicator(e,t){if(!this._indicatorEl)return;this._currentObj=e;const i=e.x*t.zoom-t.scrollX*t.zoom,s=e.y*t.zoom-t.scrollY*t.zoom,n=t.x+i,o=t.y+s-32*t.zoom;this._indicatorEl.style.left=`${n}px`,this._indicatorEl.style.top=`${o}px`,this._indicatorEl.classList.remove("hidden"),this._indicatorEl.style.opacity="1"}hideIndicator(){this._indicatorEl&&(this._indicatorEl.classList.add("hidden"),this._currentObj=null)}update(){if(this._currentObj){const e=this.scene.get(r.WORLD);e&&e.cameras&&this.showIndicator(this._currentObj,e.cameras.main)}}destroy(){this._hudEl?.remove(),this.hideIndicator()}}export{a as default};
