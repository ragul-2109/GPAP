const StudentDailyMCQ = (function() {
    
    // Mock Data simulating Backend fetched Daily Test
    const testInfo = {
        id: 101,
        title: "Daily Data Structures Test",
        durationMins: 30,
        questions: [
            { id: 1, prompt: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Tree", "Graph"] },
            { id: 2, prompt: "What is the time complexity of binary search?", options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"] },
            { id: 3, prompt: "Which of these is a non-linear data structure?", options: ["Array", "Linked List", "Stack", "Tree"] },
            { id: 4, prompt: "A queue follows which principle?", options: ["LIFO", "FIFO", "LILO", "Random"] },
            { id: 5, prompt: "What is a full binary tree?", options: ["Every node has 0 or 2 children", "All leaves are at same level", "Every node has 2 children", "None of the above"] }
        ]
    };

    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let answers = {};
    
    let timerInterval = null;
    let timeRemaining = 0;

    let cheatingLogs = [];
    
    function init() {
        // Shuffle questions uniquely for this session (simulating backend seed random)
        shuffledQuestions = [...testInfo.questions].sort(() => Math.random() - 0.5);
        
        // Shuffle options for each question
        shuffledQuestions.forEach(q => {
            q.options = [...q.options].sort(() => Math.random() - 0.5);
        });

        document.getElementById('dt-available-title').textContent = testInfo.title;
        document.getElementById('dt-player-title').textContent = testInfo.title;
    }

    function startTest() {
        document.getElementById('dt-dashboard').classList.add('d-none');
        document.getElementById('dt-player').classList.remove('d-none');
        
        setupProctoring();
        
        timeRemaining = testInfo.durationMins * 60;
        updateTimerDisplay();
        timerInterval = setInterval(timerTick, 1000);
        
        renderPalette();
        showQuestion(0);
        
        // Go fullscreen if possible
        if(document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(e => console.log(e));
        }
    }

    function timerTick() {
        if(timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitTest(true);
            return;
        }
        timeRemaining--;
        updateTimerDisplay();
    }

    function updateTimerDisplay() {
        const m = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
        const s = (timeRemaining % 60).toString().padStart(2, '0');
        const el = document.getElementById('dt-timer');
        el.textContent = `${m}:${s}`;
        if(timeRemaining < 300) el.classList.add('text-danger', 'animate__animated', 'animate__flash');
    }

    function showQuestion(index) {
        if(index < 0 || index >= shuffledQuestions.length) return;
        currentQuestionIndex = index;
        
        const q = shuffledQuestions[index];
        document.getElementById('dt-question-number').textContent = `Question ${index + 1} of ${shuffledQuestions.length}`;
        document.getElementById('dt-question-text').textContent = q.prompt;
        
        const optsContainer = document.getElementById('dt-options-container');
        optsContainer.innerHTML = q.options.map((opt, i) => {
            const isSelected = answers[q.id] === opt;
            return `
                <div class="p-3 border rounded ${isSelected ? 'bg-primary bg-opacity-10 border-primary' : 'bg-white'} cursor-pointer" 
                     onclick="StudentDailyMCQ.selectOption(${q.id}, '${opt}')">
                    <div class="form-check m-0">
                        <input class="form-check-input" type="radio" name="q${q.id}" id="q${q.id}_o${i}" ${isSelected ? 'checked' : ''}>
                        <label class="form-check-label w-100 cursor-pointer" for="q${q.id}_o${i}">
                            ${opt}
                        </label>
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById('btn-prev').disabled = (index === 0);
        document.getElementById('btn-next').disabled = (index === shuffledQuestions.length - 1);
        
        updatePaletteHighlights();
    }

    function selectOption(qId, opt) {
        answers[qId] = opt;
        showQuestion(currentQuestionIndex); // Re-render to show selected state
    }

    function prevQuestion() { showQuestion(currentQuestionIndex - 1); }
    function nextQuestion() { showQuestion(currentQuestionIndex + 1); }

    function renderPalette() {
        const palette = document.getElementById('dt-palette');
        palette.innerHTML = shuffledQuestions.map((q, i) => `
            <button class="btn btn-sm btn-outline-secondary" style="width:36px;" id="pal-${i}" onclick="StudentDailyMCQ.showQuestion(${i})">
                ${i + 1}
            </button>
        `).join('');
    }

    function updatePaletteHighlights() {
        shuffledQuestions.forEach((q, i) => {
            const btn = document.getElementById(`pal-${i}`);
            if(answers[q.id]) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-primary');
            }
            if(i === currentQuestionIndex) {
                btn.classList.add('border-dark', 'border-2');
            } else {
                btn.classList.remove('border-dark', 'border-2');
            }
        });
    }

    function setupProctoring() {
        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("copy", handleCopyPaste);
        document.addEventListener("paste", handleCopyPaste);
    }
    
    function stopProctoring() {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        document.removeEventListener("copy", handleCopyPaste);
        document.removeEventListener("paste", handleCopyPaste);
    }

    function handleVisibilityChange() {
        if(document.visibilityState === 'hidden') {
            logCheating('tab_switch', 'User switched tabs or minimized browser');
            alert("Warning: Tab switching is prohibited during the test. This has been logged.");
        }
    }

    function handleCopyPaste(e) {
        e.preventDefault();
        logCheating(e.type, `Attempted to ${e.type} text`);
        alert(`Warning: ${e.type} is disabled and monitored.`);
    }

    function logCheating(type, desc) {
        cheatingLogs.push({ type, desc, time: new Date().toISOString() });
        console.log("Logged:", type);
        // Simulate API call to /api/student/test/{id}/log-cheating
    }

    function submitTest(auto = false) {
        if(!auto) {
            const unanswered = shuffledQuestions.length - Object.keys(answers).length;
            if(unanswered > 0) {
                if(!confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) return;
            } else {
                if(!confirm("Are you sure you want to submit your test?")) return;
            }
        }
        
        clearInterval(timerInterval);
        stopProctoring();
        
        if(document.fullscreenElement) {
            document.exitFullscreen().catch(e => console.log(e));
        }

        // Simulate API Submit payload
        const payload = {
            testId: testInfo.id,
            answers: answers,
            timeTaken: testInfo.durationMins * 60 - timeRemaining,
            isAutoSubmit: auto,
            logs: cheatingLogs
        };
        console.log("Submitting:", payload);
        
        document.getElementById('dt-player').classList.add('d-none');
        document.getElementById('dt-results').classList.remove('d-none');
    }

    return {
        init,
        startTest,
        showQuestion,
        prevQuestion,
        nextQuestion,
        selectOption,
        submitTest
    };
})();
