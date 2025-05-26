// 画像の準備（18種類の絵）
const allCardImages = Array.from({ length: 18 }, (_, i) => `card${i + 1}.png`);

// スタート画面の背景画像をランダムに選択
const randomImage = allCardImages[Math.floor(Math.random() * allCardImages.length)];
document.getElementById('title-screen').style.backgroundImage = `url('${randomImage}')`;

// BGM設定
const bgm = new Audio('bgm.mp3');
bgm.loop = true;

// スタート画面でBGMを再生（初回クリックで開始）
document.addEventListener('click', function playBgm() {
    bgm.play().catch(error => console.log("BGM再生エラー:", error));
    document.removeEventListener('click', playBgm); // 1回のみ実行
});

// ボタンイベント
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('highscore-button').addEventListener('click', showHighscore);

// ゲーム開始
function startGame() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    // ゲームロジックは省略（必要に応じて追加）
}

// ハイスコア表示
function showHighscore() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('highscore-screen').style.display = 'block';
    // ハイスコアロジックは省略（必要に応じて追加）
}
