# Winter Arc — motion graphic reel

A 73.5-second vertical video (1080×1920, 30 fps) for the "Winter Arc" voice-over:
motion graphics built from **real Mindkraft UI**, an **original score**, sound design
and **word-by-word captions**, all timed to the VO.

This folder is a marketing asset, not app code. Nothing in the app imports it,
`_config.yml` keeps it off the GitHub Pages site, and the service worker never
caches it.

## How it is made

| Piece | What it is |
|---|---|
| `scene/` | The animation: an HTML page that loads the app's own `style.css`, Inter and Phosphor, and rebuilds Mindkraft components with the app's markup (activity cards, sticky header, XP Over Time chart, calendar, Activity History, editor, toasts, level-up card, landing logo). `window.renderFrame(t)` draws any frame as a pure function of time. |
| `tools/render.mjs` | Headless Chromium renders frames in parallel (`432×768` CSS @ 2.5× → 1080×1920) and pipes them to ffmpeg. The build renders at 60 fps and blends frame pairs down to 30 fps (a 180° shutter), so every camera move carries natural motion blur. |
| `audio/score.py` | The music and sound design, synthesised from oscillators, noise and filters (nothing sampled). 120 BPM in D minor, on a grid phased to the speaker's own cadence. |
| `audio/mix.py` | VO clean-up (high-pass, presence, compression, soft expander, plosive limiter), VO-keyed ducking plus a VO-keyed dynamic EQ that carves the speech band out of the music only while the voice speaks, loudness-matched stems, −14 LUFS / −1 dBTP master. |
| `data/words.json` | Word onsets/offsets for the VO (speech recognition, cross-checked with a second model). |
| `data/captions.json` | Hand-authored caption phrasing (timing comes from `words.json`). |
| `data/cues.json` | The beat sheet: named times shared by picture **and** score. Retiming a cue moves both. |
| `tools/srt.py` | Exports the captions as `.srt` for platforms that take a caption file. |

## Build

```sh
./tools/fetch-assets.sh                 # Inter + Phosphor 2.1.2 from npm (same files the app uses)
PY=/path/to/python ./build.sh           # python needs numpy, scipy, soundfile, pyloudnorm
# → out/winter-arc.mp4, out/winter-arc.srt
```

Preview a single frame: open `scene/index.html#tc` through any static server rooted at
the repo, then call `renderFrame(12.5)` in the console. Stills:
`node tools/render.mjs stills --out out/stills --at 3.3,23.9,55.8`.

## Beat sheet

Times are VO word onsets (seconds). "Music" is what the score does there.

| t | VO | Picture | Music / sound |
|---|---|---|---|
| 0.48 | Ten days ago, | Calendar card counts back day by day from Oct 7 to Sep 27; the Day 1 cell fills blue | Low D drone; ten falling clock ticks; a bell on Day 1 |
| 1.68 | everyone on Instagram was starting a winter arc, | Blue wipe into a tilted wall of 60 activity cards cascading in; completion rings fill in a wave | Whoosh, pulse enters (8th-note bass + hats), a spray of pentatonic plinks |
| 3.28 | winter arc | **WINTER ARC** slams in with an ice sheen | Impact + Dm9 stab, felt piano |
| 4.16–4.96 | and yours will **fail** | Dive into "My winter arc"; streak turns to the amber *Risk* chip, ring empties; on "fail" the card greys, rose vignette, the wall collapses | Dissonant swell → boom, tape-stop, floor drops out |
| 6.08 | if you don't understand this. | One glowing dot in the dark | Two soft pings |
| 7.20–11.52 | In storytelling, an arc is the journey that changes a character from within. | The dot becomes the character (app avatar); a glowing arc draws itself as the character's level climbs 1 → 14; giant outlined ARC behind; gold level trace on "within" | Reverse swell into felt piano + pad (Dm9 → Bbmaj9); a rising chime per level-up |
| 12.48–16.24 | But take any story you like, the character never sees their own arc. | Camera dives and rolls to the character until the arc looks flat; fog closes in; eye-slash icon | Whoosh; piano thins and darkens in the fog |
| 16.96–21.91 | They live one day at a time, one scene at once, moving from one data point to another. | Day-by-day: a *Morning run* card completes on each "one" (ripple, check, sparkle, +25 XP, streak 13 → 16) while the character hops point to point | Tap + rising confirm chime on each beat; soft heartbeat pulse |
| 22.71–28.31 | Only the audience sees the arc, that too towards the end of the journey over a long period of time. | Big pull-back and un-roll reveals the points inside **XP Over Time**; light sweeps the line; range pills step 1M → 3M → 6M → 1Y on the words and the arc bends into view | Riser → impact, Bb chord bloom, glass glissando on "sees", a rising pluck per range pill |
| 28.95–34.57 | So for your winter arc to work, you need to be both the character and the audience. | The chart drops below your own activity card; **Character / Audience** tabs appear and the app's glowing indicator stretches across both, then picks each in turn | Groove enters (half-time kick, claps, shaker, marimba plucks) |
| 34.95–42.39 | Being the character means doing something meaningful every day. Be purposeful on your own definition, not living as a template from Instagram. | Whip into **Create Activity**: "Write 500 words" types in, Frequency → Daily, *Hard habit · 40 XP*, the name field lights up on "your own definition", Save → it becomes your card. Three dashed "someone else's template" cards slide in and are flicked away on "Instagram" | Whips, typing clicks, select ticks, save chime, swishes |
| 43.19–46.40 | Being the audience means keeping a record of your own journey. | Indicator → Audience; **Activity History** rows drop in on the words, then the log rolls back through weeks | Ticks per row, a fast flutter on the roll |
| 46.95–54.26 | Your memory is terrible for this, because we are likely to only remember the times when we quit, while forgetting all the times that we showed up. | The October calendar frosts over (frosted glass + ice crystals, blur); the three missed days glow rose and come forward; every blue day dissolves into snow | Drums out; piano and pad muffled with tape wobble; ice crackle; low cluster and hit on "quit"; falling glints |
| 54.91–56.72 | This is where **Mindkraft** can help. | The quits are pulled into a point of light; on "Mindkraft" the logo lands with a shockwave, the frost shatters and the snow bursts outward | Riser + reverse swell, a beat of silence, then the drop (impact + shimmer) |
| 57.23–61.07 | Here you can define your arc and log each time you live up to it. | The real Activities screen: header at Level 14, a **Winter Arc** group cascades in; "log", "each", "you" each complete a card on the beat; +XP flies into the header bar; streak toast | Full groove (four-on-the-floor, claps, 16th plucks); confirm chimes on the beat |
| 61.47–63.39 | By the time the New Year arrives, | Months fly past (Oct → Jan) while the level rolls 14 → 31; Jan 1 lights gold; **Level 31** level-up card + confetti | Snare roll and riser; gold bells; level-up arpeggio |
| 63.71–66.19 | you can step back and look at the shape of your own arc. | Step back into **XP Over Time** (Oct 7 → Jan 1): the line draws as the level badge rides it; on "your own arc" a gold trace and sparkle; stat tiles count up | The climax: impact, Dm → Bb → F, lead melody |
| 67.31–69.44 | So what's your winter arc going to look like? | Back to today: one point and three dashed possible arcs in the app's overlay colours | Drums drop; Bbmaj7 → Csus |
| 69.90–73.50 | — | End card: Mindkraft logo, *Gamify your life.*, feature pills, **Start your winter arc**, mindkraft.life | Resolves to F(add9), shimmer tail |
