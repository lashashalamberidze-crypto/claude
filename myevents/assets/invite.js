/* ═══════════════════════════════════════════════════════════════════
   myevents.ge — მოსაწვევის რენდერი (საერთო: დიზაინერი + საჯარო გვერდი)
   ═══════════════════════════════════════════════════════════════════ */
var INVITE_TPL = {
  gold:    { title: 'ოქროსფერი', orn: '❦ ✦ ❦', swatch: 'linear-gradient(135deg,#f8f0d9,#c9a227)' },
  blush:   { title: 'პუდრა',     orn: '❀ ❀ ❀', swatch: 'linear-gradient(135deg,#fbeef1,#c9788b)' },
  botanic: { title: 'მწვანე',    orn: '❦ ✿ ❦', swatch: 'linear-gradient(135deg,#e6f2ea,#3f8f6b)' },
  night:   { title: 'ღამე',      orn: '✦ ✦ ✦', swatch: 'linear-gradient(135deg,#33291f,#d9b45a)' },
  minimal: { title: 'მინიმალი',  orn: '— ✦ —', swatch: 'linear-gradient(135deg,#fff,#2b2118)' }
};

function _e(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
  });
}

/**
 * მოსაწვევის HTML.
 * d    — ev_invitations სტრიქონი (+ event_date/event_time უკუთვლისთვის)
 * opts — { preview:true } დიზაინერისთვის, { guest:{full_name,seats} } პერსონალურისთვის
 */
