json.array!(@memories) do |memory|
  json.extract! memory, :id
  json.url memory_url(memory, format: :json)
end
