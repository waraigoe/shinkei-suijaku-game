// 画像の準備（18種類の絵）
const allCardImages = Array.from({ length: 18 }, (_, i) => `card${i + 1}.png`);

// タイトル画面の背景画像をランダムに選択
const randomImage = allCardImages[Math.floor(Math.random() * allCardImages.length)];
document.getElementById('title-screen').style.backgroundImage = `url('${randomImage}')`;

// BGM設定
const bgm = new Audio('bgm.mp3');
bgm.loop = true;

// 効果音設定
const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');

// ランキング（localStorageから取得）
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

// ゲーム変数
let flippedCards = [];
let score = 0;
let miss = 0;
const maxMiss = 20;

// ボタンイベント
document.getElementById('start-button').addEventListener('click', () => {
    bgm.play().catch(error => console.log("BGM再生エラー:", error));
    startGame();
});
document.getElementById('highscore-button').addEventListener('click', showRanking);
document.getElementById('back-button').addEventListener('click', backToTitle);
document.getElementById('back-to-title-button').addEventListener('click', backToTitle);
document.getElementById('show-highscore-button').addEventListener('click', showRanking);

// ゲーム開始
function startGame() {
    cards = shuffle([...allCardImages.slice(0, 15), ...allCardImages.slice(0, 15)]);
    score = 0;
    miss = 0;
    flippedCards = [];
    updateScore();
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
    saveRanking();
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
}

// ランキング保存
function saveRanking() {
    ranking.push({ name: "Player", score }); // 名前は一律"Player"に
    ranking.sort((a, b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

// ランキング表示
function showRanking() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('highscore-screen').style.display = 'block';
    const highscoreList = document.getElementById('highscore-list');
    highscoreList.innerHTML = '';
    ranking.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}点`;
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
