import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface ImageSet {
  original: string;
  depth: string;
  character: string;
  graffiti: string;
}

const IMAGE_SETS: ImageSet[] = [
  {
    original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da336f08670cc24b5744_bg1.webp',
    depth: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94a151d20d360320bd6_bg-map1.webp',
    character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94a89e94d5f060ba272_character1.webp',
    graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94beb0ce3c356aebe83_graffiti1.webp'
  },
  {
    original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da343538ad9615a3e8e3_bg2.webp',
    depth: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94abaf5625c6ed9d59d_bg-map2.webp',
    character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b17bbe69f351bf5cb_character2.webp',
    graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b7b7928efc8a1ab02_graffiti2.webp'
  },
  {
    original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da34bb5f1230758e3287_bg3.webp',
    depth: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94bff08eb308aa3d303_bg-map3.webp',
    character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94bc0f6499a0bea1ca2_character3.webp',
    graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b151d20d360320cd9_graffiti3.webp'
  },
  {
    original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da33f92ab0e6f329759d_bg4.webp',
    depth: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94a4916501c1247685c_bg-map5.webp',
    character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b5ed4549ca8f90ccd_character4.webp',
    graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/67edb7ced0ea720e18c421bd_GRAFFITI44%201.avif'
  },
  {
    original: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756da3325a2363cf420673d_bg5.webp',
    depth: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94a151d20d360320b9f_bg-map4.webp',
    character: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/6756d94b0eda885a6e929f4f_character5.webp',
    graffiti: 'https://cdn.prod.website-files.com/6740471331c3ef2ba0ada212/67eda8180b63cb2ac5e5267f_GRAFFITI-28xxo%20(1).avif'
  }
];


const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) / 2.0;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform sampler2D u_imageOriginal;
  uniform sampler2D u_imageDepth;
  uniform sampler2D u_imageNext;
  uniform sampler2D u_imageNextDepth;
  uniform vec2 u_mouse;
  uniform float u_depthMultiplier;
  uniform float u_transition;
  varying vec2 v_uv;

  void main() {
    vec2 uv = vec2(v_uv.x, 1.0 - v_uv.y);
    
    // Previous state
    vec4 depth = texture2D(u_imageDepth, uv);
    vec2 offset = (depth.r - 0.5) * u_mouse * u_depthMultiplier;
    vec4 colorPrev = texture2D(u_imageOriginal, uv + offset);
    
    // Next state
    vec4 depthNext = texture2D(u_imageNextDepth, uv);
    vec2 offsetNext = (depthNext.r - 0.5) * u_mouse * u_depthMultiplier;
    vec4 colorNext = texture2D(u_imageNext, uv + offsetNext);
    
    gl_FragColor = mix(colorPrev, colorNext, u_transition);
  }
