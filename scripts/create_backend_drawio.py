#!/usr/bin/env python3
"""Create a concise, editable 4-page draw.io backend overview for HustLingo."""

from __future__ import annotations

import argparse
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET


RED = "#C8102E"
GOLD = "#F2A900"
INK = "#252A33"
MUTED = "#5D6572"
LINE = "#D7DCE3"
PANEL = "#F6F7F9"
PALE_RED = "#FFF0F2"
PALE_GOLD = "#FFF7E5"
PALE_GREEN = "#EDF7F1"
GREEN = "#28724F"
WHITE = "#FFFFFF"


class Diagram:
    def __init__(self, name: str, page_width: int = 1169, page_height: int = 827):
        self.name = name
        self.next_id = 2
        self.root = ET.Element("root")
        ET.SubElement(self.root, "mxCell", {"id": "0"})
        ET.SubElement(self.root, "mxCell", {"id": "1", "parent": "0"})
        self.width = page_width
        self.height = page_height

    def _id(self) -> str:
        value = str(self.next_id)
        self.next_id += 1
        return value

    def rect(
        self,
        value: str,
        x: int,
        y: int,
        w: int,
        h: int,
        *,
        fill: str = WHITE,
        stroke: str = LINE,
        font: str = INK,
        size: int = 16,
        bold: bool = False,
        rounded: bool = True,
        align: str = "center",
        dashed: bool = False,
        stroke_width: int = 1,
    ) -> str:
        ident = self._id()
        style = (
            f"rounded={1 if rounded else 0};whiteSpace=wrap;html=1;"
            f"fillColor={fill};strokeColor={stroke};fontColor={font};fontSize={size};"
            f"fontStyle={1 if bold else 0};align={align};verticalAlign=middle;spacing=10;"
            f"strokeWidth={stroke_width};shadow=0;"
        )
        if dashed:
            style += "dashed=1;dashPattern=6 4;"
        cell = ET.SubElement(
            self.root,
            "mxCell",
            {"id": ident, "value": value, "style": style, "vertex": "1", "parent": "1"},
        )
        ET.SubElement(cell, "mxGeometry", {"x": str(x), "y": str(y), "width": str(w), "height": str(h), "as": "geometry"})
        return ident

    def text(self, value: str, x: int, y: int, w: int, h: int, *, color: str = MUTED, size: int = 14, bold: bool = False, align: str = "left") -> str:
        ident = self._id()
        style = f"text;html=1;strokeColor=none;fillColor=none;fontColor={color};fontSize={size};fontStyle={1 if bold else 0};align={align};verticalAlign=middle;whiteSpace=wrap;spacing=2;"
        cell = ET.SubElement(self.root, "mxCell", {"id": ident, "value": value, "style": style, "vertex": "1", "parent": "1"})
        ET.SubElement(cell, "mxGeometry", {"x": str(x), "y": str(y), "width": str(w), "height": str(h), "as": "geometry"})
        return ident

    def edge(self, source: str, target: str, *, color: str = RED, label: str = "", dashed: bool = False, width: int = 2) -> str:
        ident = self._id()
        style = f"edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeColor={color};strokeWidth={width};endArrow=block;endFill=1;"
        if dashed:
            style += "dashed=1;dashPattern=6 4;"
        cell = ET.SubElement(self.root, "mxCell", {"id": ident, "value": label, "style": style, "edge": "1", "parent": "1", "source": source, "target": target})
        ET.SubElement(cell, "mxGeometry", {"relative": "1", "as": "geometry"})
        return ident

    def page(self) -> ET.Element:
        diagram = ET.Element("diagram", {"id": f"page-{self.next_id}-{abs(hash(self.name)) % 100000}", "name": self.name})
        model = ET.SubElement(
            diagram,
            "mxGraphModel",
            {
                "dx": "1422",
                "dy": "794",
                "grid": "1",
                "gridSize": "10",
                "guides": "1",
                "tooltips": "1",
                "connect": "1",
                "arrows": "1",
                "fold": "1",
                "page": "1",
                "pageScale": "1",
                "pageWidth": str(self.width),
                "pageHeight": str(self.height),
                "math": "0",
                "shadow": "0",
            },
        )
        model.append(self.root)
        return diagram


