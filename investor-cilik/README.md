StockQuest Jr. 🚀
Welcome to StockQuest Jr., a fun and interactive game designed to teach children the basics of the stock market and financial literacy. Through a simplified trading simulator, an engaging learning center, and fun quizzes, kids can learn about investing in a safe and risk-free environment.

✨ Features
📈 Realistic Trading Simulator: Buy and sell stocks from fictional companies. React to daily news events and watch your portfolio grow!

📚 Interactive Learning Center: Simple, easy-to-understand articles and a glossary explain key financial concepts like stocks, diversification, and risk.

🧠 Fun Quizzes: Test your knowledge with multiple-choice quizzes and solidify your understanding of the material.

🏆 Achievements: Unlock achievements for reaching milestones, like making your first profit or diversifying your investments.

📊 Portfolio Tracking: A visual dashboard with a pie chart helps you see your asset allocation at a glance.

🔊 Audio Feedback: Sound effects for key actions make the experience more engaging.

📱 Responsive Design: Play on any device, thanks to a clean and modern interface built with Tailwind CSS.

🎮 How to Play
Start a New Game: Choose your difficulty (Easy or Hard) and start with $10,000 in virtual cash.

Check the News: Each day, a new headline will appear. Read it carefully to see if it might affect stock prices.

Buy or Sell: Based on the news and your own strategy, decide which stocks to buy or sell.

Advance Day: Once you're done trading, click "Next Day" to see how the market—and your investments—have changed.

Learn & Grow: Visit the Learning Center and take quizzes to improve your financial knowledge and become a smarter investor!

🛠️ Technologies Used
Frontend: HTML5, CSS3, JavaScript (ES6 Modules)

Styling: Tailwind CSS

Charts: Chart.js for the portfolio pie chart.

Icons: Feather Icons

📂 File Structure
The project is organized into a clear and modular structure:

StockQuest-Jr/
├── 📂 css/
│   └── style.css         # Custom styles
├── 📂 data/
│   ├── glossary.json     # Glossary terms
│   ├── learning_center.json # Content for the learning center
│   ├── quiz.json         # Quiz questions
│   └── ...               # Scenario and tutorial data
├── 📂 js/
│   ├── main.js           # Main game logic and loop
│   ├── stock.js          # Handles stock data and price updates
│   ├── portfolio.js      # Manages the player's portfolio (cash, stocks)
│   ├── ui.js             # Handles all DOM manipulation and UI updates
│   ├── scenario.js       # Loads and manages daily news events
│   ├── quiz.js           # Logic for the quiz section
│   ├── learning.js       # Logic for the learning center
│   ├── achievements.js   # Tracks and unlocks achievements
│   ├── components.js     # Loads reusable HTML components (navbar, footer)
│   └── audio.js          # Manages sound effects
├── 📂 components/
│   ├── navbar.html       # Reusable navbar
│   └── footer.html       # Reusable footer
├── index.html            # Main game page
├── learning.html         # Learning Center page
├── quiz.html             # Quiz page
└── ...                   # Other HTML pages (About, Privacy, etc.)

🚀 How to Run Locally
No complex setup is required! Because this project uses vanilla HTML, CSS, and JavaScript, you can run it directly in your browser.

Clone or download this repository to your local machine.

Open the index.html file in your web browser (like Chrome, Firefox, or Safari).

Start playing!

Happy investing!