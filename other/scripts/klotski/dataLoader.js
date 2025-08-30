// Load and export data from JSON file
export async function loadKlotskiData() {
    try {
        const response = await fetch('./scripts/klotski/data/klotski-data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading Klotski data:', error);
        throw error;
    }
}
