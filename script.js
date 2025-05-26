// 画像の準備（18種類の絵）
const allCardImages = Array.from({ length: 18 }, (_, i) => `card${i + 1}.png`);

// ランダムに15枚を選択
const selectedImages = shuffle(allCardImages).slice(0, 15);
let cards = [...selectedImages, ...selectedImages]; // ペアを作成
cards = shuffle(cards); // シャッフル

// ゲーム変数
let flippedCards = [];
let score = 0;
let miss = 0;
const maxMiss = 20; // ミス回数の上限

// 効果音とBGM
const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');
const bgm = new Audio('bgm.mp3');
bgm.loop = true;

// ボタンイベント
document.getElementById('start-button').addEventListener('click', startGame);

// ゲーム開始
function startGame() {
    bgm.play().catch(error => console.log("BGM再生エラー:", error)); // スタート時にBGM再生
    cards = shuffle([...selectedImages, ...selectedImages]); // ペアをシャッフル
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
        correctSound.play().catch(error => console.log("正解音再生エラー:", error));
    } else {
        card1.style.backgroundImage = `url('back.png')`; // 不正解で裏返す
        card2.style.backgroundImage = `url('back.png')`;
        miss++;
        incorrectSound.play().catch(error => console.log("不正解音再生エラー:", error));
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
    bgm.pause();
    document.getElementById('game-screen').style.display = 'none';
    alert('ゲームオーバー');
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
