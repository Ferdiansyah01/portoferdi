import numpy as np
import wave
import os

SR = 44100

# Note frequencies
NOTES = {
    'C3':130.81, 'D3':146.83, 'E3':164.81, 'F3':174.61, 'G3':196.00, 'A3':220.00, 'B3':246.94,
    'C4':261.63, 'D4':293.66, 'E4':329.63, 'F4':349.23, 'G4':391.99, 'A4':440.00, 'B4':493.88,
    'C5':523.25, 'D5':587.33, 'E5':659.25, 'F5':698.46, 'G5':783.99, 'A5':880.00, 'B5':987.77,
    'C6':1046.50, 'D6':1174.66, 'E6':1318.51, 'F6':1396.91, 'G6':1567.98,
    'R':0
}

def square_wave(freq, duration, sr=SR, volume=0.3, duty=0.5):
    if freq==0:
        return np.zeros(int(sr*duration))
    t = np.linspace(0, duration, int(sr*duration), False)
    # square via sign(sin)
    wav = np.sign(np.sin(2*np.pi*freq*t))
    # duty cycle via pulse: compare phase
    # simple square is fine
    # soft clip
    return wav * volume

def sine_wave(freq, duration, sr=SR, volume=0.3):
    if freq==0:
        return np.zeros(int(sr*duration))
    t = np.linspace(0, duration, int(sr*duration), False)
    return np.sin(2*np.pi*freq*t)*volume

def triangle_wave(freq, duration, sr=SR, volume=0.25):
    if freq==0:
        return np.zeros(int(sr*duration))
    t = np.linspace(0, duration, int(sr*duration), False)
    # triangle: 2*abs(2*(t*f - floor(t*f+0.5)))-1
    wav = 2*np.abs(2*(t*freq - np.floor(t*freq+0.5)))-1
    return wav*volume

def adsr(data, sr, attack=0.01, decay=0.08, sustain=0.7, release=0.08):
    n=len(data)
    a=int(sr*attack); d=int(sr*decay); r=int(sr*release)
    s=n-a-d-r
    if s<0:
        return data*0.5
    env=np.concatenate([
        np.linspace(0,1,a),
        np.linspace(1,sustain,d),
        np.ones(s)*sustain,
        np.linspace(sustain,0,r)
    ])
    if len(env)<n:
        env=np.pad(env,(0,n-len(env)))
    else:
        env=env[:n]
    return data*env

def note(freq, duration, wave_fn=square_wave, **kw):
    if freq==0:
        return np.zeros(int(SR*duration))
    w=wave_fn(freq, duration, **kw)
    return adsr(w, SR)

def chord(freqs, duration, wave_fn=triangle_wave, volume=0.25):
    if not freqs:
        return np.zeros(int(SR*duration))
    mix=np.zeros(int(SR*duration))
    for f in freqs:
        mix+= wave_fn(f, duration, volume=volume/len(freqs))
    return adsr(mix, SR, attack=0.02, decay=0.05, sustain=0.8, release=0.05)

def save_wav(path, data, sr=SR):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # normalize to 0.9 max
    mx=np.max(np.abs(data))
    if mx>0:
        data=data/mx*0.89
    # to int16
    data_int=(data*32767).astype(np.int16)
    # slight fade in/out to avoid click
    fade=int(sr*0.02)
    data_int[:fade]= (data_int[:fade].astype(float)*np.linspace(0,1,fade)[:,None].flatten() if data_int.ndim==1 else data_int[:fade])
    # write stereo
    if data_int.ndim==1:
        stereo=np.column_stack([data_int, data_int])
    else:
        stereo=data_int
    with wave.open(path,'w') as wf:
        wf.setnchannels(2)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(stereo.tobytes())
    print(f"Wrote {path} ({len(data)/sr:.1f}s)")

# === MENU THEME: "DevQuest Overture" === 150 BPM, upbeat adventure 8-bit
BPM_MENU=150
beat=60/BPM_MENU
eighth=beat/2
sixteenth=beat/4

