/* ===================================================================
   MINIMALISM DARK BROWN — WEDDING INVITATION SCRIPT
   Couple: Anjita Abraham & Akash Joseph
   Date: 14 November 2026 • 10:30 AM IST
   Venue: St. Thomas’s Forane Church, Thomapuram, Kerala
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initEnvelopeOpener();
    initAmbientPetals();
    initAudioController();
    initLiveCountdown();
    initCalendarIntegration();
    initRSVP();
    initShareButton();
});

/* ===================================================================
   1. AMBIENT FALLING PETALS
   =================================================================== */
function initAmbientPetals() {
    const container = document.getElementById('ambientPetals');
    if (!container) return;

    const colors = ['#C9A24A', '#7D553E', '#ECE4D8', '#593D2C', '#E0C178'];
    const petalCount = 18;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'ambient-petal';

        const size = Math.random() * 12 + 10; // 10px to 22px
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 14; // 14s to 24s
        const delay = Math.random() * -20; // start immediately spread out
        const sway = (Math.random() * 50 - 25) + 'px';
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.left = `${left}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.animationDuration = `${duration}s`;
        petal.style.animationDelay = `${delay}s`;
        petal.style.setProperty('--sway', sway);

        // Simple elegant petal SVG
        petal.innerHTML = `
            <svg viewBox="0 0 24 24" fill="${color}" width="100%" height="100%">
                <path d="M12 2C8 6 4 11 4 15a8 8 0 0 0 16 0c0-4-4-9-8-13z" opacity="0.85"/>
            </svg>
        `;

        container.appendChild(petal);
    }
}

/* ===================================================================
   2. ENVELOPE OPENER EXPERIENCE
   =================================================================== */
function initEnvelopeOpener() {
    const overlay = document.getElementById('envelopeOverlay');
    const openBtn = document.getElementById('openInviteBtn');
    const waxSeal = document.getElementById('waxSeal');

    if (!overlay || !openBtn) return;

    // Initially lock scroll while envelope is closed
    document.body.classList.add('locked');

    const openInvitation = () => {
        if (overlay.classList.contains('opened')) return;

        // Smoothly fade out overlay
        overlay.classList.add('opened');
        document.body.classList.remove('locked');

        // Play background audio seamlessly
        playAudio();

        // Optional subtle welcoming confetti burst
        if (typeof confetti === 'function') {
            setTimeout(() => {
                confetti({
                    particleCount: 35,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#C9A24A', '#593D2C', '#ECE4D8'],
                    disableForReducedMotion: true
                });
            }, 600);
        }

        // Clean up overlay after animation ends
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 850);
    };

    openBtn.addEventListener('click', openInvitation);
    if (waxSeal) {
        waxSeal.style.cursor = 'pointer';
        waxSeal.addEventListener('click', openInvitation);
    }
}

/* ===================================================================
   3. BACKGROUND AUDIO CONTROLLER
   =================================================================== */
let isPlaying = false;

function initAudioController() {
    const musicBtn = document.getElementById('musicToggle');
    const musicAudio = document.getElementById('bgMusic');

    if (!musicBtn || !musicAudio) return;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    });
}

function playAudio() {
    const musicAudio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    if (!musicAudio) return;

    musicAudio.volume = 0.55;
    const playPromise = musicAudio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            if (musicBtn) {
                musicBtn.classList.add('playing');
                musicBtn.setAttribute('title', 'Pause Music');
            }
        }).catch((err) => {
            console.log("Audio autoplay constrained:", err);
            isPlaying = false;
            if (musicBtn) musicBtn.classList.remove('playing');
        });
    }
}

function pauseAudio() {
    const musicAudio = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    if (!musicAudio) return;

    musicAudio.pause();
    isPlaying = false;
    if (musicBtn) {
        musicBtn.classList.remove('playing');
        musicBtn.setAttribute('title', 'Play Music');
    }
}

/* ===================================================================
   4. LIVE WEDDING COUNTDOWN TIMER
   =================================================================== */
function initLiveCountdown() {
    // 14 November 2026, 10:30 AM IST (UTC+05:30)
    const weddingTime = new Date("2026-11-14T10:30:00+05:30").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const updateTimer = () => {
        const now = new Date().getTime();
        const difference = weddingTime - now;

        if (difference <= 0) {
            if (daysEl) daysEl.textContent = "00";
            if (hoursEl) hoursEl.textContent = "00";
            if (minutesEl) minutesEl.textContent = "00";
            if (secondsEl) secondsEl.textContent = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = days < 10 ? `0${days}` : days;
        if (hoursEl) hoursEl.textContent = hours < 10 ? `0${hours}` : hours;
        if (minutesEl) minutesEl.textContent = minutes < 10 ? `0${minutes}` : minutes;
        if (secondsEl) secondsEl.textContent = seconds < 10 ? `0${seconds}` : seconds;
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

/* ===================================================================
   5. CALENDAR INTEGRATION (iCal & Google Calendar)
   =================================================================== */
function initCalendarIntegration() {
    const addCalendarBtn = document.getElementById('addCalendarBtn');
    if (!addCalendarBtn) return;

    addCalendarBtn.addEventListener('click', () => {
        const title = "Holy Matrimony & Wedding: Anjita & Akash";
        const location = "St. Thomas’s Forane Church, Thomapuram, Kerala";
        const description = "Wedding Celebration of Anjita Abraham & Akash Joseph. Holy Matrimony begins at 10:30 AM followed by Reception.";
        
        // 14 Nov 2026, 10:30 AM IST = 05:00 UTC
        const startUtc = "20261114T050000Z";
        const endUtc = "20261114T110000Z";

        const isAppleDevice = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);

        if (isAppleDevice) {
            // Generate standard iCalendar .ics file
            const icsData = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'PRODID:-//Anjita Akash Wedding//EN',
                'CALSCALE:GREGORIAN',
                'METHOD:PUBLISH',
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

            const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'anjita-akash-wedding.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            // Open direct Google Calendar Event Creation
            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startUtc}/${endUtc}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
            window.open(gCalUrl, '_blank', 'noopener,noreferrer');
        }
    });
}

/* ===================================================================
   6. INTERACTIVE RSVP & DIRECT WHATSAPP CONFIRMATION
   =================================================================== */
function initRSVP() {
    const yesBtn = document.getElementById('rsvpYes');
    const noBtn = document.getElementById('rsvpNo');
    const waBtn = document.getElementById('rsvpWhatsAppBtn');

    if (!yesBtn || !noBtn || !waBtn) return;

    const setAttendance = (isAttending, triggerConfetti = false, event = null) => {
        let message = '';
        if (isAttending) {
            yesBtn.classList.add('selected');
            yesBtn.setAttribute('aria-pressed', 'true');
            noBtn.classList.remove('selected');
            noBtn.setAttribute('aria-pressed', 'false');

            message = "Hi Anjita & Akash! ❤️ I am delighted to accept your wedding invitation and will be attending. Looking forward to joining you on 14 November! 🎉✨";

            if (triggerConfetti && typeof confetti === 'function' && event) {
                const rect = event.currentTarget.getBoundingClientRect();
                const originX = (rect.left + rect.width / 2) / window.innerWidth;
                const originY = (rect.top + rect.height / 2) / window.innerHeight;

                confetti({
                    particleCount: 50,
                    spread: 55,
                    origin: { x: originX, y: originY },
                    colors: ['#C9A24A', '#FFFFFF', '#593D2C']
                });
            }
        } else {
            noBtn.classList.add('selected');
            noBtn.setAttribute('aria-pressed', 'true');
            yesBtn.classList.remove('selected');
            yesBtn.setAttribute('aria-pressed', 'false');

            message = "Hi Anjita & Akash! ❤️ Warmest congratulations on your wedding! Regretfully I won't be able to attend in person, but my heartfelt prayers and blessings are always with you both! 🌸";
        }

        waBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    };

    yesBtn.addEventListener('click', (e) => setAttendance(true, true, e));
    noBtn.addEventListener('click', (e) => setAttendance(false, false, e));
}

/* ===================================================================
   7. SHARE INVITATION
   =================================================================== */
function initShareButton() {
    const shareBtn = document.getElementById('shareInviteBtn');
    if (!shareBtn) return;

    shareBtn.addEventListener('click', () => {
        const shareData = {
            title: 'Wedding Invitation | Anjita Abraham & Akash Joseph',
            text: 'We cordially invite you to celebrate the Holy Matrimony & Wedding Reception of Anjita Abraham and Akash Joseph on Saturday, 14 November 2026! 💍✨',
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const span = shareBtn.querySelector('span');
                const orig = span ? span.textContent : '';
                if (span) span.textContent = 'Invitation Link Copied! 📋';
                setTimeout(() => {
                    if (span) span.textContent = orig;
                }, 2200);
            }).catch(() => {
                alert('Invitation Link: ' + window.location.href);
            });
        }
    });
}
