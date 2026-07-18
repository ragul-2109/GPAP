const ResumeModule = (function () {

    // Mapping of input IDs to their corresponding preview IDs
    const fieldMappings = {
        'input-name': 'preview-name',
        'input-title': 'preview-title',
        'input-email': 'preview-email',
        'input-phone': 'preview-phone',
        'input-location': 'preview-location',
        'input-link': 'preview-link',
        'input-summary': 'preview-summary',
        'input-edu-school': 'preview-edu-school',
        'input-edu-degree': 'preview-edu-degree',
        'input-edu-year': 'preview-edu-year',
        'input-edu-grade': 'preview-edu-grade',
        'input-skills-lang': 'preview-skills-lang',
        'input-skills-tools': 'preview-skills-tools',
        'input-proj1-title': 'preview-proj1-title',
        'input-proj1-tech': 'preview-proj1-tech',
        'input-proj1-desc': 'preview-proj1-desc',
        'input-proj2-title': 'preview-proj2-title',
        'input-proj2-tech': 'preview-proj2-tech',
        'input-proj2-desc': 'preview-proj2-desc'
    };

    function init() {
        // Initialization if needed
    }

    // Called on every keystroke in the left pane inputs
    function updatePreview() {
        for (const [inputId, previewId] of Object.entries(fieldMappings)) {
            const inputEl = document.getElementById(inputId);
            const previewEl = document.getElementById(previewId);

            if (inputEl && previewEl) {
                // If input is empty, fallback to placeholder or a default dash
                let val = inputEl.value.trim();

                // For contact info, we might have icons, so we only replace the text node
                if (previewId === 'preview-email' || previewId === 'preview-phone' || previewId === 'preview-location' || previewId === 'preview-link') {
                    if (val === '') val = inputEl.placeholder;
                    // Preserve the FontAwesome icon inside the span
                    const iconHtml = previewEl.innerHTML.split('</i>')[0] + '</i>';
                    previewEl.innerHTML = iconHtml + val;
                } else {
                    if (val === '') val = inputEl.placeholder;
                    previewEl.textContent = val;
                }
            }
        }
    }

    // Simulate AI generation by filling inputs and updating preview
    function autoGenerate() {
        const mockData = {
            'input-name': 'Alex Johnson',
            'input-title': 'Full-Stack Developer',
            'input-email': 'alex.j@example.com',
            'input-phone': '+1 987 654 3210',
            'input-location': 'San Francisco, CA',
            'input-link': 'linkedin.com/in/alexj',
            'input-summary': 'Highly driven Full-Stack Developer with 2 years of academic and internship experience in building scalable microservices. Proficient in Python, React, and cloud deployments. Proven ability to optimize database queries and reduce load times.',

            'input-edu-school': 'Stanford University',
            'input-edu-degree': 'B.S. in Computer Science',
            'input-edu-year': '2025',
            'input-edu-grade': '3.9/4.0',

            'input-skills-lang': 'Python, JavaScript (ES6+), TypeScript, SQL, Java',
            'input-skills-tools': 'React, Node.js, Express, Docker, AWS (EC2, S3), Git, MongoDB, PostgreSQL',

            'input-proj1-title': 'Real-Time Collaborative Code Editor',
            'input-proj1-tech': 'React, Socket.io, Node.js, Redis',
            'input-proj1-desc': 'Engineered a web-based code editor allowing multiple users to edit the same file concurrently. Implemented Operational Transformation (OT) to resolve edit conflicts and utilized Redis for ultra-low latency document state caching.',

            'input-proj2-title': 'Smart Campus Navigation System',
            'input-proj2-tech': 'Python, Flask, React Native, Dijkstra Algorithm',
            'input-proj2-desc': 'Developed a mobile application providing shortest-path routing for university students. Integrated live campus shuttle tracking APIs, reducing average wait times by 15%.'
        };

        // Fill inputs
        for (const [inputId, value] of Object.entries(mockData)) {
            const inputEl = document.getElementById(inputId);
            if (inputEl) {
                inputEl.value = value;
            }
        }

        // Trigger visual update
        updatePreview();

        alert("AI successfully generated a professional profile based on your metrics!");
    }

    // Simulate PDF Download
    function downloadPDF() {
        const doc = document.getElementById('resume-preview-document');
        if (!doc) return;

        // In a real app, we would use window.print() or a library like html2pdf.js
        // For this frontend demo, we will trigger a print dialog if supported
        alert("Preparing PDF for download... (This will open your browser's Print Dialog, save as PDF)");
        window.print();
    }

    return {
        init,
        updatePreview,
        autoGenerate,
        downloadPDF
    };
})();
