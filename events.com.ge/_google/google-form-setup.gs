/**
 * HR დაფა (events.com.ge/hrgedc) — Google Form + ცხრილი ერთი ღილაკით
 *
 * როგორ გამოვიყენოთ:
 *   1. გახსენით https://script.google.com → „New project“
 *   2. წაშალეთ იქ არსებული კოდი და ჩასვით ეს ფაილი მთლიანად
 *   3. ზემოთ აირჩიეთ ფუნქცია „setup“ → Run → დაადასტურეთ ნებართვები
 *      (Execution log-ში გამოჩნდება ფორმისა და ცხრილის ბმულები)
 *   4. Deploy → New deployment → ⚙ Web app
 *        Execute as: Me   ·   Who has access: Anyone
 *      → Deploy → დააკოპირეთ „Web app URL“ (…/exec) და გაუგზავნეთ დაფის ადმინისტრატორს
 *
 * ფორმას HR ავსებს; ცხრილში შეიძლება ჩანაწერის გასწორება ან წაშლა.
 * დაფა ხედავს მხოლოდ იმ ველებს, რომლებსაც doGet აბრუნებს — ცხრილი თავად დახურული რჩება.
 */

var TZ = "Asia/Tbilisi";
var MONTHS = ["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი","ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"];

// ფორმის კითხვების სათაურები — ისინივე ხდება ცხრილის სვეტები
var Q = {
  type:     "რა გინდათ დაამატოთ?",
  bdName:   "თანამშრომლის სახელი და გვარი",
  bdDept:   "დეპარტამენტი",
  bdDay:    "დაბადების დღე — რიცხვი",
  bdMonth:  "დაბადების დღე — თვე",
  nwName:   "ახალი თანამშრომლის სახელი და გვარი",
  nwRole:   "პოზიცია / დეპარტამენტი",
  nwStart:  "მუშაობის დაწყების თარიღი",
  nwText:   "მისასალმებელი სიტყვა",
  nwPhoto:  "ფოტოს ბმული (Google Drive, „Anyone with the link“)",
  mtTitle:  "შეხვედრის თემა",
  mtDate:   "შეხვედრის თარიღი",
  mtFrom:   "დაწყების დრო",
  mtTo:     "დასრულების დრო",
  mtRoom:   "ოთახი / ბმული",
  evTitle:  "ღონისძიების სახელი",
  evDate:   "ღონისძიების თარიღი",
  evTime:   "ღონისძიების დრო",
  evPlace:  "ღონისძიების ადგილი",
  vcTitle:  "ვაკანსიის პოზიცია",
  vcDept:   "ვაკანსიის დეპარტამენტი",
  vcUntil:  "განაცხადის ბოლო ვადა",
  nsText:   "სიახლის ტექსტი",
  nsUntil:  "ჩანდეს ამ თარიღამდე (არასავალდებულო)"
};
var T = { bd: "🎉 დაბადების დღე", nw: "👋 ახალი თანამშრომელი", mt: "📅 შეხვედრა",
          ev: "✨ ღონისძიება", vc: "💼 ვაკანსია", ns: "📰 სიახლე" };

