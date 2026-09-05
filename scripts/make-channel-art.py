"""YouTube channel art + trailer still. Exact text, navy/amber."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images"
LOGO = OUT / "logo-mark.png"
NAVY = (10, 31, 68, 255)
AMBER = (232, 163, 23, 255)
WHITE = (245, 247, 250, 255)
MUTED = (138, 151, 171, 255)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    names = (
        ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"]
        if bold
        else ["segoeui.ttf", "arial.ttf", "calibri.ttf"]
    )
    windir = Path(r"C:\Windows\Fonts")
    for name in names:
        path = windir / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def fit_logo(size: int) -> Image.Image:
    im = Image.open(LOGO).convert("RGBA")
    im.thumbnail((size, size), Image.Resampling.LANCZOS)
    return im


def centered(draw: ImageDraw.ImageDraw, text: str, y: int, fnt, fill, width: int) -> None:
    x0, y0, x1, y1 = draw.textbbox((0, 0), text, font=fnt)
    x = (width - (x1 - x0)) // 2
    draw.text((x, y), text, font=fnt, fill=fill)


def banner() -> None:
    w, h = 2560, 1440
    img = Image.new("RGBA", (w, h), NAVY)
    draw = ImageDraw.Draw(img)
    # Keep copy inside YouTube's 1546x423 center safe area (do not draw the box).
    by = (h - 423) // 2
    logo = fit_logo(160)
    lx = (w - logo.width) // 2
    img.alpha_composite(logo, (lx, by + 18))
    centered(draw, "AIRPORT RUNWAYS LIVE", by + 190, font(54, True), WHITE, w)
    centered(draw, "Watch the runways. Live.", by + 260, font(36, True), AMBER, w)
    centered(draw, "airportrunwayslive.com", by + 330, font(28), MUTED, w)
    img.convert("RGB").save(OUT / "channel-banner.png", quality=95)


def trailer() -> None:
    w, h = 1920, 1080
    img = Image.new("RGBA", (w, h), NAVY)
    draw = ImageDraw.Draw(img)
    logo = fit_logo(280)
    img.alpha_composite(logo, ((w - logo.width) // 2, 160))
    centered(draw, "AIRPORT RUNWAYS LIVE", 500, font(64, True), WHITE, w)
    centered(draw, "Watch the runways. Live.", 590, font(44, True), AMBER, w)
    centered(draw, "Orlando  ·  Tampa  ·  the live board", 680, font(32), MUTED, w)
    centered(draw, "Subscribe  ·  airportrunwayslive.com", 760, font(30), WHITE, w)
    img.convert("RGB").save(OUT / "trailer-card.png", quality=95)


if __name__ == "__main__":
    banner()
    trailer()
    print("Wrote channel-banner.png and trailer-card.png")
