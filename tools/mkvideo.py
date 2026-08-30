#!/usr/bin/env python3
import json,os,subprocess,sys,glob
lang=sys.argv[1] if len(sys.argv)>1 else 'ka'
d=os.path.dirname(os.path.abspath(__file__))
ff=open(os.path.join(d,'_ffpath.txt')).read().strip()
durs=json.load(open(os.path.join(d,f'_vdurs_{lang}.json')))
imgs=sorted(glob.glob(os.path.join(d,f'_v{lang}_*.png')))
assert len(imgs)==len(durs), (len(imgs),len(durs))
T=0.6  # crossfade seconds
FPS=30
out=os.path.join(d,f'RAM_IMPEX_briketi_video_{lang}.mp4')

inp=[]
for img,du in zip(imgs,durs):
    inp+= ['-loop','1','-t',f'{du:.3f}','-i',img]

# build xfade chain
fc=[]
# normalize each input: set fps, sar, format
labels=[]
for i in range(len(imgs)):
    fc.append(f'[{i}:v]fps={FPS},format=yuv420p,setsar=1[v{i}]')
    labels.append(f'v{i}')
prev=labels[0]
cum=durs[0]
for k in range(1,len(imgs)):
    off=cum - T
    outl=f'x{k}'
    fc.append(f'[{prev}][{labels[k]}]xfade=transition=fade:duration={T}:offset={off:.3f}[{outl}]')
    prev=outl
    cum = cum + durs[k] - T
# final fade in/out
final='vout'
fc.append(f'[{prev}]fade=t=in:st=0:d=0.5,fade=t=out:st={cum-0.6:.3f}:d=0.6[{final}]')
filter_complex=';'.join(fc)

cmd=[ff,'-y',*inp,'-filter_complex',filter_complex,'-map',f'[{final}]',
     '-c:v','libx264','-pix_fmt','yuv420p','-r',str(FPS),'-preset','medium','-crf','20',
     '-movflags','+faststart',out]
print('total duration ~%.1fs'%cum)
r=subprocess.run(cmd,capture_output=True,text=True)
if r.returncode!=0:
    print(r.stderr[-3000:]); sys.exit(1)
print('OK',out,os.path.getsize(out)//1024,'KB')