function setup() {
  var form = FormApp.create("HR დაფა — ინფორმაციის დამატება");
  form.setDescription("შეავსეთ ეს ფორმა და ინფორმაცია რამდენიმე წუთში გამოჩნდება ოფისის ეკრანზე. " +
                      "ჩანაწერის გასწორება ან წაშლა შეიძლება პასუხების ცხრილში.");
  form.setCollectEmail(false);
  form.setConfirmationMessage("მადლობა! ინფორმაცია რამდენიმე წუთში გამოჩნდება ეკრანზე.");

  var type = form.addMultipleChoiceItem().setTitle(Q.type).setRequired(true);

  var pBd = form.addPageBreakItem().setTitle(T.bd);
  form.addTextItem().setTitle(Q.bdName).setRequired(true);
  form.addTextItem().setTitle(Q.bdDept);
  var days = []; for (var d = 1; d <= 31; d++) days.push(String(d));
  form.addListItem().setTitle(Q.bdDay).setChoiceValues(days).setRequired(true);
  form.addListItem().setTitle(Q.bdMonth).setChoiceValues(MONTHS).setRequired(true)
      .setHelpText("დაბადების წელი არ გვჭირდება.");

  var pNw = form.addPageBreakItem().setTitle(T.nw);
  form.addTextItem().setTitle(Q.nwName).setRequired(true);
  form.addTextItem().setTitle(Q.nwRole).setRequired(true);
  form.addDateItem().setTitle(Q.nwStart).setRequired(true);
  form.addParagraphTextItem().setTitle(Q.nwText);
  form.addTextItem().setTitle(Q.nwPhoto)
      .setHelpText("ატვირთეთ ფოტო Google Drive-ში → Share → „Anyone with the link“ → Copy link");

  var pMt = form.addPageBreakItem().setTitle(T.mt);
  form.addTextItem().setTitle(Q.mtTitle).setRequired(true);
  form.addDateItem().setTitle(Q.mtDate).setRequired(true);
  form.addTimeItem().setTitle(Q.mtFrom).setRequired(true);
  form.addTimeItem().setTitle(Q.mtTo);
  form.addTextItem().setTitle(Q.mtRoom);

  var pEv = form.addPageBreakItem().setTitle(T.ev);
  form.addTextItem().setTitle(Q.evTitle).setRequired(true);
  form.addDateItem().setTitle(Q.evDate).setRequired(true);
  form.addTimeItem().setTitle(Q.evTime);
  form.addTextItem().setTitle(Q.evPlace);

  var pVc = form.addPageBreakItem().setTitle(T.vc);
  form.addTextItem().setTitle(Q.vcTitle).setRequired(true);
  form.addTextItem().setTitle(Q.vcDept);
  form.addDateItem().setTitle(Q.vcUntil).setRequired(true);

  var pNs = form.addPageBreakItem().setTitle(T.ns);
  form.addParagraphTextItem().setTitle(Q.nsText).setRequired(true);
  form.addDateItem().setTitle(Q.nsUntil);

  // ყოველი განყოფილების ბოლოს — გაგზავნა (და არა შემდეგ განყოფილებაზე გადასვლა)
  [pNw, pMt, pEv, pVc, pNs].forEach(function (p) { p.setGoToPage(FormApp.PageNavigationType.SUBMIT); });
  type.setChoices([
    type.createChoice(T.bd, pBd), type.createChoice(T.nw, pNw), type.createChoice(T.mt, pMt),
    type.createChoice(T.ev, pEv), type.createChoice(T.vc, pVc), type.createChoice(T.ns, pNs)
  ]);

  var ss = SpreadsheetApp.create("HR დაფა — მონაცემები");
  ss.setSpreadsheetTimeZone(TZ);
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  PropertiesService.getScriptProperties().setProperty("SHEET_ID", ss.getId());

  Logger.log("ფორმა (შესავსებად): " + form.getPublishedUrl());
  Logger.log("ფორმის რედაქტირება: " + form.getEditUrl());
  Logger.log("ცხრილი: " + ss.getUrl());
  Logger.log("შემდეგი ნაბიჯი: Deploy → New deployment → Web app (Anyone)");
}

/** დაფა ამ ფუნქციას კითხულობს: აბრუნებს მხოლოდ ეკრანისთვის საჭირო ველებს (JSON). */
function doGet() {
  var id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  var out = { birthdays: [], newcomers: [], meetings: [], events: [], vacancies: [], news: [],
              updated: Utilities.formatDate(new Date(), TZ, "yyyy-MM-dd HH:mm") };
  if (id) {
    var sh = SpreadsheetApp.openById(id).getSheets()[0];
    var rows = sh.getDataRange().getValues(), head = rows.shift() || [];
    rows.forEach(function (r) {
      var v = function (title) { var i = head.indexOf(title); return i < 0 ? "" : r[i]; };
      switch (String(v(Q.type))) {
        case T.bd: out.birthdays.push({ name: str(v(Q.bdName)), dept: str(v(Q.bdDept)),
                     day: +v(Q.bdDay), month: MONTHS.indexOf(str(v(Q.bdMonth))) + 1 }); break;
        case T.nw: out.newcomers.push({ name: str(v(Q.nwName)), role: str(v(Q.nwRole)), start: day(v(Q.nwStart)),
                     text: str(v(Q.nwText)), photo: photo(v(Q.nwPhoto)) }); break;
        case T.mt: out.meetings.push({ title: str(v(Q.mtTitle)), date: day(v(Q.mtDate)),
                     from: time(v(Q.mtFrom)), to: time(v(Q.mtTo)), room: str(v(Q.mtRoom)) }); break;
        case T.ev: out.events.push({ title: str(v(Q.evTitle)), date: day(v(Q.evDate)),
                     time: time(v(Q.evTime)), place: str(v(Q.evPlace)) }); break;
        case T.vc: out.vacancies.push({ title: str(v(Q.vcTitle)), dept: str(v(Q.vcDept)), until: day(v(Q.vcUntil)) }); break;
        case T.ns: out.news.push({ text: str(v(Q.nsText)), until: day(v(Q.nsUntil)) }); break;
      }
    });
  }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function str(x) { return x == null ? "" : String(x).trim(); }
function day(x) {
  if (x instanceof Date) return Utilities.formatDate(x, TZ, "yyyy-MM-dd");
  var m = str(x).match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/);   // 20.10.2026 ან 10/20/2026
  return m ? m[3] + "-" + ("0" + m[2]).slice(-2) + "-" + ("0" + m[1]).slice(-2) : str(x);
}
function time(x) {
  if (x instanceof Date) return Utilities.formatDate(x, TZ, "HH:mm");
  var m = str(x).match(/^(\d{1,2}):(\d{2})/);
  return m ? ("0" + m[1]).slice(-2) + ":" + m[2] : "";
}
// Drive-ის ბმული → სურათი, რომელიც ეკრანზე პირდაპირ იხსნება
function photo(x) {
  var m = str(x).match(/[-\w]{25,}/);
  return m ? "https://drive.google.com/thumbnail?id=" + m[0] + "&sz=w400" : str(x);
}
