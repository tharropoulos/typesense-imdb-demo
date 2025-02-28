Typesense.configuration = {
  nodes: [{
    host: ENV["TYPESENSE_HOST"] || "localhost",
    port: ENV["TYPESENSE_PORT"] || 8108,
    protocol: ENV["TYPESENSE_PROTOCOL"] || "http",
  }],
  api_key: ENV["TYPESENSE_API_KEY"] || "xyz", # Replace with your actual API key
  connection_timeout_seconds: 2,
}