def title(d: Diagram, heading: str, subtitle: str) -> None:
    d.text(heading, 40, 25, 1080, 48, color=RED, size=27, bold=True)
    d.text(subtitle, 42, 77, 1080, 30, color=MUTED, size=14)
    d.rect("", 42, 112, 1080, 4, fill=GOLD, stroke=GOLD, rounded=False)


def architecture_page() -> ET.Element:
    d = Diagram("01 · Kiến trúc tổng quan")
    title(d, "Backend HustLingo | Kiến trúc tổng quan", "Expo client gọi Supabase trực tiếp; không có API server tự quản.")

    app = d.rect("<b>ỨNG DỤNG EXPO</b><br><br>Web · iOS · Android<br>AuthContext<br>LearningContext", 55, 190, 220, 150, fill=WHITE, stroke=RED, size=16, stroke_width=2)
    services = d.rect("<b>SERVICE LAYER</b><br><br>learningContent<br>Catalog đã xuất bản<br><br>supabaseData<br>Profile · progress · feedback", 365, 180, 260, 170, fill=PANEL, stroke=LINE, size=15)

    cloud = d.rect("", 700, 150, 415, 365, fill=PALE_RED, stroke=RED, rounded=True, dashed=True, stroke_width=2)
    d.text("SUPABASE", 720, 163, 375, 30, color=RED, size=17, bold=True, align="center")
    auth = d.rect("<b>AUTH</b><br><br>Google / email<br>Session + JWT", 730, 220, 165, 100, fill=WHITE, stroke=LINE, size=14)
    api = d.rect("<b>POSTGREST</b><br><br>REST access<br>qua Supabase SDK", 925, 220, 165, 100, fill=WHITE, stroke=LINE, size=14)
    database = d.rect("<b>POSTGRESQL</b><br><br>profiles · progress<br>catalog nội dung<br><b>RLS tại database</b>", 785, 370, 250, 110, fill=WHITE, stroke=RED, size=15, stroke_width=2)

    local = d.rect("<b>ASYNCSTORAGE</b><br><br>Tiến độ guest<br>Bản local trên thiết bị", 55, 445, 220, 105, fill=PALE_GOLD, stroke=GOLD, size=14)
    source = d.rect("<b>NGUỒN NỘI DUNG</b><br><br>JSON / dataset", 365, 445, 170, 105, fill=WHITE, stroke=LINE, size=14)
    importer = d.rect("<b>IMPORTER</b><br><br>import-content.mjs<br>service role chỉ phía nhập", 565, 445, 190, 105, fill=PALE_GOLD, stroke=GOLD, size=13)

    d.edge(app, services, label="gọi service")
    d.edge(services, auth, label="đăng nhập", color=RED)
    d.edge(services, api, label="query / upsert", color=RED)
    d.edge(auth, database, label="JWT")
    d.edge(api, database, label="REST")
    d.edge(app, local, label="lưu local", color=GOLD)
    d.edge(source, importer, color=GOLD)
    d.edge(importer, database, label="upsert", color=GOLD)
    d.text("Service role không được nhúng vào bundle ứng dụng.", 565, 565, 520, 28, color=RED, size=13, bold=True)
    return d.page()


