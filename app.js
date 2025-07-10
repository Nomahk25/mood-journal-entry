const saveBtn = document.getElementById('saveEntry');
const journalEntry = document.getElementById('journalEntry');
const moodResult = document.getElementById('moodResult');
const entriesList = document.getElementById('entriesList');
const darkToggle = document.getElementById('darkModeToggle');
const themeIcon = document.getElementById('themeIcon');

// Simple word-based sentiment analysis
const positiveWords = ['happy', 'joy', 'love', 'excited', 'good', 'great', 'awesome', 'fantastic', 'smile', 'thankful'];
const negativeWords = ['sad', 'angry', 'bad', 'hate', 'terrible', 'upset', 'annoyed', 'depressed', 'worried', 'tired'];

// Set background image based on mood
function setMoodBackground(mood) {
  document.body.classList.remove('positive', 'neutral', 'negative');
  document.body.classList.add(mood);

  let bgImage = '';
  switch (mood) {
    case 'positive':
      bgImage = 'assets/bg-positive.jpg';
      break;
    case 'neutral':
      bgImage = 'assets/bg-neutral.jpg';
      break;
    case 'negative':
      bgImage = 'assets/bg-negative.jpg';
      break;
  }

  document.body.style.backgroundImage = `url('${bgImage}')`;
}

// Analyze mood using word matching
function analyzeSentiment(text) {
  text = text.toLowerCase();
  let posCount = 0, negCount = 0;

  positiveWords.forEach(word => {
    if (text.includes(word)) posCount++;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) negCount++;
  });

  if (posCount > negCount) return 'positive';
  else if (negCount > posCount) return 'negative';
  else return 'neutral';
}

// Save entry
function saveEntry() {
  const text = journalEntry.value.trim();
  if (!text) {
    alert('Please write something in your journal.');
    return;
  }

  const sentiment = analyzeSentiment(text);
  const date = new Date().toLocaleString();
  const entry = { text, sentiment, date };

  let entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
  entries.unshift(entry);
  localStorage.setItem('moodEntries', JSON.stringify(entries));

  journalEntry.value = '';
  displayMood(sentiment);
  renderEntries();
}

// Display mood and update background
function displayMood(sentiment) {
  const moodMessages = {
    positive: '😊 Positive Mood',
    neutral: '😐 Neutral Mood',
    negative: '☹️ Negative Mood'
  };

  moodResult.textContent = moodMessages[sentiment];
  setMoodBackground(sentiment);
}

// Render saved entries
function renderEntries() {
  const entries = JSON.parse(localStorage.getItem('moodEntries')) || [];
  entriesList.innerHTML = '';

  entries.forEach(entry => {
    const li = document.createElement('li');
    li.className = entry.sentiment;
    li.innerHTML = `<strong>${entry.date}</strong><br>${entry.text}`;
    entriesList.appendChild(li);
  });

  if (entries[0]) {
    displayMood(entries[0].sentiment); // Use latest mood for background
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeIcon.src = isDark ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
}

// Load dark mode on page load
function loadThemePreference() {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark');
    themeIcon.src = 'assets/icons/sun.svg';
  }
}

// Init
saveBtn.addEventListener('click', saveEntry);
darkToggle.addEventListener('click', toggleDarkMode);
loadThemePreference();
renderEntries();
