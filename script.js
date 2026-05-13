
let lastFocusedSpan = null;
// Om op te slaan waar de focus naar terug moet als de gebruiker klaar is met het typen van de notities

const noteSection = document.querySelector('#noteSection');
// Selector voor de notities

document.querySelectorAll('h2, h3, header p').forEach(el => {
    el.setAttribute('tabindex', '0');
    el.removeAttribute('role');
    el.removeAttribute('aria-roledescription');
    el.setAttribute('role', 'none');
});
// Selecteert alle h2's, h3's en p's in de header en geeft atributes.

document.querySelectorAll('span').forEach(el => {
    el.setAttribute('role', 'paragraph');
});
// Poging tot het voorkomen van dat de screenreader "group" zegt aan het einde

function getShortQuote(text) {
    const words = text.trim().split(/\s+/);
    // trim: haalt whitespaces aan het begin en einde weg, split stopt individuele woorden in een array, \s haalt de whitespaces, "+" zorgt er voor dat meerdere whitespaces naast elkaar als een worden gezien. 
    if (words.length <= 4) return text.trim();
    // Als er minder dan 4 woorden in de zin zitten geeft de functie de hele zin terug
    return `${words.slice(0, 2).join(' ')} ... ${words.slice(-2).join(' ')}`;
    // Anders geeft de functie de eerste en laatste twee woorden met puntjes er tussen terug.
}
// !!! Functie geschreven door Claude, zelf uitgelegd wat de functie doet.

function getChapterTitle(span) {
    let chapterTitle = 'Unknown Chapter';
    // Standaard waarde voor chapterTitle
    let node = span;
    // Zet de start van het zoeken naar de titel op de huidige span

    while (node) {
    // Zolang er een node is om te checken
        let sibling = node.previousElementSibling;
        // Slaat vorige span op
        while (sibling) {
            if (sibling.tagName === 'H3') {
            // Checkt voor h3 element
                return sibling.textContent.trim();
                // Geeft textcontent terug
            }
            const innerH3 = sibling.querySelector('h3');
            if (innerH3) {
                return innerH3.textContent.trim();
            }
            // Als het element in de span een h3 is, geeft text content terug
            sibling = sibling.previousElementSibling;
            // Een sibling verder terug
        }
        node = node.parentElement;
    }

    return chapterTitle;
}

//vvv Functie voor het aanmaken van een notitie vvv
function createAnnotation(span) {
    const chapter = getChapterTitle(span);
    // Definieerd titel met de voorgaande functie
    
    const note = document.createElement('div');
    note.className = 'note';
    // creeert div met de class "note"
    note.dataset.for = span.id;
    // geeft een custom attribute aan span (zo worden de note en de span gelinkt)
    note.setAttribute('tabindex', '0');
    // maakt dat de note gefocussed kan worden met tab
    note.innerHTML = `
        <p>Note:</p>
        <p class="note-location" tabindex="0">Chapter: ${chapter}</p>
        <blockquote tabindex="0" aria-label="${span.textContent.trim()}">${getShortQuote(span.textContent)}</blockquote>
        <textarea placeholder="Write your note…" rows="1"></textarea>
        <div>
            <button class="note-save">Save</button>
            <button class="note-delete">Delete</button>
        </div>
    `;
    // html binnen de div met chaptername en quote uit tekst met aria

    noteSection.appendChild(note);
    // Insert de div daadwerkelijk in de notesectie

    const textarea = note.querySelector('textarea');
    const saveBtn = note.querySelector('.note-save');
    const deleteBtn = note.querySelector('.note-delete');
    // Selecteert elementen 

    note.addEventListener('keydown', (e) => {
        if (e.target !== note) return;
        if (e.key === 'Enter') {
            e.preventDefault();
            note.querySelector('.note-location').focus();
        } else if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            const next = note.nextElementSibling;
            if (next?.classList.contains('note')) next.focus();
        } else if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            const prev = note.previousElementSibling;
            if (prev?.classList.contains('note')) prev.focus();
        }
    });

    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
    textarea.focus();

    // Tab in textarea → jump to save button
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            saveBtn.focus();
        }
    });

    saveBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            deleteBtn.focus();
        } else if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            textarea.focus();
        }
    });

    saveBtn.addEventListener('click', () => span.focus());

    deleteBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            saveBtn.focus();
        }
    });

    deleteBtn.addEventListener('click', () => {
        note.remove();
        span.focus();
    });
}

// Set up all article spans
document.querySelectorAll('article span').forEach((span, index) => {
    span.id = `sentence${index + 1}`;
    span.setAttribute('tabindex', '0');
    span.removeAttribute('role');
    span.setAttribute('role', 'none');

    span.addEventListener('focus', () => {
        lastFocusedSpan = span;
    });

    span.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            const existing = noteSection.querySelector(`.note[data-for="${span.id}"] textarea`);
            if (existing) {
                existing.focus();
            } else {
                createAnnotation(span);
            }
        }
    });
});

function switchFocus() {
    if (noteSection.contains(document.activeElement)) {
        (lastFocusedSpan ?? document.querySelector('article span'))?.focus();
    } else {
        const firstNote = noteSection.querySelector('.note');
        if (firstNote) firstNote.focus();
    }
}

// Switch focus button
const switchBtn = document.createElement('button');
switchBtn.id = 'switchFocusBtn';
switchBtn.textContent = 'Switch focus';
switchBtn.setAttribute('tabindex', '0');
document.querySelector('main').appendChild(switchBtn);

switchBtn.addEventListener('click', switchFocus);

document.addEventListener('keydown', (e) => {
    if (e.key === '§') {
        e.preventDefault();
        noteSection.querySelector('p')?.focus();
    }
});
