"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function buildEarthTexture(): THREE.CanvasTexture {
  const W = 2048, H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const bg = ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,W/1.2);
  bg.addColorStop(0,"#0a1628"); bg.addColorStop(1,"#030810");
  ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);
  const continents = [
    {cx:0.52,cy:0.32,rx:0.07,ry:0.10},{cx:0.53,cy:0.52,rx:0.06,ry:0.14},
    {cx:0.68,cy:0.30,rx:0.13,ry:0.12},{cx:0.22,cy:0.28,rx:0.10,ry:0.12},
    {cx:0.29,cy:0.60,rx:0.06,ry:0.13},{cx:0.78,cy:0.62,rx:0.06,ry:0.06},
    {cx:0.35,cy:0.12,rx:0.05,ry:0.06},
  ];
  continents.forEach(({cx,cy,rx,ry})=>{
    const g=ctx.createRadialGradient(cx*W,cy*H,0,cx*W,cy*H,Math.max(rx,ry)*W);
    g.addColorStop(0,"rgba(12,28,18,0.95)"); g.addColorStop(0.6,"rgba(8,18,12,0.85)"); g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.beginPath(); ctx.ellipse(cx*W,cy*H,rx*W,ry*H,0,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
  });
  ctx.beginPath(); ctx.ellipse(W/2,0,W*0.45,H*0.08,0,0,Math.PI*2);
  ctx.fillStyle="rgba(180,210,240,0.15)"; ctx.fill();
  const clusters = [
    {lon:10,lat:51,density:200,size:2.2},{lon:-2,lat:53,density:80,size:1.8},
    {lon:-76,lat:40,density:220,size:2.0},{lon:-90,lat:42,density:80,size:1.6},
    {lon:-118,lat:37,density:90,size:1.8},{lon:137,lat:36,density:180,size:1.8},
    {lon:103,lat:10,density:100,size:1.5},{lon:79,lat:22,density:140,size:1.7},
    {lon:121,lat:31,density:180,size:1.9},{lon:46,lat:26,density:80,size:1.5},
    {lon:31,lat:30,density:60,size:1.4},{lon:37,lat:-2,density:30,size:1.2},
    {lon:-46,lat:-23,density:90,size:1.6},{lon:-58,lat:-34,density:50,size:1.3},
    {lon:151,lat:-33,density:60,size:1.4},{lon:37,lat:55,density:80,size:1.5},
    {lon:-80,lat:45,density:50,size:1.3},
  ];
  let seed=42;
  const rng=(s=1)=>{let x=s;return()=>{x=(x*16807)%2147483647;return(x-1)/2147483646;};};
  clusters.forEach(({lon,lat,density,size})=>{
    const rand=rng(seed++);
    for(let i=0;i<density;i++){
      const px=((lon+180+(rand()-0.5)*size*2.5)/360)*W;
      const py=((90-lat+(rand()-0.5)*size)/180)*H;
      const r=0.4+rand()*1.8;
      const b=0.5+rand()*0.5;
      const hue=rand()<0.65?`rgba(255,${180+rand()*60|0},${60+rand()*40|0},`:`rgba(${200+rand()*55|0},${220+rand()*35|0},255,`;
      const glow=ctx.createRadialGradient(px,py,0,px,py,r*3.5);
      glow.addColorStop(0,hue+`${b})`); glow.addColorStop(0.4,hue+`${b*0.4})`); glow.addColorStop(1,"rgba(0,0,0,0)");
      ctx.beginPath(); ctx.arc(px,py,r*3.5,0,Math.PI*2); ctx.fillStyle=glow; ctx.fill();
    }
  });
  return new THREE.CanvasTexture(canvas);
}

