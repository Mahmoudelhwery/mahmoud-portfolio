/* -------------------------------------------------------------
   Mahmoud Maher Portfolio JS Core Logic
   Includes: Particle Network Background, Console Terminal,
   Typing Effect, Nav Toggle, and Form Handler
------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Close mobile nav when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = navToggle.querySelector('i');
            if (icon) icon.className = 'fa-solid fa-bars';
            
            // Set active class
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // 2. Typing Effect for Hero Subtitle
    const words = ["NOC Engineer", "Network Engineer", "Cloud Solutions Architect", "Cybersecurity Specialist", "Computers & Information Graduate"];
    let i = 0;
    let timer;

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                document.getElementById('typed-text').innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 80);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                document.getElementById('typed-text').innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                setTimeout(typingEffect, 500);
                return false;
            }
            timer = setTimeout(loopDeleting, 40);
        };
        loopDeleting();
    }

    typingEffect();

    // 3. Canvas Interactive Network Background
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 90;
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary collision
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            // Mouse repulsion behavior
            if (mouse.x != null && mouse.y != null) {
                let dx = this.x - mouse.x;
                let dy = this.y - mouse.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.7)';
            ctx.fill();
        }
    }

    function initParticles() {
        resizeCanvas();
        particles = [];
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDistance) {
                    let alpha = (1 - (dist / connectionDistance)) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // 4. Interactive Console Emulator
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');
    const commandPills = document.querySelectorAll('.command-pills .pill');

    const commands = {
        help: [
            "Available commands:",
            "  <span class='highlight-cmd'>skills</span>         - Displays detailed technical skill matrix",
            "  <span class='highlight-cmd'>experience</span>     - Initiates traceroute to educational/career hops",
            "  <span class='highlight-cmd'>certs</span>          - Lists active engineering certifications",
            "  <span class='highlight-cmd'>ping [ip]</span>      - Pings target endpoint (e.g. 8.8.8.8, aws.amazon.com)",
            "  <span class='highlight-cmd'>about</span>          - Prints short summary about Mahmoud",
            "  <span class='highlight-cmd'>clear</span>          - Clears terminal output logs",
            "  <span class='highlight-cmd'>sudo [action]</span>  - Attempts superuser query execution"
        ],
        skills: [
            "<span class='highlight-cmd'>[NETWORKING & NOC OPERATIONS]</span>",
            "  - Core Certs: CCNA, CCNP Concepts",
            "  - NOC: Network Monitoring, Incident Response, System Troubleshooting",
            "  - Protocol Suites: TCP/IP, DNS, DHCP, VLANs, VPNs",
            "  - Routing: OSPF, EIGRP, Advanced Subnetting",
            "  - Analyzers: Wireshark, Cisco Packet Tracer",
            "",
            "<span class='highlight-cmd'>[CLOUD SYSTEMS & IAAS]</span>",
            "  - AWS Services: IAM, S3, RDS, EC2, Cloud Architecture",
            "  - Systems: Virtualization, Linux Administration (Ubuntu/RHEL)",
            "  - Operations: System Troubleshooting & Cloud Infrastructure",
            "",
            "<span class='highlight-cmd'>[CYBERSECURITY INTEGRATION]</span>",
            "  - Hardware Configs: FortiGate Firewall Setup",
            "  - Defensive: Threat Protection (IPS/Antivirus), Incident Response",
            "  - Controls: Access Control Lists (ACLs), Multi-Factor Authentication (MFA)",
            "",
            "<span class='highlight-cmd'>[SOFTWARE & DEVOPS ENVIRONMENT]</span>",
            "  - Codebases: Python, C++",
            "  - UI/UX Dev: React.js, JavaScript (ES6+), Tailwind CSS, Bootstrap, HTML5, CSS3",
            "  - Operations: Git & GitHub Version Tracking"
        ],
        certs: [
            "<span class='highlight-cmd'>[VERIFIED CERTIFICATIONS]</span>",
            "  🟢 NOC Engineer - Hire Ready Track (NTI) — In Progress",
            "  🏆 AWS Academy Cloud Foundations (Amazon Web Services)",
            "  🏆 Cloud Computing Graduate Certificate (National Telecommunication Institute)",
            "  🏆 Fortinet Cybersecurity Professional Certificate (NTI)",
            "  🏆 Networking & Cybersecurity Track Certificate (Cisco Academy)"
        ],
        about: [
            "Mahmoud Maher Elhwery - NOC & Network Cloud Security Engineer",
            "Located in: Cairo, Egypt",
            "Bachelor of Computers & Information (Grade: Very Good, Class of 2026)",
            "Currently: NOC Engineer Trainee @ NTI Hire Ready Program (July 2026 – Present)",
            "Detail-oriented engineer focused on NOC operations, cloud architecture, and secure infrastructures.",
            "Seeking entry-level opportunity in Network Operations Center and cloud infrastructure environments."
        ]
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawInput = terminalInput.value.trim();
            terminalInput.value = '';
            
            if (rawInput) {
                handleCommand(rawInput);
            }
        }
    });

    // Make command pills clickable
    commandPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            handleCommand(cmd);
        });
    });

    function printLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `line ${className}`;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function handleCommand(cmdString) {
        // Print prompt & command typed
        printLine(`<span class="terminal-prompt">mahmoud@core-router:~$</span> ${cmdString}`);
        
        const args = cmdString.split(' ');
        const primaryCmd = args[0].toLowerCase();

        if (primaryCmd === 'clear') {
            terminalOutput.innerHTML = '';
            return;
        }

        if (primaryCmd === 'help') {
            commands.help.forEach(line => printLine(line));
        } else if (primaryCmd === 'skills') {
            commands.skills.forEach(line => printLine(line));
        } else if (primaryCmd === 'certs' || primaryCmd === 'certifications') {
            commands.certs.forEach(line => printLine(line));
        } else if (primaryCmd === 'about') {
            commands.about.forEach(line => printLine(line));
        } else if (primaryCmd === 'experience') {
            runTracerouteSimulator();
        } else if (primaryCmd === 'ping') {
            const target = args[1] || '8.8.8.8';
            runPingSimulator(target);
        } else if (primaryCmd === 'sudo') {
            printLine("Error: guest user is not in the sudoers file. This incident will be reported.", "error");
        } else {
            printLine(`Command not found: '${primaryCmd}'. Type 'help' for options.`, "error");
        }
    }

    function runTracerouteSimulator() {
        const tracerouteSteps = [
            "traceroute to career-route-mahmoud.net (192.168.10.10), 30 hops max, 60-byte packets",
            " <span class='highlight-cmd'>1</span>  gateway-cisco (192.168.1.1)  0.285 ms  [Cisco Academy - Security & Subnetting Hop (2025)]",
            " <span class='highlight-cmd'>2</span>  fortinet-fgt (10.0.12.5)   0.392 ms  [NTI Cyber Training - FortiGate Rules Hop (2025)]",
            " <span class='highlight-cmd'>3</span>  tanta-uni-inc (172.16.2.1)  0.420 ms  [Tanta University Network Trainee Hop (2026)]",
            " <span class='highlight-cmd'>4</span>  aws-cloud-vpc (172.31.0.1)  0.510 ms  [NTI Cloud Track - AWS Infrastructure Hop (2026)]",
            " <span class='highlight-cmd'>5</span>  nti-noc-core (10.10.10.1)   0.540 ms  [NTI Hire Ready - NOC Engineer Trainee (July 2026 - Present)]",
            " <span class='highlight-cmd'>6</span>  mahmoud-maher (192.168.10.10) [AS1004]  0.560 ms [Target Reached - NOC & Network Cloud Engineer]"
        ];
        
        let index = 0;
        terminalInput.disabled = true;
        
        function printNextHop() {
            if (index < tracerouteSteps.length) {
                printLine(tracerouteSteps[index]);
                index++;
                setTimeout(printNextHop, 300);
            } else {
                terminalInput.disabled = false;
                terminalInput.focus();
            }
        }
        
        printNextHop();
    }

    function runPingSimulator(target) {
        printLine(`PING ${target} (56 data bytes)...`);
        
        let seq = 1;
        terminalInput.disabled = true;
        
        function printPingLine() {
            if (seq <= 4) {
                const time = (Math.random() * 15 + 10).toFixed(2);
                printLine(`64 bytes from ${target}: icmp_seq=${seq} ttl=64 time=${time} ms`);
                seq++;
                setTimeout(printPingLine, 350);
            } else {
                printLine(`--- ${target} ping statistics ---`);
                printLine(`4 packets transmitted, 4 received, 0% packet loss, time 1050ms`);
                printLine(`rtt min/avg/max = 10.42/16.12/25.10 ms`, "success");
                terminalInput.disabled = false;
                terminalInput.focus();
            }
        }
        
        setTimeout(printPingLine, 350);
    }

    // 5. Contact Form Transmission Handler
    const pingForm = document.getElementById('ping-form');
    const pingSuccessOutput = document.getElementById('ping-success-output');
    const btnTransmit = document.getElementById('btn-transmit');

    if (pingForm) {
        pingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('sender-name').value.trim();
            const email = document.getElementById('sender-email').value.trim();
            const subject = document.getElementById('msg-subject').value.trim();
            const payload = document.getElementById('msg-payload').value.trim();

            btnTransmit.disabled = true;
            btnTransmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Initializing Handshake...`;
            
            pingSuccessOutput.classList.remove('hide');
            pingSuccessOutput.innerHTML = `[client-handshake] Connecting to mail.mahmoud-maher.net:587...<br>`;
            
            setTimeout(() => {
                pingSuccessOutput.innerHTML += `[client-handshake] Connected. Resolving MX records... SUCCESS.<br>`;
            }, 600);

            setTimeout(() => {
                pingSuccessOutput.innerHTML += `[packet-delivery] Sending data payload (len=${payload.length} bytes)...<br>`;
            }, 1200);

            setTimeout(() => {
                pingSuccessOutput.innerHTML += `[packet-delivery] 250 OK - Message accepted for delivery.<br><br>`;
                pingSuccessOutput.innerHTML += `<span style="color: #10b981; font-weight: bold;">Connection established! Thanks ${name}. I have received your message regarding '${subject}' and will respond to ${email} as soon as my router processes it.</span>`;
                
                btnTransmit.disabled = false;
                btnTransmit.innerHTML = `<span class="btn-text"><i class="fa-solid fa-satellite-dish"></i> Transmit Packet</span>`;
                pingForm.reset();
            }, 2000);
        });
    }
});
