from PIL import Image, ImageDraw, ImageFilter, ImageChops
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/"assets/ui/symbols/aquila.png"
OUT=ROOT/"assets/ui/icons"
OUT.mkdir(parents=True,exist_ok=True)

BG=(5,8,5,255)
SCREEN=(8,18,8,255)
GOLD=(171,137,67,255)
GOLD_DIM=(91,70,34,255)
GREEN=(168,219,114,255)
GREEN_GLOW=(111,159,73,150)

src=Image.open(SRC).convert("RGBA")
# Build a robust mask from both source alpha and luminance so dark/opaque
# backgrounds do not become part of the icon.
r,g,b,a=src.split()
lum=Image.merge("RGB",(r,g,b)).convert("L")
mask=ImageChops.multiply(a,lum)
bbox=mask.getbbox()
if bbox:
    src=src.crop(bbox)
    mask=mask.crop(bbox)

def make_icon(size:int, maskable:bool=False):
    im=Image.new("RGBA",(size,size),BG)
    d=ImageDraw.Draw(im)
    outer_margin=int(size*(0.17 if maskable else 0.115))
    inner_margin=outer_margin+int(size*0.035)
    radius=int(size*0.09)
    frame_w=max(3,int(size*0.018))

    # understated imperial-tech frame, fully inside adaptive-icon safe area
    d.rounded_rectangle(
        [outer_margin,outer_margin,size-outer_margin,size-outer_margin],
        radius=radius,
        fill=(9,13,9,255),
        outline=GOLD_DIM,
        width=frame_w+2,
    )
    d.rounded_rectangle(
        [outer_margin+frame_w,outer_margin+frame_w,size-outer_margin-frame_w,size-outer_margin-frame_w],
        radius=max(1,radius-frame_w),
        outline=GOLD,
        width=frame_w,
    )
    d.rounded_rectangle(
        [inner_margin,inner_margin,size-inner_margin,size-inner_margin],
        radius=int(radius*0.72),
        fill=SCREEN,
        outline=(72,99,62,255),
        width=max(2,int(size*0.007)),
    )

    # Keep the exact repository Aquila silhouette, only recolor it phosphor green.
    max_w=int(size*(0.48 if maskable else 0.56))
    max_h=int(size*(0.42 if maskable else 0.49))
    ratio=min(max_w/mask.width,max_h/mask.height)
    w=max(1,int(mask.width*ratio)); h=max(1,int(mask.height*ratio))
    m=mask.resize((w,h),Image.Resampling.LANCZOS)
    x=(size-w)//2; y=(size-h)//2

    glow_layer=Image.new("RGBA",(size,size),(0,0,0,0))
    glow_mask=Image.new("L",(size,size),0)
    glow_mask.paste(m,(x,y))
    glow_mask=glow_mask.filter(ImageFilter.GaussianBlur(max(2,size*0.012)))
    glow_layer.paste(GREEN_GLOW,(0,0,size,size),glow_mask)
    im=Image.alpha_composite(im,glow_layer)

    emblem=Image.new("RGBA",(size,size),(0,0,0,0))
    emblem.paste(GREEN,(x,y,x+w,y+h),m)
    im=Image.alpha_composite(im,emblem)

    # subtle terminal scanlines only inside the central display
    overlay=Image.new("RGBA",(size,size),(0,0,0,0))
    od=ImageDraw.Draw(overlay)
    for yy in range(inner_margin,size-inner_margin,4):
        od.line((inner_margin,yy,size-inner_margin,yy),fill=(210,255,190,9),width=1)
    im=Image.alpha_composite(im,overlay)
    return im.convert("RGB")

make_icon(192,False).save(OUT/"app-icon-192.png",optimize=True)
make_icon(512,False).save(OUT/"app-icon-512.png",optimize=True)
make_icon(512,True).save(OUT/"app-icon-maskable-512.png",optimize=True)
print("generated",*(p.name for p in OUT.glob("app-icon*.png")))
