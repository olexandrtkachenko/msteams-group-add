console.log('🟢 [content.js] MS Teams Add content script loaded');

let isProcessing = false;
let shouldStop = false;
let stats = { success: 0, failed: 0 };
let failedUsers = []; // Track failed users with details

// Helper: delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper: wait for element
async function waitForElement(selector, timeout = 5000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = typeof selector === 'function' ? selector() : document.querySelector(selector);
        if (element && element.offsetParent !== null) {
            return element;
        }
        await delay(100);
    }
    return null;
}

// Find people picker input
function findPeoplePickerInput() {
    const input = document.querySelector('input[id="people-picker-input"]');
    if (input) return input;
    
    // Fallback selectors
    const selectors = [
        'input[aria-label*="Add"][type="text"]',
        'input[placeholder*="name"][type="text"]',
        'input[role="combobox"]'
    ];
    
    for (const sel of selectors) {
        const el = document.querySelector(sel);
        if (el) return el;
    }
    
    return null;
}

// Find dropdown item with email
function findDropdownItem(email) {
    // Wait a bit for dropdown to appear
    const items = document.querySelectorAll('[role="option"], [role="listitem"], li');
    
    for (const item of items) {
        if (item.textContent.includes(email) && item.offsetParent !== null) {
            return item;
        }
    }
    
    return null;
}

// Find "Add name" button
async function findAddNameButton() {
    await delay(500); // Wait for button to appear
    
    // Try fui-Button first
    const buttons = document.querySelectorAll('button.fui-Button, button[class*="fui-Button"], button');
    
    for (const btn of buttons) {
        const text = btn.textContent.toLowerCase();
        if ((text.includes('add') && text.includes('name')) || 
            text.includes('додати') || 
            btn.ariaLabel && (btn.ariaLabel.toLowerCase().includes('add') && btn.ariaLabel.toLowerCase().includes('name'))) {
            if (btn.offsetParent !== null) {
                console.log('✅ Found Add Name button:', btn);
                return btn;
            }
        }
    }
    
    return null;
}

// Find name input field
async function findNameInput() {
    await delay(300);
    
    // Try fui-Input first
    const inputs = document.querySelectorAll('input.fui-Input, input[class*="fui-Input"], input[type="text"], textarea');
    
    // Get the last added visible input (most likely the one that just appeared)
    for (let i = inputs.length - 1; i >= 0; i--) {
        const input = inputs[i];
        if (input.offsetParent !== null) {
            const placeholder = (input.placeholder || '').toLowerCase();
            const ariaLabel = (input.ariaLabel || '').toLowerCase();
            
            if (placeholder.includes('name') || placeholder.includes('ім') || 
                ariaLabel.includes('name') || ariaLabel.includes('ім')) {
                console.log('✅ Found name input:', input);
                return input;
            }
        }
    }
    
    // Return last visible input as fallback
    for (let i = inputs.length - 1; i >= 0; i--) {
        if (inputs[i].offsetParent !== null) {
            console.log('✅ Found fallback input:', inputs[i]);
            return inputs[i];
        }
    }
    
    return null;
}

// Find confirm/save button
async function findConfirmButton() {
    await delay(300);
    
    // Try Save button first
    const saveBtn = document.querySelector('button[aria-label="Save"], button[title="Save"]');
    if (saveBtn && saveBtn.offsetParent !== null) {
        console.log('✅ Found Save button');
        return saveBtn;
    }
    
    // Try checkmark/confirm buttons
    const buttons = document.querySelectorAll('button[class*="fui-Button"], button');
    
    for (const btn of buttons) {
        if (btn.offsetParent !== null) {
            const ariaLabel = (btn.ariaLabel || '').toLowerCase();
            const text = btn.textContent.toLowerCase();
            
            if (ariaLabel.includes('save') || ariaLabel.includes('confirm') || 
                text.includes('save') || text.includes('✓') || text.includes('✔')) {
                console.log('✅ Found confirm button:', btn);
                return btn;
            }
        }
    }
    
    return null;
}

