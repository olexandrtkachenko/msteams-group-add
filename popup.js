console.log('🟢 Popup script loaded');

let parsedUsers = [];
let isProcessing = false;

// Elements
const pasteArea = document.getElementById('pasteArea');
const userCount = document.getElementById('userCount');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const stats = document.getElementById('stats');
const statSuccess = document.getElementById('statSuccess');
const statFailed = document.getElementById('statFailed');
const processingWarning = document.getElementById('processingWarning');
const failedList = document.getElementById('failedList');
const failedEmails = document.getElementById('failedEmails');
const copyFailedBtn = document.getElementById('copyFailedBtn');

console.log('🔍 Elements found:', {
    pasteArea: !!pasteArea,
    startBtn: !!startBtn,
    startBtnDisabled: startBtn?.disabled
});

// Parse pasted table
function parsePastedTable(text) {
    const lines = text.trim().split('\n');
    const users = [];
    
    for (const line of lines) {
        if (!line.trim()) continue;
        
        // Try different separators: tab, comma, semicolon
        let parts = line.split('\t');
        if (parts.length < 2) parts = line.split(',');
        if (parts.length < 2) parts = line.split(';');
        
        if (parts.length >= 2) {
            const email = parts[0].trim();
            const name = parts.slice(1).join(' ').trim();
            
            if (email.includes('@') && name) {
                users.push({ email, name });
            }
        }
    }
    
    return users;
}

// Handle paste input
pasteArea.addEventListener('input', () => {
    console.log('📝 Input event triggered');
    const text = pasteArea.value.trim();
    console.log('📝 Text length:', text.length);
    
    if (!text) {
        parsedUsers = [];
        startBtn.disabled = true;
        userCount.classList.add('hidden');
        console.log('❌ Empty text, button disabled');
        return;
    }
    
    try {
        const users = parsePastedTable(text);
        console.log('✅ Parsed users:', users.length);
        console.log('👥 Users:', users);
        
        if (users.length > 0) {
            parsedUsers = users;
            startBtn.disabled = false;
            console.log('🟢 Button enabled! disabled =', startBtn.disabled);
            userCount.textContent = `✅ ${users.length} users found`;
            userCount.classList.remove('hidden');
        } else {
            parsedUsers = [];
            startBtn.disabled = true;
            userCount.classList.add('hidden');
            console.log('❌ No users parsed, button disabled');
        }
    } catch (error) {
        console.error('❌ Parse error:', error);
        startBtn.disabled = true;
    }
});

// Start adding users
startBtn.addEventListener('click', async () => {
    console.log('🚀 Start clicked, users:', parsedUsers.length);
    
    if (parsedUsers.length === 0) return;
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Active tab:', tab);
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
        action: 'addUsers',
        users: parsedUsers
    }, (response) => {
        console.log('Response from content script:', response);
        if (chrome.runtime.lastError) {
            console.error('Error:', chrome.runtime.lastError);
            alert('Error: ' + chrome.runtime.lastError.message);
        }
    });
    
    // Update UI
    isProcessing = true;
    startBtn.classList.add('hidden');
    stopBtn.classList.remove('hidden');
    progress.classList.remove('hidden');
    stats.classList.remove('hidden');
    statSuccess.textContent = '0';
    statFailed.textContent = '0';
    processingWarning.classList.remove('hidden');
    
    // Disable clear button and paste area during processing
    clearBtn.disabled = true;
    pasteArea.disabled = true;
});

// Stop adding users
stopBtn.addEventListener('click', async () => {
    console.log('🛑 Stop clicked');
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: 'stop' });
    
    stopBtn.disabled = true;
    
    // Re-enable UI after stop
    setTimeout(() => {
        isProcessing = false;
        clearBtn.disabled = false;
        pasteArea.disabled = false;
        processingWarning.classList.add('hidden');
    }, 1000);
});

// Clear form
clearBtn.addEventListener('click', () => {
    console.log('🗑️ Clear clicked');
    
    pasteArea.value = '';
    parsedUsers = [];
    startBtn.disabled = true;
    startBtn.classList.remove('hidden');
    stopBtn.classList.add('hidden');
    userCount.classList.add('hidden');
    progress.classList.add('hidden');
    stats.classList.add('hidden');
    failedList.classList.add('hidden');
});

// Listen for progress updates from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📩 Message from content script:', message);
    
    if (message.action === 'progress') {
        const percent = Math.round((message.current / message.total) * 100);
        progressFill.style.width = percent + '%';
        progressText.textContent = `${message.current} of ${message.total}`;
        progressPercent.textContent = percent + '%';
    } else if (message.action === 'stats') {
        statSuccess.textContent = message.success;
        statFailed.textContent = message.failed;
    } else if (message.action === 'complete') {
        isProcessing = false;
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        clearBtn.disabled = false;
        pasteArea.disabled = false;
        processingWarning.classList.add('hidden');
        
        // Show failed users if any
        if (message.failedUsers && message.failedUsers.length > 0) {
            displayFailedUsers(message.failedUsers);
        } else {
            failedList.classList.add('hidden');
        }
    }
});

// Display failed users
function displayFailedUsers(users) {
    console.log('Displaying failed users:', users);
    
    failedEmails.innerHTML = '';
    
    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'failed-email-item';
        
        const email = document.createElement('div');
        email.className = 'email';
        email.textContent = user.email;
        
        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = user.name;
        
        const reason = document.createElement('div');
        reason.className = 'reason';
        reason.textContent = `Reason: ${user.reason}`;
        
        item.appendChild(email);
        item.appendChild(name);
        item.appendChild(reason);
        
        failedEmails.appendChild(item);
    });
    
    failedList.classList.remove('hidden');
    
    // Setup copy button
    copyFailedBtn.onclick = () => {
        const emailList = users.map(u => u.email).join('\n');
        navigator.clipboard.writeText(emailList).then(() => {
            const originalText = copyFailedBtn.textContent;
            copyFailedBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyFailedBtn.textContent = originalText;
            }, 2000);
        });
    };
}

// Prevent closing popup during processing
window.addEventListener('beforeunload', (e) => {
    if (isProcessing) {
        e.preventDefault();
        e.returnValue = 'Adding users in progress! Are you sure you want to close?';
        return e.returnValue;
    }
});

console.log('✅ Popup initialized');
