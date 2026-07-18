const MCQModule = (function() {
    let currentCourse = null;
    let timerInterval = null;
    let timeLeft = 30 * 60; // 30 mins
    let userAnswers = {};

    const courses = [
        { id: 'python', title: 'Python Programming', image: '/static/assets/images/python_course.png', qCount: 25 },
        { id: 'dsa', title: 'Data Structures & Algorithms', image: '/static/assets/images/data_structures.png', qCount: 25 },
        { id: 'web', title: 'Web Development', image: '/static/assets/images/web_dev.png', qCount: 25 }
    ];

    // Mock Database
    const questionDB = {
        python: [
            { q: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], a: 1 },
            { q: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "Error"], a: 1 },
            { q: "Which of the following is mutable in Python?", options: ["Tuple", "String", "List", "Integer"], a: 2 },
            { q: "What does the 'len()' function do?", options: ["Returns type", "Returns length", "Calculates log", "None of the above"], a: 1 },
            { q: "How do you insert a single-line comment in Python?", options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"], a: 2 }
        ],
        dsa: [
            { q: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Tree", "Graph"], a: 1 },
            { q: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n)", "O(n^2)", "O(log n)"], a: 2 },
            { q: "Which of the following is a non-linear data structure?", options: ["Array", "Linked List", "Queue", "Tree"], a: 3 },
            { q: "What is the time complexity of searching in a Balanced Binary Search Tree?", options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"], a: 2 },
            { q: "In a min-heap, the root node contains the:", options: ["Maximum value", "Minimum value", "Median value", "None of the above"], a: 1 }
        ],
        web: [
            { q: "What does HTML stand for?", options: ["Hyper Text Preprocessor", "Hyper Text Markup Language", "Hyper Tool Multi Language", "Hyperlinks and Text Markup Language"], a: 1 },
            { q: "Which CSS property controls the text size?", options: ["font-style", "text-size", "font-size", "text-style"], a: 2 },
            { q: "Inside which HTML element do we put the JavaScript?", options: ["<script>", "<js>", "<javascript>", "<scripting>"], a: 0 },
            { q: "Which of the following is not a valid CSS display property?", options: ["flex", "grid", "inline-block", "float-block"], a: 3 },
            { q: "How do you call a function named 'myFunction' in JS?", options: ["call function myFunction()", "call myFunction()", "myFunction()", "execute myFunction()"], a: 2 }
        ]
    };

    function getQuestions(courseId) {
        let baseQs = questionDB[courseId] || questionDB['python'];
        let fullQs = [];
        for (let i = 0; i < 25; i++) {
            let src = baseQs[i % baseQs.length];
            // If we are looping past the base questions, just vary the text slightly to make 25 unique questions
            let qText = src.q;
            if (i >= baseQs.length) {
                qText = `(Scenario ${i+1}): ` + qText;
            }
            fullQs.push({
                id: i,
                q: qText,
                options: src.options,
                a: src.a
            });
        }
        return fullQs;
    }

    function init() {
        showState('selection');
        renderCourseGrid();
    }

    function showState(state) {
        ['selection', 'prestart', 'active', 'results'].forEach(s => {
            const el = document.getElementById(`mcq-state-${s}`);
            if(el) {
                el.classList.add('d-none');
                el.classList.remove('d-block');
            }
        });
        const activeEl = document.getElementById(`mcq-state-${state}`);
        if(activeEl) {
            activeEl.classList.remove('d-none');
            activeEl.classList.add('d-block');
        }
        
        // Scroll to top when state changes
        window.scrollTo(0,0);
    }

    function renderCourseGrid() {
        const grid = document.getElementById('mcq-course-grid');
        if (!grid) return;
        
        grid.innerHTML = courses.map(c => `
            <div class="col-md-6 col-lg-4">
                <div class="lux-card h-100 overflow-hidden border-0" style="cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: transform 0.2s;" onclick="MCQModule.selectCourse('${c.id}')">
                    <img src="${c.image}" class="w-100" style="height:150px; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&q=80'">
                    <div class="p-3">
                        <h5 class="brand mb-1">${c.title}</h5>
                        <p class="text-muted small mb-0">${c.qCount} Questions • 30 Mins</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function selectCourse(courseId) {
        currentCourse = courses.find(c => c.id === courseId);
        document.getElementById('prestart-title').textContent = currentCourse.title;
        showState('prestart');
    }

    function startTest() {
        userAnswers = {};
        timeLeft = 30 * 60;
        document.getElementById('active-test-title').textContent = currentCourse.title;
        renderQuestions();
        showState('active');
        
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    }

    function renderQuestions() {
        const container = document.getElementById('mcq-questions-container');
        const qs = getQuestions(currentCourse.id);
        
        container.innerHTML = qs.map((q, index) => `
            <div class="lux-card p-4 mb-4 border-0 shadow-sm" style="background: white;">
                <h6 class="fw-bold mb-3" style="color: #1e293b; font-size: 1.1rem;">${index + 1}. ${q.q}</h6>
                <div>
                    ${q.options.map((opt, oIndex) => `
                        <div class="form-check mb-2 p-3 rounded" style="cursor:pointer; background: #f8fafc; border: 1px solid #e2e8f0; transition: all 0.2s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'" onclick="document.getElementById('q${index}_o${oIndex}').click()">
                            <input class="form-check-input mt-1" type="radio" name="q${index}" id="q${index}_o${oIndex}" value="${oIndex}" onchange="MCQModule.recordAnswer(${index}, ${oIndex})">
                            <label class="form-check-label w-100 fw-medium ms-2" for="q${index}_o${oIndex}" style="cursor:pointer; color: #475569;">${opt}</label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
        updateProgress();
    }

    function recordAnswer(qIndex, oIndex) {
        userAnswers[qIndex] = oIndex;
        updateProgress();
    }

    function updateProgress() {
        const answered = Object.keys(userAnswers).length;
        const total = 25;
        const percent = (answered / total) * 100;
        document.getElementById('mcq-progress-bar').style.width = `${percent}%`;
    }

    function updateTimer() {
        if (timeLeft <= 0) {
            submitTest();
            return;
        }
        timeLeft--;
        const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const s = (timeLeft % 60).toString().padStart(2, '0');
        document.getElementById('mcq-timer').textContent = `${m}:${s}`;
        
        if(timeLeft <= 300) { // last 5 minutes
            document.getElementById('mcq-timer').classList.add('text-danger');
            document.getElementById('mcq-timer').classList.remove('text-dark');
        }
    }

    function submitTest() {
        clearInterval(timerInterval);
        
        const qs = getQuestions(currentCourse.id);
        let score = 0;
        qs.forEach((q, index) => {
            if (userAnswers[index] === q.a) score++;
        });

        const accuracy = Math.round((score / qs.length) * 100);
        
        document.getElementById('result-title').textContent = currentCourse.title;
        document.getElementById('result-score').textContent = `${score}/${qs.length}`;
        document.getElementById('result-accuracy').textContent = `${accuracy}%`;
        
        showState('results');
    }

    return {
        init,
        showState,
        selectCourse,
        startTest,
        recordAnswer,
        submitTest
    };
})();
