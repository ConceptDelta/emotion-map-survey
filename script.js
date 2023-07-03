const grid = document.querySelector('#color-grid');
const hues = [340, 330, 320, 310, 0, 280, 270, 260, 250];
const lightnesses = [50, 55, 60, 65, 70, 75, 80, 85, 90];

const rowValues = [4, 3, 2, 1, 0, -1, -2, -3, -4];
const columnValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

let previouslySelectedCell = null;
let selectionRecords = [];

lightnesses.forEach((lightness, rowIndex) => {
    hues.forEach((hue, colIndex) => {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        let saturation = 100;
        if (colIndex === 4 || rowIndex === 4) {
            saturation = 0;
        }
        cell.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        cell.addEventListener('click', function () {
            const participantID = document.getElementById('participant-id').value;
            const currentEmotion = document.getElementById('current-emotion').value;
            
            // Validate participant ID and current emotion
            if (!participantID || currentEmotion === "-1" || currentEmotion.trim() === "") {
                alert("Please enter a valid Participant ID and select a current emotion.");
                return;
            }
            
            if (previouslySelectedCell) {
                previouslySelectedCell.classList.remove('selected');
                previouslySelectedCell.style.backgroundColor = previouslySelectedCell.getAttribute('data-original-color');
            }
            
            if (previouslySelectedCell !== this) {
                this.classList.add('selected');
                this.setAttribute('data-original-color', this.style.backgroundColor);
                this.style.backgroundColor = 'lightgreen';
                previouslySelectedCell = this;

                const timestamp = new Date();
                selectionRecords.push({
                    "Valence (x)": columnValues[colIndex],
                    "Activation (y)": rowValues[rowIndex],
                    CurrentEmotion: currentEmotion,
                    timestamp: timestamp.toISOString()
                });
            } else {
                previouslySelectedCell = null;
            }
        });
        grid.appendChild(cell);
    });
});

document.getElementById('export-button').addEventListener('click', function () {
    const participantID = document.getElementById('participant-id').value;

    const csvContent = 'data:text/csv;charset=utf-8,' +
        'Participant ID,Valence (x),Activation (y),Current Emotion,timestamp\r\n' +
        selectionRecords.map(record => `${participantID},${record["Valence (x)"]},${record["Activation (y)"]},${record.CurrentEmotion},${record.timestamp}`).join('\r\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'emotion_map_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
