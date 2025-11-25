# MS Teams Group Add 🚀

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://chrome.google.com/webstore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-green.svg)](https://github.com/yourusername/msteams-group-add)

> Automate bulk member addition to Microsoft Teams groups from Excel/CSV tables

## 📖 Description

**MS Teams Group Add** is a browser extension that streamlines the process of adding multiple members to Microsoft Teams groups. Simply copy data from Excel, paste it into the extension, and let it do the work!

### ✨ Key Features

- 🚀 **Bulk Addition** - Add multiple users at once
- 📊 **Excel Integration** - Copy-paste directly from spreadsheets
- 📈 **Real-time Progress** - Track the process with live progress bar
- 📉 **Statistics** - See success/failure counts
- ❌ **Failed Users List** - Detailed info about failed additions with reasons
- 📋 **Copy Failed Emails** - Quick copy of failed email addresses
- ⏸️ **Stop Functionality** - Pause the process anytime
- 🎨 **Modern UI** - Clean and intuitive interface
- 🔒 **Privacy First** - No data collection, everything runs locally

## 🎯 Use Cases

Perfect for:
- 👔 Team administrators
- 👥 HR departments
- 📊 Project managers
- 🏢 Anyone managing large MS Teams groups

## 📥 Installation

### From Source (Development)

1. Clone this repository:
```bash
git clone https://github.com/yourusername/msteams-group-add.git
cd msteams-group-add
```

2. Open Chrome/Edge and go to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **"Load unpacked"**

5. Select the cloned folder

6. Done! The extension icon should appear in your toolbar

### From Chrome Web Store (Coming Soon)

_Extension will be available on Chrome Web Store soon!_

## 🚀 How to Use

### Step 1: Prepare Your Data

In Excel or any spreadsheet, create a table with 2 columns:

| Email | Full Name |
|-------|-----------|
| john@example.com | John Doe |
| jane@example.com | Jane Smith |

### Step 2: Copy the Table

Select both columns (including data, not headers) and copy (`Ctrl+C` or `Cmd+C`)

### Step 3: Open MS Teams

1. Navigate to [teams.microsoft.com](https://teams.microsoft.com)
2. Open your group/team
3. Go to Members section

### Step 4: Use the Extension

1. Click the extension icon in your toolbar
2. Paste the data in the textarea (`Ctrl+V` or `Cmd+V`)
3. You'll see "✅ X users found"
4. Click **"Start Adding"**

### Step 5: Monitor Progress

- Watch the progress bar
- See real-time statistics
- If any users fail, you'll see them listed with reasons
- Use **"Stop"** button to pause anytime
- Click **"Copy Failed Emails"** to get failed email list

## 📸 Screenshots

### Main Interface
![Main Interface](screenshots/main.png)

### Progress Tracking
![Progress](screenshots/progress.png)

### Failed Users List
![Failed Users](screenshots/failed.png)

## 🛠️ Technical Details

### Built With
- 🔧 **Manifest V3** - Latest Chrome extension API
- 📝 **Vanilla JavaScript** - No frameworks, pure JS
- 🎨 **CSS3** - Modern styling with gradients and animations
- 🌐 **Chrome Extension APIs** - For browser integration

### Architecture
```
popup.html          → User interface
popup.js            → UI logic & data parsing
content.js          → MS Teams DOM interaction
icons/              → Extension icons (16, 48, 128)
```

### Permissions Required
- `activeTab` - Access MS Teams page
- `scripting` - Automate form filling
- `teams.microsoft.com` - Work with MS Teams only

## 🔒 Privacy & Security

- ✅ **No data collection** - Zero tracking or analytics
- ✅ **No external servers** - Everything runs in your browser
- ✅ **No data storage** - Data deleted after processing
- ✅ **Open source** - Code is transparent and auditable
- ✅ **Minimal permissions** - Only what's necessary

## 🐛 Troubleshooting

### Extension icon is grayed out
**Solution:** Make sure you're on `teams.microsoft.com` page

### Start button is disabled
**Solution:** 
- Ensure you've pasted data in correct format (2 columns)
- Check that emails contain "@" symbol
- Verify both email and name are present

### Users not being added
**Solution:**
- Keep the popup window open during process
- Check if you have permission to add members
- Look at failed users list for specific reasons

### Processing interrupted
**Solution:**
- Don't close the popup during addition
- Failed users will be shown at the end
- You can copy failed emails and try again

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🐛 **Report bugs** - Open an issue with details
2. 💡 **Suggest features** - Share your ideas
3. 🔧 **Submit PRs** - Fix bugs or add features
4. 📖 **Improve docs** - Help with documentation
5. ⭐ **Star the repo** - Show your support!

### Development Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/msteams-group-add.git
cd msteams-group-add

# Load in Chrome
# 1. Go to chrome://extensions/
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select the project folder

# Make changes
# Test in Chrome
# Submit PR!
```

## 📝 Changelog

### Version 2.0.0 (Current)
- ✅ Complete rewrite with clean architecture
- ✅ Added failed users list with reasons
- ✅ Added copy failed emails functionality
- ✅ Improved error handling
- ✅ Better progress tracking
- ✅ Modern UI design
- ✅ Protection against accidental closing
- ✅ Detailed logging for debugging

### Version 1.0.0
- 🎉 Initial release
- ✅ Basic bulk addition functionality
- ✅ Excel table support
- ✅ Progress tracking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Oleksandr Tkachenko**

- 📧 Email: [Oleksandr_Tkachenko@outlook.com](mailto:Oleksandr_Tkachenko@outlook.com)
- 💼 LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- 🐙 GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Microsoft Teams for the amazing collaboration platform
- Chrome Extension community for resources and support
- All contributors and users of this extension

## ⚠️ Disclaimer

This extension is not affiliated with, endorsed by, or in any way officially connected with Microsoft Corporation. Microsoft Teams is a trademark of Microsoft Corporation.

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/msteams-group-add?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/msteams-group-add?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/msteams-group-add)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/msteams-group-add)

---

**Made with ❤️ by Oleksandr Tkachenko**

_If this extension helped you, consider giving it a ⭐ on GitHub!_
