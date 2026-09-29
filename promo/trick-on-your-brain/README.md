# "A trick on your brain": B-roll pack

Nine motion-graphics cutaways for the talking-head promo, built from Mindkraft's own UI:
activity cards, the XP bar, streak chips, Dimensions and the spider chart, and the LEVEL UP! reward card.
Each clip comes with its own music and sound design, mixed in.

- **Format:** 1080×1920 (9:16), 60 fps, H.264 + AAC 48 kHz (`clips/*.mp4`)
- **Audio:** mixed to about −20 LUFS with peaks under −2 dBFS, so each clip sits roughly 6 dB under a normal −14 LUFS voice.
  The separate `music` and `sfx` stems for rebalancing are in `clips/stems/`.
- **Timing:** every clip is cut to the exact subtitle timestamps, and every sound lands on the frame of the motion that causes it.

## Where each clip goes

All times are taken from `A_trick_on_your_brain_subtitles.srt`. Drop each clip on the track above the camera at the **In** point, keep the voice running underneath, and hard-cut back to camera at **Out**.

| # | File | In | Out | Length | Covers the line |
|---|------|----|-----|--------|-----------------|
| 1 | `01-the-gap.mp4` | 00:03.66 | 00:08.94 | 5.28s | "…difficult things is because **effort is almost always separated from reward**." |
| 2 | `02-four-years.mp4` | 00:12.14 | 00:15.98 | 3.84s | "**A college degree**, you have to study **four years** before you graduate." |
| 3 | `03-compounding.mp4` | 00:33.13 | 00:41.29 | 8.16s | "If you're not born with it… invest for years before **compounding starts to kick in**." |
| 4 | `04-dopamine-feed.mp4` | 00:56.49 | 01:05.85 | 9.36s | "**10 minute deliveries, social media algorithms**… It's all about the **dopamine hits**." |
| 5 | `05-fake-reward.mp4` | 01:18.74 | 01:23.94 | 5.20s | "What if every time you put in some **effort** you got a **fake reward**?" |
| 6 | `06-level-up.mp4` | 01:28.10 | 01:36.58 | 8.48s | "…**built an app** that does this for you… **you level up. Just like a video game.**" |
| 7 | `07-habit-streak.mp4` | 01:58.66 | 02:04.74 | 6.08s | "…very **hard for you to start**, now feels like **a habit** that you are slowly building." |
| 8 | `08-momentum.mp4` | 02:17.22 | 02:25.38 | 8.16s | "That **one hobby**… that **side project**… bring in **everything**, and the momentum **compounds**." |
| 9 | `09-end-card.mp4` | 02:37.99 | end (02:41.99) | 4.00s | "**Link for the app is in the bio**, I'll see you soon." (the video ends on it) |

That is about 58 seconds of B-roll across the 2:40 video. Each block of camera time between clips runs 3–22 seconds, and the face stays on for the hook (0:00–0:03), the thesis ("My point is…", 0:41), "Of course, all of this is fake" (1:36) and the testimonial (2:04).

### Editing notes
- **Clip 5 is a callback.** Its first frame is clip 1's last frame (the reward "4 years away"), and then the gap collapses. Keep both clips; they tell one story.
- **Clip 4 ends in a tape-stop.** The feed freezes, glitches and drains to grey, and the audio winds down to silence. It's built to hard-cut into "And that's why things we do in the real world can start to feel slow and boring."
- **Clip 9** runs about 1.8s past the last word, so end the video on it rather than cutting back to camera.
- **Captions:** the key content in every clip stays above about 80% of the frame height, so the bottom fifth is clear for captions and the Reels UI.
- **Levels:** if your voice track is quieter than about −14 LUFS, pull the clip audio down 3–6 dB. To keep the music but soften the effects, or the reverse, use the stems.
- **Running a background track under the whole video?** Mute the clip audio and lay `clips/stems/NN-*.sfx.wav` at the same In point instead. The hits stay, and the scores don't clash with your bed.
- **Edges:** each clip's first frame is already mid-motion and its audio fades out over the last 0.12s, so hard cuts don't need transitions.

## Background music for the whole video (`bed/`)

