#! python3

import argparse
import os
import json
import sys

import UnityPy

print("Encoding:", sys.getdefaultencoding())

CLASSES = ["MonoBehaviour", "Texture2D", "Sprite", "TextAsset", "AudioClip"]

def unpack_all_assets(src_folder: str, dest_folder: str):
  for c in CLASSES:
    os.makedirs(os.path.join(dest_folder, c), exist_ok=True)

  for root, dirs, files in os.walk(src_folder):
    for filename in files:
      file_path = os.path.join(root, filename)
      env = UnityPy.load(file_path)

      for obj in env.objects:
        if obj.type.name not in CLASSES:
          continue

        try:
          data = obj.read()
        except Exception as e:
          print(f"::warning file={file_path}::{e}")
          continue

        dest = os.path.join(dest_folder, obj.type.name, data.name)
        #print(f"::debug::{dest}")

        if obj.type.name == "Sprite":
          dest, ext = os.path.splitext(dest)
          dest = dest + ".png"
          data.image.save(dest)

        elif obj.type.name == "MonoBehaviour":
          dest, ext = os.path.splitext(dest)
          if ext in [".book", ".chapter"]:
            dest = dest + ext
          dest = dest + ".json"

          if obj.serialized_type.nodes:
            try:
              tree = obj.read_typetree()
              with open(dest, "w", encoding="utf8") as f:
                json.dump(tree, f, ensure_ascii=False, indent=2)
            except Exception as e:
              print(f"::warning file={file_path}::{e}")

        elif obj.type.name == "TextAsset":
          dest, ext = os.path.splitext(dest)
          dest = dest + ".txt"
          with open(dest, "wb") as f:
            f.write(data.script)

        elif obj.type.name == "AudioClip":
          for name, raw in data.samples.items():
            dest = os.path.join(dest_folder, obj.type.name, name)
            with open(dest, "wb") as f:
              f.write(raw)

if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument("src", help="asset bundles folder")
  parser.add_argument("dest", help="output folder")

  args = parser.parse_args()
  unpack_all_assets(args.src, args.dest)