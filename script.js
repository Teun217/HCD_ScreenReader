document.querySelectorAll('article h2, article h3, article span').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-roledescription', 'quote');
});

// Set tabindex role and aria-roledescription on every h2 h3 and span

document.querySelectorAll('article span').forEach((span, index) => {
    span.id = `sentence${index + 1}`;
});

// Gives every span an id "sentenceX"

document.querySelectorAll('article span').forEach(span => {
    span.addEventListener('keydown', (e) => {
        if (e.key !== 'n') return;
        // Listens to keydown event
        e.preventDefault();

        const note = document.createElement('div');
        note.className = 'note';
        note.dataset.for = span.id;
        // Creates a div with class="note" and saves the span ID into a dataset

        const quote = document.createElement('blockquote');
        quote.textContent = span.textContent.trim();
        // Creates a blockquote element with the span as content.

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Write your note…';
        // Creates a textarea with "write your note as" a placeholder

        note.appendChild(quote);
        note.appendChild(textarea);
        // Puts the quote and textarea inside of the div

        document.getElementById('noteSection').appendChild(note);
        // Finds the noteSection and adds the note as a child to that section

        textarea.focus();
        //Sets focus on textarea

        textarea.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;
            e.preventDefault();
            // Stops default tab behaviour which is tabbing to the next element
            document.getElementById(note.dataset.for).focus();
            // Set's focus on the element that has the same ID as the dataset of the note
        });
    });
});