A subtle score runs for the full 2:41.99 so the music never stops and starts at the cuts. In each gap between clips it moves from the last clip's key and tempo into the next clip's. The chords lead into the next clip's opening chord, and the pulse lands on the next clip's beat grid, speeding up into it where the tempo rises. The bed then swells into each clip, dips under it (following that clip's chords), and picks up the clip's last chord at the cut back to camera before settling under the voice over about 3 seconds.

There are two ways to use it. **Both start at 00:00:00** and assume the clips sit exactly on the In points above.

| File | How to use it |
|---|---|
| `bed/full-soundtrack.wav` | **Most seamless.** Mute the audio on all 9 clips and put this one track at 00:00:00 under the voice. It has the bed plus every clip's music and sound effects on the exact frames. Each clip's music rings out naturally into the bed instead of stopping. |
| `bed/bg-bed.wav` | Bed only. Keep the clips' own audio and put this at 00:00:00 on its own track. It drops out of the way under each clip and takes over at each cut back to camera. |

- **Levels:** under narration the bed sits at about −27 LUFS, roughly 13 dB below a −14 LUFS voice. A −4.5 dB dip at 2 kHz keeps it out of the speech band. The clips stay at −20 LUFS.
- **Measured smoothness:** in the full soundtrack every cut changes level by 6 LU or less. The only exceptions are intentional: the tape-stop into silence after clip 04, and the two logo hits at clips 06 and 09, which each arrive after a riser.
- **If you've moved a clip:** `bg-bed.wav` tolerates a few frames of drift. `full-soundtrack.wav` has the clip hits baked in, so it needs the exact In points.

What the music does in each gap:

| Gap | Narration | Bed |
|---|---|---|
| 0:00–0:03.66 | hook | D minor; clip 01's clock and ostinato fade in on its 120 BPM grid |
| 0:08.94–0:12.14 | "Let me explain…" | B♭ → F/A → Am, with a pulse speeding up into clip 02's 140 BPM sixteenths |
| 0:15.98–0:33.13 | relationship, money | resolves to C, then a warm 85 BPM felt-piano groove on clip 03's grid (C → G/B → Am → F → Dm → G) |
| 0:41.29–0:56.49 | "reward comes late… don't even try… instant gratification" | clip 03's plucks ring out; reflective C → Am → F → Fm; a hush on "Try."; then a C pedal (the dominant of F minor) pumps on clip 04's 128 BPM grid as the filter opens |
| 1:05.85–1:18.74 | "slow and boring… what if…" | silence after the tape-stop, then a lazy 60 BPM clock over a wobbly Fm pad; it lifts to D♭, then B♭ bells, then C, with marimba on clip 05's grid |
| 1:23.94–1:28.10 | "Now how will you do that?" | clip 05's F-major marimba motif rings on; B♭ → F with a riser into the logo zap |
| 1:36.58–1:58.66 | "Of course, all of this is fake…" | clip 06's chiptune lead echoes out; a soft 120 BPM lo-fi groove in C; it darkens to A sus2 with clip 07's heartbeat on its grid |
| 2:04.74–2:17.22 | testimonial, "building momentum" | clip 07's 100 BPM hats and marimba carry on in C, then speed up onto clip 08's 150 BPM grid (G → A → D) |
| 2:25.38–2:37.99 | "So if there is something…" | clip 08's guitar keeps picking and relaxes from eighths to quarters to halves; D → Bm → G → Gm → B♭ → C → F, with a bell arpeggio rising into the end card |

## Beat sheets

The animation and the sound come from the same cue list. Each scene exports `SCENE.cues`, and `tools/audio.py` places every sound on those exact times.

**01 The Gap** — tense D-minor drone, a clock ticking at 120 BPM
| t | Motion | Sound |
|---|---|---|
| 0.00 | Effort card and a distant locked reward compose, linked by a dotted track | air swell, D-minor pad, ticking clock |
| 0.55–2.05 | Four taps of effort, each paying back "+0" | dull wooden knocks on the tick |
| 2.40 | The track stretches and the reward recedes; the chip steps from 1 week to 3 months to 1 year to 2 years | rubber-band stretch, receding Doppler tone, ticks per step |
| 3.76 | "separated from reward": the chip slams to **4 years away** (amber) | low slam, a distant bell, the chord darkens to B♭ |

**02 Four Years** — A-minor engine pulse at 140 BPM, resolving to C
| t | Motion | Sound |
|---|---|---|
| 0.00 | Quest card "College Degree" at Day 1, reward locked | pop in |
| 0.75 | The day counter grinds, slowly and then faster | accelerating clock ticks over a riser |
| 2.23–3.20 | Year 1 to Year 4 stamp in | a thud and a rising bell for each year |
| 3.24 | Day 1,460: the lock finally opens | unlock click-clack, a small chime; the chord resolves to Cmaj7 |

**03 Compounding** — 85 BPM progression Am, F, C, G, then C
| t | Motion | Sound |
|---|---|---|
| 0.00 | Portfolio card at $0 | pad intro |
| 1.28 | One +$2,400 deposit per beat, with the bars mostly blue (deposits) | a clink per deposit on the chord tones; kick and hats enter |
| 5.52 | The years blur by and the chart zooms out | double-time hats, a riser, a snare roll |
| 7.28 | "kick in": the green growth takes over and the chart rockets | impact, crash, a rocket riser, a bright C chord |
| 7.70 | The COMPOUNDING chip lands | chip pop |

**04 Dopamine Feed** — F-minor dance loop at 128 BPM
| t | Motion | Sound |
|---|---|---|
| 0.00 | Delivery notifications land; the DOPAMINE meter wakes up | four-on-the-floor, a ding-dong per delivery |
| 1.04 | Likes, follows, autoplay, messages | a different ping per notification type |
| 2.80 | Pings accelerate | claps enter, a long riser |
| 7.12 | "dopamine hits": a flood, and the meter redlines at MAX | the drop: an impact, double-time kick, ping flood |
| 8.70 | The feed freezes, glitches and turns grey | tape-stop on the whole mix down to silence |

**05 Fake Reward** — D minor resolving to F major (IV–V–I)
| t | Motion | Sound |
|---|---|---|
| 0.00 | Callback to clip 1's last frame | clip 1's D-minor pad |
| 0.55 | The reward rushes down while the chip counts down from 2 years to 1 day to **Instant** | reverse suck, a rising harp run, a tick per step |
| 1.95 | The reward springs into place | a boing and a zap chime |
| 2.08 | Tap: the card completes, the lock flies off, the gift opens | tap, unlock, an 8-bit coin, the XP chime; the chord lands on Fmaj9 |
| 3.30 | "fake reward": a glint across **+25 XP** | a glint sweep and sparkles |

**06 Level Up** — C-major chip-pop at 120 BPM
| t | Motion | Sound |
|---|---|---|
| 0.00 | The ⚡ mindkraft wordmark strikes in | electric zap, a warm Fmaj9 hit |
| 0.75 | The phone rises and the wordmark flies into the app header | whoosh up |
| 1.35 | Activity cards cascade in | a rising pop per card |
| 2.50 / 3.50 / 4.25 / 5.00 | Four completes: +30, +15, +25 and +20 XP fly to the bar | tap, then an 8-bit coin whose pitch climbs with each combo, then a fill riser; the groove kicks in |
| 5.95 | **LEVEL UP 7 → 8**: gold bar, gold number, sparkle | snare roll into a chiptune arpeggio fanfare, bells and a crash |
| 6.15 | The app's LEVEL UP! reward card pops | card whoosh and shimmer; a chiptune lead plays "just like a video game" |
| 7.70 | Claim Reward tapped | tap and a claim chime |

**07 Habit Streak** — tension, then C, Am, F, G, C (one chord per week)
| t | Motion | Sound |
|---|---|---|
| 0.00 | Close on Day 1: the hold ring strains and slips back twice | a straining tone that follows the ring, a heartbeat, slip sounds |
| 1.95 | Day 1 completes | a satisfying thunk and a chime |
| 2.05 | The camera pulls out to the whole month | whoosh |
| 2.50 | Days fill in, accelerating, and the streak counts up | one marimba note per day, arpeggiating each week's chord |
| 5.05 | Day 30: a 30-day streak and a flame burst | flame whoosh, a warm C chord, bells |

**08 Momentum** — D major at 150 BPM, layers stacking
| t | Motion | Sound |
|---|---|---|
| 0.00 | Dimensions view with only Health active | soft pad |
| 0.20 | "one hobby": Guitar joins | a plucked-guitar riff starts |
| 1.80 | "side project": Side project joins | bass and hats enter |
| 3.80 / 4.20 / 4.60 | "bring in everything": Mind, Social and Wealth join | kick, then claps, then a chord pad |
| 5.80 → 7.40 | The spider chart pulses outward on every beat, level 8 to 13 | stabs on D, A, Bm, G, then D, with a sub hit and crash per pulse |
| 7.40 | Final pulse: golden **LVL 13** | level-up fanfare |

**09 End Card** — Fmaj9 bed
| t | Motion | Sound |
|---|---|---|
| 0.00 | The wordmark strikes in and the glowing underline draws | zap, a warm chord hit, shimmer |
| 0.55 | Tagline: "Play a little trick on your brain." | bell |
| 1.00 | The "Link in bio" pill pops and the arrow nudges up | chip pop, soft nudges, a falling bell melody |

## Optional: swap in a Lyria music bed
The synthesized scores are finished and in sync. If you'd rather use a richer Google Lyria bed, generate one of these, trim it to the clip length, and keep `clips/stems/*.sfx.wav` on top so the hits stay frame-accurate:

1. **The Gap (~5s):** Tense minimal cinematic underscore in D minor, a soft ticking-clock pulse around 120 BPM, low drone and a muted pluck ostinato. Instrumental. It holds and stretches uneasily, then drops a low boom with a distant bell at ~3.8s and stays unresolved.
2. **Four Years (~4s):** A driving, anxious A-minor sixteenth-note pulse around 140 BPM with a filter that keeps opening. Instrumental. It builds relentlessly, then resolves to a small, bright C-major chime right at the end.
3. **Compounding (~8s):** A steady, disciplined 85 BPM groove (Am, F, C, G) with soft plucks and a light kick. Instrumental. It stays patient for about 5s, a riser and snare roll build, and it explodes into a bright, triumphant C-major lift at ~7.3s.
4. **Dopamine Feed (~9s):** Frantic, glossy F-minor dance-pop at 128 BPM with bright notification-like synth plings. Instrumental. It gets denser and more hyperactive, drops hard at ~7.1s, then slows to a tape-stop into silence at ~8.7s.
5. **Fake Reward (~5s):** Magical, playful underscore that moves from D minor through B♭ and C to a warm F-major resolution, with a rising harp run. Instrumental. It lands a sparkling, satisfied chord at ~2.1s and glows to the end.
6. **Level Up (~8.5s):** Upbeat chip-pop in C major at 120 BPM with modern drums, bright plucks and an 8-bit lead. Instrumental. It opens with a logo hit, grooves in at ~2s, snare-rolls into a big video-game level-up fanfare at ~6s, then goes playful and chiptune to the end.
7. **Habit Streak (~6s):** It starts tense and heavy (a low drone and a heartbeat) for 2s, then turns warm and hopeful: marimba arpeggios over C, Am, F, G that get quicker. Instrumental. It lands on a glowing C-major chord at ~5s.
8. **Momentum (~8s):** Uplifting D-major build at 150 BPM that starts with just a plucked guitar and adds bass, then drums and pads. Instrumental. From ~5.8s, big stabs on every beat (D, A, Bm, G) climb to a triumphant peak at ~7.4s.
9. **End Card (~4s):** A warm, confident Fmaj9 synth sting with a soft impact and a few gentle bells. Instrumental. It resolves and fades out by 4s.

## How it's built (for tweaks and re-renders)

```
src/shell.html        Mindkraft Motion Studio shell (engine, recorder, brand kit), verbatim
src/kit.js            shared helpers: icons, activity card, notification, LEVEL UP card, grain
src/scenes/NN-*.js    one SCENE per clip: meta, timeline, cues, draw(c, t) (pure in t)
studios/NN-*.html     built standalone studios: open in a browser to scrub, play, or record a .webm
tools/build.mjs       splices kit + scene into the shell → studios/
tools/render.mjs      Playwright renders every frame deterministically → H.264, and exports cues
tools/audio.py        synthesizes score + SFX on the cue times, normalizes loudness, muxes → clips/
tools/bed.py          composes the full-length bed and full soundtrack from the insert map → bed/
tools/check_bed.py    prints the level change at every cut (--plot draws the loudness curve)
```

Re-render after editing a scene (Node 18+ with Playwright/Chromium; Python 3 with `numpy scipy imageio-ffmpeg`; the Inter font installed locally):

```sh
node tools/build.mjs
node tools/render.mjs 06          # one clip (omit the prefix for all); --stills=1.5,6.0 for PNG checks
python3 tools/audio.py 06
python3 tools/bed.py              # re-run after any clip or In-point change (In points live in INS)
```
