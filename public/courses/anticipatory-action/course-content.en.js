
/* =====================================================================
   COURSE CONTENT (English) — Anticipatory Action & Impact-Based Forecasting
   English translation of course-content.js. Keep the same structure, ids,
   answers and source indexes as the Bangla file.
   Every concept is shown for 4 hazards: cyclone, flood, landslide, heatwave.
   Places follow the MET Club working areas: Patuakhali, Gaibandha, Chattogram.
   ===================================================================== */
const SOURCES = [
  ['Research on anticipatory cash before the 2020 floods (BDRCS) — Anticipation Hub', 'https://www.anticipation-hub.org/news/does-cash-assistance-make-a-difference-before-floods-evidence-from-bangladesh'],
  ['UN’s USD 6.2 million in anticipatory assistance, 2024 — UN Bangladesh', 'https://bangladesh.un.org/en/273453-un-agencies-provide-62-million-anticipatory-cash-and-assistance-vulnerable-communities-ahead'],
  ['Cyclone Preparedness Programme (CPP) — Bangladesh Red Crescent Society', 'https://bdrcs.org/cyclone-preparedness-programm-cpp/'],
  ['50 years of cyclone preparedness — The Business Standard', 'https://www.tbsnews.net/thoughts/50-years-cyclone-preparedness-success-saving-lives-not-livelihood-368398'],
  ['More than 800,000 people evacuated before Cyclone Remal — Al Jazeera', 'https://www.aljazeera.com/amp/news/2024/5/26/cyclone-remal-slams-into-bangladesh-coast-as-hundreds-of-thousands-evacuate'],
  ['2017 Bangladesh landslides — Wikipedia', 'https://en.wikipedia.org/wiki/2017_Bangladesh_landslides'],
  ['2007 Chittagong mudslides — Wikipedia', 'https://en.wikipedia.org/wiki/2007_Chittagong_mudslides'],
  ['Landslide early warning system in Cox’s Bazar (FAO) — The Business Standard', 'https://www.tbsnews.net/node/185326'],
  ['Flood forecasting and warning in Bangladesh (FFWC) — WMO', 'https://wmo.int/node/25420'],
  ['More than 5.8 million people affected by the August 2024 floods — Prothom Alo', 'https://en.prothomalo.com/bangladesh/jlhynhnhf4'],
  ['Record 26-day heatwave in 2024 — The Business Standard', 'https://www.tbsnews.net/bangladesh/environment/bangladesh-experiencing-longest-heatwave-record-837041'],
  ['Heatwave Early Action Protocol activated in Dhaka (BDRCS) — Red Cross Red Crescent Climate Centre', 'https://www.climatecentre.org/13733/red-crescent-activates-early-action-protocol-for-heatwaves-in-dhaka/'],
  ['BMD heatwave thresholds — The Daily Star', 'https://www.thedailystar.net/environment/weather/news/brace-severe-heatwave-month-3862796']
];

const CAST = {
  megla: {name: 'Meteorologist', role: 'MET Club mentor'},
  mitu:  {name: 'Mitu', role: 'Class 9 · Fulchhari, Gaibandha', hazard: 'flood'},
  rafi:  {name: 'Rafi', role: 'College student and CPP volunteer · Kalapara, Patuakhali', hazard: 'cyclone'},
  usha:  {name: 'Usha', role: 'Class 10 · Chattogram', hazard: 'landslide'}
};
const HZ = {
  cyclone:   {name: 'Cyclone', who: 'rafi', place: 'Kalapara, Patuakhali', area: 'Patuakhali coast'},
  flood:     {name: 'Flood', who: 'mitu', place: 'Fulchhari, Gaibandha', area: 'The chars of Gaibandha'},
  landslide: {name: 'Landslide', who: 'usha', place: 'Chattogram', area: 'The hills of Chattogram'},
  heatwave:  {name: 'Heatwave', who: null, place: 'Whole country', area: 'Across the country, especially in summer'}
};
const HZ_KEYS = ['cyclone', 'flood', 'landslide', 'heatwave'];

