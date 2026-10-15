/* Song writing knowledge base for the chord practice app.
   Degrees are always relative to the MAJOR scale on the song tonic, even in minor songs.
   Every bank progression totals 16 or 32 beats. Every lesson plain and pro totals 16 beats. */
window.SONG_DATA = {
  version: 1,

  styles: {

    /* ===================================================================== NEO SOUL */
    neosoul: {
      name: "Neo soul and R&B",
      blurb: "Lush extended chords, a lazy pocket, and moves borrowed from jazz and church. Think Rhodes, warm bass, and chords that never fully sit still.",
      bpm: [68, 95],
      lift: false,
      structures: [
        { name: "Classic", sections: ["intro", "verse", "pre", "chorus", "verse", "pre", "chorus", "bridge", "chorus", "outro"] },
        { name: "Slow jam", sections: ["intro", "verse", "chorus", "verse", "chorus", "bridge", "chorus", "chorus", "outro"] },
        { name: "Vamp heavy", sections: ["intro", "verse", "verse", "chorus", "bridge", "chorus", "outro"] }
      ],
      banks: {
        intro: [
          { mode: "major", name: "Sunday Morning Glide", chords: ["4maj9", "3min7", "6min9", "2min9:2", "5sus9:2"], why: "The 4 to 3 to 6 drop is the heartbeat of neo soul, and the quick 2 to sus 5 tail floats you back to the top. Lazy, warm, and sets the vibe instantly." },
          { mode: "major", name: "Planing Dust", chords: ["1maj9", "b7maj9", "b6maj9", "5sus9"], why: "The same maj9 shape slides down by whole steps through borrowed chords, then the sus 5 pulls you home. Dreamy and cinematic." },
          { mode: "major", name: "Chorus Teaser", chords: ["4maj7", "3dom7b9", "6min9:8"], why: "A preview of the big chorus move: the 3 dominant with a b9 melts into a long 6 minor. Lets the beat breathe before the vocal comes in." },
          { mode: "major", name: "Rhodes Stairs", chords: ["1maj9:2", "2min9:2", "3min7:2", "4maj9:2", "3min7:2", "2min9:2", "1six9"], why: "Diatonic chords walking up and back down in parallel, like fingers strolling across a Rhodes. Simple, elegant, and it leaves space." },
          { mode: "major", name: "Backdoor Bloom", chords: ["4min9", "b7dom13", "1maj9:8"], why: "The borrowed minor 4 and the flat 7 dominant sneak into home through the back door. Soft and nostalgic from bar one." },
          { mode: "minor", name: "Late Night 1 4", chords: ["1min9:8", "4min9:8"], why: "Two minor 9 chords trading places, two bars each. Smoky and hypnotic, the classic minor R&B vamp." },
          { mode: "minor", name: "Smoky Descent", chords: ["1min9", "b7dom13", "b6maj7", "5dom7b9"], why: "The bass walks down 1, b7, b6, 5 and the harmonic minor 5 snaps you back to the top. Moody with a little Latin heat." },
          { mode: "minor", name: "Rainy Window", chords: ["1min11", "b3maj7", "4min9", "b6maj9:2", "5sus9:2"], why: "An open min11 home, a glimpse of the relative major, then a sus 5 that hangs in the air. Reflective and grown." }
        ],
        verse: [
          { mode: "major", name: "Turnaround Pocket", chords: ["2min9", "5dom13", "1maj9", "6dom7b9"], why: "A colorful 2 5 1 with the 6 dominant pushing right back into the 2. Smooth, endless, and it leaves plenty of room for the vocal." },
          { mode: "major", name: "Tonic Pedal Drift", chords: ["1maj9", "4maj9/1", "1six9", "4maj9/1"], why: "The bass sits on home while the 4 floats on top. Calm and spacious, perfect for a laid back verse." },
          { mode: "major", name: "Borrowed Ache", chords: ["1maj9", "6min9", "4maj9", "4min9"], why: "Plain diatonic chords until the 4 flips to minor at the end of the loop. That last bar adds a bittersweet tug every time around." },
          { mode: "major", name: "Eight Bar Story", chords: ["1maj7", "7m7b5:2", "3dom7:2", "6min9", "5min7:2", "1dom9:2", "4maj9", "4min9:2", "b7dom9:2", "3min7:2", "6min7:2", "2min9:2", "5dom13:2"], why: "A full jazz flavored journey: a 2 5 into the 6, a 2 5 into the 4, then the backdoor and a 3 6 2 5 home. Eight bars that never sit still." },
          { mode: "major", name: "Three Six Glide", chords: ["3min7", "6min9", "2min9", "5sus9"], why: "Starts on the 3 instead of home, so it feels like you are already in motion. Each root falls a fifth, ending on a floaty sus 5." },
          { mode: "minor", name: "Dorian Cruise", chords: ["1min9:8", "4dom9:8"], why: "Minor 1 to a dominant 4 is the Dorian sound. Dark and bright at the same time, a perfect head nod groove." },
          { mode: "minor", name: "Fourths Cycle", chords: ["1min9", "4min9", "b7dom13", "b3maj9"], why: "Every root moves up a fourth, landing on the relative major before looping. Rich, flowing and very R&B." },
          { mode: "minor", name: "Half Dim Sway", chords: ["1min9", "2m7b5:2", "5dom7b9:2", "1min9", "b6maj7:2", "5dom7b9:2"], why: "Two little minor cadences that rock back and forth. Tense but smooth, great under a breathy vocal." }
        ],
        pre: [
          { mode: "major", name: "Stair Climb", chords: ["2min9", "3min7", "4maj9", "4maj7/5"], why: "The bass climbs 2, 3, 4, 5 one step at a time and ends on the 4 over 5 sus dominant. Builds tension without getting loud." },
          { mode: "major", name: "Secondary Push", chords: ["6min9", "3dom7b9", "6min9:2", "2dom9:2", "5sus9"], why: "The 3 dominant pulls into the 6, then the 2 dominant drives to a sus 5. Each move points at the next, so the chorus feels inevitable." },
          { mode: "major", name: "Borrowed Rise", chords: ["4maj9", "4min9", "3min7:2", "6dom7b9:2", "2min9:2", "5dom13:2"], why: "Major 4 to minor 4 for the ache, then a quick 3 6 2 5 with chords every two beats. The harmonic rhythm speeds up right into the chorus." },
          { mode: "major", name: "Chromatic Creep", chords: ["4maj9:2", "#4m7b5:2", "5sus9:2", "#5dim7:2", "6min9", "5dom7b9"], why: "The bass sneaks up by half steps from 4 to 6, then falls back to a b9 dominant. Suspenseful and churchy in the best way." },
          { mode: "major", name: "Tritone Tease", chords: ["3min7", "6min7", "2min9:2", "b6dom9:2", "5sus9"], why: "The b6 dominant is a tritone sub for the 2 dominant, so it slides down a half step into the sus 5. Slick chromatic bass right before the hook." },
          { mode: "minor", name: "Tension Stack", chords: ["4min9", "5min7", "b6maj7", "5dom7b9"], why: "The bass rises 4, 5, b6, then the harmonic minor 5 grabs you. Climbs steadily and ends begging to resolve." },
          { mode: "minor", name: "Rising Bass", chords: ["b6maj9", "b7dom9", "1min9:2", "4min9:2", "2m7b5:2", "5dom7b9:2"], why: "b6 to b7 lifts you up, then a fast minor 2 5 tightens everything. The quick chords at the end spike the energy." },
          { mode: "minor", name: "Sus Hover", chords: ["4min9", "b7dom13", "b6maj9", "5sus9:2", "5dom7b9:2"], why: "The sus 5 floats for two beats before the b9 drops in. That tiny delay makes the chorus landing feel huge." }
        ],
        chorus: [
          { mode: "major", name: "The 4 3 6", chords: ["4maj9", "3dom7b9", "6min9:2", "5min7:2", "1dom9"], why: "The signature neo soul move into the relative minor, then a 2 5 of the 4 sends you right back around. Feels like arrival and motion at once." },
          { mode: "major", name: "Backdoor Home", chords: ["4maj9", "4min9:2", "b7dom13:2", "3min7:2", "6min9:2", "2min9:2", "5dom13:2"], why: "Opens wide on the 4, sneaks through the backdoor, then rides a quick 3 6 2 5. Lush and emotional, made for a big hook." },
          { mode: "major", name: "Big Arrival", chords: ["1maj9", "3dom7b9", "6min9", "1dom9", "4maj9", "4min9", "3min7:2", "6dom7b9:2", "2min9:2", "5dom13:2"], why: "Home, a chain of secondary dominants, the borrowed 4 minor, then a turnaround. Eight bars that feel like a full sunrise." },
          { mode: "major", name: "Chromatic Slide", chords: ["4maj7", "3min7", "b3maj7", "2min9:2", "5sus9:2"], why: "The bass drops by half steps 4, 3, b3, 2 with a borrowed b3 major 7 in the middle. Smooth and sophisticated, very Rhodes friendly." },
          { mode: "major", name: "Relative Minor Hook", chords: ["6min9", "2min9:2", "5dom13:2", "1maj9", "3dom7b9"], why: "Opens on the 6 for an emotional start, then a 2 5 1 and the 3 dominant pulls back to the top. Stands apart from a verse that starts on home." },
          { mode: "minor", name: "Rise to the One", chords: ["b6maj9", "b7dom13", "1min9:6", "5dom7b9:2"], why: "b6 to b7 to 1 is a big minor key lift, and the quick harmonic minor 5 kicks you back around. Anthemic but still smoky." },
          { mode: "minor", name: "Dorian Bloom", chords: ["1min9", "4dom9", "b3maj7", "b6maj7:2", "5dom7b9:2"], why: "The Dorian 4 dominant brightens the minor home, then the relative major and b6 open up the sound. Hopeful minor." },
          { mode: "minor", name: "Full Circle", chords: ["4min9", "b7dom13", "b3maj9", "b6maj9", "2m7b5", "5dom7b9", "1min9:8"], why: "A complete cycle of fourths through the whole key, landing on a long minor 9 home. Eight bars of pure R&B gravity." }
        ],
        bridge: [
          { mode: "major", name: "Relative Minor Detour", chords: ["6min9", "3min7", "4maj9", "3dom7b9"], why: "Shifts the center to the relative minor, and the final 3 dominant can slide deceptively into the chorus. Feels like a new room in the same house." },
          { mode: "major", name: "Borrowed Skies", chords: ["b6maj9", "b7dom13", "1maj9:2", "6min9:2", "2min9:2", "5sus9:2"], why: "Two borrowed chords lift you up to home, then a fast 1 6 2 5 brings you back to the chorus. A fresh color that still connects." },
          { mode: "major", name: "Mediant Escape", chords: ["b3maj9", "b6maj9", "b2maj9", "1maj9", "4min9", "b7dom13", "3min7:2", "6dom7b9:2", "2min9:2", "5sus9:2"], why: "Borrowed maj9 chords drift by fourths and land home by half step, then a backdoor and turnaround reset you. Bold and cinematic." },
          { mode: "major", name: "Tritone Bridge", chords: ["3min7", "b3dom9", "2min9", "b2dom9"], why: "Minor 7 chords alternate with tritone sub dominants so the bass slides down by half steps. Jazzy tension that falls straight into the 1." },
          { mode: "major", name: "Line Down", chords: ["6min9", "6min7/5", "4maj9", "4maj7/5"], why: "The bass steps down 6, 5, 4 and lands on the sus dominant. A simple falling line that feels heartfelt." },
          { mode: "minor", name: "Major Light", chords: ["b3maj9", "b7dom13", "b6maj9", "5sus9"], why: "Moves into the relative major world for a break from the minor mood. The sus 5 at the end brings you back with a soft pull." },
          { mode: "minor", name: "Dorian Window", chords: ["4dom9:8", "b6maj9", "5dom7b9"], why: "Two bars on the bright Dorian 4 opens a window of light, then b6 to a b9 dominant pulls the curtain back." },
          { mode: "minor", name: "Neapolitan Drift", chords: ["b6maj9", "b2maj9", "b6maj9", "5dom7b9"], why: "The b2 major is the Neapolitan chord, a half step above home. It adds a mysterious, almost classical shade before the dominant." }
        ],
        outro: [
          { mode: "major", name: "Backdoor Fade", chords: ["4maj9", "4min9:2", "b7dom13:2", "1maj9:8"], why: "4 major, 4 minor, the backdoor dominant, then a long hold on home. A gentle sigh to end on." },
          { mode: "major", name: "Tonic Shimmer", chords: ["1maj9:2", "4maj9/1:2", "1maj9:2", "4maj9/1:2", "1six9:8"], why: "Rocking between home and the 4 over a tonic pedal, then a long 6/9 to close. Like the lights slowly going down." },
          { mode: "major", name: "Endless Two Five", chords: ["2min9", "5dom13", "3min7:2", "6dom7b9:2", "2min9:2", "5sus9:2"], why: "A turnaround that never quite resolves, made for a long fade while the vocalist ad libs." },
          { mode: "major", name: "Tritone Landing", chords: ["2min9:2", "b2dom9:2", "1maj9:8", "b2maj9:2", "1six9:2"], why: "A tritone sub cadence, then a quick b2 major 9 neighbor chord kisses home one last time. Classy and final." },
          { mode: "major", name: "Rise and Rest", chords: ["b6maj9", "b7dom9", "1maj9:8"], why: "Borrowed b6 and b7 rise into a big maj9 home. Warm, triumphant, and soft at the same time." },
          { mode: "minor", name: "Last Call Vamp", chords: ["1min11:6", "4dom9:2", "1min11:6", "4dom9:2"], why: "A long minor 11 home with a quick Dorian 4 stab. Perfect for fading out on the groove." },
          { mode: "minor", name: "Picardy Glow", chords: ["4min9", "5dom7b9", "1maj9:8"], why: "A minor song that ends on a major 9 home chord. The surprise brightness feels like a final exhale." },
          { mode: "minor", name: "Smoke Rings", chords: ["1min11:6", "b7dom13:2", "b6maj9:6", "5dom7b9:2"], why: "Uneven chord lengths give a lazy, swaying fade. The dominant at the end keeps the loop turning." }
        ]
      }
    },

    /* ===================================================================== GOSPEL */
    gospel: {
      name: "Gospel",
      blurb: "Church harmony with walk ups, passing diminished chords, secondary dominants and big 2 5 1 cadences. Every bar is moving somewhere.",
      bpm: [60, 100],
      lift: true,
      structures: [
        { name: "Sunday classic", sections: ["intro", "verse", "pre", "chorus", "verse", "pre", "chorus", "bridge", "chorus", "outro"] },
        { name: "Praise build", sections: ["intro", "verse", "chorus", "verse", "chorus", "bridge", "bridge", "chorus", "chorus", "outro"] },
        { name: "Ballad", sections: ["intro", "verse", "chorus", "bridge", "chorus", "outro"] }
      ],
      banks: {
        intro: [
          { mode: "major", name: "Walk Up Welcome", chords: ["1maj", "1maj/3:2", "4maj:2", "#4dim7:2", "1maj/5:2", "5sus4:2", "5dom7:2"], why: "Home, then the classic bass walk 3, 4, sharp 4, 5 into a sus resolution. Sounds like the organist calling the church to stand." },
          { mode: "major", name: "Church Turnaround", chords: ["1maj9:2", "1dom7/3:2", "4maj7:2", "#4dim7:2", "1maj/5:2", "6dom7b9:2", "2min9:2", "5dom13:2"], why: "A chord every two beats, each one pointing at the next: the 1 turns dominant, a walk up, then 6 2 5. Busy hands, rich sound." },
          { mode: "major", name: "Plagal Praise", chords: ["1maj", "4maj/1", "1maj", "4min6/1"], why: "Home and the 4 over a tonic pedal, then the 4 minor 6 for that Amen color. Slow and reverent." },
          { mode: "major", name: "Passing Diminished", chords: ["1maj7:2", "#1dim7:2", "2min7:2", "#2dim7:2", "1maj/3:2", "6dom7b9:2", "2min7:2", "5dom7:2"], why: "Diminished chords fill every gap so the bass climbs 1, sharp 1, 2, sharp 2, 3. Pure church chromatic glue." },
          { mode: "major", name: "Hymn Line", chords: ["1maj", "5maj/7", "6min", "1maj/5", "4maj", "1maj/3", "2min7", "5dom7"], why: "The bass walks straight down the scale under simple hymn chords, then the 2 5 brings it home. Timeless and warm." },
          { mode: "minor", name: "Minor Moan", chords: ["1min9", "4min9", "2m7b5:2", "5dom7b9:2", "1min9"], why: "Minor 1 to 4, then a tight minor 2 5 back home. Heavy and soulful, like the choir humming before the song starts." },
          { mode: "minor", name: "Minor Line Cliche", chords: ["1min:2", "1min/7:2", "1min7/b7:2", "4dom7/6:2", "b6maj7", "5dom7b9"], why: "The bass falls 1, 7, b7, 6 under a held minor chord, then b6 to the dominant. Dramatic and theatrical." },
          { mode: "minor", name: "Minor Walk Up", chords: ["4min7:2", "#4dim7:2", "1min/5:2", "5dom7b9:2", "1min9:8"], why: "The minor key walk up: 4, sharp 4 diminished, 1 over 5, dominant, home. Pleading and powerful." }
        ],
        verse: [
          { mode: "major", name: "One to One Seven", chords: ["1maj", "1dom7", "4maj", "4min6"], why: "Home turns into a dominant that pushes to the 4, then the 4 minor 6 pulls back home. The bread and butter of church verses." },
          { mode: "major", name: "Secondary Chain", chords: ["1maj9", "3dom7b9", "6min9", "6dom7b9", "2min9", "5dom13", "1maj9", "5sus9"], why: "Each dominant is the 5 of the next chord, a classic chain from 3 to 6 to 2 to 5. Eight bars that keep pulling forward." },
          { mode: "major", name: "Steady Hymn", chords: ["1maj", "4maj/1", "1maj/3:2", "4maj:2", "5sus4:2", "5maj:2"], why: "A plagal pedal, then a little walk up into a sus to major 5. Gentle and steady under the story." },
          { mode: "major", name: "Two Five Chain", chords: ["1maj9", "7m7b5:2", "3dom7b9:2", "6min9:2", "2dom9:2", "2min9:2", "5dom7b9:2"], why: "A minor 2 5 into the 6, then the 2 shifts from dominant to minor before the 5. Lots of motion in two beat bites." },
          { mode: "major", name: "Pocket Praise", chords: ["1maj9", "6min9", "4maj9", "4maj7/5"], why: "A simple 1 6 4 with the 4 over 5 sus dominant at the end. Contemporary gospel at its smoothest." },
          { mode: "minor", name: "Minor Plea", chords: ["1min9:8", "4min9", "5dom7b9"], why: "Two bars of home, then the 4 and a harmonic minor dominant. Space for a heartfelt testimony." },
          { mode: "minor", name: "Minor Cycle", chords: ["1min7", "4min7", "b7dom7", "b3maj7", "b6maj7", "2m7b5", "5dom7b9:8"], why: "Walks the entire minor key in fourths, then hangs on the dominant for two bars. Serious and moving." },
          { mode: "minor", name: "Altar Call", chords: ["1min9", "b6maj7", "4min7:2", "5dom7b9:2", "1min9"], why: "Home, the warm b6, then a quick 4 to 5 back to home. Emotional but grounded." }
        ],
        pre: [
          { mode: "major", name: "Walk to the Five", chords: ["4maj", "#4dim7", "1maj/5", "5sus9:2", "5dom7b9:2"], why: "The 4, the sharp 4 diminished and 1 over 5 build the walk up, then a sus 5 cracks open into a b9 dominant. Maximum anticipation." },
          { mode: "major", name: "Two Dom Build", chords: ["6min7", "2dom9", "4maj7/5:8"], why: "The 2 dominant brightens things, then two whole bars of the 4 over 5 sus dominant hold everyone in suspense." },
          { mode: "major", name: "Chromatic Climb", chords: ["4maj7:2", "#4dim7:2", "1maj/5:2", "#5dim7:2", "6min7:2", "6dom7/#1:2", "2min9:2", "5dom7b9:2"], why: "The bass climbs by half steps from 4 up to 2 with diminished and dominant passing chords, then hits the 5. Builds like a choir swelling." },
          { mode: "major", name: "Plagal Tension", chords: ["4maj9", "4min6", "1maj/3", "2min7:2", "5sus9:2"], why: "4 major to 4 minor 6 for the ache, then 1 over 3 and a quick 2 into a sus 5. An emotional build that leans forward." },
          { mode: "major", name: "Three Six Push", chords: ["3dom7b9", "6min7", "2dom7", "5sus9:2", "5dom7b9:2"], why: "Secondary dominants chained from 3 to 6 to 2, then the sus 5 breaks into a b9. Every bar has a destination." },
          { mode: "minor", name: "Minor Climb", chords: ["4min7", "#4dim7", "1min/5", "5dom7b9"], why: "The bass climbs 4, sharp 4, 5 under rising tension, and the b9 dominant demands resolution." },
          { mode: "minor", name: "Dark Lift", chords: ["b6maj7", "b7dom9", "2m7b5:2", "5sus9:2", "5dom7b9"], why: "b6 to b7 lifts, the half diminished 2 darkens, then the sus 5 resolves into the b9 dominant. A slow burn." },
          { mode: "minor", name: "Pleading Steps", chords: ["4min9", "b7dom13", "b3maj7", "5dom7b9"], why: "A 2 5 1 into the relative major, then a sudden harmonic minor dominant snaps you back to minor." }
        ],
        chorus: [
          { mode: "major", name: "Shout Chorus", chords: ["4maj", "1maj/3", "2min7", "5sus9", "4maj", "1maj/3", "2min7:2", "5dom7:2", "1maj"], why: "Starts on the 4 for that lift, the bass walks down 4, 3, 2, and the second time a 2 5 1 lands it. Choir hands go up here." },
          { mode: "major", name: "Big Praise", chords: ["1maj", "1dom7/3", "4maj", "4min6", "1maj/5", "6dom7b9", "2min9:2", "5dom13:2", "1maj"], why: "Home goes dominant, the 4 goes minor plagal, then the 6 dominant launches a big 2 5 1. Every classic church move in eight bars." },
          { mode: "major", name: "Relative Minor Shout", chords: ["6min9", "3dom7b9", "6min9", "1dom7", "4maj9", "#4dim7", "1maj/5:2", "6dom7b9:2", "2min9:2", "5dom7b9:2"], why: "Opens on the 6 with its own dominant, then the 1 dominant pushes to the 4 and a walk up turnaround takes over. Passionate and driving." },
          { mode: "major", name: "Sus Anthem", chords: ["1maj9", "4maj7/5", "4maj9", "4min6"], why: "Home to the sus dominant, then the 4 sighs into the minor 6. Simple, modern worship gospel." },
          { mode: "major", name: "Four Five Three Six", chords: ["4maj:2", "5maj/4:2", "1maj/3:2", "6min7:2", "2min7:2", "5dom7:2", "1maj"], why: "The bass walks 4, 4, 3, 6, 2, 5, 1 with the 5 over the 4 in bar one. The famous gospel cadence that everybody sings along to." },
          { mode: "minor", name: "Minor Shout", chords: ["1min9", "4min9", "b7dom13", "b3maj7", "b6maj7", "2m7b5:2", "5dom7b9:2", "1min9:8"], why: "A full cycle through the minor key with a quick 2 5 and a long landing. Big and dramatic." },
          { mode: "minor", name: "Minor Plagal Shout", chords: ["4min9", "1min9", "4min9", "5dom7b9"], why: "Starts on the 4 so the chorus feels different from the verse, then the dominant drives it home." },
          { mode: "minor", name: "Relative Major Shout", chords: ["b6maj9", "b7dom9", "b3maj9", "5dom7b9"], why: "b6 to b7 lands on the relative major for a burst of light, then the dominant drags you back to minor." }
        ],
        bridge: [
          { mode: "major", name: "Circle Vamp", chords: ["3min7", "6dom7b9", "2min9", "5dom13"], why: "A 3 6 2 5 circle that can repeat forever while the choir climbs. Built for vamping and key changes." },
          { mode: "major", name: "Minor Plagal Bridge", chords: ["4maj9", "4min6", "3min7", "6dom7b9", "2min9", "b2dom7", "1maj9", "5sus9"], why: "Minor plagal into a secondary chain, then the tritone sub slides home and the sus 5 resets for the chorus." },
          { mode: "major", name: "Testimony Line", chords: ["6min7", "6min7/5", "2dom7/#4:2", "4maj7:2", "3dom7b9"], why: "The bass walks down 6, 5, sharp 4, 4, 3 under the relative minor. A heartfelt falling line that ends pulling to the 6." },
          { mode: "major", name: "Diminished Ladder", chords: ["1maj/3:2", "4maj:2", "#4dim7:2", "1maj/5:2", "#5dim7:2", "6min7:2", "2dom9:2", "5sus9:2"], why: "Diminished chords on every rung as the bass climbs from 3 to 6, then the 2 dominant and sus 5 set up the chorus." },
          { mode: "major", name: "Borrowed Key Bridge", chords: ["4min7", "b7dom9", "b3maj7", "b6maj7", "2m7b5", "5dom7b9", "1maj9", "5sus9"], why: "A 2 5 1 into the borrowed b3, then a minor 2 5 brings you back home. Feels like visiting another key for a moment." },
          { mode: "minor", name: "Rising Vamp", chords: ["4min7", "5min7", "b6maj7", "5dom7b9"], why: "The bass climbs 4, 5, b6, then falls into the dominant. Great for a choir vamp that grows each time." },
          { mode: "minor", name: "Relative Major Testimony", chords: ["b3maj9", "b6maj9", "2m7b5:2", "5dom7b9:2", "1min9"], why: "Relative major to b6 for hope, then a minor 2 5 back home. Light breaking through." },
          { mode: "minor", name: "Neapolitan Plea", chords: ["b6maj7", "b2maj7", "5sus9:2", "5dom7b9:2", "1min9"], why: "The b2 major is the Neapolitan chord, and it leans dramatically into the 5. Old school church drama." }
        ],
        outro: [
          { mode: "major", name: "Amen Ending", chords: ["4maj", "4min6", "1maj:8"], why: "The minor plagal Amen. The 4 minor 6 sighs into home for a long final hold." },
          { mode: "major", name: "Big Two Five One", chords: ["1maj/3:2", "4maj:2", "#4dim7:2", "1maj/5:2", "2min9:2", "5dom7b9:2", "1six9"], why: "A walk up, then a fat 2 5 1 into a 6/9. The classic church ending." },
          { mode: "major", name: "Triple Tag", chords: ["3min7", "6dom7b9", "2min9", "5dom13", "3min7", "6dom7b9", "2min9:2", "5dom7b9:2", "1maj9"], why: "Tags the ending with a 3 6 2 5 turnaround, then does it again faster before finally landing. Everybody knows it is coming and loves it." },
          { mode: "major", name: "Organ Pedal Fade", chords: ["1maj9", "4maj9/1", "1maj9", "4min6/1"], why: "Home and the plagal 4 chords over a held tonic, like an organ sustaining the last note." },
          { mode: "major", name: "Tritone Finale", chords: ["2min9", "b2dom9", "1maj9:8"], why: "The 2 into the tritone sub, sliding down by half steps into a long final maj9." },
          { mode: "minor", name: "Minor Amen", chords: ["4min9", "4min6", "1min9:8"], why: "The minor 4 shifts to a minor 6 for a Dorian glow, then a long minor home. A peaceful ending." },
          { mode: "minor", name: "Picardy Praise", chords: ["4min7", "5dom7b9", "1maj:8"], why: "A minor song that ends on a major home chord. The last chord feels like hope winning." },
          { mode: "minor", name: "Final Cry", chords: ["b6maj7", "5dom7b9", "1min9:8"], why: "The warm b6 falls to the dominant, then a long minor 9 home. Weighty and complete." }
        ]
      }
    },

    /* ===================================================================== INDIE AND POP */
    pop: {
      name: "Indie and pop",
      blurb: "Strong simple triads with sparkle from add9 and sus colors, borrowed chords for emotion, and hooks that land hard.",
      bpm: [85, 125],
      lift: true,
      structures: [
        { name: "Radio", sections: ["intro", "verse", "pre", "chorus", "verse", "pre", "chorus", "bridge", "chorus", "outro"] },
        { name: "Indie simple", sections: ["intro", "verse", "chorus", "verse", "chorus", "chorus", "outro"] },
        { name: "Big pop", sections: ["intro", "verse", "pre", "chorus", "verse", "pre", "chorus", "bridge", "chorus", "chorus", "outro"] }
      ],
      banks: {
        intro: [
          { mode: "major", name: "Bright Strum", chords: ["1add9:2", "5maj/7:2", "6min:2", "4add9:2", "1add9:2", "5maj/7:2", "4add9"], why: "The 1 5 6 4 family with sparkly add9 colors and a stepwise bass. Instantly catchy and bright." },
          { mode: "major", name: "Pedal Shimmer", chords: ["1maj", "4maj/1", "1maj", "5maj/1"], why: "The bass stays on home while the 4 and 5 shimmer above it. Indie and spacious." },
          { mode: "major", name: "Sus Glow", chords: ["1sus2:2", "1maj:2", "4sus2:2", "4maj:2", "6min:2", "5sus4:2", "5maj"], why: "Each chord opens as a sus and then settles. Gentle motion that sounds like a guitar ringing out." },
          { mode: "major", name: "Relative Tease", chords: ["6min", "4maj", "1maj", "5sus4:2", "5maj:2"], why: "Starts on the relative minor for an emotional feel and ends on a sus 5 that resolves. Hooky from the jump." },
          { mode: "major", name: "Indie Drone", chords: ["1add9:8", "4add9/1:8"], why: "Two chords over one bass note. Hypnotic and airy, great with a big reverb guitar." },
          { mode: "minor", name: "Minor Pedal", chords: ["1min", "b6maj/1", "1min", "b7maj/1"], why: "The minor home holds in the bass while b6 and b7 move on top. Moody and modern." },
          { mode: "minor", name: "Dark Strum", chords: ["1min", "b7maj", "b6maj", "b7maj"], why: "Minor home swinging between the b7 and b6. Driving and dramatic." },
          { mode: "minor", name: "Harmonic Tease", chords: ["1min", "b6maj", "4min", "5maj"], why: "Natural minor until the major 5 at the end tugs you back home. Cinematic." }
        ],
        verse: [
          { mode: "major", name: "Classic Four", chords: ["1maj", "5maj", "6min", "4maj"], why: "The most famous loop in pop for a reason. Stable, singable, and it never gets in the way of the melody." },
          { mode: "major", name: "Stepping Down", chords: ["1maj", "5maj/7", "6min", "1maj/5", "4maj", "1maj/3", "2min", "5sus4"], why: "The bass walks down the scale one note per bar while the chords stay simple. Storytelling energy." },
          { mode: "major", name: "Dream Two Step", chords: ["1add9:8", "4maj7:8"], why: "Two chords, two bars each. Lets the vocal carry everything, very indie bedroom pop." },
          { mode: "major", name: "Borrowed Ache", chords: ["1maj", "3min", "4maj", "4min"], why: "Ends on the borrowed minor 4, so each loop has a little heartbreak. A favorite indie move." },
          { mode: "major", name: "Sus Steady", chords: ["1sus4:2", "1maj:2", "5sus4:2", "5maj:2", "6min", "4add9"], why: "Sus chords that resolve inside each bar create gentle motion under the vocal." },
          { mode: "minor", name: "Moody Steps", chords: ["1min", "4min", "b6maj", "b7maj"], why: "Minor 1 and 4, then b6 to b7 climbs back toward home. Brooding but moving forward." },
          { mode: "minor", name: "Dorian Bounce", chords: ["1min:8", "4maj:8"], why: "Minor home to a major 4 is the Dorian sound. Cool and a little hopeful." },
          { mode: "minor", name: "Low Key", chords: ["1min", "b3maj", "b7maj", "4min"], why: "Minor home, the relative major and b7, then the minor 4 sets up the loop. Laid back and introspective." }
        ],
        pre: [
          { mode: "major", name: "Climb and Hang", chords: ["4maj", "5maj", "6min", "5sus4:2", "5maj:2"], why: "The bass climbs 4, 5, 6, then a sus 5 hangs before resolving. Lifts right into the chorus." },
          { mode: "major", name: "Stair Step", chords: ["2min", "3min", "4maj", "5maj"], why: "Straight up the scale from 2 to 5. Simple, obvious in the best way, and it builds every time." },
          { mode: "major", name: "Bittersweet Build", chords: ["4maj", "4min", "1maj/5", "5maj"], why: "Major 4 to borrowed minor 4, then 1 over 5 into the 5. Emotional tension that wants release." },
          { mode: "major", name: "Tension Spark", chords: ["6min", "4maj", "1maj/5", "3maj"], why: "Ends on a major 3 chord, the 5 of the 6, so the chorus can explode on the 6 or fake out to the 4. Unexpected and exciting." },
          { mode: "major", name: "Soft Launch", chords: ["4maj", "6min", "4maj", "4maj/5"], why: "The 4 over 5 at the end is a soft sus dominant. Modern pop polish." },
          { mode: "major", name: "Hold Your Breath", chords: ["6min", "4maj", "5sus4:6", "5maj:2"], why: "A long sus 5 holds the tension for a bar and a half before resolving right at the end. Maximum anticipation." },
          { mode: "minor", name: "Dark Build", chords: ["b6maj", "b7maj", "b6maj", "5maj"], why: "Rocks between b6 and b7, then the major 5 adds a leading tone right before the chorus." },
          { mode: "minor", name: "Wind Up", chords: ["4min", "b6maj", "b7maj:8"], why: "Climbs to the b7 and holds it for two bars, coiling up energy for the drop." },
          { mode: "minor", name: "Sus Push", chords: ["b3maj", "b7maj", "4min", "5sus4:2", "5maj:2"], why: "Relative major color, then a minor 4 and a sus to major 5. Builds tension the pop way." }
        ],
        chorus: [
          { mode: "major", name: "Big Four Start", chords: ["4maj", "1maj", "5maj", "6min"], why: "Starting on the 4 makes the chorus feel like a lift. Big, open, and singable." },
          { mode: "major", name: "Six Four One Five", chords: ["6min", "4add9", "1maj", "5maj"], why: "The emotional rotation of the classic loop, starting on the relative minor. Anthemic and a little sad." },
          { mode: "major", name: "Mario Anthem", chords: ["1maj", "5maj", "6min", "4maj", "b6maj", "b7maj", "1maj:8"], why: "The classic loop, then the borrowed b6 to b7 lift into a long home. Pure victory." },
          { mode: "major", name: "Relative Minor Chorus", chords: ["6min", "5maj", "4maj", "5maj"], why: "Lives on the relative minor and swings through the 5 and 4. Driving and heartfelt." },
          { mode: "major", name: "Climb to Home", chords: ["4maj", "5maj", "1maj/3", "6min", "4maj", "5maj", "1maj:8"], why: "4 to 5 twice: the first time it slips to 1 over 3 and the 6, the second time it lands fully home. Classic pop payoff." },
          { mode: "major", name: "Mixolydian Shout", chords: ["1maj", "b7maj", "4maj", "1maj"], why: "The borrowed b7 gives a rock swagger that makes the chorus feel bigger and bolder." },
          { mode: "minor", name: "Minor Lift", chords: ["b6maj", "b3maj", "b7maj", "1min"], why: "Starts on the warm b6 and climbs back home. The minor anthem shape everyone feels." },
          { mode: "minor", name: "Epic Minor", chords: ["1min", "b6maj", "b3maj", "b7maj"], why: "Minor home, then three major chords. Dramatic and soaring, perfect for big drums." },
          { mode: "minor", name: "Harmonic Hook", chords: ["b6maj", "b7maj", "1min", "5maj"], why: "b6 to b7 to 1, then a major 5 pulls back to the top. Hooky and urgent." }
        ],
        bridge: [
          { mode: "major", name: "Relative Minor Turn", chords: ["6min", "3min", "4maj", "5maj"], why: "Centers the bridge on the relative minor and the 3, then climbs to the 5. A mood shift without leaving the key." },
          { mode: "major", name: "Parallel Universe", chords: ["b6maj", "b3maj", "b7maj", "5sus4"], why: "Three chords borrowed from the parallel minor, then a sus 5 to find home again. Feels like stepping into another world." },
          { mode: "major", name: "Four Minor Fall", chords: ["4maj", "4min", "1maj/3", "6min", "2min7", "1maj/3", "4maj", "5sus4"], why: "The borrowed minor 4 opens a reflective bridge, then the bass winds back up to a sus 5." },
          { mode: "major", name: "Secondary Spark", chords: ["6min", "3maj", "4maj", "2maj:2", "5maj:2"], why: "The major 3 and major 2 are secondary dominants that add bright surprises before the last chorus." },
          { mode: "major", name: "Breakdown Hold", chords: ["4add9:8", "5sus4", "5maj"], why: "Two bars of a floating 4, then a sus to major 5. Perfect for a stripped down breakdown before the final chorus." },
          { mode: "minor", name: "Relative Light", chords: ["b3maj", "b7maj", "b6maj", "5maj"], why: "The bridge moves into the relative major for some light, then the major 5 drags you back." },
          { mode: "minor", name: "Dorian Lift", chords: ["4maj", "b3maj", "4maj", "5maj"], why: "The major 4 brings Dorian brightness, rising to the major 5. Hopeful in a minor song." },
          { mode: "minor", name: "Neapolitan Turn", chords: ["b6maj", "b2maj", "b6maj", "5maj"], why: "The b2 major sits a half step above home. A dark, cinematic twist." }
        ],
        outro: [
          { mode: "major", name: "Plagal Close", chords: ["4maj", "4min", "1maj:8"], why: "4 major, 4 minor, home. A bittersweet goodbye that feels finished." },
          { mode: "major", name: "Sus Settle", chords: ["4add9", "5sus4:2", "5maj:2", "1sus2", "1maj"], why: "Everything resolves twice, first on the 5 and then on home. Soft and complete." },
          { mode: "major", name: "Pedal Fade", chords: ["1maj", "5maj/1", "4maj/1", "1maj"], why: "Chords drifting over a tonic pedal, made for fading out." },
          { mode: "major", name: "Deceptive Hang", chords: ["4maj", "5maj", "6min:8"], why: "Sets up home and lands on the relative minor instead. Ends the song on a question." },
          { mode: "major", name: "Mario Finish", chords: ["b6maj", "b7maj", "1maj:8"], why: "The borrowed b6 to b7 lift into a big final home chord. A triumphant ending." },
          { mode: "minor", name: "Minor Drift", chords: ["1min:8", "b6maj:8"], why: "Two long chords swaying back and forth for a hazy fade." },
          { mode: "minor", name: "Rise Home", chords: ["b6maj", "b7maj", "1min:8"], why: "Climbs up to minor home and holds. Strong and final." },
          { mode: "minor", name: "Picardy Surprise", chords: ["4min", "5maj", "1maj:8"], why: "Ends a minor song on a major home chord. A small sunrise at the end." }
        ]
      }
    },

    /* ===================================================================== MOTOWN */
    motown: {
      name: "Motown and classic soul",
      blurb: "Bright major triads and dom7 grooves driven by the bass, with secondary dominants and turnarounds that keep the dance floor moving.",
      bpm: [100, 130],
      lift: true,
      structures: [
        { name: "Hitsville classic", sections: ["intro", "verse", "chorus", "verse", "chorus", "bridge", "chorus", "outro"] },
        { name: "Soul revue", sections: ["intro", "verse", "pre", "chorus", "verse", "pre", "chorus", "bridge", "chorus", "chorus", "outro"] },
        { name: "Groove ride", sections: ["intro", "chorus", "verse", "chorus", "verse", "chorus", "outro"] }
      ],
      banks: {
        intro: [
          { mode: "major", name: "Doo Wop Spin", chords: ["1maj", "6min", "4maj", "5dom7"], why: "The 1 6 4 5 doo wop loop with a dominant 5. Instantly classic and danceable." },
          { mode: "major", name: "Bass Line Vamp", chords: ["1maj:2", "4maj:2", "1maj:2", "4maj:2", "1maj:2", "4maj:2", "5dom7"], why: "Bouncing 1 to 4 for the bass to groove on, then a dominant 5 hit. Built for a killer bass line." },
          { mode: "major", name: "Turnaround Kickoff", chords: ["1maj:2", "6dom7:2", "2min7:2", "5dom7:2", "1maj:2", "6dom7:2", "2min7:2", "5dom7:2"], why: "A fast 1 6 2 5 with the 6 as a dominant for extra snap. Gets feet moving right away." },
          { mode: "major", name: "Dominant Tease", chords: ["2dom7", "5dom7", "1maj:8"], why: "Two dominants in a row, the 5 of the 5 and then the 5, crash into home. Horn section energy." },
          { mode: "major", name: "Front Porch", chords: ["1maj", "1dom7", "4maj", "4min"], why: "Home turns dominant, lands on the 4, then the 4 goes minor to slide back home. Warm and classic." },
          { mode: "minor", name: "Minor Strut", chords: ["1min:8", "b6maj:2", "b7maj:2", "1min"], why: "Two bars of minor home, then a quick b6 b7 climb back. Cool and confident." },
          { mode: "minor", name: "Dorian Vamp", chords: ["1min7:2", "4dom7:2", "1min7:2", "4dom7:2", "1min7:2", "4dom7:2", "b7maj:2", "5dom7:2"], why: "Minor 1 to dominant 4 is a gritty soul groove, and the b7 to 5 tail turns it around." },
          { mode: "minor", name: "Heartbreak Opener", chords: ["1min", "4min7", "b6maj:2", "5dom7:2", "1min"], why: "Minor home to the 4, then b6 to the dominant 5 for a dramatic turn back home." }
        ],
        verse: [
          { mode: "major", name: "Ice Cream Changes", chords: ["1maj", "6min", "2min7", "5dom7"], why: "The classic 1 6 2 5 turnaround. Sweet and familiar, perfect under a story." },
          { mode: "major", name: "Strut", chords: ["1maj:8", "4maj", "5dom7"], why: "Two bars on home for the groove to settle, then 4 to 5. Let the bass and drums do the talking." },
          { mode: "major", name: "Secondary Ride", chords: ["1maj", "3dom7", "6min", "1dom7", "4maj", "2dom7", "5dom7:8"], why: "Each move is pushed by a secondary dominant: 3 to 6, 1 to 4, 2 to 5. Classic soul motion that keeps rolling." },
          { mode: "major", name: "Bounce", chords: ["1maj:2", "1maj/3:2", "4maj:2", "5dom7:2", "1maj:2", "6min:2", "4maj:2", "5dom7:2"], why: "Quick two beat chords with a walking bass. Bouncy and bright." },
          { mode: "major", name: "Soul Ladder", chords: ["1maj6", "2min7", "3min7", "2min7"], why: "Climbing 1, 2, 3 and back down with smooth 6 and 7 chords. Silky and sophisticated." },
          { mode: "minor", name: "Detroit Minor", chords: ["1min7", "4min7", "1min7", "5dom7"], why: "Minor 1 and 4 with a harmonic minor dominant at the end. Gritty and soulful." },
          { mode: "minor", name: "Dorian Groove", chords: ["1min7", "4dom7", "1min7", "4dom7"], why: "Minor 1 with a dominant 4, the funky Dorian sound. Lays down a deep pocket." },
          { mode: "minor", name: "Back Alley", chords: ["1min7", "b3maj", "4min7", "5dom7"], why: "Minor 1, a flash of the relative major, then 4 to 5. Moody and moving." }
        ],
        pre: [
          { mode: "major", name: "Stair Climb", chords: ["4maj:2", "5maj:2", "6min", "4maj:2", "5maj:2", "5dom7"], why: "4 to 5 to 6, then 4 to 5 again, ending on a full bar dominant. Builds excitement step by step." },
          { mode: "major", name: "Double Dominant", chords: ["6min", "2dom7", "5dom7:8"], why: "The 2 dominant pushes to the 5, then the 5 holds for two bars. A big build before the hook." },
          { mode: "major", name: "Fake Out", chords: ["4maj", "5dom7", "6min", "2min7:2", "5dom7:2"], why: "Sets up home, fakes to the 6, then a quick 2 5 really sets up the chorus." },
          { mode: "major", name: "Bass Walk Up", chords: ["1maj/3", "4maj", "#4dim7", "5dom7"], why: "The bass walks 3, 4, sharp 4, 5. Classic soul tension right into the hook." },
          { mode: "major", name: "Cycle Push", chords: ["3min7", "6dom7", "2min7", "5dom7"], why: "A 3 6 2 5 cycle with a dominant 6 for snap. Every root falls a fifth toward the chorus." },
          { mode: "minor", name: "Minor Launch", chords: ["b6maj", "b7maj", "5dom7:8"], why: "b6 to b7, then a long dominant 5. Like a drum roll into the chorus." },
          { mode: "minor", name: "Step Up", chords: ["4min7", "5min7", "b6maj", "5dom7"], why: "Climbs 4, 5, b6, then falls to the dominant. Builds and then demands resolution." },
          { mode: "minor", name: "Major Shadow", chords: ["b3maj", "b7maj", "b6maj", "5dom7"], why: "Relative major color drifting down to the harmonic minor 5. Bright, then tense." }
        ],
        chorus: [
          { mode: "major", name: "Four Start", chords: ["4maj", "5dom7", "1maj", "6min"], why: "Starting on the 4 makes the chorus burst open, and the 6 at the end loops back with feeling." },
          { mode: "major", name: "Hit Parade", chords: ["1maj", "6min", "4maj", "5dom7", "1maj", "6min", "2min7:2", "5dom7:2", "1maj"], why: "The doo wop loop twice, with a 2 5 turnaround the second time. Classic radio chorus energy." },
          { mode: "major", name: "Fake Out Hook", chords: ["1maj", "4maj", "5dom7", "6min", "4maj", "1maj/3", "2min7:2", "5dom7:2", "1maj"], why: "Goes to the 5 and fakes out to the 6, then walks down and lands home for real." },
          { mode: "major", name: "Secondary Hook", chords: ["1maj", "3dom7", "4maj", "5dom7"], why: "The 3 dominant promises the 6 but lands on the 4 instead, a sweet deceptive surprise." },
          { mode: "major", name: "Two Five Shout", chords: ["2min7", "5dom7", "1maj", "6dom7"], why: "Starts on the 2 so the chorus pushes forward, and the 6 dominant pulls right back to the 2." },
          { mode: "minor", name: "Minor Anthem", chords: ["b6maj", "b7maj", "1min:8"], why: "Climbs b6 to b7 to minor home and holds. Strong and proud." },
          { mode: "minor", name: "Minor Hook", chords: ["1min", "4min7", "b7dom7", "b3maj7"], why: "A cycle of fourths through the minor key landing on the relative major. Smooth and soulful." },
          { mode: "minor", name: "Harmonic Hook", chords: ["4min7", "5dom7", "1min", "b6maj:2", "5dom7:2"], why: "Starts on the 4 and leans on the dominant twice. Urgent and catchy." }
        ],
        bridge: [
          { mode: "major", name: "Minor Detour", chords: ["6min:2", "2dom7:2", "6min:2", "2dom7:2", "4maj", "5dom7"], why: "Vamps on the 6 with a bright 2 dominant, then climbs 4 to 5. A new color that still grooves." },
          { mode: "major", name: "Borrowed Turn", chords: ["4maj", "4min", "3min7", "6dom7", "2min7", "5dom7", "1maj", "5dom7"], why: "Major 4 to minor 4, then a 3 6 2 5 chain home. Bittersweet and classy." },
          { mode: "major", name: "Domino Bridge", chords: ["3dom7", "6dom7", "2dom7", "5dom7"], why: "Four dominants in a row, each the 5 of the next. Old school and full of momentum." },
          { mode: "major", name: "Flat Seven Surprise", chords: ["b7maj", "4maj", "1maj", "5dom7"], why: "The borrowed b7 opens the bridge, then falls in fourths back home. Gospel soul swagger." },
          { mode: "major", name: "Line Down", chords: ["1maj", "1maj/7", "1maj/b7", "4maj/6", "4min/b6", "1maj/5", "2dom7", "5dom7"], why: "The bass slides down by half steps from 1 to 5 under simple chords, then a double dominant leads back. Sophisticated and smooth." },
          { mode: "minor", name: "Major Escape", chords: ["b3maj", "b7maj", "4min", "5dom7"], why: "Steps into the relative major, then the minor 4 and the dominant bring you back." },
          { mode: "minor", name: "Dorian Bridge", chords: ["4dom7", "1min7", "4dom7", "5dom7"], why: "Starts on the dominant 4 for a funky lift, then the 5 dominant turns it around." },
          { mode: "minor", name: "Relative Major Groove", chords: ["b3maj7", "b6maj7", "2m7b5", "5dom7"], why: "Relative major and b6 for warmth, then a minor 2 5 back home." }
        ],
        outro: [
          { mode: "major", name: "Fade Turnaround", chords: ["1maj:2", "6min:2", "2min7:2", "5dom7:2", "1maj:2", "6min:2", "2min7:2", "5dom7:2"], why: "A fast 1 6 2 5 that loops forever while the track fades. The classic soul fade." },
          { mode: "major", name: "Big Finish", chords: ["4maj", "5dom7", "1maj6:8"], why: "4 to 5 to a long major 6 home chord. That vintage final hit." },
          { mode: "major", name: "Bass Vamp Fade", chords: ["1maj:2", "4maj:2", "1maj:2", "4maj:2", "1maj:2", "4maj:2", "1maj:2", "4maj:2"], why: "1 to 4 bouncing so the bass player can show off on the way out." },
          { mode: "major", name: "Tag It", chords: ["3min7:2", "6dom7:2", "2min7:2", "5dom7:2", "3min7:2", "6dom7:2", "2min7:2", "5dom7:2", "1maj6:8", "5dom7", "1maj6"], why: "Tags the ending twice with a 3 6 2 5, lands home, then one last 5 to 1 button." },
          { mode: "major", name: "Soft Landing", chords: ["4maj", "4min", "1maj:8"], why: "Major 4, minor 4, home. A bittersweet soul ending." },
          { mode: "minor", name: "Strut Out", chords: ["1min7:2", "4dom7:2", "1min7:2", "4dom7:2", "1min7:2", "4dom7:2", "1min7:2", "4dom7:2"], why: "A Dorian groove vamp to fade on. Keeps the pocket deep until the end." },
          { mode: "minor", name: "Picardy Finish", chords: ["4min7", "5dom7", "1maj:8"], why: "A minor song that ends on a major home chord. A bright surprise ending." },
          { mode: "minor", name: "Minor Fade", chords: ["1min", "b7maj", "b6maj", "5dom7"], why: "The bass walks down 1, b7, b6, 5 and loops. A dramatic fade." }
        ]
      }
    }
  },

  /* ===================================================================== ROLES */
  roles: {
    major: {
      "1": "Home. Everything resolves here, and a maj9 or 6/9 makes home feel plush.",
      "2": "The setup chord. The minor 2 is the first step of a 2 5 1 and loves a min9 or min11.",
      "3": "A soft cousin of the 1 that shares two of its notes, so it can stand in for home, and as a dom7 it pulls hard to the 6.",
      "4": "The lift. Moving to the 4 feels like opening a window, and it starts the neo soul 4 3 6.",
      "5": "Tension. The 5 wants to go home, and dressing it as a sus, 13 or b9 controls how badly.",
      "6": "Home with the lights dimmed. The relative minor, perfect for emotional choruses and deceptive cadences.",
      "7": "The leading tone chord. Usually half diminished, it acts like a quieter 5 or sets up the 3 dominant.",
      "b7": "Borrowed swagger. The flat 7 major brings rock and gospel confidence, and as a dom9 it is the backdoor dominant.",
      "b6": "Borrowed drama from the parallel minor. A big cinematic lift, especially going b6 to b7 to 1.",
      "b3": "Borrowed color from the parallel minor. Bluesy and unexpected, great for bridges and chromatic slides.",
      "b2": "The tritone sub. A dominant a half step above home that slides down into the 1.",
      "#1": "A passing diminished chord. It glues the 1 to the 2 with a chromatic bass step.",
      "#2": "A passing diminished chord between the 2 and the 1 over 3, walking the bass up by half steps.",
      "#4": "A passing diminished chord between the 4 and the 5. The gospel walk up lives here.",
      "#5": "A passing diminished chord between the 5 and the 6 that pushes into the relative minor.",
      "4min": "The borrowed minor 4. Instant bittersweet ache, the sound of the minor plagal Amen.",
      "1dom": "The 1 with a flat 7 added. It stops feeling like home and starts pulling to the 4.",
      "2dom": "The 5 of the 5. A major 2 with a flat 7 that pushes hard into the 5.",
      "3dom": "The 5 of the 6. Bright tension that drops into the relative minor.",
      "6dom": "The 5 of the 2. It turns the 6 bright and launches a 2 5 1."
    },
    minor: {
      "1": "Home in minor. Moody and grounded, and a min9 or min11 makes it smoky instead of sad.",
      "2": "Usually half diminished. The dark setup chord in a minor 2 5 1.",
      "b3": "The relative major. Opening up to it feels like sunlight through the clouds.",
      "4": "The minor 4. It deepens the mood, and as a dom9 it adds Dorian brightness.",
      "5": "The natural minor 5 is a soft, floaty minor chord with no strong pull home.",
      "b6": "The warm major chord in a minor key. Feels like hope, and loves to step up to the b7 or fall to the 5.",
      "b7": "The subtonic. A major or dom chord a whole step below home that walks you back to the 1 with no drama.",
      "5dom": "The harmonic minor 5. Borrowing the major 3rd gives a leading tone that pulls hard to the 1.",
      "6": "The raised 6 from Dorian or melodic minor. It shows up as a half diminished passing chord or as the bass under a 4 dom7.",
      "b2": "The Neapolitan. A major chord a half step above home that leans dramatically into the 5.",
      "4dom": "The Dorian 4. A major 4 with a flat 7 that brightens a minor groove without leaving it.",
      "#4": "A passing diminished chord between the 4 and the 5, the minor key walk up.",
      "1maj": "The Picardy third. Ending a minor song on a major 1 feels like a surprise sunrise."
    }
  },

  /* ===================================================================== SUBSTITUTIONS */
  subs: {
    "major|5:dom": [
      { to: "5dom13", why: "Same job with the 9 and 13 on top. Richer and more grown without changing the pull." },
      { to: "4maj7/5", why: "The 4 major 7 over the 5 bass is a sus dominant. A softer pull home, very neo soul and gospel." },
      { to: "5sus9", why: "Hides the 3rd so the chord floats. Resolve it to the plain 5 or straight to the 1." },
      { to: "b2dom7", why: "Tritone sub. It shares the same tritone as the 5, and the bass slides down a half step into the 1." },
      { to: "5dom7b9", why: "The b9 adds dark church tension that pulls even harder home." },
      { to: "7dim7", why: "A diminished 7 on the leading tone is a 5 dom7 b9 with no root. Lighter and more classical." }
    ],
    "major|5:maj": [
      { to: "5sus4", why: "Suspend it first and let it resolve for a classic pop cadence." },
      { to: "5dom7", why: "Adds the flat 7 for a stronger pull home." },
      { to: "5maj/7", why: "The leading tone in the bass steps smoothly up to the 1 or down to the 6." },
      { to: "4maj/5", why: "The 4 over the 5 bass is a soft sus dominant. Modern pop polish." },
      { to: "5add9", why: "A little sparkle on top without changing the job." }
    ],
    "major|1:maj": [
      { to: "1maj9", why: "Adds the 7 and 9 for a plush, neo soul home." },
      { to: "1six9", why: "The 6/9 is home with sparkle and no major 7 rub. A great final chord." },
      { to: "6min7", why: "The relative minor shares three notes with the 1 major 7. Same spot, sadder mood." },
      { to: "3min7", why: "The 3 minor shares the top of the 1 major 7, so it works as a softer home that keeps moving." },
      { to: "1maj/3", why: "First inversion lightens the bass and makes it easy to walk up to the 4." },
      { to: "4maj/1", why: "The 4 over a tonic pedal keeps the bass at home but adds motion on top." }
    ],
    "major|4:maj": [
      { to: "4maj9", why: "The maj9 color is the signature neo soul 4 chord." },
      { to: "4six9", why: "Bright and open with no major 7 rub. Sounds great in gospel and pop." },
      { to: "2min9", why: "The relative minor of the 4 shares most of its notes. Darker, same job." },
      { to: "4min6", why: "Borrowed minor plagal color. Bittersweet, the Amen sound." },
      { to: "#4m7b5", why: "Raises the bass a half step and pulls toward the 1 over 5 or the 5. A jazzy lift." },
      { to: "4maj/6", why: "First inversion puts the 6 in the bass, great for stepwise bass lines." }
    ],
    "major|4:min": [
      { to: "4min6", why: "The added 6 is the classic minor plagal sound in gospel." },
      { to: "4min9", why: "Adds the 9 for a softer, neo soul ache." },
      { to: "b7dom9", why: "The backdoor dominant does the same job with more push toward home." },
      { to: "b6maj7", why: "Shares the borrowed b6 note. Warmer and more cinematic." },
      { to: "2m7b5", why: "Same notes as the 4 minor 6 over a different bass. Darker, and it points at the 5." }
    ],
    "major|2:min": [
      { to: "2min9", why: "The 9 adds warmth. The default neo soul 2 chord." },
      { to: "2min11", why: "Stack the 11 for an open, airy sound that blends into the 5." },
      { to: "4maj7", why: "Shares three notes with the 2 minor 7, so it fills the same slot with a brighter color." },
      { to: "2dom7", why: "The 5 of the 5. Turns the 2 bright and pushes harder into the 5." },
      { to: "2m7b5", why: "Borrowed from minor. A darker setup that makes the 5 feel more dramatic." },
      { to: "4min7", why: "The borrowed minor 4 in the 2 slot. Darker, and it flows into the 5 or the b7 dominant." }
    ],
    "major|6:min": [
      { to: "6min9", why: "The 9 makes the relative minor smoky instead of sad." },
      { to: "6min11", why: "Open and modern, the 11 floats over the chord." },
      { to: "6dom7b9", why: "Turns the 6 into the 5 of the 2. Great when the next chord is the 2." },
      { to: "4maj7", why: "Shares three notes with the 6 minor 7. A brighter version of the same slot." },
      { to: "b6maj7", why: "After the 5, the borrowed b6 makes a deceptive cadence feel even more dramatic." },
      { to: "6min7/5", why: "Puts the 5 in the bass for a falling line from the 6 to the 4." }
    ],
    "major|3:min": [
      { to: "3min7", why: "Adds the 7 for smoother voice leading into the 6 or the 4." },
      { to: "3dom7", why: "The 5 of the 6. Bright tension that pulls into the relative minor." },
      { to: "3dom7b9", why: "The neo soul 4 3 6 color. Sweet and sour tension into the 6." },
      { to: "1maj/3", why: "Same bass note, but it sounds like home. Smooth for walk ups." },
      { to: "b3maj7", why: "A borrowed chord a half step lower. A chromatic, unexpected color in the same slot." }
    ],
    "major|7:half": [
      { to: "5dom9", why: "The half diminished 7 is the top of a 5 dom9. Adding the root makes the pull stronger." },
      { to: "7dim7", why: "Lower the 7th for more tension. Pulls hard to the 1 or sets up the 3 dominant." },
      { to: "5dom7/7", why: "The 5 dominant with the leading tone in the bass. Same pull, brighter sound." }
    ],
    "major|b7:maj": [
      { to: "b7dom9", why: "Add the flat 7 and 9 and it becomes the backdoor dominant into the 1." },
      { to: "b7maj9", why: "Lush borrowed color, great for planing moves." },
      { to: "4min7/b7", why: "The minor 4 over the b7 bass is a sus dominant. A neo soul favorite." },
      { to: "b7maj/2", why: "First inversion puts the 2 in the bass for a smooth step to the 1 or the 3." }
    ],
    "major|1:dom": [
      { to: "1dom9", why: "The 9 smooths it out and it still pulls to the 4." },
      { to: "1dom13", why: "Bluesy and full, a gospel favorite before the 4." },
      { to: "1dom7b9", why: "Darker tension that makes the 4 feel like a big arrival." },
      { to: "1dom7/3", why: "The 3 in the bass walks straight up to the 4. A classic church bass line." },
      { to: "b5dom7", why: "Tritone sub of the 1 dominant. The bass slides down a half step into the 4." }
    ],
    "major|2:dom": [
      { to: "2dom9", why: "The 9 makes it smoother and more R&B." },
      { to: "2dom7/#4", why: "The leading tone in the bass climbs right into the 5." },
      { to: "#4dim7", why: "The rootless version. The gospel walk up passing chord into the 1 over 5." },
      { to: "b6dom9", why: "Tritone sub of the 2 dominant. It slides down a half step into the 5." },
      { to: "2sus9", why: "Hangs the tension before the 5 for a smooth gospel ballad feel." }
    ],
    "major|3:dom": [
      { to: "3dom7b9", why: "The b9 sweetens the pull into the 6. A neo soul staple." },
      { to: "3dom7/#5", why: "The leading tone in the bass steps right up into the 6." },
      { to: "#5dim7", why: "A rootless 3 dom7 b9. Use it as a passing chord from the 5 to the 6." },
      { to: "b7dom9", why: "Tritone sub of the 3 dominant. The bass slides down a half step into the 6." },
      { to: "3sus9", why: "Suspends the tension before falling into the 6. Softer and modern." }
    ],
    "major|6:dom": [
      { to: "6dom7b9", why: "The b9 adds church darkness heading into the 2." },
      { to: "6dom7/#1", why: "Puts the leading tone in the bass so it steps up into the 2." },
      { to: "#1dim7", why: "The rootless version, the classic passing chord from the 1 to the 2." },
      { to: "b3dom9", why: "Tritone sub of the 6 dominant. The bass slides down a half step into the 2." },
      { to: "6sus9", why: "Suspends the pull for a softer, gospel ballad feel." }
    ],
    "major|#1:dim": [
      { to: "6dom7/#1", why: "Adds the root the diminished chord was hiding. Same bass, stronger pull into the 2." },
      { to: "6dom7b9", why: "The root position version with the b9, heavier and churchier." },
      { to: "b3dom9", why: "A tritone sub that points at the 2 from a half step above." }
    ],
    "major|#4:dim": [
      { to: "2dom7/#4", why: "The full 5 of the 5 over the same bass note. Brighter and stronger." },
      { to: "#4m7b5", why: "The half diminished version, softer and jazzier." },
      { to: "4min6", why: "Stay on the 4 bass with a minor plagal color instead. Turns the walk up into a sigh." },
      { to: "2dom9", why: "The root position 2 dominant, a cleaner Motown style push into the 5." }
    ],
    "major|b6:maj": [
      { to: "b6maj7", why: "Adds a dreamy major 7 to the borrowed chord." },
      { to: "b6maj9", why: "Even lusher, a neo soul staple." },
      { to: "b6dom9", why: "Turns it into a tritone sub of the 2 dominant, sliding down into the 5." },
      { to: "4min7", why: "Shares the borrowed b6 note. A softer, bittersweet version." },
      { to: "b6maj/1", why: "Puts the tonic in the bass so the borrowed color floats over home." }
    ],

    "minor|1:min": [
      { to: "1min9", why: "The 9 makes minor home smoky and grown instead of sad." },
      { to: "1min11", why: "Open and airy, the neo soul minor home." },
      { to: "1min6", why: "The raised 6 gives a Dorian, jazzy home." },
      { to: "b3maj7", why: "The relative major 7 shares three notes. Brighter, same spot." },
      { to: "1min/b3", why: "First inversion lifts the bass for a smoother walk." }
    ],
    "minor|4:min": [
      { to: "4min9", why: "Adds the 9 for a softer, lush 4." },
      { to: "4min6", why: "The added 6 is the Dorian color, and it points to the 5." },
      { to: "4dom9", why: "The Dorian 4. A major 3rd brightens it while the song stays minor." },
      { to: "2m7b5", why: "Shares three notes and heads straight into the 5. A darker setup." },
      { to: "b6maj7", why: "Shares two notes with a warmer, major color." }
    ],
    "minor|5:dom": [
      { to: "5dom7b9", why: "The b9 is a natural minor note, so it fits the key and adds drama." },
      { to: "5sus9", why: "Suspends the dominant for a floaty build before the b9 or home." },
      { to: "b2dom7", why: "Tritone sub. The bass slides down a half step into minor home." },
      { to: "7dim7", why: "A rootless 5 dom7 b9. A dark, classical way to point home." },
      { to: "4min7/5", why: "The minor 4 over the 5 bass. A soft sus dominant in minor." },
      { to: "5dom7/7", why: "The leading tone in the bass steps right up into home." }
    ],
    "minor|5:maj": [
      { to: "5dom7", why: "Add the flat 7 for a stronger pull home." },
      { to: "5dom7b9", why: "The b9 fits the minor key and adds drama." },
      { to: "5sus4", why: "Suspend it first and resolve for a classic cadence." },
      { to: "b7maj", why: "The natural minor b7 walks home by whole step, less dramatic." },
      { to: "5maj/7", why: "The leading tone in the bass steps right up into home." }
    ],
    "minor|5:min": [
      { to: "5min7", why: "Adds the 7 for a smoother R&B minor 5." },
      { to: "5min11", why: "Open and floaty, with no strong pull home." },
      { to: "5dom7b9", why: "Upgrade to the harmonic minor dominant for a real pull home." },
      { to: "5sus9", why: "Splits the difference: no 3rd, a gentle pull." },
      { to: "b7maj", why: "Shares two notes and walks you home by whole step." }
    ],
    "minor|b6:maj": [
      { to: "b6maj7", why: "The major 7 makes the b6 dreamy." },
      { to: "b6maj9", why: "Even lusher, the neo soul minor key favorite." },
      { to: "4min9", why: "Shares the core of the chord with a darker minor color." },
      { to: "2m7b5", why: "Shares two notes and pushes harder into the 5." },
      { to: "b6dom9", why: "Tritone sub of the 2 dominant. The bass falls a half step into the 5." }
    ],
    "minor|b7:dom": [
      { to: "b7dom9", why: "Adds the 9 for a smoother R&B dominant." },
      { to: "b7dom13", why: "Full and bright, the neo soul b7." },
      { to: "4min7/b7", why: "The minor 4 over the b7 bass, a sus sound that floats." },
      { to: "b7sus9", why: "The suspended version, a gentle pull to the relative major or home." },
      { to: "5dom7b9", why: "Swap in the harmonic minor 5 when you need a stronger pull home." }
    ],
    "minor|b7:maj": [
      { to: "b7add9", why: "Adds a little shimmer while keeping it simple." },
      { to: "b7dom7", why: "Adds the flat 7 so it points at the relative major." },
      { to: "b7sus4", why: "Suspend it and resolve for a pop cadence." },
      { to: "5min7", why: "Shares two notes. A softer minor color in the same slot." },
      { to: "5dom7", why: "The harmonic minor 5 pulls home with a leading tone." }
    ],
    "minor|b3:maj": [
      { to: "b3maj7", why: "The major 7 adds warmth to the relative major." },
      { to: "b3maj9", why: "Lush and open, a neo soul staple." },
      { to: "1min7", why: "Shares three notes. Same spot, back in the minor mood." },
      { to: "b3six9", why: "Bright and open without a major 7 rub." },
      { to: "b3maj/5", why: "First inversion with the 5 of the key in the bass for a smoother line." }
    ],
    "minor|2:half": [
      { to: "4min6", why: "The exact same notes over a different bass. A softer minor plagal color." },
      { to: "4min7", why: "Shares three notes and sounds less tense." },
      { to: "2min7", why: "The Dorian 2. Brighter and smoother." },
      { to: "b6dom9", why: "Tritone sub of the 2 dominant. The bass slides down into the 5." },
      { to: "2dom7b9", why: "The 5 of the 5. Pushes harder into the dominant." }
    ]
  },

  /* ===================================================================== LESSONS */
  lessons: [
    { id: "backdoor", title: "The backdoor 2 5", styles: ["neosoul", "gospel"], mode: "major",
      what: "Swap the normal 2 5 for the minor 4 and the flat 7 dominant. In C that is Fm7 to Bb9 landing on Cmaj9.",
      why: "Both chords are borrowed from the parallel minor, so they add a warm, wistful color. The Ab in both chords slides down to G inside the Cmaj9, super smooth voice leading.",
      how: "Use it at the end of a chorus or as the final cadence when a normal 5 to 1 feels too obvious.",
      ear: "Listen for the top note sinking a half step as you land, like sitting down on a soft couch.",
      plain: ["2min7", "5dom7", "1maj7:8"], pro: ["4min7", "b7dom9", "1maj9:8"] },

    { id: "borrowed4min", title: "The borrowed 4 minor", styles: ["pop", "neosoul", "motown"], mode: "major",
      what: "Play the 4 as a major chord, then flip it to minor before going home. In C that is F to Fm, then back to C.",
      why: "The minor 4 borrows one note, the flat 6, from the parallel minor. That note falls a half step to the 5th of the 1, which is pure bittersweet.",
      how: "Great at the end of a verse or chorus line where the lyric gets emotional.",
      ear: "Listen for one inner note dropping a half step while the bass stays on the 4.",
      plain: ["1maj", "3min", "4maj:8"], pro: ["1maj", "3min", "4maj", "4min"] },

    { id: "flat7", title: "The flat 7 chord", styles: ["pop", "motown", "gospel"], mode: "major",
      what: "Replace the 5 with a major chord built on the flat 7. In C that is Bb major instead of G.",
      why: "It borrows from Mixolydian and the parallel minor, so it resolves home without a leading tone. The return feels confident and rock solid instead of polite.",
      how: "Use it in choruses and outros that need swagger, or as a pickup chord into a big 1.",
      ear: "Listen for the cadence feeling more like a shout than a question.",
      plain: ["1maj", "4maj", "5maj", "1maj"], pro: ["1maj", "4maj", "b7maj", "1maj"] },

    { id: "mario", title: "The b6 b7 1 lift", styles: ["pop", "gospel"], mode: "major",
      what: "Approach the 1 by stepping up from the flat 6 to the flat 7, both major chords borrowed from the parallel minor. In C that is Ab to Bb to C.",
      why: "Three major chords marching up by whole steps feels heroic. The borrowed chords darken the moment right before the 1, so the arrival feels brighter.",
      how: "Use it at the very end of a chorus, as a final cadence, or as the setup into a last chorus.",
      ear: "Listen for the whole band climbing in parallel, like a victory fanfare.",
      plain: ["4maj", "5maj", "1maj:8"], pro: ["b6maj", "b7maj", "1maj:8"] },

    { id: "sec3to6", title: "Secondary dominant: 3 to 6", styles: ["motown", "gospel", "pop"], mode: "major",
      what: "Turn the minor 3 into a dominant 7 so it becomes the 5 of the relative minor. In C that is E7 instead of Em.",
      why: "The raised third of the chord, G sharp in C, is a leading tone that pulls straight up into the 6. You get a jolt of drama right before the minor chord.",
      how: "Drop it in verses or choruses right before the 6 minor. It is a classic soul and pop move.",
      ear: "Listen for that one bright, surprising note that makes the minor chord feel inevitable.",
      plain: ["1maj", "3min", "6min", "4maj"], pro: ["1maj", "3dom7", "6min", "4maj"] },

    { id: "one7to4", title: "1 to 1dom7 to 4", styles: ["gospel", "motown", "neosoul"], mode: "major",
      what: "Add a flat 7 to the 1 right before you move to the 4. For a moment the 1 becomes the 5 of the 4.",
      why: "The flat 7 sits a half step above the 3rd of the 4 chord, so it falls right into it. Home suddenly gets restless and launches you forward.",
      how: "Use it in the middle of a verse or at the top of a chorus when the move to the 4 needs more push.",
      ear: "Listen for the bluesy flat 7 that makes home sound unfinished.",
      plain: ["1maj:8", "4maj:8"], pro: ["1maj", "1dom7", "4maj:8"] },

    { id: "sec6to2", title: "Secondary dominant: 6 to 2", styles: ["motown", "gospel", "neosoul"], mode: "major",
      what: "Turn the 6 minor into a dominant with a b9 so it points at the 2. In C that is A7b9 instead of Am7.",
      why: "The C sharp leads up to D and the b9 on top leans down into the 2 chord. Every voice now has a reason to move.",
      how: "Use it in turnarounds and the last bars of a section to make the 1 6 2 5 cycle snap.",
      ear: "Listen for the darker, churchy tension right before the 2.",
      plain: ["1maj", "6min7", "2min7", "5dom7"], pro: ["1maj", "6dom7b9", "2min7", "5dom7"] },

    { id: "passdim", title: "Passing diminished chords", styles: ["gospel", "motown", "neosoul"], mode: "major",
      what: "Fill the gap between two chords a whole step apart with a diminished 7 on the note in between. Sharp 1 dim7 links the 1 to the 2, and sharp 4 dim7 links the 4 to the 1 over 5.",
      why: "A diminished 7 is basically a dominant 7 b9 without its root, so it points hard at the next chord. The bass moves by half steps, which sounds smooth and churchy.",
      how: "Use them as quick one or two beat passing chords in verses, turnarounds and walk ups.",
      ear: "Listen for the bass creeping up chromatically and a tense, spooky color for just a moment.",
      plain: ["1maj7", "2min7:2", "5dom7:2", "4maj", "1maj/5:2", "5dom7:2"],
      pro: ["1maj7:2", "#1dim7:2", "2min7:2", "5dom7:2", "4maj:2", "#4dim7:2", "1maj/5:2", "5dom7:2"] },

    { id: "walkup", title: "The gospel walk up", styles: ["gospel", "motown"], mode: "major",
      what: "Walk the bass up 1, 3, 4, sharp 4, 5 using inversions and a passing diminished chord, then resolve.",
      why: "Every bass note is a step from the last, so the line climbs like someone walking up the church steps. The tension keeps building until the 5 finally lets go.",
      how: "Use it as an intro, a turnaround into the chorus, or right before a big ending.",
      ear: "Hum the bass line. It should sound like a steady staircase going up.",
      plain: ["1maj", "4maj", "5dom7", "1maj"],
      pro: ["1maj:2", "1maj/3:2", "4maj:2", "#4dim7:2", "1maj/5:2", "5dom7:2", "1maj"] },

    { id: "susdom", title: "The 4 over 5 sus dominant", styles: ["neosoul", "gospel"], mode: "major",
      what: "Instead of a plain 5 chord, play the 4 major 7 over the 5 in the bass. In C that is Fmaj7 over G.",
      why: "It is a 5 chord with the sus 4, 9 and 13 built in and no leading tone. The pull home is softer and floatier, so the resolution feels smooth instead of forced.",
      how: "Use it at the end of a pre chorus or anywhere a normal 5 sounds too corny.",
      ear: "Listen for the cloudy, suspended feel, like the chord is holding its breath.",
      plain: ["1maj9", "6min9", "2min9", "5dom7"], pro: ["1maj9", "6min9", "2min9", "4maj7/5"] },

    { id: "tritone", title: "The tritone sub", styles: ["neosoul", "gospel"], mode: "major",
      what: "Replace the 5 dominant with the dominant a half step above home. In C that is Db9 instead of G7.",
      why: "Both chords share the same tritone, so they do the same job. But now the bass slides down by half steps, 2 to b2 to 1, which sounds slick and jazzy.",
      how: "Use it in the last cadence of a section or anywhere you want a smoother bass line into the 1.",
      ear: "Listen for the bass sliding down chromatically into home.",
      plain: ["2min9", "5dom7", "1maj9:8"], pro: ["2min9", "b2dom9", "1maj9:8"] },

    { id: "linecliche", title: "The line cliche", styles: ["gospel", "motown", "pop", "neosoul"], mode: "minor",
      what: "Hold the minor 1 while one line drops by half steps underneath: root, major 7, flat 7, 6. In A minor that is Am, Am over G sharp, Am7 over G, then D7 over F sharp.",
      why: "The chord barely changes, but the moving line creates constant motion and suspense. The major version works the same way: 1, 1 over 7, 1 over flat 7, then the 6.",
      how: "Use it for intros, verses or bridges where you want to stay on one chord without it getting stale.",
      ear: "Follow the bass sinking one half step at a time, like a slow sigh.",
      plain: ["1min:8", "1min", "4min"], pro: ["1min", "1min/7", "1min7/b7", "4dom7/6"] },

    { id: "fourthreesix", title: "The neo soul 4 3 6", styles: ["neosoul"], mode: "major",
      what: "Go from the 4 to the 3 dominant with a b9, then land on the 6 minor. In C that is Fmaj9, E7b9, Am9.",
      why: "The 3 dominant is the 5 of the 6, so it pulls hard into the minor chord. The bass falls a half step from 4 to 3, then drops to the 6 like it is settling in.",
      how: "Perfect for choruses and intros, and you can loop it all night.",
      ear: "Listen for the sweet and sour b9 on the 3 chord melting into the minor 9.",
      plain: ["4maj7", "5dom7", "6min7:8"], pro: ["4maj9", "3dom7b9", "6min9:8"] },

    { id: "planing", title: "Planing parallel 7th chords", styles: ["neosoul", "pop"], mode: "major",
      what: "Keep the exact same chord shape and slide it around, ignoring the key. Here a maj9 shape walks down F, Eb, Db, C in the key of C.",
      why: "Your ear follows the shape instead of the key, so out of key chords sound intentional. Parallel motion creates the dreamy, floating sound of modern neo soul.",
      how: "Use it in intros, bridges, or the last bar before a chorus for a fresh color.",
      ear: "Listen to every note in the chord moving together, like a choir sliding as one.",
      plain: ["4maj7", "3min7", "2min7", "1maj7"], pro: ["4maj9", "b3maj9", "b2maj9", "1maj9"] },

    { id: "deceptive", title: "The deceptive cadence", styles: ["motown", "pop", "gospel"], mode: "major",
      what: "Set up the 5 like you are going home, then land on the 6 minor instead.",
      why: "The 6 minor shares two notes with the 1, so it feels like home in a different outfit. The ear expects major and gets minor, which feels like a plot twist.",
      how: "Use it to stretch a chorus, delay the final cadence, or set up one more round of the hook.",
      ear: "Listen for the moment the floor drops out right when you expected to land.",
      plain: ["4maj", "5dom7", "1maj:8"], pro: ["4maj", "5dom7", "6min:8"] },

    { id: "pedal", title: "Pedal point with slash chords", styles: ["pop", "gospel", "neosoul"], mode: "major",
      what: "Keep the bass on the tonic while the chords on top change. In C that is C, F over C, G over C.",
      why: "The steady bass grounds everything, so the upper chords feel like color and motion rather than leaving home. The rubs against the pedal add shimmer.",
      how: "Great for intros, verses and outros, and it builds tension when you finally move the bass.",
      ear: "Listen for the bass droning while the chords float above it like clouds.",
      plain: ["1maj", "4maj", "5maj", "1maj"], pro: ["1maj", "4maj/1", "5maj/1", "1maj"] },

    { id: "relminor", title: "The relative minor swap", styles: ["pop", "motown"], mode: "major",
      what: "Start the phrase on the 6 minor instead of the 1. They share two notes, so the melody still fits.",
      why: "Same notes, different bass, totally different mood. Starting on the 6 makes a section feel emotional and searching instead of sunny.",
      how: "Use it to make a chorus feel different from a verse that starts on the 1, or the other way around.",
      ear: "Listen for the same melody suddenly sounding sadder over the minor chord.",
      plain: ["1maj", "4maj", "1maj", "5maj"], pro: ["6min", "4maj", "1maj", "5maj"] },

    { id: "minorplagal", title: "The minor plagal Amen", styles: ["gospel", "neosoul", "motown"], mode: "major",
      what: "Go from the 4 major to the 4 minor 6 before landing home. In C that is F to Fm6 to C.",
      why: "The flat 6 drops a half step to the 5th of the 1, and the added 6 rubs in a sweet way. It is the Amen sound of church endings, extra emotional.",
      how: "Use it as a final ending or on the last line of a chorus.",
      ear: "Listen for the inner voice sighing down a half step as you resolve.",
      plain: ["4maj", "4maj", "1maj:8"], pro: ["4maj", "4min6", "1maj:8"] },

    { id: "ext251", title: "Extensions on the 2 5 1", styles: ["neosoul", "gospel", "motown"], mode: "major",
      what: "Same 2 5 1, but stack 9ths and 13ths on top. In C that is Dm9, G13, Cmaj9.",
      why: "Extensions create common tones between chords, so your voicings move by tiny steps. It sounds expensive and smooth instead of blocky.",
      how: "Use it anywhere you would play a normal 2 5 1, especially in neo soul and gospel ballads.",
      ear: "Listen for the top notes barely moving while the bass does the work.",
      plain: ["2min", "5maj", "1maj:8"], pro: ["2min9", "5dom13", "1maj9:8"] },

    { id: "keychange", title: "The last chorus key change", styles: ["gospel", "motown", "pop"], mode: "major",
      what: "Before the last chorus, swap the 5 for the dominant of the new key. A half step up from C is Db, and its 5 chord is Ab7, which is the b6 dom7 of the old key.",
      why: "The pivot dominant points straight at the new tonic, so the jump sounds planned instead of random. Raising the whole song a half step gives the final chorus a burst of energy.",
      how: "Use it once, right before the final chorus, then play that chorus in the new key. For a whole step lift, use the 6 dom7 as the pivot instead.",
      ear: "Listen for the chord that sounds wrong for a second and then makes the chorus feel brand new.",
      plain: ["1maj:4", "6min:4", "4maj:4", "5maj:4"], pro: ["1maj:4", "6min:4", "4maj:4", "b6dom7:4"] },

    { id: "susres", title: "The sus resolution", styles: ["pop", "gospel", "motown"], mode: "major",
      what: "Hold the 4th of the chord instead of the 3rd, then let it fall into place. Sus 4 to major, on the 5 and again on the 1.",
      why: "A sus chord hides the 3rd, so it feels open and undecided. When the 4th finally drops to the 3rd it feels like an exhale.",
      how: "Use it at cadences, at the end of choruses and right before the downbeat of a new section.",
      ear: "Listen for one note stepping down a half step and the chord suddenly settling.",
      plain: ["4maj", "5maj", "1maj:8"], pro: ["4maj", "5sus4:2", "5maj:2", "1sus4:2", "1maj:6"] },

    { id: "harmonic5", title: "The harmonic minor 5", styles: ["gospel", "motown", "neosoul"], mode: "minor",
      what: "In a minor key, make the 5 chord major with a flat 7 and b9 by borrowing the raised 7th. In A minor that is E7b9 instead of Em7.",
      why: "The raised 7th, G sharp, is a leading tone a half step under the root, so it pulls hard to the 1. The natural minor 5 has no real pull, it just floats.",
      how: "Use it at the end of minor sections and pre choruses when you need the 1 to feel like an arrival.",
      ear: "Listen for the exotic, slightly Spanish tension right before the minor home chord.",
      plain: ["1min7", "4min7", "5min7", "1min7"], pro: ["1min7", "4min7", "5dom7b9", "1min7"] }
  ]
};