// Simulate click
function simulateClick(element) {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

// Add single user
async function addSingleUser(user, index, total) {
    console.log(`\n📧 [${index + 1}/${total}] Adding: ${user.email} - ${user.name}`);
    
    try {
        // 1. Find people picker input
        const input = findPeoplePickerInput();
        if (!input) {
            console.error('❌ People picker input not found');
            return { success: false, reason: 'People picker input not found' };
        }
        console.log('✅ Found input');
        
        // 2. Clear and enter email
        input.value = '';
        input.focus();
        await delay(200);
        
        input.value = user.email;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Entered email');
        
        // 3. Wait for dropdown and click on item
        await delay(1000);
        const dropdownItem = findDropdownItem(user.email);
        if (!dropdownItem) {
            console.error('❌ Dropdown item not found');
            return { success: false, reason: 'User not found in dropdown' };
        }
        console.log('✅ Found dropdown item');
        
        simulateClick(dropdownItem);
        await delay(500);
        
        // 4. Find and click "Add name" button
        const addNameBtn = await findAddNameButton();
        if (!addNameBtn) {
            console.warn('⚠️ Add name button not found (user might already have a name)');
            return { success: true, reason: null }; // Consider success - user was added but already has a name
        }
        console.log('✅ Found Add Name button');
        
        simulateClick(addNameBtn);
        await delay(500);
        
        // 5. Find name input and enter name
        const nameInput = await findNameInput();
        if (!nameInput) {
            console.error('❌ Name input not found');
            return { success: false, reason: 'Name input field not found' };
        }
        console.log('✅ Found name input');
        
        nameInput.value = '';
        nameInput.focus();
        await delay(200);
        
        nameInput.value = user.name;
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ Entered name');
        
        // 6. Find and click confirm button
        const confirmBtn = await findConfirmButton();
        if (!confirmBtn) {
            console.error('❌ Confirm button not found');
            return { success: false, reason: 'Confirm button not found' };
        }
        console.log('✅ Found confirm button');
        
        simulateClick(confirmBtn);
        await delay(500);
        
        console.log('✅ User added successfully!');
        return { success: true, reason: null };
        
    } catch (error) {
        console.error('❌ Error adding user:', error);
        return { success: false, reason: error.message || 'Unknown error' };
    }
}

// Process all users
async function processUsers(users) {
    console.log(`🚀 Starting to process ${users.length} users`);
    
    isProcessing = true;
    shouldStop = false;
    stats = { success: 0, failed: 0 };
    failedUsers = []; // Reset failed users list
    
    for (let i = 0; i < users.length; i++) {
        if (shouldStop) {
            console.log('🛑 Process stopped by user');
            break;
        }
        
        const user = users[i];
        const result = await addSingleUser(user, i, users.length);
        
        if (result.success) {
            stats.success++;
        } else {
            stats.failed++;
            failedUsers.push({
                email: user.email,
                name: user.name,
                reason: result.reason || 'Unknown error'
            });
        }
        
        // Send progress update
        chrome.runtime.sendMessage({
            action: 'progress',
            current: i + 1,
            total: users.length
        });
        
        chrome.runtime.sendMessage({
            action: 'stats',
            success: stats.success,
            failed: stats.failed
        });
        
        // Small delay between users
        if (i < users.length - 1) {
            await delay(1000);
        }
    }
    
    console.log('✅ Process complete!');
    console.log(`📊 Success: ${stats.success}, Failed: ${stats.failed}`);
    
    if (failedUsers.length > 0) {
        console.log('❌ Failed users:', failedUsers);
    }
    
    isProcessing = false;
    
    // Send complete message with failed users list
    chrome.runtime.sendMessage({
        action: 'complete',
        success: stats.success,
        failed: stats.failed,
        failedUsers: failedUsers
    });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📩 [content.js] Received message:', message);
    
    if (message.action === 'addUsers') {
        console.log('✅ [content.js] Starting to add users:', message.users.length);
        
        if (!isProcessing) {
            processUsers(message.users);
            sendResponse({ status: 'started' });
        } else {
            sendResponse({ status: 'already_running' });
        }
    } else if (message.action === 'stop') {
        console.log('🛑 [content.js] Stop requested');
        shouldStop = true;
        sendResponse({ status: 'stopping' });
    }
    
    return true;
});

console.log('✅ [content.js] Ready to receive commands');

