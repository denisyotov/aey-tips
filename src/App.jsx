import { useState, useRef, useEffect } from "react";

const Y = "#f59e0b", BG = "#0a0a0a", S1 = "#111111", S2 = "#1a1a1a",
  B = "#2a2a2a", M = "#666", SUB = "#999", GR = "#4ade80", RD = "#ef4444", BL = "#3b82f6";

const CONFIG = {
  PROD: false,
  BACKEND: "",
  ENDPOINTS: { contact: "/contact", feedback: "/feedback", subscribe: "/subscribe", fixtures: "/fixtures" },
  PAYMENT: { provider: "stripe", currency: "EUR", enabled: false },
  TELEGRAM_URL: "",
  TRACK_RECORD_VERIFIED: false,
  CONTACT: { email: "aeytips@gmail.com", phone: "+359 879 667 754" },
};

async function backendPost(endpoint, body) {
  if (!CONFIG.BACKEND) return null;
  try {
    const res = await fetch(CONFIG.BACKEND + endpoint, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    return res.ok ? await res.json() : null;
  } catch (e) { return null; }
}

const API_CONFIG = {
  key: "", host: "v3.football.api-sports.io", base: "https://v3.football.api-sports.io",
  worldCupLeagueId: 1, season: 2026, pollMs: 20000,
};

async function apiFetch(path, params = {}) {
  if (!API_CONFIG.key) return null;
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API_CONFIG.base}${path}${qs ? "?" + qs : ""}`, { headers: { "x-apisports-key": API_CONFIG.key } });
    if (!res.ok) throw new Error("API " + res.status);
    const json = await res.json();
    return json.response || null;
  } catch (e) { return null; }
}

function useLivePolling(tip, enabled) {
  const [live, setLive] = useState(null);
  useEffect(() => {
    if (!enabled || !API_CONFIG.key || !tip?.apiId) return;
    let active = true;
    const tick = async () => {
      const resp = await apiFetch("/fixtures", { id: tip.apiId });
      if (active && resp && resp[0]) setLive(resp[0]);
    };
    tick();
    const iv = setInterval(tick, API_CONFIG.pollMs);
    return () => { active = false; clearInterval(iv); };
  }, [tip?.apiId, enabled]);
  return live;
}
const tips = [
  {id:0,date:"26.06",time:"15:00",match:"Бразилия — Япония",home:"Бразилия",away:"Япония",hf:"🇧🇷",af:"🇯🇵",fifaH:"5",fifaA:"18",league:"СП 2026 · Контрола",venue:"Hard Rock Stadium, Маями",ref:"Антъни Тейлър (ENG)",pick:"Over 2.5 гола",market:"Over/Under",score:79,minOdds:"1.65",status:"live",result:"2 : 1",elapsed:67,published:"26.06 · 11:30",analysis:"Бразилия атакува непрестанно. Три гола вече паднаха, Over 2.5 е на крачка.",pillars:[{n:"xG анализ",v:84,note:"Комбиниран xG 2.9 на 67-ата минута."},{n:"Форма",v:80,note:"Бразилия с 3 поредни over мача."},{n:"Контекст",v:74,note:"Отворена игра."},{n:"Odds движение",v:76,note:"Live odds за Over паднаха на 1.30."},{n:"Пазар",v:78,note:"Тенденцията потвърждава прогнозата."}],
    liveFeed:[{m:"67'",t:"Жълт картон — Япония (Ендо)"},{m:"58'",t:"ГОЛ! Бразилия 2-1 (Родриго)"},{m:"44'",t:"ГОЛ! Япония 1-1 (Мита)"},{m:"23'",t:"ГОЛ! Бразилия 1-0 (Винисиус)"}],
    h2h:[{d:"2024",r:"Бразилия 2-0 Япония",c:"w"},{d:"2022",r:"Япония 1-1 Бразилия",c:"d"}],
    lineupsHome:["Алисон","Дани Алвес","Маркиньос","Силва","Сандро","Каземиро","Пакета","Невес","Родриго","Винисиус","Жезус"],
    lineupsAway:["Гонда","Сакай","Йошида","Итакура","Нагатомо","Ендо","Мита","Камада","Дойан","Мае","Асано"],
    stats:[{n:"Владение",h:64,a:36},{n:"Удари",h:62,a:38},{n:"xG",h:71,a:38}],
    articles:[{t:"НА ЖИВО: Бразилия води",s:"Globo Esporte",time:"току-що"}]},
  {id:1,date:"26.06",time:"22:00",match:"Норвегия — Франция",home:"Норвегия",away:"Франция",hf:"🇳🇴",af:"🇫🇷",fifaH:"31",fifaA:"3",league:"СП 2026 · Група I",venue:"MetLife Stadium, Ню Джърси",ref:"Даниеле Орсато (ITA)",pick:"Франция победа + BTTS Yes",market:"Комбо",score:97,minOdds:"3.10",status:"pending",published:"26.06 · 09:14",analysis:"Хааланд вкарва в 100% от мачовете. Мбапе е в историческа форма с 4 гола. Норвегия трябва да победи — ще атакува открито.",pillars:[{n:"xG анализ",v:88,note:"Франция: 2.4 xG/мач."},{n:"Форма",v:90,note:"Франция 3-0-0, Норвегия 1-1-0."},{n:"Контекст",v:82,note:"Норвегия длъжна да атакува."},{n:"Odds движение",v:78,note:"Sharp money към Франция."},{n:"Пазар",v:80,note:"Комбо с висока стойност."}],
    h2h:[{d:"2025",r:"Франция 2-1 Норвегия",c:"w"},{d:"2024",r:"Норвегия 1-1 Франция",c:"d"},{d:"2022",r:"Франция 3-0 Норвегия",c:"w"}],
    lineupsHome:["Нюланд","Рюерсон","Айер","Аякс","Мейер","Берге","Йодегор (к)","Торсби","Нюсе","Сьоренсен","Хааланд"],
    lineupsAway:["Меньян","Кунде","Салиба","Конате","Тео Ернандес","Чуамени","Камавинга","Гризман","Дембеле","Мбапе (к)","Коло Муани"],
    stats:[{n:"Очаквана форма",h:62,a:78},{n:"xG среден",h:48,a:71},{n:"Голове",h:55,a:90}],
    articles:[{t:"France Predicted Lineup vs Norway",s:"Last Word on Sports",time:"преди 23 мин"},{t:"Мбапе и Хааланд готови",s:"Flashscore News",time:"преди 3ч"}]},
  {id:2,date:"26.06",time:"22:00",match:"Уругвай — Испания",home:"Уругвай",away:"Испания",hf:"🇺🇾",af:"🇪",fifaH:"15",fifaA:"8",league:"СП 2026 · Група H",venue:"AT&T Stadium, Далас",ref:"Слависа Бабич (SRB)",pick:"Испания победа + чиста мрежа",market:"Комбо",score:82,minOdds:"2.50",status:"pending",published:"26.06 · 10:02",analysis:"Испания е концедирала 0 гола в целия турнир. Уругвай е без Арауйо и Де Арасакета.",pillars:[{n:"xG анализ",v:82,note:"Испания допуска само 0.6 xG/мач."},{n:"Форма",v:80,note:"Испания 3-0-0."},{n:"Контекст",v:76,note:"Уругвай без ключови играчи."},{n:"Odds движение",v:74,note:"Дрифт към Испания."},{n:"Пазар",v:72,note:"Clean sheet добре подплатен."}],
    h2h:[{d:"2024",r:"Испания 2-0 Уругвай",c:"l"},{d:"2022",r:"Уругвай 0-0 Испания",c:"d"}],
    lineupsHome:["Росет","Варела","Хименес","Оливера","Угарте","Валверде (к)","Бентанкур","Пелистри","Нунес","Нандес","Олиста"],
    lineupsAway:["Симон","Каравахал","Ле Норман","Лапорт","Кукурея","Родри","Педри","Фабиан","Ямал","Нико Уилямс","Мората (к)"],
    stats:[{n:"Очаквана форма",h:54,a:80},{n:"xG среден",h:42,a:74},{n:"Защита",h:33,a:100}],
    articles:[{t:"Испания преследва рекорд без допуснат гол",s:"Marca",time:"преди 1ч"},{t:"Уругвай губи Арауйо",s:"Ovacion",time:"преди 4ч"}]},
  {id:3,date:"25.06",match:"Еквадор — Германия",home:"Еквадор",away:"Германия",hf:"🇪🇨",af:"🇩",fifaH:"23",fifaA:"10",league:"СП 2026 · Група E",venue:"Mercedes-Benz Stadium, Атланта",pick:"BTTS Yes",market:"BTTS",score:82,minOdds:"1.70",status:"win",result:"2 : 2",published:"25.06",analysis:"Германия е най-атакуващият отбор. Еквадор беше принуден да атакува. Двата отбора вкараха.",pillars:[{n:"xG анализ",v:76,note:"Комбиниран xG над 2.5."},{n:"Форма",v:74,note:"Германия в голова форма."},{n:"Контекст",v:76,note:"Еквадор длъжен да атакува."},{n:"Odds движение",v:76,note:"BTTS падна от 1.85 на 1.70."},{n:"Пазар",v:72,note:"BTTS логичен."}],
    keyMoments:[{m:"23'",t:"Германия 0-1 (Вирц)"},{m:"41'",t:"Еквадор 1-1 (Валенсия)"},{m:"67'",t:"Германия 1-2 (Хавертц)"},{m:"88'",t:"Еквадор 2-2 (Кайседо)"}],
    h2h:[{d:"2022",r:"Германия 2-1 Еквадор",c:"w"}],
    lineupsHome:["Галиндес","Прециадо","Ернандес","Торес","Еступинян","Каиседо","Франко","Валенсия","Пласа","Ринкон","Е.Валенсия"],
    lineupsAway:["Тер Стеген","Кимих","Тах","Рюдигер","Раум","Гросе","Гюндоган","Вирц","Сане","Хавертц","Фюлкруг"],
    stats:[{n:"Владение",h:42,a:58},{n:"Удари",h:45,a:55},{n:"xG",h:48,a:62}],
    articles:[{t:"Германия изпусна победа в края",s:"Kicker",time:"вчера"}]},
  {id:4,date:"24.06",match:"Швейцария — Канада",home:"Швейцария",away:"Канада",hf:"🇨🇭",af:"🇨🇦",fifaH:"20",fifaA:"43",league:"СП 2026 · Група B",venue:"BC Place, Ванкувър",pick:"BTTS Yes",market:"BTTS",score:84,minOdds:"1.78",status:"win",result:"2 : 1",published:"24.06",analysis:"Швейцария трябваше да вкара. Канада вкара 6 срещу Катар. Голове и от двете страни.",pillars:[{n:"xG анализ",v:72,note:"И двата стигат до положения."},{n:"Форма",v:74,note:"Канада в голова форма."},{n:"Контекст",v:78,note:"Швейцария длъжна да вкара."},{n:"Odds движение",v:74,note:"BTTS стабилен."},{n:"Пазар",v:78,note:"Силно подплатен."}],
    keyMoments:[{m:"28'",t:"Швейцария 1-0"},{m:"61'",t:"Канада 1-1"},{m:"74'",t:"Швейцария 2-1"}],
    h2h:[{d:"2021",r:"Швейцария 1-0 Канада",c:"w"}],
    lineupsHome:["Зомер","Видмер","Аканджи","Шер","Родригес","Фройлер","Джака","Рийдер","Шакири","Варгас","Ембело"],
    lineupsAway:["Кроуфорд","Джонстън","Майле","Вателе","Дейвис","Ютиш","Кон","Бюканан","Дейвид","Лариа","Ларин"],
    stats:[{n:"Владение",h:58,a:42},{n:"Удари",h:60,a:40},{n:"xG",h:64,a:46}],
    articles:[{t:"Швейцария се класира с обрат",s:"Blick",time:"преди 2 дни"}]},
  {id:5,date:"23.06",match:"Португалия — Узбекистан",home:"Португалия",away:"Узбекистан",hf:"🇵🇹",af:"🇺",fifaH:"6",fifaA:"57",league:"СП 2026 · Група J",venue:"Lincoln Financial Field, Филаделфия",pick:"Over 2.5 гола",market:"Over/Under",score:61,minOdds:"1.55",status:"win",result:"5 : 0",published:"23.06",analysis:"Португалия срещу дебютанта Узбекистан. Роналдо, Лейао, Бернарду — три независими голови заплахи.",pillars:[{n:"xG анализ",v:72,note:"Голяма класова разлика."},{n:"Форма",v:72,note:"Португалия в добра форма."},{n:"Контекст",v:70,note:"Дебютант под натиск."},{n:"Odds движение",v:68,note:"Over фаворизиран."},{n:"Пазар",v:72,note:"Голова разлика очаквана."}],
    keyMoments:[{m:"15'",t:"1-0 (Роналдо)"},{m:"33'",t:"2-0 (Лейао)"},{m:"49'",t:"3-0 (Феликс)"},{m:"72'",t:"4-0 (Бернарду)"},{m:"85'",t:"5-0 (Рамош)"}],
    h2h:[{d:"н/д",r:"Първа среща",c:"d"}],
    lineupsHome:["Кошта","Каншелу","Диаш","Диого","Менде","Палиня","Бернарду","Витиня","Б.Силва","Роналдо","Лейао"],
    lineupsAway:["Нестеров","Хошимов","Ашурматов","Егамбердиев","Саидов","Хамробеков","Норчаев","Урунов","Машарипов","Шомуродов","Турсунов"],
    stats:[{n:"Владение",h:70,a:30},{n:"Удари",h:82,a:18},{n:"xG",h:80,a:20}],
    articles:[{t:"Португалия с голово шоу",s:"A Bola",time:"преди 3 дни"}]},
  {id:6,date:"23.06",match:"Англия — Гана",home:"Англия",away:"Гана",hf:"🏴",af:"🇬🇭",fifaH:"4",fifaA:"68",league:"СП 2026 · Група",venue:"Gillette Stadium, Бостън",pick:"Англия чиста мрежа",market:"Clean Sheet",score:92,minOdds:"1.90",status:"loss",result:"0 : 0",published:"23.06",analysis:"Sharp money в посока Гана се оказа правилен сигнал. Резултат 0-0. Урок: когато sharp money противоречи на модела, намаляваме позицията.",pillars:[{n:"xG анализ",v:82,note:"Моделът надцени Англия."},{n:"Форма",v:80,note:"Добра, но не реализирана."},{n:"Контекст",v:76,note:"Гана дисциплинирана."},{n:"Odds движение",v:76,note:"Подценен sharp сигнал."},{n:"Пазар",v:78,note:"Clean sheet риск."}],
    keyMoments:[{m:"Край",t:"Безгол равенство"}],
    h2h:[{d:"2011",r:"Англия 1-1 Гана",c:"d"}],
    lineupsHome:["Пикфорд","Уокър","Стоунс","Гехи","Шоу","Райс","Белингам","Фоудън","Сака","Кейн","Палмър"],
    lineupsAway:["Ати-Зиги","Ламптей","Салису","Джибрил","Менса","Партей","Куду","Самед","Кудус","Семеньо","Уилямс"],
    stats:[{n:"Владение",h:64,a:36},{n:"Удари",h:58,a:42},{n:"xG",h:55,a:30}],
    articles:[{t:"Англия се препъна в дисциплинирана Гана",s:"BBC Sport",time:"преди 3 дни"}]},
];

const skipped = [
  {date:"26.06",match:"Д.Р. Конго — Узбекистан",score:31,reason:"Непредвидим мотивационен профил, ниска ликвидност."},
  {date:"26.06",match:"Йордания — Аржентина",score:34,reason:"Аржентина вероятно ще ротира тотално."},
  {date:"25.06",match:"САЩ — Турция",score:28,reason:"Тотална ротация и при двата тима."},
  {date:"24.06",match:"Чехия — Мексико",score:20,reason:"Ротация на Мексико, слаби xG данни."},
  {date:"23.06",match:"Босна — Катар",score:8,reason:"Двата елиминирани, нулева мотивация."},
];

const scanStats = {"26.06":{scanned:48,passed:2,skipped:46},"25.06":{scanned:52,passed:1,skipped:51},"24.06":{scanned:41,passed:1,skipped:40},"23.06":{scanned:44,passed:2,skipped:42}};

const testimonials = [
  {name:"Мартин Г.",city:"София",text:"Следя ги вече 3 месеца — дисциплината им си личи. Банката ми за първи път расте.",stars:5},
  {name:"Ивайло П.",city:"Пловдив",text:"Tova 4e puskat i propusnatite ma4ove s obqsnenie me spe4eli. Ne kriqt ni6to.",stars:5},
  {name:"Деси К.",city:"Варна",text:"Харесва ми че всичко излиза преди мача в телеграма. Единствено бих искала по-често да пишат.",stars:4},
  {name:"Николай Д.",city:"Стара Загора",text:"Аз бях скептичен в началото, ама после видях че наистина обясняват защо залагат. Препоръчвам.",stars:5},
  {name:"Стоян К.",city:"Плевен",text:"Не ти обещават златни планини. Реалистични са. Това ми вдъхва доверие.",stars:5},
  {name:"Веселин А.",city:"Сливен",text:"ROI-а ми е плюсов, не много ама плюсов. Сапорта отговаря бързо.",stars:5},
  {name:"Калоян Т.",city:"Добрич",text:"Nai-dobriq tipster s koito sum rabotil. Ima i zagubi no obshto sum na plyus.",stars:4},
  {name:"Антония В.",city:"Шумен",text:"Очаквах малко повече в началото, но след като разбрах логиката го оцених. Трябва ти търпение.",stars:3},
  {name:"Жельо П.",city:"Хасково",text:"Много добре, телеграм каналът е топ. Всичко с час и дата, няма измама.",stars:5},
  {name:"Ради М.",city:"Велико Търново",text:"Справят се. Не са съвършени, ама общо взето съм доволен и оставам.",stars:4},
  {name:"Емил С.",city:"Габрово",text:"Най-добрият типстър с който съм работил. Прозрачността им е нещо което не съм виждал другаде.",stars:5},
];
const BOT_KB = [
  {keys:["абонамент","план","цена","плащане","basic","premium","безплатен","колко струва"],reply:"Имаме три нива.\n\nБезплатен (0€) — една прогноза на ден, плюс целия ни track record.\n\nBasic (12.50€/мес) — 3-5 прогнози дневно, пълният xG анализ и Quality Score-а зад всяка.\n\nPremium (30€/мес) — всяка прогноза, пълен анализ преди мача и въпроси директно.\n\nТочно сега Basic е на 12.50€ вместо 25€ за първите 20 души."},
  {keys:["early bird","отстъпка","промо","discount"],reply:"Да, върви в момента. Първите 20 души хващат Basic на 12.50€ вместо 25€ — и това остава твоята цена занапред.\n\nМестата се пълнят. Пиши на aeytips@gmail.com или +359 879 667 754."},
  {keys:["xg","система","метод","стълб","анализ","как работ"],reply:"Не залагаме на усещане — минаваме всеки мач през пет филтъра.\n\nПърво xG — реалните срещу очакваните голове. После формата и моментума. Трето, контекстът: на кого какво му е на карта. Четвърто, движението на коефициентите. И накрая избирам конкретния пазар.\n\nАко мачът не събере поне 3.5 от 5 — пропускаме го."},
  {keys:["резулт","track record","загуб","strike","roi","статистика"],reply:"Всяка прогноза излиза в Telegram преди мача, с час и дата. Видими са и загубите, и пропуснатите мачове.\n\nИзграждаме публичния си track record прозрачно — без скрити загуби, без преувеличения."},
  {keys:["контакт","email","телефон","свърж"],reply:"Най-бързо ни хващаш на:\n\naeytips@gmail.com\n+359 879 667 754\n\nОтговаряме всеки ден между 09:00 и 22:00."},
  {keys:["telegram","канал"],reply:"Каналът ни в Telegram е мястото за всичко в реално време — безплатна прогноза дневно, резултатите и месечните отчети.\n\nВсяка прогноза влиза там преди мача. За линк пиши на aeytips@gmail.com."},
  {keys:["легал","законно","закон","право ли"],reply:"Да, напълно. Ние не сме букмейкър и не приемаме залози — даваме анализи, което е законна дейност.\n\nВ България хазартът е регулиран и легален за хора над 18 г."},
  {keys:["защо да","вярвам","измама","scam","реални ли"],reply:"Всяка прогноза излиза в Telegram преди мача, с час и дата. Не можем да я променим после.\n\nНе обещаваме забогатяване. Показваме и загубите. Ако някой ти гарантира 100% печалба — бягай от него."},
  {keys:["bankroll","банка","управление","риск","пари"],reply:"Принципът: една единица = 1% от банката. Стандартна прогноза 1-2 единици, максимум 3. Никога над 5% на залог.\n\nЗалагай само пари, чиято загуба не би те заболяла."},
  {keys:["кой","какво е","aey","за нас","типстър"],reply:"AEY Tips сме футболен типстър, който залага на данни и прозрачност. Стъпваме на xG анализ и петстъпкова методология.\n\nВсяка прогноза излиза публично преди мача, с timestamp. Показваме и загубите."},
  {keys:["сигурн","железен","100%","гаранц"],reply:"Няма сигурен залог. Нито при нас, нито при когото и да било. Ако някой ти продава железни прогнози — лъже те."},
  {keys:["здравей","здрасти","hi","hello","добър","привет"],reply:"Здрасти! Мога да разкажа за прогнозите, как избираме мачовете, за абонаментите или каквото те интересува. От къде да започнем?"},
];

const FB_FIRST = [
  "Дай да съм сигурен, че те разбирам — за прогнозите ли става дума, или за нещо около абонамента?",
  "Интересен въпрос. Кажи ми малко повече — какво точно те човърка?",
  "Може ли да го уточниш с две думи, че да ти дам стойностен отговор?",
];
const FB_SECOND = [
  "Разбирам те по-добре сега. Дай ми още малко контекст и ще ти отговоря конкретно.",
  "Ясно накъде биеш. За да съм конкретен — какъв точно е твоят случай?",
];
const FB_ESCALATE = [
  "Виж, това е от нещата, по които момчетата дават най-точен отговор директно. Пусни ни два реда на aeytips@gmail.com. Отговаряме до 24ч.",
  "На този въпрос ще ти отговорят най-добре лично. Пиши на aeytips@gmail.com — отговарят в същия ден.",
];
function pick(arr, seed) { return arr[seed % arr.length]; }
function getBotReply(input, unknownStreak, seed) {
  const lower = input.toLowerCase();
  for (const item of BOT_KB) if (item.keys.some(k => lower.includes(k))) return item.reply;
  if (unknownStreak >= 2) return pick(FB_ESCALATE, seed);
  if (unknownStreak === 1) return pick(FB_SECOND, seed);
  return pick(FB_FIRST, seed);
}

function ScoreRing({ score, size = 56 }) {
  const color = score >= 80 ? GR : score >= 60 ? Y : RD;
  const r = size / 2 - 8, circ = 2 * Math.PI * r, fill = circ * (1 - score / 100);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={B} strokeWidth="4" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4" strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.23, fontWeight: 800, color }}>{score}</div>
    </div>
  );
}
function StatusBadge({ status }) {
  const map = { win: ["ПЕЧАЛБА", GR], loss: ["ЗАГУБА", RD], live: ["НА ЖИВО", RD], pending: ["ОЧАКВА СЕ", Y] };
  const [txt, c] = map[status] || map.pending;
  return <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: c + "1a", color: c, border: "1px solid " + c + "33" }}>{txt}</span>;
}
function StatBar({ label, h, a }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
        <span style={{ fontWeight: 700, color: "#fff" }}>{h}%</span>
        <span style={{ color: M }}>{label}</span>
        <span style={{ fontWeight: 700, color: "#fff" }}>{a}%</span>
      </div>
      <div style={{ display: "flex", height: 5, gap: 2 }}>
        <div style={{ flex: h, background: Y, opacity: .9 }} />
        <div style={{ flex: a, background: BL, opacity: .7 }} />
      </div>
    </div>
  );
}
function SubTabs({ active, onChange, items }) {
  return (
    <div style={{ display: "flex", borderBottom: "1px solid " + B, overflowX: "auto" }}>
      {items.map(it => (
        <button key={it} onClick={() => onChange(it)} style={{ flexShrink: 0, padding: "10px 14px", background: "transparent", border: "none", borderBottom: active === it ? "2px solid " + Y : "2px solid transparent", color: active === it ? Y : M, fontSize: 11, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>{it}</button>
      ))}
    </div>
  );
}
function TipCard({ tip, onOpen }) {
  return (
    <div style={{ background: S1, border: "1px solid " + B, marginBottom: 10 }}>
      <div onClick={() => onOpen(tip)} style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
        <ScoreRing score={tip.score} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, color: M, textTransform: "uppercase" }}>{tip.league}</span>
            <StatusBadge status={tip.status} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{tip.hf} {tip.match} {tip.af}</div>
          <div style={{ fontSize: 12, color: Y, fontWeight: 600, marginBottom: 4 }}>{tip.pick}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", fontSize: 11, color: M }}>
            {tip.time && <span>{tip.time} ч.</span>}
            {tip.venue && <span>{tip.venue.split(",")[0]}</span>}
            <span>{tip.market}</span>
            <span>коеф. {tip.minOdds}</span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderTop: "1px solid " + B }}>
        {["Прогноза","Инфо","H2H","Състави","Статии"].map((t, i) => (
          <button key={t} onClick={() => onOpen(tip, t)} style={{ flex: 1, padding: "9px 2px", background: "transparent", border: "none", borderRight: i < 4 ? "1px solid " + B : "none", color: M, fontSize: 10, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>{t}</button>
        ))}
      </div>
    </div>
  );
}
function LiveCard({ tip: rawTip, onOpen }) {
  const live = useLivePolling(rawTip, true);
  const tip = live ? { ...rawTip, ...live } : rawTip;
  const parts = (tip.result || "- : -").split(":");
  const hs = parts[0] ? parts[0].trim() : "-";
  const as2 = parts[1] ? parts[1].trim() : "-";
  return (
    <div onClick={() => onOpen(tip)} style={{ background: S1, border: "1px solid " + RD + "4d", marginBottom: 8, cursor: "pointer" }}>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: M, textTransform: "uppercase" }}>{tip.league}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: RD }}>{tip.elapsed ? tip.elapsed + "'" : "LIVE"}</span>
        </div>
        {[{f:tip.hf,n:tip.home,s:hs},{f:tip.af,n:tip.away,s:as2}].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{row.f} {row.n}</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{row.s}</span>
          </div>
        ))}
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid " + B, display: "flex", alignItems: "center", gap: 8 }}>
          <ScoreRing score={tip.score} size={42} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: M, textTransform: "uppercase" }}>Прогноза AEY</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: Y }}>{tip.pick}</div>
          </div>
          <span style={{ fontSize: 10, color: Y, fontWeight: 600 }}>Лог на живо</span>
        </div>
      </div>
    </div>
  );
}
function TipModal({ tip: rawTip, initialTab, onClose }) {
  const liveData = useLivePolling(rawTip, rawTip.status === "live");
  const tip = liveData ? { ...rawTip, ...liveData } : rawTip;
  const isLive = tip.status === "live", isUpcoming = tip.status === "pending";
  const baseTabs = isUpcoming ? ["Прогноза","Инфо","H2H","Състави","Статии"] : ["Преглед","Статистики","H2H","Състави","Статии"];
  const [sub, setSub] = useState(initialTab && baseTabs.includes(initialTab) ? initialTab : baseTabs[0]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: BG, width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto", borderTop: "2px solid " + Y }}>
        <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid " + B, position: "sticky", top: 0, background: BG, zIndex: 5 }}>
          <span style={{ fontSize: 11, color: M, textTransform: "uppercase" }}>{tip.league}</span>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: M, fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        <div style={{ padding: "18px 16px", background: S1, borderBottom: "1px solid " + B }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 30 }}>{tip.hf}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4 }}>{tip.home}</div>
              {tip.fifaH && <div style={{ fontSize: 9, color: M, marginTop: 2 }}>FIFA: {tip.fifaH}</div>}
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              {isUpcoming
                ? <><div style={{ fontSize: 13, fontWeight: 800, color: Y }}>{tip.time || "-"}</div><div style={{ fontSize: 10, color: M, marginTop: 2 }}>{tip.date}</div></>
                : <><div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{tip.result || "-"}</div><div style={{ fontSize: 10, color: isLive ? RD : M, marginTop: 2 }}>{isLive ? (tip.elapsed ? tip.elapsed + "'" : "НА ЖИВО") : "Завършен"}</div></>}
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 30 }}>{tip.af}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", marginTop: 4 }}>{tip.away}</div>
              {tip.fifaA && <div style={{ fontSize: 9, color: M, marginTop: 2 }}>FIFA: {tip.fifaA}</div>}
            </div>
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10, background: Y + "14", border: "1px solid " + Y + "40", padding: "10px 12px" }}>
            <ScoreRing score={tip.score} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: M, textTransform: "uppercase" }}>Прогноза AEY · Quality {tip.score}/100</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: Y }}>{tip.pick}</div>
              <div style={{ fontSize: 11, color: SUB, marginTop: 2 }}>Пазар: {tip.market} · Мин. odds {tip.minOdds}</div>
            </div>
            <StatusBadge status={tip.status} />
          </div>
          {tip.published && <div style={{ fontSize: 10, color: M, marginTop: 8, textAlign: "center" }}>Публикувано преди мача · {tip.published}</div>}
        </div>
        <SubTabs active={sub} onChange={setSub} items={baseTabs} />
        <div style={{ padding: 16 }}>
          {(sub === "Прогноза" || sub === "Преглед") && <>
            <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 8 }}>{isUpcoming ? "Защо тази прогноза" : "Какво се случи"}</div>
            <div style={{ fontSize: 13, color: SUB, lineHeight: 1.65, marginBottom: 16 }}>{tip.analysis}</div>
            <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 8 }}>5-стълбов анализ</div>
            {tip.pillars.map(p => (
              <div key={p.n} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: p.note ? 3 : 0 }}>
                  <span style={{ fontSize: 12, color: SUB, minWidth: 90 }}>{p.n}</span>
                  <div style={{ flex: 1, height: 5, background: B }}><div style={{ height: "100%", background: p.v >= 80 ? GR : p.v >= 60 ? Y : RD, width: p.v + "%" }} /></div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", minWidth: 24, textAlign: "right" }}>{p.v}</span>
                </div>
                {p.note && <div style={{ fontSize: 11, color: M, lineHeight: 1.5 }}>{p.note}</div>}
              </div>
            ))}
            {isLive && tip.liveFeed && <>
              <div style={{ fontSize: 10, color: RD, textTransform: "uppercase", margin: "18px 0 8px" }}>Лог на живо · {tip.elapsed}'</div>
              {tip.liveFeed.map((k, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: i < tip.liveFeed.length - 1 ? "1px solid " + B : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: RD, minWidth: 34 }}>{k.m}</span>
                  <span style={{ fontSize: 12, color: i === 0 ? "#fff" : SUB }}>{k.t}</span>
                </div>
              ))}
            </>}
            {!isLive && tip.keyMoments && <>
              <div style={{ fontSize: 10, color: M, textTransform: "uppercase", margin: "18px 0 8px" }}>Ключови моменти</div>
              {tip.keyMoments.map((k, i) => (
                <div key={i} style={{ display: "flex", gap: 12, padding: "7px 0", borderBottom: i < tip.keyMoments.length - 1 ? "1px solid " + B : "none" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: Y, minWidth: 34 }}>{k.m}</span>
                  <span style={{ fontSize: 12, color: SUB }}>{k.t}</span>
                </div>
              ))}
            </>}
          </>}
          {sub === "Инфо" && <>
            {[["Дата", (tip.date||"") + " " + (tip.time||"")], ["Стадион", tip.venue||"-"], ["Съдия", tip.ref||"-"], ["Турнир", tip.league]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid " + B }}>
                <span style={{ fontSize: 12, color: M }}>{l}</span>
                <span style={{ fontSize: 12, color: "#fff", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{v}</span>
              </div>
            ))}
            {tip.stats && <><div style={{ fontSize: 10, color: M, textTransform: "uppercase", margin: "18px 0 12px" }}>Сравнение</div>{tip.stats.map(s => <StatBar key={s.n} label={s.n} h={s.h} a={s.a} />)}</>}
          </>}
          {sub === "Статистики" && (tip.stats ? tip.stats.map(s => <StatBar key={s.n} label={s.n} h={s.h} a={s.a} />) : <div style={{ color: M }}>Няма статистики.</div>)}
          {sub === "H2H" && <>
            <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 10 }}>Последни срещи</div>
            {tip.h2h ? tip.h2h.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < tip.h2h.length - 1 ? "1px solid " + B : "none" }}>
                <span style={{ fontSize: 11, color: M, minWidth: 40 }}>{h.d}</span>
                <span style={{ flex: 1, fontSize: 12, color: "#fff" }}>{h.r}</span>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: h.c === "w" ? GR : h.c === "d" ? M : RD }} />
              </div>
            )) : <div style={{ color: M }}>Няма данни.</div>}
          </>}
          {sub === "Състави" && (tip.lineupsHome ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: Y, marginBottom: 8 }}>{tip.hf} {tip.home}</div>
                {tip.lineupsHome.map((p, i) => <div key={i} style={{ fontSize: 12, color: SUB, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{p}</div>)}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: BL, marginBottom: 8 }}>{tip.af} {tip.away}</div>
                {tip.lineupsAway.map((p, i) => <div key={i} style={{ fontSize: 12, color: SUB, padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{p}</div>)}
              </div>
            </div>
          ) : <div style={{ color: M }}>Съставите ще бъдат обявени преди мача.</div>)}
          {sub === "Статии" && <>
            <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 10 }}>Свързани новини</div>
            {tip.articles ? tip.articles.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < tip.articles.length - 1 ? "1px solid " + B : "none" }}>
                <div style={{ width: 56, height: 56, flexShrink: 0, background: S2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid " + B }}>📰</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", lineHeight: 1.4, marginBottom: 4 }}>{a.t}</div>
                  <div style={{ fontSize: 11, color: M }}>{a.s} · {a.time}</div>
                </div>
              </div>
            )) : <div style={{ color: M }}>Няма статии.</div>}
          </>}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}
function HomeTab({ go }) {
  const heroStats = CONFIG.TRACK_RECORD_VERIFIED
    ? [["75%","Успеваемост"],["+18.4%","ROI"],["7/8","Верифицирани"]]
    : [["В процес","Track record"],["Публично","Всяка прогноза"],["0 скрити","Загуби"]];
  return (
    <div style={{ paddingBottom: 8 }}>
      <div style={{ textAlign: "center", padding: "28px 8px 22px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: Y + "18", border: "1px solid " + Y + "44", padding: "5px 12px", marginBottom: 16, fontSize: 11, fontWeight: 700, color: Y }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: GR }} />LIVE · Световно първенство 2026
        </div>
        <h1 style={{ fontSize: 27, fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-1px", margin: "0 0 12px" }}>
          Футболни прогнози,<br />стъпили на <span style={{ color: Y }}>данни</span>.<br />Не на обещания.
        </h1>
        <p style={{ fontSize: 14, color: SUB, lineHeight: 1.6, maxWidth: 340, margin: "0 auto 22px" }}>
          Всяка прогноза минава през 5-стъпков анализ и излиза публично <b style={{ color: "#fff" }}>преди мача</b> — с timestamp.
        </p>
        <button onClick={() => go("plans")} style={{ background: Y, color: "#000", border: "none", padding: "14px 32px", fontSize: 14, fontWeight: 800, textTransform: "uppercase", cursor: "pointer", width: "100%", maxWidth: 320 }}>Започни безплатно</button>
        <div style={{ fontSize: 11, color: M, marginTop: 10 }}>Без карта · 1 безплатна прогноза дневно</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: B, border: "1px solid " + B, marginBottom: 8 }}>
        {heroStats.map(([v,l]) => (
          <div key={l} style={{ background: S1, padding: "16px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: Y, letterSpacing: "-1px" }}>{v}</div>
            <div style={{ fontSize: 9, color: M, textTransform: "uppercase", marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      {!CONFIG.TRACK_RECORD_VERIFIED && (
        <div style={{ background: BL + "12", border: "1px solid " + BL + "44", padding: "10px 14px", marginBottom: 8, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 16 }}>🏗️</span>
          <div style={{ fontSize: 12, color: SUB, lineHeight: 1.5 }}>Изграждаме публичния си track record. Всяка прогноза излиза преди мача — следи я и преценявай сам.</div>
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: M, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 2, background: Y }} />Как работи
        </div>
        {[["1","Анализираме","Всеки мач минава през 5 филтъра — xG, форма, контекст, движение на коефициентите и избор на пазар."],["2","Филтрираме","Пускаме само прогнози с Quality Score 3.5/5 и нагоре. Под прага — мачът се пропуска публично, с обяснение."],["3","Печелиш дългосрочно","Получаваш прогнозите преди мача, следваш дисциплина с банката и оставяш числата да работят."]].map(([n,t,d]) => (
          <div key={n} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
            <div style={{ width: 32, height: 32, flexShrink: 0, background: Y, color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900 }}>{n}</div>
            <div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 3 }}>{t}</div><div style={{ fontSize: 12, color: M, lineHeight: 1.55 }}>{d}</div></div>
          </div>
        ))}
      </div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: M, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 16, height: 2, background: Y }} />Реални абонати, реални резултати
        </div>
        {CONFIG.TRACK_RECORD_VERIFIED ? testimonials.map((t, i) => (
          <div key={i} style={{ background: S1, border: "1px solid " + B, padding: 14, marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: SUB, lineHeight: 1.6, marginBottom: 10, fontStyle: "italic" }}>{t.text}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: Y }}>{t.name[0]}</div>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.name}</div><div style={{ fontSize: 10, color: M }}>{t.city}</div></div>
              </div>
              <div style={{ fontSize: 11, color: Y }}>{"★".repeat(t.stars)}<span style={{ color: B }}>{"★".repeat(5-t.stars)}</span></div>
            </div>
          </div>
        )) : (
          <div style={{ background: S1, border: "1px solid " + B, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
            <div style={{ fontSize: 13, color: SUB, lineHeight: 1.6 }}>Тепърва стартираме. Бъди сред първите ни абонати и помогни да изградим общност, базирана на доверие.</div>
          </div>
        )}
      </div>
      <div style={{ background: Y, padding: "22px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#000", textTransform: "uppercase", marginBottom: 8, opacity: .6 }}>Ограничена оферта</div>
        <div style={{ fontSize: 19, fontWeight: 900, color: "#000", lineHeight: 1.2, marginBottom: 6 }}>Basic на 12.50€ вместо 25€</div>
        <div style={{ fontSize: 13, color: "rgba(0,0,0,0.65)", marginBottom: 16 }}>Само за първите 20 абоната. Цената остава твоя завинаги.</div>
        <button onClick={() => go("plans")} style={{ background: "#000", color: Y, border: "none", padding: "13px 28px", fontSize: 13, fontWeight: 800, textTransform: "uppercase", cursor: "pointer", width: "100%", maxWidth: 300 }}>Вземи офертата</button>
      </div>
      <div style={{ textAlign: "center", fontSize: 10, color: M, lineHeight: 1.6, padding: "16px 8px 4px" }}>
        AEY Tips предоставя аналитично мнение, не гаранция за печалба. Хазартът носи финансов риск. Залагай отговорно. 18+
      </div>
    </div>
  );
}
function StatsTab({ onOpen }) {
  const won = tips.filter(t => t.status === "win").length;
  const lost = tips.filter(t => t.status === "loss").length;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[[won+"W / "+lost+"L","Резултат",GR],["В процес","ROI",Y],["3.5/5","Праг",Y],["0","Скрити загуби",Y]].map(([v,l,c]) => (
          <div key={l} style={{ background: S1, border: "1px solid " + B, padding: 14 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: c, letterSpacing: "-1px", marginBottom: 2 }}>{v}</div>
            <div style={{ fontSize: 11, color: M, textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ background: S1, border: "1px solid " + B, padding: 14, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 12 }}>Всички прогнози</div>
        {tips.filter(t => t.status !== "pending" && t.status !== "live").map(t => (
          <div key={t.id} onClick={() => onOpen && onOpen(t)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: "1px solid " + B, cursor: "pointer" }}>
            <ScoreRing score={t.score} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.hf} {t.match}</div>
              <div style={{ fontSize: 11, color: M }}>{t.pick}{t.result ? " · " + t.result : ""}</div>
            </div>
            <StatusBadge status={t.status} />
          </div>
        ))}
      </div>
      <div style={{ background: S1, border: "1px solid " + B, padding: 14 }}>
        <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 12 }}>Пропуснати мачове</div>
        {skipped.map((s, i) => (
          <div key={i} style={{ padding: "10px 0", borderBottom: i < skipped.length-1 ? "1px solid " + B : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>{s.match}</span>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 7px", background: RD+"1a", color: RD, border: "1px solid "+RD+"33" }}>Score: {s.score}</span>
            </div>
            <div style={{ fontSize: 12, color: M, lineHeight: 1.5 }}>{s.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function PlansTab() {
  const [busy, setBusy] = useState("");
  const subscribe = async (plan) => {
    if (plan === "Безплатен") { alert("Присъедини се към Telegram канала от таб Контакти."); return; }
    if (!CONFIG.PAYMENT.enabled || !CONFIG.BACKEND) {
      alert("Скоро! За early bird достъп пиши на " + CONFIG.CONTACT.email + " или " + CONFIG.CONTACT.phone + ".");
      return;
    }
    setBusy(plan);
    const res = await backendPost(CONFIG.ENDPOINTS.subscribe, { plan, currency: CONFIG.PAYMENT.currency });
    setBusy("");
    if (res && res.checkoutUrl) window.location.href = res.checkoutUrl;
    else alert("Проблем с плащането. Пиши на " + CONFIG.CONTACT.email);
  };
  const plans = [
    {name:"Безплатен",price:"0",per:"€ · завинаги",features:["1 прогноза дневно","Публичен track record","Месечен отчет с ROI"],featured:false,cta:"Влез в канала"},
    {name:"Basic",price:"12.50",per:"€ / месец",features:["3-5 прогнози дневно","Пълен xG анализ","Quality Score","Odds движение","Пропуснатите мачове + защо"],featured:true,cta:"Абонирай се"},
    {name:"Premium",price:"30",per:"€ / месец",features:["Всички прогнози","Пълен анализ преди мач","Q&A директно","Турнирни анализи","Bankroll guide"],featured:false,cta:"Заяви достъп"},
  ];
  return (
    <div>
      <div style={{ background: Y+"18", border: "1px solid "+Y+"44", padding: 14, marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: Y, textTransform: "uppercase", marginBottom: 4 }}>EARLY BIRD — 50% ОТСТЪПКА</div>
        <div style={{ fontSize: 13, color: SUB }}>Basic на <b style={{ color: "#fff" }}>12.50€</b> вместо 25€ — само за първите 20 абоната.</div>
      </div>
      {plans.map(p => (
        <div key={p.name} style={{ background: p.featured ? Y : S1, border: "1px solid "+(p.featured?"transparent":B), padding: "18px 16px", marginBottom: 8, position: "relative" }}>
          {p.featured && <div style={{ position: "absolute", top: 0, left: 0, right: 0, background: "#000", color: Y, fontSize: 10, fontWeight: 800, textAlign: "center", padding: 3, textTransform: "uppercase" }}>НАЙ-ПОПУЛЯРЕН</div>}
          <div style={{ marginTop: p.featured ? 12 : 0 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: p.featured?"rgba(0,0,0,0.5)":M, textTransform: "uppercase" }}>{p.name}</span>
              <div><span style={{ fontSize: 28, fontWeight: 900, color: p.featured?"#000":"#fff", letterSpacing: "-1px" }}>{p.price}</span><span style={{ fontSize: 11, color: p.featured?"rgba(0,0,0,0.4)":M, marginLeft: 4 }}>{p.per}</span></div>
            </div>
            <div style={{ height: 1, background: p.featured?"rgba(0,0,0,0.15)":B, margin: "10px 0" }} />
            <ul style={{ listStyle: "none", marginBottom: 14, padding: 0 }}>
              {p.features.map(f => (
                <li key={f} style={{ fontSize: 12, color: p.featured?"rgba(0,0,0,0.7)":SUB, padding: "4px 0", display: "flex", gap: 8, borderBottom: "1px solid "+(p.featured?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.04)") }}>
                  <span style={{ color: p.featured?"#000":Y, fontWeight: 700 }}>+</span>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => subscribe(p.name)} disabled={busy===p.name} style={{ width: "100%", padding: 11, fontSize: 12, fontWeight: 800, textTransform: "uppercase", cursor: "pointer", border: "none", background: p.featured?"#000":B, color: p.featured?Y:"#fff", opacity: busy===p.name?.6:1 }}>{busy===p.name?"Обработка...":p.cta}</button>
          </div>
        </div>
      ))}
      <div style={{ textAlign: "center", fontSize: 11, color: M, marginTop: 12 }}>Revolut · Банков превод · Crypto · EUR</div>
    </div>
  );
}
function ContactsTab() {
  const [form, setForm] = useState({name:"",email:"",msg:""});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const submit = async () => {
    if (!form.name||!form.email||!form.msg) return;
    setSending(true);
    await backendPost(CONFIG.ENDPOINTS.contact, form);
    setSending(false);
    if (!CONFIG.BACKEND) window.location.href = "mailto:"+CONFIG.CONTACT.email+"?subject=Запитване&body="+encodeURIComponent(form.msg+"\n\n"+form.email);
    setSent(true);
  };
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
        <a href={"mailto:"+CONFIG.CONTACT.email} style={{ textDecoration: "none" }}>
          <div style={{ background: S1, border: "1px solid "+B, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✉️</div>
            <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 4 }}>Email</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: Y, wordBreak: "break-all" }}>{CONFIG.CONTACT.email}</div>
          </div>
        </a>
        <a href={"tel:"+CONFIG.CONTACT.phone.replace(/ /g,"")} style={{ textDecoration: "none" }}>
          <div style={{ background: S1, border: "1px solid "+B, padding: "16px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📞</div>
            <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 4 }}>Телефон</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: Y }}>{CONFIG.CONTACT.phone}</div>
          </div>
        </a>
      </div>
      <div style={{ background: Y+"12", border: "1px solid "+Y+"44", padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{ fontSize: 28 }}>✈️</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: Y, textTransform: "uppercase", marginBottom: 2 }}>Telegram канал</div>
          <div style={{ fontSize: 12, color: SUB, lineHeight: 1.5 }}>Безплатен канал с daily прогнози преди мача.</div>
          <button style={{ marginTop: 8, background: Y, color: "#000", border: "none", padding: "6px 14px", fontSize: 11, fontWeight: 800, textTransform: "uppercase", cursor: "pointer" }} onClick={() => CONFIG.TELEGRAM_URL ? window.open(CONFIG.TELEGRAM_URL) : alert("Telegram линкът ще бъде добавен при лаунч.")}>Присъедини се</button>
        </div>
      </div>
      {!sent ? (
        <div style={{ background: S1, border: "1px solid "+B, padding: 16 }}>
          <div style={{ fontSize: 10, color: M, textTransform: "uppercase", marginBottom: 16 }}>Изпрати съобщение</div>
          {[["Твоето име","name","text"],["Email адрес","email","email"]].map(([pl,k,t]) => (
            <input key={k} type={t} placeholder={pl} value={form[k]} onChange={e => setForm({...form,[k]:e.target.value})}
              style={{ width: "100%", background: S2, border: "1px solid "+B, color: "#fff", padding: "10px 12px", fontSize: 13, outline: "none", marginBottom: 10, fontFamily: "system-ui", boxSizing: "border-box" }} />
          ))}
          <textarea placeholder="Съобщение..." value={form.msg} onChange={e => setForm({...form,msg:e.target.value})} rows={4}
            style={{ width: "100%", background: S2, border: "1px solid "+B, color: "#fff", padding: "10px 12px", fontSize: 13, outline: "none", resize: "vertical", marginBottom: 14, fontFamily: "system-ui", boxSizing: "border-box" }} />
          <button onClick={submit} disabled={sending} style={{ width: "100%", background: Y, color: "#000", border: "none", padding: 12, fontSize: 13, fontWeight: 800, textTransform: "uppercase", cursor: "pointer", opacity: sending?.6:1 }}>{sending?"Изпращане...":"Изпрати съобщение"}</button>
        </div>
      ) : (
        <div style={{ background: S1, border: "1px solid "+GR, padding: 24, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: GR, marginBottom: 6 }}>Изпратено!</div>
          <div style={{ fontSize: 13, color: SUB }}>Ще се свържем с теб до 24 часа.</div>
          <button style={{ marginTop: 14, background: B, color: "#fff", border: "none", padding: "8px 20px", fontSize: 12, cursor: "pointer" }} onClick={() => { setSent(false); setForm({name:"",email:"",msg:""}); }}>Изпрати ново</button>
        </div>
      )}
      <div style={{ margin: "20px 0", padding: 14, background: S2, border: "1px solid "+B, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: M, lineHeight: 1.7 }}>Работно време:<br /><span style={{ color: "#fff", fontWeight: 600 }}>Всеки ден · 09:00 - 22:00</span></div>
      </div>
    </div>
  );
}
function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([{role:"assistant",content:"Здрасти! Аз съм от екипа на AEY Tips. Питай ме каквото искаш — за прогнозите, абонаментите или как работим."}]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unknownStreak, setUnknownStreak] = useState(0);
  const [userTurns, setUserTurns] = useState(0);
  const [askedFeedback, setAskedFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackBox, setShowFeedbackBox] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { if (bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"}); }, [messages, showFeedbackBox]);
  const send = () => {
    if (!input.trim()||loading) return;
    const userMsg = {role:"user",content:input.trim()};
    const newTurns = userTurns+1;
    setMessages(p => [...p,userMsg]); setInput(""); setLoading(true); setUserTurns(newTurns);
    const lower = userMsg.content.toLowerCase();
    const matched = BOT_KB.some(item => item.keys.some(k => lower.includes(k)));
    const nextStreak = matched ? 0 : unknownStreak+1;
    setUnknownStreak(nextStreak);
    const seed = Date.now();
    setTimeout(() => {
      setMessages(p => [...p,{role:"assistant",content:getBotReply(userMsg.content,nextStreak,seed)}]);
      if (newTurns>=4&&!askedFeedback) {
        setAskedFeedback(true);
        setTimeout(() => { setMessages(p => [...p,{role:"assistant",content:"Между другото — как ти се струваме дотук? Ще се радвам да чуя мнението ти."}]); setShowFeedbackBox(true); }, 900);
      }
      setLoading(false);
    }, 800+Math.random()*900);
  };
  const submitFeedback = () => {
    if (rating===0&&!feedbackText.trim()) return;
    backendPost(CONFIG.ENDPOINTS.feedback,{rating,text:feedbackText});
    setShowFeedbackBox(false);
    setMessages(p => [...p,{role:"assistant",content:rating>=4?"Страхотно, благодаря ти!":rating===3?"Благодаря за искреността — ще се постараем.":"Благодаря, че сподели. Ако нещо те е подразнило, пиши на aeytips@gmail.com."}]);
  };
  const quickQ = ["Какви са абонаментите?","Как работи системата?","Легално ли е?","Защо да ви вярвам?"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", background: BG }}>
      <div style={{ background: "#000", borderBottom: "2px solid "+Y, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: Y, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚽</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>AEY Tips · Чат</div>
            <div style={{ fontSize: 10, color: GR }}>Онлайн · отговаряме веднага</div>
          </div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: M, fontSize: 22, cursor: "pointer" }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m,i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role==="user"?"flex-end":"flex-start" }}>
            {m.role==="assistant"&&<div style={{ width:28,height:28,borderRadius:"50%",background:Y,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,marginRight:8,flexShrink:0,alignSelf:"flex-end" }}>⚽</div>}
            <div style={{ maxWidth:"80%",padding:"10px 13px",background:m.role==="user"?Y:S1,color:m.role==="user"?"#000":"#fff",fontSize:13,lineHeight:1.55,border:m.role==="user"?"none":"1px solid "+B,whiteSpace:"pre-wrap" }}>{m.content}</div>
          </div>
        ))}
        {showFeedbackBox&&(
          <div style={{ background:S1,border:"1px solid "+Y+"44",padding:14,margin:"4px 0" }}>
            <div style={{ display:"flex",gap:6,justifyContent:"center",marginBottom:12 }}>
              {[1,2,3,4,5].map(n=><button key={n} onClick={()=>setRating(n)} style={{ background:"transparent",border:"none",fontSize:26,cursor:"pointer",color:n<=rating?Y:B }}> ★</button>)}
            </div>
            <textarea placeholder="Кажи ни какво мислиш (по желание)..." value={feedbackText} onChange={e=>setFeedbackText(e.target.value)} rows={2}
              style={{ width:"100%",background:S2,border:"1px solid "+B,color:"#fff",padding:"8px 10px",fontSize:12,outline:"none",resize:"none",marginBottom:10,fontFamily:"system-ui",boxSizing:"border-box" }} />
            <button onClick={submitFeedback} style={{ width:"100%",background:Y,color:"#000",border:"none",padding:10,fontSize:12,fontWeight:800,textTransform:"uppercase",cursor:"pointer" }}>Изпрати оценка</button>
          </div>
        )}
        {loading&&(
          <div style={{ display:"flex",alignItems:"center",gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:"50%",background:Y,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>⚽</div>
            <div style={{ background:S1,border:"1px solid "+B,padding:"10px 14px",display:"flex",gap:5 }}>
              {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:Y,animation:"bounce 1s "+i*0.2+"s infinite" }} />)}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding:"8px 12px",display:"flex",gap:6,overflowX:"auto",borderTop:"1px solid "+B,flexShrink:0 }}>
        {quickQ.map(q=><button key={q} onClick={()=>setInput(q)} style={{ flexShrink:0,background:S2,border:"1px solid "+B,color:SUB,fontSize:11,padding:"5px 10px",cursor:"pointer",whiteSpace:"nowrap" }}>{q}</button>)}
      </div>
      <div style={{ padding:"10px 12px",borderTop:"1px solid "+B,display:"flex",gap:8,background:"#000",flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Задай въпрос..."
          style={{ flex:1,background:S1,border:"1px solid "+B,color:"#fff",padding:"10px 12px",fontSize:13,outline:"none",fontFamily:"system-ui" }} />
        <button onClick={send} disabled={loading||!input.trim()} style={{ background:Y,color:"#000",border:"none",padding:"10px 16px",fontSize:16,cursor:"pointer",opacity:loading||!input.trim()?.6:1,flexShrink:0 }}>➤</button>
      </div>
      <style>{"@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}"}</style>
    </div>
  );
}
export default function App() {
  const [tab, setTab] = useState("home");
  const [modal, setModal] = useState(null);
  const [modalTab, setModalTab] = useState(null);
  const [dateFilter, setDateFilter] = useState("26.06");
  const [chatOpen, setChatOpen] = useState(false);
  const [apiActive] = useState(!!API_CONFIG.key);
  const [paidNotice, setPaidNotice] = useState(false);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("paid")==="1") { setPaidNotice(true); window.history.replaceState({},"",window.location.pathname); }
  }, []);
  const openMatch = (tip, t) => { setModal(tip); setModalTab(t||null); };
  const dates = [...new Set(tips.map(t => t.date))];
  const filtered = tips.filter(t => t.date === dateFilter);
  const navItems = [{id:"home",icon:"🏠",label:"Начало"},{id:"tips",icon:"⚡",label:"Прогнози"},{id:"stats",icon:"📊",label:"Статистики"},{id:"plans",icon:"👑",label:"Планове"},{id:"contacts",icon:"📬",label:"Контакти"}];
  return (
    <div style={{ background:BG,minHeight:"100vh",maxWidth:420,margin:"0 auto",fontFamily:"system-ui,sans-serif",position:"relative",paddingBottom:80 }}>
      <div style={{ background:"#000",borderBottom:"2px solid "+Y,padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100 }}>
        <div style={{ fontSize:18,fontWeight:900,color:"#fff",letterSpacing:"-0.5px",textTransform:"uppercase" }}>AEY<span style={{ color:Y }}>TIPS</span></div>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:7,height:7,borderRadius:"50%",background:apiActive?GR:RD,animation:"blink 1s infinite" }} />
          <span style={{ fontSize:11,fontWeight:700,color:Y,textTransform:"uppercase" }}>Live · СП 2026</span>
        </div>
      </div>
      <div style={{ padding:"0 12px" }}>
        {tab==="home"&&<HomeTab go={setTab} />}
        {tab==="tips"&&<>
          <div style={{ display:"flex",gap:6,padding:"12px 0",overflowX:"auto" }}>
            {dates.map(d=><button key={d} onClick={()=>setDateFilter(d)} style={{ flexShrink:0,padding:"6px 14px",fontSize:12,fontWeight:700,textTransform:"uppercase",cursor:"pointer",border:"1px solid "+(dateFilter===d?Y:B),background:dateFilter===d?Y:"transparent",color:dateFilter===d?"#000":"#fff" }}>{d}</button>)}
          </div>
          {scanStats[dateFilter]&&(
            <div style={{ background:S1,border:"1px solid "+B,padding:"12px 14px",marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                <span style={{ fontSize:11,color:Y,fontWeight:700,textTransform:"uppercase" }}>Дневен скрининг</span>
                <span style={{ fontSize:10,color:M }}>{dateFilter}</span>
              </div>
              <div style={{ display:"flex" }}>
                {[["Сканирани",scanStats[dateFilter].scanned,"#fff"],["Преминали",scanStats[dateFilter].passed,GR],["Пропуснати",scanStats[dateFilter].skipped,M]].map(([l,v,c],i)=>(
                  <div key={l} style={{ flex:1,textAlign:"center",borderLeft:i>0?"1px solid "+B:"none" }}>
                    <div style={{ fontSize:20,fontWeight:900,color:c }}>{v}</div>
                    <div style={{ fontSize:9,color:M,textTransform:"uppercase",marginTop:2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {filtered.filter(t=>t.status==="live").length>0&&<>
            <div style={{ fontSize:10,color:RD,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ width:6,height:6,borderRadius:"50%",background:RD,animation:"blink 1s infinite" }} />На живо сега
            </div>
            {filtered.filter(t=>t.status==="live").map(t=><LiveCard key={t.id} tip={t} onOpen={openMatch} />)}
            <div style={{ height:16 }} />
          </>}
          <div style={{ fontSize:10,color:M,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8,display:"flex",alignItems:"center",gap:8 }}>
            <span style={{ width:16,height:2,background:Y }} />Прогнози за {dateFilter}
          </div>
          {filtered.filter(t=>t.status!=="live").length===0
            ?<div style={{ textAlign:"center",padding:"40px 20px",color:M }}>Няма прогнози за тази дата.</div>
            :filtered.filter(t=>t.status!=="live").map(t=><TipCard key={t.id} tip={t} onOpen={openMatch} />)}
          {skipped.filter(s=>s.date===dateFilter).length>0&&<>
            <div style={{ fontSize:10,color:M,textTransform:"uppercase",letterSpacing:".1em",margin:"16px 0 8px",display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ width:16,height:2,background:B }} />Пропуснати мачове
            </div>
            {skipped.filter(s=>s.date===dateFilter).map((s,i)=>(
              <div key={i} style={{ background:S1,border:"1px solid "+B,padding:"10px 12px",marginBottom:6,opacity:.7 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap" }}>
                  <span style={{ fontSize:13,color:"#fff",fontWeight:600 }}>{s.match}</span>
                  <span style={{ fontSize:9,fontWeight:700,padding:"1px 6px",background:RD+"1a",color:RD,border:"1px solid "+RD+"33" }}>Score: {s.score}</span>
                </div>
                <div style={{ fontSize:11,color:M,lineHeight:1.5 }}>{s.reason}</div>
              </div>
            ))}
          </>}
        </>}
        {tab==="stats"&&<div style={{ paddingTop:16 }}><StatsTab onOpen={openMatch} /></div>}
        {tab==="plans"&&<div style={{ paddingTop:16 }}><PlansTab /></div>}
        {tab==="contacts"&&<div style={{ paddingTop:16 }}><ContactsTab /></div>}
        <div style={{ textAlign:"center",padding:"24px 8px 8px",borderTop:"1px solid "+B,marginTop:8 }}>
          <div style={{ fontSize:10,color:M,lineHeight:1.6,marginBottom:8 }}>Хазартът носи финансов риск. Прогнозите са аналитично мнение. Залагай отговорно. 18+</div>
          <div style={{ fontSize:10,color:M,marginTop:8 }}>2026 AEY Tips · {CONFIG.CONTACT.email}</div>
        </div>
      </div>
      {!chatOpen&&<button onClick={()=>setChatOpen(true)} style={{ position:"fixed",bottom:88,right:16,width:52,height:52,borderRadius:"50%",background:Y,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,boxShadow:"0 4px 20px rgba(245,158,11,0.4)",zIndex:99 }}>💬<div style={{ position:"absolute",top:-2,right:-2,width:13,height:13,borderRadius:"50%",background:GR,border:"2px solid #000" }} /></button>}
      <div style={{ position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:420,background:"#000",borderTop:"2px solid "+Y,display:"flex",zIndex:99 }}>
        {navItems.map((n,i)=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{ flex:1,padding:"8px 0",background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,borderRight:i<navItems.length-1?"1px solid "+B:"none" }}>
            <span style={{ fontSize:16 }}>{n.icon}</span>
            <span style={{ fontSize:8,fontWeight:700,textTransform:"uppercase",color:tab===n.id?Y:M }}>{n.label}</span>
            {tab===n.id&&<div style={{ width:16,height:2,background:Y,borderRadius:1 }} />}
          </button>
        ))}
      </div>
      {chatOpen&&<ChatBot onClose={()=>setChatOpen(false)} />}
      {modal&&<TipModal tip={modal} initialTab={modalTab} onClose={()=>setModal(null)} />}
      {paidNotice&&(
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",padding:24 }} onClick={()=>setPaidNotice(false)}>
          <div style={{ background:S1,border:"1px solid "+GR,maxWidth:360,padding:28,textAlign:"center" }}>
            <div style={{ fontSize:40,marginBottom:12 }}>🎉</div>
            <div style={{ fontSize:18,fontWeight:900,color:"#fff",marginBottom:8 }}>Добре дошъл в AEY Tips!</div>
            <div style={{ fontSize:13,color:SUB,lineHeight:1.6,marginBottom:18 }}>Плащането е успешно. Провери имейла си за линк към Telegram канала.</div>
            <button onClick={()=>setPaidNotice(false)} style={{ background:Y,color:"#000",border:"none",padding:"11px 28px",fontSize:13,fontWeight:800,textTransform:"uppercase",cursor:"pointer" }}>Супер!</button>
          </div>
        </div>
      )}
      <style>{"@keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}"}</style>
    </div>
  );
}