def database_page() -> ET.Element:
    d = Diagram("02 · Quan hệ dữ liệu")
    title(d, "Thiết kế dữ liệu | Quan hệ chính", "Tách dữ liệu theo tài khoản khỏi catalog học dùng chung.")

    d.rect("", 38, 145, 310, 570, fill=PANEL, stroke=LINE, rounded=True)
    d.text("DỮ LIỆU THEO TÀI KHOẢN", 58, 160, 270, 30, color=RED, size=16, bold=True, align="center")
    users = d.rect("<b>auth.users</b><br><br>id · PK", 78, 218, 230, 72, fill=WHITE, stroke=RED, size=15)
    profile = d.rect("<b>profiles</b><br><br>id · PK / FK", 78, 340, 230, 72, fill=WHITE, stroke=LINE, size=14)
    progress = d.rect("<b>learning_progress</b><br><br>user_id · PK / FK<br>state · JSONB", 78, 460, 230, 88, fill=PALE_GOLD, stroke=GOLD, size=13)
    feedback = d.rect("<b>feedback</b><br><br>id · PK · user_id FK", 78, 595, 230, 72, fill=WHITE, stroke=LINE, size=14)
    d.edge(users, profile, label="1:1")
    d.edge(users, progress, label="1:1")
    d.edge(users, feedback, label="1:N")

    d.rect("", 370, 145, 760, 570, fill=WHITE, stroke=LINE, rounded=True)
    d.text("CATALOG NỘI DUNG HỌC", 390, 160, 720, 30, color=RED, size=16, bold=True, align="center")
    topics = d.rect("<b>topics</b><br><br>id · PK", 405, 225, 165, 75, fill=PALE_GOLD, stroke=GOLD, size=14)
    vocab = d.rect("<b>vocabulary_entries</b><br><br>id · PK · topic_id FK", 650, 205, 220, 85, fill=WHITE, stroke=LINE, size=13)
    lessons = d.rect("<b>lessons</b><br><br>id · PK · topic_id FK", 405, 360, 165, 80, fill=WHITE, stroke=LINE, size=13)
    items = d.rect("<b>lesson_items</b><br><br>lesson_id + position · PK<br>vocabulary_id XOR grammar_point_id", 650, 345, 220, 110, fill=PALE_RED, stroke=RED, size=12)
    grammar = d.rect("<b>grammar_points</b><br><br>id · PK", 405, 525, 165, 80, fill=WHITE, stroke=LINE, size=13)
    examples = d.rect("<b>grammar_examples</b><br><br>grammar_point_id + position · PK", 650, 525, 220, 80, fill=WHITE, stroke=LINE, size=12)
    d.edge(topics, vocab, label="1:N")
    d.edge(topics, lessons, label="1:N")
    d.edge(lessons, items, label="1:N")
    d.edge(vocab, items, label="0:N", color=GOLD)
    d.edge(grammar, items, label="0:N", color=GOLD)
    d.edge(grammar, examples, label="1:N")

    d.rect("<b>Migration cần xác nhận</b><br>Practice / Tutor<br>grammar_exercises<br>Kiểm tra đã áp dụng trên Supabase.", 895, 500, 210, 145, fill=PALE_GOLD, stroke=GOLD, size=12)
    return d.page()


def security_page() -> ET.Element:
    d = Diagram("03 · Auth và RLS")
    title(d, "Xác thực và bảo mật | RLS", "Session xác định danh tính; policy ở PostgreSQL quyết định quyền trên từng hàng.")

    login = d.rect("<b>NGƯỜI DÙNG</b><br><br>Google OAuth<br>Email / password", 55, 220, 205, 120, fill=WHITE, stroke=RED, size=15)
    auth = d.rect("<b>SUPABASE AUTH</b><br><br>Xác thực<br>Cấp access token / JWT", 335, 220, 225, 120, fill=PALE_RED, stroke=RED, size=15)
    app = d.rect("<b>ỨNG DỤNG EXPO</b><br><br>Session lưu trên client<br>Publishable key", 335, 405, 225, 120, fill=PANEL, stroke=LINE, size=14)
    rls = d.rect("<b>RLS POLICY</b><br><br>auth.uid() = id / user_id<br>Catalog: is_published", 675, 285, 210, 125, fill=PALE_GOLD, stroke=GOLD, size=14)
    db = d.rect("<b>POSTGRESQL</b><br><br>profiles · learning_progress<br>published catalog", 965, 285, 175, 125, fill=WHITE, stroke=RED, size=13)
    trigger = d.rect("<b>TRIGGER KHI SIGN UP</b><br><br>Tạo profile và tiến độ ban đầu", 55, 455, 205, 95, fill=PALE_GREEN, stroke=GREEN, size=13)
    importer = d.rect("<b>IMPORTER SERVER-SIDE</b><br><br>service role key<br>Không đưa vào app client", 675, 500, 465, 90, fill=PALE_GOLD, stroke=GOLD, size=14)

    d.edge(login, auth, label="OAuth / password")
    d.edge(auth, app, label="session JWT", color=RED)
    d.edge(app, rls, label="SDK request + JWT")
    d.edge(rls, db, label="policy cho phép")
    d.edge(auth, trigger, label="user created", color=GREEN)
    d.edge(importer, db, label="upsert nội dung", color=GOLD)
    d.text("Client không dùng secret key. RLS vẫn áp dụng cho các truy vấn REST từ app.", 80, 650, 1010, 34, color=RED, size=14, bold=True, align="center")
    return d.page()


