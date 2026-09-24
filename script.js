/* ===================================================================
   ENGAGEMENT & WEDDING INVITATION SCRIPT
   Reference: https://varsha-sachin.vercel.app/
   Features: Video Curtain Opener, Audio, Scratch Cards, Live Countdown, RSVP
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initWeddingApp();
});

function initWeddingApp() {
    setupHeroCurtainVideo();
    setupAudioController();
    setupIntersectionObserver();
    setupScratchCards();
    setupLiveCountdown();
    setupRSVP();
    setupCalendarSync();
    setupShareButton();
}

/* ===================================================================
   1. HERO VIDEO CURTAIN OPENER
   =================================================================== */
function setupHeroCurtainVideo() {
    const video = document.getElementById('curtainVideo');
    const playOverlay = document.getElementById('playOverlay');
    const heroSection = document.getElementById('heroSection');

    if (!video || !playOverlay) return;

    let experienceStarted = false;

    const startExperience = () => {
        if (experienceStarted) return;
        experienceStarted = true;

        // Fade overlay out
        playOverlay.style.opacity = '0';
        setTimeout(() => {
            playOverlay.style.display = 'none';
        }, 500);

        // Start background music
        playMusic();

        // Play the curtain opening video
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch((err) => {
                console.log("Video autoplay prevented or failed:", err);
                // Fallback: If video cannot play, smoothly dismiss hero
                dismissHeroSection();
            });
        }
    };

    const dismissHeroSection = () => {
        if (!heroSection) return;
        heroSection.style.opacity = '0';
        heroSection.style.visibility = 'hidden';

        setTimeout(() => {
            heroSection.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.body.style.overflowY = 'auto';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 1200);
    };

    playOverlay.addEventListener('click', startExperience);
    playOverlay.addEventListener('touchstart', startExperience, { passive: true });

    // When video ends, smoothly dissolve hero section and unlock scrolling
    video.addEventListener('ended', dismissHeroSection);

    // If user clicks the video during playback, allow skipping straight to invitation
    video.addEventListener('click', dismissHeroSection);
}

/* ===================================================================
   2. AUDIO CONTROLLER & ROMANTIC AMBIENT HARP FALLBACK
   =================================================================== */
let isMusicPlaying = false;
let userManuallyToggled = false;
let audioContext = null;
let harpTimer = null;

function setupAudioController() {
    const music = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    if (music) {
        music.volume = 0.4;
    }

    if (musicToggle && musicIcon) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            userManuallyToggled = true;

            if (isMusicPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
    }

    // Pause audio when browser is minimized or tab is hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            if (isMusicPlaying) {
                pauseMusic(false);
            }
        }
    });
}

function updateMusicIcon(playing) {
    const musicIcon = document.getElementById('musicIcon');
    const musicToggle = document.getElementById('musicToggle');
    if (!musicToggle) return;
    if (musicIcon && !musicIcon.querySelector('iconify-icon')) {
        musicIcon.innerHTML = '<iconify-icon icon="solar:music-note-2-bold"></iconify-icon>';
    }
    if (playing) {
        musicToggle.classList.add('playing');
        musicToggle.setAttribute('aria-label', 'Mute background music');
        musicToggle.setAttribute('title', 'Mute Music');
    } else {
        musicToggle.classList.remove('playing');
        musicToggle.setAttribute('aria-label', 'Play background music');
        musicToggle.setAttribute('title', 'Play Music');
    }
}

function playMusic() {
    const music = document.getElementById('bgMusic');

    if (music) {
        const promise = music.play();
        if (promise !== undefined) {
            promise.then(() => {
                isMusicPlaying = true;
                updateMusicIcon(true);
            }).catch(() => {
                // If MP3 is not yet dropped into assets/audio, play romantic ambient harp
                startHarpSynthesizer();
                isMusicPlaying = true;
                updateMusicIcon(true);
            });
        }
    } else {
        startHarpSynthesizer();
        isMusicPlaying = true;
        updateMusicIcon(true);
    }
}

function pauseMusic(updateIcon = true) {
    const music = document.getElementById('bgMusic');

    if (music) {
        music.pause();
    }
    stopHarpSynthesizer();

    if (updateIcon) {
        isMusicPlaying = false;
        updateMusicIcon(false);
    }
}

/* Ambient romantic harp tone generator if user hasn't added music.mp3 yet */
function startHarpSynthesizer() {
    if (harpTimer) return;
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioContext) audioContext = new AudioCtx();
        if (audioContext.state === 'suspended') audioContext.resume();

        const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        let idx = 0;

        const pluck = () => {
            if (!audioContext || audioContext.state !== 'running') return;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[idx % notes.length], audioContext.currentTime);

            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.6);

            osc.connect(gain);
            gain.connect(audioContext.destination);

            osc.start();
            osc.stop(audioContext.currentTime + 1.7);

            idx = (idx + Math.floor(Math.random() * 3 + 1)) % notes.length;
        };

        pluck();
        harpTimer = setInterval(pluck, 1800);
    } catch (e) {
        // Silently handled
    }
}

