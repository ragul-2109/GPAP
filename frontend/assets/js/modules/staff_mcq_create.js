const StaffMCQCreate = (function() {
    function init() {
        const createTestForm = document.getElementById('createTestForm');
        if (createTestForm) {
            createTestForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const payload = {
                    title: document.getElementById('testTitle').value,
                    subject: document.getElementById('testSubject').value,
                    topic: document.getElementById('testTopic').value,
                    total_questions: parseInt(document.getElementById('testTotalQuestions').value),
                    total_marks: parseFloat(document.getElementById('testTotalMarks').value),
                    duration_minutes: parseInt(document.getElementById('testDuration').value),
                    passing_marks: parseFloat(document.getElementById('testPassingMarks').value) || 0,
                    negative_marking: parseFloat(document.getElementById('testNegativeMarking').value) || 0,
                    random_questions: document.getElementById('shuffleQuestions').checked,
                    random_options: document.getElementById('shuffleOptions').checked,
                    fullscreen_required: document.getElementById('requireFullscreen').checked,
                    allow_calculator: document.getElementById('allowCalculator').checked
                };
                
                try {
                    const res = await fetch('/api/tests/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: JSON.stringify(payload)
                    });
                    
                    if(res.ok) {
                        const data = await res.json();
                        const summary = document.getElementById('testSummaryContainer');
                        if (summary) {
                            summary.innerHTML = `
                                <div class="text-success mb-3"><i class="fa-solid fa-check-circle fa-3x"></i></div>
                                <h6>Test Created Successfully!</h6>
                                <div class="small text-muted mt-2">Test ID: ${data.id}</div>
                                <button class="btn btn-outline-primary btn-sm mt-3 w-100" onclick="alert('Assignment module loading...')">Assign to Batch</button>
                            `;
                        } else {
                            alert(`Test Created Successfully! Test ID: ${data.id}`);
                        }
                    } else {
                        alert('Failed to create test');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error creating test');
                }
            });
        }

        const bulkUploadForm = document.getElementById('bulkUploadForm');
        if (bulkUploadForm) {
            bulkUploadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fileInput = document.getElementById('questionFile');
                if (!fileInput.files.length) return;
                
                const formData = new FormData();
                formData.append('file', fileInput.files[0]);
                
                const statusDiv = document.getElementById('uploadStatus');
                statusDiv.innerHTML = '<div class="spinner-border text-primary spinner-border-sm" role="status"></div> Uploading...';
                
                try {
                    const res = await fetch('/api/questions/bulk-upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: formData
                    });
                    
                    if (res.ok) {
                        const data = await res.json();
                        statusDiv.innerHTML = `<div class="alert alert-success py-2 mb-0">${data.message}</div>`;
                    } else {
                        const err = await res.json();
                        statusDiv.innerHTML = `<div class="alert alert-danger py-2 mb-0">${err.detail || 'Upload failed'}</div>`;
                    }
                } catch (error) {
                    statusDiv.innerHTML = `<div class="alert alert-danger py-2 mb-0">Connection error</div>`;
                }
            });
        }
    }

    function downloadCSVTemplate() {
        const headers = ["Question", "Option A", "Option B", "Option C", "Option D", "Correct Answer", "Explanation", "Marks", "Difficulty", "Topic"];
        const exampleRow = [
            "What is the output of print(2**3)?",
            "5",
            "6",
            "8",
            "9",
            "C",
            "** is the exponentiation operator in Python.",
            "1",
            "Easy",
            "Python Basics"
        ];
        
        const csvContent = [
            headers.join(","),
            exampleRow.map(item => `"${item.replace(/"/g, '""')}"`).join(",") 
        ].join("\\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "GPAP_MCQ_Template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        init,
        downloadCSVTemplate
    };
})();