def sync_page() -> ET.Element:
    d = Diagram("04 · Đồng bộ tiến độ")
    title(d, "Đồng bộ tiến độ | Local-first best-effort", "Luồng hiện có trong LearningContext và supabaseData.")

    action = d.rect("<b>THAO TÁC HỌC</b><br><br>lưu từ · trả lời · hoàn tất bài", 45, 195, 200, 105, fill=WHITE, stroke=LINE, size=13)
    context = d.rect("<b>LearningContext</b><br><br>Cập nhật state trong app", 300, 195, 195, 105, fill=PALE_RED, stroke=RED, size=14)
    storage = d.rect("<b>AsyncStorage</b><br><br>Ghi local ngay<br>Guest chỉ lưu tại máy", 550, 175, 210, 115, fill=PALE_GOLD, stroke=GOLD, size=14)
    cloud = d.rect("<b>learning_progress</b><br><br>getProgress() khi login<br>putProgress() sau debounce 1,2s", 835, 175, 280, 115, fill=WHITE, stroke=RED, size=13)
    merge = d.rect("<b>mergeProgress()</b><br><br>Hợp danh sách ID<br>Counter dùng max(local, cloud)", 550, 355, 210, 115, fill=PANEL, stroke=LINE, size=13)
    noqueue = d.rect("<b>GIỚI HẠN HIỆN TẠI</b><br><br>Lỗi mạng bị bỏ qua<br>Chưa có outbox/retry<br>Concurrent update có thể ghi đè", 835, 355, 280, 115, fill=PALE_RED, stroke=RED, size=13)
    recommendation = d.rect("<b>HƯỚNG NÂNG CẤP</b><br><br>Outbox bền + retry backoff + event ID idempotent<br>RPC cập nhật nguyên tử; cache catalog cho offline", 250, 570, 680, 105, fill=PALE_GREEN, stroke=GREEN, size=14)

    d.edge(action, context)
    d.edge(context, storage, label="save local")
    d.edge(storage, cloud, label="đăng nhập / syncNow")
    d.edge(cloud, merge, label="remote state", color=GOLD)
    d.edge(merge, storage, label="ghi state hợp nhất", color=GOLD)
    d.edge(cloud, noqueue, label="write error", color=RED, dashed=True)
    d.edge(noqueue, recommendation, label="cải tiến")
    d.text("Nội dung catalog chưa có cache offline chuyên dụng.", 835, 500, 280, 36, color=MUTED, size=12, align="center")
    return d.page()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    mxfile = ET.Element(
        "mxfile",
        {
            "host": "app.diagrams.net",
            "modified": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
            "agent": "Codex",
            "version": "25.0.2",
            "type": "device",
        },
    )
    for build in (architecture_page, database_page, security_page, sync_page):
        mxfile.append(build())

    ET.indent(mxfile, space="  ")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    ET.ElementTree(mxfile).write(args.output, encoding="utf-8", xml_declaration=True)
    print(f"Wrote {len(mxfile.findall('diagram'))} draw.io pages: {args.output}")


if __name__ == "__main__":
    main()