def gen_menu():
    # melody: 8 bars loop ~ 12.8 sec then repeat x2 = ~25.6 sec for nice loop
    # Bar structure 4/4
    melody_notes = [
        # Bar1 C major arpeggio up
        ('C5', sixteenth*2), ('E5', sixteenth*2), ('G5', sixteenth*2), ('C6', sixteenth*2),
        ('B5', sixteenth*2), ('G5', sixteenth*2), ('E5', sixteenth*2), ('C5', sixteenth*2),
        # Bar2
        ('D5', sixteenth*2), ('F5', sixteenth*2), ('A5', sixteenth*2), ('D6', sixteenth*2),
        ('C6', sixteenth*2), ('A5', sixteenth*2), ('F5', sixteenth*2), ('D5', sixteenth*2),
        # Bar3 E minor-ish
        ('E5', sixteenth*2), ('G5', sixteenth*2), ('B5', sixteenth*2), ('E6', sixteenth*2),
        ('D6', sixteenth*2), ('B5', sixteenth*2), ('G5', sixteenth*2), ('E5', sixteenth*2),
        # Bar4 resolve
        ('C5', sixteenth*2), ('G5', sixteenth*2), ('E6', sixteenth*2), ('G5', sixteenth*2),
        ('C6', sixteenth*1), ('B5', sixteenth*1), ('A5', sixteenth*1), ('G5', sixteenth*1), ('E5', sixteenth*4),
        # Bar5 variation (call)
        ('C5', eighth), ('C5', eighth), ('G5', eighth), ('G5', eighth),
        ('A5', eighth), ('A5', eighth), ('G5', beat),
        # Bar6 response
        ('F5', eighth), ('F5', eighth), ('E5', eighth), ('E5', eighth),
        ('D5', eighth), ('D5', eighth), ('C5', beat),
        # Bar7 build
        ('G5', sixteenth*2), ('E5', sixteenth*2), ('C6', sixteenth*2), ('G5', sixteenth*2),
        ('F5', sixteenth*2), ('D5', sixteenth*2), ('E5', sixteenth*2), ('G5', sixteenth*2),
        # Bar8 finale
        ('C6', beat), ('G5', eighth), ('E5', eighth), ('C5', beat*1.5),
    ]
    bass_notes = [
        ('C3', beat), ('C3', beat), ('G3', beat), ('G3', beat),
        ('A3', beat), ('A3', beat), ('F3', beat), ('F3', beat),
        ('C3', beat), ('E3', beat), ('F3', beat), ('G3', beat),
        ('C3', beat*2), ('G3', beat*2),
        ('C3', beat), ('C3', beat), ('F3', beat), ('G3', beat),
        ('C3', beat*2), ('R', beat*2),
    ]
    # arp for bounce: C-E-G 16th pattern
    total_len = sum(d for _,d in melody_notes)
    data_len = int(SR*total_len)
    mix = np.zeros(data_len)
    # melody track
    pos=0
    for name,dur in melody_notes:
        f=NOTES[name]
        seg=note(f, dur, wave_fn=square_wave, volume=0.28)
        # add slight vibrato? skip
        seg = np.pad(seg, (0, max(0, int(SR*dur)-len(seg))))[:int(SR*dur)]
        # reverb echo
        echo = np.zeros(int(SR*dur)+int(SR*0.12))
        echo[:len(seg)]+=seg*1.0
        if pos+len(seg) > len(mix):
            # extend if needed
            mix=np.pad(mix,(0,pos+len(seg)-len(mix)))
        mix[pos:pos+len(seg)]+=seg*0.9
        # delay echo
        if pos+len(seg)+int(SR*0.12) <= len(mix):
            mix[pos+int(SR*0.08):pos+int(SR*0.08)+len(seg)]+=seg*0.15
        pos+=int(SR*dur)
    # trim to total_len
    mix=mix[:int(SR*total_len)]
    # bass track - triangle for warm
    pos=0
    bass_mix=np.zeros(int(SR*total_len))
    for name,dur in bass_notes:
        # bass_notes may be shorter than melody, loop pad
        if pos>=len(bass_mix):
            break
        f=NOTES[name]
        dur=min(dur, (len(bass_mix)-pos)/SR)
        if dur<=0:
            break
        seg=note(f, dur, wave_fn=triangle_wave, volume=0.22)
        seg=seg[:int(SR*dur)]
        bass_mix[pos:pos+len(seg)]+=seg*0.7
        pos+=int(SR*dur)
    # pad bass to full length by looping
    if pos < len(bass_mix):
        # repeat bass pattern until fill
        pattern_len=pos
        if pattern_len>0:
            repeats=int(np.ceil(len(bass_mix)/pattern_len))
            extended=np.tile(bass_mix[:pattern_len], repeats)[:len(bass_mix)]
            bass_mix=extended
    # percussion simple chip noise: hihat on offbeats
    perc=np.zeros(int(SR*total_len))
    for i in range(int(total_len/beat)):
        # hihat every 0.5 beat (eighth)
        t = i*beat + beat/2
        idx=int(t*SR)
        # short noise burst
        n_dur=0.03
        n_len=int(SR*n_dur)
        if idx+n_len < len(perc):
            noise=np.random.uniform(-1,1,n_len)*0.08*np.exp(-np.linspace(0,5,n_len))
            perc[idx:idx+n_len]+=noise
        # kick on beat 1 and 3
        if i%2==0:
            kd=int(i*beat*SR)
            kd_len=int(SR*0.08)
            if kd+kd_len < len(perc):
                kick=sine_wave(80, 0.08, volume=0.3)*np.exp(-np.linspace(0,8,kd_len))
                # pitch drop
                perc[kd:kd+kd_len]+=kick*0.6
    # mix together
    final = mix*0.55 + bass_mix*0.35 + perc*0.15
    # master soft limiter and slight lowpass via moving average
    final = np.convolve(final, np.ones(3)/3, mode='same')
    # duplicate to make 2 loops with slight intro fade
    final = np.concatenate([final, final])
    # add intro fade in 0.2s and outro fade 0.8s for looping
    fade_in=int(SR*0.2)
    final[:fade_in]*=np.linspace(0,1,fade_in)
    fade_out=int(SR*0.8)
    final[-fade_out:]*=np.linspace(1,0,fade_out)
    save_wav("public/assets/audio/bgm/menu.wav", final)
    # also copy as menu.ogg alias (just wav renamed for fallback) - browsers can play wav
    save_wav("public/assets/audio/bgm/menu_loop.wav", final)

