// 画像の準備（18種類の絵）
const allCardImages = Array.from({ length: 18 }, (_, i) => `card${i + 1}.png`);

// タイトル画面の背景画像をランダムに選択
const randomImage = allCardImages[Math.floor(Math.random() * allCardImages.length)];
document.getElementById('title-screen').style.backgroundImage = `url('${randomImage}')`;

// BGM設定（タイトル画面で即再生）
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
document.addEventListener('DOMContentLoaded', () => {
    bgm.play().catch(error => console.log("BGM再生エラー:", error));
});

// ランダムに15枚を選択し、30枚のカードを生成
const selectedImages = shuffle(allCardImages).slice(0, 15);
let cards = [...selectedImages, ...selectedImages]; // ペアを作成
cards = shuffle(cards); // シャッフル

// ゲーム変数
let flippedCards = [];
let score = 0;
let miss = 0;
const maxMiss = 20;

// 効果音
const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');

// ハイスコア
let highscores = JSON.parse(localStorage.getItem('highscores')) || [];

// ボタンイベント
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('highscore-button').addEventListener('click', showHighscore);
document.getElementById('back-button').addEventListener('click', backToTitle);
document.getElementById('back-to-title-button').addEventListener('click', backToTitle);
document.getElementById('show-highscore-button').addEventListener('click', showHighscore);

// ゲーム開始
function startGame() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    createBoard();
}

// ボード作成
function createBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
}

// カードをめくる
function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('matched')) {
        const index = this.dataset.index;
        this.style.backgroundImage = `url('${cards[index]}')`;
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

// ペア判定
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (cards[card1.dataset.index] === cards[card2.dataset.index]) {
        score += 10;
        card1.classList.add('matched');
        card2.classList.add('matched');
        correctSound.play().catch(error => console.log("正解音再生エラー:", error));
    } else {
        card1.style.backgroundImage = `url('back.png')`;
        card2.style.backgroundImage = `url('back.png')`;
        miss++;
        incorrectSound.play().catch(error => console.log("不正解音再生エラー:", error));
    }
    flippedCards = [];
    updateScore();
    if (miss >= maxMiss) {
        gameOver();
    }
}

// 得点とミスの更新
function updateScore() {
    document.getElementById('score').textContent = `得点: ${score}`;
    document.getElementById('miss').textContent = `ミス: ${miss}`;
}

// ゲームオーバー
function gameOver() {
    bgm.pause();
    saveHighscore();
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
}

// ハイスコア保存
function saveHighscore() {
    highscores.push(score);
    highscores.sort((a, b) => b - a);
    highscores = highscores.slice(0, 10);
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

// ハイスコア表示
function showHighscore() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('highscore-screen').style.display = 'block';
    const highscoreList = document.getElementById('highscore-list');
    highscoreList.innerHTML = '';
    highscores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry}点`;
        highscoreList.appendChild(li);
    });
}

// タイトルに戻る
function backToTitle() {
    document.getElementById('highscore-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('title-screen').style.display = 'block';
    bgm.play().catch(error => console.log("BGM再生エラー:", error));
}

// 配列シャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
