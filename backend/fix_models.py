import re

file_path = r"d:\CVS\backend\models\__init__.py"
with open(file_path, "r") as f:
    content = f.read()

# Replace Mapped["Class" | None] with Mapped[Optional["Class"]]
content = re.sub(r'Mapped\["([^"]+)"\s*\|\s*None\]', r'Mapped[Optional["\1"]]', content)

with open(file_path, "w") as f:
    f.write(content)
print("Fixed Mapped annotations")
