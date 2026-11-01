const modeSelect = document.querySelector("#quiz-mode");
const questionCount = document.querySelector("#question-count");
const scoreLabel = document.querySelector("#score");
const questionType = document.querySelector("#question-type");
const questionHeading = document.querySelector("#question");
const feedback = document.querySelector("#feedback");
const answers = document.querySelector("#answers");
const nextButton = document.querySelector("#next-question");
const dataStatus = document.querySelector("#data-status");

let data;
let currentQuestion;
let questionNumber = 0;
let score = 0;

function validateData(value) {
  if (!value || !Array.isArray(value.provinces) || !Array.isArray(value.cities)) {
    throw new Error('Gebruik de velden "provinces" en "cities" als lijsten.');
  }

  if (value.provinces.length < 2) {
    throw new Error("Voeg minstens twee provincies met een hoofdstad toe.");
  }

  const provinces = new Map();
  for (const province of value.provinces) {
    if (
      typeof province.name !== "string" ||
      !province.name.trim() ||
      typeof province.capital !== "string" ||
      !province.capital.trim()
    ) {
      throw new Error("Elke provincie moet een naam en hoofdstad hebben.");
    }

    const key = normalize(province.name);
    if (provinces.has(key)) {
      throw new Error(`De provincie "${province.name}" staat meer dan één keer in het bestand.`);
    }
    provinces.set(key, province);
  }

  const capitals = new Set();
  for (const province of value.provinces) {
    const key = normalize(province.capital);
    if (capitals.has(key)) {
      throw new Error(`De hoofdstad "${province.capital}" komt meerdere keren voor.`);
    }
    capitals.add(key);
  }

  const cities = new Set();
  for (const city of value.cities) {
    if (typeof city.name !== "string" || !city.name.trim() || typeof city.province !== "string") {
      throw new Error("Elke stad moet een naam en de naam van een provincie hebben.");
    }

    const key = normalize(city.name);
    if (cities.has(key)) {
      throw new Error(`De stad "${city.name}" staat meer dan één keer in het bestand.`);
    }
    if (!provinces.has(normalize(city.province))) {
      throw new Error(`De provincie "${city.province}" van ${city.name} staat niet in de provincielijst.`);
    }
    cities.add(key);
  }

  return value;
}

function normalize(value) {
  return value.trim().toLocaleLowerCase("nl");
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function choicesFor(correct, options) {
  const distractors = options.filter((option) => normalize(option) !== normalize(correct));
  return shuffled([correct, ...shuffled(distractors).slice(0, 3)]);
}

function availableTypes() {
  return [
    ...(data.cities.length > 0 ? ["cities"] : []),
    "provinces",
  ];
}

function chooseType() {
  const available = availableTypes();
  const selected = modeSelect.value;
  if (selected !== "mixed") {
    return selected;
  }
  return available[Math.floor(Math.random() * available.length)];
}

function createQuestion() {
  const type = chooseType();
  if (type === "cities") {
    const city = data.cities[Math.floor(Math.random() * data.cities.length)];
    const correct = data.provinces.find(
      (province) => normalize(province.name) === normalize(city.province),
    ).name;
    return {
      type: "Stad",
      prompt: `In welke provincie ligt ${city.name}?`,
      correct,
      choices: choicesFor(correct, data.provinces.map((province) => province.name)),
    };
  }

  const province = data.provinces[Math.floor(Math.random() * data.provinces.length)];
  return {
    type: "Provincie",
    prompt: `Wat is de hoofdstad van ${province.name}?`,
    correct: province.capital,
    choices: choicesFor(
      province.capital,
      data.provinces.map((item) => item.capital),
    ),
  };
}

function renderQuestion() {
  currentQuestion = createQuestion();
  questionNumber += 1;
  questionCount.textContent = `Vraag ${questionNumber}`;
  scoreLabel.textContent = `${score} goed`;
  questionType.textContent = currentQuestion.type;
  questionHeading.textContent = currentQuestion.prompt;
  feedback.textContent = "";
  feedback.className = "feedback";
  nextButton.disabled = true;
  answers.replaceChildren();

  for (const choice of shuffled(currentQuestion.choices)) {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", () => selectAnswer(button, choice));
    answers.append(button);
  }
}

function selectAnswer(selectedButton, choice) {
  const isCorrect = normalize(choice) === normalize(currentQuestion.correct);
  if (isCorrect) {
    score += 1;
    feedback.textContent = "Helemaal goed!";
    feedback.classList.add("is-correct");
  } else {
    feedback.textContent = `Niet helemaal. Het goede antwoord is ${currentQuestion.correct}.`;
    feedback.classList.add("is-incorrect");
  }

  for (const button of answers.children) {
    button.disabled = true;
    if (normalize(button.textContent) === normalize(currentQuestion.correct)) {
      button.classList.add("is-correct");
    }
  }
  if (!isCorrect) {
    selectedButton.classList.add("is-incorrect");
  }

  scoreLabel.textContent = `${score} goed`;
  nextButton.disabled = false;
  nextButton.focus();
}

async function startQuiz() {
  try {
    const response = await fetch("./data/plaatsen.json");
    if (!response.ok) {
      throw new Error(`Het oefenbestand kon niet worden geladen (HTTP ${response.status}).`);
    }
    data = validateData(await response.json());

    if (data.cities.length === 0) {
      modeSelect.querySelector('option[value="cities"]').disabled = true;
      modeSelect.value = "provinces";
    }
    modeSelect.disabled = false;
    dataStatus.textContent = `${data.provinces.length} provincies en ${data.cities.length} steden geladen.`;
    renderQuestion();
  } catch (error) {
    questionHeading.textContent = "De oefenstof kon niet worden geladen.";
    dataStatus.textContent = error instanceof Error ? error.message : "Er is een onbekende fout opgetreden.";
    dataStatus.classList.add("is-error");
    throw error;
  }
}

modeSelect.addEventListener("change", () => {
  questionNumber = 0;
  score = 0;
  renderQuestion();
});
nextButton.addEventListener("click", renderQuestion);

startQuiz();
