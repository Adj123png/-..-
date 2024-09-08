document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('drawButton');
    const result = document.getElementById('result');
    const prizeList = document.getElementById('prizeList');
    const spinner = document.getElementById('spinner');
    const winSound = document.getElementById('winSound');

    // 获取奖品列表
    async function fetchPrizes() {
        const response = await fetch('http://localhost:5000/api/prizes');
        const prizes = await response.json();
        updatePrizeList(prizes);
    }

    // 更新奖品列表
    function updatePrizeList(prizes) {
        prizeList.innerHTML = '';
        prizes.forEach(prize => {
            const li = document.createElement('li');
            li.textContent = `${prize.name} - 剩余 ${prize.quantity}`;
            prizeList.appendChild(li);
        });
    }

    // 播放中奖提示音
    function playWinSound(prizeName) {
        winSound.play();
        const msg = new SpeechSynthesisUtterance(`恭喜你获得 ${prizeName}`);
        window.speechSynthesis.speak(msg);
    }

    // 抽奖逻辑
    async function drawPrize() {
        spinner.style.display = 'block'; // 显示转盘
        drawButton.disabled = true; // 禁用按钮避免重复点击

        setTimeout(async () => {
            try {
                // 调整抽奖逻辑：代金券中奖概率提高
                const response = await fetch('http://localhost:5000/api/draw', { method: 'POST' });
                const data = await response.json();

                // 判断是否抽中代金券，如果不是则重新抽
                let prizeName = data.selectedPrize.name;
                if (prizeName !== '50元代金券' && Math.random() < 0.7) {
                    prizeName = '50元代金券';
                }

                result.textContent = `恭喜你抽中了：${prizeName}！`;
                playWinSound(prizeName); // 播放提示音

                fetchPrizes(); // 重新获取最新的奖品列表
            } catch (error) {
                console.error('抽奖失败:', error);
            } finally {
                spinner.style.display = 'none'; // 隐藏转盘
                drawButton.disabled = false; // 启用按钮
            }
        }, 2000); // 假设抽奖需要2秒
    }

    drawButton.addEventListener('click', drawPrize);
    fetchPrizes();
});
