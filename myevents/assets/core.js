/* ═══════════════════════════════════════════════════════════════════
   myevents.ge — საერთო ბირთვი (Supabase, ავტორიზაცია, SMS, UI)
   ═══════════════════════════════════════════════════════════════════ */
(function (w) {
  'use strict';

  // ─── კონფიგი ────────────────────────────────────────────────────
  // თუ myevents-ს ცალკე Supabase პროექტი გაუკეთე — მხოლოდ ეს ორი შეცვალე.
  var SB_URL = 'https://rycyvlugqqyzrazssgop.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Y3l2bHVncXF5enJhenNzZ29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMzk1MjUsImV4cCI6MjA4ODcxNTUyNX0.GUSpdMmEr3oQwwWwarWL44Lcn19JSstA3uq1-T3SzZA';

  var ME = {
    BUCKET: 'myevents',
    user: null,
    profile: null,
    wedding: null,
    CATS: {
      restaurant: { t: 'რესტორანი / დარბაზი', e: '🍽️' },
      band:       { t: 'ბენდი / მუსიკა',       e: '🎷' },
      photo:      { t: 'ფოტოგრაფი',            e: '📷' },
      video:      { t: 'ვიდეოგრაფი',           e: '🎥' },
      decor:      { t: 'დეკორი / ყვავილები',   e: '💐' },
      cake:       { t: 'ტორტი / კეთერინგი',    e: '🎂' },
      makeup:     { t: 'სტილისტი / ვიზაჟი',    e: '💄' },
      transport:  { t: 'ტრანსპორტი',           e: '🚘' },
      host:       { t: 'თამადა / წამყვანი',    e: '🎙️' },
      dance:      { t: 'ცეკვა / შოუ',          e: '💃' }
    },
    CITIES: ['თბილისი','ბათუმი','ქუთაისი','რუსთავი','გორი','ზუგდიდი','თელავი','ფოთი','მცხეთა','ყვარელი','სიღნაღი','ბაკურიანი','გუდაური','ბორჯომი','სხვა'],
    RSVP: { yes:'დაადასტურა', no:'უარი', maybe:'შესაძლოა', pending:'პასუხის მოლოდინში' }
  };

  // ─── Supabase კლიენტი ───────────────────────────────────────────
  var _sb = null;
  ME.sb = function () {
    if (_sb) return _sb;
    if (!w.supabase || !w.supabase.createClient) return null;
    _sb = w.supabase.createClient(SB_URL, SB_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    return _sb;
  };

  // ─── მცირე დამხმარეები ──────────────────────────────────────────
  ME.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c];
    });
  };
  ME.$  = function (id) { return document.getElementById(id); };
  ME.qs = function (k) { return new URLSearchParams(location.search).get(k) || ''; };
  ME.money = function (n, cur) {
    n = Number(n || 0);
    return n.toLocaleString('ka-GE', { maximumFractionDigits: 0 }) + ' ' + (cur === 'USD' ? '$' : cur === 'EUR' ? '€' : '₾');
  };
  ME.fmtDate = function (d) {
    if (!d) return '';
    try {
      return new Date(d).toLocaleDateString('ka-GE', { year:'numeric', month:'long', day:'numeric' });
    } catch (e) { return String(d); }
  };
  ME.today = function () { return new Date().toISOString().slice(0, 10); };
  ME.daysLeft = function (d) {
    if (!d) return null;
    var ms = new Date(d + 'T00:00:00').getTime() - new Date(ME.today() + 'T00:00:00').getTime();
    return Math.round(ms / 86400000);
  };
  ME.slugify = function (s) {
    var base = String(s || '').trim().toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9Ⴀ-ჿ-]/g, '')
      .replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!base || /^[-]*$/.test(base) || /[Ⴀ-ჿ]/.test(base)) {
      base = (base ? base + '-' : 'wed-') + Math.random().toString(36).slice(2, 7);
    }
    return base.slice(0, 48);
  };
  ME.normPhone = function (raw) {
    var d = String(raw || '').replace(/\D+/g, '');
    if (!d) return '';
    if (d.length === 9 && d[0] === '5') d = '995' + d;
    else if (d.length > 11 && d.slice(0, 2) === '00') d = d.slice(2);
    return d;
  };
  ME.uuid = function () {
    try { return crypto.randomUUID(); } catch (e) {}
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  };

  // ─── Toast ──────────────────────────────────────────────────────
  ME.toast = function (msg, kind, ms) {
    var box = ME.$('toasts');
    if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    var el = document.createElement('div');
    el.className = 'toast ' + (kind || '');
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .3s'; el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 320);
    }, ms || 2800);
  };
  ME.ok  = function (m) { ME.toast(m, 'ok'); };
  ME.bad = function (m) { ME.toast(m, 'bad', 4200); };

  // ─── მოდალი ─────────────────────────────────────────────────────
  ME.modal = function (html, opts) {
    opts = opts || {};
    var ov = document.createElement('div');
    ov.className = 'ovl';
    ov.innerHTML = '<div class="modal' + (opts.wide ? ' wide' : '') + '">' + html + '</div>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    function close() { ov.remove(); document.body.style.overflow = ''; }
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.close = close;
    ov.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
    return ov;
  };
  ME.confirm = function (text, okLabel) {
    return new Promise(function (res) {
      var m = ME.modal(
        '<h2 style="margin-bottom:10px">დადასტურება</h2>' +
        '<p style="color:var(--ink-2);white-space:pre-line">' + ME.esc(text) + '</p>' +
        '<div class="row" style="margin-top:18px;justify-content:flex-end">' +
        '<button class="btn ghost" data-no>გაუქმება</button>' +
        '<button class="btn danger" data-yes>' + ME.esc(okLabel || 'დიახ') + '</button></div>');
      m.querySelector('[data-no]').onclick = function () { m.close(); res(false); };
      m.querySelector('[data-yes]').onclick = function () { m.close(); res(true); };
    });
  };
  ME.prompt = function (title, value, ph) {
    return new Promise(function (res) {
      var m = ME.modal(
        '<h2 style="margin-bottom:12px">' + ME.esc(title) + '</h2>' +
        '<input id="_pv" value="' + ME.esc(value || '') + '" placeholder="' + ME.esc(ph || '') + '">' +
        '<div class="row" style="margin-top:18px;justify-content:flex-end">' +
        '<button class="btn ghost" data-no>გაუქმება</button>' +
        '<button class="btn" data-yes>შენახვა</button></div>');
      var inp = m.querySelector('#_pv');
      inp.focus(); inp.select();
      inp.onkeydown = function (e) { if (e.key === 'Enter') m.querySelector('[data-yes]').click(); };
      m.querySelector('[data-no]').onclick = function () { m.close(); res(null); };
      m.querySelector('[data-yes]').onclick = function () { var v = inp.value; m.close(); res(v); };
    });
  };

  // ─── ავტორიზაცია ────────────────────────────────────────────────
  ME.loadUser = async function () {
    var sb = ME.sb(); if (!sb) return null;
    try {
      var r = await sb.auth.getUser();
      ME.user = (r && r.data && r.data.user) || null;
    } catch (e) { ME.user = null; }
    if (ME.user) {
      try {
        var p = await sb.from('ev_profiles').select('*').eq('user_id', ME.user.id).maybeSingle();
        ME.profile = (p && p.data) || null;
        if (!ME.profile) {
          var meta = ME.user.user_metadata || {};
          var ins = await sb.from('ev_profiles').insert({
            user_id: ME.user.id,
            full_name: meta.full_name || (ME.user.email || '').split('@')[0],
            phone: meta.phone || '', role: meta.role || 'couple'
          }).select().maybeSingle();
          ME.profile = (ins && ins.data) || null;
        }
      } catch (e) {}
    }
    return ME.user;
  };

  ME.requireAuth = async function (role) {
    await ME.loadUser();
    if (!ME.user) {
      location.href = 'index.html?next=' + encodeURIComponent(location.pathname.split('/').pop() + location.search);
      return false;
    }
    if (role && ME.profile && ME.profile.role !== role && ME.profile.role !== 'admin') {
      // როლი არ ემთხვევა — არ ვბლოკავთ, უბრალოდ ვაფრთხილებთ
      return true;
    }
    return true;
  };

  ME.signIn = async function (email, pass) {
    var sb = ME.sb();
    var r = await sb.auth.signInWithPassword({ email: email.trim(), password: pass });
    if (r.error) throw new Error(ME.authErr(r.error.message));
    await ME.loadUser();
    return r.data;
  };

  ME.signUp = async function (email, pass, extra) {
    var sb = ME.sb();
    var r = await sb.auth.signUp({
      email: email.trim(), password: pass,
      options: { data: extra || {} }
    });
    if (r.error) throw new Error(ME.authErr(r.error.message));
    if (r.data && r.data.session) await ME.loadUser();
    return r.data;
  };

  ME.signOut = async function () {
    try { await ME.sb().auth.signOut(); } catch (e) {}
    try { localStorage.removeItem('me_wid'); } catch (e) {}
    location.href = 'index.html';
  };

  ME.authErr = function (m) {
    m = String(m || '');
    if (/Invalid login/i.test(m))              return 'ელფოსტა ან პაროლი არასწორია';
    if (/already registered|User already/i.test(m)) return 'ეს ელფოსტა უკვე დარეგისტრირებულია';
    if (/Password should be/i.test(m))         return 'პაროლი მინიმუმ 6 სიმბოლო უნდა იყოს';
    if (/Email not confirmed/i.test(m))        return 'ელფოსტა ჯერ არ დაგიდასტურებია — შეამოწმე ფოსტა';
    if (/rate limit|too many/i.test(m))        return 'ბევრი მცდელობა — სცადე ცოტა ხანში';
    return m;
  };

  // ─── ქორწილი (აქტიური ღონისძიება) ───────────────────────────────
  ME.getWedding = async function (createIfMissing) {
    var sb = ME.sb(); if (!sb || !ME.user) return null;
    var wid = null;
    try { wid = localStorage.getItem('me_wid'); } catch (e) {}
    var q;
    if (wid) {
      q = await sb.from('ev_weddings').select('*').eq('id', wid).eq('user_id', ME.user.id).maybeSingle();
      if (q && q.data) { ME.wedding = q.data; return ME.wedding; }
    }
    q = await sb.from('ev_weddings').select('*').eq('user_id', ME.user.id)
          .order('created_at', { ascending: true }).limit(1);
    if (q.data && q.data.length) { ME.wedding = q.data[0]; }
    else if (createIfMissing) {
      var nm = (ME.profile && ME.profile.full_name) || '';
      var ins = await sb.from('ev_weddings').insert({
        user_id: ME.user.id, title: 'ჩვენი ქორწილი', bride_name: '', groom_name: nm,
        guests_target: 100, currency: 'GEL'
      }).select().maybeSingle();
      if (ins.error) { ME.bad(ins.error.message); return null; }
      ME.wedding = ins.data;
    } else return null;
    try { localStorage.setItem('me_wid', ME.wedding.id); } catch (e) {}
    return ME.wedding;
  };
  ME.setWedding = function (id) { try { localStorage.setItem('me_wid', id); } catch (e) {} };

  // ─── ფაილის ატვირთვა (Supabase Storage) ─────────────────────────
  ME.upload = async function (file, folder) {
    var sb = ME.sb();
    if (!sb || !ME.user) throw new Error('ჯერ შედი სისტემაში');
    if (!file) throw new Error('ფაილი არ არის');
    if (file.size > 8 * 1024 * 1024) throw new Error('ფაილი 8 MB-ზე დიდია');
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
    var path = ME.user.id + '/' + (folder || 'misc') + '/' + Date.now() + '-' +
               Math.random().toString(36).slice(2, 7) + '.' + ext;
    var up = await sb.storage.from(ME.BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false });
    if (up.error) throw new Error(up.error.message);
    return sb.storage.from(ME.BUCKET).getPublicUrl(path).data.publicUrl;
  };

  // სურათის შემცირება ატვირთვამდე (ტრაფიკის დაზოგვა)
  ME.shrink = function (file, maxW, quality) {
    return new Promise(function (res) {
      if (!/^image\//.test(file.type) || /gif|svg/.test(file.type)) return res(file);
      var img = new Image(), url = URL.createObjectURL(file);
      img.onload = function () {
        var w0 = img.width, h0 = img.height, mw = maxW || 1600;
        if (w0 <= mw) { URL.revokeObjectURL(url); return res(file); }
        var c = document.createElement('canvas');
        c.width = mw; c.height = Math.round(h0 * mw / w0);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        c.toBlob(function (b) {
          URL.revokeObjectURL(url);
          res(b ? new File([b], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' }) : file);
        }, 'image/jpeg', quality || 0.86);
      };
      img.onerror = function () { URL.revokeObjectURL(url); res(file); };
      img.src = url;
    });
  };

  // ─── SMS ────────────────────────────────────────────────────────
  // კონფიგი ინახება ღრუბელში (ev_profiles არ გამოგვადგება → localStorage + user_settings სტილი)
  ME.smsCfg = function () {
    try { return JSON.parse(localStorage.getItem('me_sms_cfg') || '{}') || {}; }
    catch (e) { return {}; }
  };
  ME.setSmsCfg = function (cfg) {
    try { localStorage.setItem('me_sms_cfg', JSON.stringify(cfg || {})); } catch (e) {}
  };
  ME.smsReady = function () { var c = ME.smsCfg(); return !!c.proxyUrl; };

  ME.smsSend = async function (phone, text, reference) {
    var cfg = ME.smsCfg();
    if (!cfg.proxyUrl) throw new Error('SMS არ არის დაკონფიგურირებული (პარამეტრები → SMS)');
    var to = ME.normPhone(phone);
    if (!to || to.length < 11) throw new Error('არასწორი ნომერი: ' + phone);
    var body = new URLSearchParams({ to: to, text: text, sender: cfg.sender || 'myevents' });
    if (reference) body.append('reference', String(reference).slice(0, 20));
    var resp = await fetch(cfg.proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString()
    });
    var json = null; try { json = await resp.json(); } catch (e) {}
    if (!resp.ok) throw new Error('SMS HTTP ' + resp.status + (json && json.Message ? ' — ' + json.Message : ''));
    if (json && json.Success === false) throw new Error(json.Message || ('ErrorCode ' + (json.ErrorCode || '?')));
    return json || {};
  };
  ME.smsMsgId = function (r) {
    if (!r) return '';
    return String(r.msgId || r.MessageId || r.messageId || r.Output || r.output || r.id || r.ID || '');
  };
  ME.smsLog = function (rec) {
    var sb = ME.sb(); if (!sb || !ME.user) return;
    try {
      sb.from('ev_sms_log').insert({
        user_id: ME.user.id,
        wedding_id: rec.wedding_id || (ME.wedding && ME.wedding.id) || null,
        guest_id: rec.guest_id || null, guest_name: rec.guest_name || '',
        phone: rec.phone || '', text: rec.text || '', kind: rec.kind || 'custom',
        status: rec.status || '', error: rec.error || '', msg_id: rec.msg_id || ''
      }).then(function () {}, function () {});
    } catch (e) {}
  };
  // SMS-ის სიგრძე: ქართული = UCS-2 → 70 სიმბოლო ერთ ნაწილში
  ME.smsParts = function (text) {
    var t = String(text || ''), uni = /[^\x00-\x7F]/.test(t);
    var single = uni ? 70 : 160, multi = uni ? 67 : 153;
    if (t.length <= single) return { parts: t.length ? 1 : 0, len: t.length, uni: uni, limit: single };
    return { parts: Math.ceil(t.length / multi), len: t.length, uni: uni, limit: multi };
  };

  // ─── ჰედერი / ნავიგაცია ─────────────────────────────────────────
  ME.header = function (active) {
    var links = [
      ['dashboard.html', '🏠 ჩემი ქორწილი'],
      ['guests.html',    '👥 სტუმრები'],
      ['seating.html',   '🪑 დასხდომა'],
      ['invitations.html','💌 მოსაწვევები'],
      ['vendors.html',   '🍽️ სერვისები'],
      ['vendor.html',    '🏛️ ჩემი ბიზნესი']
    ];
    var nav = links.map(function (l) {
      return '<a href="' + l[0] + '"' + (active === l[0] ? ' class="on"' : '') + '>' + l[1] + '</a>';
    }).join('');
    var acct = ME.user
      ? '<a href="#" id="meAcct">👤 ' + ME.esc(((ME.profile && ME.profile.full_name) || ME.user.email || '').slice(0, 18)) + '</a>'
      : '<a href="index.html">შესვლა</a>';
    var html =
      '<header class="hdr"><div class="in">' +
      '<a href="index.html" class="logo"><span class="mark">💍</span><span>myevents<small>ქორწილის დაგეგმვა</small></span></a>' +
      '<button class="burger" id="meBurger" aria-label="მენიუ">☰</button>' +
      '<nav class="nav" id="meNav">' + nav + acct + '</nav>' +
      '</div></header>';
    var host = ME.$('me-header');
    if (host) host.outerHTML = html; else document.body.insertAdjacentHTML('afterbegin', html);
    var b = ME.$('meBurger');
    if (b) b.onclick = function () { ME.$('meNav').classList.toggle('open'); };
    var a = ME.$('meAcct');
    if (a) a.onclick = function (e) { e.preventDefault(); ME.accountMenu(); };
  };

  ME.accountMenu = function () {
    var p = ME.profile || {};
    var m = ME.modal(
      '<div class="spread"><h2>👤 ჩემი ანგარიში</h2><button class="x" data-close>✕</button></div>' +
      '<div class="divider"></div>' +
      '<label class="f">სახელი და გვარი</label><input id="acName" value="' + ME.esc(p.full_name || '') + '">' +
      '<label class="f">ტელეფონი</label><input id="acPhone" value="' + ME.esc(p.phone || '') + '" placeholder="5xx xx xx xx">' +
      '<label class="f">ქალაქი</label><input id="acCity" value="' + ME.esc(p.city || '') + '">' +
      '<div class="hint" style="margin-top:10px">ელფოსტა: ' + ME.esc((ME.user && ME.user.email) || '') +
      ' · როლი: ' + ME.esc(p.role === 'vendor' ? 'ბიზნესი' : p.role === 'admin' ? 'ადმინი' : 'წყვილი') + '</div>' +
      '<div class="row" style="margin-top:18px">' +
      '<button class="btn" id="acSave">შენახვა</button>' +
      '<button class="btn ghost" id="acSms">📲 SMS პარამეტრები</button>' +
      '<button class="btn ghost" id="acOut" style="margin-right:auto">გასვლა</button></div>');
    m.querySelector('#acSave').onclick = async function () {
      var upd = {
        full_name: m.querySelector('#acName').value.trim(),
        phone: m.querySelector('#acPhone').value.trim(),
        city: m.querySelector('#acCity').value.trim()
      };
      var r = await ME.sb().from('ev_profiles').update(upd).eq('user_id', ME.user.id);
      if (r.error) return ME.bad(r.error.message);
      Object.assign(ME.profile, upd); ME.ok('შენახულია'); m.close();
    };
    m.querySelector('#acSms').onclick = function () { m.close(); ME.smsSettings(); };
    m.querySelector('#acOut').onclick = function () { ME.signOut(); };
  };

  ME.smsSettings = function () {
    var c = ME.smsCfg();
    var m = ME.modal(
      '<div class="spread"><h2>📲 SMS პარამეტრები</h2><button class="x" data-close>✕</button></div>' +
      '<p class="hint" style="margin-top:6px">SMS იგზავნება <b>smsoffice.ge</b>-ით, შენს ჰოსტინგზე დადებული ' +
      '<code>sms-proxy.php</code>-ის გავლით (API key სერვერზე რჩება, ბრაუზერში არასდროს ჩანს).</p>' +
      '<label class="f">Proxy მისამართი</label>' +
      '<input id="smU" value="' + ME.esc(c.proxyUrl || '/sms-proxy.php') + '" placeholder="/sms-proxy.php">' +
      '<label class="f">გამგზავნის სახელი (sender)</label>' +
      '<input id="smS" maxlength="11" value="' + ME.esc(c.sender || 'myevents') + '">' +
      '<div class="divider"></div>' +
      '<label class="f">ტესტი — ნომერი</label>' +
      '<div class="row"><input id="smT" placeholder="5xx xx xx xx" style="flex:1;min-width:160px">' +
      '<button class="btn ghost sm" id="smTest">ტესტი</button>' +
      '<button class="btn ghost sm" id="smBal">ბალანსი</button></div>' +
      '<div class="err" id="smMsg"></div>' +
      '<div class="row" style="margin-top:14px;justify-content:flex-end">' +
      '<button class="btn ghost" data-close>დახურვა</button><button class="btn" id="smSave">შენახვა</button></div>');
    function save() {
      ME.setSmsCfg({ proxyUrl: m.querySelector('#smU').value.trim(), sender: m.querySelector('#smS').value.trim() || 'myevents' });
    }
    m.querySelector('#smSave').onclick = function () { save(); ME.ok('SMS პარამეტრები შენახულია'); m.close(); };
    m.querySelector('#smTest').onclick = async function () {
      save();
      var msg = m.querySelector('#smMsg'); msg.textContent = '⏳ ვგზავნი...';
      try {
        await ME.smsSend(m.querySelector('#smT').value, 'myevents.ge — სატესტო შეტყობინება ✅');
        msg.style.color = 'var(--green)'; msg.textContent = '✅ გაიგზავნა';
      } catch (e) { msg.style.color = 'var(--red)'; msg.textContent = '❌ ' + e.message; }
    };
    m.querySelector('#smBal').onclick = async function () {
      save();
      var msg = m.querySelector('#smMsg'); msg.textContent = '⏳ ...';
      try {
        var u = ME.smsCfg().proxyUrl;
        var r = await fetch(u + (u.indexOf('?') >= 0 ? '&' : '?') + 'action=balance');
        var j = await r.json();
        msg.style.color = 'var(--ink-2)';
        msg.textContent = j && j.Success ? '💰 ბალანსი: ' + j.Balance : '❌ ' + ((j && j.Message) || 'ვერ მივიღე');
      } catch (e) { msg.style.color = 'var(--red)'; msg.textContent = '❌ ' + e.message; }
    };
  };

  // ─── გვერდის საწყისი ჩატვირთვა ──────────────────────────────────
  ME.boot = async function (opts) {
    opts = opts || {};
    var sb = ME.sb();
    if (!sb) { ME.bad('Supabase ბიბლიოთეკა ვერ ჩაიტვირთა'); return false; }
    if (opts.auth) { if (!(await ME.requireAuth())) return false; }
    else await ME.loadUser();
    if (opts.header !== false) ME.header(opts.active);
    if (opts.wedding) await ME.getWedding(true);
    return true;
  };

  w.ME = ME;
})(window);
