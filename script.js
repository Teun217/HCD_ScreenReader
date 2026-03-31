document.querySelectorAll('article h2, article h3, article span').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-roledescription', 'quote');
});

document.querySelectorAll('article span').forEach((span, index) => {
    span.id = `sentence${index + 1}`;
});

document.querySelectorAll('article span').forEach(span => {
    span.addEventListener('keydown', (e) => {
        if (e.key !== 'n') return;
        event.preventDefault(); 

        const note = document.createElement('div');
        note.className = 'note';
        note.dataset.for = span.id;

        const quote = document.createElement('blockquote');
        quote.textContent = span.textContent.trim();

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Write your note…';

        note.appendChild(quote);
        note.appendChild(textarea);

        document.getElementById('noteSection').appendChild(note);

        textarea.focus();
    });
});