function stopHarpSynthesizer() {
    if (harpTimer) {
        clearInterval(harpTimer);
        harpTimer = null;
    }
}

/* ===================================================================
   3. SCROLL INTERSECTION OBSERVER
   =================================================================== */
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    const scrollElements = document.querySelectorAll('.scroll-animate, .stagger-anim');
    scrollElements.forEach(el => observer.observe(el));
}

/* ===================================================================
   4. SCRATCH CARDS SYSTEM (Day, Month, Year)
   =================================================================== */
function setupScratchCards() {
    const canvases = document.querySelectorAll('.scratch-canvas');
    let completedCount = 0;

    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        let isDrawing = false;
        let isCompleted = false;
        let lastX = 0;
        let lastY = 0;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Realistic Gold Conic Gradient
        let gradient;
        if (ctx.createConicGradient) {
            gradient = ctx.createConicGradient(0, cx, cy);
            gradient.addColorStop(0, "#e8c37d");
            gradient.addColorStop(0.125, "#fff2b2");
            gradient.addColorStop(0.25, "#d4af37");
            gradient.addColorStop(0.375, "#ca9a2b");
            gradient.addColorStop(0.5, "#fcefba");
            gradient.addColorStop(0.625, "#e8c37d");
            gradient.addColorStop(0.75, "#d4af37");
            gradient.addColorStop(0.875, "#fff2b2");
            gradient.addColorStop(1, "#e8c37d");
        } else {
            gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, cx);
            gradient.addColorStop(0, "#fcefba");
            gradient.addColorStop(1, "#d4af37");
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gold dust stipple texture
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        for (let i = 0; i < 200; i++) {
            ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1.5, 1.5);
        }

        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 22;

        function getMousePos(e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            let clientX, clientY;
            if (e.touches && e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches && e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            return {
                x: (clientX - rect.left) * scaleX,
                y: (clientY - rect.top) * scaleY
            };
        }

        function scratch(e) {
            if (!isDrawing || isCompleted) return;
            if (e.cancelable) e.preventDefault();

            const pos = getMousePos(e);

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            lastX = pos.x;
            lastY = pos.y;

            checkCompletion();
        }

        canvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const pos = getMousePos(e);
            lastX = pos.x;
            lastY = pos.y;
        });

        canvas.addEventListener('mousemove', scratch);

        window.addEventListener('mouseup', () => {
            isDrawing = false;
        });

        canvas.addEventListener('touchstart', (e) => {
            isDrawing = true;
            const pos = getMousePos(e);
            lastX = pos.x;
            lastY = pos.y;
        }, { passive: false });

        canvas.addEventListener('touchmove', scratch, { passive: false });

        window.addEventListener('touchend', () => {
            isDrawing = false;
        });

        function checkCompletion() {
            if (isCompleted) return;
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let transparentPixels = 0;
            const totalPixels = imageData.data.length / 4;

            for (let i = 3; i < imageData.data.length; i += 16) {
                if (imageData.data[i] < 60) {
                    transparentPixels++;
                }
            }

            const transparentRatio = transparentPixels / (totalPixels / 4);
            if (transparentRatio > 0.08) { // 8% scratched threshold for swift mobile completion
                isCompleted = true;

                canvas.style.transition = 'opacity 0.4s ease';
                canvas.style.opacity = '0';

                const card = canvas.closest('.scratch-card');
                if (card) card.classList.add('revealed');

                setTimeout(() => {
                    canvas.style.display = 'none';
                }, 400);

                completedCount++;
                if (completedCount === 3) {
                    onAllScratched();
                }
            }
        }
    });

    function onAllScratched() {
        const cards = document.querySelectorAll('.scratch-card');
        cards.forEach((card, idx) => {
            setTimeout(() => {
                card.classList.add('foil-sheen');
            }, idx * 140);
        });

        // Reveal the hidden countdown with a calm, dignified editorial dissolve
        const hiddenCountdown = document.getElementById('hiddenCountdown');
        if (hiddenCountdown) {
            setTimeout(() => {
                hiddenCountdown.classList.add('show');
                hiddenCountdown.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 600);
        }
    }
}

/* ===================================================================
   5. LIVE COUNTDOWN TIMER
   =================================================================== */
