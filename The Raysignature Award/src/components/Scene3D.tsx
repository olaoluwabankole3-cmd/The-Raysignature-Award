import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AWARDS_CONFIG } from "../config";

gsap.registerPlugin(ScrollTrigger);

interface Scene3DProps {
  page?: "gala" | "voting";
  onLoaded?: () => void;
}

export default function Scene3D({ page = "gala", onLoaded }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const pageRef = useRef(page);

  // Keep references to animate inside GSAP and Three rendering cycles
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const trophyGroupRef = useRef<THREE.Group | null>(null);
  
  // Custom lights for animation
  const goldSpotlightRef = useRef<THREE.SpotLight | null>(null);
  const rimLightRef = useRef<THREE.SpotLight | null>(null);

  // Animatable values that GSAP will mutate and Three will read on tick
  const renderState = useRef({
    trophyX: 0,          // Horizontal alignment (left/right slide)
    trophyY: -7,         // Starts low for initial rise
    trophyRotationY: 0,   // Managed by scroll / tick
    trophyRotationX: 0,
    trophyScale: 1.0,
    cameraZ: 10,
    lightIntensityGold: 15,
    lightIntensityRim: 22,
    sparkleIntensity: 1.0,
  });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Premium charcoal-black vignette feel background
    scene.fog = new THREE.FogExp2("#0b0c10", 0.08);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Create Group to hold whatever trophy we load
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);
    trophyGroupRef.current = trophyGroup;

    // 5. Studio Stage / Pedestal Setup
    const pedestalGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.4, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x111115,
      roughness: 0.4,
      metalness: 0.8,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -2.7;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Add glowing ambient rings on the pedestal
    const ringGeo = new THREE.TorusGeometry(1.6, 0.03, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffca4b,
      transparent: true,
      opacity: 0.6
    });
    const ringLight = new THREE.Mesh(ringGeo, ringMat);
    ringLight.position.y = -2.55;
    ringLight.rotation.x = Math.PI / 2;
    scene.add(ringLight);

    // 6. Lighting Configuration
    const ambientLight = new THREE.AmbientLight(
      AWARDS_CONFIG.lighting.ambient.color,
      AWARDS_CONFIG.lighting.ambient.intensity
    );
    scene.add(ambientLight);

    const goldSpotConfig = AWARDS_CONFIG.lighting.spotlightGold;
    const goldSpotlight = new THREE.SpotLight(
      goldSpotConfig.color,
      goldSpotConfig.intensity,
      goldSpotConfig.distance,
      goldSpotConfig.angle,
      goldSpotConfig.penumbra,
      goldSpotConfig.decay
    );
    goldSpotlight.position.set(5, 8, 4);
    goldSpotlight.castShadow = true;
    goldSpotlight.shadow.mapSize.width = 2048;
    goldSpotlight.shadow.mapSize.height = 2048;
    goldSpotlight.shadow.bias = -0.0001;
    scene.add(goldSpotlight);
    goldSpotlightRef.current = goldSpotlight;

    const rimSpotConfig = AWARDS_CONFIG.lighting.rimWhite;
    const rimLight = new THREE.SpotLight(
      rimSpotConfig.color,
      rimSpotConfig.intensity,
      rimSpotConfig.distance,
      rimSpotConfig.angle,
      rimSpotConfig.penumbra,
      rimSpotConfig.decay
    );
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);
    rimLightRef.current = rimLight;

    const fillLight = new THREE.DirectionalLight(0x3e405a, 1.2);
    fillLight.position.set(-4, -2, 5);
    scene.add(fillLight);

    // 7. Sparkle Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      scales[i] = Math.random() * 0.08 + 0.02;
    }
    
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    
    const particleMat = new THREE.PointsMaterial({
      color: 0xffca4b,
      size: 0.15,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const sparkles = new THREE.Points(particleGeo, particleMat);
    scene.add(sparkles);

    // 8. Trophy Modeling (Procedural Fallback generator)
    const buildProceduralTrophy = () => {
      setUsingFallback(true);
      const goldMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(AWARDS_CONFIG.fallback.color),
        metalness: AWARDS_CONFIG.fallback.metalness,
        roughness: AWARDS_CONFIG.fallback.roughness,
        bumpScale: 0.05,
      });

      const neckGeo = new THREE.CylinderGeometry(0.2, 0.5, 1.2, 32);
      const neckMesh = new THREE.Mesh(neckGeo, goldMat);
      neckMesh.position.y = -1.5;
      neckMesh.castShadow = true;
      trophyGroup.add(neckMesh);

      const orbGeo = new THREE.SphereGeometry(0.4, 32, 32);
      const orbMesh = new THREE.Mesh(orbGeo, goldMat);
      orbMesh.position.y = -0.8;
      orbMesh.castShadow = true;
      trophyGroup.add(orbMesh);

      const laurelGeo = new THREE.TorusGeometry(0.9, 0.08, 16, 100, Math.PI * 1.55);
      const leftLaurel = new THREE.Mesh(laurelGeo, goldMat);
      leftLaurel.rotation.z = Math.PI / 4;
      leftLaurel.position.set(-0.2, 0.4, 0);
      leftLaurel.castShadow = true;
      trophyGroup.add(leftLaurel);

      const rightLaurel = leftLaurel.clone();
      rightLaurel.rotation.z = -Math.PI / 4;
      rightLaurel.position.x = 0.2;
      trophyGroup.add(rightLaurel);

      const starGeo = new THREE.ConeGeometry(0.35, 1.2, 4);
      const starMesh = new THREE.Mesh(starGeo, goldMat);
      starMesh.position.y = 0.5;
      starMesh.rotation.x = Math.PI;
      starMesh.rotation.y = Math.PI / 4;
      starMesh.castShadow = true;
      trophyGroup.add(starMesh);

      const gemGeo = new THREE.OctahedronGeometry(0.4, 0);
      const gemMesh = new THREE.Mesh(gemGeo, goldMat);
      gemMesh.position.y = 0.2;
      gemMesh.castShadow = true;
      trophyGroup.add(gemMesh);

      setLoading(false);
      onLoaded?.();
    };

    // 9. Load Real GLB with Draco Compression Decoder Enabled
    const loader = new GLTFLoader();
    
    // Create and link the Draco Decoder
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/trophy.glb", 
      (gltf) => {
        setUsingFallback(false);
        const model = gltf.scene;

        // Auto scale to fit beautifully in the theater stage
        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetSize = 3.5;
        const scaleVal = targetSize / (maxDim || 1);
        model.scale.setScalar(scaleVal);

        // Center on pivot
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center.multiplyScalar(scaleVal));

        // Apply premium shiny studio gold material overrides
        const shinyGoldMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(AWARDS_CONFIG.fallback.color),
          metalness: AWARDS_CONFIG.fallback.metalness,
          roughness: AWARDS_CONFIG.fallback.roughness,
        });

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            child.material = shinyGoldMat;
          }
        });

        trophyGroup.add(model);
        
        // Clean up memory after unpacking
        dracoLoader.dispose();
        
        setLoading(false);
        onLoaded?.();
      },
      undefined,
      (error) => {
        console.warn(
          "Loader issue parsing /trophy.glb. Launching procedural fallback mode.",
          error
        );
        buildProceduralTrophy();
      }
    );

    // 10. GSAP ScrollTrigger Setup
    const state = renderState.current;
    const isMobile = window.innerWidth <= 768;

    // Majestic Entry Sequence
    gsap.timeline({
      onComplete: () => {
        createScrollAnimations();
      }
    })
    .to(state, {
      trophyY: isMobile ? -1.6 : -0.4,
      trophyScale: isMobile ? 1.05 : 1.0,
      duration: 2.2,
      ease: "power3.out"
    })
    .to(state, {
      trophyRotationY: Math.PI * 2,
      duration: 2.5,
      ease: "power2.out"
    }, "-=2.2");

    const createScrollAnimations = () => {
      const isMobileDevice = window.innerWidth <= 768;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smoothly catches up with the finger scroll instead of snapping aggressively
          invalidateOnRefresh: true,
        },
      });

      if (isMobileDevice) {
        // MOBILE ANIMATIONS - Centered and stacked above/below mobile text cards without overlap
        // MOVE 1: Stacks neatly above Section 2 (The Grand Reveal)
        tl.to(state, {
          trophyX: 0,
          trophyY: 1.6,
          cameraZ: 8.5,
          trophyScale: 1.04,
          trophyRotationY: Math.PI * 1.8,
          trophyRotationX: 0.05,
          lightIntensityGold: 18,
          lightIntensityRim: 28,
          duration: 1,
          ease: "power1.inOut"
        })
        // MOVE 2: Stacks neatly below Section 3 (Celebrating Excellence)
        .to(state, {
          trophyX: 0,
          trophyY: -1.5,
          cameraZ: 8.0,
          trophyScale: 1.04,
          trophyRotationY: Math.PI * 2.8,
          trophyRotationX: -0.05,
          lightIntensityGold: 20,
          lightIntensityRim: 30,
          duration: 1,
          ease: "power1.inOut"
        })
        // MOVE 3: Pushed high to clear the dual-track timeline carousel scrolling horizontally
        .to(state, {
          trophyX: 0,
          trophyY: 2.2,
          cameraZ: 9.5,
          trophyScale: 0.80,
          trophyRotationY: Math.PI * 3.8,
          lightIntensityGold: 14,
          lightIntensityRim: 22,
          duration: 1,
          ease: "power2.inOut"
        })
        // MOVE 4: Centered beautifully for the final footer display
        .to(state, {
          trophyX: 0,
          trophyY: -0.2,
          cameraZ: 7.2,
          trophyScale: 1.30,
          trophyRotationY: Math.PI * 5.0,
          trophyRotationX: 0.05,
          lightIntensityGold: 25,
          lightIntensityRim: 38,
          duration: 1,
          ease: "power1.out"
        });
      } else {
        // DESKTOP ANIMATIONS (Original beautifully mapped layout)
        tl.to(state, {
          trophyX: -2.3,
          trophyY: 0.15,
          cameraZ: 7.2,
          trophyRotationY: Math.PI * 3.8,
          trophyRotationX: 0.1,
          lightIntensityGold: 22,
          lightIntensityRim: 35,
          trophyScale: 1.0,
          duration: 1,
          ease: "power1.inOut"
        })
        // MOVE 2: Slide to Right (Framing the Nominees Panel)
        .to(state, {
          trophyX: 2.3,
          trophyY: -0.2,
          cameraZ: 6.2,
          trophyRotationY: Math.PI * 5.2,
          trophyRotationX: -0.15,
          lightIntensityGold: 28,
          lightIntensityRim: 45,
          trophyScale: 1.0,
          duration: 1,
          ease: "power1.inOut"
        })
        // MOVE 3: Shrink & Float Up (Perfect framing for the Dual-Track Past Winners rows!)
        .to(state, {
          trophyX: -2.0,       // Hugs the left side cleanly
          trophyY: 1.2,        // Elevates up like an emblem out of the track path
          cameraZ: 8.5,        // Backs away slightly
          trophyScale: 0.75,   // Safely downsizes so layout graphics are unmasked
          trophyRotationY: Math.PI * 6.8,
          lightIntensityGold: 18,
          lightIntensityRim: 30,
          duration: 1,
          ease: "power2.inOut"
        })
        // MOVE 4: The Grand Finale Footer Anchor
        .to(state, {
          trophyX: 0,
          trophyY: 0.05,
          cameraZ: 5.2,
          trophyScale: 1.0,    // Restores to majestic full size
          trophyRotationY: Math.PI * 8.5, // High-rotation cinematic final twist
          trophyRotationX: 0.1,
          lightIntensityGold: 35,
          lightIntensityRim: 50,
          duration: 1,
          ease: "power1.out"
        });
      }

      ScrollTrigger.refresh();
    };

    // 11. Core Animation Tick Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (trophyGroupRef.current) {
        const hoverOffset = Math.sin(elapsedTime * 1.5) * 0.08;
        const isMobileScreen = window.innerWidth < 768;
        const currentScale = isMobileScreen ? (state.trophyScale * 1.0) : state.trophyScale;
        
        const adjustedY = isMobileScreen
          ? (pageRef.current === "voting" ? -1.8 : state.trophyY + 0.975)
          : state.trophyY;
          
        const adjustedX = isMobileScreen
          ? (pageRef.current === "voting" ? 0 : state.trophyX * 0.3)
          : state.trophyX;
          
        trophyGroupRef.current.position.y = adjustedY + hoverOffset;
        trophyGroupRef.current.position.x = adjustedX;
        
        trophyGroupRef.current.rotation.y = state.trophyRotationY + Math.sin(elapsedTime * 0.4) * 0.05;
        trophyGroupRef.current.rotation.x = state.trophyRotationX + Math.cos(elapsedTime * 0.6) * 0.03;
        
        trophyGroupRef.current.scale.setScalar(currentScale);
      }

      const positions = sparkles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.008;
        if (positions[i * 3 + 1] > 6) {
          positions[i * 3 + 1] = -6;
        }
      }
      sparkles.geometry.attributes.position.needsUpdate = true;
      sparkles.rotation.y = elapsedTime * 0.02;

      if (cameraRef.current) {
        cameraRef.current.position.z = state.cameraZ;
      }

      if (goldSpotlightRef.current) {
        goldSpotlightRef.current.intensity = state.lightIntensityGold;
        goldSpotlightRef.current.position.x = 5 + Math.sin(elapsedTime * 0.5) * 1.5;
      }
      if (rimLightRef.current) {
        rimLightRef.current.intensity = state.lightIntensityRim;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Standard Resize Handling
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const { width, height } = entry.contentRect;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    });

    resizeObserver.observe(containerRef.current);

    // 13. Cleanup function on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    pageRef.current = page;
    const state = renderState.current;
    if (page === "voting") {
      ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
      const isMobile = window.innerWidth < 1024;
      
      gsap.to(state, {
        trophyX: isMobile ? 0 : 2.3,
        trophyY: isMobile ? -3.4 : -0.2,
        cameraZ: isMobile ? 9.5 : 6.5,
        trophyRotationY: Math.PI * 3.2,
        trophyRotationX: 0.1,
        lightIntensityGold: 25,
        lightIntensityRim: 40,
        duration: 1.5,
        overwrite: "auto",
        ease: "power2.out"
      });
    } else {
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.enable();
      });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [page]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none translate-y-24 sm:translate-y-0 origin-bottom"
      id="three-canvas-container"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-transparent"
        id="trophy-three-canvas"
      />
      {loading && (
        <div 
          id="loading-indicator" 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 transition-opacity duration-700"
        >
          <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-amber-400 font-sans tracking-wide text-sm font-medium uppercase animate-pulse">
            Carving the Golden Grail...
          </p>
        </div>
      )}
      {!loading && usingFallback && (
        <div 
          id="fallback-badge"
          className="absolute top-6 left-6 z-40 bg-zinc-900/90 border border-amber-500/20 rounded-full px-4 py-1.5 backdrop-blur-md flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="font-mono text-[10px] uppercase text-zinc-400 tracking-wider">
            Procedural Golden Backdrop Active
          </span>
        </div>
      )}
    </div>
  );
}