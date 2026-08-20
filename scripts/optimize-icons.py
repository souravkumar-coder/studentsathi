from pathlib import Path

from PIL import Image


PROJECT = Path("/home/ubuntu/studentsathi")
SOURCE = Path("/home/ubuntu/webdev-static-assets/studentsathi-icon.png")
TARGETS = [
    PROJECT / "assets/images/icon.png",
    PROJECT / "assets/images/splash-icon.png",
    PROJECT / "assets/images/favicon.png",
    PROJECT / "assets/images/android-icon-foreground.png",
]


def main() -> None:
    with Image.open(SOURCE) as image:
        optimized = image.convert("RGBA")
        optimized.thumbnail((512, 512), Image.Resampling.LANCZOS)
        for target in TARGETS:
            optimized.save(target, format="PNG", optimize=True, compress_level=9)
            print(f"Wrote {target}")


if __name__ == "__main__":
    main()
