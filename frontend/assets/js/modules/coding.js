const CodingModule = (function() {
    let editor = null;
    let currentProblem = null;

    const problems = [
        {
            id: 1,
            title: "Two Sum",
            difficulty: "Easy",
            acceptance: "52.3%",
            status: "solved", // solved, attempted, todo
            desc: "Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.<br><br>You may assume that each input would have exactly one solution, and you may not use the same element twice.",
            examples: [
                { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
                { input: "nums = [3,2,4], target = 6", output: "[1,2]" }
            ],
            constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
            boilerplate: {
                python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass",
                c_cpp: "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};",
                java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}",
                javascript: "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    \n};"
            }
        },
        {
            id: 2,
            title: "Reverse Linked List",
            difficulty: "Easy",
            acceptance: "76.1%",
            status: "todo",
            desc: "Given the <code>head</code> of a singly linked list, reverse the list, and return the reversed list.",
            examples: [
                { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]" },
                { input: "head = [1,2]", output: "[2,1]" }
            ],
            constraints: ["The number of nodes in the list is the range [0, 5000].", "-5000 <= Node.val <= 5000"],
            boilerplate: {
                python: "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass",
                c_cpp: "/**\n * Definition for singly-linked list.\n * ...\n */\nclass Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        \n    }\n};",
                java: "/**\n * Definition for singly-linked list.\n * ...\n */\nclass Solution {\n    public ListNode reverseList(ListNode head) {\n        \n    }\n}",
                javascript: "/**\n * Definition for singly-linked list.\n * ...\n */\nvar reverseList = function(head) {\n    \n};"
            }
        },
        {
            id: 3,
            title: "Longest Substring Without Repeating Characters",
            difficulty: "Medium",
            acceptance: "34.5%",
            status: "todo",
            desc: "Given a string <code>s</code>, find the length of the longest substring without repeating characters.",
            examples: [
                { input: 's = "abcabcbb"', output: "3" },
                { input: 's = "bbbbb"', output: "1" }
            ],
            constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
            boilerplate: {
                python: "class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass",
                c_cpp: "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};",
                java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        \n    }\n}",
                javascript: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};"
            }
        },
        {
            id: 4,
            title: "Median of Two Sorted Arrays",
            difficulty: "Hard",
            acceptance: "23.9%",
            status: "attempted",
            desc: "Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return the median of the two sorted arrays.<br><br>The overall run time complexity should be <code>O(log (m+n))</code>.",
            examples: [
                { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" },
                { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.50000" }
            ],
            constraints: ["nums1.length == m", "nums2.length == n", "0 <= m <= 1000", "0 <= n <= 1000", "1 <= m + n <= 2000"],
            boilerplate: {
                python: "class Solution:\n    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:\n        pass",
                c_cpp: "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};",
                java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        \n    }\n}",
                javascript: "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};"
            }
        }
    ];

    function init() {
        showLibrary();
        renderProblemList();
    }

    function setupEditor() {
        if (!document.getElementById('code-editor')) return;
        
        ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.7/');
        editor = ace.edit("code-editor");
        editor.setTheme("ace/theme/tomorrow_night_eighties");
        editor.session.setMode("ace/mode/python");
        editor.setOptions({
            fontSize: "14px",
            showPrintMargin: false,
            fontFamily: "monospace"
        });

        // Listen to language change
        const langSelect = document.getElementById('ide-language');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                const lang = e.target.value;
                editor.session.setMode(`ace/mode/${lang === 'c_cpp' ? 'c_cpp' : lang}`);
                if (currentProblem) {
                    editor.setValue(currentProblem.boilerplate[lang] || "", -1);
                }
            });
        }
    }

    function showLibrary() {
        document.getElementById('coding-library-view').classList.remove('d-none');
        document.getElementById('coding-library-view').classList.add('d-block');
        document.getElementById('coding-ide-view').classList.add('d-none');
        document.getElementById('coding-ide-view').classList.remove('d-flex');
    }

    function showIDE(problemId) {
        currentProblem = problems.find(p => p.id === problemId);
        if (!currentProblem) return;

        document.getElementById('coding-library-view').classList.add('d-none');
        document.getElementById('coding-library-view').classList.remove('d-block');
        document.getElementById('coding-ide-view').classList.remove('d-none');
        document.getElementById('coding-ide-view').classList.add('d-flex');

        // Populate Left Pane
        document.getElementById('ide-problem-title').textContent = currentProblem.title;
        document.getElementById('ide-desc-title').textContent = `${currentProblem.id}. ${currentProblem.title}`;
        document.getElementById('ide-desc-body').innerHTML = currentProblem.desc;
        
        const diffBadge = document.getElementById('ide-problem-difficulty');
        diffBadge.textContent = currentProblem.difficulty;
        diffBadge.className = `badge bg-opacity-10 border border-opacity-25 ${getDiffClasses(currentProblem.difficulty)}`;

        const examplesHtml = currentProblem.examples.map(ex => `
            <div class="p-3 rounded mb-3" style="background: #1e293b; font-family: monospace; font-size: 0.9rem;">
                <div class="text-muted">Input: <span class="text-white">${ex.input}</span></div>
                <div class="text-muted">Output: <span class="text-white">${ex.output}</span></div>
            </div>
        `).join('');
        document.getElementById('ide-desc-examples').innerHTML = examplesHtml;

        const constraintsHtml = currentProblem.constraints.map(c => `<li>${c}</li>`).join('');
        document.getElementById('ide-desc-constraints').innerHTML = constraintsHtml;

        // Reset Terminal
        document.getElementById('ide-terminal').innerHTML = `<div class="text-muted"><span class="text-primary">~</span> Ready to compile. Click "Run Code" or "Submit" to test your solution.</div>`;

        // Initialize Ace if needed
        if (!editor && typeof ace !== 'undefined') {
            setupEditor();
        }

        if (editor) {
            const langSelect = document.getElementById('ide-language');
            const lang = langSelect.value;
            editor.setValue(currentProblem.boilerplate[lang] || "", -1);
            editor.session.setMode(`ace/mode/${lang === 'c_cpp' ? 'c_cpp' : lang}`);
            
            // Force editor to recalculate its dimensions now that the container is visible
            setTimeout(() => {
                editor.resize();
            }, 50);
        }
    }

    function getDiffClasses(diff) {
        if (diff === 'Easy') return 'bg-success text-success border-success';
        if (diff === 'Medium') return 'bg-warning text-warning border-warning';
        return 'bg-danger text-danger border-danger';
    }

    function renderProblemList() {
        const tbody = document.getElementById('coding-problem-list');
        if (!tbody) return;

        tbody.innerHTML = problems.map(p => {
            let statusIcon = '';
            if (p.status === 'solved') statusIcon = '<i class="fa-solid fa-check text-success"></i>';
            else if (p.status === 'attempted') statusIcon = '<i class="fa-solid fa-rotate-right text-warning"></i>';

            const diffClasses = getDiffClasses(p.difficulty);

            return `
            <tr style="cursor: pointer;" onclick="CodingModule.showIDE(${p.id})">
                <td class="ps-4 fw-bold fs-5">${statusIcon}</td>
                <td class="fw-bold text-dark">${p.id}. ${p.title}</td>
                <td><span class="badge bg-opacity-10 border border-opacity-25 ${diffClasses}">${p.difficulty}</span></td>
                <td class="fw-medium">${p.acceptance}</td>
                <td class="pe-4 text-end">
                    <button class="btn btn-sm btn-outline-primary rounded-pill px-3">Solve</button>
                </td>
            </tr>
            `;
        }).join('');
    }

    function runCode() {
        const terminal = document.getElementById('ide-terminal');
        terminal.innerHTML = `<div class="text-warning"><i class="fa-solid fa-spinner fa-spin me-2"></i>Compiling code on remote server...</div>`;
        
        setTimeout(() => {
            terminal.innerHTML = `
                <div class="text-success fw-bold mb-2"><i class="fa-solid fa-check-circle me-2"></i>Compilation Successful!</div>
                <div class="text-white mb-1">Running against sample test cases...</div>
                <div class="p-2 rounded bg-dark border border-secondary border-opacity-50 mt-2 text-muted">
                    Test Case 1: <span class="text-success">Passed</span><br>
                    Test Case 2: <span class="text-success">Passed</span><br>
                </div>
                <div class="text-success mt-2">All sample test cases passed successfully! Runtime: 42ms.</div>
            `;
        }, 1500);
    }

    function submitCode() {
        const terminal = document.getElementById('ide-terminal');
        terminal.innerHTML = `<div class="text-primary"><i class="fa-solid fa-spinner fa-spin me-2"></i>Evaluating against hidden test cases...</div>`;
        
        setTimeout(() => {
            terminal.innerHTML = `
                <div class="text-success fs-5 fw-bold mb-2"><i class="fa-solid fa-trophy me-2 text-warning"></i>Accepted!</div>
                <div class="text-white mb-1">Your code passed all 125 test cases.</div>
                <div class="p-2 rounded bg-dark border border-secondary border-opacity-50 mt-2 text-muted">
                    Runtime: <span class="text-white fw-bold">38 ms</span>, faster than 82.41% of online submissions.<br>
                    Memory Usage: <span class="text-white fw-bold">14.2 MB</span>, less than 45.12% of submissions.
                </div>
            `;
            
            // Mark as solved
            if(currentProblem) currentProblem.status = 'solved';
            renderProblemList();
        }, 2000);
    }

    return {
        init,
        showLibrary,
        showIDE,
        runCode,
        submitCode
    };
})();
