Typesense.configuration = {
  nodes: [{
    host: ENV["TYPESENSE_HOST"] || "localhost",
    port: ENV["TYPESENSE_PORT"] || 8108,
    protocol: ENV["TYPESENSE_PROTOCOL"] || "http",
  }],
  api_key: ENV["TYPESENSE_API_KEY"] || "xyz",
  connection_timeout_seconds: 2000,
  retry_interval_seconds: 3,
  num_retries: 5,
  logger: Logger.new($stdout),
  log_level: Logger::DEBUG,
}
