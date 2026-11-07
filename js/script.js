const nav = document.getElementById('nav');
const links = [...nav.querySelectorAll('a')];
let closeTimer;

const open = () => { clearTimeout(closeTimer); nav.classList.add('open'); };
const close = () => { closeTimer = setTimeout(() => nav.classList.remove('open'), 250); };

// Desktop: abre ao passar o mouse, fecha ao sair
nav.addEventListener('mouseenter', open);
nav.addEventListener('mouseleave', close);
// Teclado: abre ao focar, fecha ao sair do foco
nav.addEventListener('focusin', open);
nav.addEventListener('focusout', close);
// Toque (celular): abre no 1º toque, fecha ao tocar fora
nav.addEventListener('click', () => { if (!nav.classList.contains('open')) open(); });
document.addEventListener('click', e => { if (!nav.contains(e.target)) nav.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') nav.classList.remove('open'); });

// Destaca o link da seção que está na tela
const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
        if (en.isIntersecting && byId[en.target.id]) {
            links.forEach(a => a.removeAttribute('aria-current'));
            byId[en.target.id].setAttribute('aria-current', 'true');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section').forEach(s => spy.observe(s));

//fundo animado

const hero = document.querySelector("#inicio");
const canvas = document.querySelector("#estrelas");
const ctx = canvas.getContext("2d");

let estrelas = [];

function ajustarTamanho() {
    const escala = window.devicePixelRatio || 1;
    const largura = hero.clientWidth;
    const altura = hero.clientHeight;

    canvas.width = largura * escala;
    canvas.height = altura * escala;
    canvas.style.width = `${largura}px`;
    canvas.style.height = `${altura}px`;

    ctx.setTransform(escala, 0, 0, escala, 0, 0);

    estrelas = Array.from({ length: 200 }, () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        raio: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6
    }));
}

function animar() {
    const largura = hero.clientWidth;
    const altura = hero.clientHeight;

    ctx.clearRect(0, 0, largura, altura);

    for (const estrela of estrelas) {
        ctx.beginPath();
        ctx.arc(estrela.x, estrela.y, estrela.raio, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        estrela.x += estrela.vx;
        estrela.y += estrela.vy;

        // Reaparece do outro lado ao cruzar uma borda
        if (estrela.x < 0) estrela.x = largura;
        if (estrela.x > largura) estrela.x = 0;
        if (estrela.y < 0) estrela.y = altura;
        if (estrela.y > altura) estrela.y = 0;
    }

    requestAnimationFrame(animar);
}

window.addEventListener("resize", ajustarTamanho);

ajustarTamanho();
animar();

const form = document.getElementById('form-contato');

form.addEventListener('submit', e => {
    e.preventDefault();
    const dados = new FormData(form);
    const corpo = `${dados.get('mensagem')}\n\n— ${dados.get('nome')} (${dados.get('email')})`;

    window.location.href =
        `mailto:arthurgarcia.dev@gmail.com` +
        `?subject=${encodeURIComponent(dados.get('assunto'))}` +
        `&body=${encodeURIComponent(corpo)}`;
});

function montarStack() {
    document.querySelectorAll('.stack-faixa').forEach(faixa => {
        const trilha = faixa.querySelector('.stack-trilha');
        if (!trilha) return;

        // limpa cópias antigas (necessário ao redimensionar)
        trilha.querySelectorAll('[data-clone]').forEach(c => c.remove());

        const originais = [...trilha.children];
        const larguraLista = trilha.scrollWidth;
        if (!originais.length || !larguraLista) return;

        let total = Math.ceil((faixa.clientWidth * 2) / larguraLista);
        if (total % 2) total++;

        for (let i = 1; i < total; i++) {
            originais.forEach(item => {
                const clone = item.cloneNode(true);
                clone.dataset.clone = 'true';
                clone.setAttribute('aria-hidden', 'true');
                trilha.appendChild(clone);
            });
        }
    });
}

montarStack();

let esperaStack;
window.addEventListener('resize', () => {
    clearTimeout(esperaStack);
    esperaStack = setTimeout(montarStack, 200);
});

function copiar() {
    navigator.clipboard.writeText("arthurgarcia.dev@gmail.com");
}


// Menu mobile
const header = document.querySelector('.header');
const botaoMenu = document.getElementById('menu-botao');

function alternarMenu(abrir) {
    const aberto = abrir ?? !header.classList.contains('aberto');
    header.classList.toggle('aberto', aberto);
    botaoMenu.setAttribute('aria-expanded', aberto);
    botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
}

botaoMenu.addEventListener('click', () => alternarMenu());
document.getElementById('menu').addEventListener('click', e => { if (e.target.closest('a')) alternarMenu(false); });
document.addEventListener('click', e => { if (!header.contains(e.target)) alternarMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') alternarMenu(false); });
window.matchMedia('(min-width: 769px)').addEventListener('change', () => alternarMenu(false));