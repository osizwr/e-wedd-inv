    document.addEventListener("DOMContentLoaded", () => {
        const music = document.getElementById("bg-music");
        if (!music) return;

        const enableMusic = () => {
            music.muted = false;   // unmute
            music.volume = 1;      // make sure it’s audible
            music.play().catch(err => console.log("Play blocked:", err));

            // remove listeners so it only runs once
            document.removeEventListener("touchstart", enableMusic);
            document.removeEventListener("click", enableMusic);
        };

        // on mobile, Safari only allows play inside a user gesture
        document.addEventListener("touchstart", enableMusic, { once: true });
        document.addEventListener("click", enableMusic, { once: true });
    });
    // ======== CONFIG — edit these to personalize ========
    const INVITE = {
      coupleA: 'Rhodnie',
      coupleB: 'Charlene Daryl',
      intro1: 'It all started online.',
      intro2: 'What began as a random chat turned into late-night talks, endless kulitan, and 5 years of love, laughter, and adventures.',
      intro3: 'Now, we’re finally saying I do! 💍💕',
      // Local time of ceremony (update to your actual date/time)
      datetime: '2025-12-20T13:30:00+08:00',
      endtime: '2025-12-20T17:30:00+08:00',
      venue: {
        name: 'Divine Mercy Parish Church',
        address: 'Sicsican, Puerto Princesa City, Palawan',
        lat: 9.794513,
        lng: 118.713529,
        mapsQuery: 'Divine+Mercy+Parish+Church'
      },
      reception: {
        name: 'Rampano Hills Events Place',
        address: 'Sicsican, Puerto Princesa City, Palawan',
        lat: 9.818042,
        lng: 118.722739,
        mapsQuery: 'Rampano+Hills+Venue+Events+Place'
      },
      formspreeEndpoint: 'https://formspree.io/f/mpwjaeea' // ← replace this!
    };

    // ======== Helper: formatters ========
    const dt = new Date(INVITE.datetime);
    const end = new Date(INVITE.endtime);
    const fmtDate = dt.toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric'});
    const fmtTime = dt.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit'});
    const fmtEnd = end.toLocaleTimeString(undefined, { hour:'numeric', minute:'2-digit'});

    // Populate hero + details
    const names = `${INVITE.coupleA} & ${INVITE.coupleB}`;
    document.title = `${INVITE.coupleA} & ${INVITE.coupleB} #TeamChaNie`;
    document.querySelector('.names').innerHTML = `${INVITE.coupleA} <span class="and">&</span> ${INVITE.coupleB}`;
    document.getElementById('introText').textContent = INVITE.intro1;
    document.getElementById('introText2').textContent = INVITE.intro2;
    document.getElementById('introText3').textContent = INVITE.intro3;
    document.getElementById('dateText').textContent = `${dt.toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric', year:'numeric'})} · ${fmtTime}`;
    document.getElementById('dateFull').textContent = fmtDate;
    document.getElementById('timeFull').textContent = `${fmtTime} – ${fmtEnd}`;
    document.getElementById('venueName').textContent = INVITE.venue.name;
    document.getElementById('recName').textContent = INVITE.reception.name;
    document.getElementById('recAddr').textContent = INVITE.reception.address;
    document.getElementById('namesFooter').textContent = names;

    // Map & link
    const mapsLink = `https://maps.google.com/?q=${INVITE.venue.mapsQuery}`;
    const mapsLink1 = `https://maps.google.com/?q=${INVITE.reception.mapsQuery}`;
    document.getElementById('mapsLink').href = mapsLink;
    document.getElementById('mapsLink1').href = mapsLink1;
    document.querySelector('.map').src = `https://www.google.com/maps?q=${INVITE.venue.lat},${INVITE.venue.lng}&hl=en&z=14&output=embed`;
    document.querySelector('.map2').src = `https://www.google.com/maps?q=${INVITE.reception.lat},${INVITE.reception.lng}&hl=en&z=14&output=embed`;

    // Countdown
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('mins');
    const secsEl = document.getElementById('secs');
    const tick = () => {
      const now = new Date();
      const diff = Math.max(0, dt - now);
      const s = Math.floor(diff / 1000);
      const d = Math.floor(s / 86400);
      const h = Math.floor((s % 86400) / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = s % 60;
      daysEl.textContent = d.toString().padStart(2,'0');
      hoursEl.textContent = h.toString().padStart(2,'0');
      minsEl.textContent = m.toString().padStart(2,'0');
      secsEl.textContent = sec.toString().padStart(2,'0');
    };
    tick();
    setInterval(tick, 1000);

    // Add to Calendar (.ics generation)
    document.getElementById('addToCalendar').addEventListener('click', () => {
      const dtStart = dt.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
      const dtEnd = end.toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//E-Invite//EN\nBEGIN:VEVENT\nUID:${Date.now()}@invite\nDTSTAMP:${dtStart}Z\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:${INVITE.coupleA} & ${INVITE.coupleB} — Wedding\nLOCATION:${INVITE.venue.name} ${INVITE.venue.address}\nDESCRIPTION:We can't wait to celebrate with you!\nEND:VEVENT\nEND:VCALENDAR`;
      const blob = new Blob([ics], {type:'text/calendar'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `wedding-${INVITE.coupleA}-${INVITE.coupleB}.ics`;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });

    // Save Invitation as a standalone HTML (client-side)
/**    document.getElementById('saveInvite').addEventListener('click', () => {
      const blob = new Blob([document.documentElement.outerHTML], {type: 'text/html'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'wedding-invitation.html';
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    });**/

    // RSVP Submission (demo using Formspree; replace endpoint)
    const form = document.getElementById('rsvpForm');
    const status = document.getElementById('status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.textContent = 'Sending…';
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const res = await fetch(INVITE.formspreeEndpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(form)
        });
        if (res.ok) {
          status.textContent = 'Thank you! Your RSVP has been received.';
          status.style.color = 'var(--success)';
          form.reset();
        } else {
          status.textContent = 'Hmm, something went wrong. Please try again or message us.';
          status.style.color = 'var(--danger)';
        }
      } catch (err) {
        status.textContent = 'Network error. Please try again later.';
        status.style.color = 'var(--danger)';
      }
    });

    // Accessible focus ring for keyboard users
    (function(){
      let keyboard = false;
      window.addEventListener('keydown', (e)=>{ if(e.key==='Tab'){ keyboard = true; document.body.classList.add('kbd'); } });
      window.addEventListener('mousedown', ()=>{ if(keyboard){ keyboard=false; document.body.classList.remove('kbd'); } });
      const style = document.createElement('style');
      style.textContent = `.kbd :focus{ outline: 2px solid var(--accent); outline-offset: 3px; }`;
      document.head.appendChild(style);
    })();