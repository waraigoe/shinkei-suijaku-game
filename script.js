// カードの準備（18種類の絵を2枚ずつ、合計36枚）
const cardImages = Array.from({ length: 18 }, (_, i) => `card${i + 1}.png`);
let cards = [...cardImages, ...cardImages];

// ゲーム変数
let flippedCards = [];
let score = 0;
let miss = 0;
const maxMiss = 20; // ミス回数の上限

// ボタンイベント
document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('back-to-title-button').addEventListener('click', backToTitle);

// ゲーム開始
function startGame() {
    cards = shuffle([...cardImages, ...cardImages]); // シャッフル
    score = 0;
    miss = 0;
    flippedCards = [];
    updateScore();
    document.getElementById('title-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
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
    if (flippedCards.length < 2 && !this.classList.contains('matched')) {
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
        score += 10; // 正解で10点加算
        card1.classList.add('matched');
        card2.classList.add('matched');
    } else {
        card1.style.backgroundImage = `url('back.png')`; // 不正解で裏返す
        card2.style.backgroundImage = `url('back.png')`;
        miss++;
    }
    flippedCards = [];
    updateScore();
    if (miss >= maxMiss) { // ミスが20回に達したらゲームオーバー
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
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'block';
}

// タイトルに戻る
function backToTitle() {
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
