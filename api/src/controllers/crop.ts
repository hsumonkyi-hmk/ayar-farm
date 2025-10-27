export class CropController {
    public static getCropTypes(): string[] {
        try {
            return ["Wheat", "Corn", "Rice", "Soybeans", "Barley", "Oats", "Sorghum", "Cotton", "Sugarcane", "Potatoes"];
        } catch (error) {
            console.error("Error fetching crop types:", error);
            return [];
        }
    }
}