const COURSE = [
/* ======================= CHAPTER 1 ======================= */
{
  id: 1, color: 'blue', title: 'The basics of anticipatory action', sub: 'What does it mean to act before a disaster? The difference between "waiting" and "preparing".',
  cards: [
    {t: 'story', scene: 'call', lines: [
      ['megla', 'Hello MET Club! Today three friends from three districts have joined us online. Go on, introduce yourselves!'],
      ['mitu', 'I’m Mitu. I live on a char in Fulchhari, Gaibandha. Almost every monsoon the Jamuna’s water comes into our yard.'],
      ['rafi', 'I’m Rafi, from Kalapara in Patuakhali. I’m in college and I’m learning to work as a CPP volunteer. Cyclones are an old enemy we know well.'],
      ['usha', 'I’m Usha, from Chattogram. Whenever it rains heavily for a few days in a row, we start to fear landslides in our hilly area.'],
      ['megla', 'And in summer the whole country faces another danger: severe heatwaves. Children, older people and people who work in the sun are most at risk.'],
      ['megla', 'Four kinds of disaster, but they have one big thing in common: we can often see all of them coming. And if we know early, we can act early.'],
      ['megla', 'Using a forecast to start acting before a disaster arrives is called anticipatory action. Let’s learn!']
    ]},
    {t: 'concept', icon: 'bolt', title: 'What is anticipatory action?',
      body: ['Anticipatory action means the things we do <b>before</b> a disaster strikes, guided by a forecast, to protect people, animals and property. It is also called <b>Early Action</b>.',
        'Cyclones, floods, landslides after heavy rain and heatwaves do not just fall out of the sky. The Bangladesh Meteorological Department (BMD) and the Flood Forecasting and Warning Centre (FFWC) can send warnings several days ahead. So instead of sitting and waiting, we can start acting early.'],
      note: ['tip', 'A mantra to remember: know early → understand early → act early.']},
    {t: 'widget', w: 'window', title: 'Window of Opportunity',
      intro: 'The time between getting a forecast and the disaster striking is the window of opportunity. Pick a disaster and drag the slider to see what can be done with the days you have left.'},
    {t: 'compare', title: 'Waiting vs. preparing',
      left: ['The old way: only "responding"', 'Relief and rescue after the disaster has happened. By then homes have been washed away, animals have died and families have taken loans at high interest. It also costs more.'],
      right: ['The new way: "anticipatory action"', 'Preparing as soon as the forecast arrives. Animals moved to high ground, food and water stored, people in shelters. Lives are saved, losses are smaller, and it costs less later.']},
    {t: 'real', hz: 'flood', title: 'True story: cash before the 2020 floods',
      body: 'In July 2020, based on the forecast, the Bangladesh Red Crescent Society gave 4,500 taka each to 3,789 families in flood-prone areas. The money arrived on 1–4 July, and the river peaked on 18 July, about two weeks later. Researchers then compared families who got the money with families who did not:',
      stats: [['9% vs 22%', 'lost animals'], ['44% vs 56%', 'had to borrow'], ['0% vs 12%', 'sold household items'], ['27% vs 11%', 'adults moved away in time']],
      foot: 'The first number is for families who got the money, the second for families who did not.', src: 0},
    {t: 'real', hz: 'cyclone', title: 'True story: how cyclone deaths came down',
      body: 'Cyclones still arrive with terrible force. Yet deaths have fallen a lot, because Bangladesh has become a world example for early warning. After the 1970 cyclone, the Cyclone Preparedness Programme (CPP) began in 1972. Today about 76,000 volunteers work in 13 coastal districts, and half of them are women. They spread the signals by loudspeaker, with flags and by going door to door.',
      stats: [['About 500,000', 'deaths in the 1970 cyclone'], ['138,958', 'deaths in the 1991 cyclone'], ['26', 'deaths in Cyclone Amphan, 2020'], ['800,000+', 'people evacuated before Remal, 2024']],
      foot: 'The number of shelters has also grown from 44 to more than 14,000.', src: [2, 3, 4]},
    {t: 'real', hz: 'landslide', title: 'True story: early warning in the hills',
      body: 'On 12–13 June 2017, about 343 millimetres of rain fell in just 24 hours in Rangamati, Chattogram and Bandarban. About 170 people died in landslides, more than a hundred in Rangamati alone. Learning from this, a rain-forecast-based landslide warning system was set up in Cox’s Bazar in 2021. Where people used to see the danger only a few hours ahead, warnings can now be given up to 5 days ahead. Satellite images were also used to mark 890 very high-risk places.',
      stats: [['343 mm', 'rain in 24 hours (2017)'], ['About 170', 'deaths (2017)'], ['5 days', 'of early warning with the new system'], ['890', 'high-risk places mapped']],
      src: [5, 7]},
    {t: 'real', hz: 'heatwave', title: 'True story: the record heatwave of 2024',
      body: 'In April 2024, Bangladesh had a heatwave for 26 days in a row. According to BMD, this was a first since records began in 1948. One day the temperature in Chuadanga reached 42.7°C. Seeing the forecast of severe to very severe heatwaves, the Bangladesh Red Crescent Society activated its heatwave Early Action Protocol in Dhaka. For about 124,000 vulnerable people it arranged drinking water, cooling rest centres, extra ambulances and advice on spotting dehydration.',
      stats: [['26 days', 'heatwave in a row (April 2024)'], ['42.7°C', 'one day’s temperature in Chuadanga'], ['124,000', 'people helped in advance (Dhaka)'], ['42°C+', 'very severe heatwave threshold']],
      foot: 'BMD’s scale: mild 36–37.9°C, moderate 38–39.9°C, severe 40–41.9°C, very severe 42°C or more.', src: [10, 11, 12]},
    {t: 'widget', w: 'pillars', title: 'The 3 pillars of anticipatory action',
      intro: 'For anticipatory action to work, three things must be decided in advance. Change the tabs above to see examples for the four disasters.'},
    {t: 'real', hz: 'flood', title: 'True story: early help for 400,000 people in 2024',
      body: 'On 7 July 2024, the forecast showed a big flood could hit the Jamuna basin in mid-July. As soon as the trigger was met, four UN agencies (FAO, UNICEF, UNFPA, WFP) began delivering help to about 400,000 people in 80,000 families in Kurigram, Gaibandha, Jamalpur, Bogura and Sirajganj before the flood arrived.',
      stats: [['USD 6.2 million', 'set aside in advance'], ['5 districts', 'Jamuna basin'], ['80,000', 'families'], ['Cash + more', 'water purification, animal feed, kits for girls and children']],
      src: 1},
    {t: 'hazards', title: 'Examples of good anticipatory action', intro: 'The same rule, four kinds of action for four disasters:',
      items: {
        cyclone: ['Bringing fishing boats back to shore as soon as the signal comes', 'Wrapping dry food, water and important papers in plastic', 'Taking older people, people with disabilities, pregnant women and children to shelters first', 'Moving cattle and goats to an earthen mound (killa) or high ground'],
        flood: ['Harvesting ripe rice early and bringing it home', 'Moving animals, poultry and food to a raised platform or embankment', 'Storing clean water and water purification tablets', 'Getting boats and rafts ready, and not letting children go near the water alone'],
        landslide: ['Leaving homes on slopes and at the foot of hills for a shelter as soon as a heavy-rain warning comes', 'Keeping drains near the house clear so water does not soak and soften the soil', 'Telling everyone if you see cracks in walls or ground, or trees leaning over', 'Deciding before bedtime where everyone in the family will go'],
        heatwave: ['Moving school sports and assemblies to the morning as soon as a heatwave warning comes', 'Keeping oral saline and clean water close at hand', 'Arranging shade and water for day labourers, rickshaw pullers and farmers', 'Checking on older people living alone, small children and sick neighbours']
      }},
    {t: 'check', q: {type: 'choice', style: 'tf', text: 'True or false: "Anticipatory action means giving relief quickly after a disaster is over."', options: [['True', 'No! Work after a disaster is called response or relief.'], ['False', 'Right! Anticipatory action happens before a disaster, based on a forecast.']], answer: 1}},
    {t: 'think', id: 'c1_tonight', title: 'Think about it', prompt: 'Imagine a disaster will hit your area tomorrow (a cyclone, flood, landslide or heatwave, whichever happens most where you live). What three things would you do tonight, and why?',
      model: ['Telling everyone in the family and deciding where to go', 'Putting dry food, water, medicine and important papers in one bag', 'Arranging for older, young or disabled family members to move first', 'Moving animals and important things to a safe place']}
  ],
  quiz: [
    {lvl: 0, type: 'choice', style: 'tf', text: '"In anticipatory action, work starts before the disaster strikes, based on a forecast."', options: [['True', 'Exactly. Forecast → early action → less damage.'], ['False', 'Acting before the disaster is the whole point of anticipatory action.']], answer: 0},
    {lvl: 0, type: 'choice', style: 'mcq', text: 'What does the "window of opportunity" mean?', options: [['The time from getting a forecast until the disaster strikes', 'Right! Acting wisely in this time is how damage is prevented.'], ['The time for giving out relief after the disaster', 'That is the response time, not anticipatory action.'], ['The whole four months of the monsoon', 'The window is linked to a specific forecast, not the whole season.']], answer: 0},
    {lvl: 0, type: 'match', text: 'Where does the early warning for each disaster usually come from? Match the pairs.', left: ['Flood', 'Cyclone', 'Landslide', 'Heatwave'], right: ['FFWC’s forecast of river water levels', 'BMD’s maritime port signals', 'Very heavy rain forecasts and rain-based warnings', 'BMD’s temperature forecasts and heatwave warnings'], answer: [0, 1, 2, 3]},
    {lvl: 0, type: 'choice', style: 'tf', text: '"About half of CPP’s roughly 76,000 volunteers are women."', options: [['True', 'Right! Women volunteers play a special role in reaching women, children and older people with warnings.'], ['False', 'It is actually true. CPP has almost equal numbers of women and men volunteers.']], answer: 0},
    {lvl: 1, type: 'match', text: 'Match the 3 pillars of anticipatory action with an example.', left: ['Trigger', 'Plan', 'Finance'], right: ['FFWC says the Jamuna will cross the danger level within 3 days, so work begins', 'A written list of who will move the older people from which house', 'Money set aside in advance to spend before the disaster'], answer: [0, 1, 2]},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'Two weeks before a flood, Mitu’s family got 4,500 taka as anticipatory help. Which spending is most like "anticipatory action"?', options: [['Buying animal feed and dry food and keeping them on high ground, and buying water purification tablets', 'Best answer. Animals survive, food does not run out and illness goes down. The 2020 research showed exactly this.'], ['Saving the money until the flood is over', 'Not a bad thought, but then the chance to prevent damage is lost. The power of early money is spending it early to reduce losses.'], ['Buying new clothes for Eid', 'Fun, but it will not reduce the flood damage at all.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'report', text: 'In the 2020 research, 9% of families who got early money lost animals, compared with 22% of families who did not. What is the most reasonable conclusion from this data?', options: [['Getting money early let families move or feed their animals safely', 'Right. Researchers saw this difference by comparing two groups in the same flood.'], ['There was no flood where the families who got money lived', 'Both groups faced the same flood, so this argument does not hold.'], ['Families sold their animals after getting the money', 'The research actually found that selling belongings fell from 12% to 0% in families who got money.']], answer: 0},
    {lvl: 1, type: 'seq', text: 'In what order does anticipatory action for a flood happen? Put the steps in order.', items: ['FFWC forecasts the water will cross the danger level', 'The trigger agreed in advance is met', 'Money and help reach families as planned', 'Families move animals, food and people to safety', 'The river peaks, but the damage is smaller'], answer: [0, 1, 2, 3, 4]},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'About 500,000 people died in the 1970 cyclone, and 26 in Cyclone Amphan in 2020. What is the biggest reason deaths fell so much?', options: [['Early warnings, CPP volunteers, shelters and moving people in time', 'Right! We cannot stop a storm, but we can move people to safety early.'], ['Cyclones are much weaker these days', 'No. Amphan was a super cyclone. With climate change, storms may even get stronger.'], ['Nobody lives on the coast now', 'Tens of millions of people still live on the coast. Moving them in time is the real success.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'Very heavy rain is forecast for the next three days in the hills of Chattogram. Usha’s elderly neighbour says, "I’ve lived here 20 years and nothing has happened. I’m not going anywhere." What should Usha do?', options: [['Respectfully remind him of what happened in 2017, and tell the local volunteer or ward member so they can help persuade him to go to the shelter', 'Best answer. Nothing happening in the past does not mean nothing will happen. Getting help from someone people trust makes persuading easier.'], ['It is not right to argue with elders, so stay quiet', 'Staying quiet leaves a life at risk. Sharing information politely is not disrespectful.'], ['Leave with her own family and say nothing more to him', 'Getting yourself safe matters, but warning neighbours is also the job of a MET Club member.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'The forecast says there is a 60% chance of a flood in 5 days. Someone says, "Doing anything before we are sure is a waste of money." Which thinking is the wisest?', options: [['Start the cheap but useful steps now (like packing food and water, planning where animals will go), and decide on bigger steps after the next forecast', 'Excellent! These are called "no-regret" actions. There is no harm if the flood does not come, and a big gain if it does.'], ['Do nothing until we are 100% sure', 'A forecast is never 100% certain. While you wait, the window of opportunity closes.'], ['Sell everything and move to the city', 'That is an overreaction. It causes big losses even if the flood never comes.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'mcq', text: 'In May 2024, how many people were moved to shelters before Cyclone Remal struck?', options: [['About 80,000', 'The real number is more than ten times this.'], ['More than 800,000', 'Right! Moving so many people in time is thanks to early warning.'], ['Only a few hundred', 'No, hundreds of thousands of people were moved all along the coast.']], answer: 1},
    {lvl: 2, type: 'open', id: 'q1_leader', text: '"If I were the team leader…" A disaster (cyclone, flood, landslide or heatwave) will hit your area in 3 days, and you lead the youth team. Who will you give which job? Write at least three jobs.',
      model: ['Spreading the news: loudspeaker announcements, going door to door to explain the signals', 'Listing older people, people with disabilities, pregnant women and children and moving them first', 'Helping move animals and food to safety', 'Making sure there is a safe space for women and girls in the shelter', 'Giving one person in each team the job of keeping in touch with the volunteers or the union council']}
  ]
},
/* ======================= CHAPTER 2 ======================= */
{
  id: 2, color: 'ochre', title: 'Information for watching risk', sub: 'What information do we need to make good decisions: hazard, vulnerability and exposure.',
  cards: [
    {t: 'story', scene: 'coast', lines: [
      ['rafi', 'Apa, in the last storm the tin roof of our house blew off, but Majid Uncle’s brick house next door was completely fine. It was the same storm!'],
      ['megla', 'Great question, Rafi! The storm was the same, but the risk was different. Knowing "a storm is coming" is not enough. We need to know whom the storm will hurt, and how badly.'],
      ['mitu', 'It’s the same on our char. Water gets into the houses on low ground first.'],
      ['usha', 'And in the hills, the people who built right at the bottom of the slopes are in the most danger if there’s a landslide.'],
      ['megla', 'All three of you have actually just said the risk formula. Let’s learn it!']
    ]},
    {t: 'formula'},
    {t: 'hazards', title: 'Three parts, four disasters', intro: 'The same formula helps us understand the risk of all four disasters:', table: true,
      items: {
        cyclone: ['Hazard: the strong winds and storm surge of a cyclone', 'Vulnerability: tin or mud houses, not knowing how to swim, members with disabilities or older members', 'Exposure: homes outside the embankment or right by the open coast, fishing boats at sea'],
        flood: ['Hazard: river water crossing the danger level', 'Vulnerability: no raised platform, no food stored, day-labourer families, tube wells on low ground', 'Exposure: homes on low ground on the char, houses and fields on the riverbank'],
        landslide: ['Hazard: very heavy rain for days', 'Vulnerability: mud walls, houses built by cutting hills, warnings not given in people’s own language', 'Exposure: homes, roads and schools on steep slopes or at the foot of hills'],
        heatwave: ['Hazard: 40°C or more for several days in a row', 'Vulnerability: older people, small children, pregnant women, people with long-term illness, tin-roofed homes', 'Exposure: farmers, day labourers and rickshaw pullers working in the sun in open fields or on roads; hot classrooms']
      }},
    {t: 'widget', w: 'formula', title: 'The risk meter', intro: 'Move the three sliders to see how risk goes up and down. You can also tap the examples of friends’ houses.'},
    {t: 'concept', icon: 'bulb', title: 'In simple words', body: ['If a strong cyclone dies out over an empty char or the deep sea, nobody is harmed. But if the same storm reaches a village of mud houses outside the embankment, then it becomes a <b>disaster</b>.', 'We cannot stop the hazard (storms, rain, river water). But we can reduce <b>vulnerability</b> by making homes stronger and reduce <b>exposure</b> by moving to safe places. This is where young people like you have a big role.']},
    {t: 'real', hz: 'landslide', title: 'True story: Chattogram 2007 and Rangamati 2017',
      body: 'On 11 June 2007, after heavy rain for days in Chattogram city, landslides killed at least 128 people, many of them children. Experts said careless hill cutting was a big cause. Most of the victims lived in slums at the foot of the hills. Rangamati in 2017 showed the same picture: heavy rain (hazard) + homes on slopes (exposure) + hill cutting and weak houses (vulnerability).',
      stats: [['128+', 'deaths in Chattogram, 2007'], ['About 170', 'deaths in three hill districts, 2017']],
      foot: 'Lesson: rain only starts the landslide, but vulnerability and exposure decide how many people die.', src: [6, 5]},
    {t: 'datalists', title: 'What information do we need?', intro: 'To measure risk properly we need three kinds of information. The better and more up to date the information, the more useful the forecast.',
      groups: [
        ['Hazard information', ['When and where did floods, storms or landslides happen in past years?', 'How high did the water rise? How fast was the wind? How many millimetres of rain, or how many degrees?', 'What are BMD and FFWC forecasting now?']],
        ['Vulnerability information', ['Is the house brick, semi-brick or mud?', 'Is anyone in the family older, a child, pregnant, disabled or ill?', 'What is the source of income? Do they have the language and means to understand a warning?']],
        ['Exposure information', ['Which homes, schools and clinics are on the riverbank, the coast or a hill slope?', 'How many animals and how much farmland are at risk?', 'Where are the roads, bridges, shelters and power lines?']]
      ]},
    {t: 'concept', icon: 'map', title: 'Where can we find information?', list: ['Bangladesh Meteorological Department (BMD): cyclone signals, heavy rain warnings', 'Flood Forecasting and Warning Centre (FFWC): 5-day river water forecasts', 'Call 1090: early disaster messages (toll-free)', 'Department of Disaster Management (DDM) and the Union Disaster Management Committee', 'CPP and Red Crescent volunteers', 'You and the people in your area, especially older people who remember past disasters (more in Chapter 4)'],
      note: ['warn', 'Careful: vulnerability and exposure change over time. Rivers erode land, new houses go up, new babies are born. Official data like the census is usually updated only every 10 years, so it is important to keep local information up to date.']},
    {t: 'widget', w: 'cascade', title: 'One hazard → many losses', intro: 'One hazard can set off one loss after another. These are called cascading impacts. Change the tabs to see the chain of losses for the four disasters.'},
    {t: 'check', q: {type: 'choice', style: 'tf', text: 'Quick quiz: If a strong cyclone dies out over the empty deep sea, is it a disaster?', options: [['Yes', 'No, because nobody and nothing is in its path (exposed).'], ['No', 'Right! Without exposure, a hazard does not turn into a disaster.']], answer: 1}},
    {t: 'think', id: 'c2_formula', title: 'The risk formula for your area', prompt: 'Pick one hazard in your area. Write what the hazard is, who or what is most vulnerable, and who is exposed to it. Which of these could young people reduce together?',
      model: ['Hazard: written specifically (for example, the Jamuna rising in the monsoon)', 'Vulnerability: for example mud houses, family members with disabilities, no food stored', 'Exposure: for example homes and schools on the riverbank or on slopes', 'What young people can reduce: awareness, lists of vulnerable families, plans to move people early']}
  ],
  quiz: [
    {lvl: 0, type: 'choice', style: 'mcq', text: 'How many parts does the risk formula have?', options: [['2', 'One is missing!'], ['3', 'Right! Hazard × vulnerability × exposure.'], ['4', 'That is one too many.']], answer: 1},
    {lvl: 0, type: 'sort', text: 'Which part of risk does each card belong to? Put it in the right box.', items: ['Very heavy rain for days', 'A house at the foot of a hill', 'A house with mud walls', 'Homes on low ground on a char', 'Nobody in the family can swim', 'A cyclone with great danger signal no. 10', '42°C for several days in a row', 'A day labourer working all day in an open field in the sun'], buckets: ['Hazard', 'Vulnerability', 'Exposure'], answer: [0, 2, 1, 2, 1, 0, 0, 2]},
    {lvl: 0, type: 'choice', style: 'tf', text: '"If a strong storm hits an island where nobody lives, it is not a disaster."', options: [['True', 'Right. Nobody is exposed, so there is no damage.'], ['False', 'It is actually true. For a disaster, people or property must be in the hazard’s path.']], answer: 0},
    {lvl: 0, type: 'choice', style: 'hotspot', text: 'If the same cyclone comes, which house is at the highest risk?', options: [['A mud house on the riverbank, outside the embankment', 'Right! A mud house (high vulnerability) on low ground outside the embankment (high exposure).'], ['A brick house on high ground inside the embankment', 'This house has the lowest risk. Both parts are low here.'], ['A tin house on high ground inside the embankment', 'Medium risk. High ground lowers exposure, but a tin roof can blow away.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'In 2017, 343 mm of rain fell in 24 hours in Rangamati. Apart from the rain, what was the biggest reason so many people died?', options: [['Weak houses built on steep slopes and at the foot of cut hills', 'Right. The rain started the landslides, but homes on slopes (exposure) and weak houses (vulnerability) raised the death toll.'], ['Too many trees on the hills', 'The opposite! Tree roots hold the soil. Cutting trees raises landslide risk.'], ['The wind was strong that day', 'The main cause of landslides is soil soaked and softened by rain, not wind.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'mcq', text: 'Which parts of risk can people reduce most easily themselves?', options: [['Hazard', 'Stopping rain, storms or river water is not in our hands.'], ['Vulnerability and exposure', 'Right! Strengthening homes, moving early, keeping animals safe: these are in our hands.'], ['None of them can be reduced', 'No need to lose hope! We can reduce two of the parts a lot.']], answer: 1},
    {lvl: 1, type: 'seq', text: 'Put the chain of cascading flood losses in order.', items: ['River water enters the char', 'Tube wells on low ground go under water', 'People have to drink dirty water', 'Diarrhoea and waterborne diseases spread'], answer: [0, 1, 2, 3]},
    {lvl: 1, type: 'match', text: 'Where is each piece of information easiest to find? Match the pairs.', left: ['How high the river will rise in the next 5 days', 'Which signal number is up at the sea ports', 'How high the water rose in the neighbourhood in a flood 30 years ago'], right: ['FFWC’s forecast', 'BMD and CPP', 'Older people in the area'], answer: [0, 1, 2]},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'The same flood forecast has come. Which family would it be fairest to give anticipatory help to first?', options: [['A mud house on low ground on the char, where a mother lives alone with two children and a grandmother with a disability', 'Right. Both exposure and vulnerability are highest here. Anticipatory help should go first to the families most at risk.'], ['A brick house by a raised road, where the father has a government job', 'This family’s risk is fairly low. They can prepare on their own.'], ['The family that came first to sign up at the union council', 'Coming first does not mean higher risk. The people most at risk often do not even hear the news.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'report', text: 'Months after a cyclone’s storm surge has gone, people in Kalapara are still suffering. Which "cascading impact" causes this?', options: [['Salt water makes land and ponds salty, causing a shortage of crops, fish and drinking water', 'Right. The salt from a storm surge stays for a long time, so the damage goes on.'], ['The sky is clearer after a storm', 'A clear sky does not cause damage.'], ['More fish are caught', 'The opposite. Boats and nets are damaged, and fish are washed out of ponds.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'The union council’s list of vulnerable families was made in 2019. What could go wrong if it is used after the big flood of 2024?', options: [['River erosion has made many people move, babies have been born and some houses have collapsed, so help may go to the wrong places', 'Right. Vulnerability and exposure change, so information must be updated regularly.'], ['Nothing; making the list once is enough', 'On a char, a lot changes in five years.'], ['Only the paper of the list gets old', 'The real problem is not the paper but the information going out of date.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'mcq', text: 'In hilly areas, which of these actions reduces vulnerability to landslides?', options: [['Planting trees on slopes, keeping drains clear and spreading warnings in local and regional languages (such as Chatgaiya, Chakma, Marma)', 'Right! The soil stays firm, water does not collect, and everyone understands the message.'], ['Cutting the slope more to make room for a bigger house', 'This makes the slope even less stable and raises the risk.'], ['Giving warnings only in Bangla', 'If many people do not understand Bangla well, the message does not reach them.']], answer: 0},
    {lvl: 2, type: 'open', id: 'q2_why', text: 'Why do you think people knowingly live on low land on a char or on hill slopes? As a young person, what practical solution would you suggest?',
      model: ['Reasons: poverty, no safe land, needing to live near work or fields, not wanting to leave the family’s ancestral home', 'Solution: making a list and map of vulnerable families and giving it to the union council', 'A family plan for where to go as soon as a warning comes', 'Telling the authorities about hill cutting or land grabbing on riverbanks', 'There is no single "right" answer here. What matters is writing your own view with reasons.']}
  ]
},
/* ======================= CHAPTER 3 ======================= */
{
  id: 3, color: 'red', title: 'Impact-based forecasting', sub: 'Not "what the weather will be" but "what the weather will do": understanding colour signals.',
  cards: [
    {t: 'story', scene: 'char', lines: [
      ['mitu', 'Apa, the radio said "heavy rain in the next 3 days, the river may flow above the danger level." My father heard it, but he couldn’t tell whether water would come into our house.'],
      ['megla', 'That’s the problem with the old kind of forecast, Mitu. It tells us what the weather will be. But your father needs to know what the weather will do: how much water will come into the house, and what to do now.'],
      ['rafi', 'It’s the same on our coast. When people hear "winds of 120 km per hour", many don’t realise the storm surge could wash away the houses outside the embankment.'],
      ['megla', 'A forecast that clearly says the impact and what to do is called impact-based forecasting. This small difference saves lives!']
    ]},
    {t: 'concept', icon: 'flask', title: 'How is an impact-based forecast made?', equation: ['Weather forecast', 'Risk information', 'Impact-based forecast'],
      body: ['The weather forecast tells us how big the hazard is (how much rain, how strong the wind, how high the water will rise). Risk information tells us who will be harmed (hazard × vulnerability × exposure from Chapter 2). Put the two together and we know where, to whom and what damage may happen, and what to do now.'],
      note: ['tip', 'Interesting fact: far ahead, a forecast may show a "low chance" over a large area. As the disaster comes closer, the forecast can pinpoint a "higher chance and bigger damage" in a smaller area.']},
    {t: 'hazards', title: 'Old message vs. impact-based message', intro: 'The same news, told two ways. Which one tells you right away what to do?', ibf: true,
      items: {
        cyclone: ['Old: "The cyclone may cross the coast at 90–120 km per hour."', 'Impact-based: "In Kalapara, mud houses outside the embankment may be washed away by the storm surge. Go to a shelter by this evening with older people, children and pregnant women."'],
        flood: ['Old: "The Jamuna may flow above the danger level in the next 3 days."', 'Impact-based: "In the next 3 days, water may rise to waist height on low ground on the Fulchhari chars and tube wells may go under. Move animals and dry food to high ground today and store clean water."'],
        landslide: ['Old: "Very heavy rain may fall in Chattogram division in 24 hours."', 'Impact-based: "High landslide risk for homes on hill slopes and at the foot of hills in Chattogram city. Go to a shelter before evening. If you see cracks in walls or the ground moving, get out at once."'],
        heatwave: ['Old: "A severe heatwave is sweeping several districts, with highs of 40–41.9°C."', 'Impact-based: "For the next 3 days, the risk of heatstroke is high at midday in tin-roofed classrooms and open fields. Stop sports from 11 am to 3 pm, give students water and oral saline, and keep older people in the coolest part of the house."']
      }},
    {t: 'widget', w: 'matrix', title: 'Colour signals: see the danger at a glance', intro: 'Impact-based forecasting uses a colour chart (risk matrix). One side shows likelihood (how sure), the other shows impact (how much damage). Tap any box to see the colour and what to do.'},
    {t: 'widget', w: 'coloractions', title: 'What do we do for each colour?', intro: 'Each colour has actions agreed in advance, so work can start as soon as the colour is seen. Change the disaster to see.'},
    {t: 'widget', w: 'signals', title: 'Bangladesh’s cyclone signals', intro: 'BMD gives signals from 1 to 11 for the sea ports. The bigger the number, the bigger the danger. Tap each signal to see.'},
    {t: 'concept', icon: 'bell', title: 'How do flood, landslide and heatwave warnings arrive?', list: ['Floods: FFWC reports water levels and danger levels at river stations every day, with set forecasts up to 5 days ahead and probability-based forecasts up to 10 days ahead (ffwc.gov.bd).', 'News by phone: call 1090 toll-free to hear early disaster messages.', 'Landslides: BMD issues landslide warnings for hilly areas during very heavy rain. Local authorities make loudspeaker announcements asking people to leave risky slopes.', 'Heatwaves: BMD’s daily forecast says which districts have, or may have, a mild (36–37.9°C), moderate (38–39.9°C), severe (40–41.9°C) or very severe (42°C or more) heatwave.', 'Signs in nature: new cracks in the hills, trees or poles leaning over, muddy water suddenly coming out of a slope, the sound of earth moving. If you see these, move away without waiting for a signal.']},
    {t: 'check', q: {type: 'choice', style: 'mcq', text: 'Quick quiz: "100 mm of rain will fall in 24 hours." What kind of forecast is this?', options: [['Old (what the weather will be)', 'Right! It says nothing about impact or what to do.'], ['Impact-based (what the weather will do)', 'No, it does not say who will be harmed or what to do.']], answer: 0}},
    {t: 'think', id: 'c3_msg', title: 'You are a weather reporter', prompt: 'Pick a weather news item for your area (like "very heavy rain tomorrow"). Rewrite it as an impact-based message that your school friends would understand right away and know what to do.',
      model: ['Where: the exact name of a village, char, neighbourhood or school', 'Whose loss: which homes, schools, crops or animals', 'What damage: how high the water will rise, houses breaking, roads closing', 'When: within how many hours or days', 'What to do: one or two clear actions (like go to the shelter by this evening)']}
  ],
  quiz: [
    {lvl: 0, type: 'choice', style: 'mcq', text: '"100–150 mm of rain will fall in the next 3 hours." What kind of forecast is this?', options: [['An old forecast (what the weather will be)', 'Right. The number is there, but not what to do.'], ['An impact-based forecast (what the weather will do)', 'No. An impact-based message says who will be harmed and what to do.']], answer: 0},
    {lvl: 0, type: 'choice', style: 'mcq', text: 'In colour signals, which colour means the greatest danger?', options: [['Green', 'Green means not much danger.'], ['Yellow', 'Yellow means be alert and start preparing.'], ['Orange', 'Orange means take anticipatory action now. But there is a colour for even greater danger.'], ['Red', 'Right! Red means danger, go to a safe shelter.']], answer: 3},
    {lvl: 0, type: 'choice', style: 'mcq', text: 'Which are the "great danger signals" for sea ports in Bangladesh?', options: [['Numbers 1–3', 'These are distant cautionary signals.'], ['Numbers 5–7', 'These are danger signals, not great danger.'], ['Numbers 8–10', 'Right! 8, 9 or 10 means a severe cyclone will strike.'], ['Number 11', '11 means contact with the weather centre has been lost.']], answer: 2},
    {lvl: 0, type: 'choice', style: 'mcq', text: 'CPP volunteers raise red-and-black flags. What do 3 flags mean?', options: [['Stay alert', '1 flag means alert.'], ['Danger', '2 flags mean danger.'], ['Great danger', 'Right! 3 flags mean great danger: go to a shelter now.']], answer: 2},
    {lvl: 0, type: 'choice', style: 'mcq', text: 'On BMD’s scale, what top temperature means a "very severe heatwave"?', options: [['36–37.9°C', 'This is a mild heatwave.'], ['40–41.9°C', 'This is a severe heatwave. Very severe is even hotter.'], ['42°C or more', 'Right! Then the risk of heatstroke is highest, and going out in the midday sun must be avoided.']], answer: 2},
    {lvl: 1, type: 'choice', style: 'report', text: 'Which of these messages is the best impact-based forecast?', options: [['"In the next 3 days, waist-deep water may rise on low ground on the Fulchhari chars. Move animals and dry food to high ground today."', 'Right! It has where, what damage, when and what to do.'], ['"The Jamuna may keep rising."', 'It says nothing about who will be harmed or what to do.'], ['"The flood situation in the north of the country may get worse."', 'The area is very large and vague. It gives no action either.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'matrix', text: 'The forecast says the likelihood of damage is "high" and the possible impact is "very high". Which colour will the chart show?', options: [['Yellow', 'Think a little more. Both likelihood and impact are high.'], ['Orange', 'Close, but because the impact is "very high" the colour is darker.'], ['Red', 'Right! The box where the two lines meet is red. The most urgent situation.']], answer: 2},
    {lvl: 1, type: 'match', text: 'Match each signal with its correct meaning.', left: ['Numbers 1–3', 'Number 4', 'Numbers 5–7', 'Number 11'], right: ['A storm may form far away; keep listening to the news', 'The port is in the storm’s path; get prepared', 'A moderate storm may strike; take anticipatory action', 'Contact with the weather centre has been lost'], answer: [0, 1, 2, 3]},
    {lvl: 1, type: 'choice', style: 'mcq', text: 'Which number can you call toll-free to hear river water information?', options: [['999', '999 is the emergency number for police, fire service and ambulance.'], ['1090', 'Right! On 1090 you can hear early disaster messages and river information.'], ['109', '109 is the helpline for preventing violence against women and children.']], answer: 1},
    {lvl: 2, type: 'choice', style: 'matrix', text: 'The forecast says the likelihood of damage is "very low", but if it happens the impact will be "very high". The chart shows yellow. Why not green?', options: [['Because if damage happens it will be terrible, so even with a low likelihood we should stay alert and start preparing', 'Excellent thinking! The colour is set by likelihood and impact together.'], ['Because the weather office made a mistake', 'It is not a mistake; the chart is made this way on purpose.'], ['Because yellow looks nice', 'Colours are chosen by the level of danger, not by looks.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'In the afternoon, great danger signal no. 8 is up in Kalapara, but the sky has suddenly gone calm and clear. Rafi’s uncle says, "The storm has passed, let’s go and check the boat." What should Rafi say?', options: [['"We can’t go out until the signal is lowered. It goes calm like this while the eye of the storm passes, then even stronger winds come from the other side."', 'Right! Decide by the official signal, not by looking at the sky.'], ['"Okay, we’ll come back quickly."', 'Very dangerous! Once the eye passes, strong winds and a storm surge can come again.'], ['"I’ll go alone, you stay."', 'It is not safe for anyone to go, not even you alone.']], answer: 0},
    {lvl: 2, type: 'match', text: 'Match each situation with the right colour on the chart.', left: ['The river may cross the danger level in 5 days: low likelihood, high damage', 'Very heavy rain in the hills tomorrow: high likelihood, high damage to homes on slopes', 'A storm surge within 24 hours: very high likelihood, very high damage'], right: ['Yellow', 'Orange', 'Red'], answer: [0, 1, 2]},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'At night a very heavy rain warning is in force for the hills of Chattogram. Usha’s house is at the bottom of a slope, and she sees a new crack in the wall and muddy water running down the slope behind. What is the most correct thing to do?', options: [['Go to a safe shelter with the family right now and call out to neighbours on the way', 'Right! These are clear signs of a landslide. There is no time to wait.'], ['Look at the crack properly in the morning', 'Landslides can happen at night. When the signs appear, do not wait.'], ['Fill the crack with mud', 'This does not reduce the danger. The earth behind is still moving.']], answer: 0},
    {lvl: 2, type: 'open', id: 'q3_msg', text: 'Write an impact-based warning for your area (for any one disaster). The message must include: where, who will lose what, when, and what to do.',
      model: ['The exact name of the place (village, char, neighbourhood)', 'Who or what will be harmed (mud houses, homes on slopes, animals, tube wells)', 'The time (tonight, the next 24 hours, 3 days)', 'One or two clear actions', 'Simple language that children and older people can understand too']}
  ]
},
/* ======================= CHAPTER 4 ======================= */
{
  id: 4, color: 'green', title: 'You are the scientist (Citizen Science)', sub: 'How collecting information about your own neighbourhood makes forecasts more accurate.',
  cards: [
    {t: 'story', scene: 'hill', lines: [
      ['usha', 'Apa, we cut a plastic bottle and made a rain gauge on our school roof! We write down the reading every morning.'],
      ['megla', 'Brilliant, Usha! BMD sees the big picture with satellites and radar. But they don’t always know the small details, like which slope in your neighbourhood has a crack or which house is made of mud.'],
      ['rafi', 'Our CPP team filled in data cards for 30 houses in our neighbourhood. Now we know which houses to go to first during a storm.'],
      ['mitu', 'On our char, the mark from the last flood is still on the walls of the houses. That’s information too!'],
      ['megla', 'Exactly! Science collected by ordinary people like this is called Citizen Science. Today you are all scientists!']
    ]},
    {t: 'concept', icon: 'sat', title: 'Big picture + small details = accurate forecast', equation: ['Big picture (satellite, radar, instruments)', 'Small details (you and your neighbourhood)', 'Accurate forecast'],
      body: ['The weather office knows how much rain will fall where. You know what that rain does in your neighbourhood: which road floods first, which house has a cracked wall. When the two come together, impact-based forecasts become truly useful.']},
    {t: 'hazards', title: 'What information can you collect?', intro: 'Four kinds of information for four disasters:',
      items: {
        cyclone: ['Which houses are mud or tin, and which are outside the embankment', 'How many minutes’ walk it is to the nearest shelter', 'Which homes have someone who cannot walk on their own', 'The number of animals and where the earthen mound (killa) is'],
        flood: ['The mark of the last flood on house walls or trees (knee, waist, higher)', 'Whether the tube well has been raised', 'Whether the household has a boat or raft', 'Which road floods first, and which high ground can hold animals'],
        landslide: ['Daily rain readings from a home-made rain gauge', 'New cracks in slopes or walls, trees leaning over', 'Which houses are right below a steep slope', 'Which way rainwater runs down, and whether drains are blocked'],
        heatwave: ['Writing down the midday temperature on a school thermometer every day', 'Which homes or classrooms have tin roofs, and where there is shade or trees', 'Where the nearest safe drinking water is', 'Who in the neighbourhood works in the sun, and which older people live alone']
      }},
    {t: 'widget', w: 'datacard', title: 'My home data card', intro: 'Fill in your home’s information with help from an adult. The card will show a risk colour and what to do. (This is a simple calculation for learning, not a real survey.)'},
    {t: 'concept', icon: 'shield', title: 'Remember the rules: collect information safely and respectfully', list: ['Never go alone to an unfamiliar place to collect information. Always take a teacher or another adult with you.', 'Do not take or share anyone’s name, photo or personal details without their permission.', 'Never post photos or names of children or people with disabilities on social media.', 'Show respect to everyone. If someone does not want to answer, do not push them.', 'Write exactly what you saw or heard, not what you guess.'],
      note: ['warn', 'If anyone says or does something that makes you uncomfortable while you are collecting information, tell a teacher or parent right away.']},
    {t: 'widget', w: 'journey', title: 'How does your information save lives?', intro: 'See step by step how a small data card turns into anticipatory action.'},
    {t: 'concept', icon: 'rocket', title: 'How MET Club will work: 3 steps', steps: [['Start with your own home', 'First, MET Club members practise by filling in the data card for their own homes.'], ['Train your friends', 'Then they teach other students at school the rules for collecting information.'], ['Collect and upload', 'Together they collect information from many homes in the area and upload it to the platform.']],
      note: ['tip', 'From small to big: one member starts with one home → the whole club → the whole school → the whole area. This is how a reliable database is built.']},
    {t: 'check', q: {type: 'choice', style: 'mcq', text: 'Quick quiz: How is the mark from the last flood on the wall of Mitu’s house useful?', options: [['To know how high the water rose in the last flood', 'Right! It is valuable information about the flood hazard and exposure in that place.'], ['To decide when to paint the wall', 'A fun answer, but the mark is really scientific information!']], answer: 0}},
    {t: 'think', id: 'c4_project', title: 'Your little science project', prompt: 'Plan a small Citizen Science project in your area. What information will you collect, with whom, how will you stay safe, and whom will you give the information to?',
      model: ['One specific piece of information (for example, the house type and last flood level for 30 homes)', 'Team: friends and a teacher or volunteer', 'Rules for safety and permission', 'Who gets the information: the Union Disaster Management Committee, CPP, the MET Club platform']}
  ],
  quiz: [
    {lvl: 0, type: 'choice', style: 'mcq', text: 'What does Citizen Science mean?', options: [['Scientific information collected by ordinary people', 'Right! You, your friends, your neighbourhood: everyone can be a scientist.'], ['Only research in scientists’ labs', 'No, here ordinary people collect the information.'], ['A science club for people in cities', 'Citizen means any member of the public, in cities and villages alike.']], answer: 0},
    {lvl: 0, type: 'sort', text: 'What kind of information is each item on the data card? Put it in the right box.', items: ['Whether the house is brick or mud', 'How far the house is from the river', 'Whether a family member has a disability', 'Whether the house is right below a hill slope'], buckets: ['Vulnerability information', 'Exposure information'], answer: [0, 1, 0, 1]},
    {lvl: 0, type: 'choice', style: 'tf', text: '"It is fine to go alone to unfamiliar houses to collect information."', options: [['True', 'No! Always take a teacher or another adult with you.'], ['False', 'Right. Safety comes first.']], answer: 1},
    {lvl: 1, type: 'seq', text: 'Put the steps from information to saving lives in order.', items: ['You collect information about homes', 'The information is put together into a risk map', 'The map is matched with the weather forecast', 'Colour signals and where help is needed first are decided', 'Help reaches the right homes at the right time'], answer: [0, 1, 2, 3, 4]},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'To finish quickly, one of your friends filled in 10 data cards at home by guessing. What is the biggest problem with this?', options: [['Because of wrong information, help may not reach the people who need it most', 'Right. Wrong information leads to wrong decisions. Honest, correct information saves lives.'], ['The cards will look messy', 'How they look does not matter; wrong information inside is the real danger.'], ['No problem, it saved time', 'It saved time, but someone’s life could be put at risk.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'You want to take a photo of a child with a disability next door and post it in the MET Club group, so everyone knows the child needs special help. What is the most correct thing to do?', options: [['Do not take a photo; with the parents’ permission, give only the needed information (a family member has a disability and will need help moving) to a teacher or volunteer', 'Right! Even with good intentions, protecting the child’s privacy and dignity is essential.'], ['Take the photo and post it, because the intention is good', 'Posting a child’s photo without permission can harm the child’s safety and dignity.'], ['Tell nobody anything', 'The information is important. The child must be moved early in a disaster, so it must be shared in a safe way.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'The rain gauge at Usha’s school measured 120 mm of rain in the last 24 hours, and it is still raining. What is the most useful thing to do with this information?', options: [['Tell a teacher, volunteer or the union council right away, and check it against BMD’s warnings', 'Right! Local readings plus the official forecast help people decide quickly.'], ['Post "A big landslide is coming!" on social media', 'Spreading panic without checking creates rumours. It must be shared through responsible people.'], ['Write it in a notebook and look at it at the end of the month', 'Keeping records is good, but at a risky time the information must be used now.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'Rafi’s data cards show that 5 homes outside the embankment have older people who cannot walk on their own. Signal no. 7 is now up. How should this information be used?', options: [['Volunteers go to these 5 homes first and take them to the shelter on a van or a stretcher', 'Right! The information tells us whom to help first.'], ['Wait until a great danger signal is given', 'People who take longer to move must be moved first. Waiting raises the risk.'], ['Keep the information for next year', 'The real value of information is now, at the time of danger.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'tf', text: '"The more correct and honest the information you give, the more accurate the forecast, and the more lives are saved."', options: [['True', 'Exactly! You really are a young weather scientist.'], ['False', 'It is actually true. Local information is what makes forecasts useful.']], answer: 0},
    {lvl: 2, type: 'open', id: 'q4_trust', text: 'Many families do not want to give their information to a stranger. How will you and your MET Club earn their trust?',
      model: ['Taking along people they know, like a teacher, imam, priest, karbari (hill village head) or union council member', 'Explaining in simple words why the information is needed and how it will be used', 'Promising to keep names and personal details private, and keeping that promise', 'Showing the maps or results made from the information back to the people of the area']}
  ]
},
/* ======================= CHAPTER 5: FINAL ======================= */
{
  id: 5, color: 'navy', title: 'Final mission: one year, four disasters', sub: 'Put everything you learned together to make decisions in real situations, then get your certificate.',
  cards: [
    {t: 'story', scene: 'call', lines: [
      ['megla', 'Congratulations! You have finished four chapters. Now for the final mission: four disasters in one year.'],
      ['megla', 'In April, a severe heatwave across the whole country.'],
      ['rafi', 'In May, a cyclone on our coast.'],
      ['mitu', 'In July, a flood on our char.'],
      ['usha', 'And at the end of the monsoon, days of rain in the hills and the risk of landslides.'],
      ['megla', 'In each situation you must think like a team leader and decide. Before you start, quickly revise the key words!']
    ]},
    {t: 'glossary', title: 'Key words', rows: [['Anticipatory action', 'Preparing before a disaster based on a forecast'], ['Impact-based forecast', 'Telling people "what the weather will do"'], ['Hazard', 'A harmful natural event (cyclone, flood, very heavy rain)'], ['Vulnerability', 'How easily harm happens'], ['Exposure', 'Who or what is in the hazard’s path'], ['Window of opportunity', 'The valuable time between a forecast and a disaster'], ['Trigger', 'A signal agreed in advance; work starts as soon as it is met'], ['Heatwave', 'A top temperature of 36°C or more for several days in a row'], ['No-regret action', 'An action that does no harm if the disaster does not come and helps a lot if it does'], ['Citizen Science', 'Scientific information collected by ordinary people']]},
    {t: 'concept', icon: 'trophy', title: 'Rules of the final mission', list: ['13 scored questions and 1 opinion question about real situations with cyclones, floods, landslides and heatwaves', 'In many questions more than one answer will seem reasonable. Choose the best one', 'You will see an explanation after each answer, so you learn even when you are wrong', 'If your average across all chapters is 80% or more, a certificate will be made in your name']}
  ],
  quiz: [
    {lvl: 0, type: 'choice', style: 'mcq', text: 'When is anticipatory action taken?', options: [['Before the disaster, based on a forecast', 'Right!'], ['During the disaster', 'By then it is far too late.'], ['After the disaster', 'That is relief or response.']], answer: 0},
    {lvl: 0, type: 'choice', style: 'fill', text: 'Risk = Hazard × ________ × Exposure', options: [['Vulnerability', 'Right! Remember the formula and any disaster becomes easier to understand.'], ['Forecast', 'A forecast helps us understand the hazard, but it is not part of the formula.'], ['Relief', 'Relief is work done after a disaster.']], answer: 0},
    {lvl: 0, type: 'choice', style: 'mcq', text: 'In Bangladesh, which signal number means great danger?', options: [['4', 'Number 4 means the port is in the storm’s path; get prepared.'], ['7', 'Number 7 is a danger signal, not great danger.'], ['10', 'Right! Numbers 8 to 10 are great danger signals.']], answer: 2},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'It is April. BMD says a severe heatwave (40–41.9°C) will last for the next 3 days in your district, and the school sports competition is at 12 noon. As a MET Club member, what is your best advice?', options: [['Tell the head teacher and suggest moving the sports to the morning or until after the heatwave eases, and arrange shade, water and oral saline at the ground', 'Right! Changing the time early based on the forecast and arranging water and shade is anticipatory action for a heatwave.'], ['Let the sports go ahead on time; everyone just needs to wear a cap', 'A cap helps a little, but running in the harsh midday sun carries a very high risk of heatstroke.'], ['Say nothing to anyone and just skip the sports yourself', 'You stay safe, but the other students are still at risk. Tell the authorities and find a solution for everyone.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'It is May. Danger signal no. 7 is up at Payra port. Rafi’s team has many homes on its list. Who should be taken to the shelter first?', options: [['People with disabilities, older people, pregnant women and small children', 'Right! They need more time and help to move, so they go first.'], ['The people who live closest', 'Living close makes it easier, but priority is set by risk.'], ['The people who want to take the most belongings', 'People’s lives come first, not belongings.']], answer: 0},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'Some women in Rafi’s neighbourhood do not want to go to the shelter. They say there is no separate space or toilet there, and it does not feel safe. What is the best solution?', options: [['Talk with them together with women volunteers, and tell the committee to make sure the shelter has separate spaces for women and girls and proper lighting', 'Excellent! When the cause of the problem is fixed, people are willing to take shelter safely.'], ['Take them by force', 'Force destroys trust. Their fears are real and must be solved.'], ['Let them do as they like', 'Then lives stay at risk. Finding a solution is our responsibility.']], answer: 0},
    {lvl: 1, type: 'seq', text: 'It is July. FFWC says a flood will hit the char in 5 days, and Mitu’s family has received anticipatory cash. Put the actions in time order (earliest first).', items: ['The whole family makes a plan and uses the early cash to buy animal feed and dry food', 'Harvesting the ripe rice, moving animals and food to high ground', 'Storing clean water, wrapping important papers in plastic', 'When the water starts rising, going to the shelter with grandmother and the children'], answer: [0, 1, 2, 3]},
    {lvl: 1, type: 'choice', style: 'scenario', text: 'In August 2024, sudden floods in the east, including Feni and Cumilla, affected more than 5.8 million people. Many said they had not realised so much water would come. What is the most useful lesson for the future?', options: [['For flash floods, impact-based warnings including news of rain upstream must reach villages quickly, and families must have plans ready in advance', 'Right! In flash floods the window of opportunity is small, so both messages and plans must be ready ahead of time.'], ['There will never be floods in the east again', 'With climate change, heavy rain like this may become more common.'], ['When a flood comes, just wait for relief', 'Relief is essential, but anticipatory action can reduce losses a lot.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'At the end of the monsoon it rains for three days in a row in the hills of Chattogram. Which of these is NOT a warning sign of a landslide?', options: [['New cracks appearing on the hill slope', 'This is a sign, so it is not the right answer.'], ['Muddy water suddenly coming out of the slope', 'This is a sign too. Water is collecting inside and the soil is moving.'], ['A rainbow appearing in the sky', 'Right! A rainbow is just light at play; it has nothing to do with landslides.'], ['Trees or electricity poles suddenly leaning over', 'This is a sign. The ground underneath is moving.']], answer: 2},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'A union is setting a trigger for floods. Which trigger is best?', options: [['"Start work when FFWC’s forecast shows the water at the nearest station may cross the danger level within 3–5 days"', 'Right! It is specific, measurable and leaves time to act.'], ['"Start work when it feels like a flood is coming"', 'Very vague. Feels like to whom? When? This causes late decisions and confusion.'], ['"Start work after water gets into the houses"', 'By then the window of opportunity is closed. That is not anticipatory action.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'Anticipatory action was taken based on a forecast, but the flood was much smaller than expected. Some people say, "Money and effort wasted!" What is your best reply?', options: [['"A forecast is never 100% certain. The no-regret actions we took were still useful. We will use this experience to improve the trigger, but we will not stop acting early."', 'Excellent! Admitting uncertainty, learning and improving is the way of science.'], ['"You’re right, I’ll never trust a forecast again."', 'Dropping the whole approach after one small flood will mean far bigger losses in the next big flood.'], ['"It’s the weather office’s fault; there’s nothing we can do."', 'Learning from experience is much more useful than looking for someone to blame.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'mcq', text: 'Which is the best example of Citizen Science?', options: [['MET Club members, with permission, fill in data cards for homes in their neighbourhood and submit them to the platform', 'Right! Safe, respectful and useful information collection.'], ['Looking at BMD’s satellite images', 'That is the big picture. Citizen Science is the small details collected by ordinary people.'], ['Sharing news heard on Facebook', 'Sharing unchecked news is not science; it can spread rumours.']], answer: 0},
    {lvl: 2, type: 'choice', style: 'scenario', text: 'From the experience of the four disasters, which statement is most true?', options: [['Even if hazards cannot be stopped, early warning, correct information and everyone taking part can reduce risk a lot', 'Exactly! This is the heart of anticipatory action. Know early, understand early, act early.'], ['Nothing can be done in a disaster; it must be left to fate', 'Bangladesh’s own experience with cyclones proves that preparation saves lives.'], ['Only the government will handle disasters; young people have no role', 'Many of CPP’s 76,000 volunteers are young. Your role is very big.']], answer: 0},
    {lvl: 2, type: 'open', id: 'q5_ambassador', text: 'As a MET Club ambassador, what three things will you do in the next month so that your family, school or area is better prepared before a disaster?',
      model: ['Sitting with the family to make an emergency plan and an emergency bag', 'Teaching friends at school the colour signals and cyclone signals', 'Filling in data cards for a few homes together with adults', 'Telling everyone about the local shelter, the 1090 number and safe routes']}
  ]
}
];

/* =====================================================================
   TEXT USED BY course-app.js: widgets, quiz, certificate and buttons.
   Same names and structure as the end of course-content.js.
   ===================================================================== */
const NUM_DIGITS = '0123456789';
const WINDOW = {
  cyclone: {note: 'BMD usually watches low-pressure areas and depressions at sea for several days and issues signals early.', s: {
    5: ['As soon as you hear about a low or depression, follow the news regularly on radio, TV and mobile', 'Getting ready to bring fishing boats back to shore', 'Starting to pack the emergency bag'],
    3: ['Storing dry food, water and medicine', 'Wrapping important papers in plastic', 'Walking the route to the nearest shelter', 'Tying down the roof and posts of the house firmly'],
    1: ['As soon as a danger signal (5–7) comes, taking older people, people with disabilities, pregnant women and children to the shelter', 'Moving cattle and goats to the earthen mound (killa)', 'When a great danger signal (8–10) comes, everyone goes to the shelter'],
    0: ['The storm has started! Going outside now is dangerous', 'Stay in the strongest room of the building you are in', 'Do not go out until the signal is lowered']}},
  flood: {note: 'FFWC gives set flood forecasts up to 5 days ahead and probability-based forecasts up to 10 days ahead.', s: {
    5: ['When the trigger is met, anticipatory cash starts reaching families', 'Harvesting ripe rice and bringing it home', 'Agreeing the family flood plan'],
    3: ['Buying animal feed and arranging to move animals and poultry to high ground', 'Storing dry food and fuel', 'Repairing boats and rafts'],
    1: ['Storing clean water and keeping water purification tablets at hand', 'Putting important papers and valuables up high', 'Getting ready to take older people, children and people with disabilities to the shelter'],
    0: ['The water is in! Many actions are no longer possible', 'Do not let children go near the water alone', 'Stay away from power lines; go to high ground or a shelter']}},
  landslide: {note: 'Forecasts of very heavy rain come several days ahead. The new system in Cox’s Bazar can give warnings up to 5 days ahead.', s: {
    5: ['When you hear the rain forecast, find out which slopes are risky and where the safe shelters are', 'Clearing the drains near the house'],
    3: ['Deciding where everyone in the family will go and who will help whom', 'Packing the emergency bag', 'Checking slopes and walls for cracks'],
    1: ['As soon as a very heavy rain warning comes, leaving homes on slopes and at the foot of hills for a shelter before evening', 'Telling the neighbours'],
    0: ['If you see landslide signs (cracks, muddy water, the sound of earth moving), move away from the slope at once', 'Do not crowd around a landslide site; let rescuers do their work']}},
  heatwave: {note: 'BMD gives temperature forecasts and heatwave warnings several days ahead: from mild at 36°C to very severe at 42°C or more.', s: {
    5: ['Listening to the daily temperature forecast', 'Getting oral saline, water bottles and an umbrella or hat'],
    3: ['Planning to move school sports and assemblies to the morning', 'Letting air flow through the house, putting curtains or wet cloth on windows', 'Shade and water for animals and poultry'],
    1: ['Avoiding heavy work and play in the sun from 11 am to 3 pm', 'Giving older people, children and sick people water again and again', 'Teaching everyone the signs of heatstroke (dizziness, nausea, fainting)'],
    0: ['If someone falls ill, take them into the shade and wipe their body with a wet cloth', 'If they are conscious, give water or saline and take them to hospital quickly', 'The time to prepare has passed, which is why acting early mattered']}}
};
const PILLARS = [
  {n: 'A clear signal', en: 'Trigger', q: '"When do we start?"', c: '#1c8fd6', i: 'chart', ex: {cyclone: 'Work starts as soon as BMD raises danger signal no. 7.', flood: 'FFWC forecasts that the Jamuna will cross the danger level within 3–5 days.', landslide: 'A warning of very heavy rain and landslides in the next 24 hours.', heatwave: 'Work starts when BMD forecasts a very severe heatwave (42°C or more).'}},
  {n: 'Planning ahead', en: 'Plan / EAP', q: '"What will we do?"', c: '#f4a020', i: 'clip', ex: {cyclone: 'Which CPP team will make loudspeaker announcements, who will move the older people from which house: all written down in advance.', flood: 'A written plan (Early Action Protocol) of which families get early cash and where animals will be kept.', landslide: 'Deciding in advance which homes on slopes will be emptied first and which school will be the shelter.', heatwave: 'Writing down in advance where the water points and cooling rest centres will be and how school hours will change.'}},
  {n: 'Early money and resources', en: 'Finance', q: '"What will we use?"', c: '#138a6b', i: 'coin', ex: {cyclone: 'Money set aside in advance for food and water in shelters and transport to move people.', flood: 'In 2024 the UN set aside USD 6.2 million in advance, so help arrived before the flood.', landslide: 'An emergency fund for running shelters and moving families quickly.', heatwave: 'In 2024, money already set aside in the Red Crescent’s emergency fund meant drinking water and cooling rest centres could be arranged quickly during the heatwave.'}}
];
const CASCADE = {
  cyclone: {root: 'Cyclone', br: [['Storm surge', ['Homes washed away', 'Salt water in fields and ponds', 'Shortage of drinking water']], ['Strong winds', ['Trees and houses falling', 'Power cut off', 'Roads blocked']], ['Fishing stops', ['No income, debts', 'Risk of children’s schooling stopping', 'Poor nutrition']]]},
  flood: {root: 'River above the danger level', br: [['Homes under water', ['Crowded shelters', 'Risk of children drowning', 'Schools closed, books ruined']], ['Crops and animals lost', ['Income falls', 'Food shortage', 'Loans at high interest']], ['Tube wells under water', ['Drinking dirty water', 'Diarrhoea', 'Skin diseases']]]},
  landslide: {root: 'Very heavy rain for days', br: [['Landslide', ['Deaths when houses are buried', 'Animals and crops lost', 'Families made homeless']], ['Roads blocked', ['Help cannot get through', 'Hard to reach hospital', 'Food prices rise in the market']], ['Water and power lines damaged', ['Shortage of drinking water', 'Communication cut off', 'Schools closed']]]},
  heatwave: {root: 'Severe heatwave for days', br: [['Strain on the body', ['Heatstroke and dehydration', 'Higher risk for children and older people', 'Crowded hospitals']], ['Work and income', ['Day labourers can work fewer hours', 'Less income, less food', 'Animals and poultry dying']], ['Water and power', ['Water level in tube wells drops', 'Power cuts', 'Schools closed, learning lost']]]}
};
const COLORS = {G: ['Green', '#8fd1a8', 'Not much danger. Carry on as normal and follow the news.'], Y: ['Yellow', '#f6d365', 'Be alert. Start getting prepared.'], O: ['Orange', '#f39c24', 'Get ready! Take anticipatory action now.'], R: ['Red', '#e0302a', 'Danger! Go to a safe shelter and follow instructions.']};
const LVL4 = ['Very low', 'Low', 'High', 'Very high'];
const COLACT = {
  cyclone: {G: ['Follow the news regularly on radio, TV and mobile', 'Check your emergency bag against the list'], Y: ['Get dry food and water', 'Decide the route to the shelter', 'Fishers, think twice before going to sea'], O: ['Start taking older people, people with disabilities and children to the shelter', 'Move animals to the killa', 'Wrap papers in plastic'], R: ['Everyone go to the shelter', 'Follow the volunteers’ instructions', 'Do not go out until the signal is lowered']},
  flood: {G: ['Follow river news from FFWC or 1090', 'Check your family flood plan'], Y: ['Get dry food, fuel and water purification tablets', 'Get boats and rafts ready'], O: ['Move animals and poultry to high ground', 'Harvest the ripe rice', 'Put important papers up high'], R: ['Take the family to high ground or a shelter', 'Keep children in sight at all times', 'Stay away from power lines']},
  landslide: {G: ['Listen to the rain news and keep readings on a rain gauge', 'Keep drains clear'], Y: ['Check slopes for cracks', 'Decide where the family will go'], O: ['Keep the emergency bag close by', 'Move older people and children out of homes on risky slopes first'], R: ['Empty all homes on slopes and at the foot of hills and go to a shelter', 'Do not sleep in risky homes at night']},
  heatwave: {G: ['Listen to the temperature news', 'Carry a water bottle when you go out'], Y: ['Drink plenty of water and wear light cotton clothes', 'Cut down on sports in the midday sun'], O: ['Stop heavy outdoor work from 11 am to 3 pm', 'Arrange water and oral saline at school', 'Check on older and sick neighbours'], R: ['Do not go out in the sun unless you really must', 'If you see signs of heatstroke, get shade, water and treatment right away', 'Follow the school authorities’ instructions']}
};
const SIGNALS = [
  [1, 'G', 'Distant cautionary signal', 'Squally winds or a storm may be forming far out at sea. Nothing to fear, but keep following the news.'],
  [2, 'G', 'Distant warning signal', 'A storm has formed at sea. Ships leaving port may run into danger.'],
  [3, 'G', 'Local cautionary signal', 'Squally winds may blow over the port area. Keep an eye on the news.'],
  [4, 'Y', 'Local warning signal', 'The port is in the storm’s path, but extreme action is not needed yet. Get prepared; fishers, return to shore.'],
  [5, 'O', 'Danger signal', 'A moderate cyclone may cross the coast to the south or left of the port. Take anticipatory action.'],
  [6, 'O', 'Danger signal', 'A moderate cyclone may cross the coast to the north or right of the port. Move people at risk.'],
  [7, 'O', 'Danger signal', 'A moderate cyclone may cross the coast over or near the port. Start going to shelters.'],
  [8, 'R', 'Great danger signal', 'A severe cyclone will cross the coast to the south or left of the port. Everyone to the shelters.'],
  [9, 'R', 'Great danger signal', 'A severe cyclone will cross the coast to the north or right of the port. Everyone to the shelters.'],
  [10, 'R', 'Great danger signal', 'A severe cyclone will cross the coast over or near the port. Get to a safe shelter now.'],
  [11, 'P', 'Communication failure signal', 'Contact with the weather centre is cut off. The local officer thinks the weather is very bad. Assume the worst and stay safe.']
];
const LET = ['A', 'B', 'C', 'D', 'E'];
const QTYPE = {tf: 'True or false', fill: 'Fill in the blank', hotspot: 'Look at the pictures and choose', scenario: 'Read the situation and decide (critical thinking)', report: 'Analyse the information', mcq: 'Choose the right answer', matrix: 'Read the colour chart', sort: 'Put each card in the right box', match: 'Match the pairs', seq: 'Put the events in order', open: 'Your opinion'};
const LEVELS = [{name: 'Rookie mission', cls: 'lv1', tag: 'Level 1'}, {name: 'Pro challenge', cls: 'lv2', tag: 'Level 2'}, {name: 'Legendary boss fight', cls: 'lv3', tag: 'Level 3'}];
const PRAISE = ['Great! Exactly right!', 'Wow! You’re a real weather scientist!', 'Perfect! Energy rising!', 'Excellent reasoning!'];
const OOPS = ['Not this time. Read the explanation and you’ll get the next one!', 'We learn from mistakes! Look at the green answer.', 'Close! Read the explanation carefully.'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const RISK_LEVELS = ['None', 'Low', 'Medium', 'High'];
const RISK_PRESETS = [['Rafi’s tin house (outside the embankment)', 3, 3, 3], ['Majid Uncle’s brick house (inside the embankment)', 3, 1, 1], ['Mitu’s char house (with a raised platform)', 3, 2, 3], ['A house on the slope in Usha’s neighbourhood', 3, 2, 3], ['An empty char', 3, 2, 0]];
// [label, colour, advice] for risk 0, ≤4, ≤9, ≤18 and above
const RISK_BANDS = [['No risk', '#8fd1a8', 'If any one part is zero, the risk is zero too!'], ['Low risk', '#8fd1a8', 'Good! Still, keep following the news.'], ['Medium risk', '#f6d365', 'Preparation is needed.'], ['High risk', '#f39c24', 'Anticipatory action is urgent.'], ['Very high risk', '#e0302a', 'Help must reach here first.']];
const DATACARD_Q = [['Type of house', ['Brick', 'Semi-brick', 'Mud']], ['How far the house is from a river, canal, the sea or a hill slope', ['Far', 'Medium', 'Very close']], ['Is the ground high or low?', ['High', 'Level', 'Low']], ['Is there a family member with a disability or illness?', ['No', '', 'Yes']], ['Are there small children, a pregnant woman or older people in the family?', ['No', 'Yes']], ['Highest water or damage in the last disaster', ['Knee / a little', 'Waist / medium', 'Higher / major damage']], ['Nearest shelter', ['Under 15 minutes', '15–30 minutes', 'Over 30 minutes']]];
const JOURNEY_STEPS = [['You collect information', 'House type, water height, family details', '#138a6b'], ['The information goes onto a map', 'A vulnerability map is made', '#1c8fd6'], ['It is matched with the forecast', 'Weather forecast + your information = impact-based forecast', '#da291c'], ['Colour signals and an action map are made', 'Places that need help first are marked', '#f4a020'], ['Anticipatory action → lives and property saved!', 'Help reaches the right place at the right time', '#138a6b']];

const UI = {
  orgName: 'Save the Children Bangladesh',
  courseName: 'Online Course on Child-Centred Anticipatory Action and Impact-Based Forecasting',
  programName: 'MET Club',
  certTitle: 'Junior Meteorologist',
  certSub: 'young weather scientist and disaster ambassador',
  signatures: ['Director, Bangladesh Meteorological Department'],
  loading: 'Loading the course…',
  rainGauge: 'Rain gauge',
  // welcome
  heroAlt: 'MET Club students holding pictures they drew in a drawing competition',
  heroTag: 'MET Club · e-Learning',
  heroLine: 'Let’s get ready before disasters strike: learn it ourselves, teach our friends.',
  heroAge: 'For young learners (ages 13–24)',
  hazardsTitle: 'The four disasters you will learn about in this course',
  meteoSays: 'A meteorologist says:',
  meteoQuote: '"Did you know that in 1970 about 500,000 people died in one cyclone, but in 2020 only 26 died in Amphan? The storms did not stop; our preparation changed. In this course you will learn the science of that preparation."',
  yourInfo: 'Your details',
  joinCourse: 'Join the course',
  nameNote: 'Your name will be printed on the certificate, so spell it correctly.',
  fName: 'Your full name *',
  fNamePh: 'e.g. Nusrat Jahan',
  fSchool: 'School / college / institution',
  fSchoolPh: 'e.g. Fulchhari High School',
  fClass: 'Class / level',
  classes: ['', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Undergraduate', 'Other'],
  choose: 'Choose',
  fDist: 'District',
  fDistPh: 'e.g. Gaibandha',
  nameErr: 'You forgot to write your name! The certificate needs it.',
  save: 'Save',
  letsStart: 'Let’s start',
  backToMap: 'Back to the map',
  platform: p => `${p} e-learning platform`,
  // map
  welcome: 'Welcome',
  hello: n => `Hello, ${n}!`,
  nextStep: 'Next step:',
  chapter: n => `Chapter ${n}`,
  finalMission: 'Final mission',
  allDone: 'All chapters finished! Great work.',
  progress: 'Course progress',
  continue: 'Continue',
  startFirst: 'Start the first chapter',
  journal: 'My thinking notebook',
  myInfo: 'My details',
  previewNote: 'Preview mode: all chapters are open. Students using the normal link open chapters one after another.',
  certReq: 'Certificate requirements',
  achieved: 'Achieved',
  ongoing: 'In progress',
  req1: 'Finish the 4 chapters and the final mission',
  req2: p => `An average of ${p}% or more across all quizzes`,
  now: v => `now ${v}`,
  req3: 'Answer every "Think about it" and opinion question',
  retryNote: 'If you score low you can take a quiz again; your best score is kept.',
  viewCert: 'See my certificate',
  certLocked: 'Certificate (locked)',
  certDemo: 'See a sample certificate (preview)',
  best: 'Best',
  quizLeft: 'Quiz left',
  reading: 'Reading',
  startCh: 'Start',
  finishAll: 'Finish all earlier chapters',
  finishPrev: 'Finish the previous chapter',
  mantraFoot: 'A mantra to remember: know early → understand early → act early',
  lockedToast: 'Finish the previous chapter’s quiz to open this chapter',
  certToast: 'The three certificate requirements are not met yet',
  // lesson cards
  quiz: 'Quiz',
  cardOf: (a, b) => `Card ${a} / ${b}`,
  source: 'Source:',
  cardTitles: {story: 'Story', formula: 'The risk formula', check: 'Quick quiz'},
  realTag: 'A true story from Bangladesh',
  oldMsg: 'Old message',
  ibfMsg: 'Impact-based message',
  oldPrefix: /^Old:\s*/,
  ibfPrefix: /^Impact-based:\s*/,
  formulaHtml: `<div class="eq" style="font-size:17px"><span class="t" style="border-color:#da291c">🌀 Hazard<br><small>What can happen</small></span><span class="op">×</span><span class="t" style="border-color:#f4a020">🏚️ Vulnerability<br><small>How easily harmed</small></span><span class="op">×</span><span class="t" style="border-color:#1c8fd6">👨‍👩‍👧 Exposure<br><small>Who is in the way</small></span><span class="op">=</span><span class="t res">Risk<br><small>Possible loss</small></span></div>
      <div class="two"><div class="box fact"><p><b>Hazard: what could happen?</b><br>A natural event that can cause harm: cyclones, floods, very heavy rain, heatwaves, lightning. A hazard alone does not make a disaster!</p></div>
      <div class="box tip"><p><b>Vulnerability: how easily will harm happen?</b><br>Mud houses, poor families, and people who are ill, older or have disabilities are harmed more easily. People who are better able to cope are less vulnerable.</p></div></div>
      <div class="box warn"><p><b>Exposure: who or what is in the hazard’s path?</b><br>Homes, people, crops and animals on riverbanks, outside embankments or on hill slopes. If nobody is in the hazard area, there is no risk.</p></div>`,
  thinkTag: 'Think and write',
  thinkPh: 'Write here in your own words… (at least a line or two)',
  submit: 'Submit answer',
  thinkSaved: 'Submitted. You can change it if you like.',
  thinkHint: 'There is no wrong answer here. Your own thinking is what counts.',
  thinkModel: 'What a meteorologist might think about',
  thinkDone: 'Great! Your answer has been saved in your "thinking notebook".',
  prev: 'Back',
  map: 'Map',
  toQuiz: 'Go to the quiz ➜',
  next: 'Next ▸',
  allLines: 'Show all at once',
  nextLine: 'Next line ▸',
  // widgets
  forecast: 'Forecast',
  disaster: 'Disaster',
  daysLeft: 'Days left until the disaster:',
  today: 'Today, the disaster begins!',
  days: n => (n === '1' ? '1 day' : `${n} days`),
  daysAria: 'Days',
  windowClosed: 'The window has closed',
  doNow: h => `What to do now (${h})`,
  windowLate: 'See? If you do not act while there is time, many things can no longer be done. The bigger the window, the bigger the chance.',
  windowHint: 'Drag the slider to the right and the disaster comes closer.',
  pillarsExample: '<b>A simple example from home:</b> think of the night before an exam. Your signal is the alarm going off (Trigger), your plan is which book you will read when (Plan), and your resources are pens, notebooks and a light (Finance). When all three are ready in advance, the exam goes well. Disaster preparation works just like this!',
  hazard: 'Hazard',
  vulnerability: 'Vulnerability',
  exposure: 'Exposure',
  formulaNote: 'Notice: even when the hazard stays the same, risk falls a lot if homes are made stronger (lower vulnerability) or people move to safe places (lower exposure).',
  cascadeWhy: '<b>Why does this matter?</b> When we know which losses a hazard can cause, we can plan a separate anticipatory action for each one. For example, handing out water purification tablets before a flood to prevent diarrhoea, or wrapping books in plastic and putting them up high so learning can continue.',
  matrixAria: 'Colour-coded risk chart',
  matrixAxes: 'Likelihood ↓ / Impact →',
  cellAria: (l, i, c) => `Likelihood ${l}, impact ${i}: ${c}`,
  cellResult: (l, i, c) => `Likelihood "${l}" + impact "${i}" = ${c}`,
  matrixNote: 'The same language worldwide: weather offices in many countries use colour charts like this. Colours mean the same to everyone, so the danger is clear even if you do not understand the language.',
  signalAria: n => `Signal number ${n}`,
  signalNo: n => `Number ${n}`,
  flagsNote: '<b>🚩 Red-and-black flags:</b> on the coast, CPP volunteers raise red flags with a black square in the middle. At night, loudspeakers and sirens are used.',
  flags: ['1 flag = alert', '2 flags = danger', '3 flags = great danger'],
  mainHazard: 'The main disaster in my area:',
  homeColor: 'Your home’s risk colour:',
  points: 'Points',
  familyTodo: 'What your family should do when this disaster is forecast:',
  answerAll: (a, b) => `Answer all the questions to see the risk colour (${a}/${b}).`,
  privacyNote: 'The information on this card stays on your screen only and is not saved anywhere. For a real survey in the field, use the form given by your teacher or volunteer.',
  nextStepBtn: 'Next step ▸',
  journeyDone: '<b>See how important you are?</b> Without your correct information, a forecast is incomplete. You really are a young weather scientist!',
  // questions
  question: 'Question',
  correct: 'Correct!',
  partly: 'Partly right!',
  wrong: 'Not this time',
  seeGreen: 'The answer marked in green is the best one. Read the explanations below.',
  pickBox: 'Choose the right box for each card, then check.',
  pickPair: 'Choose the right pair for each card, then check.',
  check: 'Check',
  rightAnswer: 'Correct:',
  someRight: (ok, n) => `${ok} of ${n} correct. See the right answer under each red card.`,
  shuffled: 'Shuffled steps (tap to put in order)',
  allPlaced: 'All steps are placed! If something is wrong, tap a step on the right to remove it.',
  rightOrder: 'Correct order',
  openPh: 'Write in your own words, with reasons…',
  openNote: 'This question has no marks, but answering it is required for the certificate. There is no single "right" answer here.',
  openModel: 'What a good answer might include',
  openCompare: 'Compare with your own answer. If you missed something, remember it next time!',
  // quiz
  radar: 'Radar energy',
  questionOf: (a, b) => `Question ${a} / ${b}`,
  sayOpen: 'Here I want your own opinion!',
  sayScenario: 'Read all the answers once, then choose the best one.',
  sayDefault: 'Read carefully; points for the first answer!',
  saySaved: 'Excellent! Your opinion has been saved in your thinking notebook.',
  nextQ: 'Next question ➜',
  seeResult: 'See the result ➜',
  nQuestions: n => (n === '1' ? '1 question' : `${n} questions`),
  levelIntro: ['Starting easy', 'Now you need to think a bit!', 'Real situations, the biggest challenge!'],
  letsPlay: 'Let’s play ➜',
  completed: x => `${x} completed!`,
  result: ['Amazing! You’re a real disaster ambassador!', 'Great! Chapter passed!', 'Well done! Try again and you’ll do even better.', 'Keep trying! Look at the cards again, then take the quiz.'],
  overallAvg: 'Overall average',
  passNote: p => `For the certificate you need an average of ${p}% across all quizzes. If you try again, your best score counts.`,
  getCert: 'Get the certificate',
  nextChapter: 'Next chapter ➜',
  retry: 'Try again',
  // journal
  journalTitle: 'All the answers you wrote',
  journalIntro: 'Everything you wrote for the course’s "Think about it" and opinion questions is here. You can share it with your teacher or MET Club.',
  notWritten: 'Not written yet',
  notWrittenTxt: '(not written)',
  downloadJournal: 'Download the notebook (.txt)',
  // certificate
  studentName: 'Student’s name',
  sample: 'SAMPLE',
  eLearning: 'e-Learning',
  congrats: 'Congratulations!',
  certificate: 'Certificate',
  certifies: 'This certificate confirms that',
  district: d => `${d} District`,
  certLine1: c => `has successfully completed the “${c}”`,
  certLine2: a => `with an average score of ${a}% and is now a proud`,
  fullStop: '.',
  dateLabel: 'Date:',
  certNo: 'Certificate no.:',
  date: (d, m, y) => `${d} ${m} ${y}`,
  mantraQuote: '"Know early → understand early → act early."',
  preview: 'Preview',
  sampleCert: 'Sample certificate',
  youAreNow: t => `You are now a ${t}!`,
  sampleCertNote: 'When a student meets all the requirements, this certificate is made automatically with their name, institution, date and average score.',
  certDoneNote: a => `All chapters finished, with an average score of ${a}%. Your certificate has been made. Now it’s your turn: teach your family and friends what you learned!`,
  certMaking: 'Making your certificate…',
  dlPng: 'Download image (PNG)',
  dlPdf: 'Download PDF',
  certHelp: 'If the download does not work, right-click the certificate image (long-press on mobile) to save it. If your name is wrong, fix it in "My details" and come back here.',
  certAlt: t => `${t} certificate`
};
