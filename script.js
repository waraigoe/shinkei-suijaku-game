// カードの準備（18種類の絵を2枚ずつ）
const cardImages = Array.from({ length: 18 }, (_, i) => `card${i + 1}.png`);
let cards = [...cardImages, ...cardImages]; // 合計36枚

// ゲーム変数
let flippedCards = [];
let score = 0;
let miss = 0;
let consecutive = 0;
let playerName = '名無しのグル兵衛';

// 効果音とBGM
const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');
const bgm = new Audio('bgm.mp3');
bgm.loop = true;

// ランキング（localStorageから取得）
let ranking = JSON.parse(localStorage.getItem('ranking')) || [];

// ボタンイベント
document.getElementById('start-with-name-button').addEventListener('click', startWithName);
document.getElementById('ranking-button').addEventListener('click', showRanking);
document.getElementById('back-button').addEventListener('click', backToTitle);
document.getElementById('back-to-title-button').addEventListener('click', backToTitle);
document.getElementById('show-ranking-button').addEventListener('click', showRanking);

// 名前をつけてスタート
function startWithName() {
    const name = prompt('名前を入力してください:');
    playerName = name ? name : '名無しのグル兵衛';
    bgm.play().catch(error => console.log("BGM再生エラー:", error));
    startGame();
}

// ゲーム開始
function startGame() {
    cards = shuffle([...cardImages, ...cardImages]); // 毎回シャッフル
    score = 0;
    miss = 0;
    consecutive = 0;
    flippedCards = [];
    updateScore();
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('ranking-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
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
    if (flippedCards.length < 2) {
        const index = this.dataset.index;
        this.style.backgroundImage = `url('${cards[index]}')`;
        flippedCards.push(this);
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000); // 1秒後に判定
        }
    }
}

// ペア判定
function checkMatch() {
    const [card1, card2] = flippedCards;
    if (cards[card1.dataset.index] === cards[card2.dataset.index]) {
        score += 10 * Math.pow(2, consecutive); // 連続ボーナス
        consecutive++;
        correctSound.play().catch(error => console.log("正解音再生エラー:", error));
    } else {
        card1.style.backgroundImage = `url('back.png')`;
        card2.style.backgroundImage = `url('back.png')`;
        miss++;
        consecutive = 0;
        incorrectSound.play().catch(error => console.log("不正解音再生エラー:", error));
    }
    flippedCards = [];
    updateScore();
    if (miss >= 5) {
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
    ranking.push({ name: playerName, score });
    ranking.sort((a, b) => b.score - a.score); // 降順ソート
    ranking = ranking.slice(0, 10); // 上位10位まで
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

// ランキング表示
function showRanking() {
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('ranking-screen').style.display = 'block';
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';
    ranking.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}点`;
        rankingList.appendChild(li);
    });
}

// タイトルに戻る
function backToTitle() {
    document.getElementById('ranking-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('title-screen').style.display = 'block';
}

// 配列シャッフル
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
