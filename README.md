
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>주상절리 형성 시뮬레이션</title>
    <!-- CSS 파일 연결 -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>주상절리 인터랙티브 시뮬레이터</h1>
    <p>⚙️ 조건에 따라 뜨거운 용암이 식으며 육각 기둥으로 굳어가는 과정을 관찰하세요.</p>

    <div class="container">
        <div id="canvas-container">
            <canvas id="lavaCanvas" width="500" height="400"></canvas>
        </div>

        <div class="sidebar">
            <div class="control-group">
                <h3>환경 제어 (Environment)</h3>
                
                <label for="speed-slider">
                    <span>⚡ 냉각 속도</span>
                    <span id="speed-val">보통</span>
                </label>
                <input type="range" id="speed-slider" min="1" max="5" value="3">
                
                <label for="thickness-slider">
                    <span>📏 용암의 두께</span>
                    <span id="thickness-val">보통</span>
                </label>
                <input type="range" id="thickness-slider" min="1" max="5" value="3">
            </div>

            <div>
                <button id="start-btn">🌋 냉각 시각화 시작</button>
                <div id="status">대기 중...</div>
            </div>
        </div>
    </div>

    <!-- JavaScript 파일 연결 -->
    <script src="script.js"></script>
</body>
</html>