function buildAuraTexture(): THREE.CanvasTexture {
  const S=512;
  const canvas=document.createElement("canvas"); canvas.width=S; canvas.height=S;
  const ctx=canvas.getContext("2d")!; ctx.clearRect(0,0,S,S);
  [{r:S*0.498,spread:S*0.07,c0:"rgba(60,160,255,0.55)",c1:"rgba(100,80,255,0.18)"},
   {r:S*0.490,spread:S*0.04,c0:"rgba(100,220,255,0.7)",c1:"rgba(60,160,255,0.0)"},
   {r:S*0.500,spread:S*0.11,c0:"rgba(80,100,255,0.25)",c1:"rgba(0,0,0,0)"},
  ].forEach(({r,spread,c0,c1})=>{
    const g=ctx.createRadialGradient(S/2,S/2,r-spread,S/2,S/2,r+spread*0.3);
    g.addColorStop(0,c1); g.addColorStop(0.5,c0); g.addColorStop(1,c1);
    ctx.beginPath(); ctx.arc(S/2,S/2,r+spread,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
  });
  return new THREE.CanvasTexture(canvas);
}

function Earth() {
  const meshRef=useRef<THREE.Mesh>(null!);
  const texture=useMemo(()=>buildEarthTexture(),[]);
  useFrame((_,delta)=>{ if(meshRef.current) meshRef.current.rotation.y+=delta*0.06; });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2,96,96]}/>
      <meshStandardMaterial map={texture} roughness={1} metalness={0} emissiveMap={texture} emissive={new THREE.Color(0.12,0.12,0.12)} emissiveIntensity={0.9}/>
    </mesh>
  );
}

function AuraRing() {
  const ref=useRef<THREE.Sprite>(null!);
  const tex=useMemo(()=>buildAuraTexture(),[]);
  useFrame(({clock})=>{ if(ref.current) ref.current.scale.setScalar(4.55+Math.sin(clock.getElapsedTime()*0.8)*0.03); });
  return (
    <sprite ref={ref} scale={[4.55,4.55,4.55]}>
      <spriteMaterial map={tex} transparent opacity={1} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </sprite>
  );
}

function GlowHalo() {
  const ref=useRef<THREE.Mesh>(null!);
  useFrame(({clock})=>{ if(ref.current)(ref.current.material as THREE.MeshBasicMaterial).opacity=0.12+Math.sin(clock.getElapsedTime()*0.5)*0.03; });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.32,64,64]}/>
      <meshBasicMaterial color={new THREE.Color(0.15,0.45,1.0)} transparent opacity={0.13} side={THREE.BackSide} depthWrite={false} blending={THREE.AdditiveBlending}/>
    </mesh>
  );
}

function Stars() {
  const {positions,colors}=useMemo(()=>{
    const count=1800,pos=new Float32Array(count*3),col=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),r=18+Math.random()*8;
      pos[i*3]=r*Math.sin(p)*Math.cos(t); pos[i*3+1]=r*Math.sin(p)*Math.sin(t); pos[i*3+2]=r*Math.cos(p);
      const b=0.6+Math.random()*0.4; col[i*3]=b; col[i*3+1]=b; col[i*3+2]=Math.min(1,b+0.1);
    }
    return {positions:pos,colors:col};
  },[]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions,3]}/>
        <bufferAttribute attach="attributes-color" args={[colors,3]}/>
      </bufferGeometry>
      <pointsMaterial size={0.055} vertexColors transparent opacity={0.85} sizeAttenuation/>
    </points>
  );
}

function Scene() {
  const {gl}=useThree();
  useEffect(()=>{ gl.setPixelRatio(Math.min(window.devicePixelRatio,2)); },[gl]);
  return (
    <>
      <ambientLight intensity={0.03}/>
      <directionalLight position={[-8,4,6]} intensity={0.08}/>
      <Stars/><GlowHalo/><Earth/><AuraRing/>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.35} minPolarAngle={Math.PI*0.25} maxPolarAngle={Math.PI*0.75} dampingFactor={0.06} enableDamping/>
    </>
  );
}

export default function GlobeScene() {
  return (
    <div style={{width:"100%",height:"100%",position:"relative"}}>
      <Canvas camera={{position:[0,0,5.8],fov:42}} gl={{antialias:true,alpha:true}} style={{background:"transparent"}} dpr={[1,2]}>
        <Scene/>
      </Canvas>
    </div>
  );
}
