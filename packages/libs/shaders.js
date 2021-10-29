export const VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float hover;
  uniform float hoverRadius;
  uniform float amplitude;
  uniform float speed;
  uniform float time;
  uniform vec4 corners;
  uniform float startZ;
  uniform float targetZ;
  uniform vec2 intersect;

  void main() {
    vUv = uv;
    float _corners = mix(mix(corners.z, corners.w, uv.x), mix(corners.x, corners.y, uv.x), uv.y);

    // _corners = smoothstep(0., 1.0, _corners);
    vec3 _position = position;
    vec4 _slide = modelMatrix * vec4(position, 1.0);
    _slide.z = startZ;

    vec4 _target = _slide;
    _target.z = targetZ;

    if (hover > 0.0) {
      float _ease = sin(speed * (_position.x + _position.y) + 1.5 * time);
      float _wave = hover * amplitude * _ease;
      float _dist = length(uv - intersect);
      float _inCircle = 1. - (clamp(_dist, 0., hoverRadius) / hoverRadius);
      float _distort = _inCircle * _wave;

      _slide.z += _distort;
    }

    gl_Position = projectionMatrix * viewMatrix * mix(_slide, _target, _corners);
  }
`;

export const FRAGMENT_SHADER = `
  uniform sampler2D u_texture;
  uniform sampler2D u_texture2;
  uniform sampler2D u_disp;
  uniform float hover;
  uniform vec2 ratio;
  uniform float effectFactor;

  varying vec2 vUv;

  vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);

    mat2 m = mat2(c, -s, s, c);

    return m * v;
  }

  void main() {
    vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    vec4 disp = texture2D(u_disp, uv);

    vec2 distPosition = vec2(uv.x + hover * (disp.r * effectFactor), uv.y);
    vec2 distPosition2 = vec2(uv.x - (1.0 - hover) * (disp.r * effectFactor), uv.y);

    vec4 _texture = texture2D(u_texture, distPosition);
    vec4 _texture2 = texture2D(u_texture2, distPosition2);

    vec4 finalTexture = mix(_texture, _texture2, hover);

    vec4 color = finalTexture;

    gl_FragColor = color;
  }
`;