function renderInvite(d, opts) {
  opts = opts || {};
  var tpl = INVITE_TPL[d.template] || INVITE_TPL.gold;
  var withPhoto = !!d.photo_url;
  var h = '<div class="inv t-' + _e(d.template || 'gold') + '">';

  // ── ჰერო
  h += '<div class="i-hero' + (withPhoto ? ' withphoto' : '') + '">' +
       (withPhoto ? '<div class="i-photo" style="background-image:url(' + _e(d.photo_url) + ')"></div>' : '') +
       (d.headline ? '<div class="i-head">' + _e(d.headline) + '</div>' : '') +
       '<div class="i-names">' + _e(d.names || '') + '</div>' +
       '<div class="i-orn">' + tpl.orn + '</div>' +
       (d.date_text || d.time_text
         ? '<div class="i-sub">' + _e([d.date_text, d.time_text].filter(Boolean).join(' · ')) + '</div>' : '') +
       '</div>';

  h += '<div class="i-body">';

  // ── პერსონალური მისალმება
  if (opts.guest && opts.guest.full_name) {
    h += '<div class="i-hi">ძვირფასო <b>' + _e(opts.guest.full_name) + '</b>, ეს მოსაწვევი შენთვისაა 💛' +
         (opts.guest.seats > 1 ? '<div class="i-note">დაჯავშნილია ' + opts.guest.seats + ' ადგილი</div>' : '') +
         '</div>';
  }

  // ── მიმართვა
  if (d.message) h += '<div class="i-card"><div class="i-msg">' + _e(d.message) + '</div></div>';

  // ── როდის
  if (d.date_text || d.time_text) {
    h += '<div class="i-card"><div class="i-when">' +
         '<div><div class="d">' + _e(d.date_text || '—') + '</div><div class="l">თარიღი</div></div>' +
         '<div class="sep"></div>' +
         '<div><div class="d">' + _e(d.time_text || '—') + '</div><div class="l">დრო</div></div>' +
         '</div></div>';
  }

  // ── უკუთვლა
  if (d.event_date) {
    h += '<div class="i-card"><div class="i-t">დარჩა</div><div class="i-cd" data-cd="' +
         _e(d.event_date) + 'T' + _e(/^\d{1,2}:\d{2}/.test(d.time_text || '') ? d.time_text : '18:00') +
         '"><div><b>–</b><span>დღე</span></div><div><b>–</b><span>საათი</span></div>' +
         '<div><b>–</b><span>წუთი</span></div><div><b>–</b><span>წამი</span></div></div></div>';
  }

  // ── სად
  if (d.place_text || d.address_text) {
    h += '<div class="i-card i-place">' +
         (d.place_text ? '<div class="p">📍 ' + _e(d.place_text) + '</div>' : '') +
         (d.address_text ? '<div class="a">' + _e(d.address_text) + '</div>' : '') +
         (d.map_url ? '<a class="i-map" href="' + _e(d.map_url) + '" target="_blank" rel="noopener">🗺️ რუკაზე ნახვა</a>' : '') +
         '</div>';
  }

  // ── RSVP
  if (d.rsvp_on) {
    var closed = d.rsvp_deadline && d.rsvp_deadline < new Date().toISOString().slice(0, 10);
    h += '<div class="i-card i-rsvp" id="rsvpBox">' +
         '<div class="i-t">დაგვიდასტურე მოსვლა</div>';
    if (closed) {
      h += '<div class="i-note">პასუხის მიღების ვადა ამოიწურა (' + _e(d.rsvp_deadline) + ').</div>';
    } else {
      h += '<div class="opts">' +
           '<div class="opt" data-a="yes"><span class="e">💛</span>დიახ</div>' +
           '<div class="opt" data-a="maybe"><span class="e">🤔</span>შესაძლოა</div>' +
           '<div class="opt" data-a="no"><span class="e">🙏</span>ვერ მოვალ</div></div>' +
           '<input id="rName" placeholder="სახელი და გვარი"' +
             (opts.guest && opts.guest.full_name ? ' value="' + _e(opts.guest.full_name) + '"' : '') + '>' +
           '<input id="rPhone" placeholder="ტელეფონი (არასავალდებულო)" inputmode="tel">' +
           '<select id="rCount">' +
             [1,2,3,4,5,6].map(function (n) {
               var sel = (opts.guest && opts.guest.seats === n) ? ' selected' : '';
               return '<option value="' + n + '"' + sel + '>' + n + ' ადამიანი</option>';
             }).join('') + '</select>' +
           '<textarea id="rMsg" rows="2" placeholder="სურვილი ან შენიშვნა (არასავალდებულო)"></textarea>' +
           '<button class="send" id="rSend"' + (opts.preview ? ' disabled' : '') + '>' +
             (opts.preview ? 'გადახედვაში გამორთულია' : 'პასუხის გაგზავნა') + '</button>' +
           '<div class="i-note" id="rMsgOut"></div>' +
           (d.rsvp_deadline ? '<div class="i-note">გთხოვთ, გვიპასუხოთ ' + _e(d.rsvp_deadline) + '-მდე</div>' : '');
    }
    h += '</div>';
  }

  h += '<div class="i-foot">გაკეთებულია <a href="https://myevents.ge" target="_blank" rel="noopener">myevents.ge</a>-ზე</div>';
  h += '</div></div>';
  return h;
}

/** უკუთვლის გაშვება ჩასმული HTML-ისთვის */
function startInviteCountdown(root) {
  var box = (root || document).querySelector('[data-cd]');
  if (!box) return;
  var target = new Date(box.getAttribute('data-cd')).getTime();
  if (isNaN(target)) return;
  function tick() {
    var t = target - Date.now();
    if (t <= 0) {
      clearInterval(box._t);
      // თარიღი გავიდა — უკუთვლის ბარათი აღარ გვჭირდება
      var card = box.parentNode;
      if (t < -864e5 && card) { card.style.display = 'none'; return; }
      box.innerHTML = '<div style="grid-column:1/-1"><b>🎉</b><span>დღეს არის!</span></div>';
      return;
    }
    var v = [Math.floor(t / 864e5), Math.floor(t / 36e5) % 24, Math.floor(t / 6e4) % 60, Math.floor(t / 1e3) % 60];
    var l = ['დღე', 'საათი', 'წუთი', 'წამი'];
    box.innerHTML = v.map(function (x, i) { return '<div><b>' + x + '</b><span>' + l[i] + '</span></div>'; }).join('');
  }
  clearInterval(box._t); tick(); box._t = setInterval(tick, 1000);
}
