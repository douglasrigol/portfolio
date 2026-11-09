# Portfólio — Douglas Rigol

Portfólio pessoal de **Douglas Rigol**, desenvolvedor Front end e UX/UI designer de Torres – RS.
O site reúne meus projetos, meu processo de trabalho, as ferramentas que uso e os canais de contato, com foco em interfaces rápidas, animadas e com identidade visual própria.

## Tecnologias

- **HTML5** semântico
- **CSS3**: variáveis, Grid, Flexbox, `clamp()`, `color-mix()` e media queries
- **JavaScript** puro, sem framework
- **GSAP + ScrollTrigger**: animações de entrada e revelação ao rolar
- **Lenis**: rolagem suave
- **WebGL**: fundo animado (aurora) feito com shader próprio
- Fonte **Manrope** (Google Fonts)

## Destaques

- **Preloader** com barra de progresso que acompanha o carregamento real das imagens e fontes
- **Título com efeito split-flap**, como um painel de aeroporto
- **Fundo aurora em WebGL** que reage ao movimento do mouse
- **Textos animados ao rolar**, letra por letra
- **Carrossel de projetos em pilha**: navegação por arraste, setas, teclado ou deslize no celular
- **Abas de Ferramentas e Habilidades** com indicadores de nível
- **Perguntas frequentes** com `<details>` nativo
- **Navegação adaptada ao celular**, com barra flutuante na parte de baixo da tela
- **Respeita `prefers-reduced-motion`**: as animações são reduzidas para quem prefere menos movimento
- Layout **responsivo**, do celular ao desktop

## Projetos em destaque

| Projeto | Tipo | Link |
|---|---|---|
| Spider-Man: Um Novo Dia | Fã-site · Front-end | [spider-man-alpha-five.vercel.app](https://spider-man-alpha-five.vercel.app) |
| Savana Publicidade | Site institucional | [savana-publicidade.vercel.app](https://savana-publicidade.vercel.app) |
| Céu de Origem | Landing page interativa | [ceu-de-origem-one.vercel.app](https://ceu-de-origem-one.vercel.app) |
| ORBIS | Experimento 3D | [orbis-gray.vercel.app](https://orbis-gray.vercel.app) |
| Calculadora de gorjeta | Ferramenta · JavaScript | [calculadora-de-gorjeta-3d.vercel.app](https://calculadora-de-gorjeta-3d.vercel.app) |
| Órbita de tarefas | Aplicação · Front-end | [orbita-de-tarefas.vercel.app](https://orbita-de-tarefas.vercel.app) |
| Professora de inglês | Site · Educação | [prof-ingles-two.vercel.app](https://prof-ingles-two.vercel.app) |
| Moon Prism | Experiência 3D | [moon-prism.vercel.app](https://moon-prism.vercel.app) |

## Estrutura

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── script.js        # preloader, animações, carrossel, abas e navegação
│   ├── split-flap.js    # efeito de painel no título
│   └── soft-aurora.js   # fundo aurora em WebGL
└── assets/
    ├── projetos/        # capas dos projetos (.webp)
    └── ...              # foto e proposta comercial
```

## Como rodar localmente

O site é estático, então não precisa de build nem de instalar nada.

1. Clone o repositório:
   ```bash
   git clone https://github.com/douglasrigol/portfolio.git
   cd portfolio
   ```
2. Abra o `index.html` no navegador ou, de preferência, use um servidor local, como a extensão **Live Server** do VS Code ou:
   ```bash
   npx serve .
   ```

> GSAP, ScrollTrigger, Lenis e a fonte Manrope são carregados por CDN, então é preciso estar conectado à internet. Sem o GSAP, o site cai num modo sem animações e continua funcionando.

## Contato

- **E-mail:** [Douglasrigol@icloud.com](mailto:Douglasrigol@icloud.com)
- **LinkedIn:** [linkedin.com/in/douglas-rigol-8b70a62a1](https://www.linkedin.com/in/douglas-rigol-8b70a62a1/)
- **GitHub:** [github.com/douglasrigol](https://github.com/douglasrigol)

---

© 2026 Douglas Rigol. Todos os direitos reservados.
