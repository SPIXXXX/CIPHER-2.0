function showErrorToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.innerHTML = `
        <span class="error-icon">⚠️</span>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Helper function to convert text key to numeric value
function textToNumericKey(text) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    text = text.toUpperCase();
    let sum = 0;
    for (let char of text) {
        if (alphabet.includes(char)) {
            sum += alphabet.indexOf(char);
        }
    }
    return sum;
}

// Helper function to convert text to array of numeric values
function textToNumericArray(text) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    text = text.toUpperCase();
    const values = [];
    for (let char of text) {
        if (alphabet.includes(char)) {
            values.push(alphabet.indexOf(char));
        }
    }
    return values;
}

// Restrict key inputs to numbers only
document.addEventListener('DOMContentLoaded', function() {
    // Allow letters and numbers in mono and poly keys
    const keyInputs = ['monoKey', 'polyKey'];
    keyInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^a-zA-Z0-9]/g, '');
            });
        }
    });

    // Allow numbers, commas, spaces, and letters in Vigenère key input
    const vigenereKeyInput = document.getElementById('vigenereKey');
    if (vigenereKeyInput) {
        vigenereKeyInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^a-zA-Z0-9,\s]/g, '');
        });
    }

    // Allow letters and numbers in all plaintext fields
    const plainTextInputs = ['monoPlainText', 'polyPlainText', 'vigenerePlainText'];
    plainTextInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function(e) {
                this.value = this.value.replace(/[^a-zA-Z0-9\s]/g, '');
            });
        }
    });
});

function selectCipher(type) {
    document.getElementById('selectionScreen').style.display = 'none';
    if (type === 'mono') {
        document.getElementById('monoCipher').classList.add('active');
    } else if (type === 'poly') {
        document.getElementById('polyCipher').classList.add('active');
    } else if (type === 'vigenere') {
        document.getElementById('vigenereCipher').classList.add('active');
    }
}

function goBack() {
    document.querySelectorAll('.cipher-container').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById('selectionScreen').style.display = 'block';
    
    // Clear inputs
    document.querySelectorAll('.input-box').forEach(input => input.value = '');
    document.querySelectorAll('.output-box').forEach(output => output.textContent = '');
}

function resetMono() {
    document.getElementById('monoPlainText').value = '';
    document.getElementById('monoKey').value = '';
    document.getElementById('monoOutput').textContent = '';
}

function resetPoly() {
    document.getElementById('polyPlainText').value = '';
    document.getElementById('polyKey').value = '';
    document.getElementById('polyOutput').textContent = '';
}

function resetVigenere() {
    document.getElementById('vigenerePlainText').value = '';
    document.getElementById('vigenereKey').value = '';
    document.getElementById('vigenereOutput').textContent = '';
}

function processMonoCipher() {
    const plainText = document.getElementById('monoPlainText').value.toUpperCase();
    const keyInput = document.getElementById('monoKey').value;
    
    if (!plainText || !keyInput) {
        showErrorToast('Please enter both plain text and key!');
        return;
    }
    
    // Determine if key is numeric or text
    let key;
    if (/^\d+$/.test(keyInput)) {
        key = parseInt(keyInput);
    } else {
        key = textToNumericKey(keyInput);
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let cipherText = '';
    
    for (let char of plainText) {
        if (alphabet.includes(char)) {
            const index = alphabet.indexOf(char);
            const newIndex = (index + key) % 26;
            cipherText += alphabet[newIndex];
        } else {
            cipherText += char;
        }
    }
    
    document.getElementById('monoOutput').textContent = cipherText;
}

function processMonoDecipher() {
    const cipherText = document.getElementById('monoOutput').textContent.toUpperCase();
    const keyInput = document.getElementById('monoKey').value;
    
    if (!cipherText || !keyInput) {
        showErrorToast('Please encrypt text first or enter a key!');
        return;
    }
    
    // Determine if key is numeric or text
    let key;
    if (/^\d+$/.test(keyInput)) {
        key = parseInt(keyInput);
    } else {
        key = textToNumericKey(keyInput);
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let plainText = '';
    
    for (let char of cipherText) {
        if (alphabet.includes(char)) {
            const index = alphabet.indexOf(char);
            const newIndex = (index - key + 26 * 100) % 26; // +26*100 to handle negative numbers
            plainText += alphabet[newIndex];
        } else {
            plainText += char;
        }
    }
    
    // Swap: put cipher text in input, decrypted text in output
    document.getElementById('monoPlainText').value = cipherText;
    document.getElementById('monoOutput').textContent = plainText;
}

function processPolyCipher() {
    const plainText = document.getElementById('polyPlainText').value.toUpperCase();
    const keyInput = document.getElementById('polyKey').value;
    
    if (!plainText || !keyInput) {
        showErrorToast('Please enter both plain text and key!');
        return;
    }
    
    // Determine if key is numeric or text
    let key;
    if (/^\d+$/.test(keyInput)) {
        key = parseInt(keyInput);
    } else {
        key = textToNumericKey(keyInput);
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let cipherText = '';
    let prevCharValue = key; // First subkey is predefined (the key input)
    
    for (let i = 0; i < plainText.length; i++) {
        const char = plainText[i];
        if (alphabet.includes(char)) {
            const charValue = alphabet.indexOf(char);
            const currentKey = prevCharValue;
            const newValue = (charValue + currentKey) % 26;
            cipherText += alphabet[newValue];
            prevCharValue = charValue; // Next subkey is the value of current plaintext character
        } else {
            cipherText += char;
        }
    }
    
    document.getElementById('polyOutput').textContent = cipherText;
}

function processPolyDecipher() {
    const cipherText = document.getElementById('polyOutput').textContent.toUpperCase();
    const keyInput = document.getElementById('polyKey').value;
    
    if (!cipherText || !keyInput) {
        showErrorToast('Please encrypt text first or enter a key!');
        return;
    }
    
    // Determine if key is numeric or text
    let key;
    if (/^\d+$/.test(keyInput)) {
        key = parseInt(keyInput);
    } else {
        key = textToNumericKey(keyInput);
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let plainText = '';
    let prevCharValue = key; // First subkey is predefined (the key input)
    
    for (let i = 0; i < cipherText.length; i++) {
        const char = cipherText[i];
        if (alphabet.includes(char)) {
            const charValue = alphabet.indexOf(char);
            const currentKey = prevCharValue;
            const plainCharValue = (charValue - currentKey + 26 * 100) % 26; // +26*100 to handle negative numbers
            plainText += alphabet[plainCharValue];
            prevCharValue = plainCharValue; // Next subkey is the value of decrypted plaintext character
        } else {
            plainText += char;
        }
    }
    
    // Swap: put cipher text in input, decrypted text in output
    document.getElementById('polyPlainText').value = cipherText;
    document.getElementById('polyOutput').textContent = plainText;
}

function processVigenereCipher() {
    const plainText = document.getElementById('vigenerePlainText').value.toUpperCase();
    const keyInput = document.getElementById('vigenereKey').value;
    
    if (!plainText || !keyInput) {
        showErrorToast('Please enter both plain text and key!');
        return;
    }
    
    let keyArray;
    
    // Check if input contains commas (numeric format)
    if (keyInput.includes(',')) {
        keyArray = keyInput.split(',').map(k => parseInt(k.trim())).filter(k => !isNaN(k));
        if (keyArray.length === 0) {
            showErrorToast('Please enter valid numbers separated by commas (e.g., 0,5,8)');
            return;
        }
    } else if (/^\d+$/.test(keyInput.trim())) {
        // Pure numeric input without commas
        keyArray = [parseInt(keyInput)];
    } else {
        // Text input - convert each letter to its numeric value
        keyArray = textToNumericArray(keyInput);
        if (keyArray.length === 0) {
            showErrorToast('Please enter a valid key (text or numbers)');
            return;
        }
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let cipherText = '';
    let keyIndex = 0;
    
    for (let char of plainText) {
        if (alphabet.includes(char)) {
            const charPos = alphabet.indexOf(char);
            const keyShift = keyArray[keyIndex % keyArray.length];
            const newPos = (charPos + keyShift) % 26;
            cipherText += alphabet[newPos];
            keyIndex++;
        } else {
            cipherText += char;
        }
    }
    
    document.getElementById('vigenereOutput').textContent = cipherText;
}

function processVigenereDecipher() {
    const cipherText = document.getElementById('vigenereOutput').textContent.toUpperCase();
    const keyInput = document.getElementById('vigenereKey').value;
    
    if (!cipherText || !keyInput) {
        showErrorToast('Please encrypt text first or enter a key!');
        return;
    }
    
    let keyArray;
    
    // Check if input contains commas (numeric format)
    if (keyInput.includes(',')) {
        keyArray = keyInput.split(',').map(k => parseInt(k.trim())).filter(k => !isNaN(k));
        if (keyArray.length === 0) {
            showErrorToast('Please enter valid numbers separated by commas (e.g., 0,5,8)');
            return;
        }
    } else if (/^\d+$/.test(keyInput.trim())) {
        // Pure numeric input without commas
        keyArray = [parseInt(keyInput)];
    } else {
        // Text input - convert each letter to its numeric value
        keyArray = textToNumericArray(keyInput);
        if (keyArray.length === 0) {
            showErrorToast('Please enter a valid key (text or numbers)');
            return;
        }
    }
    
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let plainText = '';
    let keyIndex = 0;
    
    for (let char of cipherText) {
        if (alphabet.includes(char)) {
            const charPos = alphabet.indexOf(char);
            const keyShift = keyArray[keyIndex % keyArray.length];
            const newPos = (charPos - keyShift + 26 * 100) % 26; // +26*100 to handle negative numbers
            plainText += alphabet[newPos];
            keyIndex++;
        } else {
            plainText += char;
        }
    }
    
    // Swap: put cipher text in input, decrypted text in output
    document.getElementById('vigenerePlainText').value = cipherText;
    document.getElementById('vigenereOutput').textContent = plainText;
}