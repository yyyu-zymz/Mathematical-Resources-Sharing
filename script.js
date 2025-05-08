document.addEventListener('DOMContentLoaded', () => {
    // ============== 动态标题打字效果 ==============
    const titleElement = document.getElementById('main-title');
    const titleText = '数学资源中心';
    let charIndex = 0;
    
    const typeWriter = () => {
        if (charIndex < titleText.length) {
            titleElement.textContent += titleText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 150);
        }
    };
    typeWriter();

    // ============== 导航栏交互逻辑 ==============
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.sticky-nav a');
    
    const highlightNav = () => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
                const targetId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${targetId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    // ============== 函数绘图功能 ==============
    const plotFunction = () => {
        try {
            const expr = document.getElementById('function-input').value;
            const xMin = parseFloat(document.getElementById('x-min').value);
            const xMax = parseFloat(document.getElementById('x-max').value);

            if (!expr) throw new Error('请输入函数表达式');
            if (xMin >= xMax) throw new Error('起始值必须小于结束值');

            const xValues = [];
            const yValues = [];
            for (let x = xMin; x <= xMax; x += 0.1) {
                xValues.push(x);
                const safeExpr = expr
                    .replace(/[^0-9x+\-*/().^]/g, '')
                    .replace(/x/g, `(${x})`);
                yValues.push(Function(`return ${safeExpr}`)());
            }

            Plotly.newPlot('graph-container', [{
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#6c5ce7', width: 2 }
            }], {
                title: `函数图像：${expr}`,
                margin: { t: 40, b: 40 },
                xaxis: { range: [xMin, xMax] }
            });

            document.getElementById('error-msg').style.display = 'none';
        } catch (error) {
            const errorElem = document.getElementById('error-msg');
            errorElem.textContent = `错误：${error.message}`;
            errorElem.style.display = 'block';
            setTimeout(() => {
                errorElem.style.opacity = '0';
                setTimeout(() => {
                    errorElem.style.display = 'none';
                    errorElem.style.opacity = '1';
                }, 1000);
            }, 3000);
        }
    };
    document.getElementById('plot-btn').addEventListener('click', plotFunction);

    // ============== 粒子背景系统 ==============
    const initParticleBackground = () => {
        const canvas = document.getElementById('bgCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const PARTICLE_COUNT = 100;
        const LINE_MAX_DISTANCE = 120;
        const LINE_FADE_SPEED = 0.02;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = (Math.random() - 0.5) * 0.4;
                this.radius = Math.random() * 0.8 + 0.5;
                this.alpha = Math.random() * 0.2 + 0.1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(108, 92, 231, ${this.alpha})`;
                ctx.fill();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // 边界反弹逻辑
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }
        }

        class Connection {
            constructor(p1, p2) {
                this.p1 = p1;
                this.p2 = p2;
                this.life = 1;
            }

            draw() {
                const dx = this.p1.x - this.p2.x;
                const dy = this.p1.y - this.p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                ctx.beginPath();
                ctx.moveTo(this.p1.x, this.p1.y);
                ctx.lineTo(this.p2.x, this.p2.y);
                ctx.strokeStyle = `rgba(108, 92, 231, ${this.life * 0.15})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();
                
                this.life -= LINE_FADE_SPEED;
            }
        }

        const particles = Array.from({length: PARTICLE_COUNT}, () => new Particle());
        let connections = [];

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((p1, i) => {
                p1.update();
                p1.draw();

                // 均匀连接检测
                particles.slice(i+1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);

                    if (dist < LINE_MAX_DISTANCE && Math.random() < 0.1) {
                        connections.push(new Connection(p1, p2));
                    }
                });
            });

            connections = connections.filter(conn => {
                conn.draw();
                return conn.life > 0;
            });

            requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    };

    initParticleBackground();
});



// 卡片悬停3D效果
document.querySelectorAll('.practice-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.transform = `
            perspective(1000px)
            rotateX(${(y - rect.height/2)/20}deg)
            rotateY(${-(x - rect.width/2)/20}deg)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
    });
});

