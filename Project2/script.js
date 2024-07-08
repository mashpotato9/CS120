$(document).ready(function() {
    const game = {
        role: 1,
        word: '',
        input: '',
        gameOver: false,
        wordList: [
            "APPLE", "BEACH", "CLOUD", "DREAM", "EAGLE",
            "FLAME", "GRAPE", "HEART", "IVORY", "JELLY",
            "KITE", "LEMON", "MANGO", "NIGHT", "OCEAN",
            "PEACH", "QUICK", "RIVER", "STORM", "TIGER",
            "UNITY", "VIOLET", "WHALE", "XENON", "YACHT",
            "ZEBRA", "BROOM", "FLUTE", "SMILE", "TORCH"
        ],
        
        startNewGame: function() {
            $('#newGame').attr('hidden', 'true');
            this.role = 1;
            this.gameOver = false;
            for (let i = 1; i <= 6; i++) {
                $(`#${i}role div`).each(function() {
                    $(this).text('').removeClass('correct present absent');
                });
            }
            this.getWord();
        },
        
        getWord: function() {
            $.ajax({
                url: 'https://random-word-api.herokuapp.com/word?length=5',            
                method: 'GET',
                success: (response) => {
                    this.word = response[0];
                    console.log('Secret word:', this.word);
                },
                error: (xhr, status, error) => {
                    console.error('Error fetching word from API:', error);
                    const randomIndex = Math.floor(Math.random() * this.wordList.length);
                    this.word = this.wordList[randomIndex];
                    console.log('Using fallback word from list:', this.word);
                }
            });
        },
        
        getInput: function() {
            if(this.checkInput()){
                this.compareWord(input);
                this.role++;
                if(this.input.toUpperCase() === this.word.toUpperCase()){
                    alert('You have guessed the word');
                    $('#newGame').removeAttr('hidden');
                    this.gameOver = true;
                }
                if(this.role === 7){
                    alert('You have used all your chances, the word is ' + this.word);
                    $('#newGame').removeAttr('hidden');
                    this.gameOver = true;
                }
            }
        },
        
        checkInput: function() {
            this.input = $('#input').val();
            $('#input').val('');
            if (this.input === '') {
                alert('Please enter a word');
                return false;
            } else if (this.input.length != 5) {
                alert('Please enter a valid word');
                return false;
            }
            return true;
        },
        
        compareWord: function() {
            let inputArray = this.input.toUpperCase().split('');
            let wordArray = this.word.toUpperCase().split('');
            let res = Array(5).fill('absent');
            let letterCount = {};
        
            wordArray.forEach(letter => {
                letterCount[letter] = (letterCount[letter] || 0) + 1;
            });
        
            // mark correct letters
            for (let i = 0; i < 5; i++) {
                if (inputArray[i] === wordArray[i]) {
                    res[i] = 'correct';
                    letterCount[inputArray[i]]--;
                }
            }
        
            // mark present letters
            for (let i = 0; i < 5; i++) {
                if (res[i] !== 'correct' && letterCount[inputArray[i]] > 0) {
                    res[i] = 'present';
                    letterCount[inputArray[i]]--;
                }
            }
        
            this.update(inputArray, res);
        },
        
        update: function(inputArray, result) {
            let roleId = '#' + this.role + 'role';
            let divs = $(roleId).find('div');
        
            divs.each(function(index) {
                $(this).text(inputArray[index]);
                $(this).addClass(result[index]);
            });
        }
    };

    game.startNewGame();

    $('#myForm').on('submit', (event) => {
        event.preventDefault();
        if (!game.gameOver) {
            game.getInput();
        }
    });

    $('#newGame').on('click', () => {
        game.startNewGame();
    });
});