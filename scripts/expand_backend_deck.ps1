param(
  [Parameter(Mandatory = $true)][string]$InputPath,
  [Parameter(Mandatory = $true)][string]$OutputPath
)

$ErrorActionPreference = 'Stop'

function To-OleColor([string]$Hex) {
  $h = $Hex.TrimStart('#')
  $r = [Convert]::ToInt32($h.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($h.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($h.Substring(4, 2), 16)
  return ($r -bor ($g -shl 8) -bor ($b -shl 16))
}

$script:Red = To-OleColor '#C8102E'
$script:DarkRed = To-OleColor '#A60C25'
$script:Gold = To-OleColor '#F2A900'
$script:Ink = To-OleColor '#262A33'
$script:Muted = To-OleColor '#5D6572'
$script:Line = To-OleColor '#D8DCE3'
$script:Card = To-OleColor '#F7F8FA'
$script:PaleRed = To-OleColor '#FFF0F2'
$script:PaleGold = To-OleColor '#FFF7E5'
$script:PaleGreen = To-OleColor '#EDF7F1'
$script:Green = To-OleColor '#28724F'
$script:White = To-OleColor '#FFFFFF'
$script:Dark = To-OleColor '#262A33'

function Set-TextStyle($Shape, [string]$Text, [double]$Size, [int]$Color, [bool]$Bold = $false, [int]$Align = 1, [string]$Font = 'Arial') {
  $Shape.TextFrame.TextRange.Text = $Text
  $Shape.TextFrame.WordWrap = -1
  $Shape.TextFrame.AutoSize = 0
  $Shape.TextFrame.MarginLeft = 0
  $Shape.TextFrame.MarginRight = 0
  $Shape.TextFrame.MarginTop = 0
  $Shape.TextFrame.MarginBottom = 0
  $Shape.TextFrame.VerticalAnchor = 1
  $range = $Shape.TextFrame.TextRange
  $range.Font.Name = $Font
  $range.Font.Size = $Size
  $range.Font.Color.RGB = $Color
  $range.Font.Bold = [int]$Bold
  $range.ParagraphFormat.Alignment = $Align
}

function Add-Text($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [string]$Text, [double]$Size, [int]$Color, [bool]$Bold = $false, [int]$Align = 1, [string]$Font = 'Arial') {
  $shape = $Slide.Shapes.AddTextbox(1, $X * 72, $Y * 72, $W * 72, $H * 72)
  Set-TextStyle $shape $Text $Size $Color $Bold $Align $Font
  $shape.TextFrame.AutoSize = 0
  $shape.Height = $H * 72
  $shape.Width = $W * 72
  return $shape
}

function Add-Rect($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [int]$Fill, [int]$Border = $script:Line) {
  $shape = $Slide.Shapes.AddShape(1, $X * 72, $Y * 72, $W * 72, $H * 72)
  $shape.Fill.Solid()
  $shape.Fill.ForeColor.RGB = $Fill
  $shape.Line.ForeColor.RGB = $Border
  $shape.Line.Weight = 0.8
  return $shape
}

function Add-Card($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [string]$Title, [string]$Body, [int]$Fill = $script:Card, [int]$TitleColor = $script:Red, [double]$BodySize = 10.2) {
  [void](Add-Rect $Slide $X $Y $W $H $Fill)
  [void](Add-Text $Slide ($X + 0.16) ($Y + 0.14) ($W - 0.32) 0.34 $Title 12.8 $TitleColor $true)
  [void](Add-Text $Slide ($X + 0.16) ($Y + 0.56) ($W - 0.32) ($H - 0.68) $Body $BodySize $script:Ink $false)
}

function Add-Callout($Slide, [double]$Y, [string]$Text, [double]$H = 0.56, [int]$Fill = $script:Dark, [int]$TextColor = $script:White) {
  [void](Add-Rect $Slide 0.52 $Y 8.96 $H $Fill $Fill)
  [void](Add-Text $Slide 0.69 ($Y + 0.11) 8.62 ($H - 0.18) $Text 10.1 $TextColor $true)
}

function Get-Placeholder($Slide, [int]$PlaceholderType) {
  for ($i = 1; $i -le $Slide.Shapes.Count; $i++) {
    $shape = $Slide.Shapes.Item($i)
    if ($shape.Type -eq 14) {
      try { if ($shape.PlaceholderFormat.Type -eq $PlaceholderType) { return $shape } } catch {}
    }
  }
  return $null
}

function Set-SlideTitle($Slide, [string]$Text) {
  $title = Get-Placeholder $Slide 1
  if ($null -ne $title) { Set-TextStyle $title $Text 24 $script:White $true }
}

function Add-ContentSlide($Presentation, [int]$Position, $Layout, [string]$Title) {
  $slide = $Presentation.Slides.AddSlide($Position, $Layout)
  Set-SlideTitle $slide $Title
  return $slide
}

function Add-AgendaItem($Slide, [double]$X, [double]$Y, [string]$Number, [string]$Title, [string]$Detail, [string]$Range) {
  [void](Add-Rect $Slide $X $Y 4.34 1.24 $script:Card)
  $circle = $Slide.Shapes.AddShape(9, ($X + 0.16) * 72, ($Y + 0.27) * 72, 0.54 * 72, 0.54 * 72)
  $circle.Fill.Solid(); $circle.Fill.ForeColor.RGB = $script:Red; $circle.Line.Visible = 0
  [void](Add-Text $Slide ($X + 0.16) ($Y + 0.27) 0.54 0.54 $Number 12 $script:White $true 2)
  [void](Add-Text $Slide ($X + 0.84) ($Y + 0.13) 3.32 0.34 $Title 12.2 $script:Red $true)
  [void](Add-Text $Slide ($X + 0.84) ($Y + 0.49) 3.32 0.42 $Detail 9.4 $script:Ink $false)
  [void](Add-Text $Slide ($X + 0.84) ($Y + 0.96) 3.32 0.18 $Range 8.8 $script:Muted $true)
}

function Add-SchemaCell($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [string]$Text, [int]$Fill, [int]$TextColor, [bool]$Bold = $false, [double]$Size = 8.6) {
  [void](Add-Rect $Slide $X $Y $W $H $Fill)
  [void](Add-Text $Slide ($X + 0.08) ($Y + 0.035) ($W - 0.16) ($H - 0.07) $Text $Size $TextColor $Bold)
}

function Add-SchemaTable($Slide, [object[]]$Rows) {
  $x = 0.52
  $y = 1.63
  $widths = @(1.72, 3.08, 4.16)
  $headers = @('BẢNG', 'KHÓA / QUAN HỆ', 'VAI TRÒ / RÀNG BUỘC CHÍNH')
  $headerHeight = 0.42
  $rowHeight = if ($Rows.Count -gt 7) { 0.52 } else { 0.59 }
  $cursor = $x
  for ($col = 0; $col -lt 3; $col++) {
    Add-SchemaCell $Slide $cursor $y $widths[$col] $headerHeight $headers[$col] $script:Red $script:White $true 8.5
    $cursor += $widths[$col]
  }
  for ($row = 0; $row -lt $Rows.Count; $row++) {
    $top = $y + $headerHeight + ($row * $rowHeight)
    $fill = if ($row % 2 -eq 0) { $script:Card } else { $script:White }
    $entry = $Rows[$row]
    $cursor = $x
    Add-SchemaCell $Slide $cursor $top $widths[0] $rowHeight $entry.Table $fill $script:Red $true 8.55
    $cursor += $widths[0]
    Add-SchemaCell $Slide $cursor $top $widths[1] $rowHeight $entry.Keys $fill $script:Ink $false 8.25
    $cursor += $widths[1]
    Add-SchemaCell $Slide $cursor $top $widths[2] $rowHeight $entry.Role $fill $script:Ink $false 8.25
  }
}

function Replace-ShapeText($Slide, [string]$Match, [string]$Replacement) {
  for ($i = 1; $i -le $Slide.Shapes.Count; $i++) {
    $shape = $Slide.Shapes.Item($i)
    if ($shape.HasTextFrame -and $shape.TextFrame.HasText -and $shape.TextFrame.TextRange.Text -like "*$Match*") {
      Set-TextStyle $shape $Replacement 24 $script:Red $true
      return
    }
  }
}

if (-not (Test-Path -LiteralPath $InputPath)) { throw "Không tìm thấy deck nguồn: $InputPath" }
$inputFull = [System.IO.Path]::GetFullPath($InputPath)
$outputFull = [System.IO.Path]::GetFullPath($OutputPath)
if ($inputFull -eq $outputFull) { throw 'OutputPath phải khác InputPath để giữ nguyên deck gốc.' }
if (Test-Path -LiteralPath $outputFull) { Remove-Item -LiteralPath $outputFull -Force }
Copy-Item -LiteralPath $inputFull -Destination $outputFull

$app = New-Object -ComObject PowerPoint.Application
$app.Visible = -1
$presentation = $null
try {
  $presentation = $app.Presentations.Open($outputFull, $false, $false, $false)
  if ($presentation.Slides.Count -ne 12) {
    throw "Deck nguồn có $($presentation.Slides.Count) slide; script này được thiết kế cho bản HustLingo_Backend 12 slide."
  }

  $old = @{}
  for ($i = 1; $i -le $presentation.Slides.Count; $i++) { $old[$i] = $presentation.Slides.Item($i) }
  $layout = $old[3].CustomLayout

  # Remove the duplicated sync diagram, then put security before the database section
  # and the sync overview before its detailed flow.
  $old[10].Delete()
  $old[7].MoveTo(5)
  $old[9].MoveTo(8)

  Set-SlideTitle $old[7] '2. Xác thực và bảo mật dữ liệu'
  Set-SlideTitle $old[5] '3.1 Thiết kế dữ liệu và quan hệ'
  Set-SlideTitle $old[6] '3.2 Lược đồ quan hệ database'
  Set-SlideTitle $old[9] '4.1 Đồng bộ tiến độ | local-first best-effort'
  Set-SlideTitle $old[8] '4.2 Luồng local-first và giới hạn offline'
  Set-SlideTitle $old[11] '5. Nạp và xuất bản nội dung'

  # 3. Agenda.
  $toc = Add-ContentSlide $presentation 3 $layout 'Nội dung trình bày'
  [void](Add-Text $toc 0.55 1.25 8.9 0.28 'Đi theo luồng từ kiến trúc ứng dụng tới dữ liệu, đồng bộ và vận hành.' 10.4 $script:Muted)
  Add-AgendaItem $toc 0.55 1.62 '01' 'Kiến trúc và API' 'Expo, Supabase, service truy vấn dữ liệu' 'Slide 4–6'
  Add-AgendaItem $toc 5.1 1.62 '02' 'Xác thực và bảo mật' 'Auth, JWT, PostgREST và RLS' 'Slide 7'
  Add-AgendaItem $toc 0.55 3.04 '03' 'Cơ sở dữ liệu' 'ERD và tóm tắt khóa của từng bảng' 'Slide 8–11'
  Add-AgendaItem $toc 5.1 3.04 '04' 'Đồng bộ và offline' 'Lưu tiến độ local, cloud và giới hạn' 'Slide 12–13'
  Add-AgendaItem $toc 0.55 4.46 '05' 'Pipeline và phát hành' 'Migration, importer, môi trường và build' 'Slide 14–15'
  Add-AgendaItem $toc 5.1 4.46 '06' 'Hiện trạng và hướng tiếp' 'Phần đã có, phần cần xác nhận, roadmap' 'Slide 16'
  Add-Callout $toc 5.94 'Thông điệp chính: dữ liệu catalog dùng chung; hồ sơ và tiến độ được giới hạn theo tài khoản.' 0.58

  # 6. Service and data API.
  $api = Add-ContentSlide $presentation 6 $layout '1.3 Frontend lấy dữ liệu qua API như thế nào?'
  [void](Add-Text $api 0.55 1.25 8.9 0.28 'Màn hình gửi yêu cầu đến service; Supabase SDK chuyển yêu cầu tới REST API của PostgREST.' 10.1 $script:Muted)
  Add-Card $api 0.55 1.62 4.34 4.18 'Nội dung học dùng chung' "Khi mở Bài học, Luyện tập hoặc Gia sư, màn hình yêu cầu service lấy danh sách phù hợp từ Supabase.`n`nCó thể lọc theo trình độ, chủ đề hoặc kỹ năng. Ứng dụng nhận các mục đã xuất bản theo thứ tự.`n`nVí dụ: chọn B1 + Listening → danh sách bài nghe mức B1." $script:Card $script:Red 10.1
  Add-Card $api 5.1 1.62 4.34 4.18 'Dữ liệu riêng của người học' "Sau khi đăng nhập, ứng dụng gửi kèm session để Supabase biết tài khoản đang truy cập.`n`nNgười học xem/cập nhật hồ sơ, lưu tiến độ và gửi góp ý. RLS giới hạn các thao tác vào dữ liệu được phép.`n`nVí dụ: hoàn thành một bài → lưu tiến độ cho đúng tài khoản." $script:PaleRed $script:DarkRed 10.1
  Add-Callout $api 5.96 'Service là lớp kết nối trong ứng dụng Expo; Supabase SDK gọi REST PostgREST. Project không có API Express tự viết.' 0.58

  # 10. Compact schema reference: eight identity and lesson-domain tables.
  $schemaCore = Add-ContentSlide $presentation 10 $layout '3.3 Lược đồ: tài khoản và cấu trúc bài học'
  [void](Add-Text $schemaCore 0.55 1.25 8.9 0.28 'Khóa chính, khóa ngoại và vai trò của từng bảng trong miền người dùng và bài học.' 10.1 $script:Muted)
  $coreRows = @(
    @{ Table = 'auth.users'; Keys = 'PK id · Supabase quản lý'; Role = 'Danh tính, email và OAuth metadata; nguồn ID cho các bảng người dùng.' },
    @{ Table = 'profiles'; Keys = 'PK/FK id → auth.users.id'; Role = 'Tên/avatar, role/status, CEFR và mục tiêu học; RLS chỉ chủ tài khoản.' },
    @{ Table = 'learning_progress'; Keys = 'PK/FK user_id → auth.users.id'; Role = 'Một hàng/user; state JSONB chứa ID học/lưu/ôn, bài hoàn thành và bộ đếm.' },
    @{ Table = 'feedback'; Keys = 'PK id; FK user_id → auth.users.id'; Role = 'Góp ý 5–2.000 ký tự; tài khoản chỉ được gửi góp ý của mình.' },
    @{ Table = 'topics'; Keys = 'PK id'; Role = 'Chủ đề, CEFR, icon/màu, thứ tự và publish; nhóm nhiều từ vựng và bài học.' },
    @{ Table = 'vocabulary_entries'; Keys = 'PK id; nullable FK topic_id'; Role = '30 cột từ vựng: nghĩa/ví dụ, CEFR, tags, relevance, nguồn và QA; xóa topic thì SET NULL.' },
    @{ Table = 'lessons'; Keys = 'PK id; nullable FK topic_id'; Role = 'Tiêu đề, loại vocabulary/grammar, CEFR và publish; topic xóa thì SET NULL.' },
    @{ Table = 'lesson_items'; Keys = 'PK (lesson_id, position); FK lesson/vocabulary/grammar'; Role = 'Mỗi dòng phải trỏ đúng một loại nội dung; xóa nội dung liên quan thì cascade.' }
  )
  Add-SchemaTable $schemaCore $coreRows
  Add-Callout $schemaCore 6.35 'Trigger tạo profile + tiến độ; lesson_items là bảng nối lesson với vocabulary hoặc grammar.' 0.42

  # 11. Compact schema reference: seven content catalog tables.
  $schemaCatalog = Add-ContentSlide $presentation 11 $layout '3.4 Lược đồ: grammar, luyện tập và gia sư'
  [void](Add-Text $schemaCatalog 0.55 1.25 8.9 0.28 'Bảy bảng catalog còn lại, gồm các khóa ghép, JSONB và quy tắc xóa chính.' 10.1 $script:Muted)
  $catalogRows = @(
    @{ Table = 'grammar_points'; Keys = 'PK id'; Role = 'CEFR A1–C1, category, pattern, giải thích và common_mistake JSONB.' },
    @{ Table = 'grammar_examples'; Keys = 'PK (grammar_point_id, position); FK grammar_points'; Role = 'Câu ví dụ + bản dịch; xóa grammar point thì xóa ví dụ.' },
    @{ Table = 'grammar_exercises'; Keys = 'PK id; UNIQUE (source_dataset, source_record_id)'; Role = 'Cloze, đáp án, distractors JSONB, URL/license nguồn; không FK grammar_points.' },
    @{ Table = 'practice_content'; Keys = 'PK id; index (skill, CEFR, order)'; Role = 'Listening/reading/writing/speaking; payload JSONB theo từng kỹ năng.' },
    @{ Table = 'ai_tutors'; Keys = 'PK id'; Role = 'Hồ sơ hiển thị tutor, tone/màu, thứ tự và trạng thái publish.' },
    @{ Table = 'tutor_scenarios'; Keys = 'PK id; FK tutor_id → ai_tutors.id'; Role = 'Tình huống luyện tập theo tutor; xóa tutor thì xóa scenario.' },
    @{ Table = 'tutor_scenario_messages'; Keys = 'PK (scenario_id, position); FK scenario_id'; Role = 'Hội thoại mẫu có thứ tự và role; không phải lịch sử chat người dùng.' }
  )
  Add-SchemaTable $schemaCatalog $catalogRows
  Add-Callout $schemaCatalog 6.35 '14 bảng public + auth.users; tutor hiện lưu catalog/hội thoại mẫu, chưa gọi LLM backend.' 0.42

  # 15. Runtime and deployment configuration.
  $deployment = Add-ContentSlide $presentation 15 $layout '5.2 Môi trường và triển khai'
  [void](Add-Text $deployment 0.55 1.25 8.9 0.28 'Tách cấu hình public của app khỏi secret dùng để nhập dữ liệu.' 10.1 $script:Muted)
  Add-Card $deployment 0.52 1.62 2.12 3.78 '1 · Cấu hình app' "EXPO_PUBLIC_SUPABASE_URL`nEXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`n`nCác giá trị public được`nhợp nhất vào web/mobile.`nRLS vẫn bắt buộc để`ngiới hạn quyền client." $script:PaleRed $script:DarkRed 9.15
  Add-Card $deployment 2.82 1.62 2.12 3.78 '2 · Migrations' "Chạy SQL theo thứ tự`ntrong supabase/migrations.`n`nTạo bảng, FK, index,`nRLS policy và GRANT.`n`nKiểm tra migration trên`nđúng project Supabase." $script:Card $script:Red 9.15
  Add-Card $deployment 5.12 1.62 2.12 3.78 '3 · Importer' "SUPABASE_URL`nSUPABASE_SECRET_KEY`nchỉ ở môi trường backend.`n`nChạy db:seed:content.`nImporter upsert theo lô;`nchạy lại không truncate`ndữ liệu tài khoản." $script:PaleGold $script:Ink 9.15
  Add-Card $deployment 7.42 1.62 2.12 3.78 '4 · Build' "Expo Web triển khai web.`nEAS Build tạo Android/iOS.`n`nGoogle OAuth cần đúng`norigin, callback và redirect.`n`nEAS build environment`ncũng phải có biến public." $script:Card $script:Red 9.15
  Add-Callout $deployment 5.72 'Không đặt service_role / secret key trong EXPO_PUBLIC hoặc bundle; service key vượt qua RLS.' 0.64

  # 16. Implementation status and next steps.
  $status = Add-ContentSlide $presentation 16 $layout '6. Hiện trạng và hướng phát triển'
  [void](Add-Text $status 0.55 1.25 8.9 0.28 'Phân biệt phần đã có trong source code với trạng thái dữ liệu trên Supabase.' 10.1 $script:Muted)
  Add-Card $status 0.55 1.62 4.34 3.88 'ĐÃ CÓ TRONG PROJECT' "Supabase Auth, session và quản lý hồ sơ.`nRLS cho dữ liệu cá nhân và catalog published.`nService đọc catalog, profile, progress, feedback.`nSchema cho lesson, practice, tutor và grammar.`nImporter upsert dữ liệu từ nguồn local/GitHub.`nAsyncStorage lưu tiến độ guest và bản local." $script:PaleGreen $script:Green 9.9
  Add-Card $status 5.1 1.62 4.34 3.88 'CẦN XÁC NHẬN / PHÁT TRIỂN' "Xác nhận migrations và seed đã hoàn tất trên remote.`nĐợt seed grammar trước đây gặp fetch failed;`nkiểm tra số hàng sau khi chạy lại thành công.`nTab bài học/luyện tập/tutor đang để trống theo yêu cầu.`nChưa có API LLM, outbox offline hoặc cache catalog.`n`nƯu tiên: nối UI → outbox/retry → Edge Function AI." $script:PaleGold $script:DarkRed 9.65
  Add-Callout $status 5.88 'Có bảng và service trong source không đồng nghĩa dữ liệu đã seed đủ hoặc UI đã nối hoàn chỉnh.' 0.58

  $presentation.Save()
  Write-Output "Saved expanded deck: $outputFull"
  Write-Output "Slide count: $($presentation.Slides.Count)"
}
finally {
  if ($null -ne $presentation) { try { $presentation.Close() } catch {} }
  if ($null -ne $app) {
    try { $app.Quit() } catch {}
    [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($app)
  }
}