`;

export const DepthMapBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const characterRef = useRef<HTMLImageElement>(null);
  const graffitiRef = useRef<HTMLImageElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoCycleRef = useRef<NodeJS.Timeout | null>(null);
  const transitionRef = useRef({ value: 1 });
  const mouse = useRef({ x: 0, y: 0 });
  const mouseTarget = useRef({ x: 0, y: 0 });
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const nextTexturesRef = useRef<WebGLTexture[]>([]);

  const params = {
    depthMultiplier: 0.04,
    smoothing: 0.05,
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const gl = canvasRef.current.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, VERTEX_SHADER));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);
    programRef.current = program;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    
    const posLoc = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Initial load
    (async () => {
      const set = IMAGE_SETS[0];
      const images = await Promise.all([loadImage(set.original), loadImage(set.depth)]);
      texturesRef.current = images.map(img => createTexture(gl, img));
      nextTexturesRef.current = [...texturesRef.current];
      
      if (characterRef.current) {
        characterRef.current.src = set.character;
        gsap.to(characterRef.current, { opacity: 1, duration: 1.5 });
      }
      if (graffitiRef.current) {
        graffitiRef.current.src = set.graffiti;
        gsap.to(graffitiRef.current, { opacity: 1, duration: 2 });
      }
    })();

    // Auto-cycle every 4 seconds
    autoCycleRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % IMAGE_SETS.length;
        loadAndApplySet(next);
        return next;
      });
    }, 4500);

    let animationId: number;
    const render = () => {
      mouse.current.x += (mouseTarget.current.x - mouse.current.x) * params.smoothing;
      mouse.current.y += (mouseTarget.current.y - mouse.current.y) * params.smoothing;

      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.uniform2f(gl.getUniformLocation(program, 'u_mouse'), mouse.current.x, mouse.current.y);
      gl.uniform1f(gl.getUniformLocation(program, 'u_depthMultiplier'), params.depthMultiplier);
      gl.uniform1f(gl.getUniformLocation(program, 'u_transition'), transitionRef.current.value);

      if (texturesRef.current.length === 2 && nextTexturesRef.current.length === 2) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[0]);
        gl.uniform1i(gl.getUniformLocation(program, 'u_imageOriginal'), 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texturesRef.current[1]);
        gl.uniform1i(gl.getUniformLocation(program, 'u_imageDepth'), 1);

        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, nextTexturesRef.current[0]);
        gl.uniform1i(gl.getUniformLocation(program, 'u_imageNext'), 2);

        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, nextTexturesRef.current[1]);
        gl.uniform1i(gl.getUniformLocation(program, 'u_imageNextDepth'), 3);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (autoCycleRef.current) clearInterval(autoCycleRef.current);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const createTexture = (gl: WebGLRenderingContext, img: HTMLImageElement) => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    return tex;
  };

  const loadAndApplySet = async (index: number) => {
    const gl = glRef.current;
    if (!gl) return;

    if (autoCycleRef.current) {
        clearInterval(autoCycleRef.current);
        autoCycleRef.current = setInterval(() => {
            setCurrentIndex((prev) => {
              const next = (prev + 1) % IMAGE_SETS.length;
              loadAndApplySet(next);
              return next;
            });
          }, 4500);
    }

    const set = IMAGE_SETS[index];
    
    // Start character/graffiti glitch-smooth transition
    if (characterRef.current) smoothTransition(characterRef.current, set.character);
    if (graffitiRef.current) smoothTransition(graffitiRef.current, set.graffiti);

    const images = await Promise.all([loadImage(set.original), loadImage(set.depth)]);
    
    // Prepare next textures
    const newNextTextures = images.map(img => createTexture(gl, img));
    
    // If we're already mid-transition, jump to end
    gsap.killTweensOf(transitionRef.current);
    
    // Set current textures to what was the "next" textures
    texturesRef.current.forEach(t => gl.deleteTexture(t));
    texturesRef.current = [...nextTexturesRef.current];
    
    // Set the new next target
    nextTexturesRef.current = newNextTextures;
    
    // Start crossfade
    transitionRef.current.value = 0;
    gsap.to(transitionRef.current, {
      value: 1,
      duration: 1.2, 
      ease: 'sine.inOut',
      onComplete: () => {
        setCurrentIndex(index);
      }
    });
  };

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      img.onload = () => resolve(img);
    });
  };

  const smoothTransition = (el: HTMLImageElement, newSrc: string) => {
    gsap.to(el, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        el.src = newSrc;
        gsap.to(el, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scale: 1,
          filter: 'none'
        });
      }
    });
  };

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full object-cover opacity-60 scale-110" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6 sm:p-12">
        <img 
          ref={characterRef}
          className="character-img max-h-[60vh] sm:max-h-[95vh] w-auto object-contain opacity-0 mix-blend-lighten transition-opacity duration-1000 z-10 drop-shadow-[0_0_80px_rgba(255,255,255,0.25)] filter"
          alt=""
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          ref={graffitiRef}
          className="graffiti-img w-full h-full object-cover opacity-0 mix-blend-color-dodge scale-150 grayscale brightness-75 z-0"
          alt=""
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/40 z-20" />
      <div className="absolute inset-0 bg-[#030303]/10 backdrop-blur-[1px] z-20" />

      {/* Navigation Controls */}
      <div className="absolute bottom-10 right-10 z-50 flex items-center gap-4 pointer-events-auto">
        <div className="flex gap-2 p-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
          {IMAGE_SETS.map((_, i) => (
            <button
              key={i}
              onClick={() => loadAndApplySet(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === i 
                  ? 'bg-white scale-125 shadow-[0_0_15px_rgba(255,255,255,0.5)]' 
                  : 'bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

