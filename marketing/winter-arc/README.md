# Winter Arc — motion graphic reel

An 87-second vertical video (1080×1920, 30 fps) for the "Winter Arc" voice-over:
motion graphics built from **real Mindkraft UI**, an **original score**, sound design
and **word-by-word captions**, all timed to the VO.

This folder is a marketing asset, not app code. Nothing in the app imports it,
`_config.yml` keeps it off the GitHub Pages site, and the service worker never
caches it.

## How it is made

| Piece | What it is |
|---|---|
| `scene/` | The animation: an HTML page that loads the app's own `style.css`, Inter and Phosphor, and rebuilds Mindkraft components with the app's markup (activity cards, sticky header, XP Over Time chart, calendar, Activity History, editor, toasts, level-up card, landing logo). `window.renderFrame(t)` draws any frame as a pure function of time. |
| `tools/render.mjs` | Headless Chromium renders frames in parallel (`432×768` CSS @ 2.5× → 1080×1920) and pipes them to ffmpeg. The build renders a 60 fps master and delivers a crisp 30 fps cut from it (every other frame; whips and dives carry their own blur in the scene). A section can be re-rendered on its own with `--from/--to` and spliced back in. |
| `audio/score.py` | The music and sound design, synthesised from oscillators, noise and filters (nothing sampled). D minor, on a tempo map: each section keeps a steady ~120 BPM grid anchored on the words that matter, so "winter", "fail", "Mindkraft", "step back", "arc" and the end card land on downbeats. |
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
| 0.80 | Few days ago, | Calendar card counts back from today (Oct 8) to Oct 1; the Day 1 cell fills blue | Low D drone; falling clock ticks; a bell on Day 1 |
| 2.00 | everyone on Instagram was starting a winter arc, | Blue wipe through the Oct 1 cell into a tilted wall of 60 activity cards cascading in; completion rings fill in a wave | Whoosh, pulse enters (8th-note bass + hats), a spray of pentatonic plinks |
| 4.00 | winter arc | **WINTER ARC** slams in with an ice sheen | Impact + Dm9 stab, felt piano (on the beat) |
| 5.20–6.00 | and yours will **fail** | Dive into "My winter arc"; streak turns to the amber *Risk* chip, ring empties; on "fail" the card greys, rose vignette, the wall collapses | Dissonant swell → boom, tape-stop, floor drops out |
| 7.52 | if you don't understand this. | One glowing dot in the dark | Two soft pings |
| 8.72–13.20 | In storytelling, an arc is a journey that changes a character from within. | The dot becomes the character (app avatar); a glowing arc draws itself as the character's level climbs 1 → 14; giant outlined ARC behind; gold level trace on "within" | Reverse swell into felt piano + pad (Dm9 → Bbmaj9); a rising chime per level-up |
| 14.40–18.64 | But take any story that you like, the character never sees their own arc. | Camera dives and rolls to the character until the arc looks flat; fog closes in; eye-slash icon | Whoosh; piano thins and darkens in the fog |
| 19.44–25.57 | They live one day at a time, experiencing one scene at once, moving from one data point to another. | Day-by-day: a *Morning run* card completes on each "one" (ripple and sparkle on the ring, +25 XP, streak 13 → 16) while the character hops point to point | Tap + rising confirm chime on each beat; soft heartbeat pulse |
| 26.37–30.13 | Only the audience gets to see the arc over a long period of time, | Big pull-back and un-roll reveals the points inside **XP Over Time**; light sweeps the line on "see the arc"; range pills step 1M → 3M → 6M → 1Y on "long", "period", "time" and the arc bends into view | Riser → impact, Bb chord bloom, glass glissando, a rising pluck per range pill |
| 30.61–33.01 | once the character reaches the end of their journey. | The character rides the 1Y line to its end, levelling up to 31; gold trace on arrival; the chart pushes in on the end | Soft rising glide, a warm chime on arrival; C → Asus → A, setting up the groove |
| 34.05–39.57 | So for your winter arc to work, you need to be both the character and the audience. | The chart drops below your own activity card; **Character / Audience** tabs appear and the app's glowing indicator stretches across both, then picks each in turn | Groove enters (half-time kick, claps, shaker, marimba plucks), 40 beats to the next line |
| 40.61–49.17 | Being the character means doing something meaningful every day. But be purposeful on your own definition, not by living off of a template from Instagram. | Whip into **Create Activity**: "Read 10 pages" types in, Frequency → Daily, *Medium habit · 25 XP*, the name field lights up on "your own definition", Save → it becomes your card. Three dashed "someone else's template" cards slide in and are flicked away on "Instagram" | Whips, typing clicks, select ticks, save chime, swishes |
| 50.21–53.49 | And being the audience means keeping a record of your own journey. | Indicator → Audience; **Activity History** rows drop in on the words, then the log rolls back through weeks | Ticks per row, a fast flutter on the roll |
| 54.37–61.43 | But don't trust your memory to do this, because we tend to remember the times we quit and not all the times that we showed up. | The October calendar frosts over (frosted glass + ice crystals, blur); the three missed days glow rose and come forward; every blue day dissolves into snow | Drums out; piano and pad muffled with tape wobble; ice crackle; low cluster and hit on "quit"; falling glints |
| 62.31–63.91 | This is where **Mindkraft** can help. | The quits are pulled into a point of light; on "Mindkraft" the app icon lands with a shockwave, the frost shatters and the snow bursts outward | Riser + reverse swell, a beat of silence, then the drop (impact + shimmer) |
| 64.55–68.79 | Here you can define your arc and break it down into simple actions you do every day. | The real Activities screen: header at Level 14; the **Winter Arc** group arrives on "define your arc" and unfolds into *Read 10 pages*, *Walk 30 minutes*, *Call family*; their streak chips light up on "every day" | Groove from "Here" (four-on-the-floor, claps, 16th plucks), 24 beats to "step back" |
| 69.43–71.83 | Show up each day and see if you live up to it. | "Show", "each", "day" each complete a card (ripple + sparkle on the ring); +XP flies into the header bar; a streak toast on "live up to it" | Confirm chimes on the words |
| 72.47–73.67 | By the time New Year arrives, | Months fly past (Oct → Jan) while the level rolls 14 → 31; Jan 1 lights gold; **Level 31** level-up card + confetti | Snare roll and riser; gold bells; level-up arpeggio |
| 74.87–78.87 | you can step back and take a look at your journey by looking at the shape of your arc. | Step back into **XP Over Time** (Oct 1 → Jan 1): the line draws as the level badge rides it; on "arc" a gold trace and sparkle; stat tiles count up | The climax, 8 beats: impact, Dm → Bb → C → F, lead melody |
| 79.79–82.27 | So, what's your winter arc going to look like? | Back to today: one point and three dashed possible arcs in the app's overlay colours | Drums drop, music dips under the question; Bbmaj7 → Csus |
| 82.90–87.00 | — | End card: the Mindkraft app icon, *Gamify your life.*, feature pills, **Start your winter arc**, mindkraft.life | Resolves to F(add9) as the card lands, shimmer tail |