function setupLiveCountdown() {
    // Engagement Date: November 13, 2026, 10:30 AM IST
    const countdownDate = new Date("Nov 13, 2026 10:30:00").getTime();

    const dEl = document.getElementById("days");
    const hEl = document.getElementById("hours");
    const mEl = document.getElementById("minutes");
    const sEl = document.getElementById("seconds");

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            if (dEl) dEl.innerHTML = "00";
            if (hEl) hEl.innerHTML = "00";
            if (mEl) mEl.innerHTML = "00";
            if (sEl) sEl.innerHTML = "00";
            return;
        }

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (dEl) dEl.innerHTML = days < 10 ? '0' + days : days;
        if (hEl) hEl.innerHTML = hours < 10 ? '0' + hours : hours;
        if (mEl) mEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
        if (sEl) sEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ===================================================================
   6. CALENDAR INTEGRATION
   =================================================================== */
function setupCalendarSync() {
    const calBtn = document.getElementById('calBtn');
    if (!calBtn) return;

    calBtn.addEventListener('click', () => {
        const title = 'Engagement | Anjita Abraham & Akash Joseph';
        const location = 'St. Sebastians Church, Kannivayal & Meridian Convention Centre, Kakkenchal';
        const description = 'Join us to celebrate the auspicious Engagement Ceremony of Anjita Abraham with Akash Joseph!';
        const startUtc = '20261113T050000Z'; // 10:30 AM IST is 05:00 AM UTC
        const endUtc = '20261113T120000Z';

        const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);

        if (isApple) {
            const icsContent = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Anjita Akash Wedding//EN',
                'BEGIN:VEVENT',
                `SUMMARY:${title}`,
                `DESCRIPTION:${description}`,
                `LOCATION:${location}`,
                `DTSTART:${startUtc}`,
                `DTEND:${endUtc}`,
                'STATUS:CONFIRMED',
                'END:VEVENT',
                'END:VCALENDAR'
            ].join('\r\n');

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'anjita-akash-engagement.ics';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startUtc}/${endUtc}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
            window.open(gCalUrl, '_blank');
        }
    });
}

/* ===================================================================
   7. INTERACTIVE RSVP & WHATSAPP INTEGRATION
   =================================================================== */
function setupRSVP() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const message = document.getElementById('rsvpMessage');
    const feedbackBox = document.getElementById('rsvpFeedbackBox');
    const waLink = document.getElementById('rsvpWaLink');

    if (!yesBtn || !noBtn || !message) return;

    yesBtn.addEventListener('click', (e) => {
        yesBtn.classList.add('selected');
        yesBtn.setAttribute('aria-pressed', 'true');
        noBtn.classList.remove('selected');
        noBtn.setAttribute('aria-pressed', 'false');

        message.innerText = "Thank you! We look forward to celebrating together.";
        if (feedbackBox) feedbackBox.classList.remove('hidden');

        const waMsg = "Hi Anjita & Akash! ❤️ I'm delighted to accept your kind invitation to celebrate your Engagement on November 13, 2026! 🎉";
        if (waLink) {
            waLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`;
            waLink.classList.remove('hidden');
        }

        let originY = 0.8;
        let originX = 0.5;
        if (e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            originY = (rect.top + rect.height / 2) / window.innerHeight;
            originX = (rect.left + rect.width / 2) / window.innerWidth;
        }

        if (typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 45,
                origin: { x: originX, y: originY },
                colors: ['#D4AF37', '#ffffff', '#7d0e0e'],
                zIndex: 9999
            });
        }
    });

    noBtn.addEventListener('click', () => {
        noBtn.classList.add('selected');
        noBtn.setAttribute('aria-pressed', 'true');
        yesBtn.classList.remove('selected');
        yesBtn.setAttribute('aria-pressed', 'false');

        message.innerText = "You will be dearly missed, and will remain warmly in our hearts and prayers.";
        if (feedbackBox) feedbackBox.classList.remove('hidden');
        if (waLink) waLink.classList.add('hidden');
    });
}



/* ===================================================================
   9. SHARE BUTTON
   =================================================================== */
function setupShareButton() {
    const shareBtn = document.getElementById('shareBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
        const shareData = {
            title: 'Engagement | Anjita Abraham ❤️ Akash Joseph',
            text: 'With joy in our hearts, we invite you to celebrate the Engagement of Anjita Abraham with Akash Joseph on 13 November 2026! 💍✨',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const span = shareBtn.querySelector('span');
                const orig = span ? span.textContent : '';
                if (span) span.textContent = 'Link Copied! 📋';
                setTimeout(() => {
                    if (span) span.textContent = orig;
                }, 2000);
            }).catch(() => {
                alert('Invitation URL: ' + window.location.href);
            });
        }
    });
}
