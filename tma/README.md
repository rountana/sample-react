# Telegram Mini App - React & Python Bot

A complete Telegram Mini App implementation with React frontend and Python bot backend, following [Telegram Mini Apps guidelines](https://core.telegram.org/bots/webapps).

## Features

✅ **Security**: Proper `initData` validation using HMAC-SHA256  
✅ **Modern UI**: Theme-aware design that adapts to Telegram's color scheme  
✅ **Bot Integration**: Full data transfer validation between mini app and bot  
✅ **Latest API**: Uses Bot API 8.0+ features including MainButton

## Setup Instructions

### 1. Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set up your mini app URL with BotFather:
   ```
   /mybots → Select Bot → Bot Settings → Configure Mini App → Enable Mini App
   ```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file
cp env_example.txt .env
# Edit .env and add your bot token:
# TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
```

### 3. Frontend Setup

```bash
npm install
npm start
```

For production:

```bash
npm run build
npm run deploy  # Deploys to GitHub Pages
```

### 4. Testing

#### In Development

- Use HTTPS for testing (ngrok, GitHub Pages, etc.)
- Test in Telegram's test environment for development

#### Debug Mode

Enable debug mode in Telegram:

- **iOS**: Tap Settings 10 times → Allow Web View Inspection
- **Android**: Enable USB debugging → Telegram Settings → Hold version number → Enable WebView Debug

## Security Implementation

### Data Validation

The app implements proper security according to Telegram guidelines:

1. **Frontend**: Sends `initData` (not `initDataUnsafe`) to backend
2. **Backend**: Validates `initData` using HMAC-SHA256 with bot token
3. **User Info**: Only trusted data is used after validation

### What NOT to do:

❌ Don't use `initDataUnsafe` for security-sensitive operations  
❌ Don't trust client-side data without validation  
❌ Don't expose bot token in frontend code

### What TO do:

✅ Always validate `initData` on backend  
✅ Use HTTPS for all communications  
✅ Implement proper error handling

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Telegram      │    │   Mini App      │    │   Python Bot    │
│   Client        │◄──►│   (React)       │◄──►│   Backend       │
│                 │    │                 │    │                 │
│ - User clicks   │    │ - Sends data    │    │ - Validates     │
│ - Opens app     │    │ - Gets initData │    │ - Processes     │
│ - Receives bot  │    │ - Theme support │    │ - Responds      │
│   messages      │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## File Structure

```
tma/
├── src/
│   ├── App.js              # Main mini app component
│   ├── index.js            # React entry point
│   └── ...
├── backend/
│   ├── bot.py              # Python bot with validation
│   ├── requirements.txt    # Python dependencies
│   └── env_example.txt     # Environment variables template
├── public/
│   ├── index.html          # Includes Telegram WebApp script
│   └── ...
└── package.json            # Node.js dependencies
```

## Key Implementation Details

### Frontend (React)

- Uses `@twa-dev/sdk` for Telegram WebApp integration
- Implements theme-aware styling using `themeParams`
- Sends `initData` for server-side validation
- Integrates with MainButton and other Telegram UI elements

### Backend (Python)

- Validates all incoming data using HMAC-SHA256
- Extracts user information only after validation
- Proper error handling and logging
- Uses `python-telegram-bot` library

## Deployment

### Production Checklist

- [ ] Use HTTPS URL for mini app
- [ ] Set proper CSP headers
- [ ] Validate all user inputs
- [ ] Enable error logging
- [ ] Test on multiple devices/platforms

### Hosting Options

- **Frontend**: GitHub Pages, Netlify, Vercel
- **Backend**: Heroku, Railway, VPS with webhooks

## Troubleshooting

### Common Issues

1. **"Not in Telegram environment"**: Ensure you're opening via Telegram
2. **Data validation fails**: Check bot token and HTTPS usage
3. **Theme not working**: Update to latest Telegram app version

### Debug Commands

```bash
# Check bot status
python backend/bot.py

# Validate manually
curl -X POST https://api.telegram.org/bot<token>/getMe
```

## Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Bot API Reference](https://core.telegram.org/bots/api)
- [TWA Dev SDK](https://github.com/twa-dev/sdk)

## License

MIT License - See LICENSE file for details.
