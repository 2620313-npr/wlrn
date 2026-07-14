const canvas = document.getElementById('lavaCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const statusDiv = document.getElementById('status');

const speedSlider = document.getElementById('speed-slider');
const thicknessSlider = document.getElementById('thickness-slider');
const speedVal = document.getElementById('speed-val');
const thicknessVal = document.getElementById('thickness-val');

let centers = [];
let animationId = null;
let currentProgress = 0; // 냉각 진행도 (0 ~ 100)

const textMap = { 1: "아주 낮음", 2: "낮음", 3: "보통", 4: "높음", 5: "아주 높음" };
const thickMap = { 1: "아주 얇음", 2: "얇음", 3: "보통", 4: "두꺼움", 5: "아주 두꺼움" };

// 슬라이더 텍스트 실시간 동기화
speedSlider.oninput = () => speedVal.innerText = textMap[speedSlider.value];
thicknessSlider.oninput = () => thicknessVal.innerText = thickMap[thicknessSlider.value];

// 초기 화면 설정 (뜨겁고 밝은 용암 상태)
function resetCanvas() {
    cancelAnimationFrame(animationId);
    startBtn.disabled = false;
    currentProgress = 0;
    statusDiv.innerText = "용암이 뜨겁게 끓고 있습니다.";
    
    let grad = ctx.createRadialGradient(250, 200, 10, 250, 200, 300);
    grad.addColorStop(0, '#ff4500'); // 더 밝은 주황-빨강
    grad.addColorStop(1, '#cc1100');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 냉각 진행도에 따른 보로노이 수축 격자 구현
function renderSimulation(progress) {
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let minDist = Infinity;
            let secMinDist = Infinity;
            let closestIdx = 0;

            for (let i = 0; i < centers.length; i++) {
                const dx = x - centers[i].x;
                const dy = y - centers[i].y;
                const dSq = dx * dx + dy * dy;

                if (dSq < minDist) {
                    secMinDist = minDist;
                    minDist = dSq;
                    closestIdx = i;
                } else if (dSq < secMinDist) {
                    secMinDist = dSq;
                }
            }

            const idx = (y * width + x) * 4;
            const edgeFactor = Math.sqrt(secMinDist) - Math.sqrt(minDist);
            
            // 진행도(progress)에 따라 외곽선 경계부터 균열이 벌어짐
            if (edgeFactor < (100 - progress) * 0.2) {
                // [수정 포인트] 갈라진 틈새 사이로 보일 '빛나는 마그마' 연출
                // 완료 직전(progress가 100에 가까워질수록)에는 이 틈새도 어둡게 식습니다.
                const lavaBright = Math.max(0, 255 - (progress * 2.5)); 
                data[idx]   = Math.max(30, lavaBright);       // R (빛나는 주황/빨강)
                data[idx+1] = Math.max(20, lavaBright * 0.3); // G
                data[idx+2] = 20;                             // B
            } else {
                // 기둥 내부: 표면부터 서서히 식어가는 현무암 돌 색상
                const c = centers[closestIdx];
                const coolRatio = progress / 100;
                
                // 뜨거운 주황빛에서 어두운 회색석재 색상으로 보간
                data[idx]   = c.r * coolRatio + 255 * (1 - coolRatio); 
                data[idx+1] = c.g * coolRatio + 90 * (1 - coolRatio);
                data[idx+2] = c.b * coolRatio + 0 * (1 - coolRatio);
            }
            data[idx+3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

// 시뮬레이션 작동 제어
startBtn.onclick = () => {
    startBtn.disabled = true;
    centers = [];
    currentProgress = 0;

    const speedLevel = parseInt(speedSlider.value);       
    const thicknessLevel = parseInt(thicknessSlider.value); 

    // 두께가 두꺼울수록 냉각 중심 개수가 적어져 기둥이 굵게 형성됨
    const centerCount = (6 - thicknessLevel) * 12 + 10; 

    // 냉각 중심 무작위 배정 및 고유 석재 색상 부여
    for(let i = 0; i < centerCount; i++) {
        const gray = Math.floor(Math.random() * 30) + 50; // 약간 더 밝은 회색톤으로 조정
        centers.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: gray + Math.floor(Math.random() * 10),
            g: gray,
            b: gray + 5
        });
    }

    // 냉각 속도가 빠르고 두께가 얇을수록 프레임당 진행률 가속
    const increment = (speedLevel * 0.4) + (6 - thicknessLevel) * 0.15;

    function animate() {
        currentProgress += increment;
        if (currentProgress > 100) currentProgress = 100;

        statusDiv.innerText = `냉각 및 부피 수축 진행률: ${Math.floor(currentProgress)}%`;
        renderSimulation(currentProgress);

        if (currentProgress < 100) {
            animationId = requestAnimationFrame(animate);
        } else {
            statusDiv.innerHTML = "✨ <b>냉각 완료!</b> 4~6각형 기둥의 주상절리가 형성되었습니다.";
            startBtn.disabled = false;
            startBtn.innerText = "🌋 다시 시뮬레이션";
        }
    }
    animate();
};

// 페이지 로드 시 초기화
resetCanvas();
