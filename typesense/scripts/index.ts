import fs from "node:fs";
import path from "node:path";
import Typesense from "typesense";

const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  apiKey: "xyz", // Replace with your actual API key
  connectionTimeoutSeconds: 10,
});

async function createMovieRecommendationsPreset() {
  try {
    const response = await typesenseClient.presets().upsert("movie_recommendations", {
      value: {
        collection: "Movie",
        q: "*",
        exclude_fields: "user_embedding, item_embedding",
        personalization_model_id: "movie_personalization_model",
        personalization_type: "recommendation",
        personalization_user_field: "user_embedding",
        personalization_item_field: "item_embedding",
        personalization_event_name: "movie_click",
        personalization_n_events: 8,
        page: 1,
      },
    });
    console.log("Movie recommendations preset created successfully:", response);
  } catch (error) {
    console.error("Error creating movie recommendations preset:", error);
  }
}

async function createTvShowRecommendationsPreset() {
  try {
    const response = await typesenseClient.presets().upsert("tv_show_recommendations", {
      value: {
        q: "*",
        exclude_fields: "user_embedding, item_embedding",
        // @ts-ignore
        personalization_model_id: "movie_personalization_model",
        personalization_type: "recommendation",
        personalization_user_field: "user_embedding",
        personalization_item_field: "item_embedding",
        personalization_event_name: "tv_show_click",
        personalization_n_events: 8,
        page: 1,
      },
    });
    console.log("TV show recommendations preset created successfully:", response);
  } catch (error) {
    console.error("Error creating TV show recommendations preset:", error);
  }
}

async function checkPersonalizationModelExists(modelId: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:8108/personalization/models/${modelId}`, {
      method: "GET",
      headers: {
        "X-TYPESENSE-API-KEY": "xyz",
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`Personalization model ${modelId} already exists:`, result);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error checking if personalization model ${modelId} exists:`, error);
    return false;
  }
}

async function createPersonalizationModel() {
  try {
    const modelId = "movie_personalization_model";

    const modelExists = await checkPersonalizationModelExists(modelId);
    if (modelExists) {
      console.log(`Personalization model ${modelId} already exists, skipping creation.`);
      return;
    }

    const modelFilePath = path.resolve(process.cwd(), "20m.tar.gz");

    if (!fs.existsSync(modelFilePath)) {
      console.error(`Model file not found at ${modelFilePath}`);
      return;
    }

    const fileData = fs.readFileSync(modelFilePath);

    const response = await fetch(
      "http://localhost:8108/personalization/models?name=ts/tyrec-1&type=recommendation&collection=Movie&id=movie_personalization_model",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "X-TYPESENSE-API-KEY": "xyz", // Use explicit API key instead of process.env
        },
        body: fileData,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to create personalization model: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Personalization model created successfully:", result);
  } catch (error) {
    console.error("Error creating personalization model:", error);
  }
}

async function main() {
  try {
    await createPersonalizationModel();
    await createMovieRecommendationsPreset();
    await createTvShowRecommendationsPreset();

    console.log("All operations completed successfully!");
  } catch (error) {
    console.error("Error in main execution:", error);
  }
}

main();