def gen_world():
    BPM=118
    beat=60/BPM
    bar=beat*4
    # Lofi cozy exploration: progression C - G - Am - F (2 beats each)
    # pad chords with triangle, melody with square soft
    chords = [
        (['C4','E4','G4'], beat*2),
        (['G3','B3','D4'], beat*2),
        (['A3','C4','E4'], beat*2),
        (['F3','A3','C4'], beat*2),
    ]*4 # 4 cycles = 16 bars
    melody = [
        ('E5', beat*0.5), ('G5', beat*0.5), ('E6', beat), ('D6', beat*0.5), ('C6', beat*0.5), ('B5', beat), ('C6', beat),
        ('A5', beat*0.5), ('C6', beat*0.5), ('A5', beat), ('G5', beat*0.5), ('E5', beat*0.5), ('G5', beat), ('E5', beat),
        ('E5', beat*0.5), ('G5', beat*0.5), ('E6', beat), ('D6', beat*0.5), ('C6', beat*0.5), ('B5', beat), ('A5', beat*0.5), ('G5', beat*0.5),
        ('C6', beat), ('A5', beat), ('G5', beat*1.5), ('R', beat*0.5),
        ('E5', beat*0.5), ('G5', beat*0.5), ('A5', beat), ('G5', beat*0.5), ('E5', beat*0.5), ('D5', beat), ('E5', beat),
        ('C5', beat), ('E5', beat), ('G5', beat), ('C6', beat),
        ('B5', beat*0.5), ('A5', beat*0.5), ('G5', beat*0.5), ('E5', beat*0.5), ('A5', beat), ('G5', beat*1.5), ('R', beat*0.5),
        ('E6', beat*0.5), ('D6', beat*0.5), ('C6', beat), ('B5', beat), ('C6', beat*0.5), ('A5', beat*0.5), ('G5', beat), ('E5', beat*0.5), ('G5', beat*0.5),
    ]
    # generate total len = chords len
    total_beats = 32 # 8 bars *4
    total_len = total_beats*beat
    mix=np.zeros(int(SR*total_len))
    # chords pad
    pos=0
    for freqs,dur in chords:
        fs=[NOTES[n] for n in freqs]
        seg=chord(fs, dur, volume=0.18)
        # add shimmer
        shimmer=sine_wave(fs[1]*2, dur, volume=0.05)*0.3
        shimmer=adsr(shimmer, SR, attack=0.1, decay=0.1, sustain=0.6, release=0.1)
        seg=seg+shimmer*0.3
        seg=seg[:int(SR*dur)]
        if pos+len(seg) <= len(mix):
            mix[pos:pos+len(seg)]+=seg*0.6
        pos+=int(SR*dur)
    # melody
    pos=0
    mel_mix=np.zeros(int(SR*total_len))
    for name,dur in melody:
        if pos>=len(mel_mix):
            break
        dur=min(dur, (len(mel_mix)-pos)/SR)
        f=NOTES[name]
        seg=note(f, dur, wave_fn=sine_wave, volume=0.26)
        # add gentle square layer for chiptune charm
        if f!=0:
            sq=note(f, dur, wave_fn=square_wave, volume=0.12)
            seg=seg*0.7+sq*0.3
        seg=seg[:int(SR*dur)]
        # small gap
        gap=int(SR*0.015)
        seg[-gap:]*=np.linspace(1,0,gap) if len(seg)>gap else seg
        mel_mix[pos:pos+len(seg)]+=seg*0.9
        pos+=int(SR*dur)
    # gentle vinyl crackle? skip
    # soft kick every bar, hat offbeat
    perc=np.zeros(int(SR*total_len))
    for i in range(total_beats):
        t=i*beat
        idx=int(t*SR)
        if i%4==0:
            # soft kick
            k_len=int(SR*0.09)
            if idx+k_len < len(perc):
                kick=sine_wave(60,0.09,volume=0.22)*np.exp(-np.linspace(0,6,k_len))
                perc[idx:idx+k_len]+=kick*0.5
        if i%2==1:
            h_len=int(SR*0.02)
            h_idx=int((t-0.02)*SR)
            if 0<=h_idx and h_idx+h_len < len(perc):
                noise=np.random.uniform(-1,1,h_len)*0.03
                perc[h_idx:h_idx+h_len]+=noise
    final=mix*0.5 + mel_mix*0.45 + perc*0.2
    # warm filter via convolution
    final=np.convolve(final, np.ones(4)/4, mode='same')
    # stereo widen: slight delay between channels later handled by wav stereo dup but add chorus
    # fade for loop
    fade_in=int(SR*0.6)
    fade_out=int(SR*1.0)
    final[:fade_in]*=np.linspace(0,1,fade_in)
    final[-fade_out:]*=np.linspace(1,0,fade_out)
    # loop twice for longer file
    final=np.concatenate([final, final*0.98])
    save_wav("public/assets/audio/bgm/world.wav", final)

def gen_sfx():
    # interact blip: two quick square beeps like RPG dialog
    def blip(f1,f2,dur=0.08, gap=0.03):
        a=note(f1, dur, wave_fn=square_wave, volume=0.35)
        b=note(f2, dur, wave_fn=square_wave, volume=0.35)
        silence=np.zeros(int(SR*gap))
        return np.concatenate([a,silence,b, np.zeros(int(SR*0.02))])
    s1=blip(NOTES['E6'], NOTES['G6'], dur=0.07)
    save_wav("public/assets/audio/sfx/interact.wav", s1)
    s2=note(NOTES['C6'],0.12, wave_fn=square_wave, volume=0.33)
    s2=np.concatenate([s2, note(NOTES['E6'],0.12, wave_fn=square_wave, volume=0.33), note(NOTES['G6'],0.18, wave_fn=square_wave, volume=0.35)])
    save_wav("public/assets/audio/sfx/open.wav", s2*0.7)
    s3=note(NOTES['A4'],0.06, wave_fn=square_wave, volume=0.25)
    save_wav("public/assets/audio/sfx/close.wav", s3)

if __name__=="__main__":
    gen_menu()
    gen_world()
    gen_sfx()
    print("All BGM generated!")
