(function(){
  'use strict';

  var canvas = document.querySelector('.soft-aurora-background');
  var hero = document.getElementById('topo');
  if (!canvas || !hero) return;

  var gl = canvas.getContext('webgl', {alpha:true, premultipliedAlpha:false, antialias:false});
  if (!gl) return;

  var vertexShaderSource = [
    'attribute vec2 position;',
    'attribute vec2 uv;',
    'varying vec2 vUv;',
    'void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }'
  ].join('\n');

  var fragmentShaderSource = [
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform float uTime;',
    'uniform vec3 uResolution;',
    'uniform vec2 uMouse;',
    'uniform bool uEnableMouse;',
    'const float TAU = 6.28318;',
    'vec3 gradientHash(vec3 p){',
    '  p = vec3(dot(p, vec3(127.1,311.7,234.6)), dot(p, vec3(269.5,183.3,198.3)), dot(p, vec3(169.5,283.3,156.9)));',
    '  vec3 h = fract(sin(p) * 43758.5453123);',
    '  float phi = acos(2.0 * h.x - 1.0);',
    '  float theta = TAU * h.y;',
    '  return vec3(cos(theta)*sin(phi), sin(theta)*cos(phi), cos(phi));',
    '}',
    'float smooth5(float t){ return t*t*t*(t*(t*6.0-15.0)+10.0); }',
    'float perlin3D(float amplitude, float frequency, vec2 p, float z){',
    '  vec2 q = p * frequency;',
    '  vec2 base = floor(q);',
    '  vec2 f = fract(q);',
    '  float z0 = floor(z);',
    '  float zf = fract(z);',
    '  vec3 g000 = gradientHash(vec3(base, z0));',
    '  vec3 g100 = gradientHash(vec3(base + vec2(1.0,0.0), z0));',
    '  vec3 g010 = gradientHash(vec3(base + vec2(0.0,1.0), z0));',
    '  vec3 g110 = gradientHash(vec3(base + vec2(1.0,1.0), z0));',
    '  vec3 g001 = gradientHash(vec3(base, z0+1.0));',
    '  vec3 g101 = gradientHash(vec3(base + vec2(1.0,0.0), z0+1.0));',
    '  vec3 g011 = gradientHash(vec3(base + vec2(0.0,1.0), z0+1.0));',
    '  vec3 g111 = gradientHash(vec3(base + vec2(1.0,1.0), z0+1.0));',
    '  float n000 = dot(g000, vec3(f, zf));',
    '  float n100 = dot(g100, vec3(f-vec2(1.0,0.0), zf));',
    '  float n010 = dot(g010, vec3(f-vec2(0.0,1.0), zf));',
    '  float n110 = dot(g110, vec3(f-vec2(1.0,1.0), zf));',
    '  float n001 = dot(g001, vec3(f, zf-1.0));',
    '  float n101 = dot(g101, vec3(f-vec2(1.0,0.0), zf-1.0));',
    '  float n011 = dot(g011, vec3(f-vec2(0.0,1.0), zf-1.0));',
    '  float n111 = dot(g111, vec3(f-vec2(1.0,1.0), zf-1.0));',
    '  vec2 w = vec2(smooth5(f.x), smooth5(f.y));',
    '  float a = mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y);',
    '  float b = mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y);',
    '  return amplitude * mix(a,b,smooth5(zf));',
    '}',
    'float aurora(vec2 uv, float t, vec2 shift){',
    '  uv += shift;',
    '  vec2 p = uv * 1.5;',
    '  float n = 0.0;',
    '  float amp = 1.0;',
    '  float freq = 2.5;',
    '  for(int i=0;i<3;i++){ n += perlin3D(amp,freq,p,t); amp *= 0.1; freq *= 2.0; }',
    '  float yBand = uv.y * 10.0 - 5.0;',
    '  return 0.3 * exp(1.0 * (1.0 - 1.1 * abs(n + yBand)));',
    '}',
    'vec3 cosineGradient(float t, vec3 c, vec3 d){ return vec3(0.5) + vec3(0.5)*cos(TAU*(c*t+d)); }',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / uResolution.xy;',
    '  vec2 shift = uEnableMouse ? (uMouse-0.5)*0.25 : vec2(0.0);',
    '  float t = 0.6 * 0.4 * uTime;',
    '  float glow1 = aurora(gl_FragCoord.xy / uResolution.y, t, shift);',
    '  float glow2 = aurora(gl_FragCoord.xy / uResolution.y, t, shift);',
    '  vec3 grad1 = cosineGradient(uv.x + uTime*0.6*0.2, vec3(1.0), vec3(0.3,0.20,0.20));',
    '  vec3 grad2 = cosineGradient(uv.x + uTime*0.6*0.1, vec3(2.0,1.0,0.0), vec3(0.5,0.20,0.25));',
    '  vec3 color1 = vec3(247.0,247.0,247.0)/255.0;',
    '  vec3 color2 = vec3(225.0,0.0,255.0)/255.0;',
    '  vec3 col = 0.99*glow1*grad1*color1 + 0.99*glow2*grad2*color2;',
    '  col *= 1.0;',
    '  gl_FragColor = vec4(col, clamp(length(col),0.0,1.0));',
    '}'
  ].join('\n');

  function compile(type, source){
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
      console.error('Falha ao compilar SoftAurora:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  var vertexShader = compile(gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertexShader || !fragmentShader) return;

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('Falha ao conectar SoftAurora:', gl.getProgramInfoLog(program));
    return;
  }

  var positions = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positions);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1,-1, 0,0,
     1,-1, 1,0,
    -1, 1, 0,1,
    -1, 1, 0,1,
     1,-1, 1,0,
     1, 1, 1,1
  ]), gl.STATIC_DRAW);

  gl.useProgram(program);
  var positionLocation = gl.getAttribLocation(program, 'position');
  var uvLocation = gl.getAttribLocation(program, 'uv');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
  gl.enableVertexAttribArray(uvLocation);
  gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);

  var timeLocation = gl.getUniformLocation(program, 'uTime');
  var resolutionLocation = gl.getUniformLocation(program, 'uResolution');
  var mouseLocation = gl.getUniformLocation(program, 'uMouse');
  var mouseEnabledLocation = gl.getUniformLocation(program, 'uEnableMouse');
  var pixelRatio = 1;
  var startedAt = performance.now();
  var frame = 0;
  var mouseX = 0.5;
  var mouseY = 0.5;
  var targetMouseX = 0.5;
  var targetMouseY = 0.5;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize(){
    var bounds = hero.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
    canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform3f(resolutionLocation, canvas.width, canvas.height, canvas.width / canvas.height);
    render(performance.now(), false);
  }

  function render(timestamp, scheduleFrame){
    if (!canvas.isConnected) return;
    if (!reduceMotion){
      mouseX += 0.05 * (targetMouseX - mouseX);
      mouseY += 0.05 * (targetMouseY - mouseY);
    }
    gl.uniform1f(timeLocation, reduceMotion ? 0 : (timestamp - startedAt) / 1000);
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    gl.uniform1i(mouseEnabledLocation, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (!reduceMotion && scheduleFrame !== false) frame = requestAnimationFrame(render);
  }

  function handlePointerMove(event){
    var bounds = hero.getBoundingClientRect();
    targetMouseX = (event.clientX - bounds.left) / bounds.width;
    targetMouseY = 1 - (event.clientY - bounds.top) / bounds.height;
  }
  function handlePointerLeave(){ targetMouseX = 0.5; targetMouseY = 0.5; }

  var resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  hero.addEventListener('pointermove', handlePointerMove, {passive:true});
  hero.addEventListener('pointerleave', handlePointerLeave, {passive:true});
  window.addEventListener('resize', resize);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);
  resize();
  render(performance.now());

  var removalObserver = new MutationObserver(function(){
    if (!hero.isConnected){
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      removalObserver.disconnect();
      window.removeEventListener('resize', resize);
    }
  });
  removalObserver.observe(document.body, {childList:true, subtree:true});
})();
