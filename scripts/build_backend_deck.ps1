param(
  [Parameter(Mandatory = $true)][string]$TemplatePath,
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

function Set-TextStyle($Shape, [string]$Text, [double]$Size, [int]$Color, [bool]$Bold = $false, [int]$Align = 1) {
  $Shape.TextFrame.TextRange.Text = $Text
  $Shape.TextFrame.WordWrap = -1
  $Shape.TextFrame.AutoSize = 0
  $Shape.TextFrame.MarginLeft = 0
  $Shape.TextFrame.MarginRight = 0
  $Shape.TextFrame.MarginTop = 0
  $Shape.TextFrame.MarginBottom = 0
  $range = $Shape.TextFrame.TextRange
  $range.Font.Name = 'Arial'
  $range.Font.Size = $Size
  $range.Font.Color.RGB = $Color
  $range.Font.Bold = [int]$Bold
  $range.ParagraphFormat.Alignment = $Align
}

function Add-Text($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [string]$Text, [double]$Size, [int]$Color, [bool]$Bold = $false, [int]$Align = 1) {
  $shape = $Slide.Shapes.AddTextbox(1, $X * 72, $Y * 72, $W * 72, $H * 72)
  Set-TextStyle $shape $Text $Size $Color $Bold $Align
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

function Add-Line($Slide, [double]$X1, [double]$Y1, [double]$X2, [double]$Y2, [int]$Color = $script:Red, [bool]$Arrow = $false) {
  $shape = $Slide.Shapes.AddLine($X1 * 72, $Y1 * 72, $X2 * 72, $Y2 * 72)
  $shape.Line.ForeColor.RGB = $Color
  $shape.Line.Weight = 1.8
  if ($Arrow) { $shape.Line.EndArrowheadStyle = 2 }
}

function Add-Card($Slide, [double]$X, [double]$Y, [double]$W, [double]$H, [string]$Title, [string]$Body, [int]$Fill = $script:Card, [int]$TitleColor = $script:Red, [double]$BodySize = 11.5) {
  [void](Add-Rect $Slide $X $Y $W $H $Fill)
  [void](Add-Text $Slide ($X + 0.16) ($Y + 0.13) ($W - 0.32) 0.35 $Title 14 $TitleColor $true)
  [void](Add-Text $Slide ($X + 0.16) ($Y + 0.55) ($W - 0.32) ($H - 0.67) $Body $BodySize $script:Ink $false)
}

function Add-Callout($Slide, [double]$Y, [string]$Text, [int]$Fill = $script:PaleGold, [int]$TextColor = $script:Ink) {
  [void](Add-Rect $Slide 0.55 $Y 8.9 0.48 $Fill $Fill)
  [void](Add-Text $Slide 0.72 ($Y + 0.12) 8.55 0.24 $Text 10.4 $TextColor $true)
}

function Get-Placeholder($Slide, [int]$PlaceholderType) {
  for ($i = 1; $i -le $Slide.Shapes.Count; $i++) {
    $shape = $Slide.Shapes.Item($i)
    if ($shape.Type -eq 14 -and $shape.PlaceholderFormat.Type -eq $PlaceholderType) { return $shape }
  }
  return $null
}

function Set-SlideTitle($Slide, [string]$Text) {
  $title = Get-Placeholder $Slide 1
  if ($null -ne $title) {
    Set-TextStyle $title $Text 24 $script:White $true
  }
}

function Add-SectionLabel($Slide, [double]$X, [double]$Y, [double]$W, [string]$Text, [int]$Color = $script:Red) {
  [void](Add-Text $Slide $X $Y $W 0.3 $Text 11 $Color $true)
}

function Add-MemberCard($Slide, [double]$X, [double]$Y, [string]$Name, [string]$Id) {
  [void](Add-Rect $Slide $X $Y 4.15 1.38 $script:Card)
  [void](Add-Text $Slide ($X + 0.22) ($Y + 0.22) 3.72 0.42 $Name 18 $script:Ink $true)
  [void](Add-Text $Slide ($X + 0.22) ($Y + 0.78) 3.72 0.3 ("Mã sinh viên  " + $Id) 12 $script:Red $true)
}

if (-not (Test-Path -LiteralPath $TemplatePath)) { throw "Không tìm thấy template: $TemplatePath" }
if (Test-Path -LiteralPath $OutputPath) { Remove-Item -LiteralPath $OutputPath -Force }

$app = New-Object -ComObject PowerPoint.Application
$app.Visible = -1
$presentation = $null
try {
  $presentation = $app.Presentations.Open($TemplatePath, $false, $false, $false)

  # Keep the HUST cover, member page, six content layouts, and closing page.
  foreach ($index in @(11, 8, 2, 1)) { $presentation.Slides.Item($index).Delete() }

  # Slide 1: cover.
  $cover = $presentation.Slides.Item(1)
  Set-TextStyle $cover.Shapes.Item(2) 'HustLingo: Thiết kế Backend' 39 $script:Red $true
  Set-TextStyle $cover.Shapes.Item(3) "Kiến trúc dữ liệu | Bảo mật | Đồng bộ tiến độ`nGiải pháp kỹ thuật và trạng thái hiện thực hóa" 21 $script:Red $false

  # Slide 2: team.
  $team = $presentation.Slides.Item(2)
  Set-SlideTitle $team 'Thành viên nhóm'
  Add-MemberCard $team 0.62 1.7 'Hoàng Minh Hải' '20235072'
  Add-MemberCard $team 5.05 1.7 'Nguyễn Quang Huy' '20230039'
  Add-MemberCard $team 0.62 3.55 'Hoàng Đức Khánh' '20235117'
  Add-MemberCard $team 5.05 3.55 'Nguyễn Tùng Dương' '20230024'

  # Slide 3: architecture.
  $architecture = $presentation.Slides.Item(3)
  Set-SlideTitle $architecture '1. Kiến trúc tổng quan'
  [void](Add-Text $architecture 0.55 1.25 8.8 0.3 'Backend serverless: ứng dụng gọi Supabase SDK trực tiếp, không có API server tự quản.' 10.6 $script:Muted $false)
  Add-Line $architecture 3.02 2.55 3.48 2.55 $script:Red $true
  Add-Line $architecture 6.28 2.55 6.72 2.55 $script:Red $true
  Add-Card $architecture 0.48 1.72 2.5 1.65 'ỨNG DỤNG EXPO' "Web  •  iOS  •  Android`nAuthContext`nLearningContext" $script:Card $script:Red 11.2
  Add-Card $architecture 3.5 1.72 2.75 1.65 'SERVICE LAYER' "learningContent`nCatalog đã xuất bản`n`nsupabaseData`nProfile • progress • feedback" $script:Card $script:Red 10.6
  Add-Card $architecture 6.75 1.72 2.75 1.65 'SUPABASE' "Auth`nPostgREST API`nPostgreSQL`nRow Level Security" $script:PaleRed $script:DarkRed 11.2
  Add-Card $architecture 0.65 4.05 4.0 1.25 'LƯU TRỮ TRÊN THIẾT BỊ' 'AsyncStorage giữ tiến độ guest và bản local của người học.' $script:PaleGold $script:Ink 11
  Add-Card $architecture 5.15 4.05 4.0 1.25 'PIPELINE NỘI DUNG' 'Nguồn JSON / dataset → import-content.mjs → PostgreSQL. Service key chỉ dùng khi nhập.' $script:Card $script:Ink 10.8
  Add-Callout $architecture 5.75 'RLS kiểm tra quyền ở database; khóa service role không nằm trong bundle ứng dụng.'

  # Slide 4: relational model.
  $model = $presentation.Slides.Item(4)
  Set-SlideTitle $model '2. Thiết kế dữ liệu và quan hệ'
  [void](Add-Rect $model 0.5 1.42 4.25 4.45 $script:Card)
  [void](Add-Rect $model 5.05 1.42 4.35 4.45 $script:Card)
  Add-SectionLabel $model 0.72 1.62 3.8 'DỮ LIỆU THÀNH VIÊN'
  Add-Card $model 0.75 2.02 3.72 0.72 'auth.users' 'Nguồn danh tính Supabase Auth' $script:White $script:Ink 10.4
  Add-Line $model 2.6 2.75 2.6 3.05 $script:Gold $false
  Add-Card $model 0.75 3.08 1.73 0.98 'profiles' '1 tài khoản : 1 hồ sơ' $script:PaleRed $script:Ink 9.8
  Add-Card $model 2.72 3.08 1.75 0.98 'progress' "learning_progress`n1 state JSONB / user" $script:PaleGold $script:Ink 8.8
  Add-Card $model 0.75 4.32 3.72 0.88 'feedback' 'Mỗi tài khoản có thể gửi nhiều góp ý' $script:White $script:Ink 10
  [void](Add-Text $model 0.78 5.4 3.65 0.35 'Tất cả hàng cá nhân đều gắn user_id / id.' 9.4 $script:Muted $false)
  Add-SectionLabel $model 5.28 1.62 3.8 'KHO NỘI DUNG HỌC'
  Add-Card $model 5.3 2.02 1.65 0.82 'topics' 'Chủ đề' $script:White $script:Ink 10
  Add-Line $model 6.96 2.42 7.25 2.42 $script:Gold $true
  Add-Card $model 7.32 2.02 1.78 0.82 'vocabulary' 'Từ vựng' $script:PaleGold $script:Ink 10
  Add-Line $model 6.12 2.9 6.12 3.17 $script:Gold $true
  Add-Card $model 5.3 3.2 1.65 0.82 'lessons' 'Bài học' $script:White $script:Ink 10
  Add-Line $model 6.96 3.6 7.25 3.6 $script:Gold $true
  Add-Card $model 7.32 3.2 1.78 0.82 'lesson_items' 'Mục trong bài' $script:PaleRed $script:Ink 9.5
  Add-Card $model 5.3 4.48 1.65 0.82 'grammar' 'grammar_points' $script:White $script:Ink 8.8
  Add-Line $model 6.96 4.88 7.25 4.88 $script:Gold $true
  Add-Card $model 7.32 4.48 1.78 0.82 'examples' 'grammar_examples' $script:PaleGold $script:Ink 9.2
  Add-Callout $model 6.05 'Khóa ngoại và constraint giữ quan hệ hợp lệ; lesson_items trỏ đúng một loại nội dung.'

  # Slide 5: auth and security.
  $security = $presentation.Slides.Item(5)
  Set-SlideTitle $security '3. Xác thực và bảo mật dữ liệu'
  Add-Card $security 0.65 1.62 4.15 3.95 'ĐĂNG NHẬP VÀ KHỞI TẠO' "Google OAuth hoặc email/password`n`nSupabase Auth cấp session`n`nTrigger tạo profiles và learning_progress`n`nWeb dùng callback PKCE" $script:PaleRed $script:DarkRed 12.1
  Add-Card $security 5.18 1.62 4.15 3.95 'QUYỀN TRUY CẬP TẠI POSTGRES' "profiles: auth.uid() = id`n`nlearning_progress: auth.uid() = user_id`n`nCatalog: chỉ SELECT hàng is_published`n`nClient dùng publishable key" $script:Card $script:Red 12.1
  Add-Callout $security 5.9 'Service role có thể vượt RLS: chỉ dùng trong importer phía server, tuyệt đối không nhúng vào app.' $script:PaleGold $script:DarkRed

  # Slide 6: progress synchronization.
  $sync = $presentation.Slides.Item(6)
  Set-SlideTitle $sync '4. Giải pháp đồng bộ tiến độ'
  [void](Add-Text $sync 0.58 1.08 8.9 0.3 'Luồng đang chạy trong LearningContext và supabaseData' 11 $script:Muted $false)
  $stepY = 1.72
  $stepW = 2.02
  $stepXs = @(0.48, 2.92, 5.36, 7.8)
  $stepTitles = @('1  GHI LOCAL', '2  ĐỌC CLOUD', '3  HỢP NHẤT', '4  UPSERT')
  $stepBodies = @('AsyncStorage lưu state sau thao tác học.', 'Khi đăng nhập, tải learning_progress.', 'Hợp các danh sách ID; local và cloud được gộp.', 'Debounce 1,2 giây rồi ghi JSONB theo user.')
  for ($i = 0; $i -lt 4; $i++) {
    if ($i -lt 3) { Add-Line $sync ($stepXs[$i] + $stepW) ($stepY + 0.78) ($stepXs[$i + 1] - 0.12) ($stepY + 0.78) $script:Red $true }
    Add-Card $sync $stepXs[$i] $stepY $stepW 1.72 $stepTitles[$i] $stepBodies[$i] $script:Card $script:Red 10.2
  }
  Add-Card $sync 0.62 4.12 4.08 1.22 'ĐÃ CÓ' 'Guest học local; người đăng nhập có syncNow và tự ghi cloud sau mỗi thay đổi.' $script:PaleGreen $script:Green 10.4
  Add-Card $sync 5.1 4.12 4.08 1.22 'GIỚI HẠN HIỆN TẠI' 'Lỗi mạng bị bỏ qua; chưa có outbox bền, retry hoặc xử lý xung đột giữa thiết bị.' $script:PaleGold $script:DarkRed 10.4
  Add-Callout $sync 5.8 'Nâng cấp: outbox + retry backoff + ID idempotent; dùng RPC cập nhật bộ đếm nguyên tử.'

  # Slide 7: content pipeline and current catalog size.
  $content = $presentation.Slides.Item(7)
  Set-SlideTitle $content '5. Pipeline nội dung và quy mô catalog'
  [void](Add-Text $content 0.58 1.26 8.9 0.25 'Số hàng ước tính đang hiển thị trong Supabase Studio' 10.2 $script:Muted $false)
  $metricXs = @(0.55, 2.8, 5.05, 7.3)
  $metricValues = @('10.000', '98', '169', '4.227')
  $metricLabels = @('từ vựng', 'điểm ngữ pháp', 'bài học', 'lesson_items')
  for ($i = 0; $i -lt 4; $i++) {
    [void](Add-Rect $content $metricXs[$i] 1.65 2.08 1.22 $script:Card)
    [void](Add-Text $content ($metricXs[$i] + 0.12) 1.87 1.84 0.48 $metricValues[$i] 23 $script:Red $true 2)
    [void](Add-Text $content ($metricXs[$i] + 0.12) 2.45 1.84 0.25 $metricLabels[$i] 10.2 $script:Ink $false 2)
  }
  [void](Add-Text $content 0.68 3.22 1.4 0.3 'PIPELINE' 10.5 $script:Red $true)
  $pipeX = @(0.62, 2.85, 5.08, 7.31)
  $pipeT = @('Dataset', 'Importer', 'PostgreSQL', 'Service')
  $pipeB = @("JSON / chuẩn hóa", "import-content.mjs`nUpsert theo lô", "RLS / published", "learningContent`nQuery theo lọc")
  for ($i = 0; $i -lt 4; $i++) {
    if ($i -lt 3) { Add-Line $content ($pipeX[$i] + 1.72) 4.06 ($pipeX[$i + 1] - 0.12) 4.06 $script:Gold $true }
    Add-Card $content $pipeX[$i] 3.55 1.74 1.12 $pipeT[$i] $pipeB[$i] $script:White $script:Ink 8.8
  }
  [void](Add-Text $content 0.68 4.95 8.6 0.3 'Cùng ảnh DB: 15 topics | 196 grammar_examples' 10.5 $script:Muted $false)
  Add-Callout $content 5.42 'Practice/Tutor và grammar_exercises có migration trong repo; cần xác nhận đã chạy và seed trên Supabase.' $script:PaleGold $script:DarkRed

  # Slide 8: implementation status and roadmap.
  $status = $presentation.Slides.Item(8)
  Set-SlideTitle $status '6. Trạng thái hiện thực hóa'
  Add-Card $status 0.62 1.62 4.12 3.92 'ĐÃ CÓ TRONG CODE' "- Supabase Auth, profile và feedback`n`n- Đọc catalog published qua service`n`n- Lưu tiến độ guest bằng AsyncStorage`n`n- Đọc/ghi tiến độ tài khoản lên Supabase" $script:PaleGreen $script:Green 11.2
  Add-Card $status 5.12 1.62 4.12 3.92 'CẦN HOÀN THIỆN / XÁC NHẬN' "- Chạy migration và seed Practice/Tutor, grammar_exercises`n`n- Nối các tab UI (hiện đang để trống theo yêu cầu)`n`n- Chưa có API/Edge Function gọi LLM`n`n- Thêm outbox retry và cache catalog offline" $script:PaleGold $script:DarkRed 10.7
  Add-Callout $status 5.92 'Có service và schema chưa đồng nghĩa tính năng UI hoặc backend AI đã hoàn tất.' $script:PaleRed $script:DarkRed

  # Slide 9: closing.
  $closing = $presentation.Slides.Item(9)
  for ($i = 1; $i -le $closing.Shapes.Count; $i++) {
    $shape = $closing.Shapes.Item($i)
    if ($shape.HasTextFrame -and $shape.TextFrame.HasText -and $shape.TextFrame.TextRange.Text -like '*THANK YOU*') {
      Set-TextStyle $shape 'CẢM ƠN!' 44 $script:Red $true
    }
  }

  $presentation.SaveAs($OutputPath, 24)
  $presentation.Close()
  Write-Output "Saved deck: $OutputPath"
}
finally {
  if ($null -ne $presentation) {
    try { $presentation.Close() } catch {}
  }
  $app.Quit()
  [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($app)
}
